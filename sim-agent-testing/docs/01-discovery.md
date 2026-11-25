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
| Testing before production | Can I run the agent on 20 sample emails and see how many it classifies correctly before deploying? | | |
| Cost prediction | Can I estimate what 1,000 emails a month will cost? | | |
| Human approval | Can the agent wait for a person to approve before writing to the CRM? | | |
| Error handling | What happens when the model misclassifies an email or the CRM call fails? | | |

## Session notes

Recording: (link)

| Time | What I tried | What happened | Product gap? |
|---|---|---|---|
| | | | |
