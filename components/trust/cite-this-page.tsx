import { site } from '@/data/site';
import { dataVerifiedOn } from '@/data/verified';
import { formatDate } from '@/lib/utils';

export function CiteThisPage({ title, path }: { title: string; path: string }) {
  const url = `${site.siteUrl}${path}`;
  return (
    <section className="section section-tight no-print" aria-labelledby="cite-title">
      <div className="wrap prose">
        <h2 id="cite-title">Cite this page</h2>
        <p>
          If you cite this page, use the reference below. It shows the date the figures were last
          checked so readers can judge whether they are current.
        </p>
        <blockquote className="cite-text">
          <p>
            {site.siteName}. &ldquo;{title}.&rdquo; Figures checked {formatDate(dataVerifiedOn)}.{' '}
            <a href={url}>{url}</a>
          </p>
        </blockquote>
      </div>
    </section>
  );
}
