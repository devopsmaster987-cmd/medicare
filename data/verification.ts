import { dataVerifiedOn } from './verified';

export type VerificationExample = {
  label: string;
  inputs: string;
  handCheck: string;
  expected: string;
  actual: string;
};

export type VerificationEntry = {
  formula: string;
  label: string;
  source: string;
  sourceLabel: string;
  supporting?: Array<{ label: string; url: string }>;
  checkedOn: string;
  note?: string;
  examples: VerificationExample[];
};

export const verificationEntries: VerificationEntry[] = [
  {
    formula: 'employerAffordability',
    label: 'Employer coverage affordability',
    source: 'https://www.irs.gov/pub/irs-drop/rp-25-25.pdf',
    sourceLabel: 'IRS Revenue Procedure 2025-25',
    supporting: [
      {
        label: 'IRS premium tax credit questions and answers',
        url: 'https://www.irs.gov/affordable-care-act/individuals-and-families/questions-and-answers-on-the-premium-tax-credit',
      },
      {
        label: 'Treasury family coverage affordability rule',
        url: 'https://www.federalregister.gov/documents/2022/10/13/2022-22184/affordability-of-employer-coverage-for-family-members',
      },
    ],
    checkedOn: dataVerifiedOn,
    note: 'The employee is tested with the lowest-cost self-only premium. A spouse and children are tested with the employee’s required family premium.',
    examples: [
      {
        label: 'Below the line',
        inputs: 'Household income $30,000; employee-only premium $200 a month.',
        handCheck:
          '$200 × 12 = $2,400. The affordability threshold is $30,000 × 9.96% = $2,988. The premium is $588 below the line.',
        expected: 'Affordable, with $588 of headroom.',
        actual:
          'Affordable: yes. Annual premium: $2,400. Threshold: $2,988. Headroom: $588.',
      },
      {
        label: 'Just above the line',
        inputs: 'Household income $30,000; employee-only premium $249.01 a month.',
        handCheck:
          '$249.01 × 12 = $2,988.12. That is $0.12 above the $2,988 threshold.',
        expected: 'Not affordable, with a $0.12 shortfall.',
        actual:
          'Affordable: no. Annual premium: $2,988.12. Threshold: $2,988. Headroom: −$0.12.',
      },
      {
        label: 'Family premium test',
        inputs:
          'Household income $30,000; employee-only premium $200 a month; family premium $600 a month; minimum value met.',
        handCheck:
          'The employee-only annual premium is $2,400, below $2,988. The family annual premium is $7,200, above the same line.',
        expected:
          'Employee coverage is affordable; family members may qualify for Marketplace help.',
        actual:
          'Employee: affordable. Family: not affordable. Family help signal: likely qualify.',
      },
    ],
  },
  {
    formula: 'mspEligibility',
    label: 'Medicare Savings Program and Extra Help',
    source: 'https://www.medicare.gov/basics/costs/help/medicare-savings-programs',
    sourceLabel: 'Medicare.gov Medicare Savings Programs',
    supporting: [
      {
        label: 'CMS 2026 Extra Help resource limits',
        url: 'https://www.cms.gov/files/document/cy2026-lis-resource-limits-memo.pdf',
      },
      {
        label: 'California DHCS Medicare Savings Programs',
        url: 'https://www.dhcs.ca.gov/individuals/Pages/Medicare-Savings-Programs-in-California.aspx',
      },
      {
        label: 'New York Medicare Savings Program',
        url: 'https://www.health.ny.gov/health_care/medicaid/program/update/savingsprogram/medicaresavingsprogram.htm',
      },
      {
        label: 'Arizona AHCCCS eligibility requirements',
        url: 'https://www.azahcccs.gov/Members/Downloads/EligibilityRequirements.pdf',
      },
    ],
    checkedOn: dataVerifiedOn,
    note: 'Federal limits are used for launch states without a verified state override. California, New York, and Arizona use their published state figures. State disregards are not fully modeled.',
    examples: [
      {
        label: 'Texas at the QMB line',
        inputs: 'Texas; one person; $1,350 monthly income; $9,950 countable assets.',
        handCheck:
          'The QMB monthly limit is $1,350 and the QMB resource limit is $9,950. Annual income is $16,200, below the Extra Help limit.',
        expected: 'QMB likely and Extra Help likely.',
        actual:
          'QMB eligible. Extra Help eligible. Estimated monthly value: $241.89.',
      },
      {
        label: 'Texas above the QI line',
        inputs: 'Texas; one person; $1,817 monthly income; $0 countable assets.',
        handCheck:
          '$1,817 is above the $1,816 QI monthly limit. Annual income is $21,804, below the $23,940 Extra Help limit.',
        expected: 'Extra Help only, with an apply-anyway message.',
        actual: 'Extra Help only. Estimated monthly value: $38.99. Apply anyway: yes.',
      },
      {
        label: 'California resource test',
        inputs: 'California; one person; $1,330 monthly income; $130,000 countable assets.',
        handCheck:
          'The California QMB limit is $1,330 a month and the resource limit is $130,000 from January 1, 2026.',
        expected: 'QMB eligible at both limits.',
        actual: 'QMB eligible. Resource limit: $130,000. Asset test applied: yes.',
      },
      {
        label: 'New York without an asset test',
        inputs: 'New York; one person; $1,856 monthly income; $500,000 countable assets.',
        handCheck:
          'New York publishes a $1,856 monthly QMB limit and does not apply a resource test for this program.',
        expected: 'QMB eligible despite the high assets.',
        actual: 'QMB eligible. SLMB not separate. Asset test applied: no.',
      },
      {
        label: 'Arizona at the SLMB line',
        inputs: 'Arizona; one person; $1,596 monthly income; $500,000 countable assets.',
        handCheck:
          'Arizona publishes $1,596 as the top of the SLMB band and $1,796 as the top of the QI band for one person, with no listed resource test.',
        expected: 'SLMB eligible at $1,596; QI eligible at $1,796.',
        actual: 'SLMB eligible at $1,596. At $1,597, QI eligible. Asset test applied: no.',
      },
    ],
  },
  {
    formula: 'partBPenaltyCalculator',
    label: 'Part B late enrollment penalty',
    source: 'https://www.medicare.gov/basics/costs/medicare-costs/avoid-penalties',
    sourceLabel: 'Medicare.gov avoid late enrollment penalties',
    supporting: [
      {
        label: 'CMS 2026 Part B premium fact sheet',
        url: 'https://www.cms.gov/newsroom/fact-sheets/2026-medicare-parts-b-premiums-deductibles',
      },
    ],
    checkedOn: dataVerifiedOn,
    note: 'Only full 12-month periods count. Creditable coverage is not counted when the user reports it and does not report that the Special Enrollment Period has ended.',
    examples: [
      {
        label: 'Two full years',
        inputs: '24 months without creditable coverage.',
        handCheck:
          'Two full 12-month periods × 10% = 20%. 20% of $202.90 = $40.58. $202.90 + $40.58 = $243.48. Medicare’s rounded example shows $243.50.',
        expected: '$40.58 monthly penalty; $243.48 unrounded total premium.',
        actual:
          'Penalty rate: 20%. Monthly penalty: $40.58. Total premium: $243.48. Annual penalty: $486.96.',
      },
      {
        label: 'One full year',
        inputs: '12 months without creditable coverage.',
        handCheck:
          'One full 12-month period × 10% = 10%. 10% of $202.90 = $20.29. Total monthly premium = $223.19.',
        expected: '$20.29 monthly penalty; $223.19 total premium.',
        actual:
          'Penalty rate: 10%. Monthly penalty: $20.29. Total premium: $223.19. Ten-year penalty: $2,434.80.',
      },
      {
        label: 'Creditable coverage reported',
        inputs: '12 months without Part B; creditable coverage reported; Special Enrollment Period not reported as ended.',
        handCheck:
          'The months covered by creditable coverage are not counted, so there are zero full 12-month penalty periods.',
        expected: 'No penalty counted, with a warning to keep the written notice.',
        actual: 'Months counted: 0. Monthly penalty: $0. Total premium: $202.90.',
      },
      {
        label: 'Creditable coverage, missed SEP',
        inputs:
          '24 months without Part B; creditable coverage reported; Special Enrollment Period reported as missed.',
        handCheck:
          'The coverage exception does not apply after the Special Enrollment Period is missed, so all 24 months count. Two periods × 10% = 20%. 20% of $202.90 = $40.58.',
        expected: '$40.58 monthly penalty; 24 months counted; 0 months excluded.',
        actual: 'Penalty rate: 20%. Monthly penalty: $40.58. Months counted: 24. Months excluded: 0.',
      },
    ],
  },
  {
    formula: 'irmaaCalculator',
    label: 'IRMAA cliff checker',
    source: 'https://www.cms.gov/newsroom/fact-sheets/2026-medicare-parts-b-premiums-deductibles',
    sourceLabel: 'CMS 2026 Part B premium fact sheet',
    supporting: [
      {
        label: 'SSA Extra Help and IRMAA information',
        url: 'https://www.ssa.gov/benefits/medicare/prescriptionhelp.html',
      },
    ],
    checkedOn: dataVerifiedOn,
    note: 'The calculator applies the two-year lookback and shows each enrolled spouse separately for a joint return.',
    examples: [
      {
        label: 'Single filer, first tier',
        inputs: 'Single; $109,001 modified adjusted gross income from the lookback year.',
        handCheck:
          'The first single tier starts at $109,001. Part B becomes $284.10 and Part D adds $14.50. The monthly surcharge is $95.70, or $1,148.40 a year. Headroom to $137,001 is $28,000.',
        expected: 'Tier 1; $95.70 monthly surcharge; $28,000 headroom.',
        actual:
          'Tier 1. Part B: $284.10. Part D: $14.50. Monthly surcharge: $95.70. Annual surcharge: $1,148.40. Headroom: $28,000.',
      },
      {
        label: 'Married couple, first tier',
        inputs: 'Married filing jointly; $218,001 modified adjusted gross income.',
        handCheck:
          'The first joint tier starts at $218,001. Each spouse may pay $284.10 for Part B and $14.50 for Part D. The household monthly surcharge is $191.40, or $2,296.80 a year. Headroom to $274,001 is $56,000.',
        expected: 'Tier 1; $191.40 household monthly surcharge; $56,000 headroom.',
        actual:
          'Tier 1. Household Part B: $568.20. Household Part D: $29. Household monthly surcharge: $191.40. Headroom: $56,000.',
      },
    ],
  },
  {
    formula: 'medicareVsAca',
    label: 'Medicare vs ACA decision',
    source:
      'https://www.medicare.gov/basics/get-started-with-medicare/sign-up/when-can-i-sign-up-for-medicare',
    sourceLabel: 'Medicare.gov when can I sign up',
    supporting: [
      {
        label: 'Medicare.gov who pays first',
        url: 'https://www.medicare.gov/health-drug-plans/coordination/who-pays-first',
      },
      {
        label: 'Medicare.gov avoid late enrollment penalties',
        url: 'https://www.medicare.gov/basics/costs/medicare-costs/avoid-penalties',
      },
    ],
    checkedOn: dataVerifiedOn,
    note: 'This is a decision rule, not an agency formula with a published worked example. The hand check applies the published coordination and premium rules.',
    examples: [
      {
        label: 'Active employer coverage at 66',
        inputs:
          'Age 66; active employer coverage; 25 employees; creditable coverage; 40 work credits.',
        handCheck:
          'The employer has 20 or more employees, so the group plan generally pays first and Part B can usually be delayed. Premium-free Part A ends Marketplace premium tax credits. The annual standard Part B premium is $202.90 × 12 = $2,434.80.',
        expected:
          'Delay Part B; premium-free Part A; ACA subsidy ends; eight-month Special Enrollment Period warning.',
        actual:
          'Path: delay Part B. Premium-free Part A: yes. ACA subsidy: ends. Annual Part B: $2,434.80.',
      },
      {
        label: 'No premium-free Part A',
        inputs: 'Age 66; no current coverage; 20 work credits.',
        handCheck:
          'Work credits are below 40, so Part A is not premium-free. Full Part A is $565 × 12 = $6,780. Part B is $202.90 × 12 = $2,434.80. Total annual premium estimate: $9,214.80.',
        expected: 'Compare ACA; no premium-free Part A; $9,214.80 annual Medicare premium.',
        actual:
          'Path: compare ACA. Premium-free Part A: no. Annual Part A: $6,780. Annual Part B: $2,434.80. Total: $9,214.80.',
      },
      {
        label: 'Reduced Part A premium',
        inputs: 'Age 66; no current coverage; 35 work credits.',
        handCheck:
          '30 to 39 credits use the reduced Part A premium. Part A is $311 × 12 = $3,732. Part B is $202.90 × 12 = $2,434.80. Total annual premium estimate: $6,166.80.',
        expected: 'Reduced Part A; $6,166.80 annual Medicare premium.',
        actual:
          'Part A status: reduced. Premium-free Part A: no. Annual Part A: $3,732. Annual total: $6,166.80.',
      },
    ],
  },
];
