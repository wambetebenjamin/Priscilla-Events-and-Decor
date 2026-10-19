'use client';

/**
 * reCAPTCHA v3, in the browser.
 *
 * The token contract matches the design source's own validator, which the
 * inventory recorded verbatim from assets/vendor/php-email-form/validate.js:
 *
 *   grecaptcha.execute(recaptcha, {action: 'php_email_form_submit'})
 *     .then(token => formData.set('recaptcha-response', token))
 *
 * The action name and the field name are kept exactly. The site key is public by
 * design and comes from NEXT_PUBLIC_RECAPTCHA_SITE_KEY. The secret key never
 * appears anywhere in this file or in any client bundle.
 *
 * When no site key is configured the hook reports `configured: false` and the
 * form simply submits without a token. The server treats that the same way it
 * treats a missing secret, and the README says so plainly.
 */

import { useCallback, useEffect, useRef, useState } from 'react';

export const RECAPTCHA_ACTION = 'php_email_form_submit';

type Grecaptcha = {
  ready: (callback: () => void) => void;
  execute: (siteKey: string, options: { action: string }) => Promise<string>;
  render: (
    container: HTMLElement,
    parameters: { sitekey: string; callback: (token: string) => void; theme?: 'light' | 'dark' },
  ) => number;
  reset: (widgetId?: number) => void;
};

declare global {
  interface Window {
    grecaptcha?: Grecaptcha;
  }
}

const SCRIPT_ID = 'recaptcha-v3-script';

/** Loads the v3 script once per page, no matter how many forms are on it. */
function loadV3(siteKey: string): Promise<void> {
  return new Promise((resolve, reject) => {
    if (typeof window === 'undefined') return resolve();
    if (window.grecaptcha) return resolve();

    const existing = document.getElementById(SCRIPT_ID) as HTMLScriptElement | null;
    if (existing) {
      existing.addEventListener('load', () => resolve());
      existing.addEventListener('error', () => reject(new Error('reCAPTCHA failed to load')));
      return;
    }

    const script = document.createElement('script');
    script.id = SCRIPT_ID;
    script.src = `https://www.google.com/recaptcha/api.js?render=${encodeURIComponent(siteKey)}`;
    script.async = true;
    script.defer = true;
    script.onload = () => resolve();
    script.onerror = () => reject(new Error('reCAPTCHA failed to load'));
    document.head.appendChild(script);
  });
}

export type RecaptchaState = {
  /** A v3 site key is present, so tokens can be produced. */
  configured: boolean;
  /** The browser has the v3 API and a token can be requested right now. */
  ready: boolean;
  /** The v2 site key, present only when the fallback is available. */
  v2SiteKey: string;
  /** True once the server has asked for the v2 challenge. */
  needsV2: boolean;
  /** Request that the v2 challenge be shown. */
  requestV2: () => void;
  /** Clear the challenge, for example after a successful resubmission. */
  clearV2: () => void;
  /** Fetch a fresh v3 token. Resolves to null when not configured. */
  getToken: () => Promise<string | null>;
};

export function useRecaptcha(): RecaptchaState {
  const siteKey = process.env.NEXT_PUBLIC_RECAPTCHA_SITE_KEY ?? '';
  const v2SiteKey = process.env.NEXT_PUBLIC_RECAPTCHA_V2_SITE_KEY ?? '';
  const [ready, setReady] = useState(false);
  const [needsV2, setNeedsV2] = useState(false);
  const mounted = useRef(true);

  useEffect(() => {
    mounted.current = true;
    if (!siteKey) return;

    loadV3(siteKey)
      .then(() => {
        if (!mounted.current || !window.grecaptcha) return;
        window.grecaptcha.ready(() => {
          if (mounted.current) setReady(true);
        });
      })
      .catch(() => {
        // A blocked script is the one case where the fallback genuinely matters.
        if (mounted.current && v2SiteKey) setNeedsV2(true);
      });

    return () => {
      mounted.current = false;
    };
  }, [siteKey, v2SiteKey]);

  const getToken = useCallback(async (): Promise<string | null> => {
    if (!siteKey || !window.grecaptcha) return null;
    try {
      const token = await new Promise<string>((resolve, reject) => {
        window.grecaptcha?.ready(() => {
          window.grecaptcha
            ?.execute(siteKey, { action: RECAPTCHA_ACTION })
            .then(resolve)
            .catch(reject);
        });
      });
      return token;
    } catch {
      return null;
    }
  }, [siteKey]);

  return {
    configured: Boolean(siteKey),
    ready,
    v2SiteKey,
    needsV2,
    requestV2: () => setNeedsV2(true),
    clearV2: () => setNeedsV2(false),
    getToken,
  };
}
