import type { MetadataRoute } from 'next';
import { SITE } from '@/lib/site';

/**
 * robots.txt.
 *
 * The API routes are disallowed, because they are POST endpoints and there is
 * nothing there for a search engine to index. Everything else is open. The
 * sitemap is declared so crawlers find the portfolio and blog pages without
 * needing to discover them by link.
 */
export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: '*',
        allow: '/',
        disallow: ['/api/', '/enquire?*', '/bridal?*'],
      },
    ],
    sitemap: `${SITE.url}/sitemap.xml`,
    host: SITE.url,
  };
}
