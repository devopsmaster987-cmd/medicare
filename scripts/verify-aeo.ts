import fs from 'node:fs';
import path from 'node:path';
import { guides } from '../content/guides/meta';
import { root, relative, walkFiles } from './file-walk';

const calculatorDirectory = path.join(root, 'app/(site)/calculators');
const guideDirectory = path.join(root, 'app/(site)/guides');

const calculatorFiles = walkFiles(calculatorDirectory, ['.tsx']).filter(
  (file) => file.endsWith('page.tsx') && file !== path.join(calculatorDirectory, 'page.tsx'),
);

const errors: string[] = [];

function stripCode(text: string): string {
  let output = text;
  for (let pass = 0; pass < 8; pass += 1) {
    output = output.replace(/\{[^{}]*\}/g, ' ');
  }
  return output
    .replace(/<[^>]+>/g, ' ')
    .replace(/&[a-z]+;/gi, ' ')
    .replace(/\s+/g, ' ')
    .trim();
}

function checkMarkers(file: string, text: string, markers: string[], label = relative(file)): void {
  for (const marker of markers) {
    if (!text.toLowerCase().includes(marker.toLowerCase())) {
      errors.push(`${label}: missing ${marker}`);
    }
  }
}

const calculatorMarkers = [
  'AnswerCapsule',
  'KeyFacts',
  'Faq',
  'SourceTable',
  'Last updated',
  'Worked example',
  'Breadcrumb',
];

for (const file of calculatorFiles) {
  checkMarkers(file, fs.readFileSync(file, 'utf8'), calculatorMarkers);
}

const guideMarkers = [
  'AnswerCapsule',
  'KeyFacts',
  'Faq',
  'SourceTable',
  'Last updated',
  'Worked example',
  'Breadcrumb',
];

for (const guide of guides) {
  const contentFile = path.join(root, 'content/guides', `${guide.slug}.mdx`);
  const pageFile = path.join(guideDirectory, '[slug]', 'page.tsx');
  if (!fs.existsSync(contentFile)) {
    errors.push(`content/guides/${guide.slug}.mdx: missing guide content`);
    continue;
  }
  if (!fs.existsSync(pageFile)) {
    errors.push('app/(site)/guides/[slug]/page.tsx: missing guide route');
    continue;
  }

  const content = fs.readFileSync(contentFile, 'utf8');
  const page = fs.readFileSync(pageFile, 'utf8');
  checkMarkers(contentFile, `${content}\n${page}`, guideMarkers);

  const capsule = content.match(/<AnswerCapsule>([\s\S]*?)<\/AnswerCapsule>/)?.[1] ?? '';
  const capsuleWords = stripCode(capsule).split(/\s+/).filter(Boolean).length;
  if (capsuleWords < 40 || capsuleWords > 60) {
    errors.push(
      `content/guides/${guide.slug}.mdx: answer capsule is ${capsuleWords} words (expected 40-60)`,
    );
  }

  const faqCount = (content.match(/question:/g) ?? []).length;
  if (faqCount < 6) {
    errors.push(`content/guides/${guide.slug}.mdx: only ${faqCount} visible FAQs`);
  }

  if (!content.includes('faqSchema') && !content.includes('<Faq')) {
    errors.push(`content/guides/${guide.slug}.mdx: missing FAQ schema component`);
  }
}

if (errors.length > 0) {
  console.error('verify:aeo failed');
  for (const error of errors) console.error(`  - ${error}`);
  process.exit(1);
}

console.log(
  `verify:aeo passed (${calculatorFiles.length} calculator pages, ${guides.length} guides)`,
);
