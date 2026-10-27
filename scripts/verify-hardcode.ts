import fs from 'node:fs';
import { relative, walkFiles } from './file-walk';

const errors: string[] = [];
const directories = ['app', 'components', 'content', 'lib'];
const dollarPattern = /\$(?!\{)\s?\d/;
const yearPattern = /\b20\d{2}\b/;
const phonePattern = /\b1?[-.\s]?\(?\d{3}\)?[-.\s]\d{3}[-.\s]\d{4}\b/;
const moduleSpecifierPattern = /^\s*(?:import|export)\b.*\bfrom\b|^\s*(?:const|let|var)\s+\w+\s*=\s*require\(/;

for (const directory of directories) {
  for (const file of walkFiles(directory, ['.ts', '.tsx', '.md', '.mdx', '.json'])) {
    const lines = fs.readFileSync(file, 'utf8').split(/\r?\n/);
    lines.forEach((line, index) => {
      if (moduleSpecifierPattern.test(line)) return;
      const location = `${relative(file)}:${index + 1}`;
      if (dollarPattern.test(line)) {
        errors.push(`${location}: hardcoded dollar amount`);
      }
      if (yearPattern.test(line)) {
        errors.push(`${location}: hardcoded year`);
      }
      if (phonePattern.test(line)) {
        errors.push(`${location}: hardcoded phone number`);
      }
    });
  }
}

if (errors.length > 0) {
  console.error('verify:hardcode failed');
  for (const error of errors) console.error(`  - ${error}`);
  process.exit(1);
}

console.log('verify:hardcode passed');
