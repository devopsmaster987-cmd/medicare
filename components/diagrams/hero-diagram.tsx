import { irmaaBracketsFor, partB2026 } from '@/data/medicare-part-b';
import { sources } from '@/data/sources';
import { DiagramFigure } from '@/components/calc/diagram';
import {
  diagramCssPalette,
  heroDiagramSvg,
  type DiagramLabels,
  type DiagramSlugValue,
} from '@/lib/diagrams';
import { partBPenaltyCalculator } from '@/lib/formulas/part-b-penalty';
import { formatMoney } from '@/lib/utils';

type DiagramMeta = {
  alt: string;
  sourceUrl: string;
  sourceName: string;
};

const diagramMeta: Record<DiagramSlugValue, DiagramMeta> = {
  'employer-coverage-affordability': {
    alt: 'Bar chart comparing an employee-only premium against the IRS affordability threshold line, with the segment past the line marked as the unaffordable part.',
    sourceUrl: sources.irsRp2025_25,
    sourceName: 'IRS affordability percentage',
  },
  'medicare-savings-program-extra-help': {
    alt: 'Ladder diagram with four rungs for QMB, SLMB, QI, and Extra Help, and a marker showing one household income falling between two rungs.',
    sourceUrl: sources.medicareMsp,
    sourceName: 'Medicare.gov Medicare Savings Programs',
  },
  'part-b-late-enrollment-penalty': {
    alt: 'Staircase diagram showing the Part B monthly premium growing with each full 12-month period of delay, above a dashed baseline at the standard premium.',
    sourceUrl: sources.medicareAvoidPenalties,
    sourceName: 'Medicare.gov late enrollment penalties',
  },
  'irmaa-cliff-checker': {
    alt: 'Step chart showing Part B and Part D premiums flat, then jumping at the IRMAA cliff, with a marker dot and a measure line showing the income headroom left.',
    sourceUrl: sources.cms2026AB,
    sourceName: 'CMS Part B and IRMAA fact sheet',
  },
  'medicare-vs-aca': {
    alt: 'Fork diagram showing one path toward Medicare and one toward the Marketplace, diverging from a single decision point at age 65.',
    sourceUrl: sources.medicarePaysFirst,
    sourceName: 'Medicare.gov coordination rules',
  },
};

function labelsFor(slug: DiagramSlugValue): DiagramLabels {
  const labels: DiagramLabels = {
    affordabilityThreshold: 'Affordability threshold (share of income)',
    employeePremium: 'Employee-only premium',
    irsLine: 'IRS affordability line',
    ladderLevels: ['QMB', 'SLMB', 'QI', 'Extra Help'],
    ladderBand: 'Income falls in this band',
    ladderLow: 'Lowest income',
    ladderHigh: 'Higher income',
    penaltyBaseline: `${formatMoney(partB2026.standardPremium.amount)} standard premium`,
    penaltySteps: [1, 2, 3, 4, 5].map((years) =>
      formatMoney(partBPenaltyCalculator({ monthsDelayed: years * 12 }).monthlyPenalty),
    ),
    irmaaLowLabel: 'Income below the threshold',
    irmaaHighLabel: 'Income above the threshold',
    irmaaCliffFlag: 'Cliff',
    irmaaHeadroom: 'Headroom left',
    irmaaYAxis: 'Part B + Part D premium',
    forkLeft: 'Medicare',
    forkRight: 'Marketplace',
    forkLeftSub: 'Part A, Part B, and Part D',
    forkRightSub: 'Marketplace plan with premium tax credit',
    forkStart: 'You turn 65',
  };
  labels.irmaaYAxis = `Part B + Part D premium, from ${formatMoney(irmaaBracketsFor('single')[0].partBTotal)}`;
  return labels;
}

export function HeroDiagram({ slug }: { slug: DiagramSlugValue }) {
  const meta = diagramMeta[slug];
  const svg = heroDiagramSvg(slug, diagramCssPalette, labelsFor(slug));
  return <DiagramFigure svg={svg} alt={meta.alt} sourceName={meta.sourceName} sourceUrl={meta.sourceUrl} />;
}
