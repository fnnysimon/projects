# Tova M1: from a broken landing page to a polished product page

A design practice project. **Tova M1** is a fictional home robot, with a landing page modelled on the real [Nori Robotics](https://www.norirobotics.com/) site (a Y Combinator company). I first built a deliberately broken version with planted design, copy and accessibility flaws. Then I fixed it step by step with Claude skills: critique, design system, accessibility, UX discovery, UX copy, interaction design, an expert panel and front-end art direction.

Tova is an original brand. It copies Nori's page structure, not its name, logo, colours, robot or copy.

**What's in this folder**

| Folder | Contents |
|---|---|
| [`report/`](report/) | The full before/after report: [HTML](report/tova-m1-report.html) (playable task animations) and [PDF](report/tova-m1-report.pdf) |
| [`screenshots/`](screenshots/) | Before/after pairs, full-page captures and the Nori reference |
| [`site-before/`](site-before/) | Code of the broken starting site |
| [`site-after/`](site-after/) | Code of the final site |
| [`skill-reports/`](skill-reports/) | The report written by each skill along the way |

> GitHub doesn't run HTML files. To read the report with its animations, download `report/tova-m1-report.html` and open it in a browser.

---

## 1. The reference: Nori Robotics

All screenshots come from **https://www.norirobotics.com/** and were taken on 12 November 2026, for reference only.

| Section | Link | Screenshot |
|---|---|---|
| Hero | [norirobotics.com](https://www.norirobotics.com/) | [nori-top.png](screenshots/nori/nori-top.png) |
| Everyday tasks | [norirobotics.com](https://www.norirobotics.com/) (scroll to "Everyday tasks") | [nori-tasks.png](screenshots/nori/nori-tasks.png) |
| Skills marketplace | [norirobotics.com](https://www.norirobotics.com/) (scroll to "Skills marketplace") | [nori-skills.png](screenshots/nori/nori-skills.png) |
| Specs | [norirobotics.com](https://www.norirobotics.com/) (scroll to "Affordable and capable") | [nori-specs.png](screenshots/nori/nori-specs.png) |
| Order band | [norirobotics.com](https://www.norirobotics.com/) (scroll to the order section) | [nori-order.png](screenshots/nori/nori-order.png) |

![Nori Robotics home page hero](screenshots/nori/nori-top.png)

<p>
  <img src="screenshots/nori/nori-tasks.png" width="32%" alt="Nori everyday tasks section">
  <img src="screenshots/nori/nori-skills.png" width="32%" alt="Nori skills marketplace section">
  <img src="screenshots/nori/nori-order.png" width="32%" alt="Nori order section">
</p>

What Tova borrows from it:
- **Hero:** a big robot render on an olive background, the product name in a chunky display face, a monospace "now shipping" tag and two badges.
- **Everyday tasks:** clips of the robot at work, with a tab row and progress bars.
- **Skills marketplace**, then spec cards, then a full-width order band with the price.

---

## 2. The steps

| # | Skill or request | What it changed |
|---|---|---|
| 0 | Reference | The real Nori Robotics site: the genre and layout being imitated. |
| 1 | Request, no skill | Built "Tova M1": an original fictional brand on the same kind of page, with planted design, copy and accessibility flaws. |
| 2 | `/design-critique` | Structured critique of hierarchy, usability and consistency ([report](skill-reports/01-design-critique.md)). |
| 3 | `/design-system` | Audit against the tokens and brand file, then a two-layer token system ([report](skill-reports/02-design-system-audit.md)). |
| 4 | `/accessibility-review` | WCAG 2.1 AA audit and fixes: contrast, labels, keyboard, focus, pause control ([report](skill-reports/03-accessibility-audit.md)). |
| 5 | `/ux-superpowers` | UX discovery: personas, jobs to be done, journey, telemetry plan ([report](skill-reports/04-ux-discovery.md)). |
| 6 | `/ux-copy` | New trust blocks, then a review of every string, applied in full ([report 1](skill-reports/05-ux-copy.md), [report 2](skill-reports/06-ux-copy-review.md)). |
| 7 | `/interaction-design` | Interactive hero robot: head tracking, blinking, privacy shutter, wake wave ([report](skill-reports/07-interaction-design.md)). |
| 8 | `/debatexperts` | Expert panel on the robot, then the V2 was built ([report](skill-reports/08-expert-panel.md)). |
| 9 | Request, no skill | shadcn/ui components and Lucide icons. |
| 10 | Request, no skill | Robot redrawn to match a product render, keeping every effect. |
| 11 | `/frontend-design` | "Product spec sheet" art direction: paper grain, blueprint grid, numbered sections, motion. |
| 12 | Request, no skill | Skill search instead of a dead button, and six animated task scenes. |
| 13 | Request, no skill | Fewer clicks on every path: join from the hero in 2 clicks instead of 4 (section 4 below). |
| 14 | `/doc` | The before/after report in [`report/`](report/), including the fewer-clicks pass. |

---

## 3. Before vs after

Red boxes in the screenshots mark what changed. The numbers match the bullet points.

### Hero: one clear action and a robot that reacts

1. **One call to action:** "Contact us" and "Order →" competed in the header. The hero now has a single "Join the waitlist" button.
2. **Says what it does:** "The most capable home robot" became "Tidies up, loads the dishwasher and folds laundry. $1,690."
3. **No contradiction:** "now shipping fall 2026" clashed with "Ships Q1 2027" further down. It now reads "Waitlist open · Ships Q1 2027".
4. **Interactive robot:** the flat image became a robot that turns its head toward the pointer, blinks, and closes a privacy shutter when clicked.
5. **Honest cookie banner:** "By continuing to browse you agree" with a tiny "reject" link became a card with equal "Essential only" and "Accept all" buttons.

| Before | After |
|---|---|
| ![Hero before](screenshots/before-after/hero-before.png) | ![Hero after](screenshots/before-after/hero-after.png) |

### Everyday tasks: real tabs and animated scenes

1. **Accessible tabs you can pause:** the list was faint text that advanced on its own and couldn't be stopped. Now they are real tabs (arrow keys work) with a Pause button.
2. **A scene for each task:** every tab showed the same cropped image, and "Folding clothes" pointed to a missing file. Each task now plays its own 8-second animation, drawn in code with the hero robot's shapes and colours.

| Before | After |
|---|---|
| ![Tasks before](screenshots/before-after/tasks-before.png) | ![Tasks after](screenshots/before-after/tasks-after.png) |

### Skills marketplace: consistent cards and a working search

1. **Icons, not emoji:** emoji were replaced with Lucide icons.
2. **One price format:** "FREE", "free", "$1.99/mo" became consistent badges: "Free", "$4.99", "$1.99/month".
3. **Search instead of a dead link:** "click here to see all skills" led nowhere. A search field now filters the cards as you type, with a result count and an empty state.

| Before | After |
|---|---|
| ![Skills before](screenshots/before-after/skills-before.png) | ![Skills after](screenshots/before-after/skills-after.png) |

### Order band: a free waitlist with clear errors

1. **Consistent facts:** "Full price, no deposit" sat next to "$99 refundable deposit required", and "12,000+ people" next to "8,400 reservations". The offer is now one free waitlist, at $1,690, shipping Q1 2027.
2. **Labels and helpful errors:** the fields had only placeholders. They now have labels, hints and specific error messages.
3. **One clear button:** "Buy now" and "Submit" became a single "Join the waitlist", with a loading state and a confirmation dialog.

| Before | After |
|---|---|
| ![Order before](screenshots/before-after/order-before.png) | ![Order after](screenshots/before-after/order-after.png) |

### On a phone (390 px)

1. **Header fits:** the nav links overflowed the screen.
2. **Title fits:** "TOVA M1" was cut off at the right edge.
3. **The robot is visible:** it was pushed off-screen. It now sits under the button and still reacts to taps.

| Before | After |
|---|---|
| <img src="screenshots/before-after/mobile-before.png" width="300" alt="Mobile before"> | <img src="screenshots/before-after/mobile-after.png" width="300" alt="Mobile after"> |

### The whole page

Full pages, top to bottom, with no annotations.

| Before (desktop) | After (desktop) |
|---|---|
| ![Full page before, desktop](screenshots/full-page/before-desktop-full.png) | ![Full page after, desktop](screenshots/full-page/after-desktop-full.png) |

| Before (mobile) | After (mobile) |
|---|---|
| <img src="screenshots/full-page/before-mobile-full.png" width="260" alt="Full page before, mobile"> | <img src="screenshots/full-page/after-mobile-full.png" width="260" alt="Full page after, mobile"> |

---

## 4. Fewer clicks

A later pass: list every path through the page, count the clicks, and cut them. It is also section 07 of the [report](report/). "Before" below is the page at the end of section 3. Red boxes mark what changed, and the numbers match the list.

1. **Join from the hero:** the "Join the waitlist" button only scrolled to a form at the bottom. Now the email field and the button sit in the hero. The ZIP code is optional and only asked in the bottom form.
2. **Lighter header:** the cart opened an empty cart, and "Help" went to the same place as "FAQ". Both are gone.
3. **Confirmation in place:** joining opened a dialog you had to close. The confirmation now replaces the form.
4. **One-click skill filters:** Kitchen, Laundry, Tidying, Pets and Free, instead of clicking the search field and typing.
5. **Spec details shown:** three details were hidden behind ⓘ buttons. They now sit under each spec.
6. **FAQ answers open:** only the first was open. All five are now, and can still be closed.
7. **Cookie banner answered once:** the choice is remembered, and the dead "Cookie settings" link is gone.

### Clicks and time per path

| Path | Clicks before | Clicks after | Time before | Time after |
|---|---|---|---|---|
| **Join the waitlist**, from the top of the page | 4 | **2** | 8.9 s | **3.3 s** |
| Read an FAQ answer, from the "FAQ" link | 2 | **1** | 2.6 s | **1.3 s** |
| Filter skills to free ones | 1 + typing | **1** | 2.4 s | **1.3 s** |
| Read a spec detail | 1 hover or tap | **0** | 1.1 s | **0 s** |
| Cookie banner on a return visit | 1 | **0** | 1.3 s | **0 s** |
| Open the cart | 2, to an empty cart | **removed** | 2.6 s | – |
| Come back after joining | "Join" offered again | **0**, shows "On the list" | – | – |

**How the times are worked out:** estimates, not measurements with users. They use the Keystroke-Level Model (Card, Moran and Newell): 1.3 s per click (point, then press), 1.1 s per hover, 0.28 s per key typed. Waits come from the code: 0.5 s scroll before the cursor lands in the form, then 1.8 s (before) or 0.7 s (after) loading. Typing the email is the same on both sides, so it is left out. On the main path: 2 clicks and 5.6 s saved, about 63% faster.

### Before vs after

| Before | After |
|---|---|
| ![Hero before](screenshots/fewer-clicks/hero-before.png) | ![Hero after](screenshots/fewer-clicks/hero-after.png) |
| ![Confirmation dialog before](screenshots/fewer-clicks/confirm-before.png) | ![Inline confirmation after](screenshots/fewer-clicks/confirm-after.png) |
| ![Skills search before](screenshots/fewer-clicks/skills-before.png) | ![Skills quick filters after](screenshots/fewer-clicks/skills-after.png) |
| ![Specs with info buttons before](screenshots/fewer-clicks/specs-before.png) | ![Specs with details after](screenshots/fewer-clicks/specs-after.png) |
| ![FAQ with one answer open before](screenshots/fewer-clicks/faq-before.png) | ![FAQ with all answers open after](screenshots/fewer-clicks/faq-after.png) |

Also in this pass:
- After joining, every "Join" button says "On the list". The page stores only "joined: yes" and the cookie choice, never the email address.
- The header no longer measures the page on every scroll event: an `IntersectionObserver` tells it when the hero leaves the screen.
- The fake loading time after "Join" went from 1.8 s to 0.7 s. No more dialogs: about 40 lines of code removed.
- Trade-off: the ZIP code is no longer required, so fewer people will give it, but nobody is blocked on the main path.
- While taking these screenshots, two bugs in the new confirmation were found and fixed: the form stayed visible after joining, and the text was hard to read on the orange band.

---

## 5. Where it stands

- **Works:** one design system (tokens, shadcn/ui components, Lucide icons), WCAG AA contrast and keyboard support, an interactive hero robot, six task animations with Pause, a searchable skills marketplace with quick filters, and a 2-click waitlist with errors, loading and an inline confirmation.
- **Still to do:** in the skill cards the "· installs" part can wrap onto its own line; the four extra skills are made up for the search demo; dark mode is planned but not built.
- The waitlist form is a demo: nothing is sent or saved.

## Run it locally

Plain HTML, CSS and JavaScript, with no build step. Serve either site folder with any static server, for example:

```bash
npx serve tova-m1-redesign/site-after
```

Then open the address it prints. Fonts load from Google Fonts.
