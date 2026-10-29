import fs from 'node:fs';
import path from 'node:path';
import { root } from './file-walk';

const out = path.join(root, 'out');
const errors: string[] = [];
const checked = new Set<string>();

function walk(directory: string): string[] {
  return fs.readdirSync(directory, { withFileTypes: true }).flatMap((entry) => {
    const full = path.join(directory, entry.name);
    return entry.isDirectory() ? walk(full) : [full];
  });
}

function resolves(href: string): boolean {
  let clean = href.split('#')[0].split('?')[0];
  try {
    clean = decodeURIComponent(clean);
  } catch {
    return false;
  }
  if (clean === '' || clean === '/') return fs.existsSync(path.join(out, 'index.html'));
  const target = path.join(out, clean.replace(/^\//, ''));
  if (fs.existsSync(target)) return true;
  if (fs.existsSync(`${target}.html`)) return true;
  if (fs.existsSync(path.join(target, 'index.html'))) return true;
  return false;
}

if (!fs.existsSync(out)) {
  console.error('verify:links failed: out/ is missing; run next build first');
  process.exit(1);
}

const pages = walk(out).filter((file) => file.endsWith('.html'));

for (const file of pages) {
  const html = fs.readFileSync(file, 'utf8');
  const route = `/${path.relative(out, file).split(path.sep).join('/')}`;
  const links = [...html.matchAll(/(?:href|src)="([^"]+)"/g)].map((match) => match[1]);
  for (const link of links) {
    if (
      link.startsWith('#') ||
      link.startsWith('mailto:') ||
      link.startsWith('tel:') ||
      link.startsWith('http://') ||
      link.startsWith('https://') ||
      link.startsWith('data:') ||
      link.startsWith('javascript:')
    ) {
      continue;
    }
    if (!link.startsWith('/')) {
      errors.push(`${route}: relative link ${link}`);
      continue;
    }
    const linkPath = link.split('#')[0].split('?')[0];
    if (
      linkPath.length > 1 &&
      !path.posix.extname(linkPath) &&
      !linkPath.endsWith('/')
    ) {
      errors.push(`${route}: link without trailing slash ${link}`);
    }
    const key = `${route} -> ${link}`;
    if (checked.has(key)) continue;
    checked.add(key);
    if (!resolves(link)) errors.push(`${route}: broken link ${link}`);
  }
}

if (pages.length < 80) errors.push(`only ${pages.length} HTML files found`);

if (errors.length > 0) {
  console.error('verify:links failed');
  for (const error of errors.slice(0, 40)) console.error(`  - ${error}`);
  if (errors.length > 40) console.error(`  ...and ${errors.length - 40} more`);
  process.exit(1);
}

console.log(`verify:links passed (${pages.length} HTML files, ${checked.size} internal links)`);
