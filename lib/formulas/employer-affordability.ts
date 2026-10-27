import { aca2026 } from '@/data/aca';
import { irs2026 } from '@/data/irs';
import type { PayFrequency } from '@/data/types';
import { isFiniteNonNegative, roundMoney } from './shared';

export type EmployerAffordabilityInput = {
  householdIncome: number;
  employeeOnlyPremium: number;
  familyPremium?: number;
  payFrequency: PayFrequency;
  planMeetsMinimumValue?: boolean;
};

export type EmployerAffordabilityResult = {
  year: number;
  affordabilityRate: number;
  annualEmployeeOnlyPremium: number;
  annualFamilyPremium: number | null;
  annualThreshold: number;
  employeeCoverageAffordable: boolean;
  familyCoverageAffordable: boolean | null;
  employeeHeadroom: number;
  familyHeadroom: number | null;
  familyMembersMayQualifyForHelp: boolean;
  minimumValueStatus: 'meets' | 'does-not-meet' | 'unknown';
  subsidyEligibility: 'likely-qualify' | 'likely-none' | 'unknown';
  explanation: string;
};

export const payPeriodsPerYear: Record<PayFrequency, number> = {
  weekly: 52,
  biweekly: 26,
  semimonthly: 24,
  monthly: 12,
  annual: 1,
};

export function annualizePremium(amount: number, payFrequency: PayFrequency): number {
  return roundMoney(amount * payPeriodsPerYear[payFrequency]);
}

export function employerAffordability(
  input: EmployerAffordabilityInput,
): EmployerAffordabilityResult {
  if (!isFiniteNonNegative(input.householdIncome)) {
    throw new Error('Household income must be zero or greater.');
  }
  if (!isFiniteNonNegative(input.employeeOnlyPremium)) {
    throw new Error('Employee-only premium must be zero or greater.');
  }
  if (input.familyPremium !== undefined && !isFiniteNonNegative(input.familyPremium)) {
    throw new Error('Family premium must be zero or greater.');
  }

  const rate = irs2026.employerAffordabilityPercentage.rate;
  const annualEmployeeOnlyPremium = annualizePremium(
    input.employeeOnlyPremium,
    input.payFrequency,
  );
  const annualFamilyPremium =
    input.familyPremium === undefined
      ? null
      : annualizePremium(input.familyPremium, input.payFrequency);
  const annualThreshold = roundMoney(input.householdIncome * rate);
  const employeeCoverageAffordable = annualEmployeeOnlyPremium <= annualThreshold;
  const familyCoverageAffordable =
    annualFamilyPremium === null ? null : annualFamilyPremium <= annualThreshold;
  const minimumValueStatus =
    input.planMeetsMinimumValue === undefined
      ? 'unknown'
      : input.planMeetsMinimumValue
        ? 'meets'
        : 'does-not-meet';
  const familyMembersMayQualifyForHelp =
    !employeeCoverageAffordable || minimumValueStatus === 'does-not-meet';

  let subsidyEligibility: EmployerAffordabilityResult['subsidyEligibility'] = 'unknown';
  if (minimumValueStatus === 'unknown') {
    subsidyEligibility = 'unknown';
  } else if (!employeeCoverageAffordable || minimumValueStatus === 'does-not-meet') {
    subsidyEligibility = 'likely-qualify';
  } else {
    subsidyEligibility = 'likely-none';
  }

  const explanation = employeeCoverageAffordable
    ? `The employee-only premium is ${roundMoney(annualThreshold - annualEmployeeOnlyPremium)} below the ${aca2026.year} affordability threshold.`
    : `The employee-only premium is ${roundMoney(annualEmployeeOnlyPremium - annualThreshold)} above the ${aca2026.year} affordability threshold.`;

  return {
    year: aca2026.year,
    affordabilityRate: rate,
    annualEmployeeOnlyPremium,
    annualFamilyPremium,
    annualThreshold,
    employeeCoverageAffordable,
    familyCoverageAffordable,
    employeeHeadroom: roundMoney(annualThreshold - annualEmployeeOnlyPremium),
    familyHeadroom:
      annualFamilyPremium === null
        ? null
        : roundMoney(annualThreshold - annualFamilyPremium),
    familyMembersMayQualifyForHelp,
    minimumValueStatus,
    subsidyEligibility,
    explanation,
  };
}
