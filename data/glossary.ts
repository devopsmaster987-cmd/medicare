export type GlossaryTerm = {
  term: string;
  definition: string;
};

export const glossary: GlossaryTerm[] = [
  { term: 'MAGI', definition: 'Modified adjusted gross income. It is the income figure used for IRMAA and Marketplace subsidy tests, with some adjustments added back to adjusted gross income.' },
  { term: 'IRMAA', definition: 'Income-Related Monthly Adjustment Amount. An extra Part B and Part D charge when your income is above a set threshold.' },
  { term: 'QMB', definition: 'Qualified Medicare Beneficiary. A Medicare Savings Program that can pay Part A and Part B premiums and cost sharing.' },
  { term: 'SLMB', definition: 'Specified Low-Income Medicare Beneficiary. A Medicare Savings Program that can pay the Part B premium.' },
  { term: 'QI', definition: 'Qualifying Individual. A Medicare Savings Program that can pay the Part B premium, with limited funding in some states.' },
  { term: 'Extra Help', definition: 'The Part D Low-Income Subsidy. It can lower Part D premiums, deductibles, and copays.' },
  { term: 'FPL', definition: 'Federal Poverty Level. A yearly income guideline published by the federal government and used by many benefit programs.' },
  { term: 'Premium tax credit', definition: 'A Marketplace subsidy that lowers the monthly cost of a health plan for eligible households.' },
  { term: 'Deductible', definition: 'The amount you pay for covered care before the plan starts paying its share.' },
  { term: 'Coinsurance', definition: 'Your share of a covered service after the deductible, usually a percentage.' },
  { term: 'Copay', definition: 'A fixed dollar amount you pay for a covered service or prescription.' },
  { term: 'Part A', definition: 'The Medicare hospital insurance part. It covers inpatient care, skilled nursing facility care, hospice, and some home health care.' },
  { term: 'Part B', definition: 'The Medicare medical insurance part. It covers doctor visits, outpatient care, preventive services, and some supplies.' },
  { term: 'Part D', definition: 'The Medicare prescription drug benefit, sold through private plans.' },
  { term: 'Premium', definition: 'The monthly amount you pay to keep a health or drug plan active.' },
  { term: 'SEP', definition: 'Special Enrollment Period. A time outside the usual enrollment window when you can sign up because of a qualifying event.' },
  { term: 'IEP', definition: 'Initial Enrollment Period. The seven-month window around your 65th birthday when most people first sign up for Medicare.' },
  { term: 'Creditable coverage', definition: 'Coverage that is at least as good as Medicare for the benefit being delayed. It can protect you from a late-enrollment penalty.' },
  { term: 'Minimum value', definition: 'A standard for employer coverage that pays at least 60% of covered health costs on average.' },
  { term: 'Affordability percentage', definition: 'The share of household income the IRS treats as an affordable employee-only premium for the year.' },
  { term: 'Household income', definition: 'For Marketplace purposes, the combined income of the people on your tax return, not just your own W-2 wages.' },
  { term: 'W-2 wages', definition: 'Wages reported by an employer on a W-2 form. They can differ from the household income used for Marketplace subsidies.' },
  { term: 'Family glitch', definition: 'The gap that can leave family members without affordable employer coverage when only the employee-only premium is tested.' },
  { term: 'MSP', definition: 'Medicare Savings Program. A state program that can help pay Medicare premiums and, for some programs, cost sharing.' },
  { term: 'Countable assets', definition: 'The resources a program counts when testing eligibility, such as bank accounts and some investments. The rules vary by program and state.' },
  { term: 'Medicaid', definition: 'A joint federal and state program that provides health coverage to eligible people with limited income and resources.' },
  { term: 'HSA', definition: 'Health Savings Account. A tax-advantaged account paired with a high-deductible health plan. Contributions must stop before Medicare Part A begins.' },
  { term: 'Roth conversion', definition: 'Moving money from a traditional IRA or retirement account into a Roth account. The converted amount can raise MAGI and affect IRMAA two years later.' },
  { term: 'Surcharge', definition: 'An extra amount added to a standard premium. IRMAA is an income-related Part B and Part D surcharge.' },
  { term: 'Life-changing event', definition: 'An event SSA recognizes when reviewing an IRMAA appeal, such as retirement, marriage, divorce, or the death of a spouse.' },
  { term: 'Medicare', definition: 'The federal health insurance program for people age 65 and older and some younger people with qualifying disabilities or conditions.' },
  { term: 'Medicare Advantage', definition: 'A private plan that delivers Medicare Part A and Part B benefits, and sometimes Part D, in place of Original Medicare. Network and authorization rules vary by plan.' },
  { term: 'Medigap', definition: 'A private supplemental policy that helps pay some Original Medicare cost sharing. It is not the same as Medicare Advantage.' },
  { term: 'Out-of-pocket maximum', definition: 'The most you pay in covered cost sharing during a plan year before the plan pays the full covered share. Premiums usually do not count toward this limit.' },
  { term: 'Subsidy', definition: 'Financial help that lowers the cost of coverage or care. The rules and eligibility tests depend on the program.' },
  { term: 'Cost-sharing reduction', definition: 'A Marketplace benefit that lowers deductibles, copays, and coinsurance for eligible people who enroll in a Silver plan.' },
  { term: 'Formulary', definition: 'The list of prescription drugs a drug plan covers, including the tiers and any rules that apply to each drug.' },
  { term: 'Network', definition: 'The doctors, hospitals, pharmacies, and other providers that a health plan has contracted with to provide covered care.' },
  { term: 'Prior authorization', definition: 'A plan review that must happen before certain services or drugs are covered. A plan may approve, deny, or limit the request.' },
  { term: 'Annual enrollment period', definition: 'A yearly window when people with Medicare can change certain Medicare coverage choices for the next plan year.' },
  { term: 'Open enrollment period', definition: 'A yearly window when people can enroll in or change Marketplace coverage, subject to state and federal rules.' },
  { term: 'General enrollment period', definition: 'A yearly Medicare window for people who missed their first chance to enroll and do not qualify for a special enrollment period.' },
  { term: 'Late enrollment penalty', definition: 'A permanent addition to a premium when someone delays enrollment without qualifying coverage. The amount depends on the Medicare part involved.' },
  { term: 'Work credits', definition: 'Social Security credits earned from taxed work. Enough credits, or a qualifying relationship to a worker, can make Part A premium-free.' },
  { term: 'Premium-free Part A', definition: 'Part A with no monthly premium because you or a spouse have enough work credits or another qualifying status.' },
  { term: 'Reduced Part A premium', definition: 'A lower Part A premium for some people who have some work credits but not enough for premium-free Part A.' },
  { term: 'Dual eligible', definition: 'A person who qualifies for both Medicare and Medicaid. The two programs can work together to cover premiums and care costs.' },
  { term: 'Spend-down', definition: 'A state Medicaid process that lets someone with income or assets above a limit qualify after spending excess amounts on medical care.' },
  { term: 'Income disregard', definition: 'Income that an eligibility program leaves out when it applies its income test. Disregards can change whether someone qualifies.' },
  { term: 'Asset test', definition: 'A limit on countable resources used by some benefit programs. The resource rules and exclusions vary by program and state.' },
  { term: 'State Medicaid agency', definition: 'The state office that runs Medicaid and usually processes Medicare Savings Program applications for that state.' },
  { term: 'SHIP', definition: 'State Health Insurance Assistance Program. A free counseling service that helps people understand Medicare choices and problems.' },
  { term: 'Appeal', definition: 'A formal request to review a coverage, payment, or eligibility decision. The deadline and process depend on the decision.' },
  { term: 'Redetermination', definition: 'The first level of review for a Medicare claim or coverage decision. It is handled by the plan or contractor that made the original decision.' },
  { term: 'Form SSA-44', definition: 'The Social Security form used to ask for an IRMAA review after a qualifying life-changing event.' },
  { term: 'Employer group health plan', definition: 'Health coverage offered through an employer to a group of workers. The plan rules can depend on employer size and whether coverage is active.' },
  { term: 'Active coverage', definition: 'Coverage from a current employer while you or your spouse still work there. It can affect when Medicare enrollment is required.' },
  { term: 'Retiree coverage', definition: 'Health coverage from a former employer after you leave work. It is different from active employer coverage for Medicare enrollment rules.' },
  { term: 'COBRA', definition: 'A temporary continuation of group health coverage after a qualifying event. It generally does not count as active employer coverage for Medicare enrollment.' },
  { term: '20-employee rule', definition: 'The Medicare coordination rule that turns on employer size for active coverage. At 20 or more employees, the employer plan generally pays first for a worker age 65 or older.' },
];

export function glossarySlug(term: string): string {
  return term
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');
}

export function glossaryBySlug(slug: string): GlossaryTerm | undefined {
  return glossary.find((entry) => glossarySlug(entry.term) === slug);
}

export const glossaryByTerm: Record<string, string> = Object.fromEntries(
  glossary.map((entry) => [entry.term, entry.definition]),
);

export type GlossaryTipEntry = {
  definition: string;
  href: string;
};

export function glossaryTipsFor(terms: readonly string[]): Record<string, GlossaryTipEntry> {
  const tips: Record<string, GlossaryTipEntry> = {};
  for (const term of terms) {
    const definition = glossaryByTerm[term];
    if (!definition) {
      throw new Error(`Unknown glossary term: ${term}`);
    }
    tips[term] = { definition, href: `/glossary/${glossarySlug(term)}` };
  }
  return tips;
}
