import Link from 'next/link';
import type { Metadata } from 'next';

import Hero from '@/components/Hero';
import ServicesGrid from '@/components/ServicesGrid';
import PackagesGrid from '@/components/PackagesGrid';
import TeamGrid from '@/components/TeamGrid';
import Testimonials from '@/components/Testimonials';
import Faq from '@/components/Faq';
import PostCard from '@/components/PostCard';
import PortfolioGallery from '@/components/PortfolioGallery';
import NewsletterForm from '@/components/NewsletterForm';
import Reveal from '@/components/Reveal';
import { SectionHead } from '@/components/PageHead';
import { InstagramStrip } from '@/components/Footer';

import { SERVICES } from '@/lib/services';
import { PACKAGES, formatKes } from '@/lib/packages';
import { PORTFOLIO, PORTFOLIO_BY_DATE } from '@/lib/portfolio';
import { getAllPosts } from '@/lib/blog';
import { CONTACT, SITE } from '@/lib/site';
import { faqJsonLd, jsonLdScript } from '@/lib/seo';

export const metadata: Metadata = {
  title: `${SITE.name} | ${SITE.tagline}`,
  description: SITE.description,
  alternates: { canonical: '/' },
};

/** The questions answered on this page, and therefore marked up as FAQ data. */
const HOME_FAQS = [
  {
    question: 'How far in advance should I book Priscilla Events and Decor?',
    answer:
      'For weddings we recommend nine to twelve months, which lets us secure flowers at the right price and hold your date properly. Corporate events are usually four to eight weeks ahead. If your date is closer than that, still ask. We hold some capacity for short notice work and will tell you honestly what is possible.',
  },
  {
    question: 'What does the deposit look like?',
    answer:
      'A 50% deposit confirms your date. The balance is due 14 days before the event. The full terms, including what happens if you need to move a date, are set out in our Terms of Service.',
  },
  {
    question: 'Do you travel outside Nairobi?',
    answer:
      'Yes. We work across Kenya, including Kiambu, Kajiado, Nanyuki, Naivasha, Nakuru and the coast. Travel and accommodation are quoted separately and shown as their own line on your quotation so nothing is hidden.',
  },
  {
    question: 'Can you work with our venue or planner?',
    answer:
      'We do this constantly. We are happy to be led by a planner or by the venue team, and we will bring our own load in plan, insurance details and site compliance paperwork where the venue asks for it.',
  },
  {
    question: 'What is the smallest event you take on?',
    answer:
      'The Essential Package suits up to 80 guests, and we have styled dinners for two. If you have a small brief and a date we can meet, we will quote it.',
  },
];

export default function HomePage() {
  const latestPosts = getAllPosts().slice(0, 3);
  const galleryPreview = PORTFOLIO_BY_DATE.slice(0, 8);
  const cheapest = Math.min(...PACKAGES.map((item) => item.startingPrice));

  return (
    <>
      <Hero />

      {/* 1. Services, eight cards in a four column grid. */}
      <section className="section tint-cream" id="services" aria-labelledby="services-heading">
        <div className="shell-wide">
          <SectionHead
            eyebrow="What we do"
            id="services-heading"
            title="Eight ways we dress a room"
            lead="Floral design, lighting, tables, backdrops and full venue transformations, all built by our own team. Every service can stand alone or be combined into a package."
          />
          <ServicesGrid services={SERVICES} />
        </div>
      </section>

      {/* 2. Portfolio preview. */}
      <section className="section" id="portfolio" aria-labelledby="portfolio-heading">
        <div className="shell-wide">
          <SectionHead
            eyebrow="Portfolio"
            id="portfolio-heading"
            title="Recent rooms we have dressed"
            lead="Weddings, birthdays, corporate galas and intimate dinners across Nairobi and beyond. Filter by event type, or open one to see the venue, the date and what we built."
          />
          <PortfolioGallery events={galleryPreview} />
          <div style={{ textAlign: 'center', marginTop: 30 }}>
            <Link href="/portfolio" className="btn btn-quiet">
              See the full portfolio
            </Link>
          </div>
        </div>
      </section>

      {/* 3. Packages. */}
      <section className="section tint-sand" id="packages" aria-labelledby="packages-heading">
        <div className="shell-wide">
          <SectionHead
            eyebrow="Packages"
            id="packages-heading"
            title="Three packages, clear from the start"
            lead={`Starting from ${formatKes(cheapest)}, every package lists exactly what is included so you can compare honestly. A 50% deposit confirms your date.`}
          />
          <PackagesGrid />
          <p className="meta" style={{ textAlign: 'center', marginTop: 30 }}>
            Need something outside these three?{' '}
            <Link href="/enquire?intent=package">Tell us the brief</Link> and we will quote it.
          </p>
        </div>
      </section>

      {/* 4. Why Priscilla, with a photograph. */}
      <section className="section" aria-labelledby="why-heading">
        <div className="shell">
          <div className="split">
            <Reveal variant="scale">
              <div className="split-media">
                <img
                  src="/images/florist-at-work.jpg"
                  alt="A Priscilla Events florist arranging a bouquet in the studio"
                  width={1400}
                  height={932}
                  loading="lazy"
                  decoding="async"
                />
              </div>
            </Reveal>

            <Reveal delay={80}>
              <span className="eyebrow">Why Priscilla</span>
              <h2 className="section-title" id="why-heading">
                One team, from the first sketch to the last strike
              </h2>
              <p>
                We are a Nairobi studio, not a broker. Our florists, stylists and build crew are on
                our own payroll, which is why the room at 6pm looks like the mood board you approved
                three months earlier.
              </p>
              <ul className="package-list">
                <li>
                  <i className="bi bi-check2" aria-hidden="true" />
                  <span>Founded in {SITE.founded}, 1200 events styled across Kenya</span>
                </li>
                <li>
                  <i className="bi bi-check2" aria-hidden="true" />
                  <span>Flowers conditioned and arranged on site, never trucked in finished</span>
                </li>
                <li>
                  <i className="bi bi-check2" aria-hidden="true" />
                  <span>Our own lighting, drapery and staging stock, so nothing is sub-hired</span>
                </li>
                <li>
                  <i className="bi bi-check2" aria-hidden="true" />
                  <span>{CONTACT.responsePromise}</span>
                </li>
              </ul>
              <div className="step-actions" style={{ borderTop: 'none', paddingTop: 0 }}>
                <Link href="/about" className="btn btn-quiet">
                  More about the studio
                </Link>
                <Link href="/style-quiz" className="btn btn-primary">
                  Take the style quiz
                </Link>
              </div>
            </Reveal>
          </div>

          <div className="stat-row" style={{ marginTop: 56 }}>
            <div className="stat">
              <div className="n">1200</div>
              <div className="l">Events styled</div>
            </div>
            <div className="stat">
              <div className="n">9</div>
              <div className="l">Years in Nairobi</div>
            </div>
            <div className="stat">
              <div className="n">38</div>
              <div className="l">Venues we know well</div>
            </div>
            <div className="stat">
              <div className="n">4h</div>
              <div className="l">Enquiry response time</div>
            </div>
          </div>
        </div>
      </section>

      {/* 5. Meet the team. */}
      <section className="section tint-blush" id="team" aria-labelledby="team-heading">
        <div className="shell-wide">
          <SectionHead
            eyebrow="Meet the team"
            id="team-heading"
            title="The people who build your room"
            lead="Stylists, florists and coordinators who will be on site on the day. Hover a card, or tab to it, to hear how they think about the work."
          />
          <TeamGrid />
        </div>
      </section>

      {/* 6. Testimonials. */}
      <section className="section" id="testimonials" aria-labelledby="testimonials-heading">
        <div className="shell-wide">
          <SectionHead
            eyebrow="Testimonials"
            id="testimonials-heading"
            title="What our clients say afterwards"
            lead="First names only, with the event and the month, and a photograph of the work they are describing."
          />
          <Testimonials />
        </div>
      </section>

      {/* 7. Bridal consultation and the style quiz. */}
      <section className="section tint-cream" aria-labelledby="bridal-heading">
        <div className="shell">
          <div className="split">
            <Reveal>
              <span className="eyebrow">For wedding clients</span>
              <h2 className="section-title" id="bridal-heading">
                A bridal consultation, before any numbers
              </h2>
              <p>
                Meet the bridal team, walk through fabrics, flowers and lighting in person, and leave
                with a plan you can budget against. Consultations are free, take about ninety
                minutes, and happen at our Ngara studio or virtually.
              </p>
              <div className="step-actions" style={{ borderTop: 'none', paddingTop: 0 }}>
                <Link href="/bridal" className="btn btn-primary">
                  Book a bridal consultation
                </Link>
                <Link href="/style-quiz" className="btn btn-quiet">
                  Find your style first
                </Link>
              </div>
            </Reveal>

            <Reveal delay={80} variant="scale">
              <div className="split-media">
                <img
                  src="/images/floral-bridal-bouquet.jpg"
                  alt="A bridal bouquet of roses held beside a dressed ceremony aisle"
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

      {/* 8. Blog preview. */}
      <section className="section" id="blog" aria-labelledby="blog-heading">
        <div className="shell-wide">
          <SectionHead
            eyebrow="Journal"
            id="blog-heading"
            title="Notes from the studio"
            lead="What we are seeing across Nairobi venues, how to plan a palette, and what is at its best each season."
          />
          <div className="post-grid">
            {latestPosts.map((post, index) => (
              <Reveal key={post.slug} delay={index * 70}>
                <PostCard post={post} />
              </Reveal>
            ))}
          </div>
          <div style={{ textAlign: 'center', marginTop: 30 }}>
            <Link href="/blog" className="btn btn-quiet">
              Read all articles
            </Link>
          </div>
        </div>
      </section>

      {/* 9. Newsletter. */}
      <section className="section tint-sand" id="newsletter" aria-labelledby="newsletter-heading">
        <div className="shell">
          <div className="newsletter">
            <div>
              <span className="eyebrow">Newsletter</span>
              <h2 id="newsletter-heading">Monthly decor inspiration and seasonal offers.</h2>
              <p>
                One email a month. Flowers at their best, venues we are working in, and the offers we
                only send to subscribers. Unsubscribe in one click.
              </p>
            </div>
            <NewsletterForm />
          </div>
        </div>
      </section>

      {/* 10. Questions. */}
      <section className="section" aria-labelledby="faq-heading">
        <div className="shell">
          <SectionHead
            eyebrow="Questions"
            id="faq-heading"
            title="The things clients ask first"
            lead="If your question is not here, message the team on WhatsApp. We answer honestly, including when the answer is that we are not the right studio for a brief."
          />
          <Faq items={HOME_FAQS} />
        </div>
      </section>

      {/* 11. Instagram. */}
      <InstagramStrip />

      {/* 12. Closing call to action. */}
      <section className="section" aria-labelledby="cta-heading">
        <div className="shell" style={{ textAlign: 'center' }}>
          <span className="eyebrow">Ready when you are</span>
          <h2 className="section-title" id="cta-heading">
            Tell us about your event
          </h2>
          <p className="section-lead">
            Six short steps, about three minutes. We respond to all enquiries within 4 hours during
            working hours.
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
              <i className="bi bi-whatsapp" aria-hidden="true" /> WhatsApp {CONTACT.phoneDisplay}
            </a>
          </div>
        </div>
      </section>

      <script
        type="application/ld+json"
        // eslint-disable-next-line react/no-danger
        dangerouslySetInnerHTML={{ __html: jsonLdScript(faqJsonLd(HOME_FAQS)) }}
      />
    </>
  );
}
