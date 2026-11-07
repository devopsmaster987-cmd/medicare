import { describe, expect, it } from 'vitest';
import { medicarePremiumCalculator } from '@/lib/formulas/medicare-premium';

describe('medicarePremiumCalculator', () => {
  it('itemizes the standard bill for a single filer under the IRMAA threshold', () => {
    const result = medicarePremiumCalculator({
      filingStatus: 'single',
      magiTwoYearsBack: 80000,
      ownQuarters: 40,
      partDEnrolled: true,
      partDPlanPremium: 38.99,
    });
    expect(result.partA.monthlyPremium).toBe(0);
    expect(result.partB.monthlyWithIrmaa).toBe(202.9);
    expect(result.partB.irmaaAdjustment).toBe(0);
    expect(result.partD.monthlyPerPerson).toBe(38.99);
    expect(result.totalMonthly).toBe(241.89);
    expect(result.totalAnnual).toBe(2902.68);
  });

  it('adds the IRMAA surcharge to Part B and Part D', () => {
    const result = medicarePremiumCalculator({
      filingStatus: 'single',
      magiTwoYearsBack: 150000,
      ownQuarters: 40,
      partDEnrolled: true,
      partDPlanPremium: 38.99,
    });
    expect(result.partB.monthlyWithIrmaa).toBe(405.8);
    expect(result.partB.irmaaAdjustment).toBe(202.9);
    expect(result.partD.irmaaAdjustment).toBe(37.5);
    expect(result.partD.monthlyPerPerson).toBe(76.49);
    expect(result.totalMonthly).toBe(482.29);
    expect(result.totalAnnual).toBe(5787.48);
    expect(result.headroomToNextBracket).toBe(21001);
  });

  it('doubles Part B and Part D when both spouses are enrolled', () => {
    const result = medicarePremiumCalculator({
      filingStatus: 'marriedJoint',
      magiTwoYearsBack: 250000,
      ownQuarters: 40,
      bothEnrolled: true,
      partDEnrolled: true,
      partDPlanPremium: 38.99,
    });
    expect(result.persons).toBe(2);
    expect(result.partB.monthlyPerPerson).toBe(284.1);
    expect(result.partB.monthlyTotal).toBe(568.2);
    expect(result.partD.monthlyPerPerson).toBe(53.49);
    expect(result.partD.monthlyTotal).toBe(106.98);
    expect(result.totalMonthly).toBe(675.18);
  });

  it('charges the Part A premium from work quarters', () => {
    const result = medicarePremiumCalculator({
      filingStatus: 'single',
      magiTwoYearsBack: 40000,
      ownQuarters: 35,
      partDEnrolled: false,
    });
    expect(result.partA.monthlyPremium).toBe(311);
    expect(result.partD.monthlyTotal).toBe(0);
    expect(result.totalMonthly).toBe(513.9);
  });

  it('includes optional Part B and Part D late penalties', () => {
    const result = medicarePremiumCalculator({
      filingStatus: 'single',
      magiTwoYearsBack: 80000,
      ownQuarters: 40,
      partDEnrolled: true,
      partDPlanPremium: 38.99,
      partBPenaltyMonths: 24,
      partDPenaltyMonths: 12,
    });
    expect(result.partB.monthlyPenalty).toBe(40.58);
    expect(result.partB.monthlyTotal).toBe(243.48);
    expect(result.partD.monthlyPenalty).toBe(4.7);
    expect(result.totalMonthly).toBe(287.17);
  });

  it('keeps a single filer on the single IRMAA table', () => {
    const result = medicarePremiumCalculator({
      filingStatus: 'marriedSeparate',
      magiTwoYearsBack: 120000,
      ownQuarters: 40,
      partDEnrolled: false,
    });
    expect(result.partB.monthlyWithIrmaa).toBe(649.2);
    expect(result.partD.irmaaAdjustment).toBe(83.3);
    expect(result.persons).toBe(1);
  });
});
