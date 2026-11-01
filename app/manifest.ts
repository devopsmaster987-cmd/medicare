import type { MetadataRoute } from 'next';
import { site } from '@/data/site';

export const dynamic = 'force-static';

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: site.siteName,
    short_name: site.siteName,
    description:
      'Independent Medicare and ACA calculators with plain-language answers, dated official sources, and a clear next step.',
    start_url: '/',
    scope: '/',
    display: 'standalone',
    background_color: '#FAFAF7',
    theme_color: '#0b4f4a',
    lang: 'en-US',
    categories: ['health', 'finance', 'education'],
    icons: [
      {
        src: '/favicon-32.png',
        sizes: '32x32',
        type: 'image/png',
      },
      {
        src: '/apple-icon.png',
        sizes: '180x180',
        type: 'image/png',
      },
      {
        src: '/icon.svg',
        sizes: 'any',
        type: 'image/svg+xml',
      },
    ],
  };
}
