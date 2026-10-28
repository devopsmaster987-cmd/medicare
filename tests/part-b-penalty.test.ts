import { describe, expect, it } from 'vitest';
import { partBPenaltyCalculator } from '@/lib/formulas/part-b-penalty';

describe('partBPenaltyCalculator', () => {
  it('charges nothing for fewer than 12 full months', () => {
    expect(partBPenaltyCalculator({ monthsDelayed: 0 }).monthlyPenalty).toBe(0);
    expect(partBPenaltyCalculator({ monthsDelayed: 11 }).monthlyPenalty).toBe(0);
  });

  it('charges one full year at 12 months', () => {
    const result = partBPenaltyCalculator({ monthsDelayed: 12 });
    expect(result.fullTwelveMonthPeriods).toBe(1);
    expect(result.penaltyRate).toBe(0.1);
    expect(result.monthlyPenalty).toBe(20.29);
    expect(result.totalMonthlyPremium).toBe(223.19);
    expect(result.annualPenalty).toBe(243.48);
  });

  it('does not count a 23-month delay as two years', () => {
    const result = partBPenaltyCalculator({ monthsDelayed: 23 });
    expect(result.fullTwelveMonthPeriods).toBe(1);
  });

  it('matches the official two-year example', () => {
    const result = partBPenaltyCalculator({ monthsDelayed: 24 });
    expect(result.fullTwelveMonthPeriods).toBe(2);
    expect(result.penaltyRate).toBe(0.2);
    expect(result.monthlyPenalty).toBe(40.58);
    expect(result.totalMonthlyPremium).toBe(243.48);
    expect(result.tenYearPenalty).toBe(4869.6);
    expect(result.twentyYearPenalty).toBe(9739.2);
  });

  it('handles a custom standard premium', () => {
    const result = partBPenaltyCalculator({ monthsDelayed: 24, standardPremium: 100 });
    expect(result.monthlyPenalty).toBe(20);
    expect(result.totalMonthlyPremium).toBe(120);
  });

  it('flags possible avoidance without erasing the math', () => {
    const result = partBPenaltyCalculator({ monthsDelayed: 12, sepEligible: true });
    expect(result.canAvoid).toBe(true);
    expect(result.monthlyPenalty).toBe(20.29);
  });

  it('does not count months covered by creditable coverage', () => {
    const result = partBPenaltyCalculator({
      monthsDelayed: 12,
      hadCreditableCoverage: true,
    });
    expect(result.monthsCounted).toBe(0);
    expect(result.monthsExcluded).toBe(12);
    expect(result.fullTwelveMonthPeriods).toBe(0);
    expect(result.monthlyPenalty).toBe(0);
    expect(result.totalMonthlyPremium).toBe(202.9);
    expect(result.canAvoid).toBe(true);
    expect(result.avoidanceNote).toContain('creditable coverage');
  });

  it('counts months when creditable coverage is reported but the SEP has ended', () => {
    const result = partBPenaltyCalculator({
      monthsDelayed: 12,
      hadCreditableCoverage: true,
      sepEligible: false,
    });
    expect(result.monthsCounted).toBe(12);
    expect(result.monthsExcluded).toBe(0);
    expect(result.fullTwelveMonthPeriods).toBe(1);
    expect(result.monthlyPenalty).toBe(20.29);
    expect(result.avoidanceNote).toContain('Special Enrollment Period ends');
  });

  it('keeps the penalty when there was no creditable coverage', () => {
    const result = partBPenaltyCalculator({
      monthsDelayed: 12,
      hadCreditableCoverage: false,
    });
    expect(result.monthsCounted).toBe(12);
    expect(result.monthlyPenalty).toBe(20.29);
  });

  it('keeps the boundary at 11 and 12 countable months', () => {
    expect(
      partBPenaltyCalculator({ monthsDelayed: 11, hadCreditableCoverage: false })
        .fullTwelveMonthPeriods,
    ).toBe(0);
    expect(
      partBPenaltyCalculator({ monthsDelayed: 12, hadCreditableCoverage: false })
        .fullTwelveMonthPeriods,
    ).toBe(1);
  });

  it('rejects negative months', () => {
    expect(() => partBPenaltyCalculator({ monthsDelayed: -1 })).toThrow();
  });
});
