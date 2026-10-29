import { S, F, CHECKED, money, link, row } from './text';
import type { GlossaryTerm } from './types';

export const termsExtra: GlossaryTerm[] = [
  {
    term: 'MAGI',
    definition:
      'Modified adjusted gross income: the adjusted gross income line from Form 1040 with a few tax-exempt items added back, and the income figure IRMAA and marketplace tests read.',
    whyItMatters: [
      'MAGI is the number that silently sets IRMAA tiers two years later and opens the marketplace subsidy door, and it is not the same as W-2 pay or take-home income. Tax-exempt interest, tax-exempt savings bond interest, and excluded foreign income all get added back to adjusted gross income for the IRMAA computation, which is why people with modest paychecks can still land in a surcharge tier.',
    ],
    exactHeading: 'The exact composition',
    exact: [
      `For IRMAA, MAGI equals adjusted gross income plus excluded foreign income, tax-exempt savings bond interest (the old Series EE and I line), and tax-exempt interest earned in the same year, as Form SSA-44's instructions lay out (${S.ssaForm44}) and the CMS fact sheet's two-year rule confirms (${S.cms2026AB}). The return from two years earlier sets the current premium.`,
      `The marketplace MAGI definition is similar but its own test, described on HealthCare.gov (${S.healthcareIncome}), and it uses the poverty guidelines from one year earlier.`,
    ],
    worked:
      `A single filer with adjusted gross income of ${money(95000)} and ${money(6000)} of tax-exempt interest reports MAGI of ${money(101000)}, under the ${money(109000)} first cutoff for the ${F} premium year. A Roth conversion in the meantime pushes adjusted gross income to ${money(120000)}, MAGI to ${money(126000)}, and the same return set lands in the first surcharge tier instead.`,
    calculators: [
      link('/calculators/irmaa-cliff-checker/', 'IRMAA cliff checker', 'Builds the MAGI entry the IRMAA tiers actually read, with the two-year lag built in.'),
      link('/calculators/employer-coverage-affordability/', 'Employer coverage affordability', 'Uses the tax-return family definition the affordability test applies.'),
    ],
    related: ['IRMAA', 'Household income', 'W-2 wages', 'Roth conversion'],
    sources: [
      row('MAGI components for IRMAA', 'AGI plus tax-exempt interest and excluded foreign income', S.ssaForm44, 'SSA, Form SSA-44 instructions'),
      row('Two-year rule', 'A year-X return sets the X+2 premium', S.cms2026AB, 'CMS fact sheet, Parts A & B premiums and deductibles'),
    ],
    updatedOn: CHECKED,
  },
  {
    term: 'Medicaid',
    definition:
      'The joint federal-state health coverage program for people with limited income and resources, run by each state under federal rules.',
    whyItMatters: [
      'Medicaid is the floor beneath Medicare for people with limited means, and the programs interlock: Medicaid saves premiums through the Medicare Savings Programs, covers drug costs in combination with Extra Help, and services Medicare does not. Eligibility, spend-down mechanics, and benefit packages are state decisions, so the same income lands differently across state lines.',
    ],
    exactHeading: 'The exact structure',
    exact: [
      `Medicaid is federal and state at once: the federal government sets required coverage groups and minimums, each state sets eligibility details within that frame, and the state Medicaid agency decides applications, per Medicaid.gov's state locator (${S.medicaidGovByState}).`,
      `Around Medicare, the connector programs are the Medicare Savings Programs, which Medicaid offices administer (${S.medicareMsp}), and dual eligibility, where Medicaid covers services Medicare does not.`,
    ],
    worked:
      `A retiree with low income applies through the state Medicaid office, clears the QMB line, and ends up with two programs working at once: Medicare pays the claim first, Medicaid or the QMB designation covers the premiums and cost sharing behind it, and the pharmacy bills combine the two without double-billing. The same income in a neighboring state can route through different agencies but reach a similar result.`,
    calculators: [
      link('/calculators/medicare-savings-program-extra-help/', 'MSP + Extra Help calculator', 'Runs the Medicaid-office programs by state, with the launch-state rules it has verified.'),
    ],
    related: ['Dual eligible', 'MSP', 'State Medicaid agency', 'Spend-down'],
    sources: [
      row('State programs', 'Federal and state structure by state', S.medicaidGovByState, 'Medicaid.gov, state office locator'),
      row('Medicare Savings Programs', 'Medicaid-administered premium help', S.medicareMsp, 'Medicare.gov, Medicare Savings Programs'),
    ],
    updatedOn: CHECKED,
  },
  {
    term: 'Retiree coverage',
    definition:
      'Health coverage a former employer offers after employment ends, often in coordination with Medicare, with rules different from active employer coverage.',
    whyItMatters: [
      'Retiree coverage is the comfort that follows people into retirement, but it never behaves like the active version: it does not hold the Part B special enrollment window open, and its promise depends entirely on the employer plan documents. Retirees still on a plan need to check both whether Medicare is expected to pay first and whether the retiree plan pairs with, instead of replacing, Parts A and B.',
    ],
    exactHeading: 'The exact difference',
    exact: [
      `Retiree coverage comes from a former employer, not a current job, so the active-coverage SEP rules tied to current employment do not apply, as Medicare.gov's working-past-65 page and sign-up pages explain (${S.medicareWorkingPast65}). Many retiree plans are built to coordinate with Medicare Parts A and B rather than substitute for them.`,
      `Creditability for Part D can be certified by the plan sponsor; creditability for a Part B delay does not exist without current employment itself.`,
    ],
    worked:
      `A former executive retires at 63 and carries the firm's retiree plan to 65. At 65 he enrolls in Part A and Part B on schedule, and the retiree plan steps in as the supplement behind Medicare, paying some of what Parts A and B leave behind. Had he treated the retiree plan reason enough to skip Medicare, the Part B penalty window would have been running the whole time.`,
    calculators: [
      link('/calculators/medicare-vs-aca/', 'Medicare vs ACA decision', 'Distinguishes retiree coverage from active coverage inside the decision tree.'),
      link('/calculators/part-b-late-enrollment-penalty/', 'Part B late-enrollment penalty', 'Shows the penalty when retiree coverage is mistaken for active coverage.'),
    ],
    related: ['Active coverage', 'COBRA', 'Creditable coverage', 'Employer group health plan'],
    sources: [
      row('Working past 65', 'How employer coverage coordinates at 65 and later', S.medicareWorkingPast65, 'Medicare.gov, working past 65'),
    ],
    updatedOn: CHECKED,
  },
  {
    term: 'Network',
    definition:
      'The doctors, hospitals, pharmacies, and other providers a plan has contracted to treat its members under set terms.',
    whyItMatters: [
      'Networks are the fine print most people meet with a scheduling call. Plan types handle outside doctors differently: a managed plan can refuse out-of-network care outside emergencies while Original Medicare allows almost any provider that accepts Medicare. Networks change year to year, and an annual plan review is the only routine way to keep preferred doctors on the card without surprise denials.',
    ],
    exactHeading: 'The exact structure',
    exact: [
      `Plan documents list the network rules by plan type: managed plans keep care inside a closed list and cost-sharing discounts, and Medicare Advantage plans publish their lists with exceptions for urgent care, per the plan comparison materials Medicare.gov maintains (${S.medicarePlanFinder}). Original Medicare does not maintain a network; the question is whether a provider accepts assignment.`,
      `Out-of-network cost sharing can run several times higher than in-network cost sharing, and networks reset at plan year boundaries.`,
    ],
    worked:
      `A member's cardiologist is in network this year and also in the rival plan, but drops from the network at the January reset. During the annual enrollment window the member switches to the rival plan so the doctor stays covered; staying put would turn every follow-up visit into an out-of-network charge.`,
    calculators: [
      link('/calculators/medicare-vs-aca/', 'Medicare vs ACA decision', `Contrasts networked plan structures with Original Medicare's open provider rule.`),
    ],
    related: ['Formulary', 'Prior authorization', 'Medicare Advantage', 'Annual enrollment period'],
    sources: [
      row('Plan comparison', 'Networks and provider lists by plan', S.medicarePlanFinder, 'Medicare.gov, Plan Finder'),
      row('Original Medicare claiming', 'Any provider that accepts Medicare assignment', S.medicareCosts, 'Medicare.gov, what does Medicare cost'),
    ],
    updatedOn: CHECKED,
  },
];
