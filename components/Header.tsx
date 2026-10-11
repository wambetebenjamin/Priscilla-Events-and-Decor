'use client';

/**
 * Sticky navigation.
 *
 * Behaviour carried over from the design source's main.js, at the same numbers:
 *   - the scrolled state flips at window.scrollY > 100
 *   - the header transition is 0.5s
 *   - the scrolled header carries the source's 18px soft shadow
 *   - the mobile menu is a slide in drawer, and it closes on any nav click
 *   - the active link follows the current section or route
 *
 * On interior pages the bar starts solid so the light navigation is always
 * readable over a dark page header, which is what the source does with its
 * `fixed-top` plus `.scrolled` combination.
 */

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useCallback, useEffect, useState } from 'react';
import Brand from './Brand';
import { CONTACT, NAV } from '@/lib/site';

export default function Header() {
  const pathname = usePathname();
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);

  const isHome = pathname === '/';

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 100);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  // Any route change closes the drawer, matching the source's nav click handler.
  useEffect(() => {
    setOpen(false);
  }, [pathname]);

  // Escape closes the drawer, and the body is locked while it is open.
  useEffect(() => {
    if (!open) return;
    const onKey = (event: KeyboardEvent) => {
      if (event.key === 'Escape') setOpen(false);
    };
    document.addEventListener('keydown', onKey);
    const previous = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => {
      document.removeEventListener('keydown', onKey);
      document.body.style.overflow = previous;
    };
  }, [open]);

  const isActive = useCallback(
    (href: string) => {
      if (href === '/') return pathname === '/';
      if (href.startsWith('/#')) return false;
      return pathname === href || pathname.startsWith(`${href}/`);
    },
    [pathname],
  );

  return (
    <>
      <header
        id="header"
        className={`header site-header ${scrolled || !isHome ? 'is-scrolled' : ''} ${!isHome ? 'is-solid' : ''}`}
      >
        <div className="shell-wide header-inner">
          <Brand />

          <nav className="nav" aria-label="Primary">
            {NAV.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className={isActive(item.href) ? 'is-active' : undefined}
                aria-current={isActive(item.href) ? 'page' : undefined}
              >
                {item.label}
              </Link>
            ))}
          </nav>

          <Link href="/enquire" className="btn btn-primary btn-sm header-cta">
            Get a Quote
          </Link>

          <button
            type="button"
            className="mobile-toggle"
            aria-label={open ? 'Close menu' : 'Open menu'}
            aria-expanded={open}
            aria-controls="mobile-drawer"
            onClick={() => setOpen((value) => !value)}
          >
            <i className={open ? 'bi bi-x-lg' : 'bi bi-list'} aria-hidden="true" />
          </button>
        </div>
      </header>

      <div
        className={`drawer-scrim ${open ? 'is-open' : ''}`}
        onClick={() => setOpen(false)}
        aria-hidden="true"
      />

      <aside
        id="mobile-drawer"
        className={`drawer ${open ? 'is-open' : ''}`}
        aria-hidden={!open}
        aria-label="Menu"
      >
        <div className="drawer-head">
          <span className="brand-name">Priscilla Events</span>
          <button
            type="button"
            className="drawer-close"
            onClick={() => setOpen(false)}
            aria-label="Close menu"
          >
            <i className="bi bi-x-lg" aria-hidden="true" />
          </button>
        </div>

        <nav aria-label="Mobile">
          {NAV.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className={isActive(item.href) ? 'is-active' : undefined}
              tabIndex={open ? 0 : -1}
            >
              {item.label}
            </Link>
          ))}
          <Link href="/style-quiz" tabIndex={open ? 0 : -1}>
            Style Quiz
          </Link>
          <Link href="/bridal" tabIndex={open ? 0 : -1}>
            Bridal Consultation
          </Link>
        </nav>

        <div className="drawer-foot">
          <Link href="/enquire" className="btn btn-primary btn-block" tabIndex={open ? 0 : -1}>
            Get a Quote
          </Link>
          <a
            href={CONTACT.whatsappLink}
            className="btn btn-quiet btn-block"
            target="_blank"
            rel="noopener noreferrer"
            tabIndex={open ? 0 : -1}
          >
            <i className="bi bi-whatsapp" aria-hidden="true" /> WhatsApp us
          </a>
        </div>

        <div className="drawer-contact">
          <a href={CONTACT.phoneHref} tabIndex={open ? 0 : -1}>
            <i className="bi bi-telephone" aria-hidden="true" /> {CONTACT.phoneDisplay}
          </a>
          <a href={`mailto:${CONTACT.email}`} tabIndex={open ? 0 : -1}>
            <i className="bi bi-envelope" aria-hidden="true" /> {CONTACT.email}
          </a>
          <p style={{ marginTop: 12 }}>{CONTACT.studio.display}</p>
        </div>
      </aside>
    </>
  );
}
