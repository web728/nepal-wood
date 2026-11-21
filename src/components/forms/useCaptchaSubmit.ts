'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import type { FormEvent } from 'react';

type FormState = 'idle' | 'sending' | 'done' | 'error';

/** Shared token/error handling. Keep the existing useLeadForm API unchanged. */
export function useCaptchaSubmit(
  status: FormState,
  submit: (event?: FormEvent, token?: string) => Promise<unknown>,
) {
  const [token, setToken] = useState('');
  const [error, setError] = useState('');
  const resetRef = useRef<(() => void) | null>(null);

  useEffect(() => {
    if (status === 'error') {
      resetRef.current?.();
      setToken('');
    }
  }, [status]);

  const onTokenChange = useCallback((next: string) => {
    setToken(next);
    if (next) setError('');
  }, []);

  const onSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (status === 'sending' || status === 'done') return;
    if (!token) {
      setError('Please complete the “I’m not a robot” checkbox.');
      return;
    }
    setError('');
    void submit(event, token);
  };

  return { onSubmit, onTokenChange, resetRef, error };
}
