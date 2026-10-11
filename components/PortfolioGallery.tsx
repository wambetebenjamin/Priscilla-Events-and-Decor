'use client';

/**
 * Portfolio gallery.
 *
 * A masonry grid, full width, with the filter tabs the brief lists: All,
 * Weddings, Birthdays, Corporate, Galas and Intimate Events. Items stagger in on
 * load. Clicking a card opens a lightbox with the enlarged image on one side and
 * the event name, date, venue and description beside it.
 *
 * The masonry is CSS columns, so it needs no measuring and no layout library, and
 * the column count steps down with the breakpoints in SECTION 24.
 */

import Link from 'next/link';
import { useEffect, useMemo, useRef, useState } from 'react';
import { PORTFOLIO_CATEGORIES, type PortfolioCategory, type PortfolioEvent } from '@/lib/portfolio';

type Filter = (typeof PORTFOLIO_CATEGORIES)[number];

export default function PortfolioGallery({
  events,
  initialFilter = 'All',
  limit,
}: {
  events: PortfolioEvent[];
  initialFilter?: Filter;
  limit?: number;
}) {
  const [filter, setFilter] = useState<Filter>(initialFilter);
  const [openIndex, setOpenIndex] = useState<number | null>(null);
  const triggered = useRef(false);

  const visible = useMemo(() => {
    const filtered = filter === 'All' ? events : events.filter((event) => event.category === filter);
    return typeof limit === 'number' ? filtered.slice(0, limit) : filtered;
  }, [events, filter, limit]);

  /** The first paint stagger, once. */
  const [revealed, setRevealed] = useState(false);
  useEffect(() => {
    if (triggered.current) return;
    triggered.current = true;
    const raf = window.requestAnimationFrame(() => setRevealed(true));
    return () => window.cancelAnimationFrame(raf);
  }, []);

  // Keyboard control for the lightbox, and a scroll lock behind it.
  useEffect(() => {
    if (openIndex === null) return;

    const onKey = (event: KeyboardEvent) => {
      if (event.key === 'Escape') setOpenIndex(null);
      if (event.key === 'ArrowRight') {
        setOpenIndex((current) => (current === null ? null : (current + 1) % visible.length));
      }
      if (event.key === 'ArrowLeft') {
        setOpenIndex((current) =>
          current === null ? null : (current - 1 + visible.length) % visible.length,
        );
      }
    };

    document.addEventListener('keydown', onKey);
    const previous = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => {
      document.removeEventListener('keydown', onKey);
      document.body.style.overflow = previous;
    };
  }, [openIndex, visible.length]);

  const open = openIndex === null ? null : visible[openIndex];

  return (
    <>
      <div className="filter-bar" role="tablist" aria-label="Filter the portfolio by event type">
        {PORTFOLIO_CATEGORIES.map((category) => {
          const count =
            category === 'All'
              ? events.length
              : events.filter((event) => event.category === category).length;
          return (
            <button
              key={category}
              type="button"
              role="tab"
              className="filter-tab"
              aria-selected={filter === category}
              onClick={() => {
                setFilter(category);
                setOpenIndex(null);
              }}
            >
              {category} ({count})
            </button>
          );
        })}
      </div>

      {visible.length === 0 ? (
        <p className="section-lead" style={{ textAlign: 'center' }}>
          There is nothing in this category yet. Choose another filter, or{' '}
          <Link href="/enquire">tell us about your event</Link>.
        </p>
      ) : null}

      <div className="masonry">
        {visible.map((event, index) => (
          <div
            key={event.slug}
            className="masonry-item"
            style={{
              opacity: revealed ? 1 : 0,
              transform: revealed ? 'none' : 'translateY(24px)',
              transition: `opacity 600ms ease-in-out ${index * 70}ms, transform 600ms ease-in-out ${index * 70}ms`,
            }}
          >
            <button
              type="button"
              className="portfolio-card"
              onClick={() => setOpenIndex(index)}
              aria-label={`Open ${event.title} at ${event.venue}`}
            >
              <img
                src={event.image}
                alt={event.imageAlt}
                width={event.aspect === 'portrait' ? 1400 : 1400}
                height={event.aspect === 'portrait' ? 1960 : event.aspect === 'square' ? 1400 : 932}
                loading="lazy"
                decoding="async"
              />
              <span className="portfolio-card-overlay">
                <h3>{event.title}</h3>
                <p>
                  {event.category} <span aria-hidden="true">/</span> {event.venueArea}
                </p>
              </span>
            </button>
          </div>
        ))}
      </div>

      {open ? (
        <div
          className="lightbox"
          role="dialog"
          aria-modal="true"
          aria-labelledby={`lightbox-title-${open.slug}`}
          onClick={(event) => {
            if (event.target === event.currentTarget) setOpenIndex(null);
          }}
        >
          <button
            type="button"
            className="lightbox-dismiss"
            onClick={() => setOpenIndex(null)}
            aria-label="Close this event"
          >
            <i className="bi bi-x-lg" aria-hidden="true" />
          </button>

          <div className="lightbox-panel">
            <figure className="lightbox-figure">
              <img
                src={open.image}
                alt={open.imageAlt}
                width={1400}
                height={open.aspect === 'portrait' ? 1960 : 932}
                decoding="async"
              />
            </figure>

            <div className="lightbox-body">
              <span className="eyebrow">{open.category}</span>
              <h2 id={`lightbox-title-${open.slug}`}>{open.title}</h2>

              <div className="lightbox-meta">
                <div>
                  Date <strong>{open.date}</strong>
                </div>
                <div>
                  Venue <strong>{open.venue}</strong>
                </div>
                <div>
                  Location <strong>{open.venueArea}</strong>
                </div>
                <div>
                  Guests <strong>{open.guestCount}</strong>
                </div>
                <div>
                  Services <strong>{open.services.join(', ')}</strong>
                </div>
              </div>

              <p className="lightbox-desc">{open.description}</p>

              <div className="lightbox-switch">
                <button
                  type="button"
                  onClick={() =>
                    setOpenIndex((current) =>
                      current === null ? null : (current - 1 + visible.length) % visible.length,
                    )
                  }
                >
                  <i className="bi bi-arrow-left" aria-hidden="true" /> Previous
                </button>
                <button
                  type="button"
                  onClick={() =>
                    setOpenIndex((current) => (current === null ? null : (current + 1) % visible.length))
                  }
                >
                  Next <i className="bi bi-arrow-right" aria-hidden="true" />
                </button>
              </div>

              <Link href={`/portfolio/${open.slug}`} className="link-cta" style={{ marginTop: 18 }}>
                Read the full story <i className="bi bi-arrow-right" aria-hidden="true" />
              </Link>

              <Link href="/enquire" className="btn btn-primary lightbox-close">
                Plan something like this
              </Link>
            </div>
          </div>
        </div>
      ) : null}
    </>
  );
}
