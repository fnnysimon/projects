# v8 — The essentials at a glance

Request: "What can I improve? I want the visitor to see 3 things at a glance: what the startup does, the key information (without 30 clicks), and an easy way to contact them or book a demo (2 clicks max)." Then: "Yes, apply all 3".
Before: `_versions/v7b-before-glance/` · After: the current site.
Files changed: `index.html` (hero), `pages/book.html`, `assets/booking.js` (rewritten), `assets/styles.css` (one v8 block at the end), `site.config.js` (`CONTACT`, nav and footer), `assets/site.js` (contact links).

## 1. What the startup does

| | Before | After |
|---|---|---|
| Label | – | "For e-commerce brands" |
| Headline | "Your proactive revenue agent" | "Find the revenue your online store is losing" |
| Lead | "Goose reads your ads, store and email, finds what to fix…" | "Goose is a proactive revenue agent. It reads your ads, store and email every morning…" |
| How it works | Only further down the page | 3 steps under the lead: Connect → Goose checks every morning → fixes priced in $ (desktop and tablet; hidden on phones, where the lead already says it) |

## 2. Key information on the first screen

Four facts, each linking to its details:

| Fact | Links to | Source on the page |
|---|---|---|
| From $499/mo · No cut of your sales | Pricing | Pricing section (**placeholder price**) |
| ~$15.4K/mo found for Braxley in 2 weeks | Case study (the "real report") | Customer story |
| A few clicks to connect your tools | "Reads" section | "Connect … in a few clicks" |
| Your yes first · nothing changes without it | "Your data" section | "Nothing without your yes" |

Where the price used to be: about 7 screens down on a phone (section at 7.0 screens on a 710 × 565 window). Now on the first screen at every size measured.

## 3. Book a call in 2 clicks

The booking flow is now **pick a time → type your work email → Confirm**. Website, revenue and ad spend moved after the booking, as optional "Help us prepare" questions (website filled in from the email, revenue preselected from the pricing card).

The same flow (`assets/booking.js`) runs in the landing hero (6 slots, with "More times →") and on `pages/book.html` (9 slots). Kept from the interaction spec: inline email error, slot skeleton, slow and timeout messages, "just taken" slot, draft saved on refresh, calendar file, focus and screen-reader announcements.

Direct contact: "Contact" in the header nav (and the mobile menu), "Email the founders" in the booking card and the footer, all from `SITE.CONTACT` in `site.config.js`. **The address is still the placeholder `hello@example.com`.**

### Clicks to a booked call

Typing the email is not counted as a click (same rule as `08-click-reduction.md`).

| Path to a booked call | v0 | v5–v7 | v8 |
|---|---:|---:|---:|
| Booking page only, work email | 7 | 5 | 2 |
| Booking page only, free email (gmail…) | 7 | 6 | 2 |
| From a pricing card, work email | 7 | 4 | 3 |
| From a pricing card, free email | 7 | 5 | 3 |
| Landing hero, work email | 8 | 6 | **2** |
| Landing hero, free email | 8 | 7 | **2** |
| Pricing via the nav (desktop) | 9 | 6 | 4 |
| Pricing on mobile (menu first) | 10 | 7 | 5 |
| Pricing by scrolling | 8 | 5 | 3 |
| Case study → inline CTA | 9 | 7 | 3 |
| Any sub-page header "Book a call" | 8 | 6 | 3 |
| **Average** | **8.0** | **5.8** | **2.9 (−50% vs v7)** |

Email contact: 1 click (header "Contact" on desktop, "Email the founders" in the hero card), 2 on a phone through the menu.

## Measured

| | Before (v7) | After (v8) |
|---|---:|---:|
| Desktop 1280 × 800: topic, 4 facts and the booking card above the fold | no (booking card and price not on the first screen) | yes (facts end at 713 px, card at 647 px) |
| Phone 375 × 812: first screen shows | headline, lead, 2 buttons | headline, lead, 4 facts, first row of times |
| Phone landing length | 7,023 px · 8.6 screens | 7,403 px · 9.1 screens |
| Desktop page height | 7,155 px | 7,323 px |

## Checks

- Landing: slot → email → Confirm shows "You're booked" with the slot and the calendar file. Confirm with an empty email shows "Enter your work email so we can send the invite." and focuses the field.
- `book.html?plan=growth&demo=taken`: the first Confirm says the slot was just taken and keeps the email; the next one books. The optional details show `brand.co` (from `alex@brand.co`) and "$1–10M" preselected.
- No sideways scroll on a phone (scroll width 375 px), no link or button under 44 px in the hero.

## Trade-offs and to decide

- The phone page is 0.5 screen longer than v7 (8.6 → 9.1): the facts and the times cost more than the 2 buttons they replace.
- The team gets less before the call (website and revenue are optional). The website still comes from a work email's domain.
- **Replace before going live:** the price in the facts strip and the contact address. Both are placeholders.
