'use client';

import { CONTACT } from '@/lib/site';

/**
 * The last resort error page, rendered when the root layout itself fails.
 *
 * It cannot use the site's own layout, so it carries its own minimal markup and
 * inline styles. Same copy as the 500 page, same WhatsApp number visible.
 */
export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <html lang="en-KE">
      <body
        style={{
          margin: 0,
          fontFamily: 'Arial, Helvetica, sans-serif',
          color: '#2f3138',
          background: '#fdf8f4',
          lineHeight: 1.7,
        }}
      >
        <main style={{ maxWidth: 720, margin: '0 auto', padding: '64px 24px' }}>
          <p
            style={{
              fontFamily: 'Georgia, serif',
              fontSize: 72,
              fontWeight: 700,
              color: '#f8d7dc',
              margin: 0,
            }}
          >
            500
          </p>
          <h1 style={{ fontFamily: 'Georgia, serif', color: '#0e1b4d', fontSize: 34 }}>
            Something went wrong. We are fixing it.
          </h1>
          <p>
            This is on our side, not yours. Please try again. If it happens twice, WhatsApp us on{' '}
            {CONTACT.phoneDisplay} and we will take your details directly.
          </p>
          <p style={{ display: 'flex', gap: 12, flexWrap: 'wrap' }}>
            <button
              type="button"
              onClick={reset}
              style={{
                minHeight: 48,
                padding: '0 24px',
                border: 0,
                borderRadius: 50,
                background: '#f82249',
                color: '#ffffff',
                fontSize: 12,
                fontWeight: 700,
                letterSpacing: '0.12em',
                textTransform: 'uppercase',
                cursor: 'pointer',
              }}
            >
              Try Again
            </button>
            <a
              href={CONTACT.whatsappLink}
              style={{
                minHeight: 48,
                display: 'inline-flex',
                alignItems: 'center',
                padding: '0 24px',
                borderRadius: 50,
                background: '#25d366',
                color: '#ffffff',
                textDecoration: 'none',
                fontWeight: 700,
                fontSize: 15,
              }}
            >
              WhatsApp {CONTACT.phoneDisplay}
            </a>
          </p>
          <p style={{ fontSize: 13, color: '#6b6f76' }}>
            {CONTACT.email} | {CONTACT.studio.display}
          </p>
        </main>
      </body>
    </html>
  );
}
