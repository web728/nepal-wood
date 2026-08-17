"use client";

import { useRef, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import type ReCAPTCHA from "react-google-recaptcha";

import { contactSchema, contactInterestOptions, type ContactFormValues } from "@/lib/validators/contact.schema";
import { cacheLeadInfo } from "@/hooks/useCookieConsent";
import { useGsapReveal } from "@/hooks/useGsapReveal";
import { Form, FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import RecaptchaField from "@/components/forms/recaptcha-field";
import FormSuccessCard from "@/components/forms/form-success-card";

export default function ContactForm() {
  const recaptchaRef = useRef<ReCAPTCHA>(null);
  const [submitted, setSubmitted] = useState(false);
  // Fields are direct DOM children of <form> (FormField/FormItem don't add
  // their own wrapper nodes), so a light on-load stagger straight across
  // el.children keeps the form usable immediately, no long decoration.
  const formRef = useGsapReveal<HTMLFormElement>({ selector: ":scope > *", y: 16, duration: 0.5, stagger: 0.05 });

  const form = useForm<ContactFormValues>({
    resolver: zodResolver(contactSchema),
    defaultValues: {
      name: "",
      email: "",
      phone: "",
      company: "",
      message: "",
      recaptchaToken: "",
    },
  });

  const onSubmit = async (values: ContactFormValues) => {
    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(values),
      });
      const data = await res.json();
      if (!res.ok || !data.success) {
        throw new Error(data.message ?? "Something went wrong. Please try again.");
      }
      cacheLeadInfo({ name: values.name, email: values.email, phone: values.phone });
      toast.success("Message sent — the relevant team will be in touch shortly.");
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
        title="Thank you for reaching out."
        body="Our team will respond to your enquiry shortly."
        actionLabel="Send another message"
        onAction={() => setSubmitted(false)}
      />
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
              <FormLabel>Name *</FormLabel>
              <FormControl>
                <Input {...field} />
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
              <FormLabel>Email *</FormLabel>
              <FormControl>
                <Input type="email" {...field} />
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
              <FormLabel>Phone</FormLabel>
              <FormControl>
                <Input type="tel" {...field} />
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
              <FormLabel>Company</FormLabel>
              <FormControl>
                <Input {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="interest"
          render={({ field }) => (
            <FormItem className="sm:col-span-2">
              <FormLabel>Interest *</FormLabel>
              <Select onValueChange={field.onChange} value={field.value}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="What is your enquiry about?" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  {contactInterestOptions.map((opt) => (
                    <SelectItem key={opt} value={opt}>
                      {opt}
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
          name="message"
          render={({ field }) => (
            <FormItem className="sm:col-span-2">
              <FormLabel>Message *</FormLabel>
              <FormControl>
                <Textarea rows={5} {...field} />
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
          <Button type="submit" disabled={form.formState.isSubmitting} className="w-full sm:w-auto">
            {form.formState.isSubmitting ? "Sending..." : "Send Message"}
          </Button>
        </div>
      </form>
    </Form>
  );
}
