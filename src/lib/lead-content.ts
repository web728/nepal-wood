
import 'server-only';

import type { Document } from 'mongodb';

import {
  COLLECTIONS,
  type LeadCollection,
} from './db';

import {
  emailShell,
  rowsTable,
  leadRecipients,
} from './mail';

import type {
  SheetRow,
  SheetTab,
} from './sheets';

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

function value(v: unknown): string {
  if (v === null || v === undefined) return '';
  if (v instanceof Date) return v.toISOString();
  if (Array.isArray(v)) {
    return v.map(value).join(', ');
  }
  if (typeof v === 'object') {
    return JSON.stringify(v);
  }
  return String(v);
}

function sheetDate(input: unknown): string {
  if (!input) return '';

  const d = input instanceof Date
    ? input
    : new Date(String(input));

  if (Number.isNaN(d.getTime())) {
    return '';
  }

  return new Intl.DateTimeFormat('en-GB', {
    timeZone: 'Asia/Kathmandu',
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
    hour12: false,
  }).format(d);
}

function meta(doc: Document): Record<string, unknown> {
  const m = doc.meta;

  if (
    m &&
    typeof m === 'object' &&
    !Array.isArray(m)
  ) {
    return m as Record<string, unknown>;
  }

  return {};
}

/* =====================================
   SHARED GOOGLE SHEETS COLUMNS
===================================== */

function baseRow(
  doc: Document,
  registerAs: string
): SheetRow {
  const m = meta(doc);

  return {
    ID: value(doc._id),

    Date: sheetDate(doc.createdAt),
    Platform: 'Website',
    'Register As': registerAs,

    'Company Name': value(doc.company),
    'Contact Person': value(doc.name),
    Designation: value(doc.designation),
    'Email Id': value(doc.email),
    'Mobile No.': value(doc.phone),
    Website: value(doc.website),
    Address: value(doc.address),
    Country: value(doc.country),

    'Area of Interest': '',
    'Info. Get From': value(
      m.source || m.medium || m.referrer
    ),
    Message: '',

    Corrections: '',
    'STATUS 1': '',
    'STATUS 2': '',
    'STATUS 3': '',
    'STATUS 4': '',
    'STATUS 5': '',
  };
}

/* =====================================
   EXHIBITOR REGISTRATION
===================================== */

export function exhibitorRow(
  doc: Document
): SheetRow {
  return {
    ...baseRow(doc, 'Exhibitor'),

    'Area of Interest': value(doc.products),

    Message: [
      doc.boothSize
        ? `Preferred booth size: ${value(doc.boothSize)}`
        : '',
      doc.ref
        ? `Reference: ${value(doc.ref)}`
        : '',
    ].filter(Boolean).join(' | '),
  };
}

/* =====================================
   VISITOR REGISTRATION
===================================== */

export function visitorRow(
  doc: Document
): SheetRow {
  return {
    ...baseRow(doc, 'Visitor'),

    'Area of Interest': value(
      doc.businessType
    ),

    Message: doc.badgeId
      ? `Badge ID: ${value(doc.badgeId)}`
      : '',
  };
}

/* =====================================
   GENERAL ENQUIRY
===================================== */

export function enquiryRow(
  doc: Document
): SheetRow {
  return {
    ...baseRow(doc, 'Enquiry'),

    'Area of Interest': value(doc.topic),
    Message: value(doc.message),
  };
}

/* =====================================
   BROCHURE DOWNLOAD
===================================== */

export function brochureRow(
  doc: Document
): SheetRow {
  return {
    ...baseRow(doc, 'Brochure Download'),

    'Area of Interest': value(doc.interest),

    Message: doc.ref
      ? `Reference: ${value(doc.ref)}`
      : '',
  };
}

/* =====================================
   ALL FORMS -> SAME SHEET TAB
===================================== */

export const sheetFor: Record<
  LeadCollection,
  SheetMapping
> = {
  [COLLECTIONS.exhibitors]: {
    tab: 'Website Enquiries',
    row: exhibitorRow,
  },

  [COLLECTIONS.visitors]: {
    tab: 'Website Enquiries',
    row: visitorRow,
  },

  [COLLECTIONS.enquiries]: {
    tab: 'Website Enquiries',
    row: enquiryRow,
  },

  [COLLECTIONS.brochure]: {
    tab: 'Website Enquiries',
    row: brochureRow,
  },
};

/* =====================================
   EMAIL HELPERS
===================================== */

function textTable(
  rows: [string, unknown][]
): string {
  return rows
    .filter(([, v]) =>
      v !== null &&
      v !== undefined &&
      v !== ''
    )
    .map(([key, v]) =>
      `${key}: ${value(v)}`
    )
    .join('\n');
}

function createEmail(
  to: string | string[],
  subject: string,
  title: string,
  rows: [string, unknown][],
  replyTo?: string
): MailContent {
  return {
    to,
    subject,

    html: emailShell(
      title,
      rowsTable(rows)
    ),

    text:
      `${title}\n\n` +
      `${textTable(rows)}\n\n${EVENT}`,

    ...(replyTo ? { replyTo } : {}),
  };
}

function details(
  doc: Document
): [string, unknown][] {
  return [
    ['Company Name', doc.company],
    ['Contact Person', doc.name],
    ['Designation', doc.designation],
    ['Email Id', doc.email],
    ['Mobile No.', doc.phone],
    ['Country', doc.country],
  ];
}

/* =====================================
   ADMIN EMAIL NOTIFICATIONS
===================================== */

export function adminEmail(
  collection: LeadCollection,
  doc: Document
): MailContent | null {
  const recipients = leadRecipients();

  if (!recipients.length) {
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
        ['Reference', doc.ref],
        ...details(doc),
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
        ...details(doc),
        ['Business / Category', doc.businessType],
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
        ...details(doc),
        ['Topic', doc.topic],
        ['Message', doc.message],
      ],
      replyTo
    );
  }

  return null;
}

/* =====================================
   USER CONFIRMATION EMAILS
===================================== */

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
      'Your exhibitor enquiry has been received',
      [
        ['Contact Person', doc.name],
        ['Company', doc.company],
        ['Reference', doc.ref],
        ['Preferred Booth Size', doc.boothSize],
        [
          'Next Step',
          'Our exhibition team will review your enquiry and contact you.',
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
        ['Company', doc.company],
        ['Badge ID', doc.badgeId],
        ['Event Dates', '28–31 January 2027'],
        ['Venue', 'Bhrikuti Mandap, Kathmandu'],
      ]
    );
  }

  return null;
}
