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
2. **Hero** — full-viewport autoplaying muted background video (`assets/video/hero.mp4`) with a dark overlay, title "Carlos Flores", tagline "Photo & Video", and a scroll arrow.
   - The video is Carlos's **`Que quiero comunicar.mp4`** (1920×1080, 2 min), compressed from ~128 MB → ~25 MB (H.264, CRF 28, audio stripped, `+faststart`) via the venv's bundled ffmpeg (`imageio-ffmpeg`). The original lives in `assets_updated/` (gitignored). The `poster` (`assets/images/hero-poster.jpg`) is a frame pulled from the video.
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

### Internationalization (`i18n.js`)
- The site is **bilingual EN/ES** via a tiny no-build layer in `i18n.js`, loaded before `script.js` on `index.html` and before the inline script on `energy-test.html`.
- **Language pick:** saved choice (`localStorage` key `lang`) → browser language → English. A fixed **EN/ES toggle** (`.lang-toggle`, top-right) switches and persists it.
- **Static text:** elements carry `data-i18n="key"` (sets `textContent`) or `data-i18n-ph="key"` (sets `placeholder`); `i18n.js` swaps them from its `DICT` (`en`/`es`) on load and on toggle. The text written in the HTML is the **English** default.
- **Dynamic text:** `i18n.js` exposes `window.I18N` (`.lang`, `.t(key)`, `.setLang()`) and fires a `langchange` event. The Energy Test quiz listens for it and re-renders (its questions are a bilingual array; nav/result strings come from `I18N.t`).
- **Adding a string:** add the key to BOTH `en` and `es` in the `DICT`, then reference it via `data-i18n` / `I18N.t`. Keep the two maps symmetric (there's a quick key-parity check you can re-run).

### `energy-test.html` (email-collecting lead magnet)
- 8-question quiz — "¿Cuál es tu Energía Predominante?" / "What's your predominant energy?" — available in **English and Spanish**, tallying masculine vs. feminine answers → result (Masculine / Feminine / Balance). All logic is inline; depends only on `i18n.js` for language state.
- Netlify hidden fields (`resultado`/`puntuacion`) are stored in **fixed English** so Carlos's records stay consistent regardless of the visitor's language.
- **Email gate:** the result is computed but hidden behind an email form — the user must submit their email to reveal it.
- **Email storage = Netlify Forms.** The static `<form name="energy-test" data-netlify="true" ...>` is detected at deploy; submissions land in the Netlify dashboard (free tier 100/mo). Hidden fields `resultado` + `puntuacion` ride along so each email has its result. **Only captures once deployed on Netlify** — locally the quiz works (JS reveals the result regardless) but nothing is stored.
- Self-contained: re-declares `.btn` / `.btn-outline` / `.container` in its own `<style>` (not in `style.css`); reuses `.site-logo`. Result offers a Calendly discovery-call CTA.

## Pending / Roadmap
- **Translation proof** — the EN copy for the Energy Test (questions + result text) was written by us; Carlos (native Spanish) should proof the English wording. ES is his original.
- **Netlify forms check** — after the next deploy, do one real Energy Test submission and confirm it lands in the Netlify dashboard.

## Assets
- `assets/fonts/KGHAPPY.ttf`, `KGHAPPYSolid.ttf` — KG Happy font family
- `assets/images/flower-of-life.png` — gold sacred-geometry symbol, used as favicon
- `assets/images/logo-text.png` — old "ESCUELA PSICODÉLICA" text logo (stale branding, unused)
- `assets/images/gallery/<category>/` — compressed portfolio photos
- `assets/video/hero.mp4` — hero background video (Carlos's compressed reel, ~25 MB)
- `assets/images/hero-poster.jpg` — poster frame for the hero video
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
