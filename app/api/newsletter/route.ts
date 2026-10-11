import { NextResponse } from 'next/server';

import { clientIp, verifySubmission } from '@/lib/captcha';
import { fail, methodNotAllowed, ok, rateLimit, readJson, withErrorHandling } from '@/lib/api';
import { kvAppend, kvGet, kvSet, storageMode, subscriberKey } from '@/lib/kv';
import { sendMail, sendTeamNotification } from '@/lib/mail';
import { CONTACT } from '@/lib/site';
import { clean, isEmail, looksLikeBot, oneLine } from '@/lib/validation';

/**
 * POST /api/newsletter
 *
 * Stores a subscriber in Vercel KV and sends a welcome email with a one click
 * unsubscribe link.
 *
 * Two deliberate privacy choices, both mentioned in the Privacy Policy so the
 * code and the policy agree:
 *   - The KV key is a SHA-256 hash of the address, not the address itself.
 *   - The unsubscribe token is the same hash, so unsubscribe needs no lookup
 *     table and no personal data in the URL.
 */
export const dynamic = 'force-dynamic';
export const runtime = 'nodejs';

export const POST = withErrorHandling('api/newsletter', async (request: Request) => {
  const ip = clientIp(request.headers) ?? 'unknown';
  if (!rateLimit(`newsletter:${ip}`, 5, 60_000)) {
    return fail('Please wait a moment before subscribing again.', 429);
  }

  const parsed = await readJson(request);
  if ('response' in parsed) return parsed.response;
  const { body } = parsed;

  if (looksLikeBot(body)) {
    return ok({ message: 'You are on the list. Thank you.' });
  }

  const email = oneLine(body.email, 200).toLowerCase();
  if (!isEmail(email)) {
    return fail('That email address does not look right.', 422, {
      fields: { email: 'Check the address and try again.' },
    });
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
        error: 'Please complete the short security check so we know you are a person.',
      },
      { status: 428 },
    );
  }

  if (verdict.status === 'fail') {
    return fail(verdict.reason, 400);
  }

  const key = subscriberKey(email);
  const token = key.replace('subscriber:', '');

  try {
    const existing = await kvGet<{
      subscribedAt?: string;
      unsubscribedAt?: string;
      confirmed?: boolean;
    }>(key);

    /**
     * An unsubscribed record still exists: the unsubscribe route tombstones it
     * rather than deleting it, which is what stops a later import from adding the
     * address back. So "a record exists" is not the same as "subscribed", and
     * treating it that way would lock anyone who ever unsubscribed out of
     * re-subscribing. Only an active record short circuits here.
     */
    const active = Boolean(existing && !existing.unsubscribedAt && existing.confirmed !== false);
    if (active) {
      // Not an error. Saying "you are already subscribed" confirms the address to
      // anyone who guesses it, so the response is the same either way.
      return ok({ message: 'You are on the list. Look out for the next issue.' });
    }

    await kvSet(key, {
      email,
      subscribedAt: new Date().toISOString(),
      confirmed: true,
      source: 'website',
      unsubscribeToken: token,
      consentText:
        'Subscriber agreed to receive monthly decor inspiration and seasonal offers from Priscilla Events and Decor.',
      ip,
      userAgent: oneLine(request.headers.get('user-agent'), 300),
    });
    await kvAppend('subscriber:index', key, 5000);
  } catch (error) {
    console.error('[api/newsletter] storage failed:', error instanceof Error ? error.message : error);
    return fail('We could not add you to the list right now. Please try again shortly.', 503);
  }

  const unsubscribeUrl = `${process.env.NEXT_PUBLIC_SITE_URL ?? ''}/api/newsletter/unsubscribe?token=${token}`;

  const welcome = await sendMail({
    to: email,
    subject: 'Welcome to the Priscilla Events newsletter',
    text: [
      'Hello,',
      '',
      'Thank you for subscribing. You will hear from us once a month with decor inspiration,',
      'what is at its best in season, and the offers we only send to subscribers.',
      '',
      'We will never share your address, and you can leave with one click:',
      unsubscribeUrl,
      '',
      'Priscilla Events and Decor',
      CONTACT.studio.display,
      CONTACT.email,
    ].join('\n'),
    replyTo: process.env.EVENTS_TEAM_EMAIL ?? CONTACT.eventsEmail,
  });

  await sendTeamNotification({
    to: process.env.EVENTS_TEAM_EMAIL ?? CONTACT.eventsEmail,
    subject: 'New newsletter subscriber',
    reference: token.slice(0, 8).toUpperCase(),
    rows: [
      ['Email', email],
      ['Source', 'Website newsletter form'],
      ['Storage', storageMode()],
    ],
  });

  return ok({
    message: 'You are on the list. Look out for the next issue, and unsubscribe any time.',
    emailSent: welcome.sent,
  });
});

export function GET() {
  return methodNotAllowed(['POST']);
}
