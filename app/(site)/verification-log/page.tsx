import type { Metadata } from 'next';
import Link from 'next/link';
import { LegalPage } from '@/components/site/legal-page';
import { site } from '@/data/site';
import { verificationEntries } from '@/data/verification';
import { dataVerifiedOn } from '@/data/verified';
import { formatDate } from '@/lib/utils';

export const metadata: Metadata = {
  title: 'Verification log',
  description:
    'Hand-worked examples for every MedicareClear formula, with the official source, expected result, actual result, and the date checked.',
  alternates: { canonical: '/verification-log' },
  openGraph: {
    title: 'MedicareClear verification log',
    description:
      'Hand-worked examples for every MedicareClear formula, with the official source and the date checked.',
    url: '/verification-log',
    images: [
      {
        url: '/og/verification-log.png',
        width: 1200,
        height: 630,
        alt: 'MedicareClear verification log',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    images: ['/og/verification-log.png'],
  },
};

export default function VerificationLogPage() {
  return (
    <LegalPage
      title="Verification log"
      path="/verification-log"
      eyebrow="How we check the math"
      lede="Every formula is worked by hand against the official rule before it ships. This page shows the source, the expected result, the result the code produced, and the date checked."
    >
      <p>
        The log is a working record, not a claim that an agency has approved the site. Where an
        agency publishes a worked example, the entry follows it. Where no official worked example
        exists, the entry says so and shows the hand calculation from the published table or rule.
      </p>
      <p>
        The current data year is {dataVerifiedOn.slice(0, 4)}. Every entry below was last checked on{' '}
        <time dateTime={dataVerifiedOn}>{formatDate(dataVerifiedOn)}</time>. The{' '}
        <Link href="/methodology">methodology page</Link> explains the boundary tests and known
        limits.
      </p>

      <h2>What is in each entry</h2>
      <ul>
        <li>The formula name used in the code.</li>
        <li>The official source and any supporting source used for the rule.</li>
        <li>At least two hand-worked examples with the inputs, the arithmetic, and the expected result.</li>
        <li>The result the code actually produced.</li>
        <li>The date the example was checked.</li>
      </ul>

      {verificationEntries.map((entry) => (
        <section key={entry.formula} className="verification-entry" aria-labelledby={`verify-${entry.formula}`}>
          <h2 id={`verify-${entry.formula}`}>{entry.label}</h2>
          <p>
            Formula: <code>{entry.formula}</code>
          </p>
          <p>
            Primary source:{' '}
            <a href={entry.source} target="_blank" rel="noreferrer">
              {entry.sourceLabel}
            </a>
            . Checked on <time dateTime={entry.checkedOn}>{formatDate(entry.checkedOn)}</time>.
          </p>
          {entry.supporting && entry.supporting.length > 0 ? (
            <p>
              Supporting sources:{' '}
              {entry.supporting.map((source, index) => (
                <span key={source.url}>
                  <a href={source.url} target="_blank" rel="noreferrer">
                    {source.label}
                  </a>
                  {index < entry.supporting!.length - 1 ? '; ' : '.'}
                </span>
              ))}
            </p>
          ) : null}
          {entry.note ? <p className="stat-note">{entry.note}</p> : null}

          <div className="table-scroll">
            <table className="fact-table verification-table">
              <caption>{entry.label} hand-worked examples</caption>
              <thead>
                <tr>
                  <th scope="col">Example</th>
                  <th scope="col">Inputs</th>
                  <th scope="col">Hand check</th>
                  <th scope="col">Expected</th>
                  <th scope="col">Actual</th>
                </tr>
              </thead>
              <tbody>
                {entry.examples.map((example) => (
                  <tr key={example.label}>
                    <th scope="row">{example.label}</th>
                    <td>{example.inputs}</td>
                    <td>{example.handCheck}</td>
                    <td>{example.expected}</td>
                    <td>{example.actual}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>
      ))}

      <h2>What this log does not prove</h2>
      <p>
        A hand check can show that the code follows the published rule for the example inputs. It
        cannot decide your own case. An agency applies your full record, current state rules, and its
        own verification. A result can still differ because of a fact the calculator does not ask
        for, a state disregard, or a rule that changed after the checked date.
      </p>
      <p>
        Plan premiums, networks, formularies, and plan-specific cost sharing are not verified here
        because those figures are not in the data layer. The calculators say so where that limit
        matters.
      </p>

      <h2>Report a problem with an entry</h2>
      <p>
        If an entry is wrong or a source has changed, email{' '}
        <a href={`mailto:${site.contactEmail}`}>{site.contactEmail}</a> with the formula name, the
        example label, and the official source you used. The{' '}
        <Link href="/corrections">corrections page</Link> explains what happens next. The site owner
        usually replies in {site.responseTime}.
      </p>
    </LegalPage>
  );
}
