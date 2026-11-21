import 'server-only';

interface VerifyResponse {
  success?: boolean;
  hostname?: string;
  'error-codes'?: string[];
}

/** Fail closed if secrets are absent, Google is unreachable, or hostname mismatches. */
export async function verifyRecaptcha(token: unknown): Promise<boolean> {
  if (typeof token !== 'string' || !token || token.length > 4096) return false;
  const secret = process.env.RECAPTCHA_SECRET_KEY;
  if (!secret) {
    console.error('[recaptcha] RECAPTCHA_SECRET_KEY is missing');
    return false;
  }

  try {
    const body = new URLSearchParams({ secret, response: token });
    const response = await fetch('https://www.google.com/recaptcha/api/siteverify', {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body,
      cache: 'no-store',
      signal: AbortSignal.timeout(4500),
    });
    if (!response.ok) return false;
    const result = (await response.json()) as VerifyResponse;
    if (!result.success || !result.hostname) return false;

    const hosts = (process.env.RECAPTCHA_ALLOWED_HOSTNAMES || 'nepalwood.com.np,www.nepalwood.com.np')
      .split(',')
      .map((host) => host.trim().toLowerCase())
      .filter(Boolean);
    if (process.env.NODE_ENV !== 'production') hosts.push('localhost', '127.0.0.1');
    return hosts.includes(result.hostname.toLowerCase());
  } catch (error) {
    console.warn('[recaptcha] Verification unavailable:', error);
    return false;
  }
}
