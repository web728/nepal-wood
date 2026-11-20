
import {
  NextRequest,
  NextResponse,
} from 'next/server';

import { conferenceSchema } from '@/lib/conference';
import { fieldErrors } from '@/lib/forms';

import { dbConfigured } from '@/lib/db';
import { saveConclaveRegistration } from '@/lib/conclave-leads';

import {
  rateLimit,
  clientIp,
} from '@/lib/rate-limit';

import type { LeadMeta } from '@/lib/leads';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

const MAX_BODY_BYTES = 18_000;

/* =========================================
   ALLOWED WEBSITE ORIGINS

   Supports:
   - nepalwood.com.np
   - www.nepalwood.com.np
   - localhost during development

   Does not compare with request.nextUrl.origin,
   which may reflect a reverse-proxy hostname.
========================================= */

const PRODUCTION_ORIGINS = new Set([
  'https://nepalwood.com.np',
  'https://www.nepalwood.com.np',
]);

function isAllowedOrigin(
  origin: string | null
): boolean {
  // Some non-browser clients don't send Origin.
  if (!origin) {
    return true;
  }

  try {
    const parsed = new URL(origin);

    // Origin must be an origin, not a full URL path.
    if (parsed.origin !== origin) {
      return false;
    }

    if (PRODUCTION_ORIGINS.has(parsed.origin)) {
      return true;
    }

    if (process.env.NODE_ENV !== 'production') {
      return (
        parsed.origin === 'http://localhost:3000' ||
        parsed.origin === 'http://127.0.0.1:3000'
      );
    }

    return false;
  } catch {
    return false;
  }
}

function shortText(
  value: unknown,
  max = 200
): string | undefined {
  return typeof value === 'string'
    ? value.slice(0, max)
    : undefined;
}

/* =========================================
   CONFERENCE REGISTRATION API
========================================= */

export async function POST(
  request: NextRequest
) {
  /* -------------------------------------
     1. ORIGIN VALIDATION
  ------------------------------------- */

  const origin = request.headers.get('origin');

  if (!isAllowedOrigin(origin)) {
    console.warn(
      '[conclave] Blocked request origin:',
      origin
    );

    return NextResponse.json(
      {
        ok: false,
        error: 'Invalid request origin.',
      },
      {
        status: 403,
      }
    );
  }

  /* -------------------------------------
     2. REQUEST SIZE LIMIT
  ------------------------------------- */

  const contentLength = Number(
    request.headers.get('content-length') || 0
  );

  if (contentLength > MAX_BODY_BYTES) {
    return NextResponse.json(
      {
        ok: false,
        error: 'Request too large.',
      },
      {
        status: 413,
      }
    );
  }

  /* -------------------------------------
     3. PARSE JSON
  ------------------------------------- */

  let body: unknown;

  try {
    const raw = await request.text();

    // Check actual body size, even if
    // Content-Length is absent or inaccurate.
    if (
      Buffer.byteLength(raw, 'utf8') >
      MAX_BODY_BYTES
    ) {
      return NextResponse.json(
        {
          ok: false,
          error: 'Request too large.',
        },
        {
          status: 413,
        }
      );
    }

    body = JSON.parse(raw);
  } catch {
    return NextResponse.json(
      {
        ok: false,
        error: 'Invalid JSON request.',
      },
      {
        status: 400,
      }
    );
  }

  /* -------------------------------------
     4. ZOD VALIDATION
  ------------------------------------- */

  const parsed = conferenceSchema.safeParse(body);

  if (!parsed.success) {
    return NextResponse.json(
      {
        ok: false,
        error: 'Please check the highlighted fields.',
        fields: fieldErrors(parsed.error),
      },
      {
        status: 422,
      }
    );
  }

  /* -------------------------------------
     5. HONEYPOT ANTI-SPAM
  ------------------------------------- */

  if (parsed.data.website_url) {
    return NextResponse.json(
      {
        ok: false,
        error: 'Invalid submission.',
      },
      {
        status: 400,
      }
    );
  }

  // No minimum fill-time restriction.
  // Fast autofill submissions remain valid.

  /* -------------------------------------
     6. RATE LIMIT
  ------------------------------------- */

  const ip = clientIp(request.headers);

  if (!rateLimit(`conclave:${ip}`, 8)) {
    return NextResponse.json(
      {
        ok: false,
        error:
          'Too many submissions. Please try again later.',
      },
      {
        status: 429,
      }
    );
  }

  /* -------------------------------------
     7. MONGODB CONFIGURATION
  ------------------------------------- */

  if (!dbConfigured()) {
    console.error(
      '[conclave] MONGODB_URI not configured'
    );

    return NextResponse.json(
      {
        ok: false,
        error:
          'Registration is temporarily unavailable. Please contact the organisers.',
      },
      {
        status: 503,
      }
    );
  }

  /* -------------------------------------
     8. SUBMISSION METADATA
  ------------------------------------- */

  const meta: LeadMeta = {
    source: 'conference',
    medium: 'website',
    page: '/conference',

    referrer: shortText(
      request.headers.get('referer')
    ),

    ip,

    ua: shortText(
      request.headers.get('user-agent'),
      300
    ),
  };

  /* -------------------------------------
     9. SAVE TO MONGODB ATLAS

     Background tasks are scheduled by
     saveConclaveRegistration():
       - Google Sheets
       - 2 admin email recipients
       - Applicant acknowledgement

     Never return success before DB insert.
  ------------------------------------- */

  try {
    const result = await saveConclaveRegistration(
      parsed.data,
      meta
    );

    return NextResponse.json(
      {
        ok: true,
        ref: result.ref,
      },
      {
        status: 200,
        headers: {
          'Cache-Control': 'no-store',
        },
      }
    );
  } catch (error) {
    console.error(
      '[conclave] Registration failed:',
      error
    );

    return NextResponse.json(
      {
        ok: false,
        error:
          'Unable to save registration. Please try again.',
      },
      {
        status: 500,
      }
    );
  }
}
