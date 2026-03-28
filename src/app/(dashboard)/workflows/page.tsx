"use client";

import { useState, Fragment } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import {
  Zap, Users, User, Plus, Save, Play, ChevronRight,
  Clock, CheckCircle2, AlertTriangle, Activity, RefreshCw,
  Settings, ArrowRight, Pause, XCircle,
} from "lucide-react";

/* ─── Types ─── */

type StepMode = "auto" | "copilot" | "manual";

interface ActiveWorkflow {
  id: string;
  name: string;
  entity: string;
  type: string;
  stage: string;
  stageNum: number;
  totalStages: number;
  progress: number;
  status: "running" | "paused" | "waiting_human" | "completed" | "failed";
  started: string;
  elapsed: string;
  sla: string;
  slaStatus: "ok" | "warn" | "breach";
  assignee: string;
  agentsActive: number;
  lastAction: string;
}

interface WorkflowTemplate {
  id: string;
  name: string;
  description: string;
  steps: number;
  autoSteps: number;
  avgDuration: string;
  runsMonth: number;
  successRate: number;
  triggers: string;
}

/* ─── Mock Data ─── */

const activeWorkflows: ActiveWorkflow[] = [
  { id: "WF-2026-0847", name: "Client Onboarding", entity: "Helios Asset Management GmbH", type: "Corporate CDD", stage: "Data Collection", stageNum: 2, totalStages: 7, progress: 47, status: "running", started: "Today, 08:30", elapsed: "5.2h", sla: "8h", slaStatus: "ok", assignee: "SC", agentsActive: 4, lastAction: "Entity Agent pre-filled 5 fields from Handelsregister" },
  { id: "WF-2026-0846", name: "Client Onboarding", entity: "Nordic Wealth Partners AS", type: "Fund CDD", stage: "Verification", stageNum: 3, totalStages: 7, progress: 72, status: "waiting_human", started: "Yesterday", elapsed: "22h", sla: "24h", slaStatus: "warn", assignee: "ML", agentsActive: 2, lastAction: "Document Agent flagged date discrepancy — waiting analyst" },
  { id: "WF-2026-0845", name: "Periodic Review", entity: "Meridian Capital Partners", type: "EDD Annual", stage: "Risk Assessment", stageNum: 5, totalStages: 7, progress: 60, status: "running", started: "Mar 20", elapsed: "3d", sla: "5d", slaStatus: "ok", assignee: "SC", agentsActive: 3, lastAction: "Risk Agent recalculating with PEP association data" },
  { id: "WF-2026-0844", name: "SAR Investigation", entity: "Horizon Trading LLC", type: "SAR Filing", stage: "Drafting", stageNum: 6, totalStages: 7, progress: 85, status: "waiting_human", started: "Mar 22", elapsed: "1.5d", sla: "30d", slaStatus: "ok", assignee: "SC", agentsActive: 1, lastAction: "Investigation Agent completed SAR narrative v2" },
  { id: "WF-2026-0843", name: "Client Onboarding", entity: "Swiss Crypto Ventures AG", type: "Corporate EDD", stage: "Data Collection", stageNum: 2, totalStages: 7, progress: 23, status: "running", started: "Today, 10:00", elapsed: "3.5h", sla: "48h", slaStatus: "ok", assignee: "DK", agentsActive: 3, lastAction: "Regulatory Agent mapped FINMA requirements (14 docs)" },
  { id: "WF-2026-0842", name: "Screening Re-Run", entity: "Full Portfolio", type: "Batch Screening", stage: "Screening", stageNum: 1, totalStages: 3, progress: 67, status: "running", started: "Today, 07:00", elapsed: "6.5h", sla: "12h", slaStatus: "ok", assignee: "—", agentsActive: 1, lastAction: "Screening Agent: 1,742 of 2,601 entities processed" },
  { id: "WF-2026-0841", name: "Client Onboarding", entity: "Crown Bay Holdings Ltd", type: "Trust EDD+", stage: "Approval", stageNum: 6, totalStages: 7, progress: 95, status: "waiting_human", started: "Mar 18", elapsed: "5d", sla: "7d", slaStatus: "warn", assignee: "JP", agentsActive: 0, lastAction: "All checks complete — awaiting MLRO sign-off" },
];

const templates: WorkflowTemplate[] = [
  { id: "tpl-1", name: "Corporate CDD Onboarding", description: "Standard corporate client onboarding with CDD requirements", steps: 7, autoSteps: 5, avgDuration: "4.2h", runsMonth: 18, successRate: 98.7, triggers: "RM initiates" },
  { id: "tpl-2", name: "Corporate EDD Onboarding", description: "Enhanced due diligence for high-risk corporate entities", steps: 9, autoSteps: 5, avgDuration: "12h", runsMonth: 6, successRate: 96.2, triggers: "Risk tier ≥ High" },
  { id: "tpl-3", name: "Individual SDD Onboarding", description: "Simplified due diligence for low-risk individuals", steps: 5, autoSteps: 4, avgDuration: "1.5h", runsMonth: 24, successRate: 99.1, triggers: "RM initiates" },
  { id: "tpl-4", name: "Periodic Review (Annual)", description: "Standard annual KYC refresh and re-screening", steps: 7, autoSteps: 5, avgDuration: "2.5h", runsMonth: 45, successRate: 97.8, triggers: "Scheduled / Risk event" },
  { id: "tpl-5", name: "SAR Investigation", description: "Suspicious activity report investigation and filing", steps: 7, autoSteps: 3, avgDuration: "4.2d", runsMonth: 3, successRate: 100, triggers: "True positive / Escalation" },
  { id: "tpl-6", name: "Continuous Screening", description: "Batch re-screening on sanctions list updates", steps: 3, autoSteps: 2, avgDuration: "45m", runsMonth: 60, successRate: 99.9, triggers: "List update detected" },
  { id: "tpl-7", name: "Regulatory Change Response", description: "Impact assessment and rule update when regulation changes", steps: 5, autoSteps: 3, avgDuration: "2d", runsMonth: 4, successRate: 95.0, triggers: "Reg change detected" },
  { id: "tpl-8", name: "Client Offboarding", description: "Controlled exit with regulatory obligations fulfilled", steps: 6, autoSteps: 3, avgDuration: "1d", runsMonth: 2, successRate: 100, triggers: "CCO initiates" },
];

const statusStyle: Record<string, { label: string; color: string; icon: typeof CheckCircle2 }> = {
  running: { label: "Running", color: "var(--nx-emerald-600)", icon: Activity },
  waiting_human: { label: "Waiting Human", color: "var(--nx-amber-600)", icon: Clock },
  paused: { label: "Paused", color: "var(--nx-neutral-500)", icon: Pause },
  completed: { label: "Completed", color: "var(--nx-emerald-600)", icon: CheckCircle2 },
  failed: { label: "Failed", color: "var(--nx-rose-600)", icon: XCircle },
};

/* ─── Page ─── */

export default function WorkflowsPage() {
  const router = useRouter();
  const [view, setView] = useState<"active" | "templates">("active");

  const running = activeWorkflows.filter((w) => w.status === "running").length;
  const waitingHuman = activeWorkflows.filter((w) => w.status === "waiting_human").length;
  const atRisk = activeWorkflows.filter((w) => w.slaStatus !== "ok").length;

  return (
    <div className="space-y-5">
      {/* ─── Header ─── */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h1 className="text-lg font-bold tracking-tight">Workflows</h1>
          <p className="text-[11px] text-muted-foreground mt-0.5">
            {activeWorkflows.length} active · {running} running · {waitingHuman} waiting for human · {atRisk} at SLA risk
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm" className="h-7 text-[10px] font-semibold gap-1.5">
            <Settings className="h-3 w-3" /> Configure
          </Button>
          <Button size="sm" className="h-7 text-[10px] font-semibold gap-1.5">
            <Plus className="h-3 w-3" /> New Workflow
          </Button>
        </div>
      </div>

      {/* ─── KPIs ─── */}
      <div className="grid grid-cols-3 lg:grid-cols-6 gap-px bg-border rounded-lg overflow-hidden">
        {[
          { label: "Active Workflows", value: String(activeWorkflows.length) },
          { label: "Running", value: String(running) },
          { label: "Waiting Human", value: String(waitingHuman), warn: waitingHuman > 0 },
          { label: "SLA At Risk", value: String(atRisk), warn: atRisk > 0 },
          { label: "Templates", value: String(templates.length) },
          { label: "Completed (MTD)", value: "127" },
        ].map((kpi) => (
          <div key={kpi.label} className="bg-card p-3">
            <div className="text-[9px] font-bold text-muted-foreground uppercase tracking-widest mb-1">{kpi.label}</div>
            <div className={cn("text-[18px] font-extrabold tabular-nums tracking-tight", kpi.warn && "text-nx-amber-600")}>{kpi.value}</div>
          </div>
        ))}
      </div>

      {/* ─── View Toggle ─── */}
      <div className="flex items-center gap-1">
        <button
          onClick={() => setView("active")}
          className={cn("px-3 py-1.5 text-[11px] font-bold rounded transition-colors", view === "active" ? "bg-foreground text-background" : "text-muted-foreground hover:bg-muted/50")}
        >
          Active Workflows ({activeWorkflows.length})
        </button>
        <button
          onClick={() => setView("templates")}
          className={cn("px-3 py-1.5 text-[11px] font-bold rounded transition-colors", view === "templates" ? "bg-foreground text-background" : "text-muted-foreground hover:bg-muted/50")}
        >
          Templates ({templates.length})
        </button>
      </div>

      {/* ─── Active Workflows View ─── */}
      {view === "active" && (
        <div className="rounded-lg border border-border bg-card overflow-hidden">
          <table className="w-full text-[11px]">
            <thead>
              <tr className="border-b border-border bg-muted/20">
                {["Workflow", "Entity", "Stage", "Progress", "Status", "Agents", "SLA", "Assignee", "Last Action"].map((h) => (
                  <th key={h} className="text-left font-bold text-muted-foreground uppercase tracking-wider px-4 py-2 whitespace-nowrap">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {activeWorkflows.map((wf) => {
                const st = statusStyle[wf.status];
                const StIcon = st.icon;
                return (
                  <tr key={wf.id} className="hover:bg-muted/10 transition-colors cursor-pointer">
                    <td className="px-4 py-2.5">
                      <div className="font-semibold text-[12px]">{wf.name}</div>
                      <div className="flex items-center gap-1.5 mt-0.5">
                        <span className="font-mono text-[9px] text-muted-foreground">{wf.id}</span>
                        <span className="text-[9px] text-muted-foreground">·</span>
                        <span className="text-[9px] text-muted-foreground">{wf.type}</span>
                      </div>
                    </td>
                    <td className="px-4 py-2.5 max-w-40">
                      <span className="text-[12px] font-medium truncate block">{wf.entity}</span>
                    </td>
                    <td className="px-4 py-2.5">
                      <span className="font-medium">{wf.stage}</span>
                      <div className="text-[9px] text-muted-foreground/50">{wf.stageNum}/{wf.totalStages}</div>
                    </td>
                    <td className="px-4 py-2.5">
                      <div className="flex items-center gap-2 min-w-20">
                        <div className="flex-1 h-1 bg-muted rounded-full overflow-hidden max-w-20">
                          <div className="h-full bg-foreground rounded-full" style={{ width: `${wf.progress}%` }} />
                        </div>
                        <span className="font-bold tabular-nums text-[10px] w-6 text-right">{wf.progress}%</span>
                      </div>
                    </td>
                    <td className="px-4 py-2.5">
                      <span className="flex items-center gap-1">
                        <StIcon className="h-3 w-3" style={{ color: st.color }} />
                        <span className="text-[10px] font-bold" style={{ color: st.color }}>{st.label}</span>
                      </span>
                    </td>
                    <td className="px-4 py-2.5">
                      <span className="tabular-nums font-bold">{wf.agentsActive}</span>
                      <span className="text-muted-foreground/50"> active</span>
                    </td>
                    <td className="px-4 py-2.5">
                      <span className={cn("font-bold tabular-nums", wf.slaStatus === "warn" ? "text-nx-amber-600" : "text-muted-foreground")}>
                        {wf.elapsed}
                      </span>
                      <span className="text-muted-foreground/40"> / {wf.sla}</span>
                    </td>
                    <td className="px-4 py-2.5">
                      {wf.assignee !== "—" ? (
                        <div className="h-5 w-5 rounded-full bg-foreground/10 flex items-center justify-center text-[8px] font-bold">{wf.assignee}</div>
                      ) : (
                        <span className="text-muted-foreground/30">—</span>
                      )}
                    </td>
                    <td className="px-4 py-2.5 max-w-52">
                      <span className="text-[10px] text-muted-foreground truncate block">{wf.lastAction}</span>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}

      {/* ─── Templates View ─── */}
      {view === "templates" && (
        <div className="space-y-5">
          <div className="rounded-lg border border-border bg-card overflow-hidden">
            <table className="w-full text-[11px]">
              <thead>
                <tr className="border-b border-border bg-muted/20">
                  {["Template", "Steps", "Autonomy", "Avg Duration", "Runs/Month", "Success Rate", "Trigger", ""].map((h) => (
                    <th key={h} className="text-left font-bold text-muted-foreground uppercase tracking-wider px-4 py-2 whitespace-nowrap">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {templates.map((tpl) => {
                  const autoPct = Math.round((tpl.autoSteps / tpl.steps) * 100);
                  return (
                    <tr key={tpl.id} className="hover:bg-muted/10 transition-colors cursor-pointer">
                      <td className="px-4 py-2.5 max-w-52">
                        <div className="font-semibold text-[12px]">{tpl.name}</div>
                        <div className="text-[9px] text-muted-foreground mt-0.5">{tpl.description}</div>
                      </td>
                      <td className="px-4 py-2.5 tabular-nums font-bold">{tpl.steps}</td>
                      <td className="px-4 py-2.5">
                        <div className="flex items-center gap-2">
                          <div className="w-12 h-1 bg-muted rounded-full overflow-hidden">
                            <div className="h-full bg-nx-emerald-500 rounded-full" style={{ width: `${autoPct}%` }} />
                          </div>
                          <span className="text-[10px] font-bold tabular-nums">{autoPct}%</span>
                        </div>
                        <div className="text-[9px] text-muted-foreground/50">{tpl.autoSteps}/{tpl.steps} auto</div>
                      </td>
                      <td className="px-4 py-2.5 tabular-nums font-medium">{tpl.avgDuration}</td>
                      <td className="px-4 py-2.5 tabular-nums font-bold">{tpl.runsMonth}</td>
                      <td className="px-4 py-2.5">
                        <span className={cn("font-bold tabular-nums", tpl.successRate >= 99 ? "text-nx-emerald-600" : tpl.successRate >= 95 ? "" : "text-nx-amber-600")}>
                          {tpl.successRate}%
                        </span>
                      </td>
                      <td className="px-4 py-2.5 text-muted-foreground text-[10px]">{tpl.triggers}</td>
                      <td className="px-4 py-2.5">
                        <Button variant="outline" size="sm" className="h-5 text-[9px] font-semibold px-2 gap-1">
                          <Settings className="h-2.5 w-2.5" /> Edit
                        </Button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>

          {/* Autonomy Legend */}
          <div className="rounded-lg border border-border bg-card p-4">
            <div className="text-[9px] font-bold text-muted-foreground uppercase tracking-widest mb-3">Step Modes</div>
            <div className="grid grid-cols-3 gap-3">
              {[
                { mode: "Auto", icon: Zap, desc: "Agent handles entirely. Human notified when complete.", color: "var(--nx-emerald-600)" },
                { mode: "Co-Pilot", icon: Users, desc: "Agent does work, human confirms before proceeding.", color: "var(--nx-amber-600)" },
                { mode: "Manual", icon: User, desc: "Human drives, agent assists on request.", color: "var(--nx-neutral-500)" },
              ].map((m) => {
                const Icon = m.icon;
                return (
                  <div key={m.mode} className="flex items-start gap-2.5">
                    <Icon className="h-3.5 w-3.5 mt-0.5 shrink-0" style={{ color: m.color }} />
                    <div>
                      <div className="text-[11px] font-bold" style={{ color: m.color }}>{m.mode}</div>
                      <div className="text-[10px] text-muted-foreground">{m.desc}</div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Override Rules */}
          <div className="rounded-lg border border-border bg-card overflow-hidden">
            <div className="flex items-center justify-between px-4 py-2.5 border-b border-border">
              <span className="text-[12px] font-bold">Override Rules</span>
              <Button variant="outline" size="sm" className="h-5 text-[9px] font-semibold px-2 gap-1"><Plus className="h-2.5 w-2.5" /> Add Rule</Button>
            </div>
            <div className="divide-y divide-border">
              {[
                "IF risk_tier = Critical THEN Decision step requires MLRO approval",
                "IF jurisdiction ∈ FATF_grey_list THEN all steps = Co-Pilot mode",
                "IF entity_type = Trust THEN UBO Discovery = Manual mode",
                "IF PEP_detected THEN escalate to MLRO queue",
                "IF screening_true_positive THEN trigger SAR Investigation workflow",
              ].map((rule) => (
                <div key={rule} className="px-4 py-2 hover:bg-muted/10 transition-colors">
                  <span className="font-mono text-[10px] text-muted-foreground">{rule}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
