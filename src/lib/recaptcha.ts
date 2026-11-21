import 'server-only';

type GoogleSiteVerifyResponse = {
  success?: boolean;
  hostname?: string;
  challenge_ts?: string;
  'error-codes'?: string[];
};

type FailureReason =
  | 'token_missing'
  | 'secret_missing'
  | 'google_rejected'
  | 'hostname_missing'
  | 'hostname_mismatch'
  | 'verification_unavailable';

type VerificationResult =
  | { ok: true }
  | { ok: false; reason: FailureReason; codes?: string[] };

const PRIMARY = 'https://www.google.com/recaptcha/api/siteverify';
const FALLBACK = 'https://www.recaptcha.net/recaptcha/api/siteverify';

async function siteVerify(url: string, secret: string, token: string) {
  const response = await fetch(url, {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body: new URLSearchParams({ secret, response: token }),
    cache: 'no-store',
    signal: AbortSignal.timeout(7000),
  });

  if (!response.ok) throw new Error(`SiteVerify HTTP ${response.status}`);
  return (await response.json()) as GoogleSiteVerifyResponse;
}

/**
 * Verifies a single-use v2 response token. Never log or expose the token/secret.
 * Logs concise, actionable failures for production troubleshooting.
 */
export async function verifyRecaptchaDetailed(token: unknown): Promise<VerificationResult> {
  if (typeof token !== 'string' || token.length < 20 || token.length > 4096) {
    console.warn('[recaptcha] token_missing');
    return { ok: false, reason: 'token_missing' };
  }

  const secret = process.env.RECAPTCHA_SECRET_KEY?.trim();
  if (!secret) {
    console.error('[recaptcha] secret_missing: configure RECAPTCHA_SECRET_KEY on the deployment');
    return { ok: false, reason: 'secret_missing' };
  }

  let result: GoogleSiteVerifyResponse;
  try {
    result = await siteVerify(PRIMARY, secret, token);
  } catch (primaryError) {
    // Only retry with the alternate host when the HTTP request fails.
    // NEVER retry a Google-rejected token: tokens are single-use.
    console.warn('[recaptcha] primary siteverify network failure:',
      primaryError instanceof Error ? primaryError.message : 'unknown error');
    try {
      result = await siteVerify(FALLBACK, secret, token);
    } catch (fallbackError) {
      console.error('[recaptcha] verification_unavailable:',
        fallbackError instanceof Error ? fallbackError.message : 'unknown error');
      return { ok: false, reason: 'verification_unavailable' };
    }
  }

  if (!result.success) {
    const codes = Array.isArray(result['error-codes']) ? result['error-codes'] : [];
    console.warn('[recaptcha] google_rejected:', codes.length ? codes.join(', ') : 'no error codes returned');
    return { ok: false, reason: 'google_rejected', codes };
  }

  const hostname = result.hostname?.trim().toLowerCase().replace(/\.$/, '');
  if (!hostname) {
    console.warn('[recaptcha] hostname_missing');
    return { ok: false, reason: 'hostname_missing' };
  }

  const allowed = (process.env.RECAPTCHA_ALLOWED_HOSTNAMES || 'nepalwood.com.np,www.nepalwood.com.np')
    .split(',')
    .map((s) => s.trim().toLowerCase())
    .filter(Boolean);

  if (process.env.NODE_ENV !== 'production') allowed.push('localhost', '127.0.0.1');

  if (!allowed.includes(hostname)) {
    console.error('[recaptcha] hostname_mismatch:', { received: hostname, allowed });
    return { ok: false, reason: 'hostname_mismatch' };
  }

  return { ok: true };
}

/** Backwards compatible with any other API route using the boolean verifier. */
export async function verifyRecaptcha(token: unknown): Promise<boolean> {
  return (await verifyRecaptchaDetailed(token)).ok;
}
