import { test } from "node:test";
import assert from "node:assert/strict";
import { importSimExport } from "./import-sim.ts";

// Hand-made sample in the assumed shape (to replace with a real export in step F)
const sample = {
  data: {
    version: "1.0",
    workflow: { name: "Email triage" },
    state: {
      blocks: {
        start: { type: "starter", name: "Start", subBlocks: {} },
        a1: {
          type: "agent",
          name: "Classifier",
          subBlocks: {
            model: { value: "gpt-4.1-mini" },
            systemPrompt: { value: "x".repeat(1200) },
            tools: { value: [] },
          },
        },
        a2: {
          type: "agent",
          name: "Summariser",
          subBlocks: { model: { value: "some-new-model" }, systemPrompt: { value: "y".repeat(400) } },
        },
      },
      edges: [],
      loops: { l1: { nodes: ["a2"], iterations: 5 } },
      parallels: {},
    },
  },
};

test("reads agent blocks, models, prompts and loops", () => {
  const r = importSimExport(JSON.stringify(sample));
  assert.equal(r.blocks.length, 2);
  assert.deepEqual(r.skipped, ["Start (starter)"]);
  const [c, s] = r.blocks;
  assert.equal(c.modelId, "gpt-4.1-mini");
  assert.equal(c.promptTokens, 300);
  assert.equal(s.modelId, "custom");
  assert.equal(s.loopIterations, 5);
  assert.ok(r.notes.some((n) => n.includes("some-new-model")));
});

test("rejects JSON without blocks", () => {
  assert.throws(() => importSimExport('{"hello":1}'), /No blocks found/);
});
