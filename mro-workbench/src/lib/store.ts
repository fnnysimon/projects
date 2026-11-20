import { FINDINGS, SIGNERS } from "./data";
import { fromPlain, toPlain } from "./draft";
import type { Segment, Signature, Status, Verdict } from "./types";

export type FindingState = {
  status: Status;
  verdict: Verdict;
  disposition: string;
  segments: Segment[];
  limit: number;
  highlights: Record<string, number>;
  /** Plain-text draft as the agent wrote it, kept to show the engineer's edits as a diff. */
  agentText: string;
  edited: boolean;
  rejectReason?: string;
  signatures: Signature[];
  /** The reasoning trace and streaming play only the first time a draft is opened. */
  seen: boolean;
};

export type State = Record<string, FindingState>;

export function initialState(): State {
  return Object.fromEntries(
    FINDINGS.map((f) => [
      f.id,
      {
        status: f.status,
        verdict: f.verdict,
        disposition: f.disposition,
        segments: f.draft,
        limit: f.measurement.limit,
        highlights: {},
        agentText: toPlain(f.draft),
        edited: false,
        signatures: f.status === "signed" ? SIGNERS[f.signoff].map((s) => ({ ...s, at: "07:58" })) : [],
        seen: f.status === "signed",
      } satisfies FindingState,
    ]),
  );
}

export type Action =
  | { type: "seen"; id: string }
  | { type: "answer"; id: string; option: number }
  | { type: "accept"; id: string }
  | { type: "edit"; id: string; text: string }
  | { type: "reject"; id: string; reason: string }
  | { type: "reopen"; id: string }
  | { type: "sign"; id: string; sig: Signature }
  | { type: "reset" };

export function reducer(state: State, a: Action): State {
  if (a.type === "reset") return initialState();
  const s = state[a.id];
  const f = FINDINGS.find((x) => x.id === a.id)!;
  const set = (patch: Partial<FindingState>) => ({ ...state, [a.id]: { ...s, ...patch } });

  switch (a.type) {
    case "seen":
      return s.seen ? state : set({ seen: true });
    case "answer": {
      const o = f.question!.options[a.option];
      return set({ status: "drafted", limit: o.limit, highlights: o.highlight, verdict: o.verdict, disposition: o.disposition, segments: o.draft, agentText: toPlain(o.draft), seen: false });
    }
    case "accept":
      return set({ status: "in_signoff" });
    case "edit":
      return set({ segments: fromPlain(a.text, s.segments), edited: a.text.trim() !== s.agentText });
    case "reject":
      return set({ status: "rejected", rejectReason: a.reason });
    case "reopen":
      return set({ status: f.question && s.segments.length === 0 ? "needs_input" : "drafted", rejectReason: undefined });
    case "sign": {
      const signatures = [...s.signatures, a.sig];
      return set({ signatures, status: signatures.length >= SIGNERS[f.signoff].length ? "signed" : "in_signoff" });
    }
  }
}
