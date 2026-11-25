# C. Frame it as a PM

Status: validated · [Back to the method](../README.md)

**Goal:** turn the need found in [step B](../B-prove-the-need/) into a precise, measurable feature, and a one-page spec for the prototype.

## Problem

> **Builders who need approval to deploy a Sim agent can't tell what it will cost per month or what drives that cost, because Sim only shows the cost of a run after it has run, as a single total. I propose a cost estimator that reads the workflow and gives the cost per run, per month and per block, before any run.**

- **For:** Léa, the builder who prepares the business case, and Marc, the budget owner who approves it ([personas](../B-prove-the-need/#3-personas)).
- **Not for (V1):** teams already in production who want to track actual spend; Sim's logs cover that.

## Success metrics

| Metric | Target | How we check |
|---|---|---|
| **Accuracy:** estimated vs real cost per run | Within ±20% | Step F, one real run in Sim |
| **Shorter path:** actions from "agent built" to "monthly figure in hand" | At least −20% (target −50%) | Count of actions, before vs after (below) |
| **Explainability:** the biggest cost driver is named | 100% of estimates | Built into the output |
| **Readable without Sim:** the summary makes sense to someone who never opened Sim | 3 of 3 test readers understand the monthly figure | Show it to 3 people in step D or F |

## The user path: before and after

**Today** (Léa, using only Sim and a spreadsheet)

| # | Action | Why it hurts |
|---|---|---|
| 1 | Run the agent on a few sample emails | Spends credits; fails on the free plan without an API key |
| 2 | Open the log of each run | One at a time |
| 3 | Read the cost of each run | A total only, no breakdown by block |
| 4 | Find the model's token prices on the provider's site (if BYOK) | Token costs are not in Sim's logs with BYOK |
| 5 | Build a spreadsheet: average cost × monthly volume | Easy to forget the base fee or loop iterations |
| 6 | Work out which block drives the cost | Impossible from a total |
| 7 | Write the business case for the budget owner | Number explained by hand |

**7 actions**, and step 1 needs credits or an API key.

**With the estimator**

| # | Action |
|---|---|
| 1 | Load the workflow (paste the export, or describe the blocks) |
| 2 | Enter the monthly volume |
| 3 | Read the estimate and copy the summary for the budget owner |

**3 actions, −57%**, and no run, no credits, no API key needed. The target of −20% is met even if a step is added later (for example, adjusting the average email length).

## Scope

**V1 (prototype, step E)**
- A standalone web page, next to Sim (not inside it).
- Two ways in: **describe** the agent block by block, or **paste a Sim workflow export** (JSON).
- Works offline from public data: Sim's base fee, credit value and model price table.

**Out of scope for V1**
- Changes inside Sim's editor.
- Calling Sim's API or running the workflow.
- Tracking real spend after deployment.

## Inputs

| Input | Source | Default |
|---|---|---|
| Blocks: type, model, prompt | Workflow export, or typed in | — |
| Sample input (e.g. one typical email) | Pasted by the user | ~400 tokens |
| Expected output length per agent block | Typed in | 150 tokens |
| Loop iterations / parallel branches | Export (`loops`, `parallels`), or typed in | 1 |
| Share of runs that take each branch (after a Condition or Router) | Typed in | 100% |
| Paid tools per run (e.g. a search) | Typed in | None |
| Monthly volume (runs per month) | Typed in | — |
| Key mode: Sim-hosted or BYOK | Chosen | Hosted |
| Plan: Free, Pro, Max | Chosen | Pro |

**Token estimate without running:** tokens ≈ characters ÷ 4 for the prompt plus the sample input; output length as entered. The estimate gives a range (−30% / +30% on tokens) rather than a single number.

## Formula

From Sim's own pricing rules ([step A](../A-understand-how-sim-charges/)):

```
for each agent block b:
    calls(b)      = loop iterations × parallel branches × share of runs reaching b
    model_usd(b)  = calls(b) × (input_tokens(b) × input_price + output_tokens(b) × output_price) / 1,000,000

tools_usd         = sum of paid tool calls × their price

per run:
    sim_credits   = 1                                   (base fee)
                  + 200 × tools_usd                     (hosted tools)
                  + 200 × Σ model_usd(b)                (only if hosted keys)
    provider_usd  = Σ model_usd(b)                      (only if BYOK, paid to the provider)

per month = per run × monthly volume
1 credit = $0.005
```

Prices come from a dated snapshot of Sim's model table ([models.ts](https://github.com/simstudioai/sim/blob/main/apps/sim/providers/models.ts)), including the higher tier for very long inputs.

## Outputs

1. **Cost per run**, in credits and in dollars, with a low / expected / high range.
2. **Cost per month** for the volume entered, with the same range.
3. **Breakdown by line:** base fee, each agent block, each tool, with its share of the total.
4. **Biggest driver** in one sentence, e.g. "The base fee is 92% of the cost: reducing the number of runs matters more than the model."
5. **Model comparison:** the same block with two models side by side.
6. **Plan fit:** how many months the plan's credits cover; on Free, a warning that runs need your own key.
7. **Summary for the budget owner:** five lines to copy (monthly figure, range, drivers, assumptions, what happens if volume doubles).

**Example (the bank email agent, 1,000 emails/month, hosted keys):**

| Line | Per run | Share |
|---|---|---|
| Base fee | 1.00 credit | 92% |
| Classifier agent (gpt-4.1-mini, ~550 in / 120 out tokens) | 0.08 credit | 8% |
| **Total** | **1.08 credits ≈ $0.0054** | |
| **Per month** | **~1,080 credits ≈ $5.40** | |

## Edge cases

| Case | Rule |
|---|---|
| **Loops** (for, forEach, while) | Multiply the blocks inside by the iteration count; for while loops the count is unknown, so ask for an expected number and show it as an assumption |
| **Parallel branches** | Multiply by the number of branches |
| **Condition / Router** | Weight each branch by the share of runs that take it |
| **Retries and fallback models** | Not documented by Sim: excluded from the estimate and listed as a known limit; the high end of the range partly covers it |
| **BYOK** | Show two separate totals: Sim credits (base fee and hosted tools) and the provider's bill (tokens) |
| **Free plan** | Show the estimate, plus a warning that hosted models don't run on Free |
| **Very long inputs** | Apply the long-input price tier when the estimate passes the model's threshold |
| **Unknown model** | Ask for the input and output price per million tokens |
| **Evaluator and Guardrails blocks** | Treated as agent blocks with their model; their exact charging is unconfirmed |
| **Workflow export can't be read** | Fall back to describing the blocks by hand |

## Risks and open questions

- **The need itself** is the riskiest assumption ([step B](../B-prove-the-need/#assumptions-log)): test with 5 builders.
- **Workflow export:** Sim exports a workflow as JSON through its API (`GET /api/v2/workflows/{id}/export`); credentials are cleared. The structure has `blocks`, `edges`, `loops` and `parallels`, but the exact field names for the model and prompt of an agent block are not confirmed. To check with a real export in step E ([export API](https://docs.sim.ai/api-reference/workflows/exportWorkflow.md)).
- **Accuracy:** the token estimate (characters ÷ 4) is a rule of thumb; step F measures the real gap.
