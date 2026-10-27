'use client';

import { site } from '@/data/site';
import { trackEvent } from '@/lib/analytics';

export function EmailCapture() {
  if (!site.features.emailCapture || !site.integrations.buttondownUser) return null;

  return (
    <section className="email-capture no-print" aria-labelledby="email-capture-title">
      <h2 id="email-capture-title">Get the annual update</h2>
      <p>
        One short email when the official limits change. No plan sales, no lead sharing, and no
        advice about your personal situation.
      </p>
      <form
        action={`https://buttondown.email/api/emails/embed-subscribe/${site.integrations.buttondownUser}`}
        method="post"
        target="_blank"
        rel="noreferrer"
        onSubmit={() => trackEvent('email_signup', { page: window.location.pathname })}
      >
        <label htmlFor="email-capture-address">Email address</label>
        <div className="email-row">
          <input id="email-capture-address" type="email" name="email" required autoComplete="email" />
          <button type="submit" className="button button-secondary">
            Send me the update
          </button>
        </div>
      </form>
      <p className="field-hint">
        You can unsubscribe from any email. Read the privacy policy for how the list is handled.
      </p>
    </section>
  );
}
