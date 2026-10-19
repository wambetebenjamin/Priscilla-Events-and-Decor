import Link from 'next/link';
import type { Metadata } from 'next';

import PageHead from '@/components/PageHead';
import StyleQuiz from '@/components/StyleQuiz';
import { breadcrumbJsonLd, jsonLdScript } from '@/lib/seo';

export const metadata: Metadata = {
  title: 'Style Quiz',
  description:
    'A six question style finder for event decor. Choose a palette, a setting, and a floral style, and get a recommended package with a mood board collage. Free, instant, nothing stored.',
  alternates: { canonical: '/style-quiz' },
  openGraph: {
    title: 'Style Quiz | Priscilla Events and Decor',
    description:
      'Six questions, one recommended package and a mood board. No sign up, nothing stored.',
    url: '/style-quiz',
    images: [
      {
        url: '/images/venue-garden-aisle.jpg',
        width: 1400,
        height: 932,
        alt: 'A garden aisle dressed with flowers and draping',
      },
    ],
  },
};

export default function StyleQuizPage() {
  return (
    <>
      <PageHead
        eyebrow="Style finder"
        title="Find the look that is already yours"
        intro="Six questions about what you are drawn to: palette, setting, flowers, light, tables and what you want guests to remember. At the end you get a recommended package and a mood board you can bring to a consultation."
        crumbs={[{ name: 'Style quiz', href: '/style-quiz' }]}
        image="/images/venue-garden-aisle.jpg"
        imageAlt="A garden aisle dressed with flowers and sheer draping"
      />

      <section className="section">
        <div className="shell">
          <StyleQuiz />

          <div className="section-head" style={{ marginTop: 64 }}>
            <span className="eyebrow">Good to know</span>
            <h2 className="section-title">Completely private, by design</h2>
          </div>

          <div
            className="services-grid"
            style={{ gridTemplateColumns: 'repeat(3, minmax(0,1fr))' }}
          >
            <article className="service-card" style={{ padding: 24 }}>
              <h3 className="service-card-title">Nothing is stored</h3>
              <p className="service-card-copy" style={{ marginBottom: 0 }}>
                Your answers never leave this browser tab. There is no submission at the end, no
                email capture, and no analytics on the quiz itself.
              </p>
            </article>

            <article className="service-card" style={{ padding: 24 }}>
              <h3 className="service-card-title">No login, no email</h3>
              <p className="service-card-copy" style={{ marginBottom: 0 }}>
                You can take it as many times as you like. Booking a consultation afterwards is
                entirely your choice, and the quiz is not a condition of it.
              </p>
            </article>

            <article className="service-card" style={{ padding: 24 }}>
              <h3 className="service-card-title">A starting point, not a quote</h3>
              <p className="service-card-copy" style={{ marginBottom: 0 }}>
                The recommendation is based on aesthetics, not on your venue or your budget. Use it
                as the opening of a conversation, not as a price.
              </p>
            </article>
          </div>

          <div style={{ textAlign: 'center', marginTop: 46 }}>
            <p className="section-lead">
              Ready to talk it through with a person? Our team answers honestly, including when the
              answer is that your budget will not buy the room you have in mind.
            </p>
            <div className="hero-actions" style={{ justifyContent: 'center' }}>
              <Link href="/enquire" className="btn btn-primary">
                Start an enquiry
              </Link>
              <Link href="/bridal" className="btn btn-quiet">
                Book a bridal consultation
              </Link>
            </div>
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
              { name: 'Style quiz', path: '/style-quiz' },
            ]),
          ),
        }}
      />
    </>
  );
}
