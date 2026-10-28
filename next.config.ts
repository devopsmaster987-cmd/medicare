import createMDX from '@next/mdx';
import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  output: 'export',
  images: { unoptimized: true },
  trailingSlash: true,
  reactStrictMode: true,
  compress: true,
  poweredByHeader: false,
  productionBrowserSourceMaps: false,
  pageExtensions: ['js', 'jsx', 'ts', 'tsx', 'md', 'mdx'],
  env: {
    NEXT_PUBLIC_ADS_ENABLED:
      process.env.NEXT_PUBLIC_ADS_ENABLED ?? process.env.ADS_ENABLED ?? 'false',
    NEXT_PUBLIC_ADSENSE_PUBLISHER_ID:
      process.env.NEXT_PUBLIC_ADSENSE_PUBLISHER_ID ?? process.env.ADSENSE_CLIENT_ID ?? '',
    NEXT_PUBLIC_ADSENSE_SLOT_ID:
      process.env.NEXT_PUBLIC_ADSENSE_SLOT_ID ?? process.env.ADSENSE_SLOT_ID ?? '',
  },
  compiler: {
    removeConsole:
      process.env.NODE_ENV === 'production' ? { exclude: ['error'] } : false,
  },
  experimental: {
    cpus: 1,
  },
};

const withMDX = createMDX({});

export default withMDX(nextConfig);
