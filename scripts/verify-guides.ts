import fs from 'node:fs';
import path from 'node:path';
import { guides, resolveGuide } from '../content/guides/meta';
import { primaryKeywordForPage, resolveKeyword } from '../data/keywords';
import { figureYears } from '../data/verified';
import { root, relative } from './file-walk';

const errors: string[] = [];
const year = figureYears.current;
const minimumWords = 1200;

function stripMdx(text: string): string {
  let output = text
    .replace(/^\s*(?:import|export)\s[^\n]*$/gm, ' ')
    .replace(/\]\([^)]*\)/g, ']');
  for (let pass = 0; pass < 8; pass += 1) {
    output = output.replace(/\{[^{}]*\}/g, ' ');
  }
  return output
    .replace(/<[^>]+>/g, ' ')
    .replace(/[#>*_`|~-]+/g, ' ')
    .replace(/&[a-z]+;/gi, ' ')
    .replace(/\s+/g, ' ')
    .trim();
}

for (const guide of guides) {
  const file = path.join(root, 'content/guides', `${guide.slug}.mdx`);
  const label = relative(file);
  if (!fs.existsSync(file)) {
    errors.push(`${label}: missing guide content`);
    continue;
  }

  const source = fs.readFileSync(file, 'utf8');
  const resolved = source.replaceAll('{year}', String(year));
  const visible = stripMdx(resolved);
  const words = visible.split(/\s+/).filter(Boolean).length;
  if (words < minimumWords) {
    errors.push(`${label}: ${words} visible words (minimum ${minimumWords})`);
  }

  const faqCount = (source.match(/question:/g) ?? []).length;
  if (faqCount < 6) errors.push(`${label}: only ${faqCount} FAQs`);

  const literalUrls = new Set(source.match(/https?:\/\/[^\s"')]+/g) ?? []);
  if (literalUrls.size === 0 && !source.includes('sources.')) {
    errors.push(`${label}: no official source link`);
  }

  const primary = primaryKeywordForPage(`/guides/${guide.slug}`);
  if (!primary) {
    errors.push(`${label}: no primary keyword in the map`);
  } else {
    const expected = resolveKeyword(primary.keyword, year).toLowerCase();
    const h1 = resolveGuide(guide.h1, year).toLowerCase();
    const title = resolveGuide(guide.title, year).toLowerCase();
    const description = resolveGuide(guide.description, year).toLowerCase();
    const firstWords = visible.toLowerCase().split(/\s+/).slice(0, 40).join(' ');
    if (!h1.includes(expected)) errors.push(`${label}: H1 missing primary "${expected}"`);
    if (!title.includes(expected)) errors.push(`${label}: title missing primary "${expected}"`);
    if (!description.includes(expected)) errors.push(`${label}: description missing primary "${expected}"`);
    if (!firstWords.includes(expected)) errors.push(`${label}: first 40 words missing primary "${expected}"`);
  }

  if (/\b2027\b/.test(source)) {
    errors.push(`${label}: contains a 2027 figure before the official table is supplied`);
  }

  if (!source.includes('AnswerCapsule')) errors.push(`${label}: missing AnswerCapsule`);
  if (!source.includes('KeyFacts')) errors.push(`${label}: missing KeyFacts`);
  if (!source.includes('SourceTable')) errors.push(`${label}: missing SourceTable`);
  if (!source.toLowerCase().includes('worked example')) {
    errors.push(`${label}: missing a worked example heading`);
  }
}

if (errors.length > 0) {
  console.error('verify:guides failed');
  for (const error of errors) console.error(`  - ${error}`);
  process.exit(1);
}

console.log(`verify:guides passed (${guides.length} guides, minimum ${minimumWords} words)`);
