// Pure cost logic for a Sim workflow, before any run.
// Spec: method/C (V1), method/D (V2), method/F (V3: fixes from six real runs).

import {
  BASE_FEE_CREDITS,
  CREDITS_PER_USD,
  MODELS,
  PLANS,
  type ModelPrice,
  type PlanId,
  USD_PER_CREDIT,
} from "./prices.ts";

export type KeyMode = "hosted" | "byok";

export type Block = {
  id: string;
  name: string;
  /** A model id from MODELS, or "custom" */
  modelId: string;
  customInput?: number;
  customOutput?: number;
  /** Prompt length in tokens (the UI converts characters ÷ 4) */
  promptTokens: number;
  /** Typical answer length in tokens */
  outputTokens: number;
  /**
   * V3: some inputs get a longer answer (e.g. urgent emails get a summary).
   * In step F, answers ranged from 22 to 90 tokens depending on the category.
   */
  longAnswer?: { tokens: number; sharePct: number } | null;
  /** Extra model calls when the agent uses tools; each re-sends the context */
  toolTurns: number;
  loopIterations: number;
  /** Share of runs that reach this block, 0–100 */
  sharePct: number;
};

/** One real run, read in Sim's logs (total tokens for the run). */
export type RealRun = { inputTokens: number; outputTokens: number };

export type Workflow = {
  blocks: Block[];
  sampleInputTokens: number;
  toolCallsPerRun: number;
  toolUnitUsd: number;
  monthlyRuns: number;
  keyMode: KeyMode;
  plan: PlanId;
  /** V3: several real runs; their average replaces the estimated tokens. */
  calibration?: RealRun[] | null;
};

export type Line = { label: string; credits: number; providerUsd: number; share: number };

export type RunCost = {
  /** Billed by Sim, per run */
  simCredits: number;
  /** Billed by the model provider (BYOK only), per run */
  providerUsd: number;
  /** Everything together, in USD, per run */
  totalUsd: number;
  lines: Line[];
  inputTokens: number;
  outputTokens: number;
};

export type Estimate = {
  mode: "estimate" | "calibrated";
  calibrationRuns: number;
  low: RunCost;
  expected: RunCost;
  high: RunCost;
  monthly: { low: number; expected: number; high: number };
  driver: string;
  whatIf: { label: string; monthlyUsd: number; delta: number }[];
  planFit: { label: string; warning?: string; detail: string };
  notes: string[];
  summary: string;
};

export const charsToTokens = (chars: number) => Math.ceil(chars / 4);

export function priceOf(block: Block): ModelPrice {
  if (block.modelId === "custom") {
    return {
      id: "custom",
      label: "Custom model",
      input: block.customInput ?? 0,
      output: block.customOutput ?? 0,
    };
  }
  return MODELS.find((m) => m.id === block.modelId) ?? MODELS[0];
}

/** Tokens for one pass through a block, including tool-call turns. */
export function blockTokens(inputPerCall: number, outputPerCall: number, toolTurns: number) {
  const turns = Math.max(0, Math.floor(toolTurns));
  const calls = 1 + turns;
  // Turn k re-sends the original input plus the k previous outputs.
  const input = calls * inputPerCall + (outputPerCall * turns * (turns + 1)) / 2;
  const output = calls * outputPerCall;
  return { input, output, calls };
}

/** Output per call for a scenario: the short/long mix, or one end of it. */
function outputFor(b: Block, which: "expected" | "low" | "high"): number {
  const long = b.longAnswer && b.longAnswer.sharePct > 0 ? b.longAnswer : null;
  if (!long) {
    // V3: step F showed real answers far below the guess, so the low end is −70%.
    return b.outputTokens * (which === "low" ? 0.3 : which === "high" ? 1.3 : 1);
  }
  const share = Math.min(100, long.sharePct) / 100;
  if (which === "low") return b.outputTokens * 0.8;
  if (which === "high") return Math.max(b.outputTokens, long.tokens) * 1.2;
  return (1 - share) * b.outputTokens + share * long.tokens;
}

type Scenario = { which: "expected" | "low" | "high"; inputFactor: number; noToolTurns: boolean };

const EXPECTED: Scenario = { which: "expected", inputFactor: 1, noToolTurns: false };

function runCost(wf: Workflow, s: Scenario, tokenScale = { input: 1, output: 1 }): RunCost {
  const hosted = wf.keyMode === "hosted";
  const rows: { label: string; modelUsd: number }[] = [];
  let inputTokens = 0;
  let outputTokens = 0;

  for (const b of wf.blocks) {
    const price = priceOf(b);
    const inPerCall = (b.promptTokens + wf.sampleInputTokens) * s.inputFactor * tokenScale.input;
    const outPerCall = outputFor(b, s.which) * tokenScale.output;
    const t = blockTokens(inPerCall, outPerCall, s.noToolTurns ? 0 : b.toolTurns);
    const reach = Math.max(0, b.loopIterations) * (Math.min(100, Math.max(0, b.sharePct)) / 100);
    const inTok = t.input * reach;
    const outTok = t.output * reach;
    inputTokens += inTok;
    outputTokens += outTok;
    rows.push({
      label: `${b.name || "Agent"} (${price.label})`,
      modelUsd: (inTok * price.input + outTok * price.output) / 1_000_000,
    });
  }

  const toolsUsd = Math.max(0, wf.toolCallsPerRun) * Math.max(0, wf.toolUnitUsd);
  const lines: Line[] = [
    { label: "Base fee", credits: BASE_FEE_CREDITS, providerUsd: 0, share: 0 },
    ...rows.map((r) => ({
      label: r.label,
      credits: hosted ? r.modelUsd * CREDITS_PER_USD : 0,
      providerUsd: hosted ? 0 : r.modelUsd,
      share: 0,
    })),
  ];
  if (toolsUsd > 0) {
    lines.push({ label: "Paid tools", credits: toolsUsd * CREDITS_PER_USD, providerUsd: 0, share: 0 });
  }

  const simCredits = lines.reduce((a, l) => a + l.credits, 0);
  const providerUsd = lines.reduce((a, l) => a + l.providerUsd, 0);
  const totalUsd = simCredits * USD_PER_CREDIT + providerUsd;
  for (const l of lines) {
    l.share = totalUsd > 0 ? (l.credits * USD_PER_CREDIT + l.providerUsd) / totalUsd : 0;
  }
  return { simCredits, providerUsd, totalUsd, lines, inputTokens, outputTokens };
}

const usd = (n: number) =>
  n >= 100 ? `$${Math.round(n).toLocaleString("en-US")}` : `$${n.toFixed(n >= 1 ? 2 : 4)}`;
const pct = (n: number) => `${Math.round(n * 100)}%`;

function driverSentence(c: RunCost): string {
  const top = [...c.lines].sort((a, b) => b.share - a.share)[0];
  if (!top) return "";
  if (top.label === "Base fee") {
    return `The base fee is ${pct(top.share)} of the cost: the number of runs matters more than the model.`;
  }
  if (top.label === "Paid tools") {
    return `Paid tools are ${pct(top.share)} of the cost: fewer tool calls per run is the main lever.`;
  }
  return `${top.label} is ${pct(top.share)} of the cost: the model, the answer length and the loop size are the levers.`;
}

export function estimate(wf: Workflow): Estimate {
  const runsIn = (wf.calibration ?? []).filter((r) => r.inputTokens > 0 && r.outputTokens > 0);
  const calibrated = runsIn.length > 0;
  const base = runCost(wf, EXPECTED);
  const scaleFor = (r: RealRun) => ({
    input: base.inputTokens > 0 ? r.inputTokens / base.inputTokens : 1,
    output: base.outputTokens > 0 ? r.outputTokens / base.outputTokens : 1,
  });

  let expected: RunCost, low: RunCost, high: RunCost, scale = { input: 1, output: 1 };
  if (calibrated) {
    // V3: average several real runs; the range is the cheapest and dearest real run.
    const avg = {
      inputTokens: runsIn.reduce((a, r) => a + r.inputTokens, 0) / runsIn.length,
      outputTokens: runsIn.reduce((a, r) => a + r.outputTokens, 0) / runsIn.length,
    };
    scale = scaleFor(avg);
    expected = runCost(wf, EXPECTED, scale);
    const perRun = runsIn.map((r) => runCost(wf, EXPECTED, scaleFor(r)));
    const sorted = perRun.sort((a, b) => a.totalUsd - b.totalUsd);
    if (runsIn.length >= 2) {
      low = sorted[0];
      high = sorted[sorted.length - 1];
    } else {
      low = runCost(wf, { ...EXPECTED, inputFactor: 0.9 }, { input: scale.input, output: scale.output * 0.5 });
      high = runCost(wf, { ...EXPECTED, inputFactor: 1.1 }, { input: scale.input, output: scale.output * 1.5 });
    }
  } else {
    expected = base;
    low = runCost(wf, { which: "low", inputFactor: 0.9, noToolTurns: true });
    high = runCost(wf, { which: "high", inputFactor: 1.3, noToolTurns: false });
  }

  const runs = Math.max(0, wf.monthlyRuns);
  const monthly = { low: low.totalUsd * runs, expected: expected.totalUsd * runs, high: high.totalUsd * runs };

  // What if
  const cheapest = [...MODELS].sort((a, b) => a.input + a.output - (b.input + b.output))[0];
  const variants: { label: string; wf: Workflow }[] = [
    { label: "Volume doubles", wf: { ...wf, monthlyRuns: runs * 2 } },
    {
      label: `Every block on ${cheapest.label}`,
      wf: { ...wf, blocks: wf.blocks.map((b) => ({ ...b, modelId: cheapest.id })) },
    },
    {
      label: "Loop iterations halved",
      wf: { ...wf, blocks: wf.blocks.map((b) => ({ ...b, loopIterations: Math.max(1, b.loopIterations / 2) })) },
    },
  ];
  const hasLoop = wf.blocks.some((b) => b.loopIterations > 1);
  const whatIf = variants
    .filter((v) => hasLoop || v.label !== "Loop iterations halved")
    .map((v) => {
      const m = runCost(v.wf, EXPECTED, scale).totalUsd * Math.max(0, v.wf.monthlyRuns);
      return { label: v.label, monthlyUsd: m, delta: monthly.expected > 0 ? m / monthly.expected - 1 : 0 };
    });

  // Plan fit (Sim credits only; the provider bill is outside the plan)
  const plan = PLANS[wf.plan];
  const monthlyCredits = expected.simCredits * runs;
  let planFit: Estimate["planFit"];
  if (!plan.recurring) {
    const months = monthlyCredits > 0 ? plan.credits / monthlyCredits : Infinity;
    planFit = {
      label:
        months === Infinity
          ? "No credits used"
          : months >= 1
            ? `Covers about ${months.toFixed(1)} months`
            : `Covers about ${Math.round(months * 30)} days`,
      detail: plan.note,
      warning:
        wf.keyMode === "hosted" && !plan.hostedModels
          ? "Hosted models don't run on Free. Switch to your own keys (BYOK) or a paid plan."
          : undefined,
    };
  } else {
    const used = plan.credits > 0 ? monthlyCredits / plan.credits : 0;
    planFit = {
      label: `Uses ${pct(used)} of the monthly credits`,
      detail: plan.note,
      warning: used > 1 ? "Over the monthly allowance: usage stops unless on-demand overage is on." : undefined,
    };
  }

  // V3 notes, from what the real runs showed
  const notes: string[] = [
    "Failed runs are charged too: each costs the 1-credit base fee (seen in step F).",
  ];
  if (wf.keyMode === "byok") {
    notes.push("With your own keys, Sim's logs show the model cost as $0: check the provider's bill for that part.");
  }
  if (calibrated && runsIn.length < 3) {
    notes.push("Calibrated on fewer than 3 runs: add runs with different inputs for a reliable average.");
  }
  if (!calibrated && wf.blocks.some((b) => !b.longAnswer || b.longAnswer.sharePct === 0)) {
    notes.push("Answer length is the main uncertainty. If some inputs get a longer answer, set it per block.");
  }

  const driver = driverSentence(expected);
  const modeLabel = calibrated
    ? `calibrated on ${runsIn.length} real run${runsIn.length === 1 ? "" : "s"}`
    : "estimated without running";
  const doubled = whatIf[0].monthlyUsd;
  const summary = [
    `Monthly cost: about ${usd(monthly.expected)} for ${runs.toLocaleString("en-US")} runs (${modeLabel}).`,
    `Range: ${usd(monthly.low)} to ${usd(monthly.high)}.`,
    `Main driver: ${driver}`,
    wf.keyMode === "byok"
      ? `Split across two bills: ${Math.round(monthlyCredits).toLocaleString("en-US")} Sim credits and ${usd(expected.providerUsd * runs)} to the model provider.`
      : `Billed by Sim: ${Math.round(monthlyCredits).toLocaleString("en-US")} credits a month, on the ${PLANS[wf.plan].label.split(" ")[0]} plan.`,
    `If volume doubles: about ${usd(doubled)} a month.`,
  ].join("\n");

  return {
    mode: calibrated ? "calibrated" : "estimate",
    calibrationRuns: runsIn.length,
    low,
    expected,
    high,
    monthly,
    driver,
    whatIf,
    planFit,
    notes,
    summary,
  };
}
