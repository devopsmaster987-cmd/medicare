import type { Metadata } from 'next';
import Link from 'next/link';
import { LegalPage } from '@/components/site/legal-page';
import { site } from '@/data/site';

export const metadata: Metadata = {
  title: 'Editorial Policy',
  description:
    'How MedicareClear chooses topics, checks official sources, handles corrections, and keeps advertising away from editorial decisions.',
  alternates: { canonical: '/editorial-policy/' },
  openGraph: {
    title: 'Editorial Policy',
    description:
      'How MedicareClear chooses topics, checks official sources, handles corrections, and keeps advertising away from editorial decisions.',
    url: '/editorial-policy/',
    images: [
      {
        url: '/og/editorial-policy.png',
        width: 1200,
        height: 630,
        alt: 'MedicareClear editorial policy',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    images: ['/og/editorial-policy.png'],
  },
};

export default function EditorialPolicyPage() {
  return (
    <LegalPage
      title="Editorial Policy"
      path="/editorial-policy/"
      eyebrow="Editorial"
      lede="The editorial rule is simple: publish what helps a reader decide or act, and show the official source behind every figure."
    >
      <h2>What gets published</h2>
      <p>
        A page is added when it answers a real question about Medicare or ACA costs, enrollment, or
        eligibility. The useful unit is a decision: whether a premium is affordable, which savings
        program may apply, what a delay costs, which income year sets a surcharge, or whether to keep
        Marketplace coverage.
      </p>
      <p>
        Pages are not added to inflate volume, rankings, or ad inventory. A topic that would only
        repeat a government page, or that cannot be checked against an official source, does not
        belong here.
      </p>

      <h2>Original explanation, not recycled copy</h2>
      <p>
        Content is written in plain language and adds something the source page does not: a computed
        result, a boundary example, a decision path, a deadline worked out from the reader&apos;s own
        dates, or an explanation of an edge case. Government sources are linked so the reader can
        check the rule.
      </p>
      <p>
        The site does not copy another publisher&apos;s article or present a paraphrase as original work.
        Short quotations from an official source are attributed.
      </p>

      <h2>Source and update standard</h2>
      <p>
        Every figure in the data layer has a year, an official source link, and a checked date. A
        formula is not published until it has worked examples in the verification log. When a rule
        varies by state or depends on a fact the calculator does not collect, the page says so.
      </p>
      <p>
        The owner reviews the source links and the annual update checklist. A page can be corrected
        between annual updates when a source changes or a reader reports a problem.
      </p>

      <h2>Independence and advertising</h2>
      <p>
        Advertising is kept separate from editorial decisions. An advertiser cannot buy a place in a
        calculator result, a source table, an action plan, or a ranking. The site does not sell
        insurance, rank carriers, or accept payment for a favorable review.
      </p>
      <p>
        Sponsored content is not part of the site. If that changes, the sponsorship will be labeled
        clearly and kept out of the calculators.
      </p>

      <h2>Corrections</h2>
      <p>
        A factual error is corrected when it is confirmed. The correction process is described on the{' '}
        <Link href="/corrections/">corrections page</Link>, including what to send and how the change
        log works. A correction is not hidden by silently editing the page.
      </p>

      <h2>Owner responsibility</h2>
      <p>
        {site.ownerName} is responsible for what is published on {site.siteName}. The site does not
        claim credentials, licenses, or experience that have not been supplied. The About page states
        the owner&apos;s location and role plainly.
      </p>

      <h2>Contact</h2>
      <p>
        Editorial questions and corrections can be sent to{' '}
        <a href={`mailto:${site.contactEmail}`}>{site.contactEmail}</a>. Read the{' '}
        <Link href="/methodology/">methodology</Link> for the source and testing standard in more
        detail.
      </p>
    </LegalPage>
  );
}
