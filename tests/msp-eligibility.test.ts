import { describe, expect, it } from 'vitest';
import { mspEligibility } from '@/lib/formulas/msp-eligibility';
import { getState, launchStateAbbrs } from '@/data/states';

function stateFor(abbr: string) {
  const state = getState(abbr);
  if (!state) throw new Error(`Unknown state in test: ${abbr}`);
  return state;
}

const base = {
  stateAbbr: 'TX',
  state: stateFor('TX'),
  householdSize: 1,
  monthlyIncome: 1000,
  countableAssets: 1000,
};

describe('mspEligibility', () => {
  it('marks QMB and Extra Help eligible with low income and assets', () => {
    const result = mspEligibility({ ...base, monthlyIncome: 1350, countableAssets: 9950 });
    const qmb = result.programs.find((program) => program.key === 'qmb');
    const extraHelp = result.programs.find((program) => program.key === 'extraHelp');
    expect(qmb?.eligible).toBe(true);
    expect(extraHelp?.eligible).toBe(true);
    expect(result.likelyPrograms).toEqual(['qmb', 'extraHelp']);
    expect(result.estimatedMonthlyValue).toBe(241.89);
  });

  it('moves from QMB to SLMB at the boundary', () => {
    const atQmb = mspEligibility({ ...base, monthlyIncome: 1350, countableAssets: 0 });
    const overQmb = mspEligibility({ ...base, monthlyIncome: 1351, countableAssets: 0 });
    expect(atQmb.programs.find((program) => program.key === 'qmb')?.eligible).toBe(true);
    expect(overQmb.programs.find((program) => program.key === 'qmb')?.eligible).toBe(false);
    expect(overQmb.programs.find((program) => program.key === 'slmb')?.eligible).toBe(true);
  });

  it('checks the SLMB and QI boundaries', () => {
    const slmb = mspEligibility({ ...base, monthlyIncome: 1616, countableAssets: 0 });
    const qi = mspEligibility({ ...base, monthlyIncome: 1816, countableAssets: 0 });
    const overQi = mspEligibility({ ...base, monthlyIncome: 1817, countableAssets: 0 });
    expect(slmb.programs.find((program) => program.key === 'slmb')?.eligible).toBe(true);
    expect(qi.programs.find((program) => program.key === 'qi')?.eligible).toBe(true);
    expect(overQi.programs.find((program) => program.key === 'qi')?.eligible).toBe(false);
    expect(overQi.likelyPrograms).toEqual(['extraHelp']);
  });

  it('fails the resource test one dollar over the limit', () => {
    const atLimit = mspEligibility({ ...base, monthlyIncome: 1000, countableAssets: 9950 });
    const overLimit = mspEligibility({ ...base, monthlyIncome: 1000, countableAssets: 9951 });
    expect(atLimit.programs.find((program) => program.key === 'qmb')?.eligible).toBe(true);
    expect(overLimit.programs.find((program) => program.key === 'qmb')?.eligible).toBe(false);
    expect(overLimit.programs.find((program) => program.key === 'extraHelp')?.eligible).toBe(true);
  });

  it('ignores the asset test in states that do not use one', () => {
    const result = mspEligibility({
      ...base,
      stateAbbr: 'AZ',
      state: stateFor('AZ'),
      monthlyIncome: 1000,
      countableAssets: 20000,
    });
    expect(result.assetTestApplied).toBe(false);
    expect(result.programs.find((program) => program.key === 'qmb')?.eligible).toBe(true);
    expect(result.programs.find((program) => program.key === 'extraHelp')?.eligible).toBe(false);
  });

  it('uses the two-person limits', () => {
    const result = mspEligibility({
      ...base,
      householdSize: 2,
      monthlyIncome: 1824,
      countableAssets: 14910,
    });
    expect(result.programs.find((program) => program.key === 'qmb')?.eligible).toBe(true);
    const over = mspEligibility({
      ...base,
      householdSize: 2,
      monthlyIncome: 1825,
      countableAssets: 0,
    });
    expect(over.programs.find((program) => program.key === 'qmb')?.eligible).toBe(false);
  });

  it('shows an honest message for a state outside the launch set', () => {
    const result = mspEligibility({ ...base, stateAbbr: 'AL', state: stateFor('AL') });
    expect(result.stateCovered).toBe(false);
    expect(result.programs).toHaveLength(0);
    expect(result.message).toContain('does not yet cover');
  });

  it('covers every launch state', () => {
    for (const abbr of launchStateAbbrs) {
      const result = mspEligibility({ ...base, stateAbbr: abbr, state: stateFor(abbr) });
      expect(result.stateCovered).toBe(true);
    }
  });

  it('handles zero income and assets', () => {
    const result = mspEligibility({ ...base, monthlyIncome: 0, countableAssets: 0 });
    expect(result.likelyPrograms).toEqual(['qmb', 'extraHelp']);
  });

  it('rejects unknown states and negative income', () => {
    expect(() =>
      mspEligibility({ ...base, stateAbbr: 'ZZ', state: stateFor('TX') }),
    ).toThrow();
    expect(() => mspEligibility({ ...base, monthlyIncome: -1 })).toThrow();
  });
});
