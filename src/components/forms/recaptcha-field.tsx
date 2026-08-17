"use client";

import { forwardRef } from "react";
import ReCAPTCHA from "react-google-recaptcha";
import { ShieldCheck, ShieldAlert, AlertCircle } from "lucide-react";

interface RecaptchaFieldProps {
  onChange: (token: string | null) => void;
  error?: string;
}

/** Single wrapped reCAPTCHA v2 checkbox reused identically across all forms. */
const RecaptchaField = forwardRef<ReCAPTCHA, RecaptchaFieldProps>(
  ({ onChange, error }, ref) => {
    const siteKey = process.env.NEXT_PUBLIC_RECAPTCHA_SITE_KEY;

    if (!siteKey) {
      return (
        <div className="flex items-start gap-3 rounded-xl border border-amber-300/60 bg-amber-50/80 p-4 text-xs text-amber-900 shadow-sm">
          <ShieldAlert className="h-5 w-5 text-amber-600 shrink-0 mt-0.5" />
          <div className="space-y-1">
            <p className="font-semibold text-amber-950">
              Security Validation Unconfigured
            </p>
            <p className="text-amber-800/90 leading-relaxed">
              reCAPTCHA is missing its configuration key (
              <code className="font-mono bg-amber-100 px-1 py-0.5 rounded text-[11px]">
                NEXT_PUBLIC_RECAPTCHA_SITE_KEY
              </code>
              ). Please set this environment variable to enable submission.
            </p>
          </div>
        </div>
      );
    }

    return (
      <div className="space-y-2">
        {/* Security badge header */}
        <div className="flex items-center gap-1.5 text-xs font-medium text-brand-brown/70">
          <ShieldCheck className="h-3.5 w-3.5 text-brand-amber" />
          <span>Security Verification</span>
        </div>

        {/* reCAPTCHA Widget Box */}
        <div className="inline-block overflow-hidden rounded-xl border border-brand-brown/10 bg-white p-2 shadow-xs">
          <ReCAPTCHA
            ref={ref}
            sitekey={siteKey}
            onChange={onChange}
            onExpired={() => onChange(null)}
          />
        </div>

        {/* Form Validation Error State */}
        {error && (
          <p className="flex items-center gap-1.5 text-xs font-semibold text-destructive mt-1.5">
            <AlertCircle className="h-3.5 w-3.5" />
            <span>{error}</span>
          </p>
        )}
      </div>
    );
  }
);

RecaptchaField.displayName = "RecaptchaField";

export default RecaptchaField;