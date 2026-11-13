// End-to-end checks against a running server: node scripts/e2e.mjs http://localhost:3001 <adminPassword>
// Covers: every public page (status, title, canonical, H1, JSON-LD, broken links), all four forms through the
// real API (validation, honeypot, duplicates), badge page + QR, admin login, CSV export, gate check-in, and Sheets sync.
import puppeteer from 'puppeteer-core';
import fs from 'node:fs';

const [,, BASE = 'http://localhost:3001', PW = ''] = process.argv;
const out = { pages: [], forms: {}, admin: {}, problems: [] };
const fail = (m) => { out.problems.push(m); console.log('  ✗', m); };
const ok = (m) => console.log('  ✓', m);

const pages = ['/', '/about-show', '/about-organizers', '/past-editions', '/why-exhibit', '/exhibitor-profile', '/exhibitor-profile/woodworking-machinery', '/exhibitor-registration',
  '/sponsorship', '/exhibitors', '/why-visit', '/visitor-profile', '/visitor-registration', '/venue', '/seminars', '/gallery', '/faq', '/contact', '/downloads/event-brochure', '/privacy-policy'];

const browser = await puppeteer.launch({ executablePath: 'C:/Program Files/Google/Chrome/Application/chrome.exe', headless: true });
const page = await browser.newPage();
const consoleErrors = [];
page.on('pageerror', (e) => consoleErrors.push(`${page.url()} ${e.message}`));
page.on('console', (m) => m.type() === 'error' && !/favicon|Failed to load resource/.test(m.text()) && consoleErrors.push(`${page.url()} ${m.text()}`));
await page.setViewport({ width: 1440, height: 900 });

console.log('PAGES');
const titles = new Set(), descs = new Set(), links = new Set();
for (const p of pages) {
  const res = await page.goto(BASE + p, { waitUntil: 'networkidle0', timeout: 60000 });
  const info = await page.evaluate(() => ({
    title: document.title, desc: document.querySelector('meta[name=description]')?.content || '',
    canonical: document.querySelector('link[rel=canonical]')?.href || '', h1: document.querySelectorAll('h1').length,
    ld: [...document.querySelectorAll('script[type="application/ld+json"]')].flatMap((s) => { try { const j = JSON.parse(s.textContent); return (j['@graph'] || [j]).map((x) => x['@type']); } catch { return ['INVALID']; } }),
    noAlt: [...document.images].filter((i) => !i.hasAttribute('alt')).length,
    links: [...document.querySelectorAll('a[href^="/"]')].map((a) => a.getAttribute('href').split('#')[0]),
    overflow: document.documentElement.scrollWidth > innerWidth,
  }));
  info.links.forEach((l) => links.add(l));
  const s = res.status();
  if (s !== 200) fail(`${p} status ${s}`);
  if (info.h1 !== 1) fail(`${p} has ${info.h1} h1`);
  if (titles.has(info.title)) fail(`${p} duplicate title`);
  if (descs.has(info.desc)) fail(`${p} duplicate description`);
  if (info.title.length > 70) fail(`${p} title ${info.title.length} chars`);
  if (info.desc.length > 165 || info.desc.length < 70) fail(`${p} description ${info.desc.length} chars`);
  if (info.ld.includes('INVALID')) fail(`${p} invalid JSON-LD`);
  if (info.noAlt) fail(`${p} ${info.noAlt} images without alt`);
  if (info.overflow) fail(`${p} horizontal overflow`);
  titles.add(info.title); descs.add(info.desc);
  out.pages.push({ p, s, title: info.title, tl: info.title.length, dl: info.desc.length, canonical: info.canonical, ld: info.ld.join(',') });
}
console.log(`  ${pages.length} pages checked`);
for (const l of links) {
  if (l.startsWith('/downloads/') && l.endsWith('.pdf')) { const r = await fetch(BASE + l, { method: 'HEAD' }); if (!r.ok) fail(`broken download ${l}`); continue; }
  const r = await fetch(BASE + l, { redirect: 'manual' });
  if (r.status >= 400) fail(`broken link ${l} → ${r.status}`);
}
ok(`${links.size} internal links resolved`);
for (const f of ['/robots.txt', '/sitemap.xml', '/og/og-default.jpg', '/favicon.svg']) { const r = await fetch(BASE + f); r.ok ? ok(`${f} ${r.status}`) : fail(`${f} ${r.status}`); }

/* ---------- Forms via API ---------- */
console.log('FORMS');
const post = (form, data, extra = {}) => fetch(`${BASE}/api/forms/${form}`, { method: 'POST', headers: { 'Content-Type': 'application/json', 'x-forwarded-for': `10.0.0.${Math.floor(Math.random() * 200)}` }, body: JSON.stringify({ data, meta: { source: 'e2e', page: '/test' }, startedAt: Date.now() - 10000, ...extra }) }).then(async (r) => ({ status: r.status, body: await r.json() }));
const stamp = Date.now().toString(36);
const bad = await post('exhibitor', { company: 'x' });
bad.status === 422 && bad.body.errors?.company ? ok('exhibitor validation rejects bad input') : fail(`exhibitor validation: ${JSON.stringify(bad)}`);
const hp = await post('visitor', { name: 'Bot' }, { website_url: 'spam' });
hp.body.ok && hp.body.ref === 'OK' ? ok('honeypot silently drops bots') : fail('honeypot');
const ex = await post('exhibitor', { company: `E2E Test Machines ${stamp}`, website: 'example.com', country: 'India', city: 'Ahmedabad', zones: ['Woodworking Machinery'], products: 'CNC nesting', standType: 'raw', areaSqm: 36, heavyMachinery: true, powerNeeds: '3-phase 25 kW', sponsorship: true, name: 'Test Person', designation: 'Sales Head', email: `ex-${stamp}@example.com`, phone: '+91 98765 43210', whatsappSame: true, message: 'Automated test', updates: true, consent: true });
ex.body.ok && /^EX-/.test(ex.body.ref) ? ok(`exhibitor enquiry saved ${ex.body.ref}`) : fail(`exhibitor submit ${JSON.stringify(ex)}`);
const visitor = { name: 'Asha Test', designation: 'Owner', company: 'Test Furniture Pvt Ltd', businessType: 'Furniture / kitchen manufacturer', email: `vis-${stamp}@example.com`, phone: '+977 9801234567', country: 'Nepal', city: 'Lalitpur', interests: ['Woodworking machinery & dust control', 'Hardwood & softwood'], heardFrom: 'Facebook / Instagram', updates: true, consent: true };
const v1 = await post('visitor', visitor);
v1.body.ok && /^NW27-/.test(v1.body.ref) && v1.body.badgeUrl ? ok(`visitor registered ${v1.body.ref}`) : fail(`visitor submit ${JSON.stringify(v1)}`);
const v2 = await post('visitor', { ...visitor, email: visitor.email.toUpperCase() });
v2.body.existing && v2.body.ref === v1.body.ref ? ok('duplicate email returns the same badge') : fail(`duplicate visitor ${JSON.stringify(v2)}`);
const en = await post('enquiry', { topic: 'sponsorship', name: 'Test Sponsor', email: `en-${stamp}@example.com`, phone: '+977 9800000000', company: 'Brand Co', message: 'We would like the badge partnership.', consent: true });
en.body.ok ? ok(`enquiry saved ${en.body.ref}`) : fail(`enquiry ${JSON.stringify(en)}`);
const br = await post('brochure', { name: 'Test Reader', email: `br-${stamp}@example.com`, phone: '+91 9999999999', company: 'Reader Co', interest: 'visiting', consent: true });
br.body.ok && br.body.download ? ok(`brochure lead saved, download ${br.body.download}`) : fail(`brochure ${JSON.stringify(br)}`);
out.forms = { ex: ex.body, v1: v1.body, en: en.body, br: br.body };

/* ---------- Badge ---------- */
console.log('BADGE');
await page.goto(BASE + v1.body.badgeUrl + '?new=1', { waitUntil: 'networkidle0' });
const badge = await page.evaluate(() => ({ name: document.querySelector('.badge__name')?.textContent, id: document.querySelector('.badge__id')?.textContent, qr: !!document.querySelector('.badge__qr svg'), robots: document.querySelector('meta[name=robots]')?.content }));
badge.name === visitor.name && badge.id === v1.body.ref && badge.qr ? ok('badge page shows name, ID and QR') : fail(`badge ${JSON.stringify(badge)}`);
(badge.robots || '').includes('noindex') ? ok('badge page is noindex') : fail('badge robots');
await page.screenshot({ path: 'scripts/_badge.png' });
const r404 = await fetch(`${BASE}/badge/notarealtoken123456`);
r404.status === 404 ? ok('unknown badge token → 404') : fail(`badge 404 ${r404.status}`);

/* ---------- Admin ---------- */
console.log('ADMIN');
const noauth = await fetch(`${BASE}/api/admin/export?type=visitors`);
noauth.status === 401 ? ok('export blocked without login') : fail(`export without auth ${noauth.status}`);
const red = await fetch(`${BASE}/admin`, { redirect: 'manual' });
[307, 303, 302].includes(red.status) || (await red.text()).includes('admin/login') ? ok('admin redirects to login') : fail(`admin unauth ${red.status}`);
await page.goto(`${BASE}/admin/login`, { waitUntil: 'networkidle0' });
await page.type('#password', 'wrong-password');
await Promise.all([page.waitForSelector('.admin-err', { timeout: 10000 }).catch(() => null), page.click('button[type=submit]')]);
(await page.$('.admin-err')) ? ok('wrong password rejected') : fail('wrong password not rejected');
await page.$eval('#password', (el) => (el.value = ''));
await page.type('#password', PW);
await Promise.all([page.waitForNavigation({ waitUntil: 'networkidle0' }), page.click('button[type=submit]')]);
page.url().endsWith('/admin') ? ok('admin login works') : fail(`login landed on ${page.url()}`);
const kpis = await page.$$eval('.kpi strong', (els) => els.map((e) => e.textContent));
ok(`dashboard KPIs: ${kpis.join(' / ')}`);
await page.screenshot({ path: 'scripts/_admin.png', fullPage: true });
const cookies = await page.cookies();
const cookieHeader = cookies.map((c) => `${c.name}=${c.value}`).join('; ');
const csv = await fetch(`${BASE}/api/admin/export?type=visitors`, { headers: { cookie: cookieHeader } }).then((r) => r.text());
csv.includes(v1.body.ref) && csv.includes('"ID"') ? ok('CSV export contains the new visitor') : fail('CSV export');
const ci = await fetch(`${BASE}/api/admin/checkin`, { method: 'POST', headers: { cookie: cookieHeader, 'Content-Type': 'application/json' }, body: JSON.stringify({ code: v1.body.ref }) }).then((r) => r.json());
ci.ok && !ci.already ? ok(`check-in by badge ID: ${ci.visitor.name}`) : fail(`checkin ${JSON.stringify(ci)}`);
const ci2 = await fetch(`${BASE}/api/admin/checkin`, { method: 'POST', headers: { cookie: cookieHeader, 'Content-Type': 'application/json' }, body: JSON.stringify({ code: v1.body.ref }) }).then((r) => r.json());
ci2.already ? ok('second scan flagged as already checked in') : fail('double check-in not flagged');
const ci3 = await fetch(`${BASE}/api/admin/checkin`, { method: 'POST', headers: { cookie: cookieHeader, 'Content-Type': 'application/json' }, body: JSON.stringify({ code: 'NW27-ZZZZZZ' }) }).then((r) => r.json());
!ci3.ok ? ok('unknown badge rejected at the gate') : fail('unknown badge accepted');
for (const p of ['/admin/exhibitors', '/admin/visitors', '/admin/enquiries', '/admin/brochure', '/admin/checkin', '/admin/directory', '/admin/testimonials']) {
  const r = await page.goto(BASE + p, { waitUntil: 'networkidle0' });
  r.status() === 200 ? ok(`${p} 200`) : fail(`${p} ${r.status()}`);
}
await page.goto(BASE + '/admin/exhibitors', { waitUntil: 'networkidle0' });
await page.screenshot({ path: 'scripts/_admin-ex.png', fullPage: false });

/* ---------- Sheets ---------- */
console.log('SHEETS');
await new Promise((r) => setTimeout(r, 2500));
const mock = fs.existsSync('.data/mock-sheets.json') ? JSON.parse(fs.readFileSync('.data/mock-sheets.json', 'utf8')) : {};
const has = (tab, id) => (mock[tab]?.rows || []).some((r) => r[0] === id);
has('Exhibitor enquiries', ex.body.ref) ? ok('stand enquiry reached the sheet') : fail('exhibitor not in sheet');
const visRow = (mock.Visitors?.rows || []).find((r) => r[0] === v1.body.ref);
visRow ? ok('visitor reached the sheet') : fail('visitor not in sheet');
const ciCol = mock.Visitors?.headers.indexOf('Checked in');
visRow && visRow[ciCol] ? ok('check-in time synced to the same sheet row') : fail('check-in not synced');
has('Enquiries', en.body.ref) ? ok('enquiry reached the sheet') : fail('enquiry not in sheet');
has('Brochure downloads', br.body.ref) ? ok('brochure lead reached the sheet') : fail('brochure not in sheet');

if (consoleErrors.length) consoleErrors.slice(0, 10).forEach((e) => fail(`console: ${e}`));
fs.writeFileSync('scripts/_e2e.json', JSON.stringify(out, null, 1));
console.log(`\nDONE: ${out.problems.length} problem(s)`);
await browser.close();
