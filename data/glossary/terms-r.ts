import { S, F, CHECKED, money, num, pct, link, row } from './text';
import { A, B, D, IRS, PEN_B } from './figures';
import type { GlossaryTerm } from './types';

export const termsR: GlossaryTerm[] = [
  {
    term: 'Reduced Part A premium',
    definition:
      'A discounted Part A monthly premium for people with some work credits but not enough for premium-free Part A.',
    whyItMatters: [
      'The Part A premium runs along a sliding scale built on work credits, and people who miss full premium-free status land on one of the paid rungs. The dollar difference is large: premium-free on the low end, roughly the full premium on the lowest rung, so the exact count of quarters decides a significant monthly bill for people entering Medicare with a short work history.',
    ],
    exactHeading: `The exact figures for ${F}`,
    exact: [
      `Thirty to 39 quarters of coverage buy the reduced premium of ${money(A.reducedPremium.amount)} a month, and fewer than 30 quarters leave the full premium of ${money(A.fullPremium.amount)} a month, per the CMS fact sheet below. Forty or more quarters, or another qualifying basis, make Part A premium-free, as Medicare.gov notes on its other-paths page (${S.medicareOtherPaths}).`,
      `Additional quarters of covered work reduce the bill; SSA can report how many credits already sit on the record.`,
    ],
    worked:
      `A returning-to-work retiree has 35 quarters on the record at 65. Part A still costs something every month: the reduced premium of ${money(A.reducedPremium.amount)}, or ${money(A.reducedPremium.amount * 12)} a year. Five more quarters of work would have brought the bill to zero, which is worth a look at the SSA earnings statement before enrollment.`,
    calculators: [
      link('/calculators/medicare-vs-aca/', 'Medicare vs ACA decision', 'Includes the paid-Part-A case in the full cost comparison.'),
      link('/calculators/employer-coverage-affordability/', 'Employer coverage affordability', 'Shows what marketplace subsidies remain available when Part A costs money.'),
    ],
    related: ['Premium-free Part A', 'Part A', 'Work credits', 'Subsidy'],
    sources: [
      row(`Reduced premium (30-39 quarters), ${F}`, money(A.reducedPremium.amount), S.cms2026AB, 'CMS fact sheet, Parts A & B premiums and deductibles'),
      row(`Full premium (fewer than 30 quarters), ${F}`, money(A.fullPremium.amount), S.cms2026AB, 'CMS fact sheet, Parts A & B premiums and deductibles'),
    ],
    updatedOn: CHECKED,
  },
  {
    term: 'Redetermination',
    definition:
      'The first review level of a Medicare claim or coverage decision, handled by the same plan or contractor that made the original call.',
    whyItMatters: [
      'Most Original Medicare claim disagreements end here, at the relitigating of the bill by the paying contractor. Filing the request with missing documentation is how good claims stall, so the term matters for anyone fighting a denied Medicare claim. Part C and Part D plans follow their own internal review structure before any outside appeal.',
      'The redetermination stage is also the cheapest to win, because the first reviewer has the original file and the member supplies the same evidence in a cleaner form. Skipping it does not skip ahead: later appeal levels expect the earlier review to be on the record first.',
    ],
    exactHeading: 'The exact mechanism',
    exact: [
      `For Original Medicare, the first review is a redetermination by the Medicare Administrative Contractor that paid the claim, as Medicare.gov describes on its claims and appeals page (${S.medicareAppeals}). After that, appeals climb through reconsideration and later levels with different reviewers.`,
    ],
    worked:
      `A supplier submits a claim Medicare refuses to pay under Part B. The member redetermination packet includes the original denial letter, the supplier supporting notes, and a cover letter identifying the appeal level. The contractor reverses and the claim pays, end of story, because the denial had been clerical.`,
    calculators: [
      link('/calculators/irmaa-cliff-checker/', 'IRMAA cliff checker', 'Points to the right remedy level for income-surge questions, which SSA handles rather than a claim contractor.'),
    ],
    related: ['Appeal', 'Form SSA-44', 'Prior authorization', 'IRMAA'],
    sources: [
      row('First appeal step', 'Redetermination by the Medicare Administrative Contractor', S.medicareAppeals, 'Medicare.gov, claims and appeals'),
    ],
    updatedOn: CHECKED,
  },
  {
    term: 'Roth conversion',
    definition:
      'Moving retirement money from traditional IRA balances into a Roth account, which makes the converted amount count as income in the tax year it becomes taxable.',
    whyItMatters: [
      'Roth conversions put the full converted amount into ordinary income on the tax return, which means that income can reach IRMAA brackets two years later. Conversions are usually planned converts; the premium tier almost always hits in the later year, since the surcharge cannot be dismissed once the return files it. People retire and convert while ignoring the two-year echo, and then a very high premium arrives.',
    ],
    exactHeading: 'The exact two-year echo',
    exact: [
      `For IRMAA purposes, the IRS tells CMS how much modified adjusted gross income to expect, and the surcharge is set on the tax return filed two years before the premium year, per the CMS fact sheet below. A conversion that completes this year sets the ${F} surcharge in the year two years out.`,
      `The tax rules for Roth IRA accounts sit in the IRS FAQ page (${S.irsRothFaq}); the IRMAA link is CMS's own MAGI-based surcharge schedule.`,
    ],
    worked:
      `A single retiree with a usual MAGI of ${money(90000)} converts ${money(100000)} of traditional IRA in one tax year. The filing shows about ${money(190000)} of MAGI, which puts the return in the tier adding ${money(B.irmaa.single[3].partBAdjustment)} to the premium, or ${money(B.irmaa.single[3].partBTotal)} a month for two premium years. Splitting the conversion across three years of smaller steps caps the MAGI in each year and drops the tier.`,
    calculators: [
      link('/calculators/irmaa-cliff-checker/', 'IRMAA cliff checker', 'Prices a planned conversion against every IRMAA tier and shows the dollars to the next edge.'),
    ],
    related: ['IRMAA', 'MAGI', 'Part B', 'Surcharge'],
    sources: [
      row('Two-year lookback', 'A year-X return sets the X+2 premium', S.cms2026AB, 'CMS fact sheet, Parts A & B premiums and deductibles'),
      row('Roth rules', 'Conversions are taxable events', S.irsRothFaq, 'IRS, Roth account FAQs'),
    ],
    updatedOn: CHECKED,
  },
  {
    term: 'SEP',
    definition:
      'Special Enrollment Period: a time outside the usual windows when a qualifying event, such as losing employer coverage or moving, opens an enrollment window.',
    whyItMatters: [
      'Special enrollment periods are the safety valve of both Medicare and marketplace rules, and they change everything about timing at 65. The most used Medicare SEP is the 8-month window after job-based coverage ends, which is what makes late enrollment defensible for working readers rather than expensive. Other triggers cover moves, loss of low income programs, and marketplace situations alike.',
    ],
    exactHeading: 'The exact windows',
    exact: [
      `For Medicare, when employer coverage ends, the Part B window runs ${num(8)} months after the month the job ended, per Medicare.gov (${S.medicareEmployer}). Marketplace SEPs follow their own trigger dates, enumerated in the HealthCare.gov glossary page (${S.healthcareSep}), generally 60 days from the qualifying event.`,
      `Missing the window does not always mean the general enrollment period wait; low income programs, dual-eligibility changes, and other triggers open their own catch-up slots.`,
    ],
    worked:
      `A job ends in June. The SEP gives eight months; a sign-up through February that year keeps the record penalty-free and coverage can start the month after the request. Waiting until March drops the person into general enrollment territory, where the next coverage start month is July and the calculator on this site shows a surcharge for each uncovered gap.`,
    calculators: [
      link('/calculators/part-b-late-enrollment-penalty/', 'Part B late-enrollment penalty', 'Counts the SEP months in gray and the uncovered delay months in red.'),
      link('/calculators/medicare-vs-aca/', 'Medicare vs ACA decision', 'Sequenced SEP windows for employer coverage, marketplace, and Medicare side by side.'),
    ],
    related: ['IEP', 'General enrollment period', 'Creditable coverage', 'COBRA'],
    sources: [
      row('Medicare SEP after employment', '8 months after active employment or COBRA ends', S.medicareEmployer, 'Medicare.gov, when can I sign up'),
      row('Marketplace SEP', 'Events and windows on the glossary page', S.healthcareSep, 'HealthCare.gov, special enrollment period'),
    ],
    updatedOn: CHECKED,
  },
  {
    term: 'SHIP',
    definition:
      'State Health Insurance Assistance Program: free, unbiased Medicare counseling available in every state through trained local volunteers and staff.',
    whyItMatters: [
      'SHIP is the free first stop when Medicare paper gets too dense. Counselors do not sell anything; they help people compare plans, appeal billing, and apply for savings programs. For states with complex Medicare Savings Program rules, a SHIP counselor walks the local application and documents the income and asset tests that the staff can see.',
      'Using SHIP costs nothing and creates no sales relationship, which is precisely why it pairs well with the calculators on this site: the tools provide the numbers, and a counselor can check them against the local forms and deadlines. That division keeps decisions out of the hands of anyone paid a commission for them.',
    ],
    exactHeading: 'Where it fits',
    exact: [
      `Every state has a SHIP program, identified on the national page (${S.shipHelp}), and all of them counsel among both Original Medicare and the plan alternatives without selling.`,
      `The savings-program paperwork usually runs through the state Medicaid office, and SHIP counselors routinely help people get applications accepted to state programs that have additional disregards.`,
    ],
    worked:
      `A widow facing a Part B billing confusion books a SHIP session. The counselor reads plan documents, finds the denial reason, and files the right appeal form; nothing costs money directly and there is no product sale involved in the session.`,
    calculators: [
      link('/calculators/medicare-savings-program-extra-help/', 'MSP + Extra Help calculator', 'Shows where the state SHIP program sits for your launch state.'),
    ],
    related: ['State Medicaid agency', 'MSP', 'Appeal', 'Redetermination'],
    sources: [
      row('SHIP program', 'National locator for free Medicare counseling', S.shipHelp, 'SHIP, national program page'),
      row('Medicare counseling overview', 'Medicare.gov guidance on free help with Medicare choices', S.medicareGov, 'Medicare.gov'),
    ],
    updatedOn: CHECKED,
  },
];
