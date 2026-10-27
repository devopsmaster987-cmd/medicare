import { sources } from './sources';
import { dataVerifiedOn } from './verified';
import type { FilingStatus, Money, Rate } from './types';

export type IrmaaBracket = {
  min: number;
  max: number | null;
  partBAdjustment: number;
  partDAdjustment: number;
  partBTotal: number;
  year: number;
  source: string;
  verifiedOn: string;
  verify?: boolean;
};

export const partB2026 = {
  year: 2026,
  standardPremium: {
    amount: 202.9,
    year: 2026,
    source: sources.cms2026AB,
    verifiedOn: dataVerifiedOn,
  } satisfies Money,
  deductible: {
    amount: 283,
    year: 2026,
    source: sources.cms2026AB,
    verifiedOn: dataVerifiedOn,
  } satisfies Money,
  immunosuppressivePremium: {
    amount: 121.6,
    year: 2026,
    source: sources.cms2026AB,
    verifiedOn: dataVerifiedOn,
  } satisfies Money,
  coinsuranceRate: {
    rate: 0.2,
    year: 2026,
    source: sources.medicareCosts,
    verifiedOn: dataVerifiedOn,
  } satisfies Rate,
  irmaa: {
    single: [
      { min: 0, max: 109000, partBAdjustment: 0, partDAdjustment: 0, partBTotal: 202.9 },
      { min: 109001, max: 137000, partBAdjustment: 81.2, partDAdjustment: 14.5, partBTotal: 284.1 },
      { min: 137001, max: 171000, partBAdjustment: 202.9, partDAdjustment: 37.5, partBTotal: 405.8 },
      { min: 171001, max: 205000, partBAdjustment: 324.6, partDAdjustment: 60.4, partBTotal: 527.5 },
      { min: 205001, max: 499999, partBAdjustment: 446.3, partDAdjustment: 83.3, partBTotal: 649.2 },
      { min: 500000, max: null, partBAdjustment: 487, partDAdjustment: 91, partBTotal: 689.9 },
    ].map((bracket) => ({
      ...bracket,
      year: 2026,
      source: sources.cms2026AB,
      verifiedOn: dataVerifiedOn,
    })) as IrmaaBracket[],
    marriedJoint: [
      { min: 0, max: 218000, partBAdjustment: 0, partDAdjustment: 0, partBTotal: 202.9 },
      { min: 218001, max: 274000, partBAdjustment: 81.2, partDAdjustment: 14.5, partBTotal: 284.1 },
      { min: 274001, max: 342000, partBAdjustment: 202.9, partDAdjustment: 37.5, partBTotal: 405.8 },
      { min: 342001, max: 410000, partBAdjustment: 324.6, partDAdjustment: 60.4, partBTotal: 527.5 },
      { min: 410001, max: 749999, partBAdjustment: 446.3, partDAdjustment: 83.3, partBTotal: 649.2 },
      { min: 750000, max: null, partBAdjustment: 487, partDAdjustment: 91, partBTotal: 689.9 },
    ].map((bracket) => ({
      ...bracket,
      year: 2026,
      source: sources.cms2026AB,
      verifiedOn: dataVerifiedOn,
    })) as IrmaaBracket[],
    marriedSeparate: [
      { min: 0, max: 109000, partBAdjustment: 0, partDAdjustment: 0, partBTotal: 202.9 },
      { min: 109001, max: 390999, partBAdjustment: 446.3, partDAdjustment: 83.3, partBTotal: 649.2 },
      { min: 391000, max: null, partBAdjustment: 487, partDAdjustment: 91, partBTotal: 689.9 },
    ].map((bracket) => ({
      ...bracket,
      year: 2026,
      source: sources.cms2026AB,
      verifiedOn: dataVerifiedOn,
    })) as IrmaaBracket[],
  },
  lookbackYears: 2,
};

export function irmaaBracketsFor(status: FilingStatus): IrmaaBracket[] {
  if (status === 'marriedJoint') return partB2026.irmaa.marriedJoint;
  if (status === 'marriedSeparate') return partB2026.irmaa.marriedSeparate;
  return partB2026.irmaa.single;
}
