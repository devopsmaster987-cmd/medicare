import { S, F, CHECKED, money, num, pct, link, row } from './text';
import { ACA, A, B, IRS, irmaaBracketsFor } from './figures';
import type { GlossaryTerm } from './types';

export const termsWZ: GlossaryTerm[] = [
  {
    term: 'W-2 wages',
    definition:
      'The wage figure an employer reports at year end, which can differ sharply from the household income that subsidy and affordability tests read.',
    whyItMatters: [
      'Employees naturally judge their premiums against what lands in the bank, but the affordability test reads a broader household figure and the marketplace reads the tax return. A dollar-for-dollar W-2 comparison will misprice the results, sometimes flipping the affordable verdict that decides marketplace eligibility. Several different definitions stand between a pay stub and the real test, and each one moves the line.',
    ],
    exactHeading: 'The exact definitions in play',
    exact: [
      `The W-2 reports wages, tips, and other compensation; the marketplace income test starts from Form 1040's adjusted gross income plus certain tax-exempt additions, summed across the tax family, per HealthCare.gov (${S.healthcareIncome}). The IRS affordability test uses household income at ${pct(ACA.affordabilityPercentage.rate)} for ${F}.`,
      `Pay frequency changes nothing about the test itself; the totals are annualized numbers.`,
    ],
    worked:
      `A single employee's W-2 shows ${money(46000)}; tax-exempt interest adds ${money(800)}, and pre-tax health premiums reduce taxable wages but the affordability test still reads the household figure near ${money(46800)}, not the paycheck. At the ${pct(ACA.affordabilityPercentage.rate)} line the affordable ceiling is ${money((46800 * 0.0996) / 12)} a month, not the number a take-home-pay comparison would suggest.`,
    calculators: [
      link('/calculators/employer-coverage-affordability/', 'Employer coverage affordability', 'Walks through the exact income definition the test uses, not the W-2 shortcut.'),
    ],
    related: ['Household income', 'Affordability percentage', 'Family glitch', 'Premium tax credit'],
    sources: [
      row('Marketplace income definition', 'AGI plus certain tax-exempt income, per the tax return', S.healthcareIncome, 'HealthCare.gov, income and household'),
      row(`Affordability percentage, ${F}`, pct(ACA.affordabilityPercentage.rate), S.irsRp2025_25, 'IRS Revenue Procedure 2025-25'),
    ],
    updatedOn: CHECKED,
  },
  {
    term: 'Work credits',
    definition:
      'Social Security units earned from taxed work each year, assembling toward Medicare and Social Security benefits.',
    whyItMatters: [
      'Work credits decide whether Part A costs nothing, something, or a lot. Medicare records need 40 credits, usually about ten years of covered work, for premium-free Part A, and shortfalls land on the reduced or full premium rungs. A spouse or a late-start career changes the arithmetic, and the SSA statement is the place to check before any enrollment decision.',
    ],
    exactHeading: 'The exact bar',
    exact: [
      `${num(40)} credits, earned over roughly ten years of covered work, generally make Part A premium-free, with spousal and other bases recorded in Medicare.gov's other-paths page (${S.medicareOtherPaths}).`,
      `People under qualification bars pay monthly Part A premiums in 2026 of ${money(A.reducedPremium.amount)} (30-39 quarters) or ${money(A.fullPremium.amount)} (fewer than 30), per the CMS fact sheet below.`,
    ],
    worked:
      `A stay-at-home spouse with two working decades on her own record has enough credits by herself, while a neighbor with a shorter career checks the SSA statement, finds 32 credits, and prices the paid-Part-A reality in at ${money(A.reducedPremium.amount)} a month before enrolling.`,
    calculators: [
      link('/calculators/medicare-vs-aca/', 'Medicare vs ACA decision', 'Places the credits question inside the enrollment timing decision.'),
      link('/calculators/employer-coverage-affordability/', 'Employer coverage affordability', 'Connects paid Part A to marketplace subsidy eligibility.'),
    ],
    related: ['Premium-free Part A', 'Reduced Part A premium', 'Part A', 'Medicare'],
    sources: [
      row('Credits for premium-free Part A', '40 quarters or another qualifying basis', S.medicareOtherPaths, 'Medicare.gov, other paths to Medicare'),
      row(`Part A premiums by credits, ${F}`, `${money(A.reducedPremium.amount)} / ${money(A.fullPremium.amount)}`, S.cms2026AB, 'CMS fact sheet, Parts A & B premiums and deductibles'),
    ],
    updatedOn: CHECKED,
  },
  {
    term: '20-employee rule',
    definition:
      'The Medicare coordination rule keyed to employer size: at 20 or more employees the employer plan generally pays first for a working 65-plus enrollee.',
    whyItMatters: [
      'This single number decides the enrollment question that shapes several years of cost. At larger employers the health plan keeps paying first and Part B can be delayed cleanly; at smaller ones Medicare generally pays first, so delaying Part B without a special enrollment basis builds a permanent penalty. People at small firms get tripped exactly here, especially when the employer never explains the size rule.',
    ],
    exactHeading: 'The exact cutoff',
    exact: [
      `The cutoff is ${num(IRS.employerSizeRule.employees)} employees or more, counted across the employer, per Medicare.gov's who-pays-first page (${S.medicarePaysFirst}). Above it, the working enrollee keeps the employer plan primary; below it, Medicare normally pays first.`,
      `The rule also supplies the SEP logic: the 8-month enrollment window after active employment ends is what makes delayed enrollment lawful rather than penalized.`,
    ],
    worked:
      `Two neighbours turn 65 in the same month: one works at a firm with 60 employees, the other at one with 14. The first can stay unenrolled while the company plan pays first; the second owes Part B enrollment on schedule, because the small-firm rule puts Medicare first, and the calculator notes the penalty that should attach to a delay at that size.`,
    calculators: [
      link('/calculators/medicare-vs-aca/', 'Medicare vs ACA decision', 'Nails down the size question before any cost comparison runs.'),
      link('/calculators/part-b-late-enrollment-penalty/', 'Part B late-enrollment penalty', 'Shows the financial risk of guessing the size rule wrong.'),
    ],
    related: ['Active coverage', 'Employer group health plan', 'SEP', 'Creditable coverage'],
    sources: [
      row('Who pays first', `${num(IRS.employerSizeRule.employees)} or more employees: employer plan generally first`, S.medicarePaysFirst, 'Medicare.gov, who pays first'),
      row('Enrollment after employment', '8 months after active employment ends', S.medicareEmployer, 'Medicare.gov, when can I sign up'),
    ],
    updatedOn: CHECKED,
  },
];
