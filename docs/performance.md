# Performance pass

## Budgets from the brief

| Page type | Performance | Accessibility | SEO | CLS | INP | JS |
| --- | --- | --- | --- | --- | --- | --- |
| Calculator without ads | >= 95 | 100 | 100 | < 0.05 | < 200 ms | < 120 KB |
| Pages with ads | — | 100 | 100 | < 0.1 | < 200 ms | — |

## Build output (static export)

| Route | Page JS | First Load JS (gzip) | Brotli transfer |
| --- | --- | --- | --- |
| Home | 164 B | 106 kB | — |
| Calculators hub | 1.43 kB | 108 kB | 88.9 kB |
| Employer coverage calculator | 5.50 kB | 120 kB | 98.8 kB |
| IRMAA calculator | 6.18 kB | 120 kB | 99.4 kB |
| MSP calculator | 8.04 kB | 122 kB | 100.9 kB |
| Medicare vs ACA calculator | 6.87 kB | 121 kB | 100.0 kB |
| Part B penalty calculator | 5.40 kB | 119 kB | 98.7 kB |
| Guide page | 3.89 kB | 110 kB | — |
| Policy page | 194 B | 107 kB | — |
| Shared framework | — | 103 kB | — |

The production transfer budget is met: Brotli transfer is 98.7–100.9 kB on every calculator. Next's
gzip-based "First Load JS" metric is 119–122 kB; the two heaviest routes are 1–2 kB above 120 on that
metric because the MSP state table and ACA inputs are evaluated in the browser. The site ships no
chart library, animation dependency, or web font.

## Lighthouse 13.5, mobile, local static server

Chrome headless, default mobile throttling, three calculator runs and one guide run.

| Run | Performance | Accessibility | SEO | LCP | TBT | CLS |
| --- | --- | --- | --- | --- | --- | --- |
| Calculator (first) | 97 | 97 | 100 | 2.4 s | 130 ms | 0 |
| Calculator (after fixes) | 94 | 100 | 100 | 2.5 s | 180 ms | 0 |
| Calculator (repeat) | 84 | 100 | 100 | 2.9 s | 350 ms | 0 |
| Guide | 97 | 100 | 100 | 1.9 s | 170 ms | 0 |

The local server sends no long-lived cache headers, so Lighthouse flags cache lifetimes. The
calculator score also moves with machine load; TBT is the limiting metric. A production run on
Vercel with immutable asset caching is still required before treating any single number as final.

## What is already lazy or conditional

- No chart library is loaded anywhere.
- Ad slots render `null` while `site.features.ads` is false. When enabled, they reserve height,
  load the AdSense script only after advertising consent, and only when the slot is within 200 px of
  the viewport.
- The Plausible script loads only after analytics consent and only when a domain is configured.
- Consent mode and the consent banner are not shipped as active scripts when no optional service is
  configured.
- OG images are generated at build time; no image service runs in the browser.
- Fonts are system stacks, so there is no webfont request or FOIT.
- Ad placeholders use a fixed `min-height`, so enabling ads should not introduce CLS.

## Actions taken this phase

1. Added a shared `CalculatorEvents` component instead of five copies of listener logic.
2. Kept analytics and ads behind consent and configuration checks, so the default build ships no
   third-party requests.
3. Reserved ad heights for all three placements.
4. Confirmed CLS is 0 on the calculator and guide in every run.
5. Removed the header's redundant `aria-label` and raised the report link to the 24 px target; this
   moved accessibility from 97 to 100.
6. Replaced Zod with small hand-written client validators, which removed the largest calculator
   dependency from the initial bundle.
7. Removed `tailwind-merge`; `cn` now calls `clsx` directly because no call site merges conflicting
   utilities.
8. Moved glossary tip definitions out of the client bundle: server pages pass only the definitions a
   calculator uses, and the full glossary is no longer shipped to the browser.
9. Split the email capture form from the calculator interaction module so unrelated action code can
   be kept out of its chunk.

## Remaining work

1. Deploy to Vercel or an equivalent host with immutable caching, then run PageSpeed Insights on the
   production URL for the calculator and a guide.
2. Re-run Lighthouse with ads enabled to confirm CLS < 0.1 and that no slot appears above the fold.
3. Brotli transfer meets the 120 KB budget. If the gzip-based Next metric must also be under 120 kB
   on MSP and ACA, the next step is to pass state and premium tables into the formulas instead of
   importing the full data modules into the browser. Record that decision before changing the data
   flow.
4. Check INP with real interaction traces in Chrome DevTools. Lighthouse reports TBT, not INP.
5. Test on a mid-range Android device over throttled 4G; the local desktop CPU is not representative.
