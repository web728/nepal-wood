import { z } from "zod";

export const brochureSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  email: z.string().email("Please enter a valid email address"),
  phone: z.string().min(7, "Please enter a valid phone/mobile number"),
  company: z.string().min(2, "Company name is required"),
  designation: z.string().optional(),
  country: z.string().min(2, "Country is required"),
  recaptchaToken: z.string().min(1, "Please complete the CAPTCHA verification"),
});

export type BrochureFormValues = z.infer<typeof brochureSchema>;