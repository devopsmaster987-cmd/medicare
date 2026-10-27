import { describe, expect, it } from 'vitest';
import { medicareVsAca } from '@/lib/formulas/medicare-vs-aca';

describe('medicareVsAca', () => {
  it('routes people under 65 to ACA or employer coverage', () => {
    const result = medicareVsAca({ age: 60, coverageType: 'none' });
    expect(result.medicareEligible).toBe(false);
    expect(result.path).toBe('aca-or-employer');
  });

  it('allows a delay for a large employer with creditable coverage', () => {
    const result = medicareVsAca({
      age: 66,
      coverageType: 'active',
      employerSize: 25,
      creditableCoverage: true,
      workCredits: 40,
    });
    expect(result.premiumFreePartA).toBe(true);
    expect(result.path).toBe('delay-part-b');
    expect(result.acaSubsidyStatus).toBe('ends');
    expect(result.warnings.join(' ')).toContain('eight months');
  });

  it('sends a large-employer worker with non-creditable coverage to Medicare', () => {
    const result = medicareVsAca({
      age: 66,
      coverageType: 'active',
      employerSize: 25,
      creditableCoverage: false,
      workCredits: 40,
    });
    expect(result.path).toBe('enroll-medicare');
  });

  it('sends a small-employer worker to Medicare', () => {
    const result = medicareVsAca({
      age: 66,
      coverageType: 'active',
      employerSize: 10,
      workCredits: 40,
    });
    expect(result.path).toBe('enroll-medicare');
  });

  it('sends retiree and COBRA coverage to Medicare', () => {
    expect(medicareVsAca({ age: 66, coverageType: 'retiree' }).path).toBe('enroll-medicare');
    expect(medicareVsAca({ age: 66, coverageType: 'cobra' }).path).toBe('enroll-medicare');
  });

  it('enrolls a 65-year-old with premium-free Part A and no employer coverage', () => {
    const result = medicareVsAca({
      age: 66,
      coverageType: 'none',
      premiumFreePartA: true,
    });
    expect(result.path).toBe('enroll-medicare');
    expect(result.acaSubsidyStatus).toBe('ends');
    expect(result.annualPartAPremium).toBe(0);
    expect(result.annualPartBPremium).toBe(2434.8);
  });

  it('compares ACA when Part A is not premium-free', () => {
    const result = medicareVsAca({
      age: 66,
      coverageType: 'none',
      workCredits: 20,
    });
    expect(result.path).toBe('compare-aca');
    expect(result.partAStatus).toBe('full');
    expect(result.annualPartAPremium).toBe(6780);
    expect(result.annualMedicarePremiumEstimate).toBe(9214.8);
  });

  it('uses the reduced Part A premium for 30 to 39 credits', () => {
    const result = medicareVsAca({
      age: 66,
      coverageType: 'none',
      workCredits: 35,
    });
    expect(result.path).toBe('compare-aca');
    expect(result.premiumFreePartA).toBe(false);
    expect(result.partAStatus).toBe('reduced');
    expect(result.annualPartAPremium).toBe(3732);
    expect(result.annualMedicarePremiumEstimate).toBe(6166.8);
  });

  it('warns when Part A status is unknown', () => {
    const result = medicareVsAca({ age: 66, coverageType: 'none' });
    expect(result.partAStatus).toBe('unknown');
    expect(result.warnings.join(' ')).toContain('not confirmed');
  });

  it('warns HSA contributors', () => {
    const result = medicareVsAca({
      age: 66,
      coverageType: 'active',
      employerSize: 25,
      creditableCoverage: true,
      workCredits: 40,
      hasHsa: true,
    });
    expect(result.warnings.join(' ')).toContain('six months');
  });

  it('returns the four deadline rules', () => {
    expect(medicareVsAca({ age: 66, coverageType: 'none' }).deadlines).toHaveLength(4);
  });

  it('rejects negative input', () => {
    expect(() => medicareVsAca({ age: -1, coverageType: 'none' })).toThrow();
  });
});
