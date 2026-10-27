import fs from 'node:fs';
import path from 'node:path';
import { root } from './file-walk';

const logPath = path.join(root, 'docs/verification-log.md');
const requiredFormulas = [
  'employerAffordability',
  'mspEligibility',
  'partBPenaltyCalculator',
  'irmaaCalculator',
  'medicareVsAca',
];

if (!fs.existsSync(logPath)) {
  console.error('verify:log failed: docs/verification-log.md is missing');
  process.exit(1);
}

const text = fs.readFileSync(logPath, 'utf8');
const errors: string[] = [];

for (const formula of requiredFormulas) {
  const sectionStart = text.indexOf(`## ${formula}`);
  if (sectionStart === -1) {
    errors.push(`missing entry for ${formula}`);
    continue;
  }
  const nextSection = text.indexOf('\n## ', sectionStart + 1);
  const section = text.slice(sectionStart, nextSection === -1 ? undefined : nextSection);
  if (!/Source:\s*https?:\/\//i.test(section)) errors.push(`${formula}: missing official source URL`);
  if (!/Example 1/i.test(section)) errors.push(`${formula}: missing hand-worked example 1`);
  if (!/Example 2/i.test(section)) errors.push(`${formula}: missing hand-worked example 2`);
  if (!/Expected:/i.test(section)) errors.push(`${formula}: missing expected result`);
  if (!/Actual:/i.test(section)) errors.push(`${formula}: missing actual result`);
  if (!/Checked on:\s*\d{4}-\d{2}-\d{2}/i.test(section)) errors.push(`${formula}: missing checked date`);
}

if (errors.length > 0) {
  console.error('verify:log failed');
  for (const error of errors) console.error(`  - ${error}`);
  process.exit(1);
}

console.log('verify:log passed');
