'use client';

import Icon from '../Icon';
import { useLeadForm } from './useLeadForm';
import { useCaptchaSubmit } from './useCaptchaSubmit';
import RecaptchaCheckbox from './RecaptchaCheckbox';
import { TextInput, TextArea, Select, ConsentCheck, Honeypot, FormError, Submit } from './Fields';
import { enquirySchema, topicLabel } from '@/lib/forms';
import './form-captcha.css';

type Topic = 'exhibiting' | 'sponsorship' | 'visiting' | 'media' | 'other';

const topicOptions = (Object.entries(topicLabel) as [Topic, string][]).map(([value, label]) => ({ value, label }));

export default function EnquiryForm({ topic = 'exhibiting' }: { topic?: Topic }) {
  const form = useLeadForm('enquiry', enquirySchema, {
    topic, name: '', email: '', phone: '', company: '', message: '', consent: false,
  });
  const captcha = useCaptchaSubmit(form.status, form.submit);
  const v = form.values;

  if (form.status === 'done') {
    return (
      <section className="form-done enquiry-done" role="status" aria-live="polite">
        <span className="form-done__icon"><Icon name="check" /></span>
        <h2 className="h-md">Message received.</h2>
        <p>Thanks, {v.name.trim().split(/\s+/)[0]}. Our team will review your enquiry and get back to you.</p>
      </section>
    );
  }

  return (
    <form className="lead-form enquiry" onSubmit={captcha.onSubmit} noValidate aria-busy={form.status === 'sending'}>
      <Honeypot inputRef={form.honeypot} />
      <div className="form-grid">
        <Select name="topic" label="Enquiry topic" value={v.topic} onChange={(x) => form.set('topic', x as Topic)} options={topicOptions} className="span-2" />
        <TextInput name="name" label="Full name" required value={v.name} onChange={(x) => form.set('name', x)} error={form.errors.name} autoComplete="name" />
        <TextInput name="company" label="Company (optional)" value={v.company} onChange={(x) => form.set('company', x)} error={form.errors.company} autoComplete="organization" />
        <TextInput name="email" label="Email address" type="email" required value={v.email} onChange={(x) => form.set('email', x)} error={form.errors.email} autoComplete="email" inputMode="email" />
        <TextInput name="phone" label="Phone / WhatsApp" type="tel" required value={v.phone} onChange={(x) => form.set('phone', x)} error={form.errors.phone} autoComplete="tel" inputMode="tel" />
        <TextArea name="message" label="Your message" required value={v.message} onChange={(x) => form.set('message', x)} error={form.errors.message} rows={4} className="span-2" placeholder="How can we help you?" />
      </div>
      <div className="form-checks">
        <ConsentCheck checked={v.consent} onChange={(x) => form.set('consent', x)} error={form.errors.consent} purpose="to reply to my enquiry" />
        <RecaptchaCheckbox resetRef={captcha.resetRef} onTokenChange={captcha.onTokenChange} error={captcha.error} />
      </div>
      <FormError message={form.status === 'error' ? form.result?.error || 'Please check your details and try again.' : undefined} />
      <div className="form-nav"><Submit sending={form.status === 'sending'}>Send message</Submit></div>
    </form>
  );
}
