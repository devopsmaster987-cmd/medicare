# Annual update checklist

Run this checklist when CMS, SSA, HHS, or the IRS publish new figures. Do not change a number without a source URL and a checked date.

## Official sources

- CMS Part A and Part B premiums and deductibles: https://www.cms.gov/newsroom
- Medicare costs: https://www.medicare.gov/basics/get-started-with-medicare/medicare-basics/what-does-medicare-cost
- Medicare Savings Programs: https://www.medicare.gov/basics/costs/help/medicare-savings-programs
- Extra Help: https://www.ssa.gov/benefits/medicare/prescriptionhelp.html
- Part D costs and out-of-pocket cap: https://www.medicare.gov/health-drug-plans/part-d/basics/costs
- Federal poverty guidelines: https://aspe.hhs.gov/topics/poverty-economic-mobility/poverty-guidelines
- IRS affordability percentage: https://www.irs.gov/pub/irs-drop/rp-25-25.pdf
- ACA out-of-pocket maximum: https://www.federalregister.gov
- Marketplace premium tax credit rules: https://www.irs.gov/affordable-care-act/individuals-and-families/questions-and-answers-on-the-premium-tax-credit

## Update steps

1. Open `data/verified.ts` and change `figureYears.current`, `prior`, and `nextPending` only after the new year is confirmed.
2. Update every current-year figure in `data/` and set `verifiedOn` to the date checked. Add `verify: true` only for a figure that still needs owner confirmation.
3. Add prior-year values instead of overwriting them. The IRMAA lookback and penalty pages need them.
4. Update the federal poverty guideline array. Confirm the 48-state figure, Alaska, and Hawaii before publishing.
5. Recheck the IRS affordability percentage and update `data/irs.ts`.
6. Recheck the ACA out-of-pocket maximum and the status of enhanced premium tax credits.
7. Recheck MSP and Extra Help income and resource limits, including the 10 launch states.
8. Run `npm run typecheck`, `npm test`, `npm run verify:data`, and `npm run build`.
9. Add two hand-worked examples to `docs/verification-log.md` for every changed formula.
10. Change the visible "Last updated" date only through `dataVerifiedOn`; never type a new date into a page.
11. Update `llms.txt`, the source tables, and any guide that quotes a changed figure.
12. Ask the owner to sign off in writing before launch.

## Do not

- Do not copy a figure from a search result, a blog, or a competitor.
- Do not use a future year's figure before the agency publishes it.
- Do not round an official limit in the data layer. Round only for display.
- Do not remove a `verify: true` flag without a recorded source and date.
