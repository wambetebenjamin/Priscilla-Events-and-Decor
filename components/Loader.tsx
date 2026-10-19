'use client';

/**
 * Loading screen.
 *
 * The design source ships a preloader, so its loader is the base and is kept
 * verbatim: the #preloader block with fixed inset 0, z-index 999999, the
 * --background-color field, the 0.6s ease-out exit and the 60px dual tone
 * spinner rotating on a 1.5s linear infinite loop. Those rules live untouched in
 * app/styles/priscilla.css under SECTION 20.
 *
 * Layered on top, exactly as the brief requires:
 *   - a flower SVG blooms petal by petal from the centre
 *   - the Priscilla Events wordmark appears beneath it
 *   - a progress fill runs below the wordmark
 *   - it always finishes, skipping at 3 seconds at the outside
 *   - it normally completes in under 2 seconds
 *   - role="status" announces completion
 *   - under reduced motion the bloom and bar are dropped and a plain text
 *     percentage is shown instead
 */

import { useEffect, useRef, useState } from 'react';

/** The outside limit. Whatever the page is doing, the loader is gone by here. */
const HARD_SKIP_MS = 3000;
/** Normal completion target, comfortably under two seconds. */
const NORMAL_COMPLETE_MS = 1600;

export default function Loader() {
  const [visible, setVisible] = useState(true);
  const [percent, setPercent] = useState(0);
  const [reduced, setReduced] = useState(false);
  const [announced, setAnnounced] = useState(false);
  const timeoutRef = useRef<number | null>(null);
  const intervalRef = useRef<number | null>(null);

  useEffect(() => {
    const prefersReduced =
      typeof window !== 'undefined' &&
      window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    setReduced(prefersReduced);

    const started = Date.now();

    const finish = () => {
      setPercent(100);
      // Let the fill reach 100 before the field fades on its 0.6s ease-out exit.
      setTimeout(() => {
        setVisible(false);
        setAnnounced(true);
      }, prefersReduced ? 0 : 220);
    };

    if (prefersReduced) {
      // No motion at all, but the percentage is still real and readable.
      intervalRef.current = window.setInterval(() => {
        const elapsed = Date.now() - started;
        const next = Math.min(100, Math.round((elapsed / NORMAL_COMPLETE_MS) * 100));
        setPercent(next);
        if (next >= 100) {
          if (intervalRef.current) window.clearInterval(intervalRef.current);
          finish();
        }
      }, 80);
    } else {
      intervalRef.current = window.setInterval(() => {
        const elapsed = Date.now() - started;
        // Ease out so it feels like real progress rather than a timer.
        const linear = Math.min(1, elapsed / NORMAL_COMPLETE_MS);
        const eased = 1 - Math.pow(1 - linear, 2.2);
        setPercent(Math.min(99, Math.round(eased * 100)));
        if (elapsed >= NORMAL_COMPLETE_MS) {
          if (intervalRef.current) window.clearInterval(intervalRef.current);
          finish();
        }
      }, 60);
    }

    // The skip. Nothing keeps this on screen past three seconds.
    timeoutRef.current = window.setTimeout(() => {
      if (intervalRef.current) window.clearInterval(intervalRef.current);
      finish();
    }, HARD_SKIP_MS);

    return () => {
      if (timeoutRef.current) window.clearTimeout(timeoutRef.current);
      if (intervalRef.current) window.clearInterval(intervalRef.current);
    };
  }, []);

  if (!visible && announced) {
    return (
      <p role="status" aria-live="polite" className="visually-hidden">
        The page is ready.
      </p>
    );
  }

  if (!visible) return null;

  return (
    <div id="preloader" role="status" aria-live="polite" aria-label="Loading Priscilla Events and Decor">
      <div className="preloader-inner">
        {reduced ? null : (
          <svg className="bloom" viewBox="0 0 132 132" aria-hidden="true">
            <g>
              {/* Eight petals, each with its own delay, blooming outward. */}
              {[0, 45, 90, 135, 180, 225, 270, 315].map((angle, index) => (
                <ellipse
                  key={angle}
                  className="petal"
                  style={{ '--p': index } as React.CSSProperties}
                  cx="66"
                  cy="38"
                  rx="13"
                  ry="27"
                  transform={`rotate(${angle} 66 66)`}
                  fill="var(--accent-color)"
                  opacity="0.9"
                />
              ))}
              <circle className="core" cx="66" cy="66" r="13" fill="var(--warm-gold)" />
            </g>
            <path
              className="stem"
              d="M66 79 L66 126 M66 104 L84 92 M66 112 L50 100"
              stroke="var(--warm-gold)"
              strokeWidth="2.5"
              strokeLinecap="round"
              fill="none"
            />
          </svg>
        )}

        <div className="preloader-wordmark">
          Priscilla Events
          <span>Events and Decor</span>
        </div>

        {reduced ? (
          <p className="preloader-percent">{percent} percent loaded</p>
        ) : (
          <>
            <div className="preloader-bar">
              <span style={{ width: `${percent}%` }} />
            </div>
            <p className="preloader-percent">{percent}%</p>
          </>
        )}
      </div>
    </div>
  );
}
