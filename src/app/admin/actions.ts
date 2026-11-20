'use server';
import { redirect } from 'next/navigation';
import { revalidatePath } from 'next/cache';
import { ObjectId } from 'mongodb';
import { checkPassword, createSession, destroySession, requireAdmin } from '@/lib/auth';
import { getDb, COLLECTIONS } from '@/lib/db';
import { syncToSheet } from '@/lib/leads';
import { rateLimit } from '@/lib/rate-limit';
import { headers } from 'next/headers';
import { clientIp } from '@/lib/rate-limit';

export async function login(_: unknown, form: FormData) {
  const ip = clientIp(await headers());
  if (!rateLimit(`login:${ip}`, 6, 15 * 60 * 1000)) return { error: 'Too many attempts. Try again in 15 minutes.' };
  const pw = String(form.get('password') || '');
  if (!checkPassword(pw)) return { error: 'Incorrect password.' };
  await createSession();
  redirect('/admin');
}

export async function logout() {
  await destroySession();
  redirect('/admin/login');
}

const leadCollections = [COLLECTIONS.exhibitors, COLLECTIONS.enquiries] as string[];

export async function updateLead(form: FormData) {
  await requireAdmin();
  const col = String(form.get('collection'));
  const id = String(form.get('id'));
  if (!leadCollections.includes(col) || !ObjectId.isValid(id)) return;
  const status = String(form.get('status') || '');
  const notes = form.get('notes');
  const set: Record<string, unknown> = { updatedAt: new Date() };
  if (['new', 'contacted', 'quoted', 'booked', 'lost', 'closed'].includes(status)) set.status = status;
  if (typeof notes === 'string') set.notes = notes.slice(0, 2000);
  const db = await getDb();
  await db.collection(col).updateOne({ _id: new ObjectId(id) }, { $set: set });
  await syncToSheet(col, new ObjectId(id));
  revalidatePath('/admin', 'layout');
}

export async function retrySheetSync() {
  await requireAdmin();
  const db = await getDb();
  let n = 0;
  for (const col of [COLLECTIONS.exhibitors, COLLECTIONS.visitors, COLLECTIONS.enquiries, COLLECTIONS.brochure]) {
    const pending = await db.collection(col).find({ $or: [{ 'sheet.ok': { $ne: true } }, { sheet: { $exists: false } }] }, { projection: { _id: 1 } }).limit(200).toArray();
    for (const d of pending) { await syncToSheet(col, d._id); n++; }
  }
  revalidatePath('/admin', 'layout');
  return n;
}

/* ---------- Directory ---------- */
export async function saveDirectoryEntry(form: FormData) {
  await requireAdmin();
  const str = (k: string, max = 200) => String(form.get(k) || '').trim().slice(0, max);
  const doc = {
    company: str('company', 120), country: str('country', 60), city: str('city', 60), stand: str('stand', 20), website: str('website', 160),
    description: str('description', 400), logo: str('logo', 300), zones: form.getAll('zones').map(String).slice(0, 5), published: form.get('published') === 'on', updatedAt: new Date(),
  };
  if (!doc.company || !doc.country) return;
  const db = await getDb();
  const id = String(form.get('id') || '');
  if (ObjectId.isValid(id)) await db.collection(COLLECTIONS.directory).updateOne({ _id: new ObjectId(id) }, { $set: doc });
  else await db.collection(COLLECTIONS.directory).insertOne({ ...doc, createdAt: new Date() });
  revalidatePath('/admin/directory');
  revalidatePath('/exhibitors');
}

export async function deleteDirectoryEntry(form: FormData) {
  await requireAdmin();
  const id = String(form.get('id'));
  if (!ObjectId.isValid(id)) return;
  const db = await getDb();
  await db.collection(COLLECTIONS.directory).deleteOne({ _id: new ObjectId(id) });
  revalidatePath('/admin/directory');
  revalidatePath('/exhibitors');
}

/* ---------- Testimonials ---------- */
export async function saveTestimonial(form: FormData) {
  await requireAdmin();
  const str = (k: string, max = 200) => String(form.get(k) || '').trim().slice(0, max);
  const doc = { quote: str('quote', 600), name: str('name', 80), role: str('role', 80), company: str('company', 120), edition: str('edition', 40), order: Number(form.get('order') || 0), published: form.get('published') === 'on', updatedAt: new Date() };
  if (!doc.quote || !doc.name) return;
  const db = await getDb();
  const id = String(form.get('id') || '');
  if (ObjectId.isValid(id)) await db.collection(COLLECTIONS.testimonials).updateOne({ _id: new ObjectId(id) }, { $set: doc });
  else await db.collection(COLLECTIONS.testimonials).insertOne({ ...doc, createdAt: new Date() });
  revalidatePath('/admin/testimonials');
  revalidatePath('/');
  revalidatePath('/why-exhibit');
}

export async function deleteTestimonial(form: FormData) {
  await requireAdmin();
  const id = String(form.get('id'));
  if (!ObjectId.isValid(id)) return;
  const db = await getDb();
  await db.collection(COLLECTIONS.testimonials).deleteOne({ _id: new ObjectId(id) });
  revalidatePath('/admin/testimonials');
  revalidatePath('/');
}
