import fs from 'node:fs';
import path from 'node:path';
import { guides, resolveGuide } from '../content/guides/meta';
import { site } from '../data/site';
import { dataVerifiedOn, figureYears } from '../data/verified';
import { root } from './file-walk';

const calculators = [
  ['Employer coverage affordability', '/calculators/employer-coverage-affordability'],
  ['Medicare Savings Program and Extra Help', '/calculators/medicare-savings-program-extra-help'],
  ['Part B late enrollment penalty', '/calculators/part-b-late-enrollment-penalty'],
  ['IRMAA cliff checker', '/calculators/irmaa-cliff-checker'],
  ['Medicare vs ACA', '/calculators/medicare-vs-aca'],
] as const;

const lines = [
  `# ${site.siteName}`,
  '',
  `> Independent Medicare and ACA calculators and plain-language guides. Operator: ${site.ownerName}, ${site.location}.`,
  '',
  `Every figure is stored with its year, an official source URL, and the date it was checked (${dataVerifiedOn}). The site is not affiliated with CMS, SSA, Medicare.gov, or the IRS. Calculator inputs stay in the browser.`,
  '',
  '## Calculators',
  '',
  ...calculators.map(([label, href]) => `- [${label}](${site.siteUrl}${href})`),
  '',
  '## Guides',
  '',
  ...guides.map((guide) => {
    const label = resolveGuide(guide.h1, figureYears.current).replace(/\s+/g, ' ').trim();
    return `- [${label}](${site.siteUrl}/guides/${guide.slug})`;
  }),
  '',
  '## Site pages',
  '',
  `- [About](${site.siteUrl}/about)`,
  `- [Contact](${site.siteUrl}/contact)`,
  `- [Methodology](${site.siteUrl}/methodology)`,
  `- [Glossary](${site.siteUrl}/glossary)`,
  `- [Sitemap](${site.siteUrl}/sitemap-page)`,
  '',
  '## Source policy',
  '',
  '- Official sources are linked on the page that uses the figure.',
  '- Figures are updated by editing the data layer and redeploying; the checked date changes with them.',
  '- The site does not publish search volumes, testimonials, or invented reviewer credentials.',
  '',
];

const output = path.join(root, 'public/llms.txt');
fs.mkdirSync(path.dirname(output), { recursive: true });
fs.writeFileSync(output, lines.join('\n'), 'utf8');
console.log(`generate:llms wrote ${path.relative(root, output).replaceAll('\\', '/')}`);
