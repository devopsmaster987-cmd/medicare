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
    if (seen.has(rawUrl)) errors.push(`sitemap.xml repeats a URL: ${rawUrl}`);
    seen.add(rawUrl);
    if (new URL(rawUrl).host !== expectedHost) {
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
