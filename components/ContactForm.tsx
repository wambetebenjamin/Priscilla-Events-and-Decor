'use client';

/**
 * The general contact form.
 *
 * Posts to /api/contact, which stores the message, emails it through Nodemailer
 * and notifies the team on WhatsApp. reCAPTCHA v3 protects it, with the v2
 * fallback and the same data-recaptcha-site-key contract the design source used.
 */

import { useState } from 'react';
import { useFormSubmit } from './use-form-submit';
import CaptchaFallback from './CaptchaFallback';
import { CONTACT, EVENT_TYPES, REFERRAL_SOURCES } from '@/lib/site';
import { isEmail, isValidKenyanPhone, normalisePhone } from '@/lib/validation';

type Fields = {
  name: string;
  email: string;
  phone: string;
  subject: string;
  eventType: string;
  referral: string;
  message: string;
  consent: boolean;
};

const EMPTY: Fields = {
  name: '',
  email: '',
  phone: '',
  subject: '',
  eventType: '',
  referral: '',
  message: '',
  consent: false,
};

export default function ContactForm() {
  const [fields, setFields] = useState<Fields>(EMPTY);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [v2Token, setV2Token] = useState<string | null>(null);
  const [startedAt] = useState(() => Date.now());
  const { state, submit, reset, captcha } = useFormSubmit('/api/contact');
  const siteKey = process.env.NEXT_PUBLIC_RECAPTCHA_SITE_KEY ?? '';

  const set = <K extends keyof Fields>(key: K, value: Fields[K]) => {
    setFields((current) => ({ ...current, [key]: value }));
    setErrors((current) => {
      const next = { ...current };
      delete next[key];
      return next;
    });
  };

  function validate(): boolean {
    const next: Record<string, string> = {};
    if (!fields.name.trim()) next.name = 'What should we call you?';
    if (!fields.email.trim()) next.email = 'We need an email address to reply.';
    else if (!isEmail(fields.email)) next.email = 'That email address does not look right.';
    if (fields.phone.trim() && !isValidKenyanPhone(fields.phone)) {
      next.phone = 'Enter a Kenyan mobile number, for example 0712 345 678.';
    }
    if (!fields.subject.trim()) next.subject = 'Add a short subject line.';
    if (!fields.message.trim()) next.message = 'Tell us a little about what you need.';
    else if (fields.message.trim().length < 10) next.message = 'A sentence or two is enough.';
    if (!fields.consent) next.consent = 'Please confirm you agree to our Privacy Policy.';
    setErrors(next);
    return Object.keys(next).length === 0;
  }

  async function onSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!validate()) return;
    if (state.status === 'submitting') return;

    const form = event.currentTarget;
    const honeypot =
      (form.elements.namedItem('company-website') as HTMLInputElement | null)?.value ?? '';

    await submit(
      {
        ...fields,
        phone: fields.phone ? normalisePhone(fields.phone) : '',
        'company-website': honeypot,
        'form-started-at': startedAt,
      },
      v2Token,
    );
  }

  if (state.status === 'success') {
    return (
      <div className="form-shell" role="status">
        <h2 className="section-title">Message received</h2>
        <p>
          Thank you, {fields.name.split(' ')[0] || 'and welcome'}. Our team reads every message.
          You will hear from us within 4 hours during working hours.
        </p>
        {state.reference ? (
          <p className="summary-row" style={{ borderBottom: 'none' }}>
            <dt>Your reference</dt>
            <dd>{state.reference}</dd>
          </p>
        ) : null}
        <div className="step-actions" style={{ borderTop: 'none', paddingTop: 0 }}>
          <a
            href={CONTACT.whatsappLink}
            className="btn btn-primary"
            target="_blank"
            rel="noopener noreferrer"
          >
            <i className="bi bi-whatsapp" aria-hidden="true" /> Message us on WhatsApp
          </a>
          <button
            type="button"
            className="btn btn-quiet"
            onClick={() => {
              reset();
              setFields(EMPTY);
            }}
          >
            Send another message
          </button>
        </div>
      </div>
    );
  }

  return (
    <form className="form-shell" onSubmit={onSubmit} noValidate data-recaptcha-site-key={siteKey}>
      <input
        type="text"
        name="company-website"
        tabIndex={-1}
        autoComplete="off"
        aria-hidden="true"
        style={{ position: 'absolute', left: '-9999px', width: 1, height: 1 }}
      />
      <input type="hidden" name="form-started-at" value={startedAt} />

      <div className="response-promise">
        <i className="bi bi-clock-history" aria-hidden="true" />
        <strong>{CONTACT.responsePromise}</strong>
      </div>

      <div className="grid-2">
        <div className="field">
          <label htmlFor="contact-name">Your name</label>
          <input
            id="contact-name"
            className="input"
            type="text"
            autoComplete="name"
            value={fields.name}
            onChange={(event) => set('name', event.target.value)}
            aria-invalid={Boolean(errors.name)}
          />
          {errors.name ? (
            <span className="field-error" role="alert">
              {errors.name}
            </span>
          ) : null}
        </div>

        <div className="field">
          <label htmlFor="contact-email">Email address</label>
          <input
            id="contact-email"
            className="input"
            type="email"
            autoComplete="email"
            value={fields.email}
            onChange={(event) => set('email', event.target.value)}
            aria-invalid={Boolean(errors.email)}
          />
          {errors.email ? (
            <span className="field-error" role="alert">
              {errors.email}
            </span>
          ) : null}
        </div>
      </div>

      <div className="grid-2">
        <div className="field">
          <label htmlFor="contact-phone">Phone or WhatsApp, optional</label>
          <input
            id="contact-phone"
            className="input"
            type="tel"
            autoComplete="tel"
            placeholder="0712 345 678"
            value={fields.phone}
            onChange={(event) => set('phone', event.target.value)}
            aria-invalid={Boolean(errors.phone)}
          />
          {errors.phone ? (
            <span className="field-error" role="alert">
              {errors.phone}
            </span>
          ) : null}
        </div>

        <div className="field">
          <label htmlFor="contact-event-type">Type of event</label>
          <select
            id="contact-event-type"
            className="select"
            value={fields.eventType}
            onChange={(event) => set('eventType', event.target.value)}
          >
            <option value="">Please choose, optional</option>
            {EVENT_TYPES.map((type) => (
              <option key={type.value} value={type.value}>
                {type.label}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div className="field">
        <label htmlFor="contact-subject">Subject</label>
        <input
          id="contact-subject"
          className="input"
          type="text"
          value={fields.subject}
          onChange={(event) => set('subject', event.target.value)}
          aria-invalid={Boolean(errors.subject)}
        />
        {errors.subject ? (
          <span className="field-error" role="alert">
            {errors.subject}
          </span>
        ) : null}
      </div>

      <div className="field">
        <label htmlFor="contact-referral">How did you hear about us, optional</label>
        <select
          id="contact-referral"
          className="select"
          value={fields.referral}
          onChange={(event) => set('referral', event.target.value)}
        >
          <option value="">Please choose, optional</option>
          {REFERRAL_SOURCES.map((source) => (
            <option key={source} value={source}>
              {source}
            </option>
          ))}
        </select>
      </div>

      <div className="field">
        <label htmlFor="contact-message">Your message</label>
        <textarea
          id="contact-message"
          className="textarea"
          rows={5}
          maxLength={2000}
          value={fields.message}
          onChange={(event) => set('message', event.target.value)}
          aria-invalid={Boolean(errors.message)}
        />
        {errors.message ? (
          <span className="field-error" role="alert">
            {errors.message}
          </span>
        ) : null}
      </div>

      <label className="choice" style={{ marginBottom: 18 }}>
        <input
          type="checkbox"
          checked={fields.consent}
          onChange={(event) => set('consent', event.target.checked)}
        />
        <span className="choice-mark" aria-hidden="true">
          <i className="bi bi-check-lg" />
        </span>
        <span className="choice-text">
          <span className="choice-title">
            I agree to the Privacy Policy and consent to Priscilla Events and Decor contacting me
            about my enquiry.
          </span>
          <span className="choice-sub">
            Read the <a href="/legal/privacy-policy">Privacy Policy</a>. You can ask us to delete
            your information at any time.
          </span>
        </span>
      </label>
      {errors.consent ? (
        <span className="field-error" role="alert">
          {errors.consent}
        </span>
      ) : null}

      <p className="meta">
        This form is protected by reCAPTCHA v3 and verified server side. Google&apos;s Privacy Policy
        and Terms of Service apply.
      </p>

      {captcha.needsV2 ? <CaptchaFallback siteKey={captcha.v2SiteKey} onToken={setV2Token} /> : null}

      <div className="loading" style={{ display: state.status === 'submitting' ? 'block' : 'none' }}>
        Sending your message.
      </div>

      {state.status === 'error' || state.status === 'challenge' ? (
        <p className="form-status is-error" role="alert">
          {state.message}
        </p>
      ) : null}

      <div className="step-actions">
        <button type="submit" className="btn btn-primary" disabled={state.status === 'submitting'}>
          {state.status === 'submitting' ? 'Sending' : 'Send Message'}
        </button>
        <a href={CONTACT.phoneHref} className="btn btn-quiet">
          <i className="bi bi-telephone" aria-hidden="true" /> {CONTACT.phoneDisplay}
        </a>
      </div>
    </form>
  );
}
