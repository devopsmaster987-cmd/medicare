import { irmaaBracketsFor, partB2026, type IrmaaBracket } from '@/data/medicare-part-b';
import type { FilingStatus } from '@/data/types';
import { isFiniteNonNegative, roundMoney } from './shared';

export type IrmaaInput = {
  filingStatus: FilingStatus;
  magiTwoYearsBack: number;
  projectedMagi?: number;
};

export type IrmaaTierResult = {
  index: number;
  min: number;
  max: number | null;
  partBAdjustment: number;
  partDAdjustment: number;
  partBTotal: number;
  monthlySurcharge: number;
  annualSurcharge: number;
};

export type IrmaaResult = {
  year: number;
  taxYearBasis: number;
  lookbackYears: number;
  filingStatus: FilingStatus;
  magi: number;
  tier: IrmaaTierResult;
  nextTier: IrmaaTierResult | null;
  headroomToNextBracket: number | null;
  monthlyPartB: number;
  monthlyPartD: number;
  monthlySurcharge: number;
  annualSurcharge: number;
  annualPartB: number;
  projected: {
    magi: number;
    tier: IrmaaTierResult;
    monthlySurcharge: number;
    annualSurcharge: number;
    rothConversionHeadroom: number;
  } | null;
  marriedCouple: {
    bothSpousesMayPay: boolean;
    householdMonthlyPartB: number;
    householdMonthlyPartD: number;
    householdMonthlySurcharge: number;
    householdAnnualSurcharge: number;
  };
  twoYearLookahead: Array<{ incomeYear: number; premiumYear: number }>;
  note: string;
};

function tierFromBracket(bracket: IrmaaBracket, index: number): IrmaaTierResult {
  const monthlySurcharge = roundMoney(bracket.partBAdjustment + bracket.partDAdjustment);
  return {
    index,
    min: bracket.min,
    max: bracket.max,
    partBAdjustment: bracket.partBAdjustment,
    partDAdjustment: bracket.partDAdjustment,
    partBTotal: bracket.partBTotal,
    monthlySurcharge,
    annualSurcharge: roundMoney(monthlySurcharge * 12),
  };
}

function findTier(brackets: IrmaaBracket[], magi: number): { tier: IrmaaTierResult; index: number } {
  const index = brackets.findIndex(
    (bracket) => magi >= bracket.min && (bracket.max === null || magi <= bracket.max),
  );
  const safeIndex = index === -1 ? brackets.length - 1 : index;
  return { tier: tierFromBracket(brackets[safeIndex], safeIndex), index: safeIndex };
}

export function irmaaCalculator(input: IrmaaInput): IrmaaResult {
  if (!isFiniteNonNegative(input.magiTwoYearsBack)) {
    throw new Error('MAGI must be zero or greater.');
  }
  if (input.projectedMagi !== undefined && !isFiniteNonNegative(input.projectedMagi)) {
    throw new Error('Projected MAGI must be zero or greater.');
  }

  const brackets = irmaaBracketsFor(input.filingStatus);
  const { tier, index } = findTier(brackets, input.magiTwoYearsBack);
  const nextBracket = brackets[index + 1];
  const nextTier = nextBracket ? tierFromBracket(nextBracket, index + 1) : null;
  const headroomToNextBracket =
    nextBracket && nextBracket.min > 0
      ? roundMoney(nextBracket.min - input.magiTwoYearsBack)
      : null;

  let projected: IrmaaResult['projected'] = null;
  if (input.projectedMagi !== undefined) {
    const projectedTier = findTier(brackets, input.projectedMagi);
    const projectedNext = brackets[projectedTier.index + 1];
    const rothConversionHeadroom = projectedNext
      ? Math.max(0, roundMoney(projectedNext.min - input.projectedMagi))
      : 0;
    projected = {
      magi: input.projectedMagi,
      tier: projectedTier.tier,
      monthlySurcharge: projectedTier.tier.monthlySurcharge,
      annualSurcharge: projectedTier.tier.annualSurcharge,
      rothConversionHeadroom,
    };
  }

  const bothSpousesMayPay = input.filingStatus === 'marriedJoint';
  const multiplier = bothSpousesMayPay ? 2 : 1;
  const monthlyPartB = roundMoney(tier.partBTotal);
  const monthlyPartD = roundMoney(tier.partDAdjustment);

  return {
    year: partB2026.year,
    taxYearBasis: partB2026.year - partB2026.lookbackYears,
    lookbackYears: partB2026.lookbackYears,
    filingStatus: input.filingStatus,
    magi: input.magiTwoYearsBack,
    tier,
    nextTier,
    headroomToNextBracket,
    monthlyPartB,
    monthlyPartD,
    monthlySurcharge: tier.monthlySurcharge,
    annualSurcharge: tier.annualSurcharge,
    annualPartB: roundMoney(monthlyPartB * 12),
    projected,
    marriedCouple: {
      bothSpousesMayPay,
      householdMonthlyPartB: roundMoney(monthlyPartB * multiplier),
      householdMonthlyPartD: roundMoney(monthlyPartD * multiplier),
      householdMonthlySurcharge: roundMoney(tier.monthlySurcharge * multiplier),
      householdAnnualSurcharge: roundMoney(tier.annualSurcharge * multiplier),
    },
    twoYearLookahead: [
      { incomeYear: partB2026.year - 2, premiumYear: partB2026.year },
      { incomeYear: partB2026.year - 1, premiumYear: partB2026.year + 1 },
      { incomeYear: partB2026.year, premiumYear: partB2026.year + 2 },
    ],
    note: 'Part D IRMAA is added to the Part D plan premium and is usually deducted from Social Security or paid to Medicare separately from the plan premium.',
  };
}
