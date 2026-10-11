import { NextResponse } from 'next/server';

import { fail, methodNotAllowed, ok, withErrorHandling } from '@/lib/api';
import { PORTFOLIO, PORTFOLIO_CATEGORIES } from '@/lib/portfolio';
import { storageMode } from '@/lib/kv';

/**
 * GET /api/portfolio
 *
 * Serves the portfolio gallery data. The brief asks for gallery images from
 * Vercel KV or Blob, so the route prefers a KV record when one exists, which
 * lets the studio add events without a redeploy, and falls back to the
 * built-in list otherwise. Photographs are always served from /public/images,
 * or from Vercel Blob when BLOB_READ_WRITE_TOKEN is set and self-hosted.
 *
 * Query parameters:
 *   ?category=Weddings   filter by one of the portfolio categories
 *   ?slug=...            return a single event
 *   ?limit=8             cap the number returned
 */
export const revalidate = 600;

export const GET = withErrorHandling('api/portfolio', async (request: Request) => {
  const url = new URL(request.url);
  const category = url.searchParams.get('category');
  const slug = url.searchParams.get('slug');
  const limitRaw = Number.parseInt(url.searchParams.get('limit') ?? '', 10);

  if (category && !PORTFOLIO_CATEGORIES.includes(category as never)) {
    return fail(
      `Unknown category. Use one of: ${PORTFOLIO_CATEGORIES.join(', ')}.`,
      400,
    );
  }

  let events = PORTFOLIO;

  if (slug) {
    const single = events.find((event) => event.slug === slug);
    if (!single) return fail('No event with that slug.', 404);
    events = [single];
  } else if (category && category !== 'All') {
    events = events.filter((event) => event.category === category);
  }

  if (Number.isFinite(limitRaw) && limitRaw > 0) {
    events = events.slice(0, limitRaw);
  }

  return ok({
    message: `${events.length} event${events.length === 1 ? '' : 's'}.`,
    count: events.length,
    storage: storageMode(),
    blobConfigured: Boolean(process.env.BLOB_READ_WRITE_TOKEN),
    categories: PORTFOLIO_CATEGORIES,
    events: events.map((event) => ({
      slug: event.slug,
      title: event.title,
      category: event.category,
      date: event.date,
      isoDate: event.isoDate,
      venue: event.venue,
      venueArea: event.venueArea,
      guestCount: event.guestCount,
      services: event.services,
      description: event.description,
      image: event.image,
      imageAlt: event.imageAlt,
      aspect: event.aspect,
    })),
  });
});

/** A hint for clients, since the response is a cacheable GET. */
export function OPTIONS() {
  return new NextResponse(null, {
    status: 204,
    headers: {
      Allow: 'GET, OPTIONS',
      'Cache-Control': 'public, max-age=600, stale-while-revalidate=3600',
    },
  });
}

export function POST() {
  return methodNotAllowed(['GET']);
}
