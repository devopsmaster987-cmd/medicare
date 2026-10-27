import type { Metadata } from 'next';
import Link from 'next/link';
import { LegalPage } from '@/components/site/legal-page';
import { site } from '@/data/site';

export const metadata: Metadata = {
  title: 'Cookie Policy',
  description:
    'How MedicareClear uses cookies and local browser storage, and the current analytics, advertising, and email settings.',
  alternates: { canonical: '/cookie-policy' },
  openGraph: {
    title: 'Cookie Policy',
    description:
      'How MedicareClear uses cookies and local browser storage, and the current analytics, advertising, and email settings.',
    url: '/cookie-policy',
    images: [
      {
        url: '/og/cookie-policy.png',
        width: 1200,
        height: 630,
        alt: 'MedicareClear cookie policy',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    images: ['/og/cookie-policy.png'],
  },
};

const analyticsConnected = site.analytics.domain !== '';
const adsEnabled = site.features.ads;
const emailEnabled = site.features.emailCapture;

export default function CookiePolicyPage() {
  return (
    <LegalPage
      title="Cookie Policy"
      path="/cookie-policy"
      eyebrow="Cookies"
      lede="MedicareClear uses local browser storage for display preferences. It does not currently use advertising or analytics cookies."
    >
      <h2>What a cookie is</h2>
      <p>
        A cookie is a small file a site stores in your browser. Local storage is a similar browser
        feature that can remember a setting without sending it with every request. Both are controlled
        by your browser, and you can clear them through browser settings.
      </p>

      <h2>What this site stores</h2>
      <p>
        The site can store your text-size choice, color-theme choice, and privacy choice in local
        storage. These settings make the page easier to read on your next visit and remember what you
        allowed the site to load. They are not used to identify you, and calculator inputs are not
        sent to the site&apos;s server.
      </p>
      <p>
        A copied result link can contain calculator inputs after the hash mark. That part of the
        address stays in the browser and is not sent to the server, but anyone with the link can see
        it. Do not share a result link if it contains private information.
      </p>

      <h2 id="cookie-settings">Current cookie settings</h2>
      <ul>
        <li>Analytics: {analyticsConnected ? 'connected' : 'not connected'}.</li>
        <li>Advertising: {adsEnabled ? 'enabled' : 'off'}.</li>
        <li>Email capture: {emailEnabled ? 'enabled' : 'off'}.</li>
        <li>Required display preferences: local storage only.</li>
        <li>Privacy choice: stored in local storage on this browser.</li>
      </ul>
      <p>
        When optional analytics or advertising is enabled, a consent banner appears before those
        scripts load. You can accept all, reject optional services, or choose each category. Your
        choice is stored on this browser and can be changed with the Cookie settings link in the
        footer. Because optional analytics and advertising are off today, the banner does not appear
        automatically, and the Cookie settings link shows the current state.
      </p>

      <h2>If advertising is enabled</h2>
      <p>
        Advertising from Google AdSense can use cookies and similar technologies to serve, measure,
        and limit ads. Google&apos;s partner-site explanation is at{' '}
        <a href="https://policies.google.com/technologies/partner-sites" rel="noreferrer">
          policies.google.com/technologies/partner-sites
        </a>
        . You can manage Google ads at{' '}
        <a href="https://adssettings.google.com/" rel="noreferrer">
          adssettings.google.com
        </a>{' '}
        and opt out of participating companies at{' '}
        <a href="https://www.aboutads.info/" rel="noreferrer">
          aboutads.info
        </a>
        .
      </p>

      <h2>If analytics is enabled</h2>
      <p>
        The site is designed to use a cookieless analytics service that does not receive calculator
        inputs. Analytics would be used to understand which pages and actions are useful, not to
        identify a reader.
      </p>

      <h2>Your choices</h2>
      <p>
        You can block or clear cookies and local storage in your browser. Blocking display
        preferences may reset the text size or theme on your next visit, but it does not stop the
        calculators from working. Clearing the privacy choice makes the consent banner appear again
        when optional services are enabled.
      </p>

      <h2>More information</h2>
      <p>
        Read the <Link href="/privacy-policy">privacy policy</Link> for data practices and privacy
        rights. Questions can be sent to{' '}
        <a href={`mailto:${site.contactEmail}`}>{site.contactEmail}</a>.
      </p>
    </LegalPage>
  );
}
