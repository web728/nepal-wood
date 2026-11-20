
import {
  NextResponse,
  type NextRequest,
} from 'next/server';

import {
  schemas,
  antiSpam,
  fieldErrors,
  type FormKind,
} from '@/lib/forms';

import {
  saveExhibitor,
  saveVisitor,
  saveEnquiry,
  saveBrochure,
  type LeadMeta,
} from '@/lib/leads';

import {
  rateLimit,
  clientIp,
} from '@/lib/rate-limit';

import { dbConfigured } from '@/lib/db';
import { downloads } from '@/lib/site';

export const runtime = 'nodejs';

type RouteContext = {
  params: Promise<{
    form: string;
  }>;
};

type FormBody = {
  data?: unknown;
  meta?: unknown;
  website_url?: unknown;
  startedAt?: unknown;
};

function text(
  input: unknown,
  maxLength = 200
): string | undefined {
  return typeof input === 'string'
    ? input.slice(0, maxLength)
    : undefined;
}

export async function POST(
  req: NextRequest,
  ctx: RouteContext
) {
  const { form } = await ctx.params;

  /* ------------------------------------
     VERIFY FORM TYPE
  ------------------------------------ */

  if (!Object.prototype.hasOwnProperty.call(schemas, form)) {
    return NextResponse.json(
      {
        ok: false,
        error: 'Unknown form.',
      },
      {
        status: 404,
      }
    );
  }

  const kind = form as FormKind;

  /* ------------------------------------
     PARSE REQUEST
  ------------------------------------ */

  let body: FormBody;

  try {
    const payload: unknown = await req.json();

    if (
      payload === null ||
      typeof payload !== 'object' ||
      Array.isArray(payload)
    ) {
      return NextResponse.json(
        {
          ok: false,
          error: 'Invalid request.',
        },
        {
          status: 400,
        }
      );
    }

    body = payload as FormBody;
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

  /* ------------------------------------
     ANTI-SPAM VALIDATION
  ------------------------------------ */

  const spam = antiSpam.safeParse({
    website_url: body.website_url,
    startedAt: body.startedAt,
  });

  if (!spam.success) {
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

  // Do not return false success for fast submissions.
  // A successful response must follow an actual DB save.

  /* ------------------------------------
     RATE LIMIT
  ------------------------------------ */

  const ip = clientIp(req.headers);

  const allowed = rateLimit(
    `${kind}:${ip}`,
    kind === 'visitor' ? 12 : 8
  );

  if (!allowed) {
    return NextResponse.json(
      {
        ok: false,
        error:
          'Too many submissions. Please try again in a few minutes.',
      },
      {
        status: 429,
      }
    );
  }

  /* ------------------------------------
     SERVER-SIDE ZOD VALIDATION
  ------------------------------------ */

  const parsed = schemas[kind].safeParse(body.data);

  if (!parsed.success) {
    return NextResponse.json(
      {
        ok: false,
        error: 'Please check your details.',
        errors: fieldErrors(parsed.error),
      },
      {
        status: 422,
      }
    );
  }

  /* ------------------------------------
     DATABASE CONFIGURATION
  ------------------------------------ */

  if (!dbConfigured()) {
    console.error(
      '[forms] MONGODB_URI not configured'
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

  /* ------------------------------------
     ATTRIBUTION AND REQUEST METADATA
  ------------------------------------ */

  const rawMeta =
    body.meta &&
    typeof body.meta === 'object' &&
    !Array.isArray(body.meta)
      ? (body.meta as Record<string, unknown>)
      : {};

  const meta: LeadMeta = {
    source: text(rawMeta.source, 80),
    medium: text(rawMeta.medium, 80),
    campaign: text(rawMeta.campaign, 120),
    referrer: text(rawMeta.referrer, 200),
    page: text(rawMeta.page, 200),
    ip,
    ua: text(req.headers.get('user-agent'), 300),
  };

  /* ------------------------------------
     SAVE TO MONGODB FIRST
  ------------------------------------ */

  try {
    switch (kind) {
      case 'exhibitor': {
        const result = await saveExhibitor(
          parsed.data as never,
          meta
        );

        return NextResponse.json({
          ok: true,
          ref: result.ref,
        });
      }

      case 'visitor': {
        const result = await saveVisitor(
          parsed.data as never,
          meta
        );

        return NextResponse.json({
          ok: true,
          ref: result.badgeId,
          badgeUrl: `/badge/${result.token}`,
          existing: result.existing,
        });
      }

      case 'enquiry': {
        const result = await saveEnquiry(
          parsed.data as never,
          meta
        );

        return NextResponse.json({
          ok: true,
          ref: result.ref,
        });
      }

      case 'brochure': {
        const result = await saveBrochure(
          parsed.data as never,
          meta
        );

        return NextResponse.json({
          ok: true,
          ref: result.ref,
          download: downloads.brochure.file,
        });
      }

      default: {
        return NextResponse.json(
          {
            ok: false,
            error: 'Unsupported form.',
          },
          {
            status: 400,
          }
        );
      }
    }
  } catch (error) {
    console.error(
      `[forms] ${kind} submission failed:`,
      error
    );

    return NextResponse.json(
      {
        ok: false,
        error:
          'Something went wrong while saving your registration. Please try again.',
      },
      {
        status: 500,
      }
    );
  }
}
