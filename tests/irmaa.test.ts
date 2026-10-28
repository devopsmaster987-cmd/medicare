import { describe, expect, it } from 'vitest';
import { irmaaCalculator } from '@/lib/formulas/irmaa';

describe('irmaaCalculator', () => {
  it('starts at the standard tier at the threshold', () => {
    const result = irmaaCalculator({ filingStatus: 'single', magiTwoYearsBack: 109000 });
    expect(result.tier.index).toBe(0);
    expect(result.monthlyPartB).toBe(202.9);
    expect(result.monthlySurcharge).toBe(0);
    expect(result.headroomToNextBracket).toBe(1);
  });

  it('moves to the first surcharge tier one dollar over', () => {
    const result = irmaaCalculator({ filingStatus: 'single', magiTwoYearsBack: 109001 });
    expect(result.tier.index).toBe(1);
    expect(result.monthlyPartB).toBe(284.1);
    expect(result.monthlyPartD).toBe(14.5);
    expect(result.monthlySurcharge).toBe(95.7);
    expect(result.annualSurcharge).toBe(1148.4);
    expect(result.headroomToNextBracket).toBe(28000);
  });

  it('handles the top of a tier and the start of the next', () => {
    const top = irmaaCalculator({ filingStatus: 'single', magiTwoYearsBack: 137000 });
    const next = irmaaCalculator({ filingStatus: 'single', magiTwoYearsBack: 137001 });
    expect(top.tier.index).toBe(1);
    expect(top.headroomToNextBracket).toBe(1);
    expect(next.tier.index).toBe(2);
    expect(next.monthlyPartB).toBe(405.8);
  });

  it('handles the highest tier at the exact boundary', () => {
    const before = irmaaCalculator({ filingStatus: 'single', magiTwoYearsBack: 499999 });
    const at = irmaaCalculator({ filingStatus: 'single', magiTwoYearsBack: 500000 });
    expect(before.tier.index).toBe(4);
    expect(at.tier.index).toBe(5);
    expect(at.monthlyPartB).toBe(689.9);
    expect(at.monthlySurcharge).toBe(578);
    expect(at.headroomToNextBracket).toBeNull();
  });

  it('uses joint thresholds', () => {
    const base = irmaaCalculator({ filingStatus: 'marriedJoint', magiTwoYearsBack: 218000 });
    const over = irmaaCalculator({ filingStatus: 'marriedJoint', magiTwoYearsBack: 218001 });
    expect(base.tier.index).toBe(0);
    expect(over.tier.index).toBe(1);
  });

  it('uses married-filing-separately thresholds', () => {
    const base = irmaaCalculator({ filingStatus: 'marriedSeparate', magiTwoYearsBack: 109000 });
    const mid = irmaaCalculator({ filingStatus: 'marriedSeparate', magiTwoYearsBack: 109001 });
    const top = irmaaCalculator({ filingStatus: 'marriedSeparate', magiTwoYearsBack: 391000 });
    expect(base.tier.index).toBe(0);
    expect(mid.tier.partBTotal).toBe(649.2);
    expect(top.tier.partBTotal).toBe(689.9);
  });

  it('doubles the view for a married couple', () => {
    const result = irmaaCalculator({ filingStatus: 'marriedJoint', magiTwoYearsBack: 218001 });
    expect(result.marriedCouple.bothSpousesMayPay).toBe(true);
    expect(result.marriedCouple.householdMonthlyPartB).toBe(568.2);
    expect(result.marriedCouple.householdMonthlyPartD).toBe(29);
    expect(result.marriedCouple.householdMonthlySurcharge).toBe(191.4);
  });

  it('computes Roth conversion headroom from projected income', () => {
    const result = irmaaCalculator({
      filingStatus: 'single',
      magiTwoYearsBack: 100000,
      projectedMagi: 120000,
    });
    expect(result.projected?.tier.index).toBe(1);
    expect(result.projected?.rothConversionHeadroom).toBe(17001);
  });

  it('sets Roth headroom to zero in the top tier', () => {
    const result = irmaaCalculator({
      filingStatus: 'single',
      magiTwoYearsBack: 100000,
      projectedMagi: 600000,
    });
    expect(result.projected?.rothConversionHeadroom).toBe(0);
  });

  it('returns the two-year lookahead rows', () => {
    const result = irmaaCalculator({ filingStatus: 'single', magiTwoYearsBack: 0 });
    expect(result.twoYearLookahead).toEqual([
      { incomeYear: 2024, premiumYear: 2026 },
      { incomeYear: 2025, premiumYear: 2027 },
      { incomeYear: 2026, premiumYear: 2028 },
    ]);
  });

  it('shows the annual cost of crossing the next cliff', () => {
    const atCliff = irmaaCalculator({ filingStatus: 'single', magiTwoYearsBack: 109000 });
    const oneOver = irmaaCalculator({ filingStatus: 'single', magiTwoYearsBack: 109001 });
    const joint = irmaaCalculator({ filingStatus: 'marriedJoint', magiTwoYearsBack: 218000 });
    expect(atCliff.cliffCost.additionalAnnualSurcharge).toBe(1148.4);
    expect(oneOver.cliffCost.additionalAnnualSurcharge).toBe(1736.4);
    expect(joint.cliffCost.householdAdditionalAnnualSurcharge).toBe(2296.8);
  });

  it('rejects negative MAGI', () => {
    expect(() => irmaaCalculator({ filingStatus: 'single', magiTwoYearsBack: -1 })).toThrow();
  });
});
