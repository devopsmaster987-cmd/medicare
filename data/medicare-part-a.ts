import { sources } from './sources';
import { dataVerifiedOn } from './verified';
import type { Money } from './types';

export const partA2026 = {
  year: 2026,
  standardPremium: {
    amount: 0,
    year: 2026,
    source: sources.cms2026AB,
    verifiedOn: dataVerifiedOn,
    note: 'Most people get premium-free Part A with 40 or more quarters of coverage.',
  } satisfies Money,
  reducedPremium: {
    amount: 311,
    year: 2026,
    source: sources.cms2026AB,
    verifiedOn: dataVerifiedOn,
    note: '30 to 39 quarters of coverage.',
  } satisfies Money,
  fullPremium: {
    amount: 565,
    year: 2026,
    source: sources.cms2026AB,
    verifiedOn: dataVerifiedOn,
    note: 'Fewer than 30 quarters of coverage.',
  } satisfies Money,
  inpatientDeductible: {
    amount: 1736,
    year: 2026,
    source: sources.cms2026AB,
    verifiedOn: dataVerifiedOn,
  } satisfies Money,
  hospitalCoinsuranceDays61to90: {
    amount: 434,
    year: 2026,
    source: sources.cms2026AB,
    verifiedOn: dataVerifiedOn,
  } satisfies Money,
  lifetimeReserveDays: {
    amount: 868,
    year: 2026,
    source: sources.cms2026AB,
    verifiedOn: dataVerifiedOn,
  } satisfies Money,
  skilledNursingDays21to100: {
    amount: 217,
    year: 2026,
    source: sources.cms2026AB,
    verifiedOn: dataVerifiedOn,
  } satisfies Money,
};
