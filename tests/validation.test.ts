import { describe, expect, it } from 'vitest';
import {
  employerAffordabilitySchema,
  irmaaSchema,
  medicareVsAcaSchema,
  mspEligibilitySchema,
  parseMoneyInput,
  parseOptionalMoneyInput,
  partBPenaltySchema,
} from '@/lib/validation';

describe('input validation', () => {
  it('parses money fields', () => {
    expect(parseMoneyInput('$1,250.50')).toBe(1250.5);
    expect(parseMoneyInput('')).toBeNull();
    expect(parseMoneyInput('.')).toBeNull();
    expect(parseMoneyInput('abc')).toBeNull();
    expect(parseOptionalMoneyInput('  ')).toBeUndefined();
  });

  it('accepts valid employer affordability inputs', () => {
    const result = employerAffordabilitySchema.safeParse({
      householdIncome: 60000,
      employeeOnlyPremium: 250,
      familyPremium: undefined,
      payFrequency: 'monthly',
      planMeetsMinimumValue: true,
    });
    expect(result.success).toBe(true);
  });

  it('rejects negative money and unknown enums', () => {
    expect(
      employerAffordabilitySchema.safeParse({
        householdIncome: -1,
        employeeOnlyPremium: 250,
        payFrequency: 'monthly',
      }).success,
    ).toBe(false);
    expect(
      irmaaSchema.safeParse({
        filingStatus: 'headOfHousehold',
        magiTwoYearsBack: 90000,
      }).success,
    ).toBe(false);
  });

  it('validates MSP household size and state length', () => {
    const base = {
      stateAbbr: 'TX',
      householdSize: 1,
      monthlyIncome: 1200,
      countableAssets: 5000,
    };
    expect(mspEligibilitySchema.safeParse(base).success).toBe(true);
    expect(mspEligibilitySchema.safeParse({ ...base, householdSize: 0 }).success).toBe(false);
    expect(mspEligibilitySchema.safeParse({ ...base, stateAbbr: 'TEX' }).success).toBe(false);
  });

  it('validates Part B month ranges and ACA ages', () => {
    expect(partBPenaltySchema.safeParse({ monthsDelayed: 0 }).success).toBe(true);
    expect(partBPenaltySchema.safeParse({ monthsDelayed: 601 }).success).toBe(false);
    expect(
      medicareVsAcaSchema.safeParse({ age: 64, coverageType: 'none' }).success,
    ).toBe(true);
    expect(
      medicareVsAcaSchema.safeParse({ age: 121, coverageType: 'none' }).success,
    ).toBe(false);
  });
});
