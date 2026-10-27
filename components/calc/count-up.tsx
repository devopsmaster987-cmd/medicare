'use client';

import { useEffect, useRef, useState } from 'react';

export function CountUp({
  value,
  format,
  duration = 400,
  className,
}: {
  value: number;
  format: (value: number) => string;
  duration?: number;
  className?: string;
}) {
  const [display, setDisplay] = useState(value);
  const previous = useRef(value);

  useEffect(() => {
    const reduced =
      typeof window !== 'undefined' &&
      window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (reduced) {
      setDisplay(value);
      previous.current = value;
      return;
    }

    const from = previous.current;
    const start = performance.now();
    let frame = 0;

    const tick = (now: number) => {
      const progress = Math.min(1, (now - start) / duration);
      const eased = 1 - Math.pow(1 - progress, 3);
      setDisplay(from + (value - from) * eased);
      if (progress < 1) {
        frame = requestAnimationFrame(tick);
      } else {
        previous.current = value;
      }
    };

    frame = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(frame);
  }, [value, duration]);

  return (
    <>
      <span className={className} aria-hidden="true">
        {format(display)}
      </span>
      <span className="sr-only">{format(value)}</span>
    </>
  );
}
