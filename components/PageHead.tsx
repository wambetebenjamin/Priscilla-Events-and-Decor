import Link from 'next/link';
import { SERVICES } from '@/lib/services';
import { PORTFOLIO } from '@/lib/portfolio';

/** Shared page header with a photograph, breadcrumbs and a title. */
export default function PageHead({
  eyebrow,
  title,
  intro,
  crumbs,
  image,
  imageAlt,
  children,
}: {
  eyebrow?: string;
  title: string;
  intro?: string;
  crumbs?: { name: string; href: string }[];
  image?: string;
  imageAlt?: string;
  children?: React.ReactNode;
}) {
  return (
    <section className="page-head">
      {image ? (
        <div className="page-head-media" aria-hidden="true">
          <img src={image} alt={imageAlt ?? ''} width={1400} height={932} fetchPriority="high" />
        </div>
      ) : null}

      <div className="shell">
        {crumbs && crumbs.length > 0 ? (
          <nav className="crumbs" aria-label="Breadcrumb">
            <Link href="/">Home</Link>
            {crumbs.map((crumb) => (
              <span key={crumb.href}>
                <span aria-hidden="true"> / </span>
                <Link href={crumb.href}>{crumb.name}</Link>
              </span>
            ))}
          </nav>
        ) : null}

        {eyebrow ? <span className="eyebrow on-dark">{eyebrow}</span> : null}
        <h1>{title}</h1>
        {intro ? <p>{intro}</p> : null}
        {children}
      </div>
    </section>
  );
}

/** Convenience: a section header with an optional lead paragraph. */
export function SectionHead({
  eyebrow,
  title,
  lead,
  align = 'center',
  id,
}: {
  eyebrow?: string;
  title: string;
  lead?: string;
  align?: 'center' | 'left';
  id?: string;
}) {
  return (
    <div className={`section-head ${align === 'left' ? 'left' : ''}`}>
      {eyebrow ? <span className="eyebrow">{eyebrow}</span> : null}
      <h2 className="section-title" id={id}>
        {title}
      </h2>
      {lead ? <p className="section-lead">{lead}</p> : null}
    </div>
  );
}

/** Small helper used by several pages to render a gallery preview strip. */
export function GalleryPreview({ count = 4 }: { count?: number }) {
  const picks = PORTFOLIO.slice(0, count);
  return (
    <div className="error-gallery-grid">
      {picks.map((event) => (
        <Link key={event.slug} href={`/portfolio/${event.slug}`} aria-label={event.title}>
          <img
            src={event.image}
            alt={event.imageAlt}
            width={600}
            height={450}
            loading="lazy"
            decoding="async"
          />
        </Link>
      ))}
    </div>
  );
}

/** The eight services, as plain links, reused in a few places. */
export function ServiceLinks() {
  return (
    <ul style={{ columns: 2, paddingLeft: 20 }}>
      {SERVICES.map((service) => (
        <li key={service.id}>
          <Link href={`/services#${service.id}`}>{service.name}</Link>
        </li>
      ))}
    </ul>
  );
}
