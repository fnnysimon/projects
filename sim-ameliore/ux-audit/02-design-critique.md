# Design Critique: Sim workflow editor, Agent block and run error (Free plan)

> Unofficial critique, not affiliated with Sim Studio. Based on sim.ai at 1280×800, dark theme, 25 Nov 2026 ([screenshots](screenshots/)), and on the first version of improvement 1 in this folder (model picker badge + "Add API key" toast). Stage: refinement of a live product.

### Overall Impression

The editor is calm and well structured: canvas in the middle, block settings on the right, logs at the bottom. The weak spot is the moment a run fails: the cause is clipped, low-contrast and far from the field that fixes it, and the one button offered leads to a paywall. Improvement 1 fixes the button and the picker, but two details in it need another pass: its badge colour clashes with Sim's "legacy" badge, and its longer message makes the clipping worse.

### Usability

| Finding | Severity | Recommendation |
|---|---|---|
| The toast clips the error to 3 lines, cutting off the fix ("…add your own API key under Settings >") ([09](screenshots/09-cheapest-model-error.jpg)) | 🔴 Critical | Give the toast a short description of its own ("Needs your own API key on the Free plan.") and let the button carry the fix. Keep the full sentence in Logs. |
| The fix lives in Settings, two screens away from the Model field that caused the error | 🔴 Critical | Fix in place: the Agent block already has an "Enter your API key" field, but it only appears for unknown models ([08](screenshots/08-model-search-appends.jpg)). Show it for hosted models on the Free plan. The server already accepts a key from that field (`resolveHostedModelKey` uses `userProvidedKey`). |
| The failed block looks exactly like a healthy one on the canvas; only the log row turns red | 🟡 Moderate | Give the block an error outline and a short status ("Needs API key") until the next run. |
| Typing in the Model search writes straight into the block ("claude-sonnet-5-5nano" appears on the canvas while you type) | 🟡 Moderate | Fixed in improvement 1 (the text is selected on focus, so a search replaces the value). The value still saves on every keystroke: stage it until an option is chosen or the field loses focus. |
| "Fix in Chat" is a full-width grey bar that reads like an input, not a button | 🟢 Minor | For this error the button is now "Add API key". Style it as a button (Sim's `Chip`), left-aligned. |
| A "legacy" badge appears on `gpt-5.4-nano` with no explanation ([09](screenshots/09-cheapest-model-error.jpg)) | 🟢 Minor | Tooltip: what "legacy" means and what to pick instead. |

### Visual Hierarchy

- **What draws the eye first:** the white **Run** button, then the amber "legacy" badge on the block. Run is right before a run. After a failure, the eye should land on the cause, but nothing on the canvas changes.
- **Reading flow:** canvas → toast (bottom right, over the canvas) → logs (bottom) → panel (right). The error needs three places to explain itself: toast (clipped), logs (full text), panel (where the fix is). The toast sits closest to the logs, not to the Model field.
- **Emphasis:** the error text uses the muted grey of secondary copy, so the most important sentence on screen is the faintest. The red is spent on the small "error" chip and the log row name.

### Consistency

| Element | Issue | Recommendation |
|---|---|---|
| Badge colour (improvement 1) | "Needs your key" is amber, the same as Sim's "legacy" badge on the block. Two meanings, one colour | Use Sim's `blue` badge variant for "Needs your key": blue is informational and actionable here, not a warning |
| Plan badges | Settings marks paid features with "Max" badges, the model picker had none | Improvement 1 adds them. Keep the wording short and consistent ("Needs your key", like "Max") |
| Error wording | Toast, log and docs each said it differently ("BYOK", "hosted key", "upgrade message") | One shared message module (done in improvement 1); the toast gets a shorter variant |
| Inline API key field | Appears for unknown models only, so the same block shows different fields depending on the model typed | Show it whenever the run would need the user's key |

### Accessibility

- **Color contrast:** the toast description (grey on dark grey) measures about **3.7:1** from the screenshot, below WCAG AA's 4.5:1 for small text. This is an estimate from a JPEG, to confirm with the real tokens in the running app. The log text below it is lighter and looks fine.
- **Touch targets:** the toast close "×" and the block's top toolbar icons are about 16px, under the 24×24px minimum (WCAG 2.2 AA, 2.5.8). Desktop-first, but worth padding.
- **Text readability:** 12–13px text throughout the panel and toast. Fine for a dense tool, but the clipped toast makes the error unreadable whatever the size.
- **Screen readers:** several icon buttons have no accessible name (seen in the accessibility tree during the audit). The new badge has a `title`, but a `title` isn't reliably announced: give the option an accessible description too.

### What Works Well

- The three-zone layout (canvas, panel, logs) is clear, and the logs show the full error with its type ("error · string").
- A new Agent block connects itself to Start and opens its settings: no wiring needed for the first step.
- The block summary on the canvas ("Prompt gpt-5.4-nano with Say hello…") reads like a sentence, a nice touch.
- Improvement 1 puts the free fix first in the message and swaps the paywalled "Fix in Chat" for a working button.

### Priority Recommendations

1. **Fix the key where the error happens.** Show the Agent block's own API key field on the Free plan for models that need it, and make "Add API key" on the toast focus that field (Settings > BYOK stays the workspace-wide option). One step instead of three screens.
2. **Make the toast readable.** A short description of its own (one line), body-colour text, the button as a real button. The full message stays in Logs.
3. **Show the failure on the block.** An error outline and a one-line status on the failed block, cleared on the next successful run, so the canvas tells the same story as the logs.
4. **Small fixes to improvement 1:** blue badge instead of amber, and an accessible description on the badge.

Next: `/interaction-design` specifies the triggers, states and timing of recommendations 1 to 3.
