import { describe, expect, it } from 'vitest';
import { glossary, glossaryBySlug, glossaryRelated, glossarySlug, glossaryTipsFor } from '@/data/glossary';

const GOV_MARKERS = ['.gov', '.mil'];

function wordCount(text: string): number {
  return text.replace(/\s+/g, ' ').trim().split(' ').filter(Boolean).length;
}

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

  it('has a substantial definition for every term', () => {
    expect(glossary.every((entry) => entry.definition.length > 40)).toBe(true);
  });

  it('explains why the term matters with a real paragraph', () => {
    expect(glossary.every((entry) => entry.whyItMatters.length >= 1)).toBe(true);
    expect(
      glossary.every((entry) => entry.whyItMatters.every((paragraph) => wordCount(paragraph) >= 20)),
    ).toBe(true);
  });

  it('carries a worked example for every term', () => {
    expect(glossary.every((entry) => wordCount(entry.worked) >= 25)).toBe(true);
  });

  it('cites an official source with a checked date for every term', () => {
    for (const entry of glossary) {
      expect(entry.sources.length, entry.term).toBeGreaterThan(0);
      expect(
        entry.sources.some((sourceRow) => GOV_MARKERS.some((marker) => sourceRow.source.includes(marker))),
        entry.term,
      ).toBe(true);
      for (const sourceRow of entry.sources) {
        expect(/^https?:\/\//.test(sourceRow.source), entry.term).toBe(true);
        expect(sourceRow.checkedOn, entry.term).toMatch(/^\d{4}-\d{2}-\d{2}$/);
      }
    }
  });

  it('links two calculators or guides and related terms that exist', () => {
    for (const entry of glossary) {
      expect(entry.calculators.length, entry.term).toBeGreaterThanOrEqual(1);
      for (const link of entry.calculators) {
        expect(link.href, entry.term).toMatch(/^\/(calculators|guides)\//);
      }
      expect(entry.related.length, entry.term).toBeGreaterThanOrEqual(3);
      for (const related of entry.related) {
        expect(glossary.some((item) => item.term === related), `${entry.term} -> ${related}`).toBe(true);
      }
      expect(glossaryRelated(entry).length, entry.term).toBe(entry.related.length);
    }
  });

  it('carries an updated timestamp for every term', () => {
    expect(glossary.every((entry) => /^\d{4}-\d{2}-\d{2}$/.test(entry.updatedOn))).toBe(true);
  });

  it('returns only the glossary tips a page asks for', () => {
    const tips = glossaryTipsFor(['MAGI', 'IRMAA']);
    expect(Object.keys(tips)).toEqual(['MAGI', 'IRMAA']);
    expect(tips.MAGI.href).toBe('/glossary/magi');
    expect(() => glossaryTipsFor(['not-a-term'])).toThrow('Unknown glossary term');
  });
});
