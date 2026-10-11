/**
 * Portfolio events.
 *
 * These entries are sample content written to the shape of a real portfolio so
 * that every layout, filter and lightbox path is exercised, and so the
 * structured data and sitemap have realistic slugs to work from. Replace the
 * titles, dates, venues and descriptions with Priscilla's own events before
 * launch. Photograph credits are in image-credits.md.
 */

export const PORTFOLIO_CATEGORIES = [
  'All',
  'Weddings',
  'Birthdays',
  'Corporate',
  'Galas',
  'Intimate Events',
] as const;

export type PortfolioCategory = Exclude<(typeof PORTFOLIO_CATEGORIES)[number], 'All'>;

export type PortfolioEvent = {
  slug: string;
  title: string;
  category: PortfolioCategory;
  /** Display date, for example "February 2026". */
  date: string;
  /** ISO date, used for sorting and structured data. */
  isoDate: string;
  venue: string;
  venueArea: string;
  guestCount: string;
  services: string[];
  description: string;
  image: string;
  imageAlt: string;
  /** Drives the aspect ratio in the masonry grid so the layout stays even. */
  aspect: 'portrait' | 'landscape' | 'square';
};

export const PORTFOLIO: PortfolioEvent[] = [
  {
    slug: 'draped-ballroom-wedding-nairobi',
    title: 'A Draped Ballroom Wedding',
    category: 'Weddings',
    date: 'February 2026',
    isoDate: '2026-02-14',
    venue: 'Villa Rosa Kempinski',
    venueArea: 'Chiromo, Nairobi',
    guestCount: '320 guests',
    services: ['Wedding decor and styling', 'Floral arrangements', 'Lighting design'],
    description:
      'Full ceiling draping, forty floral centrepieces in cream and blush, and a warm uplight wash that carried the room from the ceremony through to the last dance.',
    image: '/images/hero-venue-draped-hall.jpg',
    imageAlt: 'A draped ballroom ceiling above tables dressed with flowers',
    aspect: 'landscape',
  },
  {
    slug: 'garden-wedding-karen',
    title: 'A Garden Wedding in Karen',
    category: 'Weddings',
    date: 'January 2026',
    isoDate: '2026-01-24',
    venue: 'Private residence',
    venueArea: 'Karen, Nairobi',
    guestCount: '180 guests',
    services: ['Wedding decor and styling', 'Floral arrangements', 'Backdrop and stage design'],
    description:
      'An open air aisle framed with seasonal blooms and sheer draping, followed by a marquee reception styled in sand, terracotta and soft gold.',
    image: '/images/venue-garden-aisle.jpg',
    imageAlt: 'A garden aisle finished with draping and floral arrangements',
    aspect: 'portrait',
  },
  {
    slug: 'sunset-ceremony-ngong-hills',
    title: 'A Sunset Ceremony Above Ngong',
    category: 'Weddings',
    date: 'December 2025',
    isoDate: '2025-12-06',
    venue: 'Private ridge venue',
    venueArea: 'Ngong Hills, Kajiado',
    guestCount: '120 guests',
    services: ['Lighting design', 'Wedding decor and styling'],
    description:
      'We planned the whole ceremony around the light, holding the aisle to the last twenty minutes before sunset and finishing it with festoon and candle work.',
    image: '/images/venue-dusk-ceremony.jpg',
    imageAlt: 'An outdoor ceremony set for dusk beneath the evening sky',
    aspect: 'portrait',
  },
  {
    slug: 'traditional-ceremony-runda',
    title: 'A Traditional Ceremony in Runda',
    category: 'Weddings',
    date: 'November 2025',
    isoDate: '2025-11-15',
    venue: 'Private residence',
    venueArea: 'Runda, Nairobi',
    guestCount: '260 guests',
    services: ['Floral arrangements', 'Table setting and linen', 'Venue transformation'],
    description:
      'A two part day: a traditional ceremony dressed in colour and print, then an evening reception restyled in white and gold on the same lawn.',
    image: '/images/portfolio-traditional-ceremony.jpg',
    imageAlt: 'A couple in traditional bridal attire at an outdoor ceremony',
    aspect: 'portrait',
  },
  {
    slug: 'bridal-shower-lavington',
    title: 'A Bridal Shower in Lavington',
    category: 'Intimate Events',
    date: 'November 2025',
    isoDate: '2025-11-02',
    venue: 'Private garden',
    venueArea: 'Lavington, Nairobi',
    guestCount: '28 guests',
    services: ['Floral arrangements', 'Table setting and linen'],
    description:
      'A long table under a pergola, low bowl arrangements so nobody had to talk around flowers, and a floral arch behind the seating for photographs.',
    image: '/images/portfolio-bridal-table.jpg',
    imageAlt: 'A long reception table with a floral centrepiece and candles',
    aspect: 'landscape',
  },
  {
    slug: 'milestone-fiftieth-birthday-westlands',
    title: 'A Fiftieth Birthday in Westlands',
    category: 'Birthdays',
    date: 'October 2025',
    isoDate: '2025-10-18',
    venue: 'Rooftop restaurant',
    venueArea: 'Westlands, Nairobi',
    guestCount: '95 guests',
    services: ['Birthday party decor', 'Lighting design', 'Floral arrangements'],
    description:
      'Gold and black with a floral cake table, a balloon installation framing the entrance and festoon lighting that made the rooftop feel like a room.',
    image: '/images/birthday-gold-setup.jpg',
    imageAlt: 'A golden birthday setup with a cake and decorations',
    aspect: 'portrait',
  },
  {
    slug: 'first-birthday-karen-country-club',
    title: 'A First Birthday at the Country Club',
    category: 'Birthdays',
    date: 'September 2025',
    isoDate: '2025-09-27',
    venue: 'Karen Country Club',
    venueArea: 'Karen, Nairobi',
    guestCount: '70 guests',
    services: ['Birthday party decor', 'Table setting and linen'],
    description:
      'A children zone, a dessert bar and a cake table built around a pastel palette, all scaled so the adults tables still felt like a grown up lunch.',
    image: '/images/service-birthday-decor.jpg',
    imageAlt: 'A birthday setup with balloons, florals and a cake table',
    aspect: 'portrait',
  },
  {
    slug: 'sweet-sixteenth-muthaiga',
    title: 'A Sweet Sixteenth in Muthaiga',
    category: 'Birthdays',
    date: 'August 2025',
    isoDate: '2025-08-16',
    venue: 'Family residence',
    venueArea: 'Muthaiga, Nairobi',
    guestCount: '110 guests',
    services: ['Birthday party decor', 'Backdrop and stage design'],
    description:
      'A red and cream palette, an illuminated number backdrop and a dance floor surround styled so the photographs looked as good at midnight as at eight.',
    image: '/images/birthday-red-wall.jpg',
    imageAlt: 'A styled birthday corner with a number balloon and cake',
    aspect: 'portrait',
  },
  {
    slug: 'annual-gala-upper-hill',
    title: 'An Annual Charity Gala',
    category: 'Galas',
    date: 'December 2025',
    isoDate: '2025-12-12',
    venue: 'Radisson Blu Upper Hill',
    venueArea: 'Upper Hill, Nairobi',
    guestCount: '400 guests',
    services: ['Corporate event styling', 'Lighting design', 'Backdrop and stage design'],
    description:
      'A one night gala with a branded stage, thirty five gala tables and a lighting design that turned the donor film into the centrepiece of the evening.',
    image: '/images/service-corporate-events.jpg',
    imageAlt: 'A themed gala hall set up with elegant lighting and tables',
    aspect: 'landscape',
  },
  {
    slug: 'awards-night-sankara',
    title: 'An Awards Night at Sankara',
    category: 'Galas',
    date: 'November 2025',
    isoDate: '2025-11-28',
    venue: 'Sankara Nairobi',
    venueArea: 'Westlands, Nairobi',
    guestCount: '220 guests',
    services: ['Corporate event styling', 'Backdrop and stage design'],
    description:
      'Stage set, awards plinth, winner backdrop and step and repeat, all built to the client brand book down to the accent tone and the type treatment.',
    image: '/images/corporate-stage-lighting.jpg',
    imageAlt: 'A stage with dramatic lighting set for an event',
    aspect: 'landscape',
  },
  {
    slug: 'product-launch-industrial-area',
    title: 'A Product Launch',
    category: 'Corporate',
    date: 'October 2025',
    isoDate: '2025-10-09',
    venue: 'Warehouse venue',
    venueArea: 'Industrial Area, Nairobi',
    guestCount: '300 guests',
    services: ['Venue transformation', 'Lighting design'],
    description:
      'An empty warehouse turned into a finished room in two days with full ceiling draping, flooring, a lit reveal wall and a staged product moment.',
    image: '/images/service-venue-transformation.jpg',
    imageAlt: 'A warehouse venue transformed with draping and lighting',
    aspect: 'landscape',
  },
  {
    slug: 'leadership-dinner-heimingways',
    title: 'A Leadership Dinner',
    category: 'Corporate',
    date: 'September 2025',
    isoDate: '2025-09-11',
    venue: 'Hemingways Nairobi',
    venueArea: 'Karen, Nairobi',
    guestCount: '60 guests',
    services: ['Table setting and linen', 'Floral arrangements', 'Lighting design'],
    description:
      'A quiet, precise dinner for sixty: single stem arrangements in a row, low candle light and place settings matched to the menu card stock.',
    image: '/images/portfolio-fine-dining.jpg',
    imageAlt: 'A fine dining place setting with a floral centrepiece',
    aspect: 'landscape',
  },
  {
    slug: 'hotel-partnership-serena',
    title: 'A Hotel Styling Partnership',
    category: 'Corporate',
    date: 'August 2025',
    isoDate: '2025-08-20',
    venue: 'Nairobi Serena Hotel',
    venueArea: 'Nairobi Central',
    guestCount: 'Ongoing programme',
    services: ['Venue transformation', 'Floral arrangements', 'Lighting design'],
    description:
      'A standing partnership covering weekly floral programmes and seasonal event styling across four function rooms, with a set palette per room.',
    image: '/images/venue-hall-greenery.jpg',
    imageAlt: 'A hotel function room dressed with greenery and warm lighting',
    aspect: 'landscape',
  },
  {
    slug: 'anniversary-dinner-ngara',
    title: 'A Twentieth Anniversary Dinner',
    category: 'Intimate Events',
    date: 'July 2025',
    isoDate: '2025-07-19',
    venue: 'Rooftop terrace',
    venueArea: 'Ngara, Nairobi',
    guestCount: '42 guests',
    services: ['Table setting and linen', 'Floral arrangements', 'Lighting design'],
    description:
      'One long table, all candle light, and a floral runner built in sections so guests could still pass dishes down the table.',
    image: '/images/portfolio-intimate-table.jpg',
    imageAlt: 'A refined candlelit table set for a private celebration',
    aspect: 'landscape',
  },
  {
    slug: 'proposal-dinner-muthaiga',
    title: 'A Proposal Dinner',
    category: 'Intimate Events',
    date: 'June 2025',
    isoDate: '2025-06-21',
    venue: 'Private residence',
    venueArea: 'Muthaiga, Nairobi',
    guestCount: '2 guests',
    services: ['Floral arrangements', 'Lighting design', 'Table setting and linen'],
    description:
      'A single table for two in a garden, two hundred candles, and the whole thing struck and cleared within an hour so it stayed a surprise.',
    image: '/images/portfolio-moody-dinner.jpg',
    imageAlt: 'A candlelit table with vintage decor for an intimate dinner',
    aspect: 'portrait',
  },
  {
    slug: 'baby-shower-kileleshwa',
    title: 'A Garden Baby Shower',
    category: 'Intimate Events',
    date: 'May 2025',
    isoDate: '2025-05-17',
    venue: 'Private garden',
    venueArea: 'Kileleshwa, Nairobi',
    guestCount: '35 guests',
    services: ['Floral arrangements', 'Table setting and linen'],
    description:
      'Soft neutral tones, a floral swing seat for photographs and a dessert table set under the shade of an old jacaranda.',
    image: '/images/portfolio-candlelit-dinner.jpg',
    imageAlt: 'A soft styled table set for an intimate garden gathering',
    aspect: 'portrait',
  },
  {
    slug: 'white-wedding-nairobi-central',
    title: 'A White Christmas Wedding',
    category: 'Weddings',
    date: 'December 2025',
    isoDate: '2025-12-20',
    venue: 'Fairmont The Norfolk',
    venueArea: 'Nairobi Central',
    guestCount: '240 guests',
    services: ['Wedding decor and styling', 'Floral arrangements', 'Lighting design'],
    description:
      'All white florals with silver and crystal accents, a marble aisle runner and a courtyard lit entirely by candle and low warm light.',
    image: '/images/venue-wedding-banquet.jpg',
    imageAlt: 'Banquet tables dressed in white for a wedding reception',
    aspect: 'landscape',
  },
  {
    slug: 'wedding-tent-lawn-ceremony',
    title: 'A Lawn Wedding Under Canvas',
    category: 'Weddings',
    date: 'March 2025',
    isoDate: '2025-03-08',
    venue: 'Private tented venue',
    venueArea: 'Limuru, Kiambu',
    guestCount: '300 guests',
    services: ['Venue transformation', 'Wedding decor and styling', 'Table setting and linen'],
    description:
      'A clear span tent dressed from the ceiling down, with a floral entrance tunnel and tables laid in three linen tones so the room read as a whole.',
    image: '/images/portfolio-african-wedding-tent.jpg',
    imageAlt: 'A bride and groom walking through a dressed reception tent',
    aspect: 'landscape',
  },
];

export function getEvent(slug: string): PortfolioEvent | undefined {
  return PORTFOLIO.find((event) => event.slug === slug);
}

export function eventsByCategory(category: (typeof PORTFOLIO_CATEGORIES)[number]): PortfolioEvent[] {
  if (category === 'All') return PORTFOLIO;
  return PORTFOLIO.filter((event) => event.category === category);
}

/** Newest first, used by the sitemap and the home page gallery preview. */
export const PORTFOLIO_BY_DATE = [...PORTFOLIO].sort((a, b) => (a.isoDate < b.isoDate ? 1 : -1));

/** Category counts, used to label the filter tabs. */
export function categoryCount(category: (typeof PORTFOLIO_CATEGORIES)[number]): number {
  return eventsByCategory(category).length;
}
