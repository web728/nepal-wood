// Form schemas shared by the browser (instant validation) and the API (authoritative validation).
import { z } from 'zod';

const name = z.string().trim().min(2, 'Please enter your full name').max(80);
const email = z.email('Please enter a valid email').trim().toLowerCase().max(120);
const phone = z
  .string()
  .trim()
  .max(24)
  .refine((v) => v.replace(/\D/g, '').length >= 7, 'Please enter a valid phone number');
const opt = (max = 200) => z.string().trim().max(max).optional().or(z.literal(''));
const consent = z.literal(true, { error: 'Please accept the privacy policy to continue' });

// Anti-spam fields every form posts: a honeypot that must stay empty, and the time the form was rendered.
export const antiSpam = z.object({ website_url: z.string().max(0).optional().or(z.literal('')), startedAt: z.number().optional() });

export const exhibitorSchema = z.object({
  company: z.string().trim().min(2, 'Please enter your company name').max(120),
  website: opt(160),
  country: z.string().trim().min(2, 'Please choose a country').max(60),
  city: z.string().trim().min(2, 'Please enter your city').max(60),
  zones: z.array(z.string().max(80)).min(1, 'Choose at least one product zone').max(8),
  products: opt(600),
  standType: z.enum(['shell', 'raw', 'premium', 'not-sure']),
  areaSqm: z.coerce.number().int().min(9, 'Minimum stand size is 9 sqm').max(2000),
  heavyMachinery: z.boolean().default(false),
  powerNeeds: opt(300),
  sponsorship: z.boolean().default(false),
  name,
  designation: z.string().trim().min(2, 'Please enter your designation').max(80),
  email,
  phone,
  whatsappSame: z.boolean().default(true),
  message: opt(1200),
  updates: z.boolean().default(true),
  consent,
});

export const visitorSchema = z.object({
  name,
  designation: z.string().trim().min(2, 'Please enter your designation').max(80),
  company: z.string().trim().min(2, 'Please enter your company or practice name').max(120),
  businessType: z.string().trim().min(2, 'Please choose your business type').max(80),
  email,
  phone,
  country: z.string().trim().min(2).max(60).default('India'),
  city: z.string().trim().min(2, 'Please enter your city').max(60),
  interests: z.array(z.string().max(80)).min(1, 'Choose at least one interest').max(10),
  heardFrom: opt(60),
  updates: z.boolean().default(true),
  consent,
});

export const enquirySchema = z.object({
  topic: z.enum(['exhibiting', 'sponsorship', 'visiting', 'media', 'other']),
  name,
  email,
  phone,
  company: opt(120),
  message: z.string().trim().min(10, 'Please write a short message').max(2000),
  consent,
});

export const brochureSchema = z.object({
  name,
  email,
  phone,
  company: z.string().trim().min(2, 'Please enter your company name').max(120),
  interest: z.enum(['exhibiting', 'visiting', 'sponsoring']),
  consent,
});

export type ExhibitorInput = z.infer<typeof exhibitorSchema>;
export type VisitorInput = z.infer<typeof visitorSchema>;
export type EnquiryInput = z.infer<typeof enquirySchema>;
export type BrochureInput = z.infer<typeof brochureSchema>;

export const schemas = { exhibitor: exhibitorSchema, visitor: visitorSchema, enquiry: enquirySchema, brochure: brochureSchema } as const;
export type FormKind = keyof typeof schemas;

/** Flattens zod issues to { field: message } for inline display. */
export function fieldErrors(error: z.ZodError) {
  const out: Record<string, string> = {};
  for (const issue of error.issues) {
    const key = String(issue.path[0] ?? 'form');
    if (!out[key]) out[key] = issue.message;
  }
  return out;
}

export const standTypeLabel: Record<string, string> = { shell: 'Shell scheme', raw: 'Raw space', premium: 'Premium / pavilion', 'not-sure': 'Not sure yet' };
export const topicLabel: Record<string, string> = { exhibiting: 'Exhibiting', sponsorship: 'Sponsorship', visiting: 'Visiting', media: 'Media / press', other: 'Other' };
