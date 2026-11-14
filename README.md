# Kerf — product design studio site

A hand-built, single-page marketing site for a fictional B2B SaaS design studio. No framework, no build step, no page builder: one HTML file, one stylesheet, one small script.

**Live:** https://umairlone2004-glitch.github.io/kerf-studio/

## What's in here

```
.
├── index.html          # the whole site — hero, work, process, capabilities, pricing, FAQ, contact
├── 404.html            # styled not-found page
├── assets/
│   ├── styles.css      # design tokens, layout, responsive rules, dark theme
│   ├── main.js         # theme toggle, mobile drawer, scroll reveal, count-up, IST clock, scroll spy
│   └── favicon.svg
├── publish.sh          # one command: create the repo, push, switch on Pages
├── robots.txt
└── sitemap.xml
```

## Publishing in one command

```bash
bash publish.sh                  # umairlone2004-glitch/kerf-studio
bash publish.sh youruser yourrepo
```

It creates the public repo, pushes `main`, and switches GitHub Pages on. Needs the GitHub CLI logged in (`gh auth login`); without it the script prints the two git commands to run instead.

## Design decisions

- **Editorial spec-sheet look** — warm paper (`#efebe3`), ink, a single vermilion accent (`#c13d22`), hairline rules, monospaced metadata, registration ticks on cards. It reads like a technical drawing rather than a typical SaaS landing page.
- **Type pairing** — Instrument Serif for display, Bricolage Grotesque for body, JetBrains Mono for labels.
- **Dark mode** — follows the OS by default; the half-circle button in the nav overrides it and remembers the choice in `localStorage`.
- **Motion** — entrance reveals, count-up metrics and a slow capability ticker, all disabled under `prefers-reduced-motion`.
- **Accessibility** — skip link, focus-visible rings, `aria-current` on the active nav link, labelled icon buttons, semantic headings, AA-contrast text in both themes.

## Editing it

| Change | Where |
| --- | --- |
| Colours, type, spacing | `:root` tokens at the top of `assets/styles.css` |
| Copy and sections | `index.html` |
| Contact email | search for `umairlone2004@gmail.com` in `index.html` |
| Prices | the `#engagements` section |
| Availability line | the hero spec sheet and `#contact` |

## A note on content

All names, projects, metrics, testimonials and prices are **sample content** written to make the design read properly. Replace them with your own before using this as a real site — the case studies, the “38 products shipped” figures and the client quote are not real claims.

## Running locally

No server needed:

```bash
open index.html          # macOS
xdg-open index.html      # Linux
```

Or, for accurate relative paths:

```bash
python3 -m http.server 8000
```

## Deploying

GitHub Pages serves this repo from the `main` branch root. To update the site, commit and push — Pages rebuilds in under a minute.

---

Built by [Umair Lone](mailto:umairlone2004@gmail.com). MIT licensed.
