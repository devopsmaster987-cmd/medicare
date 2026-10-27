import { sources } from './sources';
import { dataVerifiedOn } from './verified';
import type { Money, Rate } from './types';

export const aca2025 = {
  year: 2025,
  affordabilityPercentage: {
    rate: 0.0902,
    year: 2025,
    source: sources.irsRp2024_35,
    verifiedOn: dataVerifiedOn,
  } satisfies Rate,
  outOfPocketMaxSelfOnly: {
    amount: 9200,
    year: 2025,
    source: sources.cms2025CostSharing,
    verifiedOn: dataVerifiedOn,
  } satisfies Money,
  outOfPocketMaxFamily: {
    amount: 18400,
    year: 2025,
    source: sources.cms2025CostSharing,
    verifiedOn: dataVerifiedOn,
  } satisfies Money,
};
