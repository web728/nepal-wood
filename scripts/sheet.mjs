// Review helper: node scripts/sheet.mjs <dir> <out.jpg> [cols=10] [cell=150]  -> grid of all images in a folder
import puppeteer from 'puppeteer-core';
import fs from 'node:fs';
import path from 'node:path';
import { pathToFileURL } from 'node:url';
const [,, dir, out, cols = '10', cell = '150'] = process.argv;
const files = fs.readdirSync(dir).filter((f) => /\.(webp|jpe?g|png)$/i.test(f)).sort();
const html = `<html><body style="margin:0;background:#ddd;display:grid;grid-template-columns:repeat(${cols},${cell}px);gap:4px;padding:4px;font:10px sans-serif">${files.map((f) => `<div style="background:#fff"><img src="${pathToFileURL(path.resolve(dir, f)).href}" style="width:${cell}px;height:${Math.round(+cell * 0.62)}px;object-fit:contain;display:block"><div>${f}</div></div>`).join('')}</body></html>`;
const tmp = path.resolve(dir, '_sheet.html');
fs.writeFileSync(tmp, html);
const b = await puppeteer.launch({ executablePath: 'C:/Program Files/Google/Chrome/Application/chrome.exe', headless: true, args: ['--allow-file-access-from-files'] });
const p = await b.newPage();
await p.setViewport({ width: +cols * (+cell + 4) + 4, height: 400 });
await p.goto(pathToFileURL(tmp).href, { waitUntil: 'load' });
await p.screenshot({ path: out, type: 'jpeg', quality: 72, fullPage: true });
await b.close();
fs.unlinkSync(tmp);
console.log(files.length, 'images');
