import { author, organization } from '@/data/entities';
import { site } from '@/data/site';
import { dataVerifiedOn } from '@/data/verified';

type Schema = Record<string, unknown>;

const SITE_URL = site.siteUrl.replace(/\/+$/, '');
const ORG_ID = `${SITE_URL}/#organization`;
const WEBSITE_ID = `${SITE_URL}/#website`;
const PERSON_ID = `${SITE_URL}/authors/${author.slug}/#person`;
const EDITORIAL_POLICY_URL = `${SITE_URL}/editorial-policy/`;
const CORRECTIONS_URL = `${SITE_URL}/corrections/`;

const AUDIENCE = 'Medicare beneficiaries and ACA marketplace shoppers';

export function pageUrl(path: string): string {
  if (/^https?:\/\//i.test(path)) {
    try {
      const url = new URL(path);
      if (!url.pathname.endsWith('/')) url.pathname = `${url.pathname}/`;
      return url.toString();
    } catch {
      return path;
    }
  }
  const normalized = path.startsWith('/') ? path : `/${path}`;
  return `${SITE_URL}${normalized.endsWith('/') ? normalized : `${normalized}/`}`;
}

export function assetUrl(path: string): string {
  if (/^https?:\/\//i.test(path)) return path;
  return `${SITE_URL}${path.startsWith('/') ? path : `/${path}`}`;
}

function thing(name: string): Schema {
  return { '@type': 'Thing', name };
}

function aboutValue(value: string | string[]): Schema | Schema[] {
  return Array.isArray(value) ? value.map(thing) : thing(value);
}

function audienceSchema(): Schema {
  return {
    '@type': 'PeopleAudience',
    audienceType: AUDIENCE,
    geographicArea: { '@type': 'Country', name: 'United States' },
  };
}

export function organizationSchema(): Schema {
  return {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    '@id': ORG_ID,
    name: organization.name,
    url: `${SITE_URL}/`,
    description: organization.description,
    email: organization.email,
    logo: {
      '@type': 'ImageObject',
      url: assetUrl('/apple-icon.png'),
      width: 180,
      height: 180,
    },
    image: assetUrl('/og/default.png'),
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
    publishingPrinciples: EDITORIAL_POLICY_URL,
    correctionsPolicy: CORRECTIONS_URL,
    founder: { '@id': PERSON_ID },
    contactPoint: {
      '@type': 'ContactPoint',
      contactType: 'customer support',
      email: organization.email,
      availableLanguage: 'English',
    },
    ...(site.socialProfiles.length > 0 ? { sameAs: [...site.socialProfiles] } : {}),
  };
}

export function websiteSchema(): Schema {
  return {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    '@id': WEBSITE_ID,
    name: organization.name,
    url: `${SITE_URL}/`,
    description: organization.description,
    publisher: { '@id': ORG_ID },
    inLanguage: 'en-US',
  };
}

export function personSchema(): Schema {
  return {
    '@context': 'https://schema.org',
    '@type': 'Person',
    '@id': PERSON_ID,
    name: author.name,
    description: author.description,
    url: pageUrl(`/authors/${author.slug}`),
    homeLocation: {
      '@type': 'Place',
      name: author.location,
    },
    worksFor: { '@id': ORG_ID },
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
      item: pageUrl(item.url),
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

type WebPageType =
  | 'WebPage'
  | 'MedicalWebPage'
  | 'AboutPage'
  | 'ContactPage'
  | 'CollectionPage'
  | 'ProfilePage';

export function webPageSchema(input: {
  name: string;
  description: string;
  path: string;
  type?: WebPageType;
  datePublished?: string;
  dateModified?: string;
  image?: string;
  about?: string | string[];
  audience?: string;
  breadcrumb?: Array<{ name: string; url: string }>;
}): Schema {
  const url = pageUrl(input.path);
  return {
    '@context': 'https://schema.org',
    '@type': input.type ?? 'WebPage',
    '@id': `${url}#webpage`,
    url,
    name: input.name,
    description: input.description,
    isPartOf: { '@id': WEBSITE_ID },
    inLanguage: 'en-US',
    dateModified: input.dateModified ?? dataVerifiedOn,
    ...(input.datePublished ? { datePublished: input.datePublished } : {}),
    ...(input.image
      ? {
          primaryImageOfPage: {
            '@type': 'ImageObject',
            url: assetUrl(input.image),
          },
        }
      : {}),
    ...(input.about ? { about: aboutValue(input.about) } : {}),
    ...(input.audience
      ? {
          audience: {
            '@type': 'PeopleAudience',
            audienceType: input.audience,
            geographicArea: { '@type': 'Country', name: 'United States' },
          },
        }
      : {}),
    ...(input.breadcrumb ? { breadcrumb: breadcrumbSchema(input.breadcrumb) } : {}),
    speakable: {
      '@type': 'SpeakableSpecification',
      cssSelector: ['#answer-capsule', '.page-title', 'h1'],
    },
  };
}

export function medicalWebPageSchema(input: {
  name: string;
  description: string;
  path: string;
  dateModified?: string;
  image?: string;
  about?: string | string[];
  breadcrumb?: Array<{ name: string; url: string }>;
}): Schema {
  return {
    ...webPageSchema({
      ...input,
      type: 'MedicalWebPage',
      audience: AUDIENCE,
    }),
    lastReviewed: input.dateModified ?? dataVerifiedOn,
  };
}

export function articleSchema(input: {
  headline: string;
  description: string;
  url: string;
  datePublished: string;
  dateModified: string;
  image?: string;
  citation?: string[];
  about?: string | string[];
}): Schema {
  const url = pageUrl(input.url);
  return {
    '@context': 'https://schema.org',
    '@type': 'Article',
    '@id': `${url}#article`,
    headline: input.headline,
    description: input.description,
    url,
    mainEntityOfPage: { '@type': 'WebPage', '@id': `${url}#webpage` },
    datePublished: input.datePublished,
    dateModified: input.dateModified,
    author: personSchema(),
    publisher: organizationSchema(),
    inLanguage: 'en-US',
    isAccessibleForFree: true,
    audience: audienceSchema(),
    isPartOf: { '@id': WEBSITE_ID },
    ...(input.image ? { image: [assetUrl(input.image)] } : {}),
    ...(input.about ? { about: aboutValue(input.about) } : {}),
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
  image?: string;
}): Schema {
  const url = pageUrl(input.url);
  return {
    '@context': 'https://schema.org',
    '@type': 'WebApplication',
    '@id': `${url}#app`,
    name: input.name,
    description: input.description,
    url,
    applicationCategory: 'HealthApplication',
    applicationSubCategory: 'Medicare and ACA cost calculator',
    operatingSystem: 'Any',
    browserRequirements: 'Requires JavaScript. Works in current mobile and desktop browsers.',
    isAccessibleForFree: true,
    inLanguage: 'en-US',
    dateModified: dataVerifiedOn,
    isPartOf: { '@id': WEBSITE_ID },
    audience: audienceSchema(),
    about: [
      thing('Medicare costs'),
      thing('Affordable Care Act marketplace coverage'),
    ],
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
    ...(input.image
      ? {
          screenshot: assetUrl(input.image),
          image: assetUrl(input.image),
        }
      : {}),
    publisher: organizationSchema(),
    speakable: {
      '@type': 'SpeakableSpecification',
      cssSelector: ['#answer-capsule', '#calculator-title'],
    },
  };
}

export function itemListSchema(input: {
  name: string;
  description?: string;
  items: Array<{ name: string; url: string }>;
}): Schema {
  return {
    '@context': 'https://schema.org',
    '@type': 'ItemList',
    name: input.name,
    ...(input.description ? { description: input.description } : {}),
    numberOfItems: input.items.length,
    itemListElement: input.items.map((item, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      name: item.name,
      url: pageUrl(item.url),
    })),
  };
}

export function definedTermSetSchema(input: {
  name: string;
  url: string;
  terms: Array<{ name: string; url: string }>;
}): Schema {
  return {
    '@context': 'https://schema.org',
    '@type': 'DefinedTermSet',
    name: input.name,
    url: pageUrl(input.url),
    hasDefinedTerm: input.terms.map((term) => ({
      '@type': 'DefinedTerm',
      name: term.name,
      url: pageUrl(term.url),
    })),
  };
}

export function datasetSchema(input: {
  name: string;
  description: string;
  path: string;
  downloadPath: string;
  year: number;
  keywords?: string[];
}): Schema {
  const url = pageUrl(input.path);
  return {
    '@context': 'https://schema.org',
    '@type': 'Dataset',
    '@id': `${url}#dataset`,
    name: input.name,
    description: input.description,
    url,
    creator: { '@id': ORG_ID },
    publisher: { '@id': ORG_ID },
    isAccessibleForFree: true,
    dateModified: dataVerifiedOn,
    temporalCoverage: String(input.year),
    inLanguage: 'en-US',
    distribution: [
      {
        '@type': 'DataDownload',
        contentUrl: assetUrl(input.downloadPath),
        encodingFormat: 'application/json',
      },
    ],
    ...(input.keywords && input.keywords.length > 0 ? { keywords: input.keywords } : {}),
  };
}
