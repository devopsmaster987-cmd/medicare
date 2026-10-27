import { partA2026 } from '@/data/medicare-part-a';
import { partB2026 } from '@/data/medicare-part-b';
import { irs2026 } from '@/data/irs';
import { isFiniteNonNegative, roundMoney } from './shared';

export type CoverageType = 'active' | 'retiree' | 'cobra' | 'none';

export type MedicareVsAcaInput = {
  age: number;
  employerSize?: number;
  coverageType: CoverageType;
  creditableCoverage?: boolean;
  hasHsa?: boolean;
  workCredits?: number;
  premiumFreePartA?: boolean;
};

export type MedicareVsAcaPath =
  | 'aca-or-employer'
  | 'delay-part-b'
  | 'enroll-medicare'
  | 'compare-aca'
  | 'compare-part-a-only';

export type PartAStatus = 'premium-free' | 'reduced' | 'full' | 'unknown';

export type MedicareVsAcaResult = {
  year: number;
  medicareEligible: boolean;
  premiumFreePartA: boolean;
  partAStatus: PartAStatus;
  path: MedicareVsAcaPath;
  pathLabel: string;
  reasons: string[];
  warnings: string[];
  acaSubsidyStatus: 'ends' | 'check-marketplace' | 'not-eligible-with-employer';
  annualPartBPremium: number;
  annualPartAPremium: number;
  annualMedicarePremiumEstimate: number;
  costDeltaNote: string;
  deadlines: Array<{ label: string; detail: string }>;
};

function partAStatusFromInput(input: MedicareVsAcaInput): PartAStatus {
  if (input.workCredits !== undefined) {
    if (input.workCredits >= 40) return 'premium-free';
    if (input.workCredits >= 30) return 'reduced';
    return 'full';
  }
  if (input.premiumFreePartA === true) return 'premium-free';
  if (input.premiumFreePartA === false) return 'full';
  return 'unknown';
}

export function medicareVsAca(input: MedicareVsAcaInput): MedicareVsAcaResult {
  if (!isFiniteNonNegative(input.age)) {
    throw new Error('Age must be zero or greater.');
  }
  if (input.employerSize !== undefined && !isFiniteNonNegative(input.employerSize)) {
    throw new Error('Employer size must be zero or greater.');
  }
  if (input.workCredits !== undefined && !isFiniteNonNegative(input.workCredits)) {
    throw new Error('Work credits must be zero or greater.');
  }

  const medicareEligible = input.age >= 65;
  const partAStatus = partAStatusFromInput(input);
  const premiumFreePartA = partAStatus === 'premium-free';
  const annualPartBPremium = roundMoney(partB2026.standardPremium.amount * 12);
  const annualPartAPremium =
    partAStatus === 'premium-free'
      ? 0
      : partAStatus === 'reduced'
        ? roundMoney(partA2026.reducedPremium.amount * 12)
        : roundMoney(partA2026.fullPremium.amount * 12);
  const annualMedicarePremiumEstimate = roundMoney(annualPartBPremium + annualPartAPremium);
  const reasons: string[] = [];
  const warnings: string[] = [];
  const employerSize = input.employerSize ?? 0;
  const activeLargeEmployer =
    input.coverageType === 'active' && employerSize >= irs2026.employerSizeRule.employees;
  const activeSmallEmployer =
    input.coverageType === 'active' && employerSize < irs2026.employerSizeRule.employees;

  let path: MedicareVsAcaPath;
  let acaSubsidyStatus: MedicareVsAcaResult['acaSubsidyStatus'];

  if (!medicareEligible) {
    path = 'aca-or-employer';
    reasons.push('You are under 65, so Medicare is not generally available unless you qualify through disability.');
    reasons.push('Compare your employer plan with a Marketplace plan and any premium tax credit.');
    acaSubsidyStatus =
      input.coverageType === 'active' ? 'not-eligible-with-employer' : 'check-marketplace';
  } else if (activeLargeEmployer && input.creditableCoverage !== false) {
    path = premiumFreePartA ? 'delay-part-b' : 'compare-part-a-only';
    reasons.push('Your current employer has 20 or more employees, so the group health plan generally pays first.');
    reasons.push('You can usually delay Part B without a penalty while you have creditable coverage.');
    acaSubsidyStatus = premiumFreePartA ? 'ends' : 'check-marketplace';
    if (premiumFreePartA) {
      warnings.push('Marketplace premium tax credits generally end once you are eligible for premium-free Part A.');
    }
  } else if (activeLargeEmployer && input.creditableCoverage === false) {
    path = 'enroll-medicare';
    reasons.push('Your employer plan is not creditable coverage for Medicare purposes.');
    reasons.push('Delaying Part B would expose you to a permanent late-enrollment penalty.');
    acaSubsidyStatus = premiumFreePartA ? 'ends' : 'check-marketplace';
  } else if (activeSmallEmployer) {
    path = 'enroll-medicare';
    reasons.push('Your employer has fewer than 20 employees, so Medicare generally pays first.');
    reasons.push('Enrolling in Part B avoids gaps and penalty risk.');
    acaSubsidyStatus = premiumFreePartA ? 'ends' : 'check-marketplace';
  } else if (input.coverageType === 'retiree' || input.coverageType === 'cobra') {
    path = 'enroll-medicare';
    reasons.push('Retiree and COBRA coverage generally pay after Medicare.');
    reasons.push('Enroll during your Initial Enrollment Period or a valid Special Enrollment Period.');
    acaSubsidyStatus = premiumFreePartA ? 'ends' : 'check-marketplace';
  } else if (premiumFreePartA) {
    path = 'enroll-medicare';
    reasons.push('You are 65 or older and do not have active employer coverage.');
    reasons.push('Premium-free Part A plus Part B is usually the strongest path.');
    acaSubsidyStatus = 'ends';
  } else {
    path = 'compare-aca';
    reasons.push('You are 65 or older but do not qualify for premium-free Part A.');
    reasons.push('Compare the cost of buying Part A and Part B with a Marketplace plan and any premium tax credit.');
    acaSubsidyStatus = 'check-marketplace';
  }

  if (partAStatus === 'unknown' && medicareEligible) {
    warnings.push(
      'Part A premium-free status was not confirmed. This estimate assumes the full Part A premium until you confirm your work credits with Social Security.',
    );
  }

  if (activeLargeEmployer && input.creditableCoverage === undefined) {
    warnings.push(
      'Confirm with the employer plan that the coverage is creditable for Medicare. If it is not, delaying Part B can create a permanent penalty.',
    );
  }

  if (input.hasHsa) {
    warnings.push(
      'Stop HSA contributions six months before Medicare Part A begins. Part A can be backdated up to six months.',
    );
  }

  if (path === 'delay-part-b') {
    warnings.push('You have eight months after active employer coverage ends to sign up for Part B without a penalty.');
  }

  const pathLabels: Record<MedicareVsAcaPath, string> = {
    'aca-or-employer': 'Compare ACA Marketplace and employer coverage',
    'delay-part-b': 'You can generally delay Part B',
    'enroll-medicare': 'Enroll in Medicare now',
    'compare-aca': 'Compare Medicare with a Marketplace plan',
    'compare-part-a-only': 'Compare buying Part A with delaying Part B',
  };

  return {
    year: partB2026.year,
    medicareEligible,
    premiumFreePartA,
    partAStatus,
    path,
    pathLabel: pathLabels[path],
    reasons,
    warnings,
    acaSubsidyStatus,
    annualPartBPremium,
    annualPartAPremium,
    annualMedicarePremiumEstimate,
    costDeltaNote: `At the ${partB2026.year} standard premium, Part B costs $${annualPartBPremium.toFixed(2)} a year. ${partAStatus === 'premium-free' ? 'Part A is premium-free.' : partAStatus === 'reduced' ? `Part A uses the reduced premium and costs $${annualPartAPremium.toFixed(2)} a year.` : partAStatus === 'unknown' ? `Part A is estimated at the full premium of $${annualPartAPremium.toFixed(2)} a year until eligibility is confirmed.` : `Part A costs $${annualPartAPremium.toFixed(2)} a year without premium-free eligibility.`} A Marketplace benchmark premium is not included.`,
    deadlines: [
      { label: 'Initial Enrollment Period', detail: 'Seven months starting three months before the month you turn 65.' },
      { label: 'Special Enrollment Period', detail: 'Up to eight months after active employer coverage ends, if you qualify.' },
      { label: 'General Enrollment Period', detail: 'January 1 through March 31 each year for missed sign-ups.' },
      { label: 'HSA stop date', detail: 'Six months before Part A starts if you contribute to an HSA.' },
    ],
  };
}
