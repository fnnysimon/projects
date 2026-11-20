# v6 — Art direction: "the revenue ledger" (reverted)

> **Status: reverted.** Feedback: the background lines and the ledger receipt were not liked. `index.html` and `assets/styles.css` are back to `_versions/v5-clicks/`. The v6 files are kept in `_versions/v6-ledger-rejected/` for reference.

Source: `/frontend-design` · Before: `_versions/v5-clicks/` · After: the current site.
Files changed: `index.html` (hero markup, Literata italic), `assets/styles.css` (hero, ledger, grain, dashboard heading).

## Direction

- **Use:** a founder or growth lead at a $1–10M brand decides in a few seconds whether Goose understands *their money*.
- **Tone:** editorial finance report. Warm paper, ruled lines, a printed receipt. This builds on what was already there (Literata serif, DM Mono, Doto dot-matrix, warm amber) instead of replacing it.
- **Memorable detail:** the **leak ledger**, a perforated receipt next to the headline. It lists today's leaks with dotted leaders and ends on a dot-matrix total, **$41.2k/mo**. The product's promise ("every leak priced in dollars") becomes something you can see.
- **Constraints kept:** same copy, routes, click counts and section order. AA contrast, visible focus, reduced motion.

## Changes

| Area | Before | After | Why |
|---|---|---|---|
| Hero layout | Everything centred | Copy left, ledger right (stacked on screens under 960px) | Centring by reflex is the generic look. The asymmetry gives the eye a path: headline → CTA → proof. |
| Headline | "Your proactive revenue agent", 64px | Same words, up to 76px. **"revenue"** in Literata italic, in accent colour, with a marker stroke drawn in (700 ms) | One word carries the promise, so that word gets the emphasis |
| Proof above the fold | None (dashboard starts below) | Ledger: 4 leaks + "19 more" + total. On phones: 2 leaks + "21 more", so the page stays short | Shows the outcome before the visitor scrolls. Figures match the dashboard example. |
| Background | Flat `#f5f6f1` | Faint paper grain (inline SVG noise, about 1 KB) + ledger rules behind the hero, fading out at the edges | Material without decoration. No image request. |
| "Works with" | Centred chips under the CTA | A full-width row under a hairline, label left | Reads as a footnote of the hero, not a second focal point |
| Dashboard heading | Centred | Left-aligned, larger, stats aligned left | Consistent with the report tone and with the hero |

## Motion (all CSS, all disabled with `prefers-reduced-motion`)

| Element | Effect | Duration | Purpose |
|---|---|---|---|
| Ledger | Slides down 16px and fades in, like it's printed | 600 ms | Draws attention to the proof once |
| Ledger rows | Appear one after another | 400 ms each, 150 ms apart | Suggests Goose "reading" line by line |
| Marker under "revenue" | Draws left to right | 700 ms, after 350 ms | Points to the key word |

## Checks done in the browser

- Desktop 1280px and mobile 375px: no horizontal scroll (scroll width = viewport width).
- No console errors. `.hero` is only used on the landing page, so sub-pages only get the grain.
- Contrast: ledger text uses `--ink` / `--ink-3` (≥ 4.8:1) and `--accent-ink` (≥ 4.5:1) on white.
- The ledger is a `<figure>` with a caption ("Example read. Every leak priced in dollars."). Dotted leaders are `aria-hidden`.

## Left out on purpose

- No new colours or fonts: the system from v1–v2 already had character, so it only needed one strong moment.
- Sub-page heroes (case study, about, book) are unchanged. To do next if you like the direction.
