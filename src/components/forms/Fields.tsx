'use client';
import Link from 'next/link';
import Icon from '../Icon';

type Base = { name: string; label: string; error?: string; hint?: string; required?: boolean; className?: string };

export function Field({ name, label, error, hint, required, className = '', children }: Base & { children: React.ReactNode }) {
  return (
    <div className={`field${error ? ' field--error' : ''} ${className}`} data-field={name}>
      <label htmlFor={`f-${name}`}>{label}{required && <span aria-hidden="true"> *</span>}</label>
      {children}
      {hint && !error && <p className="field__hint" id={`h-${name}`}>{hint}</p>}
      {error && <p className="field__error" id={`e-${name}`} role="alert">{error}</p>}
    </div>
  );
}

const describedBy = (name: string, error?: string, hint?: string) => (error ? `e-${name}` : hint ? `h-${name}` : undefined);

export function TextInput({ value, onChange, type = 'text', autoComplete, placeholder, inputMode, ...base }: Base & {
  value: string; onChange: (v: string) => void; type?: string; autoComplete?: string; placeholder?: string; inputMode?: React.HTMLAttributes<HTMLInputElement>['inputMode'];
}) {
  return (
    <Field {...base}>
      <input id={`f-${base.name}`} name={base.name} type={type} value={value} onChange={(e) => onChange(e.target.value)} autoComplete={autoComplete} placeholder={placeholder} inputMode={inputMode}
        aria-invalid={base.error ? true : undefined} aria-describedby={describedBy(base.name, base.error, base.hint)} required={base.required} />
    </Field>
  );
}

export function TextArea({ value, onChange, rows = 4, placeholder, ...base }: Base & { value: string; onChange: (v: string) => void; rows?: number; placeholder?: string }) {
  return (
    <Field {...base}>
      <textarea id={`f-${base.name}`} name={base.name} rows={rows} value={value} onChange={(e) => onChange(e.target.value)} placeholder={placeholder}
        aria-invalid={base.error ? true : undefined} aria-describedby={describedBy(base.name, base.error, base.hint)} />
    </Field>
  );
}

export function Select({ value, onChange, options, placeholder = 'Select…', ...base }: Base & { value: string; onChange: (v: string) => void; options: string[] | { value: string; label: string }[]; placeholder?: string }) {
  const opts = options.map((o) => (typeof o === 'string' ? { value: o, label: o } : o));
  return (
    <Field {...base}>
      <div className="select">
        <select id={`f-${base.name}`} name={base.name} value={value} onChange={(e) => onChange(e.target.value)} aria-invalid={base.error ? true : undefined} aria-describedby={describedBy(base.name, base.error, base.hint)} required={base.required}>
          <option value="" disabled>{placeholder}</option>
          {opts.map((o) => <option key={o.value} value={o.value}>{o.label}</option>)}
        </select>
        <Icon name="chevron" />
      </div>
    </Field>
  );
}

export function Chips({ name, label, options, selected, onToggle, error, hint, required, className = 'span-2' }: Base & { options: string[]; selected: string[]; onToggle: (v: string) => void }) {
  return (
    <fieldset className={`field chips${error ? ' field--error' : ''} ${className}`} data-field={name}>
      <legend>{label}{required && <span aria-hidden="true"> *</span>}</legend>
      <div className="chips__list">
        {options.map((o) => {
          const on = selected.includes(o);
          return (
            <button type="button" key={o} className={`chip${on ? ' is-on' : ''}`} aria-pressed={on} onClick={() => onToggle(o)}>
              {on && <Icon name="check" />}{o}
            </button>
          );
        })}
      </div>
      {hint && !error && <p className="field__hint">{hint}</p>}
      {error && <p className="field__error" role="alert">{error}</p>}
    </fieldset>
  );
}

export function Choice<T extends string>({ name, label, options, value, onChange, error, className = 'span-2' }: { name: string; label: string; options: { value: T; label: string; desc?: string }[]; value: T; onChange: (v: T) => void; error?: string; className?: string }) {
  return (
    <fieldset className={`field choice${error ? ' field--error' : ''} ${className}`} data-field={name}>
      <legend>{label}</legend>
      <div className="choice__list">
        {options.map((o) => (
          <label key={o.value} className={`choice__opt${value === o.value ? ' is-on' : ''}`}>
            <input type="radio" name={name} value={o.value} checked={value === o.value} onChange={() => onChange(o.value)} />
            <span className="choice__title">{o.label}</span>
            {o.desc && <span className="choice__desc">{o.desc}</span>}
          </label>
        ))}
      </div>
      {error && <p className="field__error" role="alert">{error}</p>}
    </fieldset>
  );
}

export function Check({ name, checked, onChange, children, error }: { name: string; checked: boolean; onChange: (v: boolean) => void; children: React.ReactNode; error?: string }) {
  return (
    <div className={`check span-2${error ? ' field--error' : ''}`} data-field={name}>
      <label>
        <input type="checkbox" name={name} checked={checked} onChange={(e) => onChange(e.target.checked)} aria-invalid={error ? true : undefined} />
        <span className="check__box"><Icon name="check" /></span>
        <span>{children}</span>
      </label>
      {error && <p className="field__error" role="alert">{error}</p>}
    </div>
  );
}

export function ConsentCheck({ checked, onChange, error, purpose }: { checked: boolean; onChange: (v: boolean) => void; error?: string; purpose: string }) {
  return (
    <Check name="consent" checked={checked} onChange={onChange} error={error}>
      I agree to the <Link href="/privacy-policy" target="_blank">privacy policy</Link> and consent to my details being used {purpose}.
    </Check>
  );
}

/** Invisible to people, irresistible to bots. */
export function Honeypot({ inputRef }: { inputRef: React.RefObject<HTMLInputElement | null> }) {
  return (
    <div className="hp" aria-hidden="true">
      <label htmlFor="website_url">Leave this field empty</label>
      <input ref={inputRef} id="website_url" name="website_url" type="text" tabIndex={-1} autoComplete="off" />
    </div>
  );
}

export function FormError({ message }: { message?: string }) {
  if (!message) return null;
  return <div className="form-alert form-alert--error" role="alert"><Icon name="info" />{message}</div>;
}

export function Submit({ sending, children }: { sending: boolean; children: React.ReactNode }) {
  return (
    <button className="btn btn--block" type="submit" disabled={sending} aria-busy={sending}>
      {sending ? <><span className="spinner" aria-hidden="true" />Sending…</> : <>{children}<Icon name="arrow" className="arrow" /></>}
    </button>
  );
}
