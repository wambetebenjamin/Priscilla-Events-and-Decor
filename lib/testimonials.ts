/**
 * Client testimonials.
 *
 * First name only, with the event type and month, exactly as the brief asks.
 * Each one carries a photograph of the styled event it describes.
 */

export type Testimonial = {
  name: string;
  eventType: string;
  month: string;
  quote: string;
  image: string;
  imageAlt: string;
  /** Where the work happened, shown under the name. */
  venue: string;
};

export const TESTIMONIALS: Testimonial[] = [
  {
    name: 'Wanjiru',
    eventType: 'Wedding',
    month: 'February 2026',
    quote:
      'They read the venue better than we did. The draping made a hall we almost rejected feel like somewhere we had chosen on purpose.',
    image: '/images/venue-floral-tables.jpg',
    imageAlt: 'A wedding venue dressed with vibrant floral table settings',
    venue: 'Villa Rosa Kempinski',
  },
  {
    name: 'David',
    eventType: 'Fiftieth birthday',
    month: 'October 2025',
    quote:
      'My mother cried when she walked in, and then spent forty minutes photographing the cake table. Worth every shilling.',
    image: '/images/birthday-gold-setup.jpg',
    imageAlt: 'A golden birthday setup with cake and decorations',
    venue: 'Rooftop restaurant, Westlands',
  },
  {
    name: 'Faith',
    eventType: 'Corporate gala',
    month: 'December 2025',
    quote:
      'Four hundred guests, a live auction and a donor film, and the room was ready ahead of schedule. Their crew knew the venue better than our own contractors.',
    image: '/images/service-corporate-events.jpg',
    imageAlt: 'A gala hall set up with elegant lighting',
    venue: 'Radisson Blu Upper Hill',
  },
  {
    name: 'Achieng',
    eventType: 'Traditional ceremony',
    month: 'November 2025',
    quote:
      'Two ceremonies in one day, two completely different looks, one team that never looked rushed. Our families are still talking about it.',
    image: '/images/portfolio-traditional-ceremony.jpg',
    imageAlt: 'A couple in traditional attire at an outdoor ceremony',
    venue: 'Private residence, Runda',
  },
  {
    name: 'Peter',
    eventType: 'Leadership dinner',
    month: 'September 2025',
    quote:
      'Precise, quiet and exactly on brand. Sixty senior guests and not one thing out of place on the tables.',
    image: '/images/portfolio-fine-dining.jpg',
    imageAlt: 'A fine dining place setting with a floral centrepiece',
    venue: 'Hemingways Nairobi',
  },
  {
    name: 'Grace',
    eventType: 'Garden wedding',
    month: 'January 2026',
    quote:
      'Priscilla asked about our families before she asked about flowers. That is why the whole day felt like ours and not like a template.',
    image: '/images/venue-garden-aisle.jpg',
    imageAlt: 'A garden aisle dressed with flowers and draping',
    venue: 'Private residence, Karen',
  },
];
