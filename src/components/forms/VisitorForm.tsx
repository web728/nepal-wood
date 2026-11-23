'use client';

import { useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import Icon from '../Icon';
import { useLeadForm } from './useLeadForm';
import { useCaptchaSubmit } from './useCaptchaSubmit';
import RecaptchaCheckbox from './RecaptchaCheckbox';
import { TextInput, ConsentCheck, Honeypot, FormError, Submit } from './Fields';
import { visitorSchema } from '@/lib/forms';
import './form-captcha.css';

export default function VisitorForm() {
  const router = useRouter();
  const form = useLeadForm('visitor', visitorSchema, {
    name: '', company: '', designation: '', phone: '', email: '',
    businessType: '', country: '', consent: false,
  });
  const captcha = useCaptchaSubmit(form.status, form.submit);
  const v = form.values;
  const badgeUrl = form.result?.badgeUrl;
  const existing = form.result?.existing;
  const tracked = useRef(false);

  useEffect(() => {
    if (form.status !== 'done' || existing || tracked.current) return;
    tracked.current = true;
    if (typeof window.gtag === 'function') {
      window.gtag('event', 'visitor_form_submit');
    }
  }, [form.status, existing]);

  useEffect(() => {
    if (form.status !== 'done' || !badgeUrl) return;
    if (!badgeUrl.startsWith('/badge/') || badgeUrl.startsWith('//')) return;
    router.replace(`${badgeUrl}${badgeUrl.includes('?') ? '&' : '?'}${existing ? 'existing=1' : 'new=1'}`);
  }, [form.status, badgeUrl, existing, router]);

  if (form.status === 'done') {
    return (
      <section className="form-done" role="status" aria-live="polite">
        <span className="form-done__icon"><Icon name="badge" /></span>
        <h2 className="h-md">{existing ? 'Already registered' : 'Registration successful.'}</h2>
        <p>{badgeUrl ? 'Opening your visitor QR badge…' : 'This email is already registered. Contact the organisers from your registered email to recover your badge securely.'}</p>
        {badgeUrl?.startsWith('/badge/') && !badgeUrl.startsWith('//') && (
          <div className="form-done__actions"><a className="btn" href={badgeUrl}>Open QR badge <Icon name="arrow" className="arrow" /></a></div>
        )}
      </section>
    );
  }

  return (
    <form className="lead-form" onSubmit={captcha.onSubmit} noValidate aria-busy={form.status === 'sending'}>
      <Honeypot inputRef={form.honeypot} />
      <h3 className="lead-form__group">Visitor registration</h3>
      <div className="form-grid">
        <TextInput name="name" label="Full name" required value={v.name} onChange={(x) => form.set('name', x)} error={form.errors.name} autoComplete="name" />
        <TextInput name="company" label="Company / organisation" required value={v.company} onChange={(x) => form.set('company', x)} error={form.errors.company} autoComplete="organization" />
        <TextInput name="designation" label="Designation" required value={v.designation} onChange={(x) => form.set('designation', x)} error={form.errors.designation} autoComplete="organization-title" />
        <TextInput name="phone" label="Mobile / WhatsApp" type="tel" required value={v.phone} onChange={(x) => form.set('phone', x)} error={form.errors.phone} autoComplete="tel" inputMode="tel" />
        <TextInput name="email" label="Email address" type="email" required value={v.email} onChange={(x) => form.set('email', x)} error={form.errors.email} autoComplete="email" inputMode="email" />
        <TextInput name="businessType" label="Business category (optional)" value={v.businessType} onChange={(x) => form.set('businessType', x)} error={form.errors.businessType} placeholder="Manufacturer, dealer, architect…" />
        <TextInput name="country" label="Country" required value={v.country} onChange={(x) => form.set('country', x)} error={form.errors.country} autoComplete="country-name" />
      </div>
      <div className="form-checks">
        <ConsentCheck checked={v.consent} onChange={(x) => form.set('consent', x)} error={form.errors.consent} purpose="to process my registration and issue my visitor badge" />
        <RecaptchaCheckbox resetRef={captcha.resetRef} onTokenChange={captcha.onTokenChange} error={captcha.error} />
      </div>
      <FormError message={form.status === 'error' ? form.result?.error || 'Please check your details and try again.' : undefined} />
      <div className="form-nav"><Submit sending={form.status === 'sending'}>Register &amp; get QR badge</Submit></div>
      <p className="form-foot small muted">Already registered? Contact organisers using your registered email to recover your badge.</p>
    </form>
  );
}
