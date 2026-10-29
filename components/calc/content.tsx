import type { ReactNode } from 'react';
import Link from 'next/link';
import { dataVerifiedOn } from '@/data/verified';
import { formatDate } from '@/lib/utils';
import { JsonLd } from '@/components/seo/json-ld';
import { faqSchema } from '@/lib/schema';

export function AnswerCapsule({ children }: { children: ReactNode }) {
  return (
    <div className="answer-capsule" id="answer-capsule">
      {children}
    </div>
  );
}

export function KeyFacts({
  caption = 'Key facts',
  rows,
}: {
  caption?: string;
  rows: Array<{ label: string; value: string; note?: string }>;
}) {
  return (
    <div className="key-facts">
      <table className="fact-table">
        <caption className="sr-only">{caption}</caption>
        <tbody>
          {rows.map((row) => (
            <tr key={row.label}>
              <th scope="row">{row.label}</th>
              <td>
                <strong>{row.value}</strong>
                {row.note ? <span className="fact-note">{row.note}</span> : null}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export function WhatChanged({
  year,
  priorYear,
  rows,
}: {
  year: number;
  priorYear: number;
  rows: Array<{ label: string; prior: string; current: string; note?: string }>;
}) {
  return (
    <section className="what-changed" aria-labelledby="what-changed-title">
      <h2 id="what-changed-title">
        What changed for {year} compared with {priorYear}
      </h2>
      <div className="table-scroll">
        <table className="fact-table">
          <thead>
            <tr>
              <th scope="col">Rule</th>
              <th scope="col">{priorYear}</th>
              <th scope="col">{year}</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((row) => (
              <tr key={row.label}>
                <th scope="row">
                  {row.label}
                  {row.note ? <span className="fact-note">{row.note}</span> : null}
                </th>
                <td>{row.prior}</td>
                <td>
                  <strong>{row.current}</strong>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <p className="stat-note">
        <Link href={`/what-changed-${year}`}>See every figure that changed for {year}</Link>
      </p>
    </section>
  );
}

export function SourceTable({
  rows,
}: {
  rows: Array<{
    label: string;
    value: string;
    source: string;
    sourceLabel: string;
    checkedOn?: string;
  }>;
}) {
  return (
    <section className="source-table" aria-labelledby="source-table-title">
      <h2 id="source-table-title">Source table</h2>
      <div className="table-scroll">
        <table className="fact-table">
          <thead>
            <tr>
              <th scope="col">Figure</th>
              <th scope="col">Value used</th>
              <th scope="col">Official source</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((row) => {
              const checkedOn = row.checkedOn ?? dataVerifiedOn;
              return (
                <tr key={row.label}>
                  <th scope="row">{row.label}</th>
                  <td>{row.value}</td>
                  <td>
                    <a href={row.source} target="_blank" rel="noreferrer">
                      {row.sourceLabel}
                    </a>
                    <span className="fact-note">
                      Checked <time dateTime={checkedOn}>{formatDate(checkedOn)}</time>
                    </span>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
      <p className="stat-note">
        <Link href="/verification-log/">See the hand-worked examples in the verification log</Link>
      </p>
    </section>
  );
}

export function Faq({ items }: { items: Array<{ question: string; answer: string }> }) {
  return (
    <section className="faq" aria-labelledby="faq-title">
      <h2 id="faq-title">Frequently asked questions</h2>
      <div className="faq-list">
        {items.map((item) => (
          <div className="faq-item" key={item.question}>
            <h3>{item.question}</h3>
            <p>{item.answer}</p>
          </div>
        ))}
      </div>
      <JsonLd data={faqSchema(items)} />
    </section>
  );
}
