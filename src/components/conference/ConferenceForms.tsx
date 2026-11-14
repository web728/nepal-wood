
'use client';

import {
  useRef,
  useState,
  type FormEvent,
} from 'react';

import Icon from '@/components/Icon';

import {
  speakerSchema,
  attendeeSchema,
  seminarOptions,
  attendeeInterests,
  industryOptions,
  type SpeakerInput,
  type AttendeeInput,
} from '@/lib/conference';

import { fieldErrors } from '@/lib/forms';

type Status = 'idle' | 'sending' | 'done' | 'error';

type TextKey =
  | 'name'
  | 'email'
  | 'phone'
  | 'organization'
  | 'designation'
  | 'country';

const initialBase = {
  name: '',
  email: '',
  phone: '',
  organization: '',
  designation: '',
  country: '',
  consent: false,
  website_url: '',
};

const speakerInitial = {
  ...initialBase,
  registration_type: 'speaker' as const,
  topic: '' as SpeakerInput['topic'],
  professional_bio: '',
  abstract: '',
  profile_url: '',
};

const attendeeInitial = {
  ...initialBase,
  registration_type: 'attendee' as const,
  industry: '' as AttendeeInput['industry'],
  session_interest: '' as AttendeeInput['session_interest'],
  question: '',
};

type FormKind = 'speaker' | 'attendee';

type FormDataState =
  | typeof speakerInitial
  | typeof attendeeInitial;

// TEXT INPUT
function Input({
  id,
  label,
  value,
  onChange,
  error,
  required = true,
  type = 'text',
  autoComplete,
  placeholder,
  full = false,
}: {
  id: string;
  label: string;
  value: string;
  onChange: (v: string) => void;
  error?: string;
  required?: boolean;
  type?: string;
  autoComplete?: string;
  placeholder?: string;
  full?: boolean;
}) {
  return (
    <div
      className={`field${full ? ' span-2' : ''}${
        error ? ' field--error' : ''
      }`}
    >
      <label htmlFor={id}>
        {label}
        {required && ' *'}
      </label>

      <input
        id={id}
        type={type}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        autoComplete={autoComplete}
        placeholder={placeholder}
        aria-invalid={!!error}
        aria-describedby={error ? `${id}-error` : undefined}
        required={required}
      />

      {error && (
        <p className="field__error" id={`${id}-error`}>
          {error}
        </p>
      )}
    </div>
  );
}

// SELECT INPUT
function SelectField({
  id,
  label,
  value,
  onChange,
  options,
  error,
}: {
  id: string;
  label: string;
  value: string;
  onChange: (v: string) => void;
  options: readonly {
    value: string;
    label: string;
  }[];
  error?: string;
}) {
  return (
    <div className={`field span-2${error ? ' field--error' : ''}`}>
      <label htmlFor={id}>{label} *</label>

      <div className="select">
        <select
          id={id}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          aria-invalid={!!error}
          required
        >
          <option value="">Select an option</option>

          {options.map((o) => (
            <option value={o.value} key={o.value}>
              {o.label}
            </option>
          ))}
        </select>

        <Icon name="chevron-down" />
      </div>

      {error && <p className="field__error">{error}</p>}
    </div>
  );
}

// TEXTAREA
function Area({
  id,
  label,
  value,
  onChange,
  error,
  placeholder,
  required = true,
}: {
  id: string;
  label: string;
  value: string;
  onChange: (v: string) => void;
  error?: string;
  placeholder?: string;
  required?: boolean;
}) {
  return (
    <div className={`field span-2${error ? ' field--error' : ''}`}>
      <label htmlFor={id}>
        {label}
        {required && ' *'}
      </label>

      <textarea
        id={id}
        rows={4}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        required={required}
        aria-invalid={!!error}
      />

      {error && <p className="field__error">{error}</p>}
    </div>
  );
}

const industryChoices = industryOptions.map((x) => ({
  value: x,
  label: x,
}));

// SHARED FORM
function RegistrationForm({ kind }: { kind: FormKind }) {
  const isSpeaker = kind === 'speaker';

  const [values, setValues] = useState<FormDataState>(
    isSpeaker ? speakerInitial : attendeeInitial
  );

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [status, setStatus] = useState<Status>('idle');
  const [message, setMessage] = useState('');
  const [reference, setReference] = useState('');

  const startedAt = useRef(Date.now());
  const busy = useRef(false);

  const set = (key: string, value: string | boolean) => {
    setValues((v) => ({
      ...v,
      [key]: value,
    } as FormDataState));

    setErrors((e) => ({
      ...e,
      [key]: '',
    }));

    if (status === 'error') {
      setStatus('idle');
      setMessage('');
    }
  };

  // SUBMISSION
  async function submit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();

    if (busy.current) return;

    const payload = {
      ...values,
      startedAt: startedAt.current,
    };

    const checked = isSpeaker
      ? speakerSchema.safeParse(payload)
      : attendeeSchema.safeParse(payload);

    if (!checked.success) {
      setErrors(fieldErrors(checked.error));
      setStatus('error');
      setMessage('Please check the highlighted fields.');
      return;
    }

    busy.current = true;
    setStatus('sending');
    setMessage('');

    try {
      const response = await fetch('/api/conclave/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(checked.data),
        cache: 'no-store',
      });

      const json = (await response.json().catch(() => ({}))) as {
        ok?: boolean;
        ref?: string;
        error?: string;
        fields?: Record<string, string>;
      };

      if (!response.ok || !json.ok) {
        if (json.fields) {
          setErrors(json.fields);
        }

        throw new Error(
          json.error || 'Submission failed. Please try again.'
        );
      }

      setReference(json.ref || '');
      setStatus('done');
    } catch (err) {
      setStatus('error');

      setMessage(
        err instanceof Error
          ? err.message
          : 'Something went wrong. Please try again.'
      );
    } finally {
      busy.current = false;
    }
  }

  const id = (name: string) => `${kind}-${name}`;

  const common: {
    key: TextKey;
    label: string;
    type?: string;
    autoComplete?: string;
    placeholder?: string;
  }[] = [
    {
      key: 'name',
      label: 'Full name',
      autoComplete: 'name',
    },
    {
      key: 'email',
      label: 'Business email',
      type: 'email',
      autoComplete: 'email',
    },
    {
      key: 'phone',
      label: 'Phone / WhatsApp',
      type: 'tel',
      autoComplete: 'tel',
      placeholder: 'Include country code',
    },
    {
      key: 'organization',
      label: isSpeaker ? 'Organization' : 'Company / institution',
      autoComplete: 'organization',
    },
    {
      key: 'designation',
      label: 'Designation',
      autoComplete: 'organization-title',
    },
    {
      key: 'country',
      label: 'Country',
      autoComplete: 'country-name',
    },
  ];

  // SUCCESS
  if (status === 'done') {
    return (
      <div className="form-done" role="status">
        <span className="form-done__icon">
          <Icon name="check" />
        </span>

        <h3 className="h-md">
          {isSpeaker
            ? 'Application received.'
            : 'Interest registered.'}
        </h3>

        <p>
          Thank you, {values.name.split(' ')[0]}.{' '}
          {isSpeaker
            ? 'Your speaker application will be reviewed by the organisers.'
            : 'The organisers will confirm participation details.'}
        </p>

        {reference && (
          <p className="form-done__ref">
            Reference <strong>{reference}</strong>
          </p>
        )}
      </div>
    );
  }

  return (
    <form className="lead-form" onSubmit={submit} noValidate>
      {/* HONEYPOT */}
      <div className="hp" aria-hidden="true">
        <label htmlFor={id('website')}>Website URL</label>
        <input
          id={id('website')}
          name="website_url"
          tabIndex={-1}
          autoComplete="off"
          value={values.website_url}
          onChange={(e) => set('website_url', e.target.value)}
        />
      </div>

      <div className="form-grid">
        {common.map((x) => (
          <Input
            key={x.key}
            id={id(x.key)}
            label={x.label}
            type={x.type}
            value={values[x.key]}
            autoComplete={x.autoComplete}
            placeholder={x.placeholder}
            error={errors[x.key]}
            onChange={(v) => set(x.key, v)}
          />
        ))}

        {/* SPEAKER FIELDS */}
        {values.registration_type === 'speaker' ? (
          <>
            <SelectField
              id={id('topic')}
              label="Preferred seminar topic"
              value={values.topic}
              onChange={(v) => set('topic', v)}
              options={seminarOptions}
              error={errors.topic}
            />

            <Area
              id={id('bio')}
              label="Professional bio / relevant experience"
              value={values.professional_bio}
              onChange={(v) => set('professional_bio', v)}
              error={errors.professional_bio}
              placeholder="Your industry expertise, credentials and speaking experience"
            />

            <Area
              id={id('abstract')}
              label="Proposed talk summary"
              value={values.abstract}
              onChange={(v) => set('abstract', v)}
              error={errors.abstract}
              placeholder="Key insights, practical takeaways and subject coverage"
            />

            <Input
              id={id('profile')}
              label="LinkedIn / professional profile"
              value={values.profile_url}
              onChange={(v) => set('profile_url', v)}
              error={errors.profile_url}
              placeholder="https://"
              type="url"
              required={false}
              full
            />
          </>
        ) : (
          <>
            {/* ATTENDEE FIELDS */}
            <SelectField
              id={id('industry')}
              label="Industry category"
              value={values.industry}
              onChange={(v) => set('industry', v)}
              options={industryChoices}
              error={errors.industry}
            />

            <SelectField
              id={id('session')}
              label="Sessions of interest"
              value={values.session_interest}
              onChange={(v) => set('session_interest', v)}
              options={attendeeInterests}
              error={errors.session_interest}
            />

            <Area
              id={id('question')}
              label="Question for speakers"
              value={values.question}
              onChange={(v) => set('question', v)}
              error={errors.question}
              placeholder="What would you like to learn or discuss?"
              required={false}
            />
          </>
        )}
      </div>

      {/* CONSENT */}
      <div className="form-checks">
        <div className="check">
          <label>
            <input
              type="checkbox"
              checked={values.consent}
              onChange={(e) => set('consent', e.target.checked)}
            />

            <span className="check__box">
              <Icon name="check" />
            </span>

            <span>
              I consent to the organisers contacting me about{' '}
              {isSpeaker ? 'this application' : 'my participation'}{' '}
              and processing my details for conclave administration.
              See the{' '}
              <a
                href="/privacy-policy"
                target="_blank"
                rel="noopener noreferrer"
              >
                privacy policy
              </a>
              . *
            </span>
          </label>

          {errors.consent && (
            <p className="field__error">{errors.consent}</p>
          )}
        </div>
      </div>

      {/* ERROR */}
      {message && (
        <div className="form-alert form-alert--error" role="alert">
          <Icon name="alert-circle" />
          {message}
        </div>
      )}

      {/* SUBMIT */}
      <div className="form-nav">
        <button
          className="btn btn--primary"
          type="submit"
          disabled={status === 'sending'}
        >
          {status === 'sending' && (
            <span className="spinner" aria-hidden="true" />
          )}

          {status === 'sending'
            ? 'Submitting…'
            : isSpeaker
              ? 'Submit speaker application'
              : 'Submit attendee interest'}

          {status !== 'sending' && (
            <Icon name="arrow-up-right" />
          )}
        </button>
      </div>
    </form>
  );
}

// MAIN COMPONENT
export default function ConferenceForms() {
  return (
    <div className="conference__form-layout">
      <article
        className="conference__form-panel"
        id="register-speaker"
        data-reveal
      >
        <p className="card__kicker">Call for speakers</p>

        <h3 className="h-md">
          Apply to <em>speak.</em>
        </h3>

        <p className="conference__form-lead">
          Share your expertise with manufacturers, forestry specialists,
          technologists and dealers. Session assignments are subject to
          review.
        </p>

        <RegistrationForm kind="speaker" />
      </article>

      <article
        className="conference__form-panel"
        id="register-attendee"
        data-reveal
      >
        <p className="card__kicker">Delegate registration</p>

        <h3 className="h-md">
          Register as <em>attendee.</em>
        </h3>

        <p className="conference__form-lead">
          Register your interest to attend sessions, join industry
          discussions and connect with the Nepal Wood ecosystem.
        </p>

        <RegistrationForm kind="attendee" />
      </article>
    </div>
  );
}
