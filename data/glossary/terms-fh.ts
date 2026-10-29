import { S, F, P, CHECKED, money, num, pct, dateRange, link, row } from './text';
import { ACA, B, D, FPL } from './figures';
import type { GlossaryTerm } from './types';

export const termsFH: GlossaryTerm[] = [
  {
    term: 'Family glitch',
    definition:
      'The old rule that judged whole families by the employee-only premium, blocking spouses and children from marketplace help. A 2022 federal fix now tests the family premium separately.',
    whyItMatters: [
      'For years, a family could be priced out of employer coverage yet locked out of marketplace subsidies, because the affordability test only looked at the employee-only premium. The family glitch was the name for that gap. The rule changed in late 2022 so family members are now tested against the actual family premium, which restores their access to premium tax credits and cost-sharing reductions when employer family coverage is too expensive.',
    ],
    exactHeading: 'The exact fix',
    exact: [
      `Since the 2022 regulation, spouses and dependents are tested against the lowest-cost family plan premium, not the employee-only premium. The affordability percentage for ${F} is ${pct(ACA.affordabilityPercentage.rate)} of household income, the same standard published in the Federal Register fix (${S.treasuryFamilyGlitch}) and the annual IRS revenue procedure.`,
      `The employee-only test still governs the worker. Family members get their own result, which can differ, and a family member found unaffordable is generally eligible for marketplace help.`,
    ],
    worked:
      `An employee earning ${money(45000)} has an employer plan: employee-only premium ${money(150)} a month, family premium ${money(950)} a month. The employee-only ceiling for that income is ${money((45000 * 0.0996) / 12)}, so the worker is covered affordably. Under the old rule the family was deemed affordable too; under the fix, the ${money(950)} family premium tops the same ceiling, so the spouse and children can apply for marketplace tax credits while the worker stays on the plan.`,
    calculators: [
      link('/calculators/employer-coverage-affordability/', 'Employer coverage affordability', 'Tests the employee-only and family premiums separately, the fixed-rule way.'),
    ],
    related: ['Affordability percentage', 'Minimum value', 'Premium tax credit', 'Employer group health plan'],
    sources: [
      row('Family affordability fix', 'Employment-based family affordability, 2022 Federal Register rule', S.treasuryFamilyGlitch, 'Federal Register, affordability of employer coverage for family members'),
      row(`Affordability percentage, ${F}`, pct(ACA.affordabilityPercentage.rate), S.irsRp2025_25, 'IRS Revenue Procedure 2025-25'),
    ],
    updatedOn: CHECKED,
  },
  {
    term: 'Form SSA-44',
    definition:
      'The Social Security form that asks SSA to recompute an IRMAA decision after a life-changing event reduced income, such as retirement or the death of a spouse.',
    whyItMatters: [
      'IRMAA looks backward at an old tax year, so a person whose income dropped after the fact can still be billed high premiums for years. Form SSA-44 is the remedy: it documents the life-changing event and estimates current-year income so SSA can re-derive the surcharge. Filing it late means paying the higher premiums until SSA fixes them.',
    ],
    exactHeading: 'What the form carries',
    exact: [
      `The official form is published by SSA (${S.ssaForm44}), and it lists the qualifying life-changing events in the table of the same name, including marriage, divorce, annulment, retirement, income-reducing job loss, and the death of a spouse. SSA's program manual records these events at ${S.ssaPomsLce}.`,
      `The form asks for proof of the event and an estimate of adjusted gross income, plus tax-exempt interest, for the year being adjusted. Estimates should follow Form 1040 logic, not a guess.`,
    ],
    worked:
      `A doctor retires in 2026, but her 2024 return, the basis of her ${F} IRMAA, shows a top tier. She files SSA-44 with the retirement date, a letter from the practice, and a 2026 income estimate of ${money(84000)}, below the first single-person IRMAA bracket, which starts above the no-IRMAA range. SSA resets the ${F} surcharge to zero and refunds the overpaid premiums once the paperwork is processed.`,
    calculators: [
      link('/calculators/irmaa-cliff-checker/', 'IRMAA cliff checker', 'Shows the surcharge SSA removes when the form is granted, month by month.'),
    ],
    related: ['IRMAA', 'Life-changing event', 'Appeal', 'MAGI'],
    sources: [
      row('Form SSA-44', 'Income-Related Monthly Adjustment Amount - Life-Changing Event', S.ssaForm44, 'SSA, official Form SSA-44'),
      row('Life-changing event list', 'Marriage, divorce, retirement, income-reducing work loss, death of a spouse, and others', S.ssaPomsLce, 'SSA, POMS GN 01120.005'),
    ],
    updatedOn: CHECKED,
  },
  {
    term: 'Formulary',
    definition:
      'The list of prescription drugs a drug plan covers, with the tiers and rules attached to each drug.',
    whyItMatters: [
      'In Part D and many employer plans, the formulary is the price tag. The same drug can sit in a cheap generic tier in one plan and an expensive tier in another, and plan pharmacies use the formulary rules to decide quantity limits and substitute drugs. Formularies change every plan year, which is why the annual enrollment period is when memberships get repriced from this list.',
    ],
    exactHeading: 'The exact structure',
    exact: [
      `A plan's formulary lists covered drugs grouped by tier, with the cost sharing and limits such as prior authorization set beside each tier. Medicare plan materials must publish the drug list, and the Medicare Plan Finder (${S.medicarePlanFinder}) compares two formularies side by side.`,
      `Tiering descends from the cheapest (usually generics) to the most expensive drugs. Plans move drugs between tiers each year, and drug coverage that steps off the list can raise out-of-pocket costs until the next appeal or plan change.`,
    ],
    worked:
      `A member's maintenance drug sits on the generic tier in the current plan at a small copay, but the rival plan her sister uses prices the same drug two tiers up. Next year the current plan removes that drug from the formulary entirely, so during the annual window she moves the same prescription to a plan that still lists it in the tier. The total drug cost for the year is set by this list, ahead of any pharmacy visit.`,
    calculators: [
      link('/calculators/medicare-savings-program-extra-help/', 'MSP + Extra Help calculator', 'Extra Help shrinks the copays the formulary tiers charge.'),
    ],
    related: ['Copay', 'Network', 'Prior authorization', 'Part D'],
    sources: [
      row('Formulary structure', 'Tiered drug list with plan-set cost sharing and limits', S.medicarePartDCosts, 'Medicare.gov, Part D costs'),
      row('Plan comparison', `Publishes each plan's covered drugs`, S.medicarePlanFinder, 'Medicare.gov, Plan Finder'),
    ],
    updatedOn: CHECKED,
  },
  {
    term: 'FPL',
    definition:
      'Federal Poverty Level: the yearly income guideline the federal government publishes, used by Medicare, Medicaid, and marketplace programs.',
    whyItMatters: [
      'Almost every means-tested figure in this area is quoted as a percent of the federal poverty guidelines, from Extra Help to MSP tiers to marketplace subsidies. So the raw guideline number is the peg each threshold hangs on. The Marketplace uses the guidelines from one year earlier for a coverage year, which shifts the trigger each January.',
    ],
    exactHeading: `The exact figures for ${F}`,
    exact: [
      `For the 48 contiguous states and the District of Columbia, the ${F} guideline is ${money(FPL.annual[1])} for one person, ${money(FPL.annual[2])} for two, ${money(FPL.annual[4])} for four, and ${money(FPL.addPerPerson)} per additional person above eight, per the HHS poverty guidelines page (${S.aspePoverty}) published in January. Alaska and Hawaii use higher guidelines, which Medicare.gov and ACA pages note.`,
      `For ${F} coverage, the Marketplace uses the ${P} guidelines (published in January ${P}), per HealthCare.gov's income page (${S.healthcareIncome}).`,
    ],
    worked:
      `The Extra Help income limit for one person marks ${num(D.extraHelp.fplPercent)} percent of the ${F} guideline: ${money(FPL.annual[1])} times 1.5 is ${money(FPL.annual[1] * 1.5)}, which matches the published Extra Help income line of ${money(D.extraHelp.incomeAnnualSingle.amount)} for one person. A reader now has the peg behind the dollar figure, not just the figure.`,
    calculators: [
      link('/calculators/medicare-savings-program-extra-help/', 'MSP + Extra Help calculator', 'Converts household size and income into percent of poverty against every program line.'),
      link('/calculators/employer-coverage-affordability/', 'Employer coverage affordability', 'Uses poverty guidelines to size marketplace options when employer coverage fails.'),
    ],
    related: ['Household income', 'Premium tax credit', 'Cost-sharing reduction', 'Extra Help'],
    sources: [
      row(`HHS poverty guidelines, ${F}`, `${money(FPL.annual[1])} one person; ${money(FPL.annual[4])} family of four`, S.aspePoverty, 'HHS, annual poverty guidelines'),
      row('Federal Register publication', 'January notice with the poverty guideline table', S.federalRegister2026Poverty, 'Federal Register, annual update of HHS poverty guidelines'),
    ],
    updatedOn: CHECKED,
  },
  {
    term: 'General enrollment period',
    definition:
      'The yearly Medicare window, January through March, for people who missed their enrollment chance and have no special enrollment period.',
    whyItMatters: [
      'Medicare enrollment windows are unforgiving. If someone reaches 65 without either employer coverage or a sign-up, they must wait for the general enrollment period, and the cost of the delay is a Part B penalty plus a coverage gap. In Original Medicare the window runs from January 1 to March 31 each year with coverage starting the following July 1.',
    ],
    exactHeading: 'The exact window',
    exact: [
      `The general enrollment period runs ${dateRange(1, 1, 3, 31)} each year, with Medicare coverage beginning July 1 of the same year, per Medicare.gov's penalty-avoidance page (${S.medicareAvoidPenalties}). Anyone in this window who missed their initial period generally owes the late-enrollment penalty.`,
      `The only escape hatch is a qualifying special enrollment period, most famously the 8 months after an active-enrollment employer plan ends.`,
    ],
    worked:
      `A retiree turned 65, never enrolled, and has no employer coverage anywhere on the horizon. She must wait for the general enrollment period, and the calculator on this site prices the miss: each full 12 months of delay adds 10 percent of the standard Part B premium, ${money(0.1 * B.standardPremium.amount)} a month on top of the standard premium, permanently, and coverage starts no sooner than July.`,
    calculators: [
      link('/calculators/part-b-late-enrollment-penalty/', 'Part B late-enrollment penalty', 'Computes the penalty a missed window creates, including the gap-month costs.'),
      link('/calculators/medicare-vs-aca/', 'Medicare vs ACA decision', 'Flags the risk of sliding into the general-enrollment path after a job ends.'),
    ],
    related: ['Late enrollment penalty', 'SEP', 'Part B', 'Annual enrollment period'],
    sources: [
      row('General enrollment window', 'January 1 through March 31; coverage starts July 1', S.medicareAvoidPenalties, 'Medicare.gov, avoiding Medicare penalties'),
    ],
    updatedOn: CHECKED,
  },
  {
    term: 'Household income',
    definition:
      'For subsidy rules, the combined income of everyone on your tax return, not just your own take-home pay.',
    whyItMatters: [
      'The term household income, not wages, is what marketplace subsidies and most Medicare tests and employer affordability checks actually measure. It counts the MAGI of everyone shareling the tax filing, which means tax-exempt interest, tax-exempt portions of benefits, and a spouse signing up on the same return all show up. Employees who think in take-home pay get a surprise when the marketplace or the affordability test reads a differently composed amount.',
    ],
    exactHeading: 'What is included',
    exact: [
      `Marketplace rules define household income as the adjusted gross income line from Form 1040, plus certain tax-exempt additions such as tax-exempt interest, tax-exempt Social Security benefits, and non-taxable foreign income, summed across the family members on the return, as HealthCare.gov's income page (${S.healthcareIncome}) explains.`,
      `IRMAA and employer affordability checks use a similar tax-based figure rather than paycheck stubs, so pay stubs, W-2s, and bank transfers alone are not the full match.`,
    ],
    worked:
      `A spouse works for ${money(48000)}; her husband claims ${money(900)} of tax-exempt interest; and they file jointly. Household income lands near ${money(48000 + 900)}, not the lower paycheck total, and it is this higher number the affordability test applies at ${pct(ACA.affordabilityPercentage.rate)}. A plan premium that looks fine against take-home pay can quietly cross the line.`,
    calculators: [
      link('/calculators/employer-coverage-affordability/', 'Employer coverage affordability', 'Uses the tax-return definition when it applies the affordability line.'),
      link('/calculators/irmaa-cliff-checker/', 'IRMAA cliff checker', 'Explains how MAGI, the same idea on the Medicare side, sets IRMAA tiers.'),
    ],
    related: ['W-2 wages', 'MAGI', 'Premium tax credit', 'Affordability percentage'],
    sources: [
      row('Marketplace income definition', 'AGI plus certain tax-exempt income from the tax return', S.healthcareIncome, 'HealthCare.gov, income and household'),
      row('Employer test', pct(ACA.affordabilityPercentage.rate), S.irsRp2025_25, 'IRS Revenue Procedure 2025-25'),
    ],
    updatedOn: CHECKED,
  },
  {
    term: 'HSA',
    definition:
      'Health Savings Account: a tax-advantaged account attached to a high-deductible health plan that must be stopped at the right point before Medicare Part A begins.',
    whyItMatters: [
      'HSA accounts collect expenses for medical costs tax-free, and the rules tie their use strictly to high-deductible plan coverage without Medicare. Crossing the line by contributing after Medicare begins brings a penalty, because Part A can be backdated, and the penalty travels through an excise tax of the contribution. For workers past 65 the contribution stop is the single most time-sensitive rule in this whole area.',
    ],
    exactHeading: 'The exact stopping rule',
    exact: [
      `HSA law ties eligibility to no Medicare enrollment and no disqualifying coverage. The practical buffer is six months: stop HSA contributions six months before Medicare Part A begins, per Medicare.gov's sign-up page (${S.medicareEmployer}), because Part A can be backdated up to six months. IRS Publication 969 (${S.irsPub969}) provides the contribution, distribution, and penalty rules.`,
      `Contributions during the high-deductible plan months before Medicare begins remain allowed, and distributions after age 65 can be used for the medical costs without the tax penalty tied to older non-medical withdrawals.`,
    ],
    worked:
      `A worker enrolling in Medicare effective January 1 follows the six-month buffer: the last contributions go in with the June 30 payroll of the prior year, six full months ahead of the Medicare start date. The reasoning comes from the backdating rule: Part A can begin up to six months before the month the application marks, so a payroll contribution landing inside those six months would draw the excess-contribution penalty from Publication 969. Contributions made before then stay in the account.`,
    calculators: [
      link('/calculators/medicare-vs-aca/', 'Medicare vs ACA decision', 'Places the HSA stop date inside your personal Medicare enrollment timeline.'),
    ],
    related: ['Medicare', 'Medigap', 'Active coverage', 'Part A'],
    sources: [
      row('HSA eligibility and penalties', 'No contributions from the Medicare start month, backdated up to six months', S.irsPub969, 'IRS Publication 969, HSAs'),
      row('Six-month buffer', 'Stop HSA contributions six months before Part A begins', S.medicareEmployer, 'Medicare.gov, when can I sign up'),
    ],
    updatedOn: CHECKED,
  },
];
