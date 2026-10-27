import fs from 'node:fs';
import path from 'node:path';
import { root, relative, walkFiles } from './file-walk';

const flagships = [
  'employer-coverage-affordability',
  'medicare-savings-program-extra-help',
  'part-b-late-enrollment-penalty',
  'irmaa-cliff-checker',
  'medicare-vs-aca',
];

const directories = flagships.map((slug) =>
  path.join(root, 'app/(site)/calculators', slug),
);
const existing = directories.filter((directory) => fs.existsSync(directory));
const errors: string[] = [];
const required = [
  'ActionPlan',
  'Deadline',
  'TakeHomePack',
  'WhatChanged',
  'ScenarioCompare',
  'GlossaryTip',
  'ReportError',
];
const shellFiles = [
  path.join(root, 'components/site-header.tsx'),
  path.join(root, 'app/(site)/layout.tsx'),
];
const shellText = shellFiles
  .filter((file) => fs.existsSync(file))
  .map((file) => fs.readFileSync(file, 'utf8'))
  .join(String.fromCharCode(10));
if (!shellText.includes('TextSizeControl')) {
  errors.push('site shell: missing TextSizeControl');
}

for (const directory of existing) {
  const text = walkFiles(directory, ['.tsx'])
    .map((file) => fs.readFileSync(file, 'utf8'))
    .join(String.fromCharCode(10));
  const label = relative(directory);
  for (const marker of required) {
    if (!text.includes(marker)) errors.push(`${label}: missing ${marker}`);
  }
  if (!text.includes('aria-live')) errors.push(`${label}: missing aria-live result region`);
}

if (errors.length > 0) {
  console.error('verify:features failed');
  for (const error of errors) console.error(`  - ${error}`);
  process.exit(1);
}

console.log(
  existing.length === 0
    ? 'verify:features passed (no flagship pages yet)'
    : `verify:features passed (${existing.length} flagship pages)`,
);
