import { NextRequest, NextResponse } from 'next/server';
import { conferenceSchema } from '@/lib/conference';
import { fieldErrors } from '@/lib/forms';
import { dbConfigured } from '@/lib/db';
import { saveConclaveRegistration } from '@/lib/conclave-leads';
import { rateLimit, clientIp } from '@/lib/rate-limit';
import { verifyRecaptcha } from '@/lib/recaptcha';
import type { LeadMeta } from '@/lib/leads';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

const MAX_BODY_BYTES = 18_000;
const ALLOWED_ORIGINS = new Set([
  'https://nepalwood.com.np',
  'https://www.nepalwood.com.np',
]);

const fail = (error: string, status: number, fields?: Record<string, string>) =>
  NextResponse.json({ ok: false, error, ...(fields ? { fields } : {}) }, {
    status,
    headers: { 'Cache-Control': 'no-store' },
  });

function allowedOrigin(origin: string | null): boolean {
  if (!origin) return true;
  if (ALLOWED_ORIGINS.has(origin)) return true;
  return process.env.NODE_ENV !== 'production' &&
    (origin === 'http://localhost:3000' || origin === 'http://127.0.0.1:3000');
}

const shortText = (value: unknown, max = 200): string | undefined =>
  typeof value === 'string' ? value.slice(0, max) : undefined;

export async function POST(request: NextRequest) {
  if (!allowedOrigin(request.headers.get('origin'))) return fail('Invalid request origin.', 403);
  const contentLength = Number(request.headers.get('content-length') || 0);
  if (contentLength > MAX_BODY_BYTES) return fail('Request too large.', 413);

  let body: Record<string, unknown>;
  try {
    const raw = await request.text();
    if (Buffer.byteLength(raw, 'utf8') > MAX_BODY_BYTES) return fail('Request too large.', 413);
    const value: unknown = JSON.parse(raw);
    if (!value || typeof value !== 'object' || Array.isArray(value)) return fail('Invalid request.', 400);
    body = value as Record<string, unknown>;
  } catch {
    return fail('Invalid JSON request.', 400);
  }

  const parsed = conferenceSchema.safeParse(body);
  if (!parsed.success) return fail('Please check the highlighted fields.', 422, fieldErrors(parsed.error));
  if (parsed.data.website_url) return fail('Invalid submission.', 400);
  const ip = clientIp(request.headers);
  if (!rateLimit(`conclave:${ip}`, 8)) return fail('Too many submissions. Please try again later.', 429);
  if (!dbConfigured()) return fail('Registration is temporarily unavailable.', 503);

  if (!(await verifyRecaptcha(body.recaptchaToken))) {
    return fail('Human verification failed or expired. Please try again.', 422);
  }

  const meta: LeadMeta = {
    source: 'conference',
    medium: 'website',
    page: '/conference',
    referrer: shortText(request.headers.get('referer')),
    ip,
    ua: shortText(request.headers.get('user-agent'), 300),
  };

  try {
    await saveConclaveRegistration(parsed.data, meta);
    // Keep reference values internal; users see a simple confirmation.
    return NextResponse.json({ ok: true }, { headers: { 'Cache-Control': 'no-store' } });
  } catch (error) {
    console.error('[conclave] Registration failed:', error);
    return fail('Unable to save registration. Please try again.', 500);
  }
}
