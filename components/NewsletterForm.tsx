'use client';

/**
 * Newsletter signup, reCAPTCHA v3 protected, posting to /api/newsletter.
 * The form carries the same data-recaptcha-site-key contract the design source
 * used, so the integration reads the same way it did in the template.
 */

import { useState } from 'react';
import { useFormSubmit } from './use-form-submit';
import CaptchaFallback from './CaptchaFallback';

export default function NewsletterForm() {
  const [email, setEmail] = useState('');
  const { state, submit, reset, captcha } = useFormSubmit('/api/newsletter');
  const [v2Token, setV2Token] = useState<string | null>(null);

  const siteKey = process.env.NEXT_PUBLIC_RECAPTCHA_SITE_KEY ?? '';

  async function onSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (state.status === 'submitting') return;
    const form = event.currentTarget;
    const honeypot = (form.elements.namedItem('company-website') as HTMLInputElement | null)?.value ?? '';
    const startedAt = (form.elements.namedItem('form-started-at') as HTMLInputElement | null)?.value ?? '';

    const accepted = await submit(
      {
        email,
        'company-website': honeypot,
        'form-started-at': Number.parseInt(startedAt, 10) || 0,
      },
      v2Token,
    );

    if (accepted) setEmail('');
  }

  return (
    <form
      className="newsletter-form"
      onSubmit={onSubmit}
      data-recaptcha-site-key={siteKey}
      noValidate
    >
      <input
        type="text"
        name="company-website"
        tabIndex={-1}
        autoComplete="off"
        aria-hidden="true"
        style={{ position: 'absolute', left: '-9999px', width: 1, height: 1 }}
      />
      <input type="hidden" name="form-started-at" value={Date.now()} />

      <label className="visually-hidden" htmlFor="newsletter-email">
        Your email address
      </label>
      <input
        id="newsletter-email"
        className="input"
        type="email"
        name="email"
        required
        autoComplete="email"
        placeholder="you@example.com"
        value={email}
        onChange={(event) => setEmail(event.target.value)}
        aria-invalid={state.status === 'error'}
      />

      <button type="submit" className="btn btn-primary" disabled={state.status === 'submitting'}>
        {state.status === 'submitting' ? 'Subscribing' : 'Subscribe'}
      </button>

      <div className="loading d-block" style={{ display: state.status === 'submitting' ? 'block' : 'none' }}>
        Sending your details.
      </div>

      {state.status === 'success' ? (
        <p className="form-status is-success" role="status">
          {state.message}
        </p>
      ) : null}

      {state.status === 'error' ? (
        <p className="form-status is-error" role="alert">
          {state.message}
        </p>
      ) : null}

      {state.status === 'challenge' ? (
        <>
          <p className="form-status is-error" role="alert">
            {state.message}
          </p>
          {captcha.needsV2 ? (
            <CaptchaFallback siteKey={captcha.v2SiteKey} onToken={setV2Token} />
          ) : null}
        </>
      ) : null}

      {state.status === 'success' ? (
        <button type="button" className="link-cta" onClick={reset}>
          Send another email address
        </button>
      ) : null}
    </form>
  );
}
