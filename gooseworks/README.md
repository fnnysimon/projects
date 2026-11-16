# GooseWorks site — editable recreation

Static recreation of [GooseWorks](https://gooseworks.ai/) (YC startup, landing page + sub-pages), for redesign work. No build step, no dependencies.

**Original site:** https://gooseworks.ai/

**Before/after report:** [report/gooseworks-report.pdf](report/gooseworks-report.pdf) (or the self-contained [HTML](report/gooseworks-report.html)). It covers every step, from the first recreation (v0) to the current version (v5), with annotated screenshots.

## Run it

```bash
node server.js
```

Then open http://localhost:4321. (Opening `index.html` directly also works; only the dev site map needs the server.)

## Where to edit what

| I want to change… | Edit |
|---|---|
| A page's file path, the header nav, the footer, the top banner, where "Book a call" goes | `site.config.js` |
| The order of landing sections, or hide one | `LANDING_SECTIONS` in `site.config.js` |
| Landing page content | `index.html` (one commented `<section id="…">` per block) |
| A sub-page's content | `pages/*.html` |
| Colors, fonts, spacing | tokens at the top of `assets/styles.css` |
| Shared behaviour (header/footer rendering, accordions, tabs) | `assets/site.js` |

## Linking between pages

Never hard-code a path. Use a route id from `site.config.js`:

```html
<a data-route="book">Book a call</a>          <!-- a page -->
<a data-route="home#pricing">Pricing</a>     <!-- a page + anchor -->
<a data-route="cta">Book a call</a>          <!-- whatever CTA.route points to -->
<a data-route="cta2">See a real report</a>  <!-- the secondary, lower-commitment CTA -->
<a data-route="cta" data-cta-label><span class="label"></span></a>  <!-- label filled from CTA.label -->
```

External destinations go in `ROUTES` with `url` instead of `path` (e.g. `creativeApp`). They open in a new tab.

## Versions

Every round of changes is logged in `docs/`, and the previous state is kept in `_versions/`:

- `_versions/v0-baseline/`: the recreation before any skill was applied
- `docs/01-design-critique.md`: critique · `docs/02-critique-fixes.md`: what changed in v1
- `_versions/v1-critique/`: after the critique fixes
- `docs/03-design-elevation.md`: polish pass (v2, the current site)
- `docs/04-ux-discovery.md`: UX discovery on v2 (personas, jobs, journey, insights, telemetry, validation). No site changes.
- `_versions/v2-elevation/`: after the polish pass
- `docs/05-ux-fixes.md`: the 3 top-priority UX insights applied (v3, the current site)
- `docs/06-interaction-spec-booking.md`: interaction spec for the booking flow. No site changes.
- `_versions/v3-ux/`: after the UX fixes
- `docs/07-booking-build.md`: booking flow built from the spec (v4). Demo states: `pages/book.html?demo=slow|error|taken|empty|offline`.
- `_versions/v4-booking/`: after the booking build
- `docs/08-click-reduction.md`: fewer clicks on every booking path, with a before/after table (v5, the current site)
- `_versions/v5-clicks/`: after the click reduction
- `docs/09-frontend-design.md`: art direction "the revenue ledger" (v6). **Reverted**: the site is back to v5. The v6 files are kept in `_versions/v6-ledger-rejected/`.

Pricing links can carry a query string: `<a data-route="book" data-query="plan=growth">` → `pages/book.html?plan=growth`.

To add a page: copy a file in `pages/`, set `data-page="yourId"` on its `<body>`, and add `yourId` to `ROUTES`.

`sitemap.html` (dev only) lists every route and the links found on each page — use it to check the paths between pages.

## Pages

- `index.html` — landing: hero, dashboard preview, reads/finds, signals, levers, value, customer story, pricing, FAQ, final CTA
- `pages/case-study-braxley.html` — customer story
- `pages/creative-agent.html` — second product
- `pages/book.html` — booking (demo 3-step form, sends nothing)
- `pages/about.html`, `pages/skills.html`
- `pages/privacy.html`, `terms.html`, `data-deletion.html` — placeholders, not real legal text

Note: images, logos and the real legal texts are not copied; the wordmark is plain text and visuals are CSS mock-ups.
