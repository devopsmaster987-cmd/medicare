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

const requiredFiles = ['robots.txt', 'sitemap.xml', 'ads.txt', 'llms.txt', '404.html'];
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
    if (!/<link[^>]+rel=["']canonical["']/i.test(html)) {
      errors.push(`${relative}: missing canonical link`);
    }
  }
}

const llmsPath = path.join(outDir, 'llms.txt');
if (fs.existsSync(llmsPath)) {
  const llms = fs.readFileSync(llmsPath, 'utf8');
  const llmsLinks = [...llms.matchAll(/\]\((https:\/\/[^)\s]+)\)/g)].map((match) => match[1]);
  for (const link of llmsLinks) {
    const parsed = new URL(link);
    if (parsed.host === new URL(site.siteUrl).host && parsed.pathname.length > 1 && !parsed.pathname.endsWith('/')) {
      errors.push(`llms.txt link is missing a trailing slash: ${link}`);
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
