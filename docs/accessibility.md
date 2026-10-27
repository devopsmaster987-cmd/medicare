# Accessibility audit

Standard: WCAG 2.2 AA. Scope: home, calculator, guide, hub, glossary, policy, and author pages.
Tooling: Lighthouse 13.5, mobile emulation, Chrome headless, against the static export served
locally. Code review covered the header, calculator fields, result actions, FAQ disclosures, footer,
and consent banner. The keyboard checklist and screen reader scripts below are written but still
need a run on real hardware before launch.

## Results

| Page | Accessibility | SEO | Notes |
| --- | --- | --- | --- |
| IRMAA calculator | 100 | 100 | CLS 0, target-size and name checks pass |
| Roth conversion guide | 100 | 100 | CLS 0 |
| Home | 100 | 100 | landmarks, headings, and links pass |

Lighthouse reported no remaining accessibility violations after the fixes below. The audit does not
replace a manual screen reader pass.

## Fixes applied in this phase

1. The header brand link had `aria-label="MedicareClear home"`, which hid the visible "MC" mark from
   the accessible name. The label was removed; the link now exposes its visible text.
2. Text-size buttons exposed "A+", "A++", and "A" visibly but named themselves only "Use large text
   size". Names now include the visible abbreviation: "A+ large text size", "A++ extra-large text
   size", "A default text size".
3. Theme buttons had the same mismatch. Names now include "L", "D", and "HC".
4. The "Report an error" link was 22.4 px tall and failed the 24 px target rule. `.trust-line a` now
   has a 24 px minimum height.
5. The cookie banner uses labeled checkboxes, a heading, a description, plain buttons, and no
   auto-focus. It appears only when a choice is needed or the footer control opens it.
6. Ad slots are labeled "Advertisement" once, reserve their height, and stay out of the answer
   capsule, results, inputs, and action plan.

## Contrast check

Computed with the WCAG relative-luminance formula on the shipped tokens.

| Pair | Ratio | Result |
| --- | --- | --- |
| Light body ink on page | 13.41:1 | Pass |
| Light soft ink on page | 6.51:1 | Pass |
| Light soft ink on surface | 7.20:1 | Pass |
| Light primary on page | 8.37:1 | Pass |
| Light on-primary on primary | 9.25:1 | Pass |
| Light footer muted on footer | 6.91:1 | Pass |
| Dark body ink on page | 16.21:1 | Pass |
| Dark soft ink on page | 10.88:1 | Pass |
| Dark primary on page | 10.55:1 | Pass |
| Dark footer muted on footer | 8.23:1 | Pass |
| Contrast theme ink on page | 21.00:1 | Pass |
| Contrast theme soft ink on page | 17.40:1 | Pass |
| Notice text on notice background | 8.02:1 | Pass |
| Dark notice text on dark notice | 10.14:1 | Pass |

The accent color is used for decorative rules, dots, and error text on a light surface (4.87:1).
It is not used for normal-size text on the page background.

## Keyboard checklist

1. Tab from the address bar: "Skip to content" appears first and moves focus to `#main`.
2. Header: brand, five navigation links, three text-size buttons, three theme buttons. All show the
   focus ring.
3. Calculator: every input has a visible label; radio groups use a fieldset and legend; errors are
   announced through the existing live region.
4. Result actions: copy, calendar, print, take-home pack, and report link are reachable in order.
5. FAQ: each summary opens with Enter or Space; answers are visible when open.
6. Footer: all policy links and "Cookie settings" are reachable; the banner's buttons are reachable
   without a mouse.
7. The banner does not trap focus. It is a region, not a modal, so the rest of the page stays usable.

## Screen reader notes

### VoiceOver (macOS, Safari)

1. Open the home page and press `VO + U`, then Headings. Confirm one H1, then the section headings in
   reading order. The "MC" mark should be read as part of the brand link, not as a separate label.
2. Go to the IRMAA calculator. Press `VO + Cmd + H` to move by headings. Confirm "Check your IRMAA
   tier" is a heading and "Your result" follows the inputs.
3. Tab to the filing-status select. VoiceOver should announce the label, the current value, and the
   hint that separate filers have their own table.
4. Change the income field. The result region should update without moving focus. The verdict text
   is a live region; confirm it is announced once, not on every keystroke.
5. Tab to "Copy my results" and activate it. Confirm the status message "Results and page link
   copied" is announced.
6. Open a guide. Use `VO + U` and Links to confirm internal links use descriptive text. Open the
   source table with the table rotor; confirm each row reads the figure, value, and source.
7. Footer: open "Cookie settings". Confirm the heading, description, two checkboxes with names and
   states, and the three buttons. Choose "Reject optional" and confirm the banner closes.

### NVDA (Windows, Chrome)

1. Press `H` to walk headings on the calculator. Confirm the H1 is the page title and the result
   heading is not skipped.
2. Press `F` for form fields. Each field should announce its label, type, and hint. Confirm the
   currency fields do not read the dollar sign as a separate control.
3. Press `B` for buttons. Confirm "A+ large text size", "A++ extra-large text size", and the theme
   buttons include their visible abbreviations.
4. Trigger a validation error by clearing a required field. Confirm the error text is announced and
   linked to the field.
5. On a guide, press `T` for tables. Confirm the caption is announced and the row headers are read
   before the value.
6. Open the consent banner from the footer. Press `Space` on each checkbox, then "Save choices".
   Reopen and confirm the states persisted.
7. With the ad flag enabled in a test build, navigate to a reserved slot. Confirm it is announced as
   "Advertisement" once and does not interrupt the result or action plan.

## Remaining manual work

- Run the VoiceOver and NVDA scripts on real hardware and record the results in this file.
- Test at 200% browser zoom and 320 px width; the header controls and consent banner must not overlap.
- Re-run Lighthouse after ads are enabled and confirm target sizes inside ad iframes are not part of
  the page's own controls.
- Confirm the consent banner's checkboxes and buttons meet the 24 px target rule on iOS Safari.
