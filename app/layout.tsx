import type { Metadata } from 'next';
import './styles/fonts.css';
import 'bootstrap-icons/font/bootstrap-icons.css';
import './styles/theevent-source.css';
import './styles/priscilla.css';

import Header from '@/components/Header';
import Footer from '@/components/Footer';
import FloatingActions from '@/components/FloatingActions';
import CookieConsent from '@/components/CookieConsent';
import Loader from '@/components/Loader';
import { baseMetadata, jsonLdScript, localBusinessJsonLd, eventVenueJsonLd, websiteJsonLd } from '@/lib/seo';
import { CONTACT, SITE } from '@/lib/site';

/**
 * Stylesheets, in order, and the reason for the order:
 *
 *  1. fonts.css          Self hosted Roboto and Raleway, hand written @font-face
 *                        rules with src, weight and display: swap, plus the
 *                        bootstrap-icons rule copied from the design source with
 *                        only the path changed.
 *  2. bootstrap-icons    The icon font classes (bi bi-*).
 *  3. theevent-source.css  The design source's own main.css, byte for byte, all
 *                        1689 lines of it, kept so the token set is verifiable
 *                        against the original rather than described.
 *  4. priscilla.css      The build's own layer. It re-declares the source tokens
 *                        at :root, then styles every component from them.
 *
 * The build layer loads last so its rules win where they overlap, which is the
 * normal cascade and needs no !important anywhere except where a state has to
 * beat a source default.
 */
export const metadata: Metadata = baseMetadata();

export const viewport = {
  width: 'device-width',
  initialScale: 1,
  themeColor: '#0e1b4d',
  colorScheme: 'light' as const,
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en-KE">
      <head>
        <link rel="preconnect" href="https://www.google.com" />
        <link rel="dns-prefetch" href="https://www.google.com" />
        <link rel="preload" href="/fonts/roboto-latin-400-normal.woff2" as="font" type="font/woff2" crossOrigin="anonymous" />
        <link rel="preload" href="/fonts/raleway-latin-600-normal.woff2" as="font" type="font/woff2" crossOrigin="anonymous" />
      </head>
      <body>
        <a href="#main" className="skip-link">
          Skip to main content
        </a>

        <Loader />
        <Header />

        <main id="main">{children}</main>

        <Footer />
        <FloatingActions />
        <CookieConsent />

        <script
          type="application/ld+json"
          // eslint-disable-next-line react/no-danger
          dangerouslySetInnerHTML={{
            __html: jsonLdScript([localBusinessJsonLd(), eventVenueJsonLd(), websiteJsonLd()]),
          }}
        />

        {/* A last resort link for a browser with no JavaScript at all. */}
        <noscript>
          <div className="shell-wide" style={{ padding: '16px 0' }}>
            <p style={{ margin: 0 }}>
              JavaScript is off, so the voice tour and the cookie banner cannot run. Everything
              else works, including every form. Prefer to talk? WhatsApp{' '}
              <a href={CONTACT.whatsappLink}>{CONTACT.phoneDisplay}</a> or email{' '}
              <a href={`mailto:${CONTACT.email}`}>{CONTACT.email}</a>. {CONTACT.responsePromise}
            </p>
          </div>
        </noscript>
      </body>
    </html>
  );
}
