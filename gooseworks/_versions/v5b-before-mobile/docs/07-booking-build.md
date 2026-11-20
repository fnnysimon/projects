# v4 — Booking flow built from the interaction spec

Source: `/interaction-design` (spec: `docs/06-interaction-spec-booking.md`)
Before: `_versions/v3-ux/pages/book.html` · After: `pages/book.html` + `assets/booking.js` + the booking block at the end of `assets/styles.css`.

## Problems fixed (T-numbers from the spec)

| # | Before | After (verified in the browser) |
|---|---|---|
| T1 | Native browser bubble, in the browser's language | Custom inline messages in English under each field. All errors show at once, and focus goes to the first invalid field. |
| T2 | Empty "Store website" was accepted | Required and checked. `https://www.Braxley.com/` is tidied to `Braxley.com`. |
| T3 | Focus fell to `<body>` on step change | Focus moves to the step heading ("Pick a time", "You're booked"), and to "Book a 15-minute call" on Back. |
| T4 | Confirm with no slot did nothing | "Pick a time to continue." and focus moves to the first slot |
| T5 | No Back, and refresh lost everything | Back keeps every value. The draft is restored after a refresh (`sessionStorage`). |
| T6 | No step indicator | "Step 1 of 2 · Your brand" / "Step 2 of 2 · Pick a time" |
| T7 | Selection shown by colour only, no time zone | ✓ + fill + `aria-pressed`. Slots show date and time, and the zone is written out ("Times in Europe/Paris"). |
| T8 | Revenue asked with no reason | Hint: "So we come prepared with your numbers." Ad spend is marked optional ("Prefer not to say"). |
| T9 | No summary on confirmation | "For Wed 18 Nov, 14:30 (Europe/Paris)", invite email, **Add to calendar** (.ics), "What to have ready", link to the real report |
| T10 | No autocomplete | `autocomplete="email"`/`"url"`, `inputmode`, no autocapitalise on the URL |
| T11 | No loading state | Skeleton slots (only if loading takes > 300 ms). "Booking…" with spinner and `aria-busy`. "Still working…" at 4 s. Error at 15 s. Retry in one tap. |

## Demo states

The booking API is simulated (nothing is sent). Add a parameter to the URL to see each state:

| URL | State shown |
|---|---|
| `/pages/book.html` | Normal path, booking takes ~1.2 s |
| `?demo=slow` | Booking takes 6 s, so the "Still working…" note appears at 4 s |
| `?demo=error` | Network error: message + "Try again: <slot>". The slot and data are kept. |
| `?demo=taken` | Chosen slot "Just taken" (struck through, disabled). Pick another and it succeeds. |
| `?demo=empty` | "No times left this week." + "Email us instead" |
| `?demo=offline` | "We couldn't load times." + Retry, which then works |

All 6 were run end to end in the browser.

## Accessibility and motion
- A single polite live region announces "Booking your call…", "Still working.", server errors, and "You're booked for…". Field errors use `aria-invalid` + `aria-describedby` only, so each is announced once.
- Error colour `--bad` is 5.6:1 on white and 4.9:1 on the error background. Errors always have ⚠ + text, never colour alone.
- Every input, slot and button in the form is ≥ 44px high (measured on mobile: 0 under 44px).
- Motion:
  - 200 ms directional slide between steps, plus a height ease;
  - 150 ms fade-in for errors (no shake);
  - 120 ms slot selection;
  - 250 ms success tick.
- With `prefers-reduced-motion`, every slide, scale and shimmer is removed, and the spinner is hidden so "Booking…" text alone carries the state.

## Side fix
- Global rule `[hidden] { display: none !important; }`. Component `display` rules were overriding the `hidden` attribute: empty error boxes and the success tick were showing under step 2. I checked the landing tabs and the skills filter after the fix.

## Still To decide (from the spec)
- The real calendar tool and its API (real slots, conflicts, reschedule link in the invite).
- Revenue band: required today with no preselection, to avoid biased data. "Prefer not to say" is still open.
- What to offer when there are no slots: next week, a waitlist, or email (today: email).
