import { S, F, P, CHECKED, money, num, pct, link, row } from './text';
import { A, ACA, B, D, IRS, MSP, PEN_B } from './figures';
import type { GlossaryTerm } from './types';

export const termsCE: GlossaryTerm[] = [
  {
    term: 'Countable assets',
    definition:
      'The resources an eligibility program counts toward its asset test, such as cash, bank accounts, stocks, and certain property.',
    whyItMatters: [
      'Eligibility for the Medicare Savings Programs and Extra Help depends on income and on countable assets, so the definition decides whether money you have set aside can block the benefit. Exclusions matter as much as limits: your home, one car, and burial arrangements are generally left out, while cash on hand and liquid investments are not. The application, not an estimate, settles the question.',
    ],
    exactHeading: 'What programs count',
    exact: [
      `Countable resources generally include bank deposits, stocks, bonds, and cash you can reach, as Medicare.gov describes for the savings programs (${S.medicareMsp}). The house you live in, your car, and certain burial arrangements set aside for a spouse are generally excluded.`,
      `For ${F}, the limits are ${money(MSP.qmb.resourceSingle.amount)} single and ${money(MSP.qmb.resourceCouple.amount)} couple for the Medicare Savings Programs, and ${money(D.extraHelp.resourceSingle.amount)} and ${money(D.extraHelp.resourceCouple.amount)} for Extra Help.`,
    ],
    worked:
      `A married couple has ${money(11800)} in savings, ${money(2500)} in a money-market fund, a jointly owned house, and a burial fund. Countable assets come to ${money(11800 + 2500)}, which sits ${money(MSP.qmb.resourceCouple.amount - (11800 + 2500))} under the ${money(MSP.qmb.resourceCouple.amount)} couple limit for the savings programs and far under the ${money(D.extraHelp.resourceCouple.amount)} Extra Help limit, so the resource side of both applications passes.`,
    calculators: [
      link('/calculators/medicare-savings-program-extra-help/', 'MSP + Extra Help calculator', 'Walks through the income and asset sides together, with the exclusions explained.'),
    ],
    related: ['Asset test', 'MSP', 'Extra Help', 'Income disregard'],
    sources: [
      row(`MSP resource limits, ${F}`, `${money(MSP.qmb.resourceSingle.amount)} single / ${money(MSP.qmb.resourceCouple.amount)} couple`, S.medicareMsp, 'Medicare.gov, Medicare Savings Programs'),
      row(`Extra Help resource limits, ${F}`, `${money(D.extraHelp.resourceSingle.amount)} single / ${money(D.extraHelp.resourceCouple.amount)} couple`, S.medicareDrugCosts, 'Medicare.gov, Extra Help with drug costs'),
    ],
    updatedOn: CHECKED,
  },
  {
    term: 'Creditable coverage',
    definition:
      'Health or drug coverage at least as good as Medicare for the benefit involved, which can protect you from a late-enrollment penalty.',
    whyItMatters: [
      'Creditable coverage is the gate between waiting and paying. If your employer, union, or retiree plan is creditable, you can delay enrolling in that part of Medicare without owing a permanent surcharge later. If it is not, or if you misjudge the window, the penalty is figured on each uncovered month or year and lasts for life. Plan sponsors must tell you in writing each year whether your plan is creditable, and that notice is worth reading.',
    ],
    exactHeading: 'The exact test',
    exact: [
      `For Part B, the protection comes from coverage under current employment itself, employer or spouse's, that is at least as good as Medicare. For Part D, the plan sponsor certifies that drug coverage is at least as good, on average, as Part D. Medicare.gov's penalty-avoidance page (${S.medicareAvoidPenalties}) lays out both standards.`,
      `Retiree plans, COBRA, marketplace plans, and Medigap do not meet the active-employment test for Part B, and drug coverage that falls short of the Part D standard is not creditable either.`,
    ],
    worked:
      `A worker stays on the company plan until 67, then enrolls in Part B during the 8-month window after the job ends and keeps the employer's creditability letter. Because every month of the delay is covered by creditable coverage, the delay score is two excluded years and the penalty is ${money(0)}. Without that letter, the same two years would cost roughly ${money(2 * PEN_B.ratePerFullYear.rate * B.standardPremium.amount)} a month on top of the standard premium, permanently.`,
    calculators: [
      link('/calculators/part-b-late-enrollment-penalty/', 'Part B late-enrollment penalty', 'Counts excluded months under creditable coverage against the delay months.'),
      link('/calculators/medicare-vs-aca/', 'Medicare vs ACA decision', 'Checks whether employer or marketplace coverage counts as creditable.'),
    ],
    related: ['Active coverage', 'COBRA', 'Late enrollment penalty', 'SEP'],
    sources: [
      row('Creditable coverage standard', 'At least as good as Medicare; certified by the plan sponsor', S.medicareAvoidPenalties, 'Medicare.gov, avoiding Medicare penalties'),
    ],
    updatedOn: CHECKED,
  },
  {
    term: 'Cost-sharing reduction',
    definition:
      'A marketplace benefit that lowers deductibles, copays, and coinsurance on a Silver plan for eligible households.',
    whyItMatters: [
      'Premium tax credits lower the monthly bill, but a large deductible can still make coverage hard to use in a bad year. Cost-sharing reductions close that gap for eligible households who buy Silver plans: they raise the share of costs the plan covers rather than lower the premium. Choosing a non-Silver plan forfeits them even when premium help is identical, a selection error that usually shows up in the deductible line.',
    ],
    exactHeading: `The exact figures for ${F}`,
    exact: [
      `Households between 100 and 250 percent of the federal poverty level who are eligible for premium tax credits and enroll in a Silver plan receive enhanced cost sharing, as HealthCare.gov's glossary entry explains (${S.healthcareCsr}). The savings are largest for households near the bottom of the band.`,
      `The federal cost-sharing ceiling still applies: for ${F}, ${money(ACA.outOfPocketMaxSelfOnly.amount)} self-only and ${money(ACA.outOfPocketMaxFamily.amount)} family, per the federal cost-sharing notice below.`,
    ],
    worked:
      `A two-person household with ${money(32460)} of income is near 150 percent of the prior-year poverty guidelines used for that year's subsidies (${money(21640)} for two in ${P}). Its Silver plan deductibles and copays are reduced under the cost-sharing rules, and total cost sharing cannot pass the ${money(ACA.outOfPocketMaxSelfOnly.amount)} ceiling. A neighbor with identical premium help who picked a Gold plan for the same price would face the standard, unreduced deductible.`,
    calculators: [
      link('/calculators/employer-coverage-affordability/', 'Employer coverage affordability', 'When employer coverage is unaffordable, marketplace plans and these reductions open up.'),
      link('/calculators/medicare-vs-aca/', 'Medicare vs ACA decision', 'Sets marketplace cost sharing beside Medicare cost sharing.'),
    ],
    related: ['Out-of-pocket maximum', 'Premium tax credit', 'Deductible', 'FPL'],
    sources: [
      row('CSR eligibility', 'Silver plans, 100 to 250 percent FPL, with premium tax credit eligibility', S.healthcareCsr, 'HealthCare.gov, cost-sharing reduction'),
      row(`Federal out-of-pocket limit, ${F}`, `${money(ACA.outOfPocketMaxSelfOnly.amount)} / ${money(ACA.outOfPocketMaxFamily.amount)}`, S.hhs2026CostSharing, 'Federal Register, 2026 cost-sharing parameters'),
    ],
    updatedOn: CHECKED,
  },
  {
    term: 'Deductible',
    definition:
      'The amount you pay for covered care each year before the plan starts paying its share.',
    whyItMatters: [
      'Every Medicare part opens the year with a deductible, and the three parts use different amounts and different structures. Budgeting starts there: the deductible comes first at the pharmacy or hospital, then coinsurance or copays follow. Plans stacking on top of Medicare, including drug plans, follow the same opening rule with their own amounts.',
    ],
    exactHeading: `The exact figures for ${F}`,
    exact: [
      `Part A charges ${money(A.inpatientDeductible.amount)} per inpatient benefit period, so a hospital stay that crosses into a new benefit period can meet the deductible twice in one year. Part B charges ${money(B.deductible.amount)} per year, and the standard Part D opening deductible can reach ${money(D.deductible.amount)} at plans that use it fully. All three are ${F} figures from the CMS fact sheet and Medicare.gov pages cited below.`,
      `Medigap policies can cover some or all of these lump costs, and Extra Help removes most of the Part D deductible for people it qualifies.`,
    ],
    worked:
      `A Part B member has one covered outpatient bill of ${money(1500)} this year with no Medigap. Medicare pays nothing until the ${money(B.deductible.amount)} deductible is met; then it splits the remaining ${money(1500 - 283)} at 80/20. The member owes the deductible plus ${money(0.2 * (1500 - 283))}, for a total of ${money(283 + 0.2 * (1500 - 283))} for the service.`,
    calculators: [
      link('/calculators/irmaa-cliff-checker/', 'IRMAA cliff checker', 'Places these premiums and deductibles inside the full yearly cost picture.'),
      link('/calculators/medicare-savings-program-extra-help/', 'MSP + Extra Help calculator', 'Shows which of these amounts QMB or Extra Help can absorb.'),
    ],
    related: ['Coinsurance', 'Part A', 'Part B', 'Out-of-pocket maximum'],
    sources: [
      row(`Part A deductible, ${F}`, money(A.inpatientDeductible.amount), S.cms2026AB, 'CMS fact sheet, Parts A & B premiums and deductibles'),
      row(`Part B deductible, ${F}`, money(B.deductible.amount), S.cms2026AB, 'CMS fact sheet, Parts A & B premiums and deductibles'),
      row(`Part D deductible, ${F}`, money(D.deductible.amount), S.medicarePartDCosts, 'Medicare.gov, Part D costs'),
    ],
    updatedOn: CHECKED,
  },
  {
    term: 'Dual eligible',
    definition:
      'A person who qualifies for both Medicare and Medicaid at the same time, with the two programs sharing costs in a defined order.',
    whyItMatters: [
      'For people with both Medicare and Medicaid, the terms of the split matter for every bill: Medicare pays either way, but Medicaid, or a Medicare Savings Program, covers much of what Medicare leaves behind. Which programs a dual enrollment connects can change monthly premiums, drug copays, and long-term care costs. State Medicaid offices administer the bridge, which means the exact package varies by state.',
    ],
    exactHeading: 'The bridge programs',
    exact: [
      `The Medicare Savings Programs sit between the two programs: each one pays a defined share of Medicare premiums or cost sharing, as Medicare.gov explains (${S.medicareMsp}), and state Medicaid offices make the decision. Full dual enrollment adds Medicaid benefits that a savings program alone does not pay, such as some long-term care services.`,
      `Income and asset tests remain state-specific at the Medicaid office level, and the federal minimums for the savings programs are listed in the table below.`,
    ],
    worked:
      `A widow with income just under the QMB standard applies to her state Medicaid office and lands as a dual eligible. QMB status pays her Medicare premiums and her share of deductibles and coinsurance. Her pharmacy starts billing Medicaid for most drug claims, and providers treating Medicare-covered care are barred from billing her beyond what Medicare pays, which is the QMB billing protection.`,
    calculators: [
      link('/calculators/medicare-savings-program-extra-help/', 'MSP + Extra Help calculator', 'Estimates which savings-program tier a low-income Medicare member with Medicaid-adjacent income qualifies for.'),
    ],
    related: ['Medicaid', 'MSP', 'QMB', 'State Medicaid agency'],
    sources: [
      row('Dual-eligible cost sharing', 'Savings programs pay Medicare premiums and cost sharing by tier', S.medicareMsp, 'Medicare.gov, Medicare Savings Programs'),
    ],
    updatedOn: CHECKED,
  },
  {
    term: 'Employer group health plan',
    definition:
      'Health coverage an employer offers to a group of workers and often to their families, with rules that change with employer size.',
    whyItMatters: [
      'For most people under 65 this is the coverage that matters, and the rules quietly change with three different tests: whether the plan pays at least a minimal share of costs, whether the employee-only premium is affordable, and, at age 65, which plan pays first. The same plan can be fine for a healthy 50-year-old and yet trigger Medicare penalties for an employee who keeps it past 65 without knowing the size rule.',
    ],
    exactHeading: `The exact tests`,
    exact: [
      `Employer plans are checked under the ACA rules: the plan must offer minimum value, and the employee-only premium of the lowest-cost minimum-value plan is tested against ${pct(ACA.affordabilityPercentage.rate)} of household income for ${F}. Federal cost-sharing parameters give covered plans a ceiling in ${F} of ${money(ACA.outOfPocketMaxSelfOnly.amount)} self-only and ${money(ACA.outOfPocketMaxFamily.amount)} family.`,
      `For people 65 and older, employer size changes who pays first: at ${num(IRS.employerSizeRule.employees)} or more employees the employer plan generally pays first for a working enrollee, as Medicare.gov documents (${S.medicarePaysFirst}), and below that Medicare normally pays first and Part B should start on time.`,
    ],
    worked:
      `A company with 40 employees offers a plan for a family premium of ${money(500)} a month, but the employee-only premium is ${money(160)}. The employee's household income is ${money(52000)}, so the affordable ceiling for self-only coverage is about ${money((52000 * 0.0996) / 12)} a month and the plan passes; but if the employee turned 65 and the firm stayed at 40 employees, Medicare would generally pay first, so Medicare enrollment could be needed even with the job-based plan intact.`,
    calculators: [
      link('/calculators/employer-coverage-affordability/', 'Employer coverage affordability', 'Runs the affordability and minimum-value tests for your own plan documents.'),
      link('/calculators/medicare-vs-aca/', 'Medicare vs ACA decision', 'Answers how the plan interacts with Medicare after 65.'),
    ],
    related: ['Active coverage', 'Minimum value', 'Affordability percentage', '20-employee rule'],
    sources: [
      row(`Affordability percentage, ${F}`, pct(ACA.affordabilityPercentage.rate), S.irsRp2025_25, 'IRS Revenue Procedure 2025-25'),
      row(`Cost-sharing limits, ${F}`, `${money(ACA.outOfPocketMaxSelfOnly.amount)} / ${money(ACA.outOfPocketMaxFamily.amount)}`, S.hhs2026CostSharing, 'Federal Register, 2026 cost-sharing parameters'),
      row('Who pays first at 65', `${num(IRS.employerSizeRule.employees)} or more employees: employer plan first`, S.medicarePaysFirst, 'Medicare.gov, who pays first'),
    ],
    updatedOn: CHECKED,
  },
  {
    term: 'Extra Help',
    definition:
      'The federal Part D low-income subsidy program that lowers drug plan premiums, deductibles, and copays for people with limited income and assets.',
    whyItMatters: [
      'Drug coverage on paper means little if the copays crowd out the prescriptions. Extra Help caps what anyone earns over the line pays for covered drugs and, for people enrolled in a Medicare Savings Program, it usually arrives automatically. For others it requires an application, most forms of which are short, often through Social Security or the state where Medicare enrollment is filed.',
    ],
    exactHeading: `The exact limits for ${F}`,
    exact: [
      `For ${F} the Extra Help program uses annual income limits of ${money(D.extraHelp.incomeAnnualSingle.amount)} for one person and ${money(D.extraHelp.incomeAnnualCouple.amount)} for a married couple living together, plus resource limits of ${money(D.extraHelp.resourceSingle.amount)} and ${money(D.extraHelp.resourceCouple.amount)}, per Medicare.gov's drug-cost help page (${S.medicareDrugCosts}). The income line sits near ${num(D.extraHelp.fplPercent)} percent of the federal poverty level.`,
      `Extra Help reduces drug plan premiums and deductibles and caps copays. People enrolled in the Medicare Savings Programs qualify for Extra Help automatically and generally do not need to file separately.`,
    ],
    worked:
      `A single retiree with ${money(22000)} of countable annual income and ${money(12000)} in savings applies through Social Security. Both sit under the limits for ${F}, so her drug plan bills almost nothing for the premium, the deductible disappears, and copays drop to small fixed coinsurance amounts for covered prescriptions for the rest of the year.`,
    calculators: [
      link('/calculators/medicare-savings-program-extra-help/', 'MSP + Extra Help calculator', 'Screens both programs at once with 2026 limits and dollar value per month.'),
    ],
    related: ['MSP', 'Asset test', 'Countable assets', 'Part D'],
    sources: [
      row(`Extra Help income limits, ${F}`, `${money(D.extraHelp.incomeAnnualSingle.amount)} single / ${money(D.extraHelp.incomeAnnualCouple.amount)} couple`, S.medicareDrugCosts, 'Medicare.gov, Extra Help with drug costs'),
      row(`Extra Help resource limits, ${F}`, `${money(D.extraHelp.resourceSingle.amount)} / ${money(D.extraHelp.resourceCouple.amount)}`, S.medicareDrugCosts, 'Medicare.gov, Extra Help with drug costs'),
    ],
    updatedOn: CHECKED,
  },
];
