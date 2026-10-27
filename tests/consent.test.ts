import { describe, expect, it } from 'vitest';
import {
  CONSENT_STORAGE_KEY,
  defaultConsent,
  hasConsent,
  isConsentRequired,
  parseConsent,
  type ConsentState,
} from '@/lib/consent';

const accepted: ConsentState = {
  version: 1,
  analytics: true,
  advertising: false,
  decidedAt: '2026-10-27T00:00:00.000Z',
};

describe('consent storage', () => {
  it('knows the storage key', () => {
    expect(CONSENT_STORAGE_KEY).toBe('medicareclear-consent-v1');
  });

  it('starts with optional categories off', () => {
    const initial = defaultConsent();
    expect(initial.version).toBe(1);
    expect(initial.analytics).toBe(false);
    expect(initial.advertising).toBe(false);
  });

  it('parses a valid saved choice', () => {
    expect(parseConsent(JSON.stringify(accepted))).toEqual(accepted);
  });

  it('rejects missing, malformed, and wrong-version choices', () => {
    expect(parseConsent(null)).toBeNull();
    expect(parseConsent('not json')).toBeNull();
    expect(parseConsent('{}')).toBeNull();
    expect(parseConsent(JSON.stringify({ ...accepted, version: 2 }))).toBeNull();
    expect(parseConsent(JSON.stringify({ ...accepted, analytics: 'yes' }))).toBeNull();
    expect(parseConsent(JSON.stringify({ ...accepted, decidedAt: 'not-a-date' }))).toBeNull();
  });

  it('reads categories from a saved choice', () => {
    expect(hasConsent('analytics', accepted)).toBe(true);
    expect(hasConsent('advertising', accepted)).toBe(false);
    expect(hasConsent('analytics', null)).toBe(false);
    expect(hasConsent('advertising', null)).toBe(false);
  });

  it('requires consent only when an optional service is configured', () => {
    expect(isConsentRequired({ analyticsDomain: '', adsEnabled: false })).toBe(false);
    expect(isConsentRequired({ analyticsDomain: 'medicareclear.com', adsEnabled: false })).toBe(true);
    expect(isConsentRequired({ analyticsDomain: '', adsEnabled: true })).toBe(true);
  });
});
