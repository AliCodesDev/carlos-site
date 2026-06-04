# Carlos Flores — Portfolio Website

## What This Is
A static portfolio website for **Carlos Flores**, a photographer & filmmaker based in Amsterdam. Carlos is a friend of the user (Ali) who no longer wants to pay for WordPress hosting, so we rebuilt his site as plain HTML/CSS/JS for free Netlify deployment.

The site is **gallery-first** — a hero video, a filterable bento gallery of his photo & video work, an Energy Test lead magnet, and a contact footer.

> **Branding note:** the project was originally called **"Escuela Psicodélica"** and much of the history/source material still uses that name. On **2026-06-04** Carlos asked to drop it and brand the site plainly as **"Carlos Flores"** (with the tagline **"Photo & Video"**). His social/booking accounts are still under the old name (see Key Links) — confirm with him before changing those URLs.

## Source Material
The original WordPress site (`carlosflores.site`) was dumped into `/Users/aliezzeddine/Desktop/website-backup/`. That folder contains:
- `well-known/` — full WordPress installation with uploads, themes (Flatsome), plugins
- `localhost.sql` — 28MB MySQL database dump (all old page content, quiz data, post metadata)
- `new-assets/Images Website/` — new photos, logo variants, KG Happy font files
- `Correos Backup/` — Firefox email profile backup (not relevant)

Carlos also shares current media via a Google Drive folder (see Key Links). **Heads-up:** link-shared files in that folder are often *not* enumerable through the Drive API connection (only the folders show). The reliable path is to **download the files locally** — Ali drops them in `assets_updated/` (gitignored), and we compress from there.

## Tech Stack
- **Plain HTML/CSS/JS** — no frameworks, no build step
- **Hosting:** Netlify (free tier). Netlify Forms powers the Energy Test email capture.
- **GitHub repo:** `AliCodesDev/carlos-site` on `main` branch (commits go straight to `main`)
- **Local dev:** `python3 -m http.server 8001` from `carlos-site/` (port 8001, user preference)
- **Image processing:** `.venv/` Python venv with Pillow (+ fonttools), gitignored

## Design
- **Dark black background** (`#0a0a0a`) with **gold accents** (`#c9a24d`) — inspired by [The Hermetic School](https://thehermeticschool.org/)
- Typography: **KG Happy** display font for the logo/headings (TTF in `assets/fonts/`), Inter/system sans for body. Palette is CSS custom properties in `:root` in `style.css`.
- **Font gotcha:** KG Happy has accented vowels and `¡` but is **missing `¿`** (U+00BF). So KG Happy font stacks are written `'KG Happy', 'Inter', sans-serif` — the per-glyph fallback renders `¿` in Inter while the rest stays KG Happy. Don't revert the fallback to generic `cursive` or the `¿` renders ugly.

## Site Structure

`index.html` is the main page (anchor-scrolling), plus a standalone **`energy-test.html`** lead-magnet quiz linked from the homepage. (The old multi-page version — coaching page, `who-am-i` bio — is gone and staying gone, per Carlos.)

### `index.html` sections (top to bottom)
1. **Logo** — fixed top-left, text-only "Carlos Flores" in KG Happy (links to `#hero`).
2. **Hero** — full-viewport autoplaying muted background video (`assets/video/hero-reel.mp4`) with a dark overlay, title "Carlos Flores", tagline "Photo & Video", and a scroll arrow.
   - **Hero video is still a placeholder** (2021 reel). Carlos chose his Drive file **`Que quiero comunicar.mp4`** (~128 MB) as the real hero — it must be downloaded locally and **compressed** (it's far too big to serve raw) before swapping in. The `poster` currently points at a landscape gallery image. (`TODO` is in the markup.)
3. **Gallery** — the filterable **bento grid** (see below). The heart of the page.
4. **Energy Test CTA** — gold section (`.energy-cta`) linking to `energy-test.html`.
5. **Contact footer** — email (`carlosflorescuevas@gmail.com`) + YouTube link.
6. **Lightbox** — one reused overlay for full-size photos and embedded YouTube video tiles.

### Gallery details (rebuilt 2026-06-04 from Carlos's Drive)
- **Filter tabs:** All · Portraits · Landscapes · Events · Product · Spaces · Videos. Each tile has a `data-category`; `script.js` toggles `.hidden` to filter; an empty-state message shows if a filter has nothing.
- **Photos (50):** compressed copies live in `assets/images/gallery/<category>/` where category ∈ `portraits, landscapes, events, product, spaces`. Counts: portraits 15, landscapes 9, events 10, product 10, spaces 6. Each `<img>` has explicit `width`/`height` + `loading="lazy"`.
  - Source of truth = the **Photography** subfolders in Carlos's Drive. Full-res originals are downloaded to `assets_updated/Photography/<Category>/` (gitignored). Compression: Pillow → max dim 1600px, JPEG q82, EXIF-rotated, ~12 MB total. The compress + markup-generation was done with an inline Python script (no script kept in-repo; re-run a similar one when photos change).
- **Videos (8 + 1 reel):** `data-video="<youtubeId>"` + `data-title`. The 8 in the **Videos** filter come from Carlos's Drive video-list doc, each titled by genre: Artistic Video, Videoclips, After Movie, Real Estate, Company Trip, Artist Ad, Educational, Travelling. The **Events** filter leads with the **Events Reel** video (`xTo8Jw4Avuc`) before the event photos, per Carlos.
- **Bento layout:** span classes `tile-wide` (2 cols), `tile-tall` (2 rows), `tile-feature` (2×2), assigned by orientation. Grid is 4 cols, collapsing to 3 / 2 / 1 at 1024 / 768 / 480px.

### `script.js` behavior
- **Hero video:** on `loadedmetadata`, seeks to a random point in `[0, duration − 30s]`; plays (catching autoplay rejection); hides the video on `error` so the poster shows.
- **Filter tabs:** toggle `.hidden` by category, update `aria-selected`, show/hide empty-state. Generic — reads `data-filter`/`data-category`, so adding categories needs no JS change.
- **Lightbox:** images open directly, videos as YouTube iframes; prev/next respects the active filter; Escape / ArrowLeft / ArrowRight; clears the iframe on close.
- **Scroll fade-in:** `IntersectionObserver` adds `.visible` to gallery items, filters, the energy CTA, and contact.

### `energy-test.html` (email-collecting lead magnet)
- 8-question **Spanish** quiz — "¿Cuál es tu Energía Predominante?" — tallying masculine vs. feminine answers → result (Masculina / Femenina / Equilibrio). All logic is inline; no dependency on `script.js`.
- **Email gate:** the result is computed but hidden behind an email form — the user must submit their email to reveal it.
- **Email storage = Netlify Forms.** The static `<form name="energy-test" data-netlify="true" ...>` is detected at deploy; submissions land in the Netlify dashboard (free tier 100/mo). Hidden fields `resultado` + `puntuacion` ride along so each email has its result. **Only captures once deployed on Netlify** — locally the quiz works (JS reveals the result regardless) but nothing is stored.
- Self-contained: re-declares `.btn` / `.btn-outline` / `.container` in its own `<style>` (not in `style.css`); reuses `.site-logo`. Result offers a Calendly discovery-call CTA.

## Pending / Roadmap
- **Hero video** — swap the placeholder for a compressed `Que quiero comunicar.mp4` (needs the local file first).
- **Bilingual ES/EN** — Carlos wants the **whole site** in Spanish + English with a language toggle. Not built yet; planned as the last layer (so copy is translated once, after structure settles). Spanish drafts should be reviewed by Carlos (native speaker).

## Assets
- `assets/fonts/KGHAPPY.ttf`, `KGHAPPYSolid.ttf` — KG Happy font family
- `assets/images/flower-of-life.png` — gold sacred-geometry symbol, used as favicon
- `assets/images/logo-text.png` — old "ESCUELA PSICODÉLICA" text logo (stale branding, unused)
- `assets/images/gallery/<category>/` — compressed portfolio photos
- `assets/video/hero-reel.mp4` — placeholder hero video (see Pending)
- `assets_updated/` — raw full-res Drive downloads (**gitignored**; source for compression)

### Key Links
- **YouTube (main):** https://www.youtube.com/@escuelapsicodelica/featured *(old-brand handle — confirm if renamed)*
- **Contact email:** carlosflorescuevas@gmail.com
- **Coaching booking (energy-test CTA):** https://calendly.com/carlosflorescoach/llamadadedescubrimiento
- **Carlos's Drive (current media):** https://drive.google.com/drive/folders/1imnTdR4y5SYVjs26QFbl9o_Lz7NZuVBg
- **Design reference (from Carlos, not to copy):** https://allthesehumans.com/ — photo-first travel brand, big hero imagery, minimal nav.

## Notes
- The user prefers port 8001 for local dev server
- YouTube embeds don't work on `file://` — use a local server
- The old WordPress SQL dump is the source of truth for recovering old content
- When adding a gallery item: set `data-category`, give the `<img>` explicit `width`/`height` + `loading="lazy"`, and escape quotes in `data-title`/`alt` as `&quot;`
- To add/replace photos: drop originals in `assets_updated/`, re-run a Pillow compress into `assets/images/gallery/<category>/`, then regenerate the gallery tiles
