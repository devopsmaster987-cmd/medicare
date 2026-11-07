import { describe, expect, it } from 'vitest';
import { partAPremiumCalculator } from '@/lib/formulas/part-a-premium';

describe('partAPremiumCalculator', () => {
  it('gives premium-free Part A at 40 or more quarters', () => {
    const result = partAPremiumCalculator({ ownQuarters: 40 });
    expect(result.tier).toBe('free');
    expect(result.monthlyPremium).toBe(0);
    expect(result.annualPremium).toBe(0);
    expect(result.premiumFree).toBe(true);
  });

  it('charges the reduced premium from 30 to 39 quarters', () => {
    const reduced = partAPremiumCalculator({ ownQuarters: 39 });
    expect(reduced.tier).toBe('reduced');
    expect(reduced.monthlyPremium).toBe(311);
    expect(reduced.annualPremium).toBe(3732);

    const atThirty = partAPremiumCalculator({ ownQuarters: 30 });
    expect(atThirty.tier).toBe('reduced');
    expect(atThirty.monthlyPremium).toBe(311);
  });

  it('charges the full premium below 30 quarters', () => {
    const atTwentyNine = partAPremiumCalculator({ ownQuarters: 29 });
    expect(atTwentyNine.tier).toBe('full');
    expect(atTwentyNine.monthlyPremium).toBe(565);
    expect(atTwentyNine.annualPremium).toBe(6780);

    const zero = partAPremiumCalculator({ ownQuarters: 0 });
    expect(zero.tier).toBe('full');
    expect(zero.monthlyPremium).toBe(565);
  });

  it('uses a spouse’s quarters when married', () => {
    const result = partAPremiumCalculator({
      ownQuarters: 20,
      married: true,
      spouseQuarters: 40,
    });
    expect(result.quartersUsed).toBe(40);
    expect(result.tier).toBe('free');
    expect(result.monthlyPremium).toBe(0);
  });

  it('ignores spouse quarters when not married', () => {
    const result = partAPremiumCalculator({
      ownQuarters: 20,
      married: false,
      spouseQuarters: 40,
    });
    expect(result.quartersUsed).toBe(20);
    expect(result.tier).toBe('full');
  });

  it('adds a 10% penalty paid for twice the years delayed', () => {
    const result = partAPremiumCalculator({
      ownQuarters: 35,
      yearsDelayed: 2,
    });
    expect(result.penaltyRate).toBe(0.1);
    expect(result.monthlyPenalty).toBe(31.1);
    expect(result.penaltyDurationYears).toBe(4);
    expect(result.totalMonthlyDuringPenalty).toBe(342.1);
    expect(result.penaltyCostDuringDuration).toBe(1492.8);
  });

  it('does not penalize premium-free Part A or zero delay', () => {
    const free = partAPremiumCalculator({ ownQuarters: 40, yearsDelayed: 3 });
    expect(free.monthlyPenalty).toBe(0);
    expect(free.penaltyDurationYears).toBe(0);

    const noDelay = partAPremiumCalculator({ ownQuarters: 35, yearsDelayed: 0 });
    expect(noDelay.monthlyPenalty).toBe(0);
  });

  it('rounds quarters down to whole quarters', () => {
    const result = partAPremiumCalculator({ ownQuarters: 39.9 });
    expect(result.ownQuarters).toBe(39);
    expect(result.tier).toBe('reduced');
  });
});
