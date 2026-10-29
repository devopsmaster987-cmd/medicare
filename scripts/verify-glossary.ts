import fs from 'node:fs';
import path from 'node:path';
import { glossary, glossaryBySlug, glossarySlug } from '../data/glossary';
import { root, relative } from './file-walk';

const errors: string[] = [];

const GOV_BREAKS = ['.gov', '.mil'];

function isOfficialSource(url: string): boolean {
  const lower = url.toLowerCase();
  if (!/^https?:\/\//.test(lower)) return false;
  return GOV_BREAKS.some((marker) => lower.includes(marker));
}

function countWords(text: string): number {
  return text
    .replace(/\s+/g, ' ')
    .trim()
    .split(' ')
    .filter(Boolean).length;
}

// 1. Data record checks
for (const entry of glossary) {
  const label = `data/glossary: ${entry.term}`;

  if (!entry.definition || entry.definition.length < 40) {
    errors.push(`${label}: definition is missing or too short`);
  }
  if (!entry.whyItMatters.length) {
    errors.push(`${label}: missing "Why it matters" section`);
  }
  for (const paragraph of entry.whyItMatters) {
    if (countWords(paragraph) < 20) {
      errors.push(`${label}: "Why it matters" paragraph is too short (under 20 words)`);
    }
  }
  if (!entry.exact.length) {
    errors.push(`${label}: missing "exact figure or test" section`);
  }
  if (countWords(entry.worked) < 25) {
    errors.push(`${label}: worked example is missing or too short (under 25 words)`);
  }
  if (entry.related.length < 3 || entry.related.length > 4) {
    errors.push(`${label}: must have 3 or 4 related terms`);
  }
  if (entry.calculators.length < 1) {
    errors.push(`${label}: needs at least one calculator link`);
  }
  for (const link of entry.calculators) {
    if (!/^\/(calculators|guides)\//.test(link.href)) {
      errors.push(`${label}: calculator link "${link.href}" is not an internal calculator or guide path`);
    }
  }
  for (const related of entry.related) {
    if (!glossary.find((item) => item.term === related)) {
      errors.push(`${label}: related term "${related}" is not a glossary term`);
    }
  }
  if (!entry.sources.length) {
    errors.push(`${label}: missing source table rows`);
  }
  if (!entry.sources.some((sourceRow) => isOfficialSource(sourceRow.source))) {
    errors.push(`${label}: at least one source must be an official .gov/.mil source`);
  }
  for (const sourceRow of entry.sources) {
    if (!sourceRow.label || !sourceRow.value) {
      errors.push(`${label}: source row is missing a label or value`);
    }
    if (!/^https?:\/\//.test(sourceRow.source)) {
      errors.push(`${label}: source row is not a URL: ${sourceRow.source}`);
    }
    if (!/^\d{4}-\d{2}-\d{2}$/.test(sourceRow.checkedOn)) {
      errors.push(`${label}: source row missing an ISO checkedOn date`);
    }
  }
  if (!/^\d{4}-\d{2}-\d{2}$/.test(entry.updatedOn)) {
    errors.push(`${label}: missing ISO updatedOn date`);
  }
  if (/\[YOUR NAME\]|\[COUNTRY\s*\/\s*STATE\]|\[SITE URL\]|\[DATE\]/i.test(JSON.stringify(entry))) {
    errors.push(`${label}: leftover placeholder token`);
  }
}

const slugs = new Set(glossary.map((entry) => glossarySlug(entry.term)));
if (slugs.size !== glossary.length) {
  errors.push('data/glossary: duplicate slugs in term list');
}

// 2. Built HTML checks (word count, source link, worked example) when a build exists
const outDir = path.join(root, 'out');
if (fs.existsSync(outDir)) {
  for (const entry of glossary) {
    const slug = glossarySlug(entry.term);
    const file = path.join(outDir, 'glossary', slug, 'index.html');
    if (!fs.existsSync(file)) {
      errors.push(`out/glossary/${slug}: built page is missing`);
      continue;
    }
    const html = fs.readFileSync(file, 'utf8');
    const body = html
      .replace(/<script[\s\S]*?<\/script>/g, ' ')
      .replace(/<style[\s\S]*?<\/style>/g, ' ')
      .replace(/<[^>]+>/g, ' ')
      .replace(/&[a-z#0-9]+;/gi, ' ')
      .replace(/\s+/g, ' ');
    const words = countWords(body);
    if (words < 250) {
      errors.push(`out/glossary/${slug}: page has only ${words} words (need at least 250)`);
    }
    if (!/Worked number/i.test(html)) {
      errors.push(`out/glossary/${slug}: missing Worked number section`);
    }
    if (!/Why it matters/i.test(html)) {
      errors.push(`out/glossary/${slug}: missing Why it matters section`);
    }
    if (!/Related terms/i.test(html)) {
      errors.push(`out/glossary/${slug}: missing Related terms section`);
    }
  }

  const hub = path.join(outDir, 'glossary', 'index.html');
  if (!fs.existsSync(hub)) {
    errors.push('out/glossary: hub page is missing');
  } else {
    const hubWords = countWords(
      fs
        .readFileSync(hub, 'utf8')
        .replace(/<script[\s\S]*?<\/script>/g, ' ')
        .replace(/<style[\s\S]*?<\/style>/g, ' ')
        .replace(/<[^>]+>/g, ' ')
        .replace(/&[a-z#0-9]+;/gi, ' ')
        .replace(/\s+/g, ' '),
    );
    if (hubWords < 250) {
      errors.push(`out/glossary/index.html: hub page has only ${hubWords} words`);
    }
  }
}

if (errors.length > 0) {
  console.error('verify:glossary failed');
  for (const error of errors) console.error(`  - ${error}`);
  process.exit(1);
}

console.log(`verify:glossary passed (${glossary.length} term pages checked)`);
