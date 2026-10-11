'use client';

import Link from 'next/link';
import { useEffect } from 'react';

import { CONTACT } from '@/lib/site';

/**
 * 500.
 *
 * The design source has no error page either, so this is built to the brief: the
 * exact copy, a Try Again button, and the WhatsApp number visible so a client is
 * never stranded when the server fails.
 *
 * The digest is shown only in development, because in production it is an opaque
 * hash that means nothing to a visitor.
 */
export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    // Surface the failure so it reaches the hosting logs rather than vanishing.
    console.error('[priscilla] page error:', error.message, error.digest ?? '');
  }, [error]);

  return (
    <section className="error-page">
      <div className="shell">
        <div className="error-inner">
          <p className="error-code">500</p>
          <span className="eyebrow">Server error</span>
          <h1>Something went wrong. We are fixing it.</h1>
          <p>
            This is on our side, not yours. Nothing you were filling in has been sent, so please try
            again. If it happens twice, message us on WhatsApp and we will take your details
            directly.
          </p>

          <div className="error-actions">
            <button type="button" className="btn btn-primary" onClick={reset}>
              Try Again
            </button>
            <a
              href={CONTACT.whatsappLink}
              className="whatsapp-strip"
              target="_blank"
              rel="noopener noreferrer"
            >
              <i className="bi bi-whatsapp" aria-hidden="true" /> WhatsApp {CONTACT.phoneDisplay}
            </a>
          </div>

          <div className="contact-block" style={{ marginTop: 34, maxWidth: 520 }}>
            <div className="contact-item">
              <i className="bi bi-telephone" aria-hidden="true" />
              <div>
                <h3>Call the studio</h3>
                <p>
                  <a href={CONTACT.phoneHref}>{CONTACT.phoneDisplay}</a>
                </p>
              </div>
            </div>
            <div className="contact-item">
              <i className="bi bi-envelope" aria-hidden="true" />
              <div>
                <h3>Email the events team</h3>
                <p>
                  <a href={`mailto:${CONTACT.eventsEmail}`}>{CONTACT.eventsEmail}</a>
                </p>
              </div>
            </div>
          </div>

          {process.env.NODE_ENV !== 'production' && error.digest ? (
            <p className="meta" style={{ marginTop: 24 }}>
              Development reference: {error.digest}
            </p>
          ) : null}

          <p className="meta" style={{ marginTop: 26 }}>
            Or go back to the <Link href="/">home page</Link>, the{' '}
            <Link href="/portfolio">portfolio</Link>, or{' '}
            <Link href="/contact">contact</Link>.
          </p>
        </div>
      </div>
    </section>
  );
}
