// Visual review: node scripts/snap.mjs <base> <outDir> [mobile] path1 path2 ...  -> one full-page JPEG per path (half scale)
import puppeteer from 'puppeteer-core';
import fs from 'node:fs';
const [,, base, outDir, mode, ...paths] = process.argv;
const mobile = mode === 'mobile';
fs.mkdirSync(outDir, { recursive: true });
const b = await puppeteer.launch({ executablePath: 'C:/Program Files/Google/Chrome/Application/chrome.exe', headless: true, protocolTimeout: 120000 });
const p = await b.newPage();
await p.setViewport(mobile ? { width: 390, height: 844, deviceScaleFactor: 1, isMobile: true, hasTouch: true } : { width: 1440, height: 900, deviceScaleFactor: 0.5 });
for (const path of paths) {
  await p.goto(base + path, { waitUntil: 'networkidle0', timeout: 90000 });
  await p.evaluate(async () => {
    const s = (ms) => new Promise((r) => setTimeout(r, ms));
    for (let y = 0; y < document.documentElement.scrollHeight; y += 500) { window.scrollTo(0, y); await s(120); }
    // Settle all reveal/scroll states so the full-page capture shows final layout.
    document.querySelectorAll('[data-reveal], .tree-rings, [data-bars]').forEach((e) => e.classList.add('is-in'));
    window.scrollTo(0, 0); await s(600);
  });
  const name = (path === '/' ? 'home' : path.replace(/^\//, '').replace(/[^a-z0-9]+/gi, '_')) + (mobile ? '-m' : '') + '.jpg';
  await p.screenshot({ path: `${outDir}/${name}`, type: 'jpeg', quality: 62, fullPage: true });
  console.log(name);
}
await b.close();
