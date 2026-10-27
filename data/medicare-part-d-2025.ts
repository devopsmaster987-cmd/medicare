import { sources } from './sources';
import { dataVerifiedOn } from './verified';
import type { Money } from './types';

export const partD2025 = {
  year: 2025,
  baseBeneficiaryPremium: {
    amount: 36.78,
    year: 2025,
    source: sources.cms2025PartD,
    verifiedOn: dataVerifiedOn,
  } satisfies Money,
  deductible: {
    amount: 590,
    year: 2025,
    source: sources.cms2025PartDRedesign,
    verifiedOn: dataVerifiedOn,
  } satisfies Money,
  outOfPocketCap: {
    amount: 2000,
    year: 2025,
    source: sources.cms2025PartDRedesign,
    verifiedOn: dataVerifiedOn,
  } satisfies Money,
};
