import type { Metadata } from 'next';
import Link from 'next/link';
import { LegalPage } from '@/components/site/legal-page';
import { site } from '@/data/site';
import { dataVerifiedOn } from '@/data/verified';
import { formatDate } from '@/lib/utils';

export const metadata: Metadata = {
  title: 'Corrections',
  description:
    'How to report a MedicareClear error, what to include, and the visible change log for corrections.',
  alternates: { canonical: '/corrections' },
  openGraph: {
    title: 'Corrections',
    description:
      'How to report a MedicareClear error, what to include, and the visible change log for corrections.',
    url: '/corrections',
    images: [
      {
        url: '/og/corrections.png',
        width: 1200,
        height: 630,
        alt: 'MedicareClear corrections',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    images: ['/og/corrections.png'],
  },
};

const changes = [
  {
    date: dataVerifiedOn,
    title: 'Calculator source review',
    detail:
      'Reviewed the current-year figures, source links, and worked examples for the five calculator pages.',
  },
  {
    date: dataVerifiedOn,
    title: 'Reference pages published',
    detail:
      'Published the glossary, owner and policy pages, and the human-readable sitemap. The source-linked calculators remain the primary tools.',
  },
];

export default function CorrectionsPage() {
  return (
    <LegalPage
      title="Corrections"
      path="/corrections"
      eyebrow="Corrections"
      lede="A correction is part of the product, not an exception. Report the page and the source, and the change is recorded here."
    >
      <h2>How to report an error</h2>
      <p>
        Email <a href={`mailto:${site.contactEmail}`}>{site.contactEmail}</a> with the page address
        and a short description of the problem. The owner usually replies in {site.responseTime}.
      </p>
      <p>Include these details when you can:</p>
      <ul>
        <li>The page address and the section or figure that looks wrong.</li>
        <li>The official source you used, with a link if possible.</li>
        <li>The result you expected and the result the page showed.</li>
        <li>The inputs you used, but only if you are comfortable sharing them. Do not send a Social Security number or medical record.</li>
        <li>A screenshot if the problem is visual or appears only on a phone.</li>
      </ul>

      <h2>What happens next</h2>
      <p>
        The owner checks the official source and the formula. If the page is wrong, the data, formula,
        or explanation is corrected, the checked date is updated when appropriate, and the change is
        added to this log. If the page is correct, the reply explains the rule and the source.
      </p>
      <p>
        A correction is not hidden by silently editing the page. The log records the date and a plain
        description of the change, without publishing private details from the report.
      </p>

      <h2>Change log</h2>
      <ol className="change-log">
        {changes.map((change) => (
          <li key={`${change.date}-${change.title}`}>
            <time dateTime={change.date}>{formatDate(change.date)}</time>
            <strong>{change.title}</strong>
            <p>{change.detail}</p>
          </li>
        ))}
      </ol>

      <h2>Other ways to check the site</h2>
      <p>
        The <Link href="/methodology">methodology</Link> explains the source and testing standard.
        The <Link href="/editorial-policy">editorial policy</Link> explains how corrections fit into
        publication. Every calculator also links to the official source used for its main figures.
      </p>
    </LegalPage>
  );
}
