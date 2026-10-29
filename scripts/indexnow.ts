import { guides } from '../content/guides/meta';
import { site } from '../data/site';

const key = site.integrations.indexNowKey;
const host = site.siteUrl.replace(/^https?:\/\//, '').replace(/\/$/, '');

const routes = [
  '/',
  '/calculators/',
  '/calculators/employer-coverage-affordability/',
  '/calculators/medicare-savings-program-extra-help/',
  '/calculators/part-b-late-enrollment-penalty/',
  '/calculators/irmaa-cliff-checker/',
  '/calculators/medicare-vs-aca/',
  '/guides/',
  ...guides.map((guide) => `/guides/${guide.slug}/`),
  '/glossary/',
  '/about/',
  '/contact/',
  '/methodology/',
  '/editorial-policy/',
  '/corrections/',
  '/sitemap-page/',
];

if (!key) {
  console.log('indexnow skipped: site.integrations.indexNowKey is empty');
  process.exit(0);
}

if (site.siteUrlIsPlaceholder) {
  console.log('indexnow skipped: site.siteUrl is a placeholder');
  process.exit(0);
}

const urlList = routes.map((route) => `${site.siteUrl}${route}`);

const response = await fetch('https://api.indexnow.org/indexnow', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json; charset=utf-8' },
  body: JSON.stringify({
    host,
    key,
    keyLocation: `${site.siteUrl}/${key}.txt`,
    urlList,
  }),
});

if (!response.ok) {
  console.error(`indexnow failed: ${response.status} ${response.statusText}`);
  process.exit(1);
}

console.log(`indexnow submitted ${urlList.length} URLs`);
