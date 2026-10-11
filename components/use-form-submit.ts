'use client';

/**
 * One submission path for all six forms.
 *
 * Handles the v3 token, posts JSON, and understands the server's two failure
 * signals:
 *   - `challenge: true` means the v3 score came in below the threshold, so the v2
 *     fallback is shown and the client resubmits with the v2 token attached.
 *   - `fields` carries per field messages, which the forms render inline.
 *
 * The honeypot field name and the form-started-at stamp are added by the forms,
 * matching the names lib/validation.ts checks for on the server.
 */

import { useCallback, useEffect, useState } from 'react';
import { useRecaptcha } from './use-recaptcha';

export type SubmitStatus = 'idle' | 'submitting' | 'success' | 'error' | 'challenge';

export type SubmitState = {
  status: SubmitStatus;
  message: string;
  reference?: string;
  fields?: Record<string, string>;
};

export type FormSubmit = {
  state: SubmitState;
  /** Post the form with an explicit v2 token when the fallback was used. */
  submit: (payload: Record<string, unknown>, v2Token?: string | null) => Promise<boolean>;
  reset: () => void;
  /** reCAPTCHA plumbing the forms need for the fallback UI. */
  captcha: {
    configured: boolean;
    needsV2: boolean;
    v2SiteKey: string;
    clearV2: () => void;
  };
};

type PostResult = {
  ok: boolean;
  message?: string;
  reference?: string;
  fields?: Record<string, string>;
  challenge?: boolean;
};

export function useFormSubmit(endpoint: string): FormSubmit {
  const recaptcha = useRecaptcha();
  const [state, setState] = useState<SubmitState>({ status: 'idle', message: '' });

  const doPost = useCallback(
    async (payload: Record<string, unknown>, token: string | null, v2: string | null): Promise<PostResult> => {
      const res = await fetch(endpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...payload,
          'recaptcha-response': token,
          'recaptcha-v2-response': v2,
        }),
      });

      let data: PostResult & { error?: string } = { ok: false };
      try {
        data = (await res.json()) as typeof data;
      } catch {
        return {
          ok: false,
          message: 'We could not read the server response. Please try again, or message us on WhatsApp.',
        };
      }

      if (!res.ok || !data.ok) {
        return {
          ok: false,
          message: data.error ?? data.message ?? 'Something went wrong. Please try again.',
          fields: data.fields,
          challenge: data.challenge === true,
        };
      }

      return { ok: true, message: data.message ?? 'Thank you.', reference: data.reference };
    },
    [endpoint],
  );

  const submit = useCallback(
    async (payload: Record<string, unknown>, v2Token: string | null = null): Promise<boolean> => {
      setState({ status: 'submitting', message: 'Sending your details.' });

      const token = await recaptcha.getToken().catch(() => null);

      // A configured v3 that produced nothing still has a way through: the v2
      // fallback, if the client completed it.
      if (recaptcha.configured && !token && !v2Token) {
        return false;
      }

      let result: PostResult;
      try {
        result = await doPost(payload, token, v2Token);
      } catch {
        setState({
          status: 'error',
          message:
            'We could not reach the server. Please check your connection and try again, or message us on WhatsApp.',
        });
        return false;
      }

      if (result.ok) {
        recaptcha.clearV2();
        setState({
          status: 'success',
          message: result.message ?? 'Thank you.',
          reference: result.reference,
        });
        return true;
      }

      if (result.challenge) {
        recaptcha.requestV2();
        setState({
          status: 'challenge',
          message:
            'Before we can send this, please complete the short security check below. It only takes a moment.',
        });
        return false;
      }

      setState({
        status: 'error',
        message: result.message ?? 'Something went wrong. Please try again.',
        fields: result.fields,
      });
      return false;
    },
    [doPost, recaptcha],
  );

  const reset = useCallback(() => {
    setState({ status: 'idle', message: '' });
    recaptcha.clearV2();
  }, [recaptcha]);

  return {
    state,
    submit,
    reset,
    captcha: {
      configured: recaptcha.configured,
      needsV2: recaptcha.needsV2,
      v2SiteKey: recaptcha.v2SiteKey,
      clearV2: recaptcha.clearV2,
    },
  };
}
