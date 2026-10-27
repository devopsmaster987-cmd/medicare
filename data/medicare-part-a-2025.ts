import { sources } from './sources';
import { dataVerifiedOn } from './verified';
import type { Money } from './types';

export const partA2025 = {
  year: 2025,
  reducedPremium: {
    amount: 285,
    year: 2025,
    source: sources.cms2025AB,
    verifiedOn: dataVerifiedOn,
  } satisfies Money,
  fullPremium: {
    amount: 518,
    year: 2025,
    source: sources.cms2025AB,
    verifiedOn: dataVerifiedOn,
  } satisfies Money,
  inpatientDeductible: {
    amount: 1676,
    year: 2025,
    source: sources.cms2025AB,
    verifiedOn: dataVerifiedOn,
  } satisfies Money,
  hospitalCoinsuranceDays61to90: {
    amount: 419,
    year: 2025,
    source: sources.cms2025AB,
    verifiedOn: dataVerifiedOn,
  } satisfies Money,
  lifetimeReserveDays: {
    amount: 838,
    year: 2025,
    source: sources.cms2025AB,
    verifiedOn: dataVerifiedOn,
  } satisfies Money,
  skilledNursingDays21to100: {
    amount: 209.5,
    year: 2025,
    source: sources.cms2025AB,
    verifiedOn: dataVerifiedOn,
  } satisfies Money,
};
