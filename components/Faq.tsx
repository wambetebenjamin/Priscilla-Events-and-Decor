'use client';

/**
 * Expandable questions.
 *
 * The markup and behaviour mirror the design source's faq-item pattern, which the
 * inventory recorded: clicking the heading or the toggle flips .faq-active on the
 * parent. Here that is expressed as real button state so it is keyboard operable
 * and announced properly.
 *
 * Only render these for questions whose answers are visible on the page, because
 * FAQ structured data has to match what a visitor can actually read.
 */

import { useState } from 'react';

export type FaqEntry = { question: string; answer: string };

export default function Faq({ items }: { items: FaqEntry[] }) {
  const [open, setOpen] = useState<number | null>(0);

  return (
    <div className="faq-list">
      {items.map((item, index) => {
        const isOpen = open === index;
        return (
          <div key={item.question} className={`faq-item ${isOpen ? 'is-open' : ''}`}>
            <h3>
              <button
                type="button"
                aria-expanded={isOpen}
                aria-controls={`faq-panel-${index}`}
                id={`faq-button-${index}`}
                onClick={() => setOpen(isOpen ? null : index)}
              >
                <span>{item.question}</span>
                <i className="bi bi-chevron-down" aria-hidden="true" />
              </button>
            </h3>
            {isOpen ? (
              <div
                className="faq-answer"
                id={`faq-panel-${index}`}
                role="region"
                aria-labelledby={`faq-button-${index}`}
              >
                {item.answer}
              </div>
            ) : null}
          </div>
        );
      })}
    </div>
  );
}
