import 'server-only';
import { after } from 'next/server';
import { ObjectId, type Document } from 'mongodb';
import { getDb, COLLECTIONS } from './db';
import { upsertSheetRow, type SheetTab, type SheetRow } from './sheets';
import { sendMail, leadRecipients, emailShell, rowsTable, esc } from './mail';
import { shortCode, urlToken } from './ids';
import { SITE_URL, event, contacts } from './site';
import { standTypeLabel, topicLabel, type ExhibitorInput, type VisitorInput, type EnquiryInput, type BrochureInput } from './forms';

export type LeadMeta = { source?: string; medium?: string; campaign?: string; referrer?: string; page?: string; ip?: string; ua?: string };

const fmt = (d: Date) => d.toISOString().replace('T', ' ').slice(0, 16);
const yes = (b?: boolean) => (b ? 'Yes' : 'No');

/* ---------- Sheet rows (first column is the upsert key) ---------- */
export function exhibitorRow(d: Document): SheetRow {
  return {
    ID: d.ref, Received: fmt(d.createdAt), Status: d.status, Company: d.company, Contact: d.name, Designation: d.designation,
    Email: d.email, Phone: d.phone, Country: d.country, City: d.city, Website: d.website, Zones: (d.zones || []).join(', '),
    Products: d.products, 'Stand type': standTypeLabel[d.standType] || d.standType, 'Area (sqm)': d.areaSqm,
    'Heavy machinery': yes(d.heavyMachinery), 'Power needs': d.powerNeeds, Sponsorship: yes(d.sponsorship), Message: d.message,
    Notes: d.notes, Source: d.meta?.source, Medium: d.meta?.medium, Campaign: d.meta?.campaign,
  };
}
export function visitorRow(d: Document): SheetRow {
  return {
    ID: d.badgeId, Registered: fmt(d.createdAt), Name: d.name, Designation: d.designation, Company: d.company, 'Business type': d.businessType,
    Email: d.email, Phone: d.phone, Country: d.country, City: d.city, Interests: (d.interests || []).join(', '), 'Heard from': d.heardFrom,
    Updates: yes(d.updates), 'Checked in': d.checkedInAt ? fmt(d.checkedInAt) : '', Source: d.meta?.source, Campaign: d.meta?.campaign,
  };
}
export function enquiryRow(d: Document): SheetRow {
  return { ID: d.ref, Received: fmt(d.createdAt), Topic: topicLabel[d.topic] || d.topic, Name: d.name, Email: d.email, Phone: d.phone, Company: d.company, Message: d.message, Status: d.status };
}
export function brochureRow(d: Document): SheetRow {
  return { ID: d.ref, Downloaded: fmt(d.createdAt), Name: d.name, Email: d.email, Phone: d.phone, Company: d.company, Interest: d.interest, Source: d.meta?.source };
}

export const sheetFor = {
  [COLLECTIONS.exhibitors]: { tab: 'Exhibitor enquiries' as SheetTab, row: exhibitorRow },
  [COLLECTIONS.visitors]: { tab: 'Visitors' as SheetTab, row: visitorRow },
  [COLLECTIONS.enquiries]: { tab: 'Enquiries' as SheetTab, row: enquiryRow },
  [COLLECTIONS.brochure]: { tab: 'Brochure downloads' as SheetTab, row: brochureRow },
} as Record<string, { tab: SheetTab; row: (d: Document) => SheetRow }>;

/** Pushes one document to its sheet tab and records the outcome on the document. */
export async function syncToSheet(collection: string, id: ObjectId) {
  const map = sheetFor[collection];
  if (!map) return;
  const db = await getDb();
  const doc = await db.collection(collection).findOne({ _id: id });
  if (!doc) return;
  const res = await upsertSheetRow(map.tab, map.row(doc));
  await db.collection(collection).updateOne({ _id: id }, { $set: { sheet: res } });
  if (!res.ok && !res.skipped) console.error(`[sheets] ${collection} ${id} failed: ${res.error}`);
  return res;
}

const later = (fn: () => Promise<unknown>) =>
  after(async () => {
    try { await fn(); } catch (e) { console.error('[after] task failed', e); }
  });

/* ---------- Exhibitor enquiry ---------- */
export async function saveExhibitor(input: ExhibitorInput, meta: LeadMeta) {
  const db = await getDb();
  const doc = { ...input, ref: `EX-${shortCode(5)}`, status: 'new', notes: '', meta, createdAt: new Date() };
  const { insertedId } = await db.collection(COLLECTIONS.exhibitors).insertOne(doc);
  later(async () => {
    await syncToSheet(COLLECTIONS.exhibitors, insertedId);
    const to = leadRecipients();
    if (to.length) {
      await sendMail({
        to,
        replyTo: input.email,
        subject: `New stand enquiry: ${input.company} (${input.areaSqm} sqm, ${standTypeLabel[input.standType]})`,
        text: `New stand enquiry ${doc.ref} from ${input.company}, ${input.name}, ${input.phone}, ${input.email}`,
        html: emailShell(`New stand enquiry · ${doc.ref}`, rowsTable([
          ['Company', input.company], ['Contact', `${input.name}, ${input.designation}`], ['Email', input.email], ['Phone', input.phone],
          ['Location', `${input.city}, ${input.country}`], ['Website', input.website], ['Zones', input.zones], ['Products', input.products],
          ['Stand', `${standTypeLabel[input.standType]} · ${input.areaSqm} sqm`], ['Heavy machinery', yes(input.heavyMachinery)],
          ['Power / special needs', input.powerNeeds], ['Sponsorship interest', yes(input.sponsorship)], ['Message', input.message], ['Source', meta.source],
        ])),
      });
    }
    await sendMail({
      to: input.email,
      subject: `We’ve received your stand enquiry for ${event.shortName} (${doc.ref})`,
      text: `Thank you, ${input.name}. Our team will reply within one working day with the floor plan and a quote. Reference: ${doc.ref}.`,
      html: emailShell('Thank you, we’ve received your stand enquiry', `<p style="font-size:15px;line-height:1.6">Dear ${esc(input.name)},</p>
        <p style="font-size:15px;line-height:1.6">Thank you for your interest in exhibiting at <b>${esc(event.name)}</b>, ${esc(event.datesLabel)} at ${esc(event.venue.full)}, Kathmandu. Our sales team will reply within one working day with the floor plan, available positions and a quote.</p>
        <p style="font-size:15px;line-height:1.6">Your reference: <b>${doc.ref}</b></p>
        <p style="font-size:15px;line-height:1.6">For anything urgent, call ${esc(contacts[0].name)} on ${esc(contacts[0].phone)} or write to ${esc(contacts[0].email)}.</p>`),
    });
  });
  return { ref: doc.ref };
}

/* ---------- Visitor registration ---------- */
export async function saveVisitor(input: VisitorInput, meta: LeadMeta) {
  const db = await getDb();
  const col = db.collection(COLLECTIONS.visitors);
  const existing = await col.findOne({ email: input.email });
  if (existing) return { badgeId: existing.badgeId as string, token: existing.token as string, existing: true };

  for (let attempt = 0; attempt < 5; attempt++) {
    const doc = { ...input, badgeId: `${event.badgePrefix}-${shortCode(6)}`, token: urlToken(), checkedInAt: null, meta, createdAt: new Date() };
    try {
      const { insertedId } = await col.insertOne(doc);
      later(async () => {
        await syncToSheet(COLLECTIONS.visitors, insertedId);
        const url = `${SITE_URL}/badge/${doc.token}`;
        await sendMail({
          to: input.email,
          subject: `Your free visitor badge: ${event.shortName}, ${event.datesShort}`,
          text: `Hi ${input.name}, your badge ID is ${doc.badgeId}. Show the QR code at the entrance: ${url}`,
          html: emailShell('Your visitor badge is ready', `<p style="font-size:15px;line-height:1.6">Hi ${esc(input.name)},</p>
            <p style="font-size:15px;line-height:1.6">You’re registered for <b>${esc(event.name)}</b>, ${esc(event.datesLabel)} at ${esc(event.venue.full)}, Kathmandu.</p>
            <p style="font-size:22px;font-weight:bold;letter-spacing:2px;margin:18px 0">${doc.badgeId}</p>
            <p><a href="${url}" style="display:inline-block;background:#9b2a29;color:#fff;padding:12px 20px;border-radius:6px;text-decoration:none;font-weight:bold">Open my QR badge</a></p>
            <p style="font-size:14px;line-height:1.6;color:#4a3a32">Show the QR code on your phone (or printed) at the express entry counter, and carry a business card or photo ID.</p>`),
        });
      });
      return { badgeId: doc.badgeId, token: doc.token, existing: false };
    } catch (e: unknown) {
      const code = (e as { code?: number }).code;
      if (code !== 11000) throw e;
      const dupe = await col.findOne({ email: input.email });
      if (dupe) return { badgeId: dupe.badgeId as string, token: dupe.token as string, existing: true };
      // badge/token collision: retry with new codes
    }
  }
  throw new Error('Could not allocate a badge ID');
}

/* ---------- General enquiry ---------- */
export async function saveEnquiry(input: EnquiryInput, meta: LeadMeta) {
  const db = await getDb();
  const doc = { ...input, ref: `EN-${shortCode(5)}`, status: 'new', meta, createdAt: new Date() };
  const { insertedId } = await db.collection(COLLECTIONS.enquiries).insertOne(doc);
  later(async () => {
    await syncToSheet(COLLECTIONS.enquiries, insertedId);
    const to = leadRecipients();
    if (to.length) {
      await sendMail({
        to, replyTo: input.email,
        subject: `Website enquiry (${topicLabel[input.topic]}): ${input.name}`,
        text: `${input.name} (${input.email}, ${input.phone}): ${input.message}`,
        html: emailShell(`Website enquiry · ${topicLabel[input.topic]}`, rowsTable([['Name', input.name], ['Email', input.email], ['Phone', input.phone], ['Company', input.company], ['Message', input.message]])),
      });
    }
  });
  return { ref: doc.ref };
}

/* ---------- Brochure download ---------- */
export async function saveBrochure(input: BrochureInput, meta: LeadMeta) {
  const db = await getDb();
  const doc = { ...input, ref: `BR-${shortCode(5)}`, meta, createdAt: new Date() };
  const { insertedId } = await db.collection(COLLECTIONS.brochure).insertOne(doc);
  later(() => syncToSheet(COLLECTIONS.brochure, insertedId) as Promise<unknown>);
  return { ref: doc.ref };
}
