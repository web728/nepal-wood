import 'server-only';

// Mirrors leads into Google Sheets through an Apps Script web app (integrations/google-sheets/Code.gs).
// MongoDB stays the system of record; the sheet is the team's working view. Failures are recorded
// on the document so the admin can retry, and they never block the visitor.

export type SheetTab = 'Exhibitor enquiries' | 'Visitors' | 'Enquiries' | 'Brochure downloads';
export type SheetRow = Record<string, string | number | boolean | null | undefined>;
export type SheetResult = { ok: boolean; at: Date; error?: string; skipped?: boolean };

export function sheetsConfigured() {
  return Boolean(process.env.SHEETS_WEBHOOK_URL);
}

/** Inserts the row, or updates the existing row whose first column (ID) matches. */
export async function upsertSheetRow(tab: SheetTab, row: SheetRow): Promise<SheetResult> {
  const url = process.env.SHEETS_WEBHOOK_URL;
  if (!url) return { ok: false, skipped: true, at: new Date(), error: 'SHEETS_WEBHOOK_URL not set' };
  const ctrl = new AbortController();
  const timer = setTimeout(() => ctrl.abort(), 8000);
  try {
    const res = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'text/plain;charset=utf-8' }, // Apps Script reads e.postData.contents
      body: JSON.stringify({ secret: process.env.SHEETS_WEBHOOK_SECRET || '', action: 'upsert', tab, row }),
      redirect: 'follow',
      signal: ctrl.signal,
    });
    const text = await res.text();
    let body: { ok?: boolean; error?: string } = {};
    try { body = JSON.parse(text); } catch { body = { ok: false, error: `Non-JSON response (${res.status})` }; }
    if (!res.ok || !body.ok) return { ok: false, at: new Date(), error: body.error || `HTTP ${res.status}` };
    return { ok: true, at: new Date() };
  } catch (e) {
    return { ok: false, at: new Date(), error: e instanceof Error ? e.message : String(e) };
  } finally {
    clearTimeout(timer);
  }
}
