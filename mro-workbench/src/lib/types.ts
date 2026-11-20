export type Status = "drafted" | "needs_input" | "in_signoff" | "signed" | "rejected";
export type Verdict = "within" | "repair" | "outside";
export type Confidence = "high" | "medium" | "low";
export type SignoffLevel = "single" | "double" | "triple";

/** A piece of the agent's draft: plain text, or a reference to a source. */
export type Segment = { text: string } | { cite: string; label: string };

export type Citation = {
  id: string;
  kind: "manual" | "history" | "part";
  title: string;
  ref: string;
  /** Lines of the source. The `highlight` line is the passage the agent relied on. */
  lines: string[];
  highlight?: number;
  meta: string;
};

export type Measurement = {
  label: string;
  value: number;
  limit: number;
  unit: string;
  /** "max": value must stay below the limit. "min": value must stay above it. */
  direction: "max" | "min";
};

export type DraftOption = {
  label: string;
  /** The answer can change which published limit applies. */
  limit: number;
  /** Source passage to highlight for this answer, per citation id. */
  highlight: Record<string, number>;
  verdict: Verdict;
  disposition: string;
  draft: Segment[];
};

export type Finding = {
  id: string;
  tail: string;
  ata: string;
  ataName: string;
  title: string;
  location: string;
  /** Position on the aircraft top view, in a 200×200 viewBox. */
  pin: { x: number; y: number };
  reportedBy: string;
  reportedAt: string;
  notes: string;
  measurement: Measurement;
  verdict: Verdict;
  disposition: string;
  draft: Segment[];
  trace: string[];
  citations: Citation[];
  confidence: Confidence;
  signoff: SignoffLevel;
  status: Status;
  slaHours: number;
  /** Manual effort the agent replaced, in minutes. */
  effortMin: number;
  question?: { prompt: string; options: DraftOption[] };
};

export type Signature = { role: string; name: string; licence: string; at: string };
