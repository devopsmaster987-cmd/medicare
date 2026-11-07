import type { EmployerAffordabilityInput } from './formulas/employer-affordability';
import type { EnrollmentDatesInput } from './formulas/enrollment-dates';
import type { IrmaaInput } from './formulas/irmaa';
import type { MedicarePremiumInput } from './formulas/medicare-premium';
import type { MedicareVsAcaInput } from './formulas/medicare-vs-aca';
import type { MspInput } from './formulas/msp-eligibility';
import type { PartAPremiumInput } from './formulas/part-a-premium';
import type { PartBPenaltyInput } from './formulas/part-b-penalty';
import type { PartDPenaltyInput } from './formulas/part-d-penalty';

type ParseResult<T> = { success: true; data: T } | { success: false };

const pass = <T>(data: T): ParseResult<T> => ({ success: true, data });
const fail = <T>(): ParseResult<T> => ({ success: false });

function isMoney(value: unknown): value is number {
  return typeof value === 'number' && Number.isFinite(value) && value >= 0;
}

function isIntegerInRange(value: unknown, min: number, max: number): value is number {
  return typeof value === 'number' && Number.isInteger(value) && value >= min && value <= max;
}

function isOptionalBoolean(value: unknown): boolean {
  return value === undefined || typeof value === 'boolean';
}

function isOptionalMoney(value: unknown): boolean {
  return value === undefined || isMoney(value);
}

function isOneOf<T extends string>(value: unknown, options: readonly T[]): value is T {
  return typeof value === 'string' && options.includes(value as T);
}

const payFrequencies = ['weekly', 'biweekly', 'semimonthly', 'monthly', 'annual'] as const;
const filingStatuses = ['single', 'marriedJoint', 'marriedSeparate'] as const;
const coverageTypes = ['active', 'retiree', 'cobra', 'none'] as const;

export const employerAffordabilitySchema = {
  safeParse(input: unknown): ParseResult<EmployerAffordabilityInput> {
    const value = input as Partial<EmployerAffordabilityInput>;
    if (!isMoney(value.householdIncome)) return fail();
    if (!isMoney(value.employeeOnlyPremium)) return fail();
    if (!isOptionalMoney(value.familyPremium)) return fail();
    if (!isOneOf(value.payFrequency, payFrequencies)) return fail();
    if (!isOptionalBoolean(value.planMeetsMinimumValue)) return fail();
    return pass(value as EmployerAffordabilityInput);
  },
};

export const mspEligibilitySchema = {
  safeParse(input: unknown): ParseResult<MspInput> {
    const value = input as Partial<MspInput>;
    if (typeof value.stateAbbr !== 'string' || value.stateAbbr.length !== 2) return fail();
    if (!isIntegerInRange(value.householdSize, 1, 12)) return fail();
    if (!isMoney(value.monthlyIncome)) return fail();
    if (!isMoney(value.countableAssets)) return fail();
    return pass(value as MspInput);
  },
};

export const partBPenaltySchema = {
  safeParse(input: unknown): ParseResult<PartBPenaltyInput> {
    const value = input as Partial<PartBPenaltyInput>;
    if (!isIntegerInRange(value.monthsDelayed, 0, 600)) return fail();
    if (!isOptionalMoney(value.standardPremium)) return fail();
    if (!isOptionalBoolean(value.hadCreditableCoverage)) return fail();
    if (!isOptionalBoolean(value.sepEligible)) return fail();
    if (!isOptionalBoolean(value.exceptionApplies)) return fail();
    return pass(value as PartBPenaltyInput);
  },
};

export const partDPenaltySchema = {
  safeParse(input: unknown): ParseResult<PartDPenaltyInput> {
    const value = input as Partial<PartDPenaltyInput>;
    if (!isIntegerInRange(value.monthsWithoutCoverage, 0, 600)) return fail();
    if (!isOptionalMoney(value.basePremium)) return fail();
    if (!isOptionalMoney(value.planPremium)) return fail();
    if (!isOptionalBoolean(value.creditableCoverageConfirmed)) return fail();
    if (!isOptionalBoolean(value.gapUnder63Days)) return fail();
    return pass(value as PartDPenaltyInput);
  },
};

export const irmaaSchema = {
  safeParse(input: unknown): ParseResult<IrmaaInput> {
    const value = input as Partial<IrmaaInput>;
    if (!isOneOf(value.filingStatus, filingStatuses)) return fail();
    if (!isMoney(value.magiTwoYearsBack)) return fail();
    if (!isOptionalMoney(value.projectedMagi)) return fail();
    return pass(value as IrmaaInput);
  },
};

export const medicareVsAcaSchema = {
  safeParse(input: unknown): ParseResult<MedicareVsAcaInput> {
    const value = input as Partial<MedicareVsAcaInput>;
    if (!isIntegerInRange(value.age, 0, 120)) return fail();
    if (value.employerSize !== undefined && !isIntegerInRange(value.employerSize, 0, 1000000)) {
      return fail();
    }
    if (!isOneOf(value.coverageType, coverageTypes)) return fail();
    if (!isOptionalBoolean(value.creditableCoverage)) return fail();
    if (!isOptionalBoolean(value.hasHsa)) return fail();
    if (value.workCredits !== undefined && !isIntegerInRange(value.workCredits, 0, 80)) {
      return fail();
    }
    if (!isOptionalBoolean(value.premiumFreePartA)) return fail();
    return pass(value as MedicareVsAcaInput);
  },
};

export const partAPremiumSchema = {
  safeParse(input: unknown): ParseResult<PartAPremiumInput> {
    const value = input as Partial<PartAPremiumInput>;
    if (typeof value.ownQuarters !== 'number' || !Number.isFinite(value.ownQuarters)) return fail();
    if (value.ownQuarters < 0 || value.ownQuarters > 40) return fail();
    if (value.spouseQuarters !== undefined) {
      if (!Number.isFinite(value.spouseQuarters)) return fail();
      if (value.spouseQuarters < 0 || value.spouseQuarters > 40) return fail();
    }
    if (value.yearsDelayed !== undefined) {
      if (!Number.isFinite(value.yearsDelayed)) return fail();
      if (value.yearsDelayed < 0 || value.yearsDelayed > 60) return fail();
    }
    if (value.married !== undefined && typeof value.married !== 'boolean') return fail();
    return pass(value as PartAPremiumInput);
  },
};

export const enrollmentDatesSchema = {
  safeParse(input: unknown): ParseResult<EnrollmentDatesInput> {
    const value = input as Partial<EnrollmentDatesInput>;
    if (!Number.isInteger(value.birthMonth) || (value.birthMonth ?? 0) < 1) return fail();
    if ((value.birthMonth ?? 0) > 12) return fail();
    if (!Number.isInteger(value.birthYear)) return fail();
    if ((value.birthYear ?? 0) < 1900 || (value.birthYear ?? 0) > 2100) return fail();
    if (
      value.situation !== undefined &&
      !isOneOf(value.situation, [
        'not-yet-eligible',
        'within-iep',
        'working-employer-coverage',
        'missed-iep',
      ])
    ) {
      return fail();
    }
    if (
      value.coverageEndMonth !== undefined &&
      !/^\d{4}-(0[1-9]|1[0-2])$/.test(value.coverageEndMonth)
    ) {
      return fail();
    }
    return pass(value as EnrollmentDatesInput);
  },
};

export const medicarePremiumSchema = {
  safeParse(input: unknown): ParseResult<MedicarePremiumInput> {
    const value = input as Partial<MedicarePremiumInput>;
    if (!isOneOf(value.filingStatus, filingStatuses)) return fail();
    if (!isMoney(value.magiTwoYearsBack)) return fail();
    if (value.ownQuarters !== undefined) {
      if (!Number.isFinite(value.ownQuarters)) return fail();
      if (value.ownQuarters < 0 || value.ownQuarters > 40) return fail();
    }
    if (value.spouseQuarters !== undefined) {
      if (!Number.isFinite(value.spouseQuarters)) return fail();
      if (value.spouseQuarters < 0 || value.spouseQuarters > 40) return fail();
    }
    if (value.partDPlanPremium !== undefined && !isMoney(value.partDPlanPremium)) return fail();
    if (value.partBPenaltyMonths !== undefined) {
      if (!isIntegerInRange(value.partBPenaltyMonths, 0, 600)) return fail();
    }
    if (value.partDPenaltyMonths !== undefined) {
      if (!isIntegerInRange(value.partDPenaltyMonths, 0, 600)) return fail();
    }
    if (value.married !== undefined && typeof value.married !== 'boolean') return fail();
    if (value.bothEnrolled !== undefined && typeof value.bothEnrolled !== 'boolean') return fail();
    if (value.partDEnrolled !== undefined && typeof value.partDEnrolled !== 'boolean') return fail();
    return pass(value as MedicarePremiumInput);
  },
};

export function parseMoneyInput(value: string): number | null {
  const cleaned = value.replace(/[^0-9.]/g, '');
  if (cleaned === '' || cleaned === '.') return null;
  const parsed = Number(cleaned);
  return Number.isFinite(parsed) ? parsed : null;
}

export function parseOptionalMoneyInput(value: string): number | undefined {
  if (value.trim() === '') return undefined;
  return parseMoneyInput(value) ?? undefined;
}
