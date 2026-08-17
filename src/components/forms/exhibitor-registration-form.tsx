"use client";

import { useRef, useState } from "react";
import Link from "next/link";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import type ReCAPTCHA from "react-google-recaptcha";
import {
  User,
  Building2,
  Mail,
  Phone,
  Globe,
  MapPin,
  Send,
  Loader2,
  ShieldCheck,
  Briefcase,
  Sparkles,
} from "lucide-react";

import {
  exhibitorSchema,
  type ExhibitorFormValues,
} from "@/lib/validators/exhibitor.schema";
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
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { Button } from "@/components/ui/button";
import RecaptchaField from "@/components/forms/recaptcha-field";
import FormSuccessCard from "@/components/forms/form-success-card";

export default function ExhibitorRegistrationForm() {
  const recaptchaRef = useRef<ReCAPTCHA>(null);
  const [submitted, setSubmitted] = useState(false);

  const formRef = useGsapReveal<HTMLFormElement>({
    selector: ":scope > *",
    y: 16,
    duration: 0.5,
    stagger: 0.06,
  });

  const form = useForm<ExhibitorFormValues>({
    resolver: zodResolver(exhibitorSchema),
    defaultValues: {
      fullName: "",
      designation: "",
      email: "",
      phone: "",
      companyName: "",
      websiteUrl: "",
      country: "",
      city: "",
      message: "",
      interestedInSponsorship: false,
      marketingOptIn: false,
      privacyAccepted: false,
      recaptchaToken: "",
    },
  });

  const onSubmit = async (values: ExhibitorFormValues) => {
    try {
      const res = await fetch("/api/exhibitor-registration", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(values),
      });
      const data = await res.json();
      if (!res.ok || !data.success) {
        throw new Error(data.message ?? "Something went wrong. Please try again.");
      }
      cacheLeadInfo({ name: values.fullName, email: values.email, phone: values.phone });
      toast.success("Exhibitor enquiry submitted — our sales team will contact you shortly.");
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
        title="Thank you for your interest in exhibiting at Nepal Wood 2027!"
        body="Our sales team will contact you with stand availability, custom booth layouts, and participation pricing details."
        actionLabel="Submit Another Inquiry"
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
        {/* Section 1: Contact Representative Details */}
        <fieldset className="rounded-xl border border-brand-brown/10 bg-brand-cream/20 p-5 sm:p-6 shadow-sm">
          <legend className="inline-flex items-center gap-2 rounded-full border border-brand-brown/10 bg-white px-3.5 py-1 text-xs font-bold uppercase tracking-wider text-brand-maroon shadow-sm">
            <User className="h-3.5 w-3.5 text-brand-amber" />
            <span>1. Contact Representative</span>
          </legend>

          <div className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-2">
            <FormField
              control={form.control}
              name="fullName"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-xs font-semibold text-brand-brown">Full Name *</FormLabel>
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
                  <FormLabel className="text-xs font-semibold text-brand-brown">Designation / Role *</FormLabel>
                  <FormControl>
                    <div className="relative">
                      <Input
                        placeholder="Managing Director / Sales Head"
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
                  <FormLabel className="text-xs font-semibold text-brand-brown">Official Email *</FormLabel>
                  <FormControl>
                    <div className="relative">
                      <Input
                        type="email"
                        placeholder="john@company.com"
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
                  <FormLabel className="text-xs font-semibold text-brand-brown">Phone / WhatsApp *</FormLabel>
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

        {/* Section 2: Company & Location Information */}
        <fieldset className="rounded-xl border border-brand-brown/10 bg-brand-cream/20 p-5 sm:p-6 shadow-sm">
          <legend className="inline-flex items-center gap-2 rounded-full border border-brand-brown/10 bg-white px-3.5 py-1 text-xs font-bold uppercase tracking-wider text-brand-maroon shadow-sm">
            <Building2 className="h-3.5 w-3.5 text-brand-amber" />
            <span>2. Business Profile</span>
          </legend>

          <div className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-2">
            <FormField
              control={form.control}
              name="companyName"
              render={({ field }) => (
                <FormItem className="sm:col-span-2">
                  <FormLabel className="text-xs font-semibold text-brand-brown">Company Name *</FormLabel>
                  <FormControl>
                    <div className="relative">
                      <Input
                        placeholder="Global Machinery Ltd."
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
                <FormItem className="sm:col-span-2">
                  <FormLabel className="text-xs font-semibold text-brand-brown">Company Website</FormLabel>
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

            <FormField
              control={form.control}
              name="country"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-xs font-semibold text-brand-brown">Country *</FormLabel>
                  <FormControl>
                    <div className="relative">
                      <Input
                        placeholder="Nepal, India, China..."
                        {...field}
                        className="pl-9 bg-white transition-all focus-visible:ring-brand-amber"
                      />
                      <MapPin className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-brand-brown/40" />
                    </div>
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
                  <FormLabel className="text-xs font-semibold text-brand-brown">City *</FormLabel>
                  <FormControl>
                    <div className="relative">
                      <Input
                        placeholder="Kathmandu, New Delhi..."
                        {...field}
                        className="pl-9 bg-white transition-all focus-visible:ring-brand-amber"
                      />
                      <MapPin className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-brand-brown/40" />
                    </div>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="message"
              render={({ field }) => (
                <FormItem className="sm:col-span-2">
                  <FormLabel className="text-xs font-semibold text-brand-brown">
                    Products to Exhibit / Stand Requirements
                  </FormLabel>
                  <FormControl>
                    <Textarea
                      rows={3}
                      placeholder="Specify your product categories, preferred booth size (e.g., 9 sqm, 18 sqm bare space), or power requirements..."
                      {...field}
                      className="bg-white transition-all focus-visible:ring-brand-amber resize-none"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
        </fieldset>

        {/* Section 3: Preferences & Consents */}
        <div className="space-y-3 rounded-xl border border-brand-brown/10 bg-white p-5 shadow-sm">
          <FormField
            control={form.control}
            name="interestedInSponsorship"
            render={({ field }) => (
              <FormItem className="flex flex-row items-center gap-3 space-y-0 rounded-lg border border-brand-brown/5 bg-brand-cream/30 p-3 transition-colors hover:bg-brand-cream/60">
                <FormControl>
                  <Checkbox checked={field.value} onCheckedChange={field.onChange} />
                </FormControl>
                <FormLabel className="text-xs font-semibold text-brand-brown cursor-pointer">
                  I am also interested in High-Visibility Sponsorship Packages (Gold, Silver, Lanyard, Badge)
                </FormLabel>
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="marketingOptIn"
            render={({ field }) => (
              <FormItem className="flex flex-row items-center gap-3 space-y-0 rounded-lg border border-brand-brown/5 bg-brand-cream/30 p-3 transition-colors hover:bg-brand-cream/60">
                <FormControl>
                  <Checkbox checked={field.value} onCheckedChange={field.onChange} />
                </FormControl>
                <FormLabel className="text-xs font-semibold text-brand-brown cursor-pointer">
                  Send me VIP exhibitor updates, trade show directories, and buyer match updates
                </FormLabel>
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="privacyAccepted"
            render={({ field }) => (
              <FormItem className="flex flex-row items-start gap-3 space-y-0 rounded-lg border border-brand-amber/30 bg-brand-amber/10 p-3">
                <FormControl className="mt-0.5">
                  <Checkbox checked={field.value} onCheckedChange={field.onChange} />
                </FormControl>
                <div className="space-y-1">
                  <FormLabel className="text-xs font-semibold text-brand-brown cursor-pointer">
                    I accept the{" "}
                    <Link href="/privacy-policy" className="text-brand-maroon font-bold underline hover:text-brand-amber">
                      Privacy Policy
                    </Link>{" "}
                    and consent to processing my information for booth allocation. *
                  </FormLabel>
                  <FormMessage />
                </div>
              </FormItem>
            )}
          />
        </div>

        {/* Recaptcha */}
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

        {/* Submit Action CTA Button */}
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
              Submit Exhibitor Enquiry
            </span>
          )}
        </Button>
      </form>
    </Form>
  );
}