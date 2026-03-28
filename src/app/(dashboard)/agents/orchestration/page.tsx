"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import {
  ArrowDown, ArrowRight, Users, Zap, User, Clock, CheckCircle2,
  Activity, Plus, Settings, ChevronRight, ChevronDown, GitBranch,
  AlertTriangle, Eye,
} from "lucide-react";

/* ─── Types ─── */

interface FlowStep {
  id: string;
  agent: string;
  mode: "auto" | "copilot" | "manual" | "parallel" | "hitl" | "system";
  label: string;
  desc: string;
  avgTime: string;
}

interface Flow {
  id: string;
  name: string;
  description: string;
  pattern: string;
  agents: number;
  steps: FlowStep[];
  stats: { runs30d: number; avgDuration: string; successRate: number; autoRate: number; humanTouches: number };
  bottleneck?: string;
  active: boolean;
}

/* ─── Mock Data ─── */

const flows: Flow[] = [
  {
    id: "flow-onboard-cdd",
    name: "Client Onboarding (CDD)",
    description: "Standard corporate client onboarding — data collection through activation",
    pattern: "Parallel Fan-Out → Sequential Pipeline → HITL Checkpoint",
    agents: 8,
    steps: [
      { id: "s1", agent: "Workflow Orchestrator", mode: "system", label: "Trigger", desc: "RM initiates onboarding request", avgTime: "—" },
      { id: "s2", agent: "Data Sourcing", mode: "auto", label: "Registry Query", desc: "Query 200+ registries, pre-fill entity data", avgTime: "4s" },
      { id: "s3", agent: "Entity Intelligence", mode: "auto", label: "UBO Discovery", desc: "Recursive ownership unwrapping", avgTime: "8s" },
      { id: "s4", agent: "Document Intelligence", mode: "auto", label: "Doc Processing", desc: "Classify, extract, validate uploads", avgTime: "6s" },
      { id: "s5", agent: "Media Intelligence", mode: "auto", label: "Media Scan", desc: "Adverse media check across 50K+ sources", avgTime: "2s" },
      { id: "s6", agent: "Screening Agent", mode: "auto", label: "Screening", desc: "Sanctions, PEP, watchlist screening", avgTime: "340ms" },
      { id: "s7", agent: "Risk Intelligence", mode: "copilot", label: "Risk Scoring", desc: "Dynamic risk assessment with all inputs", avgTime: "3s" },
      { id: "s8", agent: "Regulatory Intelligence", mode: "auto", label: "Reg Mapping", desc: "Map jurisdiction requirements, set DD level", avgTime: "7s" },
      { id: "s9", agent: "Quality Assurance", mode: "auto", label: "QA Check", desc: "Spot-check agent outputs for consistency", avgTime: "2s" },
      { id: "s10", agent: "Analyst", mode: "hitl", label: "Human Approval", desc: "Analyst reviews findings and approves", avgTime: "45m" },
      { id: "s11", agent: "Audit & Compliance", mode: "auto", label: "Audit Seal", desc: "Seal complete audit trail", avgTime: "50ms" },
    ],
    stats: { runs30d: 312, avgDuration: "4.2h", successRate: 98.7, autoRate: 92, humanTouches: 2.3 },
    bottleneck: "Document processing (avg 2.1h wait for client uploads)",
    active: true,
  },
  {
    id: "flow-review",
    name: "Periodic Review (Annual)",
    description: "KYC refresh with re-screening and risk reassessment",
    pattern: "Sequential Pipeline → HITL Checkpoint",
    agents: 6,
    steps: [
      { id: "r1", agent: "Workflow Orchestrator", mode: "system", label: "Trigger", desc: "Scheduled review date reached", avgTime: "—" },
      { id: "r2", agent: "Data Sourcing", mode: "auto", label: "Data Refresh", desc: "Re-query registries for changes", avgTime: "5s" },
      { id: "r3", agent: "Screening Agent", mode: "auto", label: "Re-Screen", desc: "Full screening against all lists", avgTime: "340ms" },
      { id: "r4", agent: "Document Intelligence", mode: "copilot", label: "Doc Check", desc: "Verify document currency, flag expired", avgTime: "3s" },
      { id: "r5", agent: "Risk Intelligence", mode: "copilot", label: "Risk Update", desc: "Recalculate risk with fresh data", avgTime: "3s" },
      { id: "r6", agent: "Analyst", mode: "hitl", label: "Review & Sign", desc: "Analyst reviews and signs off", avgTime: "30m" },
    ],
    stats: { runs30d: 45, avgDuration: "2.5h", successRate: 97.8, autoRate: 85, humanTouches: 1.5 },
    active: true,
  },
  {
    id: "flow-screening",
    name: "Continuous Screening",
    description: "Portfolio-wide re-screening triggered by sanctions list updates",
    pattern: "Monitoring Loop → Event-Driven Cascade",
    agents: 3,
    steps: [
      { id: "c1", agent: "Regulatory Intelligence", mode: "system", label: "List Update", desc: "Sanctions list update detected", avgTime: "—" },
      { id: "c2", agent: "Screening Agent", mode: "auto", label: "Batch Screen", desc: "Re-screen entire portfolio", avgTime: "45m" },
      { id: "c3", agent: "Screening Agent", mode: "auto", label: "Auto-Resolve", desc: "Resolve obvious false positives", avgTime: "instant" },
      { id: "c4", agent: "Analyst", mode: "hitl", label: "Review Alerts", desc: "Review remaining unresolved alerts", avgTime: "varies" },
    ],
    stats: { runs30d: 60, avgDuration: "45m", successRate: 99.9, autoRate: 85, humanTouches: 0.5 },
    active: true,
  },
  {
    id: "flow-investigation",
    name: "SAR Investigation",
    description: "Evidence assembly, narrative drafting, and filing workflow",
    pattern: "Event-Driven Cascade → Sequential Pipeline → HITL Checkpoint",
    agents: 5,
    steps: [
      { id: "i1", agent: "Screening Agent", mode: "system", label: "Trigger", desc: "True positive or escalation triggers case", avgTime: "—" },
      { id: "i2", agent: "Investigation Agent", mode: "copilot", label: "Brief Assembly", desc: "Auto-assemble case brief from all agent data", avgTime: "12s" },
      { id: "i3", agent: "Investigation Agent", mode: "copilot", label: "Evidence Chain", desc: "Construct evidence chain with citations", avgTime: "8s" },
      { id: "i4", agent: "Investigation Agent", mode: "copilot", label: "SAR Drafting", desc: "Draft SAR narrative in FinCEN format", avgTime: "15s" },
      { id: "i5", agent: "Analyst", mode: "hitl", label: "Review & File", desc: "Analyst reviews, edits, and files SAR", avgTime: "2h" },
      { id: "i6", agent: "Reporting Agent", mode: "auto", label: "File SAR", desc: "Submit to FinCEN / relevant FIU", avgTime: "5s" },
    ],
    stats: { runs30d: 3, avgDuration: "4.2d", successRate: 100, autoRate: 42, humanTouches: 4.5 },
    active: true,
  },
  {
    id: "flow-reg-change",
    name: "Regulatory Change Response",
    description: "Impact assessment and rule deployment when regulations change",
    pattern: "Event-Driven Cascade → HITL Checkpoint",
    agents: 3,
    steps: [
      { id: "g1", agent: "Regulatory Intelligence", mode: "auto", label: "Change Detected", desc: "New regulation or amendment identified", avgTime: "—" },
      { id: "g2", agent: "Regulatory Intelligence", mode: "auto", label: "Impact Assessment", desc: "Analyze affected entities and rules", avgTime: "30m" },
      { id: "g3", agent: "Regulatory Intelligence", mode: "copilot", label: "Draft Updates", desc: "Draft rule changes with citations", avgTime: "1h" },
      { id: "g4", agent: "CCO", mode: "hitl", label: "Approve & Deploy", desc: "CCO reviews and deploys rule changes", avgTime: "2d" },
    ],
    stats: { runs30d: 4, avgDuration: "2d", successRate: 95.0, autoRate: 60, humanTouches: 2 },
    active: true,
  },
  {
    id: "flow-offboard",
    name: "Client Offboarding",
    description: "Controlled exit ensuring all regulatory obligations are fulfilled",
    pattern: "Sequential Pipeline → HITL Checkpoint",
    agents: 4,
    steps: [
      { id: "o1", agent: "CCO", mode: "hitl", label: "Initiate Exit", desc: "CCO approves relationship termination", avgTime: "—" },
      { id: "o2", agent: "Screening Agent", mode: "auto", label: "Final Screen", desc: "Final sanctions and PEP screening", avgTime: "340ms" },
      { id: "o3", agent: "Reporting Agent", mode: "auto", label: "File Reports", desc: "File any outstanding regulatory reports", avgTime: "10s" },
      { id: "o4", agent: "Audit & Compliance", mode: "auto", label: "Archive", desc: "Seal and archive all entity records", avgTime: "2s" },
      { id: "o5", agent: "Client Communication", mode: "copilot", label: "Notify Client", desc: "Send exit notification to client", avgTime: "1m" },
    ],
    stats: { runs30d: 2, avgDuration: "1d", successRate: 100, autoRate: 65, humanTouches: 2 },
    active: true,
  },
];

const modeStyle: Record<string, { label: string; bg: string; fg: string }> = {
  auto: { label: "Auto", bg: "var(--nx-emerald-50)", fg: "var(--nx-emerald-700)" },
  copilot: { label: "Co-Pilot", bg: "var(--nx-amber-50)", fg: "var(--nx-amber-700)" },
  manual: { label: "Manual", bg: "var(--nx-neutral-100)", fg: "var(--nx-neutral-600)" },
  hitl: { label: "Human", bg: "var(--foreground)", fg: "var(--background)" },
  system: { label: "Trigger", bg: "var(--nx-neutral-100)", fg: "var(--nx-neutral-500)" },
  parallel: { label: "Parallel", bg: "var(--nx-neutral-100)", fg: "var(--nx-neutral-600)" },
};

const patterns = [
  { name: "Parallel Fan-Out", desc: "Multiple agents work simultaneously on different aspects of the same entity" },
  { name: "Sequential Pipeline", desc: "Each agent's output feeds into the next in a defined order" },
  { name: "Event-Driven Cascade", desc: "Agent finding triggers downstream agents automatically" },
  { name: "Monitoring Loop", desc: "Agent runs continuously, triggering actions on detected changes" },
  { name: "HITL Checkpoint", desc: "Workflow pauses for human review before proceeding" },
  { name: "Quality Feedback Loop", desc: "QA agent validates outputs and feeds corrections back" },
];

/* ─── Page ─── */

export default function OrchestrationPage() {
  const [selectedFlow, setSelectedFlow] = useState<Flow>(flows[0]);
  const [expandedFlowId, setExpandedFlowId] = useState<string | null>(flows[0].id);

  return (
    <div className="space-y-5">
      {/* ─── Header ─── */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h1 className="text-lg font-bold tracking-tight">Multi-Agent Orchestration</h1>
          <p className="text-[11px] text-muted-foreground mt-0.5">
            {flows.length} active flows · 6 orchestration patterns · {flows.reduce((s, f) => s + f.stats.runs30d, 0)} runs this month
          </p>
        </div>
        <Button size="sm" className="h-7 text-[10px] font-semibold gap-1.5">
          <Plus className="h-3 w-3" /> Create Flow
        </Button>
      </div>

      {/* ─── KPIs ─── */}
      <div className="grid grid-cols-3 lg:grid-cols-6 gap-px bg-border rounded-lg overflow-hidden">
        {[
          { label: "Active Flows", value: String(flows.length) },
          { label: "Total Runs (30d)", value: String(flows.reduce((s, f) => s + f.stats.runs30d, 0)) },
          { label: "Avg Success Rate", value: `${(flows.reduce((s, f) => s + f.stats.successRate, 0) / flows.length).toFixed(1)}%` },
          { label: "Avg Auto Rate", value: `${Math.round(flows.reduce((s, f) => s + f.stats.autoRate, 0) / flows.length)}%` },
          { label: "Avg Human Touches", value: (flows.reduce((s, f) => s + f.stats.humanTouches, 0) / flows.length).toFixed(1) },
          { label: "Patterns Used", value: "6" },
        ].map((kpi) => (
          <div key={kpi.label} className="bg-card p-3">
            <div className="text-[9px] font-bold text-muted-foreground uppercase tracking-widest mb-1">{kpi.label}</div>
            <div className="text-[18px] font-extrabold tabular-nums tracking-tight">{kpi.value}</div>
          </div>
        ))}
      </div>

      {/* ─── Flow List with Expandable Details ─── */}
      <div className="rounded-lg border border-border bg-card overflow-hidden">
        <div className="flex items-center justify-between px-4 py-2.5 border-b border-border">
          <div className="flex items-center gap-2">
            <GitBranch className="h-3.5 w-3.5 text-muted-foreground/40" />
            <span className="text-[12px] font-bold">Orchestration Flows</span>
          </div>
        </div>

        <div className="divide-y divide-border">
          {flows.map((flow) => {
            const isExpanded = expandedFlowId === flow.id;
            const autoSteps = flow.steps.filter((s) => s.mode === "auto").length;
            const hitlSteps = flow.steps.filter((s) => s.mode === "hitl").length;

            return (
              <div key={flow.id}>
                {/* Flow header row */}
                <button
                  className="w-full text-left px-4 py-3 hover:bg-muted/10 transition-colors flex items-start gap-4"
                  onClick={() => setExpandedFlowId(isExpanded ? null : flow.id)}
                >
                  <ChevronRight className={cn("h-3.5 w-3.5 text-muted-foreground/30 mt-0.5 shrink-0 transition-transform", isExpanded && "rotate-90")} />

                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-0.5">
                      <span className="text-[12px] font-bold">{flow.name}</span>
                      <span className="text-[9px] font-bold text-muted-foreground">{flow.agents} agents</span>
                    </div>
                    <p className="text-[10px] text-muted-foreground">{flow.description}</p>
                    <div className="flex items-center gap-3 mt-1.5 text-[9px]">
                      <span className="text-muted-foreground">Pattern: <strong className="text-foreground">{flow.pattern}</strong></span>
                    </div>
                  </div>

                  {/* Stats */}
                  <div className="shrink-0 flex items-center gap-5 text-[10px]">
                    <div className="text-right"><div className="font-bold tabular-nums">{flow.stats.runs30d}</div><div className="text-muted-foreground/50">runs/30d</div></div>
                    <div className="text-right"><div className="font-bold tabular-nums">{flow.stats.avgDuration}</div><div className="text-muted-foreground/50">avg time</div></div>
                    <div className="text-right"><div className="font-bold tabular-nums">{flow.stats.successRate}%</div><div className="text-muted-foreground/50">success</div></div>
                    <div className="text-right"><div className="font-bold tabular-nums">{flow.stats.autoRate}%</div><div className="text-muted-foreground/50">auto</div></div>
                  </div>
                </button>

                {/* Expanded — step pipeline */}
                {isExpanded && (
                  <div className="px-4 pb-5 pt-1 bg-muted/5 border-t border-border">
                    {/* Step pipeline visualization */}
                    <div className="mt-3 space-y-0">
                      {flow.steps.map((step, i) => {
                        const ms = modeStyle[step.mode];
                        const isParallelStart = flow.id === "flow-onboard-cdd" && i >= 1 && i <= 4;
                        const isParallelEnd = flow.id === "flow-onboard-cdd" && i === 5;

                        return (
                          <div key={step.id}>
                            {/* Parallel indicator */}
                            {isParallelStart && i === 1 && (
                              <div className="flex items-center gap-2 ml-6 mb-1.5">
                                <div className="h-px flex-1 bg-border max-w-8" />
                                <span className="text-[8px] font-bold text-muted-foreground/40 uppercase tracking-widest">Parallel</span>
                                <div className="h-px flex-1 bg-border" />
                              </div>
                            )}
                            {isParallelEnd && (
                              <div className="flex items-center gap-2 ml-6 mb-1.5">
                                <div className="h-px flex-1 bg-border max-w-8" />
                                <span className="text-[8px] font-bold text-muted-foreground/40 uppercase tracking-widest">Merge</span>
                                <div className="h-px flex-1 bg-border" />
                              </div>
                            )}

                            <div className="flex items-center gap-3">
                              {/* Connector line */}
                              <div className="flex flex-col items-center w-3 shrink-0">
                                {i > 0 && <div className="h-2 w-px bg-border" />}
                                <div
                                  className="h-2 w-2 rounded-full shrink-0"
                                  style={{ backgroundColor: step.mode === "hitl" ? "var(--foreground)" : step.mode === "auto" ? "var(--nx-emerald-500)" : step.mode === "copilot" ? "var(--nx-amber-500)" : "var(--nx-neutral-300)" }}
                                />
                                {i < flow.steps.length - 1 && <div className="h-2 w-px bg-border" />}
                              </div>

                              {/* Step card */}
                              <div className={cn("flex-1 flex items-center gap-3 rounded border border-border p-2.5 transition-colors", isParallelStart && "ml-3 border-dashed")}>
                                <span className="text-[9px] font-bold px-1.5 py-0.5 rounded whitespace-nowrap" style={{ backgroundColor: ms.bg, color: ms.fg }}>
                                  {ms.label}
                                </span>
                                <div className="flex-1 min-w-0">
                                  <div className="text-[11px] font-semibold">{step.label}</div>
                                  <div className="text-[10px] text-muted-foreground">{step.agent} — {step.desc}</div>
                                </div>
                                <span className="text-[9px] text-muted-foreground/50 tabular-nums shrink-0">{step.avgTime}</span>
                              </div>
                            </div>
                          </div>
                        );
                      })}
                    </div>

                    {/* Flow stats + bottleneck */}
                    <div className="mt-4 grid grid-cols-2 lg:grid-cols-5 gap-px bg-border rounded overflow-hidden">
                      <div className="bg-card p-3"><div className="text-[9px] font-bold text-muted-foreground uppercase tracking-widest mb-0.5">Runs (30d)</div><div className="text-[14px] font-extrabold tabular-nums">{flow.stats.runs30d}</div></div>
                      <div className="bg-card p-3"><div className="text-[9px] font-bold text-muted-foreground uppercase tracking-widest mb-0.5">Avg Duration</div><div className="text-[14px] font-extrabold tabular-nums">{flow.stats.avgDuration}</div></div>
                      <div className="bg-card p-3"><div className="text-[9px] font-bold text-muted-foreground uppercase tracking-widest mb-0.5">Success Rate</div><div className="text-[14px] font-extrabold tabular-nums">{flow.stats.successRate}%</div></div>
                      <div className="bg-card p-3"><div className="text-[9px] font-bold text-muted-foreground uppercase tracking-widest mb-0.5">Auto Rate</div><div className="text-[14px] font-extrabold tabular-nums">{flow.stats.autoRate}%</div></div>
                      <div className="bg-card p-3"><div className="text-[9px] font-bold text-muted-foreground uppercase tracking-widest mb-0.5">Human Touches</div><div className="text-[14px] font-extrabold tabular-nums">{flow.stats.humanTouches}</div></div>
                    </div>

                    {flow.bottleneck && (
                      <div className="mt-3 flex items-center gap-2 p-2.5 rounded bg-nx-amber-50/50 border border-nx-amber-200 text-[10px]">
                        <AlertTriangle className="h-3 w-3 text-nx-amber-600 shrink-0" />
                        <span className="text-muted-foreground">Bottleneck: <strong className="text-foreground">{flow.bottleneck}</strong></span>
                      </div>
                    )}

                    <div className="mt-3 flex items-center gap-2">
                      <Button variant="outline" size="sm" className="h-6 text-[9px] font-semibold gap-1"><Settings className="h-2.5 w-2.5" /> Edit Flow</Button>
                      <Button variant="outline" size="sm" className="h-6 text-[9px] font-semibold gap-1"><Eye className="h-2.5 w-2.5" /> View Runs</Button>
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* ─── Orchestration Patterns Reference ─── */}
      <div className="rounded-lg border border-border bg-card overflow-hidden">
        <div className="px-4 py-2.5 border-b border-border">
          <span className="text-[12px] font-bold">Orchestration Patterns</span>
        </div>
        <div className="grid grid-cols-2 lg:grid-cols-3 divide-x divide-y divide-border">
          {patterns.map((p) => (
            <div key={p.name} className="p-4">
              <div className="text-[11px] font-bold mb-1">{p.name}</div>
              <p className="text-[10px] text-muted-foreground leading-relaxed">{p.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
