import { NextResponse } from 'next/server';

import { clientIp, verifySubmission } from '@/lib/captcha';
import { fail, methodNotAllowed, ok, rateLimit, readJson, withErrorHandling } from '@/lib/api';
import { kvAppend, kvSet } from '@/lib/kv';
import { makeReference } from '@/lib/reference';
import { sendClientConfirmation, sendTeamNotification } from '@/lib/mail';
import { confirmToClient, notifyTeam } from '@/lib/whatsapp';
import { CONTACT } from '@/lib/site';
import {
  clean,
  isEmail,
  isFutureDate,
  isValidKenyanPhone,
  looksLikeBot,
  normalisePhone,
  oneLine,
  prettyDate,
} from '@/lib/validation';

/**
 * POST /api/bridal
 *
 * The bridal consultation booking endpoint, separate from the general enquiry
 * route on purpose: wedding clients get a different team, a different email
 * alias and a different WhatsApp notification, so the two queues never mix.
 */
export const dynamic = 'force-dynamic';
export const runtime = 'nodejs';

export const POST = withErrorHandling('api/bridal', async (request: Request) => {
  const ip = clientIp(request.headers) ?? 'unknown';
  if (!rateLimit(`bridal:${ip}`, 6, 60_000)) {
    return fail('Please wait a moment before sending another request.', 429);
  }

  const parsed = await readJson(request);
  if ('response' in parsed) return parsed.response;
  const { body } = parsed;

  if (looksLikeBot(body)) {
    return ok({ message: 'Thank you. Your consultation request has been received.' });
  }

  const errors: Record<string, string> = {};

  const partnerOne = oneLine(body.partnerOne, 120);
  const partnerTwo = oneLine(body.partnerTwo, 120);
  if (!partnerOne) errors.partnerOne = 'Please add the first name.';
  if (!partnerTwo) errors.partnerTwo = 'Please add the second name.';

  const email = oneLine(body.email, 200).toLowerCase();
  if (!isEmail(email)) errors.email = 'That email address does not look right.';

  const rawPhone = oneLine(body.phone, 40);
  if (!isValidKenyanPhone(rawPhone)) {
    errors.phone = 'Enter a Kenyan mobile number, for example 0712 345 678.';
  }
  const phone = normalisePhone(rawPhone);

  const weddingDate = clean(body.weddingDate, 20);
  if (!isFutureDate(weddingDate)) errors.weddingDate = 'Please choose a future wedding date.';

  const venueConfirmed = clean(body.venueConfirmed, 10);
  if (!['yes', 'no'].includes(venueConfirmed)) {
    errors.venueConfirmed = 'Let us know whether the venue is confirmed.';
  }

  const venueName = oneLine(body.venueName, 160);
  if (venueConfirmed === 'yes' && !venueName) {
    errors.venueName = 'Which venue have you confirmed?';
  }

  const styleInspiration = clean(body.styleInspiration, 2000);
  if (styleInspiration.length < 20) {
    errors.styleInspiration = 'A sentence or two about the style you want helps us prepare.';
  }

  const consultationDate = clean(body.consultationDate, 20);
  if (!isFutureDate(consultationDate)) {
    errors.consultationDate = 'Please choose a future consultation date.';
  }

  const consultationPreference = oneLine(body.consultationPreference, 60);
  const guestCount = Number.parseInt(String(body.guestCount ?? ''), 10);

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
        error:
          'Please complete the short security check before we book this in. It keeps automated spam out of our bridal diary.',
      },
      { status: 428 },
    );
  }

  if (verdict.status === 'fail') {
    return fail(verdict.reason, 400);
  }

  const reference = makeReference('bridal');
  const coupleNames = `${partnerOne} and ${partnerTwo}`;

  const record = {
    reference,
    kind: 'bridal' as const,
    partnerOne,
    partnerTwo,
    coupleNames,
    email,
    phone,
    weddingDate,
    venueConfirmed,
    venueName: venueName || null,
    guestCount: Number.isFinite(guestCount) ? guestCount : null,
    styleInspiration,
    consultationDate,
    consultationPreference: consultationPreference || null,
    submittedAt: new Date().toISOString(),
    captchaScore: verdict.score,
    captchaSkipped: verdict.skipped ?? false,
    ip,
    userAgent: oneLine(request.headers.get('user-agent'), 300),
  };

  try {
    await kvSet(`bridal:${reference}`, record);
    await kvAppend('bridal:index', reference);
  } catch (error) {
    console.error('[api/bridal] storage failed:', error instanceof Error ? error.message : error);
    return fail(
      'We could not save your consultation request. Please try again, or message us on WhatsApp.',
      503,
    );
  }

  const summary = [
    `Couple: ${coupleNames}`,
    `Email: ${email}`,
    `Phone: ${phone}`,
    `Wedding date: ${prettyDate(weddingDate)}`,
    `Venue: ${venueConfirmed === 'yes' ? venueName : 'Not yet confirmed'}`,
    Number.isFinite(guestCount) ? `Guests: ${guestCount}` : '',
    `Consultation: ${prettyDate(consultationDate)}${consultationPreference ? `, ${consultationPreference}` : ''}`,
    `Style: ${styleInspiration.slice(0, 400)}`,
  ]
    .filter(Boolean)
    .join('\n');

  const [teamWhatsApp, teamEmail, clientEmail] = await Promise.all([
    notifyTeam({ reference, kind: 'bridal', summary, clientPhone: phone, clientName: coupleNames }),
    sendTeamNotification({
      to: process.env.BRIDAL_TEAM_EMAIL ?? CONTACT.bridalEmail,
      subject: `Bridal consultation request: ${coupleNames}, ${prettyDate(weddingDate)}`,
      reference,
      replyTo: email,
      rows: [
        ['Couple', coupleNames],
        ['Email', email],
        ['Phone', phone],
        ['Wedding date', prettyDate(weddingDate)],
        ['Venue', venueConfirmed === 'yes' ? (venueName || 'Stated confirmed, no name given') : 'Not yet confirmed'],
        ['Guests', Number.isFinite(guestCount) ? String(guestCount) : 'Not given'],
        ['Consultation date', prettyDate(consultationDate)],
        ['Preferred time', consultationPreference || 'No preference'],
        ['Style inspiration', styleInspiration],
      ],
    }),
    sendClientConfirmation({
      to: email,
      name: coupleNames,
      reference,
      eventType: 'Bridal consultation',
      eventDate: prettyDate(consultationDate),
      kind: 'bridal',
    }),
  ]);

  const clientWhatsApp = await confirmToClient({
    phone,
    name: partnerOne,
    reference,
    kind: 'bridal',
  });

  try {
    await kvSet(`bridal:${reference}`, {
      ...record,
      notifications: { teamWhatsApp, teamEmail, clientEmail, clientWhatsApp },
    });
  } catch {
    // Stored already. See the note in the enquiry route.
  }

  if (!teamEmail.sent) {
    console.warn(
      `[api/bridal] ${reference}: team email not sent. ${teamEmail.reason ?? 'Unknown reason.'}`,
    );
  }

  return ok({
    reference,
    message: `Thank you, ${partnerOne}. Your bridal consultation request is in, and your reference is ${reference}. We will confirm your appointment time shortly.`,
    whatsappConfirmation: clientWhatsApp.link ?? null,
    teamNotified: teamWhatsApp.sent,
    emailSent: clientEmail.sent,
  });
});

export function GET() {
  return methodNotAllowed(['POST']);
}
