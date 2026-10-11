import { NextResponse } from 'next/server';

import { clientIp, verifySubmission } from '@/lib/captcha';
import { fail, methodNotAllowed, ok, rateLimit, readJson, withErrorHandling } from '@/lib/api';
import { kvAppend, kvSet } from '@/lib/kv';
import { makeReference } from '@/lib/reference';
import { sendMail, sendTeamNotification } from '@/lib/mail';
import { notifyTeam } from '@/lib/whatsapp';
import { CONTACT } from '@/lib/site';
import {
  clean,
  isEmail,
  isValidKenyanPhone,
  looksLikeBot,
  normalisePhone,
  oneLine,
} from '@/lib/validation';

/**
 * POST /api/contact
 *
 * The general contact form. Sends through Nodemailer as the brief specifies,
 * stores the message in Vercel KV, and notifies the team on WhatsApp. The team
 * reply address is set to the sender, so replying from the inbox goes straight
 * back to the client.
 */
export const dynamic = 'force-dynamic';
export const runtime = 'nodejs';

export const POST = withErrorHandling('api/contact', async (request: Request) => {
  const ip = clientIp(request.headers) ?? 'unknown';
  if (!rateLimit(`contact:${ip}`, 6, 60_000)) {
    return fail('Please wait a moment before sending another message.', 429);
  }

  const parsed = await readJson(request);
  if ('response' in parsed) return parsed.response;
  const { body } = parsed;

  if (looksLikeBot(body)) {
    return ok({ message: 'Thank you. Your message has been received.' });
  }

  const errors: Record<string, string> = {};

  const name = oneLine(body.name, 120);
  if (!name) errors.name = 'What should we call you?';

  const email = oneLine(body.email, 200).toLowerCase();
  if (!isEmail(email)) errors.email = 'That email address does not look right.';

  const rawPhone = oneLine(body.phone, 40);
  if (rawPhone && !isValidKenyanPhone(rawPhone)) {
    errors.phone = 'Enter a Kenyan mobile number, for example 0712 345 678.';
  }
  const phone = rawPhone ? normalisePhone(rawPhone) : '';

  const subject = oneLine(body.subject, 200);
  if (!subject) errors.subject = 'Add a short subject line.';

  const message = clean(body.message, 2000);
  if (message.length < 10) errors.message = 'A sentence or two is enough.';

  if (body.consent !== true) {
    errors.consent = 'Please confirm you agree to our Privacy Policy.';
  }

  if (Object.keys(errors).length > 0) {
    return fail('Please check the highlighted fields and try again.', 422, { fields: errors });
  }

  const verdict = await verifySubmission(
    clean(body['recaptcha-response'], 4000) || null,
    clean(body['recaptcha-v2-response'], 4000) || null,
    ip,
  );

  if (verdict.status === 'challenge') {
    return NextResponse.json(
      {
        ok: false,
        challenge: true,
        error: 'Please complete the short security check before sending. It keeps spam out of our inbox.',
      },
      { status: 428 },
    );
  }

  if (verdict.status === 'fail') {
    return fail(verdict.reason, 400);
  }

  const reference = makeReference('contact');
  const eventType = oneLine(body.eventType, 60);
  const referral = oneLine(body.referral, 120);

  const record = {
    reference,
    kind: 'contact' as const,
    name,
    email,
    phone,
    subject,
    eventType: eventType || null,
    referral: referral || null,
    message,
    consent: true,
    consentAt: new Date().toISOString(),
    submittedAt: new Date().toISOString(),
    captchaScore: verdict.score,
    captchaSkipped: verdict.skipped ?? false,
    ip,
    userAgent: oneLine(request.headers.get('user-agent'), 300),
  };

  try {
    await kvSet(`contact:${reference}`, record);
    await kvAppend('contact:index', reference);
  } catch (error) {
    console.error('[api/contact] storage failed:', error instanceof Error ? error.message : error);
  }

  const teamEmail = await sendTeamNotification({
    to: process.env.EVENTS_TEAM_EMAIL ?? CONTACT.eventsEmail,
    subject: `Website message: ${subject}`,
    reference,
    replyTo: email,
    rows: [
      ['Name', name],
      ['Email', email],
      ['Phone', phone || 'Not given'],
      ['Event type', eventType || 'Not given'],
      ['Heard about us', referral || 'Not given'],
      ['Message', message],
    ],
  });

  // A short acknowledgement to the client, so nobody is left wondering.
  const clientEmail = await sendMail({
    to: email,
    subject: `We have your message, reference ${reference}`,
    replyTo: process.env.EVENTS_TEAM_EMAIL ?? CONTACT.eventsEmail,
    text: [
      `Hello ${name},`,
      '',
      'Thank you for writing to Priscilla Events and Decor. Your message is with our team.',
      '',
      `Your reference is ${reference}. Please quote it if you contact us again.`,
      '',
      'What you sent us:',
      subject,
      message.slice(0, 400),
      '',
      CONTACT.responsePromise,
      '',
      'Priscilla Events and Decor',
      CONTACT.studio.display,
      CONTACT.email,
    ].join('\n'),
  });

  const teamWhatsApp = await notifyTeam({
    reference,
    kind: 'contact',
    summary: [`From: ${name} (${email})`, `Subject: ${subject}`, `Message: ${message.slice(0, 400)}`].join(
      '\n',
    ),
    // Contact phone is optional on this form, so the link only addresses the
    // client when one was actually given.
    clientPhone: phone || undefined,
    clientName: name,
  });

  try {
    await kvSet(`contact:${reference}`, {
      ...record,
      notifications: { teamEmail, clientEmail, teamWhatsApp },
    });
  } catch {
    // Already stored.
  }

  if (!teamEmail.sent) {
    console.warn(
      `[api/contact] ${reference}: team email not sent. ${teamEmail.reason ?? 'Unknown reason.'}`,
    );
  }

  return ok({
    reference,
    message: `Thank you, ${name.split(' ')[0]}. Your message is with the team and your reference is ${reference}.`,
    teamNotified: teamWhatsApp.sent,
    emailSent: teamEmail.sent,
  });
});

export function GET() {
  return methodNotAllowed(['POST']);
}
