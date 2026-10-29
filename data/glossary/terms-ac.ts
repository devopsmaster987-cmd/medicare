import { S, F, CHECKED, money, num, pct, dateRange, link, row } from './text';
import { A, ACA, D, IRS } from './figures';
import type { GlossaryTerm } from './types';

export const termsAC: GlossaryTerm[] = [
  {
    term: 'Active coverage',
    definition:
      'Health plan from a current employer for a worker or spouse who is still employed there. This is the coverage that can protect you from a Part B late-enrollment penalty.',
    whyItMatters: [
      'People who work past 65 often keep the employer plan, and it looks wasteful to pay for Part B on top of it. Federal coordination rules decide which plan pays first, and only coverage from a current employer keeps the Part B enrollment clock open without risk.',
      'When the employer has 20 or more employees, the employer plan generally pays first for a worker age 65 or older, so the worker can delay Medicare without penalty until the job ends. Below that size, Medicare generally pays first, and delaying Part B starts the clock on a permanent penalty instead.',
    ],
    exactHeading: 'The exact test',
    exact: [
      `The test is about the kind of plan, not just any plan. Coverage counts as active only when it comes from current employment, through the employer of the worker or the worker's spouse. Retiree plans, COBRA continuation, and marketplace plans do not count as active coverage for the enrollment rules.`,
      `Employer size decides who pays first. At ${num(IRS.employerSizeRule.employees)} or more employees the plan generally pays first, so you can delay Part B while the job lasts; below that size Medicare generally pays first and delay can cost a penalty. Medicare.gov documents both rules on its who-pays-first page (${S.medicarePaysFirst}) and its enrollment page (${S.medicareEmployer}).`,
    ],
    worked:
      `Rosa is 67, works 30 hours a week at a firm with 90 employees, and is on the company plan. The coverage is active, the employer clears the size rule, and the plan pays first, so she has not signed up for Part B and owes no penalty. When the job ends, her special enrollment window for Part B runs for 8 months from the last month of employment, not from the day the plan coverage stops.`,
    calculators: [
      link('/calculators/medicare-vs-aca/', 'Medicare vs ACA decision', 'Checks the employer-size rule and the enrollment window against your age and job.'),
      link('/calculators/part-b-late-enrollment-penalty/', 'Part B late-enrollment penalty', 'Shows the cost of delay if employer coverage is not creditable.'),
    ],
    related: ['COBRA', 'Retiree coverage', 'Employer group health plan', 'Creditable coverage'],
    sources: [
      row('Employer-size coordination rule', `${num(IRS.employerSizeRule.employees)} or more employees: employer plan generally pays first`, S.medicarePaysFirst, 'Medicare.gov, who pays first'),
      row('Part B special enrollment window', '8 months after active employment ends', S.medicareEmployer, 'Medicare.gov, when can I sign up'),
    ],
    updatedOn: CHECKED,
  },
  {
    term: 'Affordability percentage',
    definition: `The share of household income the IRS allows as the maximum employee-only premium under this year's employer-coverage affordability test.`,
    whyItMatters: [
      'The IRS sets one percentage each year for the ACA affordability test. If the lowest-cost employee-only plan costs more than this share of household income, the plan is unaffordable under the rule, and that fact generally opens the door to marketplace tax credits instead. Every employer affordability result, including the one on this site, is anchored on this single number.',
    ],
    exactHeading: `The exact figure for ${F}`,
    exact: [
      `For ${F} the affordability percentage is ${pct(ACA.affordabilityPercentage.rate)} of household income, published in IRS Revenue Procedure 2025-25 (${S.irsRp2025_25}). The IRS updates it annually, and drifting premiums keep the test tight.`,
      `The test applies to the employee-only premium for the lowest-cost plan that provides minimum value. Spouses and dependents are tested separately against the family premium under the family-glitch fix, using the same percentage.`,
    ],
    worked:
      `A single employee with a household income of ${money(60000)} is tested against a ceiling of ${money(60000)} times ${pct(ACA.affordabilityPercentage.rate)}, which is ${money(60000 * 0.0996)} for the year, or ${money((60000 * 0.0996) / 12)} a month. If the cheapest employee-only plan costs ${money(400)} a month, it is under the ceiling, so the plan is affordable and marketplace tax credits are generally off the table for that worker. If the same plan cost ${money(425)} a month, it would cross the line.`,
    calculators: [
      link('/calculators/employer-coverage-affordability/', 'Employer coverage affordability', 'Applies the exact percentage to your premium and income.'),
      link('/calculators/medicare-vs-aca/', 'Medicare vs ACA decision', 'Uses the same test when employer coverage competes with Medicare or the marketplace.'),
    ],
    related: ['Minimum value', 'Family glitch', 'Premium tax credit', 'Household income'],
    sources: [
      row(`Affordability percentage, ${F}`, pct(ACA.affordabilityPercentage.rate), S.irsRp2025_25, 'IRS Revenue Procedure 2025-25'),
    ],
    updatedOn: CHECKED,
  },
  {
    term: 'Annual enrollment period',
    definition:
      'The yearly Medicare window for changing Part D drug plans, Medicare Advantage plans, or both, for the next calendar year.',
    whyItMatters: [
      `Drug plans and Medicare Advantage plans change their drug lists, networks, deductibles, and premiums every calendar year, so the plan that was cheapest last year can quietly cost the most next year. The annual enrollment period is the one reliable window each year to make those changes. Missing it does not lock you in forever, but you can spend a full plan year on a plan whose costs are set to rise for you.`,
    ],
    exactHeading: 'The exact window',
    exact: [
      `Medicare's annual enrollment period runs ${dateRange(10, 15, 12, 7)} every year, per Medicare.gov's enrollment page (${S.medicareEmployer}). Coverage you pick during the window begins January 1 of the next year, and your old plan covers you until December 31.`,
      `Joining Original Medicare itself, buying Medigap, and a handful of special situations all sit outside this window; special enrollment periods move people for moves, lost creditable coverage, and low-income program approvals.`,
    ],
    worked:
      `A member notices her drug plan will raise its deductible to ${money(D.deductible.amount)} next year and move her refill drug up a tier. During the window she compares the same refill under a rival plan's published drug list and switches. The change takes effect January 1, and there is no penalty for making the move.`,
    calculators: [
      link('/calculators/part-b-late-enrollment-penalty/', 'Part B late-enrollment penalty', 'Shows where this window sits beside the initial and special enrollment periods.'),
      link('/calculators/irmaa-cliff-checker/', 'IRMAA cliff checker', 'Explains how plan changes interact with income surcharges that plan choice cannot remove.'),
    ],
    related: ['Open enrollment period', 'General enrollment period', 'SEP', 'Part D'],
    sources: [
      row(`Medicare change window, ${F}`, `${dateRange(10, 15, 12, 7)} each year`, S.medicareEmployer, 'Medicare.gov, when can I sign up for Medicare'),
    ],
    updatedOn: CHECKED,
  },
  {
    term: 'Appeal',
    definition:
      'A formal request to review a coverage, payment, or eligibility decision you believe is wrong, through a fixed process with real deadlines.',
    whyItMatters: [
      'Plans deny claims and coverage requests, and the appeal is the formal way to push back. Deadlines are short and the burden to file is on you, so the process is worth understanding before a denial shrinks your care options. A missed deadline is the most avoidable way for a valid denial to stand.',
    ],
    exactHeading: 'The exact structure',
    exact: [
      `For plan-level decisions on Part C and Part D, the review starts inside the plan as a coverage determination and can climb through organized appeal levels outside the plan that a Medicare reviewer handles. For Original Medicare claims, the first level is the redetermination handled by the Medicare Administrative Contractor, as Medicare.gov describes on its claims and appeals page (${S.medicareAppeals}).`,
      `The denial notice sets the deadline for the next step and lists what proof to attach. When access to care is at risk, expedited appeals compress the review timing.`,
    ],
    worked:
      `A Part D plan refuses a prescription at the counter because it is not on the formulary. The pharmacist and prescriber file an expedited coverage determination, attach the prescriber's note on why alternatives do not fit, and the plan reverses within the fast-track window printed in the denial paperwork. Keeping the written denial intact opens every later appeal level.`,
    calculators: [
      link('/calculators/irmaa-cliff-checker/', 'IRMAA cliff checker', 'Points to the SSA review path when the contested decision is an income surcharge, not a claim.'),
    ],
    related: ['Redetermination', 'Form SSA-44', 'Life-changing event', 'Prior authorization'],
    sources: [
      row('Appeal process', 'Appeals begin with the plan or contractor that made the original decision', S.medicareAppeals, 'Medicare.gov, claims and appeals'),
    ],
    updatedOn: CHECKED,
  },
  {
    term: 'Asset test',
    definition:
      'A limit on countable resources, such as bank accounts and investments, that eligibility programs apply alongside their income test.',
    whyItMatters: [
      'Many income-tested programs look only at income, but the Medicare Savings Programs and Extra Help also apply a resource test. Two households with identical income can land on opposite sides of an eligibility line because one has savings on hand and the other does not. Whether a test exists, what counts, and what is excluded differ by program and by state, which is why applications are decided from documents, not estimates.',
    ],
    exactHeading: `The exact figures for ${F}`,
    exact: [
      `For the Medicare Savings Programs in ${F}, the resource limits are ${money(9950)} for one person and ${money(14910)} for a married couple, per Medicare.gov's savings-program page (${S.medicareMsp}). For Extra Help the limits are ${money(D.extraHelp.resourceSingle.amount)} and ${money(D.extraHelp.resourceCouple.amount)}, per Medicare.gov's drug-cost help page (${S.medicareDrugCosts}).`,
      `Countable assets are things you could turn into cash: bank deposits, stocks, certificates of deposit, and savings bonds. Your primary home, one car, and certain burial arrangements are generally excluded. Retirement accounts and life insurance cash value are treated differently by program, and some states use different rules, so a complete application with statements matters.`,
    ],
    worked:
      `A retiree applying for QMB has ${money(8930)} in a savings account, a paid-off house, and one car. The house and car are excluded from the same test, the ${money(8930)} sits under the ${money(9950)} single-person limit by ${money(9950 - 8930)}, so the resource test passes and the income test is the only remaining gate.`,
    calculators: [
      link('/calculators/medicare-savings-program-extra-help/', 'MSP + Extra Help', 'Tests income and assets against both programs at once, with launch-state rules.'),
    ],
    related: ['Countable assets', 'Extra Help', 'MSP', 'Income disregard'],
    sources: [
      row(`MSP resource limits, ${F}`, `${money(9950)} single / ${money(14910)} couple`, S.medicareMsp, 'Medicare.gov, Medicare Savings Programs'),
      row(`Extra Help resource limits, ${F}`, `${money(D.extraHelp.resourceSingle.amount)} single / ${money(D.extraHelp.resourceCouple.amount)} couple`, S.medicareDrugCosts, 'Medicare.gov, Extra Help with drug costs'),
    ],
    updatedOn: CHECKED,
  },
  {
    term: 'COBRA',
    definition:
      'Temporary continuation of a job-based group health plan after employment ends or hours drop, usually at the full cost of the plan.',
    whyItMatters: [
      'COBRA answers the urgent question after a job loss, but near 65 it creates a timing trap. The continuation plan keeps medical bills covered while it lasts, yet for Medicare enrollment rules it is not active employer coverage. Treating COBRA as a reason to keep delaying Part B is one of the most expensive misreadings in this area, because the enrollment clock usually runs from the job, not from the insurance.',
    ],
    exactHeading: 'The exact rule',
    exact: [
      `If you take COBRA after a job ends, your Part B special enrollment window runs for ${num(8)} months after the month active employment ends, or until COBRA ends, whichever comes first, as Medicare.gov's enrollment page (${S.medicareEmployer}) describes. The Labor Department's COBRA overview (${S.dolCobra}) explains who qualifies for continuation and how long it can last.`,
      `For someone already on an employer plan at 65, the active-coverage rules do not change. COBRA only enters the picture when job-based coverage is about to end, or for people who never enrolled in an employer plan and are only continuing one.`,
    ],
    worked:
      `Wade's job ends in May at age 66 and he elects COBRA through the end of the plan year, ending in November. His Part B window is already open: the 8-month window closes in January, 8 months after the job ended in May, even though COBRA coverage still runs through November. Signing up within the window keeps his record clean; waiting for COBRA to lapse pushes him into general-enrollment territory and a possible permanent penalty.`,
    calculators: [
      link('/calculators/part-b-late-enrollment-penalty/', 'Part B late-enrollment penalty', 'Shows the penalty if the COBRA period is treated as protected time and is not.'),
      link('/calculators/medicare-vs-aca/', 'Medicare vs ACA decision', 'Compares COBRA against marketplace and Medicare timing after a job loss.'),
    ],
    related: ['Active coverage', 'Creditable coverage', 'Retiree coverage', 'SEP'],
    sources: [
      row('COBRA basics', 'Plan continuation after job loss or reduced hours, at full premium', S.dolCobra, 'U.S. Department of Labor, COBRA overview'),
      row('Part B enrollment after employment', '8 months after employment ends or COBRA ends, whichever comes first', S.medicareEmployer, 'Medicare.gov, when can I sign up'),
    ],
    updatedOn: CHECKED,
  },
  {
    term: 'Coinsurance',
    definition:
      `Your percentage share of a covered service's cost after the deductible is met.`,
    whyItMatters: [
      'Coinsurance is the reason a deductible alone understates what Original Medicare costs. After the annual deductible, Medicare pays most but not all of each covered bill, and the remaining share has no cap in Original Medicare. Budgeting for Part B means budgeting for a percentage of every covered service, which is the gap Medigap policies are built to fill.',
    ],
    exactHeading: `The exact figures for ${F}`,
    exact: [
      `Part B coinsurance is ${pct(0.2)} of the Medicare-approved amount after the deductible, per Medicare.gov's cost overview (${S.medicareCosts}). Part A coinsurance applies inside hospital stays: ${money(A.hospitalCoinsuranceDays61to90.amount)} per day for days 61-90, ${money(A.lifetimeReserveDays.amount)} per day for lifetime-reserve days, and ${money(A.skilledNursingDays21to100.amount)} per day for days 21-100 of a skilled nursing stay, all 2026 figures from the CMS fact sheet below.`,
      `Part D plans mix copays and percentage coinsurance by drug tier, and the annual out-of-pocket cap bounds the total you can spend on covered drugs in the plan year.`,
    ],
    worked:
      `A Part B member with no Medigap has a covered outpatient service with a Medicare-approved amount of ${money(2000)} after the deductible is met. Medicare pays 80 percent and the member owes ${money(2000 * 0.2)}. A second service costs the same share again, because Original Medicare has no annual stop-loss. A Medigap policy that covers the Part B coinsurance would absorb the ${money(2000 * 0.2)} share.`,
    calculators: [
      link('/calculators/irmaa-cliff-checker/', 'IRMAA cliff checker', 'Places these cost-sharing amounts next to the income-based premium surcharge.'),
      link('/calculators/medicare-vs-aca/', 'Medicare vs ACA decision', 'Puts Medicare cost sharing beside marketplace plan cost sharing.'),
    ],
    related: ['Deductible', 'Copay', 'Out-of-pocket maximum', 'Medigap'],
    sources: [
      row('Part B coinsurance', pct(0.2), S.medicareCosts, 'Medicare.gov, what does Medicare cost'),
      row(`Part A coinsurance 2026`, `${money(A.hospitalCoinsuranceDays61to90.amount)} days 61-90 / ${money(A.skilledNursingDays21to100.amount)} SNF days 21-100`, S.cms2026AB, 'CMS fact sheet, Parts A & B premiums and deductibles'),
      row('Part D cost sharing', 'Plan-set copays and coinsurance, bounded by the annual cap', S.medicarePartDCosts, 'Medicare.gov, Part D costs'),
    ],
    updatedOn: CHECKED,
  },
  {
    term: 'Copay',
    definition:
      'A fixed dollar amount charged for a specific covered service or prescription instead of a percentage of the cost.',
    whyItMatters: [
      'Copays make cost sharing predictable: the same flat fee at each fill or visit regardless of list price. Drug plans lean on copays for formulary tiers, employer plans and Medicare Advantage plans use them for services, and the amount is in the plan documents before you pick. The split between fixed copays and percentage coinsurance changes the arithmetic when prescriptions or services are expensive.',
    ],
    exactHeading: 'The exact structure',
    exact: [
      `Original Medicare charges no fixed copay for most Part B services; the pattern there is a deductible plus coinsurance. Copays appear in Part D plans, Medicare Advantage plans and employer plans, set by each plan's formulary tier. The plan's documents and the Medicare Plan Finder (${S.medicarePlanFinder}) spell out the exact schedule.`,
      `Every plan copay counts toward the Part D out-of-pocket cap for the plan year, so the fixed fees have a stop-loss above them.`,
    ],
    worked:
      `A drug plan lists a ${money(7)} copay for the generic tier and a higher copay for the brand tier. A member filling two generic prescriptions a month always pays the flat ${money(7)} at the counter, no matter what the drug costs. A brand-name user pays the higher copay at every refill until total yearly cost sharing reaches the Part D cap of ${money(D.outOfPocketCap.amount)}.`,
    calculators: [
      link('/calculators/medicare-savings-program-extra-help/', 'MSP + Extra Help', 'Extra Help lowers drug copays and caps them for people who qualify.'),
    ],
    related: ['Coinsurance', 'Deductible', 'Formulary', 'Out-of-pocket maximum'],
    sources: [
      row('Plan copays', 'Fixed fees set by each plan by formulary tier', S.medicarePartDCosts, 'Medicare.gov, Part D costs'),
      row(`Part D out-of-pocket cap, ${F}`, money(D.outOfPocketCap.amount), S.medicarePartDCosts, 'Medicare.gov, Part D costs'),
    ],
    updatedOn: CHECKED,
  },
];
