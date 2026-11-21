'use client';

import { useEffect, useRef, useState } from 'react';
import Icon from '../Icon';
import { useLeadForm } from './useLeadForm';
import { TextInput, Choice, ConsentCheck, Honeypot, FormError, Submit } from './Fields';
import RecaptchaCheckbox from './RecaptchaCheckbox';
import { brochureSchema } from '@/lib/forms';
import { downloads } from '@/lib/site';
import './form-captcha.css';

type Interest = 'exhibiting' | 'visiting' | 'sponsoring';

const interestOptions: { value: Interest; label: string; desc: string }[] = [
  { value: 'exhibiting', label: 'Exhibiting', desc: 'Book a stand' },
  { value: 'visiting', label: 'Visiting', desc: 'Explore the expo' },
  { value: 'sponsoring', label: 'Sponsoring', desc: 'Brand opportunities' },
];

export default function BrochureForm() {
  const f = useLeadForm('brochure', brochureSchema, {
    name: '', email: '', phone: '', company: '',
    interest: 'exhibiting' as Interest, consent: false,
  });
  const v = f.values;
  const [captchaToken, setCaptchaToken] = useState('');
  const [captchaError, setCaptchaError] = useState('');
  const captchaReset = useRef<(() => void) | null>(null);
  const autoDownloadStarted = useRef(false);

  useEffect(() => {
    if (f.status !== 'done' || autoDownloadStarted.current) return;
    autoDownloadStarted.current = true;
    const a = document.createElement('a');
    // Use the trusted brochure URL configured on the site, not an arbitrary API URL.
    a.href = downloads.brochure.file;
    a.download = '';
    document.body.appendChild(a);
    a.click();
    a.remove();
  }, [f.status]);

  useEffect(() => {
    if (f.status === 'error') {
      captchaReset.current?.(); // Tokens are short-lived and single-use.
      setCaptchaToken('');
    }
  }, [f.status]);

  if (f.status === 'done') {
    const next = {
      exhibiting: { href: '/exhibitor-registration', label: 'Book a stand' },
      visiting: { href: '/visitor-registration', label: 'Get your free badge' },
      sponsoring: { href: '/sponsorship', label: 'Sponsorship options' },
    }[v.interest];

    return (
      <div className="form-done" role="status">
        <span className="form-done__icon"><Icon name="download" /></span>
        <h2 className="h-md">Your brochure is ready.</h2>
        <p>If your download did not start, use the button below.</p>
        <div className="form-done__actions">
          <a className="btn" href={downloads.brochure.file} download>Download brochure <Icon name="download" className="arrow" /></a>
          <a className="btn btn--ghost" href={next.href}>{next.label}</a>
        </div>
      </div>
    );
  }

  return (
    <form className="lead-form" noValidate onSubmit={(event) => {
      event.preventDefault();
      if (f.status === 'sending') return;
      if (!captchaToken) {
        setCaptchaError('Please confirm that you are not a robot.');
        return;
      }
      setCaptchaError('');
      void f.submit(event, captchaToken);
    }}>
      <Honeypot inputRef={f.honeypot} />
      <div className="form-grid">
        <TextInput name="name" label="Your name" required value={v.name} onChange={(x) => f.set('name', x)} error={f.errors.name} autoComplete="name" />
        <TextInput name="company" label="Company" required value={v.company} onChange={(x) => f.set('company', x)} error={f.errors.company} autoComplete="organization" />
        <TextInput name="email" label="Email" type="email" required value={v.email} onChange={(x) => f.set('email', x)} error={f.errors.email} autoComplete="email" inputMode="email" />
        <TextInput name="phone" label="Phone / WhatsApp" type="tel" required value={v.phone} onChange={(x) => f.set('phone', x)} error={f.errors.phone} autoComplete="tel" inputMode="tel" />
        <Choice name="interest" label="I'm interested in" value={v.interest} onChange={(x) => f.set('interest', x)} options={interestOptions} />
      </div>
      <div className="form-checks">
        <ConsentCheck checked={v.consent} onChange={(x) => f.set('consent', x)} error={f.errors.consent} purpose="to send me the brochure and follow up about the expo" />
        <RecaptchaCheckbox resetRef={captchaReset} onTokenChange={(token) => { setCaptchaToken(token); if (token) setCaptchaError(''); }} error={captchaError} />
      </div>
      <FormError message={f.status === 'error' ? f.result?.error || 'Please check the highlighted fields.' : undefined} />
      <div className="form-nav"><Submit sending={f.status === 'sending'}>Download the brochure</Submit></div>
    </form>
  );
}
