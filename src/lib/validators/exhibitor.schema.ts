import { z } from "zod";

export const exhibitorSchema = z.object({
  fullName: z.string().min(1, "Full name is required"),
  designation: z.string().min(1, "Designation is required"),
  email: z.string().min(1, "Email is required").email("Enter a valid email address"),
  phone: z.string().min(1, "Phone is required"),
  companyName: z.string().min(1, "Company name is required"),
  websiteUrl: z
    .string()
    .url("Enter a valid URL (including https://)")
    .optional()
    .or(z.literal("")),
  country: z.string().min(1, "Country is required"),
  city: z.string().min(1, "City is required"),
  message: z.string().optional().or(z.literal("")),
  interestedInSponsorship: z.boolean(),
  marketingOptIn: z.boolean(),
  privacyAccepted: z.boolean().refine((v) => v === true, {
    message: "You must accept the Privacy Policy to continue",
  }),
  recaptchaToken: z.string().min(1, "Please verify you are not a robot"),
});

export type ExhibitorFormValues = z.infer<typeof exhibitorSchema>;
