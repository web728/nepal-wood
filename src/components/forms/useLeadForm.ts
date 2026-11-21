'use client';

import { useRef, useState } from 'react';
import type { FormEvent } from 'react';
import type { ZodType } from 'zod';
import { fieldErrors, type FormKind } from '@/lib/forms';
import { attribution, track } from '@/lib/track';

type Result = {
  ok: boolean;
  badgeUrl?: string;
  download?: string;
  existing?: boolean;
  error?: string;
  errors?: Record<string, string>;
};

export function useLeadForm<T extends Record<string, unknown>>(
  kind: FormKind,
  schema: ZodType,
  initial: T,
) {
  const [values, setValues] = useState<T>(initial);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [status, setStatus] = useState<'idle' | 'sending' | 'done' | 'error'>('idle');
  const [result, setResult] = useState<Result | null>(null);
  const startedAt = useRef(Date.now());
  const honeypot = useRef<HTMLInputElement>(null);
  const inFlight = useRef(false);

  const set = <K extends keyof T>(key: K, value: T[K]) => {
    setValues((prev) => ({ ...prev, [key]: value }));
    setErrors((prev) => {
      if (!prev[String(key)]) return prev;
      const next = { ...prev };
      delete next[String(key)];
      return next;
    });
    if (status === 'error') setStatus('idle');
  };

  const toggleIn = (key: keyof T, item: string) => {
    const current = (values[key] as string[] | undefined) || [];
    set(key, (current.includes(item) ? current.filter((x) => x !== item) : [...current, item]) as T[keyof T]);
  };

  const focusFirst = (keys: string[]) => {
    if (!keys.length) return;
    requestAnimationFrame(() => {
      const el = document.querySelector<HTMLElement>(`[name="${keys[0]}"], [data-field="${keys[0]}"] input, [data-field="${keys[0]}"] button`);
      el?.focus();
      el?.scrollIntoView({ block: 'center', behavior: 'smooth' });
    });
  };

  const validateFields = (keys: (keyof T)[]) => {
    const parsed = schema.safeParse(values);
    if (parsed.success) return true;
    const all = fieldErrors(parsed.error);
    const subset = Object.fromEntries(Object.entries(all).filter(([key]) => keys.includes(key as keyof T)));
    setErrors((prev) => ({ ...prev, ...subset }));
    focusFirst(Object.keys(subset));
    return !Object.keys(subset).length;
  };

  // Every form must pass its own fresh reCAPTCHA token as the second argument.
  const submit = async (event?: FormEvent, recaptchaToken?: string) => {
    event?.preventDefault();
    if (inFlight.current || status === 'done') return;

    const parsed = schema.safeParse(values);
    if (!parsed.success) {
      const validation = fieldErrors(parsed.error);
      setErrors(validation);
      focusFirst(Object.keys(validation));
      return;
    }
    if (!recaptchaToken) {
      setResult({ ok: false, error: 'Please complete the “I’m not a robot” verification.' });
      setStatus('error');
      return;
    }

    inFlight.current = true;
    setStatus('sending');
    setErrors({});
    setResult(null);

    try {
      const response = await fetch(`/api/forms/${kind}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        cache: 'no-store',
        body: JSON.stringify({
          data: parsed.data,
          recaptchaToken,
          meta: attribution(),
          website_url: honeypot.current?.value || '',
          startedAt: startedAt.current,
        }),
      });
      const json = (await response.json().catch(() => ({ ok: false, error: 'Unexpected server response.' }))) as Result;
      if (!response.ok || !json.ok) {
        if (json.errors) {
          setErrors(json.errors);
          focusFirst(Object.keys(json.errors));
        }
        setResult(json);
        setStatus('error');
        return;
      }

      setResult(json);
      setStatus('done');
      track('generate_lead', { form: kind, value: kind === 'exhibitor' ? 1 : 0 });
      if (kind === 'brochure') track('file_download', { file_name: 'nepal-wood-expo-2027-brochure.pdf' });
      return json;
    } catch {
      setResult({ ok: false, error: 'Connection problem. Please try again.' });
      setStatus('error');
    } finally {
      inFlight.current = false;
    }
  };

  return { values, set, toggleIn, errors, setErrors, status, result, submit, validateFields, honeypot };
}
