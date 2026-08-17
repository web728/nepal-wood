import { z } from "zod";

export const areaOfInterestOptions = [
  "Plywood, Veneer, MDF & Laminates",
  "Hardwood & Softwood",
  "Woodworking Machinery & Dust Control",
  "Wood Flooring, Doors, Furniture & Fitting",
  "Coating, Paints & Adhesives",
  "Tools, Blades & Cutters",
  "Association & Government",
  "3D Software & Design Software",
] as const;

export const countryOptions = [
  "India",
  "United States",
  "United Kingdom",
  "Germany",
  "China",
  "Japan",
  "South Korea",
  "United Arab Emirates",
  "Singapore",
  "Australia",
  "Canada",
  "France",
  "Italy",
  "Netherlands",
  "Sweden",
  "Vietnam",
  "Indonesia",
  "Thailand",
  "Bangladesh",
  "Sri Lanka",
  "Other",
] as const;

export const visitorSchema = z.object({
  name: z.string().min(1, "Name is required"),
  designation: z.string().min(1, "Designation is required"),
  email: z.string().min(1, "Email is required").email("Enter a valid email address"),
  phone: z.string().min(1, "Phone is required"),
  company: z.string().min(1, "Company is required"),
  websiteUrl: z
    .string()
    .url("Enter a valid URL (including https://)")
    .optional()
    .or(z.literal("")),
  country: z.string().optional().or(z.literal("")),
  state: z.string().optional().or(z.literal("")),
  city: z.string().optional().or(z.literal("")),
  areasOfInterest: z.array(z.string()).optional(),
  privacyAccepted: z.boolean().refine((v) => v === true, {
    message: "You must accept the Privacy Policy to continue",
  }),
  recaptchaToken: z.string().min(1, "Please verify you are not a robot"),
});

export type VisitorFormValues = z.infer<typeof visitorSchema>;
