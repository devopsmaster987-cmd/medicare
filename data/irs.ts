import { sources } from './sources';
import { dataVerifiedOn } from './verified';
import type { Rate } from './types';

export const irs2026 = {
  year: 2026,
  employerAffordabilityPercentage: {
    rate: 0.0996,
    year: 2026,
    source: sources.irsRp2025_25,
    verifiedOn: dataVerifiedOn,
  } satisfies Rate,
  initialEnrollmentPeriodMonths: 7,
  initialEnrollmentPeriod: {
    monthsBeforeBirthdayMonth: 3,
    monthsAfterBirthdayMonth: 3,
    months: 7,
    year: 2026,
    source: sources.medicareEmployer,
    verifiedOn: dataVerifiedOn,
    note: 'The seven-month window starts three months before the month you turn 65 and ends three months after it.',
  },
  generalEnrollmentPeriod: {
    startMonth: 1,
    startDay: 1,
    endMonth: 3,
    endDay: 31,
    year: 2026,
    source: sources.medicareAvoidPenalties,
    verifiedOn: dataVerifiedOn,
  },
  specialEnrollmentPeriodMonths: 8,
  annualEnrollmentPeriod: {
    startMonth: 10,
    startDay: 15,
    endMonth: 12,
    endDay: 7,
    year: 2026,
    source: sources.medicareEmployer,
    verifiedOn: dataVerifiedOn,
    note: 'The yearly Medicare open enrollment window for changing Part D or Medicare Advantage coverage.',
  },
  hsaContributionStopMonthsBeforeMedicare: 6,
  hsaRule: {
    year: 2026,
    source: sources.medicareEmployer,
    verifiedOn: dataVerifiedOn,
    note: 'Stop HSA contributions six months before Medicare Part A begins because Part A can be backdated up to six months.',
  },
  employerSizeRule: {
    employees: 20,
    year: 2026,
    source: sources.medicarePaysFirst,
    verifiedOn: dataVerifiedOn,
    note: 'At 20 or more employees, current employer coverage generally pays first for workers age 65 and older. Under 20, Medicare generally pays first.',
  },
};
