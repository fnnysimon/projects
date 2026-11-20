# Tolerance — disposition workbench

A concept interface for **agentic AI in aircraft maintenance**. AI agents draft the technical decision for each defect found during an inspection. A maintenance engineer reviews the draft, checks its sources, edits or rejects it, and signs.

Built as a design-engineering exercise. Unaffiliated with any company. Aircraft, people, manual excerpts and records are fictional.

## The problem

During a heavy check, inspectors log dozens of *findings* (dents, leaks, corrosion…). For each one, an engineer has to find the right manual section, compare the measurement with the published limit, look at past cases, and write a *disposition* (no action, repair, or refer to the manufacturer). That takes 2 to 6 hours per finding. An agent can draft it in seconds. The hard part is the interface: **how does an engineer trust a draft enough to sign it, quickly and safely?**

## Design decisions

| Decision | Why |
|---|---|
| Every claim carries a citation chip that opens the exact source passage, highlighted | Trust in aviation comes from traceability, not from the model sounding confident |
| A measured-vs-limit gauge sits above the draft | The engineer can check the verdict in one glance before reading a word |
| The agent shows its reasoning steps, then streams the draft | Makes the work visible, and the delay reads as effort rather than lag |
| The agent asks when a limit is ambiguous (F-2042) instead of guessing | A wrong confident answer costs more than a question |
| Edits are tracked as a word diff against the agent's draft | Accountability: who wrote what is always visible |
| Signing is press-and-hold, with single, double or triple sign-off | An airworthiness signature should feel deliberate, never a stray click |
| Keyboard-first (J/K, A, E, N, ⌘K) and an SLA-sorted queue | Engineers clear dozens of findings per shift |
| Violet is reserved for agent-generated content | You always know what the AI wrote versus what a human wrote |

## Try it

```bash
npm install
npm run dev
```

Open http://localhost:3000, then:

1. Watch F-2041's draft stream, click the blue citation chips, and check the evidence panel.
2. Press **A** to accept, then **hold** the sign button. Simulate the inspector's signature.
3. Open **F-2042** (needs input) and answer the agent's question.
4. Press **E** to edit a draft, save, then click *show changes*.
5. Press **⌘K** / **Ctrl+K** to search, and switch to dark mode.

## Stack

Next.js (App Router), React, TypeScript, Tailwind CSS v4, Motion. Design tokens live in `src/app/globals.css`; reusable primitives in `src/components/ui.tsx`.

```
src/
  app/            layout, tokens, page
  components/     Workbench, FindingsQueue, ReviewPanel, AgentDraft,
                  EvidencePanel, LimitGauge, Signoff, AircraftMap, CommandPalette, ui
  lib/            types, demo data, state reducer, draft tokenizer and diff
```
