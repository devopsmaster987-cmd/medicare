import type { MetadataRoute } from 'next';
import { site } from '@/data/site';

export const dynamic = 'force-static';

const searchAndCitationCrawlers = [
  'Googlebot',
  'Bingbot',
  'DuckDuckBot',
  'Applebot',
  'OAI-SearchBot',
  'ChatGPT-User',
  'PerplexityBot',
  'Perplexity-User',
  'DuckAssistBot',
  'Claude-SearchBot',
  'Claude-User',
  'MistralAI-User',
];

const trainingCrawlers = ['GPTBot', 'ClaudeBot', 'Google-Extended', 'Applebot-Extended'];

// Cloudflare rewrites email links to /cdn-cgi/l/email-protection. Those URLs are
// not pages and must never be crawled or indexed.
const disallowedPaths = ['/cdn-cgi/'];

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: searchAndCitationCrawlers,
        allow: '/',
        disallow: disallowedPaths,
      },
      site.features.allowTrainingCrawlers
        ? {
            userAgent: trainingCrawlers,
            allow: '/',
            disallow: disallowedPaths,
          }
        : {
            userAgent: trainingCrawlers,
            disallow: '/',
          },
      {
        userAgent: '*',
        allow: '/',
        disallow: disallowedPaths,
      },
    ],
    sitemap: `${site.siteUrl}/sitemap.xml`,
    host: site.siteUrl,
  };
}
