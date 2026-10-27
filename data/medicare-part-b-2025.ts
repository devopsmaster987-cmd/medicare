import { sources } from './sources';
import { dataVerifiedOn } from './verified';
import type { Money } from './types';
import type { IrmaaBracket } from './medicare-part-b';

export const partB2025 = {
  year: 2025,
  standardPremium: {
    amount: 185,
    year: 2025,
    source: sources.cms2025AB,
    verifiedOn: dataVerifiedOn,
  } satisfies Money,
  deductible: {
    amount: 257,
    year: 2025,
    source: sources.cms2025AB,
    verifiedOn: dataVerifiedOn,
  } satisfies Money,
  irmaa: {
    single: [
      { min: 0, max: 106000, partBAdjustment: 0, partDAdjustment: 0, partBTotal: 185 },
      { min: 106001, max: 133000, partBAdjustment: 74, partDAdjustment: 13.7, partBTotal: 259 },
      { min: 133001, max: 167000, partBAdjustment: 185, partDAdjustment: 35.3, partBTotal: 370 },
      { min: 167001, max: 200000, partBAdjustment: 295.9, partDAdjustment: 57, partBTotal: 480.9 },
      { min: 200001, max: 499999, partBAdjustment: 406.9, partDAdjustment: 78.6, partBTotal: 591.9 },
      { min: 500000, max: null, partBAdjustment: 443.9, partDAdjustment: 85.8, partBTotal: 628.9 },
    ].map((bracket) => ({
      ...bracket,
      year: 2025,
      source: sources.cms2025AB,
      verifiedOn: dataVerifiedOn,
    })) as IrmaaBracket[],
    marriedJoint: [
      { min: 0, max: 212000, partBAdjustment: 0, partDAdjustment: 0, partBTotal: 185 },
      { min: 212001, max: 266000, partBAdjustment: 74, partDAdjustment: 13.7, partBTotal: 259 },
      { min: 266001, max: 334000, partBAdjustment: 185, partDAdjustment: 35.3, partBTotal: 370 },
      { min: 334001, max: 400000, partBAdjustment: 295.9, partDAdjustment: 57, partBTotal: 480.9 },
      { min: 400001, max: 749999, partBAdjustment: 406.9, partDAdjustment: 78.6, partBTotal: 591.9 },
      { min: 750000, max: null, partBAdjustment: 443.9, partDAdjustment: 85.8, partBTotal: 628.9 },
    ].map((bracket) => ({
      ...bracket,
      year: 2025,
      source: sources.cms2025AB,
      verifiedOn: dataVerifiedOn,
    })) as IrmaaBracket[],
    marriedSeparate: [
      { min: 0, max: 106000, partBAdjustment: 0, partDAdjustment: 0, partBTotal: 185 },
      { min: 106001, max: 393999, partBAdjustment: 406.9, partDAdjustment: 78.6, partBTotal: 591.9 },
      { min: 394000, max: null, partBAdjustment: 443.9, partDAdjustment: 85.8, partBTotal: 628.9 },
    ].map((bracket) => ({
      ...bracket,
      year: 2025,
      source: sources.cms2025AB,
      verifiedOn: dataVerifiedOn,
    })) as IrmaaBracket[],
  },
};
