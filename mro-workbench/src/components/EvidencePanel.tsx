"use client";

import { AnimatePresence, motion } from "motion/react";
import type { Citation } from "@/lib/types";
import { SectionLabel, cx } from "./ui";

const ICON: Record<Citation["kind"], string> = {
  manual: "M4 2.5h6l2.5 2.5v8.5H4z M6.5 7h4 M6.5 9.5h4",
  history: "M8 3.5a4.5 4.5 0 1 1-4.3 3.2 M3.5 3.5v3h3 M8 5.5V8l1.8 1.2",
  part: "M8 2.5l5 2.7v5.6L8 13.5l-5-2.7V5.2z M3.2 5.3L8 8l4.8-2.7 M8 8v5.4",
};

export function EvidencePanel({ citations, active, onSelect }: { citations: Citation[]; active: string | null; onSelect: (id: string) => void }) {
  return (
    <div className="flex h-full flex-col">
      <SectionLabel right={<span className="font-mono text-[11px] text-ink-3">{citations.length} sources</span>}>Evidence</SectionLabel>
      <div className="space-y-2">
        {citations.map((c) => {
          const open = c.id === active;
          return (
            <motion.div
              layout
              key={c.id}
              transition={{ type: "spring", stiffness: 380, damping: 32 }}
              className={cx(
                "overflow-hidden rounded-xl transition-[background,box-shadow] duration-200",
                open ? "bg-surface shadow-[inset_0_0_0_1px_var(--accent),0_0_0_3px_var(--accent-soft)]" : "bg-surface shadow-[inset_0_0_0_1px_var(--line)] hover:shadow-[inset_0_0_0_1px_var(--line-2)]",
              )}
            >
              <motion.button layout="position" type="button" onClick={() => onSelect(c.id)} className="flex w-full items-start gap-2.5 p-3 text-left">
                <svg width="16" height="16" viewBox="0 0 16 16" fill="none" className={cx("mt-0.5 shrink-0", open ? "text-accent" : "text-ink-3")} aria-hidden>
                  <path d={ICON[c.kind]} stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
                <span className="min-w-0">
                  <span className="block text-[13px] font-medium text-ink">{c.title}</span>
                  <span className="block truncate font-mono text-[11px] text-ink-2">{c.ref}</span>
                </span>
              </motion.button>
              <AnimatePresence initial={false}>
                {open && (
                  <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: "auto", opacity: 1 }} exit={{ height: 0, opacity: 0 }} transition={{ duration: 0.22, ease: [0.2, 0.8, 0.2, 1] }}>
                    <div className="mx-3 mb-3 space-y-1 border-t border-line pt-2.5">
                      {c.lines.map((l, i) => (
                        <motion.p
                          key={i}
                          initial={{ opacity: 0, x: -4 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: 0.05 + i * 0.04 }}
                          className={cx(
                            "rounded-md px-2 py-1 text-[12.5px] leading-5",
                            c.kind === "history" || c.kind === "part" ? "font-mono text-[11.5px]" : "",
                            i === c.highlight ? "bg-warn-soft text-ink shadow-[inset_2px_0_0_var(--warn)]" : "text-ink-2",
                          )}
                        >
                          {l}
                        </motion.p>
                      ))}
                      <p className="px-2 pt-1 text-[11px] text-ink-3">{c.meta}</p>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          );
        })}
      </div>
      <p className="mt-auto flex items-center gap-1.5 pt-4 text-[11px] text-ink-3">
        <span className="size-1.5 rounded-full bg-ok" />
        Synced with AMOS · 2 min ago
      </p>
    </div>
  );
}
