import { sources } from './sources';
import { dataVerifiedOn } from './verified';
import type { Money } from './types';

export const partD2026 = {
  year: 2026,
  baseBeneficiaryPremium: {
    amount: 38.99,
    year: 2026,
    source: sources.cms2026PartD,
    verifiedOn: dataVerifiedOn,
  } satisfies Money,
  deductible: {
    amount: 615,
    year: 2026,
    source: sources.medicarePartDCosts,
    verifiedOn: dataVerifiedOn,
  } satisfies Money,
  outOfPocketCap: {
    amount: 2100,
    year: 2026,
    source: sources.medicarePartDCosts,
    verifiedOn: dataVerifiedOn,
  } satisfies Money,
  irmaa: [
    { min: 0, max: 109000, amount: 0 },
    { min: 109001, max: 137000, amount: 14.5 },
    { min: 137001, max: 171000, amount: 37.5 },
    { min: 171001, max: 205000, amount: 60.4 },
    { min: 205001, max: 499999, amount: 83.3 },
    { min: 500000, max: null, amount: 91 },
  ].map((bracket) => ({
    ...bracket,
    year: 2026,
    source: sources.cms2026AB,
    verifiedOn: dataVerifiedOn,
  })),
  extraHelp: {
    incomeAnnualSingle: {
      amount: 23940,
      year: 2026,
      source: sources.medicareDrugCosts,
      verifiedOn: dataVerifiedOn,
    } satisfies Money,
    incomeAnnualCouple: {
      amount: 32460,
      year: 2026,
      source: sources.medicareDrugCosts,
      verifiedOn: dataVerifiedOn,
    } satisfies Money,
    resourceSingle: {
      amount: 18090,
      year: 2026,
      source: sources.medicareDrugCosts,
      verifiedOn: dataVerifiedOn,
    } satisfies Money,
    resourceCouple: {
      amount: 36100,
      year: 2026,
      source: sources.medicareDrugCosts,
      verifiedOn: dataVerifiedOn,
    } satisfies Money,
    fplPercent: 150,
  },
};
