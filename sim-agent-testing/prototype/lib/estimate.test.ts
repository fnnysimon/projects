// Run with: npm test
import { test } from "node:test";
import assert from "node:assert/strict";
import { blockTokens, charsToTokens, estimate, type Workflow } from "./estimate.ts";
import { PRESETS } from "./presets.ts";

const preset = (id: string) => structuredClone(PRESETS.find((p) => p.id === id)!.workflow);
const close = (a: number, b: number, tol = 0.01) => assert.ok(Math.abs(a - b) <= tol, `${a} ≈ ${b}`);

/** The step A worked example: 550 input tokens, 120 output tokens, one call. */
const stepA = (modelId: string): Workflow => ({
  blocks: [{ id: "a", name: "Classifier", modelId, promptTokens: 300, outputTokens: 120, toolTurns: 0, loopIterations: 1, sharePct: 100 }],
  sampleInputTokens: 250,
  toolCallsPerRun: 0,
  toolUnitUsd: 0,
  monthlyRuns: 1000,
  keyMode: "hosted",
  plan: "pro",
  calibration: null,
});

test("step A example: ~1.08 credits per run, ~$5.40 a month, base fee 92%", () => {
  const e = estimate(stepA("gpt-4.1-mini"));
  close(e.expected.simCredits, 1.082, 0.001);
  close(e.monthly.expected, 5.41, 0.01);
  assert.match(e.driver, /base fee is 92%/i);
});

test("step A example on gpt-5.5: ~2.27 credits", () => {
  close(estimate(stepA("gpt-5.5")).expected.simCredits, 2.27, 0.001);
});

test("research agent matches step D: ~47 credits per run, ~$235 a month", () => {
  const e = estimate(preset("research"));
  close(e.expected.simCredits, 47, 0.01);
  close(e.monthly.expected, 235, 0.1);
  assert.match(e.driver, /gpt-5.5/);
});

test("BYOK moves model cost to the provider bill, base fee stays", () => {
  const wf = stepA("gpt-4.1-mini");
  wf.keyMode = "byok";
  const e = estimate(wf);
  close(e.expected.simCredits, 1, 1e-9);
  close(e.expected.providerUsd, 0.000412, 1e-6);
  assert.ok(e.notes.some((n) => n.includes("$0")));
});

test("tool turns re-send the context", () => {
  const t = blockTokens(500, 100, 2);
  assert.equal(t.calls, 3);
  assert.equal(t.input, 3 * 500 + 100 + 200);
  assert.equal(t.output, 300);
});

test("condition share and loops scale the block", () => {
  const wf = preset("research");
  wf.blocks[0].sharePct = 50;
  wf.toolCallsPerRun = 0;
  close(estimate(wf).expected.simCredits, 1 + 22, 0.01);
});

test("V3: a long answer for some inputs mixes into the expected output", () => {
  const wf = stepA("gpt-4.1-mini");
  wf.blocks[0].outputTokens = 25;
  wf.blocks[0].longAnswer = { tokens: 80, sharePct: 20 };
  const e = estimate(wf);
  close(e.expected.outputTokens, 0.8 * 25 + 0.2 * 80, 1e-9);
  close(e.low.outputTokens, 20, 1e-9); // short answer −20%
  close(e.high.outputTokens, 96, 1e-9); // long answer +20%
});

test("V3: calibration averages several runs; range = cheapest and dearest run", () => {
  const wf = stepA("gpt-4.1-mini");
  wf.calibration = [
    { inputTokens: 500, outputTokens: 30 },
    { inputTokens: 600, outputTokens: 90 },
    { inputTokens: 400, outputTokens: 30 },
  ];
  const e = estimate(wf);
  assert.equal(e.mode, "calibrated");
  assert.equal(e.calibrationRuns, 3);
  close(e.expected.inputTokens, 500, 1e-6);
  close(e.expected.outputTokens, 50, 1e-6);
  close(e.low.inputTokens, 400, 1e-6);
  close(e.high.inputTokens, 600, 1e-6);
});

test("V3: one calibration run warns to add more", () => {
  const wf = stepA("gpt-4.1-mini");
  wf.calibration = [{ inputTokens: 500, outputTokens: 30 }];
  assert.ok(estimate(wf).notes.some((n) => n.includes("fewer than 3 runs")));
});

test("V3: step F data, total per run within ±20% and output within ±20%", () => {
  // Six real runs on gemini-3.5-flash-lite with BYOK (method/F-check-it-against-reality)
  const prompt = 254; // characters
  const real = [
    { chars: 133, in: 91, out: 68 },
    { chars: 460, in: 155, out: 23 },
    { chars: 460, in: 155, out: 28 },
    { chars: 262, in: 123, out: 22 },
    { chars: 1375, in: 388, out: 29 },
    { chars: 550, in: 198, out: 90 },
  ];
  let estTotal = 0, realTotal = 0, estOut = 0, realOut = 0;
  for (const r of real) {
    const wf: Workflow = {
      blocks: [{ id: "a", name: "Classifier", modelId: "gemini-3.5-flash-lite", promptTokens: charsToTokens(prompt), outputTokens: 25, longAnswer: { tokens: 80, sharePct: 20 }, toolTurns: 0, loopIterations: 1, sharePct: 100 }],
      sampleInputTokens: charsToTokens(r.chars), toolCallsPerRun: 0, toolUnitUsd: 0, monthlyRuns: 1, keyMode: "byok", plan: "free", calibration: null,
    };
    const e = estimate(wf);
    estTotal += e.expected.totalUsd;
    realTotal += 0.005 + (r.in * 0.3 + r.out * 2.5) / 1e6;
    estOut += e.expected.outputTokens;
    realOut += r.out;
  }
  assert.ok(Math.abs(estTotal / realTotal - 1) < 0.2, `total ${estTotal} vs ${realTotal}`);
  assert.ok(Math.abs(estOut / realOut - 1) < 0.2, `output ${estOut} vs ${realOut}`);
});

test("Free plan with hosted keys warns; failed-run note always shown", () => {
  const wf = preset("email");
  wf.plan = "free";
  const e = estimate(wf);
  assert.ok(e.planFit.warning);
  assert.ok(e.notes.some((n) => n.startsWith("Failed runs are charged")));
});

test("low <= expected <= high", () => {
  for (const p of PRESETS) {
    const wf = structuredClone(p.workflow);
    wf.blocks[0].toolTurns = 2;
    const e = estimate(wf);
    assert.ok(e.monthly.low <= e.monthly.expected && e.monthly.expected <= e.monthly.high, p.id);
  }
});
