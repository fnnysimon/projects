# H. Write it up

Status: in progress · [Back to the method](../README.md)

**Goal:** turn the work into a story recruiters read in two minutes.

## 1. Case study

[case-study.md](case-study.md), in the "Problem → Decision → Iteration" format (`/rp`).

In short: Sim shows the cost of a run only after it has run. The preview gives the monthly cost and what drives it before any run. Six real runs in Sim then reshaped it: answer length per branch, calibration on several runs, a wider range, and notes on charges Sim doesn't show.

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
