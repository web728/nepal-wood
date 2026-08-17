import { z } from "zod";

export const contactInterestOptions = [
  "Exhibiting",
  "Visitor Registration",
  "Sponsorship",
  "Media",
  "General Enquiry",
] as const;

export const contactSchema = z.object({
  name: z.string().min(1, "Name is required"),
  email: z.string().min(1, "Email is required").email("Enter a valid email address"),
  phone: z.string().optional().or(z.literal("")),
  company: z.string().optional().or(z.literal("")),
  interest: z.enum(contactInterestOptions, {
    message: "Please select what your enquiry is about",
  }),
  message: z.string().min(1, "Message is required"),
  recaptchaToken: z.string().min(1, "Please verify you are not a robot"),
});

export type ContactFormValues = z.infer<typeof contactSchema>;
