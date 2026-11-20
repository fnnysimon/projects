"use client";

import { AnimatePresence, motion } from "motion/react";
import { useEffect, useMemo, useRef, useState } from "react";
import { Kbd, StatusDot, cx } from "./ui";
import type { QueueItem } from "./FindingsQueue";

export type PaletteAction = { id: string; label: string; hint?: string; run: () => void };

type Props = {
  open: boolean;
  onClose: () => void;
  findings: QueueItem[];
  onSelect: (id: string) => void;
  actions: PaletteAction[];
};

export function CommandPalette(props: Props) {
  return <AnimatePresence>{props.open && <Palette {...props} />}</AnimatePresence>;
}

/** Mounted only while open, so the query resets each time. */
function Palette({ onClose, findings, onSelect, actions }: Props) {
  const [q, setQ] = useState("");
  const [idx, setIdx] = useState(0);
  const input = useRef<HTMLInputElement>(null);

  const rows = useMemo(() => {
    const s = q.trim().toLowerCase();
    const f = findings
      .filter((x) => !s || `${x.id} ${x.title} ata ${x.ata} ${x.ataName} ${x.location}`.toLowerCase().includes(s))
      .map((x) => ({ kind: "finding" as const, key: x.id, item: x }));
    const a = actions.filter((x) => !s || x.label.toLowerCase().includes(s)).map((x) => ({ kind: "action" as const, key: x.id, item: x }));
    return [...f, ...a];
  }, [q, findings, actions]);

  useEffect(() => input.current?.focus(), []);

  const run = (i: number) => {
    const r = rows[i];
    if (!r) return;
    if (r.kind === "finding") onSelect(r.item.id);
    else r.item.run();
    onClose();
  };

  return (
        <motion.div className="fixed inset-0 z-50 flex items-start justify-center bg-black/25 px-4 pt-[14vh] backdrop-blur-[2px]" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onMouseDown={onClose}>
          <motion.div
            role="dialog"
            aria-label="Command palette"
            initial={{ opacity: 0, y: -8, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -6, scale: 0.98 }}
            transition={{ type: "spring", stiffness: 520, damping: 36 }}
            onMouseDown={(e) => e.stopPropagation()}
            className="w-full max-w-lg overflow-hidden rounded-2xl bg-surface shadow-pop ring-1 ring-line-2"
          >
            <div className="flex items-center gap-2 border-b border-line px-4">
              <svg width="15" height="15" viewBox="0 0 16 16" fill="none" className="text-ink-3" aria-hidden>
                <circle cx="7" cy="7" r="4.5" stroke="currentColor" strokeWidth="1.5" />
                <path d="M10.5 10.5L14 14" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
              </svg>
              <input
                ref={input}
                value={q}
                onChange={(e) => {
                  setQ(e.target.value);
                  setIdx(0);
                }}
                onKeyDown={(e) => {
                  if (e.key === "ArrowDown") (e.preventDefault(), setIdx((i) => Math.min(rows.length - 1, i + 1)));
                  if (e.key === "ArrowUp") (e.preventDefault(), setIdx((i) => Math.max(0, i - 1)));
                  if (e.key === "Enter") run(idx);
                  if (e.key === "Escape") onClose();
                }}
                placeholder="Search findings, ATA chapters, actions"
                className="h-12 flex-1 bg-transparent text-sm text-ink outline-none placeholder:text-ink-3"
              />
              <Kbd>Esc</Kbd>
            </div>
            <ul className="scroll-thin max-h-80 overflow-y-auto p-1.5">
              {rows.map((r, i) => (
                <li key={r.key}>
                  <button
                    type="button"
                    onMouseEnter={() => setIdx(i)}
                    onClick={() => run(i)}
                    className={cx("flex w-full items-center gap-2.5 rounded-lg px-3 py-2 text-left text-sm", i === idx ? "bg-sunken text-ink" : "text-ink-2")}
                  >
                    {r.kind === "finding" ? (
                      <>
                        <StatusDot status={r.item.status} />
                        <span className="font-mono text-[11px] text-ink-3">{r.item.id}</span>
                        <span className="truncate">{r.item.title}</span>
                        <span className="ml-auto font-mono text-[11px] text-ink-3">ATA {r.item.ata}</span>
                      </>
                    ) : (
                      <>
                        <span className="grid size-4 place-items-center text-ink-3">→</span>
                        <span>{r.item.label}</span>
                        {r.item.hint && <span className="ml-auto"><Kbd>{r.item.hint}</Kbd></span>}
                      </>
                    )}
                  </button>
                </li>
              ))}
              {rows.length === 0 && <li className="px-3 py-6 text-center text-sm text-ink-3">No match for “{q}”</li>}
            </ul>
          </motion.div>
        </motion.div>
  );
}
