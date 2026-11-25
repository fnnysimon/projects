import type { Workflow } from "./estimate.ts";

export type Preset = { id: string; label: string; description: string; workflow: Workflow };

export const PRESETS: Preset[] = [
  {
    id: "email",
    label: "Email triage agent",
    description: "One agent sorts each client email (urgent / normal / spam). Answer lengths come from 6 real runs in step F.",
    workflow: {
      blocks: [
        {
          id: "b1",
          name: "Classifier",
          modelId: "gpt-4.1-mini",
          promptTokens: 300, // ~1,200 characters
          outputTokens: 25, // normal and spam answers: 22 to 29 tokens in step F
          longAnswer: { tokens: 80, sharePct: 20 }, // urgent answers with a summary: 68 to 90 tokens
          toolTurns: 0,
          loopIterations: 1,
          sharePct: 100,
        },
      ],
      sampleInputTokens: 250, // ~1,000 characters
      toolCallsPerRun: 0,
      toolUnitUsd: 0.001,
      monthlyRuns: 1000,
      keyMode: "hosted",
      plan: "pro",
      calibration: null,
    },
  },
  {
    id: "research",
    label: "Research agent",
    description: "Loops over 10 sources; each iteration searches the web and summarises with gpt-5.5.",
    workflow: {
      blocks: [
        {
          id: "b1",
          name: "Summariser (in loop)",
          modelId: "gpt-5.5",
          promptTokens: 1600,
          outputTokens: 400,
          toolTurns: 0,
          loopIterations: 10,
          sharePct: 100,
        },
      ],
      sampleInputTokens: 400,
      toolCallsPerRun: 10,
      toolUnitUsd: 0.001,
      monthlyRuns: 1000,
      keyMode: "hosted",
      plan: "max",
      calibration: null,
    },
  },
  {
    id: "scratch",
    label: "Start from scratch",
    description: "One empty agent block.",
    workflow: {
      blocks: [
        {
          id: "b1",
          name: "Agent",
          modelId: "gpt-4.1-mini",
          promptTokens: 0,
          outputTokens: 150,
          toolTurns: 0,
          loopIterations: 1,
          sharePct: 100,
        },
      ],
      sampleInputTokens: 100,
      toolCallsPerRun: 0,
      toolUnitUsd: 0.001,
      monthlyRuns: 1000,
      keyMode: "hosted",
      plan: "pro",
      calibration: null,
    },
  },
];
