export type KeywordRole =
  | 'primary'
  | 'secondary'
  | 'faq'
  | 'synonym'
  | 'topic'
  | 'parked'
  | 'excluded';

export type Keyword = {
  keyword: string;
  role: KeywordRole;
  page?: string;
  headingLevel?: 2 | 3;
  note?: string;
};

export const keywords: Keyword[] = [
  { keyword: 'free medicare calculator', role: 'primary', page: '/' },

  { keyword: 'medicare calculator', role: 'primary', page: '/calculators' },

  {
    keyword: 'is employer health insurance affordable {year}',
    role: 'primary',
    page: '/calculators/employer-coverage-affordability',
  },
  {
    keyword: 'lowest cost self only plan affordability',
    role: 'secondary',
    page: '/calculators/employer-coverage-affordability',
    headingLevel: 2,
  },
  {
    keyword: 'what counts as minimum value coverage',
    role: 'secondary',
    page: '/calculators/employer-coverage-affordability',
    headingLevel: 2,
  },
  {
    keyword: 'household income vs w2 wages marketplace',
    role: 'secondary',
    page: '/calculators/employer-coverage-affordability',
    headingLevel: 2,
  },
  {
    keyword: 'family glitch fix calculator',
    role: 'secondary',
    page: '/calculators/employer-coverage-affordability',
    headingLevel: 2,
  },
  {
    keyword: 'is my employer plan affordable single',
    role: 'faq',
    page: '/calculators/employer-coverage-affordability',
  },
  {
    keyword: 'minimum value coverage explained',
    role: 'faq',
    page: '/calculators/employer-coverage-affordability',
  },
  {
    keyword: 'employer health insurance affordability test',
    role: 'faq',
    page: '/calculators/employer-coverage-affordability',
  },
  {
    keyword: 'is employer health insurance affordable calculator',
    role: 'synonym',
    page: '/calculators/employer-coverage-affordability',
  },
  {
    keyword: 'employer health insurance affordability',
    role: 'synonym',
    page: '/calculators/employer-coverage-affordability',
  },
  {
    keyword: 'marketplace affordability calculator',
    role: 'synonym',
    page: '/calculators/employer-coverage-affordability',
  },

  {
    keyword: 'medicare savings program income limits {year}',
    role: 'primary',
    page: '/calculators/medicare-savings-program-extra-help',
  },
  {
    keyword: 'qmb income limit {year}',
    role: 'secondary',
    page: '/calculators/medicare-savings-program-extra-help',
    headingLevel: 2,
  },
  {
    keyword: 'slmb income limit {year}',
    role: 'secondary',
    page: '/calculators/medicare-savings-program-extra-help',
    headingLevel: 2,
  },
  {
    keyword: 'qi income limit {year}',
    role: 'secondary',
    page: '/calculators/medicare-savings-program-extra-help',
    headingLevel: 2,
  },
  {
    keyword: 'extra help income limits {year}',
    role: 'secondary',
    page: '/calculators/medicare-savings-program-extra-help',
    headingLevel: 2,
  },
  {
    keyword: 'medicare savings program asset limits {year}',
    role: 'secondary',
    page: '/calculators/medicare-savings-program-extra-help',
    headingLevel: 2,
  },
  {
    keyword: 'qmb vs slmb vs qi',
    role: 'secondary',
    page: '/calculators/medicare-savings-program-extra-help',
    headingLevel: 2,
  },
  {
    keyword: 'medicare savings program income limits {year} single',
    role: 'faq',
    page: '/calculators/medicare-savings-program-extra-help',
  },
  {
    keyword: 'qmb income limit {year} single',
    role: 'faq',
    page: '/calculators/medicare-savings-program-extra-help',
  },
  {
    keyword: 'qmb income limit {year} married',
    role: 'faq',
    page: '/calculators/medicare-savings-program-extra-help',
  },
  {
    keyword: 'extra help income limits {year} married',
    role: 'faq',
    page: '/calculators/medicare-savings-program-extra-help',
  },
  {
    keyword: 'do i qualify for extra help',
    role: 'faq',
    page: '/calculators/medicare-savings-program-extra-help',
  },
  {
    keyword: 'medicare extra help',
    role: 'synonym',
    page: '/calculators/medicare-savings-program-extra-help',
  },
  {
    keyword: 'medicare savings program',
    role: 'synonym',
    page: '/calculators/medicare-savings-program-extra-help',
  },
  {
    keyword: 'extra help calculator',
    role: 'synonym',
    page: '/calculators/medicare-savings-program-extra-help',
  },

  {
    keyword: 'part b late enrollment penalty calculator',
    role: 'primary',
    page: '/calculators/part-b-late-enrollment-penalty',
  },
  {
    keyword: 'how much is the part b penalty',
    role: 'secondary',
    page: '/calculators/part-b-late-enrollment-penalty',
    headingLevel: 2,
  },
  {
    keyword: 'part b penalty 10 year cost',
    role: 'secondary',
    page: '/calculators/part-b-late-enrollment-penalty',
    headingLevel: 2,
  },
  {
    keyword: 'part b penalty 20 year cost',
    role: 'secondary',
    page: '/calculators/part-b-late-enrollment-penalty',
    headingLevel: 2,
  },
  {
    keyword: 'how is the part b penalty calculated',
    role: 'secondary',
    page: '/calculators/part-b-late-enrollment-penalty',
    headingLevel: 2,
  },
  {
    keyword: 'can i avoid the part b penalty',
    role: 'secondary',
    page: '/calculators/part-b-late-enrollment-penalty',
    headingLevel: 2,
  },
  {
    keyword: 'medicare part b penalty per month',
    role: 'faq',
    page: '/calculators/part-b-late-enrollment-penalty',
  },
  {
    keyword: 'part b special enrollment period 8 months',
    role: 'faq',
    page: '/calculators/part-b-late-enrollment-penalty',
  },
  {
    keyword: 'part b creditable coverage exemption',
    role: 'faq',
    page: '/calculators/part-b-late-enrollment-penalty',
  },
  {
    keyword: 'what is the part b penalty for {year}',
    role: 'faq',
    page: '/calculators/part-b-late-enrollment-penalty',
  },
  {
    keyword: 'part b penalty calculator',
    role: 'synonym',
    page: '/calculators/part-b-late-enrollment-penalty',
  },
  {
    keyword: 'medicare late enrollment',
    role: 'synonym',
    page: '/calculators/part-b-late-enrollment-penalty',
  },

  { keyword: 'irmaa brackets {year}', role: 'primary', page: '/calculators/irmaa-cliff-checker' },
  {
    keyword: 'irmaa brackets {year} married',
    role: 'secondary',
    page: '/calculators/irmaa-cliff-checker',
    headingLevel: 2,
  },
  {
    keyword: 'irmaa brackets {year} married filing separately',
    role: 'secondary',
    page: '/calculators/irmaa-cliff-checker',
    headingLevel: 2,
  },
  {
    keyword: 'what is the irmaa threshold for {year}',
    role: 'secondary',
    page: '/calculators/irmaa-cliff-checker',
    headingLevel: 2,
  },
  {
    keyword: 'how close am i to the next irmaa bracket',
    role: 'secondary',
    page: '/calculators/irmaa-cliff-checker',
    headingLevel: 2,
  },
  {
    keyword: 'irmaa part b surcharge {year}',
    role: 'secondary',
    page: '/calculators/irmaa-cliff-checker',
    headingLevel: 2,
  },
  {
    keyword: 'irmaa part d surcharge {year}',
    role: 'secondary',
    page: '/calculators/irmaa-cliff-checker',
    headingLevel: 2,
  },
  {
    keyword: 'irmaa two year lookback',
    role: 'secondary',
    page: '/calculators/irmaa-cliff-checker',
    headingLevel: 2,
  },
  {
    keyword: 'medicare part b premium {year} married',
    role: 'secondary',
    page: '/calculators/irmaa-cliff-checker',
    headingLevel: 2,
  },
  {
    keyword: 'medicare part b premium calculator',
    role: 'faq',
    page: '/calculators/irmaa-cliff-checker',
  },
  {
    keyword: 'cms part b premium {year}',
    role: 'faq',
    page: '/calculators/irmaa-cliff-checker',
  },
  {
    keyword: 'ssa irmaa chart',
    role: 'faq',
    page: '/calculators/irmaa-cliff-checker',
  },
  {
    keyword: 'irmaa cliff checker',
    role: 'synonym',
    page: '/calculators/irmaa-cliff-checker',
  },
  { keyword: 'irmaa calculator', role: 'synonym', page: '/calculators/irmaa-cliff-checker' },

  { keyword: 'medicare vs aca', role: 'primary', page: '/calculators/medicare-vs-aca' },
  {
    keyword: 'medicare 20 employee rule',
    role: 'secondary',
    page: '/calculators/medicare-vs-aca',
    headingLevel: 2,
  },
  {
    keyword: 'should i take medicare or marketplace at 65',
    role: 'secondary',
    page: '/calculators/medicare-vs-aca',
    headingLevel: 2,
  },
  {
    keyword: 'aca subsidies end when eligible for part a',
    role: 'secondary',
    page: '/calculators/medicare-vs-aca',
    headingLevel: 2,
  },
  {
    keyword: 'no premium free part a what to do',
    role: 'secondary',
    page: '/calculators/medicare-vs-aca',
    headingLevel: 2,
  },
  {
    keyword: 'working past 65',
    role: 'secondary',
    page: '/calculators/medicare-vs-aca',
    headingLevel: 2,
  },
  { keyword: 'medicare vs aca subsidies', role: 'faq', page: '/calculators/medicare-vs-aca' },
  {
    keyword: 'medicare vs aca calculator',
    role: 'synonym',
    page: '/calculators/medicare-vs-aca',
  },

  {
    keyword: 'ssa 44 form irmaa appeal',
    role: 'primary',
    page: '/guides/ssa-44-form-irmaa-appeal',
  },
  {
    keyword: 'irmaa life changing event list',
    role: 'secondary',
    page: '/guides/ssa-44-form-irmaa-appeal',
    headingLevel: 2,
  },
  {
    keyword: 'ssa 44 approved reasons',
    role: 'secondary',
    page: '/guides/ssa-44-form-irmaa-appeal',
    headingLevel: 2,
  },
  {
    keyword: 'how long does ssa 44 take',
    role: 'secondary',
    page: '/guides/ssa-44-form-irmaa-appeal',
    headingLevel: 2,
  },
  { keyword: 'ssa 44 form pdf', role: 'faq', page: '/guides/ssa-44-form-irmaa-appeal' },

  { keyword: 'how to lower irmaa', role: 'primary', page: '/guides/how-to-lower-irmaa' },
  { keyword: 'how much can you earn before irmaa', role: 'faq', page: '/guides/how-to-lower-irmaa' },
  {
    keyword: 'can you lower irmaa after retirement',
    role: 'secondary',
    page: '/guides/how-to-lower-irmaa',
    headingLevel: 2,
  },
  { keyword: 'how to avoid irmaa', role: 'synonym', page: '/guides/how-to-lower-irmaa' },

  { keyword: 'roth conversion irmaa', role: 'primary', page: '/guides/roth-conversion-irmaa' },
  {
    keyword: 'how much roth conversion before irmaa',
    role: 'secondary',
    page: '/guides/roth-conversion-irmaa',
    headingLevel: 2,
  },

  {
    keyword: 'what income is used for marketplace subsidies',
    role: 'primary',
    page: '/guides/what-income-counts-for-marketplace-subsidies',
  },
  {
    keyword: 'marketplace magi vs taxable income',
    role: 'secondary',
    page: '/guides/what-income-counts-for-marketplace-subsidies',
    headingLevel: 2,
  },

  {
    keyword: 'does irmaa apply to married filing separately',
    role: 'primary',
    page: '/guides/irmaa-married-filing-separately',
  },
  {
    keyword: 'married filing separately irmaa thresholds',
    role: 'secondary',
    page: '/guides/irmaa-married-filing-separately',
    headingLevel: 2,
  },

  {
    keyword: 'hsa and medicare 6 month rule',
    role: 'primary',
    page: '/guides/hsa-and-medicare-6-month-rule',
  },
  {
    keyword: 'can i contribute to an hsa after 65',
    role: 'secondary',
    page: '/guides/hsa-and-medicare-6-month-rule',
    headingLevel: 2,
  },
  {
    keyword: 'hsa contributions after medicare enrollment',
    role: 'secondary',
    page: '/guides/hsa-and-medicare-6-month-rule',
    headingLevel: 2,
  },

  {
    keyword: 'when does medicare part a backdate',
    role: 'primary',
    page: '/guides/medicare-part-a-backdate',
  },
  {
    keyword: 'part a backdate 6 months',
    role: 'secondary',
    page: '/guides/medicare-part-a-backdate',
    headingLevel: 2,
  },
  {
    keyword: 'part a backdate effective date',
    role: 'secondary',
    page: '/guides/medicare-part-a-backdate',
    headingLevel: 2,
  },

  {
    keyword: '400 fpl subsidy cliff {year}',
    role: 'primary',
    page: '/guides/400-fpl-subsidy-cliff',
  },
  {
    keyword: 'aca subsidy cliff extension {year}',
    role: 'secondary',
    page: '/guides/400-fpl-subsidy-cliff',
    headingLevel: 2,
  },
  {
    keyword: 'aca subsidy income limit {year}',
    role: 'secondary',
    page: '/guides/400-fpl-subsidy-cliff',
    headingLevel: 2,
  },

  {
    keyword: 'part d out of pocket cap {year}',
    role: 'primary',
    page: '/guides/part-d-out-of-pocket-cap',
  },
  {
    keyword: 'part d out of pocket cap {year} amount',
    role: 'secondary',
    page: '/guides/part-d-out-of-pocket-cap',
    headingLevel: 2,
  },
  {
    keyword: 'does part d out of pocket cap include premiums',
    role: 'secondary',
    page: '/guides/part-d-out-of-pocket-cap',
    headingLevel: 2,
  },
  {
    keyword: 'medicare part d out of pocket cap {year}',
    role: 'synonym',
    page: '/guides/part-d-out-of-pocket-cap',
  },

  {
    keyword: 'family glitch fix explained {year}',
    role: 'primary',
    page: '/guides/family-glitch-fix-explained',
  },
  {
    keyword: 'family glitch fix and premium tax credits',
    role: 'secondary',
    page: '/guides/family-glitch-fix-explained',
    headingLevel: 2,
  },

  {
    keyword: 'medicare part b premium increase {year}',
    role: 'primary',
    page: '/guides/medicare-part-b-premium-increase',
  },
  {
    keyword: 'medicare part b deductible {year}',
    role: 'primary',
    page: '/guides/medicare-part-b-deductible',
  },
  {
    keyword: 'medicare part a premium {year}',
    role: 'primary',
    page: '/guides/medicare-part-a-premium',
  },
  {
    keyword: 'medicare part d late enrollment penalty',
    role: 'primary',
    page: '/guides/medicare-part-d-late-enrollment-penalty',
  },
  {
    keyword: 'medicare initial enrollment period',
    role: 'primary',
    page: '/guides/medicare-initial-enrollment-period',
  },
  {
    keyword: 'medicare general enrollment period',
    role: 'primary',
    page: '/guides/medicare-general-enrollment-period',
  },
  {
    keyword: 'medicare part a late enrollment penalty',
    role: 'primary',
    page: '/guides/medicare-part-a-late-enrollment-penalty',
  },
  {
    keyword: 'medicare special enrollment period while working',
    role: 'primary',
    page: '/guides/medicare-special-enrollment-period-while-working',
  },
  {
    keyword: 'medicare part a 40 quarters rule',
    role: 'primary',
    page: '/guides/medicare-part-a-40-quarters-rule',
  },
  {
    keyword: 'medicare and cobra',
    role: 'primary',
    page: '/guides/medicare-and-cobra',
  },
  {
    keyword: 'medicare and retiree health coverage',
    role: 'primary',
    page: '/guides/medicare-and-retiree-health-coverage',
  },
  {
    keyword: 'medicare and va benefits',
    role: 'primary',
    page: '/guides/medicare-and-va-benefits',
  },
  {
    keyword: 'medicare and fehb',
    role: 'primary',
    page: '/guides/medicare-and-fehb',
  },
  {
    keyword: 'medicare and tricare',
    role: 'primary',
    page: '/guides/medicare-and-tricare',
  },
  {
    keyword: 'medicare for people with disabilities',
    role: 'primary',
    page: '/guides/medicare-for-people-with-disabilities',
  },
  {
    keyword: 'medicare and end stage renal disease',
    role: 'primary',
    page: '/guides/medicare-and-end-stage-renal-disease',
  },
  {
    keyword: 'medicare and als',
    role: 'primary',
    page: '/guides/medicare-and-als',
  },
  {
    keyword: 'medicare part d formulary exception',
    role: 'primary',
    page: '/guides/medicare-part-d-formulary-exception',
  },
  {
    keyword: 'medicare part d prior authorization',
    role: 'primary',
    page: '/guides/medicare-part-d-prior-authorization',
  },
  {
    keyword: 'medicare part d pharmacy network',
    role: 'primary',
    page: '/guides/medicare-part-d-pharmacy-network',
  },
  {
    keyword: 'aca open enrollment dates {year}',
    role: 'primary',
    page: '/guides/aca-open-enrollment-dates',
  },
  {
    keyword: 'aca special enrollment period',
    role: 'primary',
    page: '/guides/aca-special-enrollment-period',
  },
  {
    keyword: 'aca cost sharing reduction',
    role: 'primary',
    page: '/guides/aca-cost-sharing-reduction',
  },
  {
    keyword: 'aca form 1095',
    role: 'primary',
    page: '/guides/aca-form-1095-a',
  },
  {
    keyword: 'aca dependent coverage age 26',
    role: 'primary',
    page: '/guides/aca-dependent-coverage-age-26',
  },

  { keyword: 'medicare', role: 'topic' },
  { keyword: 'medicare part a', role: 'topic' },
  { keyword: 'medicare part b', role: 'topic' },
  { keyword: 'medicare part d', role: 'topic' },
  { keyword: 'irmaa', role: 'topic' },
  { keyword: 'medicare advantage', role: 'topic' },
  { keyword: 'medicare enrollment', role: 'topic' },
  { keyword: 'medicare eligibility', role: 'topic' },
  { keyword: 'medicare cost', role: 'topic' },
  { keyword: 'health insurance calculator', role: 'topic' },

  { keyword: 'aca subsidy calculator', role: 'parked' },
  { keyword: 'health insurance subsidy calculator', role: 'parked' },
  { keyword: 'marketplace subsidy', role: 'parked' },
  { keyword: 'aca subsidies', role: 'parked' },
  { keyword: 'aca marketplace', role: 'parked' },

  {
    keyword: 'medicareclear vs',
    role: 'excluded',
    note: 'Invites a competitor comparison, which the editorial rules forbid.',
  },
  {
    keyword: 'best medicare calculator',
    role: 'excluded',
    note: 'An unprovable superlative claim.',
  },
  {
    keyword: 'medicareclear calculator medicare.gov irmaa brackets',
    role: 'excluded',
    note: 'Mixes our brand with a government domain and implies affiliation.',
  },
  {
    keyword: 'medicare.gov extra help income limits',
    role: 'excluded',
    note: 'Implies affiliation. Link to the official page as a source instead.',
  },
];

export function resolveKeyword(keyword: string, year: number): string {
  return keyword.replaceAll('{year}', String(year));
}

export function keywordsForPage(page: string): Keyword[] {
  return keywords.filter((entry) => entry.page === page);
}

export function primaryKeywordForPage(page: string): Keyword | undefined {
  return keywords.find((entry) => entry.role === 'primary' && entry.page === page);
}

export function keywordHasLiteralYear(keyword: string): boolean {
  return /\b20\d{2}\b/.test(keyword);
}
