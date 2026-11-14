
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

type SheetMapping = {
  tab: SheetTab;
  row: (doc: Document) => SheetRow;
};

const EVENT = 'Nepal Wood International Expo 2027';

function value(input: unknown): string {
  if (input === null || input === undefined) return '';
  if (Array.isArray(input)) return input.map(value).join(', ');
  if (input instanceof Date) return input.toISOString();
  if (typeof input === 'object') return JSON.stringify(input);
  return String(input);
}

function date(input: unknown): string {
  if (!input) return '';

  const d =
    input instanceof Date
      ? input
      : new Date(String(input));

  return Number.isNaN(d.getTime())
    ? ''
    : d.toISOString();
}

function id(doc: Document): string {
  return value(doc._id);
}

function metadata(doc: Document): Record<string, unknown> {
  const m = doc.meta;

  if (m && typeof m === 'object' && !Array.isArray(m)) {
    return m as Record<string, unknown>;
  }

  return {};
}

function commonRow(doc: Document): SheetRow {
  const m = metadata(doc);

  return {
    ID: id(doc),
    Reference: value(doc.ref ?? doc.badgeId),
    'Created At': date(doc.createdAt),
    Name: value(doc.name),
    Email: value(doc.email),
    Phone: value(doc.phone),
    Company: value(doc.company),
    Country: value(doc.country),
    Source: value(m.source),
    Medium: value(m.medium),
    Campaign: value(m.campaign),
    Page: value(m.page),
    Referrer: value(m.referrer),
  };
}

/* ======================================
   GOOGLE SHEETS ROW MAPPINGS
====================================== */

export function exhibitorRow(doc: Document): SheetRow {
  return {
    ID: id(doc),
    Reference: value(doc.ref),
    'Created At': date(doc.createdAt),

    'Company Name': value(doc.company),
    Designation: value(doc.designation),
    'Contact Person': value(doc.name),
    'Business Email': value(doc.email),
    'Mobile / WhatsApp': value(doc.phone),
    Country: value(doc.country),
    'Products and Services': value(doc.products),
    'Preferred Booth Size': value(doc.boothSize),

    Status: value(doc.status),
    Notes: value(doc.notes),
    'Updated At': date(doc.updatedAt),
  };
}

export function visitorRow(doc: Document): SheetRow {
  return {
    ID: id(doc),
    'Badge ID': value(doc.badgeId),
    'Created At': date(doc.createdAt),

    'Full Name': value(doc.name),
    'Company / Organisation': value(doc.company),
    Designation: value(doc.designation),
    'Mobile / WhatsApp': value(doc.phone),
    Email: value(doc.email),
    'Business / Category': value(doc.businessType),
    Country: value(doc.country),

    'Checked In At': date(doc.checkedInAt),
  };
}

export function enquiryRow(doc: Document): SheetRow {
  return {
    ...commonRow(doc),
    Topic: value(doc.topic),
    Message: value(doc.message),
    Status: value(doc.status),
    Notes: value(doc.notes),
    'Updated At': date(doc.updatedAt),
  };
}

export function brochureRow(doc: Document): SheetRow {
  return {
    ...commonRow(doc),
    Interest: value(doc.interest),
    Updates: value(doc.updates),
  };
}

export const sheetFor: Record<
  LeadCollection,
  SheetMapping
> = {
  [COLLECTIONS.exhibitors]: {
    tab: 'Exhibitor enquiries',
    row: exhibitorRow,
  },

  [COLLECTIONS.visitors]: {
    tab: 'Visitors',
    row: visitorRow,
  },

  [COLLECTIONS.enquiries]: {
    tab: 'Enquiries',
    row: enquiryRow,
  },

  [COLLECTIONS.brochure]: {
    tab: 'Brochure downloads',
    row: brochureRow,
  },
};

/* ======================================
   EMAIL UTILITIES
====================================== */

function textTable(rows: [string, unknown][]): string {
  return rows
    .filter(
      ([, v]) =>
        v !== null &&
        v !== undefined &&
        v !== ''
    )
    .map(([key, v]) => `${key}: ${value(v)}`)
    .join('\n');
}

function createEmail(
  to: string | string[],
  subject: string,
  title: string,
  rows: [string, unknown][],
  replyTo?: string
): MailContent {
  const html = emailShell(
    title,
    `
      <p style="margin:0 0 20px;font-size:14px;
                line-height:1.7;color:#75645a">
        Nepal Wood International Expo 2027
      </p>
      ${rowsTable(rows)}
    `
  );

  return {
    to,
    subject,
    html,
    text: `${title}\n\n${textTable(rows)}\n\n${EVENT}`,
    ...(replyTo ? { replyTo } : {}),
  };
}

function leadDetails(doc: Document): [string, unknown][] {
  return [
    ['Reference', doc.ref ?? doc.badgeId],
    ['Name', doc.name],
    ['Email', doc.email],
    ['Mobile / WhatsApp', doc.phone],
    ['Company', doc.company],
    ['Designation', doc.designation],
    ['Country', doc.country],
  ];
}

/* ======================================
   ADMIN EMAILS
   Sent to LEADS_NOTIFY_TO recipients
====================================== */

export function adminEmail(
  collection: LeadCollection,
  doc: Document
): MailContent | null {
  const recipients = leadRecipients();

  if (recipients.length === 0) {
    return null;
  }

  const replyTo =
    typeof doc.email === 'string' &&
    doc.email.includes('@')
      ? doc.email
      : undefined;

  if (collection === COLLECTIONS.exhibitors) {
    return createEmail(
      recipients,
      `New Exhibitor Enquiry | ${EVENT}`,
      'New exhibitor enquiry received',
      [
        ...leadDetails(doc),
        ['Products and Services', doc.products],
        ['Preferred Booth Size', doc.boothSize],
      ],
      replyTo
    );
  }

  if (collection === COLLECTIONS.visitors) {
    return createEmail(
      recipients,
      `New Visitor Registration | ${EVENT}`,
      'New visitor registration received',
      [
        ['Badge ID', doc.badgeId],
        ['Full Name', doc.name],
        ['Company / Organisation', doc.company],
        ['Designation', doc.designation],
        ['Mobile / WhatsApp', doc.phone],
        ['Email', doc.email],
        ['Business / Category', doc.businessType],
        ['Country', doc.country],
      ],
      replyTo
    );
  }

  if (collection === COLLECTIONS.enquiries) {
    return createEmail(
      recipients,
      `New Website Enquiry | ${EVENT}`,
      'New website enquiry received',
      [
        ...leadDetails(doc),
        ['Topic', doc.topic],
        ['Message', doc.message],
      ],
      replyTo
    );
  }

  return null;
}

/* ======================================
   CUSTOMER CONFIRMATION EMAILS
====================================== */

export function userEmail(
  collection: LeadCollection,
  doc: Document
): MailContent | null {
  const recipient = value(doc.email).trim();

  if (!recipient) {
    return null;
  }

  if (collection === COLLECTIONS.exhibitors) {
    return createEmail(
      recipient,
      `Exhibitor Enquiry Received | ${EVENT}`,
      'We have received your exhibitor enquiry',
      [
        ['Contact Person', doc.name],
        ['Company', doc.company],
        ['Reference', doc.ref],
        ['Products and Services', doc.products],
        ['Preferred Booth Size', doc.boothSize],
        [
          'Next Step',
          'Our exhibition team will review your request and contact you.',
        ],
      ]
    );
  }

  if (collection === COLLECTIONS.visitors) {
    return createEmail(
      recipient,
      `Visitor Registration Confirmed | ${EVENT}`,
      'Your visitor registration is confirmed',
      [
        ['Full Name', doc.name],
        ['Company / Organisation', doc.company],
        ['Badge ID', doc.badgeId],
        ['Event Dates', '28–31 January 2027'],
        ['Venue', 'Bhrikuti Mandap, Kathmandu'],
        [
          'Next Step',
          'Use your registration badge details when visiting the expo.',
        ],
      ]
    );
  }

  return null;
}
