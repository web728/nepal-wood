
import { z } from 'zod';

export const eventName = 'Nepal Wood Technical Conclave 2027';

export const seminarOptions = [
  { value: 'A', label: 'Seminar A — Silvicultural Management of Uttis' },
  { value: 'B', label: 'Seminar B — Commercial Agroforestry in the Terai' },
  { value: 'C', label: 'Seminar C — VINCHI: Energy Optimization' },
  { value: 'E', label: 'Seminar E — Smart Plywood Factory' },
  { value: 'D', label: 'Seminar D — Manufacturer–Dealer Gap' },
  { value: 'panel', label: 'Panel Discussion / Other expertise' },
] as const;

export const attendeeInterests = [
  { value: 'all', label: 'All five seminars and panel' },
  ...seminarOptions.slice(0, 5),
  { value: 'panel', label: 'Panel Discussion' },
] as const;

export const industryOptions = [
  'Forestry / Plantation / Agroforestry',
  'Plywood / Veneer / Panel Manufacturing',
  'Machinery / Automation / Technology',
  'Dealer / Distributor / Trader',
  'Furniture / Interior Products',
  'Academia / Research / Government',
  'Other',
] as const;

export const agenda = [
  {
    time: '09:30 – 10:00',
    code: 'ARRIVAL',
    title: 'Registration & Seating',
    note: 'Delegate check-in and welcome',
  },
  {
    time: '10:00 – 10:10',
    code: 'OPENING',
    title: 'Opening Remarks',
    note: 'Welcome by the organizers and overview of the day',
  },
  {
    time: '10:10 – 10:50',
    code: 'SEMINAR A',
    title: 'Silvicultural Management of Alnus nepalensis (Uttis)',
    note: 'Rotation cycles and harvesting techniques',
  },
  {
    time: '10:50 – 11:30',
    code: 'SEMINAR B',
    title: 'Commercial Agroforestry in the Terai',
    note: 'Eucalyptus, Populus and seasonal cash-crop intercropping',
  },
  {
    time: '11:30 – 12:10',
    code: 'SEMINAR C',
    title: 'VINCHI – Optimization of Energy Consumption',
    note: 'High-Moisture Assembly vs. Intensive Veneer Drying',
  },
  {
    time: '12:10 – 12:50',
    code: 'SEMINAR E',
    title: 'Smart Plywood Factory – From Log to Product',
    note: 'The fully automated journey',
  },
  {
    time: '12:50 – 13:30',
    code: 'SEMINAR D',
    title: 'Bridging the Manufacturer–Dealer Gap',
    note: "Dealers' expectations",
  },
  {
    time: '13:30 – 14:00',
    code: 'PANEL + Q&A',
    title: 'Panel Discussion & Open Q&A',
    note: 'All speakers, manufacturers and dealers',
  },
  {
    time: '14:00 – 14:10',
    code: 'CLOSING',
    title: 'Closing & Vote of Thanks',
    note: 'Conclusion of the Technical Conclave',
  },
] as const;

export const sessions = [
  {
    code: 'A',
    icon: 'trees',
    group: 'Forestry',
    title: 'Silvicultural Management of Alnus nepalensis (Uttis)',
    description:
      "Optimizing rotation cycles and harvesting techniques for Nepal's primary plywood timber in the sub-tropical mid-hills.",
  },
  {
    code: 'B',
    icon: 'sprout',
    group: 'Agroforestry',
    title: 'Commercial Agroforestry in the Terai',
    description:
      'Intercropping models using Eucalyptus and Populus alongside seasonal cash crops to supply veneer mills.',
  },
  {
    code: 'C',
    icon: 'zap',
    group: 'Efficiency',
    title: 'VINCHI – Optimization of Energy Consumption',
    description:
      'High-Moisture Assembly vs. Intensive Veneer Drying: understanding energy optimization alternatives.',
  },
  {
    code: 'E',
    icon: 'settings',
    group: 'Automation',
    title: 'Smart Plywood Factory – From Log to Product',
    description:
      'The fully automated journey through integrated, modern plywood manufacturing.',
  },
  {
    code: 'D',
    icon: 'handshake',
    group: 'Distribution',
    title: 'Bridging the Manufacturer–Dealer Gap',
    description:
      "Dealers' expectations and stronger relationships across supply, service and market development.",
  },
] as const;

export const audiences = [
  [
    'Timber & Forestry',
    'Forestry specialists, agroforestry practitioners, plantation owners and timber suppliers.',
  ],
  [
    'Manufacturing',
    'Plywood, veneer, panel and furniture production managers and factory owners.',
  ],
  [
    'Machinery & Technology',
    'Automation providers, OEMs, process engineers and technical consultants.',
  ],
  [
    'Dealers & Distributors',
    'Dealers, importers, distributors and industry business-development teams.',
  ],
  [
    'Institutions & Associations',
    'Trade bodies, academic researchers, technical institutions and policy stakeholders.',
  ],
  [
    'Industry Decision-Makers',
    'Founders, directors, purchasing heads and senior operations teams.',
  ],
] as const;

export const faqs = [
  [
    'Is this part of Nepal Wood International Expo 2027?',
    'Yes. The Technical Conclave is planned alongside the 12th Nepal Wood International Expo 2027. The expo runs 28–31 January at Bhrikuti Mandap, Kathmandu.',
  ],
  [
    'Is the conclave date confirmed?',
    'Not yet. The draft programme marks it as Day 2. 29 January 2027 is the proposed date inferred from the expo schedule and must be confirmed by the organizers.',
  ],
  [
    'Are the speakers announced?',
    'No speaker names have been confirmed in the supplied programme. The speaker application is intended for expressions of interest and review.',
  ],
  [
    'Does registration guarantee attendance or a speaking slot?',
    'No. Registrations and applications will be reviewed or confirmed by the event organizers.',
  ],
  [
    'Is there a participation fee?',
    'Conclave-specific fee and attendance eligibility have not yet been supplied. Please await organizer confirmation before any payment or travel commitment.',
  ],
  [
    'How long are the seminars?',
    'Each seminar is allocated 40 minutes: approximately 30 minutes of presentation followed by 10 minutes of audience Q&A.',
  ],
] as const;

// FORM VALIDATION

const fullName = z
  .string()
  .trim()
  .min(2, 'Please enter your full name')
  .max(120);

const email = z
  .email('Please enter a valid email')
  .trim()
  .toLowerCase()
  .max(150);

const phone = z
  .string()
  .trim()
  .max(30)
  .refine(
    (v) => v.replace(/\D/g, '').length >= 7,
    'Please enter a valid phone number'
  );

const requiredText = (label: string, max = 160) =>
  z.string().trim().min(2, `Please enter ${label}`).max(max);

const opt = (max: number) =>
  z.string().trim().max(max).optional().or(z.literal(''));

const base = {
  name: fullName,
  email,
  phone,
  organization: requiredText('your organization'),
  designation: requiredText('your designation', 120),
  country: requiredText('your country', 80),
  consent: z.literal(true, {
    error: 'Please accept the privacy policy to continue',
  }),
  website_url: z.string().max(0).optional().or(z.literal('')),
  startedAt: z.number().optional(),
};

export const speakerSchema = z.object({
  ...base,
  registration_type: z.literal('speaker'),
  topic: z.enum(['A', 'B', 'C', 'E', 'D', 'panel'], {
    error: 'Please choose a topic',
  }),
  professional_bio: z
    .string()
    .trim()
    .min(15, 'Please add your professional experience')
    .max(2000),
  abstract: z
    .string()
    .trim()
    .min(15, 'Please add your talk summary')
    .max(3000),
  profile_url: z
    .union([
      z.url('Please enter a valid profile URL').max(500),
      z.literal(''),
    ])
    .optional(),
});

export const attendeeSchema = z.object({
  ...base,
  registration_type: z.literal('attendee'),
  industry: z.enum(industryOptions, {
    error: 'Please select your industry',
  }),
  session_interest: z.enum(['all', 'A', 'B', 'C', 'E', 'D', 'panel'], {
    error: 'Please select a session',
  }),
  question: opt(1000),
});

export const conferenceSchema = z.discriminatedUnion(
  'registration_type',
  [speakerSchema, attendeeSchema]
);

export type SpeakerInput = z.infer<typeof speakerSchema>;
export type AttendeeInput = z.infer<typeof attendeeSchema>;
export type ConferenceInput = z.infer<typeof conferenceSchema>;
