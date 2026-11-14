import { NextRequest, NextResponse } from 'next/server';
import { conferenceSchema } from '@/lib/conference';
import { fieldErrors } from '@/lib/forms';
import { dbConfigured } from '@/lib/db';
import { saveConclaveRegistration } from '@/lib/conclave-leads';
import { rateLimit, clientIp } from '@/lib/rate-limit';
import type { LeadMeta } from '@/lib/leads';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

export async function POST(request: NextRequest) {
  const origin = request.headers.get('origin');
  if (origin && origin !== request.nextUrl.origin) {
    return NextResponse.json({ ok: false, error: 'Invalid request origin.' }, { status: 403 });
  }

  const contentLength = Number(request.headers.get('content-length') || 0);
  if (contentLength > 18_000) {
    return NextResponse.json({ ok: false, error: 'Request too large.' }, { status: 413 });
  }

  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ ok: false, error: 'Invalid JSON.' }, { status: 400 });
  }

  const parsed = conferenceSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({
      ok: false,
      error: 'Please check the highlighted fields.',
      fields: fieldErrors(parsed.error),
    }, { status: 422 });
  }

  // Never give a false success to a submission that was not saved.
  if (parsed.data.website_url) {
    return NextResponse.json({ ok: false, error: 'Invalid submission.' }, { status: 400 });
  }

  const ip = clientIp(request.headers);
  if (!rateLimit(`conclave:${ip}`, 8)) {
    return NextResponse.json({ ok: false, error: 'Too many submissions. Please try again later.' }, { status: 429 });
  }

  if (!dbConfigured()) {
    return NextResponse.json({ ok: false, error: 'Registration is temporarily unavailable.' }, { status: 503 });
  }

  const s = (v: unknown, max = 200): string | undefined =>
    typeof v === 'string' ? v.slice(0, max) : undefined;
  const meta: LeadMeta = {
    source: 'conference',
    medium: 'website',
    page: '/conference',
    referrer: s(request.headers.get('referer')),
    ip,
    ua: s(request.headers.get('user-agent'), 300),
  };

  try {
    // Only MongoDB is awaited. Email and Google Sheets run through after().
    const result = await saveConclaveRegistration(parsed.data, meta);
    return NextResponse.json({ ok: true, ref: result.ref });
  } catch (error) {
    console.error('[conclave] Registration failed', error);
    return NextResponse.json({
      ok: false,
      error: 'Unable to save registration. Please try again.',
    }, { status: 500 });
  }
}
