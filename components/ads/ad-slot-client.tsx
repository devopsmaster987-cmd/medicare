'use client';

import { useEffect, useRef, useState } from 'react';
import { site } from '@/data/site';
import { CONSENT_EVENT, hasConsent, type ConsentState } from '@/lib/consent';

export type AdPlacement = 'below-calculator' | 'mid-article' | 'end-faq';

const heights: Record<AdPlacement, string> = {
  'below-calculator': '17rem',
  'mid-article': '15rem',
  'end-faq': '15rem',
};

const ADSENSE_SCRIPT_ID = 'adsense-script';

function loadAdsense(): void {
  if (document.getElementById(ADSENSE_SCRIPT_ID)) return;
  const publisher = site.integrations.adsensePublisherId;
  if (!publisher) return;
  const client = publisher.startsWith('ca-') ? publisher : `ca-${publisher}`;
  const script = document.createElement('script');
  script.id = ADSENSE_SCRIPT_ID;
  script.async = true;
  script.crossOrigin = 'anonymous';
  script.src = `https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=${client}`;
  document.head.appendChild(script);
}

export function AdSlotClient({ placement }: { placement: AdPlacement }) {
  const [consented, setConsented] = useState(false);
  const [visible, setVisible] = useState(false);
  const holder = useRef<HTMLDivElement>(null);
  const available = site.features.ads;

  useEffect(() => {
    if (!available) return;
    const update = () => setConsented(hasConsent('advertising'));
    update();
    window.addEventListener(CONSENT_EVENT, update);
    return () => window.removeEventListener(CONSENT_EVENT, update);
  }, [available]);

  useEffect(() => {
    if (!available || !consented || !holder.current) return;
    const node = holder.current;
    if (typeof IntersectionObserver !== 'function') {
      setVisible(true);
      return;
    }
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries.some((entry) => entry.isIntersecting)) {
          setVisible(true);
          observer.disconnect();
        }
      },
      { rootMargin: '200px' },
    );
    observer.observe(node);
    return () => observer.disconnect();
  }, [available, consented]);

  useEffect(() => {
    const publisher = site.integrations.adsensePublisherId;
    const slot = site.integrations.adsenseSlotId;
    if (!available || !consented || !visible || !publisher || !slot) return;
    loadAdsense();
    const target = window as Window & { adsbygoogle?: unknown[] };
    target.adsbygoogle = target.adsbygoogle || [];
    target.adsbygoogle.push({});
  }, [available, consented, visible]);

  if (!available) return null;

  const publisher = site.integrations.adsensePublisherId;
  const client = publisher.startsWith('ca-') ? publisher : `ca-${publisher}`;
  const slot = site.integrations.adsenseSlotId;
  const canServe = consented && publisher !== '' && slot !== '';

  return (
    <aside
      className={`ad-slot ad-slot-${placement} no-print`}
      aria-label="Advertisement"
      style={{ minHeight: heights[placement] }}
    >
      <span className="ad-label" aria-hidden="true">
        Advertisement
      </span>
      <div className="ad-frame" ref={holder}>
        {canServe ? (
          <ins
            className="adsbygoogle"
            style={{ display: 'block' }}
            data-ad-client={client}
            data-ad-slot={slot}
            data-ad-format="auto"
            data-full-width-responsive="true"
          />
        ) : (
          <span className="ad-placeholder" aria-hidden="true" />
        )}
      </div>
    </aside>
  );
}
