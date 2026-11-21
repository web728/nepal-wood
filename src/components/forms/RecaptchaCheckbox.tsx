'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import type { MutableRefObject } from 'react';
import { loadRecaptcha, type RecaptchaAPI } from './recaptcha-loader';

const SITE_KEY = process.env.NEXT_PUBLIC_RECAPTCHA_SITE_KEY;

type Props = {
  onTokenChange: (token: string) => void;
  resetRef?: MutableRefObject<(() => void) | null>;
  error?: string;
};

type State = 'loading' | 'ready' | 'failed';

export default function RecaptchaCheckbox({ onTokenChange, resetRef, error }: Props) {
  const hostRef = useRef<HTMLDivElement>(null);
  const widgetRef = useRef<number | null>(null);
  const apiRef = useRef<RecaptchaAPI | null>(null);
  const callbackRef = useRef(onTokenChange);
  const [state, setState] = useState<State>('loading');
  const [widgetError, setWidgetError] = useState('');
  const [attempt, setAttempt] = useState(0);

  useEffect(() => { callbackRef.current = onTokenChange; }, [onTokenChange]);

  const reset = useCallback(() => {
    callbackRef.current('');
    if (widgetRef.current !== null && apiRef.current) {
      try {
        apiRef.current.reset(widgetRef.current);
        setWidgetError('');
      } catch {
        setWidgetError('Please refresh the verification.');
      }
    }
  }, []);

  useEffect(() => {
    if (!resetRef) return;
    resetRef.current = reset;
    return () => {
      if (resetRef.current === reset) resetRef.current = null;
    };
  }, [reset, resetRef]);

  useEffect(() => {
    if (!SITE_KEY) return;
    let cancelled = false;

    // Re-rendering the component must not create a duplicate widget.
    if (widgetRef.current !== null) {
      setState('ready');
      return;
    }

    setState('loading');
    setWidgetError('');

    void loadRecaptcha()
      .then((api) => {
        if (cancelled || !hostRef.current || widgetRef.current !== null) return;
        try {
          apiRef.current = api;
          widgetRef.current = api.render(hostRef.current, {
            sitekey: SITE_KEY,
            theme: 'light',
            callback: (token) => {
              setWidgetError('');
              callbackRef.current(token);
            },
            'expired-callback': () => {
              callbackRef.current('');
              setWidgetError('Verification expired. Please tick the checkbox again.');
            },
            'error-callback': () => {
              callbackRef.current('');
              setWidgetError('Verification failed. Please retry the checkbox.');
            },
          });
          if (!cancelled) setState('ready');
        } catch (err) {
          console.error('[captcha] widget render failed', err);
          if (!cancelled) setState('failed');
        }
      })
      .catch((err: unknown) => {
        console.error('[captcha] script load failed', err);
        if (!cancelled) setState('failed');
      });

    return () => { cancelled = true; };
  }, [attempt]);

  if (!SITE_KEY) {
    return (
      <p className="captcha-error" role="alert">
        Verification is not configured. Please contact the organisers.
      </p>
    );
  }

  return (
    <div className="captcha-field" aria-label="Human verification">
      <div ref={hostRef} className="captcha-field__widget" />

      {state === 'loading' && (
        <p className="captcha-status" role="status">Loading verification…</p>
      )}

      {state === 'failed' && (
        <div className="captcha-retry" role="alert">
          <span>Google verification could not load. Check your connection or extensions.</span>
          <button type="button" onClick={() => setAttempt((value) => value + 1)}>
            Retry verification
          </button>
        </div>
      )}

      {widgetError && <p className="captcha-error" role="alert">{widgetError}</p>}
      {error && <p className="captcha-error" role="alert">{error}</p>}
    </div>
  );
}
