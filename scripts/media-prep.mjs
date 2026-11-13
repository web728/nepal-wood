// One-off media preparation from the client's PDFs (run from the web folder):
//   node scripts/media-prep.mjs <documentsDir>
// 1. Crops the 115 past-participant logos from the 10th edition post-show report (p9)
// 2. Builds web-weight versions of the large PDFs for download
// 3. Writes a contact sheet of the gallery photos for review
import * as mupdf from 'mupdf';
import sharp from 'sharp';
import { PDFDocument } from 'pdf-lib';
import fs from 'node:fs';
import path from 'node:path';

const docs = process.argv[2];
const open = (f) => mupdf.Document.openDocument(fs.readFileSync(path.join(docs, f)), 'application/pdf');

/* ---------- 1. Participant logos ---------- */
{
  const doc = open('10th Nepal Wood PSR 2025.pdf');
  const page = doc.loadPage(8);
  const [, , w] = page.getBounds();
  const scale = 4;
  const pix = page.toPixmap(mupdf.Matrix.scale(scale, scale), mupdf.ColorSpace.DeviceRGB, false, true);
  const png = Buffer.from(pix.asPNG());
  const k = (w * scale) / 1400; // grid measured on a 1400px-wide render
  const cols = [75, 256, 437, 619, 800, 981, 1162];
  const rowTop = 188, rowStep = 102.45, tileW = 168, tileH = 92;
  const out = 'public/participants';
  fs.mkdirSync(out, { recursive: true });
  let n = 0;
  for (let r = 0; r < 17; r++) {
    const count = r === 16 ? 3 : 7;
    for (let c = 0; c < count; c++) {
      const left = Math.round((cols[c] + 6) * k), top = Math.round((rowTop + r * rowStep + 6) * k);
      const width = Math.round((tileW - 12) * k), height = Math.round((tileH - 12) * k);
      n++;
      const tile = await sharp(png).extract({ left, top, width, height }).toBuffer();
      const trimmed = await sharp(tile).trim({ background: '#ffffff', threshold: 22 }).toBuffer().catch(() => tile);
      await sharp(trimmed).resize({ height: 120, width: 300, fit: 'inside', withoutEnlargement: true }).flatten({ background: '#ffffff' }).webp({ quality: 88 }).toFile(path.join(out, `p${String(n).padStart(3, '0')}.webp`));
    }
  }
  console.log('participant logos:', n);
}

/* ---------- 2. Web-weight PDFs ---------- */
async function webPdf(src, dest, widthPx = 1400, quality = 74) {
  const doc = open(src);
  const outDoc = await PDFDocument.create();
  for (let i = 0; i < doc.countPages(); i++) {
    const page = doc.loadPage(i);
    const [x0, y0, x1, y1] = page.getBounds();
    const s = widthPx / (x1 - x0);
    const pix = page.toPixmap(mupdf.Matrix.scale(s, s), mupdf.ColorSpace.DeviceRGB, false, true);
    const jpg = await sharp(Buffer.from(pix.asPNG())).jpeg({ quality, mozjpeg: true }).toBuffer();
    const img = await outDoc.embedJpg(jpg);
    const p = outDoc.addPage([x1 - x0, y1 - y0]);
    p.drawImage(img, { x: 0, y: 0, width: x1 - x0, height: y1 - y0 });
  }
  outDoc.setTitle(path.basename(dest, '.pdf'));
  outDoc.setAuthor('Futurex Trade Fair and Events · Media Space Solutions');
  const bytes = await outDoc.save();
  fs.writeFileSync(dest, bytes);
  console.log(dest, (bytes.length / 1048576).toFixed(1) + ' MB');
}
await webPdf('Nepal-Wood-Expo-2027-Brochure.pdf', 'public/downloads/nepal-wood-expo-2027-brochure.pdf', 1600, 76);
await webPdf('10th Nepal Wood PSR 2025.pdf', 'public/downloads/nepal-wood-10th-edition-post-show-report.pdf');
await webPdf('11th Nepal Wood PSR 2026 (1).pdf', 'public/downloads/nepal-wood-11th-edition-post-show-report.pdf');
await webPdf('8th Nepal Wood PSR 2022.pdf', 'public/downloads/nepal-wood-8th-edition-post-show-report.pdf');
await webPdf('NEPAL WOOD PSR 2022.pdf', 'public/downloads/nepal-wood-7th-edition-post-show-report.pdf');
