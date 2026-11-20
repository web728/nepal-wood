/**
 * Nepal Wood International Expo: website → Google Sheets bridge.
 *
 * Paste this into Extensions → Apps Script of the Google Sheet the team will use,
 * set SHARED_SECRET below, then Deploy → New deployment → Web app
 * (Execute as: Me · Who has access: Anyone). Put the web-app URL in SHEETS_WEBHOOK_URL
 * and the same secret in SHEETS_WEBHOOK_SECRET on the website.
 *
 * Each lead type gets its own tab, created automatically with a frozen header row.
 * Rows are keyed by the first column (ID): a new ID appends a row, a known ID updates it
 * (status changes from the admin panel, gate check-ins).
 */

const SHARED_SECRET = 'CHANGE-ME-to-the-same-value-as-SHEETS_WEBHOOK_SECRET';
const ALLOWED_TABS = ['Exhibitor enquiries', 'Visitors', 'Enquiries', 'Brochure downloads'];
const TAB_COLOURS = { 'Exhibitor enquiries': '#9b2a29', Visitors: '#c36f31', Enquiries: '#5a3b2a', 'Brochure downloads': '#dd9d59' };

function doPost(e) {
  const lock = LockService.getScriptLock();
  try {
    const body = JSON.parse((e && e.postData && e.postData.contents) || '{}');
    if (!SHARED_SECRET || body.secret !== SHARED_SECRET) return json({ ok: false, error: 'Unauthorised' });
    if (body.action !== 'upsert') return json({ ok: false, error: 'Unknown action' });
    if (ALLOWED_TABS.indexOf(body.tab) === -1) return json({ ok: false, error: 'Unknown tab' });
    if (!body.row || typeof body.row !== 'object') return json({ ok: false, error: 'Missing row' });

    lock.waitLock(20000);
    const sheet = getTab(body.tab, Object.keys(body.row));
    const headers = ensureHeaders(sheet, Object.keys(body.row));
    const values = headers.map(function (h) { return clean(body.row[h]); });
    const id = String(values[0]);

    const lastRow = sheet.getLastRow();
    let target = -1;
    if (lastRow > 1) {
      const ids = sheet.getRange(2, 1, lastRow - 1, 1).getValues();
      for (let i = ids.length - 1; i >= 0; i--) { if (String(ids[i][0]) === id) { target = i + 2; break; } }
    }
    if (target > 0) sheet.getRange(target, 1, 1, values.length).setValues([values]);
    else sheet.appendRow(values);
    return json({ ok: true, updated: target > 0 });
  } catch (err) {
    return json({ ok: false, error: String(err) });
  } finally {
    try { lock.releaseLock(); } catch (x) { /* not held */ }
  }
}

/** Visiting the web-app URL in a browser shows that it is alive. */
function doGet() {
  return json({ ok: true, service: 'Nepal Wood leads → Sheets', tabs: ALLOWED_TABS });
}

function getTab(name, headers) {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  let sheet = ss.getSheetByName(name);
  if (!sheet) {
    sheet = ss.insertSheet(name);
    sheet.getRange(1, 1, 1, headers.length).setValues([headers]).setFontWeight('bold').setBackground('#1c110c').setFontColor('#fbf1e7');
    sheet.setFrozenRows(1);
    sheet.setTabColor(TAB_COLOURS[name] || '#9b2a29');
  }
  return sheet;
}

/** Adds any new columns the website starts sending, without disturbing existing ones. */
function ensureHeaders(sheet, keys) {
  const width = Math.max(sheet.getLastColumn(), 1);
  let headers = sheet.getRange(1, 1, 1, width).getValues()[0].filter(String);
  const missing = keys.filter(function (k) { return headers.indexOf(k) === -1; });
  if (missing.length) {
    sheet.getRange(1, headers.length + 1, 1, missing.length).setValues([missing]).setFontWeight('bold').setBackground('#1c110c').setFontColor('#fbf1e7');
    headers = headers.concat(missing);
  }
  return headers;
}

/** Stops values that look like formulas from executing in the sheet. */
function clean(v) {
  if (v === null || v === undefined) return '';
  const s = String(v);
  return /^[=+\-@]/.test(s) ? "'" + s : s;
}

function json(obj) {
  return ContentService.createTextOutput(JSON.stringify(obj)).setMimeType(ContentService.MimeType.JSON);
}
