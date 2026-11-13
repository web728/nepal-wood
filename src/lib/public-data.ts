import 'server-only';
import { getDb, COLLECTIONS, dbConfigured } from './db';

export type Testimonial = { _id: string; quote: string; name: string; role?: string; company?: string; edition?: string };
export type DirectoryEntry = { _id: string; company: string; country: string; city?: string; zones: string[]; stand?: string; website?: string; description?: string; logo?: string };

// Public reads never break a page: if the database is unreachable they return an empty list.
async function safe<T>(fn: () => Promise<T>, fallback: T): Promise<T> {
  if (!dbConfigured()) return fallback;
  try {
    return await fn();
  } catch (e) {
    console.error('[public-data]', e instanceof Error ? e.message : e);
    return fallback;
  }
}

export function getTestimonials(limit = 12) {
  return safe(async () => {
    const db = await getDb();
    const rows = await db.collection(COLLECTIONS.testimonials).find({ published: true }).sort({ order: 1, createdAt: -1 }).limit(limit).toArray();
    return rows.map((r) => ({ _id: String(r._id), quote: r.quote, name: r.name, role: r.role, company: r.company, edition: r.edition })) as Testimonial[];
  }, [] as Testimonial[]);
}

export function getDirectory() {
  return safe(async () => {
    const db = await getDb();
    const rows = await db.collection(COLLECTIONS.directory).find({ published: true }).sort({ company: 1 }).toArray();
    return rows.map((r) => ({ _id: String(r._id), company: r.company, country: r.country, city: r.city, zones: r.zones || [], stand: r.stand, website: r.website, description: r.description, logo: r.logo })) as DirectoryEntry[];
  }, [] as DirectoryEntry[]);
}
