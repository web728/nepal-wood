
import { NextRequest, NextResponse } from 'next/server';

import { conferenceSchema } from '@/lib/conference';
import { fieldErrors } from '@/lib/forms';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

export async function POST(request: NextRequest) {
  const origin = request.headers.get('origin');

  if (origin && origin !== request.nextUrl.origin) {
    return NextResponse.json(
      { ok: false, error: 'Invalid request origin.' },
      { status: 403 }
    );
  }

  const length = Number(
    request.headers.get('content-length') || 0
  );

  if (length > 18_000) {
    return NextResponse.json(
      { ok: false, error: 'Request too large.' },
      { status: 413 }
    );
  }

  let body: unknown;

  try {
    body = await request.json();
  } catch {
    return NextResponse.json(
      { ok: false, error: 'Invalid JSON.' },
      { status: 400 }
    );
  }

  // SERVER-SIDE VALIDATION
  const parsed = conferenceSchema.safeParse(body);

  if (!parsed.success) {
    return NextResponse.json(
      {
        ok: false,
        error: 'Please check the highlighted fields.',
        fields: fieldErrors(parsed.error),
      },
      { status: 422 }
    );
  }

  const data = parsed.data;

  // HONEYPOT
  if (data.website_url) {
    return NextResponse.json({
      ok: true,
      ref: 'RECEIVED',
    });
  }

  // MINIMUM FILL TIME
  if (data.startedAt && Date.now() - data.startedAt < 1200) {
    return NextResponse.json(
      {
        ok: false,
        error: 'Please try submitting again.',
      },
      { status: 429 }
    );
  }

  // EXISTING BACKEND CONFIG
  const pipelineUrl = process.env.CONCLAVE_PIPELINE_URL;
  const pipelineToken = process.env.CONCLAVE_PIPELINE_TOKEN;

  if (!pipelineUrl || !pipelineToken) {
    console.error('Conference pipeline is not configured');

    return NextResponse.json(
      {
        ok: false,
        error:
          'Registration service is not configured yet. Please contact the organisers.',
      },
      { status: 503 }
    );
  }

  if (
    process.env.NODE_ENV === 'production' &&
    !pipelineUrl.startsWith('https://')
  ) {
    return NextResponse.json(
      {
        ok: false,
        error: 'Registration service configuration error.',
      },
      { status: 503 }
    );
  }

  try {
    const controller = new AbortController();

    const timer = setTimeout(
      () => controller.abort(),
      8000
    );

    let upstream: Response;

    try {
      upstream = await fetch(pipelineUrl, {
        method: 'POST',

        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${pipelineToken}`,
        },

        body: JSON.stringify({
          ...data,
          form: 'conclave',
          event: 'Nepal Wood Technical Conclave 2027',
          submittedAt: new Date().toISOString(),
        }),

        signal: controller.signal,
        cache: 'no-store',
      });
    } finally {
      clearTimeout(timer);
    }

    const response = (await upstream.json().catch(
      () => ({})
    )) as {
      ok?: boolean;
      success?: boolean;
      ref?: string;
      error?: string;
    };

    if (
      !upstream.ok ||
      (response.ok !== true && response.success !== true)
    ) {
      console.error(
        'Conclave pipeline failure',
        upstream.status
      );

      return NextResponse.json(
        {
          ok: false,
          error:
            'Unable to complete registration. Please try again.',
        },
        { status: 502 }
      );
    }

    return NextResponse.json(
      {
        ok: true,
        ref: response.ref || '',
      },
      { status: 200 }
    );
  } catch (error) {
    console.error(
      'Conclave forwarding failed',
      error instanceof Error
        ? error.message
        : 'Unknown'
    );

    return NextResponse.json(
      {
        ok: false,
        error:
          'The registration service is unavailable. Please try again.',
      },
      { status: 503 }
    );
  }
}
