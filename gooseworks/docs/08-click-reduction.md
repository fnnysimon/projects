# v5 — Fewer clicks across the site's paths

Before: `_versions/v4-booking/` · After: the current site.
Files changed: `pages/book.html`, `assets/booking.js`, `assets/site.js` (`data-query`), `index.html` (pricing CTAs), `assets/styles.css` (revenue chips).

## How clicks are counted

- 1 per tap or click (link, button, chip, slot, menu)
- A dropdown (`<select>`) = 2 (open + pick)
- A text field = 1 (focus). Typing doesn't count.
- Scrolling doesn't count.
- Every "After" number below was run end to end in the browser and reached `booked: true`, except the "free email from a pricing card" row (computed from the others).

## Results

| Path | Before (v4) | After (v5) | Change |
|---|---:|---:|---:|
| **Booking form only** (`/book`, work email) | 7 | 5 | −2 (−29%) |
| Booking form only, free email (gmail…) | 7 | 6 | −1 (−14%) |
| Booking form from a pricing card, work email | 7 | 4 | −3 (−43%) |
| Booking form from a pricing card, free email | 7 | 5 | −2 (−29%) |
| **Hero "Book a call" → booked**, work email | 8 | 6 | −2 (−25%) |
| Hero "Book a call" → booked, free email | 8 | 7 | −1 (−13%) |
| **Pricing → booked** (desktop: nav "Pricing" + plan card) | 9 | 6 | −3 (−33%) |
| Pricing → booked on mobile (menu + "Pricing" + plan card) | 10 | 7 | −3 (−30%) |
| Pricing → booked, scrolling to pricing | 8 | 5 | −3 (−38%) |
| **Case study → booked** (home "See a real report" + inline CTA) | 9 | 7 | −2 (−22%) |
| Any sub-page header "Book a call" → booked | 8 | 6 | −2 (−25%) |

**Average on the 11 booking paths: 8.0 → 5.8 clicks (−27%).**

### Where the clicks went (booking form, work email)

| Step | Before | After |
|---|---:|---:|
| Email field | 1 | 1 |
| Store website field | 1 | 0, filled from the email domain |
| Yearly revenue | 2 (dropdown) | 1 (chip), or 0 from a pricing card |
| Continue | 1 | 1 |
| Pick a slot | 1 | 1 |
| Confirm | 1 | 1 |
| **Total** | **7** | **5** (4 from a card) |

## Changes

1. **Revenue: dropdown → 3 one-tap chips** (`Under $1M`, `$1–10M`, `$10M+`). It's a radio group in a `<fieldset>`, so it works with arrow keys and screen readers. Each chip is 48px high. Errors work as before (⚠ + text, `aria-invalid`).
2. **Store website filled from a work email.** On leaving the email field, `marcus@brand.co` fills `brand.co` and the hint changes to "Filled in from your email. Change it if your store is elsewhere." Free providers (gmail, yahoo, outlook, icloud, proton, orange…) are skipped on purpose. A value the visitor typed is never overwritten.
3. **Pricing cards carry the plan.** Starter / Growth / Business link to `book.html?plan=starter|growth|business`, which preselects the matching revenue band (unless a saved draft already has one). New `data-query` attribute in `site.js` to add a query string to any route link.

Note: this changes one decision from `07-booking-build.md` ("Revenue band: required today with no preselection"). Revenue is now preselected **only** when the visitor picked a plan themselves, so the data stays the visitor's own choice.

## Paths left unchanged (already 1–2 clicks)

| Path | Clicks | Why it stays |
|---|---:|---|
| Creative agent app (banner "See it" + "Open") | 2 | The middle page explains the product before sending people to another site. |
| Skills page (footer link) | 1 | Already minimal |
| Any page from the mobile menu | 2 | Menu + link is the floor on mobile |
| Read all 4 FAQ answers | 3 | The first answer is open by default |
| See all 4 signal goals | 3 | The first goal is open by default |

## Further cut, not done

- **Merge booking steps 1 and 2** (fields and slots on one screen): removes "Continue", −1 on every booking path (form: 5 → 4). Not done because it makes the mobile form much longer, and the 2-step flow was specified in `06-interaction-spec-booking.md`. To decide.
