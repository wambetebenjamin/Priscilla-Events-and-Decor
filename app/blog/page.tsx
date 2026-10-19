import Link from 'next/link';
import type { Metadata } from 'next';

import PageHead from '@/components/PageHead';
import PostCard from '@/components/PostCard';
import NewsletterForm from '@/components/NewsletterForm';
import Reveal from '@/components/Reveal';
import { getAllPosts } from '@/lib/blog';
import { breadcrumbJsonLd, jsonLdScript } from '@/lib/seo';
import { SITE } from '@/lib/site';

/**
 * Blog index. The brief sets ISR at 3600 seconds for the blog, which is what
 * revalidate below does.
 */
export const revalidate = 3600;

export const metadata: Metadata = {
  title: 'Journal',
  description:
    'Event decor trends in Nairobi, how to choose a colour palette, florals for the season, and real event spotlights from the Priscilla Events and Decor studio.',
  alternates: { canonical: '/blog' },
  openGraph: {
    title: 'Journal | Priscilla Events and Decor',
    description:
      'Planning notes, seasonal flower guides and event spotlights from a Nairobi styling studio.',
    url: '/blog',
    images: [
      {
        url: '/images/floral-bridal-bouquet.jpg',
        width: 1400,
        height: 932,
        alt: 'A bridal bouquet of roses at a wedding ceremony',
      },
    ],
  },
};

export default function BlogPage() {
  const posts = getAllPosts();
  const categories = Array.from(new Set(posts.map((post) => post.category)));

  return (
    <>
      <PageHead
        eyebrow="Journal"
        title="Notes from the studio"
        intro="Trends we are seeing across Nairobi venues, practical guides on colour and flowers, and honest write ups of events we have styled, including the parts that did not go to plan."
        crumbs={[{ name: 'Journal', href: '/blog' }]}
        image="/images/floral-bridal-bouquet.jpg"
        imageAlt="A bridal bouquet of roses held during a ceremony"
      />

      <section className="section">
        <div className="shell-wide">
          <div className="filter-bar">
            {categories.map((category) => (
              <span key={category} className="filter-tab" style={{ cursor: 'default' }}>
                {category} ({posts.filter((post) => post.category === category).length})
              </span>
            ))}
          </div>

          {posts.length === 0 ? (
            <p className="section-lead" style={{ textAlign: 'center' }}>
              The first articles are being written. In the meantime,{' '}
              <Link href="/portfolio">look at the portfolio</Link>.
            </p>
          ) : (
            <div className="post-grid">
              {posts.map((post, index) => (
                <Reveal key={post.slug} delay={index * 70}>
                  <PostCard post={post} />
                </Reveal>
              ))}
            </div>
          )}
        </div>
      </section>

      <section className="section tint-sand" aria-labelledby="newsletter-heading">
        <div className="shell">
          <div className="newsletter">
            <div>
              <span className="eyebrow">Newsletter</span>
              <h2 id="newsletter-heading">Monthly decor inspiration and seasonal offers.</h2>
              <p>
                One email a month from {SITE.name}. Flowers at their best, venues we are working in,
                and subscriber only offers. Unsubscribe in one click.
              </p>
            </div>
            <NewsletterForm />
          </div>
        </div>
      </section>

      <script
        type="application/ld+json"
        // eslint-disable-next-line react/no-danger
        dangerouslySetInnerHTML={{
          __html: jsonLdScript(
            breadcrumbJsonLd([
              { name: 'Home', path: '/' },
              { name: 'Journal', path: '/blog' },
            ]),
          ),
        }}
      />
    </>
  );
}
