import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { AdSlot } from '@/components/ads/ad-slot';
import { EmailCapture } from '@/components/calc/email-capture';
import { Breadcrumbs } from '@/components/seo/breadcrumbs';
import { JsonLd } from '@/components/seo/json-ld';
import { AuthorLine } from '@/components/trust/author-line';
import { CiteThisPage } from '@/components/trust/cite-this-page';
import { LastUpdated } from '@/components/trust/last-updated';
import { ReportError } from '@/components/trust/report-error';
import { guideBySlug, guideSlugs, resolveGuide } from '@/content/guides/meta';
import { guideContent } from '@/content/guides/registry';
import { site } from '@/data/site';
import { figureYears } from '@/data/verified';
import { articleSchema } from '@/lib/schema';

export const dynamicParams = false;

type GuidePageProps = {
  params: Promise<{ slug: string }>;
};

export function generateStaticParams() {
  return guideSlugs.map((slug) => ({ slug }));
}

export async function generateMetadata({ params }: GuidePageProps): Promise<Metadata> {
  const { slug } = await params;
  const guide = guideBySlug[slug];
  if (!guide) return {};

  const year = figureYears.current;
  const title = resolveGuide(guide.title, year);
  const description = resolveGuide(guide.description, year);

  return {
    title,
    description,
    alternates: { canonical: `/guides/${slug}` },
    openGraph: {
      title,
      description,
      url: `/guides/${slug}`,
      type: 'article',
      publishedTime: guide.publishedOn,
      modifiedTime: guide.updatedOn,
      authors: [site.ownerName],
      images: [
        {
          url: `/og/guides/${slug}.png`,
          width: 1200,
          height: 630,
          alt: title,
        },
      ],
    },
    twitter: {
      card: 'summary_large_image',
      images: [`/og/guides/${slug}.png`],
    },
  };
}

export default async function GuidePage({ params }: GuidePageProps) {
  const { slug } = await params;
  const guide = guideBySlug[slug];
  const Content = guideContent[slug];
  if (!guide || !Content) notFound();

  const year = figureYears.current;
  const h1 = resolveGuide(guide.h1, year);

  return (
    <>
      <JsonLd
        data={articleSchema({
          headline: h1,
          description: resolveGuide(guide.description, year),
          url: `${site.siteUrl}/guides/${slug}`,
          datePublished: guide.publishedOn,
          dateModified: guide.updatedOn,
        })}
      />

      <div className="wrap">
        <Breadcrumbs
          items={[
            { name: 'Home', href: '/' },
            { name: 'Guides', href: '/guides' },
            { name: h1, href: `/guides/${slug}` },
          ]}
        />
      </div>

      <section className="page-hero">
        <div className="wrap">
          <p className="eyebrow">Guide · {year}</p>
          <h1 className="page-title">{h1}</h1>
          <p className="page-lede">{guide.summary}</p>
          <LastUpdated />
          <AuthorLine />
        </div>
      </section>

      <section className="section section-tight">
        <div className="wrap prose">
          <Content />
        </div>
      </section>

      <section className="section section-tight">
        <div className="wrap">
          <AdSlot placement="end-faq" />
        </div>
      </section>

      <section className="section section-tight">
        <div className="wrap">
          <h2>Keep going</h2>
          <ul className="related-list">
            {guide.related.map((link) => (
              <li key={link.href}>
                <Link href={link.href}>{link.label}</Link>
              </li>
            ))}
          </ul>
          <p className="stat-note">
            <Link href="/guides">All Medicare and ACA guides</Link>
          </p>
        </div>
      </section>

      <section className="section section-tight">
        <div className="wrap">
          <CiteThisPage title={h1} path={`/guides/${slug}`} />
          <EmailCapture />
          <ReportError pageTitle={h1} />
          <LastUpdated label="Last updated" />
        </div>
      </section>
    </>
  );
}
