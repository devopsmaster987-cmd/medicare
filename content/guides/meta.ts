import { dataVerifiedOn } from '@/data/verified';

export type GuideRelatedLink = {
  href: string;
  label: string;
};

export type GuideMeta = {
  slug: string;
  h1: string;
  title: string;
  description: string;
  summary: string;
  related: GuideRelatedLink[];
  publishedOn: string;
  updatedOn: string;
};

export const guides: GuideMeta[] = [
  {
    slug: 'ssa-44-form-irmaa-appeal',
    h1: 'SSA 44 form IRMAA appeal',
    title: 'SSA 44 form IRMAA appeal: how to ask SSA to use newer income',
    description:
      'Use the SSA 44 form IRMAA appeal when a life-changing event cut your income. See the accepted reasons, the proof SSA usually asks for, and the steps.',
    summary:
      'How Form SSA-44 works, which life-changing events qualify, what proof to gather, and what to ask Social Security before you file.',
    related: [
      { href: '/calculators/irmaa-cliff-checker', label: 'IRMAA cliff checker' },
      { href: '/guides/how-to-lower-irmaa', label: 'How to lower IRMAA' },
      {
        href: '/guides/irmaa-married-filing-separately',
        label: 'IRMAA and married filing separately',
      },
    ],
    publishedOn: dataVerifiedOn,
    updatedOn: dataVerifiedOn,
  },
  {
    slug: 'how-to-lower-irmaa',
    h1: 'How to lower IRMAA',
    title: 'How to lower IRMAA: the levers that actually change the premium',
    description:
      'Learn how to lower IRMAA with the SSA 44 appeal, better income timing, and a check of the two-year lookback. See the current brackets and a worked example.',
    summary:
      'The practical levers for an IRMAA reduction, the deadlines that matter, and the moves that do not change the surcharge.',
    related: [
      { href: '/calculators/irmaa-cliff-checker', label: 'IRMAA cliff checker' },
      { href: '/guides/ssa-44-form-irmaa-appeal', label: 'SSA 44 form IRMAA appeal' },
      { href: '/guides/roth-conversion-irmaa', label: 'Roth conversion and IRMAA' },
    ],
    publishedOn: dataVerifiedOn,
    updatedOn: dataVerifiedOn,
  },
  {
    slug: 'roth-conversion-irmaa',
    h1: 'Roth conversion IRMAA',
    title: 'Roth conversion IRMAA: the two-year trap to check first',
    description:
      'Roth conversion IRMAA is a two-year timing problem. See the current brackets, the headroom math, and how to time a conversion before the cliff.',
    summary:
      'Why a conversion can raise a Medicare premium two years later, how to measure the headroom, and what to confirm with a tax preparer.',
    related: [
      { href: '/calculators/irmaa-cliff-checker', label: 'IRMAA cliff checker' },
      { href: '/guides/how-to-lower-irmaa', label: 'How to lower IRMAA' },
      {
        href: '/guides/irmaa-married-filing-separately',
        label: 'IRMAA and married filing separately',
      },
    ],
    publishedOn: dataVerifiedOn,
    updatedOn: dataVerifiedOn,
  },
  {
    slug: 'what-income-counts-for-marketplace-subsidies',
    h1: 'What income is used for marketplace subsidies',
    title: 'What income is used for marketplace subsidies: MAGI and household rules',
    description:
      'See what income is used for marketplace subsidies, how MAGI is built, whose income counts, and which poverty guideline year the Marketplace applies.',
    summary:
      'A plain walk through MAGI, household composition, the prior-year poverty guideline, and the 400% limit that still matters.',
    related: [
      {
        href: '/calculators/employer-coverage-affordability',
        label: 'Employer coverage affordability',
      },
      { href: '/guides/400-fpl-subsidy-cliff', label: '400 FPL subsidy cliff' },
      { href: '/guides/family-glitch-fix-explained', label: 'Family glitch fix explained' },
    ],
    publishedOn: dataVerifiedOn,
    updatedOn: dataVerifiedOn,
  },
  {
    slug: 'irmaa-married-filing-separately',
    h1: 'Does IRMAA apply to married filing separately',
    title: 'Does IRMAA apply to married filing separately? Thresholds and steps',
    description:
      'Does IRMAA apply to married filing separately? Yes, and the first surcharge threshold is much lower. See the current table and how each spouse is billed.',
    summary:
      'The separate-filer IRMAA table, why the thresholds are lower, and how to check each spouse’s notice.',
    related: [
      { href: '/calculators/irmaa-cliff-checker', label: 'IRMAA cliff checker' },
      { href: '/guides/ssa-44-form-irmaa-appeal', label: 'SSA 44 form IRMAA appeal' },
    ],
    publishedOn: dataVerifiedOn,
    updatedOn: dataVerifiedOn,
  },
  {
    slug: 'hsa-and-medicare-6-month-rule',
    h1: 'HSA and Medicare 6 month rule',
    title: 'HSA and Medicare 6 month rule: when contributions must stop',
    description:
      'The HSA and Medicare 6 month rule exists because Part A can be backdated. See the stop date, the excess-contribution risk, and what to do at 65.',
    summary:
      'Why contributions must stop months before Part A, how the six-month backdate works, and how to handle a contribution that went in too late.',
    related: [
      { href: '/calculators/medicare-vs-aca', label: 'Medicare vs ACA' },
      { href: '/guides/medicare-part-a-backdate', label: 'When does Medicare Part A backdate' },
    ],
    publishedOn: dataVerifiedOn,
    updatedOn: dataVerifiedOn,
  },
  {
    slug: 'medicare-part-a-backdate',
    h1: 'When does Medicare Part A backdate',
    title: 'When does Medicare Part A backdate: the six-month rule',
    description:
      'When does Medicare Part A backdate? Up to six months before you apply, if you delayed enrollment. See the dates, the premium effect, and the HSA risk.',
    summary:
      'How the six-month Part A backdate works, who it affects, and why the date can matter more than the enrollment form.',
    related: [
      { href: '/calculators/medicare-vs-aca', label: 'Medicare vs ACA' },
      { href: '/guides/hsa-and-medicare-6-month-rule', label: 'HSA and Medicare 6 month rule' },
    ],
    publishedOn: dataVerifiedOn,
    updatedOn: dataVerifiedOn,
  },
  {
    slug: '400-fpl-subsidy-cliff',
    h1: '400 FPL subsidy cliff {year}',
    title: '400 FPL subsidy cliff {year}: the income line to watch',
    description:
      'The 400 FPL subsidy cliff {year} is the income line where premium tax credits can end. See the dollar limits by household size and the current law status.',
    summary:
      'The 400% poverty-line limit for premium tax credits, the dollar amounts by household size, and the status of the enhanced subsidies.',
    related: [
      {
        href: '/calculators/employer-coverage-affordability',
        label: 'Employer coverage affordability',
      },
      {
        href: '/guides/what-income-counts-for-marketplace-subsidies',
        label: 'What income is used for marketplace subsidies',
      },
      { href: '/guides/family-glitch-fix-explained', label: 'Family glitch fix explained' },
    ],
    publishedOn: dataVerifiedOn,
    updatedOn: dataVerifiedOn,
  },
  {
    slug: 'part-d-out-of-pocket-cap',
    h1: 'Part D out of pocket cap {year}',
    title: 'Part D out of pocket cap {year}: what it covers and what it does not',
    description:
      'The Part D out of pocket cap {year} limits what you pay for covered drugs, not premiums. See the current cap, deductible, and the costs that stay outside it.',
    summary:
      'How the annual Part D cap works, which spending counts toward it, and why the premium and IRMAA stay separate.',
    related: [
      {
        href: '/calculators/medicare-savings-program-extra-help',
        label: 'Medicare Savings Program and Extra Help',
      },
      { href: '/calculators/medicare-vs-aca', label: 'Medicare vs ACA' },
    ],
    publishedOn: dataVerifiedOn,
    updatedOn: dataVerifiedOn,
  },
  {
    slug: 'family-glitch-fix-explained',
    h1: 'Family glitch fix explained {year}',
    title: 'Family glitch fix explained {year}: the family premium test',
    description:
      'The family glitch fix explained {year}: family members can qualify for Marketplace help when the family premium is unaffordable. See the test and an example.',
    summary:
      'What changed, which premium is tested for the employee and for the family, and how to avoid the most common mistake.',
    related: [
      {
        href: '/calculators/employer-coverage-affordability',
        label: 'Employer coverage affordability',
      },
      {
        href: '/guides/what-income-counts-for-marketplace-subsidies',
        label: 'What income is used for marketplace subsidies',
      },
      { href: '/guides/400-fpl-subsidy-cliff', label: '400 FPL subsidy cliff' },
    ],
    publishedOn: dataVerifiedOn,
    updatedOn: dataVerifiedOn,
  },
  {
    slug: 'medicare-part-b-premium-increase',
    h1: 'Medicare Part B premium increase {year}',
    title: 'Medicare Part B premium increase {year}: what changed and who pays it',
    description:
      'The Medicare Part B premium increase {year} moved the standard monthly premium and deductible. See the current amounts, the annual cost, and why IRMAA can add more.',
    summary:
      'The standard premium, the dollar change from last year, and the reasons your own Part B amount can be higher.',
    related: [
      { href: '/calculators/part-b-late-enrollment-penalty', label: 'Part B late enrollment penalty' },
      { href: '/calculators/irmaa-cliff-checker', label: 'IRMAA cliff checker' },
      { href: '/calculators/medicare-vs-aca', label: 'Medicare vs ACA' },
    ],
    publishedOn: dataVerifiedOn,
    updatedOn: dataVerifiedOn,
  },
  {
    slug: 'medicare-part-b-deductible',
    h1: 'Medicare Part B deductible {year}',
    title: 'Medicare Part B deductible {year}: how it works with coinsurance',
    description:
      'The Medicare Part B deductible {year} is the amount you pay before Medicare shares covered costs. See the current amount, the 20 percent coinsurance, and a worked example.',
    summary:
      'The annual deductible, the coinsurance that follows, and the coverage choices that can change your out-of-pocket cost.',
    related: [
      { href: '/guides/medicare-part-b-premium-increase', label: 'Medicare Part B premium increase' },
      { href: '/calculators/medicare-savings-program-extra-help', label: 'Medicare Savings Program' },
      { href: '/calculators/part-b-late-enrollment-penalty', label: 'Part B late enrollment penalty' },
    ],
    publishedOn: dataVerifiedOn,
    updatedOn: dataVerifiedOn,
  },
  {
    slug: 'medicare-part-a-premium',
    h1: 'Medicare Part A premium {year}',
    title: 'Medicare Part A premium {year}: who pays and who does not',
    description:
      'The Medicare Part A premium {year} depends on your work quarters. See who pays nothing, the reduced and full premiums, and how to check your record.',
    summary:
      'The 40-quarter rule, the reduced and full premiums, and the work records that decide which one applies.',
    related: [
      { href: '/calculators/medicare-vs-aca', label: 'Medicare vs ACA' },
      { href: '/calculators/medicare-savings-program-extra-help', label: 'Medicare Savings Program' },
      { href: '/guides/medicare-part-b-premium-increase', label: 'Medicare Part B premium increase' },
    ],
    publishedOn: dataVerifiedOn,
    updatedOn: dataVerifiedOn,
  },
  {
    slug: 'medicare-part-d-late-enrollment-penalty',
    h1: 'Medicare Part D late enrollment penalty',
    title: 'Medicare Part D late enrollment penalty: how the permanent surcharge works',
    description:
      'The Medicare Part D late enrollment penalty adds a permanent surcharge to your drug premium. See how the 1 percent rule works, what counts as creditable coverage, and how to avoid it.',
    summary:
      'How the penalty is calculated, which coverage prevents it, and why waiting can cost more than the premium itself.',
    related: [
      { href: '/guides/part-d-out-of-pocket-cap', label: 'Part D out of pocket cap' },
      { href: '/calculators/medicare-savings-program-extra-help', label: 'Medicare Savings Program' },
      { href: '/calculators/part-b-late-enrollment-penalty', label: 'Part B late enrollment penalty' },
    ],
    publishedOn: dataVerifiedOn,
    updatedOn: dataVerifiedOn,
  },
  {
    slug: 'medicare-initial-enrollment-period',
    h1: 'Medicare initial enrollment period',
    title: 'Medicare initial enrollment period: the 7-month window explained',
    description:
      'The Medicare initial enrollment period is a seven-month window around your 65th birthday. See when it starts, what to enroll in, and what happens if you work past 65.',
    summary:
      'The seven-month window, the first-of-month rule, and the employer coverage that can change the timing.',
    related: [
      { href: '/calculators/medicare-vs-aca', label: 'Medicare vs ACA' },
      { href: '/calculators/part-b-late-enrollment-penalty', label: 'Part B late enrollment penalty' },
      { href: '/calculators/employer-coverage-affordability', label: 'Employer coverage affordability' },
    ],
    publishedOn: dataVerifiedOn,
    updatedOn: dataVerifiedOn,
  },
  {
    slug: 'medicare-general-enrollment-period',
    h1: 'Medicare general enrollment period',
    title: 'Medicare general enrollment period: dates, coverage start, and penalties',
    description:
      'The Medicare general enrollment period runs from January 1 through March 31. See who should use it, when coverage starts, and how late enrollment penalties work.',
    summary:
      'Who the yearly window is for, when coverage begins, and the penalties that do not disappear.',
    related: [
      { href: '/guides/medicare-initial-enrollment-period', label: 'Medicare initial enrollment period' },
      { href: '/calculators/part-b-late-enrollment-penalty', label: 'Part B late enrollment penalty' },
      { href: '/calculators/medicare-vs-aca', label: 'Medicare vs ACA' },
    ],
    publishedOn: dataVerifiedOn,
    updatedOn: dataVerifiedOn,
  },
  {
    slug: 'medicare-part-a-late-enrollment-penalty',
    h1: 'Medicare Part A late enrollment penalty',
    title: 'Medicare Part A late enrollment penalty: who pays and for how long',
    description:
      'The Medicare Part A late enrollment penalty is 10 percent of the Part A premium for twice the number of years you delayed. See who pays it and how the duration works.',
    summary:
      'The premium test, the twice-the-years rule, and the work record that decides whether the penalty applies.',
    related: [
      { href: '/guides/medicare-part-a-premium', label: 'Medicare Part A premium' },
      { href: '/guides/medicare-part-a-40-quarters-rule', label: 'Part A 40 quarters rule' },
      { href: '/calculators/part-b-late-enrollment-penalty', label: 'Part B late enrollment penalty' },
    ],
    publishedOn: dataVerifiedOn,
    updatedOn: dataVerifiedOn,
  },
  {
    slug: 'medicare-special-enrollment-period-while-working',
    h1: 'Medicare special enrollment period while working',
    title: 'Medicare special enrollment period while working: the 8-month window',
    description:
      'Medicare special enrollment period while working lets you delay Part B with qualifying employer coverage. See the 20-employee rule, the 8-month window, and the proof to keep.',
    summary:
      'The employer size test, the eight-month window, and the coverage types that do not qualify.',
    related: [
      { href: '/calculators/medicare-vs-aca', label: 'Medicare vs ACA' },
      { href: '/guides/medicare-initial-enrollment-period', label: 'Medicare initial enrollment period' },
      { href: '/calculators/employer-coverage-affordability', label: 'Employer coverage affordability' },
    ],
    publishedOn: dataVerifiedOn,
    updatedOn: dataVerifiedOn,
  },
  {
    slug: 'medicare-part-a-40-quarters-rule',
    h1: 'Medicare Part A 40 quarters rule',
    title: 'Medicare Part A 40 quarters rule: how to qualify for premium-free Part A',
    description:
      'The Medicare Part A 40 quarters rule decides whether you pay a premium. See how quarters are earned, how a spouse\'s record counts, and what happens if you are short.',
    summary:
      'How work quarters are earned, how the 40-quarter threshold works, and what to do if the record is short.',
    related: [
      { href: '/guides/medicare-part-a-premium', label: 'Medicare Part A premium' },
      { href: '/guides/medicare-part-a-late-enrollment-penalty', label: 'Part A late enrollment penalty' },
      { href: '/calculators/medicare-savings-program-extra-help', label: 'Medicare Savings Program' },
    ],
    publishedOn: dataVerifiedOn,
    updatedOn: dataVerifiedOn,
  },
  {
    slug: 'medicare-and-cobra',
    h1: 'Medicare and COBRA',
    title: 'Medicare and COBRA: which pays first and when to enroll',
    description:
      'Medicare and COBRA can overlap, but COBRA usually does not let you delay Part B. See who pays first, when coverage may end, and how to avoid a penalty.',
    summary:
      'How the two coverages coordinate, why COBRA is not current employment coverage, and the drug coverage trap.',
    related: [
      { href: '/calculators/medicare-vs-aca', label: 'Medicare vs ACA' },
      { href: '/guides/medicare-initial-enrollment-period', label: 'Medicare initial enrollment period' },
      { href: '/guides/medicare-and-retiree-health-coverage', label: 'Medicare and retiree coverage' },
    ],
    publishedOn: dataVerifiedOn,
    updatedOn: dataVerifiedOn,
  },
  {
    slug: 'medicare-and-retiree-health-coverage',
    h1: 'Medicare and retiree health coverage',
    title: 'Medicare and retiree health coverage: who pays first',
    description:
      'Medicare and retiree health coverage usually work with Medicare paying first. See why enrolling on time matters, how drug coverage is tested, and what to compare.',
    summary:
      'Coordination rules, the risk of delaying Part B, and the drug coverage notice that decides Part D.',
    related: [
      { href: '/guides/medicare-and-cobra', label: 'Medicare and COBRA' },
      { href: '/guides/medicare-part-d-late-enrollment-penalty', label: 'Part D late enrollment penalty' },
      { href: '/calculators/medicare-vs-aca', label: 'Medicare vs ACA' },
    ],
    publishedOn: dataVerifiedOn,
    updatedOn: dataVerifiedOn,
  },
  {
    slug: 'medicare-and-va-benefits',
    h1: 'Medicare and VA benefits',
    title: 'Medicare and VA benefits: can you have both?',
    description:
      'Medicare and VA benefits can be used together. See how the two systems differ, why VA drug coverage is generally not creditable, and when to enroll in Medicare.',
    summary:
      'How the two systems fit together, the Part D creditable coverage issue, and the care choices veterans face.',
    related: [
      { href: '/guides/medicare-part-d-late-enrollment-penalty', label: 'Part D late enrollment penalty' },
      { href: '/guides/medicare-initial-enrollment-period', label: 'Medicare initial enrollment period' },
      { href: '/calculators/medicare-savings-program-extra-help', label: 'Medicare Savings Program' },
    ],
    publishedOn: dataVerifiedOn,
    updatedOn: dataVerifiedOn,
  },
  {
    slug: 'medicare-and-fehb',
    h1: 'Medicare and FEHB',
    title: 'Medicare and FEHB: which plan pays first?',
    description:
      'Medicare and FEHB can work together, but the order depends on your status. See the retiree and active employee rules, the Part B timing, and the drug coverage test.',
    summary:
      'The coordination rules for federal retirees and active employees, the Part B timing, and the FEHB drug coverage notice.',
    related: [
      { href: '/guides/medicare-and-retiree-health-coverage', label: 'Medicare and retiree coverage' },
      { href: '/guides/medicare-and-tricare', label: 'Medicare and TRICARE' },
      { href: '/calculators/medicare-vs-aca', label: 'Medicare vs ACA' },
    ],
    publishedOn: dataVerifiedOn,
    updatedOn: dataVerifiedOn,
  },
  {
    slug: 'medicare-and-tricare',
    h1: 'Medicare and TRICARE',
    title: 'Medicare and TRICARE: how TRICARE for Life works at 65',
    description:
      'Medicare and TRICARE for Life generally work together after 65. See the Part B requirement, who pays first, and what happens if you delay.',
    summary:
      'The Part B requirement, the order of payment, and the drug coverage rules for military retirees.',
    related: [
      { href: '/guides/medicare-and-va-benefits', label: 'Medicare and VA benefits' },
      { href: '/guides/medicare-and-fehb', label: 'Medicare and FEHB' },
      { href: '/calculators/part-b-late-enrollment-penalty', label: 'Part B late enrollment penalty' },
    ],
    publishedOn: dataVerifiedOn,
    updatedOn: dataVerifiedOn,
  },
  {
    slug: 'medicare-for-people-with-disabilities',
    h1: 'Medicare for people with disabilities',
    title: 'Medicare for people with disabilities: eligibility and timing',
    description:
      'Medicare for people with disabilities can start before 65. See the 24-month SSDI path, the ALS exception, the enrollment window, and the work rules.',
    summary:
      'The SSDI waiting period, the exceptions, the enrollment window, and the work incentives that can affect coverage.',
    related: [
      { href: '/guides/medicare-and-als', label: 'Medicare and ALS' },
      { href: '/guides/medicare-and-end-stage-renal-disease', label: 'Medicare and ESRD' },
      { href: '/calculators/medicare-savings-program-extra-help', label: 'Medicare Savings Program' },
    ],
    publishedOn: dataVerifiedOn,
    updatedOn: dataVerifiedOn,
  },
  {
    slug: 'medicare-and-end-stage-renal-disease',
    h1: 'Medicare and end stage renal disease',
    title: 'Medicare and end stage renal disease: eligibility and enrollment',
    description:
      'Medicare and end stage renal disease can connect before 65. See the dialysis and transplant triggers, the work record, and the employer coordination rules.',
    summary:
      'The ESRD eligibility path, the treatment-based start date, and the coordination with employer group coverage.',
    related: [
      { href: '/guides/medicare-for-people-with-disabilities', label: 'Medicare for people with disabilities' },
      { href: '/guides/medicare-and-als', label: 'Medicare and ALS' },
      { href: '/calculators/medicare-savings-program-extra-help', label: 'Medicare Savings Program' },
    ],
    publishedOn: dataVerifiedOn,
    updatedOn: dataVerifiedOn,
  },
  {
    slug: 'medicare-and-als',
    h1: 'Medicare and ALS',
    title: 'Medicare and ALS: why the 24-month wait is waived',
    description:
      'Medicare and ALS generally start together when disability benefits begin. See the faster eligibility path, the enrollment steps, and the equipment and drug coverage.',
    summary:
      'The waived waiting period, the enrollment window, and the equipment and drug coverage that matter after diagnosis.',
    related: [
      { href: '/guides/medicare-for-people-with-disabilities', label: 'Medicare for people with disabilities' },
      { href: '/guides/medicare-and-end-stage-renal-disease', label: 'Medicare and ESRD' },
      { href: '/calculators/medicare-savings-program-extra-help', label: 'Medicare Savings Program' },
    ],
    publishedOn: dataVerifiedOn,
    updatedOn: dataVerifiedOn,
  },
  {
    slug: 'medicare-part-d-formulary-exception',
    h1: 'Medicare Part D formulary exception',
    title: 'Medicare Part D formulary exception: how to request coverage',
    description:
      'A Medicare Part D formulary exception can help you get a drug that is not on the plan list or lower your tier. See the request steps, evidence, and appeal path.',
    summary:
      'The request process, the prescriber evidence, and the appeal steps when a plan denies coverage.',
    related: [
      { href: '/guides/medicare-part-d-late-enrollment-penalty', label: 'Part D late enrollment penalty' },
      { href: '/guides/part-d-out-of-pocket-cap', label: 'Part D out of pocket cap' },
      { href: '/calculators/medicare-savings-program-extra-help', label: 'Medicare Savings Program' },
    ],
    publishedOn: dataVerifiedOn,
    updatedOn: dataVerifiedOn,
  },
  {
    slug: 'medicare-part-d-prior-authorization',
    h1: 'Medicare Part D prior authorization',
    title: 'Medicare Part D prior authorization: what to expect',
    description:
      'A Medicare Part D prior authorization requires plan approval before a drug is covered. See who submits the request, what evidence helps, and how to appeal a denial.',
    summary:
      'The review process, the prescriber evidence, and the appeal steps when a drug needs advance approval.',
    related: [
      { href: '/guides/medicare-part-d-formulary-exception', label: 'Part D formulary exception' },
      { href: '/guides/medicare-part-d-pharmacy-network', label: 'Part D pharmacy network' },
      { href: '/calculators/medicare-savings-program-extra-help', label: 'Medicare Savings Program' },
    ],
    publishedOn: dataVerifiedOn,
    updatedOn: dataVerifiedOn,
  },
  {
    slug: 'medicare-part-d-pharmacy-network',
    h1: 'Medicare Part D pharmacy network',
    title: 'Medicare Part D pharmacy network: how to avoid surprises',
    description:
      'A Medicare Part D pharmacy network decides where your plan pays and how much you pay. See preferred pharmacies, out-of-network rules, mail order, and travel tips.',
    summary:
      'Preferred pharmacies, out-of-network fills, mail order, and the network checks that prevent a costly refill.',
    related: [
      { href: '/guides/medicare-part-d-prior-authorization', label: 'Part D prior authorization' },
      { href: '/guides/medicare-part-d-formulary-exception', label: 'Part D formulary exception' },
      { href: '/calculators/medicare-savings-program-extra-help', label: 'Medicare Savings Program' },
    ],
    publishedOn: dataVerifiedOn,
    updatedOn: dataVerifiedOn,
  },
  {
    slug: 'aca-open-enrollment-dates',
    h1: 'ACA open enrollment dates {year}',
    title: 'ACA open enrollment dates {year}: deadlines and coverage starts',
    description:
      'The ACA open enrollment dates {year} generally run from November 1 through January 15. See the deadlines, the state exceptions, and how to avoid a coverage gap.',
    summary:
      'The federal window, the December deadline for a January start, and the state marketplaces that use different dates.',
    related: [
      { href: '/guides/aca-special-enrollment-period', label: 'ACA special enrollment period' },
      { href: '/guides/aca-cost-sharing-reduction', label: 'ACA cost sharing reduction' },
      { href: '/calculators/medicare-vs-aca', label: 'Medicare vs ACA' },
    ],
    publishedOn: dataVerifiedOn,
    updatedOn: dataVerifiedOn,
  },
  {
    slug: 'aca-special-enrollment-period',
    h1: 'ACA special enrollment period',
    title: 'ACA special enrollment period: qualifying events and deadlines',
    description:
      'An ACA special enrollment period lets you enroll after a qualifying life event. See the 60-day window, the coverage start rules, and the documents to keep.',
    summary:
      'The qualifying events, the 60-day window, and the proof the marketplace may ask for.',
    related: [
      { href: '/guides/aca-open-enrollment-dates', label: 'ACA open enrollment dates' },
      { href: '/guides/aca-cost-sharing-reduction', label: 'ACA cost sharing reduction' },
      { href: '/calculators/medicare-vs-aca', label: 'Medicare vs ACA' },
    ],
    publishedOn: dataVerifiedOn,
    updatedOn: dataVerifiedOn,
  },
  {
    slug: 'aca-cost-sharing-reduction',
    h1: 'ACA cost sharing reduction',
    title: 'ACA cost sharing reduction: who qualifies and how it works',
    description:
      'An ACA cost sharing reduction lowers deductibles, copays, and the out-of-pocket maximum for eligible Silver plan enrollees. See the income rules and how to apply.',
    summary:
      'The Silver plan requirement, the income limits, and the out-of-pocket savings for eligible households.',
    related: [
      { href: '/guides/aca-form-1095-a', label: 'ACA Form 1095-A' },
      { href: '/guides/aca-open-enrollment-dates', label: 'ACA open enrollment dates' },
      { href: '/calculators/medicare-vs-aca', label: 'Medicare vs ACA' },
    ],
    publishedOn: dataVerifiedOn,
    updatedOn: dataVerifiedOn,
  },
  {
    slug: 'aca-form-1095-a',
    h1: 'ACA Form 1095-A',
    title: 'ACA Form 1095-A: how to use the marketplace statement',
    description:
      'The ACA Form 1095-A reports your marketplace coverage and premium tax credit information. See what the form shows, how to reconcile the credit, and what to do if it is missing.',
    summary:
      'The monthly figures, the Form 8962 reconciliation, and the common errors that delay a refund.',
    related: [
      { href: '/guides/aca-cost-sharing-reduction', label: 'ACA cost sharing reduction' },
      { href: '/guides/aca-special-enrollment-period', label: 'ACA special enrollment period' },
      { href: '/calculators/medicare-vs-aca', label: 'Medicare vs ACA' },
    ],
    publishedOn: dataVerifiedOn,
    updatedOn: dataVerifiedOn,
  },
  {
    slug: 'aca-dependent-coverage-age-26',
    h1: 'ACA dependent coverage age 26',
    title: 'ACA dependent coverage age 26: rules for parents and young adults',
    description:
      'The ACA dependent coverage age 26 rule lets young adults stay on a parent\'s plan until 26. See the marriage, school, and job rules, plus what happens at 26.',
    summary:
      'The age limit, the marriage and job rules, and the coverage options when the young adult turns 26.',
    related: [
      { href: '/guides/aca-special-enrollment-period', label: 'ACA special enrollment period' },
      { href: '/guides/aca-open-enrollment-dates', label: 'ACA open enrollment dates' },
      { href: '/calculators/medicare-vs-aca', label: 'Medicare vs ACA' },
    ],
    publishedOn: dataVerifiedOn,
    updatedOn: dataVerifiedOn,
  },
];

export const guideBySlug: Record<string, GuideMeta> = Object.fromEntries(
  guides.map((guide) => [guide.slug, guide]),
);

export const guideSlugs = guides.map((guide) => guide.slug);

export function resolveGuide(text: string, year: number): string {
  return text.replaceAll('{year}', String(year));
}
