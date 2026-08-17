"use client";

import { useRef, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import type ReCAPTCHA from "react-google-recaptcha";
import { Download, CheckCircle2, FileText } from "lucide-react";

import { brochureSchema, type BrochureFormValues } from "@/lib/validators/brochure.schema";
import { cacheLeadInfo } from "@/hooks/useCookieConsent";
import { useGsapReveal } from "@/hooks/useGsapReveal";
import { Form, FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import RecaptchaField from "@/components/forms/recaptcha-field";

export default function BrochureDownloadForm() {
  const recaptchaRef = useRef<ReCAPTCHA>(null);
  const [downloadUrl, setDownloadUrl] = useState<string | null>(null);
  const formRef = useGsapReveal<HTMLFormElement>({ selector: ":scope > *", y: 16, duration: 0.5, stagger: 0.05 });

  const form = useForm<BrochureFormValues>({
    resolver: zodResolver(brochureSchema),
    defaultValues: {
      name: "",
      email: "",
      phone: "",
      company: "",
      designation: "",
      country: "",
      recaptchaToken: "",
    },
  });

  const onSubmit = async (values: BrochureFormValues) => {
    try {
      const res = await fetch("/api/brochure", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(values),
      });
      const data = await res.json();

      if (!res.ok || !data.success) {
        throw new Error(data.message ?? "Something went wrong. Please try again.");
      }

      cacheLeadInfo({ name: values.name, email: values.email, phone: values.phone });
      toast.success("Thank you! Starting your download...");

      const fileUrl = data.downloadUrl || "/downloads/nepal-wood-2027-brochure.pdf";
      setDownloadUrl(fileUrl);

      // Trigger File Download Automatically
      const link = document.createElement("a");
      link.href = fileUrl;
      link.setAttribute("download", "Nepal-Wood-Expo-2027-Brochure.pdf");
      link.target = "_blank";
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);

      form.reset();
      recaptchaRef.current?.reset();
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Something went wrong. Please try again.");
    }
  };

  if (downloadUrl) {
    return (
      <div className="rounded-2xl border border-brand-amber/30 bg-brand-cream/30 p-8 text-center space-y-6">
        <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-emerald-100 text-emerald-600">
          <CheckCircle2 className="h-8 w-8" />
        </div>
        <div className="space-y-2">
          <h3 className="font-display text-2xl font-bold text-brand-brown">Download Ready!</h3>
          <p className="text-sm text-brand-brown/80 max-w-md mx-auto">
            Your brochure download should start automatically. If it doesn't, click the button below. A copy has also been emailed to you.
          </p>
        </div>
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-2">
          <a
            href={downloadUrl}
            download="Nepal-Wood-Expo-2027-Brochure.pdf"
            className="inline-flex items-center gap-2 rounded-xl bg-brand-brown px-6 py-3 text-sm font-bold text-white shadow-md hover:bg-brand-amber hover:text-brand-brown transition-all"
          >
            <Download className="h-4 w-4" /> Download Brochure Again
          </a>
          <button
            type="button"
            onClick={() => setDownloadUrl(null)}
            className="text-xs font-semibold text-brand-brown/70 hover:underline"
          >
            Submit Another Request
          </button>
        </div>
      </div>
    );
  }

  return (
    <Form {...form}>
      <form
        ref={formRef}
        onSubmit={(e) => form.handleSubmit(onSubmit)(e)}
        className="grid grid-cols-1 gap-5 sm:grid-cols-2"
      >
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Full Name *</FormLabel>
              <FormControl>
                <Input placeholder="John Doe" {...field} />
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
              <FormLabel>Work Email *</FormLabel>
              <FormControl>
                <Input type="email" placeholder="john@company.com" {...field} />
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
              <FormLabel>Phone / Mobile *</FormLabel>
              <FormControl>
                <Input type="tel" placeholder="+977 9800000000" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="company"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Company Name *</FormLabel>
              <FormControl>
                <Input placeholder="Woodtech Industries Ltd." {...field} />
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
              <FormLabel>Designation</FormLabel>
              <FormControl>
                <Input placeholder="Managing Director" {...field} />
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
              <FormLabel>Country *</FormLabel>
              <FormControl>
                <Input placeholder="Nepal / India" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="recaptchaToken"
          render={({ field, fieldState }) => (
            <FormItem className="sm:col-span-2">
              <RecaptchaField
                ref={recaptchaRef}
                onChange={(token) => field.onChange(token ?? "")}
                error={fieldState.error?.message}
              />
            </FormItem>
          )}
        />

        <div className="sm:col-span-2">
          <Button
            type="submit"
            disabled={form.formState.isSubmitting}
            className="w-full bg-brand-brown text-white hover:bg-brand-amber hover:text-brand-brown font-bold py-3 text-sm transition-all"
          >
            {form.formState.isSubmitting ? (
              "Processing..."
            ) : (
              <span className="flex items-center justify-center gap-2">
                <FileText className="h-4 w-4" /> Request & Download Brochure
              </span>
            )}
          </Button>
        </div>
      </form>
    </Form>
  );
}