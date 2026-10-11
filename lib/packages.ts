/**
 * The three packages.
 *
 * Prices are stated in Kenya Shillings and both the packages page and the
 * enquiry form's package preference step read from this one list, so a price
 * change can never leave the two disagreeing.
 */

export type Package = {
  id: string;
  name: string;
  /** Who it suits, shown under the package title. */
  suitable: string;
  /** One line summary. */
  summary: string;
  includes: string[];
  /** Starting price in KES. */
  startingPrice: number;
  /** Typical guest range, shown beside the price. */
  guestRange: string;
  /** Set on exactly one package: rendered slightly elevated. */
  featured: boolean;
  /** Short label used by the style quiz recommendation. */
  quizLine: string;
};

export const PACKAGES: Package[] = [
  {
    id: 'essential',
    name: 'The Essential Package',
    suitable: 'Intimate weddings, private dinners and small celebrations',
    summary:
      'A focused styling service for hosts who want a beautifully dressed room without the full installation build. Everything is chosen with you and set up by our team on the day.',
    includes: [
      'Design consultation and mood board',
      'One styling zone, being ceremony or reception, or dining room',
      'Table setting for up to 80 guests',
      'Centrepieces for up to 10 tables',
      'Linen, glassware and cutlery sourcing',
      'Two stylists on site for set up and strike',
    ],
    startingPrice: 145000,
    guestRange: 'Up to 80 guests',
    featured: false,
    quizLine: 'Clean, calm and beautifully finished without a full installation build.',
  },
  {
    id: 'bloom',
    name: 'The Bloom Package',
    suitable: 'Weddings, milestone birthdays and corporate dinners',
    summary:
      'The package most clients choose. Floral design, lighting and full table styling across the whole venue, with a dedicated coordinator from the first meeting to the final strike.',
    includes: [
      'Everything in The Essential Package',
      'Full venue styling across ceremony and reception',
      'Statement floral installation and entrance flowers',
      'Bridal bouquet and bridal party florals',
      'Lighting design with uplighting and candle work',
      'Backdrop and photo moment build',
      'Lounge and soft seating corner',
      'Dedicated coordinator and four stylists on site',
    ],
    startingPrice: 385000,
    guestRange: '80 to 250 guests',
    featured: true,
    quizLine: 'Florals, light and full venue styling carried by a dedicated coordinator.',
  },
  {
    id: 'grand-priscilla',
    name: 'The Grand Priscilla Experience',
    suitable: 'Grand weddings, galas and multi day events',
    summary:
      'Our largest service. We take the whole venue, transform it from the ground up and stay with you through every element and every day of the event.',
    includes: [
      'Everything in The Bloom Package',
      'Full venue transformation including draping and flooring',
      'Ceiling and rigging work',
      'Stage and backdrop fabrication',
      'Furniture, staging and planting hire',
      'Custom fabrication and monogram work',
      'Corporate or venue partnership terms and compliance paperwork',
      'Creative director, coordinator and full crew on site',
      'Multi day and multi site coverage',
    ],
    startingPrice: 850000,
    guestRange: '250 guests and above',
    featured: false,
    quizLine: 'A full venue transformation with our creative director on your event.',
  },
];

export function getPackage(id: string): Package | undefined {
  return PACKAGES.find((item) => item.id === id);
}

/** KES 385,000 style formatting used everywhere a price appears. */
export function formatKes(amount: number): string {
  return `KES ${amount.toLocaleString('en-KE')}`;
}

/** Deposit language is fixed by the Terms of Service: 50% to confirm. */
export const DEPOSIT_PERCENT = 50;

export function depositFor(amount: number): number {
  return Math.round(amount * (DEPOSIT_PERCENT / 100));
}
