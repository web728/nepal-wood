import 'server-only';

// Supports either a Base64 Google service-account JSON (preferred) OR the existing
// Apps Script webhook. Exactly one backend is selected per call: no double writes.
export type SheetTab = 'Exhibitor enquiries' | 'Visitors' | 'Enquiries' | 'Brochure downloads';
export type SheetRow = Record<string, string | number | boolean | null | undefined>;
export type SheetResult = {
  ok: boolean;
  at: Date;
  error?: string;
  skipped?: boolean;
  updatedRange?: string;
  provider?: 'google-api' | 'apps-script';
};

const B64 = () => process.env.GOOGLE_SERVICE_ACCOUNT_BASE64 || process.env.GOOGLE_CREDENTIALS_BASE64;
const SHEET_ID = () => process.env.GOOGLE_SHEET_ID || process.env.GOOGLE_SHEETS_ID;

export function sheetsConfigured(): boolean {
  return Boolean((B64() && SHEET_ID()) || process.env.SHEETS_WEBHOOK_URL);
}

function asError(error: unknown): string {
  return error instanceof Error ? error.message : String(error);
}

function colLetter(index: number): string {
  let n = index;
  let result = '';
  while (n > 0) {
    n -= 1;
    result = String.fromCharCode(65 + (n % 26)) + result;
    n = Math.floor(n / 26);
  }
  return result;
}

function toValue(value: SheetRow[string]): string | number | boolean {
  return value === null || value === undefined ? '' : value;
}

async function upsertGoogleApi(tab: SheetTab, row: SheetRow): Promise<SheetResult> {
  const at = new Date();
  try {
    const encoded = B64();
    const spreadsheetId = SHEET_ID();
    if (!encoded || !spreadsheetId) throw new Error('Google Sheets credentials/ID missing');
    if (typeof row.ID !== 'string' || !row.ID) throw new Error('Sheet row ID is required');

    let json: { client_email?: string; private_key?: string };
    try {
      json = JSON.parse(Buffer.from(encoded.trim(), 'base64').toString('utf8'));
    } catch {
      throw new Error('Invalid Base64 service-account JSON');
    }
    if (!json.client_email || !json.private_key) {
      throw new Error('Service-account JSON needs client_email and private_key');
    }
    json.private_key = json.private_key.replace(/\\n/g, '\n');

    // Dynamically import the client only when a sync is actually needed.
    const { google } = await import('googleapis');
    const auth = new google.auth.GoogleAuth({
      credentials: json,
      scopes: ['https://www.googleapis.com/auth/spreadsheets'],
    });
    const sheets = google.sheets({ version: 'v4', auth });
    const quotedTab = `'${tab.replace(/'/g, "''")}'`;

    // Respect the sheet's existing header order (including custom team columns).
    const headerResponse = await sheets.spreadsheets.values.get({
      spreadsheetId,
      range: `${quotedTab}!A1:ZZ1`,
      timeout: 8000,
    });
    const existingHeaders = (headerResponse.data.values?.[0] || []).map(String);
    if (existingHeaders.length && existingHeaders[0] !== 'ID') {
      throw new Error(`Tab ${tab}: first header must be ID`);
    }

    const headers = existingHeaders.length ? [...existingHeaders] : Object.keys(row);
    for (const key of Object.keys(row)) if (!headers.includes(key)) headers.push(key);
    if (headers[0] !== 'ID') throw new Error(`Tab ${tab}: first column must be ID`);
    if (headers.length > 702) throw new Error('Sheet exceeds 702 columns');
    const lastCol = colLetter(headers.length);
    if (headers.length !== existingHeaders.length) {
      await sheets.spreadsheets.values.update({
        spreadsheetId,
        range: `${quotedTab}!A1:${lastCol}1`,
        valueInputOption: 'RAW',
        requestBody: { values: [headers] },
        timeout: 8000,
      });
    }

    // Find the ID in column A: retrying after an uncertain network response is an upsert.
    const keysResponse = await sheets.spreadsheets.values.get({
      spreadsheetId,
      range: `${quotedTab}!A2:A`,
      timeout: 8000,
    });
    const idIndex = (keysResponse.data.values || []).findIndex((cells) => String(cells[0] ?? '') === row.ID);
    const rowNumber = idIndex >= 0 ? idIndex + 2 : null;

    let existingCells: unknown[] = [];
    if (rowNumber) {
      const oldRow = await sheets.spreadsheets.values.get({
        spreadsheetId,
        range: `${quotedTab}!A${rowNumber}:${lastCol}${rowNumber}`,
        timeout: 8000,
      });
      existingCells = oldRow.data.values?.[0] || [];
    }

    const values = headers.map((key, i) =>
      Object.prototype.hasOwnProperty.call(row, key)
        ? toValue(row[key])
        : String(existingCells[i] ?? ''), // Keep extra columns the team edits manually.
    );

    const response = rowNumber
      ? await sheets.spreadsheets.values.update({
          spreadsheetId,
          range: `${quotedTab}!A${rowNumber}:${lastCol}${rowNumber}`,
          valueInputOption: 'RAW',
          requestBody: { values: [values] },
          timeout: 8000,
        })
      : await sheets.spreadsheets.values.append({
          spreadsheetId,
          range: `${quotedTab}!A:${lastCol}`,
          valueInputOption: 'RAW', // User input MUST NOT be parsed as a sheet formula.
          insertDataOption: 'INSERT_ROWS',
          requestBody: { values: [values] },
          timeout: 8000,
        });

    // values.update and values.append have DIFFERENT response shapes.
    const updates = rowNumber
      ? (response.data as { updatedRows?: number; updatedRange?: string })
      : (response.data as { updates?: { updatedRows?: number; updatedRange?: string } }).updates;
    if (updates?.updatedRows !== 1) {
      throw new Error('Google Sheets API did not confirm exactly one updated row');
    }
    return {
      ok: true,
      at,
      provider: 'google-api',
      updatedRange: updates.updatedRange,
    };
  } catch (error) {
    return { ok: false, at, provider: 'google-api', error: asError(error) };
  }
}

async function upsertAppsScript(tab: SheetTab, row: SheetRow): Promise<SheetResult> {
  const at = new Date();
  const url = process.env.SHEETS_WEBHOOK_URL;
  if (!url) return { ok: false, skipped: true, at, error: 'SHEETS_WEBHOOK_URL not configured' };
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 8000);
  try {
    const res = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'text/plain;charset=utf-8' },
      body: JSON.stringify({
        secret: process.env.SHEETS_WEBHOOK_SECRET || '',
        action: 'upsert',
        tab,
        row,
      }),
      redirect: 'follow',
      signal: controller.signal,
      cache: 'no-store',
    });
    const text = await res.text();
    let body: { ok?: boolean; error?: string };
    try {
      body = JSON.parse(text) as typeof body;
    } catch {
      throw new Error(`Apps Script returned non-JSON (HTTP ${res.status}); check deployment access`);
    }
    if (!res.ok || !body.ok) throw new Error(body.error || `Apps Script HTTP ${res.status}`);
    return { ok: true, at, provider: 'apps-script' };
  } catch (error) {
    return { ok: false, at, provider: 'apps-script', error: asError(error) };
  } finally {
    clearTimeout(timeout);
  }
}

export async function upsertSheetRow(tab: SheetTab, row: SheetRow): Promise<SheetResult> {
  if (B64() && SHEET_ID()) return upsertGoogleApi(tab, row);
  if (process.env.SHEETS_WEBHOOK_URL) return upsertAppsScript(tab, row);
  return { ok: false, skipped: true, at: new Date(), error: 'No Google Sheets provider configured' };
}
