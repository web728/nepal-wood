import 'server-only';
import { MongoClient, type Db } from 'mongodb';

export const COLLECTIONS = {
  exhibitors: 'exhibitor_enquiries',
  visitors: 'visitor_registrations',
  enquiries: 'enquiries',
  brochure: 'brochure_leads',
  directory: 'exhibitor_directory',
  testimonials: 'testimonials',
} as const;
export const LEAD_COLLECTIONS = [
  COLLECTIONS.exhibitors, COLLECTIONS.visitors,
  COLLECTIONS.enquiries, COLLECTIONS.brochure,
] as const;
export type LeadCollection = (typeof LEAD_COLLECTIONS)[number];

type MongoCache = { promise: Promise<MongoClient> | null };
const globalCache = globalThis as typeof globalThis & { __nepalwoodMongo?: MongoCache };
const cache = globalCache.__nepalwoodMongo ??= { promise: null };

export function dbConfigured() { return Boolean(process.env.MONGODB_URI); }
export async function getDb(): Promise<Db> {
  const uri = process.env.MONGODB_URI;
  if (!uri) throw new Error('MONGODB_URI is not configured');
  if (!cache.promise) {
    cache.promise = new MongoClient(uri, {
      maxPoolSize: 10, minPoolSize: 0,
      serverSelectionTimeoutMS: 5000,
      connectTimeoutMS: 5000,
      appName: 'nepalwood-web',
    }).connect().catch((error) => { cache.promise = null; throw error; });
  }
  const client = await cache.promise;
  return client.db(process.env.MONGODB_DB || 'nepalwood');
}

/** Provision once using scripts/create-indexes.ts, not during submissions. */
export async function ensureLeadIndexes() {
  const db = await getDb();
  await Promise.all([
    db.collection(COLLECTIONS.visitors).createIndex({ email: 1 }, { unique: true }),
    db.collection(COLLECTIONS.visitors).createIndex({ badgeId: 1 }, { unique: true }),
    db.collection(COLLECTIONS.visitors).createIndex({ token: 1 }, { unique: true }),
    db.collection(COLLECTIONS.visitors).createIndex({ createdAt: -1 }),
    db.collection(COLLECTIONS.exhibitors).createIndex({ ref: 1 }, { unique: true }),
    db.collection(COLLECTIONS.enquiries).createIndex({ ref: 1 }, { unique: true }),
    db.collection(COLLECTIONS.brochure).createIndex({ ref: 1 }, { unique: true }),
    db.collection(COLLECTIONS.exhibitors).createIndex({ createdAt: -1 }),
    db.collection(COLLECTIONS.enquiries).createIndex({ createdAt: -1 }),
    db.collection(COLLECTIONS.brochure).createIndex({ createdAt: -1 }),
    db.collection(COLLECTIONS.directory).createIndex({ company: 1 }),
  ]);
}
