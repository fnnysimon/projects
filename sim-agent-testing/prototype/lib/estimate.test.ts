// Run with: node --test lib/estimate.test.ts
import { test } from "node:test";
import assert from "node:assert/strict";
import { blockTokens, estimate } from "./estimate.ts";
import { PRESETS } from "./presets.ts";

const preset = (id: string) => structuredClone(PRESETS.find((p) => p.id === id)!.workflow);
const close = (a: number, b: number, tol = 0.01) => assert.ok(Math.abs(a - b) <= tol, `${a} ≈ ${b}`);

test("email agent matches step A: ~1.08 credits per run, ~$5.40 a month", () => {
  const e = estimate(preset("email"));
  close(e.expected.simCredits, 1.082, 0.001);
  close(e.monthly.expected, 5.41, 0.01);
  assert.match(e.driver, /base fee is 92%/i);
});

test("research agent matches step D: ~47 credits per run, ~$235 a month", () => {
  const e = estimate(preset("research"));
  close(e.expected.simCredits, 47, 0.01);
  close(e.monthly.expected, 235, 0.1);
  assert.match(e.driver, /gpt-5.5/);
});

test("gpt-5.5 email agent matches step A: ~2.27 credits", () => {
  const wf = preset("email");
  wf.blocks[0].modelId = "gpt-5.5";
  close(estimate(wf).expected.simCredits, 2.27, 0.001);
});

test("BYOK moves model cost to the provider bill, base fee stays", () => {
  const wf = preset("email");
  wf.keyMode = "byok";
  const e = estimate(wf);
  close(e.expected.simCredits, 1, 1e-9);
  close(e.expected.providerUsd, 0.000412, 1e-6);
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

test("calibration replaces estimated tokens and narrows the range", () => {
  const wf = preset("email");
  wf.calibration = { inputTokens: 1100, outputTokens: 240 }; // twice the estimate
  const e = estimate(wf);
  assert.equal(e.mode, "calibrated");
  close(e.expected.inputTokens, 1100, 1e-6);
  close(e.expected.simCredits, 1.164, 0.001);
  assert.ok(e.high.totalUsd / e.low.totalUsd < 1.1);
});

test("Free plan with hosted keys warns", () => {
  const wf = preset("email");
  wf.plan = "free";
  assert.ok(estimate(wf).planFit.warning);
});

test("low <= expected <= high", () => {
  for (const p of PRESETS) {
    const wf = structuredClone(p.workflow);
    wf.blocks[0].toolTurns = 2;
    const e = estimate(wf);
    assert.ok(e.monthly.low <= e.monthly.expected && e.monthly.expected <= e.monthly.high, p.id);
  }
});
