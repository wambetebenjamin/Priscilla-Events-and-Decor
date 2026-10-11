import Link from 'next/link';
import Brand from './Brand';
import NewsletterForm from './NewsletterForm';
import { CONTACT, FOOTER_LINKS, SITE, SOCIAL } from '@/lib/site';

/**
 * The Instagram strip and the footer.
 *
 * Instagram is given the prominence the brief asks for: a six photograph strip,
 * full width, linked from the social row and from the strip itself. On mobile the
 * strip becomes a horizontal scroller rather than a shrunken grid.
 */

const INSTAGRAM_STRIP = [
  { src: '/images/hero-venue-draped-hall.jpg', alt: 'A draped ballroom ceiling above dressed tables' },
  { src: '/images/floral-bridal-bouquet.jpg', alt: 'A bridal bouquet of roses' },
  { src: '/images/venue-garden-aisle.jpg', alt: 'A garden aisle dressed with flowers and draping' },
  { src: '/images/birthday-gold-setup.jpg', alt: 'A golden birthday setup with a cake' },
  { src: '/images/service-corporate-events.jpg', alt: 'A corporate event hall set for dinner' },
  { src: '/images/portfolio-intimate-table.jpg', alt: 'A candlelit table set for an intimate dinner' },
];

export function InstagramStrip() {
  return (
    <section aria-labelledby="instagram-heading" className="section" style={{ padding: '56px 0 0' }}>
      <div className="shell-wide">
        <div className="section-head" style={{ marginBottom: 26 }}>
          <span className="eyebrow">Instagram</span>
          <h2 id="instagram-heading" className="section-title">
            Follow the work as it happens
          </h2>
          <p className="section-lead" style={{ marginBottom: 0 }}>
            Behind the build, finished rooms and the details we photograph at the end of a long
            night. Follow{' '}
            <a href={SOCIAL.instagram} target="_blank" rel="noopener noreferrer">
              @priscillaeventsanddecor
            </a>
            .
          </p>
        </div>
      </div>
      <div className="instagram-strip">
        {INSTAGRAM_STRIP.map((photo) => (
          <a key={photo.src} href={SOCIAL.instagram} target="_blank" rel="noopener noreferrer" aria-label={`${photo.alt}. Open our Instagram.`}>
            <img src={photo.src} alt={photo.alt} width={400} height={400} loading="lazy" decoding="async" />
          </a>
        ))}
      </div>
    </section>
  );
}

export default function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className="footer site-footer" id="footer">
      <div className="shell-wide">
        <div className="footer-grid">
          <div className="footer-brand">
            <Brand />
            <p>
              Floral design, event styling and venue dressing for weddings, galas, corporate events
              and celebrations across Nairobi and Kenya.
            </p>
            <p style={{ marginBottom: 18 }}>
              <strong style={{ color: '#ffffff' }}>{CONTACT.responsePromise}</strong>
            </p>
            <div className="footer-social">
              <a
                href={SOCIAL.instagram}
                className="is-primary"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Priscilla Events and Decor on Instagram"
              >
                <i className="bi bi-instagram" aria-hidden="true" />
              </a>
              <a
                href={CONTACT.whatsappLink}
                target="_blank"
                rel="noopener noreferrer"
                aria-label="WhatsApp the Priscilla Events team"
              >
                <i className="bi bi-whatsapp" aria-hidden="true" />
              </a>
              <a
                href={SOCIAL.facebook}
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Priscilla Events and Decor on Facebook"
              >
                <i className="bi bi-facebook" aria-hidden="true" />
              </a>
              <a
                href={SOCIAL.tiktok}
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Priscilla Events and Decor on TikTok"
              >
                <i className="bi bi-tiktok" aria-hidden="true" />
              </a>
              <a
                href={SOCIAL.pinterest}
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Priscilla Events and Decor on Pinterest"
              >
                <i className="bi bi-pinterest" aria-hidden="true" />
              </a>
            </div>
          </div>

          <div className="footer-col">
            <h3>Services</h3>
            <ul>
              {FOOTER_LINKS.services.map((item) => (
                <li key={item.href + item.label}>
                  <Link href={item.href}>{item.label}</Link>
                </li>
              ))}
            </ul>
          </div>

          <div className="footer-col">
            <h3>Explore</h3>
            <ul>
              {FOOTER_LINKS.explore.map((item) => (
                <li key={item.href}>
                  <Link href={item.href}>{item.label}</Link>
                </li>
              ))}
            </ul>
            <h3 style={{ marginTop: 20 }}>Get in touch</h3>
            <ul>
              {FOOTER_LINKS.act.map((item) => (
                <li key={item.href}>
                  <Link href={item.href}>{item.label}</Link>
                </li>
              ))}
            </ul>
          </div>

          <div className="footer-col">
            <h3>Studio</h3>
            <ul>
              <li>
                <address style={{ fontStyle: 'normal', color: 'rgba(255,255,255,0.82)' }}>
                  {CONTACT.studio.street}
                  <br />
                  {CONTACT.studio.city} {CONTACT.studio.postalCode}
                  <br />
                  {CONTACT.studio.countryName}
                </address>
              </li>
              <li>
                <a href={CONTACT.phoneHref}>{CONTACT.phoneDisplay}</a>
              </li>
              <li>
                <a href={`mailto:${CONTACT.email}`}>{CONTACT.email}</a>
              </li>
              <li>
                <a href={CONTACT.whatsappLink} target="_blank" rel="noopener noreferrer">
                  WhatsApp the events team
                </a>
              </li>
            </ul>

            <h3 style={{ marginTop: 20 }}>Newsletter</h3>
            <p style={{ color: 'rgba(255,255,255,0.72)', fontSize: 15, marginBottom: 12 }}>
              Monthly decor inspiration and seasonal offers.
            </p>
            <NewsletterForm />
          </div>
        </div>

        <div className="footer-bottom">
          <p style={{ margin: 0 }}>
            &copy; {year} {SITE.legalName}. All rights reserved. Registered in Kenya.
          </p>
          <nav className="footer-legal" aria-label="Legal">
            {FOOTER_LINKS.legal.map((item) => (
              <Link key={item.href} href={item.href}>
                {item.label}
              </Link>
            ))}
            <Link href="/sitemap.xml">Sitemap</Link>
          </nav>
        </div>
      </div>
    </footer>
  );
}
