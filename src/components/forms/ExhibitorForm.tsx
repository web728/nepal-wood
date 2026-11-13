'use client';
import { useState } from 'react';
import Link from 'next/link';
import Icon from '../Icon';
import { useLeadForm } from './useLeadForm';
import { TextInput, TextArea, Select, Chips, Choice, Check, ConsentCheck, Honeypot, FormError, Submit } from './Fields';
import { exhibitorSchema, standTypeLabel } from '@/lib/forms';
import { countries } from '@/lib/content';
import { zones } from '@/lib/content';
import { contacts, downloads, telHref, waHref } from '@/lib/site';

const initial = {
  company: '', website: '', country: 'Nepal', city: '', zones: [] as string[], products: '',
  standType: 'shell' as 'shell' | 'raw' | 'premium' | 'not-sure', areaSqm: 9 as number, heavyMachinery: false, powerNeeds: '', sponsorship: false,
  name: '', designation: '', email: '', phone: '', whatsappSame: true, message: '', updates: true, consent: false as boolean,
};

const steps = [
  { t: 'Your business', keys: ['company', 'website', 'country', 'city', 'zones', 'products'] },
  { t: 'Your stand', keys: ['standType', 'areaSqm', 'heavyMachinery', 'powerNeeds', 'sponsorship'] },
  { t: 'Your details', keys: ['name', 'designation', 'email', 'phone', 'message', 'updates', 'consent'] },
] as const;

const sizes = [9, 12, 18, 27, 36, 54, 72, 100];

export default function ExhibitorForm({ defaultZone }: { defaultZone?: string }) {
  const f = useLeadForm('exhibitor', exhibitorSchema, { ...initial, zones: defaultZone ? [defaultZone] : [] });
  const [step, setStep] = useState(0);
  const v = f.values;

  if (f.status === 'done' && f.result?.ref) {
    return (
      <div className="form-done" role="status">
        <span className="form-done__icon"><Icon name="check" /></span>
        <h2 className="h-md">Thank you. Your enquiry is in.</h2>
        <p>Our sales team will reply within one working day with the floor plan, available positions and a quote for <strong>{v.company}</strong>.</p>
        <p className="form-done__ref">Your reference <strong>{f.result.ref}</strong></p>
        <div className="form-done__actions">
          <a className="btn" href={downloads.brochure.file} download>Download the 2027 brochure<Icon name="download" className="arrow" /></a>
          <a className="btn btn--ghost" href={waHref(contacts[0].whatsapp, `Hello, I just sent stand enquiry ${f.result.ref} for ${v.company}.`)} target="_blank" rel="noopener"><Icon name="whatsapp" className="arrow" />WhatsApp the sales team</a>
        </div>
        <p className="small muted">Need it sooner? Call {contacts[0].name} on <a href={telHref(contacts[0].phone)}>{contacts[0].phone}</a>.</p>
      </div>
    );
  }

  const next = () => {
    if (f.validateFields(steps[step].keys as unknown as (keyof typeof initial)[])) {
      setStep((s) => Math.min(s + 1, steps.length - 1));
      requestAnimationFrame(() => document.getElementById('stand-form')?.scrollIntoView({ block: 'start', behavior: 'smooth' }));
    }
  };

  return (
    <form id="stand-form" className="lead-form" onSubmit={step === steps.length - 1 ? f.submit : (e) => { e.preventDefault(); next(); }} noValidate>
      <ol className="steps" aria-label="Form progress">
        {steps.map((s, i) => (
          <li key={s.t} className={i === step ? 'is-current' : i < step ? 'is-done' : ''}>
            <button type="button" onClick={() => i < step && setStep(i)} disabled={i > step} aria-current={i === step ? 'step' : undefined}>
              <span className="steps__no">{i < step ? <Icon name="check" /> : i + 1}</span>{s.t}
            </button>
          </li>
        ))}
      </ol>

      <Honeypot inputRef={f.honeypot} />

      {step === 0 && (
        <div className="form-grid">
          <TextInput name="company" label="Company name" required value={v.company} onChange={(x) => f.set('company', x)} error={f.errors.company} autoComplete="organization" />
          <TextInput name="website" label="Website" value={v.website} onChange={(x) => f.set('website', x)} placeholder="www.yourcompany.com" autoComplete="url" />
          <Select name="country" label="Country" required value={v.country} onChange={(x) => f.set('country', x)} options={countries} error={f.errors.country} />
          <TextInput name="city" label="City" required value={v.city} onChange={(x) => f.set('city', x)} error={f.errors.city} autoComplete="address-level2" />
          <Chips name="zones" label="What will you exhibit?" required options={zones.map((z) => z.title)} selected={v.zones} onToggle={(x) => f.toggleIn('zones', x)} error={f.errors.zones} hint="Choose all that apply." />
          <TextArea name="products" label="Products or brands to display" value={v.products} onChange={(x) => f.set('products', x)} rows={3} placeholder="e.g. CNC nesting machines, edge banders; or HPL laminates, 1 mm & 0.8 mm" className="span-2" />
        </div>
      )}

      {step === 1 && (
        <div className="form-grid">
          <Choice name="standType" label="Stand type" value={v.standType} onChange={(x) => { f.set('standType', x); if (x === 'raw' && v.areaSqm < 18) f.set('areaSqm', 18); }}
            options={[
              { value: 'shell', label: standTypeLabel.shell, desc: 'Ready-built, from 9 sqm' },
              { value: 'raw', label: standTypeLabel.raw, desc: 'Bare floor, from 18 sqm' },
              { value: 'premium', label: standTypeLabel.premium, desc: 'Corner, island, 36 sqm+' },
              { value: 'not-sure', label: standTypeLabel['not-sure'], desc: 'We’ll recommend one' },
            ]} />
          <div className="field span-2" data-field="areaSqm">
            <label htmlFor="f-areaSqm">Approximate area (sqm) *</label>
            <div className="sizes">
              {sizes.map((s) => <button type="button" key={s} className={`chip${v.areaSqm === s ? ' is-on' : ''}`} aria-pressed={v.areaSqm === s} onClick={() => f.set('areaSqm', s)}>{s} sqm</button>)}
              <input id="f-areaSqm" name="areaSqm" type="number" min={9} max={2000} inputMode="numeric" value={v.areaSqm} onChange={(e) => f.set('areaSqm', Number(e.target.value))} aria-label="Custom area in square metres" />
            </div>
            <p className="field__hint">A 3 m × 3 m shell stand is 9 sqm. Machinery stands usually start at 18–36 sqm.</p>
            {f.errors.areaSqm && <p className="field__error" role="alert">{f.errors.areaSqm}</p>}
          </div>
          <Check name="heavyMachinery" checked={v.heavyMachinery} onChange={(x) => f.set('heavyMachinery', x)}>I will run live machinery demonstrations or bring heavy equipment</Check>
          {v.heavyMachinery && (
            <TextArea name="powerNeeds" label="Power and handling needs" value={v.powerNeeds} onChange={(x) => f.set('powerNeeds', x)} rows={3} className="span-2"
              placeholder="e.g. 2 machines, approx. 3.5 t total; 3-phase 415 V, 25 kW; compressed air; forklift unloading" />
          )}
          <Check name="sponsorship" checked={v.sponsorship} onChange={(x) => f.set('sponsorship', x)}>Send me sponsorship options too (badges, seminars, venue branding)</Check>
        </div>
      )}

      {step === 2 && (
        <div className="form-grid">
          <TextInput name="name" label="Your name" required value={v.name} onChange={(x) => f.set('name', x)} error={f.errors.name} autoComplete="name" />
          <TextInput name="designation" label="Designation" required value={v.designation} onChange={(x) => f.set('designation', x)} error={f.errors.designation} autoComplete="organization-title" />
          <TextInput name="email" label="Work email" type="email" required value={v.email} onChange={(x) => f.set('email', x)} error={f.errors.email} autoComplete="email" inputMode="email" />
          <TextInput name="phone" label="Phone / WhatsApp" type="tel" required value={v.phone} onChange={(x) => f.set('phone', x)} error={f.errors.phone} autoComplete="tel" inputMode="tel" placeholder="+977 98… or +91 98…" />
          <TextArea name="message" label="Anything else we should know?" value={v.message} onChange={(x) => f.set('message', x)} rows={3} className="span-2" placeholder="Preferred position, launch plans, number of staff, questions…" />
          <div className="span-2 form-checks">
            <Check name="updates" checked={v.updates} onChange={(x) => f.set('updates', x)}>Send me exhibitor updates and the visitor promotion plan</Check>
            <ConsentCheck checked={v.consent} onChange={(x) => f.set('consent', x)} error={f.errors.consent} purpose="to prepare my stand quote and follow up about the expo" />
          </div>
        </div>
      )}

      <FormError message={f.status === 'error' ? f.result?.error || 'Please check the highlighted fields.' : undefined} />

      <div className="form-nav">
        {step > 0 && <button type="button" className="btn btn--ghost" onClick={() => setStep((s) => s - 1)}>Back</button>}
        {step < steps.length - 1 ? (
          <button type="submit" className="btn">Continue<Icon name="arrow" className="arrow" /></button>
        ) : (
          <Submit sending={f.status === 'sending'}>Send stand enquiry</Submit>
        )}
      </div>
      <p className="form-foot small muted">Takes about two minutes. No payment now: you’ll get a quote first. <Link href="/sponsorship">Looking for sponsorship?</Link></p>
    </form>
  );
}
