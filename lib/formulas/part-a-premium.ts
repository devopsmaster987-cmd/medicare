import { partA2026 } from '@/data/medicare-part-a';
import { partAPenalty } from '@/data/penalties';
import { isFiniteNonNegative, roundMoney } from './shared';

export type PartAPremiumInput = {
  ownQuarters: number;
  married?: boolean;
  spouseQuarters?: number;
  yearsDelayed?: number;
};

export type PartAPremiumResult = {
  year: number;
  ownQuarters: number;
  spouseQuarters: number;
  quartersUsed: number;
  tier: 'free' | 'reduced' | 'full';
  tierLabel: string;
  basePremium: number;
  monthlyPremium: number;
  annualPremium: number;
  premiumFree: boolean;
  yearsDelayed: number;
  penaltyRate: number;
  monthlyPenalty: number;
  penaltyDurationYears: number;
  totalMonthlyDuringPenalty: number;
  penaltyCostDuringDuration: number;
  note: string;
};

function tierForQuarters(quarters: number): PartAPremiumResult['tier'] {
  if (quarters >= 40) return 'free';
  if (quarters >= 30) return 'reduced';
  return 'full';
}

const tierLabels: Record<PartAPremiumResult['tier'], string> = {
  free: 'Premium-free Part A (40 or more quarters)',
  reduced: 'Reduced premium Part A (30 to 39 quarters)',
  full: 'Full premium Part A (fewer than 30 quarters)',
};

export function partAPremiumCalculator(input: PartAPremiumInput): PartAPremiumResult {
  if (!isFiniteNonNegative(input.ownQuarters)) {
    throw new Error('Own quarters must be zero or greater.');
  }
  if (input.spouseQuarters !== undefined && !isFiniteNonNegative(input.spouseQuarters)) {
    throw new Error('Spouse quarters must be zero or greater.');
  }
  const yearsDelayed = input.yearsDelayed ?? 0;
  if (!isFiniteNonNegative(yearsDelayed)) {
    throw new Error('Years delayed must be zero or greater.');
  }

  const ownQuarters = Math.min(40, Math.floor(input.ownQuarters));
  const spouseQuarters =
    input.married && input.spouseQuarters !== undefined
      ? Math.min(40, Math.floor(input.spouseQuarters))
      : 0;
  const quartersUsed = Math.max(ownQuarters, spouseQuarters);
  const tier = tierForQuarters(quartersUsed);

  const basePremium =
    tier === 'free'
      ? partA2026.standardPremium.amount
      : tier === 'reduced'
        ? partA2026.reducedPremium.amount
        : partA2026.fullPremium.amount;

  const fullYearsDelayed = Math.floor(yearsDelayed);
  const penaltyApplies = basePremium > 0 && fullYearsDelayed >= 1;
  const penaltyRate = penaltyApplies ? partAPenalty.ratePerFullYear.rate : 0;
  const monthlyPenalty = penaltyApplies ? roundMoney(basePremium * penaltyRate) : 0;
  const penaltyDurationYears = penaltyApplies ? fullYearsDelayed * partAPenalty.multiplier : 0;
  const totalMonthlyDuringPenalty = roundMoney(basePremium + monthlyPenalty);
  const penaltyCostDuringDuration = penaltyApplies
    ? roundMoney(monthlyPenalty * 12 * penaltyDurationYears)
    : 0;

  let note =
    'With 40 or more quarters of Medicare-covered work by you or your spouse, Part A has no monthly premium.';
  if (tier === 'reduced') {
    note =
      'With 30 to 39 quarters of coverage (your own or your spouse’s), the reduced Part A premium applies. Social Security uses the combined record, and the marriage generally must have lasted at least one year.';
  } else if (tier === 'full') {
    note =
      'With fewer than 30 quarters of coverage, the full Part A premium applies. Part B still requires its own monthly premium regardless of work history.';
  }
  if (penaltyApplies) {
    note += ` A late enrollment penalty of 10% is added for twice the number of full years you delayed signing up.`;
  }

  return {
    year: partA2026.year,
    ownQuarters,
    spouseQuarters,
    quartersUsed,
    tier,
    tierLabel: tierLabels[tier],
    basePremium,
    monthlyPremium: basePremium,
    annualPremium: roundMoney(basePremium * 12),
    premiumFree: tier === 'free',
    yearsDelayed: fullYearsDelayed,
    penaltyRate,
    monthlyPenalty,
    penaltyDurationYears,
    totalMonthlyDuringPenalty,
    penaltyCostDuringDuration,
    note,
  };
}
