import 'server-only';
import { getDb, COLLECTIONS } from './db';
import { initialDeliveries, scheduleLeadDeliveries } from './lead-delivery';
import { shortCode, urlToken } from './ids';
import { event } from './site';
import type { ExhibitorInput, VisitorInput, EnquiryInput, BrochureInput } from './forms';

export { exhibitorRow, visitorRow, enquiryRow, brochureRow, sheetFor } from './lead-content';
export { syncToSheet } from './lead-delivery';
export type LeadMeta = {
  source?: string; medium?: string; campaign?: string; referrer?: string;
  page?: string; ip?: string; ua?: string;
};

function duplicateKey(error: unknown): boolean {
  return typeof error === 'object' && error !== null && 'code' in error && error.code === 11000;
}
function kick(...args: Parameters<typeof scheduleLeadDeliveries>) {
  try { scheduleLeadDeliveries(...args); }
  catch (err) { console.error('[leads] delivery scheduling failed; cron should retry', err); }
}

export async function saveExhibitor(input: ExhibitorInput, meta: LeadMeta) {
  const col = (await getDb()).collection(COLLECTIONS.exhibitors);
  for (let attempt = 0; attempt < 5; attempt++) {
    const doc = { ...input, ref: `EX-${shortCode(8)}`, status: 'new', notes: '',
      meta, createdAt: new Date(), deliveries: initialDeliveries(COLLECTIONS.exhibitors) };
    try {
      const { insertedId } = await col.insertOne(doc);
      kick(COLLECTIONS.exhibitors, insertedId);
      return { ref: doc.ref };
    } catch (error) { if (!duplicateKey(error)) throw error; }
  }
  throw new Error('Could not allocate exhibitor reference');
}

export async function saveVisitor(input: VisitorInput, meta: LeadMeta) {
  const col = (await getDb()).collection(COLLECTIONS.visitors);
  // CRITICAL: never return an existing badge token based solely on an email entered in a form.
  // Use email OTP / expiring verification link before releasing an existing badge.
  if (await col.findOne({ email: input.email }, { projection: { _id: 1 } })) {
    return { existing: true as const, token: null, badgeId: null };
  }
  for (let attempt = 0; attempt < 5; attempt++) {
    const doc = { ...input, badgeId: `${event.badgePrefix}-${shortCode(8)}`,
      token: urlToken(), checkedInAt: null, meta, createdAt: new Date(),
      deliveries: initialDeliveries(COLLECTIONS.visitors) };
    try {
      const { insertedId } = await col.insertOne(doc);
      kick(COLLECTIONS.visitors, insertedId);
      return { existing: false as const, badgeId: doc.badgeId, token: doc.token };
    } catch (error) {
      if (!duplicateKey(error)) throw error;
      if (await col.findOne({ email: input.email }, { projection: { _id: 1 } })) {
        return { existing: true as const, badgeId: null, token: null };
      }
      // Badge code/token collision: retry with newly generated values.
    }
  }
  throw new Error('Could not allocate visitor badge');
}

export async function saveEnquiry(input: EnquiryInput, meta: LeadMeta) {
  const col = (await getDb()).collection(COLLECTIONS.enquiries);
  for (let attempt = 0; attempt < 5; attempt++) {
    const doc = { ...input, ref: `EN-${shortCode(8)}`, status: 'new', meta,
      createdAt: new Date(), deliveries: initialDeliveries(COLLECTIONS.enquiries) };
    try {
      const { insertedId } = await col.insertOne(doc);
      kick(COLLECTIONS.enquiries, insertedId);
      return { ref: doc.ref };
    } catch (error) { if (!duplicateKey(error)) throw error; }
  }
  throw new Error('Could not allocate enquiry reference');
}

export async function saveBrochure(input: BrochureInput, meta: LeadMeta) {
  const col = (await getDb()).collection(COLLECTIONS.brochure);
  for (let attempt = 0; attempt < 5; attempt++) {
    const doc = { ...input, ref: `BR-${shortCode(8)}`, meta,
      createdAt: new Date(), deliveries: initialDeliveries(COLLECTIONS.brochure) };
    try {
      const { insertedId } = await col.insertOne(doc);
      kick(COLLECTIONS.brochure, insertedId);
      return { ref: doc.ref };
    } catch (error) { if (!duplicateKey(error)) throw error; }
  }
  throw new Error('Could not allocate brochure reference');
}
