# Next Ukraine Foundation — website

Static site built from the `Home v4` Claude Design file. No build step, no
framework, no runtime dependencies: **upload the contents of `site/` and it
works.**

---

## What to upload

Everything **inside** `site/` goes to the web root. Do not upload the folder
itself, and do not upload `site/deploy/` (that is server config, not content).

```
site/
├── index.html              the Home v4 page
├── model/index.html        stub — "The 3R Model"
├── ugti/index.html         stub — "UGTI", contains the #ukric anchor
├── about/index.html        stub — "About"
├── 404.html                error page
├── robots.txt
├── sitemap.xml
├── site.webmanifest
├── .htaccess               Apache config — delete this if you run nginx
├── deploy/nginx.conf       nginx config — DO NOT upload; copy into nginx
└── assets/
    ├── css/tokens.css      the design system tokens, verbatim
    ├── css/site.css        page styles
    ├── js/site.js          mobile nav only (site works without it)
    ├── fonts/              16 self-hosted woff2 files (~150 KB)
    └── img/                photos, favicon, OG image (~2 MB)
```

Total: **2.3 MB**, 38 files.

The three stub pages exist so that every link in the design resolves instead of
404ing. Replace their `<main>` contents when the real copy is ready — the
header, footer and all linking stay as they are.

### Uploading

**SFTP / FTP / cPanel File Manager** — drag the *contents* of `site/` into
`public_html` (or `www`, or whatever your host calls the web root).

**rsync over SSH:**

```bash
rsync -avz --delete "site/" user@your-server:/var/www/nextukraine/
```

**Netlify / Cloudflare Pages / GitHub Pages** — point the deploy at `site/` as
the publish directory; there is no build command.

---

## Before you go live

Five things, all quick.

**1 · Set the real domain.** The files ship with `nextukraine.org` as a
placeholder. Replace it everywhere:

```bash
grep -rl "nextukraine.org" site/ | xargs sed -i '' "s|nextukraine.org|YOURDOMAIN.org|g"
```

That covers the `<link rel="canonical">` and Open Graph tags on all four pages,
plus `robots.txt` and `sitemap.xml`.

**2 · Fill in the two placeholder links.** Both are marked `TODO` in the HTML:

- the **LinkedIn** company page URL in the footer
- the **UA** language switch, which currently points at `#` — repoint it at
  `/ua/` once the Ukrainian mirror exists

```bash
grep -rn "TODO" site/
```

**3 · Replace the UKRIC photograph.** The third card on the home page uses a
generated placeholder tile (`assets/img/ukric.svg`) because the licensed stock
photo from the design project could not be downloaded in full — see
"Known gap" below. To swap in the real image:

- save it as `site/assets/img/ukric.jpg` (900 × 563 or larger, 16:10 crop)
- in `site/index.html`, change that card's `src` to `assets/img/ukric.jpg`,
  set `width="900" height="563"`, and write a real `alt` description

**4 · Enable HTTPS redirects.** In `.htaccess`, uncomment the two `RewriteRule`
blocks under "canonical host + HTTPS" once a certificate is installed. The
nginx config already redirects.

**5 · Turn on the server config.** Apache picks up `.htaccess` on its own,
provided `AllowOverride All` is set for the directory. On nginx, copy
`site/deploy/nginx.conf` into `/etc/nginx/sites-available/`, adjust `root` and
`server_name`, then:

```bash
sudo nginx -t && sudo systemctl reload nginx
```

Both configs set gzip/brotli compression, a one-year cache on static assets
with no-cache on HTML, and a Content-Security-Policy of `default-src 'self'`.
That CSP is exact rather than defensive — the page loads nothing from any third
party. If you later add an analytics script or an embed, widen it or the
browser will block them.

---

## Working on it locally

From this directory:

```bash
python3 -m http.server 8765 --directory site
```

Then open `http://localhost:8765`. Opening `index.html` by double-clicking also
mostly works, but the `/model/`-style links and the webmanifest need a server.

### Where things live

- **Colours, type, spacing, borders** — `assets/css/tokens.css`. These are
  copied verbatim from the Claude Design system
  `next-ukraine-foundation-design-system-d1bdb736`. Change a brand value here
  and it propagates everywhere; never hard-code a colour in `site.css`.
- **Layout and components** — `assets/css/site.css`, organised in numbered
  sections matching the page order.
- **The logo** is inline SVG in each HTML file (header and footer), so it
  inherits `--accent-500` and `--ink-900` from the tokens and needs no request.

### Design fidelity

The design file used Claude Design's `<x-import>` component runtime. That
runtime is gone here — the `Lockup`, `Button` and `Label` components were
compiled to static HTML and CSS, and `<image-slot>` placeholders became plain
`<img>` elements. Rendered typography and colour were verified against the
design's computed values and match exactly.

What was added on top of the design, because a real site needs it: SEO and
Open Graph metadata, a favicon and touch icon, responsive `srcset` images, a
collapsing mobile nav below 900px, a skip link and focus rings, `404.html`, and
print styles.

---

## Known gap

**The UKRIC card photograph.** The design references
`uploads/building-mechanical-car-together-2026-03-13-04-14-03-utc.jpg`, a
6301 × 4205 licensed stock photo. The design API truncates file reads at 256 KB,
so only the top ~4% of that image could be retrieved — not enough to use. The
card currently shows an on-brand placeholder tile built from the design
system's diagram language. You have the original file; step 3 above is the
one-line swap.

The other three photographs (hero, model card, UGTI card) are the Unsplash
images the design specified, downloaded at 1× and 2× and cropped to their
display aspect ratios. They are free under the Unsplash License; credit to
ThisisEngineering is not required but is appreciated.

## Fonts

Spectral and IBM Plex Mono are self-hosted rather than loaded from Google
Fonts — no third-party request, no consent-banner exposure, faster first paint.
Both are SIL Open Font License 1.1, which permits redistribution this way.
Latin, Latin-Extended and Cyrillic subsets are all included, so the Ukrainian
mirror will not need new font files.
