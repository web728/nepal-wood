import 'server-only';
import { readdir } from 'node:fs/promises';
import path from 'node:path';

/** Only browser-supported formats; SVG is deliberately excluded. */
const IMAGE_EXTENSIONS = new Set(['.jpg', '.jpeg', '.png', '.webp', '.avif', '.gif']);
const ROOT = path.join(process.cwd(), 'public', 'images');

import type { Shot, ShotTag } from './gallery-types';

function classify(file: string): ShotTag {
  const name = file.toLowerCase();
  if (/(seminar|stage|ribbon|ceremon|inaugurat|award|certificate|audience|speaker)/.test(name)) return 'Ceremonies & seminars';
  if (/(meeting|b2b|network|discussion|buyer|handshake)/.test(name)) return 'Meetings';
  if (/(machin|cnc|laser|cutter|router|saw|edge.?band|tool|drill)/.test(name)) return 'Machinery';
  if (/(plywood|laminat|veneer|panel|floor|door|material|interior|board|wood.?texture)/.test(name)) return 'Materials';
  return 'Show floor';
}

function makeAlt(file: string): string {
  const name = path.parse(file).name
    .replace(/[_-]+/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();
  // Neutral description: filenames alone cannot verify what an image depicts.
  return name ? `Nepal Wood Expo photo — ${name}` : 'Nepal Wood Expo gallery photo';
}

async function walk(dir: string, relative = ''): Promise<string[]> {
  let entries;
  try {
    entries = await readdir(dir, { withFileTypes: true });
  } catch (error) {
    if ((error as NodeJS.ErrnoException).code === 'ENOENT') return [];
    throw error;
  }
  const all = await Promise.all(entries.map(async (entry) => {
    // Never follow symlinks; only inspect actual directories and files.
    if (entry.name.startsWith('.')) return [];
    const child = path.join(dir, entry.name);
    const subpath = path.posix.join(relative, entry.name);
    if (entry.isDirectory()) return walk(child, subpath);
    if (entry.isFile() && IMAGE_EXTENSIONS.has(path.extname(entry.name).toLowerCase())) return [subpath];
    return [];
  }));
  return all.flat();
}

export async function getGallery(): Promise<Shot[]> {
  const files = await walk(ROOT);
  files.sort((a, b) => a.localeCompare(b, undefined, { numeric: true, sensitivity: 'base' }));
  return files.map((file) => ({
    src: `/images/${file.split('/').map(encodeURIComponent).join('/')}`,
    alt: makeAlt(file),
    tag: classify(file),
  }));
}
