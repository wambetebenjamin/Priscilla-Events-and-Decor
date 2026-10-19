/**
 * Shared plumbing for the API routes.
 *
 * Every route returns the same envelope so the client components can handle all
 * of them with one code path:
 *
 *   { ok: true,  reference, message, ... }
 *   { ok: false, error, fields?, challenge? }
 *
 * `challenge: true` is the signal that a v3 score came in below the threshold and
 * the client should run the v2 fallback before trying again.
 */

import { NextResponse } from 'next/server';

export type ApiOk = {
  ok: true;
  reference?: string;
  message: string;
  [key: string]: unknown;
};

export type ApiFail = {
  ok: false;
  error: string;
  fields?: Record<string, string>;
  challenge?: boolean;
};

/** 1 MB is far more than any of these forms need, and it caps abuse. */
const MAX_BODY_BYTES = 1024 * 1024;

export function ok(payload: Omit<ApiOk, 'ok'>): NextResponse<ApiOk> {
  // The cast is needed because ApiOk carries an index signature, which makes the
  // spread indistinguishable from a bag of unknowns to the compiler. The shape is
  // guaranteed by the parameter type.
  const body = { ok: true, ...payload } as ApiOk;
  return NextResponse.json(body, { status: 200 });
}

export function fail(
  error: string,
  status = 400,
  extra: Omit<ApiFail, 'ok' | 'error'> = {},
): NextResponse<ApiFail> {
  return NextResponse.json({ ok: false, error, ...extra }, { status });
}

export function methodNotAllowed(allowed: string[]): NextResponse<ApiFail> {
  return NextResponse.json(
    { ok: false, error: `Method not allowed. Use ${allowed.join(' or ')}.` },
    { status: 405, headers: { Allow: allowed.join(', ') } },
  );
}

/**
 * Reads and size limits a JSON body. Returns an error response rather than
 * throwing, so routes stay flat and readable.
 */
export async function readJson(
  request: Request,
): Promise<{ body: Record<string, unknown> } | { response: Response }> {
  const contentType = request.headers.get('content-type') ?? '';
  if (!contentType.includes('application/json')) {
    return { response: fail('Send the form as JSON.', 415) };
  }

  const declaredLength = Number.parseInt(request.headers.get('content-length') ?? '0', 10);
  if (Number.isFinite(declaredLength) && declaredLength > MAX_BODY_BYTES) {
    return { response: fail('That submission is too large.', 413) };
  }

  try {
    const raw = await request.text();
    if (raw.length > MAX_BODY_BYTES) {
      return { response: fail('That submission is too large.', 413) };
    }
    const parsed = JSON.parse(raw) as unknown;
    if (!parsed || typeof parsed !== 'object' || Array.isArray(parsed)) {
      return { response: fail('The submission was not readable.') };
    }
    return { body: parsed as Record<string, unknown> };
  } catch {
    return { response: fail('The submission was not valid JSON.') };
  }
}

/**
 * Wraps a route handler so an unexpected throw becomes a clean 500 with a line
 * the client can show, instead of an HTML error page the fetch cannot parse.
 *
 * The return type is Response rather than NextResponse, so a route may return
 * plain HTML (the unsubscribe page) or a NextResponse as it prefers.
 */
export function withErrorHandling<T extends unknown[]>(
  name: string,
  handler: (...args: T) => Promise<Response>,
): (...args: T) => Promise<Response> {
  return async (...args: T) => {
    try {
      return await handler(...args);
    } catch (error) {
      const detail = error instanceof Error ? error.message : 'Unknown error.';
      console.error(`[${name}] unhandled failure:`, detail);
      return fail('Something went wrong at our end. Please try again, or message us on WhatsApp.', 500);
    }
  };
}

/**
 * Very small in-process rate limiter, keyed by IP and route.
 *
 * This is best effort and deliberately so. It stops a single client hammering a
 * form, which is the realistic abuse here. Vercel's own edge protection and
 * reCAPTCHA remain the real controls.
 */
const buckets = new Map<string, { count: number; resetAt: number }>();

export function rateLimit(key: string, limit = 8, windowMs = 60_000): boolean {
  const now = Date.now();
  const bucket = buckets.get(key);

  if (!bucket || bucket.resetAt < now) {
    buckets.set(key, { count: 1, resetAt: now + windowMs });
    return true;
  }
  if (bucket.count >= limit) return false;
  bucket.count += 1;
  return true;
}

/** Housekeeping so the map does not grow without bound in a long lived process. */
export function sweepRateLimit(): void {
  const now = Date.now();
  for (const [key, bucket] of buckets) {
    if (bucket.resetAt < now) buckets.delete(key);
  }
}
