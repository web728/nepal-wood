'use client';

import { useEffect, useRef, useState } from 'react';
import Icon from '../Icon';
import { useLeadForm } from './useLeadForm';
import { useCaptchaSubmit } from './useCaptchaSubmit';
import RecaptchaCheckbox from './RecaptchaCheckbox';
import { TextInput, TextArea, Select, ConsentCheck, Honeypot, FormError, Submit } from './Fields';
import { exhibitorSchema } from '@/lib/forms';
import './form-captcha.css';

const boothOptions = [
  { value: '9 sqm', label: '9 sqm' },
  { value: '18 sqm', label: '18 sqm' },
  { value: '32 sqm', label: '32 sqm' },
  { value: '36 sqm', label: '36 sqm' },
  { value: '54 sqm', label: '54 sqm' },
  { value: '72 sqm', label: '72 sqm' },
  { value: 'Custom', label: 'Custom size' },
];

export default function ExhibitorForm({ defaultZone }: { defaultZone?: string }) {
  const form = useLeadForm('exhibitor', exhibitorSchema, {
    company: '', designation: '', name: '', email: '', phone: '', country: '',
    products: defaultZone ? `Interested in ${defaultZone}` : '', boothSize: '', consent: false,
  });
  const [sizeChoice, setSizeChoice] = useState('');
  const captcha = useCaptchaSubmit(form.status, form.submit);
  const v = form.values;
  const tracked = useRef(false);

  useEffect(() => {
    if (form.status !== 'done' || tracked.current) return;
    tracked.current = true;
    if (typeof window.gtag === 'function') {
      window.gtag('event', 'exhibitor_form_submit');
    }
  }, [form.status]);

  if (form.status === 'done') {
    return (
      <section className="form-done" role="status" aria-live="polite">
        <span className="form-done__icon"><Icon name="check" /></span>
        <h2 className="h-md">Exhibitor enquiry received.</h2>
        <p>Thank you. Our exhibition team will review your request and contact you about available stand options.</p>
      </section>
    );
  }

  return (
    <form className="lead-form" onSubmit={captcha.onSubmit} noValidate aria-busy={form.status === 'sending'}>
      <Honeypot inputRef={form.honeypot} />
      <h3 className="lead-form__group">Exhibitor registration</h3>
      <div className="form-grid">
        <TextInput name="company" label="Company name" required value={v.company} onChange={(x) => form.set('company', x)} error={form.errors.company} autoComplete="organization" />
        <TextInput name="designation" label="Designation" required value={v.designation} onChange={(x) => form.set('designation', x)} error={form.errors.designation} autoComplete="organization-title" />
        <TextInput name="name" label="Contact person" required value={v.name} onChange={(x) => form.set('name', x)} error={form.errors.name} autoComplete="name" />
        <TextInput name="email" label="Business email" type="email" required value={v.email} onChange={(x) => form.set('email', x)} error={form.errors.email} autoComplete="email" inputMode="email" />
        <TextInput name="phone" label="Mobile / WhatsApp" type="tel" required value={v.phone} onChange={(x) => form.set('phone', x)} error={form.errors.phone} autoComplete="tel" inputMode="tel" />
        <TextInput name="country" label="Country" required value={v.country} onChange={(x) => form.set('country', x)} error={form.errors.country} autoComplete="country-name" />
        <TextArea name="products" label="Products and services (optional)" value={v.products} onChange={(x) => form.set('products', x)} error={form.errors.products} rows={3} className="span-2" placeholder="Tell us what you plan to exhibit" />
        <Select name="boothSizeChoice" label="Preferred booth size (optional)" value={sizeChoice} onChange={(choice) => {
          setSizeChoice(choice);
          form.set('boothSize', choice === 'Custom' ? '' : choice);
        }} options={boothOptions} placeholder="Select preferred size" className="span-2" />
        {sizeChoice === 'Custom' && (
          <TextInput name="boothSize" label="Custom booth size" value={v.boothSize} onChange={(x) => form.set('boothSize', x)} error={form.errors.boothSize} placeholder="e.g. 45 sqm or 6m × 8m" className="span-2" />
        )}
      </div>
      <div className="form-checks">
        <ConsentCheck checked={v.consent} onChange={(x) => form.set('consent', x)} error={form.errors.consent} purpose="to process my exhibitor enquiry and contact me" />
        <RecaptchaCheckbox resetRef={captcha.resetRef} onTokenChange={captcha.onTokenChange} error={captcha.error} />
      </div>
      <FormError message={form.status === 'error' ? form.result?.error || 'Please check your details and try again.' : undefined} />
      <div className="form-nav"><Submit sending={form.status === 'sending'}>Submit exhibitor enquiry</Submit></div>
      <p className="form-foot small muted">Our team will contact you after reviewing your request.</p>
    </form>
  );
}
