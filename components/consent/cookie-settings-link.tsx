'use client';

import { openConsentSettings } from '@/lib/consent';

export function CookieSettingsLink({ className }: { className?: string }) {
  return (
    <a
      className={className}
      href="/cookie-policy#cookie-settings"
      onClick={(event) => {
        event.preventDefault();
        openConsentSettings();
      }}
    >
      Cookie settings
    </a>
  );
}
