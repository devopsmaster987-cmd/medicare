import type { EmployerAffordabilityInput } from './formulas/employer-affordability';
import type { IrmaaInput } from './formulas/irmaa';
import type { MedicareVsAcaInput } from './formulas/medicare-vs-aca';
import type { MspInput } from './formulas/msp-eligibility';
import type { PartBPenaltyInput } from './formulas/part-b-penalty';

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
