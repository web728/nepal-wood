import 'server-only';
import { getDb, COLLECTIONS } from './db';
import { scheduleLeadDeliveries, initialDeliveries } from './lead-delivery';
import { shortCode, urlToken } from './ids';
import { event } from './site';
import type { ExhibitorInput, VisitorInput, EnquiryInput, BrochureInput } from './forms';

// Preserve existing exports for admin/directory integrations.
export { exhibitorRow, visitorRow, enquiryRow, brochureRow, sheetFor } from './lead-content';
export { syncToSheet } from './lead-delivery';

export type LeadMeta = {
  source?: string;
  medium?: string;
  campaign?: string;
  referrer?: string;
  page?: string;
  ip?: string;
  ua?: string;
};

// If after() cannot be scheduled, do NOT turn a successfully saved lead into a 500.
// The cron processor will still find its pending tasks in MongoDB.
function kick(...args: Parameters<typeof scheduleLeadDeliveries>): void {
  try { scheduleLeadDeliveries(...args); }
  catch (error) { console.error('[leads] post-response scheduling failed; cron will retry', error); }
}

const duplicateKey = (error: unknown) =>
  typeof error === 'object' && error !== null && 'code' in error && error.code === 11000;

export async function saveExhibitor(input: ExhibitorInput, meta: LeadMeta) {
  const db = await getDb();
  const col = db.collection(COLLECTIONS.exhibitors);
  for (let i = 0; i < 5; i++) {
    const doc = {
      ...input,
      ref: `EX-${shortCode(8)}`,
      status: 'new',
      notes: '',
      meta,
      createdAt: new Date(),
      deliveries: initialDeliveries(COLLECTIONS.exhibitors),
    };
    try {
      const { insertedId } = await col.insertOne(doc);
      kick(COLLECTIONS.exhibitors, insertedId);
      return { ref: doc.ref };
    } catch (error) {
      if (!duplicateKey(error)) throw error;
    }
  }
  throw new Error('Could not allocate exhibitor enquiry reference');
}

export async function saveVisitor(input: VisitorInput, meta: LeadMeta) {
  const db = await getDb();
  const col = db.collection(COLLECTIONS.visitors);
  const existing = await col.findOne({ email: input.email });
  if (existing) return {
    badgeId: existing.badgeId as string,
    token: existing.token as string,
    existing: true,
  };

  for (let attempt = 0; attempt < 5; attempt++) {
    const doc = {
      ...input,
      badgeId: `${event.badgePrefix}-${shortCode(8)}`,
      token: urlToken(),
      checkedInAt: null,
      meta,
      createdAt: new Date(),
      deliveries: initialDeliveries(COLLECTIONS.visitors),
    };
    try {
      const { insertedId } = await col.insertOne(doc);
      kick(COLLECTIONS.visitors, insertedId);
      return { badgeId: doc.badgeId, token: doc.token, existing: false };
    } catch (error) {
      if (!duplicateKey(error)) throw error;
      const duplicate = await col.findOne({ email: input.email });
      if (duplicate) return {
        badgeId: duplicate.badgeId as string,
        token: duplicate.token as string,
        existing: true,
      };
      // Rare badgeId/token collision: retry with fresh IDs.
    }
  }
  throw new Error('Could not allocate visitor badge');
}

export async function saveEnquiry(input: EnquiryInput, meta: LeadMeta) {
  const db = await getDb();
  const col = db.collection(COLLECTIONS.enquiries);
  for (let i = 0; i < 5; i++) {
    const doc = {
      ...input,
      ref: `EN-${shortCode(8)}`,
      status: 'new',
      meta,
      createdAt: new Date(),
      deliveries: initialDeliveries(COLLECTIONS.enquiries),
    };
    try {
      const { insertedId } = await col.insertOne(doc);
      kick(COLLECTIONS.enquiries, insertedId);
      return { ref: doc.ref };
    } catch (error) {
      if (!duplicateKey(error)) throw error;
    }
  }
  throw new Error('Could not allocate enquiry reference');
}

export async function saveBrochure(input: BrochureInput, meta: LeadMeta) {
  const db = await getDb();
  const col = db.collection(COLLECTIONS.brochure);
  for (let i = 0; i < 5; i++) {
    const doc = {
      ...input,
      ref: `BR-${shortCode(8)}`,
      meta,
      createdAt: new Date(),
      deliveries: initialDeliveries(COLLECTIONS.brochure),
    };
    try {
      const { insertedId } = await col.insertOne(doc);
      kick(COLLECTIONS.brochure, insertedId);
      return { ref: doc.ref };
    } catch (error) {
      if (!duplicateKey(error)) throw error;
    }
  }
  throw new Error('Could not allocate brochure reference');
}
