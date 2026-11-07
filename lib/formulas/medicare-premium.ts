import { partA2026 } from '@/data/medicare-part-a';
import type { FilingStatus } from '@/data/types';
import { irmaaCalculator, type IrmaaResult } from './irmaa';
import { partAPremiumCalculator } from './part-a-premium';
import { partBPenaltyCalculator } from './part-b-penalty';
import { partDPenaltyCalculator } from './part-d-penalty';
import { isFiniteNonNegative, roundMoney } from './shared';

export type MedicarePremiumInput = {
  filingStatus: FilingStatus;
  magiTwoYearsBack: number;
  ownQuarters?: number;
  married?: boolean;
  spouseQuarters?: number;
  partDEnrolled?: boolean;
  partDPlanPremium?: number;
  bothEnrolled?: boolean;
  partBPenaltyMonths?: number;
  partDPenaltyMonths?: number;
};

export type MedicarePremiumResult = {
  year: number;
  taxYearBasis: number;
  persons: number;
  partA: {
    tier: string;
    monthlyPremium: number;
    annualPremium: number;
  };
  partB: {
    standardPremium: number;
    monthlyWithIrmaa: number;
    irmaaAdjustment: number;
    monthlyPenalty: number;
    monthlyPerPerson: number;
    monthlyTotal: number;
    annualTotal: number;
  };
  partD: {
    enrolled: boolean;
    planPremium: number;
    irmaaAdjustment: number;
    monthlyPenalty: number;
    monthlyPerPerson: number;
    monthlyTotal: number;
    annualTotal: number;
  };
  totalMonthly: number;
  totalAnnual: number;
  irmaa: IrmaaResult;
  headroomToNextBracket: number | null;
  note: string;
};

export function medicarePremiumCalculator(input: MedicarePremiumInput): MedicarePremiumResult {
  if (!isFiniteNonNegative(input.magiTwoYearsBack)) {
    throw new Error('MAGI must be zero or greater.');
  }

  const irmaa = irmaaCalculator({
    filingStatus: input.filingStatus,
    magiTwoYearsBack: input.magiTwoYearsBack,
  });

  const partA = partAPremiumCalculator({
    ownQuarters: input.ownQuarters ?? 40,
    married: input.married,
    spouseQuarters: input.spouseQuarters,
  });

  const persons =
    input.bothEnrolled === true && input.filingStatus === 'marriedJoint' ? 2 : 1;

  const partBPenalty =
    (input.partBPenaltyMonths ?? 0) > 0
      ? partBPenaltyCalculator({ monthsDelayed: input.partBPenaltyMonths ?? 0 })
      : null;
  const partBPenaltyMonthly = partBPenalty?.monthlyPenalty ?? 0;

  const partBPerPerson = roundMoney(irmaa.monthlyPartB + partBPenaltyMonthly);
  const partBMonthlyTotal = roundMoney(partBPerPerson * persons);

  const planPremium = input.partDPlanPremium ?? 0;
  const partDEnrolled = input.partDEnrolled !== false;
  const partDPenalty =
    partDEnrolled && (input.partDPenaltyMonths ?? 0) > 0
      ? partDPenaltyCalculator({ monthsWithoutCoverage: input.partDPenaltyMonths ?? 0 })
      : null;
  const partDPenaltyMonthly = partDPenalty?.monthlyPenalty ?? 0;

  const partDPerPerson = partDEnrolled
    ? roundMoney(planPremium + irmaa.monthlyPartD + partDPenaltyMonthly)
    : 0;
  const partDMonthlyTotal = roundMoney(partDPerPerson * persons);

  const partAMonthlyTotal = roundMoney(partA.monthlyPremium * persons);
  const totalMonthly = roundMoney(partAMonthlyTotal + partBMonthlyTotal + partDMonthlyTotal);

  const note = [
    'Part A follows the 40-quarter rule; Part B includes any IRMAA surcharge from your income two years ago.',
    partDEnrolled
      ? 'Part D adds your plan premium, any IRMAA surcharge, and any late enrollment penalty.'
      : 'Part D is not included. Most people who want drug coverage join a Part D or Medicare Advantage plan.',
    persons === 2
      ? 'This is a two-person household view: each enrolled spouse pays Part B and Part D separately.'
      : 'This is a one-person view.',
  ].join(' ');

  return {
    year: partA2026.year,
    taxYearBasis: irmaa.taxYearBasis,
    persons,
    partA: {
      tier: partA.tierLabel,
      monthlyPremium: partAMonthlyTotal,
      annualPremium: roundMoney(partA.annualPremium * persons),
    },
    partB: {
      standardPremium: irmaa.monthlyPartB - irmaa.tier.partBAdjustment,
      monthlyWithIrmaa: irmaa.monthlyPartB,
      irmaaAdjustment: irmaa.tier.partBAdjustment,
      monthlyPenalty: roundMoney(partBPenaltyMonthly * persons),
      monthlyPerPerson: partBPerPerson,
      monthlyTotal: partBMonthlyTotal,
      annualTotal: roundMoney(partBMonthlyTotal * 12),
    },
    partD: {
      enrolled: partDEnrolled,
      planPremium: roundMoney(planPremium * persons),
      irmaaAdjustment: roundMoney(irmaa.tier.partDAdjustment * persons),
      monthlyPenalty: roundMoney(partDPenaltyMonthly * persons),
      monthlyPerPerson: partDPerPerson,
      monthlyTotal: partDMonthlyTotal,
      annualTotal: roundMoney(partDMonthlyTotal * 12),
    },
    totalMonthly,
    totalAnnual: roundMoney(totalMonthly * 12),
    irmaa,
    headroomToNextBracket: irmaa.headroomToNextBracket,
    note,
  };
}
