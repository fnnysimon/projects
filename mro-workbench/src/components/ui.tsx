"use client";

import type { ButtonHTMLAttributes, ReactNode } from "react";
import type { Confidence, Status, Verdict } from "@/lib/types";

export function cx(...c: (string | false | null | undefined)[]) {
  return c.filter(Boolean).join(" ");
}

/* ---------- Status ---------- */

const STATUS: Record<Status, { label: string; dot: string; text: string }> = {
  drafted: { label: "Drafted", dot: "bg-agent", text: "text-agent-ink" },
  needs_input: { label: "Needs input", dot: "bg-warn", text: "text-warn" },
  in_signoff: { label: "In sign-off", dot: "bg-accent", text: "text-accent-ink" },
  signed: { label: "Signed", dot: "bg-ok", text: "text-ok" },
  rejected: { label: "Manual review", dot: "bg-ink-3", text: "text-ink-2" },
};

export function StatusDot({ status, pulse }: { status: Status; pulse?: boolean }) {
  return (
    <span className="relative inline-flex size-2 shrink-0">
      {pulse && <span className={cx("absolute inset-0 rounded-full opacity-60 motion-safe:animate-ping", STATUS[status].dot)} />}
      <span className={cx("relative size-2 rounded-full", STATUS[status].dot)} />
    </span>
  );
}

export function StatusLabel({ status }: { status: Status }) {
  return (
    <span className={cx("inline-flex items-center gap-1.5 text-xs font-medium", STATUS[status].text)}>
      <StatusDot status={status} pulse={status === "needs_input"} />
      {STATUS[status].label}
    </span>
  );
}

/* ---------- Verdict ---------- */

const VERDICT: Record<Verdict, { label: string; cls: string }> = {
  within: { label: "Within limits", cls: "bg-ok-soft text-ok" },
  repair: { label: "Repair required", cls: "bg-warn-soft text-warn" },
  outside: { label: "Outside limits", cls: "bg-danger-soft text-danger" },
};

export function VerdictBadge({ verdict }: { verdict: Verdict }) {
  return <span className={cx("inline-flex h-6 items-center rounded-md px-2 text-xs font-medium", VERDICT[verdict].cls)}>{VERDICT[verdict].label}</span>;
}

/* ---------- Confidence ---------- */

const CONF: Record<Confidence, { bars: number; label: string; cls: string }> = {
  high: { bars: 3, label: "High confidence", cls: "bg-ok" },
  medium: { bars: 2, label: "Medium confidence", cls: "bg-warn" },
  low: { bars: 1, label: "Low confidence", cls: "bg-danger" },
};

export function ConfidenceMeter({ value }: { value: Confidence }) {
  const c = CONF[value];
  return (
    <span className="inline-flex items-center gap-1.5 text-xs text-ink-2" title="How closely the case matches published limits and fleet history">
      <span className="flex items-end gap-[2px]" aria-hidden>
        {[0, 1, 2].map((i) => (
          <span key={i} className={cx("w-[3px] rounded-sm", i < c.bars ? c.cls : "bg-line-2")} style={{ height: 5 + i * 3 }} />
        ))}
      </span>
      {c.label}
    </span>
  );
}

/* ---------- Primitives ---------- */

export function Kbd({ children }: { children: ReactNode }) {
  return (
    <kbd className="inline-flex h-[18px] min-w-[18px] items-center justify-center rounded border border-line-2 bg-surface-2 px-1 font-mono text-[10px] text-ink-3">
      {children}
    </kbd>
  );
}

type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & { variant?: "primary" | "secondary" | "ghost" | "danger"; size?: "sm" | "md" };

export function Button({ variant = "secondary", size = "md", className, ...rest }: ButtonProps) {
  return (
    <button
      {...rest}
      className={cx(
        "inline-flex select-none items-center justify-center gap-1.5 rounded-lg font-medium transition-[background,transform,box-shadow,color] duration-150 active:scale-[0.97] disabled:pointer-events-none disabled:opacity-50",
        size === "md" ? "h-9 px-3.5 text-sm" : "h-7 px-2.5 text-xs",
        variant === "primary" && "bg-ink text-bg hover:bg-ink/85",
        variant === "secondary" && "bg-surface text-ink shadow-[inset_0_0_0_1px_var(--line-2)] hover:bg-surface-2",
        variant === "ghost" && "text-ink-2 hover:bg-sunken hover:text-ink",
        variant === "danger" && "bg-danger-soft text-danger hover:brightness-95",
        className,
      )}
    />
  );
}

export function CitationChip({ label, active, onClick }: { label: string; active?: boolean; onClick?: () => void }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={cx(
        "mx-0.5 inline-flex h-5 translate-y-[-1px] items-center gap-1 rounded-[5px] px-1.5 align-middle font-mono text-[11px] transition-colors",
        active ? "bg-accent text-white dark:text-bg" : "bg-accent-soft text-accent-ink hover:bg-accent/20",
      )}
    >
      <svg width="9" height="9" viewBox="0 0 16 16" fill="none" aria-hidden>
        <path d="M3 2h7l3 3v9H3z" stroke="currentColor" strokeWidth="1.6" strokeLinejoin="round" />
      </svg>
      {label}
    </button>
  );
}

export function Logo() {
  return (
    <span className="flex items-center gap-2">
      <span className="grid size-6 place-items-center rounded-md bg-ink text-bg">
        <svg width="14" height="14" viewBox="0 0 16 16" fill="none" aria-hidden>
          <path d="M8 2.5v6M5 5.5h6M4.5 12.5h7" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
        </svg>
      </span>
      <span className="text-sm font-semibold tracking-tight">Tolerance</span>
    </span>
  );
}

export function SectionLabel({ children, right }: { children: ReactNode; right?: ReactNode }) {
  return (
    <div className="mb-2 flex items-center justify-between">
      <span className="text-[11px] font-medium uppercase tracking-[0.08em] text-ink-3">{children}</span>
      {right}
    </div>
  );
}
