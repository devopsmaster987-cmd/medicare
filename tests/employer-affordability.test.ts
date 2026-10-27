import { describe, expect, it } from 'vitest';
import {
  annualizePremium,
  employerAffordability,
} from '@/lib/formulas/employer-affordability';

describe('annualizePremium', () => {
  it('converts each pay frequency to a year', () => {
    expect(annualizePremium(100, 'weekly')).toBe(5200);
    expect(annualizePremium(100, 'biweekly')).toBe(2600);
    expect(annualizePremium(100, 'semimonthly')).toBe(2400);
    expect(annualizePremium(100, 'monthly')).toBe(1200);
    expect(annualizePremium(100, 'annual')).toBe(100);
  });
});

describe('employerAffordability', () => {
  it('marks coverage affordable and computes the margin', () => {
    const result = employerAffordability({
      householdIncome: 30000,
      employeeOnlyPremium: 200,
      payFrequency: 'monthly',
    });
    expect(result.annualEmployeeOnlyPremium).toBe(2400);
    expect(result.annualThreshold).toBe(2988);
    expect(result.employeeCoverageAffordable).toBe(true);
    expect(result.employeeHeadroom).toBe(588);
  });

  it('treats the exact threshold as affordable and one dollar over as unaffordable', () => {
    const atLimit = employerAffordability({
      householdIncome: 30000,
      employeeOnlyPremium: 249,
      payFrequency: 'monthly',
    });
    const overLimit = employerAffordability({
      householdIncome: 30000,
      employeeOnlyPremium: 249.01,
      payFrequency: 'monthly',
    });
    expect(atLimit.employeeCoverageAffordable).toBe(true);
    expect(overLimit.employeeCoverageAffordable).toBe(false);
  });

  it('does not use the family premium as a separate subsidy test', () => {
    const result = employerAffordability({
      householdIncome: 30000,
      employeeOnlyPremium: 200,
      familyPremium: 600,
      payFrequency: 'monthly',
      planMeetsMinimumValue: true,
    });
    expect(result.employeeCoverageAffordable).toBe(true);
    expect(result.annualFamilyPremium).toBe(7200);
    expect(result.familyCoverageAffordable).toBe(false);
    expect(result.familyMembersMayQualifyForHelp).toBe(false);
    expect(result.subsidyEligibility).toBe('likely-none');
  });

  it('handles zero income', () => {
    const zeroPremium = employerAffordability({
      householdIncome: 0,
      employeeOnlyPremium: 0,
      payFrequency: 'monthly',
    });
    const positivePremium = employerAffordability({
      householdIncome: 0,
      employeeOnlyPremium: 1,
      payFrequency: 'monthly',
    });
    expect(zeroPremium.employeeCoverageAffordable).toBe(true);
    expect(positivePremium.employeeCoverageAffordable).toBe(false);
  });

  it('uses the minimum-value answer when supplied', () => {
    const result = employerAffordability({
      householdIncome: 30000,
      employeeOnlyPremium: 200,
      payFrequency: 'monthly',
      planMeetsMinimumValue: false,
    });
    expect(result.minimumValueStatus).toBe('does-not-meet');
    expect(result.subsidyEligibility).toBe('likely-qualify');
  });

  it('flags likely Marketplace help when the employee premium is unaffordable', () => {
    const result = employerAffordability({
      householdIncome: 30000,
      employeeOnlyPremium: 300,
      payFrequency: 'monthly',
      planMeetsMinimumValue: true,
    });
    expect(result.employeeCoverageAffordable).toBe(false);
    expect(result.subsidyEligibility).toBe('likely-qualify');
  });

  it('marks family members as potentially eligible when the employee-only premium fails', () => {
    const result = employerAffordability({
      householdIncome: 30000,
      employeeOnlyPremium: 300,
      familyPremium: 600,
      payFrequency: 'monthly',
      planMeetsMinimumValue: true,
    });
    expect(result.employeeCoverageAffordable).toBe(false);
    expect(result.familyMembersMayQualifyForHelp).toBe(true);
    expect(result.subsidyEligibility).toBe('likely-qualify');
  });

  it('rejects negative input', () => {
    expect(() =>
      employerAffordability({
        householdIncome: -1,
        employeeOnlyPremium: 1,
        payFrequency: 'monthly',
      }),
    ).toThrow();
  });
});
