"use client";

import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { agents, tierLabels, type AgentDef } from "../data/agents";

const statusStyles: Record<string, { dot: string; label: string; bg: string; fg: string }> = {
  active: { dot: "bg-nx-emerald-500 animate-pulse", label: "ACTIVE", bg: "var(--nx-emerald-50)", fg: "var(--nx-emerald-700)" },
  idle: { dot: "bg-nx-neutral-400", label: "IDLE", bg: "var(--nx-neutral-100)", fg: "var(--nx-neutral-600)" },
  error: { dot: "bg-nx-rose-500", label: "ERROR", bg: "var(--nx-rose-50)", fg: "var(--nx-rose-700)" },
  paused: { dot: "bg-nx-amber-500", label: "PAUSED", bg: "var(--nx-amber-50)", fg: "var(--nx-amber-700)" },
};

function AgentCard({ agent }: { agent: AgentDef }) {
  const ss = statusStyles[agent.status];
  return (
    <div className="rounded-xl border border-border bg-card shadow-elevation-1 hover:shadow-elevation-2 hover:-translate-y-px transition-all overflow-hidden" style={{ borderTop: `3px solid ${agent.color}` }}>
      <div className="p-5 space-y-4">
        {/* Header */}
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-2.5">
            <span className="text-xl">{agent.icon}</span>
            <div>
              <h4 className="text-sm font-semibold">{agent.name}</h4>
              <p className="text-[10px] text-muted-foreground">Agent #{agent.id} · Tier {agent.tier}: {agent.tierName} · v{agent.version}</p>
            </div>
          </div>
          <span className="inline-flex items-center gap-1.5 rounded-md px-2 py-0.5 text-[10px] font-bold" style={{ color: ss.fg, backgroundColor: ss.bg }}>
            <span className={cn("h-1.5 w-1.5 rounded-full", ss.dot)} />{ss.label}
          </span>
        </div>

        {/* Description */}
        <p className="text-xs text-muted-foreground leading-relaxed line-clamp-2">{agent.description}</p>

        {/* Metrics */}
        <div className="grid grid-cols-4 gap-2">
          {[
            { label: "Actions", value: agent.actionsToday.toLocaleString() },
            { label: "Auto Rate", value: `${agent.autoRate}%` },
            { label: "Latency", value: agent.avgLatency },
            { label: "Accuracy", value: `${agent.accuracy}%` },
          ].map((m) => (
            <div key={m.label} className="text-center rounded-lg bg-muted/30 py-1.5">
              <p className="text-xs font-bold tabular-nums">{m.value}</p>
              <p className="text-[9px] text-muted-foreground">{m.label}</p>
            </div>
          ))}
        </div>

        {/* Capabilities */}
        <div className="flex flex-wrap gap-1">
          {agent.capabilities.slice(0, 4).map((c) => (
            <span key={c} className="rounded-md px-1.5 py-0.5 text-[9px] font-bold" style={{ color: agent.color, backgroundColor: `${agent.color}15` }}>{c}</span>
          ))}
          {agent.capabilities.length > 4 && (
            <span className="rounded-md bg-muted px-1.5 py-0.5 text-[9px] text-muted-foreground">+{agent.capabilities.length - 4}</span>
          )}
        </div>

        {/* Autonomy + HITL */}
        <div className="text-[10px] text-muted-foreground space-y-0.5">
          <p><span className="font-semibold">Autonomy:</span> {agent.autonomy}</p>
          <p><span className="font-semibold">HITL:</span> {agent.hitl}</p>
        </div>
      </div>

      {/* Footer */}
      <div className="flex border-t border-border divide-x divide-border">
        <Button variant="ghost" className="flex-1 rounded-none h-9 text-xs">Details</Button>
        <Button variant="ghost" className="flex-1 rounded-none h-9 text-xs">Activity</Button>
        <Button variant="ghost" className="flex-1 rounded-none h-9 text-xs">Configure</Button>
      </div>
    </div>
  );
}

export function AgentCatalog() {
  const tiers = [1, 2, 3, 4];

  return (
    <div className="space-y-8">
      {tiers.map((tier) => {
        const info = tierLabels[tier];
        const tierAgents = agents.filter((a) => a.tier === tier);
        return (
          <div key={tier}>
            <div className="mb-4">
              <h3 className="text-xs font-bold uppercase tracking-widest text-muted-foreground/40">Tier {tier}: {info.name}</h3>
              <p className="text-xs text-muted-foreground mt-0.5">{info.description}</p>
            </div>
            <div className="grid gap-4 lg:grid-cols-2">
              {tierAgents.map((agent) => <AgentCard key={agent.id} agent={agent} />)}
            </div>
          </div>
        );
      })}
    </div>
  );
}
