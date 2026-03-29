"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import {
  BarChart3, Download, Calendar, Clock, FileText, Shield,
  Users, Building2, Activity, TrendingUp, CheckCircle2,
  AlertTriangle, Play, Eye, Mail, Plus, Search,
  ArrowUpRight, ArrowDownRight,
} from "lucide-react";

/* ─── Types ─── */

interface Report {
  id: string;
  name: string;
  description: string;
  category: "regulatory" | "operational" | "governance" | "management" | "custom";
  frequency: "on-demand" | "daily" | "weekly" | "monthly" | "quarterly" | "annual";
  lastGenerated: string | null;
  nextScheduled: string | null;
  format: string[];
  recipients: string[];
  status: "ready" | "scheduled" | "generating" | "overdue";
  estimatedTime: string;
}

interface ScheduledReport {
  id: string;
  reportName: string;
  schedule: string;
  nextRun: string;
  recipients: string;
  lastRun: string | null;
  lastStatus: "success" | "failed" | null;
}

interface RecentExport {
  id: string;
  reportName: string;
  generatedAt: string;
  generatedBy: string;
  format: string;
  size: string;
  status: "complete" | "failed";
}

/* ─── Mock Data ─── */

const reports: Report[] = [
  // Regulatory Filings
  { id: "rpt-sar", name: "SAR Filing Summary", description: "Summary of all Suspicious Activity Reports filed, pending, and in draft. Includes filing timelines, volumes by jurisdiction, and AI-drafted vs human-drafted breakdown.", category: "regulatory", frequency: "monthly", lastGenerated: "Mar 1, 2026", nextScheduled: "Apr 1, 2026", format: ["PDF", "CSV"], recipients: ["MLRO", "CCO"], status: "ready", estimatedTime: "30s" },
  { id: "rpt-ctr", name: "CTR Activity Report", description: "Currency Transaction Report summary — all transactions exceeding $10,000 reported to FinCEN. Volume trends and filing compliance.", category: "regulatory", frequency: "monthly", lastGenerated: "Mar 1, 2026", nextScheduled: "Apr 1, 2026", format: ["PDF", "CSV"], recipients: ["MLRO"], status: "ready", estimatedTime: "15s" },
  { id: "rpt-exam", name: "Regulatory Examination Package", description: "Complete documentation package for regulatory examiners. Includes model cards, validation reports, audit trails, incident history, fairness audits, and AI governance documentation.", category: "regulatory", frequency: "on-demand", lastGenerated: "Jan 15, 2026", nextScheduled: null, format: ["PDF"], recipients: ["CCO", "MLRO", "Legal"], status: "ready", estimatedTime: "45s" },
  { id: "rpt-sanctions", name: "Sanctions Compliance Report", description: "Screening coverage across all lists, auto-resolution rates, true positive rates, and outstanding alerts by jurisdiction.", category: "regulatory", frequency: "quarterly", lastGenerated: "Jan 1, 2026", nextScheduled: "Apr 1, 2026", format: ["PDF", "CSV"], recipients: ["MLRO", "CCO"], status: "ready", estimatedTime: "20s" },
  { id: "rpt-aml-program", name: "AML Program Effectiveness Report", description: "Annual assessment of AML program effectiveness — SAR conversion rates, screening accuracy, risk score distribution, regulatory change responsiveness.", category: "regulatory", frequency: "annual", lastGenerated: "Jan 15, 2026", nextScheduled: "Jan 15, 2027", format: ["PDF"], recipients: ["Board", "CCO", "MLRO"], status: "ready", estimatedTime: "60s" },

  // Operational
  { id: "rpt-onboard", name: "Onboarding Performance", description: "Client onboarding pipeline metrics — average completion time, SLA compliance, bottleneck analysis, document collection rates, AI prefill effectiveness.", category: "operational", frequency: "weekly", lastGenerated: "Mar 22, 2026", nextScheduled: "Mar 29, 2026", format: ["PDF", "CSV", "XLSX"], recipients: ["Ops Manager", "CCO"], status: "scheduled", estimatedTime: "15s" },
  { id: "rpt-screening", name: "Screening Operations", description: "Daily screening volumes, auto-resolution rates, false positive rates, analyst throughput, SLA compliance, and list update coverage.", category: "operational", frequency: "daily", lastGenerated: "Today, 07:00", nextScheduled: "Tomorrow, 07:00", format: ["PDF", "CSV"], recipients: ["Ops Manager"], status: "ready", estimatedTime: "10s" },
  { id: "rpt-review", name: "Periodic Review Status", description: "KYC review pipeline — overdue reviews, upcoming reviews, completion rates by risk tier, reviewer workload distribution.", category: "operational", frequency: "weekly", lastGenerated: "Mar 22, 2026", nextScheduled: "Mar 29, 2026", format: ["PDF", "CSV"], recipients: ["Ops Manager", "Team Leads"], status: "scheduled", estimatedTime: "15s" },
  { id: "rpt-case", name: "Case Management Report", description: "Active investigations, case resolution times, SAR filing rates, escalation patterns, and case workload by analyst.", category: "operational", frequency: "weekly", lastGenerated: "Mar 22, 2026", nextScheduled: "Mar 29, 2026", format: ["PDF", "CSV"], recipients: ["Ops Manager", "MLRO"], status: "scheduled", estimatedTime: "15s" },
  { id: "rpt-risk-dist", name: "Portfolio Risk Distribution", description: "Entity risk tier distribution across portfolio — critical, high, medium, low, minimal. Trending over time. Jurisdiction heat map.", category: "operational", frequency: "monthly", lastGenerated: "Mar 1, 2026", nextScheduled: "Apr 1, 2026", format: ["PDF", "CSV"], recipients: ["CCO", "Board"], status: "ready", estimatedTime: "20s" },

  // Governance
  { id: "rpt-ai-gov", name: "AI Governance Report", description: "Comprehensive AI governance — model inventory, performance metrics, drift detection results, bias audits, override analysis, and EU AI Act conformity.", category: "governance", frequency: "quarterly", lastGenerated: "Jan 15, 2026", nextScheduled: "Apr 1, 2026", format: ["PDF"], recipients: ["Board", "CCO", "CTO"], status: "ready", estimatedTime: "45s" },
  { id: "rpt-ai-perf", name: "Agent Performance Dashboard", description: "Per-agent accuracy, throughput, latency, confidence distributions, and human override rates. 30-day trending.", category: "governance", frequency: "monthly", lastGenerated: "Mar 1, 2026", nextScheduled: "Apr 1, 2026", format: ["PDF", "CSV"], recipients: ["CTO", "CCO"], status: "ready", estimatedTime: "20s" },
  { id: "rpt-audit-trail", name: "Decision Audit Log Export", description: "Complete audit trail of all AI and human decisions with reasoning chains, confidence scores, and cryptographic verification hashes.", category: "governance", frequency: "on-demand", lastGenerated: "Mar 20, 2026", nextScheduled: null, format: ["CSV", "JSON"], recipients: ["Audit", "Legal"], status: "ready", estimatedTime: "30s" },

  // Management
  { id: "rpt-board", name: "Board Compliance Report", description: "Executive summary for board of directors — key metrics, regulatory developments, significant cases, AI performance, and strategic recommendations.", category: "management", frequency: "quarterly", lastGenerated: "Jan 15, 2026", nextScheduled: "Apr 1, 2026", format: ["PDF", "PPTX"], recipients: ["Board"], status: "ready", estimatedTime: "60s" },
  { id: "rpt-team", name: "Team Performance Report", description: "Analyst productivity — decisions per hour, accuracy rates, SLA compliance, training progress, and workload balance.", category: "management", frequency: "monthly", lastGenerated: "Mar 1, 2026", nextScheduled: "Apr 1, 2026", format: ["PDF", "CSV"], recipients: ["Ops Manager", "HR"], status: "ready", estimatedTime: "15s" },
  { id: "rpt-roi", name: "Platform ROI Analysis", description: "Cost savings from AI automation — time saved, FTE equivalents, false positive reduction, onboarding acceleration. Before/after comparison.", category: "management", frequency: "quarterly", lastGenerated: "Jan 15, 2026", nextScheduled: "Apr 1, 2026", format: ["PDF", "PPTX"], recipients: ["CFO", "CCO", "Board"], status: "ready", estimatedTime: "30s" },
];

const scheduledReports: ScheduledReport[] = [
  { id: "sch-1", reportName: "Screening Operations", schedule: "Daily, 07:00 UTC", nextRun: "Tomorrow", recipients: "Ops Manager", lastRun: "Today, 07:00", lastStatus: "success" },
  { id: "sch-2", reportName: "Onboarding Performance", schedule: "Weekly, Monday 08:00", nextRun: "Mar 29", recipients: "Ops Manager, CCO", lastRun: "Mar 22", lastStatus: "success" },
  { id: "sch-3", reportName: "Periodic Review Status", schedule: "Weekly, Monday 08:00", nextRun: "Mar 29", recipients: "Ops Manager, Leads", lastRun: "Mar 22", lastStatus: "success" },
  { id: "sch-4", reportName: "Case Management Report", schedule: "Weekly, Monday 09:00", nextRun: "Mar 29", recipients: "Ops Manager, MLRO", lastRun: "Mar 22", lastStatus: "success" },
  { id: "sch-5", reportName: "SAR Filing Summary", schedule: "Monthly, 1st at 06:00", nextRun: "Apr 1", recipients: "MLRO, CCO", lastRun: "Mar 1", lastStatus: "success" },
  { id: "sch-6", reportName: "Board Compliance Report", schedule: "Quarterly, 1st at 08:00", nextRun: "Apr 1", recipients: "Board", lastRun: "Jan 15", lastStatus: "success" },
];

const recentExports: RecentExport[] = [
  { id: "exp-1", reportName: "Screening Operations", generatedAt: "Today, 07:00", generatedBy: "System (scheduled)", format: "PDF", size: "2.4 MB", status: "complete" },
  { id: "exp-2", reportName: "Decision Audit Log", generatedAt: "Mar 20, 14:30", generatedBy: "Sarah Chen", format: "CSV", size: "18.7 MB", status: "complete" },
  { id: "exp-3", reportName: "Onboarding Performance", generatedAt: "Mar 22, 08:00", generatedBy: "System (scheduled)", format: "PDF", size: "1.8 MB", status: "complete" },
  { id: "exp-4", reportName: "AI Governance Report", generatedAt: "Mar 18, 10:15", generatedBy: "James Park", format: "PDF", size: "4.2 MB", status: "complete" },
  { id: "exp-5", reportName: "Portfolio Risk Distribution", generatedAt: "Mar 1, 06:00", generatedBy: "System (scheduled)", format: "PDF", size: "3.1 MB", status: "complete" },
];

const catLabel: Record<string, { label: string; icon: typeof FileText }> = {
  regulatory: { label: "Regulatory", icon: Shield },
  operational: { label: "Operational", icon: Activity },
  governance: { label: "AI Governance", icon: BarChart3 },
  management: { label: "Management", icon: TrendingUp },
  custom: { label: "Custom", icon: FileText },
};

const freqLabel: Record<string, string> = {
  "on-demand": "On Demand", daily: "Daily", weekly: "Weekly", monthly: "Monthly", quarterly: "Quarterly", annual: "Annual",
};

/* ─── Page ─── */

export default function ReportsPage() {
  const [filterCat, setFilterCat] = useState("all");
  const [generating, setGenerating] = useState<string | null>(null);

  const categories = [...new Set(reports.map((r) => r.category))];
  const filtered = filterCat === "all" ? reports : reports.filter((r) => r.category === filterCat);

  const handleGenerate = (id: string) => {
    setGenerating(id);
    setTimeout(() => setGenerating(null), 2000);
  };

  return (
    <div className="space-y-5">
      {/* ─── Header ─── */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h1 className="text-lg font-bold tracking-tight">Reports & Analytics</h1>
          <p className="text-[11px] text-muted-foreground mt-0.5">
            {reports.length} report templates · {scheduledReports.length} scheduled · {recentExports.length} recent exports
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm" className="h-7 text-[10px] font-semibold gap-1.5">
            <Calendar className="h-3 w-3" /> Schedule
          </Button>
          <Button size="sm" className="h-7 text-[10px] font-semibold gap-1.5">
            <Plus className="h-3 w-3" /> Custom Report
          </Button>
        </div>
      </div>

      {/* ─── KPIs ─── */}
      <div className="grid grid-cols-3 lg:grid-cols-6 gap-px bg-border rounded-lg overflow-hidden">
        {[
          { label: "Reports Available", value: String(reports.length) },
          { label: "Scheduled", value: String(scheduledReports.length) },
          { label: "Generated (MTD)", value: "47" },
          { label: "SARs Filed (MTD)", value: "3" },
          { label: "Next Board Report", value: "Apr 1" },
          { label: "Exam Package", value: "Ready" },
        ].map((kpi) => (
          <div key={kpi.label} className="bg-card p-3">
            <div className="text-[9px] font-bold text-muted-foreground uppercase tracking-widest mb-1">{kpi.label}</div>
            <div className="text-[16px] font-extrabold tabular-nums tracking-tight">{kpi.value}</div>
          </div>
        ))}
      </div>

      {/* ─── Quick Generate — most common reports ─── */}
      <div className="rounded-lg border border-border bg-card overflow-hidden">
        <div className="px-4 py-2.5 border-b border-border">
          <span className="text-[12px] font-bold">Quick Generate</span>
        </div>
        <div className="grid grid-cols-2 lg:grid-cols-4 divide-x divide-y divide-border">
          {[
            { name: "SAR Summary", icon: Shield, id: "rpt-sar", time: "30s" },
            { name: "Screening Ops", icon: Activity, id: "rpt-screening", time: "10s" },
            { name: "Board Report", icon: TrendingUp, id: "rpt-board", time: "60s" },
            { name: "Exam Package", icon: FileText, id: "rpt-exam", time: "45s" },
          ].map((item) => {
            const Icon = item.icon;
            const isGen = generating === item.id;
            return (
              <button
                key={item.id}
                onClick={() => handleGenerate(item.id)}
                disabled={isGen}
                className="p-4 text-left hover:bg-muted/10 transition-colors group"
              >
                <div className="flex items-center justify-between mb-2">
                  <Icon className="h-4 w-4 text-muted-foreground/30 group-hover:text-foreground transition-colors" />
                  <span className="text-[9px] text-muted-foreground">{item.time}</span>
                </div>
                <div className="text-[12px] font-semibold">{item.name}</div>
                <div className="text-[10px] text-muted-foreground mt-0.5">
                  {isGen ? <span className="text-nx-emerald-600 font-bold">Generating...</span> : "Click to generate"}
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* ─── Report Catalog ─── */}
      <div className="rounded-lg border border-border bg-card overflow-hidden">
        <div className="flex items-center justify-between px-4 py-2.5 border-b border-border">
          <div className="flex items-center gap-2">
            <BarChart3 className="h-3.5 w-3.5 text-muted-foreground/40" />
            <span className="text-[12px] font-bold">Report Catalog</span>
          </div>
        </div>

        {/* Category filter */}
        <div className="flex items-center gap-1 px-4 py-2 border-b border-border overflow-x-auto" style={{ scrollbarWidth: "none" }}>
          <button onClick={() => setFilterCat("all")} className={cn("shrink-0 px-2.5 py-1 text-[10px] font-bold rounded transition-colors", filterCat === "all" ? "bg-foreground text-background" : "text-muted-foreground hover:bg-muted/50")}>All ({reports.length})</button>
          {categories.map((cat) => {
            const cl = catLabel[cat];
            const count = reports.filter((r) => r.category === cat).length;
            return (
              <button key={cat} onClick={() => setFilterCat(filterCat === cat ? "all" : cat)} className={cn("shrink-0 px-2.5 py-1 text-[10px] font-bold rounded transition-colors", filterCat === cat ? "bg-foreground text-background" : "text-muted-foreground hover:bg-muted/50")}>
                {cl.label} ({count})
              </button>
            );
          })}
        </div>

        {/* Table */}
        <table className="w-full text-[11px]">
          <thead>
            <tr className="border-b border-border bg-muted/20">
              {["Report", "Category", "Frequency", "Last Generated", "Next Scheduled", "Format", "Recipients", ""].map((h) => (
                <th key={h} className="text-left font-bold text-muted-foreground uppercase tracking-wider px-3 py-2 whitespace-nowrap">{h}</th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-border">
            {filtered.map((report) => {
              const cl = catLabel[report.category];
              const isGen = generating === report.id;
              return (
                <tr key={report.id} className="hover:bg-muted/10 transition-colors">
                  <td className="px-3 py-2.5 max-w-56">
                    <div className="text-[12px] font-semibold">{report.name}</div>
                    <div className="text-[9px] text-muted-foreground mt-0.5 line-clamp-1">{report.description}</div>
                  </td>
                  <td className="px-3 py-2.5">
                    <span className="text-[9px] font-bold text-muted-foreground uppercase">{cl.label}</span>
                  </td>
                  <td className="px-3 py-2.5">
                    <span className="text-[10px] font-medium">{freqLabel[report.frequency]}</span>
                  </td>
                  <td className="px-3 py-2.5 tabular-nums text-muted-foreground">{report.lastGenerated ?? "Never"}</td>
                  <td className="px-3 py-2.5 tabular-nums">
                    {report.nextScheduled ? (
                      <span className="text-muted-foreground">{report.nextScheduled}</span>
                    ) : (
                      <span className="text-muted-foreground/30">—</span>
                    )}
                  </td>
                  <td className="px-3 py-2.5">
                    <div className="flex gap-0.5">
                      {report.format.map((f) => <span key={f} className="text-[8px] font-bold px-1 py-0.5 rounded bg-muted text-muted-foreground">{f}</span>)}
                    </div>
                  </td>
                  <td className="px-3 py-2.5 text-muted-foreground text-[10px] max-w-28 truncate">{report.recipients.join(", ")}</td>
                  <td className="px-3 py-2.5">
                    <Button
                      size="sm"
                      variant="outline"
                      className="h-6 text-[9px] font-semibold px-2 gap-1"
                      onClick={() => handleGenerate(report.id)}
                      disabled={isGen}
                    >
                      {isGen ? <><Clock className="h-2.5 w-2.5 animate-spin" /> Generating</> : <><Download className="h-2.5 w-2.5" /> Generate</>}
                    </Button>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* ─── Scheduled Reports + Recent Exports ─── */}
      <div className="grid gap-5 lg:grid-cols-2">
        {/* Scheduled */}
        <div className="rounded-lg border border-border bg-card overflow-hidden">
          <div className="flex items-center justify-between px-4 py-2.5 border-b border-border">
            <div className="flex items-center gap-2">
              <Calendar className="h-3.5 w-3.5 text-muted-foreground/40" />
              <span className="text-[12px] font-bold">Scheduled Reports</span>
            </div>
            <Button variant="outline" size="sm" className="h-5 text-[9px] font-semibold px-2 gap-1"><Plus className="h-2.5 w-2.5" /> Add</Button>
          </div>
          <table className="w-full text-[11px]">
            <thead>
              <tr className="border-b border-border bg-muted/20">
                {["Report", "Schedule", "Next Run", "Last", "Status"].map((h) => (
                  <th key={h} className="text-left font-bold text-muted-foreground uppercase tracking-wider px-3 py-2 whitespace-nowrap">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {scheduledReports.map((sr) => (
                <tr key={sr.id} className="hover:bg-muted/10 transition-colors">
                  <td className="px-3 py-2.5 font-medium">{sr.reportName}</td>
                  <td className="px-3 py-2.5 text-muted-foreground text-[10px]">{sr.schedule}</td>
                  <td className="px-3 py-2.5 tabular-nums font-medium">{sr.nextRun}</td>
                  <td className="px-3 py-2.5 tabular-nums text-muted-foreground">{sr.lastRun}</td>
                  <td className="px-3 py-2.5">
                    {sr.lastStatus === "success" ? (
                      <span className="flex items-center gap-1 text-[9px] font-bold text-nx-emerald-600"><CheckCircle2 className="h-2.5 w-2.5" /> OK</span>
                    ) : (
                      <span className="text-muted-foreground/30">—</span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Recent Exports */}
        <div className="rounded-lg border border-border bg-card overflow-hidden">
          <div className="flex items-center justify-between px-4 py-2.5 border-b border-border">
            <div className="flex items-center gap-2">
              <Download className="h-3.5 w-3.5 text-muted-foreground/40" />
              <span className="text-[12px] font-bold">Recent Exports</span>
            </div>
          </div>
          <table className="w-full text-[11px]">
            <thead>
              <tr className="border-b border-border bg-muted/20">
                {["Report", "Generated", "By", "Format", "Size", ""].map((h) => (
                  <th key={h} className="text-left font-bold text-muted-foreground uppercase tracking-wider px-3 py-2 whitespace-nowrap">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {recentExports.map((exp) => (
                <tr key={exp.id} className="hover:bg-muted/10 transition-colors">
                  <td className="px-3 py-2.5 font-medium">{exp.reportName}</td>
                  <td className="px-3 py-2.5 tabular-nums text-muted-foreground">{exp.generatedAt}</td>
                  <td className="px-3 py-2.5 text-muted-foreground text-[10px]">{exp.generatedBy}</td>
                  <td className="px-3 py-2.5"><span className="text-[8px] font-bold px-1 py-0.5 rounded bg-muted text-muted-foreground">{exp.format}</span></td>
                  <td className="px-3 py-2.5 tabular-nums text-muted-foreground">{exp.size}</td>
                  <td className="px-3 py-2.5">
                    <Button variant="ghost" size="sm" className="h-5 text-[9px] font-semibold px-2 gap-1">
                      <Download className="h-2.5 w-2.5" /> Download
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
