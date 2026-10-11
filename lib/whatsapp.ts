/**
 * WhatsApp.
 *
 * Two jobs, and they use different mechanisms on purpose.
 *
 * 1. The team is notified of every submission. When the WhatsApp Cloud API is
 *    configured this goes out as a real message. When it is not, the notification
 *    falls back to a pre-filled wa.me deep link that is stored with the record and
 *    returned to the route, so a lead can still be actioned from the dashboard
 *    without any credentials present.
 *
 * 2. The client is given a reference confirmation link they can tap. WhatsApp only
 *    permits free form outbound messages inside a 24 hour customer service window,
 *    so the confirmation is offered both as a link the client opens and, if a
 *    template has been configured, as a template message.
 *
 * Nothing here may run in the browser. The access token is read from the
 * environment and is never serialised into a response.
 */

import { CONTACT } from './site';

export type WhatsAppResult = {
  sent: boolean;
  method: 'cloud-api' | 'deep-link';
  link?: string;
  reason?: string;
};

function cloudConfigured(): boolean {
  return Boolean(process.env.WHATSAPP_ACCESS_TOKEN && process.env.WHATSAPP_PHONE_NUMBER_ID);
}

function apiBase(): string {
  const version = process.env.WHATSAPP_API_VERSION ?? 'v21.0';
  return `https://graph.facebook.com/${version}`;
}

/** Builds the click to chat link used by the floating button and every fallback. */
export function buildDeepLink(message: string, number?: string): string {
  const to = number ?? process.env.WHATSAPP_TEAM_NUMBER ?? CONTACT.whatsapp;
  return `https://wa.me/${to}?text=${encodeURIComponent(message)}`;
}

/**
 * Kenyan numbers are collected in local form, 0712 345 678, because that is how
 * people write them. WhatsApp wants E.164 digits with no plus and no leading
 * zero, so 254712345678. The Cloud API rejects the local form, so this conversion
 * is not cosmetic.
 */
export function toE164(phone: string): string {
  const digits = phone.replace(/\D/g, '');
  if (digits.startsWith('254')) return digits;
  if (digits.startsWith('0')) return `254${digits.slice(1)}`;
  return digits;
}

async function postMessage(payload: Record<string, unknown>): Promise<WhatsAppResult> {
  const phoneNumberId = process.env.WHATSAPP_PHONE_NUMBER_ID as string;
  const token = process.env.WHATSAPP_ACCESS_TOKEN as string;

  try {
    const res = await fetch(`${apiBase()}/${phoneNumberId}/messages`, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(payload),
      signal: AbortSignal.timeout(9000),
    });

    if (!res.ok) {
      const detail = await res.text().catch(() => '');
      return {
        sent: false,
        method: 'cloud-api',
        reason: `WhatsApp Cloud API returned ${res.status}. ${detail.slice(0, 240)}`,
      };
    }
    return { sent: true, method: 'cloud-api' };
  } catch (error) {
    return {
      sent: false,
      method: 'cloud-api',
      reason: error instanceof Error ? error.message : 'Unknown WhatsApp failure.',
    };
  }
}

/**
 * Notify the events team. Always returns a usable link, whether or not the API
 * is configured, so the caller can store it against the enquiry.
 */
export async function notifyTeam(params: {
  reference: string;
  kind: 'enquiry' | 'bridal' | 'contact' | 'newsletter';
  summary: string;
  /**
   * The client's number, when the form collected one. Given it, the fallback link
   * is addressed to the client so a stylist can tap it and be in the right chat
   * with the message already written. Without it the link addresses the studio,
   * which still carries the lead details but cannot start a reply.
   */
  clientPhone?: string;
  clientName?: string;
}): Promise<WhatsAppResult> {
  const { reference, kind, summary, clientPhone, clientName } = params;
  const teamNumber = process.env.WHATSAPP_TEAM_NUMBER ?? CONTACT.whatsapp;

  const label =
    kind === 'bridal'
      ? 'Bridal consultation request'
      : kind === 'contact'
        ? 'Website contact message'
        : kind === 'newsletter'
          ? 'Newsletter subscriber'
          : 'New event enquiry';

  const clientDigits = clientPhone ? toE164(clientPhone) : '';
  const reachableClient = clientDigits.length >= 11;
  const firstName = clientName?.split(' ')[0] ?? 'there';

  const body = `${label}\nReference: ${reference}\n${summary}`;
  const link = reachableClient
    ? buildDeepLink(
        `Hello ${firstName}, this is Priscilla Events and Decor following up on your message, reference ${reference}.`,
        clientDigits,
      )
    : buildDeepLink(body, teamNumber);

  if (!cloudConfigured()) {
    return {
      sent: false,
      method: 'deep-link',
      link,
      reason: 'WHATSAPP_ACCESS_TOKEN or WHATSAPP_PHONE_NUMBER_ID is not configured.',
    };
  }

  const template = process.env.WHATSAPP_TEMPLATE_ENQUIRY;
  if (template) {
    const result = await postMessage({
      messaging_product: 'whatsapp',
      to: teamNumber,
      type: 'template',
      template: {
        name: template,
        language: { code: 'en' },
        components: [
          {
            type: 'body',
            parameters: [
              { type: 'text', text: label },
              { type: 'text', text: reference },
            ],
          },
        ],
      },
    });
    if (result.sent) return { ...result, link };
    // Fall through to free form, which works inside an open service window.
    const retry = await postMessage({
      messaging_product: 'whatsapp',
      to: teamNumber,
      type: 'text',
      text: { preview_url: false, body },
    });
    return { ...retry, link, reason: retry.sent ? undefined : (retry.reason ?? result.reason) };
  }

  const result = await postMessage({
    messaging_product: 'whatsapp',
    to: teamNumber,
    type: 'text',
    text: { preview_url: false, body },
  });
  return { ...result, link };
}

/**
 * Give the client their reference number.
 *
 * The link handed back is deliberately addressed to the studio, not to the client.
 * A wa.me link opens a chat in whoever taps it, so a link pointing at the client's
 * own number would open a chat with themselves, which is useless. Addressed to the
 * studio with the reference already written, it is a one tap way for the client to
 * pick the conversation back up, and the studio receives a message that carries the
 * reference number.
 *
 * The outbound template message, when one is configured, does go to the client,
 * because that is a message and not a link.
 */
export async function confirmToClient(params: {
  phone: string;
  name: string;
  reference: string;
  kind: 'enquiry' | 'bridal' | 'contact';
}): Promise<WhatsAppResult> {
  const { phone, name, reference, kind } = params;

  const clientNumber = toE164(phone);
  const teamNumber = process.env.WHATSAPP_TEAM_NUMBER ?? CONTACT.whatsapp;

  const message =
    kind === 'bridal'
      ? `Hello Priscilla Events and Decor, ${name} here. My bridal consultation reference is ${reference}.`
      : `Hello Priscilla Events and Decor, ${name} here. My enquiry reference is ${reference}.`;

  const link = buildDeepLink(message, teamNumber);

  if (!cloudConfigured()) {
    return {
      sent: false,
      method: 'deep-link',
      link,
      reason: 'WhatsApp Cloud API is not configured.',
    };
  }

  const template = process.env.WHATSAPP_TEMPLATE_CONFIRMATION;
  if (!template) {
    return {
      sent: false,
      method: 'deep-link',
      link,
      reason:
        'No confirmation template is configured. Outside WhatsApp 24 hour messaging rules, free form messages are not allowed, so the reference is offered as a link and sent by email instead.',
    };
  }

  const result = await postMessage({
    messaging_product: 'whatsapp',
    to: clientNumber,
    type: 'template',
    template: {
      name: template,
      language: { code: 'en' },
      components: [
        {
          type: 'body',
          parameters: [
            { type: 'text', text: name },
            { type: 'text', text: reference },
          ],
        },
      ],
    },
  });

  return { ...result, link };
}

export function whatsappConfigured(): boolean {
  return cloudConfigured();
}
