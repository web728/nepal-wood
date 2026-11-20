import { NextResponse, type NextRequest } from 'next/server';
import { isAdmin } from '@/lib/auth';
import { getDb, COLLECTIONS } from '@/lib/db';
import { syncToSheet } from '@/lib/leads';

export const runtime = 'nodejs';

// Accepts a scanned QR payload (NW27:<badge>:<token>), a typed badge ID, or an email address.
export async function POST(req: NextRequest) {
  if (!(await isAdmin())) return NextResponse.json({ ok: false, error: 'Not signed in' }, { status: 401 });
  const { code, undo } = (await req.json().catch(() => ({}))) as { code?: string; undo?: boolean };
  const raw = String(code || '').trim();
  if (!raw) return NextResponse.json({ ok: false, error: 'Empty code' }, { status: 400 });

  let query: Record<string, string>;
  const parts = raw.split(':');
  if (parts.length === 3 && parts[0] === 'NW27') query = { badgeId: parts[1].toUpperCase(), token: parts[2] };
  else if (raw.includes('@')) query = { email: raw.toLowerCase() };
  else if (/\/badge\/[A-Za-z0-9_-]+/.test(raw)) query = { token: raw.split('/badge/')[1].split(/[?#]/)[0] };
  else query = { badgeId: raw.toUpperCase().replace(/^NW27(?!-)/, 'NW27-') };

  const db = await getDb();
  const col = db.collection(COLLECTIONS.visitors);
  const v = await col.findOne(query);
  if (!v) return NextResponse.json({ ok: false, error: 'No registration found for that code' }, { status: 404 });

  const already = Boolean(v.checkedInAt);
  if (undo) await col.updateOne({ _id: v._id }, { $set: { checkedInAt: null } });
  else if (!already) await col.updateOne({ _id: v._id }, { $set: { checkedInAt: new Date() } });
  syncToSheet(COLLECTIONS.visitors, v._id).catch(() => {});

  return NextResponse.json({
    ok: true,
    already: !undo && already,
    undone: Boolean(undo),
    visitor: { name: v.name, designation: v.designation, company: v.company, city: v.city, badgeId: v.badgeId, interests: v.interests, checkedInAt: undo ? null : v.checkedInAt || new Date() },
  });
}
