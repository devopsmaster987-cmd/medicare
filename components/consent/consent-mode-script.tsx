import Script from 'next/script';
import { site } from '@/data/site';
import { isConsentRequired } from '@/lib/consent';

const required = isConsentRequired({
  analyticsDomain: site.analytics.domain,
  adsEnabled: site.features.ads,
});

const consentDefault = `
window.dataLayer = window.dataLayer || [];
window.gtag = window.gtag || function () { window.dataLayer.push(arguments); };
window.gtag('consent', 'default', {
  ad_storage: 'denied',
  ad_user_data: 'denied',
  ad_personalization: 'denied',
  analytics_storage: 'denied'
});
`;

export function ConsentModeScript() {
  if (!required) return null;
  return (
    <Script id="consent-mode-v2" strategy="afterInteractive">
      {consentDefault}
    </Script>
  );
}
