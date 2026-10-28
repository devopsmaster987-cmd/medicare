'use client';

import { site } from '@/data/site';
import { isConsentRequired, openConsentSettings } from '@/lib/consent';

const consentRequired = isConsentRequired({
  analyticsDomain: site.analytics.domain,
  adsEnabled: site.features.ads,
});

export function CookieSettingsLink({ className }: { className?: string }) {
  return (
    <a
      className={className}
      href="/cookie-policy#cookie-settings"
      onClick={(event) => {
        if (!consentRequired) return;
        event.preventDefault();
        openConsentSettings();
      }}
    >
      Cookie settings
    </a>
  );
}
