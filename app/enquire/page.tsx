import Link from 'next/link';
import type { Metadata } from 'next';

import PageHead from '@/components/PageHead';
import EnquiryForm from '@/components/EnquiryForm';
import { CONTACT } from '@/lib/site';
import { breadcrumbJsonLd, jsonLdScript } from '@/lib/seo';

/**
 * The enquiry form is server rendered for freshness, as the brief requires, so the
 * service and package pre-fills coming from a card link are always current.
 */
export const dynamic = 'force-dynamic';

export const metadata: Metadata = {
  title: 'Event Enquiry and Booking',
  description:
    'Send an event enquiry to Priscilla Events and Decor in six short steps. Tell us your date, venue, guest count, services and budget, and we will respond within 4 hours during working hours.',
  alternates: { canonical: '/enquire' },
  openGraph: {
    title: 'Event Enquiry and Booking | Priscilla Events and Decor',
    description:
      'A six step enquiry for weddings, corporate events, birthdays and private celebrations in Nairobi and Kenya.',
    url: '/enquire',
    images: [
      {
        url: '/images/service-table-setting.jpg',
        width: 1400,
        height: 932,
        alt: 'A table setting with a floral centrepiece and gold place settings',
      },
    ],
  },
};

type SearchParams = Promise<{
  service?: string;
  package?: string;
  intent?: string;
}>;

export default async function EnquirePage({ searchParams }: { searchParams: SearchParams }) {
  const { service, package: packageId, intent } = await searchParams;

  return (
    <>
      <PageHead
        eyebrow="Enquire"
        title="Tell us about your event"
        intro="Six short steps, about three minutes. Nothing you send commits you to anything, and we will tell you honestly what your budget buys before you pay a deposit."
        crumbs={[{ name: 'Enquire', href: '/enquire' }]}
        image="/images/service-table-setting.jpg"
        imageAlt="A table setting with a floral centrepiece and gold place settings"
      />

      <section className="section">
        <div className="shell">
          <div className="split" style={{ gridTemplateColumns: '1.4fr 1fr', alignItems: 'start' }}>
            <EnquiryForm
              initialService={service}
              initialPackage={packageId}
              initialIntent={intent}
            />

            <aside aria-label="Other ways to reach us">
              <div className="contact-block">
                <div className="contact-item">
                  <i className="bi bi-clock-history" aria-hidden="true" />
                  <div>
                    <h3>Response time</h3>
                    <p>{CONTACT.responsePromise}</p>
                  </div>
                </div>

                <div className="contact-item">
                  <i className="bi bi-whatsapp" aria-hidden="true" />
                  <div>
                    <h3>Prefer WhatsApp?</h3>
                    <p>
                      <a href={CONTACT.whatsappLink} target="_blank" rel="noopener noreferrer">
                        Message the events team on {CONTACT.phoneDisplay}
                      </a>
                    </p>
                  </div>
                </div>

                <div className="contact-item">
                  <i className="bi bi-envelope" aria-hidden="true" />
                  <div>
                    <h3>Email</h3>
                    <p>
                      <a href={`mailto:${CONTACT.email}`}>{CONTACT.email}</a>
                    </p>
                  </div>
                </div>

                <div className="contact-item">
                  <i className="bi bi-geo-alt" aria-hidden="true" />
                  <div>
                    <h3>Studio</h3>
                    <p>{CONTACT.studio.display}</p>
                  </div>
                </div>
              </div>

              <div className="form-shell" style={{ marginTop: 24 }}>
                <h2 style={{ fontSize: 'var(--fs-h4)' }}>What happens next</h2>
                <ol className="timeline" style={{ marginTop: 20 }}>
                  <li>
                    <h3 style={{ fontSize: 'var(--fs-body-lg)' }}>We read it properly</h3>
                    <p>A person reviews every enquiry. Not a template, and not an autoresponder alone.</p>
                  </li>
                  <li>
                    <h3 style={{ fontSize: 'var(--fs-body-lg)' }}>We come back with questions</h3>
                    <p>Usually a short call or WhatsApp thread to understand the room and the brief.</p>
                  </li>
                  <li>
                    <h3 style={{ fontSize: 'var(--fs-body-lg)' }}>You get an itemised quote</h3>
                    <p>Flowers, lighting, drapery, labour and transport on separate lines.</p>
                  </li>
                </ol>
                <p className="meta" style={{ marginBottom: 0 }}>
                  Privacy matters. Read how we handle your details in our{' '}
                  <Link href="/legal/privacy-policy">Privacy Policy</Link>.
                </p>
              </div>
            </aside>
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
              { name: 'Enquire', path: '/enquire' },
            ]),
          ),
        }}
      />
    </>
  );
}
