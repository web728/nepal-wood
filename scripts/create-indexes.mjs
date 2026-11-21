// Run once before deploying forms: node scripts/create-indexes.mjs
import { MongoClient } from 'mongodb';
const uri = process.env.MONGODB_URI;
if (!uri) throw new Error('Set MONGODB_URI before running this script');
const client = new MongoClient(uri, { serverSelectionTimeoutMS: 8000, appName: 'nepalwood-index-setup' });
try {
  await client.connect();
  const db = client.db(process.env.MONGODB_DB || 'nepalwood');
  await Promise.all([
    db.collection('visitor_registrations').createIndex({ email: 1 }, { unique: true }),
    db.collection('visitor_registrations').createIndex({ badgeId: 1 }, { unique: true }),
    db.collection('visitor_registrations').createIndex({ token: 1 }, { unique: true }),
    db.collection('visitor_registrations').createIndex({ createdAt: -1 }),
    db.collection('exhibitor_enquiries').createIndex({ ref: 1 }, { unique: true }),
    db.collection('enquiries').createIndex({ ref: 1 }, { unique: true }),
    db.collection('brochure_leads').createIndex({ ref: 1 }, { unique: true }),
    db.collection('exhibitor_enquiries').createIndex({ createdAt: -1 }),
    db.collection('enquiries').createIndex({ createdAt: -1 }),
    db.collection('brochure_leads').createIndex({ createdAt: -1 }),
    db.collection('exhibitor_directory').createIndex({ company: 1 }),
  ]);
  console.log('MongoDB indexes verified');
} finally {
  await client.close();
}
