import { partB2026 } from '@/data/medicare-part-b';
import { partBPenalty } from '@/data/penalties';
import { isFiniteNonNegative, roundMoney } from './shared';

export type PartBPenaltyInput = {
  monthsDelayed: number;
  standardPremium?: number;
  hadCreditableCoverage?: boolean;
  sepEligible?: boolean;
  exceptionApplies?: boolean;
};

export type PartBPenaltyResult = {
  year: number;
  monthsDelayed: number;
  fullTwelveMonthPeriods: number;
  penaltyRate: number;
  standardPremium: number;
  monthlyPenalty: number;
  totalMonthlyPremium: number;
  annualPenalty: number;
  tenYearPenalty: number;
  twentyYearPenalty: number;
  canAvoid: boolean;
  avoidanceNote: string;
  roundingNote: string;
};

export function partBPenaltyCalculator(input: PartBPenaltyInput): PartBPenaltyResult {
  if (!isFiniteNonNegative(input.monthsDelayed)) {
    throw new Error('Months delayed must be zero or greater.');
  }
  const monthlyStandardPremium = input.standardPremium ?? partB2026.standardPremium.amount;
  if (!isFiniteNonNegative(monthlyStandardPremium)) {
    throw new Error('Standard premium must be zero or greater.');
  }

  const fullTwelveMonthPeriods = Math.floor(
    input.monthsDelayed / partBPenalty.fullPeriodMonths,
  );
  const penaltyRate = roundMoney(fullTwelveMonthPeriods * partBPenalty.ratePerFullYear.rate);
  const monthlyPenalty = roundMoney(monthlyStandardPremium * penaltyRate);
  const totalMonthlyPremium = roundMoney(monthlyStandardPremium + monthlyPenalty);
  const annualPenalty = roundMoney(monthlyPenalty * 12);
  const canAvoid = Boolean(input.sepEligible || input.exceptionApplies);

  let avoidanceNote = 'A full 12-month delay adds 10% to the standard premium for as long as you have Part B.';
  if (canAvoid) {
    avoidanceNote =
      'You may be able to avoid the penalty if you qualify for a Special Enrollment Period or an exception. Confirm with Social Security before delaying.';
  } else if (input.hadCreditableCoverage) {
    avoidanceNote =
      'Creditable coverage can help you qualify for a Special Enrollment Period, but it does not erase a delay that already happened. Confirm your dates with Social Security.';
  }

  return {
    year: partB2026.year,
    monthsDelayed: input.monthsDelayed,
    fullTwelveMonthPeriods,
    penaltyRate,
    standardPremium: monthlyStandardPremium,
    monthlyPenalty,
    totalMonthlyPremium,
    annualPenalty,
    tenYearPenalty: roundMoney(annualPenalty * 10),
    twentyYearPenalty: roundMoney(annualPenalty * 20),
    canAvoid,
    avoidanceNote,
    roundingNote:
      'Social Security may round the final premium. The official example can be a few cents higher than the unrounded math shown here.',
  };
}
