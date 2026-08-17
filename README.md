# Nepal Wood International Expo 2027 — Website

Next.js (App Router, `src/app`) marketing site with lead-capture forms wired to MongoDB,
a shared Google Sheet, SMTP email notifications and reCAPTCHA v2.

## Stack

- Next.js 16 (App Router), TypeScript, Tailwind CSS v3
- shadcn/ui-style primitives (Radix UI) for forms, dialogs, inputs, buttons, cards
- HeroUI 2.7.8 for the Navbar/mobile menu and Accordion (pinned below 3.x — see note in
  `tailwind.config.ts` — the current HeroUI major requires Tailwind v4 and dropped Navbar)
- GSAP + ScrollTrigger for scroll reveals, parallax and count-up stats (`src/hooks/useGsapReveal.ts`)
- Three.js via `@react-three/fiber` + `@react-three/drei` for two lightweight 3D accents on the
  home page (`src/components/three/` — see below)
- react-hook-form + zod for all three forms
- MongoDB (Mongoose) + Google Sheets (googleapis) + Nodemailer + reCAPTCHA v2 on the backend

## 3D accents (`src/components/three/`)

Two small, brand-toned 3D scenes, both lazy-mounted only once their section scrolls into view
and torn down when it scrolls back out (`useInViewCanvas.ts`), and skipped entirely (falling
back to a static CSS poster, `CanvasFallbackPoster.tsx`) for `prefers-reduced-motion`, no-WebGL,
or low-end/low-bandwidth devices (`canRender3D()`):

- **Hero globe** (`HeroGlobeCanvas.tsx` + `GlobeScene.tsx`) — a low-poly sphere with a fresnel
  atmosphere-glow shader and glowing pins for the countries represented in previous editions
  (Nepal, India, China, Malaysia, Germany, Taiwan — the same list already used in
  `edition-highlights-accordion.tsx`). Auto-rotates idly, tilts a few degrees toward the cursor,
  and can be dragged to orbit. Hidden below the `md` breakpoint by design, since this is a
  mobile-majority audience and the hero's first paint matters more than the globe there.
- **Floating wood planks** (`FloatingWoodPlanks.tsx`) — three small wood-toned plank meshes
  drifting via drei's `<Float>`, on the "Why Exhibit" section.

Deliberate constraints, documented inline: no imported GLTF models (simple procedural
geometry only), no `@react-three/postprocessing` bloom pass (faked cheaply via layered
transparent "halo" meshes instead — avoids the extra bundle weight/GPU cost), no
`drei <Environment>` HDRI (avoids an external asset fetch — lighting is hand-set instead), and
never more than one `<Canvas>` mounted at a time (the two sections don't overlap in the
viewport and each unmounts once scrolled away).

## Getting started

```bash
npm install
cp .env.local.example .env.local   # fill in real credentials, see below
npm run dev
```

Open http://localhost:3000 (or whatever port you pass).

## Required credentials (`.env.local`)

Forms will validate and render fine with no credentials set, but submissions will fail
gracefully (each backend integration logs an error and the API route returns a clear
failure to the client) until these are provided:

| Variable | Where to get it |
|---|---|
| `MONGODB_URI` | MongoDB Atlas connection string |
| `GOOGLE_SHEET_ID`, `GOOGLE_SERVICE_ACCOUNT_EMAIL`, `GOOGLE_PRIVATE_KEY` | Google Cloud service account with Editor access shared on the "Website Enquries" sheet |
| `SMTP_HOST`, `SMTP_PORT`, `SMTP_USER`, `SMTP_PASS`, `MAIL_FROM` | Your SMTP provider (or swap `src/lib/mailer.ts` for Resend/SendGrid) |
| `RECAPTCHA_SITE_KEY` / `RECAPTCHA_SECRET_KEY` / `NEXT_PUBLIC_RECAPTCHA_SITE_KEY` | https://www.google.com/recaptcha/admin (v2 checkbox) |

See `.env.local.example` for the full list and format notes (especially `GOOGLE_PRIVATE_KEY`,
which needs literal `\n` sequences).

## Content status

Facts that are verified from the supplied brochure/content docs (dates, venue, the two
organisers, the 15,000+ / 250+ / 75% previous-edition stats) are used as-is. Anything not
confirmed — category-interest percentages, visitor designation breakdown, media coverage,
association/sponsor logos, the privacy policy and terms — is clearly marked as sample or
placeholder content in the relevant component/page so it's easy to find and replace once the
organiser supplies final copy and assets (see Prompt 2, Section 7).

## Project structure

Follows the brief's folder layout: `src/app/(marketing)/*` for pages, `src/app/api/*` for the
four form endpoints, `src/components/{layout,sections,forms,ui,shared}`, `src/lib` for the
backend integrations and zod schemas, `src/hooks`, `src/types`.
