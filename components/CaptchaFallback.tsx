'use client';

/**
 * The reCAPTCHA v2 fallback.
 *
 * Rendered only when the server reported that the v3 score came in below the
 * threshold the brief sets, which is 0.5, or when the v3 script could not load at
 * all. It renders the standard v2 checkbox and hands the token back to the form,
 * which resubmits with it attached. The v2 secret is verified server side by
 * lib/captcha.ts.
 */

import { useEffect, useRef, useState } from 'react';

type Props = {
  siteKey: string;
  onToken: (token: string) => void;
};

const SCRIPT_ID = 'recaptcha-v2-script';

export default function CaptchaFallback({ siteKey, onToken }: Props) {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const [loaded, setLoaded] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!siteKey) return;

    let cancelled = false;

    const render = () => {
      if (cancelled || !containerRef.current || !window.grecaptcha?.render) return;
      try {
        window.grecaptcha.render(containerRef.current, {
          sitekey: siteKey,
          theme: 'light',
          callback: (token: string) => onToken(token),
        });
        setLoaded(true);
      } catch {
        setError('The security check could not be displayed. Please reload the page.');
      }
    };

    const existing = document.getElementById(SCRIPT_ID) as HTMLScriptElement | null;
    if (existing) {
      if (window.grecaptcha) render();
      else existing.addEventListener('load', render);
      return () => {
        cancelled = true;
      };
    }

    const script = document.createElement('script');
    script.id = SCRIPT_ID;
    script.src = 'https://www.google.com/recaptcha/api.js?render=explicit';
    script.async = true;
    script.defer = true;
    script.onload = render;
    script.onerror = () =>
      setError('The security check could not be loaded. Please message us on WhatsApp instead.');
    document.head.appendChild(script);

    return () => {
      cancelled = true;
    };
  }, [siteKey, onToken]);

  if (!siteKey) {
    return (
      <p className="field-error" role="alert">
        The security check is not configured, so this form cannot be submitted right now. Message us
        on WhatsApp on 0112 272 061 and we will take your details directly.
      </p>
    );
  }

  return (
    <div className="field">
      <span className="field-label">Security check</span>
      <div ref={containerRef} />
      {!loaded && !error ? (
        <span className="hint">Loading the security check.</span>
      ) : null}
      {error ? (
        <span className="field-error" role="alert">
          {error}
        </span>
      ) : null}
      <span className="hint">
        This site is protected by reCAPTCHA. Google&apos;s Privacy Policy and Terms of Service apply.
      </span>
    </div>
  );
}

/*
  The `grecaptcha` global is declared once, in components/use-recaptcha.ts, and
  this component relies on that declaration rather than declaring it again. Two
  declarations of the same Window property with different shapes is a TypeScript
  error, and one source of truth is the right answer anyway.
*/
