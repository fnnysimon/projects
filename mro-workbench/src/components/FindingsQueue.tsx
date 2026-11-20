"use client";

import { motion } from "motion/react";
import type { Finding, Status } from "@/lib/types";
import { Kbd, StatusDot, cx } from "./ui";

export type Filter = "todo" | "all" | "signed";
export type QueueItem = Finding & { status: Status };

export function FindingsQueue({
  items,
  filter,
  onFilter,
  counts,
  selectedId,
  onSelect,
}: {
  items: QueueItem[];
  filter: Filter;
  onFilter: (f: Filter) => void;
  counts: Record<Filter, number>;
  selectedId: string;
  onSelect: (id: string) => void;
}) {
  const tabs: { id: Filter; label: string }[] = [
    { id: "todo", label: "To review" },
    { id: "all", label: "All" },
    { id: "signed", label: "Signed" },
  ];
  return (
    <div className="flex h-full min-h-0 flex-col">
      <div className="flex items-center gap-1 border-b border-line px-3 pt-3 pb-2">
        {tabs.map((t) => (
          <button
            key={t.id}
            type="button"
            onClick={() => onFilter(t.id)}
            className={cx("relative h-7 rounded-md px-2.5 text-xs font-medium transition-colors", filter === t.id ? "text-ink" : "text-ink-3 hover:text-ink-2")}
          >
            {filter === t.id && <motion.span layoutId="queue-tab" className="absolute inset-0 rounded-md bg-sunken" transition={{ type: "spring", stiffness: 500, damping: 38 }} />}
            <span className="relative">
              {t.label} <span className="font-mono text-ink-3">{counts[t.id]}</span>
            </span>
          </button>
        ))}
      </div>

      <ul className="scroll-thin min-h-0 flex-1 overflow-y-auto p-1.5" role="listbox" aria-label="Findings">
        {items.map((f) => {
          const sel = f.id === selectedId;
          const urgent = f.status !== "signed" && f.slaHours <= 3;
          return (
            <li key={f.id} role="option" aria-selected={sel}>
              <button type="button" onClick={() => onSelect(f.id)} className="relative block w-full rounded-lg px-2.5 py-2 text-left">
                {sel && <motion.span layoutId="queue-sel" className="absolute inset-0 rounded-lg bg-surface shadow-[inset_0_0_0_1px_var(--line-2)]" transition={{ type: "spring", stiffness: 500, damping: 40 }} />}
                <span className="relative flex items-center gap-2">
                  <StatusDot status={f.status} pulse={f.status === "needs_input"} />
                  <span className="font-mono text-[11px] text-ink-3">{f.id}</span>
                  <span className="rounded bg-sunken px-1 font-mono text-[10px] text-ink-2">ATA {f.ata}</span>
                  {f.status === "signed" ? (
                    <span className="ml-auto text-[11px] text-ok">Signed</span>
                  ) : (
                    <span className={cx("ml-auto font-mono text-[11px]", urgent ? "text-danger" : "text-ink-3")}>{f.slaHours}h left</span>
                  )}
                </span>
                <span className={cx("relative mt-0.5 block truncate pl-4 text-[13px]", sel ? "font-medium text-ink" : "text-ink-2")}>{f.title}</span>
              </button>
            </li>
          );
        })}
        {items.length === 0 && (
          <li className="px-3 py-10 text-center">
            <p className="text-sm font-medium text-ink">Queue cleared</p>
            <p className="mt-1 text-xs text-ink-3">Every finding on this check is signed.</p>
          </li>
        )}
      </ul>

      <div className="hidden items-center gap-3 border-t border-line px-3 py-2 text-[11px] text-ink-3 lg:flex">
        <span className="flex items-center gap-1"><Kbd>J</Kbd><Kbd>K</Kbd> move</span>
        <span className="flex items-center gap-1"><Kbd>A</Kbd> accept</span>
        <span className="flex items-center gap-1"><Kbd>E</Kbd> edit</span>
      </div>
    </div>
  );
}
