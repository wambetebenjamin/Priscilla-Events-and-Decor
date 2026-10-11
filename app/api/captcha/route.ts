import { NextResponse } from 'next/server';

import { clientIp, verifySubmission, verifyV2, verifyV3 } from '@/lib/captcha';
import { fail, methodNotAllowed, ok, rateLimit, readJson, withErrorHandling } from '@/lib/api';
import { clean } from '@/lib/validation';

/**
 * POST /api/captcha
 *
 * The dedicated reCAPTCHA verification endpoint, kept separate because the brief
 * lists it as its own route and because it is genuinely useful: a client can
 * check a token before attaching it to a long form submission, and an operator can
 * confirm that the keys and the score threshold are actually working in a
 * deployed environment.
 *
 * It returns only whether a token passed, and the score. It never echoes the
 * secret, never returns Google's raw response, and never confirms whether a
 * particular site key exists.
 */
export const dynamic = 'force-dynamic';
export const runtime = 'nodejs';

export const POST = withErrorHandling('api/captcha', async (request: Request) => {
  const ip = clientIp(request.headers) ?? 'unknown';
  if (!rateLimit(`captcha:${ip}`, 30, 60_000)) {
    return fail('Too many verification attempts. Please wait a moment.', 429);
  }

  const parsed = await readJson(request);
  if ('response' in parsed) return parsed.response;
  const { body } = parsed;

  const v3Token = clean(body['recaptcha-response'], 4000) || null;
  const v2Token = clean(body['recaptcha-v2-response'], 4000) || null;
  /** Optional: force a specific verification mode. */
  const mode = clean(body.mode, 20);

  if (!v3Token && !v2Token) {
    return fail('Send either recaptcha-response or recaptcha-v2-response.', 422);
  }

  const verdict =
    mode === 'v3'
      ? await verifyV3(v3Token, ip)
      : mode === 'v2'
        ? await verifyV2(v2Token, ip)
        : await verifySubmission(v3Token, v2Token, ip);

  if (verdict.status === 'challenge') {
    return NextResponse.json(
      {
        ok: false,
        challenge: true,
        error: verdict.reason,
        score: verdict.score,
      },
      { status: 428 },
    );
  }

  if (verdict.status === 'fail') {
    return fail(verdict.reason, 400);
  }

  return ok({
    message: verdict.skipped
      ? 'Verified without a token because no secret key is configured in this environment.'
      : 'Verified.',
    score: verdict.score,
    skipped: verdict.skipped ?? false,
    note: verdict.reason ?? null,
  });
});

export function GET() {
  /**
   * A GET here reports configuration state only. It never reveals a key, and it
   * is the quickest way to confirm a deployment has its secrets wired up.
   */
  const threshold = Number.parseFloat(process.env.RECAPTCHA_SCORE_THRESHOLD ?? '0.5');
  return NextResponse.json(
    {
      ok: true,
      message: 'POST a token to verify it. This GET reports configuration state only.',
      configured: {
        v3Secret: Boolean(process.env.RECAPTCHA_SECRET_KEY),
        v3SiteKey: Boolean(process.env.NEXT_PUBLIC_RECAPTCHA_SITE_KEY),
        v2Secret: Boolean(process.env.RECAPTCHA_V2_SECRET_KEY),
        v2SiteKey: Boolean(process.env.NEXT_PUBLIC_RECAPTCHA_V2_SITE_KEY),
      },
      scoreThreshold: Number.isFinite(threshold) ? threshold : 0.5,
      action: 'php_email_form_submit',
      tokenField: 'recaptcha-response',
    },
    { status: 200, headers: { 'Cache-Control': 'no-store' } },
  );
}
