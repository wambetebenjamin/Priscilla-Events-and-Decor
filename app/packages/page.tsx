import Link from 'next/link';
import type { Metadata } from 'next';

import PageHead, { SectionHead } from '@/components/PageHead';
import PackagesGrid from '@/components/PackagesGrid';
import Faq from '@/components/Faq';
import { DEPOSIT_PERCENT, PACKAGES, depositFor, formatKes } from '@/lib/packages';
import { CONTACT } from '@/lib/site';
import { breadcrumbJsonLd, faqJsonLd, jsonLdScript, packagesJsonLd } from '@/lib/seo';

export const metadata: Metadata = {
  title: 'Packages',
  description:
    'The Essential Package, The Bloom Package and The Grand Priscilla Experience. Clear event styling packages for Nairobi weddings, corporate galas and celebrations, with starting prices in Kenya Shillings.',
  alternates: { canonical: '/packages' },
  openGraph: {
    title: 'Packages | Priscilla Events and Decor',
    description:
      'Three styling packages with starting prices in KES, clear inclusions and a 50% deposit to confirm your date.',
    url: '/packages',
    images: [
      {
        url: '/images/venue-wedding-banquet.jpg',
        width: 1400,
        height: 932,
        alt: 'Banquet tables dressed for a wedding reception',
      },
    ],
  },
};

const PACKAGE_FAQS = [
  {
    question: 'Is the starting price the final price?',
    answer:
      'No, and any studio that says otherwise is guessing. The starting price covers the inclusions listed for that package at the guest range shown. Your quotation changes with flower choice, season, venue distance and how much installation the room needs. We itemise it, so you can add or remove anything before you commit.',
  },
  {
    question: 'How does the deposit work?',
    answer: `A ${DEPOSIT_PERCENT}% deposit confirms your date and takes it off the calendar for anyone else. The balance falls due 14 days before the event. If you move your date rather than cancel, we carry the deposit across once, subject to availability.`,
  },
  {
    question: 'Can I add services to a package?',
    answer:
      'Yes, and most clients do. Lighting is the most common addition to The Essential Package, and a floral installation is the most common addition to The Bloom Package. We quote additions as their own lines so nothing disappears inside a bundle.',
  },
  {
    question: 'Do you offer payment in instalments?',
    answer:
      'For weddings booked six months or more ahead we can split the balance across two or three payments. Ask us when you confirm and we will put it in writing with your quotation.',
  },
  {
    question: 'What if my guest count changes?',
    answer:
      'Tell us as soon as you know. Table styling and centrepieces scale with guest count, and we would much rather adjust the plan a month out than discover it on the build day. Flowers cannot be scaled down at the last minute, so the earlier the better.',
  },
];

export default function PackagesPage() {
  const cheapest = Math.min(...PACKAGES.map((item) => item.startingPrice));

  return (
    <>
      <PageHead
        eyebrow="Packages"
        title="Packages with nothing hidden in them"
        intro={`Three ways to work with us, starting from ${formatKes(cheapest)}. Each one lists exactly what is included, which events it suits, and what the deposit looks like.`}
        crumbs={[{ name: 'Packages', href: '/packages' }]}
        image="/images/venue-wedding-banquet.jpg"
        imageAlt="Banquet tables dressed with linen and florals for a reception"
      />

      <section className="section">
        <div className="shell-wide">
          <PackagesGrid />
        </div>
      </section>

      <section className="section tint-cream" aria-labelledby="deposit-heading">
        <div className="shell">
          <SectionHead
            eyebrow="Deposits and dates"
            id="deposit-heading"
            title="How confirming a date works"
            lead="Clear from the start, because this is the part clients worry about most."
          />

          <div className="stat-row">
            {PACKAGES.map((item) => (
              <article key={item.id} className="stat">
                <div className="l">{item.name}</div>
                <div className="n" style={{ fontSize: 24, marginTop: 8 }}>
                  {formatKes(depositFor(item.startingPrice))}
                </div>
                <p className="meta" style={{ margin: 0 }}>
                  {DEPOSIT_PERCENT}% deposit, against {formatKes(item.startingPrice)} starting
                </p>
              </article>
            ))}
          </div>

          <p className="legal-note" style={{ marginTop: 30 }}>
            The deposit is calculated on your final quotation, not on the starting price. This page
            shows starting figures so you can plan. The full booking terms, including the
            cancellation and refund policy and the force majeure clause, are in our{' '}
            <Link href="/legal/terms">Terms of Service</Link>.
          </p>
        </div>
      </section>

      <section className="section" aria-labelledby="faq-heading">
        <div className="shell">
          <SectionHead
            eyebrow="Questions"
            id="faq-heading"
            title="Packages, prices and payments"
          />
          <Faq items={PACKAGE_FAQS} />
        </div>
      </section>

      <section className="section tint-sand" aria-labelledby="cta-heading">
        <div className="shell" style={{ textAlign: 'center' }}>
          <h2 className="section-title" id="cta-heading">
            Book a package, or ask us first
          </h2>
          <p className="section-lead">
            Both take about three minutes. If you would rather talk it through, WhatsApp us and we
            will come back with an honest view. {CONTACT.responsePromise}
          </p>
          <div className="hero-actions" style={{ justifyContent: 'center' }}>
            <Link href="/enquire?intent=package" className="btn btn-primary">
              Book a package
            </Link>
            <Link href="/style-quiz" className="btn btn-quiet">
              Which package suits me?
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
      </section>

      <script
        type="application/ld+json"
        // eslint-disable-next-line react/no-danger
        dangerouslySetInnerHTML={{
          __html: jsonLdScript([
            packagesJsonLd(PACKAGES),
            faqJsonLd(PACKAGE_FAQS),
            breadcrumbJsonLd([
              { name: 'Home', path: '/' },
              { name: 'Packages', path: '/packages' },
            ]),
          ]),
        }}
      />
    </>
  );
}
