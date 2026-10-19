/**
 * Brand and contact constants for Priscilla Events and Decor.
 *
 * The WhatsApp number, address and response promise live here so a change is a
 * one line edit. Nothing secret is stored here: every credential is read from
 * the environment at the point of use, server side only.
 */

export const SITE = {
  name: 'Priscilla Events and Decor',
  shortName: 'Priscilla Events',
  /** Used in titles, JSON-LD and Open Graph. */
  legalName: 'Priscilla Events and Decor',
  tagline: 'Floral design, event styling and decor in Nairobi',
  description:
    'Priscilla Events and Decor designs flowers, tables, lighting and full venue styling for weddings, corporate galas, birthdays and private celebrations across Nairobi and Kenya.',
  url: process.env.NEXT_PUBLIC_SITE_URL ?? 'https://priscillaeventsanddecor.co.ke',
  locale: 'en_KE',
  language: 'en-KE',
  founded: '2016',
  currency: 'KES',
} as const;

export const CONTACT = {
  /** WhatsApp number, digits only, international format. */
  whatsapp: '254112272061',
  /** Human readable form of the same number. */
  phoneDisplay: '+254 112 272 061',
  phoneHref: 'tel:+254112272061',
  email: 'hello@priscillaeventsanddecor.co.ke',
  eventsEmail: 'events@priscillaeventsanddecor.co.ke',
  bridalEmail: 'bridal@priscillaeventsanddecor.co.ke',
  responsePromise: 'We respond to all enquiries within 4 hours.',
  studio: {
    street: 'Kibagathi Road, Ngara',
    area: 'Ngara',
    city: 'Nairobi',
    region: 'Nairobi County',
    postalCode: '00600',
    country: 'KE',
    countryName: 'Kenya',
    /** Full address for display. */
    display: 'Kibagathi Road, Ngara, Nairobi 00600, Kenya',
    /** Coordinates used by the Google Maps embed and the JSON-LD geo block. */
    latitude: -1.2773,
    longitude: 36.8288,
  },
  hours: [
    { days: 'Monday to Friday', time: '8:00 am to 6:00 pm' },
    { days: 'Saturday', time: '9:00 am to 4:00 pm' },
    { days: 'Sunday', time: 'By appointment for site visits' },
  ],
  /** Pre-filled WhatsApp deep link, used by the floating button and CTAs. */
  whatsappLink:
    'https://wa.me/254112272061?text=Hello!%20I%20would%20like%20to%20enquire%20about%20event%20decoration%20from%20Priscilla%20Events.',
  whatsappTooltip: 'Tell us about your event',
} as const;

export const SOCIAL = {
  instagram: 'https://instagram.com/priscillaeventsanddecor',
  facebook: 'https://facebook.com/priscillaeventsanddecor',
  tiktok: 'https://tiktok.com/@priscillaeventsanddecor',
  pinterest: 'https://pinterest.com/priscillaeventsanddecor',
  linkedin: 'https://linkedin.com/company/priscillaeventsanddecor',
} as const;

/** Primary navigation, in the order the brief specifies. */
export const NAV = [
  { label: 'Home', href: '/' },
  { label: 'Portfolio', href: '/portfolio' },
  { label: 'Services', href: '/services' },
  { label: 'Packages', href: '/packages' },
  { label: 'About', href: '/about' },
  { label: 'Blog', href: '/blog' },
  { label: 'Contact', href: '/contact' },
] as const;

/** Secondary navigation for the footer. */
export const FOOTER_LINKS = {
  services: [
    { label: 'Wedding Decor and Styling', href: '/services#wedding-decor' },
    { label: 'Floral Arrangements', href: '/services#floral-arrangements' },
    { label: 'Lighting Design', href: '/services#lighting-design' },
    { label: 'Backdrop and Stage Design', href: '/services#backdrop-stage' },
    { label: 'Corporate Event Styling', href: '/services#corporate-events' },
    { label: 'All services', href: '/services' },
  ],
  explore: [
    { label: 'Portfolio', href: '/portfolio' },
    { label: 'Packages', href: '/packages' },
    { label: 'Style quiz', href: '/style-quiz' },
    { label: 'Bridal consultation', href: '/bridal' },
    { label: 'Blog', href: '/blog' },
    { label: 'About us', href: '/about' },
  ],
  act: [
    { label: 'Get a quote', href: '/enquire' },
    { label: 'Book a package', href: '/enquire?intent=package' },
    { label: 'Contact', href: '/contact' },
    { label: 'Wedding enquiry', href: '/bridal' },
    { label: 'Corporate enquiry', href: '/enquire?intent=corporate' },
    { label: 'Newsletter', href: '/#newsletter' },
  ],
  legal: [
    { label: 'Privacy Policy', href: '/legal/privacy-policy' },
    { label: 'Terms of Service', href: '/legal/terms' },
    { label: 'Cookie Policy', href: '/legal/cookie-policy' },
  ],
} as const;

/** Approximate number of guests that each budget band covers, used on step 4. */
export const BUDGET_BANDS = [
  { value: 'under-150k', label: 'Under KES 150,000', note: 'Intimate gatherings and small styling briefs' },
  { value: '150k-350k', label: 'KES 150,000 to 350,000', note: 'Most private weddings and birthday celebrations' },
  { value: '350k-700k', label: 'KES 350,000 to 700,000', note: 'Full venue dressing and mid size corporate events' },
  { value: '700k-1.5m', label: 'KES 700,000 to 1,500,000', note: 'Large weddings, galas and multi day events' },
  { value: 'above-1.5m', label: 'Above KES 1,500,000', note: 'Grand destination weddings and gala productions' },
  { value: 'not-sure', label: 'Not sure yet', note: 'We will suggest bands that fit your guest count' },
] as const;

/** How clients say they found Priscilla. Tracked so marketing spend is honest. */
export const REFERRAL_SOURCES = [
  'Instagram',
  'A friend or family referral',
  'Venue recommendation',
  'Google search',
  'Wedding planner',
  'Attended an event we styled',
  'TikTok or Pinterest',
  'Other',
] as const;

export const EVENT_TYPES = [
  { value: 'wedding', label: 'Wedding', note: 'Ceremony, reception or both' },
  { value: 'bridal-consultation', label: 'Bridal consultation', note: 'Plan the look with our bridal team' },
  { value: 'corporate', label: 'Corporate event', note: 'Galas, launches, conferences and dinners' },
  { value: 'birthday', label: 'Birthday party', note: 'Milestone birthdays and family celebrations' },
  { value: 'anniversary', label: 'Anniversary or proposal', note: 'Private and intimate moments' },
  { value: 'baby-shower', label: 'Baby shower', note: 'Showers and gender reveals' },
  { value: 'venue-partnership', label: 'Venue or hotel partnership', note: 'Ongoing styling partnerships' },
  { value: 'other', label: 'Something else', note: 'Tell us what you have in mind' },
] as const;

export const SERVICE_OPTIONS = [
  'Wedding decor and styling',
  'Floral arrangements',
  'Lighting design',
  'Table setting and linen',
  'Backdrop and stage design',
  'Entrance and aisle styling',
  'Draping and ceiling work',
  'Lounge and soft seating',
  'Furniture and hire',
  'Signage and stationery',
  'Bridal bouquets and florals',
  'Day of styling coordination',
] as const;

export type EventTypeValue = (typeof EVENT_TYPES)[number]['value'];
