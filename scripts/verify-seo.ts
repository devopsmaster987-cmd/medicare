import fs from 'node:fs';
import path from 'node:path';
import { site } from '../data/site';
import { root } from './file-walk';

const out = path.join(root, 'out');
const errors: string[] = [];

function decodeEntities(value: string): string {
  return value
    .replaceAll('&#x27;', "'")
    .replaceAll('&#39;', "'")
    .replaceAll('&quot;', '"')
    .replaceAll('&amp;', '&')
    .replaceAll('&lt;', '<')
    .replaceAll('&gt;', '>');
}

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
  const rawTitle = html.match(/<title>([^<]+)<\/title>/)?.[1];
  const rawDescription = html.match(/name="description" content="([^"]+)"/)?.[1];
  const title = rawTitle ? decodeEntities(rawTitle) : undefined;
  const description = rawDescription ? decodeEntities(rawDescription) : undefined;
  const canonical = html.match(/rel="canonical" href="([^"]+)"/)?.[1];
  const lang = html.match(/<html[^>]*lang="([^"]+)"/)?.[1];
  const h1Count = (html.match(/<h1[\s>]/g) ?? []).length;
  const schemas = [...html.matchAll(/<script type="application\/ld\+json"[^>]*>([\s\S]*?)<\/script>/g)];
  const hasRssLink = /rel="alternate"[^>]*application\/rss\+xml/i.test(html);
  const hasManifest = /rel="manifest"[^>]*href="\/manifest\.webmanifest"/i.test(html);
  const hasPreviewRobots = /name="googlebot"[^>]*max-image-preview:large/i.test(html);

  if (!title) errors.push(`${route}: missing title`);
  else if (title.length > 60) errors.push(`${route}: title is ${title.length} characters (max 60)`);
  else if (titles.has(title)) errors.push(`${route}: duplicate title shared with ${titles.get(title)}`);
  else titles.set(title, route);

  if (!description) errors.push(`${route}: missing meta description`);
  else if (description.length > 160) {
    errors.push(`${route}: meta description is ${description.length} characters (max 160)`);
  } else if (descriptions.has(description)) {
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
  if (!hasRssLink) errors.push(`${route}: missing RSS alternate link`);
  if (!hasManifest) errors.push(`${route}: missing web app manifest link`);
  if (!hasPreviewRobots) errors.push(`${route}: missing googlebot max-image-preview directive`);
  if (schemas.length === 0) errors.push(`${route}: missing JSON-LD`);
  for (const schema of schemas) {
    let parsed: unknown;
    try {
      parsed = JSON.parse(schema[1]);
    } catch {
      errors.push(`${route}: invalid JSON-LD block`);
      continue;
    }
    const nodes = Array.isArray(parsed) ? parsed : [parsed];
    for (const node of nodes) {
      if (typeof node !== 'object' || node === null) {
        errors.push(`${route}: JSON-LD node is not an object`);
        continue;
      }
      const record = node as Record<string, unknown>;
      const type = record['@type'];
      if (!record['@context'] || !type) {
        errors.push(`${route}: JSON-LD node is missing @context or @type`);
      }
      if (type === 'Article') {
        for (const field of ['headline', 'author', 'publisher', 'datePublished', 'dateModified', 'image', 'mainEntityOfPage']) {
          if (!record[field]) errors.push(`${route}: Article JSON-LD is missing ${field}`);
        }
      }
      if (type === 'WebApplication') {
        for (const field of ['name', 'url', 'offers', 'isAccessibleForFree', 'publisher']) {
          if (!record[field]) errors.push(`${route}: WebApplication JSON-LD is missing ${field}`);
        }
      }
      const pageTypes = [
        'WebPage',
        'MedicalWebPage',
        'AboutPage',
        'ContactPage',
        'CollectionPage',
        'ProfilePage',
      ];
      if (pageTypes.includes(String(type))) {
        for (const field of ['url', 'name', 'description', 'isPartOf', 'dateModified']) {
          if (!record[field]) errors.push(`${route}: ${String(type)} JSON-LD is missing ${field}`);
        }
      }
      if (type === 'BreadcrumbList') {
        const items = record.itemListElement;
        if (!Array.isArray(items) || items.length === 0) {
          errors.push(`${route}: BreadcrumbList JSON-LD has no items`);
        }
      }
      if (type === 'FAQPage') {
        const items = record.mainEntity;
        if (!Array.isArray(items) || items.length < 6) {
          errors.push(`${route}: FAQPage JSON-LD has fewer than six questions`);
        }
      }
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
