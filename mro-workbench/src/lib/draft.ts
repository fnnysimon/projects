import type { Segment } from "./types";

export type Token = { kind: "word"; text: string } | { kind: "cite"; cite: string; label: string };

export function tokenize(segments: Segment[]): Token[] {
  const out: Token[] = [];
  for (const s of segments) {
    if ("cite" in s) out.push({ kind: "cite", cite: s.cite, label: s.label });
    else for (const w of s.text.match(/\S+\s*|\s+/g) ?? []) out.push({ kind: "word", text: w });
  }
  return out;
}

/** Citations become `[label]` so an engineer can edit the draft as plain text and keep its sources. */
export function toPlain(segments: Segment[]): string {
  return segments.map((s) => ("cite" in s ? ` [${s.label}]` : s.text)).join("").replace(/\s+/g, " ").trim();
}

export function fromPlain(text: string, original: Segment[]): Segment[] {
  const labels = new Map<string, string>();
  for (const s of original) if ("cite" in s) labels.set(s.label, s.cite);
  const out: Segment[] = [];
  let last = 0;
  for (const m of text.matchAll(/\s?\[([^\]]+)\]/g)) {
    const cite = labels.get(m[1]);
    if (!cite) continue;
    if (m.index! > last) out.push({ text: text.slice(last, m.index) });
    out.push({ cite, label: m[1] });
    last = m.index! + m[0].length;
  }
  if (last < text.length) out.push({ text: text.slice(last) });
  return out;
}

export type DiffPart = { type: "same" | "add" | "del"; text: string };

/** Word-level diff (LCS). Drafts are short, so the quadratic table is fine. */
export function diffWords(a: string, b: string): DiffPart[] {
  const A = a.split(/(\s+)/).filter(Boolean);
  const B = b.split(/(\s+)/).filter(Boolean);
  const dp = Array.from({ length: A.length + 1 }, () => new Array<number>(B.length + 1).fill(0));
  for (let i = A.length - 1; i >= 0; i--)
    for (let j = B.length - 1; j >= 0; j--) dp[i][j] = A[i] === B[j] ? dp[i + 1][j + 1] + 1 : Math.max(dp[i + 1][j], dp[i][j + 1]);
  const out: DiffPart[] = [];
  const push = (type: DiffPart["type"], text: string) => {
    const prev = out[out.length - 1];
    if (prev && prev.type === type) prev.text += text;
    else out.push({ type, text });
  };
  let i = 0;
  let j = 0;
  while (i < A.length && j < B.length) {
    if (A[i] === B[j]) push("same", A[i++]), j++;
    else if (dp[i + 1][j] >= dp[i][j + 1]) push("del", A[i++]);
    else push("add", B[j++]);
  }
  while (i < A.length) push("del", A[i++]);
  while (j < B.length) push("add", B[j++]);
  return out;
}
