import type { Metadata } from 'next';
import Link from 'next/link';
import { LegalPage } from '@/components/site/legal-page';
import { site } from '@/data/site';

export const metadata: Metadata = {
  title: 'Terms of Service',
  description:
    'The terms that apply when you use MedicareClear calculators, guides, and other pages.',
  alternates: { canonical: '/terms-of-service/' },
  openGraph: {
    title: 'Terms of Service',
    description:
      'The terms that apply when you use MedicareClear calculators, guides, and other pages.',
    url: '/terms-of-service/',
    images: [
      {
        url: '/og/terms-of-service.png',
        width: 1200,
        height: 630,
        alt: 'MedicareClear terms of service',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    images: ['/og/terms-of-service.png'],
  },
};

export default function TermsPage() {
  return (
    <LegalPage
      title="Terms of Service"
      path="/terms-of-service/"
      eyebrow="Terms"
      lede="These terms explain the basis for using MedicareClear. By using the site, you agree to them."
    >
      <p>
        MedicareClear is operated by {site.ownerName} in {site.location}. The site provides free
        calculators, explanations, and links to official sources about US Medicare and ACA rules.
      </p>

      <h2>General information, not advice</h2>
      <p>
        The site provides general information and estimates. It is not legal, tax, medical, or
        insurance advice, and it does not create a professional relationship. A calculator result is
        not an official eligibility determination, a plan quote, or a promise of coverage.
      </p>
      <p>
        Rules change, state programs differ, and your own facts may fall outside the assumptions used
        by a calculator. Check the official source linked on the page and confirm the result with the
        agency or plan before you act.
      </p>

      <h2>Acceptable use</h2>
      <ul>
        <li>Use the site for lawful, personal, or internal business research.</li>
        <li>Do not attempt to disrupt the site, bypass security, or access it with automated tools in a way that harms service.</li>
        <li>Do not copy the site in a way that removes attribution or misrepresents the source.</li>
        <li>Do not use the site to send unlawful, misleading, or harmful material.</li>
      </ul>

      <h2>Intellectual property</h2>
      <p>
        The site&apos;s original text, design, and calculator code are owned by {site.ownerName} or used
        with permission. Government publications and other third-party materials remain subject to
        their own terms. You may link to the site and quote a short passage with attribution, but you
        may not republish a substantial part of it as your own.
      </p>

      <h2>Third-party links and services</h2>
      <p>
        The site links to government agencies and may use third-party hosting, form, analytics, or
        advertising services. Those services are controlled by their own operators and governed by
        their own terms and privacy policies. MedicareClear is not responsible for a third-party
        site&apos;s content or availability.
      </p>

      <h2>No warranty</h2>
      <p>
        The site is provided as is and as available. To the extent permitted by law, MedicareClear
        makes no warranty that the site will be uninterrupted, error-free, or complete, or that a
        result will fit a particular situation. Nothing in these terms limits a right that cannot be
        limited by law.
      </p>

      <h2>Limitation of liability</h2>
      <p>
        To the extent permitted by law, {site.ownerName} and MedicareClear are not liable for a loss
        that results from reliance on general information, a calculator estimate, a third-party link,
        or an interruption of the site. This does not apply where liability cannot legally be
        excluded.
      </p>

      <h2>Changes and governing law</h2>
      <p>
        The site and these terms may change. The date at the top of the page shows the latest review.
        These terms are governed by the laws of {site.governingLaw}, without regard to conflict-of-law
        rules. Any dispute will be handled in a court with jurisdiction in that location, subject to
        any mandatory consumer protection that applies.
      </p>

      <h2>Contact</h2>
      <p>
        Questions about these terms can be sent to{' '}
        <a href={`mailto:${site.contactEmail}`}>{site.contactEmail}</a>. Read the{' '}
        <Link href="/disclaimer/">disclaimer</Link> and{' '}
        <Link href="/privacy-policy/">privacy policy</Link> for more detail.
      </p>
    </LegalPage>
  );
}
