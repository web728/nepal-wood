'use client';

import Icon from '../Icon';
import { useLeadForm } from './useLeadForm';
import {
  TextInput,
  TextArea,
  Select,
  ConsentCheck,
  Honeypot,
  FormError,
  Submit,
} from './Fields';
import { enquirySchema, topicLabel } from '@/lib/forms';
import './enquiry-form.css'; // Remove this line if you import the CSS in a global stylesheet.

type Topic = 'exhibiting' | 'sponsorship' | 'visiting' | 'media' | 'other';

const topicHelp: Record<Topic, string> = {
  exhibiting: 'Ask about exhibition space, stand options, and participation.',
  sponsorship: 'Explore partnership and sponsorship opportunities.',
  visiting: 'Ask about visiting, registration, or event information.',
  media: 'Request press information, interviews, or media assistance.',
  other: 'Tell us what you need, and we will direct your enquiry.',
};

const topicOptions = Object.entries(topicLabel).map(([value, label]) => ({
  value,
  label,
}));

export default function EnquiryForm({
  topic = 'exhibiting',
}: {
  topic?: Topic;
}) {
  const f = useLeadForm('enquiry', enquirySchema, {
    topic,
    name: '',
    email: '',
    phone: '',
    company: '',
    message: '',
    consent: false as boolean,
  });

  const v = f.values;
  const sending = f.status === 'sending';

  if (f.status === 'done') {
    const firstName = v.name.trim().split(/\s+/)[0] || 'there';

    return (
      <section className="enquiry-done form-done" role="status" aria-live="polite">
        <span className="form-done__icon" aria-hidden="true">
          <Icon name="check" />
        </span>
        <span className="enquiry__eyebrow">Enquiry submitted</span>
        <h2 className="h-md">Message received.</h2>
        <p>
          Thank you, {firstName}. Your enquiry has been submitted. Our team will
          review it and get back to you.
        </p>
        {f.result?.ref && (
          <p className="form-done__ref">
            Reference <strong>{f.result.ref}</strong>
          </p>
        )}
        <p className="enquiry-done__note">Please save the reference if one was provided.</p>
      </section>
    );
  }

  return (
    <section className="enquiry" aria-labelledby="enquiry-heading">
      <header className="enquiry__intro">
        <span className="enquiry__eyebrow">
          <span className="enquiry__status-dot" aria-hidden="true" />
          Contact our team
        </span>
        <h2 id="enquiry-heading">How can we help?</h2>
        <p>
          Share a few details about your enquiry. We will connect you with the
          relevant team member.
        </p>
        <div className="enquiry__intro-bottom">
          <span>Quick enquiry form</span>
          <span>Fields marked * are required</span>
        </div>
      </header>

      <form className="lead-form enquiry__form" onSubmit={f.submit} noValidate>
        <Honeypot inputRef={f.honeypot} />

        <fieldset className="enquiry__fieldset" disabled={sending}>
          <div className="enquiry__section-title">
            <span className="enquiry__section-number">01</span>
            <h3>What is your enquiry about?</h3>
          </div>
          <div className="form-grid">
            <Select
              name="topic"
              label="Enquiry topic"
              value={v.topic}
              onChange={(x) => f.set('topic', x as Topic)}
              options={topicOptions}
              className="span-2"
            />
            <p className="enquiry__topic-help span-2" aria-live="polite">
              {topicHelp[v.topic as Topic] ?? topicHelp.other}
            </p>
          </div>

          <div className="enquiry__section-title">
            <span className="enquiry__section-number">02</span>
            <h3>Your contact details</h3>
          </div>
          <div className="form-grid">
            <TextInput
              name="name"
              label="Full name"
              required
              value={v.name}
              onChange={(x) => f.set('name', x)}
              error={f.errors.name}
              autoComplete="name"
            />
            <TextInput
              name="company"
              label="Company (optional)"
              value={v.company}
              onChange={(x) => f.set('company', x)}
              autoComplete="organization"
            />
            <TextInput
              name="email"
              label="Email address"
              type="email"
              required
              value={v.email}
              onChange={(x) => f.set('email', x)}
              error={f.errors.email}
              autoComplete="email"
              inputMode="email"
            />
            <TextInput
              name="phone"
              label="Phone / WhatsApp"
              type="tel"
              required
              value={v.phone}
              onChange={(x) => f.set('phone', x)}
              error={f.errors.phone}
              autoComplete="tel"
              inputMode="tel"
            />
          </div>

          <div className="enquiry__section-title">
            <span className="enquiry__section-number">03</span>
            <h3>Tell us more</h3>
          </div>
          <div className="form-grid">
            <TextArea
              name="message"
              label="Your message"
              required
              value={v.message}
              onChange={(x) => f.set('message', x)}
              error={f.errors.message}
              rows={5}
              className="span-2"
            />
          </div>

          <div className="form-checks enquiry__consent">
            <ConsentCheck
              checked={v.consent}
              onChange={(x) => f.set('consent', x)}
              error={f.errors.consent}
              purpose="to reply to my enquiry"
            />
          </div>
        </fieldset>

        <FormError
          message={
            f.status === 'error'
              ? f.result?.error || 'Please check the highlighted fields.'
              : undefined
          }
        />

        <div className="enquiry__submit-row">
          <p className="enquiry__submit-hint">
            Check your details before sending. We will use them to respond to your request.
          </p>
          <div className="form-nav">
            <Submit sending={sending}>Send enquiry</Submit>
          </div>
        </div>
      </form>
    </section>
  );
}
