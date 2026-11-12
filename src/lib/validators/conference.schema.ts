import { z } from "zod";

// Labels intentionally match the original Technical Conclave HTML, including
// the agenda's Seminar E / Seminar D ordering.
export const speakerTopicOptions = [
  "Seminar A — Silvicultural Management of Uttis",
  "Seminar B — Commercial Agroforestry in the Terai",
  "Seminar C — VINCHI: Energy Optimization",
  "Seminar E — Smart Plywood Factory",
  "Seminar D — Manufacturer–Dealer Gap",
  "Panel Discussion / Other expertise",
] as const;

export const industryOptions = [
  "Forestry / Plantation / Agroforestry",
  "Plywood / Veneer / Panel Manufacturing",
  "Machinery / Automation / Technology",
  "Dealer / Distributor / Trader",
  "Furniture / Interior Products",
  "Academia / Research / Government",
  "Other",
] as const;

export const sessionInterestOptions = [
  "All five seminars and panel",
  "A — Silvicultural Management of Uttis",
  "B — Commercial Agroforestry in the Terai",
  "C — VINCHI: Energy Optimization",
  "E — Smart Plywood Factory",
  "D — Manufacturer–Dealer Gap",
  "Panel Discussion",
] as const;

const requiredText = (label: string, max: number) =>
  z.string().trim().min(1, `${label} is required`).max(max, `${label} is too long`);

const commonFields = z.object({
  fullName: requiredText("Full name", 120),
  email: z.string().trim().min(1, "Business email is required").email("Enter a valid email address").max(150),
  phone: requiredText("Phone / WhatsApp", 30),
  organization: requiredText("Organization", 160),
  designation: requiredText("Designation", 120),
  country: requiredText("Country", 80),
  consent: z.boolean().refine((value) => value, "Please accept the consent statement"),
  recaptchaToken: z.string().min(1, "Please verify you are not a robot"),
});

export const speakerFormSchema = commonFields.extend({
  registrationType: z.literal("speaker"),
  topic: z.enum(speakerTopicOptions, { message: "Please select a preferred seminar topic" }),
  professionalBio: requiredText("Professional bio / relevant experience", 2000),
  abstract: requiredText("Proposed talk summary", 3000),
  profileUrl: z.union([
    z.literal(""),
    z.string().trim().url("Enter a valid URL").refine(
      (value) => /^https?:\/\//i.test(value),
      "Only http or https profile links are allowed"
    ),
  ]),
});

export const attendeeFormSchema = commonFields.extend({
  registrationType: z.literal("attendee"),
  industry: z.enum(industryOptions, { message: "Please select an industry category" }),
  sessionInterest: z.enum(sessionInterestOptions, { message: "Please select a session of interest" }),
  question: z.string().trim().max(1000, "Question is too long"),
});

export const conferenceRegistrationSchema = z.discriminatedUnion("registrationType", [
  speakerFormSchema,
  attendeeFormSchema,
]);

export type SpeakerFormValues = z.infer<typeof speakerFormSchema>;
export type AttendeeFormValues = z.infer<typeof attendeeFormSchema>;
export type ConferenceRegistrationValues = z.infer<typeof conferenceRegistrationSchema>;
