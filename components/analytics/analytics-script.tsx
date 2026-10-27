'use client';

import { useEffect } from 'react';
import { analyticsConfigured, trackEvent } from '@/lib/analytics';
import {
  CONSENT_EVENT,
  hasConsent,
  readConsent,
  updateConsentMode,
  type ConsentState,
} from '@/lib/consent';
import { site } from '@/data/site';

const SCRIPT_ID = 'plausible-analytics';

function loadPlausible(): void {
  if (!analyticsConfigured()) return;
  if (document.getElementById(SCRIPT_ID)) return;

  const target = window as Window & {
    plausible?: ((event: string, options?: { props?: Record<string, unknown> }) => void) & {
      q?: unknown[];
    };
  };
  type PlausibleStub = ((event: string, options?: { props?: Record<string, unknown> }) => void) & {
    q?: unknown[];
  };
  if (typeof target.plausible !== 'function') {
    const queued: PlausibleStub = (event, options) => {
      queued.q?.push([event, options]);
    };
    queued.q = [];
    target.plausible = queued;
  }

  const script = document.createElement('script');
  script.id = SCRIPT_ID;
  script.defer = true;
  script.dataset.domain = site.analytics.domain;
  script.src = 'https://plausible.io/js/script.js';
  document.head.appendChild(script);
}

export function AnalyticsScript() {
  useEffect(() => {
    const initial = readConsent();
    updateConsentMode(initial);
    if (hasConsent('analytics', initial)) loadPlausible();

    function handleConsent(event: Event) {
      const state = (event as CustomEvent<ConsentState>).detail ?? readConsent();
      updateConsentMode(state);
      if (hasConsent('analytics', state)) loadPlausible();
    }

    function handleOutbound(event: MouseEvent) {
      const element = event.target;
      if (!(element instanceof Element)) return;
      const anchor = element.closest<HTMLAnchorElement>('a[href]');
      if (!anchor) return;
      let url: URL;
      try {
        url = new URL(anchor.href, window.location.href);
      } catch {
        return;
      }
      if (!/^https?:$/.test(url.protocol)) return;
      if (url.hostname === window.location.hostname) return;
      trackEvent('outbound_click', { domain: url.hostname });
    }

    window.addEventListener(CONSENT_EVENT, handleConsent);
    document.addEventListener('click', handleOutbound);
    return () => {
      window.removeEventListener(CONSENT_EVENT, handleConsent);
      document.removeEventListener('click', handleOutbound);
    };
  }, []);

  return null;
}
