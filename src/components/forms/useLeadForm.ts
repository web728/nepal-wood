'use client';
import { useRef, useState } from 'react';
import type { ZodType } from 'zod';
import { fieldErrors, type FormKind } from '@/lib/forms';
import { attribution, track } from '@/lib/track';

type Result = { ok: boolean; ref?: string; badgeUrl?: string; download?: string; existing?: boolean; error?: string; errors?: Record<string, string> };

/** State + submit logic shared by every lead form: client-side zod checks, anti-spam fields, attribution, analytics. */
export function useLeadForm<T extends Record<string, unknown>>(kind: FormKind, schema: ZodType, initial: T) {
  const [values, setValues] = useState<T>(initial);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [status, setStatus] = useState<'idle' | 'sending' | 'done' | 'error'>('idle');
  const [result, setResult] = useState<Result | null>(null);
  const startedAt = useRef<number>(Date.now());
  const honeypot = useRef<HTMLInputElement>(null);

  const set = <K extends keyof T>(key: K, value: T[K]) => {
    setValues((v) => ({ ...v, [key]: value }));
    if (errors[key as string]) setErrors((e) => { const n = { ...e }; delete n[key as string]; return n; });
  };

  const toggleIn = (key: keyof T, item: string) => {
    const arr = (values[key] as unknown as string[]) || [];
    set(key, (arr.includes(item) ? arr.filter((x) => x !== item) : [...arr, item]) as T[keyof T]);
  };

  /** Validates a subset of fields (for multi-step forms). Returns true when they pass. */
  const validateFields = (keys: (keyof T)[]) => {
    const parsed = schema.safeParse(values);
    if (parsed.success) return true;
    const all = fieldErrors(parsed.error);
    const subset = Object.fromEntries(Object.entries(all).filter(([k]) => keys.includes(k as keyof T)));
    setErrors((e) => ({ ...e, ...subset }));
    focusFirst(Object.keys(subset));
    return Object.keys(subset).length === 0;
  };

  const focusFirst = (keys: string[]) => {
    if (!keys.length) return;
    requestAnimationFrame(() => {
      const el = document.querySelector<HTMLElement>(`[name="${keys[0]}"], [data-field="${keys[0]}"] input, [data-field="${keys[0]}"] button`);
      el?.focus();
      el?.scrollIntoView({ block: 'center', behavior: 'smooth' });
    });
  };

  const submit = async (e?: React.FormEvent) => {
    e?.preventDefault();
    if (status === 'sending') return;
    const parsed = schema.safeParse(values);
    if (!parsed.success) {
      const errs = fieldErrors(parsed.error);
      setErrors(errs);
      focusFirst(Object.keys(errs));
      return;
    }
    setStatus('sending');
    try {
      const res = await fetch(`/api/forms/${kind}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ data: parsed.data, meta: attribution(), website_url: honeypot.current?.value || '', startedAt: startedAt.current }),
      });
      const json: Result = await res.json().catch(() => ({ ok: false, error: 'Unexpected response' }));
      if (!res.ok || !json.ok) {
        if (json.errors) { setErrors(json.errors); focusFirst(Object.keys(json.errors)); }
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
      setResult({ ok: false, error: 'Network problem. Please check your connection and try again.' });
      setStatus('error');
    }
  };

  return { values, set, toggleIn, errors, setErrors, status, result, submit, validateFields, honeypot };
}
