import { NextResponse, type NextRequest } from 'next/server';
import { schemas, antiSpam, fieldErrors, type FormKind } from '@/lib/forms';
import { saveExhibitor, saveVisitor, saveEnquiry, saveBrochure, type LeadMeta } from '@/lib/leads';
import { rateLimit, clientIp } from '@/lib/rate-limit';
import { dbConfigured } from '@/lib/db';
import { downloads } from '@/lib/site';

export const runtime = 'nodejs';

const MIN_FILL_MS = 2500;

export async function POST(req: NextRequest, ctx: { params: Promise<{ form: string }> }) {
  const { form } = await ctx.params;
  if (!(form in schemas)) return NextResponse.json({ ok: false, error: 'Unknown form' }, { status: 404 });
  const kind = form as FormKind;

  let body: Record<string, unknown>;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ ok: false, error: 'Invalid request' }, { status: 400 });
  }

  // Bots fill the hidden field or submit instantly; answer as if it worked so they learn nothing.
  const spam = antiSpam.safeParse({ website_url: body.website_url, startedAt: body.startedAt });
  const tooFast = typeof body.startedAt === 'number' && Date.now() - body.startedAt < MIN_FILL_MS;
  if (!spam.success || tooFast) return NextResponse.json({ ok: true, ref: 'OK' });

  const ip = clientIp(req.headers);
  if (!rateLimit(`${kind}:${ip}`, kind === 'visitor' ? 12 : 8)) {
    return NextResponse.json({ ok: false, error: 'Too many submissions. Please try again in a few minutes.' }, { status: 429 });
  }

  const parsed = schemas[kind].safeParse(body.data);
  if (!parsed.success) return NextResponse.json({ ok: false, errors: fieldErrors(parsed.error) }, { status: 422 });

  if (!dbConfigured()) {
    console.error('[forms] MONGODB_URI not configured');
    return NextResponse.json({ ok: false, error: 'Registration is temporarily unavailable. Please call or WhatsApp us.' }, { status: 503 });
  }

  const m = (body.meta || {}) as Record<string, unknown>;
  const str = (v: unknown, n = 200) => (typeof v === 'string' ? v.slice(0, n) : undefined);
  const meta: LeadMeta = {
    source: str(m.source, 80), medium: str(m.medium, 80), campaign: str(m.campaign, 120), referrer: str(m.referrer), page: str(m.page),
    ip, ua: str(req.headers.get('user-agent'), 300),
  };

  try {
    switch (kind) {
      case 'exhibitor': {
        const r = await saveExhibitor(parsed.data as never, meta);
        return NextResponse.json({ ok: true, ref: r.ref });
      }
      case 'visitor': {
        const r = await saveVisitor(parsed.data as never, meta);
        return NextResponse.json({ ok: true, ref: r.badgeId, badgeUrl: `/badge/${r.token}`, existing: r.existing });
      }
      case 'enquiry': {
        const r = await saveEnquiry(parsed.data as never, meta);
        return NextResponse.json({ ok: true, ref: r.ref });
      }
      case 'brochure': {
        const r = await saveBrochure(parsed.data as never, meta);
        return NextResponse.json({ ok: true, ref: r.ref, download: downloads.brochure.file });
      }
    }
  } catch (e) {
    console.error(`[forms] ${kind} failed`, e);
    return NextResponse.json({ ok: false, error: 'Something went wrong on our side. Please try again, or call or WhatsApp us.' }, { status: 500 });
  }
}
