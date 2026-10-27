# Analytics and consent

## What runs today

- Analytics provider: Plausible, cookieless, loaded only when `site.analytics.domain` is set.
- Advertising: off. `site.features.ads` is `false`, so every `AdSlot` returns `null`.
- Consent banner: built, but it opens automatically only when an optional service is configured
  (`site.analytics.domain !== ''` or `site.features.ads === true`).
- Consent state: `localStorage` key `medicareclear-consent-v1`, one object with `analytics`,
  `advertising`, and `decidedAt`.
- Google Consent Mode v2 defaults are injected only when consent is required. The stored choice
  updates `ad_storage`, `ad_user_data`, `ad_personalization`, and `analytics_storage`.
- The footer "Cookie settings" control reopens the banner at any time. It also links to the cookie
  policy when JavaScript is unavailable.

## Events

Events are sent only when analytics is configured, analytics consent is granted, and the Plausible
function is available. Props are limited to a page path, a calculator path, or an outbound hostname.
No income, assets, state, filing status, or result amounts are sent. URL hashes are not sent.

| Event | When | Props |
| --- | --- | --- |
| `calculator_start` | First `input` or `change` inside `.calculator-shell` | `calculator` |
| `calculator_complete` | First non-null result for the visit | `calculator` |
| `copy_result` | Result copied successfully | `page` |
| `calendar_download` | ICS reminder download | `page` |
| `take_home_pack` | Print view opened | `page` |
| `email_signup` | Email form submitted | `page` |
| `outbound_click` | Link to another hostname | `domain` |

The outbound listener records only the hostname, never the full URL or query string.

## Consent behavior

1. With no optional service configured, no banner appears on load.
2. When a service is configured and no choice is stored, the banner appears before the script loads.
3. "Accept all" grants the configured categories. "Reject optional" denies both. "Save choices"
   stores the checkboxes exactly as shown.
4. Analytics loads on grant. Advertising loads only on grant, only when the publisher ID and slot ID
   are present, and only when the slot is near the viewport.
5. Revoking a category stops new events and hides ad markup. Scripts already downloaded cannot be
   unloaded by the browser; the next page load does not request them.

## Before enabling analytics

1. Set `site.analytics.domain` to the production hostname (without `https://`).
2. Confirm the Plausible site exists and the domain matches exactly.
3. Load the site, accept analytics, and confirm a pageview in Plausible.
4. Reject analytics in a private window and confirm no request to `plausible.io`.
5. Update the privacy and cookie pages if the provider or data flow changes.

## Before enabling ads

1. Enable `site.features.ads`.
2. Set `site.integrations.adsensePublisherId` and `site.integrations.adsenseSlotId`.
3. Replace the placeholder line in `public/ads.txt` with the approved publisher ID.
4. Configure a Google-certified CMP for EEA, UK, and Switzerland traffic in AdSense. The in-house
   banner is a consent interface, not a certified CMP, so it is not sufficient for those regions by
   itself.
5. Verify that ads never appear above the fold, inside inputs, results, the answer capsule, or the
   action plan. The current placements are below the calculator, mid-article, and after the FAQ.
6. Test accept, reject, and reopen on mobile before submitting the site for review.

## Known limits

- Plausible's script is loaded from `plausible.io`; a future self-hosted instance would require a
  script URL change.
- The email form posts directly to Buttondown in a new tab. The submit event is recorded before the
  browser leaves the page, but a popup blocker can prevent the signup itself.
- Consent Mode is initialized only when a service is configured. With everything off, no Google
  script and no consent-mode stub is shipped.
