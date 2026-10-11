'use client';

/**
 * The bridal consultation booking form, on its own dedicated page for wedding
 * clients. Fields, as the brief lists them: couple names, wedding date, venue if
 * confirmed, a style inspiration description, and a preferred consultation date.
 *
 * reCAPTCHA v3 protects it, and /api/bridal stores the booking and notifies the
 * bridal team on WhatsApp. The submit contract, the action name and the field
 * names match the design source's validator exactly.
 */

import { useState } from 'react';
import { useFormSubmit } from './use-form-submit';
import CaptchaFallback from './CaptchaFallback';
import { CONTACT } from '@/lib/site';
import { isEmail, isFutureDate, isValidKenyanPhone, normalisePhone } from '@/lib/validation';

type Fields = {
  partnerOne: string;
  partnerTwo: string;
  email: string;
  phone: string;
  weddingDate: string;
  venueConfirmed: string;
  venueName: string;
  styleInspiration: string;
  consultationDate: string;
  consultationPreference: string;
  guestCount: string;
};

const EMPTY: Fields = {
  partnerOne: '',
  partnerTwo: '',
  email: '',
  phone: '',
  weddingDate: '',
  venueConfirmed: '',
  venueName: '',
  styleInspiration: '',
  consultationDate: '',
  consultationPreference: '',
  guestCount: '',
};

export default function BridalForm() {
  const [fields, setFields] = useState<Fields>(EMPTY);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [v2Token, setV2Token] = useState<string | null>(null);
  const [startedAt] = useState(() => Date.now());
  const { state, submit, reset, captcha } = useFormSubmit('/api/bridal');
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

    if (!fields.partnerOne.trim()) next.partnerOne = 'Please add the first name.';
    if (!fields.partnerTwo.trim()) next.partnerTwo = 'Please add the second name.';

    if (!fields.email.trim()) next.email = 'We need an email address for your consultation details.';
    else if (!isEmail(fields.email)) next.email = 'That email address does not look right.';

    if (!fields.phone.trim()) next.phone = 'A phone number lets the bridal team call you.';
    else if (!isValidKenyanPhone(fields.phone)) {
      next.phone = 'Enter a Kenyan mobile number, for example 0712 345 678.';
    }

    if (!fields.weddingDate) next.weddingDate = 'Add your wedding date, even if it may move.';
    else if (!isFutureDate(fields.weddingDate)) next.weddingDate = 'Please choose a future date.';

    if (!fields.venueConfirmed) next.venueConfirmed = 'Let us know whether the venue is confirmed.';
    if (fields.venueConfirmed === 'yes' && !fields.venueName.trim()) {
      next.venueName = 'Which venue have you confirmed?';
    }

    if (!fields.styleInspiration.trim()) {
      next.styleInspiration = 'Even a sentence here changes what we bring to the consultation.';
    } else if (fields.styleInspiration.trim().length < 20) {
      next.styleInspiration = 'A little more detail will help, around a sentence or two.';
    }

    if (!fields.consultationDate) next.consultationDate = 'When would you like to come in?';
    else if (!isFutureDate(fields.consultationDate)) {
      next.consultationDate = 'Please choose a date in the future.';
    }

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
        phone: normalisePhone(fields.phone),
        coupleNames: `${fields.partnerOne} and ${fields.partnerTwo}`,
        'company-website': honeypot,
        'form-started-at': startedAt,
      },
      v2Token,
    );
  }

  if (state.status === 'success') {
    return (
      <div className="form-shell" role="status">
        <span className="eyebrow">Bridal consultation</span>
        <h2 className="section-title">
          Thank you, {fields.partnerOne.split(' ')[0]} and {fields.partnerTwo.split(' ')[0]}.
        </h2>
        <p>
          Your consultation request is with our bridal team. We will confirm your appointment time
          by email and WhatsApp, usually the same working day.
        </p>
        {state.reference ? (
          <p>
            Your reference is <strong>{state.reference}</strong>. Quote it in any message to us and
            we will find your file straight away.
          </p>
        ) : null}
        <div className="step-actions" style={{ borderTop: 'none', paddingTop: 0 }}>
          <a
            href={CONTACT.whatsappLink}
            className="btn btn-primary"
            target="_blank"
            rel="noopener noreferrer"
          >
            <i className="bi bi-whatsapp" aria-hidden="true" /> Message the bridal team
          </a>
          <button
            type="button"
            className="btn btn-quiet"
            onClick={() => {
              reset();
              setFields(EMPTY);
            }}
          >
            Send another request
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

      <div className="grid-2">
        <div className="field">
          <label htmlFor="partnerOne">First partner name</label>
          <input
            id="partnerOne"
            className="input"
            type="text"
            autoComplete="given-name"
            value={fields.partnerOne}
            onChange={(event) => set('partnerOne', event.target.value)}
            aria-invalid={Boolean(errors.partnerOne)}
          />
          {errors.partnerOne ? (
            <span className="field-error" role="alert">
              {errors.partnerOne}
            </span>
          ) : null}
        </div>

        <div className="field">
          <label htmlFor="partnerTwo">Second partner name</label>
          <input
            id="partnerTwo"
            className="input"
            type="text"
            autoComplete="given-name"
            value={fields.partnerTwo}
            onChange={(event) => set('partnerTwo', event.target.value)}
            aria-invalid={Boolean(errors.partnerTwo)}
          />
          {errors.partnerTwo ? (
            <span className="field-error" role="alert">
              {errors.partnerTwo}
            </span>
          ) : null}
        </div>
      </div>

      <div className="grid-2">
        <div className="field">
          <label htmlFor="bridal-email">Email address</label>
          <input
            id="bridal-email"
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

        <div className="field">
          <label htmlFor="bridal-phone">Phone or WhatsApp number</label>
          <input
            id="bridal-phone"
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
      </div>

      <div className="grid-2">
        <div className="field">
          <label htmlFor="weddingDate">Wedding date</label>
          <input
            id="weddingDate"
            className="input"
            type="date"
            value={fields.weddingDate}
            onChange={(event) => set('weddingDate', event.target.value)}
            aria-invalid={Boolean(errors.weddingDate)}
          />
          {errors.weddingDate ? (
            <span className="field-error" role="alert">
              {errors.weddingDate}
            </span>
          ) : null}
        </div>

        <div className="field">
          <label htmlFor="guestCount">Approximate guest count</label>
          <input
            id="guestCount"
            className="input"
            type="number"
            min={2}
            max={5000}
            inputMode="numeric"
            placeholder="220"
            value={fields.guestCount}
            onChange={(event) => set('guestCount', event.target.value)}
          />
        </div>
      </div>

      <fieldset style={{ border: 0, padding: 0, margin: '0 0 18px' }}>
        <legend className="field-label">Is the venue confirmed?</legend>
        <div className="choice-grid" style={{ gridTemplateColumns: 'repeat(2, minmax(0,1fr))' }}>
          {[
            { value: 'yes', label: 'Yes, it is confirmed' },
            { value: 'no', label: 'Not yet, we are still looking' },
          ].map((option) => (
            <label key={option.value} className="choice">
              <input
                type="radio"
                name="venueConfirmed"
                value={option.value}
                checked={fields.venueConfirmed === option.value}
                onChange={() => set('venueConfirmed', option.value)}
              />
              <span className="choice-mark is-round" aria-hidden="true">
                <i className="bi bi-check-lg" />
              </span>
              <span className="choice-text">
                <span className="choice-title">{option.label}</span>
              </span>
            </label>
          ))}
        </div>
        {errors.venueConfirmed ? (
          <span className="field-error" role="alert">
            {errors.venueConfirmed}
          </span>
        ) : null}
      </fieldset>

      {fields.venueConfirmed === 'yes' ? (
        <div className="field">
          <label htmlFor="venueName">Venue name</label>
          <input
            id="venueName"
            className="input"
            type="text"
            value={fields.venueName}
            onChange={(event) => set('venueName', event.target.value)}
            aria-invalid={Boolean(errors.venueName)}
          />
          {errors.venueName ? (
            <span className="field-error" role="alert">
              {errors.venueName}
            </span>
          ) : null}
        </div>
      ) : null}

      <div className="field">
        <label htmlFor="styleInspiration">Describe the style you are drawn to</label>
        <textarea
          id="styleInspiration"
          className="textarea"
          rows={5}
          maxLength={2000}
          placeholder="Colours, flowers you love, a feeling you want guests to have, or a Pinterest board you can share with us."
          value={fields.styleInspiration}
          onChange={(event) => set('styleInspiration', event.target.value)}
          aria-invalid={Boolean(errors.styleInspiration)}
        />
        {errors.styleInspiration ? (
          <span className="field-error" role="alert">
            {errors.styleInspiration}
          </span>
        ) : (
          <span className="hint">
            You are welcome to bring photographs to the consultation instead of describing
            everything now.
          </span>
        )}
      </div>

      <div className="grid-2">
        <div className="field">
          <label htmlFor="consultationDate">Preferred consultation date</label>
          <input
            id="consultationDate"
            className="input"
            type="date"
            value={fields.consultationDate}
            onChange={(event) => set('consultationDate', event.target.value)}
            aria-invalid={Boolean(errors.consultationDate)}
          />
          {errors.consultationDate ? (
            <span className="field-error" role="alert">
              {errors.consultationDate}
            </span>
          ) : null}
        </div>

        <div className="field">
          <label htmlFor="consultationPreference">Preferred time</label>
          <select
            id="consultationPreference"
            className="select"
            value={fields.consultationPreference}
            onChange={(event) => set('consultationPreference', event.target.value)}
          >
            <option value="">No preference</option>
            <option value="morning">Morning, 9am to 12pm</option>
            <option value="afternoon">Afternoon, 12pm to 4pm</option>
            <option value="late-afternoon">Late afternoon, 4pm to 6pm</option>
            <option value="saturday">Saturday</option>
            <option value="virtual">Virtual consultation instead</option>
          </select>
        </div>
      </div>

      <p className="meta">
        This form is protected by reCAPTCHA v3 and checked server side. Google&apos;s Privacy Policy
        and Terms of Service apply.
      </p>

      {captcha.needsV2 ? <CaptchaFallback siteKey={captcha.v2SiteKey} onToken={setV2Token} /> : null}

      <div className="loading" style={{ display: state.status === 'submitting' ? 'block' : 'none' }}>
        Booking your consultation.
      </div>

      {state.status === 'error' || state.status === 'challenge' ? (
        <p className="form-status is-error" role="alert">
          {state.message}
        </p>
      ) : null}

      <div className="step-actions">
        <button type="submit" className="btn btn-primary" disabled={state.status === 'submitting'}>
          {state.status === 'submitting' ? 'Booking' : 'Book My Consultation'}
        </button>
        <a
          href={CONTACT.whatsappLink}
          className="btn btn-quiet"
          target="_blank"
          rel="noopener noreferrer"
        >
          <i className="bi bi-whatsapp" aria-hidden="true" /> Prefer WhatsApp?
        </a>
      </div>
    </form>
  );
}
