import { TESTIMONIALS } from '@/lib/testimonials';
import Reveal from './Reveal';

/**
 * Client testimonials.
 *
 * First name only, with the event type and month, and a photograph of the styled
 * event set beside the quote. They stagger in on scroll, sixty milliseconds apart.
 */
export default function Testimonials() {
  return (
    <div className="testimonial-grid">
      {TESTIMONIALS.map((item, index) => (
        <Reveal key={`${item.name}-${item.eventType}`} delay={index * 60} variant="scale">
          <figure className="testimonial">
            <div className="testimonial-media">
              <img
                src={item.image}
                alt={item.imageAlt}
                width={900}
                height={700}
                loading="lazy"
                decoding="async"
              />
            </div>
            <div className="testimonial-body">
              <div className="testimonial-stars" aria-label="Rated five out of five">
                <i className="bi bi-star-fill" aria-hidden="true" />
                <i className="bi bi-star-fill" aria-hidden="true" />
                <i className="bi bi-star-fill" aria-hidden="true" />
                <i className="bi bi-star-fill" aria-hidden="true" />
                <i className="bi bi-star-fill" aria-hidden="true" />
              </div>
              <blockquote className="testimonial-quote">{item.quote}</blockquote>
              <figcaption className="testimonial-who">
                <strong>{item.name}</strong>
                {item.eventType}, {item.month}
                <br />
                {item.venue}
              </figcaption>
            </div>
          </figure>
        </Reveal>
      ))}
    </div>
  );
}
