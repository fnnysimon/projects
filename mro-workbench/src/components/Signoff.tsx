"use client";

import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import { useEffect, useRef, useState } from "react";
import { SIGNERS } from "@/lib/data";
import type { Signature, SignoffLevel } from "@/lib/types";
import { Button, cx } from "./ui";

const HOLD_MS = 1100;

/** Signing an airworthiness decision should be deliberate: press and hold, release early to cancel. */
export function HoldToSign({ onSigned, label = "Hold to sign" }: { onSigned: () => void; label?: string }) {
  const [p, setP] = useState(0);
  const raf = useRef<number | null>(null);
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const start = useRef(0);
  const done = useRef(false);

  // The timer decides when the signature lands; animation frames only drive the fill.
  const tick = (t: number) => {
    setP(Math.min(0.99, (t - start.current) / HOLD_MS));
    raf.current = requestAnimationFrame(tick);
  };
  const stopFrames = () => {
    if (raf.current) cancelAnimationFrame(raf.current);
    raf.current = null;
  };
  const begin = () => {
    if (timer.current || done.current) return;
    start.current = performance.now();
    raf.current = requestAnimationFrame(tick);
    timer.current = setTimeout(() => {
      stopFrames();
      timer.current = null;
      done.current = true;
      setP(1);
      onSigned();
    }, HOLD_MS);
  };
  const cancel = () => {
    stopFrames();
    if (timer.current) clearTimeout(timer.current);
    timer.current = null;
    if (!done.current) setP(0);
  };
  useEffect(() => () => cancel(), []); // eslint-disable-line react-hooks/exhaustive-deps

  return (
    <button
      type="button"
      onPointerDown={begin}
      onPointerUp={cancel}
      onPointerLeave={cancel}
      onKeyDown={(e) => {
        if ((e.key === " " || e.key === "Enter") && !e.repeat) {
          e.preventDefault();
          begin();
        }
      }}
      onKeyUp={(e) => (e.key === " " || e.key === "Enter") && cancel()}
      className="relative h-10 w-full select-none overflow-hidden rounded-lg bg-ink text-sm font-medium text-bg transition-transform active:scale-[0.985]"
      aria-label={`${label}. Press and hold for one second.`}
    >
      <span className="absolute inset-y-0 left-0 bg-ok" style={{ width: `${p * 100}%`, transition: p === 0 ? "width 200ms ease-out" : "none" }} />
      <span className="relative flex items-center justify-center gap-2">
        <svg width="15" height="15" viewBox="0 0 16 16" fill="none" aria-hidden>
          <path d="M2.5 11.5c1.5-1 2.5-4 3.5-4s.5 3 1.5 3 1.5-2 2.5-2 1 1.5 3.5 1.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
          <path d="M2.5 14h11" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" opacity=".5" />
        </svg>
        {p > 0 && p < 1 ? "Keep holding…" : label}
      </span>
    </button>
  );
}

export function SignoffPanel({
  level,
  signatures,
  active,
  onSign,
}: {
  level: SignoffLevel;
  signatures: Signature[];
  active: boolean;
  onSign: (role: string, name: string, licence: string) => void;
}) {
  const reduce = useReducedMotion();
  const chain = SIGNERS[level];
  const next = signatures.length;
  const complete = next >= chain.length;

  return (
    <div>
      <div className="mb-3 flex items-center justify-between">
        <span className="text-[11px] font-medium uppercase tracking-[0.08em] text-ink-3">Sign-off</span>
        <span className="text-[11px] text-ink-3">{level} · {chain.length} signature{chain.length > 1 ? "s" : ""} required</span>
      </div>

      <ol className="relative space-y-0">
        {chain.map((s, i) => {
          const sig = signatures[i];
          const current = active && i === next;
          return (
            <li key={s.role} className="relative flex gap-3 pb-3 last:pb-0">
              {i < chain.length - 1 && (
                <span className="absolute left-[11px] top-6 bottom-0 w-px bg-line-2">
                  <motion.span className="absolute inset-x-0 top-0 bg-ok" initial={false} animate={{ height: sig ? "100%" : "0%" }} transition={{ duration: reduce ? 0 : 0.4, delay: 0.15 }} />
                </span>
              )}
              <motion.span
                initial={false}
                animate={{ scale: sig ? [1, 1.25, 1] : 1 }}
                transition={{ duration: 0.35 }}
                className={cx(
                  "relative z-10 grid size-6 shrink-0 place-items-center rounded-full text-[11px] font-medium",
                  sig ? "bg-ok text-white dark:text-bg" : current ? "bg-accent-soft text-accent-ink shadow-[inset_0_0_0_1.5px_var(--accent)]" : "bg-sunken text-ink-3",
                )}
              >
                {sig ? (
                  <svg width="12" height="12" viewBox="0 0 16 16" fill="none" aria-hidden>
                    <path d="M3.5 8.5l3 3 6-7" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                ) : (
                  i + 1
                )}
              </motion.span>
              <div className="min-w-0 flex-1 pt-0.5">
                <div className="flex items-baseline justify-between gap-2">
                  <span className={cx("text-[13px] font-medium", sig || current ? "text-ink" : "text-ink-3")}>{s.role}</span>
                  {sig && <span className="font-mono text-[11px] text-ink-3">{sig.at}</span>}
                </div>
                <p className="text-xs text-ink-3">
                  {sig ? `Signed by ${sig.name} · ${sig.licence}` : s.name === "You" ? `You · ${s.licence}` : `${s.name} · ${s.licence}`}
                </p>
                <AnimatePresence>
                  {current && (
                    <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: "auto" }} exit={{ opacity: 0, height: 0 }} className="overflow-hidden">
                      <div className="pt-2.5">
                        {s.name === "You" ? (
                          <HoldToSign onSigned={() => onSign(s.role, s.name, s.licence)} />
                        ) : (
                          <div className="flex items-center justify-between gap-2 rounded-lg bg-surface-2 px-3 py-2 shadow-[inset_0_0_0_1px_var(--line)]">
                            <span className="flex items-center gap-2 text-xs text-ink-2">
                              <span className="size-3 animate-spin rounded-full border-[1.5px] border-accent/30 border-t-accent" />
                              Sent to {s.name}
                            </span>
                            <Button size="sm" variant="ghost" onClick={() => onSign(s.role, s.name, s.licence)}>
                              Simulate signature
                              <span className="rounded bg-sunken px-1 text-[10px] text-ink-3">demo</span>
                            </Button>
                          </div>
                        )}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </li>
          );
        })}
      </ol>

      {!active && !complete && <p className="mt-3 text-xs text-ink-3">Accept the draft to start the sign-off.</p>}
    </div>
  );
}

export function ReleasedStamp() {
  return (
    <motion.div
      initial={{ scale: 1.6, opacity: 0, rotate: -14 }}
      animate={{ scale: 1, opacity: 1, rotate: -6 }}
      transition={{ type: "spring", stiffness: 520, damping: 18 }}
      className="pointer-events-none select-none rounded-md border-2 border-ok px-2.5 py-1 font-mono text-[11px] font-semibold uppercase tracking-[0.14em] text-ok"
    >
      Signed · released
    </motion.div>
  );
}
