/**
 * Validation and sanitisation shared by every form route.
 *
 * Server side is the only place that decides what is valid. The client runs the
 * same rules for quick feedback, but nothing is trusted from the browser.
 */

export type FieldErrors = Record<string, string>;

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[a-z]{2,}$/i;

/** Kenyan mobile numbers, plus international fallback, digits normalised. */
export function normalisePhone(input: string): string {
  const digits = input.replace(/[^\d+]/g, '');
  if (digits.startsWith('+254')) return `0${digits.slice(4)}`;
  if (digits.startsWith('254')) return `0${digits.slice(3)}`;
  if (digits.startsWith('0')) return digits;
  return digits;
}

export function isValidKenyanPhone(input: string): boolean {
  // 07xx or 01xx, nine digits after the leading zero.
  return /^0[17]\d{8}$/.test(normalisePhone(input));
}

/** Strips control characters and trims, so nothing odd reaches storage or email. */
export function clean(value: unknown, maxLength = 2000): string {
  if (typeof value !== 'string') return '';
  // eslint-disable-next-line no-control-regex
  return value.replace(/[\u0000-\u0008\u000B\u000C\u000E-\u001F\u007F]/g, '').trim().slice(0, maxLength);
}

/** Collapses newlines so a value is safe inside a single email or chat line. */
export function oneLine(value: unknown, maxLength = 400): string {
  return clean(value, maxLength).replace(/\s*\n+\s*/g, ' ').trim();
}

export function isEmail(value: string): boolean {
  return EMAIL_RE.test(value.trim());
}

export function isIsoDate(value: string): boolean {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(value)) return false;
  const parsed = new Date(`${value}T00:00:00Z`);
  return !Number.isNaN(parsed.getTime());
}

/** Rejects a date in the past. Used for event and consultation dates. */
export function isFutureDate(value: string): boolean {
  if (!isIsoDate(value)) return false;
  const today = new Date();
  today.setUTCHours(0, 0, 0, 0);
  return new Date(`${value}T00:00:00Z`).getTime() >= today.getTime();
}

export function isPositiveInt(value: unknown, min = 0, max = 100000): boolean {
  const num = Number.parseInt(String(value ?? ''), 10);
  return Number.isFinite(num) && num >= min && num <= max;
}

/** Guards a route against a body that is not an object at all. */
export function asRecord(body: unknown): Record<string, unknown> | null {
  if (!body || typeof body !== 'object' || Array.isArray(body)) return null;
  return body as Record<string, unknown>;
}

/**
 * A deliberately simple honeypot and timing check. Bots fill hidden fields and
 * submit instantly. Real clients do neither.
 */
export function looksLikeBot(body: Record<string, unknown>): boolean {
  const honeypot = clean(body['company-website'], 200);
  if (honeypot.length > 0) return true;

  const startedAt = Number.parseInt(String(body['form-started-at'] ?? ''), 10);
  if (Number.isFinite(startedAt) && startedAt > 0) {
    const elapsed = Date.now() - startedAt;
    // Under 1.5 seconds on a six step form means it was not filled in by hand.
    if (elapsed < 1500) return true;
  }
  return false;
}

/** Formats a date for humans, as it appears in emails and WhatsApp messages. */
export function prettyDate(value: string): string {
  if (!isIsoDate(value)) return value;
  return new Date(`${value}T00:00:00Z`).toLocaleDateString('en-KE', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
    timeZone: 'UTC',
  });
}
