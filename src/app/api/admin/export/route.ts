import { NextResponse, type NextRequest } from 'next/server';
import { isAdmin } from '@/lib/auth';
import { getDb, COLLECTIONS } from '@/lib/db';
import { exhibitorRow, visitorRow, enquiryRow, brochureRow } from '@/lib/leads';
import type { Document } from 'mongodb';

export const runtime = 'nodejs';

const types: Record<string, { col: string; row: (d: Document) => Record<string, unknown> }> = {
  exhibitors: { col: COLLECTIONS.exhibitors, row: exhibitorRow },
  visitors: { col: COLLECTIONS.visitors, row: visitorRow },
  enquiries: { col: COLLECTIONS.enquiries, row: enquiryRow },
  brochure: { col: COLLECTIONS.brochure, row: brochureRow },
};

const cell = (v: unknown) => {
  const s = v === null || v === undefined ? '' : String(v);
  // Neutralise spreadsheet formula injection and quote every cell.
  const safe = /^[=+\-@\t\r]/.test(s) ? `'${s}` : s;
  return `"${safe.replace(/"/g, '""')}"`;
};

export async function GET(req: NextRequest) {
  if (!(await isAdmin())) return NextResponse.json({ error: 'Not signed in' }, { status: 401 });
  const type = req.nextUrl.searchParams.get('type') || '';
  const t = types[type];
  if (!t) return NextResponse.json({ error: 'Unknown export type' }, { status: 400 });
  const db = await getDb();
  const docs = await db.collection(t.col).find().sort({ createdAt: -1 }).toArray();
  const rows = docs.map(t.row);
  const headers = rows[0] ? Object.keys(rows[0]) : Object.keys(t.row({ createdAt: new Date(), meta: {} }));
  const csv = '﻿' + [headers.map(cell).join(','), ...rows.map((r) => headers.map((h) => cell(r[h])).join(','))].join('\r\n');
  const date = new Date().toISOString().slice(0, 10);
  return new NextResponse(csv, {
    headers: { 'Content-Type': 'text/csv; charset=utf-8', 'Content-Disposition': `attachment; filename="nepalwood-${type}-${date}.csv"`, 'Cache-Control': 'no-store' },
  });
}
