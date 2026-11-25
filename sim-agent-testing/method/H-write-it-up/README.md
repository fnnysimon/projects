# H. Write it up

Status: validated · [Back to the method](../README.md)

> [!IMPORTANT]
> **A proposed solution to the "cost review" problem of AI agents.**
> Today, nobody can review what an agent will cost before it goes live: in Sim, the cost only shows after each run. The Agent cost preview is my proposal to fill that gap.
> **Live:** [costly-silk.vercel.app](https://costly-silk.vercel.app) · **Case study:** [report/case-study.pdf](report/case-study.pdf)

**Goal:** turn the work into a story recruiters read in two minutes.

## 1. Case study

**Illustrated report (the main deliverable):** [report/case-study.pdf](report/case-study.pdf) · [report/case-study.html](report/case-study.html) (one self-contained file, easy to send)

A mix of `/rp` (Problem → Design decision → Scope → Iteration 1 → 2 → What this demonstrates) and `/doc` (real before/after screenshots of each version, changes circled in red and numbered). 16 pages, 15 screenshots of the v0 draft, the step E version and the final V3, each built from its saved code.

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
