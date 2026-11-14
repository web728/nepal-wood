import 'server-only';
import { MongoClient, type Db } from 'mongodb';

const uri = process.env.MONGODB_URI;
const dbName = process.env.MONGODB_DB || 'nepalwood';

type Cache = { client: MongoClient | null; promise: Promise<MongoClient> | null; indexed: boolean };
const g = globalThis as unknown as { __mongo?: Cache };
const cache: Cache = g.__mongo ?? (g.__mongo = { client: null, promise: null, indexed: false });

export const COLLECTIONS = {
  exhibitors: 'exhibitor_enquiries',
  visitors: 'visitor_registrations',
  enquiries: 'enquiries',
  brochure: 'brochure_leads',
  directory: 'exhibitor_directory',
  testimonials: 'testimonials',
} as const;



export const LEAD_COLLECTIONS = [
  COLLECTIONS.exhibitors,
  COLLECTIONS.visitors,
  COLLECTIONS.enquiries,
  COLLECTIONS.brochure,
] as const;

export type LeadCollection =
  (typeof LEAD_COLLECTIONS)[number];



export function dbConfigured() {
  return Boolean(uri);
}

export async function getDb(): Promise<Db> {
  if (!uri) throw new Error('MONGODB_URI is not set');
  if (!cache.promise) {
    cache.promise = new MongoClient(uri, { maxPoolSize: 10, serverSelectionTimeoutMS: 6000, appName: 'nepalwood-web' }).connect();
  }
  try {
    cache.client = await cache.promise;
  } catch (e) {
    cache.promise = null; // allow a retry on the next request
    throw e;
  }
  const db = cache.client.db(dbName);
  if (!cache.indexed) {
    cache.indexed = true;
    await Promise.all([
      db.collection(COLLECTIONS.visitors).createIndex({ email: 1 }, { unique: true }),
      db.collection(COLLECTIONS.visitors).createIndex({ badgeId: 1 }, { unique: true }),
      db.collection(COLLECTIONS.visitors).createIndex({ token: 1 }, { unique: true }),
      db.collection(COLLECTIONS.visitors).createIndex({ createdAt: -1 }),
      db.collection(COLLECTIONS.exhibitors).createIndex({ ref: 1 }, { unique: true }),
      db.collection(COLLECTIONS.exhibitors).createIndex({ createdAt: -1 }),
      db.collection(COLLECTIONS.enquiries).createIndex({ createdAt: -1 }),
      db.collection(COLLECTIONS.brochure).createIndex({ createdAt: -1 }),
      db.collection(COLLECTIONS.directory).createIndex({ company: 1 }),
    ]).catch((e) => console.error('[db] index creation failed', e));
  }
  return db;
}

 