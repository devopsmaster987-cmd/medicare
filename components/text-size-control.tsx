'use client';

import { useEffect, useLayoutEffect, useState } from 'react';
import {
  DEFAULT_TEXT_SIZE,
  getTextSizeFromDocument,
  readTextSize,
  saveTextSize,
  TEXT_SIZE_KEY,
  type TextSize,
} from '@/lib/prefs';

const useIsomorphicLayoutEffect =
  typeof window === 'undefined' ? useEffect : useLayoutEffect;

const sizes: Array<{ value: TextSize; label: string; aria: string }> = [
  { value: 'a', label: 'A', aria: 'A default text size' },
  { value: 'a-plus', label: 'A+', aria: 'A+ large text size' },
  { value: 'a-plus-plus', label: 'A++', aria: 'A++ extra-large text size' },
];

export function TextSizeControl() {
  const [size, setSize] = useState<TextSize>(DEFAULT_TEXT_SIZE);

  useIsomorphicLayoutEffect(() => {
    setSize(getTextSizeFromDocument());

    function sync(event: StorageEvent) {
      if (event.key !== null && event.key !== TEXT_SIZE_KEY) return;
      const next = readTextSize();
      document.documentElement.dataset.textSize = next;
      setSize(next);
    }

    window.addEventListener('storage', sync);
    return () => window.removeEventListener('storage', sync);
  }, []);

  function choose(next: TextSize) {
    document.documentElement.dataset.textSize = next;
    setSize(next);
    saveTextSize(next);
  }

  return (
    <div className="text-size" role="group" aria-label="Text size">
      <span className="text-size-label">Text</span>
      {sizes.map((option) => (
        <button
          key={option.value}
          type="button"
          className="text-size-button"
          aria-label={option.aria}
          aria-pressed={size === option.value}
          onClick={() => choose(option.value)}
        >
          {option.label}
        </button>
      ))}
    </div>
  );
}
