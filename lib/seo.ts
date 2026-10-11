/**
 * Structured data and metadata.
 *
 * The brief asks for EventVenue and LocalBusiness JSON-LD across the site, plus
 * per item Open Graph data for portfolio events and blog articles. Everything is
 * built from the single source of truth in lib/site.ts so nothing drifts.
 */

import type { Metadata } from 'next';
import { CONTACT, SITE, SOCIAL } from './site';
import type { PortfolioEvent } from './portfolio';
import type { Post } from './blog';

export const DEFAULT_KEYWORDS = [
  'event decoration Nairobi',
  'wedding decorator Kenya',
  'florist Nairobi',
  'event styling Nairobi',
  'venue dressing Kenya',
  'corporate event decor Nairobi',
  'birthday party decoration Nairobi',
  'wedding flowers Nairobi',
  'bridal consultation Nairobi',
];

/** Base metadata applied by the root layout, overridden per page. */
export function baseMetadata(): Metadata {
  const url = SITE.url;
  return {
    metadataBase: new URL(url),
    title: {
      default: `${SITE.name} | ${SITE.tagline}`,
      template: `%s | ${SITE.name}`,
    },
    description: SITE.description,
    keywords: DEFAULT_KEYWORDS,
    authors: [{ name: SITE.name, url }],
    creator: SITE.name,
    publisher: SITE.name,
    applicationName: SITE.name,
    category: 'Event decoration and styling',
    alternates: { canonical: '/' },
    openGraph: {
      type: 'website',
      siteName: SITE.name,
      locale: SITE.locale,
      url,
      title: `${SITE.name} | ${SITE.tagline}`,
      description: SITE.description,
      images: [
        {
          url: '/images/hero-venue-draped-hall.jpg',
          width: 1400,
          height: 932,
          alt: 'A ballroom dressed with a draped ceiling and floral centrepieces by Priscilla Events and Decor',
        },
      ],
    },
    twitter: {
      card: 'summary_large_image',
      title: `${SITE.name} | ${SITE.tagline}`,
      description: SITE.description,
      images: ['/images/hero-venue-draped-hall.jpg'],
    },
    robots: {
      index: true,
      follow: true,
      googleBot: { index: true, follow: true, 'max-image-preview': 'large', 'max-snippet': -1 },
    },
    icons: {
      icon: [{ url: '/icon.svg', type: 'image/svg+xml' }],
      apple: [{ url: '/icon.svg' }],
    },
    other: {
      'geo.region': 'KE-110',
      'geo.placename': 'Nairobi',
      'geo.position': `${CONTACT.studio.latitude};${CONTACT.studio.longitude}`,
      ICBM: `${CONTACT.studio.latitude}, ${CONTACT.studio.longitude}`,
    },
  };
}

/** LocalBusiness, which the brief requires site wide. */
export function localBusinessJsonLd() {
  return {
    '@context': 'https://schema.org',
    '@type': ['LocalBusiness', 'EventPlanner'],
    '@id': `${SITE.url}/#business`,
    name: SITE.name,
    legalName: SITE.legalName,
    description: SITE.description,
    url: SITE.url,
    telephone: CONTACT.phoneDisplay,
    email: CONTACT.email,
    foundingDate: SITE.founded,
    priceRange: 'KES 145,000 to KES 2,000,000+',
    currenciesAccepted: 'KES',
    paymentAccepted: 'M-Pesa, Bank transfer, Card',
    image: `${SITE.url}/images/hero-venue-draped-hall.jpg`,
    logo: `${SITE.url}/icon.svg`,
    address: {
      '@type': 'PostalAddress',
      streetAddress: CONTACT.studio.street,
      addressLocality: CONTACT.studio.city,
      addressRegion: CONTACT.studio.region,
      postalCode: CONTACT.studio.postalCode,
      addressCountry: CONTACT.studio.country,
    },
    geo: {
      '@type': 'GeoCoordinates',
      latitude: CONTACT.studio.latitude,
      longitude: CONTACT.studio.longitude,
    },
    areaServed: [
      { '@type': 'City', name: 'Nairobi' },
      { '@type': 'AdministrativeArea', name: 'Kiambu County' },
      { '@type': 'AdministrativeArea', name: 'Kajiado County' },
      { '@type': 'Country', name: 'Kenya' },
    ],
    openingHoursSpecification: [
      {
        '@type': 'OpeningHoursSpecification',
        dayOfWeek: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'],
        opens: '08:00',
        closes: '18:00',
      },
      {
        '@type': 'OpeningHoursSpecification',
        dayOfWeek: ['Saturday'],
        opens: '09:00',
        closes: '16:00',
      },
    ],
    sameAs: Object.values(SOCIAL),
    hasOfferCatalog: {
      '@type': 'OfferCatalog',
      name: 'Event decoration and styling services',
      itemListElement: [
        'Wedding decor and styling',
        'Floral arrangements',
        'Lighting design',
        'Table setting and linen',
        'Backdrop and stage design',
        'Birthday party decor',
        'Corporate event styling',
        'Venue transformation',
      ].map((name) => ({
        '@type': 'Offer',
        itemOffered: { '@type': 'Service', name },
      })),
    },
  };
}

/** EventVenue, required by the brief alongside LocalBusiness. */
export function eventVenueJsonLd() {
  return {
    '@context': 'https://schema.org',
    '@type': 'EventVenue',
    '@id': `${SITE.url}/#venue`,
    name: `${SITE.name} venue styling service`,
    description:
      'Priscilla Events and Decor dresses and transforms venues across Nairobi and Kenya, including full venue transformations of bare halls, gardens, marquees and rooftops.',
    url: `${SITE.url}/services#venue-transformation`,
    telephone: CONTACT.phoneDisplay,
    email: CONTACT.email,
    image: `${SITE.url}/images/service-venue-transformation.jpg`,
    maximumAttendeeCapacity: 1200,
    amenityFeature: [
      { '@type': 'LocationFeatureSpecification', name: 'Full ceiling draping', value: true },
      { '@type': 'LocationFeatureSpecification', name: 'Stage and backdrop fabrication', value: true },
      { '@type': 'LocationFeatureSpecification', name: 'Lighting design and rigging', value: true },
      { '@type': 'LocationFeatureSpecification', name: 'Furniture and staging hire', value: true },
      { '@type': 'LocationFeatureSpecification', name: 'Multi day and multi site coverage', value: true },
    ],
    address: {
      '@type': 'PostalAddress',
      streetAddress: CONTACT.studio.street,
      addressLocality: CONTACT.studio.city,
      addressRegion: CONTACT.studio.region,
      postalCode: CONTACT.studio.postalCode,
      addressCountry: CONTACT.studio.country,
    },
    geo: {
      '@type': 'GeoCoordinates',
      latitude: CONTACT.studio.latitude,
      longitude: CONTACT.studio.longitude,
    },
    openingHours: 'Mo-Fr 08:00-18:00, Sa 09:00-16:00',
  };
}

/** WebSite with a search action, so sitelinks search is available. */
export function websiteJsonLd() {
  return {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    '@id': `${SITE.url}/#website`,
    url: SITE.url,
    name: SITE.name,
    description: SITE.description,
    inLanguage: SITE.language,
    publisher: { '@id': `${SITE.url}/#business` },
  };
}

/** Breadcrumbs for an interior page. */
export function breadcrumbJsonLd(items: { name: string; path: string }[]) {
  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: items.map((item, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      name: item.name,
      item: `${SITE.url}${item.path}`,
    })),
  };
}

/** Service list, used on the services page. */
export function servicesJsonLd(services: { name: string; detail: string }[]) {
  return {
    '@context': 'https://schema.org',
    '@type': 'ItemList',
    name: 'Services',
    itemListElement: services.map((service, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      item: {
        '@type': 'Service',
        name: service.name,
        description: service.detail,
        provider: { '@id': `${SITE.url}/#business` },
        areaServed: 'Nairobi, Kenya',
      },
    })),
  };
}

/** Offer list for the packages page. */
export function packagesJsonLd(
  packages: { name: string; summary: string; startingPrice: number; includes: string[] }[],
) {
  return {
    '@context': 'https://schema.org',
    '@type': 'ItemList',
    name: 'Event styling packages',
    itemListElement: packages.map((item, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      item: {
        '@type': 'Offer',
        name: item.name,
        description: item.summary,
        priceCurrency: 'KES',
        price: item.startingPrice,
        priceSpecification: {
          '@type': 'PriceSpecification',
          priceCurrency: 'KES',
          minPrice: item.startingPrice,
          description: 'Starting price',
        },
        itemOffered: {
          '@type': 'Service',
          name: item.name,
          description: item.summary,
          provider: { '@id': `${SITE.url}/#business` },
        },
        availability: 'https://schema.org/InStock',
      },
    })),
  };
}

/** Open Graph metadata for one portfolio event, as the brief requires. */
export function portfolioMetadata(event: PortfolioEvent): Metadata {
  const path = `/portfolio/${event.slug}`;
  const title = `${event.title}, ${event.venue}`;
  return {
    title,
    description: event.description,
    alternates: { canonical: path },
    openGraph: {
      type: 'article',
      title,
      description: event.description,
      url: `${SITE.url}${path}`,
      siteName: SITE.name,
      locale: SITE.locale,
      images: [{ url: event.image, width: 1400, height: 932, alt: event.imageAlt }],
      publishedTime: `${event.isoDate}T09:00:00+03:00`,
      authors: [SITE.name],
      tags: [event.category, ...event.services],
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description: event.description,
      images: [event.image],
    },
  };
}

/** Event JSON-LD for a styled event in the portfolio. */
export function portfolioEventJsonLd(event: PortfolioEvent) {
  return {
    '@context': 'https://schema.org',
    '@type': 'Event',
    name: event.title,
    description: event.description,
    startDate: event.isoDate,
    eventStatus: 'https://schema.org/EventScheduled',
    eventAttendanceMode: 'https://schema.org/OfflineEventAttendanceMode',
    image: `${SITE.url}${event.image}`,
    url: `${SITE.url}/portfolio/${event.slug}`,
    location: {
      '@type': 'EventVenue',
      name: event.venue,
      address: {
        '@type': 'PostalAddress',
        addressLocality: event.venueArea,
        addressCountry: 'KE',
      },
    },
    organizer: { '@id': `${SITE.url}/#business` },
    performer: { '@id': `${SITE.url}/#business` },
  };
}

export function postMetadata(post: Post): Metadata {
  const path = `/blog/${post.slug}`;
  return {
    title: post.title,
    description: post.description,
    keywords: post.tags,
    alternates: { canonical: path },
    authors: [{ name: post.author }],
    openGraph: {
      type: 'article',
      title: post.title,
      description: post.description,
      url: `${SITE.url}${path}`,
      siteName: SITE.name,
      locale: SITE.locale,
      publishedTime: `${post.date}T09:00:00+03:00`,
      authors: [post.author],
      tags: post.tags,
      images: [{ url: post.image, width: 1400, height: 932, alt: post.imageAlt }],
    },
    twitter: {
      card: 'summary_large_image',
      title: post.title,
      description: post.description,
      images: [post.image],
    },
  };
}

export function articleJsonLd(post: Post) {
  return {
    '@context': 'https://schema.org',
    '@type': 'BlogPosting',
    headline: post.title,
    description: post.description,
    datePublished: post.date,
    dateModified: post.date,
    image: `${SITE.url}${post.image}`,
    author: { '@type': 'Person', name: post.author },
    publisher: { '@id': `${SITE.url}/#business` },
    mainEntityOfPage: { '@type': 'WebPage', '@id': `${SITE.url}/blog/${post.slug}` },
    articleSection: post.category,
    keywords: post.tags.join(', '),
    inLanguage: SITE.language,
  };
}

/**
 * FAQ schema. Only emit entries that are genuinely visible on the page, because
 * marking up content that is not on the page is a guideline breach.
 */
export function faqJsonLd(items: { question: string; answer: string }[]) {
  return {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: items.map((item) => ({
      '@type': 'Question',
      name: item.question,
      acceptedAnswer: { '@type': 'Answer', text: item.answer },
    })),
  };
}

/** Serialises JSON-LD for a script tag, escaping the sequence that can break HTML. */
export function jsonLdScript(data: unknown): string {
  return JSON.stringify(data).replace(/</g, '\\u003c');
}
