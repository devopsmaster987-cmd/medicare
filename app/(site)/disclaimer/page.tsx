import type { Metadata } from 'next';
import Link from 'next/link';
import { LegalPage } from '@/components/site/legal-page';
import { site } from '@/data/site';

export const metadata: Metadata = {
  title: 'Disclaimer',
  description:
    'MedicareClear provides general information and estimates. It is not affiliated with any government agency and does not provide professional advice.',
  alternates: { canonical: '/disclaimer' },
  openGraph: {
    title: 'Disclaimer',
    description:
      'MedicareClear provides general information and estimates. It is not affiliated with any government agency and does not provide professional advice.',
    url: '/disclaimer',
    images: [
      {
        url: '/og/disclaimer.png',
        width: 1200,
        height: 630,
        alt: 'MedicareClear disclaimer',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    images: ['/og/disclaimer.png'],
  },
};

export default function DisclaimerPage() {
  return (
    <LegalPage
      title="Disclaimer"
      path="/disclaimer"
      eyebrow="Disclaimer"
      lede="MedicareClear is an independent information site. A calculator result is an estimate, not an official decision or professional advice."
    >
      <h2>No government affiliation</h2>
      <p>
        {site.siteName} is not affiliated with Medicare.gov, the Centers for Medicare &amp; Medicaid
        Services, the Social Security Administration, the Internal Revenue Service, any state
        Medicaid agency, or any other government office. References to an agency are source
        attributions, not claims of endorsement or partnership.
      </p>

      <h2>Not professional advice</h2>
      <p>
        The content is general information about Medicare and ACA rules. It is not legal, tax,
        medical, or insurance advice. It does not account for every fact in your situation, and it
        does not create a professional relationship. For advice about your own case, contact a
        qualified professional or the agency that handles your enrollment, claim, or application.
      </p>

      <h2>Estimates and official sources</h2>
      <p>
        Calculators use a dated data layer and show the official source for the main figures. Even
        so, a result can differ from an official determination because of state rules, plan details,
        income timing, family circumstances, or a rule change. The official source linked on the page
        controls over a summary or estimate here.
      </p>

      <h2>No plan recommendation</h2>
      <p>
        MedicareClear does not sell insurance, rank carriers, or recommend a specific plan. It does
        not claim that one coverage choice is right for every reader. Compare plan documents and
        confirm costs with the plan or a free counseling service before enrolling.
      </p>

      <h2>External links</h2>
      <p>
        Links to government and third-party sites are provided so you can check a rule or continue an
        application. Those sites are outside MedicareClear&apos;s control and may change without notice.
      </p>

      <h2>Report a problem</h2>
      <p>
        If a page is wrong or unclear, email{' '}
        <a href={`mailto:${site.contactEmail}`}>{site.contactEmail}</a>. The{' '}
        <Link href="/corrections">corrections page</Link> explains what to include. Read the{' '}
        <Link href="/terms-of-service">terms of service</Link> and{' '}
        <Link href="/privacy-policy">privacy policy</Link> for more detail.
      </p>
    </LegalPage>
  );
}
