import { NextResponse, type NextRequest } from 'next/server';
import { schemas, antiSpam, fieldErrors, type FormKind } from '@/lib/forms';
import { saveExhibitor, saveVisitor, saveEnquiry, saveBrochure, type LeadMeta } from '@/lib/leads';
import { rateLimit, clientIp } from '@/lib/rate-limit';
import { verifyRecaptcha } from '@/lib/recaptcha';
import { dbConfigured } from '@/lib/db';
import { downloads } from '@/lib/site';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

const MAX_BODY_BYTES = 20_000;
type Context = { params: Promise<{ form: string }> };
type Body = {
  data?: unknown;
  meta?: unknown;
  website_url?: unknown;
  startedAt?: unknown;
  recaptchaToken?: unknown;
};
const responseHeaders = { 'Cache-Control': 'no-store' };
const fail = (error: string, status: number, errors?: Record<string, string>) =>
  NextResponse.json({ ok: false, error, ...(errors ? { errors } : {}) }, { status, headers: responseHeaders });

function text(value: unknown, max = 200): string | undefined {
  return typeof value === 'string' ? value.slice(0, max) : undefined;
}

export async function POST(request: NextRequest, ctx: Context) {
  const { form } = await ctx.params;
  if (!Object.prototype.hasOwnProperty.call(schemas, form)) return fail('Unknown form.', 404);
  const kind = form as FormKind;

  // Browser same-origin policy: protect against cross-site form posts.
  const origin = request.headers.get('origin');
  if (origin && origin !== request.nextUrl.origin) {
    // For reverse-proxy setups, configure this with your known public domains.
    const allowed = new Set(['https://nepalwood.com.np', 'https://www.nepalwood.com.np']);
    if (process.env.NODE_ENV !== 'production') {
      allowed.add('http://localhost:3000');
      allowed.add('http://127.0.0.1:3000');
    }
    if (!allowed.has(origin)) return fail('Invalid request origin.', 403);
  }

  const length = Number(request.headers.get('content-length') || 0);
  if (length > MAX_BODY_BYTES) return fail('Request too large.', 413);

  let body: Body;
  try {
    const raw = await request.text();
    if (Buffer.byteLength(raw, 'utf8') > MAX_BODY_BYTES) return fail('Request too large.', 413);
    const payload: unknown = JSON.parse(raw);
    if (!payload || typeof payload !== 'object' || Array.isArray(payload)) return fail('Invalid request.', 400);
    body = payload as Body;
  } catch {
    return fail('Invalid JSON request.', 400);
  }

  const spam = antiSpam.safeParse({ website_url: body.website_url, startedAt: body.startedAt });
  if (!spam.success) return fail('Invalid submission.', 400);

  const ip = clientIp(request.headers);
  if (!rateLimit(`${kind}:${ip}`, kind === 'visitor' ? 12 : 8)) {
    return fail('Too many submissions. Please try again later.', 429);
  }

  const parsed = schemas[kind].safeParse(body.data);
  if (!parsed.success) return fail('Please check your details.', 422, fieldErrors(parsed.error));
  if (!dbConfigured()) return fail('Registration is temporarily unavailable.', 503);

  // Crucial: server verification, not just client-side checkbox state.
  if (!(await verifyRecaptcha(body.recaptchaToken))) {
    return fail('Human verification failed or expired. Please try again.', 422);
  }

  const rawMeta = body.meta && typeof body.meta === 'object' && !Array.isArray(body.meta)
    ? body.meta as Record<string, unknown> : {};
  const meta: LeadMeta = {
    source: text(rawMeta.source, 80),
    medium: text(rawMeta.medium, 80),
    campaign: text(rawMeta.campaign, 120),
    referrer: text(rawMeta.referrer, 200),
    page: text(rawMeta.page, 200),
    ip,
    ua: text(request.headers.get('user-agent'), 300),
  };

  // Keep these existing functions; they contain your MongoDB and any downstream integrations.
  try {
    switch (kind) {
      case 'exhibitor': {
        await saveExhibitor(parsed.data as never, meta);
        return NextResponse.json({ ok: true }, { headers: responseHeaders });
      }
      case 'visitor': {
        const saved = await saveVisitor(parsed.data as never, meta);
        return NextResponse.json(saved.existing
          ? { ok: true, existing: true }
          : { ok: true, existing: false, badgeUrl: `/badge/${saved.token}` },
          { headers: responseHeaders });
      }
      case 'enquiry': {
        await saveEnquiry(parsed.data as never, meta);
        return NextResponse.json({ ok: true }, { headers: responseHeaders });
      }
      case 'brochure': {
        await saveBrochure(parsed.data as never, meta);
        return NextResponse.json({ ok: true, download: downloads.brochure.file }, { headers: responseHeaders });
      }
    }
  } catch (error) {
    console.error(`[forms] ${kind} save failed:`, error);
    return fail('Unable to save your details. Please try again.', 500);
  }
}
