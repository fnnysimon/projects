"use client";

import { AnimatePresence, animate, motion, useMotionValue, useTransform } from "motion/react";
import { useCallback, useEffect, useMemo, useReducer, useRef, useState, useSyncExternalStore } from "react";
import { CHECK, FINDINGS } from "@/lib/data";
import { initialState, reducer } from "@/lib/store";
import { CommandPalette, type PaletteAction } from "./CommandPalette";
import { EvidencePanel } from "./EvidencePanel";
import { FindingsQueue, type Filter, type QueueItem } from "./FindingsQueue";
import { ReviewPanel, type Mode } from "./ReviewPanel";
import { Kbd, Logo } from "./ui";

type Toast = { id: number; title: string; body?: string };

const REVIEW_MIN = 15;

function subscribeTheme(cb: () => void) {
  const o = new MutationObserver(cb);
  o.observe(document.documentElement, { attributes: true, attributeFilter: ["data-theme"] });
  return () => o.disconnect();
}

function TimeSaved({ minutes }: { minutes: number }) {
  const mv = useMotionValue(minutes);
  const label = useTransform(mv, (v) => `${Math.floor(v / 60)}h ${String(Math.round(v % 60)).padStart(2, "0")}m`);
  useEffect(() => {
    const c = animate(mv, minutes, { duration: 0.9, ease: [0.2, 0.8, 0.2, 1] });
    return () => c.stop();
  }, [minutes, mv]);
  return <motion.span className="font-mono tabular-nums">{label}</motion.span>;
}

export function Workbench() {
  const [state, dispatch] = useReducer(reducer, undefined, initialState);
  const [filter, setFilter] = useState<Filter>("todo");
  const [selectedId, setSelectedId] = useState(FINDINGS[0].id);
  const [mode, setMode] = useState<Mode>("view");
  const [activeCite, setActiveCite] = useState<string | null>(FINDINGS[0].citations[0].id);
  const [palette, setPalette] = useState(false);
  const [toasts, setToasts] = useState<Toast[]>([]);
  const theme = useSyncExternalStore(subscribeTheme, () => (document.documentElement.dataset.theme === "dark" ? "dark" : "light"), () => "light");
  const toastId = useRef(0);

  const toggleTheme = useCallback(() => {
    const n = document.documentElement.dataset.theme === "dark" ? "light" : "dark";
    document.documentElement.dataset.theme = n;
    try {
      localStorage.setItem("theme", n);
    } catch {}
  }, []);

  const items: QueueItem[] = useMemo(() => FINDINGS.map((f) => ({ ...f, status: state[f.id].status })), [state]);
  const counts = useMemo(
    () => ({ todo: items.filter((i) => i.status !== "signed").length, all: items.length, signed: items.filter((i) => i.status === "signed").length }),
    [items],
  );
  const visible = useMemo(() => {
    const list = filter === "all" ? items : filter === "signed" ? items.filter((i) => i.status === "signed") : items.filter((i) => i.status !== "signed");
    // Most urgent first, so the queue doubles as a to-do list.
    return [...list].sort((a, b) => (a.status === "signed" ? 1 : 0) - (b.status === "signed" ? 1 : 0) || a.slaHours - b.slaHours);
  }, [items, filter]);

  const finding = FINDINGS.find((f) => f.id === selectedId)!;
  const fs = state[selectedId];
  const savedMin = FINDINGS.reduce((sum, f) => sum + (state[f.id].status === "signed" ? f.effortMin - REVIEW_MIN : 0), 0);

  const pushToast = useCallback((title: string, body?: string) => {
    const id = ++toastId.current;
    setToasts((t) => [...t, { id, title, body }]);
    setTimeout(() => setToasts((t) => t.filter((x) => x.id !== id)), 4200);
  }, []);

  const select = useCallback((id: string) => {
    setSelectedId(id);
    setMode("view");
    const f = FINDINGS.find((x) => x.id === id)!;
    setActiveCite(f.citations[0]?.id ?? null);
  }, []);

  const move = useCallback(
    (dir: 1 | -1) => {
      const i = visible.findIndex((v) => v.id === selectedId);
      const next = visible[Math.min(visible.length - 1, Math.max(0, (i === -1 ? 0 : i) + dir))];
      if (next) select(next.id);
    },
    [visible, selectedId, select],
  );

  const nextUnsigned = useCallback(() => {
    const order = [...items].filter((i) => i.status !== "signed" && i.id !== selectedId).sort((a, b) => a.slaHours - b.slaHours);
    if (order[0]) select(order[0].id);
    else pushToast("Check complete", "Every finding on this C-check is signed.");
  }, [items, selectedId, select, pushToast]);

  const onSign = (role: string, name: string, licence: string) => {
    const at = new Date().toLocaleTimeString("en-GB", { hour: "2-digit", minute: "2-digit" });
    dispatch({ type: "sign", id: selectedId, sig: { role, name, licence, at } });
    const remaining = finding.signoff === "single" ? 0 : (finding.signoff === "double" ? 2 : 3) - fs.signatures.length - 1;
    if (remaining <= 0) pushToast(`${finding.id} signed and released`, `Disposition written back to AMOS · ${CHECK.workOrder}`);
    else if (name === "You") pushToast("Your signature is recorded", `Sent for the next signature`);
  };

  // Keyboard-first: engineers review dozens of findings per shift.
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "k") {
        e.preventDefault();
        setPalette((v) => !v);
        return;
      }
      const t = e.target as HTMLElement;
      if (palette || t.tagName === "INPUT" || t.tagName === "TEXTAREA" || e.metaKey || e.ctrlKey || e.altKey) return;
      const k = e.key.toLowerCase();
      if (k === "j" || e.key === "ArrowDown") (e.preventDefault(), move(1));
      else if (k === "k" || e.key === "ArrowUp") (e.preventDefault(), move(-1));
      else if (k === "a" && fs.status === "drafted" && mode === "view") dispatch({ type: "accept", id: selectedId });
      else if (k === "e" && fs.status === "drafted") (e.preventDefault(), setMode("edit"));
      else if (k === "n") nextUnsigned();
      else if (e.key === "Escape") setMode("view");
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [palette, move, fs.status, mode, selectedId, nextUnsigned]);

  const actions: PaletteAction[] = [
    { id: "next", label: "Go to next unsigned finding", hint: "N", run: nextUnsigned },
    { id: "theme", label: `Switch to ${theme === "light" ? "dark" : "light"} mode`, run: toggleTheme },
    { id: "reset", label: "Reset demo data", run: () => (dispatch({ type: "reset" }), select(FINDINGS[0].id), pushToast("Demo reset")) },
  ];

  const progress = counts.signed / counts.all;

  return (
    <div className="flex h-dvh flex-col">
      {/* Top bar */}
      <header className="flex h-12 shrink-0 items-center gap-4 border-b border-line bg-surface px-4">
        <Logo />
        <span className="hidden h-4 w-px bg-line-2 md:block" />
        <nav className="hidden items-center gap-1.5 text-[13px] text-ink-2 md:flex" aria-label="Breadcrumb">
          <span>{CHECK.name}</span>
          <span className="text-ink-3">/</span>
          <span>{CHECK.aircraft}</span>
          <span className="text-ink-3">/</span>
          <span className="font-mono text-ink">{CHECK.tail}</span>
        </nav>

        <div className="ml-auto flex items-center gap-4">
          <div className="hidden items-center gap-2.5 lg:flex" title="Findings signed on this check">
            <span className="text-xs text-ink-2">
              <span className="font-mono text-ink">{counts.signed}</span>/{counts.all} signed
            </span>
            <span className="h-1.5 w-24 overflow-hidden rounded-full bg-sunken">
              <motion.span className="block h-full rounded-full bg-ok" initial={false} animate={{ width: `${progress * 100}%` }} transition={{ type: "spring", stiffness: 120, damping: 20 }} />
            </span>
          </div>
          <div className="hidden items-center gap-1.5 text-xs text-ink-2 sm:flex" title="Manual research time replaced by agent drafts, minus review time">
            <span className="text-ink-3">Time saved</span>
            <span className="text-ink">
              <TimeSaved minutes={savedMin} />
            </span>
          </div>
          <button type="button" onClick={() => setPalette(true)} className="flex h-8 items-center gap-2 rounded-lg bg-surface-2 px-2.5 text-xs text-ink-3 shadow-[inset_0_0_0_1px_var(--line-2)] hover:text-ink-2">
            <svg width="13" height="13" viewBox="0 0 16 16" fill="none" aria-hidden>
              <circle cx="7" cy="7" r="4.5" stroke="currentColor" strokeWidth="1.5" />
              <path d="M10.5 10.5L14 14" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
            </svg>
            <span className="hidden sm:inline">Search</span>
            <Kbd>⌘K</Kbd>
          </button>
          <button type="button" onClick={toggleTheme} aria-label="Toggle dark mode" className="grid size-8 place-items-center rounded-lg text-ink-2 hover:bg-sunken hover:text-ink">
            <AnimatePresence mode="wait" initial={false}>
              <motion.svg key={theme} initial={{ rotate: -40, opacity: 0 }} animate={{ rotate: 0, opacity: 1 }} exit={{ rotate: 40, opacity: 0 }} transition={{ duration: 0.18 }} width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden>
                {theme === "light" ? (
                  <path d="M13.5 9.5A5.5 5.5 0 0 1 6.5 2.5a5.5 5.5 0 1 0 7 7z" stroke="currentColor" strokeWidth="1.4" strokeLinejoin="round" />
                ) : (
                  <>
                    <circle cx="8" cy="8" r="3" stroke="currentColor" strokeWidth="1.4" />
                    <path d="M8 1.5v1.5M8 13v1.5M1.5 8H3M13 8h1.5M3.4 3.4l1 1M11.6 11.6l1 1M3.4 12.6l1-1M11.6 4.4l1-1" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" />
                  </>
                )}
              </motion.svg>
            </AnimatePresence>
          </button>
        </div>
      </header>

      {/* Three panes: queue, review, evidence */}
      <div className="grid min-h-0 flex-1 grid-cols-1 overflow-y-auto lg:grid-cols-[288px_minmax(0,1fr)_320px] lg:overflow-hidden">
        <aside className="max-h-[40vh] border-b border-line bg-surface-2 lg:max-h-none lg:border-r lg:border-b-0">
          <FindingsQueue items={visible} filter={filter} onFilter={setFilter} counts={counts} selectedId={selectedId} onSelect={select} />
        </aside>

        <main className="scroll-thin min-w-0 px-4 py-6 sm:px-8 lg:overflow-y-auto">
          <AnimatePresence mode="wait">
            <ReviewPanel
              key={finding.id}
              finding={finding}
              state={fs}
              allFindings={FINDINGS}
              mode={mode}
              setMode={setMode}
              activeCite={activeCite}
              onCite={setActiveCite}
              onSelect={select}
              onSeen={() => dispatch({ type: "seen", id: selectedId })}
              onAnswer={(i) => dispatch({ type: "answer", id: selectedId, option: i })}
              onAccept={() => dispatch({ type: "accept", id: selectedId })}
              onEdit={(text) => dispatch({ type: "edit", id: selectedId, text })}
              onReject={(reason) => (dispatch({ type: "reject", id: selectedId, reason }), pushToast("Returned to manual review", "Your feedback was logged for the agent."))}
              onReopen={() => dispatch({ type: "reopen", id: selectedId })}
              onSign={onSign}
              onNext={nextUnsigned}
            />
          </AnimatePresence>
          <p className="mx-auto mt-10 max-w-[720px] text-center text-[11px] text-ink-3">
            Concept exercise, not affiliated with any company. Aircraft, people, manual excerpts and records are fictional.
          </p>
        </main>

        <aside className="scroll-thin border-t border-line bg-surface-2 p-4 lg:overflow-y-auto lg:border-t-0 lg:border-l">
          <EvidencePanel
            citations={finding.citations.map((c) => (c.id in fs.highlights ? { ...c, highlight: fs.highlights[c.id] } : c))} active={activeCite} onSelect={(id) => setActiveCite((c) => (c === id ? null : id))} />
        </aside>
      </div>

      <CommandPalette open={palette} onClose={() => setPalette(false)} findings={items} onSelect={select} actions={actions} />

      {/* Toasts */}
      <div className="pointer-events-none fixed right-4 bottom-4 z-40 flex w-80 flex-col gap-2" aria-live="polite">
        <AnimatePresence>
          {toasts.map((t) => (
            <motion.div
              key={t.id}
              layout
              initial={{ opacity: 0, y: 16, scale: 0.96 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, x: 24 }}
              transition={{ type: "spring", stiffness: 480, damping: 34 }}
              className="pointer-events-auto flex gap-3 rounded-xl bg-ink px-4 py-3 text-bg shadow-pop"
            >
              <span className="mt-1.5 size-1.5 shrink-0 rounded-full bg-ok" />
              <div>
                <p className="text-[13px] font-medium">{t.title}</p>
                {t.body && <p className="mt-0.5 text-xs opacity-70">{t.body}</p>}
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
    </div>
  );
}
