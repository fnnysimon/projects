"use client";

import { motion } from "motion/react";
import type { Finding } from "@/lib/types";

/** Top view of a narrow-body aircraft with every finding pinned on it. */
export function AircraftMap({ findings, selectedId, onSelect }: { findings: Finding[]; selectedId: string; onSelect: (id: string) => void }) {
  const selected = findings.find((f) => f.id === selectedId);
  return (
    <svg viewBox="0 0 200 200" className="h-full w-full" role="img" aria-label={`Aircraft top view, ${selected?.title ?? ""} highlighted`}>
      <g fill="var(--surface-2)" stroke="var(--line-2)" strokeWidth="0.8" strokeLinejoin="round">
        <path d="M91 86 L16 118 L16 125 L91 110 Z" />
        <path d="M109 86 L184 118 L184 125 L109 110 Z" />
        <path d="M92 168 L68 180 L68 185 L92 178 Z" />
        <path d="M108 168 L132 180 L132 185 L108 178 Z" />
        <rect x="55" y="92" width="9" height="17" rx="3" />
        <rect x="136" y="92" width="9" height="17" rx="3" />
        <path d="M100 10 C106 10 109 22 109 40 L109 165 C109 178 104 190 100 192 C96 190 91 178 91 165 L91 40 C91 22 94 10 100 10 Z" />
      </g>
      <path d="M95 24 Q100 21 105 24" fill="none" stroke="var(--line-2)" strokeWidth="0.8" />

      {findings.map((f) => {
        const active = f.id === selectedId;
        const color = f.status === "signed" ? "var(--ok)" : f.status === "needs_input" ? "var(--warn)" : f.verdict === "outside" ? "var(--danger)" : "var(--agent)";
        return (
          <g key={f.id} onClick={() => onSelect(f.id)} className="cursor-pointer">
            {active && <circle cx={f.pin.x} cy={f.pin.y} r="3" fill={color} className="pin-pulse" />}
            <motion.circle
              cx={f.pin.x}
              cy={f.pin.y}
              initial={false}
              animate={{ r: active ? 3.6 : 2.2, opacity: active ? 1 : 0.55 }}
              transition={{ type: "spring", stiffness: 400, damping: 22 }}
              fill={color}
              stroke="var(--surface)"
              strokeWidth="1"
            />
            <circle cx={f.pin.x} cy={f.pin.y} r="7" fill="transparent">
              <title>{`${f.id} · ${f.title}`}</title>
            </circle>
          </g>
        );
      })}
    </svg>
  );
}
