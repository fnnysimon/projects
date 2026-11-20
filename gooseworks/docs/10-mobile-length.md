# v7 — A shorter landing page on phones

Request: "Shorter mobile page" (no skill). Open since v1: the target was about 8 screens.
Before: `_versions/v5b-before-mobile/` · After: the current site.
Files changed: `assets/styles.css` (one block at the end, `@media (max-width: 760px)`), `index.html` (a "Swipe to compare" hint and a label on the plans row).

## Result

Measured in the browser at 375 × 812 px (one screen = 812 px).

| | Before | After | Change |
|---|---:|---:|---:|
| **Whole landing page** | **10,437 px · 12.9 screens** | **7,023 px · 8.6 screens** | **−33%** |
| Desktop page height at 1280 px | 7,155 px | 7,155 px | unchanged |

| Section | Before (px) | After (px) | What changed on phones |
|---|---:|---:|---|
| Hero | 701 | 574 | Less padding. "Works with" is one line that scrolls sideways instead of three wrapped lines. |
| Dashboard preview | 889 | 731 | Smaller title, the 3 stats side by side |
| Customer story | 1,066 | 762 | One example leak + the "~$15.4K a month" total (the other 2 are in the case study) |
| Reads (dark) | 994 | 454 | The "Connected" panel is hidden: it repeated the "Works with" row from the hero |
| Signals | 1,795 | 1,068 | Only the open goal shows its description. No chart. The open panel no longer repeats the goal title and shows 3 rows instead of 5. |
| Value strip | 637 | 200 | "10x / 1 day / 0 min" side by side, with their short titles. The sentences are dropped. |
| Your data | 601 | 561 | Tighter list |
| Pricing | 1,696 | 859 | The 3 plans become a swipeable row: Growth first, the next card peeking, and a "Swipe to compare the 3 plans →" hint |
| FAQ | 760 | 692 | Less padding |
| Final CTA | 529 | 449 | Less padding |
| Footer | 659 | 563 | Less empty space at the top and between columns |

## Checks

- No horizontal scroll on the page (scroll width = 375 px). The chips row and the plans row scroll inside themselves.
- No link or button under 44 px high on the phone layout.
- Signal goals still open their panel right under the tapped goal.
- Desktop at 1280 px: identical height (7,155 px), and the swipe hint is hidden.
- All 3 plans and their "Book a call" buttons (with `?plan=`) are still there, so the click counts from `08-click-reduction.md` don't change.

## Trade-offs

- **Pricing:** on a phone you see one plan and part of the next one, not all three at once. Growth (the recommended plan) comes first, and the hint plus the peeking card show there's more. Worth checking with real users that Starter and Business are still found.
- **Hidden on phones only:** the "Connected" panel, the signals chart, 2 of the 3 customer examples and the value sentences. Each one is either repeated elsewhere on the page or in the case study.
- **No sticky "Book a call" bar** at the bottom: the header already keeps "Book a call" on screen on phones, so a second one would repeat it.

## To decide

- 8.6 screens is close to the target of about 8, not under it. The next cut would be the FAQ (4 questions, 692 px) or a shorter "Your data" block, which are both content decisions.
