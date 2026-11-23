import 'server-only';

import { google } from 'googleapis';

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

  provider?: 'google-api';

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
const SOURCE_HEADER = 'Ad Source';

const API_TIMEOUT_MS = 10000;

const getBase64 = () =>

  process.env.GOOGLE_SERVICE_ACCOUNT_BASE64 ||

  process.env.GOOGLE_CREDENTIALS_BASE64;

const getSheetId = () =>

  process.env.GOOGLE_SHEET_ID ||

  process.env.GOOGLE_SHEETS_ID;

function getError(error: unknown): string {

  return error instanceof Error

    ? error.message

    : String(error);

}

export function sheetsConfigured(): boolean {

  return Boolean(getBase64() && getSheetId());

}

/* =====================================

   SERVICE ACCOUNT AUTHENTICATION

===================================== */

function getCredentials(): {

  client_email: string;

  private_key: string;

} {

  const encoded = getBase64();

  if (!encoded) {

    throw new Error(

      'GOOGLE_SERVICE_ACCOUNT_BASE64 is missing'

    );

  }

  let parsed: unknown;

  try {

    parsed = JSON.parse(

      Buffer.from(

        encoded.trim(),

        'base64'

      ).toString('utf8')

    );

  } catch {

    throw new Error(

      'Invalid Base64 Google Service Account JSON'

    );

  }

  if (

    !parsed ||

    typeof parsed !== 'object' ||

    !('client_email' in parsed) ||

    !('private_key' in parsed)

  ) {

    throw new Error(

      'Service Account email or private key missing'

    );

  }

  const data = parsed as {

    client_email?: unknown;

    private_key?: unknown;

  };

  if (

    typeof data.client_email !== 'string' ||

    typeof data.private_key !== 'string'

  ) {

    throw new Error(

      'Invalid Service Account credentials'

    );

  }

  return {

    client_email: data.client_email,

    private_key: data.private_key.replace(

      /\\\\\n/g,

      '\n'

    ),

  };

}

function createSheetsClient() {

  const credentials = getCredentials();

  const auth = new google.auth.GoogleAuth({

    credentials,

    scopes: [

      'https://www.googleapis.com/auth/spreadsheets',

    ],

  });

  return google.sheets({

    version: 'v4',

    auth,

  });

}

/* =====================================

   ROW FORMATTING

===================================== */

function sheetValue(

  input: SheetRow[string]

): string | number | boolean {

  return input === null || input === undefined

    ? ''

    : input;

}

function makeValues(

  row: SheetRow

): Array<string | number | boolean> {

  return [

    ...HEADERS.map((header) =>

      sheetValue(row[header])

    ),

    String(row.ID),
    sheetValue(row[SOURCE_HEADER] ?? 'direct'),

  ];

}

function validateHeaders(existing: string[]) {

  if (existing.length === 0) {

    return;

  }

  for (let i = 0; i < HEADERS.length; i++) {

    const actual = String(

      existing[i] || ''

    ).trim();

    if (actual !== HEADERS[i]) {

      throw new Error(

        `Website Enquiries column ${i + 1} ` +

        `header mismatch. Expected "${HEADERS[i]}", ` +

        `found "${actual}".`

      );

    }

  }

  const columnV = String(existing[21] || '').trim();
  if (columnV && columnV !== SOURCE_HEADER) {
    throw new Error('Column V is already used. Reserve column V for Ad Source.');
  }

  const columnU = String(

    existing[20] || ''

  ).trim();

  if (

    columnU &&

    columnU !== ID_HEADER

  ) {

    throw new Error(

      'Column U is already used. ' +

      'Reserve column U for Lead ID.'

    );

  }

}

/* =====================================

   CHECK FOR EXISTING LEAD

===================================== */

async function findLeadRow(

  sheets: ReturnType<typeof createSheetsClient>,

  spreadsheetId: string,

  leadId: string

): Promise<number | null> {

  const result =

    await sheets.spreadsheets.values.get(

      {

        spreadsheetId,

        range: "'Website Enquiries'!U2:U",

      },

      {

        timeout: API_TIMEOUT_MS,

      }

    );

  const ids: unknown[][] =

    result.data.values || [];

  const index = ids.findIndex(

    (cells) =>

      String(cells[0] || '') === leadId

  );

  return index >= 0 ? index + 2 : null;

}

/* =====================================

   PREPARE SHEET HEADERS

===================================== */

async function prepareSheet(

  sheets: ReturnType<typeof createSheetsClient>,

  spreadsheetId: string

): Promise<void> {

  const metadata =

    await sheets.spreadsheets.get(

      {

        spreadsheetId,

        fields:

          'sheets(properties(sheetId,title,gridProperties(columnCount)))',

      },

      {

        timeout: API_TIMEOUT_MS,

      }

    );

  const target = metadata.data.sheets?.find(

    (item) =>

      item.properties?.title === TAB

  );

  if (!target?.properties) {

    throw new Error(

      'Google Sheet tab "Website Enquiries" not found'

    );

  }

  const sheetId = target.properties.sheetId;

  if (

    sheetId === null ||

    sheetId === undefined

  ) {

    throw new Error(

      'Unable to resolve Google Sheet tab ID'

    );

  }

  const columnCount =

    target.properties.gridProperties

      ?.columnCount ?? 0;

  // Add only missing columns, if column U

  // does not exist in the sheet grid yet.

  if (columnCount < 22) {

    await sheets.spreadsheets.batchUpdate(

      {

        spreadsheetId,

        requestBody: {

          requests: [

            {

              appendDimension: {

                sheetId,

                dimension: 'COLUMNS',

                length: 22 - columnCount,

              },

            },

          ],

        },

      },

      {

        timeout: API_TIMEOUT_MS,

      }

    );

  }

  const headerResponse =

    await sheets.spreadsheets.values.get(

      {

        spreadsheetId,

        range: "'Website Enquiries'!A1:V1",

      },

      {

        timeout: API_TIMEOUT_MS,

      }

    );

  const existing: string[] = (

    headerResponse.data.values?.[0] || []

  ).map(String);

  validateHeaders(existing);

  const completelyEmpty =

    existing.length === 0 ||

    existing.every(

      (header) => !header.trim()

    );

  if (completelyEmpty) {

    await sheets.spreadsheets.values.update(

      {

        spreadsheetId,

        range: "'Website Enquiries'!A1:V1",

        valueInputOption: 'RAW',

        requestBody: {

          values: [

            [...HEADERS, ID_HEADER, SOURCE_HEADER],

          ],

        },

      },

      {

        timeout: API_TIMEOUT_MS,

      }

    );

    return;

  }

  // Do not modify the existing A:T headers.

  if (!existing[20]) {

    await sheets.spreadsheets.values.update(

      {

        spreadsheetId,

        range: "'Website Enquiries'!U1",

        valueInputOption: 'RAW',

        requestBody: {

          values: [[ID_HEADER]],

        },

      },

      {

        timeout: API_TIMEOUT_MS,

      }

    );

  }

  if (!existing[21]) {
    await sheets.spreadsheets.values.update(
      {
        spreadsheetId,
        range: "'Website Enquiries'!V1",
        valueInputOption: 'RAW',
        requestBody: { values: [[SOURCE_HEADER]] },
      },
      { timeout: API_TIMEOUT_MS }
    );
  }

}

/* =====================================

   APPEND-ONLY GOOGLE SHEETS DELIVERY

===================================== */

export async function upsertSheetRow(

  tab: SheetTab,

  row: SheetRow

): Promise<SheetResult> {

  const at = new Date();

  if (!sheetsConfigured()) {

    return {

      ok: false,

      at,

      skipped: true,

      provider: 'google-api',

      error:

        'Google Service Account or Sheet ID not configured',

    };

  }

  try {

    if (tab !== TAB) {

      throw new Error(

        `Unexpected Google Sheet tab: ${tab}`

      );

    }

    if (

      typeof row.ID !== 'string' ||

      !row.ID.trim()

    ) {

      throw new Error(

        'MongoDB Lead ID is required'

      );

    }

    const spreadsheetId = getSheetId();

    if (!spreadsheetId) {

      throw new Error(

        'GOOGLE_SHEET_ID is missing'

      );

    }

    const sheets = createSheetsClient();

    await prepareSheet(

      sheets,

      spreadsheetId

    );

    // If this lead was appended earlier,

    // do not overwrite or append it again.

    const existingRow = await findLeadRow(

      sheets,

      spreadsheetId,

      row.ID

    );

    if (existingRow !== null) {

      return {

        ok: true,

        at,

        provider: 'google-api',

        updatedRange:

          `'Website Enquiries'!A${existingRow}:V${existingRow}`,

      };

    }

    const result =

      await sheets.spreadsheets.values.append(

        {

          spreadsheetId,

          range: "'Website Enquiries'!A:V",

          valueInputOption: 'RAW',

          insertDataOption: 'INSERT_ROWS',

          requestBody: {

            values: [makeValues(row)],

          },

        },

        {

          timeout: API_TIMEOUT_MS,

        }

      );

    if (

      result.data.updates?.updatedRows !== 1

    ) {

      throw new Error(

        'Google Sheets did not confirm an appended row'

      );

    }

    return {

      ok: true,

      at,

      provider: 'google-api',

      updatedRange:

        result.data.updates.updatedRange ||

        undefined,

    };

  } catch (error) {

    const message = getError(error);

    console.error(

      '[Google Sheets] Delivery failed:',

      message

    );

    return {

      ok: false,

      at,

      provider: 'google-api',

      error: message,

    };

  }

}
