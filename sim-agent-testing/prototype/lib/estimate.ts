// Pure cost logic for a Sim workflow, before any run.
// Spec: method/C-frame-it-as-a-pm and method/D-stress-test-the-idea (V2).

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
  outputTokens: number;
  /** Extra model calls when the agent uses tools; each re-sends the context */
  toolTurns: number;
  loopIterations: number;
  /** Share of runs that reach this block, 0–100 */
  sharePct: number;
};

export type Calibration = {
  /** Real input and output tokens of one run, read in Sim's logs */
  inputTokens: number;
  outputTokens: number;
};

export type Workflow = {
  blocks: Block[];
  sampleInputTokens: number;
  toolCallsPerRun: number;
  toolUnitUsd: number;
  monthlyRuns: number;
  keyMode: KeyMode;
  plan: PlanId;
  calibration?: Calibration | null;
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
  low: RunCost;
  expected: RunCost;
  high: RunCost;
  monthly: { low: number; expected: number; high: number };
  driver: string;
  whatIf: { label: string; monthlyUsd: number; delta: number }[];
  planFit: { label: string; warning?: string; detail: string };
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

type Scenario = { inputFactor: number; outputFactor: number; noToolTurns: boolean };

const EXPECTED: Scenario = { inputFactor: 1, outputFactor: 1, noToolTurns: false };

function runCost(wf: Workflow, s: Scenario, tokenScale = { input: 1, output: 1 }): RunCost {
  const hosted = wf.keyMode === "hosted";
  const rows: { label: string; modelUsd: number }[] = [];
  let inputTokens = 0;
  let outputTokens = 0;

  for (const b of wf.blocks) {
    const price = priceOf(b);
    const inPerCall = (b.promptTokens + wf.sampleInputTokens) * s.inputFactor * tokenScale.input;
    const outPerCall = b.outputTokens * s.outputFactor * tokenScale.output;
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
  return `${top.label} is ${pct(top.share)} of the cost: the model, the prompt length and the loop size are the levers.`;
}

export function estimate(wf: Workflow): Estimate {
  const calibrated = !!wf.calibration && wf.calibration.inputTokens > 0 && wf.calibration.outputTokens > 0;

  let scale = { input: 1, output: 1 };
  if (calibrated) {
    const base = runCost(wf, EXPECTED);
    scale = {
      input: base.inputTokens > 0 ? wf.calibration!.inputTokens / base.inputTokens : 1,
      output: base.outputTokens > 0 ? wf.calibration!.outputTokens / base.outputTokens : 1,
    };
  }

  // Estimate: output ±30%, input +30% on the high side, no tool turns on the low side.
  // Calibrated: real tokens are known, so only ±10% for variation between inputs.
  const lowS: Scenario = calibrated
    ? { inputFactor: 0.9, outputFactor: 0.9, noToolTurns: false }
    : { inputFactor: 1, outputFactor: 0.7, noToolTurns: true };
  const highS: Scenario = calibrated
    ? { inputFactor: 1.1, outputFactor: 1.1, noToolTurns: false }
    : { inputFactor: 1.3, outputFactor: 1.3, noToolTurns: false };

  const expected = runCost(wf, EXPECTED, scale);
  const low = runCost(wf, lowS, scale);
  const high = runCost(wf, highS, scale);
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
  const whatIf = variants.filter((v) => hasLoop || v.label !== "Loop iterations halved").map((v) => {
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
      label: months === Infinity ? "No credits used" : months >= 1 ? `Covers about ${months.toFixed(1)} months` : `Covers about ${Math.round(months * 30)} days`,
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

  const driver = driverSentence(expected);
  const modeLabel = calibrated ? "calibrated on one real run" : "estimated without running";
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

  return { mode: calibrated ? "calibrated" : "estimate", low, expected, high, monthly, driver, whatIf, planFit, summary };
}
