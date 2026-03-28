"use client";

import { Button } from "@/components/ui/button";
import { ConfidenceBadge } from "@/components/shared";
import { overview, alerts, agentHealth, models, decisions, driftTests, biasTests, incidents } from "@/features/governance/data/mock-data";
import {
  Shield, Activity, CheckCircle2, AlertTriangle, Clock, Database,
  ScrollText, TrendingDown, Scale, Download, ExternalLink, RefreshCw,
  XCircle, Sparkles, ChevronRight, Lock,
} from "lucide-react";
import { cn } from "@/lib/utils";

/* ─── Helpers ─── */
const tierLabel: Record<number, { label: string; color: string }> = {
  1: { label: "Tier 1 — Critical", color: "var(--nx-rose-600)" },
  2: { label: "Tier 2 — Moderate", color: "var(--nx-amber-600)" },
  3: { label: "Tier 3 — Lower", color: "var(--nx-neutral-500)" },
};

const driftColor: Record<string, { label: string; color: string }> = {
  no_drift: { label: "No Drift", color: "var(--nx-emerald-600)" },
  approaching: { label: "Approaching", color: "var(--nx-amber-600)" },
  drift: { label: "Drift Detected", color: "var(--nx-rose-600)" },
};

/* ─── Page ─── */
export default function GovernancePage() {
  const totalDecisions = overview.decisionsToday;
  const autoDecisions = Math.round(totalDecisions * overview.autoRate);
  const humanDecisions = totalDecisions - autoDecisions;
  const overrideCount = decisions.filter((d) => d.override).length;

  return (
    <div className="space-y-5">
      {/* ─── Header ─── */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h1 className="text-lg font-bold tracking-tight">AI Governance & Monitoring</h1>
          <p className="text-[11px] text-muted-foreground mt-0.5">
            Model oversight, decision audit, drift detection, and regulatory compliance
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm" className="h-7 text-[10px] font-semibold gap-1.5">
            <Download className="h-3 w-3" /> Export Report
          </Button>
          <Button variant="outline" size="sm" className="h-7 text-[10px] font-semibold gap-1.5">
            <ExternalLink className="h-3 w-3" /> Regulator Access
          </Button>
        </div>
      </div>

      {/* ─── Governance Alerts ─── */}
      {alerts.length > 0 && (
        <div className="rounded-lg border border-nx-amber-200 bg-nx-amber-50/50 p-3 space-y-1.5">
          {alerts.map((a, i) => (
            <div key={i} className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <AlertTriangle className={cn("h-3 w-3", a.severity === "warning" ? "text-nx-amber-600" : "text-muted-foreground/40")} />
                <span className="text-[11px] text-muted-foreground">{a.message}</span>
              </div>
              <Button variant="outline" size="sm" className="h-5 text-[9px] font-semibold px-2">{a.action}</Button>
            </div>
          ))}
        </div>
      )}

      {/* ─── System Health KPIs ─── */}
      <div className="grid grid-cols-3 lg:grid-cols-7 gap-px bg-border rounded-lg overflow-hidden">
        {[
          { label: "System Uptime", value: `${overview.systemUptime}%`, icon: Activity },
          { label: "Agents Active", value: `${overview.agentsActive}/${overview.agentsTotal}` },
          { label: "Decisions Today", value: totalDecisions.toLocaleString() },
          { label: "Auto Rate", value: `${Math.round(overview.autoRate * 100)}%` },
          { label: "Overrides", value: String(overrideCount), warn: overrideCount > 0 },
          { label: "EU AI Act", value: "Conformant", good: true },
          { label: "Next Audit", value: `${overview.nextAuditDays}d`, sub: overview.nextAuditType },
        ].map((kpi) => (
          <div key={kpi.label} className="bg-card p-3">
            <div className="text-[9px] font-bold text-muted-foreground uppercase tracking-widest mb-1">{kpi.label}</div>
            <div className={cn("text-[16px] font-extrabold tabular-nums tracking-tight", kpi.warn && "text-nx-amber-600", kpi.good && "text-nx-emerald-600")}>
              {kpi.value}
            </div>
            {kpi.sub && <div className="text-[9px] text-muted-foreground/50">{kpi.sub}</div>}
          </div>
        ))}
      </div>

      {/* ─── Agent Fleet Health ─── */}
      <div className="rounded-lg border border-border bg-card overflow-hidden">
        <div className="flex items-center justify-between px-4 py-2.5 border-b border-border">
          <div className="flex items-center gap-2">
            <Activity className="h-3.5 w-3.5 text-muted-foreground/40" />
            <span className="text-[12px] font-bold">Agent Fleet Health</span>
            <span className="text-[10px] text-muted-foreground">{agentHealth.length} agents</span>
          </div>
          <span className="text-[9px] text-muted-foreground">Real-time monitoring</span>
        </div>
        <table className="w-full text-[11px]">
          <thead>
            <tr className="border-b border-border bg-muted/20">
              {["Agent", "Status", "Model / Tier", "Actions Today", "Auto Rate", "Avg Latency", "Accuracy", "Override Rate", "Drift"].map((h) => (
                <th key={h} className="text-left font-bold text-muted-foreground uppercase tracking-wider px-4 py-2 whitespace-nowrap">{h}</th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-border">
            {agentHealth.map((agent) => {
              const tier = tierLabel[agent.riskTier];
              const primaryAccuracy = Object.values(agent.accuracy)[0] as number;
              const drift = driftTests.find((d) => d.agent === agent.name);
              const driftSt = drift ? driftColor[drift.status] : null;
              return (
                <tr key={agent.id} className="hover:bg-muted/10 transition-colors">
                  <td className="px-4 py-2.5">
                    <div className="flex items-center gap-2">
                      <div className="h-1.5 w-1.5 rounded-full" style={{ backgroundColor: agent.status === "active" ? "var(--nx-emerald-500)" : "var(--nx-neutral-400)" }} />
                      <span className="font-semibold text-[12px]">{agent.name}</span>
                    </div>
                  </td>
                  <td className="px-4 py-2.5">
                    <span className={cn("text-[9px] font-bold uppercase", agent.status === "active" ? "text-nx-emerald-600" : "text-muted-foreground")}>{agent.status}</span>
                  </td>
                  <td className="px-4 py-2.5">
                    <div className="font-mono text-[10px] text-muted-foreground">{agent.modelId} {agent.modelVersion}</div>
                    <div className="text-[9px] font-bold" style={{ color: tier.color }}>{tier.label}</div>
                  </td>
                  <td className="px-4 py-2.5 font-bold tabular-nums">{agent.todayActions}</td>
                  <td className="px-4 py-2.5 font-bold tabular-nums">{Math.round(agent.todayAutoRate * 100)}%</td>
                  <td className="px-4 py-2.5 tabular-nums text-muted-foreground">{agent.avgLatency}</td>
                  <td className="px-4 py-2.5">
                    <span className={cn("font-bold tabular-nums", primaryAccuracy >= 0.95 ? "text-nx-emerald-600" : primaryAccuracy >= 0.90 ? "text-nx-amber-600" : "text-nx-rose-600")}>
                      {Math.round(primaryAccuracy * 100)}%
                    </span>
                  </td>
                  <td className="px-4 py-2.5 tabular-nums">{(agent.overrideRate * 100).toFixed(1)}%</td>
                  <td className="px-4 py-2.5">
                    {driftSt && (
                      <span className="text-[9px] font-bold" style={{ color: driftSt.color }}>{driftSt.label}</span>
                    )}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* ─── Model Registry + Decision Audit side by side ─── */}
      <div className="grid gap-5 lg:grid-cols-12">
        {/* Model Registry — 7 cols */}
        <div className="lg:col-span-7 rounded-lg border border-border bg-card overflow-hidden">
          <div className="flex items-center justify-between px-4 py-2.5 border-b border-border">
            <div className="flex items-center gap-2">
              <Database className="h-3.5 w-3.5 text-muted-foreground/40" />
              <span className="text-[12px] font-bold">Model Registry</span>
              <span className="text-[10px] text-muted-foreground">{models.length} deployed</span>
            </div>
          </div>
          <table className="w-full text-[11px]">
            <thead>
              <tr className="border-b border-border bg-muted/20">
                {["Model ID", "Name", "Agent", "Risk Tier", "Version", "Status", "Next Validation"].map((h) => (
                  <th key={h} className="text-left font-bold text-muted-foreground uppercase tracking-wider px-4 py-2 whitespace-nowrap">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {models.map((m) => {
                const tier = tierLabel[m.riskTier];
                return (
                  <tr key={m.id} className="hover:bg-muted/10 transition-colors">
                    <td className="px-4 py-2.5 font-mono text-[10px] font-semibold">{m.id}</td>
                    <td className="px-4 py-2.5 font-medium">{m.name}</td>
                    <td className="px-4 py-2.5 text-muted-foreground">{m.agent}</td>
                    <td className="px-4 py-2.5">
                      <span className="text-[9px] font-bold" style={{ color: tier.color }}>{tier.label.split(" — ")[0]}</span>
                    </td>
                    <td className="px-4 py-2.5 font-mono text-[10px] tabular-nums">{m.version}</td>
                    <td className="px-4 py-2.5">
                      <span className="text-[9px] font-bold text-nx-emerald-600 bg-nx-emerald-50 px-1.5 py-0.5 rounded">Production</span>
                    </td>
                    <td className="px-4 py-2.5 tabular-nums text-muted-foreground">{m.nextValidation}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        {/* Drift & Bias — 5 cols */}
        <div className="lg:col-span-5 space-y-5">
          {/* Drift Detection */}
          <div className="rounded-lg border border-border bg-card overflow-hidden">
            <div className="flex items-center justify-between px-4 py-2.5 border-b border-border">
              <div className="flex items-center gap-2">
                <TrendingDown className="h-3.5 w-3.5 text-muted-foreground/40" />
                <span className="text-[12px] font-bold">Drift Detection</span>
              </div>
              <span className="text-[9px] text-muted-foreground">KS Test (p &lt; 0.05 = drift)</span>
            </div>
            <div className="divide-y divide-border">
              {driftTests.map((dt) => {
                const st = driftColor[dt.status];
                return (
                  <div key={dt.agent} className="flex items-center justify-between px-4 py-2 hover:bg-muted/10 transition-colors">
                    <span className="text-[11px] font-medium">{dt.agent}</span>
                    <div className="flex items-center gap-3">
                      <span className="text-[10px] tabular-nums text-muted-foreground">p = {dt.pValue.toFixed(2)}</span>
                      <span className="text-[9px] font-bold" style={{ color: st.color }}>{st.label}</span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Bias & Fairness */}
          <div className="rounded-lg border border-border bg-card overflow-hidden">
            <div className="flex items-center justify-between px-4 py-2.5 border-b border-border">
              <div className="flex items-center gap-2">
                <Scale className="h-3.5 w-3.5 text-muted-foreground/40" />
                <span className="text-[12px] font-bold">Bias & Fairness</span>
              </div>
              <span className="text-[9px] text-muted-foreground">Last audit: Mar 1</span>
            </div>
            <div className="divide-y divide-border">
              {biasTests.map((bt) => (
                <div key={bt.characteristic} className="flex items-center justify-between px-4 py-2 hover:bg-muted/10 transition-colors">
                  <span className="text-[11px] font-medium">{bt.characteristic}</span>
                  <div className="flex items-center gap-3">
                    <div className="flex items-center gap-1.5">
                      <div className="w-16 h-1 bg-muted rounded-full overflow-hidden">
                        <div className="h-full rounded-full bg-nx-emerald-500" style={{ width: `${(bt.disparity / bt.threshold) * 100}%` }} />
                      </div>
                      <span className="text-[10px] tabular-nums font-medium">{bt.disparity}%</span>
                    </div>
                    <CheckCircle2 className="h-3 w-3 text-nx-emerald-600" />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* ─── Decision Audit Trail ─── */}
      <div className="rounded-lg border border-border bg-card overflow-hidden">
        <div className="flex items-center justify-between px-4 py-2.5 border-b border-border">
          <div className="flex items-center gap-2">
            <ScrollText className="h-3.5 w-3.5 text-muted-foreground/40" />
            <span className="text-[12px] font-bold">Decision Audit Trail</span>
            <span className="text-[10px] text-muted-foreground">{totalDecisions.toLocaleString()} decisions today</span>
          </div>
          <div className="flex items-center gap-2">
            <Lock className="h-3 w-3 text-muted-foreground/30" />
            <span className="text-[9px] text-muted-foreground">Cryptographically sealed</span>
          </div>
        </div>
        <table className="w-full text-[11px]">
          <thead>
            <tr className="border-b border-border bg-muted/20">
              {["ID", "Time", "Agent", "Entity", "Decision", "Confidence", "Model", "Latency", "Override", "Hash"].map((h) => (
                <th key={h} className="text-left font-bold text-muted-foreground uppercase tracking-wider px-4 py-2 whitespace-nowrap">{h}</th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-border">
            {decisions.map((d) => (
              <tr key={d.id} className="hover:bg-muted/10 transition-colors">
                <td className="px-4 py-2.5 font-mono text-[10px] font-semibold">{d.id}</td>
                <td className="px-4 py-2.5 tabular-nums text-muted-foreground whitespace-nowrap">{d.timestamp}</td>
                <td className="px-4 py-2.5">
                  <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider">{d.agent.replace(" Agent", "")}</span>
                </td>
                <td className="px-4 py-2.5 font-medium max-w-36 truncate">{d.entity}</td>
                <td className="px-4 py-2.5">
                  <span className={cn("text-[10px] font-bold",
                    d.decision.includes("FALSE POSITIVE") ? "text-nx-emerald-600" :
                    d.decision.includes("ELEVATED") ? "text-nx-amber-600" :
                    d.decision.includes("VERIFIED") ? "text-nx-emerald-600" : ""
                  )}>
                    {d.decision}
                  </span>
                </td>
                <td className="px-4 py-2.5"><ConfidenceBadge value={d.confidence} /></td>
                <td className="px-4 py-2.5 font-mono text-[9px] text-muted-foreground">{d.model}</td>
                <td className="px-4 py-2.5 tabular-nums text-muted-foreground">{d.latency}</td>
                <td className="px-4 py-2.5">
                  {d.override ? (
                    <span className="text-[9px] font-bold text-nx-amber-600">{d.override}</span>
                  ) : (
                    <span className="text-muted-foreground/30">—</span>
                  )}
                </td>
                <td className="px-4 py-2.5 font-mono text-[9px] text-muted-foreground/50">{d.hash}</td>
              </tr>
            ))}
          </tbody>
        </table>
        <div className="px-4 py-2 border-t border-border flex items-center justify-between text-[10px] text-muted-foreground">
          <span>Showing 5 of {totalDecisions.toLocaleString()} · Auto: {autoDecisions.toLocaleString()} ({Math.round(overview.autoRate * 100)}%) · Human: {humanDecisions.toLocaleString()}</span>
          <Button variant="outline" size="sm" className="h-5 text-[9px] font-semibold px-2 gap-1">
            <Download className="h-2.5 w-2.5" /> Export Full Log
          </Button>
        </div>
      </div>

      {/* ─── Incidents + Compliance ─── */}
      <div className="grid gap-5 lg:grid-cols-2">
        {/* Incident Log */}
        <div className="rounded-lg border border-border bg-card overflow-hidden">
          <div className="flex items-center justify-between px-4 py-2.5 border-b border-border">
            <div className="flex items-center gap-2">
              <AlertTriangle className="h-3.5 w-3.5 text-muted-foreground/40" />
              <span className="text-[12px] font-bold">Incident Log</span>
              <span className="text-[10px] text-muted-foreground">Last 90 days</span>
            </div>
            <span className="text-[10px] text-muted-foreground tabular-nums">{incidents.length} incidents · 0 open</span>
          </div>
          <div className="divide-y divide-border">
            {incidents.map((inc) => (
              <div key={inc.id} className="px-4 py-3 hover:bg-muted/10 transition-colors">
                <div className="flex items-center justify-between mb-1">
                  <div className="flex items-center gap-2">
                    <span className="font-mono text-[10px] font-semibold">{inc.id}</span>
                    <span className={cn("text-[9px] font-bold uppercase",
                      inc.severity === "warning" ? "text-nx-amber-600" : "text-muted-foreground"
                    )}>
                      {inc.severity}
                    </span>
                    <span className="text-[10px] text-muted-foreground">{inc.agent}</span>
                  </div>
                  <span className="text-[10px] tabular-nums text-muted-foreground">{inc.date}</span>
                </div>
                <p className="text-[11px] font-medium">{inc.title}</p>
                <p className="text-[10px] text-muted-foreground mt-0.5">{inc.detail}</p>
                <div className="flex items-center gap-2 mt-1.5">
                  <CheckCircle2 className="h-3 w-3 text-nx-emerald-600" />
                  <span className="text-[9px] font-bold text-nx-emerald-600">Resolved</span>
                  <span className="text-[9px] text-muted-foreground">— {inc.actionTaken}</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Regulatory Compliance */}
        <div className="space-y-5">
          {/* EU AI Act Status */}
          <div className="rounded-lg border border-border bg-card overflow-hidden">
            <div className="flex items-center justify-between px-4 py-2.5 border-b border-border">
              <div className="flex items-center gap-2">
                <Shield className="h-3.5 w-3.5 text-muted-foreground/40" />
                <span className="text-[12px] font-bold">Regulatory Compliance</span>
              </div>
            </div>
            <div className="divide-y divide-border">
              {[
                { reg: "EU AI Act (High-Risk)", status: "Conformant", detail: "All high-risk models documented, monitored, and validated", icon: CheckCircle2, color: "text-nx-emerald-600" },
                { reg: "Fed SR 11-7 (Model Risk)", status: "Compliant", detail: "Model inventory, validation schedule, and governance documented", icon: CheckCircle2, color: "text-nx-emerald-600" },
                { reg: "SOC 2 Type II", status: `Audit in ${overview.nextAuditDays}d`, detail: "Continuous compliance monitoring active", icon: Clock, color: "text-nx-amber-600" },
                { reg: "ISO 27001", status: "Certified", detail: "Information security management system in place", icon: CheckCircle2, color: "text-nx-emerald-600" },
                { reg: "GDPR / DSGVO", status: "Compliant", detail: "Data processing transparency and audit trails maintained", icon: CheckCircle2, color: "text-nx-emerald-600" },
              ].map((item) => {
                const Icon = item.icon;
                return (
                  <div key={item.reg} className="flex items-center gap-3 px-4 py-2.5 hover:bg-muted/10 transition-colors">
                    <Icon className={cn("h-3.5 w-3.5 shrink-0", item.color)} />
                    <div className="flex-1 min-w-0">
                      <div className="text-[11px] font-semibold">{item.reg}</div>
                      <div className="text-[9px] text-muted-foreground">{item.detail}</div>
                    </div>
                    <span className={cn("text-[10px] font-bold shrink-0", item.color)}>{item.status}</span>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Available Reports */}
          <div className="rounded-lg border border-border bg-card overflow-hidden">
            <div className="px-4 py-2.5 border-b border-border">
              <span className="text-[12px] font-bold">Governance Reports</span>
            </div>
            <div className="divide-y divide-border">
              {[
                { name: "Annual AI Governance Report", lastGen: "Jan 15, 2026" },
                { name: "EU AI Act Conformity Assessment", lastGen: "Up to date" },
                { name: "Board/MLRO Quarterly Report", lastGen: "Due Mar 31" },
                { name: "Regulatory Examination Package", lastGen: "On demand" },
              ].map((report) => (
                <div key={report.name} className="flex items-center justify-between px-4 py-2 hover:bg-muted/10 transition-colors">
                  <div>
                    <span className="text-[11px] font-medium">{report.name}</span>
                    <span className="text-[9px] text-muted-foreground ml-2">{report.lastGen}</span>
                  </div>
                  <Button variant="outline" size="sm" className="h-5 text-[9px] font-semibold px-2 gap-1">
                    <Download className="h-2.5 w-2.5" /> Generate
                  </Button>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
