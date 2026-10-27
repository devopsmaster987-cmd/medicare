import { describe, expect, it } from 'vitest';
import { glossary, glossaryBySlug, glossarySlug, glossaryTipsFor } from '@/data/glossary';

describe('glossary', () => {
  it('publishes 60 terms', () => {
    expect(glossary).toHaveLength(60);
  });

  it('has a unique slug for every term', () => {
    const slugs = glossary.map((entry) => glossarySlug(entry.term));
    expect(new Set(slugs).size).toBe(glossary.length);
  });

  it('can resolve a term from its slug', () => {
    expect(glossaryBySlug('irmaa')?.term).toBe('IRMAA');
    expect(glossaryBySlug('not-a-term')).toBeUndefined();
  });

  it('has a definition for every term', () => {
    expect(glossary.every((entry) => entry.definition.length > 20)).toBe(true);
  });
});

  it('returns only the glossary tips a page asks for', () => {
    const tips = glossaryTipsFor(['MAGI', 'IRMAA']);
    expect(Object.keys(tips)).toEqual(['MAGI', 'IRMAA']);
    expect(tips.MAGI.href).toBe('/glossary/magi');
    expect(() => glossaryTipsFor(['not-a-term'])).toThrow('Unknown glossary term');
  });
