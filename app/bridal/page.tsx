import Link from 'next/link';
import type { Metadata } from 'next';

import PageHead, { SectionHead } from '@/components/PageHead';
import BridalForm from '@/components/BridalForm';
import Faq from '@/components/Faq';
import Reveal from '@/components/Reveal';
import { CONTACT } from '@/lib/site';
import { breadcrumbJsonLd, faqJsonLd, jsonLdScript } from '@/lib/seo';

export const metadata: Metadata = {
  title: 'Bridal Consultation',
  description:
    'Book a free bridal consultation with Priscilla Events and Decor. Walk through flowers, fabrics, lighting and table styling in person at our Nairobi studio, or virtually.',
  alternates: { canonical: '/bridal' },
  openGraph: {
    title: 'Bridal Consultation | Priscilla Events and Decor',
    description:
      'A dedicated consultation for wedding clients. Free, about ninety minutes, in person or virtual.',
    url: '/bridal',
    images: [
      {
        url: '/images/floral-bridal-bouquet.jpg',
        width: 1400,
        height: 932,
        alt: 'A bridal bouquet of roses held before a ceremony',
      },
    ],
  },
};

const BRIDAL_FAQS = [
  {
    question: 'Is the bridal consultation really free?',
    answer:
      'Yes. It is a working session, not a sales appointment, and there is no obligation at the end of it. About two thirds of couples who come in go on to book with us, and the ones who do not still leave with a plan they can use.',
  },
  {
    question: 'How long does it take, and where does it happen?',
    answer:
      'About ninety minutes. It happens at our studio on Kibagathi Road in Ngara, where you can handle fabric, linen and tableware samples, or virtually over video if that is easier. Evening and Saturday appointments are available.',
  },
  {
    question: 'What should we bring?',
    answer:
      'Anything that has caught your eye: a Pinterest board, screenshots, a colour swatch, a piece of fabric from a bridesmaid dress, or photographs of the venue. If you have nothing yet, come anyway. That is what the session is for.',
  },
  {
    question: 'Can we bring family members?',
    answer:
      'Yes, and we would encourage it if they are helping you decide. Two or three people is comfortable. Larger groups are welcome and we will arrange the studio accordingly, just let us know in the form.',
  },
  {
    question: 'When should we book the consultation?',
    answer:
      'Nine to twelve months before the wedding is ideal, which gives time to book flowers at the right price and to do a venue site visit. If you are closer than that, still book. We will tell you honestly what can be done in the time available.',
  },
];

export default function BridalPage() {
  return (
    <>
      <PageHead
        eyebrow="For wedding clients"
        title="A bridal consultation, before any numbers"
        intro="A free ninety minute session with our bridal team. Handle the fabrics, see the flowers you are considering, and leave with a plan you can budget against."
        crumbs={[{ name: 'Bridal consultation', href: '/bridal' }]}
        image="/images/floral-bridal-bouquet.jpg"
        imageAlt="A bridal bouquet of roses held during a ceremony"
      />

      <section className="section">
        <div className="shell">
          <div className="split">
            <Reveal>
              <span className="eyebrow">How it works</span>
              <h2 className="section-title">Ninety minutes that change the whole brief</h2>
              <p>
                Most couples arrive with a colour they like and a photograph of a room in another
                country. Most couples leave with a palette that works in their actual venue, a flower
                list that will hold in their season, and a budget they can take to family without
                guessing.
              </p>
              <p>
                Bring your venue photographs if you have chosen one. If you have not, bring the short
                list and we will tell you how each one behaves for styling, which is often the thing
                that decides it.
              </p>
              <div className="step-actions" style={{ borderTop: 'none', paddingTop: 0 }}>
                <a
                  href={CONTACT.whatsappLink}
                  className="btn btn-quiet"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <i className="bi bi-whatsapp" aria-hidden="true" /> Ask a question first
                </a>
                <Link href="/portfolio" className="btn btn-quiet">
                  See wedding work
                </Link>
              </div>
            </Reveal>

            <Reveal delay={80} variant="scale">
              <div className="split-media">
                <img
                  src="/images/portfolio-bridal-table.jpg"
                  alt="A long table dressed with a low floral centrepiece and candles"
                  width={1400}
                  height={932}
                  loading="lazy"
                  decoding="async"
                />
              </div>
            </Reveal>
          </div>
        </div>
      </section>

      <section className="section tint-cream" aria-labelledby="steps-heading">
        <div className="shell">
          <SectionHead
            eyebrow="What happens in the session"
            id="steps-heading"
            title="Four things we cover, every time"
            lead="We follow the same structure with every couple, so nothing important gets left to a later conversation."
          />

          <ol className="timeline">
            <li>
              <h3>Your venue, honestly assessed</h3>
              <p>
                We look at the venue photographs or plans and tell you what the room does well and
                what it will fight you on: ceiling height, lighting, floor colour, load in access and
                where the light falls at your ceremony time.
              </p>
            </li>
            <li>
              <h3>Palette and materials</h3>
              <p>
                You handle the linen weights and napkin folds, see the charger finishes and glassware
                we hold, and settle a palette against your venue rather than against a screen.
              </p>
            </li>
            <li>
              <h3>Flowers for your season</h3>
              <p>
                Your florist walks through what is at its best on your date, what has to be imported,
                and what the honest local substitutes are. Bridal bouquet, bridal party, centrepieces
                and any installation are all discussed here.
              </p>
            </li>
            <li>
              <h3>Budget, without pressure</h3>
              <p>
                You tell us the number you are working with. We tell you what it buys, what it does
                not, and where the money is best spent in your particular room. You leave with a
                written summary, whether or not you book.
              </p>
            </li>
          </ol>
        </div>
      </section>

      <section className="section" id="book" aria-labelledby="book-heading">
        <div className="shell">
          <SectionHead
            eyebrow="Book your consultation"
            id="book-heading"
            title="Choose a date that suits you both"
            lead="We will confirm your appointment by email and WhatsApp, usually the same working day. Consultations are free and there is no obligation."
          />

          <div className="split" style={{ gridTemplateColumns: '1.3fr 1fr', alignItems: 'start' }}>
            <BridalForm />

            <aside className="contact-block" aria-label="Bridal team contact">
              <div className="contact-item">
                <i className="bi bi-flower2" aria-hidden="true" />
                <div>
                  <h3>Your bridal florist</h3>
                  <p>
                    Amina Kilonzo leads bridal work at the studio. You will meet her at the
                    consultation, and she will be on site with your bouquet on the day.
                  </p>
                </div>
              </div>

              <div className="contact-item">
                <i className="bi bi-clock-history" aria-hidden="true" />
                <div>
                  <h3>When we reply</h3>
                  <p>{CONTACT.responsePromise}</p>
                </div>
              </div>

              <div className="contact-item">
                <i className="bi bi-geo-alt" aria-hidden="true" />
                <div>
                  <h3>Where to find us</h3>
                  <p>{CONTACT.studio.display}</p>
                </div>
              </div>

              <div className="contact-item">
                <i className="bi bi-whatsapp" aria-hidden="true" />
                <div>
                  <h3>WhatsApp the bridal team</h3>
                  <p>
                    <a href={CONTACT.whatsappLink} target="_blank" rel="noopener noreferrer">
                      {CONTACT.phoneDisplay}
                    </a>
                  </p>
                </div>
              </div>

              <div className="form-shell">
                <h3 style={{ fontSize: 'var(--fs-body-lg)' }}>Not ready to book?</h3>
                <p style={{ fontSize: 15, marginBottom: 0 }}>
                  Take the <Link href="/style-quiz">style quiz</Link> first. Six questions, no email
                  needed, and it will recommend a package and build you a mood board you can bring
                  to the consultation.
                </p>
              </div>
            </aside>
          </div>
        </div>
      </section>

      <section className="section tint-sand" aria-labelledby="faq-heading">
        <div className="shell">
          <SectionHead
            eyebrow="Questions"
            id="faq-heading"
            title="About the bridal consultation"
          />
          <Faq items={BRIDAL_FAQS} />
        </div>
      </section>

      <script
        type="application/ld+json"
        // eslint-disable-next-line react/no-danger
        dangerouslySetInnerHTML={{
          __html: jsonLdScript([
            faqJsonLd(BRIDAL_FAQS),
            breadcrumbJsonLd([
              { name: 'Home', path: '/' },
              { name: 'Bridal consultation', path: '/bridal' },
            ]),
          ]),
        }}
      />
    </>
  );
}
