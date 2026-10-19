import Link from 'next/link';
import { CONTACT } from '@/lib/site';

/**
 * Hero.
 *
 * Geometry from the design source: width 100%, min-height 100vh, flex column,
 * centered, with the source's 100px top padding folded into the header offset.
 *
 * The headline enters letter by letter on a slow, elegant ease, which is driven
 * purely by CSS: each letter carries an index in --i and the keyframes do the
 * rest, so it plays without waiting for JavaScript and cannot block first paint.
 * Under reduced motion the CSS in SECTION 25 shows the letters immediately.
 *
 * The photograph carries a twenty second Ken Burns zoom, looping, on a soft warm
 * overlay that keeps the image clearly visible underneath.
 */

const HEADLINE = 'We Style the Moments That Matter Most.';
const SUBTEXT =
  'Floral design, event styling, and decor for weddings, galas, and celebrations in Nairobi.';

/** Splits into words, then letters, preserving spaces so wrapping stays natural. */
function Lettered({ text }: { text: string }) {
  const words = text.split(' ');
  let index = 0;

  return (
    <>
      {words.map((word, wordIndex) => (
        <span key={`${word}-${wordIndex}`} style={{ whiteSpace: 'nowrap', display: 'inline-block' }}>
          {Array.from(word).map((char) => {
            const current = index;
            index += 1;
            return (
              <span
                key={`${char}-${current}`}
                className="letter"
                style={{ '--i': current } as React.CSSProperties}
              >
                {char}
              </span>
            );
          })}
          {wordIndex < words.length - 1 ? <span className="letter-space" aria-hidden="true" /> : null}
        </span>
      ))}
    </>
  );
}

export default function Hero() {
  return (
    <section id="hero" className="hero dark-background" aria-label="Introduction">
      <div className="hero-media">
        {/*
          The hero photograph. Above the fold, so it loads eagerly with a high
          priority hint rather than lazily.
        */}
        <img
          src="/images/hero-venue-draped-hall.jpg"
          alt="A ballroom dressed by Priscilla Events and Decor, with a draped ceiling, floral centrepieces and warm lighting"
          width={1400}
          height={932}
          fetchPriority="high"
          decoding="async"
        />
      </div>
      <div className="hero-overlay" aria-hidden="true" />

      <div className="hero-inner">
        <span className="eyebrow on-dark">Nairobi, Kenya</span>

        <h1 className="hero-title">
          <span className="visually-hidden">{HEADLINE}</span>
          <span aria-hidden="true">
            <Lettered text={HEADLINE} />
          </span>
        </h1>

        <p className="hero-sub">{SUBTEXT}</p>

        <div className="hero-actions">
          <Link href="/portfolio" className="btn btn-primary">
            View Our Portfolio
          </Link>
          <Link href="/enquire" className="btn btn-outline">
            Get a Quote
          </Link>
        </div>

        <div className="hero-badges">
          <span>
            <i className="bi bi-flower1" aria-hidden="true" /> Weddings and galas
          </span>
          <span>
            <i className="bi bi-clock-history" aria-hidden="true" /> Planning since 2016
          </span>
          <span>
            <i className="bi bi-star-fill" aria-hidden="true" /> 1200 events styled
          </span>
        </div>
      </div>

      <a href="#services" className="hero-scroll" aria-label="Scroll to our services">
        <span>Scroll</span>
        <i className="bi bi-chevron-down" aria-hidden="true" />
        <span className="visually-hidden">{CONTACT.responsePromise}</span>
      </a>
    </section>
  );
}
