import fs from 'node:fs';
import path from 'node:path';
import { site } from '../data/site';

const errors: string[] = [];
const warnings: string[] = [];
const adsTxt = fs.readFileSync(path.join(process.cwd(), 'public', 'ads.txt'), 'utf8');
const privacy = fs.readFileSync(
  path.join(process.cwd(), 'app', '(site)', 'privacy-policy', 'page.tsx'),
  'utf8',
);
const cookies = fs.readFileSync(
  path.join(process.cwd(), 'app', '(site)', 'cookie-policy', 'page.tsx'),
  'utf8',
);
const publisher = site.integrations.adsensePublisherId;
const adsRequested =
  process.env.NEXT_PUBLIC_ADS_ENABLED?.trim() === 'true' ||
  process.env.ADS_ENABLED?.trim() === 'true';

if (adsRequested && !site.features.ads) {
  errors.push(
    'NEXT_PUBLIC_ADS_ENABLED is true but the AdSense publisher ID or slot ID is missing',
  );
}

if (site.siteUrlIsPlaceholder) {
  const message = 'siteUrl is still the example domain; set NEXT_PUBLIC_SITE_URL before launch';
  if (site.features.ads) errors.push(message);
  else warnings.push(message);
}

if (site.features.ads) {
  if (!/^pub-\d{16}$/.test(publisher)) {
    errors.push('NEXT_PUBLIC_ADSENSE_PUBLISHER_ID must look like pub- followed by 16 digits');
  }
  if (!/^\d+$/.test(site.integrations.adsenseSlotId)) {
    errors.push('NEXT_PUBLIC_ADSENSE_SLOT_ID must be a numeric slot ID');
  }
  if (publisher && !adsTxt.includes(`google.com, ${publisher}, DIRECT, f08c47fec0942fa0`)) {
    errors.push('public/ads.txt does not authorize the configured publisher ID');
  }
  if (!/Google AdSense/i.test(privacy)) {
    errors.push('privacy policy does not name Google AdSense');
  }
  if (!privacy.includes('adssettings.google.com')) {
    errors.push('privacy policy is missing the Google ad settings opt-out link');
  }
  if (!privacy.includes('policies.google.com/technologies/partner-sites')) {
    errors.push('privacy policy is missing the Google partner-sites explanation link');
  }
  if (!/AdSense/i.test(cookies)) {
    errors.push('cookie policy does not mention AdSense');
  }
} else {
  warnings.push(
    'ads are off; set ADS_ENABLED=true (or NEXT_PUBLIC_ADS_ENABLED=true) and the AdSense client and slot IDs to enable them',
  );
  if (publisher) warnings.push('a publisher ID is set but ads are disabled');
}

if (errors.length > 0) {
  console.error('verify:adsense failed');
  for (const error of errors) console.error(`  - ${error}`);
  process.exit(1);
}

for (const warning of warnings) console.warn(`verify:adsense warning: ${warning}`);
console.log('verify:adsense passed');
