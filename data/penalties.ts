import { sources } from './sources';
import { dataVerifiedOn } from './verified';
import type { Rate } from './types';

export const partBPenalty = {
  ratePerFullYear: {
    rate: 0.1,
    year: 2026,
    source: sources.medicareAvoidPenalties,
    verifiedOn: dataVerifiedOn,
  } satisfies Rate,
  fullPeriodMonths: 12,
  permanent: true,
  source: sources.medicareAvoidPenalties,
  verifiedOn: dataVerifiedOn,
  year: 2026,
};

export const partDPenalty = {
  ratePerUncoveredMonth: {
    rate: 0.01,
    year: 2026,
    source: sources.medicarePartDCosts,
    verifiedOn: dataVerifiedOn,
  } satisfies Rate,
  fullPeriodMonths: 1,
  permanent: true,
  source: sources.medicarePartDCosts,
  verifiedOn: dataVerifiedOn,
  year: 2026,
};

export const partAPenalty = {
  ratePerFullYear: {
    rate: 0.1,
    year: 2026,
    source: sources.medicareAvoidPenalties,
    verifiedOn: dataVerifiedOn,
  } satisfies Rate,
  multiplier: 2,
  source: sources.medicareAvoidPenalties,
  verifiedOn: dataVerifiedOn,
  year: 2026,
};
