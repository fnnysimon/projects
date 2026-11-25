"use client";

// First draft generated with v0, then rewired in Claude Code to the tested logic in lib/.

import { useMemo, useState } from "react";
import { Check, Copy, Plus, Trash2 } from "lucide-react";
import { charsToTokens, estimate, priceOf, type Block, type Workflow } from "@/lib/estimate.ts";
import { importSimExport } from "@/lib/import-sim.ts";
import { PRESETS } from "@/lib/presets.ts";
import { MODELS, PLANS, PRICES_AS_OF, PRICES_SOURCE, type PlanId } from "@/lib/prices.ts";

const field =
  "w-full rounded-md border border-input bg-background px-3 py-2 text-sm outline-none focus-visible:ring-2 focus-visible:ring-ring";
const label = "mb-1.5 block text-xs font-medium text-muted-foreground";
const card = "rounded-lg border border-border bg-card p-5";

const usd = (n: number) =>
  n >= 1000
    ? `$${Math.round(n).toLocaleString("en-US")}`
    : `$${n.toFixed(n >= 1 ? 2 : n >= 0.01 ? 3 : 5)}`;
const num = (n: number) => new Intl.NumberFormat("en-US", { maximumFractionDigits: n < 10 ? 2 : 0 }).format(n);
const pct = (n: number) => `${Math.round(n * 100)}%`;
const fresh = (wf: Workflow): Workflow => structuredClone(wf);

let nextId = 100;
const newBlock = (n: number): Block => ({
  id: `b${nextId++}`,
  name: `Agent ${n}`,
  modelId: "gpt-4.1-mini",
  promptTokens: 0,
  outputTokens: 150,
  toolTurns: 0,
  loopIterations: 1,
  sharePct: 100,
});

export function AgentCostPreview() {
  const [presetId, setPresetId] = useState("email");
  const [wf, setWf] = useState<Workflow>(() => fresh(PRESETS[0].workflow));
  const [cal, setCal] = useState("");
  const [importText, setImportText] = useState("");
  const [importMsg, setImportMsg] = useState<{ ok: boolean; lines: string[] } | null>(null);
  const [copied, setCopied] = useState(false);

  const result = useMemo(() => estimate(wf), [wf]);
  const set = (patch: Partial<Workflow>) => setWf((w) => ({ ...w, ...patch }));
  const setBlock = (id: string, patch: Partial<Block>) =>
    setWf((w) => ({ ...w, blocks: w.blocks.map((b) => (b.id === id ? { ...b, ...patch } : b)) }));

  const choosePreset = (id: string) => {
    setPresetId(id);
    setWf(fresh(PRESETS.find((p) => p.id === id)!.workflow));
    setCal("");
    setImportMsg(null);
  };

  const updateCal = (text: string) => {
    setCal(text);
    const runs = text
      .split(/\n/)
      .map((l) => l.match(/(\d[\d,]*)\D+(\d[\d,]*)/))
      .filter((m): m is RegExpMatchArray => !!m)
      .map((m) => ({ inputTokens: Number(m[1].replace(/,/g, "")), outputTokens: Number(m[2].replace(/,/g, "")) }))
      .filter((r) => r.inputTokens > 0 && r.outputTokens > 0);
    set({ calibration: runs.length ? runs : null });
  };

  const runImport = () => {
    try {
      const r = importSimExport(importText);
      if (r.blocks.length) set({ blocks: r.blocks });
      setPresetId("scratch");
      setImportMsg({
        ok: true,
        lines: [
          `Imported ${r.blocks.length} model block${r.blocks.length === 1 ? "" : "s"}.`,
          ...(r.skipped.length ? [`Skipped (no model cost): ${r.skipped.join(", ")}.`] : []),
          ...r.notes,
          "Check the output length and tool turns of each block: the export doesn't contain them.",
        ],
      });
    } catch (e) {
      setImportMsg({ ok: false, lines: [e instanceof Error ? e.message : "Couldn't read this JSON."] });
    }
  };

  const copy = async () => {
    await navigator.clipboard.writeText(result.summary);
    setCopied(true);
    window.setTimeout(() => setCopied(false), 1600);
  };

  const preset = PRESETS.find((p) => p.id === presetId);
  const byok = wf.keyMode === "byok";
  const runs = wf.monthlyRuns;

  return (
    <main className="mx-auto min-h-screen w-full max-w-[1280px] px-4 py-6 sm:px-8">
      <header className="mb-6 flex flex-wrap items-end justify-between gap-3 border-b border-border pb-5">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">Agent cost preview</h1>
          <p className="mt-1 max-w-xl text-sm text-muted-foreground">
            What a Sim workflow will cost per month, and what drives that cost, before you deploy it.
          </p>
        </div>
        <p className="text-xs text-muted-foreground">
          Prices as of <time dateTime={PRICES_AS_OF}>{PRICES_AS_OF}</time> ·{" "}
          <a className="underline underline-offset-2" href={PRICES_SOURCE} target="_blank" rel="noreferrer">
            source
          </a>
        </p>
      </header>

      <div className="grid items-start gap-6 lg:grid-cols-2 lg:gap-8">
        {/* ── Inputs ───────────────────────────── */}
        <section aria-label="Workflow" className="flex min-w-0 flex-col gap-5">
          <div className={card}>
            <div className="grid gap-4 sm:grid-cols-2">
              <F label="1. Start from" id="preset">
                <select id="preset" className={field} value={presetId} onChange={(e) => choosePreset(e.target.value)}>
                  {PRESETS.map((p) => (
                    <option key={p.id} value={p.id}>
                      {p.label}
                    </option>
                  ))}
                </select>
              </F>
              <F label="2. Runs per month" id="runs">
                <input id="runs" type="number" min={0} className={field} value={runs}
                  onChange={(e) => set({ monthlyRuns: Math.max(0, Number(e.target.value)) })} />
              </F>
            </div>
            {preset && <p className="mt-2 text-xs text-muted-foreground">{preset.description}</p>}
            <div className="mt-4 grid gap-4 sm:grid-cols-2">
              <F label="Keys" id="keys">
                <select id="keys" className={field} value={wf.keyMode}
                  onChange={(e) => set({ keyMode: e.target.value as Workflow["keyMode"] })}>
                  <option value="hosted">Sim-hosted keys</option>
                  <option value="byok">Your own keys (BYOK)</option>
                </select>
              </F>
              <F label="Sim plan" id="plan">
                <select id="plan" className={field} value={wf.plan} onChange={(e) => set({ plan: e.target.value as PlanId })}>
                  {(Object.keys(PLANS) as PlanId[]).map((p) => (
                    <option key={p} value={p}>{PLANS[p].label}</option>
                  ))}
                </select>
              </F>
            </div>
          </div>

          <div className={card}>
            <div className="mb-4 flex items-center justify-between gap-3">
              <div>
                <h2 className="text-base font-semibold">Model blocks</h2>
                <p className="mt-1 text-xs text-muted-foreground">Agent, Router, Evaluator or Guardrails blocks. 1 token ≈ 4 characters.</p>
              </div>
              <button type="button" onClick={() => set({ blocks: [...wf.blocks, newBlock(wf.blocks.length + 1)] })}
                className="inline-flex shrink-0 items-center gap-1.5 rounded-md border border-border px-3 py-2 text-xs font-medium hover:bg-muted">
                <Plus size={14} aria-hidden /> Add block
              </button>
            </div>
            <div className="flex flex-col gap-4">
              {wf.blocks.map((b, i) => {
                const price = priceOf(b);
                return (
                  <article key={b.id} className="rounded-md border border-border p-4">
                    <div className="mb-3 flex items-center justify-between">
                      <input aria-label={`Block ${i + 1} name`} className="w-full bg-transparent text-sm font-semibold outline-none"
                        value={b.name} onChange={(e) => setBlock(b.id, { name: e.target.value })} />
                      <button type="button" aria-label={`Remove ${b.name}`} disabled={wf.blocks.length === 1}
                        onClick={() => set({ blocks: wf.blocks.filter((x) => x.id !== b.id) })}
                        className="rounded p-1.5 text-muted-foreground hover:bg-muted disabled:opacity-40">
                        <Trash2 size={15} aria-hidden />
                      </button>
                    </div>
                    <div className="grid gap-3 sm:grid-cols-3">
                      <F label="Model" id={`${b.id}-m`}>
                        <select id={`${b.id}-m`} className={field} value={b.modelId} onChange={(e) => setBlock(b.id, { modelId: e.target.value })}>
                          {MODELS.map((m) => <option key={m.id} value={m.id}>{m.label}</option>)}
                          <option value="custom">Other (enter prices)</option>
                        </select>
                      </F>
                      <Num id={`${b.id}-p`} label="Prompt tokens" value={b.promptTokens} onChange={(v) => setBlock(b.id, { promptTokens: v })} />
                      <Num id={`${b.id}-o`} label="Answer tokens (typical)" value={b.outputTokens} onChange={(v) => setBlock(b.id, { outputTokens: v })} />
                      {b.modelId === "custom" && (
                        <>
                          <Num id={`${b.id}-ci`} label="Input $ / 1M tokens" step="any" value={b.customInput ?? 0} onChange={(v) => setBlock(b.id, { customInput: v })} />
                          <Num id={`${b.id}-co`} label="Output $ / 1M tokens" step="any" value={b.customOutput ?? 0} onChange={(v) => setBlock(b.id, { customOutput: v })} />
                          <div />
                        </>
                      )}
                      <Num id={`${b.id}-t`} label="Tool-call turns" value={b.toolTurns} onChange={(v) => setBlock(b.id, { toolTurns: v })} />
                      <Num id={`${b.id}-l`} label="Loop iterations" min={1} value={b.loopIterations} onChange={(v) => setBlock(b.id, { loopIterations: v })} />
                      <Num id={`${b.id}-s`} label="% of runs reaching it" max={100} value={b.sharePct} onChange={(v) => setBlock(b.id, { sharePct: v })} />
                      <Num id={`${b.id}-lt`} label="Long answer tokens" value={b.longAnswer?.tokens ?? 0}
                        onChange={(v) => setBlock(b.id, { longAnswer: { tokens: v, sharePct: b.longAnswer?.sharePct ?? 0 } })} />
                      <Num id={`${b.id}-ls`} label="% of inputs with a long answer" max={100} value={b.longAnswer?.sharePct ?? 0}
                        onChange={(v) => setBlock(b.id, { longAnswer: { tokens: b.longAnswer?.tokens ?? 0, sharePct: v } })} />
                    </div>
                    <p className="mt-2 text-[11px] text-muted-foreground">
                      Some inputs get a longer answer (e.g. urgent emails get a summary). In real runs, answers went from 22 to 90 tokens.
                    </p>
                    <details className="mt-3">
                      <summary className="cursor-pointer text-xs text-muted-foreground">Paste the prompt to count its tokens</summary>
                      <textarea rows={3} className={`${field} mt-2 resize-y`} placeholder="Paste the block's prompt"
                        onChange={(e) => setBlock(b.id, { promptTokens: charsToTokens(e.target.value.length) })} />
                    </details>
                    <p className="mt-2 text-[11px] text-muted-foreground">
                      ${price.input} input · ${price.output} output per 1M tokens. Each tool-call turn is one more model call that re-sends the context.
                    </p>
                  </article>
                );
              })}
            </div>
          </div>

          <div className={card}>
            <h2 className="mb-4 text-base font-semibold">Input and paid tools</h2>
            <div className="grid gap-3 sm:grid-cols-3">
              <Num id="sample" label="Input tokens per run" value={wf.sampleInputTokens} onChange={(v) => set({ sampleInputTokens: v })} />
              <Num id="tools" label="Paid tool calls per run" value={wf.toolCallsPerRun} onChange={(v) => set({ toolCallsPerRun: v })} />
              <Num id="toolp" label="Price per tool call ($)" step="any" value={wf.toolUnitUsd} onChange={(v) => set({ toolUnitUsd: v })} />
            </div>
            <details className="mt-3">
              <summary className="cursor-pointer text-xs text-muted-foreground">Paste a typical input (e.g. one email) to count its tokens</summary>
              <textarea rows={3} className={`${field} mt-2 resize-y`} placeholder="Paste one typical input"
                onChange={(e) => set({ sampleInputTokens: charsToTokens(e.target.value.length) })} />
            </details>
          </div>

          <details className={card}>
            <summary className="cursor-pointer text-sm font-semibold">
              Calibrate with real runs <span className="font-normal text-muted-foreground">(optional, more accurate)</span>
            </summary>
            <p className="my-3 text-xs leading-relaxed text-muted-foreground">
              Run the workflow 3 to 5 times in Sim on different inputs. For each run, open it in the logs and copy its input and output tokens, one run per line. Their average replaces the estimate, and the range becomes the cheapest and dearest run.
            </p>
            <F label="Real runs (input tokens, output tokens)" id="cal">
              <textarea id="cal" rows={4} className={`${field} resize-y font-mono text-xs`} value={cal}
                placeholder={"91, 68\n155, 23\n123, 22"} onChange={(e) => updateCal(e.target.value)} />
            </F>
            {result.mode === "calibrated" && (
              <p className="mt-2 text-xs text-muted-foreground">Using {result.calibrationRuns} run{result.calibrationRuns === 1 ? "" : "s"}.</p>
            )}
          </details>

          <details className={card}>
            <summary className="cursor-pointer text-sm font-semibold">
              Import a Sim workflow export <span className="font-normal text-muted-foreground">(optional, JSON)</span>
            </summary>
            <p className="my-3 text-xs leading-relaxed text-muted-foreground">
              Paste the JSON returned by <code>GET /api/v2/workflows/&#123;id&#125;/export</code>. Nothing leaves your browser. The reader is best-effort: some field names aren&apos;t confirmed yet.
            </p>
            <textarea rows={5} className={`${field} resize-y font-mono text-xs`} value={importText}
              onChange={(e) => setImportText(e.target.value)} placeholder='{"data": {"state": {"blocks": { … }}}}' />
            <button type="button" onClick={runImport} disabled={!importText.trim()}
              className="mt-3 rounded-md border border-border px-3 py-2 text-xs font-medium hover:bg-muted disabled:opacity-40">
              Read the export
            </button>
            {importMsg && (
              <ul className={`mt-3 list-disc pl-5 text-xs leading-relaxed ${importMsg.ok ? "text-muted-foreground" : "text-warn"}`}>
                {importMsg.lines.map((l) => <li key={l}>{l}</li>)}
              </ul>
            )}
          </details>
        </section>

        {/* ── Results ──────────────────────────── */}
        <section aria-label="Cost" aria-live="polite" className="flex min-w-0 flex-col gap-5 lg:sticky lg:top-5">
          <div className={card}>
            <div className="mb-3 flex items-center justify-between">
              <h2 className="text-base font-semibold">What drives the cost</h2>
              <span className="rounded-full bg-muted px-2.5 py-1 text-xs font-medium">
                {result.mode === "calibrated" ? `Calibrated · ${result.calibrationRuns} run${result.calibrationRuns === 1 ? "" : "s"}` : "Estimate"}
              </span>
            </div>
            <p className="text-lg leading-snug">{result.driver}</p>

            <div className="mt-5 border-t border-border pt-4">
              <p className="text-xs text-muted-foreground">Per month, {runs.toLocaleString("en-US")} runs</p>
              <p className="mt-1 text-3xl font-semibold tabular-nums">{usd(result.monthly.expected)}</p>
              <p className="mt-1 text-sm text-muted-foreground tabular-nums">
                Range {usd(result.monthly.low)} to {usd(result.monthly.high)} · {usd(result.expected.totalUsd)} per run
              </p>
              {byok && (
                <p className="mt-3 text-sm tabular-nums">
                  Two bills: <strong>{num(result.expected.simCredits * runs)} Sim credits</strong> ({usd(result.expected.simCredits * runs * 0.005)}) +{" "}
                  <strong>{usd(result.expected.providerUsd * runs)}</strong> to the model provider.
                </p>
              )}
              <p className="mt-3 text-[11px] leading-relaxed text-muted-foreground">
                {result.mode === "calibrated"
                  ? "Range: the cheapest and the dearest real run (±50% on the answer with a single run)."
                  : "Low: shortest answers, no tool turns. High: longest answers and 30% more input. Retries and fallback models aren't included."}
              </p>
            </div>
          </div>

          {result.notes.length > 0 && (
            <ul className="list-disc space-y-1 rounded-lg border border-border bg-muted px-8 py-4 text-xs leading-relaxed text-muted-foreground">
              {result.notes.map((n) => <li key={n}>{n}</li>)}
            </ul>
          )}

          <div className={card}>
            <h2 className="mb-3 text-base font-semibold">What if</h2>
            <ul className="divide-y divide-border">
              {result.whatIf.map((w) => (
                <li key={w.label} className="flex items-center justify-between gap-3 py-2.5 text-sm">
                  <span>{w.label}</span>
                  <span className="tabular-nums">
                    {usd(w.monthlyUsd)}/month{" "}
                    <span className="text-muted-foreground">({w.delta >= 0 ? "+" : "−"}{pct(Math.abs(w.delta))})</span>
                  </span>
                </li>
              ))}
            </ul>
          </div>

          <div className={card}>
            <h2 className="mb-3 text-base font-semibold">Cost per run, by line</h2>
            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm">
                <thead>
                  <tr className="border-b border-border text-xs text-muted-foreground">
                    <th className="pb-2 font-medium">Line</th>
                    <th className="pb-2 text-right font-medium">Sim credits</th>
                    {byok && <th className="pb-2 text-right font-medium">Provider $</th>}
                    <th className="pb-2 text-right font-medium">Share</th>
                  </tr>
                </thead>
                <tbody>
                  {result.expected.lines.map((l, i) => (
                    <tr key={`${l.label}-${i}`} className="border-b border-border last:border-0">
                      <td className="py-2">{l.label}</td>
                      <td className="py-2 text-right tabular-nums">{num(l.credits)}</td>
                      {byok && <td className="py-2 text-right tabular-nums">{l.providerUsd ? usd(l.providerUsd) : "—"}</td>}
                      <td className="py-2 text-right tabular-nums">
                        <span className="inline-flex items-center gap-2">
                          <span className="h-1.5 w-12 overflow-hidden rounded-full bg-muted" aria-hidden>
                            <span className="block h-full bg-primary" style={{ width: pct(l.share) }} />
                          </span>
                          {pct(l.share)}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <p className="mt-2 text-[11px] text-muted-foreground">1 credit = $0.005. Every run pays a 1-credit base fee.</p>
          </div>

          <div className={card}>
            <h2 className="mb-2 text-base font-semibold">Plan fit</h2>
            <p className="text-sm">{result.planFit.label}</p>
            <p className="mt-1 text-xs text-muted-foreground">{result.planFit.detail}</p>
            {result.planFit.warning && (
              <p className="mt-3 rounded-md bg-warn-bg px-3 py-2 text-sm text-warn">{result.planFit.warning}</p>
            )}
          </div>

          <div className={card}>
            <div className="mb-3 flex items-center justify-between gap-3">
              <h2 className="text-base font-semibold">3. Summary for the budget owner</h2>
              <button type="button" onClick={copy}
                className="inline-flex items-center gap-1.5 rounded-md border border-border px-3 py-2 text-xs font-medium hover:bg-muted">
                {copied ? <Check size={14} aria-hidden /> : <Copy size={14} aria-hidden />}
                {copied ? "Copied" : "Copy"}
              </button>
            </div>
            <pre className="whitespace-pre-wrap font-sans text-sm leading-relaxed">{result.summary}</pre>
          </div>

          <p className="text-[11px] leading-relaxed text-muted-foreground">
            Unaffiliated prototype. Based on Sim&apos;s public pricing docs and open-source price table; not an official Sim tool.
          </p>
        </section>
      </div>
    </main>
  );
}

function F({ label: text, id, children }: { label: string; id: string; children: React.ReactNode }) {
  return (
    <div>
      <label className={label} htmlFor={id}>{text}</label>
      {children}
    </div>
  );
}

function Num(props: {
  id: string;
  label: string;
  value: number;
  onChange: (v: number) => void;
  min?: number;
  max?: number;
  step?: string;
}) {
  return (
    <F label={props.label} id={props.id}>
      <input id={props.id} type="number" min={props.min ?? 0} max={props.max} step={props.step} className={field}
        value={props.value} onChange={(e) => props.onChange(Math.max(props.min ?? 0, Number(e.target.value) || 0))} />
    </F>
  );
}
