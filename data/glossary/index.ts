import { termsAC } from './terms-ac';
import { termsCE } from './terms-ce';
import { termsFH } from './terms-fh';
import { termsIL } from './terms-il';
import { termsM } from './terms-m';
import { termsOP } from './terms-op';
import { termsP2 } from './terms-p2';
import { termsR } from './terms-r';
import { termsS } from './terms-s';
import { termsExtra } from './terms-extra';
import { termsWZ } from './terms-wz';

export type { GlossaryTerm, GlossarySourceRow, GlossaryCalculatorLink } from './types';

import type { GlossaryTerm } from './types';

export type GlossaryTipEntry = {
  definition: string;
  href: string;
};

const chunks = [
  termsAC,
  termsCE,
  termsExtra,
  termsFH,
  termsIL,
  termsM,
  termsOP,
  termsP2,
  termsR,
  termsS,
  termsWZ,
];

const seen = new Set<string>();
for (const entry of chunks.flat()) {
  if (seen.has(entry.term)) {
    throw new Error(`Duplicate glossary term: ${entry.term}`);
  }
  seen.add(entry.term);
}

export const glossary: GlossaryTerm[] = chunks.flat();

export function glossarySlug(term: string): string {
  return term
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');
}

export function glossaryBySlug(slug: string): GlossaryTerm | undefined {
  return glossary.find((entry) => glossarySlug(entry.term) === slug);
}

export const glossaryByTerm: Record<string, string> = Object.fromEntries(
  glossary.map((entry) => [entry.term, entry.definition]),
);

export function glossaryTipsFor(terms: readonly string[]): Record<string, GlossaryTipEntry> {
  const tips: Record<string, GlossaryTipEntry> = {};
  for (const term of terms) {
    const definition = glossaryByTerm[term];
    if (!definition) {
      throw new Error(`Unknown glossary term: ${term}`);
    }
    tips[term] = { definition, href: `/glossary/${glossarySlug(term)}` };
  }
  return tips;
}

export function glossaryRelated(entry: GlossaryTerm): GlossaryTerm[] {
  return entry.related
    .map((term) => glossary.find((item) => item.term === term))
    .filter((item): item is GlossaryTerm => Boolean(item));
}
