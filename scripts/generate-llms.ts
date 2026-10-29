import fs from 'node:fs';
import path from 'node:path';
import { guides, resolveGuide } from '../content/guides/meta';
import { aca2026 } from '../data/aca';
import { fplAnnual } from '../data/fpl';
import { partB2026 } from '../data/medicare-part-b';
import { partD2026 } from '../data/medicare-part-d';
import { mspPrograms } from '../data/msp';
import { site } from '../data/site';
import { dataVerifiedOn, figureYears } from '../data/verified';
import { formatMoney } from '../lib/utils';
import { root } from './file-walk';

const calculators = [
  ['Employer coverage affordability', '/calculators/employer-coverage-affordability'],
  ['Medicare Savings Program and Extra Help', '/calculators/medicare-savings-program-extra-help'],
  ['Part B late enrollment penalty', '/calculators/part-b-late-enrollment-penalty'],
  ['IRMAA cliff checker', '/calculators/irmaa-cliff-checker'],
  ['Medicare vs ACA', '/calculators/medicare-vs-aca'],
] as const;

function withTrailingSlash(url: string): string {
  return url.endsWith('/') ? url : `${url}/`;
}

const lines = [
  `# ${site.siteName}`,
  '',
  `> Independent Medicare and ACA calculators and plain-language guides. Operator: ${site.ownerName}, ${site.location}.`,
  '',
  `Every figure is stored with its year, an official source URL, and the date it was checked (${dataVerifiedOn}). The site is not affiliated with CMS, SSA, Medicare.gov, or the IRS. Calculator inputs stay in the browser.`,
  '',
  '## Calculators',
  '',
  ...calculators.map(([label, href]) => `- [${label}](${withTrailingSlash(`${site.siteUrl}${href}`)})`),
  '',
  '## Guides',
  '',
  ...guides.map((guide) => {
    const label = resolveGuide(guide.h1, figureYears.current).replace(/\s+/g, ' ').trim();
    return `- [${label}](${withTrailingSlash(`${site.siteUrl}/guides/${guide.slug}/`)})`;
  }),
  '',
  '## Site pages',
  '',
  `- [About](${site.siteUrl}/about/)`,
  `- [Contact](${site.siteUrl}/contact/)`,
  `- [Methodology](${site.siteUrl}/methodology/)`,
  `- [Glossary](${site.siteUrl}/glossary/)`,
  `- [Sitemap](${site.siteUrl}/sitemap-page/)`,
  `- [Corrections](${site.siteUrl}/corrections/)`,
  '',
  '## Key verified facts',
  '',
  `- ${figureYears.current} Part B standard premium: ${formatMoney(partB2026.standardPremium.amount)} per month. Deductible: ${formatMoney(partB2026.deductible.amount)}.`,
  `- ${figureYears.current} IRMAA first threshold: ${formatMoney(partB2026.irmaa.single[0].max ?? 0)} for a single filer and ${formatMoney(partB2026.irmaa.marriedJoint[0].max ?? 0)} for married filing jointly. The first tier adds ${formatMoney(partB2026.irmaa.single[1].partBAdjustment)} to Part B and ${formatMoney(partB2026.irmaa.single[1].partDAdjustment)} to Part D.`,
  `- ${figureYears.current} Part D base beneficiary premium: ${formatMoney(partD2026.baseBeneficiaryPremium.amount)} per month. Deductible: ${formatMoney(partD2026.deductible.amount)}. Out-of-pocket cap: ${formatMoney(partD2026.outOfPocketCap.amount)}.`,
  `- ${figureYears.current} federal Medicare Savings Program: QMB ${formatMoney(mspPrograms.qmb.anchorMonthlySingle ?? 0)} single / ${formatMoney(mspPrograms.qmb.anchorMonthlyCouple ?? 0)} couple; SLMB ${formatMoney(mspPrograms.slmb.anchorMonthlySingle ?? 0)} / ${formatMoney(mspPrograms.slmb.anchorMonthlyCouple ?? 0)}; QI ${formatMoney(mspPrograms.qi.anchorMonthlySingle ?? 0)} / ${formatMoney(mspPrograms.qi.anchorMonthlyCouple ?? 0)}.`,
  `- ${figureYears.current} Extra Help income limit: ${formatMoney(23_940)} single / ${formatMoney(32_460)} couple. Resource limit: ${formatMoney(mspPrograms.extraHelp.resourceSingle.amount)} / ${formatMoney(mspPrograms.extraHelp.resourceCouple.amount)} including the burial exclusion.`,
  `- ${figureYears.current} federal poverty level for the 48 contiguous states and DC: ${formatMoney(fplAnnual(figureYears.current, 1))} for one person and ${formatMoney(fplAnnual(figureYears.current, 2))} for two.`,
  `- ${figureYears.current} ACA affordability percentage: ${(aca2026.affordabilityPercentage.rate * 100).toFixed(2)}%. Self-only out-of-pocket maximum: ${formatMoney(aca2026.outOfPocketMaxSelfOnly.amount)}; family: ${formatMoney(aca2026.outOfPocketMaxFamily.amount)}.`,
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
