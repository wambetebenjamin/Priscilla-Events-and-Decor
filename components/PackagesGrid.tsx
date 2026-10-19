import Link from 'next/link';
import { PACKAGES, depositFor, formatKes } from '@/lib/packages';
import Reveal from './Reveal';

/**
 * The three packages.
 *
 * The middle card, The Bloom Package, is the one most clients choose, so it sits
 * slightly elevated and carries the accent border and the most requested flag.
 * On hover every card lifts with a shadow and an accent border top at 200ms, and
 * the featured card lifts further so it stays the centre of attention.
 */
export default function PackagesGrid({ compact = false }: { compact?: boolean }) {
  return (
    <div className="packages-grid">
      {PACKAGES.map((item, index) => (
        <Reveal key={item.id} delay={index * 80}>
          <article
            className={`package-card ${item.featured ? 'is-featured' : ''}`}
            id={item.id}
            aria-labelledby={`package-${item.id}-name`}
          >
            {item.featured ? <span className="package-flag">Most requested</span> : null}

            <h3 className="package-name" id={`package-${item.id}-name`}>
              {item.name}
            </h3>
            <p className="package-for">{item.suitable}</p>

            {!compact ? <p>{item.summary}</p> : null}

            <ul className="package-list">
              {item.includes.map((line) => (
                <li key={line}>
                  <i className="bi bi-check2" aria-hidden="true" />
                  <span>{line}</span>
                </li>
              ))}
            </ul>

            <div className="package-price">
              <span className="from">Starting from</span>
              <span className="amount">{formatKes(item.startingPrice)}</span>
              <p className="note">
                {item.guestRange}. A {formatKes(depositFor(item.startingPrice))} deposit confirms
                your date.
              </p>
              <Link
                href={`/enquire?package=${item.id}&intent=package`}
                className={`btn btn-block ${item.featured ? 'btn-primary' : 'btn-quiet'}`}
                aria-label={`Book ${item.name}, starting from ${formatKes(item.startingPrice)}`}
              >
                Book This Package
              </Link>
            </div>
          </article>
        </Reveal>
      ))}
    </div>
  );
}
