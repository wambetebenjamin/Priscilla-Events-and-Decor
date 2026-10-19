import Link from 'next/link';
import { SITE } from '@/lib/site';

/**
 * The Priscilla Events wordmark.
 *
 * The mark is an eight petal bloom drawn in the brand accent, which is the same
 * bloom that animates petal by petal on the loading screen. It is inline SVG, so
 * there is no icon font to block first paint and no image request at all.
 */
export function BloomMark({ className = 'brand-mark' }: { className?: string }) {
  return (
    <svg
      className={className}
      viewBox="0 0 48 48"
      role="img"
      aria-hidden="true"
      focusable="false"
    >
      <g fill="currentColor">
        {[0, 45, 90, 135, 180, 225, 270, 315].map((angle) => (
          <ellipse
            key={angle}
            cx="24"
            cy="13.5"
            rx="4.6"
            ry="9.4"
            transform={`rotate(${angle} 24 24)`}
            opacity={angle % 90 === 0 ? 0.95 : 0.72}
          />
        ))}
      </g>
      <circle cx="24" cy="24" r="4.6" fill="var(--warm-gold, #c39a5f)" />
    </svg>
  );
}

type Props = {
  /** Adds the tagline under the wordmark. */
  withTagline?: boolean;
  /** Rendered as a link by default, plain text when false. */
  asLink?: boolean;
  className?: string;
};

export default function Brand({ withTagline = true, asLink = true, className = '' }: Props) {
  const content = (
    <>
      <BloomMark />
      <span className="brand-text">
        <span className="brand-name">Priscilla Events</span>
        {withTagline ? <span className="brand-sub">Events and Decor</span> : null}
      </span>
    </>
  );

  if (!asLink) {
    return <span className={`brand ${className}`}>{content}</span>;
  }

  return (
    <Link href="/" className={`brand ${className}`} aria-label={`${SITE.name}, home`}>
      {content}
    </Link>
  );
}
