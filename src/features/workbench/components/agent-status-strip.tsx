"use client";

import { agentStyles } from "@/lib/styles";
import type { AgentName } from "../types";

interface AgentStatus {
  name: AgentName;
  status: "active" | "processing" | "idle" | "error";
  doneToday: number;
  needReview: number;
  autoRate: number;
}

const agentStatuses: AgentStatus[] = [
  { name: "Document Agent", status: "active", doneToday: 142, needReview: 2, autoRate: 98 },
  { name: "Entity Agent", status: "active", doneToday: 87, needReview: 0, autoRate: 100 },
  { name: "Screening Agent", status: "active", doneToday: 812, needReview: 47, autoRate: 85 },
  { name: "Risk Agent", status: "active", doneToday: 56, needReview: 5, autoRate: 92 },
  { name: "Regulatory Agent", status: "active", doneToday: 23, needReview: 3, autoRate: 87 },
  { name: "Investigation Agent", status: "idle", doneToday: 3, needReview: 2, autoRate: 60 },
];

const icons: Record<string, string> = {
  "Document Agent": "📄", "Entity Agent": "🏢", "Screening Agent": "🛡",
  "Risk Agent": "⚡", "Regulatory Agent": "📖", "Investigation Agent": "🔍",
};

const shortNames: Record<string, string> = {
  "Document Agent": "DOC", "Entity Agent": "ENTITY", "Screening Agent": "SCREEN",
  "Risk Agent": "RISK", "Regulatory Agent": "REG", "Investigation Agent": "INVEST",
};

const statusDot: Record<string, { color: string; label: string }> = {
  active: { color: "var(--nx-emerald-500)", label: "Active" },
  processing: { color: "var(--nx-teal-500)", label: "Processing" },
  idle: { color: "var(--nx-neutral-400)", label: "Idle" },
  error: { color: "var(--nx-rose-500)", label: "Error" },
};

export function AgentStatusStrip() {
  return (
    <div className="grid grid-cols-3 gap-3 lg:grid-cols-6">
      {agentStatuses.map((agent) => {
        const style = agentStyles[agent.name];
        const sd = statusDot[agent.status];
        return (
          <div
            key={agent.name}
            className="rounded-xl border border-border bg-card p-3 shadow-elevation-1 hover:shadow-elevation-2 transition-all cursor-pointer"
            style={{ borderTop: `3px solid ${style?.color ?? "var(--nx-neutral-300)"}` }}
          >
            <div className="flex items-center gap-2 mb-2">
              <span className="text-base">{icons[agent.name]}</span>
              <span className="text-[11px] font-bold uppercase tracking-wider">{shortNames[agent.name]}</span>
            </div>

            <div className="flex items-center gap-1.5 mb-2">
              <span className="h-2 w-2 rounded-full" style={{ backgroundColor: sd.color }} />
              <span className="text-[10px] text-muted-foreground">{sd.label}</span>
            </div>

            <div className="space-y-1 text-[11px]">
              <div className="flex items-center justify-between">
                <span className="text-muted-foreground">Done</span>
                <span className="font-bold tabular-nums">{agent.doneToday}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-muted-foreground">Need review</span>
                <span className={`font-bold tabular-nums ${agent.needReview > 0 ? "text-nx-amber-600" : ""}`}>{agent.needReview}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-muted-foreground">Auto rate</span>
                <span className="font-bold tabular-nums">{agent.autoRate}%</span>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}
