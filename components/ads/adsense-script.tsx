import Script from 'next/script';
import { site } from '@/data/site';

export function AdSenseScript() {
  const publisher = site.integrations.adsensePublisherId;
  if (!site.features.ads || !publisher) return null;
  const client = publisher.startsWith('ca-') ? publisher : `ca-${publisher}`;
  return (
    <Script
      id="adsense-script"
      strategy="beforeInteractive"
      crossOrigin="anonymous"
      src={`https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=${client}`}
    />
  );
}
