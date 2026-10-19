import { NextResponse } from 'next/server';
import { storageMode } from '@/lib/kv';
import { whatsappConfigured } from '@/lib/whatsapp';

/**
 * GET /api/health
 *
 * Reports which integrations are wired up in this environment, without revealing
 * a single secret value. It exists because a form that silently does not notify
 * anyone is worse than a form that is visibly switched off, and because it is the
 * fastest way to confirm a deployment is configured correctly before launch.
 *
 * Every value reported is a boolean, a number or a mode name.
 */
export const dynamic = 'force-dynamic';
export const runtime = 'nodejs';

export async function GET() {
  const checks = {
    recaptchaV3: Boolean(
      process.env.RECAPTCHA_SECRET_KEY && process.env.NEXT_PUBLIC_RECAPTCHA_SITE_KEY,
    ),
    recaptchaV2Fallback: Boolean(
      process.env.RECAPTCHA_V2_SECRET_KEY && process.env.NEXT_PUBLIC_RECAPTCHA_V2_SITE_KEY,
    ),
    blob: Boolean(process.env.BLOB_READ_WRITE_TOKEN),
    smtp: Boolean(process.env.SMTP_HOST && process.env.SMTP_USER && process.env.SMTP_PASSWORD),
    whatsappCloudApi: whatsappConfigured(),
    whatsappNumberConfigured: Boolean(process.env.NEXT_PUBLIC_WHATSAPP_NUMBER),
    eventsTeamEmail: Boolean(process.env.EVENTS_TEAM_EMAIL),
    bridalTeamEmail: Boolean(process.env.BRIDAL_TEAM_EMAIL),
  };

  const storage = storageMode();
  const missing = [
    ...Object.entries(checks)
      .filter(([, configured]) => !configured)
      .map(([key]) => key),
    ...(storage === 'local-fallback' ? ['vercelKv'] : []),
  ];

  return NextResponse.json(
    {
      ok: true,
      message:
        missing.length === 0
          ? 'Every integration is configured.'
          : `Running with fallbacks. Not configured: ${missing.join(', ')}.`,
      checks: { ...checks, storage },
      missing,
      scoreThreshold: Number.parseFloat(process.env.RECAPTCHA_SCORE_THRESHOLD ?? '0.5'),
      node: process.version,
      environment: process.env.VERCEL_ENV ?? process.env.NODE_ENV ?? 'unknown',
    },
    { status: 200, headers: { 'Cache-Control': 'no-store' } },
  );
}
