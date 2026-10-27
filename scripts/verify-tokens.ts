import fs from 'node:fs';
import { site } from '../data/site';
import { relative, walkFiles } from './file-walk';

const errors: string[] = [];
const warnings: string[] = [];
const tokenPattern = /\[[A-Z][A-Z0-9 /_-]*\]/g;

for (const directory of ['app', 'components', 'content', 'data', 'lib']) {
  for (const file of walkFiles(directory)) {
    const text = fs.readFileSync(file, 'utf8');
    const matches = text.match(tokenPattern) ?? [];
    for (const token of matches) {
      errors.push(`${relative(file)}: unresolved token ${token}`);
    }
  }
}

if (site.siteUrlIsPlaceholder) {
  const message = 'data/site.ts still uses the placeholder siteUrl';
  if (process.env.LAUNCH_CHECK === '1' || process.env.ALLOW_PLACEHOLDERS !== '1') {
    errors.push(message);
  } else {
    warnings.push(message);
  }
}

if (!site.siteName || !site.ownerName || !site.contactEmail || !site.location || !site.governingLaw) {
  errors.push('data/site.ts has an empty required owner or site value');
}

if (errors.length > 0) {
  console.error('verify:tokens failed');
  for (const error of errors) console.error(`  - ${error}`);
  process.exit(1);
}

console.log(`verify:tokens passed (${warnings.length} warnings)`);
for (const warning of warnings) console.log(`  warning: ${warning}`);
