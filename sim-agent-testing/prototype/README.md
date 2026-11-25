# Agent cost preview (prototype)

**Live:** [costly-silk.vercel.app](https://costly-silk.vercel.app)

Estimates what a [Sim](https://sim.ai) workflow will cost per month, and what drives that cost, before it is deployed. Built from the V2 spec in [step D](../method/D-stress-test-the-idea/), with the V3 fixes from the real runs of [step F](../method/F-check-it-against-reality/). Unaffiliated prototype.

## Run it

```
npm install
npm run dev     # http://localhost:3000
npm test        # 14 tests on the cost logic
```

## Structure

| File | What it does |
|---|---|
| `lib/prices.ts` | Dated snapshot of Sim's pricing: base fee, credit value, model prices, plans |
| `lib/estimate.ts` | Pure cost logic: per run, per month, range, breakdown, driver, what-if, plan fit, summary |
| `lib/import-sim.ts` | Best-effort reader for a Sim workflow export (JSON) |
| `lib/presets.ts` | Two examples: email triage agent and research agent |
| `lib/*.test.ts` | Tests against the worked examples of steps A and D |
| `components/agent-cost-preview.tsx` | The page (first draft from v0, rewired to `lib/`) |

Everything runs in the browser; nothing is sent anywhere.
