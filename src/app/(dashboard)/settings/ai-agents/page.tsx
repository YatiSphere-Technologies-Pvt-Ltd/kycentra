"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { agents, type AgentDef } from "@/features/agent-hub/data/agents";
import {
  Settings, Shield, Zap, Users, User, AlertTriangle, Save,
  ChevronRight, Lock, Clock, Activity, RefreshCw, Eye,
  CheckCircle2, XCircle, Sparkles, ArrowLeft, Info,
} from "lucide-react";
import { useRouter } from "next/navigation";

/* ─── Types ─── */

type AutonomyMode = "auto" | "copilot" | "manual";

interface ThresholdConfig {
  autoResolve: number;
  humanReview: number;
  escalation: number;
}

const modeStyle: Record<AutonomyMode, { label: string; icon: typeof Zap; color: string; desc: string }> = {
  auto: { label: "Auto", icon: Zap, color: "var(--nx-emerald-600)", desc: "Agent decides autonomously" },
  copilot: { label: "Co-Pilot", icon: Users, color: "var(--nx-amber-600)", desc: "Agent recommends, human confirms" },
  manual: { label: "Manual", icon: User, color: "var(--nx-neutral-500)", desc: "Human decides, agent assists" },
};

/* ─── Page ─── */

export default function AIAgentConfigPage() {
  const router = useRouter();
  const [selectedAgent, setSelectedAgent] = useState<AgentDef>(agents[4]); // Screening Agent by default
  const [thresholds, setThresholds] = useState<ThresholdConfig>({ autoResolve: 80, humanReview: 60, escalation: 40 });

  // Autonomy matrix — per risk tier
  const [autonomyMatrix, setAutonomyMatrix] = useState<Record<string, Record<string, AutonomyMode>>>({
    "alert_resolution": { low: "auto", medium: "auto", high: "copilot", critical: "manual" },
    "pep_confirmation": { low: "copilot", medium: "copilot", high: "manual", critical: "manual" },
    "ofac_match": { low: "manual", medium: "manual", high: "manual", critical: "manual" },
  });

  const activeAgent = selectedAgent;

  return (
    <div className="space-y-5">
      {/* ─── Header ─── */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h1 className="text-lg font-bold tracking-tight">AI Agent Configuration</h1>
          <p className="text-[11px] text-muted-foreground mt-0.5">
            Configure autonomy, thresholds, guardrails, and model parameters for each agent
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm" className="h-7 text-[10px] font-semibold gap-1.5">
            <Eye className="h-3 w-3" /> Preview Impact
          </Button>
          <Button size="sm" className="h-7 text-[10px] font-semibold gap-1.5">
            <Save className="h-3 w-3" /> Save Changes
          </Button>
        </div>
      </div>

      {/* ─── Warning Banner ─── */}
      <div className="flex items-center gap-2 rounded-lg px-4 py-2.5 bg-nx-amber-50/50 border border-nx-amber-200 text-[11px]">
        <AlertTriangle className="h-3.5 w-3.5 text-nx-amber-600 shrink-0" />
        <span className="text-muted-foreground">Changes to AI agent configuration require CCO or MLRO approval and are logged to the immutable audit trail.</span>
      </div>

      {/* ─── Agent Selector + Config ─── */}
      <div className="grid gap-5 lg:grid-cols-12">
        {/* Agent list — 3 cols */}
        <div className="lg:col-span-3 rounded-lg border border-border bg-card overflow-hidden">
          <div className="px-4 py-2.5 border-b border-border bg-muted/20">
            <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest">Select Agent</span>
          </div>
          <div className="divide-y divide-border max-h-150 overflow-y-auto" style={{ scrollbarWidth: "none" }}>
            {agents.map((agent) => {
              const isSelected = activeAgent.key === agent.key;
              return (
                <button
                  key={agent.key}
                  onClick={() => setSelectedAgent(agent)}
                  className={cn("w-full text-left px-4 py-2.5 transition-colors flex items-center gap-2.5", isSelected ? "bg-muted/30" : "hover:bg-muted/10")}
                >
                  <div className="h-1.5 w-1.5 rounded-full shrink-0" style={{ backgroundColor: agent.status === "active" ? "var(--nx-emerald-500)" : "var(--nx-neutral-300)" }} />
                  <div className="flex-1 min-w-0">
                    <div className="text-[11px] font-semibold truncate">{agent.name}</div>
                    <div className="text-[9px] text-muted-foreground">T{agent.tier} · v{agent.version}</div>
                  </div>
                  {isSelected && <ChevronRight className="h-3 w-3 text-foreground shrink-0" />}
                </button>
              );
            })}
          </div>
        </div>

        {/* Configuration panels — 9 cols */}
        <div className="lg:col-span-9 space-y-5">
          {/* Agent identity */}
          <div className="rounded-lg border border-border bg-card p-4">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-3">
                <div className="h-1.5 w-1.5 rounded-full" style={{ backgroundColor: activeAgent.status === "active" ? "var(--nx-emerald-500)" : "var(--nx-neutral-300)" }} />
                <h2 className="text-[14px] font-bold">{activeAgent.name}</h2>
                <span className="text-[9px] font-bold text-muted-foreground uppercase">T{activeAgent.tier} {activeAgent.tierName}</span>
              </div>
              <span className="font-mono text-[10px] text-muted-foreground">v{activeAgent.version} · {activeAgent.model}</span>
            </div>
            <p className="text-[11px] text-muted-foreground leading-relaxed">{activeAgent.description}</p>
          </div>

          {/* ── Section 1: Confidence Thresholds ── */}
          <div className="rounded-lg border border-border bg-card overflow-hidden">
            <div className="flex items-center gap-2 px-4 py-2.5 border-b border-border">
              <Activity className="h-3.5 w-3.5 text-muted-foreground/40" />
              <span className="text-[12px] font-bold">Confidence Thresholds</span>
            </div>
            <div className="p-4 space-y-5">
              {/* Visual threshold bar */}
              <div className="relative h-10 rounded bg-muted/30 overflow-hidden">
                <div className="absolute inset-y-0 left-0 bg-nx-emerald-500/15" style={{ width: `${100 - thresholds.autoResolve}%`, right: 0, left: "auto" }} />
                <div className="absolute inset-y-0 bg-nx-amber-500/15" style={{ left: `${thresholds.escalation}%`, width: `${thresholds.humanReview - thresholds.escalation}%` }} />
                <div className="absolute inset-y-0 left-0 bg-nx-rose-500/10" style={{ width: `${thresholds.escalation}%` }} />

                {/* Markers */}
                <div className="absolute top-0 bottom-0 w-px bg-nx-rose-400" style={{ left: `${thresholds.escalation}%` }} />
                <div className="absolute top-0 bottom-0 w-px bg-nx-amber-400" style={{ left: `${thresholds.humanReview}%` }} />
                <div className="absolute top-0 bottom-0 w-px bg-nx-emerald-400" style={{ left: `${thresholds.autoResolve}%` }} />

                {/* Zone labels */}
                <div className="absolute inset-0 flex items-center">
                  <div className="flex-1 text-center text-[8px] font-bold text-nx-rose-600 uppercase tracking-wider" style={{ width: `${thresholds.escalation}%` }}>Escalate</div>
                  <div className="flex-1 text-center text-[8px] font-bold text-nx-amber-600 uppercase tracking-wider" style={{ width: `${thresholds.humanReview - thresholds.escalation}%` }}>Review</div>
                  <div className="flex-1 text-center text-[8px] font-bold text-nx-emerald-600 uppercase tracking-wider" style={{ width: `${100 - thresholds.autoResolve}%` }}>Auto</div>
                </div>
              </div>

              {/* Sliders */}
              <div className="grid gap-4 lg:grid-cols-3">
                {[
                  { key: "autoResolve" as const, label: "Auto-Resolve Threshold", desc: "Decisions above this confidence proceed without human review", color: "var(--nx-emerald-600)", impact: `Currently auto-resolving ${Math.round(activeAgent.autoRate)}% of decisions` },
                  { key: "humanReview" as const, label: "Human Review Threshold", desc: "Between this and auto-resolve, routes to analyst queue", color: "var(--nx-amber-600)", impact: `${Math.round(100 - activeAgent.autoRate)}% currently in review queue` },
                  { key: "escalation" as const, label: "Escalation Threshold", desc: "Below this confidence, auto-escalates to senior analyst", color: "var(--nx-rose-600)", impact: "0.3% of decisions currently escalated" },
                ].map((t) => (
                  <div key={t.key} className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-[11px] font-semibold">{t.label}</span>
                      <span className="text-[14px] font-extrabold tabular-nums" style={{ color: t.color }}>{thresholds[t.key]}%</span>
                    </div>
                    <input
                      type="range"
                      min={0}
                      max={100}
                      value={thresholds[t.key]}
                      onChange={(e) => setThresholds((prev) => ({ ...prev, [t.key]: Number(e.target.value) }))}
                      className="w-full h-1.5 rounded-full appearance-none cursor-pointer"
                      style={{ accentColor: t.color }}
                    />
                    <p className="text-[9px] text-muted-foreground">{t.desc}</p>
                    <p className="text-[9px] font-semibold" style={{ color: t.color }}>{t.impact}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* ── Section 2: Autonomy Matrix ── */}
          <div className="rounded-lg border border-border bg-card overflow-hidden">
            <div className="flex items-center gap-2 px-4 py-2.5 border-b border-border">
              <Zap className="h-3.5 w-3.5 text-muted-foreground/40" />
              <span className="text-[12px] font-bold">Autonomy Matrix</span>
              <span className="text-[10px] text-muted-foreground">Per-task autonomy by entity risk tier</span>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-[11px]">
                <thead>
                  <tr className="border-b border-border bg-muted/20">
                    <th className="text-left font-bold text-muted-foreground uppercase tracking-wider px-4 py-2">Task</th>
                    <th className="text-center font-bold text-muted-foreground uppercase tracking-wider px-3 py-2">Low Risk</th>
                    <th className="text-center font-bold text-muted-foreground uppercase tracking-wider px-3 py-2">Medium</th>
                    <th className="text-center font-bold text-muted-foreground uppercase tracking-wider px-3 py-2">High Risk</th>
                    <th className="text-center font-bold text-muted-foreground uppercase tracking-wider px-3 py-2">Critical</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border">
                  {Object.entries(autonomyMatrix).map(([task, tiers]) => (
                    <tr key={task}>
                      <td className="px-4 py-2.5 font-medium capitalize">{task.replace(/_/g, " ")}</td>
                      {(["low", "medium", "high", "critical"] as const).map((tier) => {
                        const mode = tiers[tier];
                        const ms = modeStyle[mode];
                        const MIcon = ms.icon;
                        return (
                          <td key={tier} className="px-3 py-2.5 text-center">
                            <button
                              onClick={() => {
                                const modes: AutonomyMode[] = ["auto", "copilot", "manual"];
                                const nextIdx = (modes.indexOf(mode) + 1) % modes.length;
                                setAutonomyMatrix((prev) => ({
                                  ...prev,
                                  [task]: { ...prev[task], [tier]: modes[nextIdx] },
                                }));
                              }}
                              className="inline-flex items-center gap-1 px-2 py-1 rounded text-[9px] font-bold transition-colors hover:opacity-80"
                              style={{ backgroundColor: `${ms.color}15`, color: ms.color }}
                            >
                              <MIcon className="h-2.5 w-2.5" />
                              {ms.label}
                            </button>
                          </td>
                        );
                      })}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <div className="px-4 py-2 border-t border-border text-[9px] text-muted-foreground">
              Click any cell to cycle through modes: Auto → Co-Pilot → Manual
            </div>
          </div>

          {/* ── Section 3: Model & Processing ── */}
          <div className="rounded-lg border border-border bg-card overflow-hidden">
            <div className="flex items-center gap-2 px-4 py-2.5 border-b border-border">
              <Sparkles className="h-3.5 w-3.5 text-muted-foreground/40" />
              <span className="text-[12px] font-bold">Model & Processing</span>
            </div>
            <div className="p-4">
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                {[
                  { label: "Base Model", value: activeAgent.model, type: "select", options: ["claude-opus-4-6", "claude-sonnet-4-6", "claude-haiku-4-5"] },
                  { label: "Temperature", value: "0.1", type: "input", hint: "Lower = more deterministic (0.0–1.0)" },
                  { label: "Max Tokens", value: "4,096", type: "input", hint: "Maximum output length per decision" },
                  { label: "Request Timeout", value: "30s", type: "input", hint: "Max processing time per action" },
                  { label: "Retry Policy", value: "3 retries", type: "input", hint: "Max retries with exponential backoff" },
                  { label: "Rate Limit", value: "100/min", type: "input", hint: "Maximum actions per minute" },
                  { label: "Batch Size", value: "50", type: "input", hint: "Max concurrent items per batch" },
                  { label: "Context Window", value: "128K", type: "select", options: ["32K", "64K", "128K", "200K"] },
                ].map((field) => (
                  <div key={field.label}>
                    <label className="text-[9px] font-bold text-muted-foreground uppercase tracking-widest block mb-1">{field.label}</label>
                    {field.type === "select" ? (
                      <select defaultValue={field.value} className="h-7 w-full rounded border border-border bg-background px-2 text-[11px] focus:outline-none focus:ring-1 focus:ring-foreground/20">
                        {field.options?.map((o) => <option key={o} value={o}>{o}</option>)}
                      </select>
                    ) : (
                      <input
                        type="text"
                        defaultValue={field.value}
                        className="h-7 w-full rounded border border-border bg-background px-2 text-[11px] focus:outline-none focus:ring-1 focus:ring-foreground/20"
                      />
                    )}
                    {field.hint && <p className="text-[8px] text-muted-foreground/50 mt-0.5">{field.hint}</p>}
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* ── Section 4: Safety Guardrails ── */}
          <div className="rounded-lg border border-border bg-card overflow-hidden">
            <div className="flex items-center gap-2 px-4 py-2.5 border-b border-border">
              <Shield className="h-3.5 w-3.5 text-muted-foreground/40" />
              <span className="text-[12px] font-bold">Safety Guardrails</span>
            </div>
            <div className="p-4 space-y-4">
              {/* Immutable guardrails */}
              <div>
                <div className="flex items-center gap-1.5 mb-2">
                  <Lock className="h-3 w-3 text-muted-foreground/40" />
                  <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest">Immutable (Platform-Enforced)</span>
                </div>
                <div className="space-y-1.5">
                  {[
                    "All decisions logged with full reasoning chain",
                    "Human override reason required and recorded",
                    "Confidence score attached to every output",
                    "Audit trail cryptographically sealed — cannot be modified",
                  ].map((rule) => (
                    <div key={rule} className="flex items-center gap-2 text-[11px]">
                      <Lock className="h-3 w-3 text-muted-foreground/20 shrink-0" />
                      <span className="text-muted-foreground">{rule}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Configurable guardrails — always human */}
              <div>
                <div className="flex items-center gap-1.5 mb-2">
                  <Shield className="h-3 w-3 text-muted-foreground/40" />
                  <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest">Always Require Human</span>
                </div>
                <div className="space-y-1.5">
                  {[
                    { label: "OFAC SDN matches (regardless of confidence)", checked: true, locked: true },
                    { label: "PEP classification confirmations", checked: true, locked: false },
                    { label: "True positive sanctions determinations", checked: true, locked: true },
                    { label: "SAR filing decisions", checked: true, locked: true },
                    { label: "Risk tier changes (any direction)", checked: true, locked: false },
                    { label: "Document fraud detection positives", checked: true, locked: false },
                  ].map((rule) => (
                    <label key={rule.label} className="flex items-center gap-2 text-[11px] cursor-pointer">
                      <input type="checkbox" defaultChecked={rule.checked} disabled={rule.locked} className="h-3 w-3 rounded" />
                      <span className={cn("text-muted-foreground", rule.locked && "opacity-60")}>{rule.label}</span>
                      {rule.locked && <Lock className="h-2.5 w-2.5 text-muted-foreground/20" />}
                    </label>
                  ))}
                </div>
              </div>

              {/* Never auto-resolve */}
              <div>
                <div className="flex items-center gap-1.5 mb-2">
                  <XCircle className="h-3 w-3 text-muted-foreground/40" />
                  <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest">Never Auto-Resolve</span>
                </div>
                <div className="space-y-1.5">
                  {[
                    { label: "Entities in FATF grey-list jurisdictions", checked: true },
                    { label: "Entities with PEP associations in ownership chain", checked: true },
                    { label: "First-time screening for new onboarding entities", checked: true },
                    { label: "Cross-border transaction anomalies above $1M", checked: false },
                    { label: "Entities flagged by 2+ agents simultaneously", checked: false },
                  ].map((rule) => (
                    <label key={rule.label} className="flex items-center gap-2 text-[11px] cursor-pointer">
                      <input type="checkbox" defaultChecked={rule.checked} className="h-3 w-3 rounded" />
                      <span className="text-muted-foreground">{rule.label}</span>
                    </label>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* ── Section 5: Escalation & Routing ── */}
          <div className="rounded-lg border border-border bg-card overflow-hidden">
            <div className="flex items-center gap-2 px-4 py-2.5 border-b border-border">
              <Users className="h-3.5 w-3.5 text-muted-foreground/40" />
              <span className="text-[12px] font-bold">Escalation & Routing</span>
            </div>
            <div className="p-4 space-y-3">
              <div className="grid grid-cols-2 lg:grid-cols-3 gap-4">
                {[
                  { label: "Default Assignee", value: "Round-robin (AML Ops team)", type: "select" },
                  { label: "Critical Alert Route", value: "MLRO (James Park)", type: "select" },
                  { label: "Escalation Timeout", value: "4 hours", type: "input", hint: "Auto-escalate if no response" },
                  { label: "SLA Warning", value: "75%", type: "input", hint: "Notify at this % of SLA elapsed" },
                  { label: "Fallback Mode", value: "Manual Queue", type: "select", hint: "When agent is unavailable" },
                  { label: "Max Queue Depth", value: "100", type: "input", hint: "Alert if queue exceeds this" },
                ].map((field) => (
                  <div key={field.label}>
                    <label className="text-[9px] font-bold text-muted-foreground uppercase tracking-widest block mb-1">{field.label}</label>
                    <input
                      type="text"
                      defaultValue={field.value}
                      className="h-7 w-full rounded border border-border bg-background px-2 text-[11px] focus:outline-none focus:ring-1 focus:ring-foreground/20"
                    />
                    {field.hint && <p className="text-[8px] text-muted-foreground/50 mt-0.5">{field.hint}</p>}
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* ── Section 6: Monitoring & Alerts ── */}
          <div className="rounded-lg border border-border bg-card overflow-hidden">
            <div className="flex items-center gap-2 px-4 py-2.5 border-b border-border">
              <AlertTriangle className="h-3.5 w-3.5 text-muted-foreground/40" />
              <span className="text-[12px] font-bold">Monitoring & Alert Triggers</span>
            </div>
            <div className="p-4">
              <div className="grid grid-cols-2 lg:grid-cols-3 gap-4">
                {[
                  { label: "Accuracy Floor", value: "90%", hint: "Suspend agent if accuracy drops below" },
                  { label: "Override Rate Ceiling", value: "5%", hint: "Alert if override rate exceeds" },
                  { label: "Error Rate Ceiling", value: "2%", hint: "Suspend agent if error rate exceeds" },
                  { label: "Latency P99 Max", value: "30s", hint: "Alert if P99 latency exceeds" },
                  { label: "Drift Threshold (KS)", value: "p < 0.05", hint: "Trigger drift alert" },
                  { label: "Auto-Rollback", value: "Enabled", hint: "Rollback to previous model on breach" },
                ].map((field) => (
                  <div key={field.label}>
                    <label className="text-[9px] font-bold text-muted-foreground uppercase tracking-widest block mb-1">{field.label}</label>
                    <input
                      type="text"
                      defaultValue={field.value}
                      className="h-7 w-full rounded border border-border bg-background px-2 text-[11px] focus:outline-none focus:ring-1 focus:ring-foreground/20"
                    />
                    <p className="text-[8px] text-muted-foreground/50 mt-0.5">{field.hint}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* ── Section 7: Data & Privacy ── */}
          <div className="rounded-lg border border-border bg-card overflow-hidden">
            <div className="flex items-center gap-2 px-4 py-2.5 border-b border-border">
              <Lock className="h-3.5 w-3.5 text-muted-foreground/40" />
              <span className="text-[12px] font-bold">Data & Privacy Controls</span>
            </div>
            <div className="p-4 space-y-2">
              {[
                { label: "PII Handling", value: "Pseudonymize before processing", enabled: true },
                { label: "Data Retention", value: "Decision logs retained for 7 years", enabled: true },
                { label: "Cross-Border Processing", value: "EU data stays in EU region", enabled: true },
                { label: "Training Data Feedback", value: "Override patterns fed back for retraining", enabled: false },
                { label: "Third-Party Data Sharing", value: "Never share entity data with model providers", enabled: true, locked: true },
              ].map((item) => (
                <div key={item.label} className="flex items-center justify-between py-1.5">
                  <div className="flex items-center gap-2">
                    {item.locked && <Lock className="h-2.5 w-2.5 text-muted-foreground/20" />}
                    <div>
                      <div className="text-[11px] font-medium">{item.label}</div>
                      <div className="text-[9px] text-muted-foreground">{item.value}</div>
                    </div>
                  </div>
                  <div className={cn("h-5 w-9 rounded-full p-0.5 cursor-pointer transition-colors", item.enabled ? "bg-foreground" : "bg-muted")}>
                    <div className={cn("h-4 w-4 rounded-full bg-background transition-transform", item.enabled && "translate-x-4")} />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
