import fs from 'node:fs';
import path from 'node:path';
import { site } from '../data/site';

const outDir = path.resolve('out');
const errors: string[] = [];

if (!fs.existsSync(outDir)) {
  console.log('verify:indexing skipped: out/ not found (run the build first)');
  process.exit(0);
}

function read(relativePath: string): string {
  return fs.readFileSync(path.join(outDir, relativePath), 'utf8');
}

function exists(relativePath: string): boolean {
  return fs.existsSync(path.join(outDir, relativePath));
}

function urlToFile(rawUrl: string): string | null {
  let parsed: URL;
  try {
    parsed = new URL(rawUrl);
  } catch {
    return null;
  }
  const decoded = decodeURIComponent(parsed.pathname);
  const relative = decoded.replace(/^\/+/, '');
  if (relative === '') return 'index.html';
  if (relative.endsWith('/')) return path.posix.join(relative, 'index.html');
  if (path.posix.extname(relative)) return relative;
  return path.posix.join(relative, 'index.html');
}

const requiredFiles = [
  'robots.txt',
  'sitemap.xml',
  'ads.txt',
  'llms.txt',
  'feed.xml',
  'manifest.webmanifest',
  '404.html',
];
for (const file of requiredFiles) {
  if (!exists(file)) errors.push(`missing out/${file}`);
}

const robotsPath = path.join(outDir, 'robots.txt');
if (fs.existsSync(robotsPath)) {
  const robots = fs.readFileSync(robotsPath, 'utf8');
  if (!robots.toLowerCase().includes(`sitemap: ${site.siteUrl.toLowerCase()}/sitemap.xml`)) {
    errors.push('robots.txt does not reference the canonical sitemap URL');
  }
  if (!/user-agent:\s*googlebot/i.test(robots)) {
    errors.push('robots.txt does not list Googlebot explicitly');
  }
  if (!/disallow:\s*\/cdn-cgi\//i.test(robots)) {
    errors.push('robots.txt does not disallow the Cloudflare /cdn-cgi/ email-protection path');
  }
}

const vercelPath = path.resolve('vercel.json');
if (fs.existsSync(vercelPath)) {
  let vercel: {
    trailingSlash?: boolean;
    redirects?: Array<{ source?: string; destination?: string; permanent?: boolean }>;
    headers?: Array<{ source?: string; headers?: Array<{ key?: string; value?: string }> }>;
  } = {};
  try {
    vercel = JSON.parse(fs.readFileSync(vercelPath, 'utf8'));
  } catch {
    errors.push('vercel.json is not valid JSON');
  }
  if (vercel.trailingSlash !== true) {
    errors.push('vercel.json does not set trailingSlash: true');
  }
  const abdulRedirect = (vercel.redirects ?? []).find((redirect) =>
    (redirect.source ?? '').includes('/authors/abdul-samad'),
  );
  if (!abdulRedirect || !(abdulRedirect.destination ?? '').includes('/authors/daniel-smith/')) {
    errors.push('vercel.json is missing the /authors/abdul-samad/ -> /authors/daniel-smith/ redirect');
  }
  for (const file of ['/feed.xml', '/sitemap.xml']) {
    const rule = (vercel.headers ?? []).find((header) => header.source === file);
    const hasNoindex = (rule?.headers ?? []).some(
      (header) =>
        header.key?.toLowerCase() === 'x-robots-tag' &&
        (header.value ?? '').toLowerCase().includes('noindex'),
    );
    if (!hasNoindex) errors.push(`vercel.json is missing X-Robots-Tag: noindex for ${file}`);
  }
}

const sitemapPath = path.join(outDir, 'sitemap.xml');
let sitemapUrls: string[] = [];
if (fs.existsSync(sitemapPath)) {
  const sitemap = fs.readFileSync(sitemapPath, 'utf8');
  if (!sitemap.startsWith('<?xml')) {
    errors.push('sitemap.xml is missing the <?xml?> declaration');
  }
  if (!/<urlset\s[^>]*xmlns=["']http:\/\/www\.sitemaps\.org\/schemas\/sitemap\/0\.9["']/.test(sitemap)) {
    errors.push('sitemap.xml does not use the 0.9 urlset namespace');
  }
  sitemapUrls = [...sitemap.matchAll(/<loc>([^<]+)<\/loc>/g)].map((match) => match[1].trim());
  if (sitemapUrls.length === 0) errors.push('sitemap.xml contains no URLs');

  const expectedHost = new URL(site.siteUrl).host;
  const seen = new Set<string>();
  for (const rawUrl of sitemapUrls) {
    const relative = urlToFile(rawUrl);
    if (!relative) {
      errors.push(`sitemap.xml has an invalid URL: ${rawUrl}`);
      continue;
    }
    const parsed = new URL(rawUrl);
    if (parsed.pathname.length > 1 && !parsed.pathname.endsWith('/')) {
      errors.push(`sitemap.xml URL is missing a trailing slash: ${rawUrl}`);
    }
    if (seen.has(rawUrl)) errors.push(`sitemap.xml repeats a URL: ${rawUrl}`);
    seen.add(rawUrl);
    if (parsed.host !== expectedHost) {
      errors.push(`sitemap.xml uses a different host: ${rawUrl}`);
      continue;
    }
    if (!exists(relative)) {
      errors.push(`sitemap.xml lists a page with no exported HTML: ${rawUrl}`);
      continue;
    }
    const html = read(relative);
    const canonical = html.match(/<link[^>]+rel=["']canonical["'][^>]*href=["']([^"']+)["']/i)?.[1];
    if (!canonical) {
      errors.push(`${relative}: missing canonical link`);
    } else if (canonical !== rawUrl) {
      errors.push(`${relative}: canonical ${canonical} does not match sitemap URL ${rawUrl}`);
    }
    const ogUrl = html.match(/<meta[^>]+property=["']og:url["'][^>]*content=["']([^"']+)["']/i)?.[1];
    if (!ogUrl) {
      errors.push(`${relative}: missing og:url meta tag`);
    } else if (ogUrl !== rawUrl) {
      errors.push(`${relative}: og:url ${ogUrl} does not match sitemap URL ${rawUrl}`);
    }
  }
}

const llmsPath = path.join(outDir, 'llms.txt');
if (fs.existsSync(llmsPath)) {
  const llms = fs.readFileSync(llmsPath, 'utf8');
  const llmsLinks = [...llms.matchAll(/\]\((https:\/\/[^)\s]+)\)/g)].map((match) => match[1]);
  for (const link of llmsLinks) {
    const parsed = new URL(link);
    const isFileLink = path.posix.extname(parsed.pathname) !== '';
    if (
      !isFileLink &&
      parsed.host === new URL(site.siteUrl).host &&
      parsed.pathname.length > 1 &&
      !parsed.pathname.endsWith('/')
    ) {
      errors.push(`llms.txt link is missing a trailing slash: ${link}`);
    }
    if (parsed.host === new URL(site.siteUrl).host) {
      const relative = decodeURIComponent(parsed.pathname).replace(/^\/+/, '');
      const target = relative === '' ? 'index.html' : path.posix.join(relative, isFileLink ? '' : 'index.html');
      if (!exists(target)) {
        errors.push(`llms.txt links to a file that was not exported: ${link}`);
      }
    }
  }
}

const htmlFiles: string[] = [];
function walk(directory: string): void {
  for (const entry of fs.readdirSync(directory, { withFileTypes: true })) {
    const absolute = path.join(directory, entry.name);
    if (entry.isDirectory()) walk(absolute);
    else if (entry.name.endsWith('.html')) htmlFiles.push(absolute);
  }
}
walk(outDir);

for (const file of htmlFiles) {
  const relative = path.relative(outDir, file).replace(/\\/g, '/');
  if (relative === '404.html' || relative === '404/index.html') continue;
  const html = fs.readFileSync(file, 'utf8');
  if (/<meta[^>]+name=["']robots["'][^>]*content=["'][^"']*noindex/i.test(html)) {
    errors.push(`${relative}: noindex meta tag found`);
  }
}

if (errors.length > 0) {
  console.error('verify:indexing failed');
  for (const error of errors) console.error(`  - ${error}`);
  process.exit(1);
}

console.log(
  `verify:indexing passed (${sitemapUrls.length} sitemap URLs, ${htmlFiles.length} HTML files checkable)`,
);
