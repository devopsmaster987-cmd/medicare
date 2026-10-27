import { sources } from './sources';
import { dataVerifiedOn } from './verified';
import type { Rate } from './types';

export const irs2025 = {
  year: 2025,
  employerAffordabilityPercentage: {
    rate: 0.0902,
    year: 2025,
    source: sources.irsRp2024_35,
    verifiedOn: dataVerifiedOn,
  } satisfies Rate,
};
