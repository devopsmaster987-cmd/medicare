export const CONSENT_STORAGE_KEY = 'medicareclear-consent-v1';
export const CONSENT_EVENT = 'medicareclear:consent';
export const CONSENT_OPEN_EVENT = 'medicareclear:open-consent';

export type ConsentCategory = 'analytics' | 'advertising';

export type ConsentState = {
  version: 1;
  analytics: boolean;
  advertising: boolean;
  decidedAt: string;
};

export type ConsentConfig = {
  analyticsDomain: string;
  adsEnabled: boolean;
};

export function isConsentRequired(config: ConsentConfig): boolean {
  return config.adsEnabled || config.analyticsDomain !== '';
}

export function defaultConsent(): ConsentState {
  return {
    version: 1,
    analytics: false,
    advertising: false,
    decidedAt: new Date().toISOString(),
  };
}

export function parseConsent(raw: string | null): ConsentState | null {
  if (!raw) return null;
  try {
    const parsed: unknown = JSON.parse(raw);
    if (typeof parsed !== 'object' || parsed === null) return null;
    const record = parsed as Record<string, unknown>;
    if (record.version !== 1) return null;
    if (typeof record.analytics !== 'boolean' || typeof record.advertising !== 'boolean') {
      return null;
    }
    if (typeof record.decidedAt !== 'string' || Number.isNaN(Date.parse(record.decidedAt))) {
      return null;
    }
    return {
      version: 1,
      analytics: record.analytics,
      advertising: record.advertising,
      decidedAt: record.decidedAt,
    };
  } catch {
    return null;
  }
}

export function readConsent(storage?: Storage): ConsentState | null {
  if (typeof window === 'undefined') return null;
  try {
    const target = storage ?? window.localStorage;
    return parseConsent(target.getItem(CONSENT_STORAGE_KEY));
  } catch {
    return null;
  }
}

export function writeConsent(state: ConsentState, storage?: Storage): void {
  if (typeof window === 'undefined') return;
  try {
    const target = storage ?? window.localStorage;
    target.setItem(CONSENT_STORAGE_KEY, JSON.stringify(state));
  } catch {
    return;
  }
  window.dispatchEvent(new CustomEvent<ConsentState>(CONSENT_EVENT, { detail: state }));
}

export function hasConsent(category: ConsentCategory, state?: ConsentState | null): boolean {
  const current = state === undefined ? readConsent() : state;
  if (!current) return false;
  return category === 'analytics' ? current.analytics : current.advertising;
}

export function openConsentSettings(): void {
  if (typeof window === 'undefined') return;
  window.dispatchEvent(new Event(CONSENT_OPEN_EVENT));
}

export function updateConsentMode(state: ConsentState | null): void {
  if (typeof window === 'undefined') return;
  const target = window as Window & {
    dataLayer?: unknown[];
    gtag?: (...args: unknown[]) => void;
  };
  if (typeof target.gtag !== 'function') {
    target.dataLayer = target.dataLayer || [];
    target.gtag = (...args: unknown[]) => {
      target.dataLayer?.push(args);
    };
  }
  const granted = state;
  target.gtag('consent', 'update', {
    ad_storage: granted?.advertising ? 'granted' : 'denied',
    ad_user_data: granted?.advertising ? 'granted' : 'denied',
    ad_personalization: granted?.advertising ? 'granted' : 'denied',
    analytics_storage: granted?.analytics ? 'granted' : 'denied',
  });
}
