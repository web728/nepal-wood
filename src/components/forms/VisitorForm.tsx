
'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

import Icon from '../Icon';
import { useLeadForm } from './useLeadForm';

import {
  TextInput,
  ConsentCheck,
  Honeypot,
  FormError,
  Submit,
} from './Fields';

import { visitorSchema } from '@/lib/forms';

export default function VisitorForm() {
  const router = useRouter();

  const f = useLeadForm('visitor', visitorSchema, {
    name: '',
    company: '',
    designation: '',
    phone: '',
    email: '',
    businessType: '',
    country: '',
    consent: false,
  });

  const v = f.values;
  const sending = f.status === 'sending';

  useEffect(() => {
    if (
      f.status === 'done' &&
      f.result?.badgeUrl
    ) {
      const url = f.result.badgeUrl;
      const suffix = f.result.existing
        ? '?existing=1'
        : '?new=1';

      router.push(`${url}${suffix}`);
    }
  }, [f.status, f.result, router]);

  if (f.status === 'done') {
    return (
      <section
        className="form-done"
        role="status"
        aria-live="polite"
      >
        <span className="form-done__icon">
          <Icon name="badge" />
        </span>

        <h2 className="h-md">
          Registration successful.
        </h2>

        <p>
          Opening your visitor QR badge...
        </p>

        {f.result?.ref && (
          <p className="form-done__ref">
            Badge ID: <strong>{f.result.ref}</strong>
          </p>
        )}
      </section>
    );
  }

  return (
    <form
      className="lead-form"
      onSubmit={f.submit}
      noValidate
    >
      <Honeypot inputRef={f.honeypot} />

      <h3 className="lead-form__group">
        Visitor registration
      </h3>

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
          label="Company / organisation"
          required
          value={v.company}
          onChange={(x) => f.set('company', x)}
          error={f.errors.company}
          autoComplete="organization"
        />

        <TextInput
          name="designation"
          label="Designation"
          required
          value={v.designation}
          onChange={(x) => f.set('designation', x)}
          error={f.errors.designation}
          autoComplete="organization-title"
        />

        <TextInput
          name="phone"
          label="Mobile / WhatsApp"
          type="tel"
          required
          value={v.phone}
          onChange={(x) => f.set('phone', x)}
          error={f.errors.phone}
          autoComplete="tel"
          inputMode="tel"
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
          name="businessType"
          label="Business / category (optional)"
          value={v.businessType}
          onChange={(x) => f.set('businessType', x)}
          error={f.errors.businessType}
          placeholder="e.g. Manufacturer, Dealer, Architect"
        />

        <TextInput
          name="country"
          label="Country"
          required
          value={v.country}
          onChange={(x) => f.set('country', x)}
          error={f.errors.country}
          autoComplete="country-name"
        />

        <div className="span-2 form-checks">
          <ConsentCheck
            checked={v.consent}
            onChange={(x) => f.set('consent', x)}
            error={f.errors.consent}
            purpose="to process my registration and issue my visitor badge"
          />
        </div>
      </div>

      <FormError
        message={
          f.status === 'error'
            ? f.result?.error ||
              'Please check the highlighted fields.'
            : undefined
        }
      />

      <div className="form-nav">
        <Submit sending={sending}>
          Register &amp; get QR badge
        </Submit>
      </div>

      <p className="form-foot small muted">
        Already registered? Submit the
        same email to access your existing badge.
      </p>
    </form>
  );
}
