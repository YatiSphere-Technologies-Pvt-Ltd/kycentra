"use client";

import { useState } from "react";
import { Loader2, CheckCircle2, Clock, MinusCircle, ChevronRight, BrainCircuit } from "lucide-react";
import { cn } from "@/lib/utils";
import { agentStyles } from "@/lib/styles";
import type { AgentTask, AgentTaskStatus } from "../types";
import type { AgentName } from "@/features/workbench/types";

const statusConfig: Record<AgentTaskStatus, { icon: typeof Loader2; label: string; dotColor: string }> = {
  active: { icon: Loader2, label: "ACTIVE", dotColor: "var(--nx-emerald-500)" },
  completed: { icon: CheckCircle2, label: "DONE", dotColor: "var(--nx-emerald-500)" },
  waiting: { icon: Clock, label: "WAIT", dotColor: "var(--nx-amber-500)" },
  idle: { icon: MinusCircle, label: "IDLE", dotColor: "var(--nx-neutral-300)" },
};

export function AgentSidebar({ agents }: { agents: AgentTask[] }) {
  const [open, setOpen] = useState(false);
  const activeCount = agents.filter((a) => a.status === "active").length;

  return (
    <>
      {/* Toggle button — always visible on right edge */}
      <button
        type="button"
        onClick={() => setOpen(!open)}
        className={cn(
          "fixed right-0 top-1/2 -translate-y-1/2 z-40 flex items-center gap-1 rounded-l-lg border border-r-0 border-border bg-card px-2 py-3 shadow-elevation-1 transition-all hover:bg-muted/30",
          open && "right-72"
        )}
        aria-label={open ? "Close AI agents panel" : "Open AI agents panel"}
      >
        <BrainCircuit className="h-4 w-4 text-nx-violet-500" />
        <span className="text-[10px] font-semibold text-muted-foreground tabular-nums">{activeCount}</span>
        <ChevronRight className={cn("h-3 w-3 text-muted-foreground transition-transform", open && "rotate-180")} />
      </button>

      {/* Slide-out panel */}
      <div className={cn(
        "fixed right-0 top-(--nx-topbar-height) bottom-16 z-30 w-72 border-l border-border bg-card shadow-elevation-3 transition-transform duration-300",
        open ? "translate-x-0" : "translate-x-full"
      )}>
        <div className="px-4 py-3 border-b border-border">
          <p className="text-sm font-semibold">AI Agents Working</p>
          <p className="text-[11px] text-muted-foreground">{activeCount} of {agents.length} active</p>
        </div>

        <div className="overflow-y-auto p-3 space-y-2" style={{ maxHeight: "calc(100% - 52px)" }}>
          {agents.map((agent) => {
            const sc = statusConfig[agent.status];
            const agentStyle = agentStyles[agent.agent as AgentName];
            const color = agentStyle?.color ?? "var(--nx-neutral-400)";

            return (
              <div
                key={agent.agent}
                className={cn(
                  "rounded-lg border p-3",
                  agent.status === "active" ? "border-border bg-card" : "border-transparent bg-muted/10"
                )}
                style={{ borderLeft: `3px solid ${agent.status === "idle" ? "var(--nx-neutral-200)" : color}` }}
              >
                <div className="flex items-center gap-2 mb-1">
                  <span className="h-2 w-2 rounded-full shrink-0" style={{ backgroundColor: sc.dotColor }} />
                  <span className="text-[11px] font-semibold truncate">{agent.agent}</span>
                  <span className="ml-auto text-[9px] font-semibold uppercase tracking-wider text-muted-foreground">{sc.label}</span>
                </div>
                <p className="text-[10px] text-muted-foreground leading-relaxed">{agent.task}</p>
                {agent.progress != null && agent.status === "active" && (
                  <div className="mt-1.5 h-1 rounded-full bg-nx-neutral-100">
                    <div className="h-full rounded-full transition-all" style={{ width: `${agent.progress}%`, backgroundColor: color }} />
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </>
  );
}
