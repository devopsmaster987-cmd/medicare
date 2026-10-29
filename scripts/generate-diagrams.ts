import fs from 'node:fs';
import path from 'node:path';
import {
  diagramDarkPalette,
  diagramLightPalette,
  diagramSlugs,
  heroDiagramSvg,
} from '../lib/diagrams';
import { irmaaBracketsFor, partB2026 } from '../data/medicare-part-b';
import { partBPenaltyCalculator } from '../lib/formulas/part-b-penalty';
import { formatMoney } from '../lib/utils';
import { root } from './file-walk';

const labels = {
  affordabilityThreshold: 'Affordability threshold (share of income)',
  employeePremium: 'Employee-only premium',
  irsLine: 'IRS affordability line',
  ladderLevels: ['QMB', 'SLMB', 'QI', 'Extra Help'],
  ladderBand: 'Income falls in this band',
  ladderLow: 'Lowest income',
  ladderHigh: 'Higher income',
  penaltyBaseline: `${formatMoney(partB2026.standardPremium.amount)} standard premium`,
  penaltySteps: [1, 2, 3, 4, 5].map(
    (years) => formatMoney(partBPenaltyCalculator({ monthsDelayed: years * 12 }).monthlyPenalty),
  ),
  irmaaLowLabel: 'Income below the threshold',
  irmaaHighLabel: 'Income above the threshold',
  irmaaCliffFlag: 'Cliff',
  irmaaHeadroom: 'Headroom left',
  irmaaYAxis: `Part B + Part D premium, from ${formatMoney(irmaaBracketsFor('single')[0].partBTotal)}`,
  forkLeft: 'Medicare',
  forkRight: 'Marketplace',
  forkLeftSub: 'Part A, Part B, and Part D',
  forkRightSub: 'Marketplace plan with premium tax credit',
  forkStart: 'You turn 65',
};

async function main(): Promise<void> {
  const outputDirectory = path.join(root, 'public', 'diagrams');
  fs.mkdirSync(outputDirectory, { recursive: true });
  for (const slug of diagramSlugs) {
    const light = heroDiagramSvg(slug, diagramLightPalette, labels);
    const dark = heroDiagramSvg(slug, diagramDarkPalette, labels);
    fs.writeFileSync(path.join(outputDirectory, `${slug}.svg`), light, 'utf8');
    fs.writeFileSync(path.join(outputDirectory, `${slug}-dark.svg`), dark, 'utf8');
  }
  console.log(`generate:diagrams wrote ${diagramSlugs.length * 2} files to public/diagrams`);
}

main().catch((error: unknown) => {
  console.error(error);
  process.exit(1);
});
