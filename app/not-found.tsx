import Link from 'next/link';
import type { Metadata } from 'next';

import { GalleryPreview } from '@/components/PageHead';
import { CONTACT } from '@/lib/site';

/**
 * 404.
 *
 * The design source ships no 404 page at all, which the inventory recorded: the
 * string 404 does not appear anywhere in the archive. So this is built to the
 * brief: the exact copy, a "Back to Our Portfolio." call to action, and a gallery
 * preview below it so a lost visitor lands somewhere useful rather than at a dead
 * end.
 */
export const metadata: Metadata = {
  title: 'Page not found',
  description:
    'This page could not be found. Browse the Priscilla Events and Decor portfolio instead, or talk to our team about your event.',
  robots: { index: false, follow: true },
};

export default function NotFound() {
  return (
    <section className="error-page">
      <div className="shell">
        <div className="error-inner">
          <p className="error-code">404</p>
          <span className="eyebrow">Page not found</span>
          <h1>This page could not be found.</h1>
          <p>
            The link may be old, or the page may have moved. Nothing is lost. The work is all still
            here, and our team is one message away.
          </p>

          <div className="error-actions">
            <Link href="/portfolio" className="btn btn-primary">
              Back to Our Portfolio.
            </Link>
            <Link href="/" className="btn btn-quiet">
              Go to the home page
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

          <div className="error-gallery">
            <h2 className="section-title" style={{ fontSize: 'var(--fs-h4)' }}>
              A few recent rooms
            </h2>
            <GalleryPreview count={4} />
          </div>

          <p className="meta" style={{ marginTop: 30 }}>
            Looking for something specific? Try the{' '}
            <Link href="/services">services</Link>, the{' '}
            <Link href="/packages">packages</Link>, the <Link href="/blog">journal</Link>, or{' '}
            <Link href="/contact">contact us</Link> directly.
          </p>
        </div>
      </div>
    </section>
  );
}
