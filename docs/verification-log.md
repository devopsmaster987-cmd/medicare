# Verification log

All figures were checked against the official source listed in each section on 2026-10-26. The owner, Abdul Samad, still needs to sign off before launch. "Policy maths" means a hand-worked application of the published rule because the agency does not publish a worked example with these exact inputs.

## employerAffordability

Source: https://www.irs.gov/pub/irs-drop/rp-25-25.pdf
Supporting source: https://www.irs.gov/affordable-care-act/individuals-and-families/questions-and-answers-on-the-premium-tax-credit

Example 1
- Inputs: household income $30,000; employee-only premium $200 per month; monthly pay frequency.
- Hand calculation: $200 x 12 = $2,400. Affordability threshold = $30,000 x 9.96% = $2,988. $2,400 is below $2,988.
- Expected: affordable, with $588 of headroom.
- Actual: `employeeCoverageAffordable: true`, `annualEmployeeOnlyPremium: 2400`, `annualThreshold: 2988`, `employeeHeadroom: 588`.
- Checked on: 2026-10-26

Example 2
- Inputs: household income $30,000; employee-only premium $249.01 per month; monthly pay frequency.
- Hand calculation: $249.01 x 12 = $2,988.12. This is $0.12 above the $2,988 threshold.
- Expected: not affordable, with a $0.12 shortfall.
- Actual: `employeeCoverageAffordable: false`, `annualEmployeeOnlyPremium: 2988.12`, `annualThreshold: 2988`, `employeeHeadroom: -0.12`.
- Checked on: 2026-10-26

Policy note: the family premium is shown as context only. The eligibility signal uses the employee-only premium and the minimum value answer, consistent with the family glitch fix. A high family premium does not create premium tax credit eligibility when employee-only coverage is affordable.

Example 3
- Inputs: household income $30,000; employee-only premium $200 per month; family premium $600 per month; monthly pay frequency; plan meets minimum value.
- Hand calculation: employee-only annual premium $2,400 is below the $2,988 threshold; family annual premium $7,200 is above the same threshold, but that comparison is not the legal subsidy test.
- Expected: employee-only coverage affordable; `familyMembersMayQualifyForHelp: false`; `subsidyEligibility: 'likely-none'`.
- Actual: `employeeCoverageAffordable: true`, `annualFamilyPremium: 7200`, `familyMembersMayQualifyForHelp: false`, `subsidyEligibility: 'likely-none'`.
- Checked on: 2026-10-26

## mspEligibility

Source: https://www.medicare.gov/basics/costs/help/medicare-savings-programs
Supporting source: https://www.cms.gov/files/document/cy2026-lis-resource-limits-memo.pdf
Policy maths: the published 2026 federal limits are used for Texas; state-specific disregards are not applied by the calculator.

Example 1
- Inputs: Texas; one person; $1,350 monthly income; $9,950 countable assets.
- Hand calculation: QMB monthly limit is $1,350, so income is at the limit. Assets are at the $9,950 QMB resource limit. Extra Help income is $1,350 x 12 = $16,200 against the $23,940 annual limit; assets are below $18,090.
- Expected: QMB and Extra Help likely; estimated value is the Part B standard premium plus the Part D base beneficiary premium.
- Actual: QMB eligible; Extra Help eligible; `estimatedMonthlyValue: 241.89`; `likelyPrograms` includes QMB and Extra Help (the income test also meets SLMB and QI limits).
- Checked on: 2026-10-26

Example 2
- Inputs: Texas; one person; $1,817 monthly income; $0 countable assets.
- Hand calculation: $1,817 is above the $1,816 QI monthly limit, so QMB, SLMB, and QI are not eligible. Annual income is $21,804, below the $23,940 Extra Help limit.
- Expected: Extra Help only; estimated value is the Part D base beneficiary premium.
- Actual: `likelyPrograms: ['extraHelp']`; `estimatedMonthlyValue: 38.99`; `applyAnyway: true` because income is within 10% of a missed limit.
- Checked on: 2026-10-26

## partBPenaltyCalculator

Source: https://www.medicare.gov/basics/costs/medicare-costs/avoid-penalties
Supporting source: https://www.cms.gov/newsroom/fact-sheets/2026-medicare-parts-b-premiums-deductibles

Example 1
- Inputs: 24 months without creditable coverage.
- Hand calculation: two full 12-month periods x 10% = 20%. 20% of $202.90 = $40.58. $202.90 + $40.58 = $243.48. Medicare's rounded example shows $243.50.
- Expected: $40.58 monthly penalty; $243.48 unrounded total monthly premium; $486.96 annual penalty.
- Actual: `penaltyRate: 0.2`, `monthlyPenalty: 40.58`, `totalMonthlyPremium: 243.48`, `annualPenalty: 486.96`; the result displays Medicare's $243.50 rounding note.
- Checked on: 2026-10-26

Example 2
- Inputs: 12 months without creditable coverage.
- Hand calculation: one full 12-month period x 10% = 10%. 10% of $202.90 = $20.29. Total monthly premium = $223.19.
- Expected: $20.29 monthly penalty; $223.19 total monthly premium; $2,434.80 ten-year penalty.
- Actual: `penaltyRate: 0.1`, `monthlyPenalty: 20.29`, `totalMonthlyPremium: 223.19`, `tenYearPenalty: 2434.8`.
- Checked on: 2026-10-26

## irmaaCalculator

Source: https://www.cms.gov/newsroom/fact-sheets/2026-medicare-parts-b-premiums-deductibles
Supporting source: https://www.ssa.gov/benefits/medicare/prescriptionhelp.html

Example 1
- Inputs: single; $109,001 modified adjusted gross income from the two-year lookback.
- Hand calculation: the first IRMAA tier starts at $109,001 for a single filer. Part B becomes $284.10, Part D adds $14.50, and the monthly surcharge is $95.70. Annual surcharge = $95.70 x 12 = $1,148.40. Headroom to the next tier ($137,001) = $28,000.
- Expected: tier index 1; $284.10 Part B; $14.50 Part D; $95.70 monthly surcharge; $1,148.40 annual surcharge; $28,000 headroom.
- Actual: tier index 1; `monthlyPartB: 284.1`; `monthlyPartD: 14.5`; `monthlySurcharge: 95.7`; `annualSurcharge: 1148.4`; `headroomToNextBracket: 28000`.
- Checked on: 2026-10-26

Example 2
- Inputs: married filing jointly; $218,001 modified adjusted gross income.
- Hand calculation: the first joint IRMAA tier starts at $218,001. Each spouse may pay $284.10 Part B and $14.50 Part D. Household Part B = $568.20; household Part D = $29; household monthly surcharge = $191.40; annual surcharge = $2,296.80. Headroom to $274,001 = $56,000.
- Expected: tier index 1; household monthly Part B $568.20; household monthly Part D $29; household monthly surcharge $191.40; $56,000 headroom.
- Actual: tier index 1; `householdMonthlyPartB: 568.2`; `householdMonthlyPartD: 29`; `householdMonthlySurcharge: 191.4`; `headroomToNextBracket: 56000`.
- Checked on: 2026-10-26

## medicareVsAca

Source: https://www.medicare.gov/basics/get-started-with-medicare/sign-up/when-can-i-sign-up-for-medicare
Supporting sources: https://www.medicare.gov/health-drug-plans/coordination/who-pays-first and https://www.medicare.gov/basics/costs/medicare-costs/avoid-penalties
Policy maths: this is a decision rule, not an agency formula with a published worked example.

Example 1
- Inputs: age 66; active employer coverage; 25 employees; creditable coverage; 40 work credits.
- Hand calculation: the employer has 20 or more employees, so the group plan generally pays first and Part B can usually be delayed. Premium-free Part A ends Marketplace premium tax credits. If Part B were enrolled, the annual standard premium is $202.90 x 12 = $2,434.80.
- Expected: path `delay-part-b`; premium-free Part A true; ACA subsidy status `ends`; annual Part B estimate $2,434.80; eight-month Special Enrollment Period warning.
- Actual: path `delay-part-b`; `annualPartBPremium: 2434.8`; `acaSubsidyStatus: 'ends'`; warning includes the eight-month window.
- Checked on: 2026-10-26

Example 2
- Inputs: age 66; no current coverage; 20 work credits.
- Hand calculation: no premium-free Part A because work credits are below 40. Part A full premium = $565 x 12 = $6,780. Part B = $202.90 x 12 = $2,434.80. Annual Medicare premium estimate = $9,214.80.
- Expected: path `compare-aca`; `premiumFreePartA: false`; annual Part A $6,780; annual Part B $2,434.80; annual total $9,214.80.
- Actual: path `compare-aca`; `annualPartAPremium: 6780`; `annualPartBPremium: 2434.8`; `annualMedicarePremiumEstimate: 9214.8`.
- Checked on: 2026-10-26

Example 3
- Inputs: age 66; no current coverage; 35 work credits.
- Hand calculation: 30 to 39 credits use the reduced Part A premium. Part A = $311 x 12 = $3,732. Part B = $202.90 x 12 = $2,434.80. Annual Medicare premium estimate = $6,166.80.
- Expected: `partAStatus: 'reduced'`; `premiumFreePartA: false`; annual Part A $3,732; annual total $6,166.80.
- Actual: `partAStatus: 'reduced'`; `premiumFreePartA: false`; `annualPartAPremium: 3732`; `annualMedicarePremiumEstimate: 6166.8`.
- Checked on: 2026-10-26
