import { S, F, CHECKED, money, num, pct, link, row } from './text';
import { A, ACA, B, D, MSP, IRS } from './figures';
import type { GlossaryTerm } from './types';

export const termsM: GlossaryTerm[] = [
  {
    term: 'Medicare',
    definition:
      'The federal health insurance program for people 65 and older, some younger people with disabilities after a waiting period, and people with end-stage renal disease or ALS.',
    whyItMatters: [
      'Almost every enrollment and cost question on this site ultimately routes through Medicare itself: what Part A costs, when Part B starts, how surcharges apply, and which plans sit on top. The program has two main tracks, Original Medicare with its Parts A and B and private plans that deliver the same benefits differently, and the wrong first step can set a permanent penalty in motion.',
    ],
    exactHeading: `The exact eligibility path`,
    exact: [
      `Most people qualify at 65 if they or a spouse earned enough work credits; people with Social Security disability wait 24 months of checks, per the ssaMedicareSignup enrollment path (${S.ssaMedicareSignup}) and Medicare.gov's other-paths page (${S.medicareOtherPaths}). End-stage renal disease and ALS qualify through their own tests.`,
      `The first sign-up window is ${num(IRS.initialEnrollmentPeriodMonths)} months around the birthday month, and employer-coverage rules both protect and complicate the timing for people working past 65.`,
    ],
    worked:
      `A worker turns 65 in August while keeping a 140-employee firm's plan. The 7-month window is May through November, the plan pays first, and a sign-up right at retirement keeps everything penalty-free. A friend at a 15-employee firm must enroll in Part B at 65 instead, because Medicare generally pays first at that size.`,
    calculators: [
      link('/calculators/medicare-vs-aca/', 'Medicare vs ACA decision', 'Runs the whole eligibility-to-enrollment decision tree for your age, job, and coverage.'),
      link('/calculators/part-b-late-enrollment-penalty/', 'Part B late-enrollment penalty', 'Shows what happens when the enrollment path is missed.'),
    ],
    related: ['Part A', 'Part B', 'Medicare Advantage', 'Medigap'],
    sources: [
      row('Eligibility paths', 'Age 65, disability after a wait, end-stage renal disease, ALS', S.medicareOtherPaths, 'Medicare.gov, other paths to Medicare'),
      row('Sign-up process', 'Social Security handles enrollment', S.ssaGov, 'Social Security Administration'),
    ],
    updatedOn: CHECKED,
  },
  {
    term: 'Medicare Advantage',
    definition:
      'A private Medicare plan that delivers Part A and Part B benefits in place of Original Medicare, bundled in one network with plan-set rules.',
    whyItMatters: [
      'The right fit changes the arithmetic entirely: Medicare Advantage bundles inpatient, outpatient, and often drug coverage under one insurer, while Original Medicare pairs federal cost rules with a separate drug plan and a Medigap policy. These plans cap annual out-of-pocket spending in a way Original Medicare does not, but they draw their discounts from networks, referrals, and authorization rules that can change each year.',
    ],
    exactHeading: 'The exact mechanical difference',
    exact: [
      `In Medicare Advantage one plan processes hospital, medical, and usually drug benefits and manages provider access, whereas Original Medicare leaves network decisions open and cost sharing uncapped. Both paths charge the standard Part B premium of ${money(B.standardPremium.amount)} in ${F}, and a Part D surcharge is billed separately under IRMAA when applicable, per the CMS fact sheet cited below.`,
      `Plan catalog, networks, and cost sharing all reset during the annual enrollment period. The comparison tools on the same site keep these plan structures beside the financial calculators.`,
    ],
    worked:
      `A new 65-year-old at a 130-employee firm weighs the two tracks with the same Part B premium of ${money(B.standardPremium.amount)}: the bundled plan adds no extra premium but steers care through its network, while Original Medicare pairs the federal premium with a separate drug plan and possibly a Medigap policy. Both paths still depend on the same Part B enrollment timing, which is where the penalty exposure lives.`,
    calculators: [
      link('/calculators/irmaa-cliff-checker/', 'IRMAA cliff checker', 'Shows the income surcharge both plan paths carry on Part B and Part D.'),
      link('/calculators/medicare-vs-aca/', 'Medicare vs ACA decision', 'Frames Original Medicare against bundled plans inside the wider coverage choice.'),
    ],
    related: ['Medicare', 'Part B', 'Network', 'Annual enrollment period'],
    sources: [
      row(`Part B premium floor, ${F}`, money(B.standardPremium.amount), S.cms2026AB, 'CMS fact sheet, Parts A & B premiums and deductibles'),
      row('Plan comparison', 'Plan rules and networks by plan', S.medicarePlanFinder, 'Medicare.gov, Plan Finder'),
    ],
    updatedOn: CHECKED,
  },
  {
    term: 'Medigap',
    definition:
      'A private supplemental policy sold beside Original Medicare that fills some of its deductibles, coinsurance, and copays.',
    whyItMatters: [
      'Original Medicare cost sharing is uncapped, so the question is who absorbs the 20 percent of a large hospital or outpatient bill. Medigap policies answer part of that, plan letter by plan letter. They only work alongside Original Medicare, so the choice between Medigap and Medicare Advantage is effectively a fork in the road, and the two do not share a direction.',
    ],
    exactHeading: 'The exact pairing',
    exact: [
      `Policy letters are standardized: the same letter from two different companies covers the same share of the same costs, published on Medicare.gov's plan pages (${S.medicareGov}). Policies are sold privately at market premiums on top of the ${money(B.standardPremium.amount)} standard Part B premium in ${F}.`,
      `A purchase window opens when you turn 65 and enroll in Part B, with guaranteed-issue rights during it; underwriting and pricing can enter the picture outside those rights. The Part B premiums and cost sharing these policies offset are on the source table below.`,
    ],
    worked:
      `A member with Original Medicare and a Part B premium of ${money(B.standardPremium.amount)} adds a policy that covers the coinsurance. A ${money(400)} outpatient share that Medicare leaves behind disappears under the policy, and the household's remaining bill is premium only. A spouse who picked a bundled plan instead pays no portion of network gaps and cannot buy this insurance alongside it.`,
    calculators: [
      link('/calculators/irmaa-cliff-checker/', 'IRMAA cliff checker', 'Pairs the surcharge math with the premiums that supplements stack on top of.'),
      link('/calculators/medicare-vs-aca/', 'Medicare vs ACA decision', 'Sits the supplemental choice inside the Original Medicare against bundled plan decision.'),
    ],
    related: ['Coinsurance', 'Medicare Advantage', 'Out-of-pocket maximum', 'Part B'],
    sources: [
      row(`Part B premium, ${F}`, money(B.standardPremium.amount), S.cms2026AB, 'CMS fact sheet, Parts A & B premiums and deductibles'),
      row('Plan letters', 'Standardized benefit letters and what each covers', S.medicareGov, 'Medicare.gov'),
    ],
    updatedOn: CHECKED,
  },
  {
    term: 'Minimum value',
    definition:
      'The ACA standard an employer plan must meet by paying at least a set share of covered health costs on average for the plan year.',
    whyItMatters: [
      'Affordability is only half the employer offering test. A premium can sit inside the affordability line, yet the plan can still be too thin to matter in a bad year, paying a low share of costs and leaving the family without a fallback. Minimum value is the standard the plan must clear for the offer to count as good coverage, which is why the calculator checks it before the marketplace question even starts.',
    ],
    exactHeading: 'The exact threshold',
    exact: [
      `A plan offers minimum value when it pays at least ${pct(0.6)} of the total allowed cost of benefits, and it must cover substantial inpatient hospital and physician services, per HealthCare.gov's minimum-value glossary page (${S.healthcareMinimumValue}) and the IRS marketplace guidance. Employers receive the plan's minimum-value determination from the plan materials.`,
      `The affordability test runs separately, using ${pct(ACA.affordabilityPercentage.rate)} of household income against the employee-only premium of the lowest-cost minimum-value plan for ${F}.`,
    ],
    worked:
      `An employer offers a $0 premium plan that pays only 40 percent of covered costs, with no hospital benefit. The premium passes the affordability ceiling of ${money((60000 * 0.0996) / 12)} a month for a household earning ${money(60000)}, but the plan fails the minimum-value share of ${pct(0.6)} and skips hospital coverage entirely, so the offer does not block a marketplace tax credit for that worker.`,
    calculators: [
      link('/calculators/employer-coverage-affordability/', 'Employer coverage affordability', 'Checks both affordability and minimum value from the plan summary you enter.'),
    ],
    related: ['Affordability percentage', 'Household income', 'Premium tax credit', 'Employer group health plan'],
    sources: [
      row('Minimum value standard', 'Pays at least 60 percent of allowed costs plus hospital and physician coverage', S.healthcareMinimumValue, 'HealthCare.gov, minimum value'),
      row(`Affordability percentage, ${F}`, pct(ACA.affordabilityPercentage.rate), S.irsRp2025_25, 'IRS Revenue Procedure 2025-25'),
    ],
    updatedOn: CHECKED,
  },
  {
    term: 'MSP',
    definition:
      'Medicare Savings Program: a state-level program that pays some or all of Medicare premiums, and for the stronger tiers, cost sharing too.',
    whyItMatters: [
      'For a person on a tight budget, a Medicare Savings Program is the difference between paying the full Part B premium and keeping most of it. Programs run through state Medicaid offices, test income near the FPL with far more generous disregards than the raw percentages suggest, and often pull the drug-cost Extra Help along behind them. Every program tier has its own payment package.',
    ],
    exactHeading: `The exact tiers for ${F}`,
    exact: [
      `The main tiers are QMB, which pays Part A and Part B premiums plus their cost sharing, SLMB and QI, which pay Part B only, and QDWI, which pays Part A premiums for some working disabled people, per Medicare.gov (${S.medicareMsp}). For ${F}, the one-person counted-income anchors are roughly ${money(MSP.qmb.anchorMonthlySingle)}, ${money(MSP.slmb.anchorMonthlySingle)}, and ${money(MSP.qi.anchorMonthlySingle)} a month after disregards, with resource limits of ${money(MSP.qmb.resourceSingle.amount)} single and ${money(MSP.qmb.resourceCouple.amount)} couple.`,
      `State rules vary widely, and this site's calculators currently cover its verified launch states; every other state's Medicaid office can be reached through the official locator below.`,
    ],
    worked:
      `A single renter with ${money(1420)} a month of countable income applies: QMB sits at about ${money(MSP.qmb.anchorMonthlySingle)}, so she misses it but qualifies for SLMB. Her Part B premium of ${money(B.standardPremium.amount)} is paid for her, worth roughly ${money(B.standardPremium.amount * 12)} across a year, and the drug-cost Extra Help follows the same approval.`,
    calculators: [
      link('/calculators/medicare-savings-program-extra-help/', 'MSP + Extra Help calculator', 'Tests each tier for your state and puts the dollar savings right beside the limits.'),
    ],
    related: ['QMB', 'SLMB', 'QI', 'Extra Help'],
    sources: [
      row('Program tiers and pay-out', 'QMB pays premiums and cost sharing; SLMB, QI pay Part B premiums', S.medicareMsp, 'Medicare.gov, Medicare Savings Programs'),
      row(`Resource limits, ${F}`, `${money(MSP.qmb.resourceSingle.amount)} / ${money(MSP.qmb.resourceCouple.amount)}`, S.medicareMsp, 'Medicare.gov, Medicare Savings Programs'),
    ],
    updatedOn: CHECKED,
  },
];
