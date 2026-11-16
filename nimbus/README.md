# Nimbus — From a Broken Design System to an Editorial Redesign

A practice project for Claude skills. **Nimbus** is a fake SaaS landing page built with a design system that was **broken on purpose**. Claude skills were then applied to it one after the other, and every change was recorded with real before/after screenshots.

📄 **Full report:** [report/nimbus-report.pdf](report/nimbus-report.pdf) (41 pages, generated with the [`/doc` skill](https://github.com/fnnysimon/claude-skills/tree/main/develop/Gestion-de-projet/doc))

## Before vs After

| Before: the broken starting page | After: the current redesign |
|---|---|
| ![Broken starting page](screenshots/s0-full.png) | ![Current redesign](screenshots/fin-full.png) |

## Key numbers

| | Before | After |
|---|---|---|
| Accessibility issues on the broken page | 21 | 16 (5 critical fixed) |
| Clicks for the 4 key journeys, desktop | 12 | 8 |
| Clicks for the same journeys, mobile | 15 | 9 |
| Journeys ending on a dead link (`href="#"`) | 3 | 0 |

The "before" click counts assume the missing pages existed. In reality, three of those journeys never reached their goal.

## Timeline

| # | Skill or request | Page | What it changed |
|---|---|---|---|
| 0 | Starting point | `site/original/index.html` | A landing page with a design system broken on purpose |
| 1 | `/design:accessibility-review` | `index.html` | Audit (21 issues), then the 5 critical ones fixed |
| 2 | Request, no skill | `index.html` | Rebuilt with shadcn/ui components and Lucide icons, flaws kept for practice |
| 3 | `/frontend-design` | `redesign.html` (new) | An editorial redesign on a separate page |
| 4 | `/interaction-design` | `redesign.html` | An interaction spec, then 4 behaviour fixes |
| 5 | `/ux-superpowers` | `redesign.html` | UX discovery report and fewer clicks: no more dead ends |
| 6 | `/debatexperts` | `redesign.html` | Expert panel review, then the "assumed prototype" V2 |
| 7 | Request, no skill | `redesign.html` | Removed the duplicate "Start free" button |
| 8 | `/design-elevation` | `redesign.html` | A polish pass, plus merging the duplicate Enterprise line |

In every screenshot below, **red boxes** circle what the step changed, and their **numbers** match the bullet points.

---

### 0 · Starting point: the broken design system

- Four slightly different primary blues, irregular spacing, four fonts and six corner radii.
- Five button styles, three card styles and four badge styles, with hardcoded values and `!important` everywhere.
- Accessibility: focus outlines removed, white text on yellow, fields without labels, icon buttons with no name.
- Fake states shown permanently: an error, a success alert and a "Changes saved" toast.
- Half-finished dark mode: some headings become invisible.

![Broken page in dark mode](screenshots/s0-dark.png)

### 1 · Accessibility audit and the 5 critical fixes — `/design:accessibility-review`

1. **Visible keyboard focus:** a 3 px ring on `:focus-visible` (6.29:1).
2. **Secondary text contrast:** one token replaces five light greys. Hero text goes from 1.59:1 to 6.76:1.
3. **White on yellow:** dark text on the "Get started" button (1.53:1 → 11.58:1) and brown text on the "NEW" badge (1.25:1 → 7.28:1).
4. **Dark mode finished:** the two invisible headings (1.18:1) are readable.
5. **Form labels:** visible `<label>` and `autocomplete` on Name and Email.

| Before | After |
|---|---|
| ![](screenshots/a11y-hero-b.png) | ![](screenshots/a11y-hero-a.png) |
| ![](screenshots/a11y-dark-b.png) | ![](screenshots/a11y-dark-a.png) |
| ![](screenshots/a11y-form-b.png) | ![](screenshots/a11y-form-a.png) |

### 2 · Rebuilt with shadcn/ui and Lucide icons — request, no skill

1. **Lucide icons** replace the emoji buttons.
2. **shadcn/ui components** (Button, Badge, Card, Alert, Label, Input, Toast), hand-ported with the exact shadcn classes.
3. **Feature icons:** emoji become Lucide icons in tinted squares.

Flaws kept on purpose for practice. The 5 accessibility fixes stay in place.

| Before | After |
|---|---|
| ![](screenshots/cn-top-b.png) | ![](screenshots/cn-top-a.png) |
| ![](screenshots/cn-feat-b.png) | ![](screenshots/cn-feat-a.png) |

### 3 · An editorial redesign on a new page — `/frontend-design`

1. **Typography with character:** Fraunces and Instrument Sans, with a yellow marker stroke under *finally*.
2. **Product illustration** instead of a generic centred hero.
3. **Editorial voice:** "Vol. 4", warm paper, indigo ink, yellow used only as a highlighter.
4. **Features as numbered chapters.**
5. **Monthly/yearly billing switch**, and a newsletter form with 5 real states.

| Before | After |
|---|---|
| ![](screenshots/fd-top-b.png) | ![](screenshots/fd-top-a.png) |
| ![](screenshots/fd-price-b.png) | ![](screenshots/fd-price-a.png) |

![Features as numbered chapters](screenshots/fd-feat-a.png)

### 4 · Interaction spec and 4 behaviour fixes — `/interaction-design`

1. **Focus kept while loading:** `aria-disabled` instead of `disabled`, and a double submit is ignored.
2. **Success announced once:** the duplicate toast is removed.
3. **"Try again" in network errors**, and the typed email is kept.
- **Escape closes the mobile menu** and returns focus (keyboard behaviour, not visible in a screenshot).

| Before | After |
|---|---|
| ![](screenshots/ix-load-b.png) | ![](screenshots/ix-load-a.png) |
| ![](screenshots/ix-ok-b.png) | ![](screenshots/ix-ok-a.png) |
| ![](screenshots/ix-off-b.png) | ![](screenshots/ix-off-a.png) |

### 5 · Fewer clicks, no dead ends — `/ux-superpowers`

1. **Trial signup in the hero** instead of a link that only scrolled to pricing.
2. **"Start free" in the header on every screen**, including mobile.
3. **Pricing buttons work:** they open a trial dialog with the plan already chosen.
4. **"Contact sales" opens a dialog.**
5. **One-click newsletter after the trial.**

| Before | After |
|---|---|
| ![](screenshots/ux-top-b.png) | ![](screenshots/ux-top-a.png) |
| <img src="screenshots/ux-mob-b.png" width="300" alt=""> | <img src="screenshots/ux-mob-a.png" width="300" alt=""> |
| ![](screenshots/ux-price-b.png) | ![](screenshots/ux-dialog-a.png) |

| Contact dialog | Newsletter in one click |
|---|---|
| ![](screenshots/ux-contact-a.png) | ![](screenshots/ux-upsell-a.png) |

### 6 · Expert panel review, "assumed prototype" V2 — `/debatexperts`

1. **Exits under the hero form:** "See pricing first" and "See how it works".
2. **Explicit consent** under the one-click newsletter offer.
3. **Security line** for enterprise buyers.
4. **"Compare plans" inside the trial dialog.**
5. **Prototype tracking:** 6 events with no personal data, and a "submissions are simulated" label.

| Before | After |
|---|---|
| ![](screenshots/db-top-b.png) | ![](screenshots/db-top-a.png) |
| ![](screenshots/db-upsell-b.png) | ![](screenshots/db-upsell-a.png) |
| ![](screenshots/db-ent-b.png) | ![](screenshots/db-ent-a.png) |
| ![](screenshots/db-dlg-b.png) | ![](screenshots/db-dlg-a.png) |

![Demo panel with the last tracked event](screenshots/db-demo-a.png)

### 7 · No more duplicate "Start free" — request, no skill

1. **Only one "Start free" at a time:** the header button is hidden while the hero form is on screen.
2. **It fades back in** once you scroll past the hero.

| Before | After | After, scrolled |
|---|---|---|
| ![](screenshots/hd-top-b.png) | ![](screenshots/hd-top-a.png) | ![](screenshots/hd-scroll-a.png) |

### 8 · Polish pass — `/design-elevation`

1. **Balanced headline:** no lonely word on the last line.
2. **Real shadows in dark mode** instead of a pale glow.
3. **Readable highlight in dark mode:** ink on yellow.
4. **Aligned pricing columns.**
5. **Enterprise duplicate merged** into one list with shield icons.

| Before | After |
|---|---|
| ![](screenshots/el-dark-b.png) | ![](screenshots/el-dark-a.png) |
| ![](screenshots/el-price-b.png) | ![](screenshots/el-price-a.png) |
| ![](screenshots/el-merge-b.png) | ![](screenshots/el-merge-a.png) |

---

## How the report was made: the `/doc` skill

The report and every screenshot in this README were produced with **`/doc`**, a custom Claude skill created during this project. Source: [claude-skills/develop/Gestion-de-projet/doc](https://github.com/fnnysimon/claude-skills/tree/main/develop/Gestion-de-projet/doc).

### What it does

`/doc` turns a series of Claude skill runs into one exportable report: one section per skill, numbered bullet points, and **real before/after screenshots** where each change is **circled in red with the number of its bullet point**. The output is a self-contained HTML file and an A4 PDF.

### How it works

```mermaid
flowchart LR
    H[Conversation + file history] --> T[Timeline of skills]
    T --> V[Saved version after each step]
    V --> S[shots.js: views, states, red boxes]
    S --> C[Headless Chrome screenshots]
    C --> R[Report: bullets + before/after]
    R --> E[HTML + PDF]
```

1. **Timeline:** every skill or request in order, with the user's own words and the changes made.
2. **Versions:** each file as it was after each step, recovered from Claude Code's file history (`~/.claude/file-history/`), git or backups, into a scratch folder. The project itself is never modified.
3. **Shot plan (`shots.js`):** for each step, 1 to 3 before/after views with the same scroll position. Setup code reaches states that only exist after an action: focus, loading, offline, success, open dialogs, dark mode, mobile.
4. **Capture:** a small harness (`annot.html`) loads each version in a fixed-size iframe, runs the setup, freezes timers, and draws numbered red boxes around CSS selectors. Headless Chrome takes the screenshot.
5. **Check:** every screenshot is reviewed, and retaken if a box is misplaced.
6. **Report:** cover, at-a-glance table, key numbers, one section per step, final state.
7. **Export:** `build.ps1` embeds the images as base64 and prints the PDF with headless Chrome.

### Example shot definition

```js
// One before/after pair from step 4: the button keeps keyboard focus while loading
'ix-load-b': { src: 'r1/redesign.html', scroll: '#letter', offset: 140,
               run: async (d) => { d.getElementById('email').value = 'alex@nimbus.dev';
                                   const b = d.getElementById('submit'); b.focus(); b.click(); await wait(600); },
               after: 50, boxes: [{ sel: '#submit', n: 1, pad: 10 }] },
'ix-load-a': { src: 'r2/redesign.html', /* same setup on the next version */ },
```

The complete shot list for this project (51 screenshots) is in the skill's [example/shots.js](https://github.com/fnnysimon/claude-skills/blob/main/develop/Gestion-de-projet/doc/example/shots.js).

### Lessons from building it

- **Freeze the page after drawing the boxes.** Timed states (loading spinners, auto-dismissed toasts) kept moving on before the screenshot was taken.
- **Use a fixed-size iframe.** Elements anchored to the bottom or centred moved between measuring and capturing when the window size changed.
- **Shoot taller, then crop.** Headless Chrome didn't repaint the bottom ~90 px of the window after resizing it.
- **Shrink boxes to what changed:** to the text for labels, and to the children for wide containers.

## Run the site

No build step and nothing to install (Tailwind and Lucide load from a CDN).

```bash
powershell -ExecutionPolicy Bypass -File serve.ps1
```

Then open:

- http://localhost:4321/original/index.html: the broken starting page, untouched
- http://localhost:4321/index.html: the broken page after steps 1 and 2 (still broken on purpose)
- http://localhost:4321/redesign.html: the current redesign

## Files

| Path | What it is |
|---|---|
| [site/original/](site/original/) | The starting page, broken on purpose, with its plain CSS |
| [site/index.html](site/index.html) | The shadcn/ui version, still broken on purpose for practice |
| [site/redesign.html](site/redesign.html) | The editorial redesign after all the steps |
| [report/nimbus-report.pdf](report/nimbus-report.pdf) | The full before/after report |
| [screenshots/](screenshots/) | All before/after screenshots (`-b` = before, `-a` = after) |
| [PRACTICE.md](PRACTICE.md) | How to practise Claude skills on the broken page |
| [ANSWERS.md](ANSWERS.md) | Answer key: every planted flaw |
| [serve.ps1](serve.ps1) | Tiny static server with live reload (PowerShell, no Node or Python) |
