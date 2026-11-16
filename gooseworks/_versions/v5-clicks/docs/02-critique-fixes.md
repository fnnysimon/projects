# v1 — Fixes from the design critique

Skill: `/design:design-critique` (report: `docs/01-design-critique.md`)
Before: `_versions/v0-baseline/` (open http://localhost:4321/_versions/v0-baseline/)
After: the site root.

## 1. An easier decision (pricing + lower-commitment path)
- Second CTA **"See a real report"** (goes to the case study) in the hero, under pricing and in the final CTA. Set in `CTA2` in `site.config.js`.
- Pricing shows a starting price per tier: Starter $499/mo, Growth $1,499/mo, Business Custom. **These prices are placeholders**, to replace with real ones.
- Growth is highlighted with a "Most popular" badge, a dark border and the only filled button. The other two buttons are outlined. On mobile, Growth comes first.

## 2. A shorter, reordered landing page
- New order: hero → dashboard → **customer proof** (moved up from section 7 to 3) → how it works → signals → value → pricing → FAQ → CTA.
- The dark "signals" band and the "levers" block are merged into one `#signals` section, so the "What Goose finds" link now lands on real content.
- "Pays for itself" is now a 3-stat strip (10x / 1 day / 0 min) instead of 3 tall illustrated cards.
- On phones, the dashboard shows 1 card per column and the duplicate "Finds" block is hidden.
- Mobile length went from 14.5 to 11.5 screens (the target was about 8, so not reached yet).

## 3. Consistency
- **CTAs:** 4 labels → 1 main label ("Book a call") plus 1 secondary label. All labels come from the config. "Do it" became a "Fix" chip.
- **Type scale:** 18 font sizes → 7 tokens (`--fs-xs` … `--fs-3xl`). The page now renders 9 sizes, because the dot-matrix titles, chart figure and logo badge keep their own.
- **Cards:** 2 surfaces (light card / dark card) and 2 radii (12 / 22px).
- **Buttons:** 2 sizes (48 / 40px, 44px on touch screens).
- **Labels:** one eyebrow format, `01 · Reads`, on every page (the case study used `( 01 )`).
- Dot-matrix titles now appear on dark backgrounds only. The customer heading is serif.

## 4. Accessibility
- `--ink-3`: 3.2:1 → **5.1:1** on the page background, 5.6:1 on white. Orange text on light backgrounds uses `--accent-ink` (5.3:1).
- Every link and button is ≥ 44px high, including nav, footer, banner and FAQ.
- Visible `:focus-visible` outline on everything.
- Tabs have `role="tab"`, `aria-selected` and `aria-controls`. The FAQ has `aria-controls`. Headings follow a logical order.

## 5. Mobile and flows
- Goals in the signals section: on mobile the detail panel opens **right under the tapped goal** (accordion).
- Booking page: the form starts at 466px on mobile (was 752px, below the fold). Order is intro → form → proof.
- The banner is closable (remembered per browser) and is no longer part of the sticky header. The sticky bar went from 104px to about 64px.
- The header "Book a call" button is hidden on the booking page itself.
- "Open the creative agent" goes to the real app (`creativeApp` route, external) instead of an anchor.
- The case study has an inline "Book a call" block after finding 3 of 7.
