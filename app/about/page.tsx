import Link from 'next/link';
import type { Metadata } from 'next';

import PageHead, { SectionHead } from '@/components/PageHead';
import TeamGrid from '@/components/TeamGrid';
import Testimonials from '@/components/Testimonials';
import Reveal from '@/components/Reveal';
import { CONTACT, SITE } from '@/lib/site';
import { breadcrumbJsonLd, jsonLdScript } from '@/lib/seo';

export const metadata: Metadata = {
  title: 'About',
  description:
    'Priscilla Events and Decor is a Nairobi styling studio founded in 2016, with our own florists, lighting and build crew. Meet the team and how we work.',
  alternates: { canonical: '/about' },
  openGraph: {
    title: 'About | Priscilla Events and Decor',
    description:
      'A Nairobi studio that designs, builds and strikes its own work. Founded in 2016, twelve hundred events styled.',
    url: '/about',
    images: [
      {
        url: '/images/florist-at-work.jpg',
        width: 1400,
        height: 932,
        alt: 'A florist arranging a bouquet in the Nairobi studio',
      },
    ],
  },
};

export default function AboutPage() {
  return (
    <>
      <PageHead
        eyebrow="About"
        title="A Nairobi studio that builds its own work"
        intro="Priscilla Events and Decor designs flowers, tables, lighting and full venue dressing for weddings, corporate events, birthdays and private celebrations across Kenya."
        crumbs={[{ name: 'About', href: '/about' }]}
        image="/images/venue-garden-lounge.jpg"
        imageAlt="A garden lounge styled with chandeliers and soft seating"
      />

      <section className="section">
        <div className="shell">
          <div className="split">
            <Reveal>
              <span className="eyebrow">Our story</span>
              <h2 className="section-title">It started with one borrowed van</h2>
              <p>
                Priscilla Wangari styled her first wedding in {SITE.founded} with a borrowed van, two
                friends and a boot full of roses. What she noticed that weekend, and has built the
                studio on since, is that most decor goes wrong before anything is arranged. It goes
                wrong in the planning: in a venue nobody surveyed, a flower that will not hold in
                that heat, a lighting plan that never existed.
              </p>
              <p>
                So Priscilla Events and Decor became a studio that plans as carefully as it arranges.
                We survey venues. We condition our own flowers and arrange them on site rather than
                trucking finished work across town. We own our lighting, drapery and staging, so a
                build day does not depend on three other suppliers arriving on time.
              </p>
              <p>
                Nine years and twelve hundred events later, that is still how it works. Our florists,
                stylists and build crew are on our own payroll, and the person who sketches your
                room is the person standing in it on the morning of your event.
              </p>
            </Reveal>

            <Reveal delay={80} variant="scale">
              <div className="split-media">
                <img
                  src="/images/hero-venue-draped-hall.jpg"
                  alt="A ballroom dressed by the studio, with a draped ceiling and floral tables"
                  width={1400}
                  height={932}
                  loading="lazy"
                  decoding="async"
                />
              </div>
            </Reveal>
          </div>

          <div className="stat-row" style={{ marginTop: 56 }}>
            <div className="stat">
              <div className="n">2016</div>
              <div className="l">Founded in Nairobi</div>
            </div>
            <div className="stat">
              <div className="n">1200</div>
              <div className="l">Events styled</div>
            </div>
            <div className="stat">
              <div className="n">24</div>
              <div className="l">People on the team</div>
            </div>
            <div className="stat">
              <div className="n">38</div>
              <div className="l">Venues surveyed</div>
            </div>
          </div>
        </div>
      </section>

      <section className="section tint-cream" aria-labelledby="values-heading">
        <div className="shell">
          <SectionHead
            eyebrow="How we work"
            id="values-heading"
            title="Four things we do not compromise on"
            lead="They are not slogans. They are the reasons a build day runs quietly."
          />

          <div className="services-grid" style={{ gridTemplateColumns: 'repeat(2, minmax(0,1fr))' }}>
            {[
              {
                title: 'We survey before we quote',
                body: 'Load in access, power, ceiling height, rigging points, floor surface and the neighbours. Every one of those has ended a build day for somebody else, and none of them surprise us.',
              },
              {
                title: 'We arrange on site',
                body: 'Flowers are conditioned at the studio and arranged at the venue. It is slower and it costs us more in labour, and it is the difference between flowers that look right at 8pm and flowers that were photographs at 11am.',
              },
              {
                title: 'We own our stock',
                body: 'Lighting, drapery, staging and furniture are ours. Nothing is sub-hired, so a build day cannot be derailed by another supplier failing to arrive.',
              },
              {
                title: 'We tell you what we cannot do',
                body: 'If a date is not workable, or a budget will not buy the room you have in mind, we say so at the first conversation rather than at the deposit stage. That has cost us bookings and kept us in business.',
              },
            ].map((item, index) => (
              <Reveal key={item.title} delay={index * 60}>
                <article className="service-card" style={{ padding: 26, height: '100%' }}>
                  <h3 className="service-card-title">{item.title}</h3>
                  <p className="service-card-copy" style={{ marginBottom: 0 }}>
                    {item.body}
                  </p>
                </article>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      <section className="section" aria-labelledby="team-heading">
        <div className="shell-wide">
          <SectionHead
            eyebrow="The team"
            id="team-heading"
            title="Who you will actually work with"
            lead="Six of the twenty four people who make up the studio, from the founder to the table designer."
          />
          <TeamGrid />
        </div>
      </section>

      <section className="section tint-blush" aria-labelledby="clients-heading">
        <div className="shell-wide">
          <SectionHead
            eyebrow="Clients"
            id="clients-heading"
            title="In their words"
            lead="First names, event types and the month, with photographs of the work."
          />
          <Testimonials />
        </div>
      </section>

      <section className="section" aria-labelledby="cta-heading">
        <div className="shell" style={{ textAlign: 'center' }}>
          <h2 className="section-title" id="cta-heading">
            Come and see the studio
          </h2>
          <p className="section-lead">
            {CONTACT.studio.display}. Consultations are free, and you will handle fabric, flowers and
            linen samples rather than looking at a screen. {CONTACT.responsePromise}
          </p>
          <div className="hero-actions" style={{ justifyContent: 'center' }}>
            <Link href="/contact" className="btn btn-primary">
              Find the studio
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
          __html: jsonLdScript(
            breadcrumbJsonLd([
              { name: 'Home', path: '/' },
              { name: 'About', path: '/about' },
            ]),
          ),
        }}
      />
    </>
  );
}
