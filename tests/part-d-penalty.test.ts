import { describe, expect, it } from 'vitest';
import { partDPenaltyCalculator } from '@/lib/formulas/part-d-penalty';

describe('partDPenaltyCalculator', () => {
  it('charges nothing with no uncovered months', () => {
    const result = partDPenaltyCalculator({ monthsWithoutCoverage: 0 });
    expect(result.monthsCounted).toBe(0);
    expect(result.monthlyPenalty).toBe(0);
    expect(result.annualPenalty).toBe(0);
  });

  it('rounds one uncovered month to the nearest 10 cents', () => {
    const result = partDPenaltyCalculator({ monthsWithoutCoverage: 1 });
    expect(result.penaltyRate).toBeCloseTo(0.01, 10);
    expect(result.monthlyPenalty).toBe(0.4);
    expect(result.annualPenalty).toBe(4.8);
  });

  it('matches the 12-month example', () => {
    const result = partDPenaltyCalculator({ monthsWithoutCoverage: 12 });
    expect(result.penaltyRate).toBeCloseTo(0.12, 10);
    expect(result.monthlyPenalty).toBe(4.7);
    expect(result.annualPenalty).toBe(56.4);
    expect(result.tenYearPenalty).toBe(564);
    expect(result.twentyYearPenalty).toBe(1128);
  });

  it('matches the 24-month example', () => {
    const result = partDPenaltyCalculator({ monthsWithoutCoverage: 24 });
    expect(result.penaltyRate).toBeCloseTo(0.24, 10);
    expect(result.monthlyPenalty).toBe(9.4);
    expect(result.annualPenalty).toBe(112.8);
    expect(result.tenYearPenalty).toBe(1128);
    expect(result.twentyYearPenalty).toBe(2256);
  });

  it('rounds partial months without treating a day as a month', () => {
    const result = partDPenaltyCalculator({ monthsWithoutCoverage: 13 });
    expect(result.monthlyPenalty).toBe(5.1);
    expect(result.annualPenalty).toBe(61.2);
  });

  it('handles a custom base premium', () => {
    expect(partDPenaltyCalculator({ monthsWithoutCoverage: 1, basePremium: 30 }).monthlyPenalty).toBe(
      0.3,
    );
    expect(
      partDPenaltyCalculator({ monthsWithoutCoverage: 12, basePremium: 30 }).monthlyPenalty,
    ).toBe(3.6);
  });

  it('excludes months with confirmed creditable coverage', () => {
    const result = partDPenaltyCalculator({
      monthsWithoutCoverage: 12,
      creditableCoverageConfirmed: true,
    });
    expect(result.monthsCounted).toBe(0);
    expect(result.monthsExcluded).toBe(12);
    expect(result.monthlyPenalty).toBe(0);
    expect(result.creditableCoverageStatus).toBe('confirmed');
    expect(result.canBeReviewed).toBe(true);
    expect(result.note).toContain('creditable drug coverage');
  });

  it('counts months when creditable coverage is not confirmed', () => {
    const denied = partDPenaltyCalculator({
      monthsWithoutCoverage: 12,
      creditableCoverageConfirmed: false,
    });
    const unknown = partDPenaltyCalculator({ monthsWithoutCoverage: 12 });
    expect(denied.monthsCounted).toBe(12);
    expect(denied.creditableCoverageStatus).toBe('not-confirmed');
    expect(unknown.monthsCounted).toBe(12);
    expect(unknown.creditableCoverageStatus).toBe('unknown');
    expect(unknown.note).toContain('not confirmed');
  });

  it('excludes a continuous gap shorter than 63 days', () => {
    const result = partDPenaltyCalculator({
      monthsWithoutCoverage: 2,
      gapUnder63Days: true,
    });
    expect(result.monthsCounted).toBe(0);
    expect(result.monthsExcluded).toBe(2);
    expect(result.monthlyPenalty).toBe(0);
    expect(result.shortGapExcluded).toBe(true);
    expect(result.note).toContain('63 days');
  });

  it('counts a gap reported as 63 days or more', () => {
    const result = partDPenaltyCalculator({
      monthsWithoutCoverage: 2,
      gapUnder63Days: false,
    });
    expect(result.monthsCounted).toBe(2);
    expect(result.monthlyPenalty).toBe(0.8);
    expect(result.shortGapExcluded).toBe(false);
  });

  it('adds the penalty to an optional plan premium', () => {
    const result = partDPenaltyCalculator({ monthsWithoutCoverage: 12, planPremium: 30 });
    expect(result.totalMonthlyWithPlan).toBe(34.7);
    expect(result.totalAnnualWithPlan).toBe(416.4);
  });

  it('leaves the plan total empty when no plan premium is entered', () => {
    const result = partDPenaltyCalculator({ monthsWithoutCoverage: 12 });
    expect(result.totalMonthlyWithPlan).toBeNull();
    expect(result.totalAnnualWithPlan).toBeNull();
  });

  it('keeps the boundary at zero and one uncovered month', () => {
    expect(partDPenaltyCalculator({ monthsWithoutCoverage: 0 }).monthlyPenalty).toBe(0);
    expect(partDPenaltyCalculator({ monthsWithoutCoverage: 1 }).monthlyPenalty).toBe(0.4);
  });

  it('rejects negative and fractional months', () => {
    expect(() => partDPenaltyCalculator({ monthsWithoutCoverage: -1 })).toThrow();
    expect(() => partDPenaltyCalculator({ monthsWithoutCoverage: 1.5 })).toThrow();
  });

  it('rejects negative premiums', () => {
    expect(() =>
      partDPenaltyCalculator({ monthsWithoutCoverage: 1, basePremium: -1 }),
    ).toThrow();
    expect(() =>
      partDPenaltyCalculator({ monthsWithoutCoverage: 1, planPremium: -1 }),
    ).toThrow();
  });
});
