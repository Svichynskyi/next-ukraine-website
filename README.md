# Next Ukraine Foundation — website

Static site for [nextukraine.org](https://nextukraine.org). No build step, no
framework, no third-party requests at runtime.

Built from the `Home v4` Claude Design file; the design tokens in
`site/assets/css/tokens.css` are a verbatim mirror of the
`next-ukraine-foundation-design-system-d1bdb736` design system.

## Layout

```
site/            the website — this is what gets published
content/         source copy (EN), Markdown
design/          Claude Design export, for reference
DEPLOY.md        full deployment guide, incl. Apache/nginx setup
```

## Deploying

Pushing to `main` publishes automatically via
[`.github/workflows/deploy.yml`](.github/workflows/deploy.yml), which uploads
`site/` to GitHub Pages. `site/deploy/` and `site/.htaccess` are stripped from
the published output — they are server config for self-hosting, not content.

**The custom domain lives in Settings → Pages, not in `site/CNAME`.** With the
Pages source set to "GitHub Actions", GitHub ignores a CNAME file in the
uploaded artifact and reads the domain from the repository settings. The file
is kept only for a branch-based or self-hosted deploy; editing it changes
nothing on Pages.

To host it somewhere other than Pages, see [DEPLOY.md](DEPLOY.md).

## Working locally

```bash
python3 -m http.server 8765 --directory site
```

Then open <http://localhost:8765>.

## Open items

- The UKRIC card uses a placeholder tile; the licensed photograph still needs
  to be dropped in. See DEPLOY.md → "Known gap".
- Two links are still `#` placeholders, both marked `TODO` in the HTML: the
  LinkedIn company page and the `/ua/` Ukrainian mirror.
- `/model/`, `/ugti/` and `/about/` are stubs awaiting real copy.
