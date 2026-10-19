import Link from 'next/link';
import type { ReactNode } from 'react';

/**
 * Renders a legal document with a sticky table of contents.
 *
 * Both the contents list and the numbered headings are generated from the same
 * array, so an anchor can never point at a heading that is not there. The
 * "last updated" line is deliberately visible, because a policy without a date
 * is not worth much.
 */

export type LegalSection = {
  /** Anchor slug. */
  id: string;
  title: string;
  body: ReactNode;
};

export default function LegalPage({
  eyebrow,
  title,
  intro,
  updated,
  effective,
  sections,
}: {
  eyebrow: string;
  title: string;
  intro: string;
  updated: string;
  effective: string;
  sections: LegalSection[];
}) {
  return (
    <section className="section">
      <div className="shell">
        <div className="legal-layout">
          <nav className="legal-toc" aria-label="On this page">
            <h2>On this page</h2>
            <ol>
              {sections.map((section) => (
                <li key={section.id}>
                  <a href={`#${section.id}`}>{section.title}</a>
                </li>
              ))}
            </ol>
            <p className="meta" style={{ marginTop: 18, marginBottom: 0 }}>
              Last updated {updated}
              <br />
              Effective {effective}
            </p>
            <p className="meta" style={{ marginTop: 14, marginBottom: 0 }}>
              Questions about this policy? Write to{' '}
              <a href="mailto:hello@priscillaeventsanddecor.co.ke">hello@priscillaeventsanddecor.co.ke</a>.
            </p>
            <p className="meta" style={{ marginTop: 14, marginBottom: 0 }}>
              <Link href="/contact">Contact the studio</Link>
            </p>
          </nav>

          <div className="legal-body">
            <span className="eyebrow">{eyebrow}</span>
            <h1 style={{ fontSize: 'var(--fs-h2)' }}>{title}</h1>
            <p className="section-lead" style={{ marginLeft: 0, marginBottom: 20 }}>
              {intro}
            </p>
            <p className="legal-note">
              This page is written in plain English on purpose. It is a working policy for
              Priscilla Events and Decor, a Kenyan business, and it is framed around the Kenya Data
              Protection Act 2019. It is not legal advice, and we recommend a Kenyan advocate
              reviews it before you rely on it commercially.
            </p>

            {sections.map((section) => (
              <section key={section.id} id={section.id} aria-labelledby={`${section.id}-heading`}>
                <h2 id={`${section.id}-heading`}>{section.title}</h2>
                {section.body}
              </section>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
