# GooseWorks — From a Plain Recreation to a Site That Books More Calls

A practice project for Claude skills, based on a real problem: the website of **[GooseWorks](https://gooseworks.ai/)**, a Y Combinator startup that makes Goose, a revenue agent for e-commerce brands. The site was first recreated as editable static pages, with every link between pages set in one config file. Claude skills were then applied one after the other, and every change was recorded with real before/after screenshots.

🌐 **Original site:** https://gooseworks.ai/

📄 **Full report:** [report/gooseworks-report.pdf](report/gooseworks-report.pdf) (49 pages, steps 0 to 8, or the self-contained [HTML](report/gooseworks-report.html)), generated with the [`/doc` skill](https://github.com/fnnysimon/claude-skills/tree/main/develop/Gestion-de-projet/doc)

## Before vs After

| Before: the first recreation (v0) | After: the current site (v8) |
|---|---|
| ![First recreation of the landing page](screenshots/v0-full.png) | ![Current landing page](screenshots/v8-full.png) |

## Key numbers

| | Before | After |
|---|---|---|
| Average clicks to book a call (11 paths) | 8.0 | 2.9 (−64%) |
| Clicks to book from the landing page | 8 | 2 (pick a time, then Confirm) |
| Clicks in the booking form, coming from a pricing card | 7 | 4 |
| Contrast of the light grey text | 3.2:1 | 5.1:1 |
| Font sizes in the CSS | 18 | 7 tokens |
| Spacing values off the 4px grid | 99 | 0 |
| Mobile landing length, in screens (375 × 812) | 14.5 | 9.1 (8.6 before step 8 put the booking in the hero) |

## Timeline

| # | Skill or request | Page | What it changed |
|---|---|---|---|
| 0 | Starting point | `index.html` + 9 pages | Editable recreation of gooseworks.ai, routes in `site.config.js` |
| 1 | `/design:design-critique` | Landing, booking | Second CTA, prices, shorter page, one type scale, AA contrast, form above the fold on mobile |
| 2 | `/design-elevation` | Whole site | Polish pass: balanced headings, brand focus ring, 4px grid, header hairline |
| 3 | `/ux-superpowers` | Landing | Honest promise, "Works with" row, "Your data" block before pricing |
| 4 | `/interaction-design` | `pages/book.html` | Booking flow rebuilt from a spec: errors, steps, time zone, Back, calendar file |
| 5 | Request, no skill | Booking, pricing | Fewer clicks: website from the email, revenue in one tap, plan passed from pricing |
| 6 | `/frontend-design` | Landing | "Revenue ledger" art direction, tried then **reverted** |
| 7 | Request, no skill | Landing (phones only) | Shorter mobile page: 12.9 → 8.6 screens, desktop unchanged |
| 8 | Request, no skill | Landing, booking | The essentials at a glance: clear topic, 4 key facts on the first screen, book a call in 2 clicks |

In every screenshot below, **red boxes** circle what the step changed, and their **numbers** match the bullet points.

---

### 0 · Starting point: an editable copy of gooseworks.ai

- Static HTML, CSS and JS with no build step. Header, footer, banner, nav and every link come from `site.config.js`, so a path between pages is changed in one place.
- One call to action only ("Book a free meeting"), "Custom" as the price of all three plans, and a long page: 14.5 screens on a phone.
- Images, logos and legal texts were not copied. Visuals are CSS mock-ups.

### 1 · An easier decision, a shorter page, a consistent system — `/design:design-critique`

1. **A second, lower-commitment CTA:** "See a real report" next to "Book a call", in the hero, under pricing and in the final CTA.
2. **Prices and a recommended plan:** Starter $499/mo, Growth $1,499/mo (marked "Most popular"), Business Custom. These prices are placeholders.
3. **The banner can be closed** and is no longer part of the sticky header (104 px → about 64 px).
4. **Booking form above the fold on mobile:** it starts at 466 px instead of 752 px.
- Also: customer proof moved from section 7 to 3, one main CTA label instead of 4, 7 type tokens instead of 18 sizes, every target at least 44 px, visible focus, tabs with ARIA roles.

| Before | After |
|---|---|
| ![](screenshots/cr-hero-b.png) | ![](screenshots/cr-hero-a.png) |
| ![](screenshots/cr-price-b.png) | ![](screenshots/cr-price-a.png) |
| <img src="screenshots/cr-mob-b.png" width="300" alt=""> | <img src="screenshots/cr-mob-a.png" width="300" alt=""> |

### 2 · A polish pass, from "fine" to crafted — `/design-elevation`

1. **Headings set more tightly and balanced:** no word left alone on a line (see the dashboard title).
2. **A brand focus ring:** copper instead of the browser's blue (4.9:1 on light, 10.9:1 on dark).
3. **One left edge:** the "10x / 1 day / 0 min" strip started 28 px inside the column.
4. **Header hairline** once the page scrolls.
- Also: 99 off-grid spacing values snapped to the 4px scale, 2 shadow tokens instead of 3 near-duplicates, aligned figures in prices, arrows that nudge on hover.

| Before | After |
|---|---|
| ![](screenshots/el-hero-b.png) | ![](screenshots/el-hero-a.png) |
| ![](screenshots/el-value-b.png) | ![](screenshots/el-value-a.png) |

### 3 · The page answers what a brand owner asks first — `/ux-superpowers`

1. **The promise matches the product:** "…and does the work" became "…and tells you exactly how to fix it", in line with the real FAQ.
2. **"Works with" row above the fold:** the 8 integrations from the FAQ, as text chips.
3. **"Your data" block before pricing:** what Goose reads, what it changes, how to leave. The wording is a placeholder for the team to confirm.

| Before | After |
|---|---|
| ![](screenshots/ux-hero-b.png) | ![](screenshots/ux-hero-a.png) |
| ![](screenshots/ux-trust-b.png) | ![](screenshots/ux-trust-a.png) |

### 4 · A booking flow that explains itself — `/interaction-design`

The spec listed 11 problems in the booking form. All 11 were built, with 5 demo states: `pages/book.html?demo=slow|error|taken|empty|offline`.

1. **Clear inline errors:** one message per field, all at once, with focus on the first one. Before, an empty form showed nothing on the page.
2. **Step indicator:** "Step 1 of 2 · Your brand".
3. **Slots with a date and a ✓**, not colour alone.
4. **Time zone written out:** "Times in Europe/Paris".
5. **Back, and a Confirm that names the slot.**
6. **A useful confirmation:** date and zone, invite email, "Add to calendar" (.ics file), what to have ready.
- Also (not visible in a screenshot): focus moves to each step's heading, a live region announces changes, the draft survives a refresh, and there are loading, slow, error and retry states.

| Before | After |
|---|---|
| ![](screenshots/bk-err-b.png) | ![](screenshots/bk-err-a.png) |
| ![](screenshots/bk-slot-b.png) | ![](screenshots/bk-slot-a.png) |
| ![](screenshots/bk-ok-b.png) | ![](screenshots/bk-ok-a.png) |

### 5 · Fewer clicks on every path to a booked call — request, no skill

Counting rule: 1 per tap, 2 for a dropdown (open, then pick), 1 to focus a text field. Typing and scrolling don't count.

1. **Store website filled in from a work email:** `marcus@brand.co` fills in `brand.co`. Free providers like gmail are skipped, and a typed value is never replaced.
2. **Revenue in one tap:** three buttons instead of a dropdown.
3. **The pricing card passes the plan:** coming from "Growth" pre-selects $1–10M.

| Path to a booked call | Before | After | Change |
|---|---|---|---|
| Booking form only, work email | 7 | 5 | −29% |
| Booking form only, free email (gmail…) | 7 | 6 | −14% |
| Booking form from a pricing card, work email | 7 | 4 | −43% |
| Booking form from a pricing card, free email | 7 | 5 | −29% |
| Hero "Book a call", work email | 8 | 6 | −25% |
| Hero "Book a call", free email | 8 | 7 | −13% |
| Pricing via the nav (desktop) | 9 | 6 | −33% |
| Pricing on mobile (menu first) | 10 | 7 | −30% |
| Pricing by scrolling | 8 | 5 | −38% |
| Case study → inline CTA | 9 | 7 | −22% |
| Any sub-page header "Book a call" | 8 | 6 | −25% |
| **Average** | **8.0** | **5.8** | **−27%** |

| Before | After |
|---|---|
| ![](screenshots/ck-form-b.png) | ![](screenshots/ck-form-a.png) |

![Arriving from the Growth plan: $1–10M is already selected](screenshots/ck-plan-a.png)

### 6 · An art direction tried, then reverted — `/frontend-design`

1. **A receipt next to the headline:** perforated edges, today's leaks, and a dot-matrix total of $41.2k/mo.
2. **"Revenue" in italic with a marker stroke**, and the copy aligned left.
- Also: faint ruled lines behind the hero and a paper grain on every page.

The user didn't like the background lines or the receipt, so the landing page went back to v5. The tried version is kept in [`_versions/v6-ledger-rejected/`](_versions/v6-ledger-rejected/).

| Current (v5, kept) | Tried, then reverted (v6) |
|---|---|
| ![](screenshots/fd-hero-b.png) | ![](screenshots/fd-hero-a.png) |

### 7 · A shorter landing page on phones — request, no skill

The page went from **12.9 to 8.6 screens** on a phone (10,437 → 7,023 px at 375 × 812, −33%). Desktop is unchanged. Details per section: [docs/10-mobile-length.md](docs/10-mobile-length.md).

- **Pricing as a swipeable row:** Growth first, the next plan peeking, and a "Swipe to compare the 3 plans" hint (1,696 → 859 px).
- **Signals:** only the open goal shows its description, no chart, 3 rows in the panel (1,795 → 1,068 px).
- **Duplicates hidden on phones:** the "Connected" panel (it repeated "Works with"), 2 of the 3 customer examples (they're in the case study).
- **Value strip side by side**, "Works with" on one line, and less padding everywhere.

| Before (390 px) | After (390 px) |
|---|---|
| <img src="screenshots/mb-price-b.png" width="300" alt=""> | <img src="screenshots/mb-price-a.png" width="300" alt=""> |
| <img src="screenshots/mb-sig-b.png" width="300" alt=""> | <img src="screenshots/mb-sig-a.png" width="300" alt=""> |
| <img src="screenshots/mb-dup-b.png" width="300" alt=""> | <img src="screenshots/mb-dup-a.png" width="300" alt=""> |
| <img src="screenshots/mb-story-b.png" width="300" alt=""> | <img src="screenshots/mb-story-a.png" width="300" alt=""> |
| <img src="screenshots/mb-value-b.png" width="300" alt=""> | <img src="screenshots/mb-value-a.png" width="300" alt=""> |
| <img src="screenshots/mb-hero-b.png" width="300" alt=""> | <img src="screenshots/mb-hero-a.png" width="300" alt=""> |

### 8 · The essentials at a glance — request, no skill

The request: the visitor should see, at a glance, what the startup does, the key information, and a way to contact them or book a demo in 2 clicks max. Details and click table: [docs/11-at-a-glance.md](docs/11-at-a-glance.md).

- **What it does:** new headline "Find the revenue your online store is losing", a "For e-commerce brands" label, and 3 steps (connect → Goose checks every morning → fixes priced in $).
- **Key facts on the first screen:** price, the Braxley result, setup and "your yes first", each linking to its details.
- **Book in 2 clicks:** the next free times are in the hero. Pick one, type your work email, Confirm. Website, revenue and ad spend became optional questions after the booking. Average clicks to a booked call: 5.8 → 2.9.
- **Direct contact:** "Contact" in the header, "Email the founders" in the booking card and the footer (one address in `site.config.js`).
- Trade-off: the phone page is half a screen longer (8.6 → 9.1). Still placeholders: the price and the contact address.

| Before | After |
|---|---|
| ![](screenshots/gl-hero-b.png) | ![](screenshots/gl-hero-a.png) |
| <img src="screenshots/gl-mob-b.png" width="300" alt=""> | <img src="screenshots/gl-mob-a.png" width="300" alt=""> |
| ![](screenshots/gl-page-b.png) | ![](screenshots/gl-page-a.png) |

![Click 1 picks a time, then the email field and Confirm appear](screenshots/gl-book-a.png)

---

## How the report was made: the `/doc` skill

The report and every screenshot in this README were produced with **`/doc`**, a custom Claude skill. Source: [claude-skills/develop/Gestion-de-projet/doc](https://github.com/fnnysimon/claude-skills/tree/main/develop/Gestion-de-projet/doc).

### What it does

`/doc` turns a series of Claude skill runs into one exportable report: one section per skill, numbered bullet points, and **real before/after screenshots** where each change is **circled in red with the number of its bullet point**. The output is a self-contained HTML file and an A4 PDF.

### How it works

```mermaid
flowchart LR
    H[Conversation + saved versions] --> T[Timeline of skills]
    T --> V[One folder per version: v0 ... v6]
    V --> S[shots.js: views, states, red boxes]
    S --> C[Headless Chrome screenshots]
    C --> R[Report: bullets + before/after]
    R --> E[HTML + PDF]
```

1. **Timeline:** every skill or request in order, with the user's own words and the changes made (8 steps here, including three plain requests and one reverted pass).
2. **Versions:** this project already saved a copy of the site after every step in [`_versions/`](_versions/), so each one was copied into a scratch folder (`v0` … `v5`, plus `v6` for the reverted pass). The project itself was never modified to take the screenshots.
3. **Shot plan:** [`report/shots.js`](report/shots.js) defines 27 shots: 1 to 3 before/after views per step with the same scroll position, plus a full page of v0 and v5. Setup code reaches states that only exist after an action: a focused button, an empty form submitted, a slot picked, a booking confirmed, an email typed into the form.
4. **Capture:** a small harness (`annot.html`) loads each version in a fixed-size iframe, runs the setup, freezes timers, and draws numbered red boxes around CSS selectors. Headless Chrome takes the screenshot at 1280 px (900 px for step 2, 390 px for mobile).
5. **Check:** every screenshot was reviewed, and 14 were retaken after fixing their boxes.
6. **Report:** cover, at-a-glance table, key numbers, one section per step, final state.
7. **Export:** `build.ps1` embeds the images as base64 and prints the PDF with headless Chrome.

### Example shot definition

```js
// Step 5: after typing a work email, the store website fills itself in
'ck-form-b': { src: 'v4/pages/book.html', scroll: '#book-form', offset: 100,
               run: (d) => { set(d, '#f-email', 'marcus@brand.co').dispatchEvent(new Event('blur')); },
               boxes: [{ sel: '.field:has(#f-site)', n: 1, pad: 4 }, { sel: '.field:has(#f-revenue)', n: 2, pad: 4 }] },
'ck-form-a': { src: 'v5/pages/book.html', /* same setup on the next version */
               boxes: [{ sel: '.field:has(#f-site)', n: 1, pad: 4 }, { sel: '#f-revenue', n: 2, pad: 4 }] },
```

The complete shot list is in [report/shots.js](report/shots.js).

### What had to be fixed during the check

- **A box drawn as a thin line:** the v0 banner measured almost 0 px tall, so its box had to wrap its children instead (`kids: true`).
- **Boxes off the slot grid:** the booking steps slide in, and the boxes were measured mid-slide. Step animations are turned off for the screenshots.
- **Boxes hiding the hints:** boxes around the inputs covered the hint text below them, so they now wrap the whole field (`.field:has(#f-site)`).
- **Too many boxes with the same number:** three "5" boxes on the confirmation were cramped, so one box now surrounds the whole panel.
- **What a screenshot can't show:** the browser's own validation bubble never appears in headless screenshots, so that caption says "nothing on the page says what's wrong".

---

## Run the site

```bash
node server.js
```

Then open http://localhost:4321. Opening `index.html` directly also works; only the dev site map needs the server.

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
<a data-route="book" data-query="plan=growth">Growth</a>  <!-- adds ?plan=growth -->
```

External destinations go in `ROUTES` with `url` instead of `path` (e.g. `creativeApp`). They open in a new tab.

To add a page: copy a file in `pages/`, set `data-page="yourId"` on its `<body>`, and add `yourId` to `ROUTES`. `sitemap.html` (dev only) lists every route and the links found on each page.

## Files

| Path | What it is |
|---|---|
| [index.html](index.html), [pages/](pages/) | The current site (v8): landing, booking, case study, creative agent, about, skills, legal placeholders |
| [site.config.js](site.config.js) | Routes, nav, footer, banner, CTAs, contact address, landing section order |
| [report/gooseworks-report.pdf](report/gooseworks-report.pdf) | The full before/after report (also as [HTML](report/gooseworks-report.html)) |
| [report/shots.js](report/shots.js) | The `/doc` shot list that produced the screenshots |
| [screenshots/](screenshots/) | All before/after screenshots (`-b` = before, `-a` = after) |
| [docs/](docs/) | The report of each skill and the change log of each step (01 to 11) |
| [_versions/](_versions/) | The site as it was after each step (v0 to v5), the reverted v6, v5b (just before the mobile pass) and v7b (just before step 8) |
| [server.js](server.js) | Tiny static server, no dependencies |

Images, logos and the real legal texts of gooseworks.ai are not copied. The wordmark is plain text, visuals are CSS mock-ups, and the pricing and "Your data" wording are placeholders.
