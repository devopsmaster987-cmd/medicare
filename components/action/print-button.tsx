'use client';

import { trackEvent } from '@/lib/analytics';

export function PrintButton({ label = 'Print this page' }: { label?: string }) {
  return (
    <button
      type="button"
      className="button button-secondary"
      onClick={() => {
        trackEvent('take_home_pack', { page: window.location.pathname });
        window.print();
      }}
    >
      {label}
    </button>
  );
}
