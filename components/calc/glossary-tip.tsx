import Link from 'next/link';
import type { GlossaryTipEntry } from '@/data/glossary';

export function GlossaryTip({
  term,
  tips,
}: {
  term: string;
  tips: Record<string, GlossaryTipEntry>;
}) {
  const entry = tips[term];
  if (!entry) return null;
  return (
    <details className="glossary-tip">
      <summary>{term}</summary>
      <p>
        {entry.definition}{' '}
        <Link className="glossary-tip-link" href={entry.href}>
          Full definition
        </Link>
      </p>
    </details>
  );
}
