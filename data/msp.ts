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
  note?: string;
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
    note: 'The $18,090 and $36,100 figures include the $1,500 per person burial exclusion. Without that exclusion, the CMS base limits are $16,590 and $33,100.',
  },
};

export const burialExclusion = {
  amount: 1500,
  year: 2026,
  source: sources.ecfrBurial,
  verifiedOn: dataVerifiedOn,
} satisfies Money;

export const extraHelpBaseResource = {
  single: {
    amount: 16590,
    year: 2026,
    source: sources.cms2026Lis,
    verifiedOn: dataVerifiedOn,
  } satisfies Money,
  couple: {
    amount: 33100,
    year: 2026,
    source: sources.cms2026Lis,
    verifiedOn: dataVerifiedOn,
  } satisfies Money,
};

export const mspProgramOrder: MspProgramKey[] = ['qmb', 'slmb', 'qi', 'qdwi', 'extraHelp'];

export type StateMspProgramRule = {
  available: boolean;
  monthlySingle: number;
  monthlyCouple: number;
  fplPercent: number;
  monthlyDisregard: number;
  note?: string;
};

export type StateMspRules = {
  year: number;
  source: string;
  verifiedOn: string;
  assetTest: boolean;
  resourceSingle?: number;
  resourceCouple?: number;
  resourcePerAdditional?: number;
  programs: Partial<Record<'qmb' | 'slmb' | 'qi', StateMspProgramRule>>;
  note?: string;
};

export const stateMspRules: Record<string, StateMspRules> = {
  CA: {
    year: 2026,
    source: sources.caDhcsMsp,
    verifiedOn: dataVerifiedOn,
    assetTest: true,
    resourceSingle: 130000,
    resourceCouple: 195000,
    resourcePerAdditional: 65000,
    programs: {
      qmb: {
        available: true,
        monthlySingle: 1330,
        monthlyCouple: 1804,
        fplPercent: 1,
        monthlyDisregard: 0,
        note: 'DHCS publishes a gross monthly income limit at 100% of the federal poverty level.',
      },
      slmb: {
        available: true,
        monthlySingle: 1596,
        monthlyCouple: 2165,
        fplPercent: 1.2,
        monthlyDisregard: 0,
      },
      qi: {
        available: true,
        monthlySingle: 1796,
        monthlyCouple: 2436,
        fplPercent: 1.35,
        monthlyDisregard: 0,
      },
    },
    note: 'California uses higher asset limits than the federal MSP limits: $130,000 for an individual and $195,000 for a couple starting January 1, 2026.',
  },
  NY: {
    year: 2026,
    source: sources.nyDohMsp,
    verifiedOn: dataVerifiedOn,
    assetTest: false,
    programs: {
      qmb: {
        available: true,
        monthlySingle: 1856,
        monthlyCouple: 2509,
        fplPercent: 1.38,
        monthlyDisregard: 20,
        note: 'New York sets QMB at 138% of the federal poverty level plus the $20 disregard.',
      },
      slmb: {
        available: false,
        monthlySingle: 0,
        monthlyCouple: 0,
        fplPercent: 1.2,
        monthlyDisregard: 20,
        note: 'New York no longer runs SLMB as a separate program. Use the QMB and QI tests.',
      },
      qi: {
        available: true,
        monthlySingle: 2494,
        monthlyCouple: 3375,
        fplPercent: 1.86,
        monthlyDisregard: 20,
        note: 'New York sets QI below 186% of the federal poverty level plus the $20 disregard.',
      },
    },
    note: 'New York has no asset test for QMB or QI, and SLMB is no longer a separate program in the state.',
  },
  AZ: {
    year: 2026,
    source: sources.azAhcccsMsp,
    verifiedOn: dataVerifiedOn,
    assetTest: false,
    programs: {
      qmb: {
        available: true,
        monthlySingle: 1330,
        monthlyCouple: 1804,
        fplPercent: 1,
        monthlyDisregard: 0,
        note: 'AHCCCS lists 100% of the federal poverty level as the QMB income limit.',
      },
      slmb: {
        available: true,
        monthlySingle: 1596,
        monthlyCouple: 2164,
        fplPercent: 1.2,
        monthlyDisregard: 0,
      },
      qi: {
        available: true,
        monthlySingle: 1796,
        monthlyCouple: 2435,
        fplPercent: 1.35,
        monthlyDisregard: 0,
      },
    },
    note: 'AHCCCS does not list a resource test for QMB, SLMB, or QI in its February 2026 eligibility chart.',
  },
};

export function stateMspRulesFor(stateAbbr: string): StateMspRules | undefined {
  return stateMspRules[stateAbbr.toUpperCase()];
}

export function stateMspMonthlyLimit(
  stateAbbr: string,
  programKey: 'qmb' | 'slmb' | 'qi',
  householdSize: number,
): number | null {
  const rule = stateMspRulesFor(stateAbbr)?.programs[programKey];
  if (!rule || !rule.available) return null;
  if (householdSize <= 1) return rule.monthlySingle;
  if (householdSize === 2) return rule.monthlyCouple;
  return Math.ceil(fplMonthly(2026, householdSize) * rule.fplPercent + rule.monthlyDisregard);
}

export function stateMspResourceLimit(
  stateAbbr: string,
  householdSize: number,
): number | null | undefined {
  const rules = stateMspRulesFor(stateAbbr);
  if (!rules) return undefined;
  if (!rules.assetTest) return null;
  if (householdSize <= 1) return rules.resourceSingle ?? null;
  if (rules.resourcePerAdditional !== undefined && rules.resourceSingle !== undefined) {
    return rules.resourceSingle + (householdSize - 1) * rules.resourcePerAdditional;
  }
  return rules.resourceCouple ?? null;
}

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
