# UX Discovery Report: Sim, first use on the free plan

> Unofficial audit, not affiliated with Sim Studio. Done on [sim.ai](https://sim.ai) on 25 Nov 2026, signed up on the Free plan, at 1280×800. Tags: **[E]** observed during the walkthrough (screenshot in [`screenshots/`](screenshots/)), **[A]** my assumption.

## Summary

Sim is for builders who want to make their first AI agent quickly. Their main job is "connect a model to my data and get a first result". On the Free plan, that first result never comes: the default model, and even the cheapest one, are paid-only, and every recovery path ("Fix in Chat", the home chat) opens another paywall. The biggest risk is that new users leave in their first 5 minutes, thinking the product is broken. My top recommendation is to make the model picker and the run error honest and actionable: show which models need a paid plan or your own key, and turn the error into a one-click fix.

## 1. Discover

- **Subject:** Sim's first-use experience on sim.ai, a built and live product: sign-up, home, first workflow, first run, error recovery.
- **Goal:** users get a working first agent run fast (user value), which turns into activation and upgrades (business value) **[A]**.
- **Users:** individual builders trying Sim (developers, ops people, technical designers) before bringing it to their team **[A]**.
- **Constraints:** fixes have to be shippable in the open-source code (`sim-ameliore/`). Billing rules come from Sim's cloud and **may not exist in a self-hosted copy** **[A]**, so the fixes target the interface, not the pricing.
- **Key questions:**
  1. Can a free user get a first agent result without help?
  2. When a run fails, does the product say how to fix it?
  3. Can users find the right block and the right model?
  4. Does the empty state tell a beginner what to do?

## 2. Research intake

| Source | What it tells us | Type |
|---|---|---|
| Home page (sim.ai) | Aimed at teams and enterprise ("Build and govern every AI agent"). Main buttons: "Request a demo", "Start building" | [E] |
| Pricing page | Free: $0, 1,000 one-time credits, 1 workspace, **no "Sim-hosted models & tools"**, **no "Chat with Sim"** | [E] |
| Sign-up page | Only Google, Microsoft, GitHub, SSO. No email option ([01](screenshots/01-signup-no-email.jpg)) | [E] |
| Sign-in page | Has email and password ([02](screenshots/02-login-has-email.jpg)) | [E] |
| Home after sign-up | Chat-first: "What should we get done, fnnysimon?" with suggested actions; credit counter "1000" with no visible label ([03](screenshots/03-home-chat.jpg)) | [E] |
| Workflow "default-agent" | Canvas holds only a Start block, no agent, no hint ([04](screenshots/04-empty-canvas.jpg)) | [E] |
| Block library ("Toolbar" tab) | One flat list of ~300 items: ~75 triggers first, then core blocks, then ~200 integrations. No descriptions ([05](screenshots/05-block-library.jpg)) | [E] |
| First run | Agent added with default model `claude-sonnet-5-5` → error "…available on paid plans. Upgrade your plan, or add your own API key under Settings > BYOK." ([06](screenshots/06-first-run-error.jpg)) | [E] |
| "Fix in Chat" button on the error | Opens "Paid Plan Required: Chat is included on paid plans" ([07](screenshots/07-fix-in-chat-paywall.jpg)) | [E] |
| Model picker | No plan or availability badges. Typing appends to the current value ("claude-sonnet-5-5nano" → "No matching options found") ([08](screenshots/08-model-search-appends.jpg)) | [E] |
| Run with `gpt-5.4-nano` | Same paid-plan error; block also gets a "legacy" badge with no explanation ([09](screenshots/09-cheapest-model-error.jpg)) | [E] |
| Settings | BYOK page exists in the sidebar; some items carry "Max" plan badges, so the pattern exists elsewhere | [E] |
| Accessibility tree | Several icon buttons have no accessible name (sidebar items, suggested actions) | [E] |

**Gaps**

- No real users observed. Cheapest fix: 5 remote sessions of 20 minutes with the task "build an agent that summarises a URL" on a fresh Free account.
- No funnel data (sign-up → first successful run). Only Sim has it.
- Unknown whether self-hosted Sim shows the same paywalls. Check it when the local copy runs.

## 3. Personas

All proto-personas (assumption-based), with no interview data yet.

**Léa, product-minded developer at a 20-person startup**
- **Goals:** prove in one afternoon that an AI agent can triage support tickets, then show her CTO.
- **Frustrations:** tools that hide the pricing wall until after she's invested time; jargon.
- **Behaviors:** tries tools on the free plan first; has an OpenAI key but doesn't want to paste it before she trusts the tool.
- **Needs from Sim:** a first successful run in under 5 minutes; clear signs of what's free; errors that say exactly what to do.
- **Confidence:** proto-persona **[A]**.

**Karim, ops lead, non-developer**
- **Goals:** automate a weekly report from Google Sheets to Slack.
- **Frustrations:** long lists with no guidance; not knowing what "BYOK" or "legacy" means.
- **Behaviors:** learns by example and templates; gives up after 2 dead ends.
- **Needs from Sim:** a "start here" path; plain-language labels; templates.
- **Confidence:** proto-persona **[A]**.

## 4. Jobs to be done

**Main job:** "When **I'm evaluating an agent builder**, I want to **get one real agent run working with my own prompt**, so I can **decide if it's worth bringing to my team**."
- **Functional:** add a model, write a prompt, run it, see the output.
- **Emotional:** feel competent and in control, not tricked.
- **Social:** have something credible to show colleagues.
- **Current alternatives:** n8n, Zapier AI, Make, coding directly with an SDK, ChatGPT custom GPTs **[A]**.
- **Pains with those alternatives:** a lot of setup for code, limited agent logic in no-code tools **[A]**.

**Secondary job:** "When **a run fails**, I want to **understand why and fix it in place**, so I can **keep my momentum**."

## 5. User journey (Léa, main job)

| Stage | User action | Thinking / feeling | Touchpoint | Pain point | Opportunity |
|---|---|---|---|---|---|
| Arrive | Clicks "Start building" | Curious | Home page | Enterprise wording | Minor |
| Sign up | Looks for email sign-up | Hesitant | Sign-up page | No email option, though sign-in has one [E] | Add email sign-up, or align both pages |
| First screen | Sees a chat and "1000" | "Can I just ask it?" | Home chat | Chat isn't included in Free [E]; the counter has no label | Explain what credits can be used for |
| Open workflow | Opens "default-agent" | "Where's the agent?" | Canvas | Only a Start block, no hint [E] | Empty state with "Add an Agent" |
| Find a block | Opens Toolbar | Overwhelmed | Block library | Agent buried after ~75 triggers, no descriptions [E] | "Core blocks" first, short descriptions |
| **Run** | Clicks Run | Expectant → let down | Run + logs | Default model is paid-only; fails in 22 ms [E] | Default to a model the plan can run, or ask for a key before running |
| **Recover** | Clicks "Fix in Chat" | Frustrated | Error toast → dialog | Second paywall [E] | Error offers "Add API key" (deep link) and "Pick an available model" |
| **Retry** | Changes model | "Which one is free?" | Model picker | No badges, search appends text, every model fails [E] | Badges per model; search replaces the value |

**Moments that matter:** Run, Recover, Retry. This is where the trial is won or lost.

## 6. Insights

1. **We see** the default model fails on the Free plan within 22 ms **[E]**, **which means** a new user's very first action looks like a broken product, **so we should** never preselect a model the user can't run, or warn before the run.
2. **We see** the error's own fix button ("Fix in Chat") leads to another paywall **[E]**, **which means** the recovery path is a dead end, **so we should** make the error offer the actions that do work: open BYOK, or pick an available model.
3. **We see** the model picker gives no availability info while Settings already uses "Max" badges **[E]**, **which means** users guess blindly, **so we should** reuse that badge pattern in the picker ("Needs paid plan" / "Your key").
4. **We see** the picker's search appends to the current value **[E]**, **which means** searching gives "No matching options" for valid models, **so we should** select or clear the current value on focus.
5. **We see** core blocks buried under ~75 triggers in a flat list **[E]**, **which means** beginners struggle to find "Agent" **[A]**, **so we should** list Core blocks first with one-line descriptions.
6. **We see** an empty "default-agent" with only Start **[E]**, **which means** the name promises an agent that isn't there, **so we should** show an empty-state hint or prefill an Agent block.
7. **We see** sign-up without email while sign-in has it **[E]**, **which means** users without Google, Microsoft or GitHub can't join **[A]**, **so we should** align both pages (a product decision for Sim, out of scope for a UI fix).

| Insight | Opportunity | Impact | Effort | Priority |
|---|---|---|---|---|
| 1 + 3 + 4 | Honest, usable model picker (badges, search fix, default) | High | Medium | **P1** |
| 2 | Actionable run error (plain words, deep link to BYOK, model switch) | High | Low | **P1** |
| 5 | Block library: Core blocks first + descriptions | Medium | Low | **P2** |
| 6 | Empty-canvas guidance | Medium | Low | **P2** |
| 7 | Email sign-up | Medium | High (auth + business decision) | P3 |
| Accessibility | Names on icon buttons, label on credit counter | Medium | Low | P2 |

## 7. Telemetry

- **North star:** % of new workspaces with a **first successful agent run within 24 h** of sign-up.
- **Guardrails:** upgrade conversion rate (must not drop); run error rate; time to first run.

| Event (snake_case) | Trigger | Properties | Question it answers |
|---|---|---|---|
| `workflow_run_started` | Run clicked | `plan`, `block_count`, `is_first_run` | How many users try a first run? |
| `workflow_run_failed` | Run ends in error | `error_type` (`plan_gated_model`, `missing_key`, …), `is_first_run` | How often does the paywall cause the first failure? |
| `run_error_action_clicked` | Click on an error action | `action` (`add_key`, `switch_model`, `upgrade`, `fix_in_chat`) | Which recovery do users choose? |
| `model_selected` | Model picked | `model_id`, `availability` (`included`, `byok`, `paid`) | Do badges steer users to models they can run? |
| `byok_key_added` | Key saved in BYOK | `provider`, `source` (`settings`, `error_link`, `inline`) | Does the deep link increase key setup? |
| `block_added` | Block dropped or clicked | `block_type`, `source` (`library`, `search`, `empty_state`) | Do users find core blocks faster? |

**Privacy:** no prompt contents, no API keys, no emails in events. IDs and enums only.

## 8. Validate (against the live product)

| Criterion (from steps 3–5) | Status | Evidence | Fix |
|---|---|---|---|
| A free user gets a first successful run without help | ❌ | [06](screenshots/06-first-run-error.jpg), [09](screenshots/09-cheapest-model-error.jpg) | Available default model, or a key prompt before running |
| Errors say exactly how to fix it, in place | ❌ | [07](screenshots/07-fix-in-chat-paywall.jpg) | Error actions: "Add your API key" (deep link) and "Choose another model" |
| Model availability is visible before choosing | ❌ | [08](screenshots/08-model-search-appends.jpg) | Badges in the picker |
| Picker search works as expected | ❌ | [08](screenshots/08-model-search-appends.jpg) | Replace the value on typing |
| Beginners find the Agent block quickly | ⚠️ | [05](screenshots/05-block-library.jpg) | Core blocks first + descriptions (search exists but is easy to miss) |
| The empty canvas tells you what to do | ❌ | [04](screenshots/04-empty-canvas.jpg) | Empty-state hint |
| Plain language (no "BYOK", unexplained "legacy") | ⚠️ | [06](screenshots/06-first-run-error.jpg), [09](screenshots/09-cheapest-model-error.jpg) | "your own API key"; tooltip on "legacy" |
| Sign-up and sign-in offer the same options | ❌ | [01](screenshots/01-signup-no-email.jpg), [02](screenshots/02-login-has-email.jpg) | Out of UI scope |

**Cheapest real test:** 5 people new to Sim, fresh Free accounts, task "make an agent that answers 'say hello' and run it", max 10 minutes. Success signal: ≥ 4/5 get a successful run, or reach a working BYOK setup, without asking for help. Run it on the current product, then on the improved version.

## Assumptions log

| # | Assumption | Risk if wrong | How to test it |
|---|---|---|---|
| 1 | New users try a run within their first minutes | High | Funnel data, or the 5-person test |
| 2 | Users read "BYOK" as jargon | Med | Ask in the test what they think it means |
| 3 | Free users would add their own key if asked clearly | High | Count `byok_key_added` from the error link |
| 4 | Self-hosted Sim shows the same plan-gated errors | Med | Run the local copy |
| 5 | Core blocks first speeds up finding "Agent" | Low | Time-to-block in the test |

## Open questions

- Is the Free plan meant to be BYOK-only? If so, the onboarding should say it up front.
- What are the 1,000 free credits usable for, if not hosted models?
- What does the "legacy" badge mean for `gpt-5.4-nano`?

---

**Next step:** build the two P1 fixes (model picker + actionable run error) in `sim-ameliore/` once the local copy runs, then the 5-person test.
