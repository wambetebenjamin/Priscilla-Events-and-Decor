/**
 * The eight services.
 *
 * Order and naming come straight from the brief. Swapping a photograph is a one
 * line change here: every card on the home page and on /services reads from this
 * list, so the two can never drift apart. Photograph credits are in
 * image-credits.md.
 */

export type Service = {
  /** Stable id, also used as the anchor slug on /services. */
  id: string;
  name: string;
  /** One line summary used on the card. */
  short: string;
  /** Longer copy for the services page. */
  detail: string;
  image: string;
  imageAlt: string;
  /** What the client actually receives. */
  includes: string[];
  /** Relative price signal, shown as a from price on /services. */
  fromPrice: number;
  bestFor: string;
};

export const SERVICES: Service[] = [
  {
    id: 'wedding-decor',
    name: 'Wedding Decor and Styling',
    short: 'Ceremony and reception styling built around your story, your venue and your guests.',
    detail:
      'We start with the venue, the light and your guest count, then build a look that holds together from the aisle to the last table. Everything is styled on site by our own team, and we work with your planner, your caterer and your venue so nothing collides on the day.',
    image: '/images/service-wedding-decor.jpg',
    imageAlt: 'A wedding venue dressed with elegant table settings and floral arrangements',
    includes: [
      'Design concept and mood board',
      'Ceremony and reception styling',
      'Aisle, arch and entrance dressing',
      'Table linen, glassware and cutlery',
      'On site set up and strike',
    ],
    fromPrice: 185000,
    bestFor: 'Weddings of 80 to 400 guests',
  },
  {
    id: 'floral-arrangements',
    name: 'Floral Arrangements',
    short: 'Seasonal blooms sourced from Kenyan growers, arranged by hand on site.',
    detail:
      'Our florists work with what is at its best that week, from Nairobi grown roses and hydrangeas to imported statement blooms for the pieces that carry the room. Bouquets, buttonholes, centrepieces, installations and hanging work are all built by us, so colour and scale stay consistent throughout.',
    image: '/images/service-floral-arrangements.jpg',
    imageAlt: 'A mixed pastel floral arrangement built for decor and weddings',
    includes: [
      'Bridal bouquet and bridal party florals',
      'Centrepieces and table arrangements',
      'Statement and hanging installations',
      'Entrance and welcome florals',
      'Flower conditioning and on site build',
    ],
    fromPrice: 65000,
    bestFor: 'Couples and hosts who want flowers to lead the look',
  },
  {
    id: 'lighting-design',
    name: 'Lighting Design',
    short: 'Warm, layered lighting that flatters the room, the food and the people in it.',
    detail:
      'Lighting is what separates a dressed venue from an unforgettable one. We plan uplighting, festoon and wash lighting, candle work and task lighting over tables, then set it to shift subtly as the evening moves from speeches to dancing.',
    image: '/images/service-lighting-design.jpg',
    imageAlt: 'A chandelier casting warm light across a decorated ceiling',
    includes: [
      'Lighting plan drawn over your venue layout',
      'Uplighting and wall wash',
      'Festoon, bistro and hanging lights',
      'Candle and table lamp styling',
      'Technician on site for the full event',
    ],
    fromPrice: 80000,
    bestFor: 'Evening receptions, galas and dark halls',
  },
  {
    id: 'table-setting',
    name: 'Table Setting and Linen',
    short: 'Linens, chargers, glassware and cutlery composed table by table.',
    detail:
      'We treat every table as its own small composition and then make the room read as one. Linen weights, napkin folds, charger finishes, glass shapes and centrepiece heights are all chosen against your menu and your venue, and everything is laid by our team before your guests arrive.',
    image: '/images/service-table-setting.jpg',
    imageAlt: 'A table setting with a floral centrepiece and gold place settings',
    includes: [
      'Linen, runners and napkins',
      'Chargers, plates and cutlery',
      'Glassware and bar styling',
      'Place cards and menu styling',
      'Head table and cake table dressing',
    ],
    fromPrice: 45000,
    bestFor: 'Hosts who care about the details up close',
  },
  {
    id: 'backdrop-stage',
    name: 'Backdrop and Stage Design',
    short: 'Backdrops, draping and stages built for photographs and for presence.',
    detail:
      'Backdrops are what your guests photograph most, so we build them properly: framed, weighted, lit and finished on the reverse side too. Draping, panelling, floral walls, monograms and stage sets are all fabricated and installed by our team.',
    image: '/images/service-backdrop-stage.jpg',
    imageAlt: 'A dressed backdrop wall with planting and warm lighting',
    includes: [
      'Ceremony and photo backdrops',
      'Draping and ceiling treatments',
      'Stage design and seating',
      'Floral walls and feature panels',
      'Branded and monogrammed finishes',
    ],
    fromPrice: 120000,
    bestFor: 'Ceremonies, galas, launches and award nights',
  },
  {
    id: 'birthday-decor',
    name: 'Birthday Party Decor',
    short: 'Milestone birthdays, showers and family parties with real presence.',
    detail:
      'From a first birthday in a Karen garden to a fiftieth in a rooftop restaurant, we scale the same care to the size of the guest list. Balloon work, cake tables, dessert bars, kids zones and photo moments are all styled as one look rather than separate corners.',
    image: '/images/service-birthday-decor.jpg',
    imageAlt: 'A birthday setup with balloons, florals and a cake table',
    includes: [
      'Balloon and installation work',
      'Cake and dessert table styling',
      'Photo moment and backdrop',
      'Kids zone and activity tables',
      'Balloon drop and celebration effects',
    ],
    fromPrice: 55000,
    bestFor: 'Birthdays, showers and family celebrations',
  },
  {
    id: 'corporate-events',
    name: 'Corporate Event Styling',
    short: 'Galas, launches, dinners and conferences dressed to your brand standards.',
    detail:
      'We work from your brand guidelines, not our own palette, and we deliver on procurement timelines with the paperwork, insurance and site compliance that corporate venues ask for. Styling is planned around your run of show so the stage is camera ready the moment it matters.',
    image: '/images/service-corporate-events.jpg',
    imageAlt: 'A themed corporate event hall set up with elegant lighting',
    includes: [
      'Brand aligned colour and finish',
      'Stage, podium and screen surrounds',
      'Registration and hospitality styling',
      'Gala dinner tables and centrepieces',
      'Multi day and multi site capability',
    ],
    fromPrice: 250000,
    bestFor: 'Corporates, hotels and venue partners',
  },
  {
    id: 'venue-transformation',
    name: 'Venue Transformation',
    short: 'Bare halls, gardens and rooftops turned into a finished, dressed room.',
    detail:
      'Some venues need everything brought in. We survey the space, plan power, access, rigging and load in times, then transform it with draping, flooring, lighting, planting and furniture until it no longer reads as the room it started as.',
    image: '/images/service-venue-transformation.jpg',
    imageAlt: 'A spacious venue transformed with decor, planting and lighting',
    includes: [
      'Venue survey and load in plan',
      'Full room draping and ceiling work',
      'Flooring, staging and furniture',
      'Planting and greenery builds',
      'Power, rigging and logistics',
    ],
    fromPrice: 320000,
    bestFor: 'Empty venues, gardens, marquees and rooftops',
  },
];

/** Handy when a page needs one service by id without importing the whole list. */
export function getService(id: string): Service | undefined {
  return SERVICES.find((service) => service.id === id);
}

export const SERVICE_NAMES = SERVICES.map((service) => service.name);
