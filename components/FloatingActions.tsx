'use client';

/**
 * The three floating controls.
 *
 *   Bottom left:  the voice tour, a 56 by 56 circle. Starts on the first scroll
 *                 or the first click, whichever comes first, and never twice.
 *   Bottom right: WhatsApp, always visible, with the tooltip the brief specifies.
 *   Centre bottom: the scroll to top button, which follows the source's own rule
 *                 of appearing once window.scrollY passes 100.
 */

import { useCallback, useEffect, useRef, useState } from 'react';
import { CONTACT } from '@/lib/site';

const VOICE_SCRIPT = [
  'Welcome to Priscilla Events and Decor.',
  'We bring your vision to life with stunning flowers, elegant table settings, lighting, and full venue styling.',
  'From intimate weddings to grand corporate galas, we design experiences that people remember.',
  'Browse our portfolio, choose a package, or speak to our team about your event today.',
].join(' ');

export default function FloatingActions() {
  const [voiceOpen, setVoiceOpen] = useState(false);
  const [speaking, setSpeaking] = useState(false);
  const [voiceSupported, setVoiceSupported] = useState(true);
  const [showTop, setShowTop] = useState(false);

  const hasStarted = useRef(false);
  const utteranceRef = useRef<SpeechSynthesisUtterance | null>(null);

  const speak = useCallback(() => {
    if (typeof window === 'undefined') return;
    if (!('speechSynthesis' in window)) {
      setVoiceSupported(false);
      setVoiceOpen(true);
      return;
    }

    window.speechSynthesis.cancel();

    const utterance = new SpeechSynthesisUtterance(VOICE_SCRIPT);
    utterance.lang = 'en-KE';
    utterance.rate = 0.94;
    utterance.pitch = 1;
    utterance.volume = 1;

    // Prefer a Kenyan, then any African English voice, then the browser default.
    const voices = window.speechSynthesis.getVoices();
    const preferred =
      voices.find((voice) => /en-KE/i.test(voice.lang)) ??
      voices.find((voice) => /en-(NG|ZA|GH|TZ|UG)/i.test(voice.lang)) ??
      voices.find((voice) => /^en/i.test(voice.lang));
    if (preferred) utterance.voice = preferred;

    utterance.onstart = () => setSpeaking(true);
    utterance.onend = () => setSpeaking(false);
    utterance.onerror = () => setSpeaking(false);

    utteranceRef.current = utterance;
    window.speechSynthesis.speak(utterance);
    setVoiceOpen(true);
  }, []);

  /** Fires once, on the first scroll or the first click. */
  const startOnce = useCallback(() => {
    if (hasStarted.current) return;
    hasStarted.current = true;
    speak();
  }, [speak]);

  useEffect(() => {
    const onScroll = () => {
      setShowTop(window.scrollY > 100);
      if (window.scrollY > 40) startOnce();
    };
    const onClick = () => startOnce();
    const onKey = () => startOnce();

    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('click', onClick, { once: true, passive: true });
    window.addEventListener('keydown', onKey, { once: true, passive: true });

    return () => {
      window.removeEventListener('scroll', onScroll);
      window.removeEventListener('click', onClick);
      window.removeEventListener('keydown', onKey);
    };
  }, [startOnce]);

  useEffect(() => {
    return () => {
      if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
        window.speechSynthesis.cancel();
      }
    };
  }, []);

  const toggleVoice = () => {
    if (speaking) {
      window.speechSynthesis?.cancel();
      setSpeaking(false);
      return;
    }
    hasStarted.current = true;
    speak();
  };

  return (
    <>
      <button
        type="button"
        className={`float-voice ${speaking ? 'is-live' : ''}`}
        onClick={toggleVoice}
        aria-label={speaking ? 'Stop the voice tour' : 'Play the voice tour'}
        aria-expanded={voiceOpen}
        title="Voice tour"
      >
        <i className={speaking ? 'bi bi-stop-fill' : 'bi bi-volume-up-fill'} aria-hidden="true" />
      </button>

      {voiceOpen ? (
        <div className="voice-panel" role="region" aria-label="Voice tour">
          <h2>Voice tour</h2>
          <p aria-live="polite">
            {speaking
              ? 'Playing the Priscilla Events introduction.'
              : voiceSupported
                ? 'Press play to hear a short introduction to what we do.'
                : 'Your browser cannot play audio, so here is the introduction in text.'}
          </p>
          {!speaking && !voiceSupported ? <p>{VOICE_SCRIPT}</p> : null}
          <div className="voice-actions">
            <button type="button" className="btn btn-primary btn-sm" onClick={toggleVoice}>
              <i className={speaking ? 'bi bi-stop-fill' : 'bi bi-play-fill'} aria-hidden="true" />
              {speaking ? 'Stop' : 'Play'}
            </button>
            <button
              type="button"
              className="btn btn-quiet btn-sm"
              onClick={() => {
                window.speechSynthesis?.cancel();
                setSpeaking(false);
                setVoiceOpen(false);
              }}
            >
              Close
            </button>
          </div>
        </div>
      ) : null}

      <a
        href={CONTACT.whatsappLink}
        className="float-whatsapp"
        target="_blank"
        rel="noopener noreferrer"
        aria-label={`WhatsApp the Priscilla Events team on ${CONTACT.phoneDisplay}`}
      >
        <i className="bi bi-whatsapp" aria-hidden="true" />
        <span className="float-tooltip">{CONTACT.whatsappTooltip}</span>
      </a>

      <button
        type="button"
        className={`scroll-top ${showTop ? 'active' : ''}`}
        onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
        aria-label="Back to top"
      >
        <i className="bi bi-arrow-up-short" aria-hidden="true" />
      </button>
    </>
  );
}
