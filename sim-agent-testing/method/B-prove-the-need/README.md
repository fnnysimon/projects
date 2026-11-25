# B. Prove the need

Status: validated · [Back to the method](../README.md)

**Goal:** show whether estimating an agent's cost before deploying it is a real need.

Made with `/ux-superpowers`, scoped to the job "estimating an agent's cost before deploying it". Tags: **[E]** evidence (docs, code, GitHub issues, reviews, our own session), **[A]** assumption.

# UX Discovery Report: estimating an agent's cost before deploying it in Sim

## Summary

The need sits with two people: the **builder** who designs the agent and the **budget owner** who must approve its spend. Today Sim shows cost only after each run, with no estimate and no per-block breakdown [E]. Users do complain about cost visibility and credits, but **no user has explicitly asked for a pre-run estimate** [E]: that is the biggest risk. Recommendation: keep the gap, but frame it as "know what my agent will cost and what drives it", which covers both the after-run requests that exist and the before-run need we infer, and test it with 5 builders before building.

## 1. Discover

- **Subject:** a cost estimate for a Sim workflow, before deployment. Stage: idea.
- **Goal for users:** know, before going live, what an agent will cost per run and per month, and which part drives that cost.
- **Goal for Sim:** fewer surprises and support tickets about credits; a number enterprise buyers can approve; easier upgrades from Free to paid.
- **Users:** builders (developers, ops and automation leads), budget owners (managers, finance), Sim's sales and forward-deployed engineers.
- **Constraints:** Sim's cost model is public (docs and open-source code) [E]; with BYOK, token costs are billed by the model provider, outside Sim [E]; no API key available for this project yet, so no real runs.
- **Key questions:**
  1. Do builders want to know the cost *before* running, or is after-run visibility enough?
  2. Who asks "how much will it cost?" first: the builder or someone else?
  3. Which inputs can a builder realistically provide (volume, email length, model)?
  4. Is an estimate within ±20% good enough to make a decision?

## 2. Research intake

| Source | What it tells us | Type |
|---|---|---|
| Sim costs docs and code ([step A](../A-understand-how-sim-charges/)) | Cost = 1 base credit + model tokens + hosted tools; shown only after the run; no per-block cost; no estimate | [E] |
| Worked example ([step A](../A-understand-how-sim-charges/)) | ~1.08 credits per email with gpt-4.1-mini (~$5.40 per 1,000), ~$11.35 with gpt-5.5; base fee ~92% of a small agent's cost | [E] computed from public prices, token counts [A] |
| Our free-plan session ([discovery](../../docs/01-discovery.md)) | Runs fail with an upgrade message; the free plan's 1,000 credits would not cover one month of the example agent | [E] |
| [#9620](https://github.com/simstudioai/sim/issues/9620) (Nov 2026, open) | User blocked despite 4,000 credits: "Please clarify why my remaining credits cannot be used." | [E] |
| [#117](https://github.com/simstudioai/sim/issues/117) (Mar 2025, closed) | "I'd like to know how much it costs me to run the execution." Written by the team; led to the after-run cost tracker | [E] |
| [#176](https://github.com/simstudioai/sim/issues/176) (Mar 2025, closed) | Maintainer request to track "how often and how much their executions cost" | [E] |
| [#3700](https://github.com/simstudioai/sim/issues/3700) (Mar 2026, closed) | "Which block in a workflow is the most expensive?" and spend caps. Written by a cost-tool vendor; no user replies | [E], weak |
| [#8452](https://github.com/simstudioai/sim/issues/8452) (Sep 2026, open) | Self-hosted installs rate-limited despite "no rate limits" in docs | [E], about limits, not spend |
| [Product Hunt reviews](https://www.producthunt.com/products/sim-studio/reviews) | One reviewer wants BYOK through a subscription "instead of API pricing"; another wants tracing for "token drift" | [E], thin |
| [Enterprise post](https://sim.ai/blog/enterprise) | Sim itself notes "no numeric per-team budget caps" | [E] |

**Honest read of the evidence:** of 8 issues read, **none** is a user asking to predict cost before a run. Two after-run cost requests came from the team, one cost-control request from a vendor, and one confusion about credits from a user. GitHub Discussions is disabled and Reddit was unreachable.

**Gaps and the cheapest way to fill them:**

| What we don't know | Cheapest way to find out |
|---|---|
| Whether builders want a pre-run estimate | 5 short interviews with Sim or n8n builders (Sim Discord, YC network, LinkedIn) |
| Whether budget owners ask for a number before approving | 2–3 interviews with managers who approved an automation budget |
| How Sim's sales team answers "how much will it cost?" | Ask during the Founding Design Engineer outreach |
| Real token counts for the example agent | One run with an API key (step F) |

## 3. Personas

Proto-personas: built from the research above, not from interviews.

**Léa, automation lead at a mid-size bank** (builder)
- **Goals:** ship an email-sorting agent that saves advisors time; get it approved quickly.
- **Frustrations:** cannot tell what the agent will cost until it has run many times [E: no estimate in Sim]; does not know whether the model or the number of runs drives the bill [A].
- **Behaviors:** builds and tests in Sim's editor; uses her company's own API keys (BYOK) for compliance [A]; prepares a business case for her manager [A].
- **Needs:** a cost per run and per month before going live; the share of each block; a comparison between two models.
- **Confidence:** proto-persona.

**Marc, head of operations** (budget owner)
- **Goals:** approve only spends he can predict and defend.
- **Frustrations:** is asked to approve a tool billed per usage, with no figure attached [A]; with BYOK, cost is split across Sim and the model provider's invoice [E].
- **Behaviors:** does not open Sim; reads a one-page business case or a spreadsheet [A].
- **Needs:** a monthly figure with a range; what happens if volume doubles; a cap.
- **Confidence:** proto-persona.

## 4. Jobs to be done

**Main job (Léa)**
"When **I have built an agent and need approval to deploy it**, I want to **know what it will cost per month and what drives that cost**, so I can **get it approved and pick the right model without surprises**."

- **Functional:** a monthly cost figure; the cost per block; a model comparison.
- **Emotional:** confidence to present a number without being caught out later.
- **Social:** look competent in front of her manager and finance.
- **Current alternatives** [A]: run the agent on a few samples and read the logs; multiply by volume in a spreadsheet; copy model prices from the provider's site; guess.
- **Pains:** each test run costs credits (and fails on the free plan) [E]; logs show a total, not per block [E]; the base fee is easy to forget although it is most of the bill [E]; BYOK token costs are not in Sim's logs at all [E].

**Secondary job (Marc)**
"When **someone asks me to approve a usage-billed agent**, I want to **see a monthly range and a worst case**, so I can **commit a budget I can defend**."

## 5. User journey

Léa, from "agent built" to "budget approved".

| Stage | User action | Thinking / feeling | Touchpoint | Pain point | Opportunity |
|---|---|---|---|---|---|
| 1. Build | Builds the workflow in the editor | "It works on my test email." | Sim editor | Model picker shows no price [E] | Show the cost impact of the model choice |
| 2. Test | Runs a few sample emails | "How much did that cost?" | Run, logs | Cost only after each run; credits spent on tests; fails on Free [E] | Estimate without spending credits |
| 3. Estimate | Opens logs, adds up, multiplies by volume in a spreadsheet | "Is this right? What about loops?" | Logs, spreadsheet, provider pricing page | No per-block cost; base fee easy to miss; BYOK tokens missing [E] | Automatic per-run and per-month estimate with breakdown |
| 4. Justify | Writes a business case for Marc | "I hope the number holds." | Doc or email outside Sim | Has to explain the number by hand [A] | Shareable summary: monthly figure, range, drivers |
| 5. Approve | Marc approves or asks for changes | Marc: "What if volume doubles?" | Meeting, email | No scenario, no cap [E: no budget caps] | Volume scenarios and a suggested cap |
| 6. Deploy | Deploys and watches the first bills | "Does it match?" | Logs, invoices | No comparison between estimate and actual [A] | Show estimate vs actual |

**Moments that matter:** stage 3 (estimate), where the work is manual and error-prone, and stage 5 (approve), where the project is won or lost.

**Shorter path (input for step C):** today, stages 2–4 take about 6 actions (run samples, open each log, copy totals, find model prices, build the spreadsheet, write the case) [A]. An estimate inside the workflow could replace them with about 2 (enter volume, read the estimate), well beyond the 20% target. To be measured in step C.

## 6. Insights

1. **We see** that Sim shows cost only after a run and never per block [E], **which means** the builder discovers what drives cost only by spending credits, **so we should** estimate per block without running.
2. **We see** that the base fee is about 92% of a small agent's cost [E], **which means** the number of runs matters more than the model for small agents, a fact no builder can see today, **so we should** show the base fee as its own line.
3. **We see** that with BYOK, token costs leave Sim's logs [E], **which means** the full cost is invisible in one place, **so we should** include provider token costs in the estimate whatever the key setup.
4. **We assume** the person who needs the number is the budget owner, not the builder [A], **which means** the output must be readable outside Sim, **so we should** produce a one-screen summary with a monthly range.
5. **We see** no user request for a pre-run estimate, only after-run ones [E], **which means** the need may be real but unspoken, or not felt, **so we should** test it before building.

| Insight | Opportunity | Impact | Effort | Priority |
|---|---|---|---|---|
| 1. No per-block cost | Per-block estimate | High | Medium | P1 |
| 2. Base fee dominates | Base fee as its own line | High | Low | P1 |
| 3. BYOK splits the bill | Include provider costs | Medium | Low | P1 |
| 4. Budget owner needs the number | Shareable monthly summary | High | Low | P2 |
| 5. Unspoken need | Test with 5 builders | Critical | Low | P0 |

## 7. Telemetry

- **North star:** share of deployed workflows that had an estimate viewed before their first deployment.
- **Guardrails:** gap between estimated and actual cost after 30 days (target within ±20%); number of credit-related support tickets.

| Event | Trigger | Properties | Question it answers |
|---|---|---|---|
| `cost_estimate_viewed` | Estimate opened | `workflow_block_count`, `has_loop`, `key_mode` (byok / hosted) | Do builders look for the cost before deploying? |
| `cost_estimate_inputs_changed` | Volume or model changed | `field_changed` | Which levers do they test? |
| `cost_estimate_shared` | Summary copied or exported | `format` | Does the number go to someone else? |
| `workflow_deployed_after_estimate` | Deploy within 7 days of an estimate | `days_since_estimate` | Does the estimate unblock deployment? |
| `cost_estimate_vs_actual` | 30 days after deploy | `error_pct` bucket | Is the estimate reliable? |

**Privacy:** no email content, prompts or company names in events; only counts and buckets.

## 8. Validate

Nothing is built yet, so these are **acceptance criteria** for the prototype:

- [ ] Shows cost per run and per month for a given volume.
- [ ] Shows the base fee, each model block and each paid tool as separate lines.
- [ ] Handles loops (cost multiplied by iterations) and BYOK (provider cost shown separately from Sim credits).
- [ ] Compares two models for the same block.
- [ ] Produces a summary a budget owner can read without opening Sim.
- [ ] Gets an estimate in about 2 actions instead of about 6.
- [ ] Is within ±20% of the real cost in step F.

**Cheapest real test:** 5 builders (Sim Discord, n8n community, LinkedIn). Task: "You built this email agent; your manager asks what it will cost per month. Show me how you'd answer." Success signal: at least 3 of 5 say they have needed this, or struggle without it.

## Assumptions log

| # | Assumption | Risk if wrong | How to test it |
|---|---|---|---|
| 1 | Builders want the cost before deploying, not only after | High | 5 builder interviews |
| 2 | The budget owner is the one asking for the number | Medium | 2–3 manager interviews; ask Sim's team |
| 3 | Builders can estimate volume and email length | Medium | Interviews; let the tool default these from a sample |
| 4 | ±20% accuracy is enough to decide | Medium | Ask budget owners; check in step F |
| 5 | The example token counts (~550 in, ~120 out) are realistic | Low | One real run in step F |

## Open questions

- How are retries and fallback models charged?
- Does a Sim workflow export contain enough to compute the estimate automatically?
- Would Sim prefer this inside the editor or as a pre-deploy check?

**Next step:** step C, framing the feature as a PM, using insights 1–4 and the acceptance criteria above. Ideally, run the 5-builder test in parallel to de-risk assumption 1.
