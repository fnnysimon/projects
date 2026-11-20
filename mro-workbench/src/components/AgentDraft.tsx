"use client";

import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import { useEffect, useMemo, useState } from "react";
import { tokenize } from "@/lib/draft";
import type { Segment } from "@/lib/types";
import { CitationChip, cx } from "./ui";

type Props = {
  trace: string[];
  segments: Segment[];
  /** Play the reasoning trace and stream the text (first time a draft is shown). */
  animate: boolean;
  onDone?: () => void;
  activeCite: string | null;
  onCite: (id: string) => void;
};

const STEP_MS = 420;
const WORD_MS = 26;

export function AgentDraft({ trace, segments, animate, onDone, activeCite, onCite }: Props) {
  const reduce = useReducedMotion();
  const play = animate && !reduce;
  const tokens = useMemo(() => tokenize(segments), [segments]);
  const [step, setStep] = useState(play ? 0 : trace.length);
  const [count, setCount] = useState(play ? 0 : tokens.length);

  useEffect(() => {
    if (!play) return;
    if (step < trace.length) {
      const t = setTimeout(() => setStep((s) => s + 1), STEP_MS);
      return () => clearTimeout(t);
    }
    if (count < tokens.length) {
      const t = setTimeout(() => setCount((c) => c + 1), WORD_MS);
      return () => clearTimeout(t);
    }
    onDone?.();
  }, [play, step, count, trace.length, tokens.length, onDone]);

  const streaming = step >= trace.length && count < tokens.length;

  return (
    <div>
      <ol className="mb-3 space-y-1">
        {trace.map((t, i) => {
          const state = i < step ? "done" : i === step ? "run" : "todo";
          return (
            <motion.li
              key={t}
              initial={play ? { opacity: 0, y: 4 } : false}
              animate={{ opacity: state === "todo" ? 0.35 : 1, y: 0 }}
              transition={{ duration: 0.25, delay: play ? i * 0.05 : 0 }}
              className="flex items-center gap-2 text-xs text-ink-2"
            >
              <span className="grid size-3.5 place-items-center">
                {state === "done" ? (
                  <motion.svg initial={play ? { scale: 0.4 } : false} animate={{ scale: 1 }} width="12" height="12" viewBox="0 0 16 16" fill="none" aria-hidden>
                    <circle cx="8" cy="8" r="7" fill="var(--agent-soft)" />
                    <path d="M5 8.2l2 2 4-4.4" stroke="var(--agent)" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" />
                  </motion.svg>
                ) : state === "run" ? (
                  <span className="size-3 animate-spin rounded-full border-[1.5px] border-agent/30 border-t-agent" />
                ) : (
                  <span className="size-1.5 rounded-full bg-line-2" />
                )}
              </span>
              {t}
            </motion.li>
          );
        })}
      </ol>

      <p className="min-h-[3.2em] text-[15px] leading-7 text-ink">
        {tokens.slice(0, count).map((tk, i) =>
          tk.kind === "word" ? (
            <motion.span key={i} initial={play ? { opacity: 0, filter: "blur(2px)" } : false} animate={{ opacity: 1, filter: "blur(0px)" }} transition={{ duration: 0.25 }}>
              {tk.text}
            </motion.span>
          ) : (
            <motion.span key={i} initial={play ? { opacity: 0, scale: 0.85 } : false} animate={{ opacity: 1, scale: 1 }} className="inline-block">
              <CitationChip label={tk.label} active={activeCite === tk.cite} onClick={() => onCite(tk.cite)} />
            </motion.span>
          ),
        )}
        <AnimatePresence>
          {streaming && (
            <motion.span exit={{ opacity: 0 }} className={cx("ml-0.5 inline-block h-4 w-[7px] translate-y-[3px] rounded-[2px] bg-agent motion-safe:animate-pulse")} />
          )}
        </AnimatePresence>
      </p>
    </div>
  );
}
