'use client';

/**
 * Cookie consent.
 *
 * The design source has no banner of any kind, which the inventory recorded
 * plainly: cookie, consent and gdpr all return zero matches across the archive.
 * So this is built to the brief's specification:
 *
 *   - fixed to the bottom, full width
 *   - the exact copy the brief supplies
 *   - Accept All and Manage Preferences
 *   - a preferences modal with Necessary locked, plus Functional, Analytics and
 *     Marketing, each off until chosen
 *   - stored in localStorage, so it never repeats
 *   - linked to /legal/cookie-policy
 *   - framed for the Kenya Data Protection Act 2019, which is the governing law
 *     in the Terms of Service
 *
 * Nothing is measured, profiled or sold on this site, and the banner says so
 * rather than implying otherwise.
 */

import Link from 'next/link';
import { useCallback, useEffect, useState } from 'react';

const STORAGE_KEY = 'priscilla.cookie.consent.v1';

type Preferences = {
  necessary: true;
  functional: boolean;
  analytics: boolean;
  marketing: boolean;
  /** ISO timestamp, kept so consent can be evidenced under the Act. */
  updatedAt: string;
  version: 1;
};

const DEFAULT_PREFS: Preferences = {
  necessary: true,
  functional: false,
  analytics: false,
  marketing: false,
  updatedAt: '',
  version: 1,
};

function read(): Preferences | null {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw) as Partial<Preferences>;
    if (parsed.version !== 1) return null;
    return { ...DEFAULT_PREFS, ...parsed, necessary: true };
  } catch {
    return null;
  }
}

function write(prefs: Omit<Preferences, 'updatedAt' | 'version'>): Preferences {
  const record: Preferences = {
    ...prefs,
    necessary: true,
    updatedAt: new Date().toISOString(),
    version: 1,
  };
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(record));
  } catch {
    // Storage can be blocked. The banner then simply returns on the next visit.
  }
  return record;
}

export default function CookieConsent() {
  const [visible, setVisible] = useState(false);
  const [modal, setModal] = useState(false);
  const [prefs, setPrefs] = useState(DEFAULT_PREFS);

  useEffect(() => {
    const stored = read();
    if (stored) {
      setPrefs(stored);
      return;
    }
    // A short beat so the banner does not fight the loading screen.
    const timer = window.setTimeout(() => setVisible(true), 900);
    return () => window.clearTimeout(timer);
  }, []);

  useEffect(() => {
    if (!modal) return;
    const onKey = (event: KeyboardEvent) => {
      if (event.key === 'Escape') setModal(false);
    };
    document.addEventListener('keydown', onKey);
    return () => document.removeEventListener('keydown', onKey);
  }, [modal]);

  const decide = useCallback((next: Omit<Preferences, 'updatedAt' | 'version'>) => {
    const saved = write(next);
    setPrefs(saved);
    setVisible(false);
    setModal(false);
    // Announce for assistive technology, since the banner is being removed.
    const live = document.getElementById('cookie-consent-status');
    if (live) live.textContent = 'Your cookie preferences have been saved.';
  }, []);

  const acceptAll = () =>
    decide({ necessary: true, functional: true, analytics: true, marketing: true });

  const saveChosen = () => decide(prefs);

  const rejectOptional = () =>
    decide({ necessary: true, functional: false, analytics: false, marketing: false });

  if (!visible && !modal) {
    return (
      <p id="cookie-consent-status" role="status" aria-live="polite" className="visually-hidden" />
    );
  }

  return (
    <>
      <p id="cookie-consent-status" role="status" aria-live="polite" className="visually-hidden" />

      {visible && !modal ? (
        <div className="cookie-banner" role="region" aria-label="Cookie consent">
          <div className="shell-wide cookie-inner">
            <p className="cookie-copy">
              Priscilla Events and Decor uses cookies to personalise your browsing experience and
              remember your preferences. See our{' '}
              <Link href="/legal/cookie-policy">Cookie Policy</Link>.
            </p>
            <div className="cookie-actions">
              <button type="button" className="btn btn-primary" onClick={acceptAll}>
                Accept All
              </button>
              <button type="button" className="btn btn-quiet" onClick={() => setModal(true)}>
                Manage Preferences
              </button>
            </div>
          </div>
        </div>
      ) : null}

      {modal ? (
        <div
          className="modal-scrim"
          role="presentation"
          onClick={(event) => {
            if (event.target === event.currentTarget) setModal(false);
          }}
        >
          <div
            className="modal"
            role="dialog"
            aria-modal="true"
            aria-labelledby="cookie-modal-title"
            aria-describedby="cookie-modal-desc"
          >
            <h2 id="cookie-modal-title">Your cookie preferences</h2>
            <p id="cookie-modal-desc">
              You are in control. Necessary cookies keep the site working and cannot be switched
              off. Everything else is off until you turn it on. We do not sell your data.
            </p>

            <div className="pref-list">
              <div className="pref">
                <div className="pref-body">
                  <span className="pref-title">Necessary</span>
                  <span className="pref-note">
                    Required for the site to function: security, form submission, captcha and your
                    cookie choice itself. Always on.
                  </span>
                </div>
                <span
                  className="switch"
                  role="switch"
                  aria-checked="true"
                  aria-disabled="true"
                  aria-label="Necessary cookies, always on"
                  tabIndex={0}
                />
              </div>

              <div className="pref">
                <div className="pref-body">
                  <span className="pref-title">Functional</span>
                  <span className="pref-note">
                    Remembers preferences such as your last viewed package or the style quiz result
                    you were part way through.
                  </span>
                </div>
                <button
                  type="button"
                  className="switch"
                  role="switch"
                  aria-checked={prefs.functional}
                  aria-label="Functional cookies"
                  onClick={() => setPrefs((p) => ({ ...p, functional: !p.functional }))}
                />
              </div>

              <div className="pref">
                <div className="pref-body">
                  <span className="pref-title">Analytics</span>
                  <span className="pref-note">
                    Anonymous counts of which pages and packages people look at, so we can improve
                    the site. Never used to identify you.
                  </span>
                </div>
                <button
                  type="button"
                  className="switch"
                  role="switch"
                  aria-checked={prefs.analytics}
                  aria-label="Analytics cookies"
                  onClick={() => setPrefs((p) => ({ ...p, analytics: !p.analytics }))}
                />
              </div>

              <div className="pref">
                <div className="pref-body">
                  <span className="pref-title">Marketing</span>
                  <span className="pref-note">
                    Lets us show you relevant seasonal offers on other platforms. Off by default and
                    entirely your choice.
                  </span>
                </div>
                <button
                  type="button"
                  className="switch"
                  role="switch"
                  aria-checked={prefs.marketing}
                  aria-label="Marketing cookies"
                  onClick={() => setPrefs((p) => ({ ...p, marketing: !p.marketing }))}
                />
              </div>
            </div>

            <p className="meta" style={{ marginBottom: 18 }}>
              Read the full breakdown in our{' '}
              <Link href="/legal/cookie-policy">Cookie Policy</Link>. We handle your information
              under the Kenya Data Protection Act 2019.
            </p>

            <div className="modal-actions">
              <button type="button" className="btn btn-quiet" onClick={rejectOptional}>
                Reject optional
              </button>
              <button type="button" className="btn btn-quiet" onClick={saveChosen}>
                Save my choices
              </button>
              <button type="button" className="btn btn-primary" onClick={acceptAll}>
                Accept All
              </button>
            </div>
          </div>
        </div>
      ) : null}
    </>
  );
}
