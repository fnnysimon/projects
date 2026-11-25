# Sim agent testing

A product exploration of [Sim](https://sim.ai) (YC P25), the open-source workspace for building, deploying and monitoring AI agents. The goal is not to polish the interface: it is to use Sim on a real use case, find a gap in what the product lets you do, and prototype a feature that fills it.

Unaffiliated exercise.

## Starting hypothesis

Sim covers the whole agent lifecycle: build, deploy (with versioned snapshots), run and monitor. One step looks missing: **checking that an agent behaves correctly before it goes live**. In a regulated field such as banking, you cannot deploy an agent that sorts client emails without knowing how often it gets them wrong.

After the first discovery session, the hypothesis is sharper: Sim has an Evaluator block, but it has a model score one run at a time. There is no way to run a set of test emails with expected answers and get an accuracy rate before deploying, and no way to estimate the cost of a run before it happens. See [discovery notes](docs/01-discovery.md).

## Use case

Sort a bank advisor's client emails, summarise the urgent ones and log them in a CRM.

## Method

| Step | What | Output | Status |
|---|---|---|---|
| 1. Discover | Build the use case end to end in Sim, screen-recorded, thinking out loud | [Discovery notes](docs/01-discovery.md) | Done |
| 2. Spot the gap | Chosen gap: predicting an agent's cost before deploying it. Sub-steps A to H | [Method, steps A to H](method/) | Done (A to H) |

Steps 3 to 6 of the original plan (frame, build, publish, use) are now covered by the [method](method/), one folder per step.

## Contents

- [Product overview](docs/product-overview.md): what Sim does, its strengths, and the gaps to test
- [Discovery notes](docs/01-discovery.md): the use case, the test grid and session notes
- [Prototype](prototype/): the cost estimator (Next.js), with tests. **Live: [costly-silk.vercel.app](https://costly-silk.vercel.app)**
- [Method](method/): the cost estimator, step by step (A. Understand how Sim charges → H. Write it up), each step in its own folder with a README
