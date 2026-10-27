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
    isAccessibleForFree: true,
    dateModified: dataVerifiedOn,
    publisher: organizationSchema(),
  };
}
