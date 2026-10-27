import type { MetadataRoute } from 'next';
import { site } from '@/data/site';

export const dynamic = 'force-static';

const searchAndCitationCrawlers = [
  'Googlebot',
  'Bingbot',
  'OAI-SearchBot',
  'ChatGPT-User',
  'PerplexityBot',
  'Claude-SearchBot',
  'Claude-User',
];

const trainingCrawlers = ['GPTBot', 'ClaudeBot', 'Google-Extended', 'Applebot-Extended'];

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: searchAndCitationCrawlers,
        allow: '/',
      },
      site.features.allowTrainingCrawlers
        ? {
            userAgent: trainingCrawlers,
            allow: '/',
          }
        : {
            userAgent: trainingCrawlers,
            disallow: '/',
          },
      {
        userAgent: '*',
        allow: '/',
      },
    ],
    sitemap: `${site.siteUrl}/sitemap.xml`,
    host: site.siteUrl,
  };
}
