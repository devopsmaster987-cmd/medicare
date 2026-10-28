import type { Metadata, Viewport } from 'next';
import { AdSenseScript } from '@/components/ads/adsense-script';
import { AnalyticsScript } from '@/components/analytics/analytics-script';
import { ConsentBanner } from '@/components/consent/consent-banner';
import { ConsentModeScript } from '@/components/consent/consent-mode-script';
import { site } from '@/data/site';
import { isConsentRequired } from '@/lib/consent';
import { getPrefsInitScript } from '@/lib/prefs';
import './globals.css';

const verificationOther: Record<string, string> = {};
if (site.integrations.bingSiteVerification) {
  verificationOther['msvalidate.01'] = site.integrations.bingSiteVerification;
}
if (site.integrations.adsensePublisherId) {
  verificationOther['google-adsense-account'] = site.integrations.adsensePublisherId.startsWith('ca-')
    ? site.integrations.adsensePublisherId
    : `ca-${site.integrations.adsensePublisherId}`;
}

export const metadata: Metadata = {
  metadataBase: new URL(site.siteUrl),
  title: {
    default: `${site.siteName} | Independent Medicare calculators`,
    template: `%s | ${site.siteName}`,
  },
  description:
    'Independent Medicare and ACA calculators with plain-language answers, dated official sources, and no lead form before your result.',
  applicationName: site.siteName,
  authors: [{ name: site.ownerName }],
  creator: site.ownerName,
  publisher: site.siteName,
  category: 'health',
  openGraph: {
    type: 'website',
    siteName: site.siteName,
    locale: 'en_US',
    title: `${site.siteName} | Independent Medicare calculators`,
    description:
      'Check Medicare costs, penalties, IRMAA, Medicare Savings Programs, and ACA decisions with dated official sources.',
    url: site.siteUrl,
    images: [
      {
        url: '/og/default.png',
        width: 1200,
        height: 630,
        alt: `${site.siteName}: independent Medicare and ACA calculators`,
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
  },
  robots: {
    index: true,
    follow: true,
  },
  verification: {
    google: site.integrations.googleSiteVerification || undefined,
    other: Object.keys(verificationOther).length > 0 ? verificationOther : undefined,
  },
};

export const viewport: Viewport = {
  themeColor: '#0b4f4a',
  colorScheme: 'light',
  width: 'device-width',
  initialScale: 1,
};

const prefsInitScript = getPrefsInitScript();
const trackingEnabled = isConsentRequired({
  analyticsDomain: site.analytics.domain,
  adsEnabled: site.features.ads,
});

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html
      lang="en-US"
      data-theme="light"
      data-text-size="a"
      suppressHydrationWarning
    >
      <head>
        <script dangerouslySetInnerHTML={{ __html: prefsInitScript }} />
      </head>
      <body>
        <ConsentModeScript />
        <AdSenseScript />
        {children}
        {trackingEnabled && <AnalyticsScript />}
        {trackingEnabled && <ConsentBanner />}
      </body>
    </html>
  );
}
