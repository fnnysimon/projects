# Step 1: discovery

## Use case

Sort a bank advisor's client emails, summarise the urgent ones and log them in a CRM.

Workflow to build in Sim:

1. Trigger: a new email arrives (or a batch of sample emails).
2. Agent: classify the email (urgent / normal / spam) and explain why.
3. Agent: summarise the urgent emails in three lines.
4. Integration: create a record in a CRM (or a Sim table standing in for one).

## Test grid

Fill in during the session: possible, partly possible or impossible, with what you observed.

| Gap | Question | Result | Observation |
|---|---|---|---|
| Testing before production | Can I run the agent on 20 sample emails and see how many it classifies correctly before deploying? | Partly possible | The Evaluator block has a model score **one** output against metrics (e.g. Accuracy 1-5). There is no test set, no expected answers and no accuracy rate; the docs warn scores are not clamped and a failed parse can return 0 without failing. The execute API runs one input at a time, so a batch test has to be scripted outside Sim. ([Evaluator](https://docs.sim.ai/blocks/evaluator)) |
| Cost prediction | Can I estimate what 1,000 emails a month will cost? | Impossible | Cost is shown per run in the logs, after the run (1 credit = $0.005). No estimate before running, and no per-block cost except for the Evaluator. ([Logging](https://docs.sim.ai/execution/logging), [Costs](https://docs.sim.ai/platform/costs)) |
| Human approval | Can the agent wait for a person to approve before writing to the CRM? | Possible | The Human block pauses the run and sends an approval link (Slack, Gmail, Teams, SMS or webhook); the run resumes through an API call. No timeout: a forgotten approval stays pending. ([Human in the loop](https://docs.sim.ai/workflows/blocks/human-in-the-loop)) |
| Error handling | What happens when the model misclassifies an email or the CRM call fails? | Partly possible | A failing block fails the run unless its error port is connected to another path. A **misclassification is not an error**: nothing catches it unless you add a Guardrails or Evaluator check. ([How it runs](https://docs.sim.ai/workflows/how-it-runs), [Guardrails](https://docs.sim.ai/blocks/guardrails)) |

Grid results come from the docs; hands-on runs still need an API key (see below).

## First session (2026-11-25, free plan, by Claude acting as a new user)

| What I tried | What happened | Product gap? |
|---|---|---|
| Asked the home chat to build the workflow | "Paid Plan Required": chat is paid-only, even with 995 credits (same as issue #9620) | Yes: the free plan's credits can't be used for the main entry point |
| Ran the classifier agent with the default model (gemini-4-neon) | Error: hosted key available on paid plans; free users must bring their own API key (BYOK) | Yes |
| Switched to the cheapest model (gpt-5.4-nano) | Same error | Yes: no AI model runs on the free plan without an API key |
| Listed the core blocks | Evaluator, Guardrails, Human (approval), Loop, Parallel, Deployments and Logs exist | Hypotheses 1 and 3 need revising: testing and human approval exist as blocks; the question becomes how well they work |

Not tested yet (needs an API key): running the agent on sample emails, the Evaluator and Human blocks, cost per run, error handling.

## Session notes

Recording: (link)

| Time | What I tried | What happened | Product gap? |
|---|---|---|---|
| | | | |
