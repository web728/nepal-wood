# Nepal Wood International Expo 2027 — website

The new website for the 12th Nepal Wood International Expo (28–31 Jan 2027, Bhrikuti Mandap, Kathmandu). It is built with **Next.js 16 + MongoDB**, and leads are mirrored to **Google Sheets**.

## What's in it

**Public site (23 pages, keeping the old site's URLs)**
- Home, About, Organisers, Past editions (timeline + post-show reports), Gallery (40 photos with filters and a lightbox), FAQ, Contact, Privacy policy
- Exhibit: Why exhibit, Exhibitor profile, **5 SEO landing pages, one per product zone**, Book a stand (a 3-step form), Sponsorship, Exhibitor list 2027 (searchable directory)
- Visit: Why visit, Visitor profile, **Free registration with an instant QR badge**, Plan your visit (hours, travel, click-to-load map), Seminars
- Brochure download (lead-gated, auto-downloads a web-weight 3 MB PDF)
- A WhatsApp button, a mobile bottom action bar, a cookie banner (GA4 loads only after consent), a countdown in Nepal time, and the tree-ring brand motif with scroll animations (GSAP + Lenis, respecting reduced motion)

**Lead engine**
- All forms → `/api/forms/[form]` → validated with zod → saved in **MongoDB** → copied to **Google Sheets** → optional email alerts
- Spam protection without CAPTCHA: a honeypot, a minimum fill time and a per-IP rate limit
- Visitor badges: a unique ID (`NW27-XXXXXX`) plus a private token in the QR code. Registering again with the same email returns the same badge.
- First-touch attribution (UTM, referrer) is stored with every lead

**Team dashboard `/admin`** (password login)
- An overview with KPIs, the latest leads, visitor interests and traffic sources
- Stand enquiries: status pipeline (new → contacted → quoted → booked/lost) and notes. These sync to the sheet.
- Visitors, enquiries and brochure leads, each with search and **CSV export**
- **Gate check-in**: scan QR badges with a phone camera (Chrome/Android) or type a badge ID or email. Repeat scans and unknown badges are flagged.
- Exhibitor list and testimonials editors. These feed `/exhibitors`, the homepage and Why exhibit, which show nothing until real entries are published.

**SEO**
- A unique title and description on every page, canonicals on `nepalwood.com.np`, OG and Twitter cards
- JSON-LD: `ExhibitionEvent` (with venue geo and a free visitor offer), `Organization`, `BreadcrumbList`, `FAQPage`, `EducationEvent` (seminars), `ImageGallery`, `ItemList`
- `sitemap.xml`, `robots.txt`, 301 redirects for common old or guessed URLs, `noindex` on admin and badges
- Measured on the production build: LCP about 0.6 s, CLS 0, no horizontal scroll at 375 px, all images with alt text

## Run it locally
```bash
npm install
cp .env.example .env.local     # then edit values
npm run db:local               # starts a local MongoDB on 27017 (first run downloads it)
npm run dev                    # http://localhost:3000
```
For testing the Sheets sync without Google, run `node scripts/mock-sheets.mjs` and set `SHEETS_WEBHOOK_URL=http://127.0.0.1:4545` and `SHEETS_WEBHOOK_SECRET=local-test-secret`.
End-to-end test: `npm run build && npm start`, then `node scripts/e2e.mjs http://localhost:3000 <ADMIN_PASSWORD>`.

## Go live (recommended: Vercel + MongoDB Atlas)
1. **MongoDB Atlas:** create a free M0 cluster in the Mumbai (ap-south-1) region, which is closest to Kathmandu. Create a database user, allow network access from `0.0.0.0/0` (Vercel uses dynamic IPs), and copy the connection string.
2. **Vercel:** import this folder as a project (framework: Next.js) and add the environment variables from `.env.example`:
   - `NEXT_PUBLIC_SITE_URL=https://nepalwood.com.np`
   - `MONGODB_URI`, `MONGODB_DB`
   - `ADMIN_PASSWORD` (strong) and `ADMIN_SESSION_SECRET` (40+ random characters)
   - `SHEETS_WEBHOOK_URL` and `SHEETS_WEBHOOK_SECRET`. See [integrations/google-sheets/SETUP.md](integrations/google-sheets/SETUP.md).
   - Optional: SMTP settings (badge emails + lead alerts), `LEADS_NOTIFY_TO`, `NEXT_PUBLIC_GA_ID`
3. **Domain:** add `nepalwood.com.np` and `www.nepalwood.com.np` in Vercel, set www to redirect to the apex, and point the DNS records as Vercel shows.
4. **Google Search Console:** verify the domain, submit `https://nepalwood.com.np/sitemap.xml`, and request indexing of the home page. The old site told Google its canonical was the dead `nepalwoodexpo.com`, so this resubmission matters.
5. Run one test registration and one stand enquiry on the live site, and check that they appear in `/admin` and in the sheet.

Any Node 20+ host also works (`npm run build && npm start`), for example a VPS with PM2 behind Nginx.

## Editing content
| What | Where |
|---|---|
| Dates, hours, venue, stats, contacts, partners, nav | `src/lib/site.ts` |
| Zones, timeline, seminars, FAQs, stand options, sponsorships, form options | `src/lib/content.ts` |
| Gallery photos and captions | `src/assets/gallery/`, `src/lib/gallery.ts` |
| Brochure and report PDFs | `public/downloads/` |
| Logos | `public/brand/`, `public/partners/`, `public/participants/` |
| Exhibitor list, testimonials | `/admin` (no code needed) |

Every fact is traced in `../content/content-master.md`. **Opening hours are marked tentative** (`event.hours.tentative = true`). When final timings are confirmed, change `label`, `open` and `close`, and set `tentative: false`.

## Project layout
```
src/app/(site)/      public pages            src/app/admin/        dashboard (login + panel)
src/app/api/forms/   lead intake API         src/app/api/admin/    check-in + CSV export
src/components/      UI, forms, motion       src/lib/              data, db, sheets, mail, auth, seo
integrations/google-sheets/  Apps Script + setup guide
scripts/             local DB, mock sheets, e2e tests, media prep
```
