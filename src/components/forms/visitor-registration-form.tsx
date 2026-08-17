"use client";

import { useRef, useState } from "react";
import Link from "next/link";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import type ReCAPTCHA from "react-google-recaptcha";
import {
  User,
  Briefcase,
  Mail,
  Phone,
  Building2,
  Globe,
  MapPin,
  Sparkles,
  Send,
  Loader2,
  Check,
} from "lucide-react";

import {
  visitorSchema,
  areaOfInterestOptions,
  countryOptions,
  type VisitorFormValues,
} from "@/lib/validators/visitor.schema";
import { cacheLeadInfo } from "@/hooks/useCookieConsent";
import { useGsapReveal } from "@/hooks/useGsapReveal";
import {
  Form,
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import RecaptchaField from "@/components/forms/recaptcha-field";
import FormSuccessCard from "@/components/forms/form-success-card";

export default function VisitorRegistrationForm() {
  const recaptchaRef = useRef<ReCAPTCHA>(null);
  const [submitted, setSubmitted] = useState(false);

  // Fieldsets/FormFields stagger reveal animation
  const formRef = useGsapReveal<HTMLFormElement>({
    selector: ":scope > *",
    y: 16,
    duration: 0.5,
    stagger: 0.06,
  });

  const form = useForm<VisitorFormValues>({
    resolver: zodResolver(visitorSchema),
    defaultValues: {
      name: "",
      designation: "",
      email: "",
      phone: "",
      company: "",
      websiteUrl: "",
      country: "",
      state: "",
      city: "",
      areasOfInterest: [],
      privacyAccepted: false,
      recaptchaToken: "",
    },
  });

  const onSubmit = async (values: VisitorFormValues) => {
    try {
      const res = await fetch("/api/visitor-registration", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(values),
      });
      const data = await res.json();
      if (!res.ok || !data.success) {
        throw new Error(data.message ?? "Something went wrong. Please try again.");
      }
      cacheLeadInfo({ name: values.name, email: values.email, phone: values.phone });
      toast.success("Registration received — a confirmation will follow by email.");
      setSubmitted(true);
      form.reset();
      recaptchaRef.current?.reset();
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Something went wrong. Please try again.");
    }
  };

  if (submitted) {
    return (
      <FormSuccessCard
        title="Your visitor registration has been received."
        body="A digital pass confirmation will be sent to your email address. Please retain it for direct entry at the registration counters."
        actionLabel="Register another visitor"
        onAction={() => setSubmitted(false)}
      />
    );
  }

  return (
    <Form {...form}>
      <form
        ref={formRef}
        onSubmit={(e) => form.handleSubmit(onSubmit)(e)}
        className="space-y-8"
      >
        {/* Section 1: Personal Information */}
        <fieldset className="rounded-xl border border-brand-brown/10 bg-brand-cream/20 p-5 sm:p-6 shadow-sm">
          <legend className="inline-flex items-center gap-2 rounded-full border border-brand-brown/10 bg-white px-3.5 py-1 text-xs font-bold uppercase tracking-wider text-brand-maroon shadow-sm">
            <User className="h-3.5 w-3.5 text-brand-amber" />
            <span>1. Personal Information</span>
          </legend>

          <div className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-2">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-xs font-semibold text-brand-brown">
                    Full Name *
                  </FormLabel>
                  <FormControl>
                    <div className="relative">
                      <Input
                        placeholder="John Doe"
                        {...field}
                        className="pl-9 bg-white transition-all focus-visible:ring-brand-amber"
                      />
                      <User className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-brand-brown/40" />
                    </div>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="designation"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-xs font-semibold text-brand-brown">
                    Designation*
                  </FormLabel>
                  <FormControl>
                    <div className="relative">
                      <Input
                        placeholder="Architect / Trader / Woodworker"
                        {...field}
                        className="pl-9 bg-white transition-all focus-visible:ring-brand-amber"
                      />
                      <Briefcase className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-brand-brown/40" />
                    </div>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-xs font-semibold text-brand-brown">
                    Email Address *
                  </FormLabel>
                  <FormControl>
                    <div className="relative">
                      <Input
                        type="email"
                        placeholder="john@example.com"
                        {...field}
                        className="pl-9 bg-white transition-all focus-visible:ring-brand-amber"
                      />
                      <Mail className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-brand-brown/40" />
                    </div>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="phone"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-xs font-semibold text-brand-brown">
                    Phone / Mobile *
                  </FormLabel>
                  <FormControl>
                    <div className="relative">
                      <Input
                        type="tel"
                        placeholder="+977 9800000000"
                        {...field}
                        className="pl-9 bg-white transition-all focus-visible:ring-brand-amber"
                      />
                      <Phone className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-brand-brown/40" />
                    </div>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
        </fieldset>

        {/* Section 2: Company Details */}
        <fieldset className="rounded-xl border border-brand-brown/10 bg-brand-cream/20 p-5 sm:p-6 shadow-sm">
          <legend className="inline-flex items-center gap-2 rounded-full border border-brand-brown/10 bg-white px-3.5 py-1 text-xs font-bold uppercase tracking-wider text-brand-maroon shadow-sm">
            <Building2 className="h-3.5 w-3.5 text-brand-amber" />
            <span>2. Company Profile</span>
          </legend>

          <div className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-2">
            <FormField
              control={form.control}
              name="company"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-xs font-semibold text-brand-brown">
                    Company Name *
                  </FormLabel>
                  <FormControl>
                    <div className="relative">
                      <Input
                        placeholder="Your Company / Business Name"
                        {...field}
                        className="pl-9 bg-white transition-all focus-visible:ring-brand-amber"
                      />
                      <Building2 className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-brand-brown/40" />
                    </div>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="websiteUrl"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-xs font-semibold text-brand-brown">
                    Website URL
                  </FormLabel>
                  <FormControl>
                    <div className="relative">
                      <Input
                        placeholder="https://www.yourcompany.com"
                        {...field}
                        className="pl-9 bg-white transition-all focus-visible:ring-brand-amber"
                      />
                      <Globe className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-brand-brown/40" />
                    </div>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
        </fieldset>

        {/* Section 3: Location */}
        <fieldset className="rounded-xl border border-brand-brown/10 bg-brand-cream/20 p-5 sm:p-6 shadow-sm">
          <legend className="inline-flex items-center gap-2 rounded-full border border-brand-brown/10 bg-white px-3.5 py-1 text-xs font-bold uppercase tracking-wider text-brand-maroon shadow-sm">
            <MapPin className="h-3.5 w-3.5 text-brand-amber" />
            <span>3. Location</span>
          </legend>

          <div className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-3">
            <FormField
              control={form.control}
              name="country"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-xs font-semibold text-brand-brown">
                    Country
                  </FormLabel>
                  <Select onValueChange={field.onChange} value={field.value}>
                    <FormControl>
                      <SelectTrigger className="bg-white transition-all focus:ring-brand-amber">
                        <SelectValue placeholder="Select country" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {countryOptions.map((c) => (
                        <SelectItem key={c} value={c}>
                          {c}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="state"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-xs font-semibold text-brand-brown">
                    State / Province
                  </FormLabel>
                  <FormControl>
                    <Input
                      placeholder="Bagmati, Bagmati Pradesh..."
                      {...field}
                      className="bg-white transition-all focus-visible:ring-brand-amber"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="city"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-xs font-semibold text-brand-brown">
                    City
                  </FormLabel>
                  <FormControl>
                    <Input
                      placeholder="Kathmandu, Lalitpur..."
                      {...field}
                      className="bg-white transition-all focus-visible:ring-brand-amber"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
        </fieldset>

        {/* Section 4: Areas of Interest */}
        <fieldset className="rounded-xl border border-brand-brown/10 bg-brand-cream/20 p-5 sm:p-6 shadow-sm">
          <legend className="inline-flex items-center gap-2 rounded-full border border-brand-brown/10 bg-white px-3.5 py-1 text-xs font-bold uppercase tracking-wider text-brand-maroon shadow-sm">
            <Sparkles className="h-3.5 w-3.5 text-brand-amber" />
            <span>4. Areas of Interest</span>
          </legend>

          <p className="mt-2 text-xs text-brand-brown/70 mb-4">
            Select product categories you are interested in sourcing or exploring:
          </p>

          <FormField
            control={form.control}
            name="areasOfInterest"
            render={({ field }) => (
              <FormItem>
                <div className="flex flex-wrap gap-2">
                  {areaOfInterestOptions.map((opt) => {
                    const checked = field.value?.includes(opt);
                    return (
                      <button
                        key={opt}
                        type="button"
                        onClick={() =>
                          field.onChange(
                            checked
                              ? (field.value ?? []).filter((v: string) => v !== opt)
                              : [...(field.value ?? []), opt]
                          )
                        }
                        className={cn(
                          "inline-flex items-center gap-1.5 rounded-full border px-4 py-2 text-xs font-medium transition-all duration-200 active:scale-95",
                          checked
                            ? "border-brand-amber bg-brand-amber text-white shadow-sm"
                            : "border-brand-brown/20 bg-white text-brand-brown/80 hover:border-brand-amber/60 hover:bg-brand-cream/50"
                        )}
                        aria-pressed={checked}
                      >
                        {checked && <Check className="h-3.5 w-3.5 text-white" />}
                        {opt}
                      </button>
                    );
                  })}
                </div>
                <FormMessage />
              </FormItem>
            )}
          />
        </fieldset>

        {/* Consent Section */}
        <div className="rounded-xl border border-brand-amber/30 bg-brand-amber/10 p-4 shadow-sm">
          <FormField
            control={form.control}
            name="privacyAccepted"
            render={({ field }) => (
              <FormItem className="flex flex-row items-start gap-3 space-y-0">
                <FormControl className="mt-0.5">
                  <Checkbox checked={field.value} onCheckedChange={field.onChange} />
                </FormControl>
                <div className="space-y-1">
                  <FormLabel className="text-xs font-semibold text-brand-brown cursor-pointer">
                    I accept the{" "}
                    <Link
                      href="/privacy-policy"
                      className="text-brand-maroon font-bold underline hover:text-brand-amber"
                    >
                      Privacy Policy
                    </Link>{" "}
                    and consent to my data being processed for entry badge generation. *
                  </FormLabel>
                  <FormMessage />
                </div>
              </FormItem>
            )}
          />
        </div>

        {/* ReCAPTCHA Field */}
        <FormField
          control={form.control}
          name="recaptchaToken"
          render={({ field, fieldState }) => (
            <FormItem>
              <RecaptchaField
                ref={recaptchaRef}
                onChange={(token) => field.onChange(token ?? "")}
                error={fieldState.error?.message}
              />
            </FormItem>
          )}
        />

        {/* Action Button */}
        <Button
          type="submit"
          disabled={form.formState.isSubmitting}
          className="w-full sm:w-auto min-w-[240px] h-12 bg-brand-brown hover:bg-brand-maroon text-brand-amber font-bold text-sm shadow-xl transition-all duration-300 hover:scale-[1.01] active:scale-[0.99] rounded-xl"
        >
          {form.formState.isSubmitting ? (
            <span className="flex items-center gap-2">
              <Loader2 className="h-4 w-4 animate-spin text-brand-amber" />
              Processing Registration...
            </span>
          ) : (
            <span className="flex items-center justify-center gap-2">
              <Send className="h-4 w-4" />
              Submit Visitor Registration
            </span>
          )}
        </Button>
      </form>
    </Form>
  );
}