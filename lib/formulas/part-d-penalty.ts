import { partD2026 } from '@/data/medicare-part-d';
import { partDPenalty } from '@/data/penalties';
import { isFiniteNonNegative, roundMoney } from './shared';

export type PartDPenaltyInput = {
  monthsWithoutCoverage: number;
  basePremium?: number;
  planPremium?: number;
  creditableCoverageConfirmed?: boolean;
  gapUnder63Days?: boolean;
};

export type PartDPenaltyResult = {
  year: number;
  monthsWithoutCoverage: number;
  monthsCounted: number;
  monthsExcluded: number;
  penaltyRate: number;
  basePremium: number;
  monthlyPenalty: number;
  annualPenalty: number;
  tenYearPenalty: number;
  twentyYearPenalty: number;
  planPremium: number | null;
  totalMonthlyWithPlan: number | null;
  totalAnnualWithPlan: number | null;
  creditableCoverageStatus: 'confirmed' | 'not-confirmed' | 'unknown';
  shortGapExcluded: boolean;
  canBeReviewed: boolean;
  note: string;
  roundingNote: string;
};

function roundToDime(value: number): number {
  return Math.round((value + Number.EPSILON) * 10) / 10;
}

export function partDPenaltyCalculator(input: PartDPenaltyInput): PartDPenaltyResult {
  if (!isFiniteNonNegative(input.monthsWithoutCoverage) || !Number.isInteger(input.monthsWithoutCoverage)) {
    throw new Error('Months without coverage must be a whole number, zero or greater.');
  }
  const basePremium = input.basePremium ?? partD2026.baseBeneficiaryPremium.amount;
  if (!isFiniteNonNegative(basePremium)) {
    throw new Error('Base premium must be zero or greater.');
  }
  if (input.planPremium !== undefined && !isFiniteNonNegative(input.planPremium)) {
    throw new Error('Plan premium must be zero or greater.');
  }

  const creditableCoverageConfirmed = input.creditableCoverageConfirmed === true;
  const shortGapExcluded = input.gapUnder63Days === true;
  const monthsCounted =
    creditableCoverageConfirmed || shortGapExcluded ? 0 : input.monthsWithoutCoverage;
  const monthsExcluded = input.monthsWithoutCoverage - monthsCounted;
  const penaltyRate = partDPenalty.ratePerUncoveredMonth.rate * monthsCounted;
  const monthlyPenalty = roundToDime(basePremium * penaltyRate);
  const annualPenalty = roundToDime(monthlyPenalty * 12);
  const planPremium = input.planPremium ?? null;
  const totalMonthlyWithPlan =
    planPremium === null ? null : roundMoney(planPremium + monthlyPenalty);

  const creditableCoverageStatus =
    input.creditableCoverageConfirmed === true
      ? 'confirmed'
      : input.creditableCoverageConfirmed === false
        ? 'not-confirmed'
        : 'unknown';

  let note =
    'The Part D late enrollment penalty is 1% of the national base beneficiary premium for each full month without creditable drug coverage. It is generally permanent while you have Part D.';
  if (creditableCoverageConfirmed) {
    note =
      'You reported confirmed creditable drug coverage for the gap, so those months are not counted here. Keep the plan notice with the exact coverage dates. If the notice does not cover the whole gap, the remaining months can still count.';
  } else if (shortGapExcluded) {
    note =
      'You reported a continuous gap shorter than 63 days. The Part D penalty generally starts with a continuous gap of 63 days or more, so this estimate adds no penalty. Keep the exact coverage dates in case the plan or Medicare counts them differently.';
  } else if (creditableCoverageStatus === 'unknown') {
    note =
      'Creditable drug coverage is not confirmed. The months are counted here as a planning estimate. Ask the plan for its written creditable coverage notice before you rely on a zero penalty.';
  }

  return {
    year: partD2026.year,
    monthsWithoutCoverage: input.monthsWithoutCoverage,
    monthsCounted,
    monthsExcluded,
    penaltyRate,
    basePremium,
    monthlyPenalty,
    annualPenalty,
    tenYearPenalty: roundMoney(annualPenalty * 10),
    twentyYearPenalty: roundMoney(annualPenalty * 20),
    planPremium,
    totalMonthlyWithPlan,
    totalAnnualWithPlan:
      totalMonthlyWithPlan === null ? null : roundMoney(totalMonthlyWithPlan * 12),
    creditableCoverageStatus,
    shortGapExcluded,
    canBeReviewed: creditableCoverageConfirmed,
    note,
    roundingNote:
      'Medicare rounds the monthly Part D penalty to the nearest 10 cents. That is why the unrounded multiplication can differ by a few cents from the amount shown.',
  };
}
