import { S, F, CHECKED, money, num, pct, link, row } from './text';
import { ACA, B, D, MSP, irmaaBracketsFor } from './figures';
import type { GlossaryTerm } from './types';

export const termsS: GlossaryTerm[] = [
  {
    term: 'SLMB',
    definition:
      'Specified Low-Income Medicare Beneficiary: the Medicare Savings Program tier that pays the Part B premium for people just over the QMB line.',
    whyItMatters: [
      'SLMB is the rung for households with income slightly above the poverty guideline: the assets test still passes and the Part B premium gets paid, but cost sharing stays with the member. The dollar value is easy to see because it equals the Part B premium itself, and for households that lose the QMB line by a few dollars, this tier still saves more than a Social Security cola does in a short year.',
    ],
    exactHeading: `The exact line for ${F}`,
    exact: [
      `Counted monthly income tops out near ${money(MSP.slmb.anchorMonthlySingle)} for one person in ${F}, which is 120 percent of the poverty guideline with the disregard folded in, and about ${money(MSP.slmb.anchorMonthlyCouple)} for a couple, per Medicare.gov (${S.medicareMsp}). Resource limits are ${money(MSP.slmb.resourceSingle.amount)} single and ${money(MSP.slmb.resourceCouple.amount)} couple.`,
      `The benefit is the Part B premium only, which is ${money(B.standardPremium.amount)} a month in ${F}; QMB remains the tier that also pays premiums and cost sharing.`,
    ],
    worked:
      `A single retiree with ${money(1420)} a month of counted income clears the SLMB line and misses QMB. The state pays her ${money(B.standardPremium.amount)} Part B premium, so Social Security keeps roughly ${money(B.standardPremium.amount * 12)} a year it would otherwise send out, and Part D gets the Extra Help package automatically.`,
    calculators: [
      link('/calculators/medicare-savings-program-extra-help/', 'MSP + Extra Help calculator', 'Screens QMB, SLMB, and QI together and values the premium each tier absorbs.'),
    ],
    related: ['QMB', 'QI', 'MSP', 'Extra Help'],
    sources: [
      row(`SLMB income anchor, ${F}`, money(MSP.slmb.anchorMonthlySingle ?? 0), S.medicareMsp, 'Medicare.gov, Medicare Savings Programs'),
      row(`Part B premium paid, ${F}`, money(B.standardPremium.amount), S.cms2026AB, 'CMS fact sheet, Parts A & B premiums and deductibles'),
    ],
    updatedOn: CHECKED,
  },
  {
    term: 'Spend-down',
    definition:
      'A state Medicaid process that lets someone with income over the limit qualify by spending the excess amount on medical costs during the period.',
    whyItMatters: [
      'Spend-down matters most for people whose income sits just over a limit but whose real medical bills would eat the difference anyway. Not every state offers a spend-down path into Medicaid or Medicare Savings Program territory, and where it exists the mechanics differ by state. It is best understood as a calculated, dated, state-level last resort.',
    ],
    exactHeading: 'The exact mechanics',
    exact: [
      `Some states treat Medicaid like an income-difference test: the applicant subtracts incurred medical bills from countable income over the limit, and what remains decides whether Medicaid can qualify for the segment of time, per state Medicaid agencies reachable through the official locator below.`,
      `The process is really a state-specific claim about a given month, no matter how late in the year; the bills only need to be the applicant's own eligible medical costs.`,
    ],
    worked:
      `A retiree has ${money(150)} a month of counted income above her state's Medicaid line. Her state offers a six-month spend-down path, and her out-of-pocket medical costs already run at least ${money(900)} across each period, so she files claims with the receipts and lands Medicaid for the Covered segment; the QMB premium savings follow.`,
    calculators: [
      link('/calculators/medicare-savings-program-extra-help/', 'MSP + Extra Help calculator', 'Flags where the state program structure can matter and points to the official channel.'),
    ],
    related: ['Income disregard', 'Medicaid', 'State Medicaid agency', 'MSP'],
    sources: [
      row('State locator', 'Official state Medicaid agency list', S.medicaidGovByState, 'Medicaid.gov, state office locator'),
    ],
    updatedOn: CHECKED,
  },
  {
    term: 'State Medicaid agency',
    definition:
      'The state office that runs Medicaid and decides most of the state-specific programs around it, including the Medicare Savings Programs.',
    whyItMatters: [
      'Nearly every low-income question near Medicare ends at the state Medicaid office: the applications, the disregards, the spend-down rules, and the denial letters all live there. Federal ceilings exist, but the office that actually decides is state-level, so the staff, forms, and timing are what applicants face. Knowing the right office name and link keeps applications from drifting to the wrong desk.',
    ],
    exactHeading: 'Where to file',
    exact: [
      `States list their Medicaid agency through the official locator on Medicaid.gov (${S.medicaidGovByState}), which is where MSP applications usually route, along with savings-program help, spend-down questions, and asset documentation.`,
      `The office also processes Extra Help forwarding when Medicare asks the state about an application, and SHIP counselors often sit outside the agency but work with its forms.`,
    ],
    worked:
      `A retired nurse applies three ways at once: a mail-in enrollment with the state Medicaid office covering QMB, a phone call to the same office to track the case number, and a SHIP appointment to review whether documentation needs anything. Two weeks later the state confirms the QMB approval, and the Part B billing changes the following month.`,
    calculators: [
      link('/calculators/medicare-savings-program-extra-help/', 'MSP + Extra Help calculator', 'Supplies the confirmed agency name and link for every launch state it covers.'),
    ],
    related: ['SHIP', 'MSP', 'Medicaid', 'Spend-down'],
    sources: [
      row('Official locator', 'State Medicaid agency list, by state', S.medicaidGovByState, 'Medicaid.gov, state office locator'),
    ],
    updatedOn: CHECKED,
  },
  {
    term: 'Subsidy',
    definition:
      'Financial help that lowers the cost of coverage or care; the rules, credits, and eligibility tests differ by program.',
    whyItMatters: [
      'Subsidy is the umbrella word across this whole space: marketplace premium tax credits, cost-sharing reductions, Extra Help, and state savings programs are each subsidy programs with their own tests. The tests do not transfer between programs, so an income that qualifies for one can fail the next, and an application intended for one can quietly fit another.',
    ],
    exactHeading: 'The exact landscape',
    exact: [
      `Federal programs in this space include the marketplace premium and cost-sharing help documented on HealthCare.gov's savings page (${S.healthcareSavings}), Extra Help for drug costs (${S.medicareDrugCosts}), and the state-administered Medicare Savings Programs (${S.medicareMsp}).`,
      `Where they overlap, the generous tiers feed forward: Medicare Savings Program approval generally produces Extra Help automatically, while a failed employer affordability test generally opens the marketplace credit door.`,
    ],
    worked:
      `A household that fails the employer affordability test applies for marketplace coverage and picks a Silver plan: the income share caps at the published percentages, the cost-sharing reductions shrink the deductible, and the premium tax credit covers the gap between their contribution and the benchmark price. Three overlapping subsidy programs are doing three different jobs in the same application.`,
    calculators: [
      link('/calculators/employer-coverage-affordability/', 'Employer coverage affordability', 'Defines exactly which subsidy the failed employer test unlocks.'),
      link('/calculators/medicare-savings-program-extra-help/', 'MSP + Extra Help calculator', 'Values the savings-program and drug-cost subsidies together.'),
    ],
    related: ['Premium tax credit', 'Cost-sharing reduction', 'Extra Help', 'MSP'],
    sources: [
      row('Marketplace help', 'Premium credits and cost-sharing reductions', S.healthcareSavings, 'HealthCare.gov, save on monthly premiums'),
      row('Drug-cost help', 'Extra Help limits and benefits', S.medicareDrugCosts, 'Medicare.gov, Extra Help with drug costs'),
    ],
    updatedOn: CHECKED,
  },
  {
    term: 'Surcharge',
    definition:
      'An extra amount added on top of a standard premium; IRMAA is an income-based Part B and Part D surcharge, billable separately from the plan premium.',
    whyItMatters: [
      'The word matters because the surcharge is not a plan charge: it rides on top of whatever the plan or coverage costs, and it applies once per enrolled person. The Part D version is billed separately from the chosen plan premium, which is why two members with the same drug plan can receive different total bills. Every surcharge sits in one of the fixed IRMAA tiers.',
    ],
    exactHeading: `The exact tiers for ${F}`,
    exact: [
      `Surcharge amounts for single filers run from ${money(B.irmaa.single[1].partBAdjustment)} up to ${money(B.irmaa.single[5].partBAdjustment)} on Part B, and from ${money(D.irmaa[1].amount)} up to ${money(D.irmaa[5].amount)} on Part D, per the CMS fact sheet below. Married joint brackets double the cutoffs, and married-separate brackets use the harshest table.`,
      `The surcharge does not change the structure of the standard premium; it is added to it, month by month, for the whole premium year.`,
    ],
    worked:
      `A married couple files jointly with MAGI of ${money(250000)}, so the second tier applies to each enrolled spouse: ${money(irmaaBracketsFor('marriedJoint')[1].partBAdjustment)} added to Part B and ${money(irmaaBracketsFor('marriedJoint')[1].partDAdjustment)} to Part D if a drug plan is enrolled, for a Part B premium of ${money(irmaaBracketsFor('marriedJoint')[1].partBTotal)} per spouse.`,
    calculators: [
      link('/calculators/irmaa-cliff-checker/', 'IRMAA cliff checker', 'Adds up the per-person surcharge across a household and shows the distance to each tier.'),
    ],
    related: ['IRMAA', 'Part B', 'Part D', 'MAGI'],
    sources: [
      row(`Part B surcharge range, ${F}`, `${money(B.irmaa.single[1].partBAdjustment)} to ${money(B.irmaa.single[5].partBAdjustment)}`, S.cms2026AB, 'CMS fact sheet, Parts A & B premiums and deductibles'),
      row(`Part D surcharge range, ${F}`, `${money(D.irmaa[1].amount)} to ${money(D.irmaa[5].amount)}`, S.cms2026AB, 'CMS fact sheet, Parts A & B premiums and deductibles'),
    ],
    updatedOn: CHECKED,
  },
];
