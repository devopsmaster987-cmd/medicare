'use client';

import { useEffect, useRef } from 'react';
import { trackEvent } from '@/lib/analytics';

export function CalculatorEvents({ path, complete }: { path: string; complete: boolean }) {
  const started = useRef(false);
  const finished = useRef(false);

  useEffect(() => {
    function handleInteraction(event: Event) {
      const target = event.target;
      if (!(target instanceof Element) || !target.closest('.calculator-shell')) return;
      if (started.current) return;
      started.current = true;
      trackEvent('calculator_start', { calculator: path });
    }

    document.addEventListener('input', handleInteraction, true);
    document.addEventListener('change', handleInteraction, true);
    return () => {
      document.removeEventListener('input', handleInteraction, true);
      document.removeEventListener('change', handleInteraction, true);
    };
  }, [path]);

  useEffect(() => {
    if (!complete || finished.current) return;
    finished.current = true;
    trackEvent('calculator_complete', { calculator: path });
  }, [complete, path]);

  return null;
}
