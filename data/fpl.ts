import { sources } from './sources';
import { dataVerifiedOn } from './verified';

export type FplTable = {
  year: number;
  source: string;
  verifiedOn: string;
  annual: Record<number, number>;
  addPerPerson: number;
  note?: string;
  verify?: boolean;
};

export const fpl2026: FplTable = {
  year: 2026,
  source: sources.aspePoverty,
  verifiedOn: dataVerifiedOn,
  annual: {
    1: 15960,
    2: 21640,
    3: 27320,
    4: 33000,
    5: 38680,
    6: 44360,
    7: 50040,
    8: 55720,
  },
  addPerPerson: 5680,
  note: '48 contiguous states and DC. Alaska and Hawaii use higher guidelines.',
};

export const fpl2025: FplTable = {
  year: 2025,
  source: sources.aspePoverty,
  verifiedOn: dataVerifiedOn,
  annual: {
    1: 15650,
    2: 21150,
    3: 26650,
    4: 32150,
    5: 37650,
    6: 43150,
    7: 48650,
    8: 54150,
  },
  addPerPerson: 5500,
  note: 'Used for 2026 premium tax credit eligibility because the Marketplace uses the prior-year guidelines.',
};

export const fplTables: Record<number, FplTable> = {
  2025: fpl2025,
  2026: fpl2026,
};

export function fplAnnual(year: number, householdSize: number): number {
  const table = fplTables[year];
  if (!table) throw new Error(`No FPL table for ${year}`);
  const size = Math.max(1, Math.floor(householdSize));
  if (size <= 8) return table.annual[size];
  return table.annual[8] + (size - 8) * table.addPerPerson;
}

export function fplMonthly(year: number, householdSize: number): number {
  return fplAnnual(year, householdSize) / 12;
}
