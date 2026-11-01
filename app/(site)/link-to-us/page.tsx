import type { Metadata } from 'next';
import Link from 'next/link';
import { Breadcrumbs } from '@/components/seo/breadcrumbs';
import { JsonLd } from '@/components/seo/json-ld';
import { CopyText } from '@/components/trust/copy-text';
import { LastUpdated } from '@/components/trust/last-updated';
import { guides, resolveGuide } from '@/content/guides/meta';
import { site } from '@/data/site';
import { dataVerifiedOn, figureYears } from '@/data/verified';
import { webPageSchema } from '@/lib/schema';
import { formatDate } from '@/lib/utils';

export const metadata: Metadata = {
  title: 'Link to MedicareClear',
  description:
    'Link to MedicareClear with ready-to-use citation text, suggested anchor text, and the best pages to cite for Medicare and ACA questions.',
  alternates: { canonical: '/link-to-us/' },
  openGraph: {
    type: 'website',
    title: 'Link to MedicareClear',
    description:
      'Ready-to-use citation text, suggested anchor text, and the best MedicareClear pages to cite.',
    url: '/link-to-us/',
    images: [
      {
        url: '/og/link-to-us.png',
        width: 1200,
        height: 630,
        alt: 'Link to MedicareClear',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    images: ['/og/link-to-us.png'],
  },
};

const year = figureYears.current;

const calculatorLinks = [
  {
    href: '/calculators/irmaa-cliff-checker/',
    label: `IRMAA brackets ${year}`,
    note: 'Tier, surcharge, next cliff, and Roth-conversion headroom.',
  },
  {
    href: '/calculators/part-b-late-enrollment-penalty/',
    label: 'Part B late enrollment penalty',
    note: 'Monthly, annual, 10-year, and 20-year cost.',
  },
  {
    href: '/calculators/medicare-savings-program-extra-help/',
    label: `Medicare Savings Program income limits ${year}`,
    note: 'QMB, SLMB, QI, and Extra Help by household.',
  },
  {
    href: '/calculators/employer-coverage-affordability/',
    label: `Is employer health insurance affordable ${year}`,
    note: 'The self-only test, the family premium rule, and the marketplace effect.',
  },
  {
    href: '/calculators/medicare-vs-aca/',
    label: 'Medicare vs ACA',
    note: 'The 20-employee rule, premium-free Part A, and subsidy timing.',
  },
];

const cornerstoneGuides = guides.slice(0, 10);

const plainCitation = `${site.siteName}. "Link to MedicareClear." Figures checked ${formatDate(dataVerifiedOn)}. ${site.siteUrl}/link-to-us/`;

const htmlLink = `<a href="${site.siteUrl}/">${site.siteName}</a>`;

export default function LinkToUsPage() {
  return (
    <>
      <JsonLd
        data={webPageSchema({
          name: 'Link to MedicareClear',
          description:
            'Citation text, suggested anchor text, and the best MedicareClear pages to cite for Medicare and ACA questions.',
          path: '/link-to-us/',
          image: '/og/link-to-us.png',
          about: 'Citing and linking to MedicareClear',
          breadcrumb: [
            { name: 'Home', url: '/' },
            { name: 'Link to us', url: '/link-to-us/' },
          ],
        })}
      />
      <div className="wrap">
        <Breadcrumbs
          items={[
            { name: 'Home', href: '/' },
            { name: 'Link to us', href: '/link-to-us/' },
          ]}
        />
      </div>

      <section className="page-hero">
        <div className="wrap">
          <p className="eyebrow">For writers and resource pages</p>
          <h1 className="page-title">Link to MedicareClear</h1>
          <p className="page-lede">
            If you write about Medicare or ACA costs, you can link to the page that answers the
            question. Every page shows its figures, official sources, and the date they were
            checked.
          </p>
          <LastUpdated />
        </div>
      </section>

      <section className="section">
        <div className="wrap prose">
          <h2>A short description you can use</h2>
          <p>
            {site.siteName} publishes free Medicare and ACA calculators and plain-language guides.
            Each figure is stored with an official source link and a checked date. The site is
            independent and is not affiliated with Medicare.gov, CMS, SSA, or the IRS.
          </p>
          <CopyText
            text={`${site.siteName} publishes free Medicare and ACA calculators and plain-language guides. Each figure is stored with an official source link and a checked date. The site is independent and is not affiliated with Medicare.gov, CMS, SSA, or the IRS.`}
            label="Copy description"
          />

          <h2>Best pages to link to</h2>
          <p>
            A link to the specific page is more useful than a link to the home page. These pages
            answer a single question and show the math.
          </p>
          <div className="table-scroll">
            <table className="fact-table">
              <caption>Calculator pages that answer a specific question</caption>
              <thead>
                <tr>
                  <th scope="col">Page</th>
                  <th scope="col">What it answers</th>
                </tr>
              </thead>
              <tbody>
                {calculatorLinks.map((item) => (
                  <tr key={item.href}>
                    <th scope="row">
                      <Link href={item.href}>{item.label}</Link>
                    </th>
                    <td>{item.note}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <h2>Cornerstone guides</h2>
          <p>
            These guides explain the rule behind the calculator. They are written for readers who
            need the reasoning, not only the number.
          </p>
          <ul className="related-list">
            {cornerstoneGuides.map((guide) => (
              <li key={guide.slug}>
                <Link href={`/guides/${guide.slug}/`}>
                  {resolveGuide(guide.h1, figureYears.current)}
                </Link>
              </li>
            ))}
          </ul>

          <h2>Suggested citation</h2>
          <p>
            The checked date matters because Medicare and ACA figures change. Include it when you
            cite a page so readers can judge whether the figure is current.
          </p>
          <blockquote className="cite-text">
            <p>{plainCitation}</p>
          </blockquote>
          <CopyText text={plainCitation} label="Copy citation" />

          <h2>Plain HTML link</h2>
          <p>
            Use a normal link with anchor text that describes the destination. No special markup is
            needed.
          </p>
          <pre>
            <code>{htmlLink}</code>
          </pre>
          <CopyText text={htmlLink} label="Copy HTML link" />

          <h2>Suggested anchor text</h2>
          <ul>
            <li>{site.siteName}&rsquo;s IRMAA bracket checker</li>
            <li>{site.siteName}&rsquo;s Part B late enrollment penalty calculator</li>
            <li>{site.siteName}&rsquo;s Medicare Savings Program income limits</li>
            <li>{site.siteName}&rsquo;s employer coverage affordability test</li>
            <li>{site.siteName}&rsquo;s Medicare vs ACA decision guide</li>
          </ul>
          <p>
            Natural anchor text is better than repeating the same phrase everywhere. A link that
            tells the reader what is on the other side is the point.
          </p>

          <h2>What we ask</h2>
          <ul>
            <li>Link to the page that answers the question, not only to the home page.</li>
            <li>Keep the source links and the checked date visible when you quote a figure.</li>
            <li>Do not describe the site as a government agency or as a licensed US adviser.</li>
            <li>No payment, affiliate arrangement, or specific link attribute is required.</li>
          </ul>

          <h2>Media and research requests</h2>
          <p>
            For a press kit, a citable data file, or a comment on a Medicare or ACA rule, see the{' '}
            <Link href="/press/">press and media kit</Link> or the{' '}
            <Link href="/data/">data page</Link>. You can also email{' '}
            <a href={`mailto:${site.contactEmail}`}>{site.contactEmail}</a>.
          </p>
        </div>
      </section>
    </>
  );
}
