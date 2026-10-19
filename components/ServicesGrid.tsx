import Link from 'next/link';
import type { Service } from '@/lib/services';
import Reveal from './Reveal';

/**
 * The eight service cards, in a four column grid that steps down to two and then
 * one. Each card carries a real photograph, the service name, a short
 * description and an Enquire About This call to action that arrives at the
 * enquiry form with the service already selected.
 *
 * Hover state, at 250ms ease, as the brief specifies: the photograph zooms
 * softly, the shadow lifts, and the accent border arrives from the design
 * source's accent token.
 */
export default function ServicesGrid({
  services,
  columns = 4,
}: {
  services: Service[];
  columns?: 3 | 4;
}) {
  return (
    <div className="services-grid">
      {services.map((service, index) => (
        <Reveal key={service.id} delay={index * 60} className="service-card-wrap">
          <article className="service-card" id={service.id}>
            <div className="service-card-media">
              <img
                src={service.image}
                alt={service.imageAlt}
                width={1400}
                height={932}
                loading="lazy"
                decoding="async"
              />
              <span className="service-tag">{service.bestFor}</span>
            </div>

            <div className="service-card-body">
              <h3 className="service-card-title">{service.name}</h3>
              <p className="service-card-copy">{service.short}</p>
              <div className="service-card-foot">
                <Link
                  href={`/enquire?service=${encodeURIComponent(service.name)}`}
                  className="link-cta"
                  aria-label={`Enquire about ${service.name}`}
                >
                  Enquire About This <i className="bi bi-arrow-right" aria-hidden="true" />
                </Link>
              </div>
            </div>
          </article>
        </Reveal>
      ))}

      {columns === 3 ? null : null}
    </div>
  );
}
