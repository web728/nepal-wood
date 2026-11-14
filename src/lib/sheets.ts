
import 'server-only';

export type SheetTab = 'Website Enquiries';

export type SheetRow = Record<
  string,
  string | number | boolean | null | undefined
>;

export type SheetResult = {
  ok: boolean;
  at: Date;
  error?: string;
  skipped?: boolean;
  updatedRange?: string;
  provider?: 'google-api' | 'apps-script';
};

const TAB: SheetTab = 'Website Enquiries';

const HEADERS = [
  'Date',
  'Platform',
  'Register As',
  'Company Name',
  'Contact Person',
  'Designation',
  'Email Id',
  'Mobile No.',
  'Website',
  'Address',
  'Country',
  'Area of Interest',
  'Info. Get From',
  'Message',
  'Corrections',
  'STATUS 1',
  'STATUS 2',
  'STATUS 3',
  'STATUS 4',
  'STATUS 5',
] as const;

const ID_HEADER = 'Lead ID';

const B64 = () =>
  process.env.GOOGLE_SERVICE_ACCOUNT_BASE64 ||
  process.env.GOOGLE_CREDENTIALS_BASE64;

const SHEET_ID = () =>
  process.env.GOOGLE_SHEET_ID ||
  process.env.GOOGLE_SHEETS_ID;

export function sheetsConfigured(): boolean {
  return Boolean(
    (B64() && SHEET_ID()) ||
    process.env.SHEETS_WEBHOOK_URL
  );
}

function errorMessage(error: unknown): string {
  return error instanceof Error
    ? error.message
    : String(error);
}

function cleanValue(
  input: SheetRow[string]
): string | number | boolean {
  if (input === undefined || input === null) {
    return '';
  }

  return input;
}

function rowValues(row: SheetRow): (
  string | number | boolean
)[] {
  return [
    ...HEADERS.map((header) =>
      cleanValue(row[header])
    ),
    String(row.ID || ''),
  ];
}

function validateRow(
  tab: SheetTab,
  row: SheetRow
): void {
  if (tab !== TAB) {
    throw new Error(
      `Unexpected sheet tab: ${tab}`
    );
  }

  if (
    typeof row.ID !== 'string' ||
    !row.ID.trim()
  ) {
    throw new Error(
      'MongoDB Lead ID is required for Sheets append'
    );
  }
}

function checkHeaders(existing: string[]): void {
  if (!existing.length) return;

  for (let index = 0; index < HEADERS.length; index++) {
    const expected = HEADERS[index];
    const actual = (existing[index] || '').trim();

    if (actual !== expected) {
      throw new Error(
        `Sheet header mismatch at column ${index + 1}: ` +
        `expected "${expected}", found "${actual}"`
      );
    }
  }

  const idHeader = (existing[20] || '').trim();

  if (idHeader && idHeader !== ID_HEADER) {
    throw new Error(
      `Column U is already in use: "${idHeader}"`
    );
  }
}

/* =========================================
   GOOGLE SHEETS API
========================================= */

async function appendGoogleApi(
  tab: SheetTab,
  row: SheetRow
): Promise<SheetResult> {
  const at = new Date();

  try {
    validateRow(tab, row);

    const encoded = B64();
    const spreadsheetId = SHEET_ID();

    if (!encoded || !spreadsheetId) {
      throw new Error(
        'Google Sheets credentials or ID missing'
      );
    }

    let credentials: {
      client_email?: string;
      private_key?: string;
    };

    try {
      credentials = JSON.parse(
        Buffer.from(
          encoded.trim(),
          'base64'
        ).toString('utf8')
      );
    } catch {
      throw new Error(
        'Invalid Base64 Google credentials'
      );
    }

    if (
      !credentials.client_email ||
      !credentials.private_key
    ) {
      throw new Error(
        'Invalid Google service-account credentials'
      );
    }

    credentials.private_key =
      credentials.private_key.replace(/\\n/g, '\n');

    const { google } = await import('googleapis');

    const auth = new google.auth.GoogleAuth({
      credentials,
      scopes: [
        'https://www.googleapis.com/auth/spreadsheets',
      ],
    });

    const sheets = google.sheets({
      version: 'v4',
      auth,
    });

    const quotedTab = "'Website Enquiries'";

    // Read only the header row.
    const headerResponse =
      await sheets.spreadsheets.values.get(
        {
          spreadsheetId,
          range: `${quotedTab}!A1:U1`,
        },
        {
          timeout: 8000,
        }
      );

    const existingHeaders = (
      headerResponse.data.values?.[0] || []
    ).map(String);

    checkHeaders(existingHeaders);

    // Create headers only when sheet is empty.
    // Never replace the user's existing A:T headings.
    if (!existingHeaders.length) {
      await sheets.spreadsheets.values.update(
        {
          spreadsheetId,
          range: `${quotedTab}!A1:U1`,
          valueInputOption: 'RAW',
          requestBody: {
            values: [[...HEADERS, ID_HEADER]],
          },
        },
        {
          timeout: 8000,
        }
      );
    } else if (!existingHeaders[20]) {
      // U is reserved for an internal unique lead ID.
      await sheets.spreadsheets.values.update(
        {
          spreadsheetId,
          range: `${quotedTab}!U1`,
          valueInputOption: 'RAW',
          requestBody: {
            values: [[ID_HEADER]],
          },
        },
        {
          timeout: 8000,
        }
      );
    }

    // Retry safety: check whether this MongoDB lead
    // already exists in the hidden ID column.
    const idsResponse =
      await sheets.spreadsheets.values.get(
        {
          spreadsheetId,
          range: `${quotedTab}!U2:U`,
        },
        {
          timeout: 8000,
        }
      );

    const leadId = String(row.ID);

    const existingIndex = (
      idsResponse.data.values || []
    ).findIndex(
      (cells: string[]) =>
        String(cells[0] || '') === leadId
    );

    if (existingIndex !== -1) {
      // Already appended successfully.
      // Do not overwrite any of its fields.
      return {
        ok: true,
        at,
        provider: 'google-api',
        updatedRange: `${quotedTab}!A${existingIndex + 2}:U${existingIndex + 2}`,
      };
    }

    // Append new row at the bottom of the table.
    const response =
      await sheets.spreadsheets.values.append(
        {
          spreadsheetId,
          range: `${quotedTab}!A:U`,
          valueInputOption: 'RAW',
          insertDataOption: 'INSERT_ROWS',
          requestBody: {
            values: [rowValues(row)],
          },
        },
        {
          timeout: 8000,
        }
      );

    const updates = response.data.updates;

    if (updates?.updatedRows !== 1) {
      throw new Error(
        'Google Sheets did not confirm one appended row'
      );
    }

    return {
      ok: true,
      at,
      provider: 'google-api',
      updatedRange: updates.updatedRange || undefined,
    };
  } catch (error) {
    return {
      ok: false,
      at,
      provider: 'google-api',
      error: errorMessage(error),
    };
  }
}

/* =========================================
   GOOGLE APPS SCRIPT WEBHOOK
========================================= */

async function appendAppsScript(
  tab: SheetTab,
  row: SheetRow
): Promise<SheetResult> {
  const at = new Date();
  const url = process.env.SHEETS_WEBHOOK_URL;

  if (!url) {
    return {
      ok: false,
      at,
      skipped: true,
      error: 'SHEETS_WEBHOOK_URL not configured',
    };
  }

  const controller = new AbortController();

  const timeout = setTimeout(
    () => controller.abort(),
    10000
  );

  try {
    validateRow(tab, row);

    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'text/plain;charset=utf-8',
      },
      body: JSON.stringify({
        secret: process.env.SHEETS_WEBHOOK_SECRET || '',
        action: 'append',
        tab,
        row,
      }),
      redirect: 'follow',
      signal: controller.signal,
      cache: 'no-store',
    });

    const raw = await response.text();

    let result: {
      ok?: boolean;
      error?: string;
      updatedRange?: string;
    };

    try {
      result = JSON.parse(raw);
    } catch {
      throw new Error(
        `Apps Script returned invalid JSON (HTTP ${response.status})`
      );
    }

    if (!response.ok || !result.ok) {
      throw new Error(
        result.error ||
          `Apps Script returned HTTP ${response.status}`
      );
    }

    return {
      ok: true,
      at,
      provider: 'apps-script',
      updatedRange: result.updatedRange,
    };
  } catch (error) {
    return {
      ok: false,
      at,
      provider: 'apps-script',
      error: errorMessage(error),
    };
  } finally {
    clearTimeout(timeout);
  }
}

/* =========================================
   PUBLIC DELIVERY FUNCTION
========================================= */

export async function upsertSheetRow(
  tab: SheetTab,
  row: SheetRow
): Promise<SheetResult> {
  // Function name kept for compatibility with
  // existing lead-delivery.ts / admin actions.
  //
  // Behaviour is now append-only with ID check.

  if (B64() && SHEET_ID()) {
    return appendGoogleApi(tab, row);
  }

  if (process.env.SHEETS_WEBHOOK_URL) {
    return appendAppsScript(tab, row);
  }

  return {
    ok: false,
    at: new Date(),
    skipped: true,
    error: 'No Google Sheets provider configured',
  };
}
