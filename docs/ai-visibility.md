# AI visibility and answer-engine plan

The goal is to be quotable and checkable, not to stuff keywords. Every fact needs a visible source and a last-updated date.

## Page pattern

1. Answer capsule: 40 to 60 words directly under the H1.
2. Key facts table: figure, who it applies to, source, checked date.
3. Calculator or decision tool.
4. Worked example with the actual inputs and outputs.
5. "What changes the answer" section.
6. FAQ with natural questions, not keyword lists.
7. Sources and methodology link.
8. "Report an error" link.

## Technical requirements

- One H1 per page and a logical H2/H3 outline.
- FAQPage JSON-LD only when the page visibly contains the questions and answers.
- Article, WebApplication, BreadcrumbList, and Person schema where they match the page.
- Static HTML for the answer capsule, key facts, and FAQ. Do not hide the answer behind JavaScript.
- `llms.txt` with a short site summary, page index, and source policy.
- Stable URLs. Redirects only when a slug must change.
- No `noindex` on a page that is meant to answer a query.

## Content rules

- Say "MedicareClear is independent and not affiliated with Medicare.gov or any government agency" near the top of trust pages and in the footer.
- Do not claim "best", "guaranteed", or "official".
- Do not invent a state rule. If the state is not covered, say so and link to the state Medicaid agency.
- Do not give a single "you qualify" answer. Show the test, the inputs, and the next action.
- Keep the same fact consistent across the calculator, guide, table, and schema.

## Measurement

- Track organic entrances to calculator pages, not just homepage sessions.
- Track completion of a calculation and clicks to the official application pages.
- Review Search Console queries monthly for pages that answer a question but do not rank.
- Add a new page only when it answers a distinct question and has an original example.
