# Interaction Spec: Booking flow (`/book`)

Skill: `/interaction-design` · Site version reviewed: v3
**Why this flow:** it's the one conversion on the site. The UX discovery (`docs/04`) marked "Book" as a moment that matters (journey stage 8).

## What it does today (observed on v3, 375px and desktop)

| # | Behavior today | Problem |
|---|---|---|
| T1 | Empty submit on step 1 shows the browser's native bubble, in the **browser's language** ("Veuillez renseigner ce champ.") | The message language doesn't match the page. Only one error shows at a time, it disappears on its own, and it's styled by the browser. |
| T2 | Only the email is checked. **"Store website" is marked `required` but an empty value passes** to step 2 | A rule that doesn't apply. The team receives incomplete leads. |
| T3 | Moving to step 2 or 3 sends **focus to `<body>`** | Keyboard and screen-reader users lose their place. Nothing is announced. |
| T4 | "Confirm" with no slot selected **does nothing**: no message, no visual change | The system looks broken (no visibility of status). |
| T5 | No way back from step 2 to step 1 | The user can't fix a typo without reloading, and reloading **loses everything typed**. |
| T6 | No step indicator. The user doesn't know a calendar step is coming, or how many steps there are | Uncertainty about effort ("takes a minute" isn't backed up). |
| T7 | Slots are plain buttons. The selection is shown by colour only, with no `aria-pressed`. **No time zone is shown** | Selection state is invisible to assistive tech. "Mon 10:00" is ambiguous across time zones. |
| T8 | Revenue and ad spend are asked with no reason given | Friction for small brands (insight 8 in `docs/04`). |
| T9 | Confirmation says "You're booked ✓" with **no summary** of the time picked, and focus goes to `<body>` | No proof of what was booked, and no next step besides a case-study link. |
| T10 | No `autocomplete` on the inputs, and the site field is `type="text"` | Slower typing on phones, no autofill. |
| T11 | No loading state. Steps switch instantly because nothing is sent (demo) | A real booking calls a calendar API that takes 1–10 s. Today there's nothing to show during that wait. |

## Goal and context

- **User goal:** book a 15-minute call with as little effort and doubt as possible. Main persona: Dana, owner-operator, often on a **phone**, low attention, between other tasks [A, from `docs/04`].
- **Business goal:** a **qualified** booking (with revenue band) that the person actually turns up to.
- **The single most important outcome:** the user leaves **knowing exactly when the call is**, and the team knows which store it's for.

## Microinteraction map

| Part | Spec |
|---|---|
| **Trigger** | User: any "Book a call" CTA, which goes to `/book`. Optional deep link `/book#form` focuses the first field. |
| **Rules** | 1. **Step 1 · Your brand:** email (required), store website (required), revenue band (required, preselected "Under $1M"? **To decide**), ad spend (optional). 2. **Step 2 · Pick a time:** a slot is required. Slots are in the visitor's time zone. 3. **Submit:** create the booking, then step 3 confirmation. 4. Going back to step 1 keeps everything entered. 5. The draft is kept in `sessionStorage` until confirmed, so a refresh doesn't lose it. |
| **Feedback** | A step indicator ("Step 1 of 2"). Inline validation messages under each field. A selected slot shows a check plus text. The submit button shows a loading state. The confirmation repeats the date, time and time zone, and offers "Add to calendar". |
| **Loops and modes** | Slot list: if the chosen slot gets taken during submit, return to step 2 with that slot marked "Just taken" and the user's other data intact. Draft expires with the session. A slow request switches to "Still working…" after 4 s (see Timing). |

## States

| Element / state | What the user sees | What they can do |
|---|---|---|
| **Step indicator** | "Step 1 of 2 · Your brand" / "Step 2 of 2 · Pick a time". The confirmation replaces it. | Read it only (not clickable, to avoid skipping validation) |
| **Field: default** | Label above, hint below where useful (store website: "e.g. yourbrand.com"; revenue: "So we come prepared with your numbers") | Type, select |
| **Field: focus** | 3px copper focus ring (`--focus`) | Type |
| **Field: invalid** (after blur or submit) | Red-brown border (`--bad`), ⚠ icon + message under the field, linked with `aria-describedby` | Fix it. The message clears as soon as the value is valid. |
| **Field: valid** | Back to default. No green tick (avoids noise on short forms). | — |
| **Continue (step 1)** | Always enabled, never disabled | Submit: if invalid, show all errors and move focus to the **first** invalid field |
| **Slot: default** | Day + time, e.g. "Mon 18 Nov · 10:00" | Select |
| **Slot: hover / focus** | Border `--ink`, focus ring | Select |
| **Slot: selected** | Filled `--ink`, ✓ before the time, `aria-pressed="true"` | Change selection (single choice) |
| **Slot: taken** (after a conflict) | Struck through, "Just taken", `disabled` | Pick another |
| **Slots: empty** (none in the next 7 days) | "No times left this week." + "Email us instead" link | Email, or "Show next week" (**To decide**) |
| **Slots: loading** | 6 skeleton tiles (static grey, no shimmer when reduced motion is on) | Wait. "Back" still works. |
| **Slots: offline / load error** | "We couldn't load times. Check your connection." + **Retry** | Retry, Back |
| **Back (step 2)** | Text button "← Back", left of Confirm | Return to step 1 with every value kept |
| **Confirm: default** | "Confirm Mon 18 Nov, 10:00" (the label includes the chosen slot) | Submit |
| **Confirm: loading** | Spinner + "Booking…", button keeps its width, `aria-busy="true"` | Wait. Inputs locked (not cleared). |
| **Confirm: slow** (> 4 s) | Text changes to "Still working, this can take a few seconds…" | Wait, or leave: the booking isn't lost if the request succeeds |
| **Confirm: error** | Message above the button: what happened + what to do. The selected slot is kept. | Retry (one tap), or pick another slot |
| **Success** | "You're booked for **Mon 18 Nov, 10:00 (Europe/Paris)**", "A calendar invite is on its way to you@brand.com", then **Add to calendar** (.ics) + "What to have ready: access to your Shopify and ad accounts" + "See a real report while you wait" | Add to calendar, read the case study, go home |

## Timing

| Event | Delay | Reason |
|---|---|---|
| Inline validation | On **blur**, then live on input once a field has been flagged | Don't scold people while they're typing (no errors before blur). Clear errors instantly once fixed (< 0.1 s feels like the fix worked). |
| Store website format check | Debounced **300 ms** after typing stops, after the first blur | Under the ~400 ms Doherty threshold, and long enough not to fire on every keystroke |
| Step change (1 → 2) | Instant (< 100 ms), no artificial delay | Local action: anything slower feels laggy |
| Slots loading | Show skeleton only if loading takes > **300 ms** | Avoids a flash of skeleton on fast connections |
| Booking submit | Spinner right away. "Still working…" at **4 s**. Timeout and error at **15 s** | 1–10 s range: needs progress. Over 10 s: the user needs to know they can retry. 15 s leaves margin over typical calendar APIs [A]. |
| Error message | Stays until fixed. **Never auto-dismissed** | Errors must not vanish before they're read |
| Draft saved | On every field change (no indicator) | Silent safety net. No "saved" toast, which would be noise on a 4-field form. |
| Success | No auto-redirect | The user must be able to read and copy the time |

## Motion

| Element | Trigger | Change | Duration | Easing | Purpose |
|---|---|---|---|---|---|
| Step panel | Continue / Back | Outgoing fades out. Incoming fades in + slides 12px **in the direction of travel** (→ forward, ← back) | 200 ms | `ease-out` | Orient: shows forward vs back movement |
| Form height | Step change | Height animates between steps | 200 ms | `ease-out` | Avoids the page jumping on mobile when step 2 is shorter |
| Field error | Becomes invalid | Message fades in, 4px down | 150 ms | `ease-out` | Feedback that's noticeable without alarming. **No shake** (shake reads as punishment and is hard on vestibular disorders). |
| Slot select | Click / Enter / Space | Fill colour + ✓ appear | 120 ms | `ease-out` | Instant confirmation of the choice |
| Confirm loading | Submit | Label crossfades to spinner + "Booking…" | 150 ms | linear | Status visibility |
| Success | Booking confirmed | ✓ circle scales 0.9 → 1, text fades in | 250 ms | `cubic-bezier(.2,.8,.2,1)` | Marks completion: the one moment that deserves emphasis |
| **Reduced motion** | `prefers-reduced-motion: reduce` | No slides or scales. Instant swaps or plain opacity changes ≤ 100 ms. The spinner becomes static "Booking…" text. | — | — | No essential information is carried by motion alone |

## Errors and recovery

**Prevent first**
- `type="email"` + `autocomplete="email"` + `inputmode="email"`.
- Store website: `type="url"`-style tolerance. Accept "brand.com" without `https://` and add it silently.
- Revenue as a band (`<select>`), never a free number.
- Only offer slots that exist, in the visitor's time zone, with the zone written next to the list.
- No confirmation dialog: booking a call isn't destructive. It can be rescheduled from the invite (**To decide** with the real calendar tool).

**Messages:** what happened + how to fix it, in the page language.

| Case | Message |
|---|---|
| Email empty | "Enter your work email so we can send the invite." |
| Email invalid | "This doesn't look like an email. Check for a missing @ or dot." |
| Store website empty | "Add your store's website. We look at it before the call." |
| Store website unreadable | "We couldn't read this address. Try the format yourbrand.com." |
| No slot picked | "Pick a time to continue." (shown above the slots, focus moves to the first slot) |
| Slot taken during submit | "Someone just took Mon 10:00. Here are the times still free." (back to step 2, everything else kept) |
| Network / server error | "We couldn't book the call. Nothing was lost. Try again." + Retry |
| Timeout (15 s) | "This is taking too long. Your details are saved. Try again, or email hello@…" |

**Recovery**
- One-step retry, and input is never cleared.
- Back keeps all values. Refresh restores the draft from `sessionStorage`.
- Use **native validation off** (`novalidate`, already set) with custom messages, so language and styling match the page. T1 today shows the native bubble because `reportValidity()` is called.

## Principles check

| Principle | Status | Note |
|---|---|---|
| Visibility of system status | ❌ → ✅ | Today: silent no-op on Confirm (T4), no steps (T6), no loading state (T11). Spec: step indicator, inline errors, loading/slow/error states. |
| Match with the real world | ⚠️ → ✅ | Today: slots without a date or time zone (T7). Spec: "Mon 18 Nov · 10:00", zone shown, confirm label repeats the slot. |
| User control and freedom | ❌ → ✅ | Today: no Back, refresh loses data (T5). Spec: Back + draft restore. |
| Consistency and standards | ⚠️ → ✅ | Today: browser bubbles in another language (T1). Spec: one error pattern, page language. |
| Error prevention and recovery | ❌ → ✅ | Today: required site field not enforced (T2). Spec: real rules, tolerant URL input, one-step retry. |
| Fitts's law | ✅ | Buttons and slots are already ≥ 48px and full-width on mobile. Keep Confirm in the thumb zone (bottom of step 2). |
| Hick's law | ✅ / ⚠️ | 4 fields, 6 slots: fine. Keep slots to **6–9 options** with no long dropdown. Revenue has 3 options. |
| Doherty threshold | ✅ | Local steps < 100 ms. The debounce (300 ms) and skeleton delay (300 ms) stay under ~400 ms. |

## Accessibility

- **Keyboard:** natural tab order (fields → Continue; slots → Back → Confirm). The slots work as a toggle group: Tab moves between slots, Enter/Space selects. Enter in any step-1 field submits the step.
- **Focus management:**
  - Step change: focus moves to the **step heading** (`tabindex="-1"`), so screen readers read "Step 2 of 2, Pick a time".
  - Validation failure: focus moves to the first invalid field.
  - Success: focus moves to the confirmation heading.
- **Announcements:** one polite `aria-live` region for "Booking…", errors from the server, and "Slot just taken". Field errors use `aria-invalid` + `aria-describedby` and are **not** also put in the live region (announce once).
- **State:** slots have `aria-pressed`, the busy button has `aria-busy`, taken slots are `disabled` and say "taken" in text.
- **Targets:** inputs, slots and buttons ≥ 48px (already true). Back ≥ 44px.
- **Motion:** see the reduced-motion row. The spinner is never the only signal; the "Booking…" text is always present.
- **Colour:** the selected slot shows a ✓ as well as the fill. Errors show an icon + text as well as the border colour.

## Open questions (To decide)

- Which calendar tool books the call (Cal.com, HubSpot, Calendly…)? Its API decides the real slot loading, conflict handling and reschedule links.
- Is revenue band required, or optional with "Prefer not to say"? (`docs/04`, insight 8)
- Should a preselected revenue band be the default? It's faster, but it biases the data.
- What happens when there are no slots in the next 7 days: next week, a waitlist, or email?
- Should ad spend stay on the form at all, or be asked on the call?
- Should the confirmation also offer the "free leak scan" (insight 3) once it exists?
