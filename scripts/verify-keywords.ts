import fs from 'node:fs';
import path from 'node:path';
import { guideBySlug } from '../content/guides/meta';
import {
  keywordHasLiteralYear,
  keywords,
  primaryKeywordForPage,
  resolveKeyword,
} from '../data/keywords';
import { figureYears } from '../data/verified';
import { relative, root, walkFiles } from './file-walk';

const errors: string[] = [];
const warnings: string[] = [];
const year = figureYears.current;

function pageFile(page: string): string | null {
  if (page === '/') return path.join(root, 'app/(site)/page.tsx');
  const clean = page.replace(/^\//, '');
  const direct = path.join(root, 'app/(site)', clean, 'page.tsx');
  if (fs.existsSync(direct)) return direct;
  const parts = clean.split('/');
  const dynamic = path.join(root, 'app/(site)', parts[0], '[slug]', 'page.tsx');
  return fs.existsSync(dynamic) ? dynamic : null;
}

function resolveYearExpressions(text: string): string {
  return text
    .replace(/\$\{figureYears\.current\}/g, String(year))
    .replace(/\$\{figureYears\.prior\}/g, String(figureYears.prior))
    .replace(/\$\{year\}/g, String(year))
    .replace(/\$\{priorYear\}/g, String(figureYears.prior))
    .replace(/\{figureYears\.current\}/g, String(year))
    .replace(/\{figureYears\.prior\}/g, String(figureYears.prior))
    .replace(/\{year\}/g, String(year))
    .replace(/\{priorYear\}/g, String(figureYears.prior));
}

function stripCode(text: string): string {
  return text
    .replace(/export const metadata[\s\S]*?};/, '')
    .replace(/<script[\s\S]*?<\/script>/g, ' ')
    .replace(/<style[\s\S]*?<\/style>/g, ' ')
    .replace(/\{[^{}]*\}/g, ' ')
    .replace(/<[^>]+>/g, ' ')
    .replace(/&[a-z]+;/gi, ' ')
    .replace(/\s+/g, ' ')
    .trim();
}

function h1Text(text: string): string {
  return (text.match(/<h1[^>]*>([\s\S]*?)<\/h1>/i)?.[1] ?? '').replace(/<[^>]+>/g, ' ');
}

function headings(text: string): string[] {
  return [...text.matchAll(/<h[23][^>]*>([\s\S]*?)<\/h[23]>/gi)].map((match) =>
    match[1].replace(/<[^>]+>/g, ' '),
  );
}

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

function mdxHeadings(text: string): string[] {
  return [...text.matchAll(/^\s{0,3}#{2,3}\s+(.+)$/gm)].map((match) =>
    match[1].replace(/[*_`[\]]/g, '').trim(),
  );
}

function metadataValue(text: string, key: 'title' | 'description'): string {
  const pattern = new RegExp(
    `${key}:\\s*(?:clampMetaDescription\\(\\s*)?(?:'([^']*)'|"([^"]*)"|\`([^\`]*)\`)`,
    'i',
  );
  const match = text.match(pattern);
  return match?.[1] ?? match?.[2] ?? match?.[3] ?? '';
}

const assigned = new Map<string, Set<string>>();
for (const entry of keywords) {
  if (entry.role === 'topic' || entry.role === 'parked' || entry.role === 'excluded') continue;
  if (!entry.page) {
    errors.push(`keyword "${entry.keyword}" has role ${entry.role} but no page`);
    continue;
  }
  const pages = assigned.get(entry.keyword) ?? new Set<string>();
  pages.add(entry.page);
  assigned.set(entry.keyword, pages);
}

for (const [keyword, pages] of assigned) {
  if (pages.size > 1) {
    errors.push(`keyword "${keyword}" is assigned to multiple pages: ${[...pages].join(', ')}`);
  }
}

for (const entry of keywords) {
  if (keywordHasLiteralYear(entry.keyword)) {
    errors.push(`keyword "${entry.keyword}" contains a literal year instead of {year}`);
  }
}

const primaryPages = new Map<string, number>();
for (const entry of keywords) {
  if (entry.role !== 'primary') continue;
  primaryPages.set(entry.page ?? '', (primaryPages.get(entry.page ?? '') ?? 0) + 1);
}
for (const [page, count] of primaryPages) {
  if (count !== 1) errors.push(`page ${page} has ${count} primary keywords`);
}

for (const entry of keywords) {
  if (entry.role !== 'excluded') continue;
  for (const directory of ['app', 'content', 'data', 'lib']) {
    for (const file of walkFiles(directory)) {
      if (relative(file) === 'data/keywords.ts') continue;
      const text = fs.readFileSync(file, 'utf8').toLowerCase();
      if (text.includes(entry.keyword.toLowerCase())) {
        errors.push(`${relative(file)}: excluded keyword "${entry.keyword}" appears`);
      }
    }
  }
}

const routes = [...new Set(keywords.map((entry) => entry.page).filter((page): page is string => Boolean(page)))];
for (const route of routes) {
  const guide = route.startsWith('/guides/') ? guideBySlug[route.slice('/guides/'.length)] : undefined;
  let file: string;
  let resolved: string;
  let visible: string;
  let pageHeadings: string[];
  let h1: string;
  let title: string;
  let description: string;

  if (guide) {
    file = path.join(root, 'content/guides', `${guide.slug}.mdx`);
    if (!fs.existsSync(file)) {
      errors.push(`${route}: guide content file is missing`);
      continue;
    }
    resolved = resolveYearExpressions(fs.readFileSync(file, 'utf8'));
    visible = stripMdx(resolved);
    pageHeadings = mdxHeadings(resolved);
    h1 = resolveYearExpressions(guide.h1);
    title = resolveYearExpressions(guide.title);
    description = resolveYearExpressions(guide.description);
  } else {
    const page = pageFile(route);
    if (!page) {
      warnings.push(`no page file yet for ${route}`);
      continue;
    }
    file = page;
    resolved = resolveYearExpressions(fs.readFileSync(page, 'utf8'));
    const jsxStart = resolved.indexOf('return (');
    visible = stripCode(jsxStart >= 0 ? resolved.slice(jsxStart) : resolved);
    pageHeadings = headings(resolved);
    h1 = h1Text(resolved);
    title = metadataValue(resolved, 'title');
    description = metadataValue(resolved, 'description');
  }

  const primary = primaryKeywordForPage(route);
  if (primary) {
    const expected = resolveKeyword(primary.keyword, year).toLowerCase();
    const firstWords = visible.toLowerCase().split(/\s+/).slice(0, 40).join(' ');
    if (!h1.toLowerCase().includes(expected)) errors.push(`${relative(file)}: H1 does not contain primary "${expected}"`);
    if (!title.toLowerCase().includes(expected)) errors.push(`${relative(file)}: title does not contain primary "${expected}"`);
    if (!description.toLowerCase().includes(expected)) errors.push(`${relative(file)}: meta description does not contain primary "${expected}"`);
    if (!firstWords.includes(expected)) errors.push(`${relative(file)}: first 40 words do not contain primary "${expected}"`);
  }

  const normalizedHeadings = pageHeadings.map((heading) => heading.toLowerCase());
  for (const entry of keywords.filter((item) => item.page === route && item.role === 'secondary')) {
    const expected = resolveKeyword(entry.keyword, year).toLowerCase();
    if (!normalizedHeadings.some((heading) => heading.includes(expected))) {
      errors.push(`${relative(file)}: missing secondary heading "${expected}"`);
    }
  }

  const raw = resolved.toLowerCase();
  for (const entry of keywords.filter((item) => item.page === route && item.role === 'faq')) {
    const expected = resolveKeyword(entry.keyword, year).toLowerCase();
    if (!raw.includes(expected)) {
      errors.push(`${relative(file)}: missing FAQ keyword "${expected}"`);
    }
  }

  const body = visible.toLowerCase();
  for (const entry of keywords.filter((item) => item.page === route)) {
    const expected = resolveKeyword(entry.keyword, year).toLowerCase();
    const occurrences = body.split(expected).length - 1;
    if (occurrences > 4) {
      errors.push(`${relative(file)}: keyword "${expected}" appears ${occurrences} times in body text`);
    }
  }
}

if (errors.length > 0) {
  console.error('verify:keywords failed');
  for (const error of errors) console.error(`  - ${error}`);
  process.exit(1);
}

console.log(`verify:keywords passed (${warnings.length} warnings)`);
for (const warning of warnings) console.log(`  warning: ${warning}`);
