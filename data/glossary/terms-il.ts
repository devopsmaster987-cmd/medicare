import { S, F, CHECKED, money, num, pct, dateRange, link, row } from './text';
import { B, D, IRS, MSP, PEN_B, PEN_D } from './figures';
import type { GlossaryTerm } from './types';

export const termsIL: GlossaryTerm[] = [
  {
    term: 'Income disregard',
    definition:
      'Income a program deliberately subtracts before applying its eligibility test, rather than counting the whole report.',
    whyItMatters: [
      'Eligibility lines look like cliff edges, but the disregard is the small deduction that lets a household sit slightly over the raw limit and still qualify. The federal Medicare Savings Programs subtract a set amount from monthly income before testing it, and states can apply additional disregards. People who assume they fail because gross income beats the line skip an application they would pass.',
    ],
    exactHeading: `The exact subtraction for ${F}`,
    exact: [
      `For the federal Medicare Savings Programs, ${money(MSP.qmb.monthlyDisregard)} a month is subtracted from countable income before the FPL percent test, per Medicare.gov's savings-program page (${S.medicareMsp}). State programs can add their own disregards, which is the basis for the commonly repeated advice to apply even when income looks too high.`,
      `Extra Help, the marketplaces, and Medicaid programs use their own disregard rules, so the subtraction never transfers across programs; each application has its own arithmetic.`,
    ],
    worked:
      `The SLMB standard for one person in ${F} sits at about ${money(MSP.slmb.anchorMonthlySingle)} a month counted income, which is 120 percent of poverty plus the ${money(MSP.qmb.monthlyDisregard)} disregard. An applicant with ${money(1600)} of gross monthly income lands at ${money(1600 - 20)} after the subtraction, under the standard, and qualifies. Without the disregard the same ${money(1600)} would look like a fail.`,
    calculators: [
      link('/calculators/medicare-savings-program-extra-help/', 'MSP + Extra Help calculator', 'Applies the disregard in every state it covers and spells out what remains counted.'),
    ],
    related: ['Spend-down', 'MSP', 'Asset test', 'Extra Help'],
    sources: [
      row(`Monthly disregard`, money(MSP.qmb.monthlyDisregard), S.medicareMsp, 'Medicare.gov, Medicare Savings Programs'),
    ],
    updatedOn: CHECKED,
  },
  {
    term: 'IEP',
    definition:
      'Initial Enrollment Period: the seven months around a 65th birthday, or a 25th month of disability, when Medicare enrollment is first available without penalty.',
    whyItMatters: [
      'The initial enrollment period is the default path in, and its timing quietly controls coverage start dates and penalty exposure. Miss it without creditable coverage, and the only general route back in is the winter window, with a penalty attached. Know the window edges and the coverage start rules before the birthday month arrives.',
    ],
    exactHeading: 'The exact window',
    exact: [
      `For people aging into Medicare, the window runs ${num(IRS.initialEnrollmentPeriodMonths)} months: three before the birthday month, the birthday month itself, and three after, per Medicare.gov (${S.medicareEmployer}). For disability enrollment it is the same shape around the 25th month of Social Security disability.`,
      `Coverage start follows the sign-up month inside the window. Enroll in the first three months and coverage begins the birthday month; enroll in any of the last three and the start shifts into the months after the birthday.`,
    ],
    worked:
      `A birthday in June puts the window from March to September. Signing up in March starts Part B in June; waiting until the last month, September, pushes the first month of coverage to October, so any care in July through September has no Part B behind it. The calculator on this site shows both the effective date and the penalty exposure when the window closes with no sign-up.`,
    calculators: [
      link('/calculators/part-b-late-enrollment-penalty/', 'Part B late-enrollment penalty', 'Ticks through what a closed window costs in premium and coverage months.'),
      link('/calculators/medicare-vs-aca/', 'Medicare vs ACA decision', 'Places IEP dates beside employer coverage and marketplace choices.'),
    ],
    related: ['General enrollment period', 'SEP', 'Part B', 'Late enrollment penalty'],
    sources: [
      row('Initial enrollment window', `${num(IRS.initialEnrollmentPeriodMonths)} months, 3 before and 3 after the birthday month`, S.medicareEmployer, 'Medicare.gov, when can I sign up for Medicare'),
    ],
    updatedOn: CHECKED,
  },
  {
    term: 'IRMAA',
    definition:
      'Income-Related Monthly Adjustment Amount: an income surcharge added to the standard Part B and Part D premiums once MAGI from two tax years back passes a tier line.',
    whyItMatters: [
      'Most people remember IRMAA for the size of the jolt: the standard premium jumps by a fixed surcharge in whole tiers, not gradually, which makes single dollars of MAGI expensive right above a cutoff. The surcharge applies per enrolled person, so a married couple with two Medicare cards can pay it twice. And because the test reads a two-year-old return, the trigger is usually already set by the time the bills arrive.',
    ],
    exactHeading: `The exact tiers for ${F}`,
    exact: [
      `For a single filer, ${F} MAGI up to ${money(109000)} keeps the standard Part B premium of ${money(B.standardPremium.amount)} and no Part D surcharge. Above that line the surcharge lands in steps: the first tier adds ${money(B.irmaa.single[1].partBAdjustment)} to Part B and ${money(B.irmaa.single[1].partDAdjustment)} to Part D, for a Part B premium of ${money(B.irmaa.single[1].partBTotal)}, and the tiers rise to ${money(B.irmaa.single[5].partBTotal)} at MAGI of ${money(500000)} or more, per the CMS fact sheet cited below.`,
      `Married joint households use doubled cutoffs. Married-filing-separately households get the harshest table: the first cutoff is the same ${money(109000)}, then a steep jump. The tiers come from the [CMS fact sheet for Parts A and B](${S.cms2026AB}).`,
    ],
    worked:
      `A single filer whose 2024 MAGI was ${money(120000)} reads the 2026 bill: the first tier line adds ${money(B.irmaa.single[1].partBAdjustment)}, so Part B costs ${money(B.irmaa.single[1].partBTotal)} a month instead of ${money(B.standardPremium.amount)}, and Part D adds another ${money(B.irmaa.single[1].partDAdjustment)} if a drug plan is enrolled. One dollar of MAGI on each side of the cutoff decides the tier, and the bill difference is ${money((B.irmaa.single[1].partBTotal - B.standardPremium.amount) * 12)} across a Part B year.`,
    calculators: [
      link('/calculators/irmaa-cliff-checker/', 'IRMAA cliff checker', 'Places your MAGI inside these tiers and measures the dollars to the next bracket edge.'),
    ],
    related: ['MAGI', 'Part B', 'Part D', 'Roth conversion'],
    sources: [
      row(`Standard Part B premium, ${F}`, money(B.standardPremium.amount), S.cms2026AB, 'CMS fact sheet, Parts A & B premiums and deductibles'),
      row(`First IRMAA tier, ${F} single`, `Above ${money(109000)}: +${money(B.irmaa.single[1].partBAdjustment)} Part B / +${money(B.irmaa.single[1].partDAdjustment)} Part D`, S.cms2026AB, 'CMS fact sheet, Parts A & B premiums and deductibles'),
    ],
    updatedOn: CHECKED,
  },
  {
    term: 'Late enrollment penalty',
    definition:
      'A permanent, percentage-based surcharge added to a Medicare premium for each period of delayed enrollment without creditable coverage.',
    whyItMatters: [
      'Each part of Medicare carries its own late-enrollment penalty, and each is permanent: it rides on the premium every month for as long as the coverage lasts. Amounts compound with every future premium increase, because the percentage applies to whatever the standard premium becomes. The avoidable versions are all about proof of creditable coverage and the right enrollment window.',
    ],
    exactHeading: 'The exact formulas',
    exact: [
      `Part B adds ${pct(PEN_B.ratePerFullYear.rate)} of the standard premium for each full 12-month period of delay, as Medicare.gov's penalty-avoidance page documents (${S.medicareAvoidPenalties}). Part D adds ${pct(PEN_D.ratePerUncoveredMonth.rate)} of the national base beneficiary premium for each uncovered month (the base is ${money(D.baseBeneficiaryPremium.amount)} for ${F}). Part A multiplies the Part B-style 10 percent by two, capped after 12 unpaid years.`,
    ],
    worked:
      `A person delays Part B for three full years with no creditable coverage. The surcharge is ${pct(0.3)} of the ${F} standard premium: ${money(0.3 * B.standardPremium.amount)} a month, on top of the standard ${money(B.standardPremium.amount)}, billable for life. On the Part D side, 14 uncovered months cost a permanent ${money(14 * 0.01 * D.baseBeneficiaryPremium.amount)} a month added to the drug plan premium.`,
    calculators: [
      link('/calculators/part-b-late-enrollment-penalty/', 'Part B late-enrollment penalty', 'Marks covered and uncovered months, then prices the surcharge month by month and over a lifetime.'),
    ],
    related: ['Part B', 'Part D', 'Creditable coverage', 'SEP'],
  sources: [
      row('Part B penalty rate', '10 percent of the standard premium per full 12-month delay', S.medicareAvoidPenalties, 'Medicare.gov, avoiding Medicare penalties'),
      row(`Part D penalty rate, ${F}`, '1 percent of the national base beneficiary premium per uncovered month', S.medicarePartDCosts, 'Medicare.gov, Part D costs'),
    ],
    updatedOn: CHECKED,
  },
  {
    term: 'Life-changing event',
    definition:
      'One of the specific events Social Security accepts, such as retirement or the death of a spouse, that lets SSA recompute an IRMAA decision on newer income.',
    whyItMatters: [
      'IRMAA is normally computed on a past tax year, and the only clean way to correct a mismatched year is a recognized life-changing event. The event has to be on the list and provable; a generic drop in income does not qualify. Once the event is accepted, SSA re-derives the surcharge on the actual, lower-income, protecting against bill shock after a retirement or a death in the family.',
    ],
    exactHeading: 'The exact list',
    exact: [
      `SSA's program manual lists the qualifying events at GN 01120.005 (${S.ssaPomsLce}): work stoppage or reduction, marriage, divorce or annulment, death of a spouse, and several more, matched to documented proof such as a signed retirement letter or a death certificate. Form SSA-44 (${S.ssaForm44}) carries the same list checkbox by checkbox.`,
      `The event must be within the covered window and the lower-income estimate must be planned from Form 1040 logic on the premium year in question.`,
    ],
    worked:
      `A spouse dies, cutting household income in half, while the surviving member stays in the highest IRMAA tier tested on the joint return from two years earlier. Filing SSA-44 with the death certificate and the new single-filer estimate moves the surcharge to the correct single-filer tier for the current year, and SSA re-derives premium months from the decision date forward.`,
    calculators: [
      link('/calculators/irmaa-cliff-checker/', 'IRMAA cliff checker', 'Shows the surcharge tier SSA would reset once the event and estimate are accepted.'),
    ],
    related: ['Form SSA-44', 'IRMAA', 'Appeal', 'MAGI'],
    sources: [
      row('Qualifying events', 'Work stoppage, marriage, divorce, death of a spouse, and more', S.ssaPomsLce, 'SSA, POMS GN 01120.005'),
      row('Form listing the events', 'Form SSA-44 checkboxes', S.ssaForm44, 'SSA, official Form SSA-44'),
    ],
    updatedOn: CHECKED,
  },
];
