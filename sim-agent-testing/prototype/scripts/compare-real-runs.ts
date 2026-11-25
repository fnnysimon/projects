// Step F: compares the estimator with 6 real Sim runs (gemini-3.5-flash-lite, BYOK, 2026-11-25).
// Real token counts come from Sim's run logs. Run: node scripts/compare-real-runs.ts
import { estimate, charsToTokens } from "../lib/estimate.ts";
const prompt = "You are an assistant for a bank advisor. Classify this client email as urgent, normal or spam. Urgent = fraud, blocked card, payment deadline today, account access lost. Reply with the category, a one-line reason, and if urgent a 3-line summary.\n\nEmail: ";
const runs = [
  { name: "1 urgent, short", chars: 133, inR: 91, outR: 68 },
  { name: "2 normal, medium (a)", chars: 460, inR: 155, outR: 23 },
  { name: "2 normal, medium (b)", chars: 460, inR: 155, outR: 28 },
  { name: "3 spam", chars: 262, inR: 123, outR: 22 },
  { name: "4 normal, long", chars: 1375, inR: 388, outR: 29 },
  { name: "5 urgent, fraud", chars: 550, inR: 198, outR: 90 },
];
const P = { in: 0.3, out: 2.5 };
const usd = (i: number, o: number) => (i * P.in + o * P.out) / 1e6;
console.log("prompt chars", prompt.length, "tokens", charsToTokens(prompt.length));
let sumE = 0, sumR = 0, sumEi = 0, sumRi = 0, sumEo = 0, sumRo = 0;
for (const r of runs) {
  const wf: any = { blocks: [{ id: "a", name: "Classifier", modelId: "gemini-3.5-flash-lite", promptTokens: charsToTokens(prompt.length), outputTokens: 120, toolTurns: 0, loopIterations: 1, sharePct: 100 }],
    sampleInputTokens: charsToTokens(r.chars), toolCallsPerRun: 0, toolUnitUsd: 0, monthlyRuns: 1000, keyMode: "byok", plan: "free", calibration: null };
  const e = estimate(wf);
  const realUsd = usd(r.inR, r.outR);
  sumE += e.expected.providerUsd; sumR += realUsd; sumEi += e.expected.inputTokens; sumRi += r.inR; sumEo += e.expected.outputTokens; sumRo += r.outR;
  const inRange = realUsd >= e.low.providerUsd && realUsd <= e.high.providerUsd;
  console.log([r.name, e.expected.inputTokens, r.inR, pct(e.expected.inputTokens, r.inR), e.expected.outputTokens, r.outR, e.expected.simCredits, (e.expected.providerUsd*1e6).toFixed(0), (realUsd*1e6).toFixed(0), pct(e.expected.providerUsd, realUsd), inRange].join(" | "));
}
function pct(est: number, real: number) { return ((est / real - 1) * 100).toFixed(0) + "%"; }
console.log("TOTAL input", sumEi, sumRi, pct(sumEi, sumRi), "output", sumEo, sumRo, pct(sumEo, sumRo), "provider usd", pct(sumE, sumR));
// Total per run incl. Sim base fee ($0.005)
const tE = sumE / runs.length + 0.005, tR = sumR / runs.length + 0.005;
console.log("avg total per run (Sim + provider) est", tE.toFixed(7), "real", tR.toFixed(7), pct(tE, tR));
// Calibrated on run 1, applied to others
const k = { in: 91 / (charsToTokens(prompt.length) + charsToTokens(133)), out: 68 / 120 };
let sumC = 0;
for (const r of runs.slice(1)) { const i = (charsToTokens(prompt.length) + charsToTokens(r.chars)) * k.in, o = 120 * k.out; sumC += usd(i, o); }
const realRest = runs.slice(1).reduce((a, r) => a + usd(r.inR, r.outR), 0);
console.log("calibrated on run 1, provider usd on runs 2-6:", pct(sumC, realRest));
// Monthly 1,000 emails, average real
console.log("monthly 1000: Sim $", (1000*0.005).toFixed(2), "provider est $", (sumE/runs.length*1000).toFixed(3), "real $", (sumR/runs.length*1000).toFixed(3));
