# Design Elevation: GooseWorks (v1 → v2)

Skill: `/design-elevation`
Before: `_versions/v1-critique/` · After: the site root.

## Direction kept
- Warm editorial look: off-white `#f5f6f1`, near-black warm ink, copper gradients, a single orange accent.
- Literata serif for display, Figtree for text, DM Mono for labels, Doto dot-matrix as the one signature moment on dark backgrounds.
- Layout, content, section order and behaviour are unchanged from v1.

## What already works (protected)
- The dark dashboard preview and the money-first copy: every finding ends in "$X a month".
- The contrast between warm light sections and dark product panels.

## Audit

| Dimension | Finding |
|---|---|
| Typography | The hero H1 left "agent" alone on line 2. "Things to fix, and room to grow." and other headings broke with a single last word. The large serif had default tracking and looked loose at 64px. Dollar figures used proportional digits, so amounts in lists didn't line up. |
| Spacing | **74 spacing values** in the CSS and **25** in inline styles were off the 4px grid (6, 10, 14, 18, 22, 26px…), mixed with on-grid ones. The rhythm was close to right but never quite even. |
| Alignment | The value strip text started **28px inside** the column edge every other section uses (104px vs 76px at 1280px wide). The story card had 36px padding on one side and 24px on the other. |
| Color | The focus ring was a cold blue `#2b6cb0`, the only cool colour on the page. Button hover went to pure `#000`, and ghost borders and inputs used a hard-coded `#cfccc3`. |
| Hierarchy | It was already clear after v1. No change needed beyond fixing the heading breaks. |
| Details | There were 3 near-identical shadows, and the small radii were a mix of one-offs (5, 6 and 8px). The header had no separation from content once scrolled. Arrows on CTAs were static. |
| Consistency | One-off values everywhere above. No dark theme exists, so nothing to check there. |

## Refinements

| # | Today | Refinement | Why | Impact |
|---|---|---|---|---|
| 1 | Headings break with a single last word ("agent", "grow.") | `text-wrap: balance` on headings, `text-wrap: pretty` on paragraphs | Balanced lines read as one idea, and orphans look accidental | High |
| 2 | Hero H1 at default tracking, line-height 1.1 | H1 `-0.025em` / 1.04, H2 `-0.015em` | Large serifs need tighter tracking to feel set rather than typed | High |
| 3 | Value strip text 28px off the column edge | First item: no left padding. Last item: no right padding | Everything now shares one left edge | High |
| 4 | Proportional digits in amounts | `tabular-nums` on money, prices, stats and list amounts | Figures line up in columns and don't jitter | Medium |
| 5 | 99 off-grid spacing values | Snapped to the 4px scale, plus `--s-1…--s-9` tokens | Even rhythm, and one source for future spacing | Medium |
| 6 | Blue focus ring | Brand focus ring: copper `#9a5d1f` on light (4.9:1), sand `#f0c48f` on dark (10.9:1) | It stays visible and now belongs to the palette | Medium |
| 7 | Header blends into content once scrolled | 1px hairline and a slightly more opaque background once the page scrolls | Separates navigation from content without adding weight | Medium |
| 8 | 3 shadows, small radii 5/6/8px | 2 shadow tokens (`--shadow-1/2`) and 1 small radius (`--r-xs: 6px`) | Removes near-duplicates that read as mistakes | Low |
| 9 | Hover to `#000`, borders hard-coded `#cfccc3` | `--ink-hover` warm near-black, `--line-strong` token | Neutrals stay warm, and the values are tokens | Low |
| 10 | Static arrows | Arrow nudges 3px on hover (off when reduced motion is on) | Small sign that the link moves you forward | Low |
| 11 | Default text selection | Selection in `--accent-soft` | A small brand detail | Low |

## Applied changes
All 11 are applied in `assets/styles.css` (tokens + rules), `assets/site.js` (the `is-scrolled` class) and inline spacing in the HTML pages.

**Checked after the changes:**
- No console errors.
- Focus ring visible (3px copper on light, verified on a goal card).
- Contrast: the focus ring is 4.9:1 on light and 10.9:1 on dark, and the text values from v1 are unchanged.
- Tap targets: unchanged from v1. Everything is ≥ 44px on touch screens. On desktop the header "Book a call" is 40px, the same as before this pass.
- The hero H1 now fits on one line at the pane width, and the value strip text aligns with the column edge (24px = 24px).

## Left out on purpose
- **No new layout, palette or typefaces.** This was a polish pass.
- **Desktop small buttons stay 40px.** Raising them to 44px would make the header heavier. They already meet WCAG 2.2 AA (24px minimum) and are 44px on touch screens.
- **Dot-matrix, chart figure and logo-badge sizes** stay outside the type scale. They are display pieces, not text.
- **Dark mode.** The site has none, and adding one would be a new feature, not polish.
- **Mobile page length** (11.5 screens). That's a structure question for a UX pass, not a polish one.
