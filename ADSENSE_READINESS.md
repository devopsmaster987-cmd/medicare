# AdSense readiness report

Date: 2026-10-29

Site: MedicareClear, https://medicareclear.top

Status: content, policy, technical SEO, and accessibility work is complete for the current data year. Ads and analytics remain off. The site is ready for an owner review and an AdSense application, but not for live ad serving until the owner supplies the AdSense publisher ID, slot ID, and consent setup.

## What changed (2026-10-29)

### Glossary depth (thin-content fix)

- Rewrote all 60 glossary pages from short one-line definitions into full entries: definition, "Why it matters" paragraphs, the exact current figure or test with its official source, a worked example computed from `/data`, links to the calculators that use the term, related terms, and a sourced check-date row table.
- Every entry cites at least one official .gov/.mil source and carries an ISO `updatedOn` date rendered as "Last updated".
- Every glossary URL now exceeds 250 visible words (hub included); the admitted word counts range from roughly 360 to 600.
- Added `scripts/verify-glossary.ts` (`verify:glossary`) to the production build and to `check:all`. It fails if any entry drops below 250 rendered words, loses its "Why it matters" / "Worked number" / "Related terms" sections, cites no official source, uses a non-URL source, or creates a duplicate slug. It also re-checks the built hub.
- Expanded `tests/glossary.test.ts` to 10 tests (60 terms, unique slugs, source and worked-example presence, internal-link validity, tips API).
- Glossary metadata descriptions are word-boundary truncated to 155 characters.
- All glossary data lives in `data/glossary/` (typed entries, per-figure source objects from `data/sources.ts`) so yearly updates stay one-file edits.

### URL consistency

- Normalized trailing slashes on rendered internal links across guides, glossary, calculators, and policy pages; `verify:links` passes on 121 HTML files and 4,300 internal links.
- Fixed `/cookie-policy#cookie-settings` footer links to `/cookie-policy/#cookie-settings`.

## What changed

### Content quality and originality

- Rewrote the repeated `## Three honest caveats` heading in all 35 guides as a page-specific heading.
- Rewrote the repeated `## What to do next` heading in all 35 guides as a page-specific heading.
- Removed a duplicated SSA-44 denial paragraph.
- Rewrote two repeated caveats (IRMAA reduction and Part D pharmacy network) and one repeated sentence (Form 1095-A).
- Added a visible plain-language summary line at the top of every guide.
- Kept every guide between 1,208 and 1,711 words; the 10 cornerstone guides remain above 1,500 words.
- Added a per-guide change table in `docs/content-audit.md`.

### Calculator correctness

- Fixed the Part B late-enrollment penalty logic for creditable coverage.
- The calculator now reports months counted and months excluded.
- Creditable coverage excludes months only when the user does not report a missed Special Enrollment Period.
- Added four boundary tests; the Part B suite now has 11 tests.
- Added two worked examples to the public verification log for the creditable-coverage cases.
- No other calculator formula or official figure was changed.

### Trust and E-E-A-T

- Added a public verification log at `/verification-log` with 5 formulas, 18 worked examples, official source links, expected results, actual results, and checked dates.
- Linked the verification log from every calculator source table, the methodology page, the footer, the sitemap, and every guide.
- Added a publisher facts table to `/about` and `/authors/abdul-samad`.
- Added the research process to `/about` and a boundary-test table to `/methodology`.
- Added six dated entries to the corrections change log.
- Added a `TODO(owner)` code comment where professional credentials would go; the pages state plainly that no credentials, US license, or agency affiliation are claimed.

### New original value pages

- `/what-changed-2026`: 2026 vs 2025 figures for Part B, Part D, IRMAA, Part A, and ACA, with source table.
- `/medicare-deadlines`: initial, general, special, annual, HSA, and ACA enrollment windows.
- `/scenarios`: three worked decisions (working past 65, creditable coverage with a missed SEP, IRMAA cliff).
- `/verification-log`: public hand-check record.
- All four are in the footer, sitemap, human sitemap, and home reference shelf.

### Technical SEO

- Added `lib/seo.ts` and clamped every guide meta description.
- Set absolute titles for the five calculators and all guides.
- Added title (60 characters) and description (160 characters) checks to `verify:seo`, with HTML-entity decoding.
- Generated unique OG images for the four new pages (120 images total, 120 unique).
- Added `verify:links` for 4,169 internal links across 121 HTML files.
- Added `verify:a11y` for language, duplicate IDs, ARIA references, image alt text, empty links and buttons, and `target="_blank"` rel values.
- Added the new scripts to `check:all` and the production build.

### Accessibility and senior usability

- Added a high-contrast theme (`H`) alongside light (`L`) and dark (`D`).
- Kept the A / A+ / A++ text-size control.
- Kept the skip link, visible focus ring, labeled form fields, and `aria-live` result regions.
- Confirmed one H1 per page, `lang="en-US"`, unique IDs, and accessible names in the exported HTML.
- Reduced motion and print styles remain in place.

### Advertising preparation

- Ads remain off behind `ADS_ENABLED` / `NEXT_PUBLIC_ADS_ENABLED`.
- Added `ADSENSE_CLIENT_ID` and `ADSENSE_SLOT_ID` aliases, including `ca-pub-` normalization.
- Added a reserved `mid-article` ad slot to every guide, in addition to `below-calculator` and `end-faq`.
- Ad slots render nothing when the flag is off; when on, they reserve height and wait for advertising consent.
- `public/ads.txt` stays a placeholder comment until a publisher ID exists.
- Consent Mode v2 defaults to denied and is updated only after a choice.
- No ad is above the fold, inside inputs, inside results, inside the answer capsule, or inside the action plan.

## Verification results

| Check | Result |
| --- | --- |
| `npm run typecheck` | Pass |
| `npm run test` | 83 tests pass (9 files) |
| `npm run lint` | Pass, no warnings |
| `npm run verify:data` | Pass (48 verify flags; state flags remain for 7 launch states) |
| `npm run verify:guides` | Pass (35 guides; all 1,200+ words; 10 at 1,500+) |
| `npm run verify:tokens` | Pass (0 warnings) |
| `npm run verify:emails` | Pass (only ihsanaslamm@gmail.com) |
| `npm run verify:hardcode` | Pass |
| `npm run verify:keywords` | Pass |
| `npm run verify:aeo` | Pass |
| `npm run verify:features` | Pass |
| `npm run verify:log` | Pass |
| `npm run verify:adsense` | Pass (ads-off warning only) |
| `npm run verify:links` | Pass (4,169 internal links) |
| `npm run verify:a11y` | Pass (121 HTML files) |
| `npm run verify:indexing` | Pass (119 sitemap URLs) |
| `npm run build` | Pass (125 static pages, 121 HTML files) |

## Lighthouse

Mobile, default Lighthouse throttling, local static export:

| Page | Performance | Accessibility | Best practices | SEO | LCP | CLS | TBT |
| --- | --- | --- | --- | --- | --- | --- | --- |
| Home | 99 | 100 | 100 | 100 | 1.1 s | 0 | 90 ms |
| IRMAA calculator | 95 | 100 | 100 | 100 | 0.8 s | 0 | 160 ms |
| MSP calculator | 99 | 100 | 100 | 100 | 1.1 s | 0 | 130 ms |
| SSA-44 guide | 98 | 100 | 100 | 100 | 1.1 s | 0 | 180 ms |

Desktop preset on the IRMAA calculator: 100 / 100 / 100 / 100, LCP 0.6 s, CLS 0, TBT 0 ms.

One first cold mobile run scored 25 because the local static server took 3.1 seconds for the document and the throttled CPU produced a 45-second blocking-time reading. An immediate rerun of the same build scored 95 with a 0.8-second LCP. Treat the table above as the stable local result and re-run Lighthouse on the production URL after deployment.

## Owner actions still required

These are the only items that block a live AdSense deployment. Do not invent any of them.

1. **AdSense publisher ID**: `pub-` plus 16 digits. Put it in `ADSENSE_CLIENT_ID` or `NEXT_PUBLIC_ADSENSE_PUBLISHER_ID`.
2. **AdSense slot ID**: numeric. Put it in `ADSENSE_SLOT_ID` or `NEXT_PUBLIC_ADSENSE_SLOT_ID`.
3. **Google-certified CMP**: confirm the AdSense consent message is configured for EEA, UK, and Switzerland before enabling personalized ads there.
4. **Turn ads on**: set `ADS_ENABLED=true` (or `NEXT_PUBLIC_ADS_ENABLED=true`) only after 1–3 are done, then run `npm run verify:adsense`.
5. **ads.txt**: run `npm run generate:ads-txt` after the publisher ID is set, then confirm the seller line is live at `/ads.txt`.
6. **Search Console and Bing Webmaster**: verify the domain and submit `https://medicareclear.top/sitemap.xml`.
7. **IndexNow**: supply the key in `data/site.ts` if the ping script will be used.
8. **Professional background**: add verified credentials only if they are real. Until then, the site correctly claims none.
9. **State MSP rules**: verify the 7 remaining launch states (FL, GA, IL, MI, OH, PA, TX) against each state Medicaid agency before clearing their `verify` flags.
10. **Legal review**: the owner should read the privacy, cookie, terms, and disclaimer pages once more after the AdSense IDs and CMP are known.
11. **Owner sign-off**: confirm the About, Contact, and author details are accurate.

## Launch checklist

- [ ] Supply AdSense publisher ID and slot ID.
- [ ] Configure the Google-certified CMP.
- [ ] Enable ads and run `npm run check:all`.
- [ ] Generate `ads.txt` and confirm it is public.
- [ ] Deploy to Vercel with `NEXT_PUBLIC_SITE_URL=https://medicareclear.top`.
- [ ] Confirm the `www` to apex redirect and HTTPS.
- [ ] Submit the sitemap to Search Console and Bing.
- [ ] Run Lighthouse against production.
- [ ] Re-check the 7 remaining state MSP rules.
- [ ] Confirm no ad appears above the fold or inside a result.
- [ ] Confirm the consent banner appears in an EEA test location before ads load.
- [ ] Keep ads off until the owner has reviewed the live site.

## Known limits

- Ad serving cannot be tested locally without real AdSense IDs and a consent platform.
- External government links are not checked by an automated network test; they were checked when the source data was recorded.
- The 7 unverified launch states still show federal limits and an honest note; they are not presented as state-specific advice.
- The site does not claim US credentials or agency affiliation, and it should not add such claims without documentary support.
- The local Lighthouse server is not the production CDN; production metrics must be re-measured after deployment.
