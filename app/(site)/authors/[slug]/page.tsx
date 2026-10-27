import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { Breadcrumbs } from '@/components/seo/breadcrumbs';
import { JsonLd } from '@/components/seo/json-ld';
import { LastUpdated } from '@/components/trust/last-updated';
import { author } from '@/data/entities';
import { site } from '@/data/site';
import { personSchema } from '@/lib/schema';

export const dynamicParams = false;

type AuthorPageProps = {
  params: Promise<{ slug: string }>;
};

export function generateStaticParams() {
  return [{ slug: author.slug }];
}

export async function generateMetadata({ params }: AuthorPageProps): Promise<Metadata> {
  const { slug } = await params;
  if (slug !== author.slug) return {};

  return {
    title: author.name,
    description: author.description,
    alternates: { canonical: `/authors/${author.slug}` },
    openGraph: {
      title: `${author.name} | ${site.siteName}`,
      description: author.description,
      url: `/authors/${author.slug}`,
      images: [
        {
          url: `/og/authors/${author.slug}.png`,
          width: 1200,
          height: 630,
          alt: author.name,
        },
      ],
    },
    twitter: {
      card: 'summary_large_image',
      images: [`/og/authors/${author.slug}.png`],
    },
  };
}

export default async function AuthorPage({ params }: AuthorPageProps) {
  const { slug } = await params;
  if (slug !== author.slug) notFound();

  return (
    <>
      <JsonLd data={personSchema()} />
      <div className="wrap">
        <Breadcrumbs
          items={[
            { name: 'Home', href: '/' },
            { name: author.name, href: `/authors/${author.slug}` },
          ]}
        />
      </div>

      <section className="page-hero">
        <div className="wrap">
          <p className="eyebrow">Author</p>
          <h1 className="page-title">{author.name}</h1>
          <p className="page-lede">{author.description}</p>
          <LastUpdated />
        </div>
      </section>

      <section className="section">
        <div className="wrap prose">
          <h2>About the publisher</h2>
          <p>
            {author.name} is an independent publisher based in {author.location}. The publisher
            researches US Medicare and ACA rules from official government sources and turns them
            into free calculators and plain-language explanations.
          </p>
          <p>
            The work is not affiliated with Medicare.gov, the Centers for Medicare &amp; Medicaid
            Services, the Social Security Administration, the Internal Revenue Service, or any state
            agency. The About page explains why the site exists, and the editorial policy explains how
            sources, corrections, and advertising are handled.
          </p>

          <h2>What the publisher makes</h2>
          <p>
            The calculators cover employer coverage affordability, Medicare Savings Programs, Part B
            late-enrollment penalties, IRMAA, and Medicare versus ACA decisions. Each tool shows its
            inputs, its result, its math, its official source, and the date the figure was checked.
          </p>
          <p>
            The writing aims to be useful before it is comprehensive. A page should help a reader
            understand a cost, a deadline, or the next official step without a sales call.
          </p>

          <h2>Contact</h2>
          <p>
            Questions, corrections, and source suggestions can be sent to{' '}
            <a href={`mailto:${site.contactEmail}`}>{site.contactEmail}</a>. Read the{' '}
            <Link href="/about">About page</Link>,{' '}
            <Link href="/editorial-policy">editorial policy</Link>, and{' '}
            <Link href="/methodology">methodology</Link> for more detail.
          </p>
        </div>
      </section>
    </>
  );
}
