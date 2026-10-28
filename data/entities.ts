import { site } from './site';

export const organization = {
  name: site.siteName,
  description:
    'MedicareClear publishes free, source-linked calculators and plain-language guides about Medicare and Affordable Care Act costs.',
  url: site.siteUrl,
  email: site.contactEmail,
  location: site.location,
} as const;

// TODO(owner): add a verified professional background or credential here only if supplied.
// Do not invent a license, degree, employer, or years of experience.
export const author = {
  name: site.ownerName,
  slug: 'abdul-samad',
  description:
    'Abdul Samad is an independent publisher in Punjab, Pakistan, who researches US Medicare and ACA rules from official government sources.',
  url: `${site.siteUrl}/authors/abdul-samad`,
  location: site.location,
} as const;
