import { describe, expect, it } from 'vitest';
import { enrollmentDatesCalculator } from '@/lib/formulas/enrollment-dates';

describe('enrollmentDatesCalculator', () => {
  it('builds the seven-month window around the 65th birthday month', () => {
    const result = enrollmentDatesCalculator({
      birthYear: 1961,
      birthMonth: 6,
      today: new Date(Date.UTC(2026, 4, 15)),
    });
    expect(result.eligibleMonthLabel).toBe('June 2026');
    expect(result.iepStart).toBe('2026-03-01');
    expect(result.iepEnd).toBe('2026-09-30');
    expect(result.windowStatus).toBe('open');
    expect(result.daysUntilIEPEnd).toBe(138);
  });

  it('flags the last 30 days as closing soon', () => {
    const result = enrollmentDatesCalculator({
      birthYear: 1961,
      birthMonth: 6,
      today: new Date(Date.UTC(2026, 8, 15)),
    });
    expect(result.windowStatus).toBe('closing-soon');
    expect(result.daysUntilIEPEnd).toBe(15);
  });

  it('reports not-open before the window starts', () => {
    const result = enrollmentDatesCalculator({
      birthYear: 1961,
      birthMonth: 6,
      today: new Date(Date.UTC(2026, 1, 15)),
    });
    expect(result.windowStatus).toBe('not-open');
    expect(result.daysUntilIEPEnd).toBeNull();
  });

  it('shifts the window back one month for a first-of-month birthday', () => {
    const result = enrollmentDatesCalculator({
      birthYear: 1961,
      birthMonth: 1,
      birthdayOnFirst: true,
      today: new Date(Date.UTC(2026, 0, 15)),
    });
    expect(result.firstOfMonthRuleApplied).toBe(true);
    expect(result.eligibleMonthLabel).toBe('December 2025');
    expect(result.iepStart).toBe('2025-09-01');
    expect(result.iepEnd).toBe('2026-03-31');
  });

  it('keeps January birthdays in the same seven-month window without the first rule', () => {
    const result = enrollmentDatesCalculator({
      birthYear: 1961,
      birthMonth: 1,
      today: new Date(Date.UTC(2025, 9, 15)),
    });
    expect(result.eligibleMonthLabel).toBe('January 2026');
    expect(result.iepStart).toBe('2025-10-01');
    expect(result.iepEnd).toBe('2026-04-30');
  });

  it('starts coverage on the birthday month when signing up early', () => {
    const result = enrollmentDatesCalculator({
      birthYear: 1961,
      birthMonth: 6,
      today: new Date(Date.UTC(2026, 4, 15)),
    });
    expect(result.coverageStartTable[0]).toEqual({
      signupMonth: 'March 2026',
      coverageStart: '2026-06-01',
    });
    expect(result.coverageStartTable[3]).toEqual({
      signupMonth: 'June 2026',
      coverageStart: '2026-07-01',
    });
    expect(result.coverageStartTable[6]).toEqual({
      signupMonth: 'September 2026',
      coverageStart: '2026-10-01',
    });
    expect(result.earliestCoverageStart).toBe('2026-06-01');
  });

  it('opens the next General Enrollment Period after a closed window', () => {
    const result = enrollmentDatesCalculator({
      birthYear: 1961,
      birthMonth: 6,
      today: new Date(Date.UTC(2026, 10, 7)),
    });
    expect(result.windowStatus).toBe('closed');
    expect(result.gep).toEqual({
      start: '2027-01-01',
      end: '2027-03-31',
      openNow: false,
    });
  });

  it('reports the current General Enrollment Period when it is still open', () => {
    const result = enrollmentDatesCalculator({
      birthYear: 1960,
      birthMonth: 1,
      birthdayOnFirst: true,
      today: new Date(Date.UTC(2026, 2, 15)),
    });
    expect(result.windowStatus).toBe('closed');
    expect(result.gep).toEqual({
      start: '2026-01-01',
      end: '2026-03-31',
      openNow: true,
    });
  });

  it('runs the SEP from the month after the IEP ends to eight months after coverage ends', () => {
    const afterCoverage = enrollmentDatesCalculator({
      birthYear: 1961,
      birthMonth: 6,
      situation: 'working-employer-coverage',
      coverageEndMonth: '2026-08',
      today: new Date(Date.UTC(2026, 9, 1)),
    });
    expect(afterCoverage.sep).toEqual({
      start: '2026-10-01',
      end: '2027-04-30',
    });

    const beforeIepEnds = enrollmentDatesCalculator({
      birthYear: 1961,
      birthMonth: 6,
      situation: 'working-employer-coverage',
      coverageEndMonth: '2026-03',
      today: new Date(Date.UTC(2026, 9, 1)),
    });
    expect(beforeIepEnds.sep).toEqual({
      start: '2026-10-01',
      end: '2026-11-30',
    });
  });

  it('returns no SEP when coverage ended long before the IEP closed', () => {
    const result = enrollmentDatesCalculator({
      birthYear: 1961,
      birthMonth: 6,
      situation: 'working-employer-coverage',
      coverageEndMonth: '2026-01',
      today: new Date(Date.UTC(2026, 9, 1)),
    });
    expect(result.sep).toBeNull();
    expect(result.gep).toEqual({
      start: '2027-01-01',
      end: '2027-03-31',
      openNow: false,
    });
  });

  it('rejects impossible birth dates', () => {
    expect(() =>
      enrollmentDatesCalculator({ birthYear: 1961, birthMonth: 13 }),
    ).toThrow('Birth month');
    expect(() =>
      enrollmentDatesCalculator({ birthYear: 1800, birthMonth: 6 }),
    ).toThrow('Birth year');
  });
});
