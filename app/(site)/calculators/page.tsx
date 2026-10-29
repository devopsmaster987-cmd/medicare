import type { Metadata } from 'next';
import Link from 'next/link';
import { TakeHomePack } from '@/components/action/take-home-pack';
import { Breadcrumbs } from '@/components/seo/breadcrumbs';
import { AuthorLine } from '@/components/trust/author-line';
import { LastUpdated } from '@/components/trust/last-updated';

export const metadata: Metadata = {
  title: 'Medicare Calculator',
  description:
    "MedicareClear's Medicare calculator hub covers employer affordability, Medicare Savings Programs, Part B penalties, IRMAA, and Medicare vs ACA decisions.",
  alternates: { canonical: '/calculators/' },
  openGraph: {
    title: 'Medicare Calculator',
    description:
      "MedicareClear's Medicare calculator hub covers employer affordability, Medicare Savings Programs, Part B penalties, IRMAA, and Medicare vs ACA decisions.",
    url: '/calculators/',
    images: [
      {
        url: '/og/calculators.png',
        width: 1200,
        height: 630,
        alt: 'MedicareClear calculator hub',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    images: ['/og/calculators.png'],
  },
};

const tools = [
  {
    title: 'Employer coverage affordability',
    href: '/calculators/employer-coverage-affordability/',
    copy: 'Test the employee-only premium against the IRS affordability percentage and the family glitch rule.',
  },
  {
    title: 'Medicare Savings Program and Extra Help',
    href: '/calculators/medicare-savings-program-extra-help/',
    copy: 'Check the federal QMB, SLMB, QI, and Extra Help income and resource limits for your household.',
  },
  {
    title: 'Part B late enrollment penalty',
    href: '/calculators/part-b-late-enrollment-penalty/',
    copy: 'Estimate the monthly penalty, annual cost, and the 10-year and 20-year totals.',
  },
  {
    title: 'IRMAA cliff checker',
    href: '/calculators/irmaa-cliff-checker/',
    copy: 'Find the current bracket, the monthly surcharge, and the room before the next threshold.',
  },
  {
    title: 'Medicare vs ACA',
    href: '/calculators/medicare-vs-aca/',
    copy: 'Compare the 20-employee rule, premium-free Part A, Marketplace subsidies, and enrollment timing.',
  },
];

export default function CalculatorsPage() {
  return (
    <>
      <div className="wrap">
        <Breadcrumbs
          items={[
            { name: 'Home', href: '/' },
            { name: 'Calculators', href: '/calculators/' },
          ]}
        />
      </div>
      <section className="page-hero">
        <div className="wrap">
          <p className="eyebrow">Calculator hub</p>
          <h1 className="page-title">Medicare calculator</h1>
          <p className="page-lede">
            Use this Medicare calculator hub to choose the decision you need to make. Each tool
            uses the same dated data layer, shows its official source, and keeps the result in plain
            language.
          </p>
          <LastUpdated />
          <AuthorLine />
        </div>
      </section>

      <section className="section">
        <div className="wrap">
          <ol className="calculator-index">
            {tools.map((tool, index) => (
              <li key={tool.title}>
                <Link className="calculator-entry" href={tool.href}>
                  <span className="calculator-entry-number" aria-hidden="true">
                    {String(index + 1).padStart(2, '0')}
                  </span>
                  <div className="calculator-entry-body">
                    <h2 className="calculator-entry-title">{tool.title}</h2>
                    <span className="calculator-entry-detail">{tool.copy}</span>
                  </div>
                  <span className="calculator-entry-action" aria-hidden="true">
                    Open
                  </span>
                </Link>
              </li>
            ))}
          </ol>
          <p className="notice">
            All five calculator screens are live. Each one uses the same dated data layer, shows its
            official source, and keeps the next step in plain language.
          </p>
          <p className="stat-note">
            <Link href="/#sources">See the official sources used by every calculator</Link>
          </p>
          <TakeHomePack pageTitle="Medicare calculator" />
        </div>
      </section>
    </>
  );
}
