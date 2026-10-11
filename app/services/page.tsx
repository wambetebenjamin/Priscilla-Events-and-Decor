import Link from 'next/link';
import type { Metadata } from 'next';

import PageHead, { SectionHead } from '@/components/PageHead';
import ServicesGrid from '@/components/ServicesGrid';
import Reveal from '@/components/Reveal';
import { SERVICES } from '@/lib/services';
import { formatKes } from '@/lib/packages';
import { CONTACT } from '@/lib/site';
import { breadcrumbJsonLd, jsonLdScript, servicesJsonLd } from '@/lib/seo';

export const metadata: Metadata = {
  title: 'Services',
  description:
    'Wedding decor and styling, floral arrangements, lighting design, table setting and linen, backdrop and stage design, birthday party decor, corporate event styling and full venue transformation in Nairobi, Kenya.',
  alternates: { canonical: '/services' },
  openGraph: {
    title: 'Services | Priscilla Events and Decor',
    description:
      'Eight styling services for weddings, corporate events, birthdays and venue dressing across Nairobi and Kenya.',
    url: '/services',
    images: [
      {
        url: '/images/service-wedding-decor.jpg',
        width: 1400,
        height: 932,
        alt: 'A wedding venue dressed with elegant table settings and florals',
      },
    ],
  },
};

export default function ServicesPage() {
  return (
    <>
      <PageHead
        eyebrow="Services"
        title="Eight services, one team"
        intro="Each service stands on its own or combines into a package. Everything below is delivered by Priscilla Events and Decor staff, using our own stock, so nothing is subcontracted on the day."
        crumbs={[{ name: 'Services', href: '/services' }]}
        image="/images/service-backdrop-stage.jpg"
        imageAlt="A dressed backdrop wall with planting and warm lighting"
      />

      <section className="section">
        <div className="shell-wide">
          <ServicesGrid services={SERVICES} />
        </div>
      </section>

      <section className="section tint-cream" aria-labelledby="detail-heading">
        <div className="shell">
          <SectionHead
            eyebrow="In detail"
            id="detail-heading"
            title="What is actually included"
            lead="Every service lists what the client receives and what it starts from. Anything outside that is quoted as its own line, so a quotation is easy to read."
          />

          {SERVICES.map((service, index) => (
            <Reveal key={service.id} delay={index * 40}>
              <article
                id={service.id}
                className="form-shell"
                style={{ marginBottom: 22, scrollMarginTop: 100 }}
              >
                <div className="split" style={{ gap: 26, alignItems: 'start' }}>
                  <div>
                    <span className="eyebrow">{service.bestFor}</span>
                    <h3 style={{ fontSize: 'var(--fs-h3)' }}>{service.name}</h3>
                    <p>{service.detail}</p>
                    <p className="meta">
                      Starting from {formatKes(service.fromPrice)}. {service.short}
                    </p>
                    <Link
                      href={`/enquire?service=${encodeURIComponent(service.name)}`}
                      className="btn btn-primary"
                    >
                      Enquire about {service.name}
                    </Link>
                  </div>

                  <div>
                    <h4 style={{ fontSize: 'var(--fs-h4)' }}>What is included</h4>
                    <ul className="package-list">
                      {service.includes.map((line) => (
                        <li key={line}>
                          <i className="bi bi-check2" aria-hidden="true" />
                          <span>{line}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </article>
            </Reveal>
          ))}
        </div>
      </section>

      <section className="section" aria-labelledby="how-heading">
        <div className="shell">
          <SectionHead
            eyebrow="How it works"
            id="how-heading"
            title="From first message to the last strike"
            lead="The same sequence, whether it is a dinner for twenty or a venue transformation for six hundred."
          />

          <ol className="timeline">
            <li>
              <h3>You send the enquiry</h3>
              <p>
                Date, venue, guest count and the look you have in mind. Six short steps on our
                enquiry form, or a WhatsApp if that is easier. We respond within 4 hours during
                working hours.
              </p>
            </li>
            <li>
              <h3>We talk it through</h3>
              <p>
                A call or a studio meeting, free of charge. If you are a wedding client, this is
                where the bridal consultation fits. We will tell you what your budget realistically
                buys before you commit to anything.
              </p>
            </li>
            <li>
              <h3>A quotation you can read</h3>
              <p>
                Itemised, with flowers, lighting, drapery, furniture, labour and transport shown
                separately. No bundled line items that cannot be questioned.
              </p>
            </li>
            <li>
              <h3>Concept and mood board</h3>
              <p>
                Colours, materials, flower varieties and a lighting plan drawn over your actual venue
                layout, so you are approving something specific rather than a feeling.
              </p>
            </li>
            <li>
              <h3>Site visit and load in plan</h3>
              <p>
                We survey the venue, agree load in times with the venue team, and confirm power,
                access and rigging. This is the step that stops surprises on the day.
              </p>
            </li>
            <li>
              <h3>Build day, and the strike</h3>
              <p>
                Our crew builds, the coordinator runs the room, and we strike and clear afterwards,
                leaving the venue as we found it or better.
              </p>
            </li>
          </ol>
        </div>
      </section>

      <section className="section tint-sand" aria-labelledby="cta-heading">
        <div className="shell" style={{ textAlign: 'center' }}>
          <h2 className="section-title" id="cta-heading">
            Not sure which service you need?
          </h2>
          <p className="section-lead">
            Take the style quiz for a recommended package in six questions, or send us a message and
            we will advise honestly. {CONTACT.responsePromise}
          </p>
          <div className="hero-actions" style={{ justifyContent: 'center' }}>
            <Link href="/style-quiz" className="btn btn-primary">
              Take the style quiz
            </Link>
            <Link href="/enquire" className="btn btn-quiet">
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
            servicesJsonLd(SERVICES),
            breadcrumbJsonLd([
              { name: 'Home', path: '/' },
              { name: 'Services', path: '/services' },
            ]),
          ]),
        }}
      />
    </>
  );
}
