'use client';

import Link from 'next/link';
import { useEffect, useId, useState } from 'react';
import { site } from '@/data/site';
import {
  CONSENT_OPEN_EVENT,
  defaultConsent,
  isConsentRequired,
  readConsent,
  updateConsentMode,
  writeConsent,
  type ConsentState,
} from '@/lib/consent';

const analyticsAvailable = site.analytics.domain !== '';
const advertisingAvailable = site.features.ads;
const required = isConsentRequired({
  analyticsDomain: site.analytics.domain,
  adsEnabled: site.features.ads,
});

export function ConsentBanner() {
  const [open, setOpen] = useState(false);
  const [state, setState] = useState<ConsentState>(() => defaultConsent());
  const headingId = useId();
  const descriptionId = useId();

  useEffect(() => {
    const existing = readConsent();
    if (existing) {
      setState(existing);
      updateConsentMode(existing);
    } else if (required) {
      setOpen(true);
    }

    function openSettings() {
      const current = readConsent();
      if (current) setState(current);
      setOpen(true);
    }

    window.addEventListener(CONSENT_OPEN_EVENT, openSettings);
    return () => window.removeEventListener(CONSENT_OPEN_EVENT, openSettings);
  }, []);

  function save(next: Pick<ConsentState, 'analytics' | 'advertising'>) {
    const value: ConsentState = {
      version: 1,
      analytics: next.analytics,
      advertising: next.advertising,
      decidedAt: new Date().toISOString(),
    };
    writeConsent(value);
    updateConsentMode(value);
    setState(value);
    setOpen(false);
  }

  if (!open) return null;

  return (
    <section
      className="consent-banner"
      aria-labelledby={headingId}
      aria-describedby={descriptionId}
      role="region"
    >
      <div className="consent-copy">
        <p className="consent-kicker">Privacy choices</p>
        <h2 id={headingId}>Choose what this site may load</h2>
        <p id={descriptionId}>
          {required
            ? 'Optional analytics and advertising stay off until you choose. Your choice is stored in this browser and can be changed later with the Cookie settings link.'
            : 'Optional analytics and advertising are currently off. The site stores only your display preferences in this browser.'}
        </p>
      </div>

      {required ? (
        <div className="consent-options">
          {analyticsAvailable ? (
            <label className="consent-option">
              <input
                type="checkbox"
                checked={state.analytics}
                onChange={(event) =>
                  setState((current) => ({ ...current, analytics: event.target.checked }))
                }
              />
              <span>
                <strong>Analytics</strong>
                <span>Cookieless page and event counts. Calculator inputs are never sent.</span>
              </span>
            </label>
          ) : null}
          {advertisingAvailable ? (
            <label className="consent-option">
              <input
                type="checkbox"
                checked={state.advertising}
                onChange={(event) =>
                  setState((current) => ({ ...current, advertising: event.target.checked }))
                }
              />
              <span>
                <strong>Advertising</strong>
                <span>Google AdSense may use cookies to serve and measure ads.</span>
              </span>
            </label>
          ) : null}
        </div>
      ) : null}

      <div className="consent-actions">
        {required ? (
          <>
            <button
              type="button"
              className="button button-primary"
              onClick={() =>
                save({ analytics: analyticsAvailable, advertising: advertisingAvailable })
              }
            >
              Accept all
            </button>
            <button
              type="button"
              className="button button-secondary"
              onClick={() => save({ analytics: false, advertising: false })}
            >
              Reject optional
            </button>
            <button type="button" className="button button-secondary" onClick={() => save(state)}>
              Save choices
            </button>
          </>
        ) : (
          <button type="button" className="button button-secondary" onClick={() => setOpen(false)}>
            Close
          </button>
        )}
        <Link className="consent-link" href="/cookie-policy/">
          Read the cookie policy
        </Link>
      </div>
    </section>
  );
}
