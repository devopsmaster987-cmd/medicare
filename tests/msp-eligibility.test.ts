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

  it('applies California income and asset limits', () => {
    const atQmb = mspEligibility({
      ...base,
      stateAbbr: 'CA',
      state: stateFor('CA'),
      monthlyIncome: 1330,
      countableAssets: 130000,
    });
    const overQmb = mspEligibility({
      ...base,
      stateAbbr: 'CA',
      state: stateFor('CA'),
      monthlyIncome: 1331,
      countableAssets: 130000,
    });
    const overAssets = mspEligibility({
      ...base,
      stateAbbr: 'CA',
      state: stateFor('CA'),
      monthlyIncome: 1000,
      countableAssets: 130001,
    });
    expect(atQmb.programs.find((program) => program.key === 'qmb')?.eligible).toBe(true);
    expect(overQmb.programs.find((program) => program.key === 'qmb')?.eligible).toBe(false);
    expect(overQmb.programs.find((program) => program.key === 'slmb')?.eligible).toBe(true);
    expect(overAssets.programs.find((program) => program.key === 'qmb')?.eligible).toBe(false);
  });

  it('extends California rules to a three-person household', () => {
    const result = mspEligibility({
      ...base,
      stateAbbr: 'CA',
      state: stateFor('CA'),
      householdSize: 3,
      monthlyIncome: 2277,
      countableAssets: 260000,
    });
    const qmb = result.programs.find((program) => program.key === 'qmb');
    expect(qmb?.incomeLimitMonthly).toBe(2277);
    expect(qmb?.resourceLimit).toBe(260000);
    expect(qmb?.eligible).toBe(true);
    expect(result.stateNote).toContain('three or more');
  });

  it('applies New York limits and removes the separate SLMB program', () => {
    const atQmb = mspEligibility({
      ...base,
      stateAbbr: 'NY',
      state: stateFor('NY'),
      monthlyIncome: 1856,
      countableAssets: 500000,
    });
    const overQmb = mspEligibility({
      ...base,
      stateAbbr: 'NY',
      state: stateFor('NY'),
      monthlyIncome: 1857,
      countableAssets: 500000,
    });
    const atQi = mspEligibility({
      ...base,
      stateAbbr: 'NY',
      state: stateFor('NY'),
      monthlyIncome: 2494,
      countableAssets: 500000,
    });
    expect(atQmb.programs.find((program) => program.key === 'qmb')?.eligible).toBe(true);
    expect(overQmb.programs.find((program) => program.key === 'qmb')?.eligible).toBe(false);
    expect(overQmb.programs.find((program) => program.key === 'slmb')?.available).toBe(false);
    expect(atQi.programs.find((program) => program.key === 'qi')?.eligible).toBe(true);

    const family = mspEligibility({
      ...base,
      stateAbbr: 'NY',
      state: stateFor('NY'),
      householdSize: 3,
      monthlyIncome: 3162,
      countableAssets: 500000,
    });
    expect(family.programs.find((program) => program.key === 'qmb')?.incomeLimitMonthly).toBe(3162);
    expect(family.programs.find((program) => program.key === 'qmb')?.eligible).toBe(true);
  });

  it('applies Arizona SLMB and QI limits without an asset test', () => {
    const atSlmb = mspEligibility({
      ...base,
      stateAbbr: 'AZ',
      state: stateFor('AZ'),
      monthlyIncome: 1596,
      countableAssets: 500000,
    });
    const overSlmb = mspEligibility({
      ...base,
      stateAbbr: 'AZ',
      state: stateFor('AZ'),
      monthlyIncome: 1597,
      countableAssets: 500000,
    });
    const atQi = mspEligibility({
      ...base,
      stateAbbr: 'AZ',
      state: stateFor('AZ'),
      monthlyIncome: 1796,
      countableAssets: 500000,
    });
    expect(atSlmb.programs.find((program) => program.key === 'slmb')?.eligible).toBe(true);
    expect(overSlmb.programs.find((program) => program.key === 'slmb')?.eligible).toBe(false);
    expect(overSlmb.programs.find((program) => program.key === 'qi')?.eligible).toBe(true);
    expect(atQi.programs.find((program) => program.key === 'qi')?.eligible).toBe(true);
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
