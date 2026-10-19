/**
 * The style finder.
 *
 * Six questions, each with two to four options. Some options are colour swatches
 * and some are photographs, as the brief specifies. Scoring is a simple weighted
 * vote across the three packages, and the result renders a mood board collage
 * from the same photography that was chosen along the way.
 *
 * Everything here runs in the browser. Nothing is posted, nothing is stored and
 * no account is needed, which is exactly what the brief asks for.
 */

import type { PackageId } from './quiz-types';

export type QuizOption = {
  id: string;
  label: string;
  note?: string;
  /** Present when the option is a photograph. */
  image?: string;
  imageAlt?: string;
  /** Present when the option is a colour palette. */
  swatches?: { hex: string; name: string }[];
  /** Weighted vote toward each package. Values are added up as the quiz runs. */
  scores: Partial<Record<PackageId, number>>;
  /** Photographs that land on the mood board if this option is chosen. */
  board: string[];
};

export type QuizQuestion = {
  id: string;
  /** The question as it is shown. */
  question: string;
  help?: string;
  /** How the options are laid out. */
  layout: 'swatches' | 'photos-3' | 'photos-2';
  options: QuizOption[];
};

export const QUIZ: QuizQuestion[] = [
  {
    id: 'palette',
    question: 'Which colour palette feels most like you?',
    help: 'There is no wrong answer here. Pick the one you would happily live in.',
    layout: 'swatches',
    options: [
      {
        id: 'cream-blush',
        label: 'Cream and blush',
        note: 'Soft, romantic and timeless',
        swatches: [
          { hex: '#fdf8f4', name: 'Cream' },
          { hex: '#f8d7dc', name: 'Blush' },
          { hex: '#e7d3c2', name: 'Almond' },
          { hex: '#c39a5f', name: 'Soft gold' },
        ],
        scores: { essential: 2, bloom: 3 },
        board: ['/images/floral-pink-bouquet.jpg', '/images/portfolio-table-florals.jpg', '/images/floral-bridal-bouquet.jpg'],
      },
      {
        id: 'sand-terracotta',
        label: 'Sand and terracotta',
        note: 'Warm, earthy and grounded',
        swatches: [
          { hex: '#f6ece3', name: 'Sand' },
          { hex: '#c96f4a', name: 'Terracotta' },
          { hex: '#8a5a3b', name: 'Clay' },
          { hex: '#5c6b4a', name: 'Olive' },
        ],
        scores: { bloom: 3, grand: 2 },
        board: ['/images/venue-garden-aisle.jpg', '/images/portfolio-sunflower-table.jpg', '/images/service-floral-arrangements.jpg'],
      },
      {
        id: 'ivory-gold',
        label: 'Ivory and gold',
        note: 'Classic, formal and generous',
        swatches: [
          { hex: '#ffffff', name: 'Ivory' },
          { hex: '#c39a5f', name: 'Gold' },
          { hex: '#1c2b4a', name: 'Midnight' },
          { hex: '#7d8ba1', name: 'Silver' },
        ],
        scores: { grand: 3, bloom: 2 },
        board: ['/images/venue-lit-hall.jpg', '/images/venue-wedding-banquet.jpg', '/images/service-backdrop-stage.jpg'],
      },
      {
        id: 'deep-jewel',
        label: 'Deep jewel tones',
        note: 'Bold, rich and dramatic',
        swatches: [
          { hex: '#5b1f3a', name: 'Plum' },
          { hex: '#1f4d46', name: 'Emerald' },
          { hex: '#c39a5f', name: 'Brass' },
          { hex: '#0e1b4d', name: 'Navy' },
        ],
        scores: { grand: 3, bloom: 3 },
        board: ['/images/corporate-stage-lighting.jpg', '/images/portfolio-moody-dinner.jpg', '/images/venue-evening-tables.jpg'],
      },
    ],
  },
  {
    id: 'setting',
    question: 'Where do you picture the day happening?',
    help: 'We style all of these, so choose the one that feels right.',
    layout: 'photos-3',
    options: [
      {
        id: 'indoor-hall',
        label: 'An indoor hall or ballroom',
        image: '/images/venue-round-tables.jpg',
        imageAlt: 'Round tables and centrepieces set in a bright indoor venue',
        scores: { essential: 1, bloom: 3, grand: 2 },
        board: ['/images/venue-round-tables.jpg', '/images/venue-hall-greenery.jpg'],
      },
      {
        id: 'garden',
        label: 'A garden or lawn',
        image: '/images/venue-garden-aisle.jpg',
        imageAlt: 'A garden aisle dressed with flowers and draping',
        scores: { essential: 2, bloom: 3 },
        board: ['/images/venue-garden-aisle.jpg', '/images/venue-villa-ceremony.jpg'],
      },
      {
        id: 'transformation',
        label: 'An empty space we build from nothing',
        image: '/images/service-venue-transformation.jpg',
        imageAlt: 'An empty venue transformed with draping and lighting',
        scores: { grand: 3, bloom: 2 },
        board: ['/images/service-venue-transformation.jpg', '/images/service-backdrop-stage.jpg'],
      },
    ],
  },
  {
    id: 'florals',
    question: 'What should the flowers do?',
    help: 'This is the single biggest decision in most of our briefs.',
    layout: 'photos-3',
    options: [
      {
        id: 'restrained',
        label: 'Stay quiet and let the room speak',
        image: '/images/portfolio-bridal-table.jpg',
        imageAlt: 'A restrained table with a low floral centrepiece',
        scores: { essential: 3, bloom: 1 },
        board: ['/images/portfolio-bridal-table.jpg', '/images/portfolio-fine-dining.jpg'],
      },
      {
        id: 'generous',
        label: 'Be generous across tables and the entrance',
        image: '/images/portfolio-table-florals.jpg',
        imageAlt: 'Generous floral arrangements across a reception table',
        scores: { bloom: 3, essential: 1 },
        board: ['/images/portfolio-table-florals.jpg', '/images/floral-rose-vase.jpg'],
      },
      {
        id: 'installation',
        label: 'Take over the ceiling and the backdrop',
        image: '/images/venue-lit-hall.jpg',
        imageAlt: 'A hall filled with floral arrangements and warm light',
        scores: { grand: 3, bloom: 2 },
        board: ['/images/venue-lit-hall.jpg', '/images/hero-venue-draped-hall.jpg'],
      },
    ],
  },
  {
    id: 'lighting',
    question: 'How should the room be lit?',
    layout: 'photos-3',
    options: [
      {
        id: 'daylight',
        label: 'Daylight and nothing else',
        image: '/images/venue-villa-ceremony.jpg',
        imageAlt: 'A ceremony set in open daylight',
        scores: { essential: 3, bloom: 1 },
        board: ['/images/venue-villa-ceremony.jpg', '/images/venue-hall-aerial.jpg'],
      },
      {
        id: 'candlelight',
        label: 'Candlelight and low warm light',
        image: '/images/portfolio-candlelight-table.jpg',
        imageAlt: 'A table lit by candles and low warm light',
        scores: { bloom: 3, essential: 2 },
        board: ['/images/portfolio-candlelight-table.jpg', '/images/portfolio-intimate-table.jpg'],
      },
      {
        id: 'full-design',
        label: 'A full lighting design with uplighting',
        image: '/images/lighting-chandelier-warm.jpg',
        imageAlt: 'Warm layered lighting across a decorated ceiling',
        scores: { grand: 3, bloom: 2 },
        board: ['/images/lighting-chandelier-warm.jpg', '/images/corporate-stage-lighting.jpg'],
      },
    ],
  },
  {
    id: 'tables',
    question: 'What should the tables feel like up close?',
    layout: 'photos-3',
    options: [
      {
        id: 'simple',
        label: 'Simple, clean and uncluttered',
        image: '/images/portfolio-fine-dining.jpg',
        imageAlt: 'A clean and uncluttered place setting',
        scores: { essential: 3 },
        board: ['/images/portfolio-fine-dining.jpg'],
      },
      {
        id: 'layered',
        label: 'Layered with linen, chargers and glassware',
        image: '/images/service-table-setting.jpg',
        imageAlt: 'A table layered with linen, chargers and glassware',
        scores: { bloom: 3, essential: 1 },
        board: ['/images/service-table-setting.jpg', '/images/portfolio-sunflower-table.jpg'],
      },
      {
        id: 'one-long-table',
        label: 'One long table for everyone',
        image: '/images/portfolio-intimate-table.jpg',
        imageAlt: 'One long table set for a private celebration',
        scores: { bloom: 2, grand: 3 },
        board: ['/images/portfolio-intimate-table.jpg', '/images/portfolio-candlelit-dinner.jpg'],
      },
    ],
  },
  {
    id: 'guest-feel',
    question: 'Last one. What should guests remember?',
    layout: 'photos-2',
    options: [
      {
        id: 'intimate',
        label: 'That it felt personal and intimate',
        image: '/images/portfolio-moody-dinner.jpg',
        imageAlt: 'An intimate candlelit table setting',
        scores: { essential: 3, bloom: 1 },
        board: ['/images/portfolio-moody-dinner.jpg', '/images/florist-at-work.jpg'],
      },
      {
        id: 'beautifully-designed',
        label: 'That it was the most beautiful room they had been in',
        image: '/images/hero-venue-draped-hall.jpg',
        imageAlt: 'A beautifully dressed hall photographed from above the tables',
        scores: { grand: 3, bloom: 2 },
        board: ['/images/hero-venue-draped-hall.jpg', '/images/venue-reception-hall.jpg'],
      },
    ],
  },
];

export const QUIZ_TOTAL = QUIZ.length;

export type QuizAnswers = Record<string, string>;

/**
 * Sum the votes and return the package with the highest score. Ties fall to the
 * larger package, which is the honest outcome: if a client's answers point two
 * ways, we would rather quote the brief that covers both.
 */
export function scoreQuiz(answers: QuizAnswers): {
  packageId: PackageId;
  scores: Record<PackageId, number>;
  board: string[];
} {
  const scores: Record<PackageId, number> = { essential: 0, bloom: 0, grand: 0 };
  const board: string[] = [];

  for (const question of QUIZ) {
    const chosenId = answers[question.id];
    if (!chosenId) continue;
    const option = question.options.find((item) => item.id === chosenId);
    if (!option) continue;

    for (const [pkg, weight] of Object.entries(option.scores)) {
      scores[pkg as PackageId] += weight ?? 0;
    }
    for (const image of option.board) {
      if (!board.includes(image)) board.push(image);
    }
  }

  const order: PackageId[] = ['grand', 'bloom', 'essential'];
  let best: PackageId = 'bloom';
  let bestScore = -1;
  for (const pkg of order) {
    if (scores[pkg] > bestScore) {
      bestScore = scores[pkg];
      best = pkg;
    }
  }

  return { packageId: best, scores, board: board.slice(0, 6) };
}
