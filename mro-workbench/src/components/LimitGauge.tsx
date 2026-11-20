"use client";

import { motion, useReducedMotion } from "motion/react";
import type { Measurement } from "@/lib/types";
import { cx } from "./ui";

function fmt(n: number) {
  return Number.isInteger(n) ? String(n) : n.toFixed(n < 1 ? 2 : 1).replace(/0$/, "");
}

/** Shows a measured value against its published limit, so the verdict can be checked at a glance. */
export function LimitGauge({ m }: { m: Measurement }) {
  const reduce = useReducedMotion();

  // Zero-tolerance criteria (no cracks allowed, no exposed conductor…) are pass/fail.
  if (m.limit === 0) {
    const ok = m.value === 0;
    return (
      <div className="flex items-center justify-between rounded-lg bg-surface-2 px-3 py-2.5 text-xs shadow-[inset_0_0_0_1px_var(--line)]">
        <span className="text-ink-2">{m.label}</span>
        <span className="flex items-center gap-3 font-mono">
          <span className="text-ink-3">allowed: none</span>
          <span className={ok ? "text-ok" : "text-danger"}>found: {ok ? "none" : `${m.value} ${m.unit}`}</span>
        </span>
      </div>
    );
  }

  const scale = Math.max(m.value, m.limit) * 1.3;
  const valuePct = (m.value / scale) * 100;
  const limitPct = (m.limit / scale) * 100;
  const ok = m.direction === "max" ? m.value <= m.limit : m.value >= m.limit;
  const margin = m.direction === "max" ? (m.limit - m.value) / m.limit : (m.value - m.limit) / m.limit;
  const tight = ok && margin < 0.3;
  const tone = !ok ? "danger" : tight ? "warn" : "ok";
  const fill = { ok: "var(--ok)", warn: "var(--warn)", danger: "var(--danger)" }[tone];

  return (
    <div className="rounded-lg bg-surface-2 px-3 pb-2.5 pt-2 shadow-[inset_0_0_0_1px_var(--line)]">
      <div className="mb-2 flex items-baseline justify-between text-xs">
        <span className="text-ink-2">{m.label}</span>
        <span className={cx("font-medium", tone === "ok" && "text-ok", tone === "warn" && "text-warn", tone === "danger" && "text-danger")}>
          {ok ? `${Math.round(margin * 100)}% margin` : `${Math.round(-margin * 100)}% over limit`}
        </span>
      </div>
      <div className="relative h-2 rounded-full bg-sunken">
        {m.direction === "min" && <div className="absolute inset-y-0 left-0 rounded-l-full bg-danger/15" style={{ width: `${limitPct}%` }} />}
        {m.direction === "max" && <div className="absolute inset-y-0 right-0 rounded-r-full bg-danger/15" style={{ width: `${100 - limitPct}%` }} />}
        <motion.div
          className="absolute inset-y-0 left-0 rounded-full"
          style={{ background: fill }}
          initial={reduce ? false : { width: 0 }}
          animate={{ width: `${valuePct}%` }}
          transition={{ type: "spring", stiffness: 120, damping: 20, delay: 0.1 }}
        />
        <div className="absolute -top-1 -bottom-1 w-[2px] rounded bg-ink" style={{ left: `calc(${limitPct}% - 1px)` }} />
      </div>
      <div className="relative mt-1.5 h-4 font-mono text-[11px]">
        <span className="absolute left-0 text-ink">
          {fmt(m.value)} {m.unit} <span className="text-ink-3">measured</span>
        </span>
        <span className="absolute right-0 text-ink-2">
          {m.direction === "max" ? "max" : "min"} {fmt(m.limit)} {m.unit}
        </span>
      </div>
    </div>
  );
}
