"use client";

import { useRef, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import type ReCAPTCHA from "react-google-recaptcha";
import { toast } from "sonner";

import { useGsapReveal } from "@/hooks/useGsapReveal";
import { cacheLeadInfo } from "@/hooks/useCookieConsent";
import RecaptchaField from "@/components/forms/recaptcha-field";
import FormSuccessCard from "@/components/forms/form-success-card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  attendeeFormSchema,
  industryOptions,
  sessionInterestOptions,
  speakerFormSchema,
  speakerTopicOptions,
  type AttendeeFormValues,
  type SpeakerFormValues,
} from "@/lib/validators/conference.schema";

type RegistrationResponse = { success?: boolean; message?: string };

async function submitRegistration(values: SpeakerFormValues | AttendeeFormValues) {
  const response = await fetch("/api/conference/register", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(values),
  });
  const data = (await response.json().catch(() => ({}))) as RegistrationResponse;
  if (!response.ok || !data.success) {
    throw new Error(data.message || "Unable to submit. Please try again or contact the organizers through the official contact page.");
  }
}

function FieldError({ message }: { message?: string }) {
  if (!message) return null;
  return <p role="alert" className="mt-1 text-xs font-medium text-red-700">{message}</p>;
}

const fieldClass =
  "mt-1.5 w-full border-brand-brown/15 bg-white text-brand-brown placeholder:text-slate-400 focus-visible:ring-brand-amber";
const selectClass =
  "mt-1.5 flex h-10 w-full rounded-md border border-brand-brown/15 bg-white px-3 py-2 text-sm text-brand-brown outline-none transition-colors focus:border-brand-amber focus:ring-2 focus:ring-brand-amber/20";
const labelClass = "block text-xs font-bold text-brand-brown sm:text-sm";
const cardClass = "scroll-mt-28 rounded-2xl border border-brand-brown/10 bg-white p-5 shadow-lg shadow-brand-brown/5 sm:p-7";

function TextField({
  id,
  label,
  error,
  children,
  className = "",
}: {
  id: string;
  label: string;
  error?: string;
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <div className={className}>
      <label htmlFor={id} className={labelClass}>{label}</label>
      {children}
      <FieldError message={error} />
    </div>
  );
}

function SpeakerForm() {
  const captchaRef = useRef<ReCAPTCHA>(null);
  const [submitted, setSubmitted] = useState(false);
  const [submitError, setSubmitError] = useState("");
  const formRef = useGsapReveal<HTMLFormElement>({ selector: ":scope > *", y: 12, duration: 0.45, stagger: 0.04 });
  const form = useForm<SpeakerFormValues>({
    resolver: zodResolver(speakerFormSchema),
    defaultValues: {
      registrationType: "speaker",
      fullName: "",
      email: "",
      phone: "",
      organization: "",
      designation: "",
      country: "",
      topic: undefined,
      professionalBio: "",
      abstract: "",
      profileUrl: "",
      consent: false,
      recaptchaToken: "",
    },
  });
  const { errors, isSubmitting } = form.formState;

  const handleSubmit = async (values: SpeakerFormValues) => {
    setSubmitError("");
    try {
      await submitRegistration(values);
      cacheLeadInfo({ name: values.fullName, email: values.email, phone: values.phone });
      toast.success("Speaker application received for review.");
      setSubmitted(true);
      form.reset();
    } catch (error) {
      const message = error instanceof Error ? error.message : "Unable to submit. Please try again.";
      setSubmitError(message);
      toast.error(message);
    } finally {
      captchaRef.current?.reset();
      form.setValue("recaptchaToken", "");
    }
  };

  return (
    <article id="register-speaker" className={cardClass}>
      <span className="text-[10px] font-extrabold uppercase tracking-[0.12em] text-brand-amber-700">Call for speakers</span>
      <h3 className="mt-2 font-display text-xl font-extrabold text-brand-brown sm:text-2xl">Apply to Speak</h3>
      <p className="mt-2 text-sm leading-relaxed text-slate-600">Share your expertise with manufacturers, forestry specialists, technologists and dealers. Session assignments are subject to review.</p>
      {submitted ? (
        <div className="mt-6"><FormSuccessCard title="Speaker application received." body="Your speaker application was submitted for review." actionLabel="Submit another application" onAction={() => setSubmitted(false)} /></div>
      ) : (
        <form ref={formRef} onSubmit={form.handleSubmit(handleSubmit)} className="mt-6" noValidate aria-busy={isSubmitting}>
          <input type="hidden" {...form.register("registrationType")} />
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <TextField id="sp-name" label="Full name *" error={errors.fullName?.message}>
              <Input id="sp-name" autoComplete="name" maxLength={120} aria-invalid={!!errors.fullName} className={fieldClass} {...form.register("fullName")} />
            </TextField>
            <TextField id="sp-email" label="Business email *" error={errors.email?.message}>
              <Input id="sp-email" type="email" autoComplete="email" maxLength={150} aria-invalid={!!errors.email} className={fieldClass} {...form.register("email")} />
            </TextField>
            <TextField id="sp-phone" label="Phone / WhatsApp *" error={errors.phone?.message}>
              <Input id="sp-phone" type="tel" autoComplete="tel" maxLength={30} placeholder="Include country code" aria-invalid={!!errors.phone} className={fieldClass} {...form.register("phone")} />
            </TextField>
            <TextField id="sp-company" label="Organization *" error={errors.organization?.message}>
              <Input id="sp-company" autoComplete="organization" maxLength={160} aria-invalid={!!errors.organization} className={fieldClass} {...form.register("organization")} />
            </TextField>
            <TextField id="sp-role" label="Designation *" error={errors.designation?.message}>
              <Input id="sp-role" autoComplete="organization-title" maxLength={120} aria-invalid={!!errors.designation} className={fieldClass} {...form.register("designation")} />
            </TextField>
            <TextField id="sp-country" label="Country *" error={errors.country?.message}>
              <Input id="sp-country" autoComplete="country-name" maxLength={80} aria-invalid={!!errors.country} className={fieldClass} {...form.register("country")} />
            </TextField>
            <TextField id="sp-topic" label="Preferred seminar topic *" error={errors.topic?.message} className="sm:col-span-2">
              <select id="sp-topic" defaultValue="" aria-invalid={!!errors.topic} className={selectClass} {...form.register("topic")}>
                <option value="">Select a topic</option>
                {speakerTopicOptions.map((option) => <option key={option} value={option}>{option}</option>)}
              </select>
            </TextField>
            <TextField id="sp-bio" label="Professional bio / relevant experience *" error={errors.professionalBio?.message} className="sm:col-span-2">
              <Textarea id="sp-bio" rows={4} maxLength={2000} placeholder="Your industry expertise, credentials and relevant speaking experience" aria-invalid={!!errors.professionalBio} className={fieldClass} {...form.register("professionalBio")} />
            </TextField>
            <TextField id="sp-abstract" label="Proposed talk summary *" error={errors.abstract?.message} className="sm:col-span-2">
              <Textarea id="sp-abstract" rows={4} maxLength={3000} placeholder="Key insights, practical takeaways and subject coverage" aria-invalid={!!errors.abstract} className={fieldClass} {...form.register("abstract")} />
            </TextField>
            <TextField id="sp-profile" label="LinkedIn / professional profile (optional)" error={errors.profileUrl?.message} className="sm:col-span-2">
              <Input id="sp-profile" type="url" placeholder="https://" aria-invalid={!!errors.profileUrl} className={fieldClass} {...form.register("profileUrl")} />
            </TextField>
          </div>
          <label className="mt-5 flex cursor-pointer items-start gap-2.5 text-xs leading-relaxed text-slate-600">
            <input type="checkbox" className="mt-0.5 h-4 w-4 shrink-0 accent-brand-brown" {...form.register("consent")} />
            <span>I consent to the organizers contacting me about this application and processing my submitted details for conclave administration. *</span>
          </label>
          <FieldError message={errors.consent?.message} />
          <div className="mt-5">
            <RecaptchaField ref={captchaRef} onChange={(token) => form.setValue("recaptchaToken", token ?? "", { shouldValidate: true })} error={errors.recaptchaToken?.message} />
          </div>
          {submitError && <p role="alert" className="mt-4 rounded-lg bg-red-50 px-3 py-2 text-xs font-medium text-red-800">{submitError}</p>}
          <Button type="submit" disabled={isSubmitting} className="mt-5 min-h-11 w-full bg-brand-brown px-5 font-semibold text-white hover:bg-brand-dark sm:w-auto">
            {isSubmitting ? "Submitting..." : "Submit Speaker Application →"}
          </Button>
        </form>
      )}
    </article>
  );
}

function AttendeeForm() {
  const captchaRef = useRef<ReCAPTCHA>(null);
  const [submitted, setSubmitted] = useState(false);
  const [submitError, setSubmitError] = useState("");
  const formRef = useGsapReveal<HTMLFormElement>({ selector: ":scope > *", y: 12, duration: 0.45, stagger: 0.04 });
  const form = useForm<AttendeeFormValues>({
    resolver: zodResolver(attendeeFormSchema),
    defaultValues: {
      registrationType: "attendee",
      fullName: "",
      email: "",
      phone: "",
      organization: "",
      designation: "",
      country: "",
      industry: undefined,
      sessionInterest: undefined,
      question: "",
      consent: false,
      recaptchaToken: "",
    },
  });
  const { errors, isSubmitting } = form.formState;

  const handleSubmit = async (values: AttendeeFormValues) => {
    setSubmitError("");
    try {
      await submitRegistration(values);
      cacheLeadInfo({ name: values.fullName, email: values.email, phone: values.phone });
      toast.success("Attendee interest submitted for organizer review.");
      setSubmitted(true);
      form.reset();
    } catch (error) {
      const message = error instanceof Error ? error.message : "Unable to submit. Please try again.";
      setSubmitError(message);
      toast.error(message);
    } finally {
      captchaRef.current?.reset();
      form.setValue("recaptchaToken", "");
    }
  };

  return (
    <article id="register-attendee" className={cardClass}>
      <span className="text-[10px] font-extrabold uppercase tracking-[0.12em] text-brand-amber-700">Delegate registration</span>
      <h3 className="mt-2 font-display text-xl font-extrabold text-brand-brown sm:text-2xl">Register as Attendee</h3>
      <p className="mt-2 text-sm leading-relaxed text-slate-600">Register your interest to attend sessions, join industry discussions and connect with the Nepal Wood ecosystem.</p>
      {submitted ? (
        <div className="mt-6"><FormSuccessCard title="Attendee interest received." body="Your attendee interest was submitted. Confirmation is subject to organizer approval." actionLabel="Register another attendee" onAction={() => setSubmitted(false)} /></div>
      ) : (
        <form ref={formRef} onSubmit={form.handleSubmit(handleSubmit)} className="mt-6" noValidate aria-busy={isSubmitting}>
          <input type="hidden" {...form.register("registrationType")} />
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <TextField id="at-name" label="Full name *" error={errors.fullName?.message}>
              <Input id="at-name" autoComplete="name" maxLength={120} aria-invalid={!!errors.fullName} className={fieldClass} {...form.register("fullName")} />
            </TextField>
            <TextField id="at-email" label="Business email *" error={errors.email?.message}>
              <Input id="at-email" type="email" autoComplete="email" maxLength={150} aria-invalid={!!errors.email} className={fieldClass} {...form.register("email")} />
            </TextField>
            <TextField id="at-phone" label="Phone / WhatsApp *" error={errors.phone?.message}>
              <Input id="at-phone" type="tel" autoComplete="tel" maxLength={30} placeholder="Include country code" aria-invalid={!!errors.phone} className={fieldClass} {...form.register("phone")} />
            </TextField>
            <TextField id="at-company" label="Company / institution *" error={errors.organization?.message}>
              <Input id="at-company" autoComplete="organization" maxLength={160} aria-invalid={!!errors.organization} className={fieldClass} {...form.register("organization")} />
            </TextField>
            <TextField id="at-role" label="Designation *" error={errors.designation?.message}>
              <Input id="at-role" autoComplete="organization-title" maxLength={120} aria-invalid={!!errors.designation} className={fieldClass} {...form.register("designation")} />
            </TextField>
            <TextField id="at-country" label="Country *" error={errors.country?.message}>
              <Input id="at-country" autoComplete="country-name" maxLength={80} aria-invalid={!!errors.country} className={fieldClass} {...form.register("country")} />
            </TextField>
            <TextField id="at-sector" label="Industry category *" error={errors.industry?.message} className="sm:col-span-2">
              <select id="at-sector" defaultValue="" aria-invalid={!!errors.industry} className={selectClass} {...form.register("industry")}>
                <option value="">Select your sector</option>
                {industryOptions.map((option) => <option key={option} value={option}>{option}</option>)}
              </select>
            </TextField>
            <TextField id="at-interest" label="Sessions of interest *" error={errors.sessionInterest?.message} className="sm:col-span-2">
              <select id="at-interest" defaultValue="" aria-invalid={!!errors.sessionInterest} className={selectClass} {...form.register("sessionInterest")}>
                <option value="">Select an interest</option>
                {sessionInterestOptions.map((option) => <option key={option} value={option}>{option}</option>)}
              </select>
            </TextField>
            <TextField id="at-question" label="Question for speakers (optional)" error={errors.question?.message} className="sm:col-span-2">
              <Textarea id="at-question" rows={4} maxLength={1000} placeholder="What would you like to learn or discuss?" aria-invalid={!!errors.question} className={fieldClass} {...form.register("question")} />
            </TextField>
          </div>
          <label className="mt-5 flex cursor-pointer items-start gap-2.5 text-xs leading-relaxed text-slate-600">
            <input type="checkbox" className="mt-0.5 h-4 w-4 shrink-0 accent-brand-brown" {...form.register("consent")} />
            <span>I consent to the organizers contacting me regarding participation and processing my submitted details for event administration. *</span>
          </label>
          <FieldError message={errors.consent?.message} />
          <div className="mt-5">
            <RecaptchaField ref={captchaRef} onChange={(token) => form.setValue("recaptchaToken", token ?? "", { shouldValidate: true })} error={errors.recaptchaToken?.message} />
          </div>
          {submitError && <p role="alert" className="mt-4 rounded-lg bg-red-50 px-3 py-2 text-xs font-medium text-red-800">{submitError}</p>}
          <Button type="submit" disabled={isSubmitting} className="mt-5 min-h-11 w-full bg-brand-amber px-5 font-semibold text-brand-brown hover:bg-brand-amber/85 sm:w-auto">
            {isSubmitting ? "Submitting..." : "Submit Attendee Interest →"}
          </Button>
        </form>
      )}
    </article>
  );
}

export default function ConclaveRegistrationForms() {
  return (
    <div className="grid items-start gap-5 lg:grid-cols-2 lg:gap-6">
      <SpeakerForm />
      <AttendeeForm />
    </div>
  );
}
