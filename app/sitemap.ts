import type { MetadataRoute } from 'next';
import { PORTFOLIO } from '@/lib/portfolio';
import { getAllPosts } from '@/lib/blog';
import { SITE } from '@/lib/site';

/**
 * Dynamic sitemap, built from the portfolio and blog slugs as the brief requires.
 *
 * Because PORTFOLIO and the MDX files are the single source of truth for both the
 * pages and this file, a new event or article appears here automatically. The
 * change frequencies and priorities below reflect how often each page actually
 * changes, not wishful thinking.
 */
export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date();

  const staticRoutes: MetadataRoute.Sitemap = [
    { url: `${SITE.url}/`, lastModified: now, changeFrequency: 'weekly', priority: 1 },
    { url: `${SITE.url}/portfolio`, lastModified: now, changeFrequency: 'weekly', priority: 0.9 },
    { url: `${SITE.url}/services`, lastModified: now, changeFrequency: 'monthly', priority: 0.9 },
    { url: `${SITE.url}/packages`, lastModified: now, changeFrequency: 'monthly', priority: 0.9 },
    { url: `${SITE.url}/enquire`, lastModified: now, changeFrequency: 'weekly', priority: 0.8 },
    { url: `${SITE.url}/bridal`, lastModified: now, changeFrequency: 'monthly', priority: 0.8 },
    { url: `${SITE.url}/style-quiz`, lastModified: now, changeFrequency: 'monthly', priority: 0.7 },
    { url: `${SITE.url}/about`, lastModified: now, changeFrequency: 'monthly', priority: 0.7 },
    { url: `${SITE.url}/blog`, lastModified: now, changeFrequency: 'weekly', priority: 0.8 },
    { url: `${SITE.url}/contact`, lastModified: now, changeFrequency: 'monthly', priority: 0.7 },
    {
      url: `${SITE.url}/legal/privacy-policy`,
      lastModified: new Date('2026-03-18'),
      changeFrequency: 'yearly',
      priority: 0.3,
    },
    {
      url: `${SITE.url}/legal/terms`,
      lastModified: new Date('2026-03-18'),
      changeFrequency: 'yearly',
      priority: 0.3,
    },
    {
      url: `${SITE.url}/legal/cookie-policy`,
      lastModified: new Date('2026-03-18'),
      changeFrequency: 'yearly',
      priority: 0.3,
    },
  ];

  const portfolioRoutes: MetadataRoute.Sitemap = PORTFOLIO.map((event) => ({
    url: `${SITE.url}/portfolio/${event.slug}`,
    lastModified: new Date(`${event.isoDate}T09:00:00+03:00`),
    changeFrequency: 'yearly' as const,
    priority: 0.6,
  }));

  const blogRoutes: MetadataRoute.Sitemap = getAllPosts().map((post) => ({
    url: `${SITE.url}/blog/${post.slug}`,
    lastModified: new Date(`${post.date}T09:00:00+03:00`),
    changeFrequency: 'monthly' as const,
    priority: 0.6,
  }));

  return [...staticRoutes, ...portfolioRoutes, ...blogRoutes];
}
