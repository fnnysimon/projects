// Best-effort reader for a Sim workflow export (GET /api/v2/workflows/{id}/export).
// Known shape: { data: { workflow, state: { blocks, edges, loops, parallels } } }.
// UNCONFIRMED: where an agent block stores its model and prompts. We assume
// block.subBlocks.<field>.value (model, systemPrompt, userPrompt), as in Sim's
// editor state, and check this with a real export in step F.

import { charsToTokens, type Block } from "./estimate.ts";
import { MODELS } from "./prices.ts";

type AnyObj = Record<string, any>;

export type ImportResult = {
  blocks: Block[];
  skipped: string[];
  notes: string[];
};

const MODEL_BLOCK_TYPES = new Set(["agent", "evaluator", "router", "guardrails"]);

function subValue(block: AnyObj, key: string): unknown {
  return block?.subBlocks?.[key]?.value ?? block?.data?.[key] ?? block?.[key];
}

export function importSimExport(raw: string): ImportResult {
  const json: AnyObj = JSON.parse(raw);
  const state: AnyObj = json?.data?.state ?? json?.state ?? json;
  const blocksObj: AnyObj = state?.blocks;
  if (!blocksObj || typeof blocksObj !== "object") {
    throw new Error("No blocks found. Expected data.state.blocks in the export.");
  }

  // Loop and parallel multipliers per block id
  const multiplier: Record<string, number> = {};
  for (const loop of Object.values<AnyObj>(state.loops ?? {})) {
    const n = Number(loop.iterations ?? loop.count ?? 1) || 1;
    for (const id of loop.nodes ?? []) multiplier[id] = (multiplier[id] ?? 1) * n;
  }
  for (const par of Object.values<AnyObj>(state.parallels ?? {})) {
    const n = Number(par.count ?? par.distribution?.length ?? 1) || 1;
    for (const id of par.nodes ?? []) multiplier[id] = (multiplier[id] ?? 1) * n;
  }

  const blocks: Block[] = [];
  const skipped: string[] = [];
  const notes: string[] = [];

  for (const [id, b] of Object.entries<AnyObj>(blocksObj)) {
    const type = String(b.type ?? "");
    if (!MODEL_BLOCK_TYPES.has(type)) {
      skipped.push(`${b.name ?? id} (${type || "unknown"})`);
      continue;
    }
    const modelRaw = String(subValue(b, "model") ?? "");
    const known = MODELS.find((m) => m.id === modelRaw);
    const prompt = ["systemPrompt", "userPrompt", "prompt", "content"]
      .map((k) => subValue(b, k))
      .filter((v): v is string => typeof v === "string")
      .join("\n");
    if (!known) notes.push(`${b.name ?? id}: model "${modelRaw || "not found"}" isn't in the price table; enter its prices.`);
    if (!prompt) notes.push(`${b.name ?? id}: no prompt found; enter its length by hand.`);
    if (type !== "agent") notes.push(`${b.name ?? id}: ${type} block counted as one model call (exact charging unconfirmed).`);
    blocks.push({
      id,
      name: String(b.name ?? type),
      modelId: known ? known.id : "custom",
      promptTokens: charsToTokens(prompt.length),
      outputTokens: 150,
      toolTurns: Array.isArray(subValue(b, "tools")) && (subValue(b, "tools") as unknown[]).length > 0 ? 1 : 0,
      loopIterations: multiplier[id] ?? 1,
      sharePct: 100,
    });
  }

  if (blocks.length === 0) notes.push("No agent blocks found: the cost is the base fee plus any paid tools.");
  return { blocks, skipped, notes };
}
