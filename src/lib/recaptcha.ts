interface RecaptchaVerifyResponse {
  success: boolean;
  challenge_ts?: string;
  hostname?: string;
  "error-codes"?: string[];
}

/**
 * Verifies a reCAPTCHA v2 token server-side. Returns false (never throws)
 * if the secret key is missing so routes can fail the request gracefully.
 */
export async function verifyRecaptcha(token: string | undefined | null): Promise<boolean> {
  const secret = process.env.RECAPTCHA_SECRET_KEY;

  if (!secret) {
    console.error("[recaptcha] RECAPTCHA_SECRET_KEY is not set.");
    return false;
  }
  if (!token) return false;

  try {
    const res = await fetch("https://www.google.com/recaptcha/api/siteverify", {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: new URLSearchParams({ secret, response: token }),
    });
    const data = (await res.json()) as RecaptchaVerifyResponse;
    return data.success === true;
  } catch (err) {
    console.error("[recaptcha] verification request failed:", err);
    return false;
  }
}
