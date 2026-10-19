import Link from 'next/link';
import { notFound } from 'next/navigation';
import type { Metadata } from 'next';

import PageHead from '@/components/PageHead';
import Reveal from '@/components/Reveal';
import { PORTFOLIO, getEvent } from '@/lib/portfolio';
import {
  breadcrumbJsonLd,
  jsonLdScript,
  portfolioEventJsonLd,
  portfolioMetadata,
} from '@/lib/seo';
import { CONTACT } from '@/lib/site';

/** Portfolio detail pages revalidate on the same 600 second schedule as the index. */
export const revalidate = 600;

export function generateStaticParams() {
  return PORTFOLIO.map((event) => ({ slug: event.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const event = getEvent(slug);
  if (!event) return { title: 'Event not found' };
  return portfolioMetadata(event);
}

export default async function PortfolioEventPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const event = getEvent(slug);
  if (!event) notFound();

  const more = PORTFOLIO.filter(
    (item) => item.slug !== event.slug && item.category === event.category,
  )
    .concat(PORTFOLIO.filter((item) => item.slug !== event.slug && item.category !== event.category))
    .slice(0, 3);

  return (
    <>
      <PageHead
        eyebrow={event.category}
        title={event.title}
        intro={event.description}
        crumbs={[
          { name: 'Portfolio', href: '/portfolio' },
          { name: event.title, href: `/portfolio/${event.slug}` },
        ]}
        image={event.image}
        imageAlt={event.imageAlt}
      />

      <section className="section">
        <div className="shell">
          <div className="summary-grid">
            <div className="summary-row">
              <dt>Date</dt>
              <dd>{event.date}</dd>
            </div>
            <div className="summary-row">
              <dt>Venue</dt>
              <dd>{event.venue}</dd>
            </div>
            <div className="summary-row">
              <dt>Location</dt>
              <dd>{event.venueArea}</dd>
            </div>
            <div className="summary-row">
              <dt>Guests</dt>
              <dd>{event.guestCount}</dd>
            </div>
            <div className="summary-row">
              <dt>Services</dt>
              <dd>{event.services.join(', ')}</dd>
            </div>
          </div>

          <div className="split" style={{ marginTop: 40 }}>
            <Reveal variant="scale">
              <div className="split-media">
                <img
                  src={event.image}
                  alt={event.imageAlt}
                  width={1400}
                  height={event.aspect === 'portrait' ? 1960 : 932}
                  loading="lazy"
                  decoding="async"
                />
              </div>
            </Reveal>

            <Reveal delay={80}>
              <h2 className="section-title" style={{ fontSize: 'var(--fs-h3)' }}>
                What we did
              </h2>
              <p>{event.description}</p>
              <ul className="package-list">
                {event.services.map((service) => (
                  <li key={service}>
                    <i className="bi bi-check2" aria-hidden="true" />
                    <span>{service}</span>
                  </li>
                ))}
              </ul>
              <div className="step-actions" style={{ borderTop: 'none', paddingTop: 0 }}>
                <Link href="/enquire" className="btn btn-primary">
                  Plan something like this
                </Link>
                <Link href="/portfolio" className="btn btn-quiet">
                  Back to the portfolio
                </Link>
              </div>
            </Reveal>
          </div>
        </div>
      </section>

      <section className="section tint-cream" aria-labelledby="more-heading">
        <div className="shell-wide">
          <div className="section-head">
            <span className="eyebrow">Keep looking</span>
            <h2 className="section-title" id="more-heading">
              More events
            </h2>
          </div>

          <div className="post-grid">
            {more.map((item, index) => (
              <Reveal key={item.slug} delay={index * 70}>
                <article className="post-card">
                  <div className="post-media">
                    <Link href={`/portfolio/${item.slug}`} aria-hidden="true" tabIndex={-1}>
                      <img
                        src={item.image}
                        alt={item.imageAlt}
                        width={1400}
                        height={875}
                        loading="lazy"
                        decoding="async"
                      />
                    </Link>
                  </div>
                  <div className="post-body">
                    <div className="post-meta">
                      <span>{item.category}</span>
                      <span>{item.date}</span>
                    </div>
                    <h3 className="post-title">
                      <Link href={`/portfolio/${item.slug}`}>{item.title}</Link>
                    </h3>
                    <p className="post-excerpt">
                      {item.venue}, {item.venueArea}. {item.guestCount}.
                    </p>
                    <div className="post-foot">
                      <Link href={`/portfolio/${item.slug}`} className="link-cta">
                        Open this event <i className="bi bi-arrow-right" aria-hidden="true" />
                      </Link>
                    </div>
                  </div>
                </article>
              </Reveal>
            ))}
          </div>

          <div style={{ textAlign: 'center', marginTop: 40 }}>
            <p className="section-lead">
              Want to talk through your own venue and date? {CONTACT.responsePromise}
            </p>
            <Link href="/enquire" className="btn btn-primary">
              Start an enquiry
            </Link>
          </div>
        </div>
      </section>

      <script
        type="application/ld+json"
        // eslint-disable-next-line react/no-danger
        dangerouslySetInnerHTML={{
          __html: jsonLdScript([
            portfolioEventJsonLd(event),
            breadcrumbJsonLd([
              { name: 'Home', path: '/' },
              { name: 'Portfolio', path: '/portfolio' },
              { name: event.title, path: `/portfolio/${event.slug}` },
            ]),
          ]),
        }}
      />
    </>
  );
}
