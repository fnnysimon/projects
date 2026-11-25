// Snapshot of Sim's pricing rules and model table.
// Sources: https://docs.sim.ai/platform/costs
//          https://github.com/simstudioai/sim/blob/main/apps/sim/providers/models.ts
//          https://github.com/simstudioai/sim/blob/main/apps/sim/lib/billing/constants.ts

export const PRICES_AS_OF = "2026-11-25";
export const PRICES_SOURCE =
  "https://github.com/simstudioai/sim/blob/main/apps/sim/providers/models.ts";

/** 1 credit = $0.005, so $1 = 200 credits. */
export const USD_PER_CREDIT = 0.005;
export const CREDITS_PER_USD = 1 / USD_PER_CREDIT;
/** Base fee charged on every run (BASE_EXECUTION_CHARGE = 0.005 USD). */
export const BASE_FEE_CREDITS = 1;

export type ModelPrice = {
  id: string;
  label: string;
  /** USD per 1M input tokens */
  input: number;
  /** USD per 1M output tokens */
  output: number;
};

export const MODELS: ModelPrice[] = [
  { id: "gpt-5.5", label: "gpt-5.5", input: 5, output: 30 },
  { id: "gpt-4.1-mini", label: "gpt-4.1-mini", input: 0.4, output: 1.6 },
  { id: "gpt-oss-120b", label: "gpt-oss-120b", input: 0.15, output: 0.6 },
  { id: "gemini-2.5-flash-lite", label: "gemini-2.5-flash-lite", input: 0.1, output: 0.4 },
  { id: "gemini-3.5-flash-lite", label: "gemini-3.5-flash-lite", input: 0.3, output: 2.5 },
];

export type PlanId = "free" | "pro" | "max";

export const PLANS: Record<
  PlanId,
  { label: string; credits: number; recurring: boolean; hostedModels: boolean; note: string }
> = {
  free: {
    label: "Free",
    credits: 1000,
    recurring: false,
    hostedModels: false,
    note: "1,000 credits, one-time. Hosted models and tools don't run on Free: you need your own keys.",
  },
  pro: {
    label: "Pro ($25/month)",
    credits: 6000,
    recurring: true,
    hostedModels: true,
    note: "6,000 credits a month. A weekly allowance of 2,000 comes on top; it isn't counted here.",
  },
  max: {
    label: "Max ($100/month)",
    credits: 25000,
    recurring: true,
    hostedModels: true,
    note: "25,000 credits a month. A weekly allowance of 4,000 comes on top; it isn't counted here.",
  },
};
