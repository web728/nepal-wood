import { readdir } from 'node:fs/promises';
import path from 'node:path';

export type NewsImage = {
  id: string;
  src: string;
  title: string;
  category: string;
};

const NEWS_DIR = path.join(process.cwd(), 'public', 'news');
const IMAGE_EXTENSIONS = new Set(['.jpg', '.jpeg', '.png', '.webp', '.avif', '.gif']);

function displayName(value: string): string {
  const name = value
    .replace(/\.[^.]+$/, '')
    .replace(/[_-]+/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();

  if (!name) return 'News photograph';
  return name.replace(/\b\p{L}/gu, (letter) => letter.toUpperCase());
}

async function collectFiles(dir: string, base = ''): Promise<string[]> {
  const entries = await readdir(dir, { withFileTypes: true });
  const batches = await Promise.all(entries.map(async (entry) => {
    if (entry.name.startsWith('.')) return [];
    const relative = path.posix.join(base, entry.name);
    const absolute = path.join(dir, entry.name);

    if (entry.isDirectory()) return collectFiles(absolute, relative);
    if (entry.isFile() && IMAGE_EXTENSIONS.has(path.extname(entry.name).toLowerCase())) {
      return [relative];
    }
    return []; // Ignore symlinks and non-image files.
  }));
  return batches.flat();
}

export async function getNewsImages(): Promise<NewsImage[]> {
  let files: string[];
  try {
    files = await collectFiles(NEWS_DIR);
  } catch (error) {
    if ((error as NodeJS.ErrnoException).code === 'ENOENT') return [];
    throw error;
  }

  return files
    .sort((a, b) => a.localeCompare(b, 'en', { numeric: true, sensitivity: 'base' }))
    .map((relative) => {
      const segments = relative.split('/');
      const filename = segments.at(-1) ?? relative;
      return {
        id: relative,
        src: `/news/${segments.map(encodeURIComponent).join('/')}`,
        title: displayName(filename),
        category: segments.length > 1 ? displayName(segments[0]) : 'News photos',
      };
    });
}
