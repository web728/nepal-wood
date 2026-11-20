// Local stand-in for the Apps Script web app, for testing the Sheets sync without Google.
// Mirrors Code.gs behaviour: secret check, allowed tabs, upsert by first column.
// Run: node scripts/mock-sheets.mjs  (listens on http://127.0.0.1:4545, writes ./.data/mock-sheets.json)
import http from 'node:http';
import fs from 'node:fs';

const SECRET = process.env.SHEETS_WEBHOOK_SECRET || 'local-test-secret';
const TABS = ['Exhibitor enquiries', 'Visitors', 'Enquiries', 'Brochure downloads'];
const file = new URL('../.data/mock-sheets.json', import.meta.url);
const book = fs.existsSync(file) ? JSON.parse(fs.readFileSync(file, 'utf8')) : {};

http.createServer((req, res) => {
  let raw = '';
  req.on('data', (c) => (raw += c));
  req.on('end', () => {
    const send = (o) => { res.writeHead(200, { 'Content-Type': 'application/json' }); res.end(JSON.stringify(o)); };
    if (req.method === 'GET') return send({ ok: true, tabs: Object.fromEntries(Object.entries(book).map(([k, v]) => [k, v.rows.length])) });
    let b;
    try { b = JSON.parse(raw); } catch { return send({ ok: false, error: 'bad json' }); }
    if (b.secret !== SECRET) return send({ ok: false, error: 'Unauthorised' });
    if (!TABS.includes(b.tab)) return send({ ok: false, error: 'Unknown tab' });
    const tab = (book[b.tab] ||= { headers: [], rows: [] });
    for (const k of Object.keys(b.row)) if (!tab.headers.includes(k)) tab.headers.push(k);
    const values = tab.headers.map((h) => b.row[h] ?? '');
    const i = tab.rows.findIndex((r) => r[0] === values[0]);
    if (i >= 0) tab.rows[i] = values; else tab.rows.push(values);
    fs.writeFileSync(file, JSON.stringify(book, null, 1));
    console.log(`${i >= 0 ? 'update' : 'append'} ${b.tab} ${values[0]}`);
    send({ ok: true, updated: i >= 0 });
  });
}).listen(4545, '127.0.0.1', () => console.log('Mock Sheets webhook on http://127.0.0.1:4545'));
