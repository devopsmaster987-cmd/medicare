import type { MetadataRoute } from 'next';
import { guides } from '@/content/guides/meta';
import { glossary, glossarySlug } from '@/data/glossary';
import { site } from '@/data/site';
import { dataVerifiedOn } from '@/data/verified';

export const dynamic = 'force-static';

const calculatorRoutes = [
  '/calculators',
  '/calculators/employer-coverage-affordability',
  '/calculators/medicare-savings-program-extra-help',
  '/calculators/part-b-late-enrollment-penalty',
  '/calculators/irmaa-cliff-checker',
  '/calculators/medicare-vs-aca',
];

const siteRoutes = [
  '/guides',
  '/glossary',
  '/about',
  '/contact',
  '/authors/abdul-samad',
  '/methodology',
  '/editorial-policy',
  '/corrections',
  '/privacy-policy',
  '/terms-of-service',
  '/disclaimer',
  '/cookie-policy',
  '/sitemap-page',
];

export default function sitemap(): MetadataRoute.Sitemap {
  return [
    {
      url: `${site.siteUrl}/`,
      lastModified: dataVerifiedOn,
      changeFrequency: 'monthly',
      priority: 1,
    },
    ...calculatorRoutes.map((route) => ({
      url: `${site.siteUrl}${route}`,
      lastModified: dataVerifiedOn,
      changeFrequency: 'monthly' as const,
      priority: 0.9,
    })),
    ...siteRoutes.map((route) => ({
      url: `${site.siteUrl}${route}`,
      lastModified: dataVerifiedOn,
      changeFrequency: 'monthly' as const,
      priority: 0.6,
    })),
    ...guides.map((guide) => ({
      url: `${site.siteUrl}/guides/${guide.slug}`,
      lastModified: guide.updatedOn,
      changeFrequency: 'monthly' as const,
      priority: 0.8,
    })),
    ...glossary.map((entry) => ({
      url: `${site.siteUrl}/glossary/${glossarySlug(entry.term)}`,
      lastModified: dataVerifiedOn,
      changeFrequency: 'yearly' as const,
      priority: 0.4,
    })),
  ];
}
