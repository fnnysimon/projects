# Sim agent testing

A product exploration of [Sim](https://sim.ai) (YC P25), the open-source workspace for building, deploying and monitoring AI agents. The goal is not to polish the interface: it is to use Sim on a real use case, find a gap in what the product lets you do, and prototype a feature that fills it.

Unaffiliated exercise.

## Starting hypothesis

Sim covers the whole agent lifecycle: build, deploy (with versioned snapshots), run and monitor. One step looks missing: **checking that an agent behaves correctly before it goes live**. In a regulated field such as banking, you cannot deploy an agent that sorts client emails without knowing how often it gets them wrong.

This hypothesis is tested in step 1 and confirmed or replaced in step 2.

## Use case

Sort a bank advisor's client emails, summarise the urgent ones and log them in a CRM.

## Method

| Step | What | Output | Status |
|---|---|---|---|
| 1. Discover | Build the use case end to end in Sim, screen-recorded, thinking out loud | [Discovery notes](docs/01-discovery.md) | In progress |
| 2. Spot the gap | List what Sim can and cannot do; check GitHub issues for other users with the same need | `docs/02-gap.md` | To do |
| 3. Frame | One-sentence problem, target user, success metric, one-page spec | `docs/03-spec.md` | To do |
| 4. Build | Working prototype of the feature, inside Sim or next to it through its API | `prototype/` | To do |
| 5. Publish | Demo, README, deployed link | This README | To do |
| 6. Use | Short case study and outreach to Sim | `docs/06-case-study.md` | To do |

## Contents

- [Product overview](docs/product-overview.md): what Sim does, its strengths, and the gaps to test
- [Discovery notes](docs/01-discovery.md): the use case, the test grid and session notes
