import 'server-only';

import type { Document } from 'mongodb';
import { COLLECTIONS, type LeadCollection } from './db';
import { emailShell, rowsTable, leadRecipients } from './mail';
import type { SheetRow, SheetTab } from './sheets';

type MailContent = {
  to: string | string[];
  subject: string;
  html: string;
  text: string;
  replyTo?: string;
};
type SheetMapping = { tab: SheetTab; row: (doc: Document) => SheetRow };
const EVENT = 'Nepal Wood International Expo 2027';

function value(v: unknown): string {
  if (v === null || v === undefined) return '';
  if (v instanceof Date) return v.toISOString();
  if (Array.isArray(v)) return v.map(value).join(', ');
  if (typeof v === 'object') return JSON.stringify(v);
  return String(v);
}

function sheetDate(input: unknown): string {
  if (!input) return '';
  const d = input instanceof Date ? input : new Date(String(input));
  if (Number.isNaN(d.getTime())) return '';
  return new Intl.DateTimeFormat('en-GB', {
    timeZone: 'Asia/Kathmandu',
    day: '2-digit', month: '2-digit', year: 'numeric',
    hour: '2-digit', minute: '2-digit', hour12: false,
  }).format(d);
}

function meta(doc: Document): Record<string, unknown> {
  const m = doc.meta;
  return m && typeof m === 'object' && !Array.isArray(m)
    ? m as Record<string, unknown> : {};
}

function isConclave(doc: Document): boolean {
  return doc.form === 'conclave' &&
    (doc.registration_type === 'speaker' || doc.registration_type === 'attendee');
}

function baseRow(doc: Document, registerAs: string): SheetRow {
  const m = meta(doc);
  return {
    ID: value(doc._id),
    Date: sheetDate(doc.createdAt),
    Platform: 'Website',
    'Register As': registerAs,
    'Company Name': value(doc.company ?? doc.organization),
    'Contact Person': value(doc.name),
    Designation: value(doc.designation),
    'Email Id': value(doc.email),
    'Mobile No.': value(doc.phone),
    Website: value(doc.website),
    Address: value(doc.address),
    Country: value(doc.country),
    'Area of Interest': '',
    'Info. Get From': value(m.source || m.medium || m.referrer),
    Message: '',
    Corrections: '',
    'STATUS 1': '', 'STATUS 2': '', 'STATUS 3': '', 'STATUS 4': '', 'STATUS 5': '',
  };
}

export function exhibitorRow(doc: Document): SheetRow {
  return {
    ...baseRow(doc, 'Exhibitor'),
    'Area of Interest': value(doc.products),
    Message: [
      doc.boothSize ? `Preferred booth size: ${value(doc.boothSize)}` : '',
      doc.ref ? `Reference: ${value(doc.ref)}` : '',
    ].filter(Boolean).join(' | '),
  };
}

export function visitorRow(doc: Document): SheetRow {
  return {
    ...baseRow(doc, 'Visitor'),
    'Area of Interest': value(doc.businessType),
    Message: doc.badgeId ? `Badge ID: ${value(doc.badgeId)}` : '',
  };
}

export function enquiryRow(doc: Document): SheetRow {
  if (isConclave(doc)) {
    const speaker = doc.registration_type === 'speaker';
    return {
      ...baseRow(doc, speaker ? 'Conference Speaker' : 'Conference Attendee'),
      'Area of Interest': speaker
        ? `Seminar: ${value(doc.topic)}`
        : `${value(doc.industry)} | Session: ${value(doc.session_interest)}`,
      Message: [
        `Reference: ${value(doc.ref)}`,
        speaker ? `Professional bio: ${value(doc.professional_bio)}` : '',
        speaker ? `Talk summary: ${value(doc.abstract)}` : '',
        speaker && doc.profile_url ? `Profile: ${value(doc.profile_url)}` : '',
        !speaker && doc.question ? `Question: ${value(doc.question)}` : '',
      ].filter(Boolean).join('\n\n'),
    };
  }
  return {
    ...baseRow(doc, 'Enquiry'),
    'Area of Interest': value(doc.topic),
    Message: value(doc.message),
  };
}

export function brochureRow(doc: Document): SheetRow {
  return {
    ...baseRow(doc, 'Brochure Download'),
    'Area of Interest': value(doc.interest),
    Message: doc.ref ? `Reference: ${value(doc.ref)}` : '',
  };
}

export const sheetFor: Record<LeadCollection, SheetMapping> = {
  [COLLECTIONS.exhibitors]: { tab: 'Website Enquiries', row: exhibitorRow },
  [COLLECTIONS.visitors]: { tab: 'Website Enquiries', row: visitorRow },
  [COLLECTIONS.enquiries]: { tab: 'Website Enquiries', row: enquiryRow },
  [COLLECTIONS.brochure]: { tab: 'Website Enquiries', row: brochureRow },
};

function textTable(rows: [string, unknown][]): string {
  return rows
    .filter(([, v]) => v !== null && v !== undefined && v !== '')
    .map(([key, v]) => `${key}: ${value(v)}`).join('\n');
}

function createEmail(
  to: string | string[], subject: string, title: string,
  rows: [string, unknown][], replyTo?: string
): MailContent {
  return {
    to, subject,
    html: emailShell(title, rowsTable(rows)),
    text: `${title}\n\n${textTable(rows)}\n\n${EVENT}`,
    ...(replyTo ? { replyTo } : {}),
  };
}

function details(doc: Document): [string, unknown][] {
  return [
    ['Company Name', doc.company ?? doc.organization],
    ['Contact Person', doc.name], ['Designation', doc.designation],
    ['Email Id', doc.email], ['Mobile No.', doc.phone], ['Country', doc.country],
  ];
}

function conferenceDetails(doc: Document): [string, unknown][] {
  const speaker = doc.registration_type === 'speaker';
  return [
    ['Reference', doc.ref],
    ['Registration Type', speaker ? 'Conference Speaker' : 'Conference Attendee'],
    ...details(doc),
    ...(speaker ? [
      ['Seminar Topic', doc.topic],
      ['Professional Bio', doc.professional_bio],
      ['Talk Summary', doc.abstract],
      ['Profile URL', doc.profile_url],
    ] as [string, unknown][] : [
      ['Industry', doc.industry],
      ['Session Interest', doc.session_interest],
      ['Question', doc.question],
    ] as [string, unknown][]),
  ];
}

export function adminEmail(collection: LeadCollection, doc: Document): MailContent | null {
  const recipients = leadRecipients();
  if (!recipients.length) return null;
  const replyTo = typeof doc.email === 'string' && doc.email.includes('@')
    ? doc.email : undefined;

  if (collection === COLLECTIONS.exhibitors) {
    return createEmail(recipients, `New Exhibitor Enquiry | ${EVENT}`,
      'New exhibitor enquiry received', [
        ['Reference', doc.ref], ...details(doc),
        ['Products and Services', doc.products],
        ['Preferred Booth Size', doc.boothSize],
      ], replyTo);
  }
  if (collection === COLLECTIONS.visitors) {
    return createEmail(recipients, `New Visitor Registration | ${EVENT}`,
      'New visitor registration received', [
        ['Badge ID', doc.badgeId], ...details(doc),
        ['Business / Category', doc.businessType],
      ], replyTo);
  }
  if (collection === COLLECTIONS.enquiries) {
    if (isConclave(doc)) {
      const kind = doc.registration_type === 'speaker' ? 'Speaker' : 'Attendee';
      return createEmail(recipients, `New Conclave ${kind} | ${EVENT}`,
        `New Technical Conclave ${kind.toLowerCase()} registration`,
        conferenceDetails(doc), replyTo);
    }
    return createEmail(recipients, `New Website Enquiry | ${EVENT}`,
      'New website enquiry received', [
        ...details(doc), ['Topic', doc.topic], ['Message', doc.message],
      ], replyTo);
  }
  return null;
}

export function userEmail(collection: LeadCollection, doc: Document): MailContent | null {
  const recipient = value(doc.email).trim();
  if (!recipient) return null;

  if (collection === COLLECTIONS.exhibitors) {
    return createEmail(recipient, `Exhibitor Enquiry Received | ${EVENT}`,
      'Your exhibitor enquiry has been received', [
        ['Contact Person', doc.name], ['Company', doc.company],
        ['Reference', doc.ref], ['Preferred Booth Size', doc.boothSize],
        ['Next Step', 'Our team will review your enquiry and contact you.'],
      ]);
  }
  if (collection === COLLECTIONS.visitors) {
    return createEmail(recipient, `Visitor Registration Confirmed | ${EVENT}`,
      'Your visitor registration is confirmed', [
        ['Full Name', doc.name], ['Company', doc.company],
        ['Badge ID', doc.badgeId], ['Event Dates', '28–31 January 2027'],
        ['Venue', 'Bhrikuti Mandap, Kathmandu'],
      ]);
  }
  if (collection === COLLECTIONS.enquiries && isConclave(doc)) {
    const speaker = doc.registration_type === 'speaker';
    return createEmail(recipient,
      `${speaker ? 'Speaker Application' : 'Attendee Interest'} Received | Nepal Wood Technical Conclave 2027`,
      speaker ? 'We received your speaker application' : 'We received your attendee registration of interest',
      [
        ['Full Name', doc.name], ['Organization', doc.organization],
        ['Reference', doc.ref],
        ['Next Step', speaker
          ? 'Our team will review your proposal. A speaking slot is not guaranteed.'
          : 'The organisers will confirm participation details. Attendance is not yet guaranteed.'],
      ]);
  }
  return null;
}
