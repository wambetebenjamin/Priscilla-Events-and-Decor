/**
 * reCAPTCHA verification, server side only.
 *
 * The contract is taken from the design source's own validator,
 * assets/vendor/php-email-form/validate.js v3.10, which the inventory recorded
 * verbatim:
 *
 *   let recaptcha = thisForm.getAttribute('data-recaptcha-site-key');
 *   grecaptcha.execute(recaptcha, {action: 'php_email_form_submit'})
 *     .then(token => { formData.set('recaptcha-response', token); ... })
 *
 * So the client keeps the data-recaptcha-site-key attribute, the action name and
 * the recaptcha-response field name, and this module is the other half that the
 * source never shipped. The secret key is read from the environment here and
 * nowhere else, and never reaches the browser.
 *
 * Behaviour:
 *   - v3 invisible is the primary check.
 *   - A score below RECAPTCHA_SCORE_THRESHOLD, which the brief sets at 0.5,
 *     asks the client to run the v2 fallback and resubmit.
 *   - If no secret is configured at all, verification is skipped and the reason
 *     is returned so the route can log it. That keeps local previews and CI
 *     working, and it is stated plainly in the README.
 */

export const RECAPTCHA_ACTION = 'php_email_form_submit';
export const RECAPTCHA_TOKEN_FIELD = 'recaptcha-response';

export type CaptchaVerdict =
  | { status: 'pass'; score: number | null; skipped?: boolean; reason?: string }
  | { status: 'challenge'; reason: string; score: number }
  | { status: 'fail'; reason: string };

type VerifyResponse = {
  success: boolean;
  score?: number;
  action?: string;
  challenge_ts?: string;
  hostname?: string;
  'error-codes'?: string[];
};

function threshold(): number {
  const raw = Number.parseFloat(process.env.RECAPTCHA_SCORE_THRESHOLD ?? '0.5');
  return Number.isFinite(raw) ? raw : 0.5;
}

async function postToGoogle(
  secret: string,
  token: string,
  remoteIp?: string,
): Promise<VerifyResponse | null> {
  const body = new URLSearchParams({ secret, response: token });
  if (remoteIp) body.set('remoteip', remoteIp);

  try {
    const res = await fetch('https://www.google.com/recaptcha/api/siteverify', {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body,
      // Never let a hanging verification hold a form submission open.
      signal: AbortSignal.timeout(8000),
    });
    if (!res.ok) return null;
    return (await res.json()) as VerifyResponse;
  } catch {
    return null;
  }
}

/**
 * Verify a v3 token.
 *
 * @param token  the value of the recaptcha-response field
 * @param ip     the caller's IP, optional but improves Google's signal
 */
export async function verifyV3(token: string | null | undefined, ip?: string): Promise<CaptchaVerdict> {
  const secret = process.env.RECAPTCHA_SECRET_KEY;

  if (!secret) {
    return {
      status: 'pass',
      score: null,
      skipped: true,
      reason: 'RECAPTCHA_SECRET_KEY is not configured, so verification was skipped.',
    };
  }

  if (!token) {
    return { status: 'fail', reason: 'No reCAPTCHA token was supplied.' };
  }

  const result = await postToGoogle(secret, token, ip);
  if (!result) {
    return { status: 'fail', reason: 'The reCAPTCHA service could not be reached.' };
  }

  if (!result.success) {
    const codes = result['error-codes']?.join(', ') ?? 'unknown error';
    return { status: 'fail', reason: `reCAPTCHA rejected the token: ${codes}` };
  }

  const expectedHost = process.env.RECAPTCHA_EXPECTED_HOSTNAME;
  if (expectedHost && result.hostname && result.hostname !== expectedHost) {
    return { status: 'fail', reason: 'The reCAPTCHA hostname did not match this site.' };
  }

  const score = typeof result.score === 'number' ? result.score : 0;
  if (score < threshold()) {
    return {
      status: 'challenge',
      score,
      reason: `Score ${score.toFixed(2)} is below the threshold of ${threshold().toFixed(2)}.`,
    };
  }

  return { status: 'pass', score };
}

/** Verify a v2 fallback token. There is no score on v2, only pass or fail. */
export async function verifyV2(token: string | null | undefined, ip?: string): Promise<CaptchaVerdict> {
  const secret = process.env.RECAPTCHA_V2_SECRET_KEY;

  if (!secret) {
    return {
      status: 'pass',
      score: null,
      skipped: true,
      reason: 'RECAPTCHA_V2_SECRET_KEY is not configured, so the fallback was skipped.',
    };
  }

  if (!token) {
    return { status: 'fail', reason: 'No reCAPTCHA v2 token was supplied.' };
  }

  const result = await postToGoogle(secret, token, ip);
  if (!result) {
    return { status: 'fail', reason: 'The reCAPTCHA v2 service could not be reached.' };
  }
  if (!result.success) {
    return { status: 'fail', reason: 'The reCAPTCHA v2 challenge was not completed.' };
  }

  return { status: 'pass', score: null };
}

/**
 * The combined check used by every form route.
 *
 * A submission carries either a v3 token or a v2 token (or both). If the v3
 * score is low, the caller must also present a completed v2 challenge.
 */
export async function verifySubmission(
  v3Token: string | null | undefined,
  v2Token: string | null | undefined,
  ip?: string,
): Promise<CaptchaVerdict> {
  const v3 = await verifyV3(v3Token, ip);

  if (v3.status === 'fail') {
    // If v3 is simply not configured we already returned a pass above, so a fail
    // here means a genuinely bad token. Give the v2 fallback a chance anyway,
    // because a blocked v3 script is exactly when v2 exists.
    if (v2Token) return verifyV2(v2Token, ip);
    return v3;
  }

  if (v3.status === 'challenge') {
    if (!v2Token) return v3;
    const v2 = await verifyV2(v2Token, ip);
    if (v2.status === 'pass') {
      return { status: 'pass', score: v3.score, reason: 'Accepted on the v2 fallback challenge.' };
    }
    return v2;
  }

  return v3;
}

/** Best effort client IP, matching the header order Vercel uses. */
export function clientIp(headers: Headers): string | undefined {
  const forwarded = headers.get('x-forwarded-for');
  if (forwarded) return forwarded.split(',')[0]?.trim();
  return headers.get('x-real-ip') ?? undefined;
}
