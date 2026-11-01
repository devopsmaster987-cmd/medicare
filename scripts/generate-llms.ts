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
  {
    label: 'Employer coverage affordability',
    href: '/calculators/employer-coverage-affordability',
    summary: 'Tests the employee-only premium against the IRS affordability percentage and the family premium rule.',
  },
  {
    label: 'Medicare Savings Program and Extra Help',
    href: '/calculators/medicare-savings-program-extra-help',
    summary: 'Compares income and countable assets with the federal QMB, SLMB, QI, and Extra Help limits.',
  },
  {
    label: 'Part B late enrollment penalty',
    href: '/calculators/part-b-late-enrollment-penalty',
    summary: 'Shows the monthly penalty, annual cost, and the 10-year and 20-year totals.',
  },
  {
    label: 'IRMAA cliff checker',
    href: '/calculators/irmaa-cliff-checker',
    summary: 'Finds the IRMAA tier, Part B and Part D surcharge, next cliff, and Roth-conversion headroom.',
  },
  {
    label: 'Medicare vs ACA',
    href: '/calculators/medicare-vs-aca',
    summary: 'Follows the 20-employee rule, premium-free Part A, subsidy consequences, and HSA timing.',
  },
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
  ...calculators.map(
    (calculator) =>
      `- [${calculator.label}](${withTrailingSlash(`${site.siteUrl}${calculator.href}`)}): ${calculator.summary}`,
  ),
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
  `- [Link to us and citation text](${site.siteUrl}/link-to-us/)`,
  `- [Press and media kit](${site.siteUrl}/press/)`,
  `- [Medicare and ACA data](${site.siteUrl}/data/)`,
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
  '## Machine-readable files',
  '',
  `- [XML sitemap](${site.siteUrl}/sitemap.xml)`,
  `- [RSS feed for guides](${site.siteUrl}/feed.xml)`,
  `- [Full text summary for answer engines](${site.siteUrl}/llms-full.txt)`,
  `- [Source-linked Medicare and ACA figures as JSON](${site.siteUrl}/data/medicare-figures-${figureYears.current}.json)`,
  `- [Human-readable sitemap](${site.siteUrl}/sitemap-page/)`,
  '',
  '## How to cite this site',
  '',
  `Suggested citation: ${site.siteName}. "Page title." ${site.siteUrl}. Figures checked ${dataVerifiedOn}.`,
  '',
  'Each page states the year of its figures, the official source URL, and the date the figure was checked. Prefer the page that directly answers the question, and cite the official source alongside it.',
  '',
  '## Verification and corrections',
  '',
  `- [Verification log](${site.siteUrl}/verification-log/): hand-worked examples for each formula.`,
  `- [Methodology](${site.siteUrl}/methodology/): boundary tests, update schedule, and known limits.`,
  `- [Corrections](${site.siteUrl}/corrections/): how to report an error and the public change log.`,
  '',
];

const output = path.join(root, 'public/llms.txt');
fs.mkdirSync(path.dirname(output), { recursive: true });
fs.writeFileSync(output, lines.join('\n'), 'utf8');
console.log(`generate:llms wrote ${path.relative(root, output).replaceAll('\\', '/')}`);

const fullLines = [
  `# ${site.siteName} full text index`,
  '',
  `> Independent Medicare and ACA calculators and plain-language guides. Operator: ${site.ownerName}, ${site.location}. Figures checked ${dataVerifiedOn}.`,
  '',
  '## Calculators',
  '',
  ...calculators.map((calculator) =>
    [
      `### ${calculator.label}`,
      calculator.summary,
      `URL: ${withTrailingSlash(`${site.siteUrl}${calculator.href}`)}`,
      '',
    ].join('\n'),
  ),
  '## Guides',
  '',
  ...guides.map((guide) => {
    const title = resolveGuide(guide.h1, figureYears.current).replace(/\s+/g, ' ').trim();
    const summary = resolveGuide(guide.summary, figureYears.current).replace(/\s+/g, ' ').trim();
    const description = resolveGuide(guide.description, figureYears.current)
      .replace(/\s+/g, ' ')
      .trim();
    return [
      `### ${title}`,
      `URL: ${withTrailingSlash(`${site.siteUrl}/guides/${guide.slug}/`)}`,
      `Summary: ${summary}`,
      `Answer: ${description}`,
      `Last updated: ${guide.updatedOn}`,
      '',
    ].join('\n');
  }),
  '## Site pages',
  '',
  `- About: ${site.siteUrl}/about/`,
  `- Contact: ${site.siteUrl}/contact/`,
  `- Methodology: ${site.siteUrl}/methodology/`,
  `- Verification log: ${site.siteUrl}/verification-log/`,
  `- Editorial policy: ${site.siteUrl}/editorial-policy/`,
  `- Corrections: ${site.siteUrl}/corrections/`,
  `- Glossary: ${site.siteUrl}/glossary/`,
  `- Link to us: ${site.siteUrl}/link-to-us/`,
  `- Press and media kit: ${site.siteUrl}/press/`,
  `- Medicare and ACA data: ${site.siteUrl}/data/`,
  `- Source-linked JSON: ${site.siteUrl}/data/medicare-figures-${figureYears.current}.json`,
  '',
];

const fullOutput = path.join(root, 'public/llms-full.txt');
fs.writeFileSync(fullOutput, fullLines.join('\n'), 'utf8');
console.log(`generate:llms wrote ${path.relative(root, fullOutput).replaceAll('\\', '/')}`);
