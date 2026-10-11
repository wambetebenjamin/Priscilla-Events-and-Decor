import Link from 'next/link';
import type { Metadata } from 'next';

import PageHead, { SectionHead } from '@/components/PageHead';
import ContactForm from '@/components/ContactForm';
import Faq from '@/components/Faq';
import { CONTACT, SITE } from '@/lib/site';
import { breadcrumbJsonLd, faqJsonLd, jsonLdScript } from '@/lib/seo';

export const metadata: Metadata = {
  title: 'Contact',
  description:
    'Contact Priscilla Events and Decor. Studio on Kibagathi Road, Ngara, Nairobi. Phone and WhatsApp 0112 272 061, or send us a message. We respond to all enquiries within 4 hours.',
  alternates: { canonical: '/contact' },
  openGraph: {
    title: 'Contact | Priscilla Events and Decor',
    description:
      'Find the studio, call, WhatsApp or send a message. We respond to all enquiries within 4 hours.',
    url: '/contact',
    images: [
      {
        url: '/images/florist-at-work.jpg',
        width: 1400,
        height: 932,
        alt: 'A florist arranging a bouquet at the Nairobi studio',
      },
    ],
  },
};

const CONTACT_FAQS = [
  {
    question: 'Can we visit the studio without an appointment?',
    answer:
      'You are welcome, but please message ahead. We are often out on build days, and we would rather have the samples laid out and someone free to sit with you than have you arrive to a locked door.',
  },
  {
    question: 'Do you answer WhatsApp at weekends?',
    answer:
      'Yes, though the reply may be slower on a Sunday. Build days are usually Friday and Saturday, so Sunday and Monday are when the team catches up properly.',
  },
  {
    question: 'How do I get a quotation fastest?',
    answer:
      'Use the enquiry form rather than a general message. It asks for the date, venue, guest count and budget, which are the four things we need before a quotation means anything. It takes about three minutes and you get a reference number straight away.',
  },
];

export default function ContactPage() {
  const mapQuery = encodeURIComponent(
    `${CONTACT.studio.street}, ${CONTACT.studio.city}, ${CONTACT.studio.countryName}`,
  );

  return (
    <>
      <PageHead
        eyebrow="Contact"
        title="Come and see us, or just say hello"
        intro={`Studio on ${CONTACT.studio.street}, ${CONTACT.studio.city}. Call, WhatsApp, email, or send a message and we will come back to you. ${CONTACT.responsePromise}`}
        crumbs={[{ name: 'Contact', href: '/contact' }]}
        image="/images/florist-at-work.jpg"
        imageAlt="A florist arranging a bouquet in the Nairobi studio"
      />

      <section className="section">
        <div className="shell">
          <div className="contact-grid">
            <div>
              <SectionHead
                eyebrow="Studio"
                title="Priscilla Events and Decor"
                align="left"
              />

              <div className="contact-block">
                <div className="contact-item">
                  <i className="bi bi-geo-alt" aria-hidden="true" />
                  <div>
                    <h3>Address</h3>
                    <p>
                      {CONTACT.studio.street}
                      <br />
                      {CONTACT.studio.area}, {CONTACT.studio.city} {CONTACT.studio.postalCode}
                      <br />
                      {CONTACT.studio.countryName}
                    </p>
                    <p>
                      <a
                        href={`https://www.google.com/maps/search/?api=1&query=${mapQuery}`}
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        Open in Google Maps
                      </a>
                    </p>
                  </div>
                </div>

                <div className="contact-item">
                  <i className="bi bi-telephone" aria-hidden="true" />
                  <div>
                    <h3>Phone and WhatsApp</h3>
                    <p>
                      <a href={CONTACT.phoneHref}>{CONTACT.phoneDisplay}</a>
                    </p>
                    <p>
                      <a href={CONTACT.whatsappLink} target="_blank" rel="noopener noreferrer">
                        <i className="bi bi-whatsapp" aria-hidden="true" /> Message us on WhatsApp
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
                    <p>
                      Events team: <a href={`mailto:${CONTACT.eventsEmail}`}>{CONTACT.eventsEmail}</a>
                    </p>
                    <p>
                      Bridal team: <a href={`mailto:${CONTACT.bridalEmail}`}>{CONTACT.bridalEmail}</a>
                    </p>
                  </div>
                </div>

                <div className="contact-item">
                  <i className="bi bi-clock" aria-hidden="true" />
                  <div>
                    <h3>Opening hours</h3>
                    {CONTACT.hours.map((entry) => (
                      <p key={entry.days}>
                        {entry.days}: {entry.time}
                      </p>
                    ))}
                  </div>
                </div>
              </div>

              <div className="map-frame" style={{ marginTop: 22 }}>
                {/*
                  Keyless Google Maps embed, so no API key is needed to render it.
                  It is sandboxed to the origin and lazy loaded, so it costs nothing
                  until someone scrolls to it.
                */}
                <iframe
                  title={`Map showing ${SITE.name} at ${CONTACT.studio.display}`}
                  src={`https://www.google.com/maps?q=${mapQuery}&output=embed`}
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                  allowFullScreen
                />
              </div>
            </div>

            <div>
              <ContactForm />
            </div>
          </div>
        </div>
      </section>

      <section className="section tint-cream" aria-labelledby="faq-heading">
        <div className="shell">
          <SectionHead eyebrow="Questions" id="faq-heading" title="Before you get in touch" />
          <Faq items={CONTACT_FAQS} />

          <div style={{ textAlign: 'center', marginTop: 44 }}>
            <p className="section-lead">
              Looking for a quotation rather than a conversation? The enquiry form asks for the four
              things we need, and gives you a reference number straight away.
            </p>
            <div className="hero-actions" style={{ justifyContent: 'center' }}>
              <Link href="/enquire" className="btn btn-primary">
                Get a quote
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
          __html: jsonLdScript([
            faqJsonLd(CONTACT_FAQS),
            breadcrumbJsonLd([
              { name: 'Home', path: '/' },
              { name: 'Contact', path: '/contact' },
            ]),
          ]),
        }}
      />
    </>
  );
}
