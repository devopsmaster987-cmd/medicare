import fs from 'node:fs';
import path from 'node:path';
import { root, relative } from './file-walk';

const out = path.join(root, 'out');
const errors: string[] = [];

function walk(directory: string): string[] {
  return fs.readdirSync(directory, { withFileTypes: true }).flatMap((entry) => {
    const full = path.join(directory, entry.name);
    return entry.isDirectory() ? walk(full) : [full];
  });
}

if (!fs.existsSync(out)) {
  console.error('verify:og failed: out/ is missing; run next build first');
  process.exit(1);
}

const pages = walk(out).filter((file) => file.endsWith('index.html'));
const seen = new Map<string, string>();

for (const file of pages) {
  const html = fs.readFileSync(file, 'utf8');
  const og = html.match(/property="og:image" content="([^"]+)"/)?.[1];
  const twitter = html.match(/name="twitter:image" content="([^"]+)"/)?.[1];
  const route = relative(file).replace(/^out/, '').replace(/index\.html$/, '') || '/';
  if (!og) {
    errors.push(`${route}: missing og:image`);
    continue;
  }
  if (twitter && twitter !== og) {
    errors.push(`${route}: twitter:image differs from og:image`);
  }
  const existing = seen.get(og);
  if (existing) {
    if (!(og.endsWith('/og/default.png') && (route === '/404/' || existing === '/404/'))) {
      errors.push(`${route}: duplicate og:image shared with ${existing}`);
    }
  } else {
    seen.set(og, route);
  }
}

if (pages.length < 80) {
  errors.push(`only ${pages.length} exported pages found`);
}

if (errors.length > 0) {
  console.error('verify:og failed');
  for (const error of errors) console.error(`  - ${error}`);
  process.exit(1);
}

console.log(`verify:og passed (${pages.length} pages, ${seen.size} unique og:image values)`);
