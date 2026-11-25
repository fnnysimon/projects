# A. Understand how Sim charges

Status: awaiting validation · [Back to the method](../README.md)

Goal: understand what makes up the cost of a run, what changes with BYOK, and who in a company cares about that cost.

### The company in brief

| | |
|---|---|
| What | "The open-source AI workspace where companies build, distribute, and govern AI agents" ([sim.ai](https://sim.ai/)) |
| Founded | 2025, San Francisco, YC Spring 2025 (formerly Sim Studio) ([YC](https://www.ycombinator.com/companies/sim)) |
| Team | About 10 people; two founders (CEO with a consumer-app background, CTO formerly backend at Ring/Amazon) ([YC](https://www.ycombinator.com/companies/sim)) |
| Funding | $7M Series A led by Standard Capital, with Perplexity Fund, SV Angel, YC and Paul Graham, Nov 2025 ([Sim blog](https://sim.ai/blog/series-a), vendor source) |
| Traction (vendor claims) | 30k GitHub stars, "100,000+ builders", "100+ companies in production", "10M+ workflows" ([Sim blog](https://sim.ai/blog/series-a), [GitHub](https://github.com/simstudioai/sim)) |
| Named customers | Rivian / VW Group Technologies, eXp Realty, Artie, thinkproject, Mobile Health ([Sim blog](https://sim.ai/blog)) |
| Competitors they compare with | n8n, Zapier, Make, Gumloop, Workato, Retool, Pipedream, OpenAI AgentKit, Tines ([sim.ai](https://sim.ai/)) |
| Business model | Open source (Apache 2.0, free self-hosting) + cloud plans + Enterprise licence (SSO, SOC 2, air-gapped deployment) ([pricing](https://sim.ai/pricing), [enterprise](https://sim.ai/blog/enterprise)) |
| Direction | From a visual workflow builder (2025) to a chat-first "control plane" for agents with Tables, Files and scheduled tasks (v0.6, March 2026) ([Mothership](https://sim.ai/blog/mothership)) |
| Open roles | Founding Design Engineer, Founding Account Executive, Agent Harness engineer, Forward Deployed Engineer, Founding GTM: the company is moving from builders to enterprise sales and deployments ([YC](https://www.ycombinator.com/companies/sim)) |

### Stakeholders

| Stakeholder | What they want | Where cost matters to them |
|---|---|---|
| **Builder** (developer, ops or automation lead who creates the agent) | Ship a working agent fast | Has to pick models and blocks without seeing their price impact |
| **Budget owner** (manager, finance, procurement) | Approve a predictable spend | Is asked to sign off before any run has happened, so has no number to look at |
| **End users of the agent** (e.g. bank advisors receiving sorted emails) | Reliable results | Indirect: a cheaper model may be less accurate |
| **IT, security, compliance** | Governance, data control, audit | BYOK and self-hosting change who pays whom |
| **Sim** (founders, sales, forward-deployed engineers) | Convert free users to paid plans, close enterprise deals | Enterprise buyers ask "how much will this cost us?" during evaluation; the enterprise post itself notes "no numeric per-team budget caps" |
| **Model and tool providers** (OpenAI, Anthropic, Serper…) | API usage | Paid directly with BYOK, or through Sim credits with hosted keys |

### How people use Sim

Use cases Sim promotes ([sim.ai](https://sim.ai/), [Mothership](https://sim.ai/blog/mothership)):

- Sales: lead research and CRM updates
- IT: ticket triage, access provisioning
- HR: onboarding
- Finance: invoice reconciliation
- Compliance: evidence collection
- Engineering: code review, on-call triage
- Support: daily Gmail tickets written to a table; failed Stripe payments posted to Slack

Most of these are **recurring, high-volume runs** (every email, every ticket, every day). This is exactly where the cost of one run, multiplied by thousands, becomes a budget question.

### How a run is charged

**One formula** ([costs docs](https://docs.sim.ai/platform/costs)):

```
run credits = 1 (base fee)
            + model cost in USD × 200
            + hosted tool cost in USD × 200
            + sandbox cost in USD × 200

model cost in USD = (input tokens × input price + output tokens × output price) / 1,000,000
1 credit = $0.005  (so $1 = 200 credits)
```

| Component | How it is charged | Source |
|---|---|---|
| **Base fee** | 1 credit ($0.005) per run, even with no model call. Child executions sharing the parent's charge do not add another base fee | [costs docs](https://docs.sim.ai/platform/costs), code: `BASE_EXECUTION_CHARGE = 0.005` in [constants.ts](https://github.com/simstudioai/sim/blob/main/apps/sim/lib/billing/constants.ts) |
| **Model tokens** | Per call, from a price table per model (input, cached input, output per 1M tokens, with tiers for very long inputs). No markup found on hosted keys | [pricing.ts](https://github.com/simstudioai/sim/blob/main/apps/sim/providers/pricing.ts), [models.ts](https://github.com/simstudioai/sim/blob/main/apps/sim/providers/models.ts) |
| **Hosted tools** | Per operation, e.g. Serper $0.001 (up to 10 results), Perplexity Search $0.005, Google Maps Place Details $0.017 | [costs docs](https://docs.sim.ai/platform/costs) |
| **Loops and parallel branches** | Every model and tool call inside is metered, so cost grows with the number of iterations | [costs docs](https://docs.sim.ai/platform/costs) (inferred from per-call metering) |
| **Retries, fallback models** | Not documented | — |
| **Knowledge bases** | Processing is recorded outside workflow runs; no price found | [costs docs](https://docs.sim.ai/platform/costs) |
| **Storage** | Separate from credits (5 / 50 / 500 GiB by plan) | [pricing](https://sim.ai/pricing) |

Example model prices in Sim's code (USD per 1M tokens, input / output): gpt-5.5 5.00 / 30.00 · gpt-4.1-mini 0.40 / 1.60 · gpt-oss-120b 0.15 / 0.60 ([models.ts](https://github.com/simstudioai/sim/blob/main/apps/sim/providers/models.ts)).

### BYOK versus hosted keys

- **Hosted keys** (Sim's own provider keys): model and tool usage is converted into credits. Paid plans only.
- **BYOK** (your own keys, under Settings → BYOK): "BYOK avoids Sim's model or tool usage charge for the provider calls it covers; you pay that provider directly." The **1-credit base fee still applies**.
- **Free plan**: no hosted models or tools at all; "On Free, models and tools run on your own provider keys" ([pricing](https://sim.ai/pricing)). A run that needs a hosted key fails with an upgrade message (seen in the [discovery session](../../docs/01-discovery.md)).

So with BYOK, the real cost of an agent is **split across two bills**: Sim credits for the base fee, and the provider's invoice for tokens. Sim's logs cannot show the second one.

### Plans

| | Free | Pro | Max | Enterprise |
|---|---|---|---|---|
| Price | $0 | $25 / seat / month | $100 / seat / month | Custom |
| Credits | 1,000, one-time | 6,000 / month + 2,000 / week | 25,000 / month + 4,000 / week | Custom |
| Hosted models and tools | No | Yes | Yes | Yes |
| Chat with Sim | No | Yes | Yes | Yes |
| Concurrent runs | 2 | 50 | 200 | 1,000 |

Paid usage stops at the allowance unless on-demand overage is enabled. Weekly refreshes are "an allowance against that week's usage, not an accumulating wallet balance" ([costs docs](https://docs.sim.ai/platform/costs)).

### Where cost is visible today

- **After** each run: cost in credits in the logs list; base run, model and tool lines in the run details ([logging docs](https://docs.sim.ai/execution/logging)).
- **Per block**: not shown (only the Evaluator block outputs its own cost).
- **Before a run**: no estimate anywhere.

### Worked example: the bank email agent

Assumptions (to check in step F): one agent block per email, about 550 input tokens (prompt + email) and 120 output tokens.

| Model | Model cost per run | Credits per run | 1,000 emails / month |
|---|---|---|---|
| gpt-4.1-mini | (550 × 0.40 + 120 × 1.60) / 1M = $0.00041 → 0.08 credit | 1 + 0.08 = **1.08** | ~1,080 credits ≈ **$5.40** |
| gpt-5.5 | (550 × 5 + 120 × 30) / 1M = $0.00635 → 1.27 credits | 1 + 1.27 = **2.27** | ~2,270 credits ≈ **$11.35** |

What this shows:

1. **For a small agent, the base fee is most of the bill**: about 92% of the cost with gpt-4.1-mini. Model choice matters less than the number of runs. Nobody can see this before deploying.
2. **The model can double the cost** for the same task (gpt-4.1-mini versus gpt-5.5).
3. **The free plan's 1,000 one-time credits do not cover one month** of this small agent.
4. **Loops multiply everything**: summarising each urgent email in a second agent call, or looping over attachments, adds a model charge per iteration.

### What this means for the estimator

An estimate needs, for each block: the model, the expected input and output tokens, the tools called, and how many times the block runs (loops, branches taken). Then: monthly volume, plan, and BYOK or hosted. Everything else (price table, base fee, credit value) is public in Sim's docs and code, so the estimate can be computed without running the agent.

### Open questions

- How retries and fallback models are charged (not documented).
- What the Evaluator and Guardrails blocks cost.
- Whether a workflow export (JSON/YAML) contains enough information (models, loops) to compute the estimate automatically.
