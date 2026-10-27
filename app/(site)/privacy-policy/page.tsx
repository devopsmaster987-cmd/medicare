import type { Metadata } from 'next';
import Link from 'next/link';
import { LegalPage } from '@/components/site/legal-page';
import { site } from '@/data/site';

export const metadata: Metadata = {
  title: 'Privacy Policy',
  description:
    'How MedicareClear handles calculator inputs, local browser storage, contact messages, analytics, advertising, and privacy rights.',
  alternates: { canonical: '/privacy-policy' },
  openGraph: {
    title: 'Privacy Policy',
    description:
      'How MedicareClear handles calculator inputs, local browser storage, contact messages, analytics, advertising, and privacy rights.',
    url: '/privacy-policy',
    images: [
      {
        url: '/og/privacy-policy.png',
        width: 1200,
        height: 630,
        alt: 'MedicareClear privacy policy',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    images: ['/og/privacy-policy.png'],
  },
};

export default function PrivacyPolicyPage() {
  return (
    <LegalPage
      title="Privacy Policy"
      path="/privacy-policy"
      eyebrow="Privacy"
      lede="This policy explains what MedicareClear does with the information you type, the limited data a static site can receive, and the choices you have."
    >
      <p>
        MedicareClear is operated by {site.ownerName}, an independent publisher based in{' '}
        {site.location}. This policy applies to this website and its calculators.
      </p>

      <h2>Calculator inputs</h2>
      <p>
        The numbers you enter in a calculator stay in your browser. The site does not send income,
        assets, household size, work credits, or enrollment dates to a server. The calculator runs in
        your browser and does not require an account.
      </p>
      <p>
        A result link can store your inputs in the part of the web address after the hash mark. That
        part is not sent to the web server, but anyone who receives a link you copy or share may see
        the inputs encoded in it. Do not share a result link if it contains information you want to
        keep private.
      </p>

      <h2>Local browser storage</h2>
      <p>
        The site can remember your text-size and color-theme choices in your browser&apos;s local storage.
        These settings stay on your device and are not used to identify you. You can clear them
        through your browser settings.
      </p>

      <h2>Contact messages</h2>
      <p>
        If you email {site.contactEmail}, the message is handled by the email providers used by you
        and by the site owner. The message may be kept so the question can be answered and the
        correction can be reviewed.
      </p>
      <p>
        The contact form can use a form provider when one is configured. If no form provider is
        connected, the form opens a message in your own email app and does not send the content
        through the website. Do not send a Social Security number, Medicare number, medical records,
        or other sensitive details.
      </p>

      <h2>Analytics, advertising, and hosting</h2>
      <p>
        Analytics and advertising are currently off. The site is designed to use a cookieless
        analytics service and, after approval, advertising from Google AdSense. If those services are
        enabled, the privacy policy and cookie policy will be updated before they collect data, and
        consent controls will be used where the law requires them. A privacy choice is stored in
        local storage so the site can remember which optional categories you allowed.
      </p>
      <p>
        The site is hosted by a third-party hosting provider. Hosting providers can process technical
        data such as an IP address, browser type, requested page, and request time in routine server
        logs. Data may be processed in other countries through hosting, analytics, advertising, and
        email providers.
      </p>

      <h2>Cookies and advertising choices</h2>
      <p>
        The site does not currently set advertising or analytics cookies. If advertising is enabled,
        Google and its partners may use cookies or similar technologies to serve and measure ads. You
        can review Google&apos;s advertising choices at{' '}
        <a href="https://adssettings.google.com/" rel="noreferrer">
          adssettings.google.com
        </a>{' '}
        and opt out of participating companies at{' '}
        <a href="https://www.aboutads.info/" rel="noreferrer">
          aboutads.info
        </a>
        . Google&apos;s explanation of partner-site data is at{' '}
        <a href="https://policies.google.com/technologies/partner-sites" rel="noreferrer">
          policies.google.com/technologies/partner-sites
        </a>
        .
      </p>
      <p>
        Read the <Link href="/cookie-policy">cookie policy</Link> for the current settings.
      </p>

      <h2>Your privacy rights</h2>
      <p>
        Depending on where you live, you may have the right to access, correct, delete, or limit the
        use of personal information, and to object to certain processing. California residents may
        have rights under the CCPA/CPRA, including the right to know, delete, correct, and opt out of
        the sale or sharing of personal information. Visitors in the EEA, UK, or Switzerland may have
        rights under the GDPR or UK GDPR.
      </p>
      <p>
        MedicareClear does not sell personal information. To make a privacy request, email{' '}
        <a href={`mailto:${site.contactEmail}`}>{site.contactEmail}</a>. The request may need enough
        detail to identify the relevant message or record. A request will not be denied for
        exercising a privacy right.
      </p>

      <h2>Children&apos;s privacy</h2>
      <p>
        The site is intended for adults. It does not knowingly collect personal information from
        children under 13. If you believe a child sent personal information, contact the owner so it
        can be reviewed and removed.
      </p>

      <h2>Changes to this policy</h2>
      <p>
        The policy is updated when the site&apos;s data practices change. The date at the top of the page
        shows the latest review.
      </p>

      <h2>Contact</h2>
      <p>
        Questions about this policy can be sent to{' '}
        <a href={`mailto:${site.contactEmail}`}>{site.contactEmail}</a>. The mailing address is{' '}
        {site.mailingAddress}.
      </p>
    </LegalPage>
  );
}
