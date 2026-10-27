import fs from 'node:fs';
import path from 'node:path';
import { site } from '../data/site';
import { root } from './file-walk';

const out = path.join(root, 'out');
const errors: string[] = [];

function walk(directory: string): string[] {
  return fs.readdirSync(directory, { withFileTypes: true }).flatMap((entry) => {
    const full = path.join(directory, entry.name);
    return entry.isDirectory() ? walk(full) : [full];
  });
}

if (!fs.existsSync(out)) {
  console.error('verify:seo failed: out/ is missing; run next build first');
  process.exit(1);
}

const pages = walk(out).filter((file) => file.endsWith('index.html'));
const titles = new Map<string, string>();
const descriptions = new Map<string, string>();
const canonicals = new Map<string, string>();

for (const file of pages) {
  const relativePath = path
    .relative(out, file)
    .replaceAll('\\', '/')
    .replace(/index\.html$/, '');
  const route = relativePath === '' ? '/' : `/${relativePath}`;
  if (route === '/404/') continue;

  const html = fs.readFileSync(file, 'utf8');
  const title = html.match(/<title>([^<]+)<\/title>/)?.[1];
  const description = html.match(/name="description" content="([^"]+)"/)?.[1];
  const canonical = html.match(/rel="canonical" href="([^"]+)"/)?.[1];
  const lang = html.match(/<html[^>]*lang="([^"]+)"/)?.[1];
  const h1Count = (html.match(/<h1[\s>]/g) ?? []).length;
  const schemas = [...html.matchAll(/<script type="application\/ld\+json"[^>]*>([\s\S]*?)<\/script>/g)];

  if (!title) errors.push(`${route}: missing title`);
  else if (titles.has(title)) errors.push(`${route}: duplicate title shared with ${titles.get(title)}`);
  else titles.set(title, route);

  if (!description) errors.push(`${route}: missing meta description`);
  else if (descriptions.has(description)) {
    errors.push(`${route}: duplicate meta description shared with ${descriptions.get(description)}`);
  } else descriptions.set(description, route);

  const expected = `${site.siteUrl}${route}`;
  if (!canonical) errors.push(`${route}: missing canonical`);
  else if (canonical !== expected) errors.push(`${route}: canonical ${canonical} != ${expected}`);
  else if (canonicals.has(canonical)) {
    errors.push(`${route}: duplicate canonical shared with ${canonicals.get(canonical)}`);
  } else canonicals.set(canonical, route);

  if (lang !== 'en-US') errors.push(`${route}: html lang is ${lang ?? 'missing'}, expected en-US`);
  if (h1Count !== 1) errors.push(`${route}: expected one h1, found ${h1Count}`);
  if (schemas.length === 0) errors.push(`${route}: missing JSON-LD`);
  for (const schema of schemas) {
    try {
      JSON.parse(schema[1]);
    } catch {
      errors.push(`${route}: invalid JSON-LD block`);
    }
  }
}

if (pages.length < 80) errors.push(`only ${pages.length} exported pages found`);

if (errors.length > 0) {
  console.error('verify:seo failed');
  for (const error of errors) console.error(`  - ${error}`);
  process.exit(1);
}

console.log(
  `verify:seo passed (${titles.size} pages: unique title, description, canonical, lang, one h1, JSON-LD)`,
);
