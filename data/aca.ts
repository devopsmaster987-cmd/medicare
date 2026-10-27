import { sources } from './sources';
import { dataVerifiedOn } from './verified';
import type { Money, Rate } from './types';

export type ApplicablePercentageRow = {
  minFplPercent: number;
  maxFplPercent: number | null;
  initialRate: number;
  finalRate: number;
  year: number;
  source: string;
  verifiedOn: string;
};

export const aca2026 = {
  year: 2026,
  affordabilityPercentage: {
    rate: 0.0996,
    year: 2026,
    source: sources.irsRp2025_25,
    verifiedOn: dataVerifiedOn,
  } satisfies Rate,
  outOfPocketMaxSelfOnly: {
    amount: 10600,
    year: 2026,
    source: sources.hhs2026CostSharing,
    verifiedOn: dataVerifiedOn,
  } satisfies Money,
  outOfPocketMaxFamily: {
    amount: 21200,
    year: 2026,
    source: sources.hhs2026CostSharing,
    verifiedOn: dataVerifiedOn,
  } satisfies Money,
  fplYearForSubsidies: 2025,
  subsidyCliffFplPercent: 400,
  enhancedSubsidies: {
    status: 'expired',
    expiredOn: '2025-12-31',
    note: 'The enhanced premium tax credit provisions expired at the end of 2025. For 2026, premium tax credits are generally limited to households at or below 400% of the federal poverty level.',
    source: sources.crsEnhancedPtc,
    verifiedOn: dataVerifiedOn,
    year: 2026,
  },
  applicablePercentageTable: [
    { minFplPercent: 0, maxFplPercent: 133, initialRate: 0.021, finalRate: 0.021 },
    { minFplPercent: 133, maxFplPercent: 150, initialRate: 0.0314, finalRate: 0.0419 },
    { minFplPercent: 150, maxFplPercent: 200, initialRate: 0.0419, finalRate: 0.066 },
    { minFplPercent: 200, maxFplPercent: 250, initialRate: 0.066, finalRate: 0.0844 },
    { minFplPercent: 250, maxFplPercent: 300, initialRate: 0.0844, finalRate: 0.0996 },
    { minFplPercent: 300, maxFplPercent: 400, initialRate: 0.0996, finalRate: 0.0996 },
  ].map((row) => ({
    ...row,
    year: 2026,
    source: sources.irsRp2025_25,
    verifiedOn: dataVerifiedOn,
  })) as ApplicablePercentageRow[],
};
