# Interaction Spec: "This model needs your own API key" (Agent block, Free plan)

> Unofficial spec, not affiliated with Sim Studio. Builds on the [UX discovery report](01-ux-discovery-report.md) and the [design critique](02-design-critique.md) (priorities 1 to 3). "Today" means sim.ai on 25 Nov 2026 plus the current code in this folder.

## Goal and context

- **User:** someone on the Free plan building their first agent, on desktop, with full attention but low tolerance for dead ends (first 5 minutes of a trial).
- **What they're doing:** pick a model, run the block, get a result.
- **The one outcome that matters:** a free user whose model needs their own key finds out **before** running, and can add the key **without leaving the block**.

What happens today (quoted from the product and code):

1. The Model field defaults to `claude-sonnet-5-5` (`blocks/blocks/agent.ts`, `defaultValue`).
2. The block's API key field is hidden for every Sim-hosted model on hosted Sim (`shouldRequireApiKeyForModel` returns `false` when `hosted` and the model is in `getHostedModels()`), whatever the plan.
3. Run fails in about 22 ms with "…available on paid plans. Upgrade your plan, or add your own API key under Settings > BYOK."
4. A toast shows the block name, the error clipped to 3 lines, and "Fix in Chat", which opens "Paid Plan Required" on Free.
5. The block on the canvas doesn't change; only the log row turns red.

Improvement 1 (commit `d6162a6`) already changes 3 and 4 and adds a "Needs your key" badge in the picker. This spec covers the rest.

## Microinteraction map

**A. Before the run: the model needs a key**

| Part | Behavior |
|---|---|
| Trigger | System: the block's model is a Sim-hosted model, the workspace is on the Free plan of hosted Sim, and the workspace has no saved key (Settings > BYOK) for that model's provider. Evaluated on block mount, on model change, and when the BYOK key list changes. |
| Rules | 1. The model shows a **blue** "Needs your key" badge, in the picker list and next to the selected value. 2. The block's existing **API key** field appears under Model, with the placeholder "Enter your {Provider} API key". 3. If a BYOK key exists for the provider, or the plan is paid, or Sim is self-hosted: no badge, no field (today's behavior). 4. A key typed in the field is saved on the block, like any other field (today's storage of `apiKey`). |
| Feedback | Badge + field appear together, so the cause and the fix are next to each other. Once a key is typed, the badge on the selected value disappears (the block can now run). |
| Loops and modes | Re-evaluated whenever the model, plan or BYOK list changes. Switching to a model of a provider with a saved key hides both again. The typed key stays on the block if the user switches models and back. |

**B. The run fails anyway** (key missing, e.g. a workflow imported or run from elsewhere)

| Part | Behavior |
|---|---|
| Trigger | System: a block error whose message is the hosted-key refusal (`isHostedKeyPaidPlanMessage`). |
| Rules | 1. Toast title: block name. Description, **one line**: "Needs your own API key on the Free plan." 2. Action: **Add API key**. 3. If the failed block is in the open workflow: the action selects the block, opens its editor and focuses the API key field. Otherwise it opens Settings > BYOK (today's improvement 1 behavior). 4. The full message stays in Logs. 5. The block gets an error state (see States) until its next run. |
| Feedback | Toast (where to act) + block error state (what failed) + log row (details). |
| Loops and modes | Same dedup window as today (1.5 s per block execution), so one failure gives one toast. A re-run clears the block's error state when it starts. |

**C. Model search** (improvement 1, kept)

| Part | Behavior |
|---|---|
| Trigger | User focuses the Model field (click or Tab). |
| Rules | The current text is selected, so the first keystroke replaces it. Picking an option or blurring commits. **To decide:** today every keystroke is saved to the block (the canvas shows "claude-sonnet-5-5nano" while typing). Staging the text until commit would fix that, but the field also accepts free text and `<block.output>` references, so it needs a check with the team. |
| Feedback | Selection highlight on focus; the list filters as you type. |

## States

| Element | State | What the user sees | What they can do |
|---|---|---|---|
| Model option (picker list) | Needs key | Model name + blue "Needs your key" badge on the right | Pick it anyway (the key field then appears) |
| Model option | Ready | Model name only | Pick it |
| Model field (selected value) | Needs key | Model + blue badge, API key field visible below | Type a key, change model |
| Model field | Focused | Text selected, list open | Type to search, arrow keys, Enter, Escape |
| API key field | Empty, needed | Placeholder "Enter your {Provider} API key", required marker | Type or paste a key |
| API key field | Filled | Masked key (today's `password` field behavior) | Edit, clear |
| API key field | Not needed | Hidden | – |
| Agent block (canvas) | Default | Today's look | Everything |
| Agent block | Error | Error-colour outline (`--text-error`) and a one-line status under the title: "Needs API key" | Click the block to open it; the editor opens on the API key field |
| Agent block | Running again | Error outline removed when the run starts | – |
| Toast | Key error | Error icon, block name, one-line description, **Add API key** button | Click the button, close, or ignore |
| Toast | Other errors | Today's behavior (full description, "Fix in Chat" when chat is available) | Same as today |

## Timing

| Event | Delay | Reason |
|---|---|---|
| Badge + key field appear after a model change | Same render (< 0.1 s) | Derived from data already in memory (plan, BYOK list), so it should feel instant |
| BYOK key list fetch | Uses the existing query (60 s stale time) | Already cached by the Settings page; no extra waiting added. While it loads, show no badge: a missing badge is safer than a wrong one |
| Select on focus | Next animation frame (~16 ms) | Selecting on the focus event itself gets undone by the mouse-up of the click |
| Toast with "Add API key" | Stays until closed | Sim's toast rule today: a toast with an action persists. The fix shouldn't disappear while the user reads |
| Block error state | Until the next run of that block | The canvas should keep telling the truth until something changes |
| Focus the API key field after "Add API key" | After the editor panel has opened (next frame) | Focusing a field that isn't mounted yet does nothing |

## Motion

| Element | Trigger | Change | Duration | Easing | Purpose |
|---|---|---|---|---|---|
| API key field | Appears | Height 0 → auto, opacity 0 → 1 | 150 ms | ease-out | Show that a new field joined the form, so the panel doesn't jump |
| Block error outline | Run fails | Outline colour fades in | 150 ms | ease-out | Feedback: link the toast to the block |
| API key field | Focused from the toast | One soft highlight pulse of the field border | 600 ms, once | ease-in-out | Direct attention to where to type |

`prefers-reduced-motion`: no height animation, no pulse; the field and outline appear instantly. The focus ring alone shows where to type.

## Errors and recovery

- **Prevent:** the badge and the key field show the requirement before the first run. **To decide:** whether a new Agent block on the Free plan should default to a model that has a saved key, when one exists.
- **When it happens:** say what (this model needs your key), why (Free plan), and how (one button). The message no longer leads with the upgrade.
- **Recovery in one step:** "Add API key" lands the cursor in the right field. Nothing typed in the block is lost: opening the editor doesn't reset any field.
- **Wrong key:** today's provider error ("invalid API key" from the provider) still applies. **To decide:** whether to add a "Test key" action; out of scope here.
- **Undo:** clearing the field brings the badge back; no confirmation needed (nothing destructive).

## Principles check

| Principle | Status | Note |
|---|---|---|
| Visibility of system status | ✅ | Badge before the run, outline after it, log for details |
| Match with the real world | ✅ | "Needs your key", "Add API key": no "BYOK" or "hosted key" jargon on the first screen; "BYOK" is explained once in the full message |
| User control and freedom | ✅ | The user can still pick any model, close the toast, or go to Settings > BYOK instead |
| Consistency and standards | ⚠️ | Reuses the block's existing API key field and Sim's badge and toast. The blue badge must not be reused for other meanings |
| Error prevention and recovery | ✅ | Prevented before the run, one-step recovery after |
| Fitts's law | ✅ | The key field sits right under the Model field it relates to; the toast button is a full-size target |
| Hick's law | ✅ | The toast offers one action, not "Upgrade / Settings / Chat" |
| Doherty threshold | ✅ | Everything is local state; no new waiting above 400 ms |

## Accessibility

- **Keyboard:** Tab reaches Model, then the API key field right after it (DOM order = visual order). "Add API key" is reachable in the toast with the keyboard, and moves focus into the field, which is the user's own action, so moving focus is expected.
- **Screen readers:** the badge text is part of each option's accessible name ("gpt-5.4-nano, needs your key"), not only a `title`. When the run fails, the toast is announced once through its existing live region; the block's error state is not announced separately (it would repeat the toast).
- **Targets:** the toast button and the close button are at least 24 × 24 px.
- **Colour:** the error outline is paired with the text status "Needs API key", so colour isn't the only signal. Badge text must reach 4.5:1 against its blue background.

## Open questions

- Should the block's key and a Settings > BYOK key both be offered in the field ("Use a key saved in Settings")? A workspace key is better for teams; a block key is quicker for a first run.
- Is the Free plan meant to be "bring your own key only"? If so, onboarding could ask for a key once, before the first workflow.
- Staging the Model field text until commit (section C).
- Default model for new blocks on the Free plan (Errors and recovery).

Next: build A and B (key field on Free plan, one-line toast that focuses it, block error state) and the critique's fixes to improvement 1 (blue badge, accessible badge text), with `/frontend-design`.
