import { guides, resolveGuide } from '@/content/guides/meta';
import { site } from '@/data/site';
import { dataVerifiedOn, figureYears } from '@/data/verified';

export const dynamic = 'force-static';

function escapeXml(value: string): string {
  return value
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;')
    .replaceAll("'", '&apos;');
}

function rfcDate(isoDate: string): string {
  return new Date(`${isoDate}T00:00:00Z`).toUTCString();
}

export function GET(): Response {
  const base = site.siteUrl.replace(/\/+$/, '');
  const year = figureYears.current;
  const sorted = [...guides].sort((a, b) => b.updatedOn.localeCompare(a.updatedOn));

  const items = sorted
    .map((guide) => {
      const url = `${base}/guides/${guide.slug}/`;
      const title = resolveGuide(guide.h1, year);
      const description = resolveGuide(guide.description, year);
      return [
        '    <item>',
        `      <title>${escapeXml(title)}</title>`,
        `      <link>${url}</link>`,
        `      <guid isPermaLink="true">${url}</guid>`,
        `      <pubDate>${rfcDate(guide.publishedOn)}</pubDate>`,
        `      <description>${escapeXml(description)}</description>`,
        '    </item>',
      ].join('\n');
    })
    .join('\n');

  const xml = [
    '<?xml version="1.0" encoding="UTF-8"?>',
    '<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">',
    '  <channel>',
    `    <title>${escapeXml(site.siteName)} guides</title>`,
    `    <link>${base}/guides/</link>`,
    `    <atom:link href="${base}/feed.xml" rel="self" type="application/rss+xml" />`,
    '    <description>Plain-language Medicare and ACA guides with dated official sources.</description>',
    '    <language>en-us</language>',
    `    <lastBuildDate>${rfcDate(dataVerifiedOn)}</lastBuildDate>`,
    '    <generator>MedicareClear</generator>',
    items,
    '  </channel>',
    '</rss>',
    '',
  ].join('\n');

  return new Response(xml, {
    headers: {
      'Content-Type': 'application/rss+xml; charset=utf-8',
      'Cache-Control': 'public, max-age=3600',
    },
  });
}
