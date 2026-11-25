# D. Stress-test the idea

Status: validated · [Back to the method](../README.md)

**Goal:** find the weak points of the [step C spec](../C-frame-it-as-a-pm/) before building, and write a stronger V2.

Made with `/debatexperts`: three expert profiles critique the idea, argue with each other, then rewrite it. Figures marked *(estimate)* are computed from Sim's public prices with assumed token counts.

# 🗣️ Expert Panel: a pre-run cost estimator for Sim

## Step 1: Frontal critique

### 📉 Business Strategist (The Pragmatist)

"Good instinct, wrong example."

- **Flaw 1: the showcase example has no stakes.** The bank agent costs about $5.40 a month. Nobody holds a budget meeting for $5.40. The estimator only matters where cost gets big: loops, large models, paid tools, thousands of runs. V1 demonstrates it on the one case where it is useless.
- **Flaw 2: "92% base fee" is a finding, not a feature.** It's the most interesting thing in the spec, and it only shows up as one line in the output. The real value for Marc is *what changes the bill*: volume, model, loop size. The spec leads with a single number instead of the levers.
- **Flaw 3: the audience is Sim, not only Léa.** This is a portfolio piece. A standalone calculator says "I can build a form". It should also show *where this lives in Sim's product* and why Sim gains from it (enterprise deals, fewer credit tickets).

### ⚙️ Tech/Ops Expert (The Realist)

"The formula is right. The inputs are guesswork."

- **Flaw 1: an agent block is not one model call.** An Agent block that uses tools calls the model, runs the tool, then calls the model again with the result, possibly several times. Every turn re-sends the whole context. V1 counts one call per block. For any agent with tools, the estimate will be low by a factor of 2 to 5 *(estimate)*, far outside ±20%.
- **Flaw 2: output tokens are the biggest unknown, and the user types them in.** Characters ÷ 4 is fine for the input. The output is guessed, and on gpt-5.5 output costs 6× input. A ±30% band on a guessed number isn't a range, it's decoration.
- **Flaw 3: "±20% on one real run" proves nothing.** One email is one data point. A short email and a long one can differ by 2×. The accuracy check needs several runs.
- **Flaw 4: the JSON import is fragile.** The export comes from an API that needs a key, and the field names for model and prompt aren't confirmed. Prices in Sim's code also change. Without a date on the price table, the estimate goes stale silently.

### 🌪️ Devil's Advocate (The Destroyer)

"Nobody asked for this, and the first wrong number kills it."

- **Flaw 1: zero demand evidence.** Step B found no user asking for a pre-run estimate. Building first and asking later is how portfolio pieces become solutions looking for a problem.
- **Flaw 2: Léa will not paste JSON from an API.** Getting an export means an API key and a terminal command. The "3 actions" path is really 3 actions *after* a technical detour. Most builders will drop at step 1.
- **Flaw 3: one wrong estimate destroys trust.** If Marc approves $50 and the bill is $200 because of hidden tool-call turns, Léa looks incompetent and the tool is dead. A precise-looking number is more dangerous than no number.
- **Flaw 4: Sim might not want it.** Showing cost loudly before deploy could scare users away from bigger models or more runs. Sim earns from usage.

## Step 2: The debate

> **⚙️ Realist:** "The Pragmatist wants a big, scary example with loops and gpt-5.5. That's exactly where my tool-call problem explodes. The bigger the example, the worse the accuracy."

> **📉 Pragmatist:** "Then fix the inputs, don't shrink the example. Ask for 'up to how many tool calls per run'. That's one field. A $5 demo convinces nobody; a $235-a-month research agent *(estimate)* does."

> **🌪️ Destroyer:** "One more field won't make Léa trust it. What would make her trust it is seeing it match reality. Let her paste the cost of *one* real run from Sim's logs, and calibrate from that."

> **⚙️ Realist:** "That's actually the best idea here. One real run gives the true token count per call. Then the estimator stops guessing tokens and only projects: volume, loops, model swaps. Accuracy goes from 'rule of thumb' to 'measured'."

> **📉 Pragmatist:** "But that brings back the run we promised to remove. The whole pitch was 'no run, no credits'."

> **⚙️ Realist:** "One run instead of dozens, plus a spreadsheet. Keep both modes: *estimate* without a run, *calibrated* after one. Label which one you're looking at."

> **🌪️ Destroyer:** "And drop JSON as the main path. Describing the blocks takes a minute; the export takes an API key. JSON stays as an option for developers."

> **📉 Pragmatist:** "On Sim not wanting it, I disagree. Sim is hiring account executives and forward-deployed engineers. Enterprise buyers ask 'how much will this cost us?' before signing. A defensible estimate *closes* deals. Surprise bills churn customers."

> **🌪️ Destroyer:** "Maybe. But you're still assuming the need. Before building, five builders should look at a paper version. If three don't care, stop."

> **📉 Pragmatist:** "Five interviews before a one-day prototype is backwards. Build the cheap version, show it in those interviews. A clickable thing gets better answers than a hypothetical."

**Unresolved:** the Destroyer wants proof of need before building; the Pragmatist wants to build the cheap version and use it in the interviews. **Resolution for this project:** build the prototype (step E) and use it as the material for 5 builder conversations, with a clear stop signal.

## Step 3: V2 of the idea

**In one sentence:** a cost preview that shows Léa and Marc **what drives an agent's bill and how it changes with volume, model and loops**, first estimated without running, then calibrated with one real run.

| | V1 (step C) | V2 | Why |
|---|---|---|---|
| **Main output** | A cost figure per run and per month | The levers first: a sentence on what drives the cost, then the figure, then "what if" (volume ×2, cheaper model, fewer loops) | Marc decides on levers, not on a single number |
| **Calls per agent block** | 1 | 1 + up to N tool-call turns (new field, default 0), each re-sending the context | Agents with tools call the model several times |
| **Accuracy mode** | Estimate only (characters ÷ 4, ±30%) | Two modes, clearly labelled: **Estimate** (no run) and **Calibrated** (paste the cost and tokens of one real run from Sim's logs) | One real run replaces guessed token counts |
| **Main entry** | Paste the export JSON, or describe blocks | **Describe** the blocks (with a preloaded example); JSON import as an option | The export needs an API key |
| **Showcase examples** | Bank email agent ($5.40/month) | Two presets: the email agent (base fee 92%) and a research agent with a loop, gpt-5.5 and a web search (~$235/month for 1,000 runs, base fee ~2%) *(estimate)* | Shows both regimes: "runs drive cost" vs "model and loops drive cost" |
| **Range** | ±30% on tokens | Low / expected / high driven by the uncertain inputs (output length, tool-call turns), each named | A range is useful when it says where the uncertainty comes from |
| **Price table** | Snapshot of Sim's model table | Snapshot **with its date** shown on the page, and a link to the source | Prices change; stale numbers must be visible |
| **Accuracy check (step F)** | 1 real run, within ±20% | 3 to 5 runs on emails of different lengths; report the error of each | One run is one data point |
| **Placement** | Standalone page | Standalone page for V1, plus a note in step H on where it would live in Sim (a pre-deploy check next to Deploy) | Shows product thinking without changing Sim's interface |
| **Need validation** | Assumed, test "in parallel" | Prototype used in 5 builder conversations; stop signal: fewer than 3 of 5 say they have needed this | Turns the riskiest assumption into a test with a clear outcome |

**Research agent preset** *(estimate)*: a loop over 10 sources; each iteration calls gpt-5.5 (~2,000 in / 400 out tokens) and one web search ($0.001).
- Model per iteration: (2,000 × 5 + 400 × 30) / 1M = $0.022, so 4.4 credits; × 10 = 44 credits
- Search: 10 × $0.001 = $0.01, so 2 credits
- Base fee: 1 credit
- **Total: ~47 credits ≈ $0.235 per run, ~$235 per 1,000 runs.** The base fee is ~2%; the model and loop size drive everything.

**Updated user path:** 1. pick a preset or describe the blocks → 2. enter the monthly volume → 3. read the levers and copy the summary. Still **3 actions (−57%)**. An optional 4th, "calibrate with one run", raises accuracy; with it the path is 4 actions (−43%), still above the 20% target.

**Action plan:**
1. **Step E:** build V2 in describe mode with the two presets, the tool-call field, the dated price table and the levers. JSON import last, only if time allows.
2. **Step E:** add the calibration mode (paste the cost and token counts of one run).
3. **Step F:** 3 to 5 real runs with your API key; compare estimate vs actual, in both modes.
4. **In parallel:** show the prototype to 5 builders (Sim Discord, n8n community, LinkedIn); record whether they have needed it.
5. **Step H:** write up the result honestly, including a "stop" if the need isn't there, plus where the feature would live in Sim.

## Risks identified | Mitigation

| Risks identified | Mitigation solutions |
|---|---|
| Agents with tools make several model calls, so the estimate comes out too low | "Tool-call turns" field; the context is re-sent on each turn; the high end of the range assumes the max turns |
| Guessed output tokens make the figure unreliable | Calibration mode from one real run; output length named as the main uncertainty |
| One real run is not a valid accuracy test | 3 to 5 runs on varied emails in step F, each error reported |
| The JSON export needs an API key and its fields are unconfirmed | Describe mode is the main path; JSON is optional and checked against a real export |
| Prices change and the estimate goes stale | Price table dated on the page, with a link to Sim's source |
| A wrong number destroys Léa's credibility with Marc | Always show a range and its causes; label "Estimate" vs "Calibrated"; list assumptions in the summary |
| Nobody actually needs a pre-run estimate | 5 builder conversations with the prototype; stop signal below 3 of 5 |
| Sim may fear that showing cost reduces usage | Frame it around enterprise approval and fewer surprise bills; ask Sim's team during outreach |
| Retries and fallback models are not documented | Listed as a known limit; covered partly by the high end of the range |
