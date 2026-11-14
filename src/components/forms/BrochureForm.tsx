'use client';
import { useEffect } from 'react';
import Icon from '../Icon';
import { useLeadForm } from './useLeadForm';
import { TextInput, Choice, ConsentCheck, Honeypot, FormError, Submit } from './Fields';
import { brochureSchema } from '@/lib/forms';
import { downloads } from '@/lib/site';

type Interest = 'exhibiting' | 'visiting' | 'sponsoring';

export default function BrochureForm() {
  const f = useLeadForm('brochure', brochureSchema, { name: '', email: '', phone: '', company: '', interest: 'exhibiting' as Interest, consent: false as boolean });
  const v = f.values;

  // Start the download automatically once the lead is saved.
  useEffect(() => {
    if (f.status === 'done' && f.result?.download) {
      const a = document.createElement('a');
      a.href = f.result.download;
      a.download = '';
      document.body.appendChild(a);
      a.click();
      a.remove();
    }
  }, [f.status, f.result]);

  if (f.status === 'done') {
    return (
      <div className="form-done" role="status">
        <span className="form-done__icon"><Icon name="download" /></span>
        <h2 className="h-md">Your download has started.</h2>
        <p>If it didn’t, use the button below. The brochure is a {downloads.brochure.size} PDF.</p>
        <div className="form-done__actions">
          <a className="btn" href={downloads.brochure.file} download>Download the brochure<Icon name="download" className="arrow" /></a>
          {v.interest === 'exhibiting' && <a className="btn btn--ghost" href="/exhibitor-registration">Book a stand</a>}
          {v.interest === 'visiting' && <a className="btn btn--ghost" href="/visitor-registration">Get your free badge</a>}
          {v.interest === 'sponsoring' && <a className="btn btn--ghost" href="/sponsorship">Sponsorship options</a>}
        </div>
      </div>
    );
  }
  return (
    <form className="lead-form" onSubmit={f.submit} noValidate>
      <Honeypot inputRef={f.honeypot} />
      <div className="form-grid">
        <TextInput name="name" label="Your name" required value={v.name} onChange={(x) => f.set('name', x)} error={f.errors.name} autoComplete="name" />
        <TextInput name="company" label="Company" required value={v.company} onChange={(x) => f.set('company', x)} error={f.errors.company} autoComplete="organization" />
        <TextInput name="email" label="Email" type="email" required value={v.email} onChange={(x) => f.set('email', x)} error={f.errors.email} autoComplete="email" inputMode="email" />
        <TextInput name="phone" label="Phone / WhatsApp" type="tel" required value={v.phone} onChange={(x) => f.set('phone', x)} error={f.errors.phone} autoComplete="tel" inputMode="tel" />
       
<Choice
  name="interest"
  label="I'm interested in"
  value={v.interest}
  onChange={(x) => f.set('interest', x)}
  options={[
    {
      value: 'exhibiting',
      label: 'Exhibiting',
      desc: 'Book a stand',
    },
    {
      value: 'visiting',
      label: 'Visiting',
      desc: 'Explore the expo',
    },
    {
      value: 'sponsoring',
      label: 'Sponsoring',
      desc: 'Brand opportunities',
    },
  ]}
/>

      </div>
      <div className="form-checks"><ConsentCheck checked={v.consent} onChange={(x) => f.set('consent', x)} error={f.errors.consent} purpose="to send me the brochure and follow up about the expo" /></div>
      <FormError message={f.status === 'error' ? f.result?.error || 'Please check the highlighted fields.' : undefined} />
      <div className="form-nav"><Submit sending={f.status === 'sending'}>Download the brochure</Submit></div>
    </form>
  );
}
