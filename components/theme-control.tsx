'use client';

import { useEffect, useLayoutEffect, useState } from 'react';
import {
  DEFAULT_THEME,
  getThemeFromDocument,
  readTheme,
  saveTheme,
  THEME_KEY,
  type Theme,
} from '@/lib/prefs';

const useIsomorphicLayoutEffect =
  typeof window === 'undefined' ? useEffect : useLayoutEffect;

const themes: Array<{ value: Theme; label: string; aria: string }> = [
  { value: 'light', label: 'L', aria: 'L light theme' },
  { value: 'dark', label: 'D', aria: 'D dark theme' },
];

export function ThemeControl() {
  const [theme, setTheme] = useState<Theme>(DEFAULT_THEME);

  useIsomorphicLayoutEffect(() => {
    setTheme(getThemeFromDocument());

    function sync(event: StorageEvent) {
      if (event.key !== null && event.key !== THEME_KEY) return;
      const next = readTheme();
      document.documentElement.dataset.theme = next;
      setTheme(next);
    }

    window.addEventListener('storage', sync);
    return () => window.removeEventListener('storage', sync);
  }, []);

  function choose(next: Theme) {
    document.documentElement.dataset.theme = next;
    setTheme(next);
    saveTheme(next);
  }

  return (
    <div className="text-size theme-control" role="group" aria-label="Color theme">
      <span className="text-size-label">Theme</span>
      {themes.map((option) => (
        <button
          key={option.value}
          type="button"
          className="text-size-button"
          aria-label={option.aria}
          aria-pressed={theme === option.value}
          onClick={() => choose(option.value)}
        >
          {option.label}
        </button>
      ))}
    </div>
  );
}
