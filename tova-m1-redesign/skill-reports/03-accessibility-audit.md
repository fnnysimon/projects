## Accessibility Audit: Tova M1 landing page
**Standard:** WCAG 2.1 AA | **Date:** 2026-11-12

Tested on http://localhost:4322, after the critique and design-system fixes.
- **Method:** DOM scan, computed contrast ratios, real keyboard Tab presses at 1440px, programmatic Escape and focus checks on the modal, and a reflow test at 320px (equivalent to 400% zoom on a 1280px screen).
- **Not covered:** no screen reader was run. The "Screen reader" section is inferred from the markup.

### Summary
**Issues found:** 30 | **Critical:** 10 | **Major:** 14 | **Minor:** 6

What already passes, thanks to earlier fixes:
- the page reflows at 320px with no horizontal scroll (1.4.10);
- the neutral text tokens are ≥ 4.5:1;
- buttons have a focus ring;
- errors are described in words, not only in colour;
- the compare table's ✓/✗ colours pass 4.5:1.

### Findings

#### Perceivable
| # | Issue | WCAG Criterion | Severity | Recommendation |
|---|-------|---------------|----------|----------------|
| 1 | Hero robot and task-stage `<img>` have no `alt` attribute, so screen readers read the file name "tova-m1.svg" | 1.1.1 Non-text Content | 🔴 Critical | Hero: `alt="Tova M1, a two-armed home robot on a wheeled base"`. Task stage: an alt that follows the caption, updated by the script. |
| 2 | "Folding clothes" swaps the task image to `img/tasks/laundry.webp`, which returns 404 (broken image icon) | 1.1.1 Non-text Content | 🟡 Major | Add the asset or point to the existing illustration. |
| 3 | White hero title on the olive gradient: 3.4:1 on the mid tone, **2.0:1** on the light centre behind the text | 1.4.3 Contrast | 🔴 Critical | Darken the gradient behind the text (a left-to-right scrim), or switch the hero text to ink. |
| 4 | Hero subtitle `#EEF0DC` (22px, weight 300): 2.9:1 on olive, **1.8:1** on the light centre. Eyebrow `#C9CBB3`: 2.0:1. "Scroll" hint: ~1.6:1 | 1.4.3 Contrast | 🔴 Critical | Same fix as #3, and raise the subtitle weight to 400+. |
| 5 | The whole orange order band fails: white text on `#FF6B2C` 2.8:1 (incl. the `$1,690` label and note), `#FFE1D3` note 2.3:1, `#FFC2A6` fine print 1.8:1. The orange badge in the hero is also 2.8:1 | 1.4.3 Contrast | 🔴 Critical | Make the band ink with orange accents, or use orange-700 (`#B8400F`, about 5.6:1 with white) as the band colour. |
| 6 | Form fields on the band: placeholder 1.6:1, typed text white on `#FF7D45` 2.5:1 | 1.4.3 Contrast | 🔴 Critical | White inputs with ink text on the band. |
| 7 | Input border vs band 1.4:1, field vs band 1.1:1. The error border (`--color-danger`) on orange is 1.9:1, so an invalid field is almost invisible | 1.4.11 Non-text Contrast | 🟡 Major | White fields solve this. Add an error icon + text under the field. |
| 8 | Secondary button border `#ECE8DD` on white: 1.2:1, so "Contact us" and "reject" have no visible edge on white backgrounds | 1.4.11 Non-text Contrast | 🟡 Major | Use a ≥ 3:1 border (e.g. `--tova-stone-600`) for `--color-border-control`. |
| 9 | Orange focus ring on cream: 2.7:1. On the orange band: **1.0:1**, so the focused "Reserve" button is invisible to keyboard users | 1.4.11 Non-text Contrast | 🟡 Major | Ink focus ring (`--color-focus: ink`), with a white inner ring on dark surfaces. |
| 10 | Section titles, task list, FAQ questions and the compare header are `<div>`s. The only headings are one `<h1>` and seven `<h4>`s (skipping h2–h3) | 1.3.1 Info and Relationships | 🟡 Major | Section titles → `<h2>`, spec titles → `<h3>`, FAQ questions → buttons inside `<h3>`. |
| 11 | No landmarks: header, nav, main and footer are `<div>`s | 1.3.1 Info and Relationships | 🟡 Major | `<header>`, `<nav aria-label="Main">`, `<main id="main">`, `<footer>`. |
| 12 | Inputs have placeholders only, no `<label>` | 1.3.1 / 3.3.2 Labels | 🔴 Critical | Visible `<label for>`, plus `autocomplete="email"` / `"postal-code"` (1.3.5). |
| 13 | Compare table: no `<th>`, `scope` or `<caption>`. The ✓/✗ symbols are read as "check mark" / "multiplication x" | 1.3.1 Info and Relationships | 🟢 Minor | Header row in `<th scope="col">`, row labels in `<th scope="row">`, and visually hidden "Yes"/"No" text. |
| 14 | Floating robot animation (infinite) and the carousel progress bar ignore `prefers-reduced-motion` | 2.3.3 (AAA) / best practice | 🟢 Minor | `@media (prefers-reduced-motion: reduce) { animation: none; scroll-behavior: auto }`. |

#### Operable
| # | Issue | WCAG Criterion | Severity | Recommendation |
|---|-------|---------------|----------|----------------|
| 15 | `* { outline: none }` removes focus from everything except `.btn`. Tested with Tab: logo, nav links, cart icon, the "see all skills" link, the inputs and the footer links all show **no focus indicator** | 2.4.7 Focus Visible | 🔴 Critical | Delete the global rule and add one `:focus-visible` style for all interactive elements. |
| 16 | Task items (6) and FAQ questions (5) are clickable `<div>`s with `tabindex=-1`: impossible to reach or operate with a keyboard | 2.1.1 Keyboard | 🔴 Critical | Tasks: a tablist (`role="tab"` buttons, arrow keys). FAQ: `<button aria-expanded aria-controls>`. |
| 17 | Spec "i" tooltips open on mouse hover only: unreachable by keyboard and touch, and they disappear when the pointer moves onto them | 2.1.1 / 1.4.13 Content on Hover | 🟡 Major | Make "i" a button that toggles the tooltip, or show the explanation inline. |
| 18 | The task carousel auto-advances every 3 s, can't be paused, and keeps going while you read | 2.2.2 Pause, Stop, Hide | 🟡 Major | Add a pause button, stop on hover/focus, or advance only on user action. |
| 19 | Modal: focus isn't moved into it, isn't trapped, and isn't returned. **Escape doesn't close it.** The close "x" is a `<span>` (not focusable) | 2.1.2 / 2.4.3 Focus Order | 🔴 Critical | Use `<dialog>` with `showModal()` (free focus trap and Escape), and a real `<button aria-label="Close">`. |
| 20 | No skip link: keyboard users tab through 8 header items before the content | 2.4.1 Bypass Blocks | 🟡 Major | `<a class="skip-link" href="#main">Skip to content</a>`, visible on focus. |
| 21 | The fixed header covers section titles after nav jumps (no `scroll-margin-top`), and can hide focused elements while tabbing up | 2.4.3 / 2.4.11 (2.2) | 🟡 Major | `section { scroll-margin-top: 88px }`. |
| 22 | Generic or empty link names: "click here to see all skills" → `#`, "hello@" → empty `mailto:`, and "Privacy", "Terms", "Careers" → `#` | 2.4.4 Link Purpose | 🟢 Minor | Descriptive text ("Browse all skills") and real destinations, or remove them. |
| 23 | Page `<title>` is just "Tova" | 2.4.2 Page Titled | 🟢 Minor | "Tova M1: the $1,690 home robot · Tova Robotics". |
| 24 | Small targets: cart button 22×22px, spec "i" 16×16px (both under the 24px minimum). Footer links are 16px tall and FAQ rows 26px | 2.5.5 (AAA, 44px) · 2.5.8 (2.2 AA, 24px) | 🟡 Major | Cart and "i" at least 44×44px hit area. Pad footer links and FAQ buttons. |
| 25 | At 320px the fixed header (75px) and cookie banner (139px) cover a third of the screen, and the header button wraps onto two lines | 1.4.10 Reflow | 🟢 Minor | Shorter header label on small screens ("Reserve"). Compact cookie banner. |

#### Understandable
| # | Issue | WCAG Criterion | Severity | Recommendation |
|---|-------|---------------|----------|----------------|
| 26 | No `lang` on `<html>`, so screen readers may pronounce the page in the wrong language | 3.1.1 Language of Page | 🔴 Critical | `<html lang="en">`. |
| 27 | The error message isn't tied to its fields: no `aria-invalid`, no `aria-describedby`, and one combined message for both fields | 3.3.1 Error Identification | 🟡 Major | One message per field, linked with `aria-describedby`, `aria-invalid="true"`, and focus moved to the first invalid field. |
| 28 | "US only" and the 5-digit ZIP format are only in the fine print under the button, at 1.8:1 contrast | 3.3.2 Labels or Instructions | 🟢 Minor | Put the hint under the ZIP label: "5-digit US ZIP code". |

#### Robust
| # | Issue | WCAG Criterion | Severity | Recommendation |
|---|-------|---------------|----------|----------------|
| 29 | The cart icon button has no accessible name (announced as "button") | 4.1.2 Name, Role, Value | 🟡 Major | `aria-label="Cart"`, and `aria-hidden="true"` on the SVG. |
| 30 | Status changes aren't announced: the form error, the "Reserving…" state and the task caption changes have no live region | 4.1.3 Status Messages | 🟡 Major | `role="alert"` on `.form-msg`, `aria-live="polite"` on the task caption (only when the user changes it), `aria-busy` on the button. |

### Color Contrast Check
| Element | Foreground | Background | Ratio | Required | Pass? |
|---------|-----------|------------|-------|----------|-------|
| Body text | `#17161C` | `#FAF8F2` | 16.9:1 | 4.5:1 | ✅ |
| Secondary text (subtitles, FAQ answers) | `#5F5C54` | `#FAF8F2` | 6.3:1 | 4.5:1 | ✅ |
| Muted text (labels, nav, footer) | `#6B685F` | `#FAF8F2` / `#F1EDE2` | 5.2:1 / 4.8:1 | 4.5:1 | ✅ |
| Muted text on dark sections | `#9A98A1` | `#17161C` / `#232129` | 6.3:1 / 5.6:1 | 4.5:1 | ✅ |
| Skill price (orange on dark card) | `#FF6B2C` | `#232129` | 5.6:1 | 4.5:1 | ✅ |
| Lime badge | `#3F4A1A` | `#C8F169` | 7.4:1 | 4.5:1 | ✅ |
| Compare ✓ / ✗ | `#1A7A43` / `#C4321F` | `#FAF8F2` | 5.1:1 / 5.2:1 | 3:1 (graphic) | ✅ |
| Hero title (104px) | `#FFFFFF` | `#8A8F6A` → `#B5B994` | 3.4:1 → 2.0:1 | 3:1 (large) | ❌ |
| Hero subtitle (22px light) | `#EEF0DC` | `#8A8F6A` → `#B5B994` | 2.9:1 → 1.8:1 | 4.5:1 | ❌ |
| Hero eyebrow | `#C9CBB3` | `#8A8F6A` | 2.0:1 | 4.5:1 | ❌ |
| Orange badge, order band text | `#FFFFFF` | `#FF6B2C` | 2.8:1 | 4.5:1 | ❌ |
| Order note | `#FFE1D3` | `#FF6B2C` | 2.3:1 | 4.5:1 | ❌ |
| Order fine print | `#FFC2A6` | `#FF6B2C` | 1.8:1 | 4.5:1 | ❌ |
| Input text / placeholder | `#FFFFFF` / `#FFC2A6` | `#FF7D45` | 2.5:1 / 1.6:1 | 4.5:1 | ❌ |
| Input border | `#FF9A6E` | `#FF6B2C` | 1.4:1 | 3:1 | ❌ |
| Secondary button border | `#ECE8DD` | `#FFFFFF` | 1.2:1 | 3:1 | ❌ |
| Focus ring on cream / on orange | `#FF6B2C` | `#FAF8F2` / `#FF6B2C` | 2.7:1 / 1.0:1 | 3:1 | ❌ |

### Keyboard Navigation
| Element | Tab Order | Enter/Space | Escape | Arrow Keys |
|---------|-----------|-------------|--------|------------|
| Logo, nav links | 1–5 ✅ logical | Navigates ✅ | — | — |
| Cart icon | 6 ✅ | Opens modal ✅ | ❌ doesn't close it | — |
| Header buttons | 7–8 ✅, focus ring visible ✅ | ✅ | — | — |
| Hero "Reserve" | 9 ✅ | Scrolls and focuses email ✅ | — | — |
| Task list | ❌ skipped | ❌ | — | ❌ |
| "See all skills" link | ✅ (no focus style) | Goes to `#` ❌ | — | — |
| Spec "i" tooltips | ❌ skipped | ❌ | — | — |
| FAQ questions | ❌ skipped | ❌ | — | — |
| Email, ZIP, Reserve | ✅ (inputs have no focus style) | Submits ✅ | — | — |
| Modal | ❌ focus stays behind it | — | ❌ | — |
| Footer links | ✅ (no focus style) | Go to `#` ❌ | — | — |
| Cookie buttons | ✅ **last** in tab order, though the banner covers the page first | ✅ | — | — |

### Screen Reader
Inferred from the markup, not tested with VoiceOver or NVDA.

| Element | Announced As | Issue |
|---------|-------------|-------|
| Hero image | "tova-m1.svg, image" | No alt |
| Cart icon | "button" | No name |
| Section titles | Plain text | Not headings, so heading navigation finds only "TOVA M1" and seven h4s |
| Task items | Plain text, or nothing | Not interactive, and the active state isn't conveyed |
| FAQ questions | Plain text | Not buttons, and the expanded/collapsed state isn't conveyed |
| Email / ZIP | "edit text" (placeholder may be read) | No label |
| Form error | Nothing | Not a live region |
| Modal | Nothing on open | No dialog role, focus not moved |
| Compare cells | "check mark", "multiplication x" | Symbols, not words, and no headers |
| Cookie banner | Read last | Appears first visually but is at the end of the DOM |

### Priority Fixes
1. **Keyboard access and focus:** remove `* { outline: none }`, add one ink `:focus-visible` ring, turn the tasks into a tablist, the FAQ into buttons, and the modal into a `<dialog>` that Escape closes. This affects keyboard and switch users, who today can't use the carousel, FAQ or modal and can't see where they are.
2. **Label the form and fix the order band:** visible labels, autocomplete, and per-field errors with `aria-describedby` and `role="alert"`. White inputs with ink text, and either an ink band or orange-700. This is the conversion point, and today it's the least readable part of the page for low-vision users.
3. **Semantics and names:** `lang="en"`, landmarks + skip link, a real heading outline (h2/h3), alt text on the robot, an accessible name for the cart button, and a better `<title>`. This affects screen-reader users, who today get one heading, no landmarks and "button".
4. **Hero contrast:** a dark scrim behind the hero text, or ink text. This affects everyone in bright light and low-vision users, on the very first screen.
5. **Motion and timing:** a pause control on the carousel, and `prefers-reduced-motion` for the float and progress bar. This helps people with vestibular or attention disorders.
