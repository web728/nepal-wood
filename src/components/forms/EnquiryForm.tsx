'use client';
import Icon from '../Icon';
import { useLeadForm } from './useLeadForm';
import { TextInput, TextArea, Select, ConsentCheck, Honeypot, FormError, Submit } from './Fields';
import { enquirySchema, topicLabel } from '@/lib/forms';

type Topic = 'exhibiting' | 'sponsorship' | 'visiting' | 'media' | 'other';

export default function EnquiryForm({ topic = 'exhibiting' as Topic }: { topic?: Topic }) {
  const f = useLeadForm('enquiry', enquirySchema, { topic, name: '', email: '', phone: '', company: '', message: '', consent: false as boolean });
  const v = f.values;
  if (f.status === 'done') {
    return (
      <div className="form-done" role="status">
        <span className="form-done__icon"><Icon name="check" /></span>
        <h2 className="h-md">Message received.</h2>
        <p>Thank you, {v.name.split(' ')[0]}. The right person on the team will reply within one working day.</p>
        <p className="form-done__ref">Reference <strong>{f.result?.ref}</strong></p>
      </div>
    );
  }
  return (
    <form className="lead-form" onSubmit={f.submit} noValidate>
      <Honeypot inputRef={f.honeypot} />
      <div className="form-grid">
        <Select name="topic" label="Topic" value={v.topic} onChange={(x) => f.set('topic', x as Topic)} options={Object.entries(topicLabel).map(([value, label]) => ({ value, label }))} className="span-2" />
        <TextInput name="name" label="Your name" required value={v.name} onChange={(x) => f.set('name', x)} error={f.errors.name} autoComplete="name" />
        <TextInput name="company" label="Company" value={v.company} onChange={(x) => f.set('company', x)} autoComplete="organization" />
        <TextInput name="email" label="Email" type="email" required value={v.email} onChange={(x) => f.set('email', x)} error={f.errors.email} autoComplete="email" inputMode="email" />
        <TextInput name="phone" label="Phone / WhatsApp" type="tel" required value={v.phone} onChange={(x) => f.set('phone', x)} error={f.errors.phone} autoComplete="tel" inputMode="tel" />
        <TextArea name="message" label="Message" required value={v.message} onChange={(x) => f.set('message', x)} error={f.errors.message} rows={5} className="span-2" />
      </div>
      <div className="form-checks"><ConsentCheck checked={v.consent} onChange={(x) => f.set('consent', x)} error={f.errors.consent} purpose="to reply to my enquiry" /></div>
      <FormError message={f.status === 'error' ? f.result?.error || 'Please check the highlighted fields.' : undefined} />
      <div className="form-nav"><Submit sending={f.status === 'sending'}>Send message</Submit></div>
    </form>
  );
}
