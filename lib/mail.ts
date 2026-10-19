/**
 * Email, through Nodemailer.
 *
 * The variable names follow the shape the design source used in its own PHP mail
 * script, which the inventory recorded: to, from_name, from_email, subject, plus a
 * host, username, password and port SMTP block. The same four SMTP values are read
 * from the environment here and are never logged.
 *
 * If SMTP is not configured, sending is skipped and reported, so an enquiry is
 * still stored and still reaches the team on WhatsApp. Nothing is silently dropped.
 */

import nodemailer, { type Transporter } from 'nodemailer';

export type SendResult = {
  sent: boolean;
  skipped?: boolean;
  reason?: string;
  messageId?: string;
};

function smtpConfigured(): boolean {
  return Boolean(process.env.SMTP_HOST && process.env.SMTP_USER && process.env.SMTP_PASSWORD);
}

let cached: Transporter | null = null;

function transporter(): Transporter {
  if (cached) return cached;
  cached = nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port: Number.parseInt(process.env.SMTP_PORT ?? '587', 10),
    secure: process.env.SMTP_SECURE === 'true',
    auth: {
      user: process.env.SMTP_USER,
      pass: process.env.SMTP_PASSWORD,
    },
  });
  return cached;
}

export type MailInput = {
  to: string | string[];
  subject: string;
  /** Plain text body. Always send this, it is what survives every client. */
  text: string;
  /** Optional HTML body. */
  html?: string;
  replyTo?: string;
};

export async function sendMail(input: MailInput): Promise<SendResult> {
  if (!smtpConfigured()) {
    return {
      sent: false,
      skipped: true,
      reason: 'SMTP is not configured, so no email was sent. The enquiry is still stored.',
    };
  }

  const from =
    process.env.SMTP_FROM ?? 'Priscilla Events and Decor <hello@priscillaeventsanddecor.co.ke>';

  try {
    const info = await transporter().sendMail({
      from,
      to: Array.isArray(input.to) ? input.to.join(', ') : input.to,
      subject: input.subject,
      text: input.text,
      html: input.html,
      replyTo: input.replyTo ?? process.env.SMTP_REPLY_TO,
    });
    return { sent: true, messageId: info.messageId };
  } catch (error) {
    const reason = error instanceof Error ? error.message : 'Unknown SMTP failure.';
    return { sent: false, reason };
  }
}

/**
 * Confirmation email for a client, carrying their reference number. Written in
 * plain text first because that is what survives every mail client, with a light
 * HTML version alongside it.
 */
export async function sendClientConfirmation(params: {
  to: string;
  name: string;
  reference: string;
  eventType: string;
  eventDate?: string;
  packageName?: string;
  kind: 'enquiry' | 'bridal' | 'contact' | 'newsletter';
}): Promise<SendResult> {
  const { to, name, reference, eventType, eventDate, packageName, kind } = params;

  const subject =
    kind === 'bridal'
      ? `Your bridal consultation request, reference ${reference}`
      : `We have your enquiry, reference ${reference}`;

  const lines = [
    `Hello ${name},`,
    '',
    kind === 'bridal'
      ? 'Thank you for requesting a bridal consultation with Priscilla Events and Decor.'
      : 'Thank you for your enquiry to Priscilla Events and Decor.',
    '',
    `Your reference number is ${reference}. Please quote it in any message to us.`,
    '',
    `Event type: ${eventType}`,
  ];

  if (eventDate) lines.push(`Date: ${eventDate}`);
  if (packageName) lines.push(`Package of interest: ${packageName}`);

  lines.push(
    '',
    'Our team reviews every enquiry personally. We respond to all enquiries within 4 hours',
    'during working hours, and first thing the next morning for anything received overnight.',
    '',
    'If you would like to talk sooner, message the events team on WhatsApp:',
    'https://wa.me/254112272061',
    '',
    'Priscilla Events and Decor',
    'Kibagathi Road, Ngara, Nairobi',
    'hello@priscillaeventsanddecor.co.ke',
  );

  const text = lines.join('\n');
  const html = `<div style="font-family:Arial,Helvetica,sans-serif;font-size:15px;line-height:1.7;color:#2f3138">
${lines
  .map((line) => (line === '' ? '<br />' : `<p style="margin:0 0 10px">${line.replace(/</g, '&lt;')}</p>`))
  .join('\n')}
</div>`;

  return sendMail({ to, subject, text, html, replyTo: process.env.SMTP_REPLY_TO });
}

/** Internal notification to the team, kept terse so it reads on a phone. */
export async function sendTeamNotification(params: {
  to: string;
  subject: string;
  rows: [string, string][];
  reference: string;
  replyTo?: string;
}): Promise<SendResult> {
  const { to, subject, rows, reference, replyTo } = params;

  const text = [
    subject,
    `Reference: ${reference}`,
    '',
    ...rows.map(([label, value]) => `${label}: ${value}`),
    '',
    'Submitted through the website.',
  ].join('\n');

  return sendMail({ to, subject, text, replyTo });
}
