import fs from 'node:fs';
import path from 'node:path';
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
  console.error('verify:a11y failed: out/ is missing; run next build first');
  process.exit(1);
}

const pages = walk(out).filter((file) => file.endsWith('.html'));

for (const file of pages) {
  const html = fs.readFileSync(file, 'utf8');
  const route = `/${path.relative(out, file).split(path.sep).join('/')}`;

  if (!/<html[^>]*lang="en-US"/.test(html)) errors.push(`${route}: missing lang="en-US"`);

  const ids = [...html.matchAll(/\sid="([^"]+)"/g)].map((match) => match[1]);
  const seen = new Set<string>();
  for (const id of ids) {
    if (seen.has(id)) errors.push(`${route}: duplicate id "${id}"`);
    seen.add(id);
  }

  for (const match of html.matchAll(/(?:aria-labelledby|aria-describedby)="([^"]+)"/g)) {
    for (const id of match[1].split(/\s+/).filter(Boolean)) {
      if (!seen.has(id)) errors.push(`${route}: aria reference "${id}" has no matching id`);
    }
  }

  for (const match of html.matchAll(/<img\b[^>]*>/g)) {
    if (!/\salt="[^"]*"/.test(match[0])) errors.push(`${route}: img without alt`);
  }

  for (const match of html.matchAll(/<a\b[^>]*>([\s\S]*?)<\/a>/g)) {
    const tag = match[0];
    const text = match[1].replace(/<[^>]+>/g, '').trim();
    const hasLabel = /\saria-label="[^"]+"/.test(tag);
    if (!text && !hasLabel && !/<svg|<img/.test(match[1])) {
      errors.push(`${route}: link without accessible text`);
    }
    if (/\starget="_blank"/.test(tag) && !/\srel="[^"]*noreferrer/.test(tag) && !/\srel="[^"]*noopener/.test(tag)) {
      errors.push(`${route}: target=_blank link without rel noopener/noreferrer`);
    }
  }

  for (const match of html.matchAll(/<button\b[^>]*>([\s\S]*?)<\/button>/g)) {
    const tag = match[0];
    const text = match[1].replace(/<[^>]+>/g, '').trim();
    const hasLabel = /\saria-label="[^"]+"/.test(tag);
    if (!text && !hasLabel) errors.push(`${route}: button without accessible text`);
  }
}

if (pages.length < 80) errors.push(`only ${pages.length} HTML files found`);

if (errors.length > 0) {
  console.error('verify:a11y failed');
  for (const error of errors.slice(0, 40)) console.error(`  - ${error}`);
  if (errors.length > 40) console.error(`  ...and ${errors.length - 40} more`);
  process.exit(1);
}

console.log(`verify:a11y passed (${pages.length} HTML files)`);
