'use client';

/**
 * The multi step event enquiry and booking form.
 *
 * Six steps, exactly as the brief lays them out:
 *   1  Event type selection
 *   2  Event details: date, venue name, venue address, guest count, indoor or outdoor
 *   3  Services needed, multi select
 *   4  Budget range and package preference
 *   5  Client details: name, email, phone, how they heard about Priscilla
 *   6  Confirm, with reCAPTCHA v3 on submission
 *
 * Every motion state between steps runs between 120ms and 320ms, per the brief.
 * Validation runs on the step being left, so nobody is sent back from the end.
 * The form arrives pre-filled when a service or package link brought the visitor
 * here from a card elsewhere on the site.
 *
 * The submit contract matches the design source's own validator: a hidden
 * data-recaptcha-site-key attribute, the action name php_email_form_submit and
 * the recaptcha-response field. The secret is verified server side in
 * /api/enquiry.
 */

import { useEffect, useMemo, useState } from 'react';
import { useFormSubmit } from './use-form-submit';
import CaptchaFallback from './CaptchaFallback';
import {
  BUDGET_BANDS,
  CONTACT,
  EVENT_TYPES,
  REFERRAL_SOURCES,
  SERVICE_OPTIONS,
} from '@/lib/site';
import { PACKAGES } from '@/lib/packages';
import { isEmail, isFutureDate, isValidKenyanPhone, normalisePhone } from '@/lib/validation';

type Answers = {
  eventType: string;
  eventDate: string;
  venueName: string;
  venueAddress: string;
  guests: string;
  setting: string;
  services: string[];
  budget: string;
  packagePreference: string;
  name: string;
  email: string;
  phone: string;
  referral: string;
  notes: string;
};

const STEPS = [
  'Event type',
  'Event details',
  'Services needed',
  'Budget and package',
  'Your details',
  'Confirm',
] as const;

const EMPTY: Answers = {
  eventType: '',
  eventDate: '',
  venueName: '',
  venueAddress: '',
  guests: '',
  setting: '',
  services: [],
  budget: '',
  packagePreference: '',
  name: '',
  email: '',
  phone: '',
  referral: '',
  notes: '',
};

export default function EnquiryForm({
  initialService,
  initialPackage,
  initialIntent,
}: {
  initialService?: string;
  initialPackage?: string;
  initialIntent?: string;
}) {
  const [step, setStep] = useState(0);
  const [answers, setAnswers] = useState<Answers>(() => ({
    ...EMPTY,
    services: initialService && SERVICE_OPTIONS.includes(initialService as never) ? [initialService] : [],
    packagePreference: initialPackage ?? '',
    eventType:
      initialIntent === 'corporate'
        ? 'corporate'
        : initialIntent === 'package'
          ? 'wedding'
          : initialService
            ? 'wedding'
            : '',
  }));
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [v2Token, setV2Token] = useState<string | null>(null);
  const { state, submit, reset, captcha } = useFormSubmit('/api/enquiry');
  const siteKey = process.env.NEXT_PUBLIC_RECAPTCHA_SITE_KEY ?? '';
  const [startedAt] = useState(() => Date.now());

  const set = <K extends keyof Answers>(key: K, value: Answers[K]) => {
    setAnswers((current) => ({ ...current, [key]: value }));
    setErrors((current) => {
      if (!current[key]) return current;
      const next = { ...current };
      delete next[key];
      return next;
    });
  };

  const toggleService = (name: string) => {
    setAnswers((current) => ({
      ...current,
      services: current.services.includes(name)
        ? current.services.filter((item) => item !== name)
        : [...current.services, name],
    }));
    setErrors((current) => {
      const next = { ...current };
      delete next.services;
      return next;
    });
  };

  /** Only the fields belonging to the step being left are checked. */
  function validateStep(index: number): boolean {
    const next: Record<string, string> = {};

    if (index === 0 && !answers.eventType) {
      next.eventType = 'Choose the kind of event you are planning.';
    }

    if (index === 1) {
      if (!answers.eventDate) next.eventDate = 'Tell us the date, even if it is a rough idea.';
      else if (!isFutureDate(answers.eventDate)) next.eventDate = 'Please choose a date in the future.';
      if (!answers.venueName.trim()) next.venueName = 'Which venue are you considering?';
      if (!answers.venueAddress.trim()) next.venueAddress = 'A town or area is enough for now.';
      if (!answers.guests.trim()) next.guests = 'Roughly how many guests are you expecting?';
      else if (!/^\d{1,5}$/.test(answers.guests.trim())) next.guests = 'Use a number, for example 180.';
      if (!answers.setting) next.setting = 'Choose indoor or outdoor.';
    }

    if (index === 2 && answers.services.length === 0) {
      next.services = 'Choose at least one service so we can quote accurately.';
    }

    if (index === 3 && !answers.budget) {
      next.budget = 'Choose a budget range, or tell us you are not sure yet.';
    }

    if (index === 4) {
      if (!answers.name.trim()) next.name = 'What should we call you?';
      if (!answers.email.trim()) next.email = 'We need an email address to send your reference.';
      else if (!isEmail(answers.email)) next.email = 'That email address does not look right.';
      if (!answers.phone.trim()) next.phone = 'A phone number lets us reach you quickly.';
      else if (!isValidKenyanPhone(answers.phone)) {
        next.phone = 'Enter a Kenyan mobile number, for example 0712 345 678.';
      }
      if (!answers.referral) next.referral = 'Let us know how you found us.';
    }

    setErrors(next);
    return Object.keys(next).length === 0;
  }

  function goNext() {
    if (!validateStep(step)) return;
    setStep((value) => Math.min(value + 1, STEPS.length - 1));
    // Keep focus with the new step rather than the button that is now gone.
    window.requestAnimationFrame(() => {
      document.getElementById('enquiry-step-heading')?.focus();
    });
  }

  function goBack() {
    setErrors({});
    setStep((value) => Math.max(value - 1, 0));
  }

  async function onSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (step < STEPS.length - 1) {
      goNext();
      return;
    }
    if (!validateStep(4)) {
      setStep(4);
      return;
    }
    if (state.status === 'submitting') return;

    const form = event.currentTarget;
    const honeypot =
      (form.elements.namedItem('company-website') as HTMLInputElement | null)?.value ?? '';

    await submit(
      {
        ...answers,
        phone: normalisePhone(answers.phone),
        guests: Number.parseInt(answers.guests, 10),
        'company-website': honeypot,
        'form-started-at': startedAt,
      },
      v2Token,
    );
  }

  const packageName = useMemo(
    () => PACKAGES.find((item) => item.id === answers.packagePreference)?.name ?? 'No preference',
    [answers.packagePreference],
  );

  const eventTypeLabel = useMemo(
    () => EVENT_TYPES.find((item) => item.value === answers.eventType)?.label ?? 'Not chosen',
    [answers.eventType],
  );

  const budgetLabel = useMemo(
    () => BUDGET_BANDS.find((item) => item.value === answers.budget)?.label ?? 'Not chosen',
    [answers.budget],
  );

  /* ---------------------------------------------------------------- success */
  if (state.status === 'success') {
    return (
      <div className="form-shell" role="status">
        <h2 className="section-title">Thank you, {answers.name.split(' ')[0] || 'and welcome'}.</h2>
        <p>
          Your enquiry is with the events team. We respond to all enquiries within 4 hours during
          working hours, and first thing the next morning for anything received overnight.
        </p>
        {state.reference ? (
          <p className="summary-row" style={{ borderBottom: 'none' }}>
            <dt>Your reference</dt>
            <dd>{state.reference}</dd>
          </p>
        ) : null}
        <p>
          A confirmation is on its way to your email. If you would like to talk sooner, message the
          events team on WhatsApp and quote your reference.
        </p>
        <div className="step-actions" style={{ borderTop: 'none', paddingTop: 0 }}>
          <a
            href={CONTACT.whatsappLink}
            className="btn btn-primary"
            target="_blank"
            rel="noopener noreferrer"
          >
            <i className="bi bi-whatsapp" aria-hidden="true" /> Message the events team
          </a>
          <button type="button" className="btn btn-quiet" onClick={() => { reset(); setStep(0); setAnswers(EMPTY); }}>
            Send another enquiry
          </button>
        </div>
      </div>
    );
  }

  /* ------------------------------------------------------------------- form */
  return (
    <form
      className="form-shell"
      onSubmit={onSubmit}
      noValidate
      data-recaptcha-site-key={siteKey}
    >
      <input
        type="text"
        name="company-website"
        tabIndex={-1}
        autoComplete="off"
        aria-hidden="true"
        style={{ position: 'absolute', left: '-9999px', width: 1, height: 1 }}
      />
      <input type="hidden" name="form-started-at" value={startedAt} />

      <ol className="stepper">
        {STEPS.map((label, index) => (
          <li
            key={label}
            className={index === step ? 'is-active' : index < step ? 'is-done' : ''}
            aria-current={index === step ? 'step' : undefined}
          >
            <span className="num" aria-hidden="true">
              {index < step ? <i className="bi bi-check-lg" /> : index + 1}
            </span>
            {label}
          </li>
        ))}
      </ol>

      <div className="progress-track" role="presentation">
        <div className="progress-fill" style={{ width: `${((step + 1) / STEPS.length) * 100}%` }} />
      </div>

      <h2
        className="section-title"
        id="enquiry-step-heading"
        tabIndex={-1}
        style={{ fontSize: 'var(--fs-h4)', marginBottom: 18 }}
      >
        Step {step + 1} of {STEPS.length}. {STEPS[step]}
      </h2>

      {/* Step 1. Event type selection. */}
      {step === 0 ? (
        <div className="step-panel">
          <div className="choice-grid">
            {EVENT_TYPES.map((type) => (
              <label key={type.value} className="choice">
                <input
                  type="radio"
                  name="eventType"
                  value={type.value}
                  checked={answers.eventType === type.value}
                  onChange={() => set('eventType', type.value)}
                />
                <span className="choice-mark" aria-hidden="true">
                  <i className="bi bi-check-lg" />
                </span>
                <span className="choice-text">
                  <span className="choice-title">{type.label}</span>
                  <span className="choice-sub">{type.note}</span>
                </span>
              </label>
            ))}
          </div>
          {errors.eventType ? (
            <span className="field-error" role="alert">
              {errors.eventType}
            </span>
          ) : null}
        </div>
      ) : null}

      {/* Step 2. Event details. */}
      {step === 1 ? (
        <div className="step-panel">
          <div className="grid-2">
            <div className="field">
              <label htmlFor="eventDate">Event date</label>
              <input
                id="eventDate"
                className="input"
                type="date"
                value={answers.eventDate}
                onChange={(event) => set('eventDate', event.target.value)}
                aria-invalid={Boolean(errors.eventDate)}
                aria-describedby={errors.eventDate ? 'eventDate-error' : undefined}
              />
              {errors.eventDate ? (
                <span className="field-error" id="eventDate-error" role="alert">
                  {errors.eventDate}
                </span>
              ) : (
                <span className="hint">A rough date is fine. Many clients book nine to twelve months ahead.</span>
              )}
            </div>

            <div className="field">
              <label htmlFor="guests">Estimated number of guests</label>
              <input
                id="guests"
                className="input"
                type="number"
                min={1}
                max={5000}
                inputMode="numeric"
                placeholder="180"
                value={answers.guests}
                onChange={(event) => set('guests', event.target.value)}
                aria-invalid={Boolean(errors.guests)}
              />
              {errors.guests ? (
                <span className="field-error" role="alert">
                  {errors.guests}
                </span>
              ) : null}
            </div>
          </div>

          <div className="field">
            <label htmlFor="venueName">Venue name</label>
            <input
              id="venueName"
              className="input"
              type="text"
              autoComplete="organization"
              placeholder="For example Villa Rosa Kempinski"
              value={answers.venueName}
              onChange={(event) => set('venueName', event.target.value)}
              aria-invalid={Boolean(errors.venueName)}
            />
            {errors.venueName ? (
              <span className="field-error" role="alert">
                {errors.venueName}
              </span>
            ) : (
              <span className="hint">If the venue is not confirmed yet, tell us the ones you are considering.</span>
            )}
          </div>

          <div className="field">
            <label htmlFor="venueAddress">Venue address or area</label>
            <input
              id="venueAddress"
              className="input"
              type="text"
              autoComplete="street-address"
              placeholder="For example Karen, Nairobi"
              value={answers.venueAddress}
              onChange={(event) => set('venueAddress', event.target.value)}
              aria-invalid={Boolean(errors.venueAddress)}
            />
            {errors.venueAddress ? (
              <span className="field-error" role="alert">
                {errors.venueAddress}
              </span>
            ) : null}
          </div>

          <fieldset style={{ border: 0, padding: 0, margin: '0 0 18px' }}>
            <legend className="field-label">Indoor or outdoor</legend>
            <div className="choice-grid" style={{ gridTemplateColumns: 'repeat(2, minmax(0,1fr))' }}>
              {[
                { value: 'indoor', label: 'Indoor', note: 'A hall, ballroom or restaurant' },
                { value: 'outdoor', label: 'Outdoor', note: 'A garden, lawn, rooftop or marquee' },
              ].map((option) => (
                <label key={option.value} className="choice">
                  <input
                    type="radio"
                    name="setting"
                    value={option.value}
                    checked={answers.setting === option.value}
                    onChange={() => set('setting', option.value)}
                  />
                  <span className="choice-mark is-round" aria-hidden="true">
                    <i className="bi bi-check-lg" />
                  </span>
                  <span className="choice-text">
                    <span className="choice-title">{option.label}</span>
                    <span className="choice-sub">{option.note}</span>
                  </span>
                </label>
              ))}
            </div>
            {errors.setting ? (
              <span className="field-error" role="alert">
                {errors.setting}
              </span>
            ) : null}
          </fieldset>
        </div>
      ) : null}

      {/* Step 3. Services needed, multi select. */}
      {step === 2 ? (
        <div className="step-panel">
          <p className="hint" style={{ marginBottom: 14 }}>
            Choose everything you are considering. Nothing here commits you to anything.
          </p>
          <div className="choice-grid">
            {SERVICE_OPTIONS.map((service) => {
              const checked = answers.services.includes(service);
              return (
                <label key={service} className="choice">
                  <input
                    type="checkbox"
                    name="services"
                    value={service}
                    checked={checked}
                    onChange={() => toggleService(service)}
                  />
                  <span className="choice-mark" aria-hidden="true">
                    <i className="bi bi-check-lg" />
                  </span>
                  <span className="choice-text">
                    <span className="choice-title">{service}</span>
                  </span>
                </label>
              );
            })}
          </div>
          {errors.services ? (
            <span className="field-error" role="alert">
              {errors.services}
            </span>
          ) : null}
          <p className="meta" style={{ marginTop: 14 }}>
            {answers.services.length} selected
          </p>
        </div>
      ) : null}

      {/* Step 4. Budget range and package preference. */}
      {step === 3 ? (
        <div className="step-panel">
          <fieldset style={{ border: 0, padding: 0, margin: '0 0 24px' }}>
            <legend className="field-label">Budget range</legend>
            <div className="choice-grid">
              {BUDGET_BANDS.map((band) => (
                <label key={band.value} className="choice">
                  <input
                    type="radio"
                    name="budget"
                    value={band.value}
                    checked={answers.budget === band.value}
                    onChange={() => set('budget', band.value)}
                  />
                  <span className="choice-mark is-round" aria-hidden="true">
                    <i className="bi bi-check-lg" />
                  </span>
                  <span className="choice-text">
                    <span className="choice-title">{band.label}</span>
                    <span className="choice-sub">{band.note}</span>
                  </span>
                </label>
              ))}
            </div>
            {errors.budget ? (
              <span className="field-error" role="alert">
                {errors.budget}
              </span>
            ) : null}
          </fieldset>

          <div className="field">
            <label htmlFor="packagePreference">Package preference</label>
            <select
              id="packagePreference"
              className="select"
              value={answers.packagePreference}
              onChange={(event) => set('packagePreference', event.target.value)}
            >
              <option value="">No preference, please advise</option>
              {PACKAGES.map((item) => (
                <option key={item.id} value={item.id}>
                  {item.name}
                </option>
              ))}
              <option value="custom">A custom brief</option>
            </select>
            <span className="hint">
              Not sure? The style quiz recommends a package in six questions, and you can come back.
            </span>
          </div>
        </div>
      ) : null}

      {/* Step 5. Client details. */}
      {step === 4 ? (
        <div className="step-panel">
          <div className="grid-2">
            <div className="field">
              <label htmlFor="name">Your name</label>
              <input
                id="name"
                className="input"
                type="text"
                autoComplete="name"
                value={answers.name}
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
              <label htmlFor="email">Email address</label>
              <input
                id="email"
                className="input"
                type="email"
                autoComplete="email"
                value={answers.email}
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
              <label htmlFor="phone">Phone or WhatsApp number</label>
              <input
                id="phone"
                className="input"
                type="tel"
                autoComplete="tel"
                placeholder="0712 345 678"
                value={answers.phone}
                onChange={(event) => set('phone', event.target.value)}
                aria-invalid={Boolean(errors.phone)}
              />
              {errors.phone ? (
                <span className="field-error" role="alert">
                  {errors.phone}
                </span>
              ) : (
                <span className="hint">We use this for the WhatsApp confirmation with your reference.</span>
              )}
            </div>

            <div className="field">
              <label htmlFor="referral">How did you hear about Priscilla?</label>
              <select
                id="referral"
                className="select"
                value={answers.referral}
                onChange={(event) => set('referral', event.target.value)}
                aria-invalid={Boolean(errors.referral)}
              >
                <option value="">Please choose</option>
                {REFERRAL_SOURCES.map((source) => (
                  <option key={source} value={source}>
                    {source}
                  </option>
                ))}
              </select>
              {errors.referral ? (
                <span className="field-error" role="alert">
                  {errors.referral}
                </span>
              ) : null}
            </div>
          </div>

          <div className="field">
            <label htmlFor="notes">Anything else we should know</label>
            <textarea
              id="notes"
              className="textarea"
              rows={4}
              maxLength={2000}
              placeholder="Your colours, a Pinterest board, family traditions, or the one thing that matters most."
              value={answers.notes}
              onChange={(event) => set('notes', event.target.value)}
            />
          </div>
        </div>
      ) : null}

      {/* Step 6. Confirm, with reCAPTCHA v3. */}
      {step === 5 ? (
        <div className="step-panel">
          <dl className="summary-grid">
            <div className="summary-row">
              <dt>Event type</dt>
              <dd>{eventTypeLabel}</dd>
            </div>
            <div className="summary-row">
              <dt>Date</dt>
              <dd>{answers.eventDate || 'Not set'}</dd>
            </div>
            <div className="summary-row">
              <dt>Venue</dt>
              <dd>
                {answers.venueName || 'Not set'}
                {answers.venueAddress ? `, ${answers.venueAddress}` : ''}
              </dd>
            </div>
            <div className="summary-row">
              <dt>Guests</dt>
              <dd>{answers.guests || 'Not set'}</dd>
            </div>
            <div className="summary-row">
              <dt>Setting</dt>
              <dd style={{ textTransform: 'capitalize' }}>{answers.setting || 'Not set'}</dd>
            </div>
            <div className="summary-row">
              <dt>Services</dt>
              <dd>{answers.services.length > 0 ? answers.services.join(', ') : 'None selected'}</dd>
            </div>
            <div className="summary-row">
              <dt>Budget</dt>
              <dd>{budgetLabel}</dd>
            </div>
            <div className="summary-row">
              <dt>Package</dt>
              <dd>{packageName}</dd>
            </div>
            <div className="summary-row">
              <dt>Name</dt>
              <dd>{answers.name || 'Not set'}</dd>
            </div>
            <div className="summary-row">
              <dt>Email</dt>
              <dd>{answers.email || 'Not set'}</dd>
            </div>
            <div className="summary-row">
              <dt>Phone</dt>
              <dd>{answers.phone || 'Not set'}</dd>
            </div>
            <div className="summary-row">
              <dt>Heard about us</dt>
              <dd>{answers.referral || 'Not set'}</dd>
            </div>
          </dl>

          <p className="meta" style={{ marginBottom: 8 }}>
            This form is protected by reCAPTCHA v3. We check submissions server side, then review
            every enquiry by hand. Google&apos;s Privacy Policy and Terms of Service apply.
          </p>
          <p className="meta">
            By sending this you agree to our{' '}
            <a href="/legal/privacy-policy">Privacy Policy</a> and{' '}
            <a href="/legal/terms">Terms of Service</a>.
          </p>

          {captcha.needsV2 ? (
            <CaptchaFallback siteKey={captcha.v2SiteKey} onToken={setV2Token} />
          ) : null}
        </div>
      ) : null}

      {/* State blocks, using the design source's loading, error and success language. */}
      <div className="loading" style={{ display: state.status === 'submitting' ? 'block' : 'none' }}>
        Sending your enquiry.
      </div>

      {state.status === 'error' ? (
        <p className="form-status is-error" role="alert">
          {state.message}
        </p>
      ) : null}

      {state.status === 'challenge' ? (
        <p className="form-status is-error" role="alert">
          {state.message}
        </p>
      ) : null}

      {Object.keys(state.fields ?? {}).length > 0 ? (
        <ul className="form-status is-error" role="alert">
          {Object.entries(state.fields ?? {}).map(([field, message]) => (
            <li key={field}>{message}</li>
          ))}
        </ul>
      ) : null}

      <div className="step-actions">
        <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap' }}>
          {step > 0 ? (
            <button type="button" className="btn btn-quiet" onClick={goBack}>
              <i className="bi bi-arrow-left" aria-hidden="true" /> Back
            </button>
          ) : null}
          {step < STEPS.length - 1 ? (
            <button type="button" className="btn btn-primary" onClick={goNext}>
              Continue <i className="bi bi-arrow-right" aria-hidden="true" />
            </button>
          ) : (
            <button type="submit" className="btn btn-primary" disabled={state.status === 'submitting'}>
              {state.status === 'submitting' ? 'Sending' : 'Submit Enquiry'}
            </button>
          )}
        </div>

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
