'use client';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import Icon from '../Icon';
import { useLeadForm } from './useLeadForm';
import { TextInput, Select, Chips, Check, ConsentCheck, Honeypot, FormError, Submit } from './Fields';
import { visitorSchema } from '@/lib/forms';
import { countries, businessTypes, interestOptions, heardFrom } from '@/lib/content';

const initial = {
  name: '', designation: '', company: '', businessType: '', email: '', phone: '',
  country: 'Nepal', city: 'Kathmandu', interests: [] as string[], heardFrom: '', updates: true, consent: false as boolean,
};

export default function VisitorForm() {
  const router = useRouter();
  const f = useLeadForm('visitor', visitorSchema, initial);
  const v = f.values;

  useEffect(() => {
    if (f.status === 'done' && f.result?.badgeUrl) router.push(`${f.result.badgeUrl}${f.result.existing ? '?existing=1' : '?new=1'}`);
  }, [f.status, f.result, router]);

  if (f.status === 'done') {
    return (
      <div className="form-done" role="status">
        <span className="form-done__icon"><Icon name="badge" /></span>
        <h2 className="h-md">You’re registered.</h2>
        <p>Opening your QR badge…</p>
      </div>
    );
  }

  return (
    <form className="lead-form" onSubmit={f.submit} noValidate>
      <Honeypot inputRef={f.honeypot} />
      <h3 className="lead-form__group">About you</h3>
      <div className="form-grid">
        <TextInput name="name" label="Full name" required value={v.name} onChange={(x) => f.set('name', x)} error={f.errors.name} autoComplete="name" hint="As it should appear on your badge." />
        <TextInput name="designation" label="Designation" required value={v.designation} onChange={(x) => f.set('designation', x)} error={f.errors.designation} autoComplete="organization-title" placeholder="e.g. Owner, Architect, Purchase Manager" />
        <TextInput name="company" label="Company / practice" required value={v.company} onChange={(x) => f.set('company', x)} error={f.errors.company} autoComplete="organization" />
        <Select name="businessType" label="Business type" required value={v.businessType} onChange={(x) => f.set('businessType', x)} options={businessTypes} error={f.errors.businessType} />
        <TextInput name="email" label="Email" type="email" required value={v.email} onChange={(x) => f.set('email', x)} error={f.errors.email} autoComplete="email" inputMode="email" hint="Your badge is linked to this email." />
        <TextInput name="phone" label="Mobile / WhatsApp" type="tel" required value={v.phone} onChange={(x) => f.set('phone', x)} error={f.errors.phone} autoComplete="tel" inputMode="tel" placeholder="+977 98…" />
        <Select name="country" label="Country" value={v.country} onChange={(x) => f.set('country', x)} options={countries} />
        <TextInput name="city" label="City" required value={v.city} onChange={(x) => f.set('city', x)} error={f.errors.city} autoComplete="address-level2" />
      </div>
      <h3 className="lead-form__group">What are you looking for?</h3>
      <div className="form-grid">
        <Chips name="interests" label="Product interests" required options={interestOptions.filter((o) => o !== 'Associations & government')} selected={v.interests} onToggle={(x) => f.toggleIn('interests', x)} error={f.errors.interests} hint="We’ll point you to the right halls and send relevant exhibitor news." />
        <Select name="heardFrom" label="How did you hear about the expo?" value={v.heardFrom} onChange={(x) => f.set('heardFrom', x)} options={heardFrom} placeholder="Optional" />
      </div>
      <div className="form-checks">
        <Check name="updates" checked={v.updates} onChange={(x) => f.set('updates', x)}>Send me the seminar schedule, exhibitor list and show updates</Check>
        <ConsentCheck checked={v.consent} onChange={(x) => f.set('consent', x)} error={f.errors.consent} purpose="to issue my visitor badge and send show information" />
      </div>
      <FormError message={f.status === 'error' ? f.result?.error || 'Please check the highlighted fields.' : undefined} />
      <div className="form-nav"><Submit sending={f.status === 'sending'}>Get my free QR badge</Submit></div>
      <p className="form-foot small muted">Already registered? Use the same email and we’ll show your existing badge.</p>
    </form>
  );
}
