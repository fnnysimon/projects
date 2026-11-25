## Agent Cost Preview for Sim — Process & Iteration

### The Problem

Sim shows what an agent run cost only after it has run, as one total per run. A builder who needs budget approval has to spend credits on test runs, then rebuild the monthly figure in a spreadsheet — 7 actions, and still no idea which block drives the bill.

### The Design Decision

A one-page preview that puts the levers first: a sentence naming what drives the cost, then one monthly figure with its range, then "what if" (volume ×2, cheaper model, fewer loops). The figure comes before any run — and a few real runs pasted from Sim's logs turn the estimate into a calibrated one.

### Deliberately Tight Scope

- 1 page, 3 actions: pick a preset or describe the blocks, enter runs per month, copy the 5-line summary for the budget owner
- No Sim account, no API key, no backend: everything runs in the browser
- No change to Sim's interface: a standalone page next to the product
- Goal: prove a cost can be predicted before deploying, within ±20% of real runs — not ship a full product

### Iteration 1 → Iteration 2

This is where the real thinking happened. After a working first version, I ran the agent 6 times in Sim and compared every number with the estimate:

| Before | After | Why |
| --- | --- | --- |
| One guessed answer length (120 tokens) | Short answer + long answer, with the share of inputs that get it | Real answers ran from 22 to 90 tokens: urgent emails get a summary, the others don't — one guess overestimated the model cost by 120% |
| Calibrate on 1 real run | Average of 3 to 5 runs, range = cheapest to dearest run | Calibrating on one run still left a 47% error — one run is one data point |
| Low end of the range: answer −30% | −70% | 5 of 6 real runs fell below the old low end — a range that misses reality is decoration |
| Failed runs not counted | Note: failed runs are charged too | 9 failed runs in the test cost 1 credit each, even those that failed in 30 ms |
| BYOK model cost read from Sim's logs | Note: check the provider's bill | With your own key, Sim logs the model cost as $0 |
| gemini-2.5-flash-lite in the model list | Removed | Still offered in Sim, but Google refuses it to new users — the run fails with a 404 |

Before that, two fixes on the first draft generated in v0: the BYOK monthly total left out the provider bill, and calibration gave every block the same tokens. I rewrote the logic as pure functions with 14 tests against hand-worked examples.

### What This Demonstrates

Not just the ability to prototype a tool — the ability to **test my own numbers against reality and redesign around what broke** (answer length per branch, a range that actually contains the real runs, charges the product doesn't show), and to say plainly where the estimate was right for the wrong reason: the total landed within 4% only because Sim's base fee is 97% of this agent's cost.

### Links

- **Live Demo**: https://costly-silk.vercel.app
- **GitHub Repository**: https://github.com/fnnysimon/projects/tree/main/sim-agent-testing

---
