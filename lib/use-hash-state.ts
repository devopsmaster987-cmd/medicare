'use client';

import { useCallback, useEffect, useState } from 'react';

type StringRecord = Record<string, string>;

export function useHashState<T extends StringRecord>(defaults: T) {
  const [values, setValues] = useState<T>(defaults);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    const params = new URLSearchParams(window.location.hash.replace(/^#/, ''));
    const next: StringRecord = { ...defaults };
    for (const key of Object.keys(defaults)) {
      const value = params.get(key);
      if (value !== null) next[key] = value;
    }
    setValues(next as T);
    setReady(true);
    // defaults is intentionally read once on mount
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (!ready) return;
    const params = new URLSearchParams();
    for (const [key, value] of Object.entries(values)) {
      if (value !== '') params.set(key, value);
    }
    const hash = params.toString();
    const next = `${window.location.pathname}${window.location.search}${hash ? `#${hash}` : ''}`;
    window.history.replaceState(null, '', next);
  }, [values, ready]);

  const update = useCallback((key: keyof T, value: string) => {
    setValues((previous) => ({ ...previous, [key]: value }));
  }, []);

  return { values, update, ready };
}
