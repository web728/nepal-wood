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
  company: z.string().trim()
    .min(2, 'Enter company name')
    .max(120),

  designation: z.string().trim()
    .min(2, 'Enter designation')
    .max(80),

  name: z.string().trim()
    .min(2, 'Enter contact person name')
    .max(80),

  email: z.email('Enter a valid business email')
    .trim()
    .toLowerCase()
    .max(120),

  phone,

  country: z.string().trim()
    .min(2, 'Enter country')
    .max(60),

  // Free text: no minimum length or content rules.
  products: z.string().default(''),

  // Optional, including custom dimensions.
  boothSize: z.string().trim().max(100).default(''),

  consent,
});

export const visitorSchema = z.object({
  name: z.string().trim()
    .min(2, 'Enter full name')
    .max(80),

  company: z.string().trim()
    .min(2, 'Enter company / organisation')
    .max(120),

  designation: z.string().trim()
    .min(2, 'Enter designation')
    .max(80),

  phone,

  email: z.email('Enter a valid email')
    .trim()
    .toLowerCase()
    .max(120),

  businessType: z.string().trim()
    .max(100)
    .default(''),

  country: z.string().trim()
    .min(2, 'Enter country')
    .max(60),

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
