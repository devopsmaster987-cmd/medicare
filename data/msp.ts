import { fplAnnual, fplMonthly } from './fpl';
import { sources } from './sources';
import { dataVerifiedOn } from './verified';
import type { Money } from './types';

export type MspProgramKey = 'qmb' | 'slmb' | 'qi' | 'qdwi' | 'extraHelp';

export type MspProgram = {
  key: MspProgramKey;
  name: string;
  shortName: string;
  fplPercent: number;
  monthlyDisregard: number;
  resourceSingle: Money;
  resourceCouple: Money;
  anchorMonthlySingle?: number;
  anchorMonthlyCouple?: number;
  whatItPays: string;
  source: string;
  verifiedOn: string;
  year: number;
};

const sharedMspResources = {
  year: 2026,
  source: sources.medicareMsp,
  verifiedOn: dataVerifiedOn,
};

export const mspPrograms: Record<MspProgramKey, MspProgram> = {
  qmb: {
    key: 'qmb',
    name: 'Qualified Medicare Beneficiary (QMB)',
    shortName: 'QMB',
    fplPercent: 1,
    monthlyDisregard: 20,
    resourceSingle: { ...sharedMspResources, amount: 9950 } satisfies Money,
    resourceCouple: { ...sharedMspResources, amount: 14910 } satisfies Money,
    anchorMonthlySingle: 1350,
    anchorMonthlyCouple: 1824,
    whatItPays:
      'Part A and Part B premiums, deductibles, coinsurance, and copayments for covered services.',
    source: sources.medicareMsp,
    verifiedOn: dataVerifiedOn,
    year: 2026,
  },
  slmb: {
    key: 'slmb',
    name: 'Specified Low-Income Medicare Beneficiary (SLMB)',
    shortName: 'SLMB',
    fplPercent: 1.2,
    monthlyDisregard: 20,
    resourceSingle: { ...sharedMspResources, amount: 9950 } satisfies Money,
    resourceCouple: { ...sharedMspResources, amount: 14910 } satisfies Money,
    anchorMonthlySingle: 1616,
    anchorMonthlyCouple: 2184,
    whatItPays: 'Part B premiums only. You must have Part A.',
    source: sources.medicareMsp,
    verifiedOn: dataVerifiedOn,
    year: 2026,
  },
  qi: {
    key: 'qi',
    name: 'Qualifying Individual (QI)',
    shortName: 'QI',
    fplPercent: 1.35,
    monthlyDisregard: 20,
    resourceSingle: { ...sharedMspResources, amount: 9950 } satisfies Money,
    resourceCouple: { ...sharedMspResources, amount: 14910 } satisfies Money,
    anchorMonthlySingle: 1816,
    anchorMonthlyCouple: 2455,
    whatItPays: 'Part B premiums only. Funding is limited and applications are first-come.',
    source: sources.medicareMsp,
    verifiedOn: dataVerifiedOn,
    year: 2026,
  },
  qdwi: {
    key: 'qdwi',
    name: 'Qualified Disabled and Working Individuals (QDWI)',
    shortName: 'QDWI',
    fplPercent: 2,
    monthlyDisregard: 0,
    resourceSingle: { ...sharedMspResources, amount: 4000 } satisfies Money,
    resourceCouple: { ...sharedMspResources, amount: 6000 } satisfies Money,
    anchorMonthlySingle: 5405,
    anchorMonthlyCouple: 7299,
    whatItPays: 'Part A premiums only for some working people with disabilities.',
    source: sources.medicareMsp,
    verifiedOn: dataVerifiedOn,
    year: 2026,
  },
  extraHelp: {
    key: 'extraHelp',
    name: 'Extra Help (Part D Low-Income Subsidy)',
    shortName: 'Extra Help',
    fplPercent: 1.5,
    monthlyDisregard: 0,
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
    whatItPays: 'Part D premiums, deductible, and copays, with amounts depending on income.',
    source: sources.medicareDrugCosts,
    verifiedOn: dataVerifiedOn,
    year: 2026,
  },
};

export const mspProgramOrder: MspProgramKey[] = ['qmb', 'slmb', 'qi', 'qdwi', 'extraHelp'];

export function mspMonthlyIncomeLimit(
  program: MspProgram,
  householdSize: number,
  year = 2026,
): number | null {
  if (program.key === 'extraHelp') return null;
  if (program.key === 'qdwi') {
    if (householdSize === 1 && program.anchorMonthlySingle !== undefined) {
      return program.anchorMonthlySingle;
    }
    if (householdSize === 2 && program.anchorMonthlyCouple !== undefined) {
      return program.anchorMonthlyCouple;
    }
    return null;
  }
  return Math.ceil(fplMonthly(year, householdSize) * program.fplPercent + program.monthlyDisregard);
}

export function extraHelpAnnualIncomeLimit(
  householdSize: number,
  year = 2026,
  program = mspPrograms.extraHelp,
): number {
  return Math.ceil(fplAnnual(year, householdSize) * program.fplPercent);
}

export function mspResourceLimit(
  program: MspProgram,
  householdSize: number,
): number {
  return householdSize >= 2 ? program.resourceCouple.amount : program.resourceSingle.amount;
}
