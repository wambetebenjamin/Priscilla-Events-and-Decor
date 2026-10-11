import { kvGet, kvSet } from '@/lib/kv';
import { withErrorHandling } from '@/lib/api';

/**
 * GET /api/newsletter/unsubscribe?token=<hash>
 *
 * One click unsubscribe. The token is the SHA-256 hash of the subscriber's email
 * address, which means the unsubscribe URL contains no personal data and needs no
 * lookup table to resolve.
 *
 * The record is not deleted outright. It is marked unsubscribed with a timestamp,
 * which is what stops a later import from adding the address back, and the address
 * itself is replaced with an empty string so nothing personal remains. That
 * behaviour is stated in the Privacy Policy.
 */
export const dynamic = 'force-dynamic';
export const runtime = 'nodejs';

function page(title: string, body: string, status: number): Response {
  const html = `<!doctype html>
<html lang="en-KE">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>${title} | Priscilla Events and Decor</title>
<meta name="robots" content="noindex, nofollow">
<style>
  body { margin:0; font-family: Arial, Helvetica, sans-serif; background:#fdf8f4; color:#2f3138; line-height:1.7; }
  main { max-width: 620px; margin: 0 auto; padding: 72px 24px; }
  h1 { font-family: Georgia, serif; color:#0e1b4d; font-size:30px; }
  a { color:#f82249; }
</style>
</head>
<body>
<main>
<h1>${title}</h1>
${body}
<p><a href="/">Back to Priscilla Events and Decor</a></p>
</main>
</body>
</html>`;
  return new Response(html, {
    status,
    headers: { 'Content-Type': 'text/html; charset=utf-8', 'Cache-Control': 'no-store' },
  });
}

export const GET = withErrorHandling('api/newsletter/unsubscribe', async (request: Request) => {
  const token = new URL(request.url).searchParams.get('token')?.trim() ?? '';

  if (!/^[a-f0-9]{32}$/.test(token)) {
    return page(
      'That link is not valid',
      '<p>The unsubscribe link looks incomplete. Open the most recent email from us and use the link at the bottom, or reply to any email and we will remove you by hand.</p>',
      400,
    );
  }

  const key = `subscriber:${token}`;
  const existing = await kvGet<{ email?: string; subscribedAt?: string }>(key);

  if (!existing) {
    return page(
      'You are already unsubscribed',
      '<p>We have no active subscription for this link, so there is nothing to do. You will not receive further newsletter emails from us.</p>',
      200,
    );
  }

  await kvSet(key, {
    email: '',
    subscribedAt: existing.subscribedAt ?? null,
    unsubscribedAt: new Date().toISOString(),
    confirmed: false,
    source: 'unsubscribe-link',
  });

  return page(
    'You have been unsubscribed',
    '<p>You will not receive any further newsletter emails from Priscilla Events and Decor. We have removed your email address from the record.</p><p>If you ever want to come back, the subscribe box is in the footer of every page.</p>',
    200,
  );
});
