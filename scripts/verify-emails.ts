import fs from 'node:fs';
import path from 'node:path';
import { relative, root, walkFiles } from './file-walk';

const allowed = 'ihsanaslamm@gmail.com';
const emailPattern = /[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}/g;
const errors: string[] = [];

const directories = ['app', 'components', 'content', 'data', 'lib', 'docs'];
for (const directory of directories) {
  for (const file of walkFiles(directory)) {
    const text = fs.readFileSync(file, 'utf8');
    const matches = text.match(emailPattern) ?? [];
    for (const email of matches) {
      if (email.toLowerCase() !== allowed) {
        errors.push(`${relative(file)}: unexpected email ${email}`);
      }
    }
  }
}

const siteFile = path.join(root, 'data/site.ts');
const siteText = fs.readFileSync(siteFile, 'utf8');
if (!siteText.includes(allowed)) {
  errors.push('data/site.ts does not define the allowed contact email');
}

if (errors.length > 0) {
  console.error('verify:emails failed');
  for (const error of errors) console.error(`  - ${error}`);
  process.exit(1);
}

console.log(`verify:emails passed (only ${allowed})`);
