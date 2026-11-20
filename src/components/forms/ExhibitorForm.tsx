
'use client';

import { useState } from 'react';
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
import { exhibitorSchema } from '@/lib/forms';

const boothOptions = [
  { value: '9 sqm', label: '9 sqm' },
  { value: '18 sqm', label: '18 sqm' },
  { value: '32 sqm', label: '32 sqm' },
  { value: '36 sqm', label: '36 sqm' },
  { value: '54 sqm', label: '54 sqm' },
  { value: '72 sqm', label: '72 sqm' },
  { value: 'Custom', label: 'Other / custom size' },
];

type Props = {
  defaultZone?: string;
};

export default function ExhibitorForm({
  defaultZone,
}: Props) {
  const f = useLeadForm('exhibitor', exhibitorSchema, {
    company: '',
    designation: '',
    name: '',
    email: '',
    phone: '',
    country: '',
    products: '',
    boothSize: '',
    consent: false,
  });

  const [sizeChoice, setSizeChoice] = useState('');
  const v = f.values;
  const sending = f.status === 'sending';

  if (f.status === 'done') {
    return (
      <section
        className="form-done"
        role="status"
        aria-live="polite"
      >
        <span className="form-done__icon">
          <Icon name="check" />
        </span>

        <h2 className="h-md">
          Exhibitor enquiry received.
        </h2>

        <p>
          Thank you. Our exhibition team will
          contact you about booth availability
          and participation details.
        </p>

        {f.result?.ref && (
          <p className="form-done__ref">
            Reference: <strong>{f.result.ref}</strong>
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
        Exhibitor registration
      </h3>

      <div className="form-grid">
        <TextInput
          name="company"
          label="Company name"
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
          name="name"
          label="Contact person"
          required
          value={v.name}
          onChange={(x) => f.set('name', x)}
          error={f.errors.name}
          autoComplete="name"
        />

        <TextInput
          name="email"
          label="Business email"
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
          name="country"
          label="Country"
          required
          value={v.country}
          onChange={(x) => f.set('country', x)}
          error={f.errors.country}
          autoComplete="country-name"
        />

        <TextArea
          name="products"
          label="Products and services"
          value={v.products}
          onChange={(x) => f.set('products', x)}
          rows={4}
          className="span-2"
          placeholder="Describe the products and services you offer..."
        />

        <Select
          name="boothSizeChoice"
          label="Preferred booth size (optional)"
          value={sizeChoice}
          onChange={(choice) => {
            setSizeChoice(choice);
            f.set(
              'boothSize',
              choice === 'Custom' ? '' : choice
            );
          }}
          options={boothOptions}
          placeholder="Select preferred size"
          className="span-2"
        />

        {sizeChoice === 'Custom' && (
          <TextInput
            name="boothSize"
            label="Custom booth size"
            value={v.boothSize}
            onChange={(x) => f.set('boothSize', x)}
            error={f.errors.boothSize}
            placeholder="e.g. 45 sqm or 6m x 8m"
            className="span-2"
          />
        )}

        <div className="span-2 form-checks">
          <ConsentCheck
            checked={v.consent}
            onChange={(x) => f.set('consent', x)}
            error={f.errors.consent}
            purpose="to process my exhibitor enquiry and contact me"
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
          Submit exhibitor enquiry
        </Submit>
      </div>

      <p className="form-foot small muted">
        Our exhibition team will contact you
        after reviewing your request.
      </p>
    </form>
  );
}
