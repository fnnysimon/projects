"use client";

import { AnimatePresence, motion } from "motion/react";
import { useCallback, useState } from "react";
import { CHECK } from "@/lib/data";
import { diffWords, toPlain } from "@/lib/draft";
import type { FindingState } from "@/lib/store";
import type { Finding } from "@/lib/types";
import { AgentDraft } from "./AgentDraft";
import { AircraftMap } from "./AircraftMap";
import { LimitGauge } from "./LimitGauge";
import { ReleasedStamp, SignoffPanel } from "./Signoff";
import { Button, ConfidenceMeter, Kbd, StatusLabel, VerdictBadge, cx } from "./ui";

export type Mode = "view" | "edit" | "reject";

const REASONS = ["Wrong limit applied", "Missing context from the floor", "Needs physical re-inspection", "Other"];

type Props = {
  finding: Finding;
  state: FindingState;
  allFindings: Finding[];
  mode: Mode;
  setMode: (m: Mode) => void;
  activeCite: string | null;
  onCite: (id: string) => void;
  onSelect: (id: string) => void;
  onSeen: () => void;
  onAnswer: (i: number) => void;
  onAccept: () => void;
  onEdit: (text: string) => void;
  onReject: (reason: string) => void;
  onReopen: () => void;
  onSign: (role: string, name: string, licence: string) => void;
  onNext: () => void;
};

export function ReviewPanel(p: Props) {
  const { finding: f, state: s, mode } = p;
  const [showDiff, setShowDiff] = useState(false);
  const [reason, setReason] = useState(REASONS[0]);
  const [note, setNote] = useState("");

  const onSeen = p.onSeen;
  const handleDone = useCallback(() => onSeen(), [onSeen]);
  const canAct = s.status === "drafted";
  const signed = s.status === "signed";

  return (
    <motion.div key={f.id} initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.25, ease: [0.2, 0.8, 0.2, 1] }} className="mx-auto max-w-[720px] space-y-4">
      {/* Header */}
      <div className="flex gap-4">
        <div className="min-w-0 flex-1">
          <div className="mb-2 flex flex-wrap items-center gap-2 font-mono text-[11px] text-ink-3">
            <span>{f.id}</span>
            <span className="rounded bg-sunken px-1.5 py-0.5 text-ink-2">ATA {f.ata} · {f.ataName}</span>
            <StatusLabel status={s.status} />
          </div>
          <h1 className="text-[22px] font-semibold leading-tight tracking-tight text-ink">{f.title}</h1>
          <p className="mt-1 text-sm text-ink-2">{f.location}</p>
          <div className="mt-4 rounded-lg border-l-2 border-line-2 pl-3">
            <p className="text-[11px] text-ink-3">
              Inspector report · {f.reportedBy} · {f.reportedAt}
            </p>
            <p className="mt-0.5 text-[13px] leading-6 text-ink-2">{f.notes}</p>
          </div>
        </div>
        <div className="relative hidden h-[150px] w-[150px] shrink-0 rounded-xl bg-surface shadow-[inset_0_0_0_1px_var(--line)] sm:block">
          <AircraftMap findings={p.allFindings} selectedId={f.id} onSelect={p.onSelect} />
          <span className="absolute bottom-1.5 left-2 font-mono text-[10px] text-ink-3">{CHECK.tail}</span>
          <AnimatePresence>{signed && <div className="absolute -top-2 -right-2"><ReleasedStamp /></div>}</AnimatePresence>
        </div>
      </div>

      {s.status === "needs_input" && f.question ? (
        <div className="flex items-center justify-between rounded-lg bg-warn-soft px-3 py-2.5 text-xs">
          <span className="text-ink-2">
            {f.measurement.label} · <span className="font-mono text-ink">{f.measurement.value} {f.measurement.unit}</span>
          </span>
          <span className="font-mono text-warn">limit: {f.question.options.map((o) => o.limit).sort((a, b) => a - b).join(" or ")} {f.measurement.unit}</span>
        </div>
      ) : (
        <LimitGauge key={s.limit} m={{ ...f.measurement, limit: s.limit }} />
      )}

      {/* Agent draft */}
      <div className={cx("rounded-2xl bg-surface p-4 shadow-[inset_0_0_0_1px_var(--line)]", s.status === "rejected" && "opacity-70")}>
        <div className="mb-3 flex flex-wrap items-center gap-x-3 gap-y-2">
          <span className="inline-flex items-center gap-1.5 text-xs font-medium text-agent-ink">
            <svg width="13" height="13" viewBox="0 0 16 16" fill="none" aria-hidden>
              <path d="M8 1.5l1.6 4.4L14 7.5l-4.4 1.6L8 13.5 6.4 9.1 2 7.5l4.4-1.6z" fill="var(--agent)" />
            </svg>
            Agent draft
          </span>
          {s.status !== "needs_input" && (
            <>
              <VerdictBadge verdict={s.verdict} />
              <ConfidenceMeter value={f.confidence} />
            </>
          )}
          {s.edited && (
            <button type="button" onClick={() => setShowDiff((v) => !v)} className="ml-auto rounded-md bg-accent-soft px-2 py-0.5 text-[11px] font-medium text-accent-ink">
              Edited by you · {showDiff ? "hide" : "show"} changes
            </button>
          )}
        </div>

        {s.status !== "needs_input" && <p className="mb-3 text-[13px] font-medium text-ink">{s.disposition}</p>}

        {s.status === "needs_input" && f.question ? (
          <div>
            <AgentDraft trace={f.trace} segments={[]} animate={false} activeCite={p.activeCite} onCite={p.onCite} />
            <div className="rounded-xl bg-warn-soft p-3">
              <p className="text-[13px] leading-6 text-ink">{f.question.prompt}</p>
              <div className="mt-3 flex flex-wrap gap-2">
                {f.question.options.map((o, i) => (
                  <Button key={o.label} size="sm" onClick={() => p.onAnswer(i)}>
                    {o.label}
                  </Button>
                ))}
              </div>
            </div>
          </div>
        ) : mode === "edit" ? (
          <EditBox
            initial={toPlain(s.segments)}
            onSave={(t) => {
              p.onEdit(t);
              p.setMode("view");
            }}
            onCancel={() => p.setMode("view")}
          />
        ) : showDiff ? (
          <p className="text-[15px] leading-7">
            {diffWords(s.agentText, toPlain(s.segments)).map((d, i) => (
              <span key={i} className={cx(d.type === "add" && "rounded bg-ok-soft text-ok", d.type === "del" && "rounded bg-danger-soft text-danger line-through")}>
                {d.text}
              </span>
            ))}
          </p>
        ) : (
          <AgentDraft key={`${f.id}-${s.agentText}`} trace={f.trace} segments={s.segments} animate={!s.seen} onDone={handleDone} activeCite={p.activeCite} onCite={p.onCite} />
        )}

        {/* Actions */}
        <AnimatePresence initial={false}>
          {canAct && mode === "view" && (
            <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: "auto" }} exit={{ opacity: 0, height: 0 }} className="overflow-hidden">
              <div className="mt-4 flex flex-wrap items-center gap-2 border-t border-line pt-4">
                <Button variant="primary" onClick={p.onAccept}>
                  Accept draft <Kbd>A</Kbd>
                </Button>
                <Button onClick={() => p.setMode("edit")}>
                  Edit <Kbd>E</Kbd>
                </Button>
                <Button variant="ghost" onClick={() => p.setMode("reject")}>
                  Reject
                </Button>
                <span className="ml-auto text-[11px] text-ink-3">Manual research avoided: ~{Math.round(f.effortMin / 60 * 10) / 10}h</span>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        <AnimatePresence>
          {mode === "reject" && canAct && (
            <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: "auto" }} exit={{ opacity: 0, height: 0 }} className="overflow-hidden">
              <div className="mt-4 space-y-3 border-t border-line pt-4">
                <p className="text-[13px] font-medium text-ink">Why is the draft wrong?</p>
                <div className="flex flex-wrap gap-1.5">
                  {REASONS.map((r) => (
                    <button
                      key={r}
                      type="button"
                      onClick={() => setReason(r)}
                      className={cx("h-7 rounded-full px-3 text-xs transition-colors", reason === r ? "bg-ink text-bg" : "bg-sunken text-ink-2 hover:text-ink")}
                    >
                      {r}
                    </button>
                  ))}
                </div>
                <textarea
                  value={note}
                  onChange={(e) => setNote(e.target.value)}
                  rows={2}
                  placeholder="Fastener row is 40 mm away, not 64 mm"
                  className="w-full resize-none rounded-lg bg-surface-2 p-2.5 text-[13px] text-ink shadow-[inset_0_0_0_1px_var(--line-2)] outline-none placeholder:text-ink-3 focus:shadow-[inset_0_0_0_1.5px_var(--accent)]"
                />
                <div className="flex items-center gap-2">
                  <Button variant="danger" size="sm" onClick={() => (p.onReject(note.trim() ? `${reason}: ${note.trim()}` : reason), p.setMode("view"), setNote(""))}>
                    Return to manual review
                  </Button>
                  <Button variant="ghost" size="sm" onClick={() => p.setMode("view")}>
                    Cancel
                  </Button>
                  <span className="ml-auto text-[11px] text-ink-3">Feedback improves future drafts</span>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {s.status === "rejected" && (
          <div className="mt-4 flex items-center justify-between gap-3 border-t border-line pt-4">
            <p className="text-xs text-ink-2">
              Returned to manual review · <span className="text-ink">{s.rejectReason}</span>
            </p>
            <Button size="sm" variant="ghost" onClick={p.onReopen}>
              Undo
            </Button>
          </div>
        )}
      </div>

      {/* Sign-off */}
      {s.status !== "rejected" && s.status !== "needs_input" && (
        <div className="rounded-2xl bg-surface p-4 shadow-[inset_0_0_0_1px_var(--line)]">
          <SignoffPanel level={f.signoff} signatures={s.signatures} active={s.status === "in_signoff"} onSign={p.onSign} />
          <AnimatePresence>
            {signed && (
              <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: "auto" }} className="overflow-hidden">
                <div className="mt-4 flex items-center justify-between gap-3 border-t border-line pt-4">
                  <p className="flex items-center gap-2 text-xs text-ink-2">
                    <span className="size-1.5 rounded-full bg-ok" />
                    Written back to AMOS · {CHECK.workOrder}
                  </p>
                  <Button size="sm" onClick={p.onNext}>
                    Next finding <Kbd>N</Kbd>
                  </Button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      )}
    </motion.div>
  );
}

/** Mounted only while editing, so it always starts from the current draft. */
function EditBox({ initial, onSave, onCancel }: { initial: string; onSave: (t: string) => void; onCancel: () => void }) {
  const [text, setText] = useState(initial);
  return (
    <div>
      <textarea
        autoFocus
        value={text}
        onChange={(e) => setText(e.target.value)}
        onKeyDown={(e) => {
          if (e.key === "Enter" && (e.metaKey || e.ctrlKey)) onSave(text);
          if (e.key === "Escape") onCancel();
        }}
        rows={5}
        className="w-full resize-none rounded-lg bg-surface-2 p-3 text-[14px] leading-6 text-ink shadow-[inset_0_0_0_1px_var(--line-2)] outline-none focus:shadow-[inset_0_0_0_1.5px_var(--accent)]"
      />
      <p className="mt-1.5 text-[11px] text-ink-3">Keep sources in [brackets] so they stay linked. Your edits are tracked against the agent&apos;s draft.</p>
      <div className="mt-3 flex items-center gap-2">
        <Button variant="primary" size="sm" onClick={() => onSave(text)}>
          Save edit <Kbd>⌘↵</Kbd>
        </Button>
        <Button variant="ghost" size="sm" onClick={onCancel}>
          Cancel
        </Button>
      </div>
    </div>
  );
}
