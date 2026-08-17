export type RegisterAs =
  | "Visitor"
  | "Exhibitor"
  | "Contact Enquiry"
  | "Cookie Consent"
  | "Brochure Download Request"; // Added for Brochure Download

/** Row shape for the shared "Website Enquries" Google Sheet, columns A-O. */
export interface SheetRow {
  date: string; // A
  platform: string; // B — e.g. "Nepal Wood Website"
  registerAs: RegisterAs; // C
  companyName: string; // D
  contactPerson: string; // E
  designation: string; // F
  email: string; // G
  mobile: string; // H
  website: string; // I
  address: string; // J
  country: string; // K
  areaOfInterest: string; // L
  infoGet: string; // M
  message: string; // N
  correctionNotes: string; // O
}

export type FormType =
  | "contact"
  | "exhibitor-registration"
  | "visitor-registration"
  | "cookie-consent"
  | "brochure"
  | "brochure_user_ack"; // Added for Admin notification & User Confirmation