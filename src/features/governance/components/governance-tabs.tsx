"use client";

import { ScrollArea } from "@/components/ui/scroll-area";
import { Button } from "@/components/ui/button";
import { AIIndicator, ConfidenceBadge } from "@/components/shared";
import { DashboardCard } from "@/components/shared/dashboard-card";
import { CheckCircle2, AlertTriangle, Lock, Download, Plus, Pause, RefreshCw } from "lucide-react";
import { cn } from "@/lib/utils";
import type { AgentHealth, ModelEntry, DecisionEntry, DriftTest, BiasTest, Incident } from "../types";

// === TAB 1: AGENT MONITOR ===
export function AgentMonitorTab({ agents }: { agents: AgentHealth[] }) {
  return (
    <div className="space-y-4">
      <div className="grid gap-4 lg:grid-cols-2 xl:grid-cols-3">
        {agents.map((a) => (
          <div key={a.id} className="rounded-xl border border-border bg-card p-4 shadow-elevation-1" style={{ borderTop: `3px solid ${a.color}` }}>
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <span className="text-base">{a.icon}</span>
                <span className="text-sm font-semibold">{a.name}</span>
              </div>
              <div className="flex items-center gap-1.5">
                <span className={`h-2 w-2 rounded-full ${a.status === "active" ? "bg-nx-emerald-500" : a.status === "idle" ? "bg-nx-neutral-400" : "bg-nx-rose-500"}`} />
                <span className="text-[10px] font-medium uppercase text-muted-foreground">{a.status}</span>
              </div>
            </div>

            <div className="grid grid-cols-3 gap-2 text-center mb-3">
              <div className="rounded-lg bg-muted/30 p-2">
                <p className="text-sm font-bold tabular-nums">{a.todayActions}</p>
                <p className="text-[9px] text-muted-foreground">Actions</p>
              </div>
              <div className="rounded-lg bg-muted/30 p-2">
                <p className="text-sm font-bold tabular-nums">{Math.round(a.todayAutoRate * 100)}%</p>
                <p className="text-[9px] text-muted-foreground">Auto Rate</p>
              </div>
              <div className="rounded-lg bg-muted/30 p-2">
                <p className="text-sm font-bold tabular-nums">{a.todayErrors}</p>
                <p className="text-[9px] text-muted-foreground">Errors</p>
              </div>
            </div>

            <div className="space-y-1.5 text-[11px]">
              <div className="flex justify-between"><span className="text-muted-foreground">Avg Confidence</span><span className="font-semibold tabular-nums">{(a.avgConfidence * 100).toFixed(1)}%</span></div>
              <div className="flex justify-between"><span className="text-muted-foreground">Latency (avg/P99)</span><span className="font-mono tabular-nums">{a.avgLatency} / {a.p99Latency}</span></div>
              <div className="flex justify-between"><span className="text-muted-foreground">Override Rate</span><span className="tabular-nums">{(a.overrideRate * 100).toFixed(1)}%</span></div>
              <div className="flex justify-between"><span className="text-muted-foreground">Uptime (30d)</span><span className="tabular-nums">{a.uptime30d}%</span></div>
            </div>

            {/* Accuracy metrics */}
            <div className="mt-3 pt-3 border-t border-border space-y-1">
              {Object.entries(a.accuracy).map(([key, val]) => (
                <div key={key} className="flex items-center gap-2 text-[10px]">
                  <span className={val >= 0.95 ? "text-nx-emerald-600" : val >= 0.9 ? "text-nx-amber-600" : "text-nx-rose-600"}>
                    {val >= 0.95 ? "✅" : val >= 0.9 ? "⚠" : "🔴"}
                  </span>
                  <span className="text-muted-foreground capitalize flex-1">{key.replace(/([A-Z])/g, " $1")}</span>
                  <span className="font-semibold tabular-nums">{(val * 100).toFixed(1)}%</span>
                </div>
              ))}
            </div>

            {a.driftAlert && (
              <div className="mt-3 rounded-lg p-2 text-[10px]" style={{ backgroundColor: "var(--nx-amber-50)", borderLeft: "3px solid var(--nx-amber-500)" }}>
                ⚠ {a.driftAlert.detail}
              </div>
            )}

            <div className="mt-3 text-[10px] text-muted-foreground truncate">{a.lastAction}</div>

            <div className="flex gap-1.5 mt-3">
              <Button variant="outline" size="sm" className="h-6 text-[9px] px-2 flex-1">Metrics</Button>
              <Button variant="outline" size="sm" className="h-6 text-[9px] px-2 flex-1">Decisions</Button>
              <Button variant="ghost" size="sm" className="h-6 text-[9px] px-2"><Pause className="h-3 w-3" /></Button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

// === TAB 2: MODEL REGISTRY ===
export function ModelRegistryTab({ models }: { models: ModelEntry[] }) {
  const tierLabel: Record<number, { label: string; color: string }> = {
    1: { label: "🔴 Tier 1 Critical", color: "var(--nx-rose-600)" },
    2: { label: "🟡 Tier 2 Moderate", color: "var(--nx-amber-600)" },
    3: { label: "🟢 Tier 3 Lower", color: "var(--nx-emerald-600)" },
  };

  return (
    <DashboardCard.Root>
      <DashboardCard.Header title="Model Registry" badge={<span className="text-xs text-muted-foreground">{models.length} models</span>} actions={<Button size="sm" className="h-7 text-xs gap-1"><Plus className="h-3 w-3" />Register</Button>} />
      <DashboardCard.Content noPadding className="overflow-auto">
        <table className="w-full text-sm" aria-label="Model registry">
          <caption className="sr-only">Deployed AI models</caption>
          <thead>
            <tr className="border-b border-border bg-muted/40">
              {["Model ID", "Name", "Agent", "Base", "Version", "Risk Tier", "Status", "Next Validation"].map((h) => (
                <th key={h} scope="col" className="px-4 py-2.5 text-left text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">{h}</th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-border">
            {models.map((m) => {
              const tier = tierLabel[m.riskTier];
              return (
                <tr key={m.id} className="hover:bg-muted/20 transition-colors cursor-pointer">
                  <td className="px-4 py-2.5 font-mono text-xs text-primary">{m.id}</td>
                  <td className="px-4 py-2.5 font-medium">{m.name}</td>
                  <td className="px-4 py-2.5 text-muted-foreground">{m.agent}</td>
                  <td className="px-4 py-2.5 text-xs text-muted-foreground">{m.base}</td>
                  <td className="px-4 py-2.5 font-mono text-xs">{m.version}</td>
                  <td className="px-4 py-2.5 text-xs" style={{ color: tier.color }}>{tier.label}</td>
                  <td className="px-4 py-2.5"><span className="rounded-md bg-nx-emerald-50 px-1.5 py-0.5 text-[10px] font-bold text-nx-emerald-700">● {m.status}</span></td>
                  <td className="px-4 py-2.5 text-xs text-muted-foreground">{m.nextValidation}</td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </DashboardCard.Content>
    </DashboardCard.Root>
  );
}

// === TAB 3: DECISION AUDIT ===
export function DecisionAuditTab({ decisions }: { decisions: DecisionEntry[] }) {
  return (
    <div className="grid gap-4 lg:grid-cols-3">
      <div className="lg:col-span-2">
        <DashboardCard.Root>
          <DashboardCard.Header title="Decision Log" badge={<Lock className="h-3.5 w-3.5 text-muted-foreground" />} actions={<Button variant="outline" size="sm" className="h-7 text-xs gap-1"><Download className="h-3 w-3" />Export</Button>} />
          <DashboardCard.Content noPadding>
            <ScrollArea className="max-h-[600px]">
              <div className="divide-y divide-border">
                {decisions.map((d) => (
                  <div key={d.id} className="px-5 py-4 hover:bg-muted/20 transition-colors">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="font-mono text-[11px] text-primary">{d.id}</span>
                      <span className="text-[11px] text-muted-foreground">{d.timestamp}</span>
                      <span className="text-[11px]">{d.agentIcon} {d.agent}</span>
                    </div>
                    <p className="text-sm"><span className="font-medium">{d.entity}</span></p>
                    <p className="text-xs font-semibold mt-0.5" style={{ color: d.decision.includes("FALSE POSITIVE") || d.decision.includes("VERIFIED") ? "var(--nx-emerald-600)" : d.decision.includes("ELEVATED") ? "var(--nx-amber-600)" : undefined }}>{d.decision}</p>
                    <div className="flex items-center gap-3 mt-1.5 text-[10px] text-muted-foreground">
                      <span>Conf: <span className="font-semibold tabular-nums">{d.confidence}%</span></span>
                      <span>Model: <span className="font-mono">{d.model}</span></span>
                      <span>Latency: <span className="tabular-nums">{d.latency}</span></span>
                    </div>
                    <p className="mt-1.5 text-xs text-muted-foreground italic">{d.reasoning}</p>
                    <div className="flex items-center gap-2 mt-1.5 text-[10px]">
                      <span className="text-muted-foreground">Override: {d.override ?? "None"}</span>
                      <span className="font-mono text-muted-foreground/50">🔒 {d.hash}</span>
                    </div>
                  </div>
                ))}
              </div>
            </ScrollArea>
          </DashboardCard.Content>
        </DashboardCard.Root>
      </div>

      {/* Stats sidebar */}
      <DashboardCard.Root>
        <DashboardCard.Header title="Statistics" />
        <DashboardCard.Content className="space-y-3 text-sm">
          <div className="flex justify-between"><span className="text-muted-foreground">Today</span><span className="font-bold tabular-nums">2,847</span></div>
          <div className="flex justify-between"><span className="text-muted-foreground">Auto-resolved</span><span className="font-bold tabular-nums">2,420 (85%)</span></div>
          <div className="flex justify-between"><span className="text-muted-foreground">Human-reviewed</span><span className="font-bold tabular-nums">380 (13%)</span></div>
          <div className="flex justify-between"><span className="text-muted-foreground">Pending</span><span className="font-bold tabular-nums text-nx-amber-600">47 (2%)</span></div>
          <div className="flex justify-between"><span className="text-muted-foreground">Overrides</span><span className="font-bold tabular-nums">3 (0.1%)</span></div>
          <div className="flex justify-between"><span className="text-muted-foreground">Avg confidence</span><span className="font-bold tabular-nums">89.4%</span></div>

          <div className="pt-2 border-t border-border">
            <p className="text-xs font-semibold text-muted-foreground mb-2">Confidence Distribution</p>
            {[{ range: "≥90%", pct: 72 }, { range: "80-89%", pct: 18 }, { range: "60-79%", pct: 8 }, { range: "<60%", pct: 2 }].map((d) => (
              <div key={d.range} className="flex items-center gap-2 text-xs mb-1">
                <span className="w-12 text-muted-foreground">{d.range}</span>
                <div className="flex-1 h-2 rounded-full bg-nx-neutral-100">
                  <div className="h-full rounded-full bg-primary transition-all" style={{ width: `${d.pct}%` }} />
                </div>
                <span className="w-8 text-right tabular-nums font-medium">{d.pct}%</span>
              </div>
            ))}
          </div>
        </DashboardCard.Content>
      </DashboardCard.Root>
    </div>
  );
}

// === TAB 4: DRIFT & PERFORMANCE ===
export function DriftTab({ tests }: { tests: DriftTest[] }) {
  return (
    <DashboardCard.Root>
      <DashboardCard.Header title="Automated Drift Detection" badge={<span className="text-xs text-muted-foreground">Kolmogorov-Smirnov test (p &lt; 0.05)</span>} />
      <DashboardCard.Content className="space-y-3">
        <p className="text-xs text-muted-foreground">Daily (Tier 1) · Weekly (Tier 2) · Monthly (Tier 3)</p>
        {tests.map((t) => (
          <div key={t.agent} className="flex items-center gap-3 text-sm">
            <span className={t.status === "no_drift" ? "text-nx-emerald-600" : t.status === "approaching" ? "text-nx-amber-600" : "text-nx-rose-600"}>
              {t.status === "no_drift" ? "✅" : t.status === "approaching" ? "⚠" : "🔴"}
            </span>
            <span className="flex-1">{t.agent}</span>
            <span className="font-mono tabular-nums text-muted-foreground">p = {t.pValue.toFixed(2)}</span>
            <span className="text-xs text-muted-foreground">
              {t.status === "no_drift" ? "No drift" : t.status === "approaching" ? "Approaching threshold" : "Drift detected"}
            </span>
          </div>
        ))}
        <Button variant="outline" size="sm" className="gap-1.5 mt-2"><RefreshCw className="h-3 w-3" />Run Ad-Hoc Test</Button>
      </DashboardCard.Content>
    </DashboardCard.Root>
  );
}

// === TAB 5: BIAS & FAIRNESS ===
export function BiasTab({ tests }: { tests: BiasTest[] }) {
  return (
    <DashboardCard.Root>
      <DashboardCard.Header title="Bias & Fairness Monitoring" badge={<span className="text-xs text-muted-foreground">Next audit: Mar 31 (8 days)</span>} />
      <DashboardCard.Content noPadding className="overflow-auto">
        <table className="w-full text-sm">
          <caption className="sr-only">Protected characteristics bias testing</caption>
          <thead>
            <tr className="border-b border-border bg-muted/40">
              {["Characteristic", "Status", "Disparity", "Threshold", "Last Test"].map((h) => (
                <th key={h} scope="col" className="px-4 py-2.5 text-left text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">{h}</th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-border">
            {tests.map((t) => (
              <tr key={t.characteristic} className="hover:bg-muted/20">
                <td className="px-4 py-2.5 font-medium">{t.characteristic}</td>
                <td className="px-4 py-2.5"><span className={`text-xs font-semibold ${t.status === "pass" ? "text-nx-emerald-600" : "text-nx-rose-600"}`}>{t.status === "pass" ? "✅ Pass" : "🔴 Fail"}</span></td>
                <td className="px-4 py-2.5 tabular-nums">{t.disparity}%</td>
                <td className="px-4 py-2.5 text-muted-foreground">&lt;{t.threshold}%</td>
                <td className="px-4 py-2.5 text-muted-foreground">{t.lastTest}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </DashboardCard.Content>
    </DashboardCard.Root>
  );
}

// === TAB 6: THRESHOLDS ===
export function ThresholdsTab() {
  const agents = [
    { name: "📄 Document", auto: 95, review: "80-95", escalate: "<80", note: "Stricter" },
    { name: "🏢 Entity", auto: 80, review: "60-80", escalate: "<60", note: "Default" },
    { name: "🛡 Screening", auto: 80, review: "60-80", escalate: "<60", note: "Default" },
    { name: "⚡ Risk", auto: 85, review: "65-85", escalate: "<65", note: "Stricter" },
    { name: "📖 Regulatory", auto: 80, review: "60-80", escalate: "<60", note: "Default" },
    { name: "🔍 Investigation", auto: 70, review: "50-70", escalate: "<50", note: "Looser *" },
  ];

  return (
    <div className="space-y-5">
      {/* Threshold visual */}
      <DashboardCard.Root>
        <DashboardCard.Header title="Global Default Thresholds" />
        <DashboardCard.Content>
          <div className="flex h-8 rounded-full overflow-hidden text-[10px] font-semibold text-center">
            <div className="flex-[60] bg-nx-emerald-100 text-nx-emerald-700 flex items-center justify-center">AUTO ≥80%</div>
            <div className="flex-[20] bg-nx-amber-100 text-nx-amber-700 flex items-center justify-center">REVIEW 60-80%</div>
            <div className="flex-[20] bg-nx-rose-100 text-nx-rose-700 flex items-center justify-center">ESCALATE &lt;60%</div>
          </div>
        </DashboardCard.Content>
      </DashboardCard.Root>

      {/* Per-agent overrides */}
      <DashboardCard.Root>
        <DashboardCard.Header title="Per-Agent Overrides" />
        <DashboardCard.Content noPadding className="overflow-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border bg-muted/40">
                {["Agent", "Auto ≥", "Review", "Escalate <", "Override"].map((h) => (
                  <th key={h} scope="col" className="px-4 py-2.5 text-left text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {agents.map((a) => (
                <tr key={a.name}>
                  <td className="px-4 py-2.5 font-medium">{a.name}</td>
                  <td className="px-4 py-2.5 font-bold tabular-nums text-nx-emerald-600">{a.auto}%</td>
                  <td className="px-4 py-2.5 tabular-nums text-nx-amber-600">{a.review}%</td>
                  <td className="px-4 py-2.5 tabular-nums text-nx-rose-600">{a.escalate}%</td>
                  <td className="px-4 py-2.5 text-xs text-muted-foreground">{a.note}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </DashboardCard.Content>
      </DashboardCard.Root>

      {/* Conditional overrides */}
      <DashboardCard.Root>
        <DashboardCard.Header title="Conditional Overrides" actions={<Button variant="ghost" size="sm" className="h-7 text-xs gap-1"><Plus className="h-3 w-3" />Add</Button>} />
        <DashboardCard.Content className="space-y-2">
          {[
            "IF entity risk tier = Critical THEN auto threshold = 95%",
            "IF jurisdiction = FATF grey list THEN auto threshold = 90%",
            "IF decision type = SAR filing THEN always require human",
            "IF PEP association detected THEN always require MLRO review",
            "IF OFAC match score > 70% THEN always require human review",
          ].map((rule) => (
            <div key={rule} className="rounded-lg border border-border px-3 py-2 text-xs font-mono text-muted-foreground">{rule}</div>
          ))}
        </DashboardCard.Content>
      </DashboardCard.Root>
    </div>
  );
}

// === TAB 7: INCIDENT LOG ===
export function IncidentLogTab({ incidents }: { incidents: Incident[] }) {
  const severityStyle: Record<string, { color: string; bg: string }> = {
    critical: { color: "var(--nx-rose-700)", bg: "var(--nx-rose-50)" },
    warning: { color: "var(--nx-amber-700)", bg: "var(--nx-amber-50)" },
    info: { color: "var(--nx-neutral-600)", bg: "var(--nx-neutral-100)" },
  };

  return (
    <DashboardCard.Root>
      <DashboardCard.Header title="Incident Log" badge={<span className="text-xs text-muted-foreground">{incidents.length} incidents (90 days) · 0 open</span>} actions={<Button variant="outline" size="sm" className="h-7 text-xs gap-1"><Plus className="h-3 w-3" />Log Incident</Button>} />
      <DashboardCard.Content noPadding>
        <div className="divide-y divide-border">
          {incidents.map((inc) => {
            const ss = severityStyle[inc.severity];
            return (
              <div key={inc.id} className="px-5 py-4" style={{ borderLeft: `4px solid ${ss.color}` }}>
                <div className="flex items-center gap-2 mb-1">
                  <span className="font-mono text-xs text-muted-foreground">{inc.id}</span>
                  <span className="text-xs text-muted-foreground">{inc.date}</span>
                  <span className="rounded-md px-1.5 py-0.5 text-[10px] font-bold" style={{ color: ss.color, backgroundColor: ss.bg }}>{inc.severity}</span>
                  <span className="text-xs text-muted-foreground">{inc.agent}</span>
                </div>
                <p className="text-sm font-medium">{inc.title}</p>
                <p className="text-xs text-muted-foreground mt-1">{inc.detail}</p>
                {inc.actionTaken && <p className="text-xs mt-1"><span className="font-medium">Action:</span> {inc.actionTaken}</p>}
                <span className="inline-flex items-center gap-1 mt-1.5 text-[10px] text-nx-emerald-600"><CheckCircle2 className="h-3 w-3" />Resolved</span>
              </div>
            );
          })}
        </div>
      </DashboardCard.Content>
    </DashboardCard.Root>
  );
}

// === TAB 8: REGULATORY REPORTING ===
export function RegulatoryReportingTab() {
  const reports = [
    { name: "Annual AI Governance Report", desc: "Model inventory, performance, fairness, incidents", lastGen: "Jan 15, 2026" },
    { name: "EU AI Act Conformity Assessment", desc: "High-risk classification, risk management, transparency", lastGen: "Up to date" },
    { name: "Board/MLRO Quarterly Report", desc: "Agent performance, decisions, overrides, risk", lastGen: "Due Mar 31" },
    { name: "Regulatory Examination Package", desc: "Complete documentation for regulator examination", lastGen: "On demand (~45s)" },
    { name: "SAR Filing Activity Report", desc: "SAR volumes, AI vs human drafted, filing times", lastGen: "On demand" },
  ];

  return (
    <div className="space-y-4">
      {reports.map((r) => (
        <div key={r.name} className="rounded-xl border border-border bg-card p-4 shadow-elevation-1">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-semibold">📋 {r.name}</p>
              <p className="text-xs text-muted-foreground mt-0.5">{r.desc}</p>
              <p className="text-[10px] text-muted-foreground mt-0.5">{r.lastGen}</p>
            </div>
            <div className="flex gap-2">
              <Button variant="outline" size="sm" className="h-7 text-xs">View</Button>
              <Button size="sm" className="h-7 text-xs gap-1"><Download className="h-3 w-3" />Generate</Button>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
