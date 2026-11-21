'use client';

import Script from 'next/script';
import { useCallback, useEffect, useRef, useState } from 'react';

interface CaptchaAPI {
  render: (container: HTMLElement, options: {
    sitekey: string;
    theme?: 'light' | 'dark';
    callback: (token: string) => void;
    'expired-callback': () => void;
    'error-callback': () => void;
  }) => number;
  reset: (widgetId: number) => void;
}

declare global {
  interface Window { grecaptcha?: CaptchaAPI }
}

const SITE_KEY = process.env.NEXT_PUBLIC_RECAPTCHA_SITE_KEY;

export type RecaptchaControl = {
  token: string;
  reset: () => void;
};

export function useRecaptcha(): RecaptchaControl {
  const [token, setToken] = useState('');
  const resetFn = useRef<() => void>(() => setToken(''));
  const reset = useCallback(() => resetFn.current(), []);
  return { token, reset };
}

export default function RecaptchaCheckbox({
  onTokenChange,
  resetRef,
  error,
}: {
  onTokenChange: (token: string) => void;
  resetRef?: React.MutableRefObject<(() => void) | null>;
  error?: string;
}) {
  const holder = useRef<HTMLDivElement>(null);
  const widgetId = useRef<number | null>(null);
  const onChangeRef = useRef(onTokenChange);
  const [ready, setReady] = useState(false);
  const [loadError, setLoadError] = useState(false);

  useEffect(() => { onChangeRef.current = onTokenChange; }, [onTokenChange]);

  const reset = useCallback(() => {
    onChangeRef.current('');
    if (widgetId.current !== null && window.grecaptcha) {
      window.grecaptcha.reset(widgetId.current);
    }
  }, []);

  useEffect(() => {
    if (!resetRef) return;
    resetRef.current = reset;
    return () => { resetRef.current = null; };
  }, [reset, resetRef]);

  const renderWidget = useCallback(() => {
    if (!holder.current || !window.grecaptcha || !SITE_KEY || widgetId.current !== null) return;
    widgetId.current = window.grecaptcha.render(holder.current, {
      sitekey: SITE_KEY,
      theme: 'light',
      callback: (token) => { setLoadError(false); onChangeRef.current(token); },
      'expired-callback': () => onChangeRef.current(''),
      'error-callback': () => { setLoadError(true); onChangeRef.current(''); },
    });
    setReady(true);
  }, []);

  useEffect(() => {
    if (window.grecaptcha) renderWidget();
  }, [renderWidget]);

  if (!SITE_KEY) {
    return <p className="captcha-error" role="alert">Verification is not configured. Please contact the organisers.</p>;
  }

  return (
    <div className="captcha-field" aria-label="Human verification">
      <Script
        src="https://www.google.com/recaptcha/api.js?render=explicit"
        strategy="afterInteractive"
        onReady={renderWidget}
        onError={() => setLoadError(true)}
      />
      <div ref={holder} className="captcha-field__widget" />
      {!ready && !loadError && <p className="captcha-status">Loading verification…</p>}
      {loadError && <p className="captcha-error" role="alert">Verification could not load. Check your connection and reload the page.</p>}
      {error && <p className="captcha-error" role="alert">{error}</p>}
    </div>
  );
}
