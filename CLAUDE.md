# Escuela Psicodélica Website

## What This Is
A static portfolio website for **Carlos Flores**, a filmmaker, photographer, and musician based in Amsterdam. The project is called **Escuela Psicodélica**. Carlos is a friend of the user (Ali) who no longer wants to pay for WordPress hosting, so we rebuilt his site as plain HTML/CSS/JS for free Netlify deployment.

The site is currently positioned around **photo walks** — paid 1–2 hour photography sessions in Amsterdam — with the rest of Carlos's work (portraits, events, films, music videos) shown as a portfolio gallery.

## Source Material
The original WordPress site (`carlosflores.site`) was dumped into `/Users/aliezzeddine/Desktop/website-backup/`. That folder contains:
- `well-known/` — full WordPress installation with uploads, themes (Flatsome), plugins
- `localhost.sql` — 28MB MySQL database dump (contains all old page content, quiz data, post metadata)
- `new-assets/Images Website/` — new photos, logo variants, and KG Happy font files provided by Carlos
- `Correos Backup/` — Firefox email profile backup (not relevant to the site)

## Tech Stack
- **Plain HTML/CSS/JS** — no frameworks, no build step
- **Hosting:** Netlify (free tier, free subdomain)
- **GitHub repo:** `AliCodesDev/carlos-site` on `main` branch
- **Local dev:** `python3 -m http.server 8001` from the `carlos-site/` folder (port 8001, user preference)

## Design
- **Dark black background** (`#0a0a0a`) with **gold accents** (`#c9a24d`) — inspired by [The Hermetic School](https://thehermeticschool.org/)
- Typography: **KG Happy** font for the logo (TTF files in `assets/fonts/`), Inter/system sans-serif for body and hero title
- Clean, premium aesthetic. CSS custom properties for the palette live in `:root` in `style.css`.

## Site Structure

The site is **gallery-first**: `index.html` is the main page (anchor-based scrolling), plus a standalone **`energy-test.html`** lead-magnet quiz that's linked from the homepage. The earlier coaching page and `who-am-i` bio were removed when the site was repositioned around photo walks; the energy test was **brought back (2026-06)** specifically to collect emails (see below).

### `index.html` sections (top to bottom)
1. **Logo** — fixed top-left, text-only "Escuela Psicodélica" in KG Happy font (links to `#hero`).
2. **Hero** — full-viewport autoplaying muted background video (`assets/video/hero-reel.mp4`) with a dark overlay and the title "Escuela Psicodélica / Photo walks · Amsterdam". A scroll-down arrow links to the gallery.
   - NOTE: the current video is a placeholder (2021 Filmmaking Reel). Carlos designated a "Portada Video Background" (YouTube `v1tMLXqpO0Y`) in his Drive; we're keeping the placeholder until he sends an actual `.mp4` to host (best quality for a muted autoplay background). There's a `TODO` in the markup.
3. **Gallery** — a dense **bento grid** of photos plus YouTube video tiles, with filter tabs. This is the heart of the page.
4. **Energy Test CTA** — a gold-accented section (`.energy-cta`) teasing the quiz and linking to `energy-test.html`. This is the entry point for the email-collecting lead magnet.
5. **Contact footer** — email (`carlosflorescuevas@gmail.com`) + main YouTube link.
6. **Lightbox** — a single reused overlay (hidden by default) for viewing photos full-size and playing video tiles as embedded YouTube iframes.

### Gallery details
- **Filter tabs:** All · Portraits · Product · Artistic Video · Events · Videoclips. Each gallery item carries a `data-category`; `script.js` toggles a `.hidden` class to filter. A hidden "No items in this category yet" message shows if a filter is empty.
- **Photos** live in `assets/images/gallery/` (~60+ images: `photo-2022-*.png/jpg` and `portfolio-*.jpg/png`, plus a few named `portrait-*.jpg`). Each `<img>` has explicit `width`/`height` to prevent layout shift and `loading="lazy"`.
- **Video tiles** use `data-video="<youtubeId>"` + `data-title`, with a YouTube thumbnail and a play badge. Clicking opens the lightbox with an embedded iframe. Videos include cinematography reels, a short film, and RAK music videos.
- **Bento layout:** tiles get optional span classes `tile-wide` (2 cols), `tile-tall` (2 rows), `tile-feature` (2×2). Grid is 4 columns on desktop, collapsing to 3 / 2 / 1 at the 1024 / 768 / 480px breakpoints.

### `script.js` behavior
- **Hero video:** on `loadedmetadata`, seeks to a random point in `[0, duration − 30s]` so each load starts somewhere different; calls `play()` (catching autoplay rejection silently); hides the video on `error` so the `poster` shows.
- **Filter tabs:** toggle `.hidden` on items by category, update `aria-selected`, and show/hide the empty-state message.
- **Lightbox:** opens images directly and videos as YouTube iframes; prev/next stepping respects the **currently active filter** (only steps through visible items); supports Escape / ArrowLeft / ArrowRight; clears the iframe on close to stop playback.
- **Scroll fade-in:** an `IntersectionObserver` adds `.visible` to gallery items, filters, the energy-test CTA, and contact as they enter the viewport.

### `energy-test.html` (email-collecting lead magnet)
- An 8-question Spanish quiz — "¿Cuál es tu Energía Predominante?" — that tallies masculine vs. feminine answers and shows a result (Masculina / Femenina / Equilibrio). All logic is inline in the page (questions array + render/score JS); it has no dependency on `script.js`.
- **Email gate:** after the last question the result is computed but **hidden behind an email form** — the user must submit their email to reveal it. This is the lead-capture mechanism Carlos asked to bring back.
- **Email storage = Netlify Forms.** The `<form name="energy-test" data-netlify="true" ...>` is static HTML so Netlify detects it at deploy; submissions appear in the Netlify dashboard (free tier: 100/mo). It also posts two hidden fields — `resultado` (the energy type) and `puntuacion` (the fem/masc tally) — so each subscriber's result sits next to their email. **This only works once the site is deployed on Netlify; it won't capture on `file://` or a plain `python -m http.server` preview** (the JS posts via `fetch('/')` and reveals the result regardless, so the quiz still *works* locally — it just won't store the email).
- The page is self-contained: it re-declares `.btn` / `.btn-outline` / `.container` in its own `<style>` block (these are no longer in `style.css`) and reuses the shared `.site-logo` for a link back home. The result still offers a Calendly discovery-call CTA (`calendly.com/carlosflorescoach/llamadadedescubrimiento`).

## Assets
- `assets/fonts/KGHAPPY.ttf`, `KGHAPPYSolid.ttf` — KG Happy font family (logo)
- `assets/images/flower-of-life.png` — gold sacred-geometry symbol, used as the favicon
- `assets/images/logo-text.png` — "ESCUELA PSICODÉLICA" text logo (transparent bg) — present in assets but not currently referenced by the page
- `assets/images/gallery/` — the photography portfolio shown in the bento grid
- `assets/video/hero-reel.mp4` — hero background video (placeholder; see TODO above)
- `.venv/` — Python venv with Pillow, used for image processing (gitignored)

### Key Links
- **YouTube (main):** https://www.youtube.com/@escuelapsicodelica/featured
- **Contact email:** carlosflorescuevas@gmail.com
- **Coaching booking (energy-test result CTA):** https://calendly.com/carlosflorescoach/llamadadedescubrimiento
- **Design reference (from Carlos, not to copy):** https://allthesehumans.com/ — photo-first travel brand, large hero imagery, region-based galleries, minimal nav.
- **Carlos's "correct media" Drive folder:** https://drive.google.com/drive/folders/1imnTdR4y5SYVjs26QFbl9o_Lz7NZuVBg — see note below.

## Notes
- The user prefers port 8001 for local dev server
- YouTube embeds don't work on `file://` — must use a local server
- The favicon/hero accent is the Flower of Life symbol; the navbar "logo" is text-only in KG Happy font, no image logo
- The old WordPress SQL dump is the source of truth for any old content that needs recovering
- When adding a gallery item, set `data-category`, give the `<img>` explicit `width`/`height` + `loading="lazy"`, and escape any quotes in `data-title`/`alt` as `&quot;`
- **Gallery cleanup is pending Carlos.** He says the current photo/video set is "mixed" (has wrong items) and pointed to the Drive folder above as the correct set — but as of 2026-06 that folder only contains the intended *structure* (an `Events` folder with an "Events Reel" link, and a `Photography → Events` folder that's empty) plus a "Portada Video Background" doc. **No actual photo files are in it yet**, so the gallery hasn't been reconciled. He needs to upload the real photos (intended buckets appear to be *Events* and *Photography*) before we prune/replace the gallery.
