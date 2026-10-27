import { fplAnnual } from '@/data/fpl';
import {
  extraHelpAnnualIncomeLimit,
  mspMonthlyIncomeLimit,
  mspPrograms,
  mspResourceLimit,
  type MspProgramKey,
} from '@/data/msp';
import { partB2026 } from '@/data/medicare-part-b';
import { partD2026 } from '@/data/medicare-part-d';
import type { StateInfo } from '@/data/states';
import { isFiniteNonNegative, roundMoney } from './shared';

export type MspInput = {
  stateAbbr: string;
  state: StateInfo;
  householdSize: number;
  monthlyIncome: number;
  countableAssets: number;
  year?: number;
};

export type MspProgramResult = {
  key: MspProgramKey;
  name: string;
  incomeLimitMonthly: number | null;
  incomeLimitAnnual: number | null;
  resourceLimit: number | null;
  assetTestApplied: boolean;
  incomeEligible: boolean;
  assetEligible: boolean;
  eligible: boolean;
  closeToLimit: boolean;
  estimatedMonthlyValue: number;
  estimatedAnnualValue: number;
  whatItPays: string;
};

export type MspResult = {
  year: number;
  stateCovered: boolean;
  stateName: string;
  stateAgencyName: string;
  stateAgencyUrl: string;
  assetTestApplied: boolean;
  fplAnnual: number;
  incomePercentOfFpl: number;
  programs: MspProgramResult[];
  likelyPrograms: MspProgramKey[];
  estimatedMonthlyValue: number;
  estimatedAnnualValue: number;
  applyAnyway: boolean;
  message: string;
};

export function mspEligibility(input: MspInput): MspResult {
  const year = input.year ?? mspPrograms.qmb.year;
  const state = input.state;
  if (state.abbr !== input.stateAbbr) {
    throw new Error('State data does not match the state abbreviation.');
  }
  if (!Number.isFinite(input.householdSize) || input.householdSize < 1) {
    throw new Error('Household size must be at least 1.');
  }
  if (!isFiniteNonNegative(input.monthlyIncome)) {
    throw new Error('Monthly income must be zero or greater.');
  }
  if (!isFiniteNonNegative(input.countableAssets)) {
    throw new Error('Countable assets must be zero or greater.');
  }

  const annualIncome = input.monthlyIncome * 12;
  const fpl = fplAnnual(year, input.householdSize);
  const incomePercentOfFpl = fpl === 0 ? 0 : annualIncome / fpl;

  if (!state.mspCovered) {
    return {
      year,
      stateCovered: false,
      stateName: state.name,
      stateAgencyName: state.agencyName,
      stateAgencyUrl: state.agencyUrl,
      assetTestApplied: false,
      fplAnnual: fpl,
      incomePercentOfFpl,
      programs: [],
      likelyPrograms: [],
      estimatedMonthlyValue: 0,
      estimatedAnnualValue: 0,
      applyAnyway: false,
      message: `MedicareClear does not yet cover ${state.name}'s state-specific rules. Use the state Medicaid agency link to check the current limits.`,
    };
  }

  const programKeys: MspProgramKey[] = ['qmb', 'slmb', 'qi', 'extraHelp'];
  const programs = programKeys.map((key): MspProgramResult => {
    const program = mspPrograms[key];
    const incomeLimitMonthly = mspMonthlyIncomeLimit(program, input.householdSize, year);
    const incomeLimitAnnual =
      key === 'extraHelp'
        ? extraHelpAnnualIncomeLimit(input.householdSize, year)
        : incomeLimitMonthly === null
          ? null
          : roundMoney(incomeLimitMonthly * 12);
    const assetTestApplied = key !== 'extraHelp' ? state.assetTest : true;
    const resourceLimit = assetTestApplied
      ? mspResourceLimit(program, input.householdSize)
      : null;
    const incomeEligible =
      key === 'extraHelp'
        ? annualIncome <= (incomeLimitAnnual ?? 0)
        : incomeLimitMonthly !== null && input.monthlyIncome <= incomeLimitMonthly;
    const assetEligible =
      resourceLimit === null || input.countableAssets <= resourceLimit;
    const eligible = incomeEligible && assetEligible;
    const incomeClose =
      (incomeLimitMonthly !== null && input.monthlyIncome <= incomeLimitMonthly * 1.1) ||
      (incomeLimitAnnual !== null && annualIncome <= incomeLimitAnnual * 1.1);
    const assetClose =
      resourceLimit === null || input.countableAssets <= resourceLimit * 1.1;
    const closeToLimit = incomeClose && assetClose;

    let estimatedMonthlyValue = 0;
    if (eligible) {
      if (key === 'qmb' || key === 'slmb' || key === 'qi') {
        estimatedMonthlyValue = partB2026.standardPremium.amount;
      } else if (key === 'extraHelp') {
        estimatedMonthlyValue = partD2026.baseBeneficiaryPremium.amount;
      }
    }

    return {
      key,
      name: program.name,
      incomeLimitMonthly,
      incomeLimitAnnual,
      resourceLimit,
      assetTestApplied,
      incomeEligible,
      assetEligible,
      eligible,
      closeToLimit,
      estimatedMonthlyValue: roundMoney(estimatedMonthlyValue),
      estimatedAnnualValue: roundMoney(estimatedMonthlyValue * 12),
      whatItPays: program.whatItPays,
    };
  });

  const bestPartBProgram = programs.find(
    (program) => program.eligible && ['qmb', 'slmb', 'qi'].includes(program.key),
  );
  const extraHelp = programs.find((program) => program.key === 'extraHelp' && program.eligible);
  const partBValue =
    bestPartBProgram !== undefined ? partB2026.standardPremium.amount : 0;
  const extraHelpValue = extraHelp ? partD2026.baseBeneficiaryPremium.amount : 0;
  const estimatedMonthlyValue = roundMoney(partBValue + extraHelpValue);
  const likelyPrograms: MspProgramKey[] = [];
  if (bestPartBProgram) likelyPrograms.push(bestPartBProgram.key);
  if (extraHelp) likelyPrograms.push(extraHelp.key);
  const applyAnyway = programs.some((program) => !program.eligible && program.closeToLimit);

  return {
    year,
    stateCovered: true,
    stateName: state.name,
    stateAgencyName: state.agencyName,
    stateAgencyUrl: state.agencyUrl,
    assetTestApplied: state.assetTest,
    fplAnnual: fpl,
    incomePercentOfFpl,
    programs,
    likelyPrograms,
    estimatedMonthlyValue,
    estimatedAnnualValue: roundMoney(estimatedMonthlyValue * 12),
    applyAnyway,
    message:
      likelyPrograms.length > 0
        ? 'You appear to meet the federal income and resource tests for at least one program. Apply through your state agency because state disregards and rules can change the result.'
        : applyAnyway
          ? 'You are close to a limit. Apply anyway: some states disregard part of your income, and the agency makes the final decision.'
          : 'You appear to be over the federal limits in this version. State rules can be more generous, so check with your state agency.',
  };
}
