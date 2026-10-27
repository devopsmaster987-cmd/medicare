# MASTER PROMPT: "MedicareClear" (Next.js 15, fully static)
# Save as AGENTS.md in the repo root. Re-read it at the start of every phase.
# REVISION 3: added the NORTH STAR principle (section 0A) and wired it into the
# hard rules, section 6 (verification log), section 12, section 14 and section 15.
# REVISION 2 changes kept: section 8A rewritten around the supplied keyword list;
# guide list (8A), 8F, section 5 (data/keywords.ts shape), section 12 (verify:keywords).

================================================================================
0A. NORTH STAR (overrides everything else when in doubt)
================================================================================

The goal is to build a genuinely useful website, verify every calculation
against official sources, and publish original content that helps people make
sense of complicated Medicare and ACA rules.

What this means in practice:
- USEFUL FIRST. Every page must help a real person decide something or do
  something. If a page, feature, or paragraph does not do that, cut it. Never
  add pages to inflate volume, rankings, or ad inventory.
- VERIFIED, NOT ASSUMED. Every calculation is checked against an official
  source (CMS, SSA, IRS, HealthCare.gov, state Medicaid agencies) before it
  ships. For each formula, work at least two examples by hand from the official
  published tables or worked examples and confirm the code matches. Record each
  check in /docs/verification-log.md: formula, official source URL, example
  inputs, expected result, actual result, date, and who checked. Where no
  official worked example exists, say so on the Methodology page.
- ORIGINAL, NOT RECYCLED. Content must add something the government page does
  not: a computed result, an edge case explained, a decision path, a deadline
  worked out from the user's own dates. Never paraphrase another site. Plain
  language over jargon; explain complicated rules step by step with real
  numbers from /data.
- HONEST ABOUT LIMITS. When a rule is unclear, varies by state, or has changed
  recently, say so and point to the official source rather than guessing.
- If a task conflicts with this section, stop and tell me instead of shipping.

================================================================================
0. ROLE AND WORKING RULES
================================================================================

You are a senior Next.js engineer, a technical SEO, a restrained editorial
designer, and an accessibility specialist for readers aged 55-75. Work in
phases. After each phase: typecheck, test, build, commit, then STOP and report:
files changed, test status, VERIFY list, and decisions I should review. Never
dump thousands of lines at once.

HARD RULES
- Never invent a number. Every figure lives in /data with `year`, `source`
  (a real URL) and `verifiedOn`. If unsure, add `// VERIFY: <url>` and list it
  in the report. I will paste official CMS / SSA / IRS tables when you ask.
- No formula ships until it has passed the verification step in section 0A and
  has an entry in /docs/verification-log.md.
- Never invent people, reviewers, credentials, testimonials, ratings, usage
  stats, search volumes, social profiles, phone numbers, or addresses. Use only
  the owner details in section 1.
- Never claim or imply the site owner is in the US, is a licensed US insurance
  agent, attorney, CPA, or is affiliated with any government agency.
- Never name or criticize competitors anywhere on the site. We win by being
  more accurate, more current, and more useful, not by comparison.
- TypeScript strict. No `any` without a justifying comment.
- No database, no auth, no API routes. Fully static: `output: 'export'`.
  No ISR. Figures change by editing /data and redeploying.
- Static-export requirements: `images: { unoptimized: true }`, and
  `export const dynamic = 'force-static'` in sitemap.ts, robots.ts and any
  metadata route. No features that need a server runtime.
- Write the Vitest test for every formula BEFORE its UI.
- White-hat SEO only: no expired-domain redirects, link-seeding, hidden text,
  keyword stuffing, or cloaking.
- Inputs the user types never leave their browser and are never sent to
  analytics.
- If a design choice is ambiguous, pick the calmer, plainer option.

================================================================================
1. MISSION AND OWNER
================================================================================

Free calculators that answer: "What will my Medicare or ACA costs be, what can
I do about it, and what exactly do I do next?"

Audience: US only. Ages 55-75 (Medicare) and self-employed 30-60 (ACA).

WHAT MAKES US BETTER (the product thesis, see section 2A)
Most existing tools stop at a number. We deliver: the number, the reason, the
exact next step, the deadline, the documents to bring, and the date we last
checked the figure against the official source.

SITE OWNER DETAILS (single source of truth: /data/site.ts)
  siteName:       MedicareClear
  ownerName:      Abdul Samad
  contactEmail:   ihsanaslamm@gmail.com
  location:       Punjab, Pakistan
  mailingAddress: "Punjab, Pakistan"
  governingLaw:   "Punjab, Pakistan"
  siteUrl:        "" (I will supply)
  socialProfiles: [] (real URLs only, supplied by me; empty until then)
  lastUpdated:    derived from the latest /data verifiedOn date

The email ihsanaslamm@gmail.com is the ONLY contact email. Define it once,
import it everywhere, render it as a mailto: link. verify:emails proves it.

HONESTY ABOUT THE OWNER
The About page states plainly that this is an independent publisher in Punjab,
Pakistan, who researches US rules from official US government sources, and that
every figure links to its official source so readers can verify it. Do not hide
the location or pretend to be US-based. Transparency is part of the trust design.

DEFAULT CHOICES (change only if I say so)
  Package manager: npm        Analytics: Plausible (cookieless)
  Email list: Buttondown      Contact form: Formspree + mailto fallback
  Launch data: 2026 figures. Add 2027 figures ONLY after I paste the official
  CMS/IRS/SSA tables. Until then no 2027 page may contain numbers.
  MSP launch states (10): CA, NY, TX, FL, PA, IL, OH, MI, AZ, GA. Verify each
  state's own limits, rules, and agency URL. Every other state shows an honest
  "not yet covered" message plus a link to that state's Medicaid agency.

================================================================================
2. FIVE FLAGSHIP CALCULATORS (build in THIS order; nothing else until they ship)
================================================================================

BUILD ORDER (based on where competitors are weakest)
  1. Employer coverage affordability   2. MSP + Extra Help by state
  3. Part B late-enrollment penalty     4. IRMAA cliff checker
  5. Medicare vs ACA decision

1. Employer coverage affordability test (written for the EMPLOYEE)
   Inputs: household income, employee-only premium, optional family premium,
   pay frequency.
   Logic: this year's IRS affordability percentage (VERIFY, indexed yearly)
   applied to the lowest-cost self-only plan; family members tested against
   the family premium (family-glitch fix); minimum-value test explained.
   Output: affordable or not, exact dollar threshold, margin, and what it means
   for marketplace subsidy eligibility. Explain household income vs W-2 wages in
   plain words. Check and state the current status of the enhanced ACA
   subsidies and the 400% FPL cliff from a primary source (VERIFY) before
   writing any claim.
   Next steps: how to apply for marketplace coverage, what to tell the
   marketplace about the job offer, which documents to have ready.

2. MSP + Extra Help eligibility, state-specific
   Inputs: state, filing status, household size, monthly income, countable assets.
   Logic: income as % of FPL vs the STATE's QMB / SLMB / QI limits and the
   federal Extra Help limits; asset tests (single vs married); state rules and
   income disregards where verified. Never guess a state's numbers.
   Output: programs likely qualified for, dollar value per month and per year
   (computed from the current Part B premium in /data, never hardcoded), and a
   clear "you may still qualify, apply anyway" message when the user is slightly
   over the limit, because disregards can change the result.
   Next steps: the state agency name, link, and phone; documents to bring;
   what MSP approval automatically unlocks (Extra Help) as stated by an
   official source (VERIFY).

3. Part B late-enrollment penalty
   Logic: 10% of the standard premium for each full 12-month period of delay,
   permanent, recalculated against each year's standard premium.
   Output: monthly, annual, and lifetime cost (10-year and 20-year views).
   Include a "Can I avoid this?" checker: the 8-month Special Enrollment
   Period, creditable employer coverage, and exceptions, each with the proof
   usually needed. Explain exactly how the penalty is added to the premium.

4. IRMAA cliff checker
   Inputs: filing status, MAGI from 2 years back, projected MAGI.
   Output: current tier, Part B + Part D surcharge (monthly and annual), dollars
   of headroom to the next bracket, a cliff chart, Roth-conversion headroom.
   Must also include:
   - A TWO-YEAR LOOKAHEAD table: "income you earn in year X sets your premium
     in year X+2", with a plain-English warning before a big sale, conversion,
     or distribution.
   - A married-couple view: each enrolled spouse may pay the surcharge.
   - The SSA-44 appeal helper: list of life-changing events, what proof is
     usually asked for, and what to ask SSA. Present as guidance, not advice.
   - Married-filing-separately tiers, and that Part D IRMAA is billed
     separately from the plan premium (verify wording at Medicare.gov).

5. Medicare vs ACA decision
   Decision tree: age, employer size (20-employee rule), active vs retiree
   coverage, HSA status, work credits (premium-free Part A or not).
   Must include: stop HSA contributions 6 months before Medicare starts (Part A
   backdates), IEP/SEP windows with real dates, Part B penalty risk, that ACA
   subsidies end once someone is eligible for premium-free Part A, and the case
   of people who do NOT qualify for premium-free Part A.
   Output: recommended path with reasoning, cost delta, and a deadline timeline.

================================================================================
2A. COMPETITIVE EDGE: REQUIRED FEATURES ON EVERY FLAGSHIP
================================================================================

Observed in October 2026 search results (re-verify before launch): many tools
give a bracket or a yes/no and stop; some use stale figures such as an old
Part B premium; MSP tools often show only federal minimums; affordability
content is mostly written for employers, not employees; Medicare-vs-ACA
content is articles with no decision tool. We beat this with the following.

EVERY FLAGSHIP MUST HAVE
 1. THE NUMBER: live result with a plain-English takeaway sentence.
 2. THE WHY: "Show the math" with the user's own numbers.
 3. THE NEXT STEP (ActionPlan component): who to contact (name, official link,
    phone from /data), what to say (two or three plain sentences), documents to
    bring, and how long it usually takes where an official source says so.
 4. THE DEADLINE: dates computed from the user's inputs, with a
    "Download to my calendar" button that generates an .ics file in the browser.
 5. THE TAKE-HOME PACK: one-tap print/save-as-PDF view containing the user's
    inputs, results, math, sources with dates, and the action plan. Clean print
    stylesheet. Nothing is uploaded.
 6. WHAT CHANGED SINCE LAST YEAR: a small data-driven strip (for example the
    premium, threshold, or limit versus last year). Prior-year figures live in
    /data with sources; VERIFY each.
 7. PROOF OF CURRENCY: "Figures checked against {source} on {date}" in plain
    sight, linking to the official page. This is our core trust signal.
 8. SCENARIO COMPARE: "Compare with another number" side by side (for example
    two income levels), still without a Calculate button.
 9. PLAIN LANGUAGE: target about a grade 8 reading level; every jargon term
    (MAGI, IRMAA, QMB, SEP) shows a tap-to-define tooltip from the glossary.
10. SENIOR-FRIENDLY ACCESS: a visible text-size control (A / A+ / A++), a
    high-contrast option, large tap targets, no hover-only content, no timeouts,
    and a "read this page aloud friendly" structure (clear headings, short
    paragraphs). The calculator must work on a small old phone.
11. HONEST EDGES: if the tool cannot decide (unknown state, unusual situation),
    say so and point to the official source. Never show false precision.
12. REPORT AN ERROR link on every result, pre-filled with the page URL and
    inputs the user chooses to share (mailto to ihsanaslamm@gmail.com).

Spanish and other languages are v2. Do not build them now.

================================================================================
2B. EVERY FLAGSHIP PAGE HAS, IN THIS ORDER
================================================================================
  1. Breadcrumb
  2. H1 (the page's primary keyword, section 8)
  3. ANSWER CAPSULE: 40-60 word direct answer
  4. Calculator card (inputs left, live results right; stacked on mobile)
  5. One large plain-English takeaway sentence under the numbers
  6. Deadline + calendar button (where relevant)
  7. ActionPlan: who to contact, what to say, documents to bring
  8. "Show the math" step by step with the user's numbers
  9. Key facts table (plain HTML) + source table: figure, value, year, source
     link, verifiedOn
 10. "What changed since last year" strip
 11. Secondary-keyword H2 sections, each opening with a one-sentence answer
 12. Worked example table computed from /data
 13. Three honest caveats
 14. Six real FAQs (visible, matching schema)
 15. Four related calculators / guides (internal links)
 16. Take-home pack button, Copy my results, shareable URL state
 17. Email capture
 18. Disclaimer, Report an error, and "Last updated {date}" from /data

================================================================================
3. DESIGN SYSTEM: gorgeous, human, NOT "AI-made"
================================================================================

Feel: a quiet financial magazine crossed with a precision instrument. A printed
reference book, not a SaaS landing page. Calm, roomy, confident.

TYPE
- Headlines: Fraunces (variable serif) via next/font. Body and UI: Inter.
- 17px base (user can scale up), 1.65 line height, 68ch measure.
- Numbers: tabular-nums, large, the hero of every result.

COLOR
- ink #0B2545, blue #1D6FB8, accent #F2A03D (primary action only),
  paper #FAFAF7, hairline #E6E4DD, success #1E7A5A, warning #B4552A.
- Full dark mode using warm dark (#14130F range), never pure black. Plus a
  high-contrast mode.
- Color is used for meaning only.

LAYOUT
- Structure with hairline rules, whitespace, and type scale, not heavy boxes.
- 96-128px between sections on desktop (56px mobile). Left-aligned text.
  Asymmetric editorial layout (wide column plus a narrow margin-notes column).
- Radius 6-10px, 1px borders, almost no shadows.
- Home page: numbered editorial list of the five calculators, NOT three
  identical cards. One accent button only.
- Answer capsule is a quiet pull-quote block (hairline left rule, Fraunces
  20-22px), not a colored box. ActionPlan is a numbered checklist, not cards.
- Charts: simple SVG/Recharts, direct labels instead of legends.

BANNED (these make a site look AI-generated)
- Purple/indigo-to-pink gradients, glassmorphism, glowing blobs, gradient text
- Three identical rounded cards with an icon in a circle
- Emoji as icons, stock photos of smiling seniors, fake dashboards
- Centered hero with a badge pill ("New", "AI-powered") and two buttons
- Filler copy: revolutionize, seamless, unlock, empower, cutting-edge,
  "in today's fast-paced world"
- Fake social proof: "Trusted by 50,000+", star ratings, invented testimonials
- Uniform drop shadows and rounded-2xl on everything
- shadcn components left at their defaults (restyle all to these tokens)

COPY VOICE
- Plain, specific, a little dry, like a knowledgeable friend. Short sentences.
- Real examples computed from /data; never hardcode figures.
- US English, month/day/year dates, dollars.

INTERACTION
- Live recalculation. No Calculate button.
- Results count up ~400ms; takeaway fades in after. Charts draw once.
- Sticky result summary on mobile. Honor prefers-reduced-motion.
- No popups, no interstitials, no layout shift.
- Designed empty, loading, and error states. Inline validation in plain words.
- Inputs: currency masking, inputMode="decimal", 48px touch targets.
- Considered 404 page. Real favicon. Minimal motion: count-up and fade only.

ACCESSIBILITY: WCAG 2.2 AA, visible focus rings, aria-live="polite" on results,
4.5:1 contrast, full keyboard use, real labels, screen-reader tested.

================================================================================
4. STACK (do not substitute)
================================================================================

Next.js 15 App Router, TypeScript strict, `output: 'export'`
Tailwind CSS v4, shadcn/ui primitives (restyled), Recharts (lazy-loaded)
Zod for every input schema, Vitest, minimal Framer Motion
MDX for guides (@next/mdx or equivalent that works with static export)
next/font for Fraunces + Inter
ICS generation: small in-house function, no heavy library
Email capture: Buttondown. Contact form: Formspree with mailto: fallback to
ihsanaslamm@gmail.com
Analytics: Plausible. Deploy: Vercel.

================================================================================
5. REPO STRUCTURE
================================================================================

app/
  (site)/page.tsx                    home
  calculators/page.tsx               hub
  calculators/[slug]/page.tsx        generateStaticParams
  guides/page.tsx  guides/[slug]/page.tsx
  glossary/page.tsx  glossary/[term]/page.tsx
  authors/[slug]/page.tsx            author page for Abdul Samad (real details only)
  about/ contact/ privacy-policy/ terms-of-service/ disclaimer/
  cookie-policy/ editorial-policy/ methodology/ corrections/
  sitemap-page/                      human-readable HTML sitemap
  not-found.tsx  sitemap.ts  robots.ts  opengraph-image.tsx
public/ads.txt  public/llms.txt (optional, generated)
components/ calc/ ui/ trust/ ads/ consent/ seo/ (AnswerCapsule, KeyFacts, Faq,
            JsonLd) action/ (ActionPlan, DeadlineIcs, TakeHomePack,
            WhatChanged, ScenarioCompare, TextSizeControl, GlossaryTip,
            ReportError)
content/pages/*.md  content/guides/*.mdx
data/ (site.ts, keywords.ts, entities.ts, verified.ts, contacts.ts, and all
       figure tables, current year AND prior year)
docs/ (annual-update.md, ai-visibility.md, verification-log.md)
lib/formulas/  lib/seo.ts  lib/ics.ts
scripts/ (verify-data, verify-tokens, verify-emails, verify-hardcode,
          verify-keywords, verify-aeo, verify-features, verify-log)
tests/

================================================================================
6. DATA LAYER (build before any UI)
================================================================================

Shared shape (data/types.ts):
  Sourced = { year, source (real URL), verifiedOn (ISO date), note?, verify? }
  Money = Sourced & { amount }   Rate = Sourced & { rate }
  Bracket = Sourced & { upTo: number | null, value }

/data files: site.ts, keywords.ts, entities.ts, verified.ts, contacts.ts
(official agency names, links, phone numbers with sources), fpl.ts,
medicare-part-a.ts, medicare-part-b.ts (premium, deductible, IRMAA tiers incl.
MFS), medicare-part-d.ts (OOP cap, deductible, base premium, IRMAA add-ons,
Extra Help limits), aca.ts (affordability %, OOP max, applicable-percentage
table), msp.ts (federal and per-state QMB/SLMB/QI/QDWI, resource limits,
disregards), penalties.ts, states.ts (name, abbr, Medicaid agency name + URL,
mspCovered), irs.ts (enrollment periods, HSA six-month rule, 20-employee rule),
lifeEvents.ts (SSA-44 life-changing events with source).

Rules:
- No hardcoded year, dollar figure, or phone number outside /data.
- Every figure has year, source, verifiedOn. Unsure = `verify: true` + report it.
- Keep prior-year values for the "what changed" strip.
- Tests cover: normal case, every threshold boundary (one dollar below, at, one
  dollar above), zero income, each cliff, and each state in the MSP launch set.
- A year change (2027) must be a one-file edit per figure table.
- /docs/annual-update.md: a checklist for each year (CMS Part B and IRMAA in the
  fall, IRS affordability when published, FPL in January, state MSP limits in
  the spring), with every file to touch.
- /docs/verification-log.md: one entry per formula (see section 0A). Each entry
  lists the official source URL, at least two hand-worked examples taken from
  official tables or worked examples, expected vs actual output, and the date.
  Re-verify every formula whenever its inputs in /data change.

================================================================================
7. TRUST AND POLICY PAGES (required for Google AdSense)
================================================================================

Build ALL of these with real content. No lorem ipsum, no "coming soon".

Routes: /about, /contact, /privacy-policy, /terms-of-service, /disclaimer,
/cookie-policy, /editorial-policy, /methodology, /corrections, HTML sitemap,
custom 404, author page for Abdul Samad.

OWNER DETAILS IN THE PAGES
- About: "I'm Abdul Samad, an independent publisher based in Punjab, Pakistan.
  I research US Medicare and ACA rules from official government sources and
  turn them into free calculators." Explain why the site exists, that it is
  funded by ads, and that every number links to its official source. State the
  site's purpose in plain words: to be genuinely useful, to check every
  calculation against official sources, and to explain complicated rules in
  original, plain-language content.
- Contact: email ihsanaslamm@gmail.com, location "Punjab, Pakistan", form,
  response-time note (2 to 3 business days), links to official US help
  (1-800-MEDICARE, SSA, SHIP at shiphelp.org, Healthcare.gov).
- Privacy Policy: name Abdul Samad as operator, based in Punjab, Pakistan; data
  may be processed in other countries through hosting, analytics, and
  advertising providers. State that calculator inputs stay in the browser.
- Terms of Service: governing law "Punjab, Pakistan".
- Author page: name, location, short factual bio. NO credentials, degrees,
  licenses, years of experience, or past employers unless I supply them.
- Methodology: list the sources, update schedule, known limits, and how the
  formulas are tested (describe the boundary tests and the hand-checked
  verification against official examples in plain words).

COPY: I will paste the final text for the nine policy pages from the document
"MedicareClear: Site Pages (Final Copy)". When I do:
  - Save each page as content/pages/<slug>.md and render it VERBATIM.
  - Replace tokens ([YOUR NAME], [COUNTRY / STATE], [SITE URL], [DATE]) with
    values from /data/site.ts.
  - verify:tokens must FAIL the production build if any bracket token or empty
    required value would ship.
  - Until then, build templates with a dev-only placeholder.

REQUIRED CONTENT RULES
- Privacy Policy must match what the site actually runs (Plausible, Buttondown,
  Formspree, Vercel, Google AdSense when enabled): AdSense cookies, vendors,
  opt-out links (adssettings.google.com, aboutads.info,
  policies.google.com/technologies/partner-sites), data collected, CCPA/CPRA/US
  state and GDPR rights, children's privacy, ihsanaslamm@gmail.com as contact.
- Disclaimer: estimates only, not tax, legal, medical, or insurance advice, and
  not affiliated with CMS, SSA, Medicare.gov, or the IRS.
- Corrections page: how to report an error plus a visible dated change log.
- Footer on every page links all policy pages plus a "Cookie settings" link.
  Top nav includes About and Contact.
- Consent: Google-certified CMP for EEA/UK/Switzerland, Consent Mode v2. Ads
  load only after consent where required.
- ads.txt (publisher ID placeholder until I supply it):
  google.com, pub-XXXXXXXXXXXXXXXX, DIRECT, f08c47fec0942fa0
- Minimum content before I apply to AdSense: 5 flagships and 10 original guides
  of 1,200+ words each. Genuinely useful, no thin or duplicated pages.

================================================================================
8. SEO + AEO + GEO PLAN
================================================================================

8A. KEYWORD RULES AND KEYWORD MAP (REVISED)

RULES
- /data/keywords.ts is the single source of truth. Shape:
  { keyword, role: 'primary' | 'secondary' | 'faq' | 'synonym' | 'topic' |
    'parked' | 'excluded', page, headingLevel?, note? }
  Roles:
    primary   = the page's H1. One per page.
    secondary = an H2/H3 on that page (opens with a one-sentence answer).
    faq       = a visible FAQ question on that page (not a heading).
    synonym   = used naturally in body copy and meta text. Never its own heading.
    topic     = broad head term. No page targets it. May appear naturally in
                copy. Never forced into H1/H2.
    parked    = needs a tool or page we do not have in v1. Build nothing.
    excluded  = never used on the site (reason recorded in `note`).
- Keywords containing a year are stored with a {year} token (2026 -> {year})
  and resolved from /data. Never type a year in a keyword string.
- ONE primary per page. The primary is the H1 (natural phrasing) and appears
  in the title, meta description, slug (where the slug is evergreen), and first
  40 words. Slugs stay evergreen: the year lives in the H1 and title only.
- Title template: "{H1}" plus " | MedicareClear". Append "({year})" only if the
  H1 does not already contain the year (avoids "irmaa brackets 2026 (2026)").
- Cannibalization rule: a keyword is assigned to exactly ONE page. Where a
  calculator and a guide overlap, the GUIDE owns the question and the
  calculator links to it with natural anchor text.
- "Repeats more than 4 times" is counted in body text per page, per keyword.
- No keyword stuffing. Search volumes are UNVERIFIED: never display them.
  If I supply volumes, store them in an internal-only field, never rendered.
- Keywords serve the reader, not the other way round (section 0A). If a keyword
  forces unnatural or unhelpful copy, drop it from that page and tell me.

-------------------------------------------------------------------------------
HOME  /            primary: free medicare calculator
  synonym/topic: medicare cost, medicare eligibility, medicare enrollment,
  health insurance calculator (natural mentions only)

HUB  /calculators  primary: medicare calculator
  synonym: medicare cost, health insurance calculator

-------------------------------------------------------------------------------
CALCULATOR 1  /calculators/employer-coverage-affordability
  primary (H1):  is employer health insurance affordable {year}
  secondary H2:  lowest cost self only plan affordability
                 what counts as minimum value coverage
                 household income vs w2 wages marketplace
                 family glitch fix calculator
  faq:           is my employer plan affordable single
                 minimum value coverage explained
                 employer health insurance affordability test
  synonym:       is employer health insurance affordable calculator,
                 employer health insurance affordability,
                 marketplace affordability calculator
  (moved to guides, link out: "family glitch fix explained {year}" -> Guide 10)

CALCULATOR 2  /calculators/medicare-savings-program-extra-help
  primary (H1):  medicare savings program income limits {year}
  secondary H2:  qmb income limit {year}
                 slmb income limit {year}
                 qi income limit {year}
                 extra help income limits {year}
                 medicare savings program asset limits {year}
                 qmb vs slmb vs qi
  faq:           medicare savings program income limits {year} single
                 qmb income limit {year} single
                 qmb income limit {year} married
                 extra help income limits {year} married
                 do i qualify for extra help
  synonym:       medicare extra help, medicare savings program,
                 extra help calculator
  honest-edge:   "medicare savings program by state" -> synonym ONLY. We cover
                 10 launch states. The page must say so plainly and link every
                 other state to its Medicaid agency. No programmatic state pages.

CALCULATOR 3  /calculators/part-b-late-enrollment-penalty
  primary (H1):  part b late enrollment penalty calculator
  secondary H2:  how much is the part b penalty
                 part b penalty 10 year cost
                 part b penalty 20 year cost
                 how is the part b penalty calculated
                 can i avoid the part b penalty
  faq:           medicare part b penalty per month
                 part b special enrollment period 8 months
                 part b creditable coverage exemption
                 what is the part b penalty for {year}
  synonym:       part b penalty calculator, medicare late enrollment

CALCULATOR 4  /calculators/irmaa-cliff-checker
  primary (H1):  irmaa brackets {year}
  secondary H2:  irmaa brackets {year} married
                 irmaa brackets {year} married filing separately
                 what is the irmaa threshold for {year}
                 how close am i to the next irmaa bracket
                 irmaa part b surcharge {year}
                 irmaa part d surcharge {year}
                 irmaa two year lookback
                 medicare part b premium {year} married
  faq:           how much can you earn before irmaa
                 medicare part b premium calculator
                 cms part b premium {year}   (phrased as: "What is the Part B
                 premium for {year}, according to CMS?")
                 ssa irmaa chart             (phrased as: "Where is the SSA's
                 official IRMAA chart?", link to the source)
  synonym:       irmaa cliff checker, irmaa calculator
  (moved to guides, link out: "does irmaa apply to married filing separately"
   -> Guide 5)

CALCULATOR 5  /calculators/medicare-vs-aca
  primary (H1):  medicare vs aca
  secondary H2:  medicare 20 employee rule
                 should i take medicare or marketplace at 65
                 aca subsidies end when eligible for part a
                 no premium free part a what to do
                 working past 65
  faq:           medicare vs aca subsidies
  synonym:       medicare vs aca calculator
  (moved to guides, link out: "hsa and medicare 6 month rule" -> Guide 6;
   "when does medicare part a backdate" and "part a backdate 6 months" -> Guide 7)

-------------------------------------------------------------------------------
GUIDES (10, 1,200+ words each, one primary as H1, evergreen slugs)
Every guide must be original, explain a complicated rule in plain language with
numbers computed from /data, and link every factual claim to its official source.
G1  /guides/ssa-44-form-irmaa-appeal
    primary:   ssa 44 form irmaa appeal
    secondary: irmaa life changing event list | ssa 44 approved reasons
    faq:       ssa 44 form pdf  (link to the official SSA form; do NOT host a copy)
G2  /guides/how-to-lower-irmaa
    primary:   how to lower irmaa
    faq:       how much can you earn before irmaa (answer here; calculator 4 links here)
    NOTE: this replaces "how to avoid irmaa" as the primary (that phrase is not
    in the supplied list); use it as a synonym.
G3  /guides/roth-conversion-irmaa
    primary:   roth conversion irmaa
G4  /guides/what-income-counts-for-marketplace-subsidies
    primary:   what income is used for marketplace subsidies
    NOTE: replaces the old "irmaa brackets 2027" guide, which cannot ship until
    official 2027 figures exist and would collide with Calculator 4. Add a 2027
    update to Calculator 4 instead, once I paste the tables.
G5  /guides/irmaa-married-filing-separately
    primary:   does irmaa apply to married filing separately
G6  /guides/hsa-and-medicare-6-month-rule
    primary:   hsa and medicare 6 month rule
    secondary: can i contribute to an hsa after 65
G7  /guides/medicare-part-a-backdate
    primary:   when does medicare part a backdate
    secondary: part a backdate 6 months
    (the supplied duplicate "when does medicare part a backdate 6 months" is
     folded into this page, not a second page)
G8  /guides/400-fpl-subsidy-cliff
    primary:   400 fpl subsidy cliff {year}
    secondary: aca subsidy cliff extension {year}
    RULE: both phrases require a primary-source check (VERIFY) of the current
    subsidy law before ANY claim is written. State the status as of the
    verifiedOn date and link the source.
G9  /guides/part-d-out-of-pocket-cap
    primary:   part d out of pocket cap {year}
    secondary: part d out of pocket cap {year} amount
    (the supplied duplicate "medicare part d out of pocket cap 2026" is folded
     into this page as a synonym)
G10 /guides/family-glitch-fix-explained
    primary:   family glitch fix explained {year}
    link to Calculator 1 with natural anchor text.

-------------------------------------------------------------------------------
PARKED (build nothing in v1; revisit only if I approve a subsidy calculator)
  aca subsidy calculator | health insurance subsidy calculator |
  marketplace subsidy | aca subsidies | aca marketplace

TOPIC (broad head terms; no page targets them)
  medicare | medicare part a | medicare part b | medicare part d | irmaa |
  medicare advantage | medicare enrollment | medicare eligibility |
  medicare cost | medicare calculator (hub) | health insurance calculator
  Medicare Advantage is out of scope for v1. Do not write advisory content on it.

EXCLUDED (never on the site)
  "medicareclear vs"     -> invites a competitor comparison (hard rule).
  "best medicare calculator" -> an unprovable superlative claim.
  "free medicare calculator" is allowed ONLY as the home primary because it is
  literally true. Do not add "best", "top" or "#1" anywhere.
  "medicareclear calculator medicare.gov irmaa brackets" -> a mash-up of our
  brand with a government domain; implies affiliation. Never use.
  "medicare.gov extra help income limits" -> same reason; refer to the official
  page as a source link instead.
  Brand term "medicareclear" is used only as the site name, never as a keyword
  target in copy.

NAMING OFFICIAL SOURCES
  "cms", "ssa", "medicare.gov" appear only as source attributions ("according
  to CMS", "SSA's official chart"), never in headings that suggest we are the
  agency.

-------------------------------------------------------------------------------
8B. TECHNICAL AND ON-PAGE SEO
- Title and meta: see the title template in 8A. Meta description ~150 characters
  with the primary keyword and the benefit. Unique per page.
- Canonical URL, OG image, <html lang="en-US"> on every page.
- One H1, then H2, then H3; never skip levels.
- Data tables (IRMAA tiers, MSP limits) are plain HTML <table> with <caption>
  and <th scope>, never images.
- Descriptive internal-link anchors; every page reachable in 3 clicks.
- Visible "Last updated" plus dateModified/datePublished in schema.
- sitemap.ts with lastmod from /data, robots.ts, HTML sitemap page.
- All answer text, tables, FAQs, and schema are in the initial static HTML.
- Core Web Vitals per section 11. NO programmatic state pages in v1.

8C. AEO (answer engines, snippets, voice)
- ANSWER CAPSULE under every H1 on calculators and guides: 40-60 words, one
  self-contained answer with the primary keyword and the key number from /data.
- Every question H2 opens with a one-sentence direct answer (under 30 words).
- Six real FAQs per page, visible, 2-4 sentence answers; FAQPage JSON-LD matches
  the visible text exactly. Use the `faq` keywords from 8A first, then add real
  questions until there are six. Do not pad with questions nobody asks.
- Key facts table near the top; numbered steps for processes; short bullets for
  criteria; one worked example per page computed from /data.

8D. GEO (being cited by AI search and assistants)
- Every factual claim links to the official .gov source. State key facts as
  quotable standalone sentences (subject, number, year, source) computed from
  /data.
- Entity consistency: exact names "MedicareClear" and "Abdul Samad" and one
  description, defined once in /data/entities.ts and reused everywhere.
- Organization + Person JSON-LD with only real fields. `sameAs` ONLY from real
  socialProfiles I supply; omit if empty.
- Freshness: visible Last updated, dateModified, public change log, yearly
  update checklist.
- Unique value on every page: a computed result, cliff chart, action plan, or
  edge-case explanation that is not a copy of the government page.
- Clear scope statement on each page: topic, year, which filers.
- robots.txt: allow Googlebot, Bingbot and AI search/citation crawlers
  (OAI-SearchBot, ChatGPT-User, PerplexityBot, Claude-SearchBot, Claude-User).
  Training-crawler access (GPTBot, ClaudeBot, Google-Extended,
  Applebot-Extended) is one flag in /data/site.ts, default ALLOW; ask me to
  confirm. Check each vendor's current docs for exact names; list as VERIFY.
- Optional /llms.txt generated from /data (low priority, unproven; only content
  that is on the visible site).
- Bing Webmaster Tools + IndexNow: public key file and a post-deploy ping script
  (key placeholder until I supply it). Search Console / Bing verification meta
  placeholders in /data/site.ts; never ship empty tags.
- Never serve different content to bots and people.

8E. SCHEMA (only visible content)
- BreadcrumbList everywhere; WebApplication on calculators only; FAQPage where
  FAQs are visible; Article on guides (headline, dates, author Person,
  publisher Organization); Organization + WebSite sitewide; Person on author
  page. No HowTo, no Review/AggregateRating, no fake ratings.

8F. CHECK SCRIPTS
- verify:keywords: reads /data/keywords.ts and fails if
    a) a page lacks its primary in H1, title, meta, first 40 words (and slug
       where evergreen);
    b) any keyword is assigned to more than one page (cannibalization);
    c) a `secondary` keyword is not an H2/H3 on its page, or a `faq` keyword is
       not a visible FAQ question;
    d) any keyword is repeated more than 4 times in a page's body text;
    e) any `excluded` keyword appears anywhere in /app, /content or /data
       outside keywords.ts;
    f) a keyword string contains a literal year instead of {year}.
  `parked` and `topic` keywords are never checked for presence.
- verify:aeo: fails if a calculator or guide lacks an answer capsule of 40-60
  words, key facts table, six visible FAQs matching schema, source table, Last
  updated date, worked example, or valid JSON-LD.
- verify:features: fails if a flagship page lacks any item from section 2A
  (ActionPlan, deadline, take-home pack, what-changed strip, scenario compare,
  glossary tooltips, text-size control, report-an-error link).
- verify:log: fails if any formula in /lib/formulas has no matching entry in
  /docs/verification-log.md, or if an entry lacks a source URL, two worked
  examples, or a date.
- /docs/ai-visibility.md: a monthly checklist where I ask 20 target questions
  in ChatGPT, Perplexity, Gemini and Google AI Overviews and record whether
  MedicareClear is cited. Draw the 20 questions from the `faq` and `secondary`
  keywords. Claim no result without data.

================================================================================
9. MONETIZATION
================================================================================

- Ads stay OFF behind a feature flag until AdSense approves the site. Build the
  slots now: below the calculator, mid-article, end of FAQ.
- Reserved heights, lazy-loaded, labeled "Advertisement", never above the fold,
  never inside inputs, results, the answer capsule, or the action plan.
- Email capture after results ("Get the yearly update checklist").
- No Medicare lead-gen or "talk to an agent" CTA in v1 (CMS marketing and TCPA
  rules, and the owner is not a licensed US agent).
- Any affiliate link is clearly disclosed.
- Monetization never outranks usefulness (section 0A): no ad, form, or CTA may
  push the answer, the math, or the action plan out of reach.

================================================================================
10. ANALYTICS
================================================================================

Plausible. Track: calculator starts, completions, copy-result clicks, calendar
downloads, take-home pack opens, email signups, outbound clicks to official
sources. Never send entered income, assets, or other inputs.

================================================================================
11. PERFORMANCE (realistic targets)
================================================================================

Calculator pages WITHOUT ads: Lighthouse mobile perf >= 95, a11y 100, SEO 100,
CLS < 0.05, INP < 200ms, JS < 120KB. Pages WITH ads: CLS < 0.1, no layout
jumps. Report both separately. Lazy-load charts and the print view.

================================================================================
12. SCRIPTS (package.json)
================================================================================

dev, build ("npm run verify:data && next build"), start, lint, typecheck, test,
test:watch, format, verify (typecheck + test + lint + verify:data),
verify:data, verify:tokens, verify:emails (only ihsanaslamm@gmail.com),
verify:hardcode (no $ figures, years, or phone numbers outside /data),
verify:keywords (rules in 8F), verify:aeo, verify:features, verify:log
(rules in 8F), check:all (runs all).

================================================================================
13. PHASES (stop and report after each)
================================================================================

Phase 0: DONE once I reply OK to your plan. If I send corrections, update the
         plan and wait again.
Phase 1: Scaffold, tokens, fonts, layout, header/footer, dark + high-contrast
         modes, text-size control, trust components, seo components, action
         components, /data (including contacts.ts and prior-year figures),
         keywords.ts (loaded from the 8A map, all roles), entities.ts, all
         verify scripts, and /lib/formulas for all 5 flagships with passing
         tests AND a first pass of /docs/verification-log.md (two hand-worked
         official examples per formula, flagged VERIFY where I must paste the
         official table).
Phase 2: Calculator shell (live results, count-up, takeaway, show-the-math, URL
         state, copy, sticky mobile summary, ActionPlan, ICS download,
         take-home pack, scenario compare). Ship flagships 1 and 2
         (employer affordability, MSP by state).
Phase 3: Ship flagships 3, 4, 5 (Part B penalty, IRMAA, Medicare vs ACA).
Phase 4: Home page, calculators hub, glossary (60 terms with tooltips), and all
         section 7 pages with the real copy I paste.
Phase 5: 10 cornerstone guides (MDX, list in 8A), internal linking, schema,
         sitemap, OG images, robots.txt, llms.txt, IndexNow script, run verify
         scripts.
Phase 6: Consent banner, Plausible, ad slots behind the flag, a11y audit with
         screen reader notes, perf pass, /docs files, launch checklist (Search
         Console, Bing Webmaster, sitemap submission).

================================================================================
14. DEFINITION OF DONE
================================================================================

- The site is genuinely useful: a reader can get the number, the reason, and
  the next step without outside help (section 0A)
- Every calculation is verified against an official source and logged in
  /docs/verification-log.md; verify:log passes
- All content is original and explains complicated rules in plain language
- 5 flagships live, tested, sourced; each page's H1 is its primary keyword
- Every flagship has all 12 items from section 2A
- Every calculator and guide has an answer capsule, key facts table, six
  visible FAQs, worked example, source table, and Last updated date
- Every section 7 page live with real copy and no leftover placeholders
- Abdul Samad, Punjab, Pakistan, consistent on About, Contact, Privacy, Terms,
  author page, and schema
- check:all passes (including the keyword map: no duplicates, no excluded terms)
- Zero hardcoded years, dollar figures, or phone numbers outside /data
- Unique title, meta, canonical, OG image, and JSON-LD per page
- No competitor is named anywhere on the site
- No banned design patterns from section 3
- Ads off until approved; consent works; policies match what actually runs
- A 70-year-old can use every calculator on a phone without instructions

================================================================================
15. KICKOFF
================================================================================

Read this whole file, starting with section 0A: the goal is to build a genuinely
useful website, verify every calculation against official sources, and publish
original content that helps people make sense of complicated Medicare and ACA
rules. Reply with any corrections to your Phase 0 plan, list every conflict you
find (including any place where a rule in this file would work against that
goal), then wait for my OK before Phase 1. Do not write application code until
I reply OK.