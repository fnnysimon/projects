# Design Critique: GooseWorks (recreation, baseline v0)

**Scope:** landing page (`index.html`) + sub-pages, at 1280px desktop and 375px mobile.
**Context:** B2B SaaS landing for e-commerce brands ($0–10M revenue). One goal only: get the visitor to **book a call**.
**Stage:** final/live design (this is the baseline we will improve with the next skills).

## Overall Impression

The art direction is strong and distinctive: warm off-white, an editorial serif, dark "product" panels, and money figures in every card. It feels premium and nothing like a template. The biggest opportunity is **conversion clarity**. The page is very long (14.5 phone screens), the one action is spread across 7 buttons with 4 different labels, and nothing on the page backs up the price or the "10x" claim, so a visitor scrolls a lot before deciding.

## Usability

| Finding | Severity | Recommendation |
|---|---|---|
| The only conversion path is "book a call" with custom pricing on every tier. A $500k brand has no way to see what it costs or to try the product on its own. | 🔴 Critical | Add a lower-commitment path next to the call: "See a sample report", "Get a free leak scan" (store URL only), or at least a "from $X/mo" anchor. Keep the call as the primary action. |
| Pricing: the 3 cards all say "Custom", have the same black CTA, and no tier is highlighted. They give no reason to pick one, so the block adds length but doesn't help the decision. | 🔴 Critical | Show a starting price or a value anchor per tier ("typically finds $5–15k/mo"). Highlight the recommended tier (Growth) with a badge and a filled button, and make the other two buttons outlined. |
| On mobile, tapping one of the 4 "levers" changes a panel that sits **550px below** the first lever, off-screen. The tap seems to do nothing. | 🟡 Moderate | On mobile, turn it into an accordion (the panel opens under the tapped lever) or horizontal chips placed above the panel. |
| "Do it" button inside the levers panel: on a marketing page it looks like a product action, but it actually opens the booking page. That breaks the user's expectation. | 🟡 Moderate | Relabel it "See this on your store →", or make it a non-interactive example chip. |
| The "What Goose finds" nav link jumps to `#signals`, a heading band with no content. The real examples are in the next section (`#levers`), on a different background. | 🟡 Moderate | Merge `signals` + `levers` into one section (one background), and point the nav at it. |
| Book page on mobile and narrow screens: the form starts at ~750px, below the fold, after the stats and checklist. The page whose only job is the form hides it. | 🟡 Moderate | On mobile, put the form first (or a "Book now" anchor button in the hero), and move the proof points under the form. |
| Creative agent: "Open the creative agent" (hero + final CTA) only scrolls to `#install`. It's a primary button with no real destination. | 🟡 Moderate | Link it to the real app (or a sign-up route in `site.config.js`), or change the label to "How to install". |
| Header CTA "Book a call" stays visible on `/book` and points to the page you're already on. | 🟢 Minor | Hide or change the header CTA on the booking page (e.g. "Back to product"). |
| 104px sticky header (banner + nav) takes 13% of a laptop screen and 12% on mobile, on every scroll. | 🟢 Minor | Hide the banner after the first scroll, or make it dismissible. Only the nav stays sticky. |
| The case study page (very long) has no CTA between the hero and the footer CTA. | 🟢 Minor | Add a sticky "Find your leaks →" bar or an inline CTA after finding 3 of 7. |

## Visual Hierarchy

- **What draws the eye first:** the serif H1 "Your proactive revenue agent" → then the dark dashboard. Correct, and the dashboard is the best "show, don't tell" element on the page. On a laptop, though, the headline numbers ("$41k/mo") sit right at the fold.
- **Reading flow:** hero → dashboard → dark "how it works" → levers → value → customer → pricing → FAQ → CTA. The story is logical, but it switches **light → dark → dark band → light → light → dark** in a way that doesn't follow the story. The dark "signals" band visually ends a block that actually continues on light.
- **Emphasis:**
  - The **dot-matrix titles** (Doto font, orange gradient) are the most eye-catching element on the page, more than the H1. On light backgrounds their contrast drops to **1.7–2.6:1**, so the most visible element is also the hardest to read.
  - The proof (Braxley, ~$15.4k/mo) is a strong argument but arrives in section 7 of 10. It should come much earlier.
  - Money figures are orange everywhere (dashboard, levers, story), which works well as a consistent cue.

## Consistency

| Element | Issue | Recommendation |
|---|---|---|
| CTA labels | "Book a free meeting", "Book a call", "Book a call to see yours →", "Do it". Four labels for one action. | One label everywhere ("Book a call"), plus "free" or "15 min" as a sub-line. Already centralised: change `CTA.label` and use it in all buttons. |
| Type scale | 18 different font sizes on the landing page, including 11, 11.67, 12, 13, 13.33, 14, 15px for small text. | Collapse to a 6–7 step scale (12 / 14 / 16 / 18 / 24 / 36 / 56–64) as CSS tokens. |
| Section headings | Three heading styles in turn: serif (value, pricing, FAQ), dot-matrix (reads, signals, customer), and sans 26px for sub-features. | Keep dot-matrix for **one** signature moment (e.g. on dark only), serif for all H2s. |
| Card styles | At least 5 card treatments: dark `issue`, `glass`, `mini`, white `card`, warm `panel`, `lever`. They have different radii (10/12/14/22px) and paddings. | Define 2 surfaces (light card, dark card) plus 2 radii (12 / 22) and reuse them. |
| Buttons | Header CTA 35px high, hero CTA 42px, "Do it" 35px, text links 19px. | Two button sizes (md 44px, sm 36px) and one text-link style. |
| Mono labels | `step-label` "01 · READS", `eyebrow` "[ ABOUT ]", `cs-num` "( 01 )". Three bracket conventions. | Pick one numbering/eyebrow format. |

## Accessibility

- **Color contrast** (WCAG AA, 4.5:1 for body text):
  - ✅ Body `ink-2` on background: 6.7:1. Dark body text: 6.9:1. Orange money on dark: 5.5:1.
  - ❌ `ink-3` (muted text, the "works" part of the wordmark, card sub-lines): **3.2:1** on the page background and **3.5:1** on white. Fails for the 12–14px text where it's used.
  - ❌ Dot-matrix titles on light backgrounds (customer section): **1.7–2.6:1**. Fails even the 3:1 large-text rule.
  - ⚠️ Mono tags (`FIX-2`, `GROW-1`) at 11px: 4.9:1 passes, but 11px mono is hard to read.
- **Touch targets:** 23 interactive elements are under 44px high. They include all nav links (22px), banner "See it" (20px), footer links (18px), "Book a call to see yours" (19px) and the header CTA (35px). On mobile the footer links are stacked with 10px gaps, which makes mis-taps likely.
- **Text readability:** body 16px with 1.55 line height is good. Readability suffers in the **82 text runs at 14px and 41 at ≤12px**, many in muted grey. That's the dense card copy in the dashboard, levers and pricing lists.
- **Other:** focus styles rely on browser defaults (no visible `:focus-visible` style on buttons/cards). The decorative signal dots and logo tiles are text-free, which is fine. Levers and tabs are missing `role="tab"` / `aria-selected`. Reduced-motion is respected ✅.

## What Works Well

- **A distinctive art direction.** The warm palette, editorial serif and dark product panels feel crafted and premium, far from the usual SaaS look.
- **Show, don't tell.** The hero dashboard and the levers panel display concrete findings, each with a dollar value. Visitors see the output before they read any claim.
- **The copy speaks money.** Every card ends with "$X a month", which matches what an e-commerce operator cares about.
- **The case study is excellent proof.** It's specific, dated and quantified (7 findings, each with a chart), and it's the strongest asset on the site.
- **The FAQ answers the real objections** (integrations, does it fix things).

## Priority Recommendations

1. **Make the decision easier: fix pricing + add a low-commitment path.** Add a price anchor or value range per tier, highlight Growth, and add a secondary "See a sample report / free leak scan" CTA in the hero and in pricing. This is the biggest conversion blocker because every visitor currently has to commit to a sales call.
2. **Shorten and reorder the landing.** Move the Braxley proof right after the dashboard ("real customer, 16 leaks in 2 weeks"). Merge `signals` + `levers`. Fold `value` into a 3-stat strip. Target about 8 phone screens instead of 14.5. All of this can be done in `LANDING_SECTIONS` plus small HTML merges.
3. **One CTA, one type scale, one card system.** Unify the CTA label, collapse the 18 font sizes to about 7 tokens, keep dot-matrix titles only on dark backgrounds, and standardise 2 card surfaces, 2 radii and 2 button sizes.
4. **Fix the accessibility failures.** Darken `--ink-3` to ~`#77706a` (≥4.5:1), stop using dot-matrix titles on light backgrounds, make all tap targets ≥44px (padding on nav and footer links), add `:focus-visible` styles and tab ARIA.
5. **Fix the mobile interactions.** Turn the levers into an accordion on mobile, put the booking form first on `/book`, and make the banner dismissible.
