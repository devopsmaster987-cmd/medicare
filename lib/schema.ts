import { author, organization } from '@/data/entities';
import { dataVerifiedOn } from '@/data/verified';

type Schema = Record<string, unknown>;

export function organizationSchema(): Schema {
  return {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    name: organization.name,
    url: organization.url,
    description: organization.description,
    email: organization.email,
    foundingLocation: {
      '@type': 'Place',
      name: 'Punjab, Pakistan',
    },
    areaServed: {
      '@type': 'Country',
      name: 'United States',
    },
    knowsAbout: [
      'Medicare Part A',
      'Medicare Part B',
      'Medicare Part D',
      'Medicare Savings Programs',
      'IRMAA',
      'Affordable Care Act marketplace coverage',
    ],
    contactPoint: {
      '@type': 'ContactPoint',
      contactType: 'customer support',
      email: organization.email,
      availableLanguage: 'English',
    },
  };
}

export function websiteSchema(): Schema {
  return {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    name: organization.name,
    url: organization.url,
    description: organization.description,
    publisher: organizationSchema(),
    inLanguage: 'en-US',
  };
}

export function personSchema(): Schema {
  return {
    '@context': 'https://schema.org',
    '@type': 'Person',
    name: author.name,
    description: author.description,
    url: author.url,
    homeLocation: {
      '@type': 'Place',
      name: author.location,
    },
    knowsAbout: [
      'Medicare',
      'Medicare Savings Programs',
      'IRMAA',
      'Affordable Care Act marketplace coverage',
    ],
  };
}

export function breadcrumbSchema(items: Array<{ name: string; url: string }>): Schema {
  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: items.map((item, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      name: item.name,
      item: item.url,
    })),
  };
}

export function faqSchema(items: Array<{ question: string; answer: string }>): Schema {
  return {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: items.map((item) => ({
      '@type': 'Question',
      name: item.question,
      acceptedAnswer: {
        '@type': 'Answer',
        text: item.answer,
      },
    })),
  };
}

export function articleSchema(input: {
  headline: string;
  description: string;
  url: string;
  datePublished: string;
  dateModified: string;
  citation?: string[];
}): Schema {
  return {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: input.headline,
    description: input.description,
    url: input.url,
    mainEntityOfPage: input.url,
    datePublished: input.datePublished,
    dateModified: input.dateModified,
    author: personSchema(),
    publisher: organizationSchema(),
    inLanguage: 'en-US',
    isAccessibleForFree: true,
    ...(input.citation && input.citation.length > 0 ? { citation: input.citation } : {}),
    speakable: {
      '@type': 'SpeakableSpecification',
      cssSelector: ['#answer-capsule', '.page-title'],
    },
  };
}

export function calculatorSchema(input: {
  name: string;
  description: string;
  url: string;
}): Schema {
  return {
    '@context': 'https://schema.org',
    '@type': 'WebApplication',
    name: input.name,
    description: input.description,
    url: input.url,
    applicationCategory: 'HealthApplication',
    operatingSystem: 'Any',
    browserRequirements: 'Requires JavaScript. Works in current mobile and desktop browsers.',
    isAccessibleForFree: true,
    inLanguage: 'en-US',
    dateModified: dataVerifiedOn,
    offers: {
      '@type': 'Offer',
      price: '0',
      priceCurrency: 'USD',
    },
    featureList: [
      'Live results without a Calculate button',
      'Official source links with checked dates',
      'Action plan and deadline',
      'Print or save as PDF',
      'Inputs stay in the browser',
    ],
    publisher: organizationSchema(),
    speakable: {
      '@type': 'SpeakableSpecification',
      cssSelector: ['#answer-capsule', '#calculator-title'],
    },
  };
}
