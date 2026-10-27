import { site } from '@/data/site';
import { hasConsent } from './consent';

export type AnalyticsEvent =
  | 'calculator_start'
  | 'calculator_complete'
  | 'copy_result'
  | 'calendar_download'
  | 'take_home_pack'
  | 'email_signup'
  | 'outbound_click';

export type AnalyticsProps = Record<string, string | number | boolean>;

type PlausibleFunction = ((event: string, options?: { props?: AnalyticsProps }) => void) & {
  q?: unknown[];
};

function plausible(): PlausibleFunction | null {
  if (typeof window === 'undefined') return null;
  const target = window as Window & { plausible?: PlausibleFunction };
  return typeof target.plausible === 'function' ? target.plausible : null;
}

export function analyticsConfigured(): boolean {
  return site.analytics.domain !== '';
}

export function trackEvent(name: AnalyticsEvent, props: AnalyticsProps = {}): void {
  if (typeof window === 'undefined') return;
  if (!analyticsConfigured()) return;
  if (!hasConsent('analytics')) return;
  const send = plausible();
  if (!send) return;
  send(name, { props });
}
