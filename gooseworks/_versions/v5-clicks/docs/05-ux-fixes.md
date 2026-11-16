# v3 — The three top-priority UX insights

Source: `/ux-superpowers` (report: `docs/04-ux-discovery.md`, insights 1, 4 and 6)
Before: `_versions/v2-elevation/` · After: the site root.

## 1. The promise matches today's product (insight 1)
- Hero and meta description:
  - Before: "…finds what to fix and where you can sell more, **and does the work**."
  - After: "…finds what to fix and where you can sell more, **and tells you exactly how to fix it**."
- The same change is on the About page.
- **Why:** the real FAQ says Goose gives instructions and will auto-fix "in the future". The page no longer promises more than the product does.
- Kept: "Your own growth manager does the work" on the Business tier, because a person really does it there.

## 2. "Works with" row under the hero (insight 6)
- A row listing the 8 integrations from the FAQ (Shopify, Meta Ads, Google Ads, Klaviyo, TikTok, Pinterest, Amazon, Triple Whale), right under the CTAs.
- It's above the fold on desktop (bottom at 654px of 800) and on mobile (starts at 624px of 812).
- Names are written as text chips. No third-party logos are used.

## 3. "Your data" block before pricing (insight 4)
- New section `trust` in `LANDING_SECTIONS`, between the value strip and pricing. That's where the journey puts the "is it safe?" moment, before the price.
- Three points, each based on something the real site already says:
  - **What Goose reads:** ads, store and email data, to find and price leaks (landing + FAQ).
  - **What Goose changes:** nothing without your yes (booking page: "ready for your yes").
  - **Leave any time:** disconnect or delete your data, linked to the Data deletion page (the real site has this page).
- **Placeholder wording.** The HTML comment says it must be confirmed by the GooseWorks team. No compliance or security certifications are claimed.

## Checks
- No console errors. All three changes render on desktop (1280px) and mobile (375px).
- No horizontal scroll, and no tap target under 44px.
- **Trade-off:** mobile length went from 11.5 to **12.8 screens**, because of the new block and the wrapped integration row. Insight 7 (sticky mobile CTA, shorter "how it works" on mobile) is the planned answer.

## Not done (next priorities in the report)
- Fake-door "Free leak scan" (insight 3).
- Price-anchor A/B test (5): needs a business decision.
- Proof for each revenue band (2): needs data.
- Sticky mobile CTA and shorter mobile sections (7).
- Explaining the booking form questions (8).
- Banner only for returning visitors (9).
