import { NextResponse } from 'next/server';

import {
  clientIp,
  verifySubmission,
} from '@/lib/captcha';
import { fail, methodNotAllowed, ok, rateLimit, readJson, withErrorHandling } from '@/lib/api';
import { kvAppend, kvSet } from '@/lib/kv';
import { makeReference } from '@/lib/reference';
import { sendClientConfirmation, sendTeamNotification } from '@/lib/mail';
import { confirmToClient, notifyTeam } from '@/lib/whatsapp';
import { CONTACT, EVENT_TYPES, BUDGET_BANDS } from '@/lib/site';
import { getPackage } from '@/lib/packages';
import {
  clean,
  isEmail,
  isFutureDate,
  isPositiveInt,
  isValidKenyanPhone,
  looksLikeBot,
  normalisePhone,
  oneLine,
  prettyDate,
} from '@/lib/validation';

/**
 * POST /api/enquiry
 *
 * The event enquiry and package booking endpoint. In order, it:
 *   1  checks the method, the rate limit and the honeypot
 *   2  validates and sanitises every field
 *   3  verifies reCAPTCHA v3 server side, asking for the v2 fallback below 0.5
 *   4  writes the enquiry to Vercel KV
 *   5  notifies the events team on WhatsApp
 *   6  emails the client a confirmation carrying their reference number
 *
 * A failure in any one of steps 4 to 6 does not lose the enquiry: the record is
 * written first, and the notification results are stored alongside it and
 * returned in the response so the situation is visible rather than silent.
 */

export const dynamic = 'force-dynamic';
export const runtime = 'nodejs';

export const POST = withErrorHandling('api/enquiry', async (request: Request) => {
  const ip = clientIp(request.headers) ?? 'unknown';
  if (!rateLimit(`enquiry:${ip}`, 6, 60_000)) {
    return fail(
      'That is a lot of enquiries in a short time. Please wait a minute, or message us on WhatsApp.',
      429,
    );
  }

  const parsed = await readJson(request);
  if ('response' in parsed) return parsed.response;
  const { body } = parsed;

  if (looksLikeBot(body)) {
    // Answer exactly as a success. A bot learns nothing from being told no.
    return ok({ message: 'Thank you. Your enquiry has been received.' });
  }

  /* -------------------------------------------------------------- validate */
  const fields: Record<string, string> = {};
  const errors: Record<string, string> = {};

  const eventType = clean(body.eventType, 60);
  if (!EVENT_TYPES.some((type) => type.value === eventType)) {
    errors.eventType = 'Choose the kind of event you are planning.';
  }

  const eventDate = clean(body.eventDate, 20);
  if (!isFutureDate(eventDate)) {
    errors.eventDate = 'Please give us a date in the future.';
  }

  const venueName = oneLine(body.venueName, 160);
  if (!venueName) errors.venueName = 'Which venue are you considering?';

  const venueAddress = oneLine(body.venueAddress, 200);
  if (!venueAddress) errors.venueAddress = 'A town or area is enough for now.';

  const guests = Number.parseInt(String(body.guests ?? ''), 10);
  if (!isPositiveInt(guests, 1, 5000)) {
    errors.guests = 'Give us a number of guests between 1 and 5000.';
  }

  const setting = clean(body.setting, 20);
  if (!['indoor', 'outdoor'].includes(setting)) {
    errors.setting = 'Choose indoor or outdoor.';
  }

  const services = Array.isArray(body.services)
    ? (body.services as unknown[]).map((item) => oneLine(item, 80)).filter(Boolean).slice(0, 20)
    : [];
  if (services.length === 0) {
    errors.services = 'Choose at least one service so we can quote accurately.';
  }

  const budget = clean(body.budget, 40);
  if (!BUDGET_BANDS.some((band) => band.value === budget)) {
    errors.budget = 'Choose a budget range, or tell us you are not sure yet.';
  }

  const packagePreference = clean(body.packagePreference, 40);

  const name = oneLine(body.name, 120);
  if (!name) errors.name = 'What should we call you?';

  const email = oneLine(body.email, 200).toLowerCase();
  if (!isEmail(email)) errors.email = 'That email address does not look right.';

  const rawPhone = oneLine(body.phone, 40);
  if (!isValidKenyanPhone(rawPhone)) {
    errors.phone = 'Enter a Kenyan mobile number, for example 0712 345 678.';
  }
  const phone = normalisePhone(rawPhone);

  const referral = oneLine(body.referral, 120);
  if (!referral) errors.referral = 'Let us know how you found us.';

  const notes = clean(body.notes, 2000);

  if (Object.keys(errors).length > 0) {
    return fail('Please check the highlighted fields and try again.', 422, { fields: errors });
  }

  /* --------------------------------------------------------------- captcha */
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
          'Please complete the short security check before we send this. It keeps automated spam out of our enquiry inbox.',
      },
      { status: 428 },
    );
  }

  if (verdict.status === 'fail') {
    return fail(verdict.reason, 400);
  }

  /* ----------------------------------------------------------------- store */
  const reference = makeReference('enquiry');
  const packageInfo = getPackage(packagePreference);
  const eventTypeLabel = EVENT_TYPES.find((type) => type.value === eventType)?.label ?? eventType;
  const budgetLabel = BUDGET_BANDS.find((band) => band.value === budget)?.label ?? budget;

  const record = {
    reference,
    kind: 'enquiry' as const,
    eventType,
    eventTypeLabel,
    eventDate,
    venueName,
    venueAddress,
    guests,
    setting,
    services,
    budget,
    budgetLabel,
    packagePreference: packagePreference || null,
    packageName: packageInfo?.name ?? null,
    name,
    email,
    phone,
    referral,
    notes,
    submittedAt: new Date().toISOString(),
    captchaScore: verdict.score,
    captchaSkipped: verdict.skipped ?? false,
    ip,
    userAgent: oneLine(request.headers.get('user-agent'), 300),
  };

  try {
    await kvSet(`enquiry:${reference}`, record);
    await kvAppend('enquiry:index', reference);
  } catch (error) {
    console.error('[api/enquiry] storage failed:', error instanceof Error ? error.message : error);
    return fail(
      'We could not save your enquiry. Please try again, or message us on WhatsApp and we will take your details directly.',
      503,
    );
  }

  /* ----------------------------------------------------------- notifications */
  const summary = [
    `Name: ${name}`,
    `Email: ${email}`,
    `Phone: ${phone}`,
    `Event: ${eventTypeLabel}`,
    `Date: ${prettyDate(eventDate)}`,
    `Venue: ${venueName}, ${venueAddress}`,
    `Guests: ${guests}`,
    `Setting: ${setting}`,
    `Services: ${services.join(', ')}`,
    `Budget: ${budgetLabel}`,
    `Package: ${packageInfo?.name ?? 'No preference'}`,
    `Heard about us: ${referral}`,
    notes ? `Notes: ${notes.slice(0, 400)}` : '',
  ]
    .filter(Boolean)
    .join('\n');

  const [teamWhatsApp, teamEmail, clientEmail] = await Promise.all([
    notifyTeam({ reference, kind: 'enquiry', summary, clientPhone: phone, clientName: name }),
    sendTeamNotification({
      to: process.env.EVENTS_TEAM_EMAIL ?? CONTACT.eventsEmail,
      subject: `New event enquiry: ${eventTypeLabel}, ${prettyDate(eventDate)}`,
      reference,
      replyTo: email,
      rows: [
        ['Name', name],
        ['Email', email],
        ['Phone', phone],
        ['Event type', eventTypeLabel],
        ['Date', prettyDate(eventDate)],
        ['Venue', `${venueName}, ${venueAddress}`],
        ['Guests', String(guests)],
        ['Setting', setting],
        ['Services', services.join(', ')],
        ['Budget', budgetLabel],
        ['Package', packageInfo?.name ?? 'No preference'],
        ['Heard about us', referral],
        ['Notes', notes || 'None'],
      ],
    }),
    sendClientConfirmation({
      to: email,
      name,
      reference,
      eventType: eventTypeLabel,
      eventDate: prettyDate(eventDate),
      packageName: packageInfo?.name,
      kind: 'enquiry',
    }),
  ]);

  const clientWhatsApp = await confirmToClient({
    phone,
    name,
    reference,
    kind: 'enquiry',
  });

  // Record what actually went out, so a failed notification is not invisible.
  try {
    await kvSet(`enquiry:${reference}`, {
      ...record,
      notifications: { teamWhatsApp, teamEmail, clientEmail, clientWhatsApp },
    });
  } catch {
    // The enquiry itself is already stored. Losing the notification audit is
    // worth less than failing the client's submission.
  }

  if (teamEmail.skipped || !teamEmail.sent) {
    console.warn(
      `[api/enquiry] ${reference}: team email not sent. ${teamEmail.reason ?? 'Unknown reason.'}`,
    );
  }
  if (!teamWhatsApp.sent) {
    console.info(
      `[api/enquiry] ${reference}: WhatsApp not sent, deep link available. ${teamWhatsApp.reason ?? ''}`,
    );
  }

  return ok({
    reference,
    message: `Thank you, ${name.split(' ')[0]}. Your enquiry is with the events team and your reference is ${reference}. ${CONTACT.responsePromise}`,
    // The client can be handed the WhatsApp confirmation link even when the Cloud
    // API is not configured, which is the normal case before launch.
    whatsappConfirmation: clientWhatsApp.link ?? null,
    teamNotified: teamWhatsApp.sent,
    emailSent: clientEmail.sent,
  });
});

export function GET() {
  return methodNotAllowed(['POST']);
}
