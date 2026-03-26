# Escuela Psicodélica Website

## What This Is
A static portfolio website for **Carlos Flores**, a filmmaker, musician, and life coach based in Amsterdam. The project is called **Escuela Psicodélica**. Carlos is a friend of the user (Ali) who no longer wants to pay for WordPress hosting, so we rebuilt his site as plain HTML/CSS/JS for free Netlify deployment.

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
- Typography: **KG Happy** font for logo/titles (TTF files in `assets/fonts/`), Inter/system sans-serif for body
- **Flower of Life** gold symbol as the hero icon (`assets/images/flower-of-life.png`)
- Clean, masculine, premium aesthetic

## Site Structure

### Pages
1. **`index.html`** — Homepage with sections:
   - Hero (Flower of Life symbol + "Escuela Psicodélica" in KG Happy font)
   - Energy Test teaser (links to `energy-test.html`)
   - Who Am I teaser (photo + short bio, links to `who-am-i.html`)
   - YouTube CTA section
   - Coaching (simplified: circular photo + heading + "Book a 1-on-1 Call" CTA via Calendly)
   - Filmmaking (Photo/Video tabs, videos show 3 with "Show More" for 3 more)
   - Music (4 YouTube embeds from `@rakmusicaa` channel)
   - Contact footer (Instagram + YouTube links)

2. **`energy-test.html`** — Masculine/Feminine Energy quiz (8 questions rebuilt from old Gravity Forms data). Scoring: counts fem vs masc answers, shows result with description.

3. **`who-am-i.html`** — Full bio page with photo and YouTube CTA. NOT in main nav, accessible via footer link and homepage teaser.

### Nav Order
Coaching → Filmmaking → Music → Contact

### Key Links
- **Instagram:** https://www.instagram.com/escuelapsicodelica/
- **YouTube (main):** https://www.youtube.com/@escuelapsicodelica/featured
- **YouTube (music):** https://www.youtube.com/@rakmusicaa
- **Coaching booking:** https://calendly.com/carlosflorescoach/llamadadedescubrimiento

## Assets
- `assets/fonts/KGHAPPY.ttf`, `KGHAPPYSolid.ttf` — KG Happy font family
- `assets/images/flower-of-life.png` — gold sacred geometry symbol (used as site icon/hero)
- `assets/images/coaching-photo.jpg` — Carlos smiling with hat (compressed from 50MB original)
- `assets/images/logo-text.png` — "ESCUELA PSICODÉLICA" text logo (transparent bg)
- `assets/images/portfolio-1.jpg` through `portfolio-9.jpg` — photography portfolio
- `assets/images/carlos-portrait.png` — older portrait (from original site)
- `.venv/` — Python venv with Pillow, used for image processing (gitignored)

## Notes
- The user prefers port 8001 for local dev server
- YouTube embeds don't work on `file://` — must use local server
- The old WordPress SQL dump is the source of truth for any old content that needs recovering
- The logo in the hero is the Flower of Life symbol, NOT the circular photo logo from earlier iterations
- The site name in the nav is text-only using KG Happy font, no image logo in navbar
