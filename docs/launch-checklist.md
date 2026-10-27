# Launch checklist

Work top to bottom. Do not mark a line done until it is verified on the production URL. Never ship an
empty verification tag, a placeholder publisher ID, or an unapproved ad.

## 1. Domain and canonical URL

- [ ] Replace `site.siteUrl` in `data/site.ts` with the production URL.
- [ ] Set `site.siteUrlIsPlaceholder` to `false`.
- [ ] Run `verify:tokens` without `ALLOW_PLACEHOLDERS=1`; it must pass.
- [ ] Confirm `metadataBase`, canonical links, sitemap, `llms.txt`, OG image URLs, and schema URLs
      all use the production host.
- [ ] Confirm `https://` and the non-`www` or `www` choice redirects to one canonical host.

## 2. Search engines and indexing

- [ ] Add the Google Search Console verification value to
      `site.integrations.googleSiteVerification`.
- [ ] Add the Bing Webmaster verification value to `site.integrations.bingSiteVerification`.
- [ ] Confirm each verification meta tag is present in the exported HTML and is not empty.
- [ ] Submit `/sitemap.xml` in Search Console and Bing Webmaster Tools.
- [ ] Submit the HTML sitemap and the guide hub for discovery.
- [ ] Confirm `robots.txt` explicitly allows Googlebot, Bingbot, OAI-SearchBot, ChatGPT-User,
      PerplexityBot, Claude-SearchBot, and Claude-User.
- [ ] Confirm the training-crawler flag (`allowTrainingCrawlers`) matches the owner's decision. When
      true, GPTBot, ClaudeBot, Google-Extended, and Applebot-Extended are allowed; when false, they
      are disallowed.
- [ ] Re-check the exact crawler names against each vendor's current documentation. The names are
      listed as VERIFY because vendors rename or add agents.
- [ ] Generate an IndexNow key, place the key file at the site root, set
      `site.integrations.indexNowKey`, deploy, then run `npm run indexnow`.
- [ ] Verify the IndexNow response and record the date in this file.

## 3. Analytics and consent

- [ ] Set `site.analytics.domain` to the production hostname.
- [ ] Confirm Plausible receives a pageview only after "Accept all".
- [ ] Confirm "Reject optional" sends no request to `plausible.io`.
- [ ] Confirm "Cookie settings" reopens the banner and shows the saved state.
- [ ] Confirm the privacy choice survives a reload and can be cleared from the browser.
- [ ] Confirm calculator inputs and URL hashes are never sent as analytics props.
- [ ] For EEA, UK, or Switzerland traffic, install a Google-certified CMP before enabling ads. The
      in-house banner is not a certified CMP by itself.
- [ ] Update the privacy and cookie pages if the providers, categories, or data flows change.

## 4. Advertising

- [ ] Do not enable ads until AdSense approves the site.
- [ ] Set `site.features.ads` to `true` only after approval.
- [ ] Set `site.integrations.adsensePublisherId` and `site.integrations.adsenseSlotId`.
- [ ] Replace the placeholder line in `public/ads.txt` with the approved publisher ID.
- [ ] Confirm no ad is above the fold, inside inputs, results, the answer capsule, or the action plan.
- [ ] Confirm each slot is labeled "Advertisement" and reserves its height.
- [ ] Confirm ads load only after advertising consent where required.
- [ ] Confirm CLS < 0.1 with ads on, on mobile.
- [ ] Confirm no Medicare lead-generation, agent, or "talk to an agent" CTA is present.

## 5. Email and contact

- [ ] Set `site.integrations.buttondownUser` if email capture is approved.
- [ ] Set `site.integrations.formspreeId` if the contact form is approved.
- [ ] Test the form with a real message and confirm the reply path.
- [ ] Confirm the mailto fallback reaches `ihsanaslamm@gmail.com`.
- [ ] Confirm `verify:emails` passes.
- [ ] Confirm the response-time note ("2 to 3 business days") is accurate.

## 6. Content and trust

- [ ] Confirm all 5 calculators and 10 guides are reachable within three clicks.
- [ ] Run `npm run check:all`; it must pass with no errors.
- [ ] Confirm the build's `verify:og` step reports a unique `og:image` for every exported page.
- [ ] Confirm the build's `verify:seo` step reports unique titles, meta descriptions, canonicals,
      `en-US`, one H1, and valid JSON-LD on every exported page.
- [ ] Confirm every calculator and guide has a capsule, key facts, six FAQs, worked example, source
      table, and visible last-updated date.
- [ ] Confirm every figure on the page matches `/data` and links to an official source.
- [ ] Confirm the author page contains no invented credentials, degrees, licenses, or employers.
- [ ] Confirm the About, Contact, Privacy, Terms, Disclaimer, Cookie, Editorial, Methodology, and
      Corrections pages are live with real copy.
- [ ] Confirm the site is described as independent and not affiliated with CMS, SSA, Medicare.gov, or
      the IRS.
- [ ] Confirm no competitor is named.
- [ ] Confirm no search-volume, testimonial, or fake review claim appears.

## 7. Accessibility and performance

- [ ] Run Lighthouse mobile on the home page, one calculator, and one guide. Record accessibility and
      SEO scores; both should be 100.
- [ ] Run the VoiceOver and NVDA scripts in `docs/accessibility.md` on real hardware.
- [ ] Test keyboard-only use, 200% zoom, and 320 px width.
- [ ] Confirm CLS < 0.05 without ads and < 0.1 with ads.
- [ ] Confirm no layout shift when the consent banner appears.
- [ ] Run PageSpeed Insights on the production URL and record LCP, INP, and CLS.

## 8. Hosting and operations

- [ ] Confirm the static export deploys cleanly and all assets return 200.
- [ ] Confirm `_next/static` assets use immutable caching.
- [ ] Confirm `404` returns the custom page.
- [ ] Confirm `sitemap.xml`, `robots.txt`, `llms.txt`, `ads.txt`, and OG images are reachable.
- [ ] Confirm the build does not require server-only features.
- [ ] Record the deploy commit and date.

## 9. After launch

- [ ] Check Search Console coverage and Bing index status after 48 hours.
- [ ] Check Plausible for calculator starts, completions, copy, calendar, take-home pack, signups, and
      outbound clicks.
- [ ] Run `docs/ai-visibility.md` once a month and record only observed citations.
- [ ] Run `docs/annual-update.md` when CMS, IRS, FPL, or state limits change.
- [ ] Re-check ads, consent, and CMP settings after any provider change.
- [ ] Keep the placeholder values out of production; `verify:tokens` is the backstop.

## Current status

| Item | Status |
| --- | --- |
| Production URL | Pending owner |
| Search Console / Bing values | Pending owner |
| IndexNow key | Pending owner |
| Plausible domain | Pending owner |
| AdSense approval | Not applied |
| Google-certified CMP | Required before EEA/UK/CH ads |
| Email providers | Off |
| Accessibility audit | Lighthouse 100; manual screen reader run pending |
| Performance | Calculator 144–146 kB first load; target not met |
