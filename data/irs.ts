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
