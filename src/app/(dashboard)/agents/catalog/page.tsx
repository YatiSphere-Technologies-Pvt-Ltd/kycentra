"use client";

import { useState, Fragment } from "react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { ConfidenceBadge } from "@/components/shared";
import { agents, tierLabels, type AgentDef } from "@/features/agent-hub/data/agents";
import {
  Activity, ChevronRight, Settings, RefreshCw, Pause, Eye,
  CheckCircle2, Clock, AlertTriangle, Search,
} from "lucide-react";

/* ─── Helpers ─── */

const statusStyle: Record<string, { label: string; color: string }> = {
  active: { label: "Active", color: "var(--nx-emerald-600)" },
  idle: { label: "Idle", color: "var(--nx-neutral-400)" },
  error: { label: "Error", color: "var(--nx-rose-600)" },
  paused: { label: "Paused", color: "var(--nx-amber-600)" },
};

const tierColor: Record<number, string> = {
  1: "var(--nx-neutral-700)",
  2: "var(--nx-neutral-600)",
  3: "var(--nx-neutral-500)",
  4: "var(--nx-neutral-400)",
};

/* ─── Page ─── */

export default function AgentCatalogPage() {
  const [expandedKey, setExpandedKey] = useState<string | null>(null);
  const [filterTier, setFilterTier] = useState<number | null>(null);

  const activeCount = agents.filter((a) => a.status === "active").length;
  const totalActions = agents.reduce((s, a) => s + a.actionsToday, 0);
  const avgAccuracy = (agents.reduce((s, a) => s + a.accuracy, 0) / agents.length).toFixed(1);
  const avgAutoRate = (agents.reduce((s, a) => s + a.autoRate, 0) / agents.length).toFixed(1);

  const filtered = filterTier ? agents.filter((a) => a.tier === filterTier) : agents;
  const tiers = [...new Set(agents.map((a) => a.tier))].sort();

  return (
    <div className="space-y-5">
      {/* ─── Header ─── */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h1 className="text-lg font-bold tracking-tight">AI Agent Catalog</h1>
          <p className="text-[11px] text-muted-foreground mt-0.5">
            16 specialized agents across 4 tiers — {activeCount} active · {totalActions.toLocaleString()} actions today
          </p>
        </div>
        <div className="flex items-center gap-1.5">
          <div className="flex items-center gap-1 text-[10px] text-muted-foreground">
            <span className="h-1.5 w-1.5 rounded-full bg-nx-emerald-500 animate-pulse" />
            Context bus: 847 msg/min
          </div>
        </div>
      </div>

      {/* ─── KPIs ─── */}
      <div className="grid grid-cols-3 lg:grid-cols-5 gap-px bg-border rounded-lg overflow-hidden">
        {[
          { label: "Agents Active", value: `${activeCount}/16` },
          { label: "Actions Today", value: totalActions.toLocaleString() },
          { label: "Context Bus", value: "847/min" },
          { label: "Avg Auto Rate", value: `${avgAutoRate}%` },
          { label: "Avg Accuracy", value: `${avgAccuracy}%` },
        ].map((kpi) => (
          <div key={kpi.label} className="bg-card p-3">
            <div className="text-[9px] font-bold text-muted-foreground uppercase tracking-widest mb-1">{kpi.label}</div>
            <div className="text-[18px] font-extrabold tabular-nums tracking-tight">{kpi.value}</div>
          </div>
        ))}
      </div>

      {/* ─── Tier Filter ─── */}
      <div className="flex items-center gap-1">
        <button
          onClick={() => setFilterTier(null)}
          className={cn("px-2.5 py-1 text-[10px] font-bold rounded transition-colors", !filterTier ? "bg-foreground text-background" : "text-muted-foreground hover:bg-muted/50")}
        >
          All (16)
        </button>
        {tiers.map((t) => {
          const tl = tierLabels[t];
          const count = agents.filter((a) => a.tier === t).length;
          return (
            <button
              key={t}
              onClick={() => setFilterTier(filterTier === t ? null : t)}
              className={cn("px-2.5 py-1 text-[10px] font-bold rounded transition-colors", filterTier === t ? "bg-foreground text-background" : "text-muted-foreground hover:bg-muted/50")}
            >
              T{t}: {tl.name.split(" ")[0]} ({count})
            </button>
          );
        })}
      </div>

      {/* ─── Agent Table ─── */}
      <div className="rounded-lg border border-border bg-card overflow-hidden">
        <table className="w-full text-[11px]">
          <thead>
            <tr className="border-b border-border bg-muted/20">
              {["#", "Agent", "Tier", "Status", "Model", "Actions", "Auto Rate", "Latency", "Accuracy", "Override", "HITL", ""].map((h) => (
                <th key={h} className="text-left font-bold text-muted-foreground uppercase tracking-wider px-3 py-2 whitespace-nowrap">{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {filtered.map((agent) => {
              const st = statusStyle[agent.status];
              const isExpanded = expandedKey === agent.key;
              return (
                <Fragment key={agent.key}>
                  <tr
                    className={cn("border-b border-border cursor-pointer group transition-colors", isExpanded ? "bg-muted/15" : "hover:bg-muted/10")}
                    onClick={() => setExpandedKey(isExpanded ? null : agent.key)}
                  >
                    <td className="px-3 py-2.5">
                      <span className="text-[14px] font-extrabold tabular-nums text-muted-foreground/20">{String(agent.id).padStart(2, "0")}</span>
                    </td>
                    <td className="px-3 py-2.5">
                      <div className="flex items-center gap-2">
                        <div className="h-1.5 w-1.5 rounded-full shrink-0" style={{ backgroundColor: st.color }} />
                        <span className="text-[12px] font-semibold">{agent.name}</span>
                      </div>
                    </td>
                    <td className="px-3 py-2.5">
                      <span className="text-[9px] font-bold uppercase tracking-wider" style={{ color: tierColor[agent.tier] }}>
                        T{agent.tier} {agent.tierName}
                      </span>
                    </td>
                    <td className="px-3 py-2.5">
                      <span className="text-[9px] font-bold uppercase" style={{ color: st.color }}>{st.label}</span>
                    </td>
                    <td className="px-3 py-2.5">
                      <span className="font-mono text-[9px] text-muted-foreground">{agent.model}</span>
                      <span className="text-[9px] text-muted-foreground/40 ml-1">v{agent.version}</span>
                    </td>
                    <td className="px-3 py-2.5 font-bold tabular-nums">{agent.actionsToday.toLocaleString()}</td>
                    <td className="px-3 py-2.5 font-bold tabular-nums">{agent.autoRate}%</td>
                    <td className="px-3 py-2.5 tabular-nums text-muted-foreground">{agent.avgLatency}</td>
                    <td className="px-3 py-2.5">
                      <span className={cn("font-bold tabular-nums", agent.accuracy >= 97 ? "text-nx-emerald-600" : agent.accuracy >= 92 ? "" : "text-nx-amber-600")}>
                        {agent.accuracy}%
                      </span>
                    </td>
                    <td className="px-3 py-2.5 tabular-nums text-muted-foreground">
                      {agent.key === "audit" ? "0%" : `${(100 - agent.autoRate).toFixed(1)}%`}
                    </td>
                    <td className="px-3 py-2.5 text-[10px] text-muted-foreground max-w-28 truncate">{agent.hitl}</td>
                    <td className="px-3 py-2.5">
                      <ChevronRight className={cn("h-3 w-3 text-muted-foreground/30 group-hover:text-foreground transition-all", isExpanded && "rotate-90")} />
                    </td>
                  </tr>

                  {/* ─── Expanded Detail ─── */}
                  {isExpanded && (
                    <tr className="border-b border-border bg-muted/5">
                      <td colSpan={12} className="p-0">
                        <div className="grid lg:grid-cols-12 divide-y lg:divide-y-0 lg:divide-x divide-border">
                          {/* Left — Description + Capabilities (5 cols) */}
                          <div className="lg:col-span-5 p-5 space-y-4">
                            <div>
                              <div className="text-[9px] font-bold text-muted-foreground uppercase tracking-widest mb-2">Description</div>
                              <p className="text-[11px] text-muted-foreground leading-relaxed">{agent.description}</p>
                            </div>
                            <div>
                              <div className="text-[9px] font-bold text-muted-foreground uppercase tracking-widest mb-2">Capabilities</div>
                              <div className="flex flex-wrap gap-1">
                                {agent.capabilities.map((cap) => (
                                  <span key={cap} className="text-[9px] font-semibold px-1.5 py-0.5 rounded bg-muted text-muted-foreground">{cap}</span>
                                ))}
                              </div>
                            </div>
                          </div>

                          {/* Middle — Data flow (4 cols) */}
                          <div className="lg:col-span-4 p-5 space-y-4">
                            <div>
                              <div className="text-[9px] font-bold text-muted-foreground uppercase tracking-widest mb-2">Publishes To</div>
                              <div className="space-y-1">
                                {agent.publishesTo.map((p) => (
                                  <div key={p} className="flex items-center gap-1.5 text-[10px]">
                                    <span className="text-muted-foreground/40">→</span>
                                    <span className="text-muted-foreground">{p}</span>
                                  </div>
                                ))}
                              </div>
                            </div>
                            <div>
                              <div className="text-[9px] font-bold text-muted-foreground uppercase tracking-widest mb-2">Subscribes To</div>
                              <div className="space-y-1">
                                {agent.subscribesTo.map((s) => (
                                  <div key={s} className="flex items-center gap-1.5 text-[10px]">
                                    <span className="text-muted-foreground/40">←</span>
                                    <span className="text-muted-foreground">{s}</span>
                                  </div>
                                ))}
                              </div>
                            </div>
                            <div>
                              <div className="text-[9px] font-bold text-muted-foreground uppercase tracking-widest mb-2">Autonomy</div>
                              <p className="text-[10px] text-muted-foreground">{agent.autonomy}</p>
                            </div>
                          </div>

                          {/* Right — Actions (3 cols) */}
                          <div className="lg:col-span-3 p-5 space-y-3">
                            <div className="text-[9px] font-bold text-muted-foreground uppercase tracking-widest mb-1">Quick Actions</div>
                            <div className="space-y-1.5">
                              <Button variant="outline" size="sm" className="w-full h-7 text-[10px] font-semibold gap-1.5 justify-start">
                                <Eye className="h-3 w-3" /> View Activity Log
                              </Button>
                              <Button variant="outline" size="sm" className="w-full h-7 text-[10px] font-semibold gap-1.5 justify-start">
                                <Settings className="h-3 w-3" /> Configure Agent
                              </Button>
                              <Button variant="outline" size="sm" className="w-full h-7 text-[10px] font-semibold gap-1.5 justify-start">
                                <RefreshCw className="h-3 w-3" /> Run Now
                              </Button>
                              {agent.status === "active" && (
                                <Button variant="outline" size="sm" className="w-full h-7 text-[10px] font-semibold gap-1.5 justify-start text-nx-amber-600">
                                  <Pause className="h-3 w-3" /> Pause Agent
                                </Button>
                              )}
                            </div>

                            {/* Model info */}
                            <div className="pt-3 border-t border-border">
                              <div className="text-[9px] font-bold text-muted-foreground uppercase tracking-widest mb-2">Model</div>
                              <div className="space-y-1 text-[10px]">
                                <div className="flex justify-between">
                                  <span className="text-muted-foreground">Base</span>
                                  <span className="font-mono font-medium">{agent.model}</span>
                                </div>
                                <div className="flex justify-between">
                                  <span className="text-muted-foreground">Version</span>
                                  <span className="font-mono font-medium">v{agent.version}</span>
                                </div>
                                <div className="flex justify-between">
                                  <span className="text-muted-foreground">Risk Tier</span>
                                  <span className="font-bold" style={{ color: agent.tier <= 2 ? "var(--nx-rose-600)" : "var(--nx-amber-600)" }}>
                                    Tier {agent.tier <= 2 ? 1 : 2}
                                  </span>
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                      </td>
                    </tr>
                  )}
                </Fragment>
              );
            })}
          </tbody>
        </table>

        <div className="px-4 py-2.5 border-t border-border text-[10px] text-muted-foreground flex items-center justify-between">
          <span>{filtered.length} agents shown · Avg accuracy: {avgAccuracy}% · Avg auto-rate: {avgAutoRate}%</span>
          <span className="flex items-center gap-1">
            <span className="h-1.5 w-1.5 rounded-full bg-nx-emerald-500" /> Active
            <span className="h-1.5 w-1.5 rounded-full bg-nx-neutral-300 ml-2" /> Idle
          </span>
        </div>
      </div>
    </div>
  );
}
