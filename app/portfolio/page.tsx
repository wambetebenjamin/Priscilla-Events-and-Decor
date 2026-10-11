import Link from 'next/link';
import type { Metadata } from 'next';

import PageHead from '@/components/PageHead';
import PortfolioGallery from '@/components/PortfolioGallery';
import { PORTFOLIO, PORTFOLIO_BY_DATE } from '@/lib/portfolio';
import { breadcrumbJsonLd, jsonLdScript } from '@/lib/seo';
import { CONTACT } from '@/lib/site';

/**
 * Portfolio index.
 *
 * The brief sets ISR at 600 seconds for the portfolio, which is what revalidate
 * below does. Every photograph here is real East African event, venue and
 * celebration photography, credited in image-credits.md.
 */
export const revalidate = 600;

export const metadata: Metadata = {
  title: 'Portfolio',
  description:
    'Weddings, birthdays, corporate galas and intimate events styled by Priscilla Events and Decor across Nairobi and Kenya. Filter by event type and open any event for the venue, the date and what we built.',
  alternates: { canonical: '/portfolio' },
  openGraph: {
    title: 'Portfolio | Priscilla Events and Decor',
    description:
      'A gallery of weddings, galas, birthdays and intimate events dressed across Nairobi and Kenya.',
    url: '/portfolio',
    images: [
      {
        url: '/images/hero-venue-draped-hall.jpg',
        width: 1400,
        height: 932,
        alt: 'A draped ballroom ceiling above tables dressed with flowers',
      },
    ],
  },
};

export default function PortfolioPage() {
  const venues = Array.from(new Set(PORTFOLIO.map((event) => event.venueArea))).slice(0, 12);

  return (
    <>
      <PageHead
        eyebrow="Portfolio"
        title="Events we have styled"
        intro="Nineteen events across Nairobi, Kiambu, Kajiado and beyond. Filter by type, then open any event to see the venue, the guest count, the services used and what the room was like on the night."
        crumbs={[{ name: 'Portfolio', href: '/portfolio' }]}
        image="/images/venue-lit-hall.jpg"
        imageAlt="A warmly lit hall dressed with flowers and candlelight"
      />

      <section className="section">
        <div className="shell-wide">
          <PortfolioGallery events={PORTFOLIO_BY_DATE} />

          <div className="section-head" style={{ marginTop: 60 }}>
            <span className="eyebrow">Where we work</span>
            <h2 className="section-title">Venues and areas we know well</h2>
            <p className="section-lead">
              Knowing a venue before the build day is worth more than any mood board. These are
              places we have loaded into, rigged and struck at least once.
            </p>
          </div>

          <div className="choice-grid" style={{ gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))' }}>
            {venues.map((area) => (
              <div key={area} className="contact-item" style={{ alignItems: 'center' }}>
                <i className="bi bi-geo-alt" aria-hidden="true" />
                <p style={{ fontWeight: 500 }}>{area}</p>
              </div>
            ))}
          </div>

          <div style={{ textAlign: 'center', marginTop: 46 }}>
            <h2 className="section-title" style={{ fontSize: 'var(--fs-h3)' }}>
              Planning something similar?
            </h2>
            <p className="section-lead">
              Send us the date and the venue and we will tell you honestly what is possible, along
              with a clear starting price. {CONTACT.responsePromise}
            </p>
            <div className="hero-actions" style={{ justifyContent: 'center' }}>
              <Link href="/enquire" className="btn btn-primary">
                Start an enquiry
              </Link>
              <a
                href={CONTACT.whatsappLink}
                className="btn btn-quiet"
                target="_blank"
                rel="noopener noreferrer"
              >
                <i className="bi bi-whatsapp" aria-hidden="true" /> WhatsApp us
              </a>
            </div>
          </div>
        </div>
      </section>

      <script
        type="application/ld+json"
        // eslint-disable-next-line react/no-danger
        dangerouslySetInnerHTML={{
          __html: jsonLdScript(breadcrumbJsonLd([
            { name: 'Home', path: '/' },
            { name: 'Portfolio', path: '/portfolio' },
          ])),
        }}
      />
    </>
  );
}
