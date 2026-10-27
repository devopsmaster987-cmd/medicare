import fs from 'node:fs';
import path from 'node:path';

export const root = process.cwd();

export const ignoredDirectories = new Set([
  'node_modules',
  '.next',
  'out',
  '.git',
  '.vercel',
]);

export function walkFiles(
  directory: string,
  extensions: readonly string[] = ['.ts', '.tsx', '.js', '.jsx', '.md', '.mdx', '.json', '.txt'],
): string[] {
  const absolute = path.isAbsolute(directory) ? directory : path.join(root, directory);
  if (!fs.existsSync(absolute)) return [];
  const files: string[] = [];
  for (const entry of fs.readdirSync(absolute, { withFileTypes: true })) {
    if (ignoredDirectories.has(entry.name)) continue;
    const full = path.join(absolute, entry.name);
    if (entry.isDirectory()) {
      files.push(...walkFiles(full, extensions));
    } else if (extensions.includes(path.extname(entry.name))) {
      files.push(full);
    }
  }
  return files;
}

export function relative(file: string): string {
  return path.relative(root, file).replaceAll('\\', '/');
}
