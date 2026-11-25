# H. Write it up

Status: validated · [Back to the method](../README.md)

**Goal:** turn the work into a story recruiters read in two minutes.

## 1. Case study

**Illustrated report (the main deliverable):** [report/case-study.pdf](report/case-study.pdf) · [report/case-study.html](report/case-study.html) (one self-contained file, easy to send)

A mix of `/rp` (Problem → Design decision → Scope → Iteration 1 → 2 → What this demonstrates) and `/doc` (real before/after screenshots of each version, changes circled in red and numbered). 15 pages, 15 screenshots of the v0 draft, the step E version and the final V3, each built from its saved code.

**Key numbers in the report**

| Metric | Result |
|---|---|
| User path, "agent built" → "monthly figure in hand" | 7 → 3 actions (**−57%**), no run, no credits, no key |
| Error on the total cost per run, V2 → V3 | +4% → 0% (target ±20%) |
| Error on the answer length, V2 → V3 | +177% → −17% |
| Error on the model cost (provider bill), V2 → V3 | +120% → −9% |
| Real runs inside the estimated range, V2 → V3 | 1/6 → 6/6 |
| Tests on the cost logic | 0 (v0 draft) → 14 |
| Error on Sim's own bill | 0% (1 credit per run, 6 of 6) |
| Product gaps found in Sim | 3 |
| Cost of the check | 15 free Sim credits, $0 |

V3's answer lengths were set from the same 6 runs, so its accuracy is in-sample, not an independent test. The report says so.

**Text-only version:** [case-study.md](case-study.md), for a portfolio page or a README.

## 2. Message to Sim (Founding Design Engineer)

Updated from the first version, which only mentioned the interviews at Banque Transatlantique. It now leads with the work and the link. About 70 words.

> Hi [Name], I'm Fanny, MS student at ENSTA Paris and former PM intern on an AI & CRM product (25 user interviews).
>
> I used Sim on a real case, a bank email-sorting agent, and hit a gap: you can't see what an agent will cost before deploying it. So I built a cost preview and checked it against 6 real runs (total within 4%): costly-silk.vercel.app
>
> I'd love to keep doing this as your Founding Design Engineer. Open to a quick chat?
>
> Best, Fanny

**Optional second message**, if they reply or ask for more:

> The full process is here: github.com/fnnysimon/projects/tree/main/sim-agent-testing. Along the way I found 3 small gaps in Sim: failed runs are charged, the model cost shows as $0 in the logs with your own key, and a model retired by Google is still offered. Happy to walk you through them.

**Where it would live in Sim** (from [step D](../D-stress-test-the-idea/)): a pre-deploy check next to the Deploy button, showing the monthly cost and its main driver before the agent goes live. Not built: this project doesn't change Sim's interface.

## Still open

- "Readable without Sim": show the budget-owner summary to 3 people who never used Sim (target from [step C](../C-frame-it-as-a-pm/)).
- Need validation: show the prototype to 5 builders; stop signal if fewer than 3 say they needed it ([step D](../D-stress-test-the-idea/)).
