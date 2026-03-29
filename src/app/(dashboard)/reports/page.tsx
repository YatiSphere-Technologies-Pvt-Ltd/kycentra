"use client";

import { useState, Fragment } from "react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import {
  BarChart3, Download, Calendar, Clock, FileText, Shield,
  Activity, TrendingUp, CheckCircle2, Plus, Eye, Mail,
  ChevronRight, ArrowUpRight, ArrowDownRight, Minus, Share2,
  Printer, X,
} from "lucide-react";
import {
  AreaChart, Area, BarChart, Bar, PieChart, Pie, Cell,
  XAxis, YAxis, CartesianGrid, ResponsiveContainer, Tooltip,
} from "recharts";

/* ─── Mock chart data ─── */

const sarMonthly = [
  { month: "Oct", filed: 2, drafted: 4 }, { month: "Nov", filed: 3, drafted: 5 },
  { month: "Dec", filed: 1, drafted: 3 }, { month: "Jan", filed: 4, drafted: 6 },
  { month: "Feb", filed: 2, drafted: 5 }, { month: "Mar", filed: 3, drafted: 4 },
];

const screeningDaily = [
  { day: "Mon", total: 892, auto: 748, manual: 82 }, { day: "Tue", total: 934, auto: 798, manual: 76 },
  { day: "Wed", total: 1021, auto: 882, manual: 89 }, { day: "Thu", total: 955, auto: 812, manual: 96 },
  { day: "Fri", total: 876, auto: 734, manual: 71 },
];

const riskDistribution = [
  { name: "Critical", value: 12, color: "#991B1B" }, { name: "High", value: 187, color: "#DC2626" },
  { name: "Medium", value: 1423, color: "#D97706" }, { name: "Low", value: 8391, color: "#16A34A" },
  { name: "Minimal", value: 2834, color: "#94A3B8" },
];

const onboardingTrend = [
  { week: "W1", avgTime: 5.8, target: 8 }, { week: "W2", avgTime: 5.2, target: 8 },
  { week: "W3", avgTime: 4.8, target: 8 }, { week: "W4", avgTime: 4.2, target: 8 },
];

const agentAccuracy = [
  { agent: "Document", accuracy: 96.8 }, { agent: "Entity", accuracy: 95.4 },
  { agent: "Screening", accuracy: 96.2 }, { agent: "Risk", accuracy: 92.1 },
  { agent: "Regulatory", accuracy: 98.3 }, { agent: "Investigation", accuracy: 89.3 },
];

/* ─── Report Previews ─── */

interface ReportPreview {
  id: string;
  name: string;
  category: string;
  frequency: string;
  lastGenerated: string;
  description: string;
  format: string[];
  recipients: string[];
  estimatedTime: string;
  previewType: "sar" | "screening" | "risk" | "onboarding" | "agent" | "table";
}

const reports: ReportPreview[] = [
  { id: "rpt-sar", name: "SAR Filing Summary", category: "Regulatory", frequency: "Monthly", lastGenerated: "Mar 1, 2026", description: "Suspicious Activity Reports filed, pending, and drafted", format: ["PDF", "CSV"], recipients: ["MLRO", "CCO"], estimatedTime: "30s", previewType: "sar" },
  { id: "rpt-screening", name: "Screening Operations", category: "Operational", frequency: "Daily", lastGenerated: "Today, 07:00", description: "Screening volumes, auto-resolution, false positive rates", format: ["PDF", "CSV"], recipients: ["Ops Manager"], estimatedTime: "10s", previewType: "screening" },
  { id: "rpt-risk", name: "Portfolio Risk Distribution", category: "Operational", frequency: "Monthly", lastGenerated: "Mar 1, 2026", description: "Entity risk tier breakdown across the portfolio", format: ["PDF", "CSV"], recipients: ["CCO", "Board"], estimatedTime: "20s", previewType: "risk" },
  { id: "rpt-onboard", name: "Onboarding Performance", category: "Operational", frequency: "Weekly", lastGenerated: "Mar 22, 2026", description: "Completion times, SLA compliance, bottleneck analysis", format: ["PDF", "CSV", "XLSX"], recipients: ["Ops Manager", "CCO"], estimatedTime: "15s", previewType: "onboarding" },
  { id: "rpt-agent", name: "Agent Performance Dashboard", category: "AI Governance", frequency: "Monthly", lastGenerated: "Mar 1, 2026", description: "Per-agent accuracy, throughput, drift, and override rates", format: ["PDF", "CSV"], recipients: ["CTO", "CCO"], estimatedTime: "20s", previewType: "agent" },
  { id: "rpt-board", name: "Board Compliance Report", category: "Management", frequency: "Quarterly", lastGenerated: "Jan 15, 2026", description: "Executive summary — key metrics, regulatory developments, AI performance", format: ["PDF", "PPTX"], recipients: ["Board"], estimatedTime: "60s", previewType: "table" },
  { id: "rpt-exam", name: "Regulatory Examination Package", category: "Regulatory", frequency: "On Demand", lastGenerated: "Jan 15, 2026", description: "Complete examiner package — model cards, audit trails, governance docs", format: ["PDF"], recipients: ["CCO", "MLRO", "Legal"], estimatedTime: "45s", previewType: "table" },
  { id: "rpt-sanctions", name: "Sanctions Compliance Report", category: "Regulatory", frequency: "Quarterly", lastGenerated: "Jan 1, 2026", description: "Screening coverage, list subscriptions, match rates by jurisdiction", format: ["PDF", "CSV"], recipients: ["MLRO", "CCO"], estimatedTime: "20s", previewType: "table" },
  { id: "rpt-review", name: "Periodic Review Status", category: "Operational", frequency: "Weekly", lastGenerated: "Mar 22, 2026", description: "KYC review pipeline — overdue, upcoming, completion by risk tier", format: ["PDF", "CSV"], recipients: ["Ops Manager"], estimatedTime: "15s", previewType: "table" },
  { id: "rpt-team", name: "Team Performance", category: "Management", frequency: "Monthly", lastGenerated: "Mar 1, 2026", description: "Analyst productivity, accuracy, SLA compliance, workload balance", format: ["PDF", "CSV"], recipients: ["Ops Manager", "HR"], estimatedTime: "15s", previewType: "table" },
  { id: "rpt-roi", name: "Platform ROI Analysis", category: "Management", frequency: "Quarterly", lastGenerated: "Jan 15, 2026", description: "Cost savings from AI automation, FTE equivalents, before/after", format: ["PDF", "PPTX"], recipients: ["CFO", "Board"], estimatedTime: "30s", previewType: "table" },
  { id: "rpt-audit", name: "Decision Audit Log", category: "AI Governance", frequency: "On Demand", lastGenerated: "Mar 20, 2026", description: "Full audit trail with reasoning chains and verification hashes", format: ["CSV", "JSON"], recipients: ["Audit", "Legal"], estimatedTime: "30s", previewType: "table" },
];

const scheduled = [
  { name: "Screening Operations", schedule: "Daily, 07:00", next: "Tomorrow", last: "Today", ok: true },
  { name: "Onboarding Performance", schedule: "Weekly, Mon 08:00", next: "Mar 29", last: "Mar 22", ok: true },
  { name: "Review Status", schedule: "Weekly, Mon 08:00", next: "Mar 29", last: "Mar 22", ok: true },
  { name: "SAR Summary", schedule: "Monthly, 1st", next: "Apr 1", last: "Mar 1", ok: true },
  { name: "Board Report", schedule: "Quarterly, 1st", next: "Apr 1", last: "Jan 15", ok: true },
];

const recent = [
  { name: "Screening Operations", at: "Today, 07:00", by: "System", fmt: "PDF", size: "2.4 MB" },
  { name: "Decision Audit Log", at: "Mar 20, 14:30", by: "Sarah Chen", fmt: "CSV", size: "18.7 MB" },
  { name: "Onboarding Performance", at: "Mar 22, 08:00", by: "System", fmt: "PDF", size: "1.8 MB" },
  { name: "AI Governance Report", at: "Mar 18, 10:15", by: "James Park", fmt: "PDF", size: "4.2 MB" },
];

/* ─── Component ─── */

export default function ReportsPage() {
  const [filterCat, setFilterCat] = useState("all");
  const [previewId, setPreviewId] = useState<string | null>(null);
  const [generating, setGenerating] = useState<string | null>(null);

  const categories = [...new Set(reports.map((r) => r.category))];
  const filtered = filterCat === "all" ? reports : reports.filter((r) => r.category === filterCat);
  const previewing = reports.find((r) => r.id === previewId);

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
          <p className="text-[11px] text-muted-foreground mt-0.5">{reports.length} reports · {scheduled.length} scheduled · Generate, preview, and export</p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm" className="h-7 text-[10px] font-semibold gap-1.5"><Calendar className="h-3 w-3" /> Schedule</Button>
          <Button size="sm" className="h-7 text-[10px] font-semibold gap-1.5"><Plus className="h-3 w-3" /> Custom Report</Button>
        </div>
      </div>

      {/* ─── Live Metrics Strip ─── */}
      <div className="grid grid-cols-3 lg:grid-cols-6 gap-px bg-border rounded-lg overflow-hidden">
        {[
          { label: "SARs Filed (MTD)", value: "3", trend: "up" },
          { label: "Screening Volume", value: "4,678", trend: "up" },
          { label: "Avg Onboarding", value: "4.2h", trend: "down" },
          { label: "Overdue Reviews", value: "0", trend: null },
          { label: "AI Auto Rate", value: "85%", trend: "up" },
          { label: "Portfolio Risk", value: "12,847", trend: null },
        ].map((kpi) => (
          <div key={kpi.label} className="bg-card p-3">
            <div className="text-[9px] font-bold text-muted-foreground uppercase tracking-widest mb-1">{kpi.label}</div>
            <div className="flex items-center justify-between">
              <span className="text-[16px] font-extrabold tabular-nums tracking-tight">{kpi.value}</span>
              {kpi.trend === "up" && <ArrowUpRight className="h-3 w-3 text-nx-emerald-600" />}
              {kpi.trend === "down" && <ArrowDownRight className="h-3 w-3 text-nx-emerald-600" />}
              {kpi.trend === null && <Minus className="h-3 w-3 text-muted-foreground/20" />}
            </div>
          </div>
        ))}
      </div>

      {/* ─── Report Preview Panel ─── */}
      {previewing && (
        <div className="rounded-lg border border-border bg-card overflow-hidden">
          <div className="flex items-center justify-between px-4 py-2.5 border-b border-border bg-muted/20">
            <div className="flex items-center gap-2">
              <Eye className="h-3.5 w-3.5 text-muted-foreground/40" />
              <span className="text-[12px] font-bold">Preview: {previewing.name}</span>
              <span className="text-[9px] text-muted-foreground">{previewing.category} · {previewing.frequency}</span>
            </div>
            <div className="flex items-center gap-1.5">
              <Button variant="outline" size="sm" className="h-6 text-[9px] font-semibold px-2 gap-1"><Printer className="h-2.5 w-2.5" /> Print</Button>
              <Button variant="outline" size="sm" className="h-6 text-[9px] font-semibold px-2 gap-1"><Share2 className="h-2.5 w-2.5" /> Share</Button>
              <Button variant="outline" size="sm" className="h-6 text-[9px] font-semibold px-2 gap-1" onClick={() => handleGenerate(previewing.id)}>
                <Download className="h-2.5 w-2.5" /> Export PDF
              </Button>
              <button onClick={() => setPreviewId(null)} className="ml-1 text-muted-foreground hover:text-foreground"><X className="h-3.5 w-3.5" /></button>
            </div>
          </div>

          <div className="p-5">
            {/* SAR preview */}
            {previewing.previewType === "sar" && (
              <div className="space-y-5">
                <div className="grid grid-cols-4 gap-px bg-border rounded overflow-hidden">
                  {[
                    { l: "Filed (MTD)", v: "3" }, { l: "Drafted by AI", v: "4" },
                    { l: "Avg Filing Time", v: "4.2d" }, { l: "Acceptance Rate", v: "78%" },
                  ].map((s) => (
                    <div key={s.l} className="bg-card p-3"><div className="text-[14px] font-extrabold tabular-nums">{s.v}</div><div className="text-[8px] font-bold text-muted-foreground uppercase tracking-widest">{s.l}</div></div>
                  ))}
                </div>
                <div>
                  <div className="text-[9px] font-bold text-muted-foreground uppercase tracking-widest mb-2">SAR Volume (6 months)</div>
                  <div className="h-40">
                    <ResponsiveContainer width="100%" height="100%" minWidth={0} minHeight={0}>
                      <BarChart data={sarMonthly}>
                        <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
                        <XAxis dataKey="month" tick={{ fontSize: 10 }} stroke="var(--border)" />
                        <YAxis tick={{ fontSize: 10 }} stroke="var(--border)" />
                        <Tooltip contentStyle={{ fontSize: 11, borderRadius: 6, border: "1px solid var(--border)" }} />
                        <Bar dataKey="filed" fill="var(--foreground)" radius={[2, 2, 0, 0]} name="Filed" />
                        <Bar dataKey="drafted" fill="var(--nx-neutral-300)" radius={[2, 2, 0, 0]} name="AI Drafted" />
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                </div>
                <div className="text-[9px] font-bold text-muted-foreground uppercase tracking-widest mb-2">Recent Filings</div>
                <table className="w-full text-[11px]">
                  <thead><tr className="border-b border-border bg-muted/20">
                    {["SAR ID", "Entity", "Type", "Filed Date", "Jurisdiction", "Status"].map((h) => <th key={h} className="text-left font-bold text-muted-foreground uppercase tracking-wider px-3 py-1.5">{h}</th>)}
                  </tr></thead>
                  <tbody className="divide-y divide-border">
                    {[
                      { id: "SAR-2026-0012", entity: "Horizon Trading LLC", type: "Initial", date: "Mar 22", jur: "🇺🇸 FinCEN", status: "Filed" },
                      { id: "SAR-2026-0011", entity: "Apex Offshore Fund", type: "Initial", date: "Mar 15", jur: "🇺🇸 FinCEN", status: "Filed" },
                      { id: "SAR-2026-0010", entity: "Nordic Shipping", type: "Supplemental", date: "Mar 8", jur: "🇬🇧 NCA", status: "Filed" },
                    ].map((s) => (
                      <tr key={s.id} className="hover:bg-muted/10"><td className="px-3 py-2 font-mono font-semibold text-[10px]">{s.id}</td><td className="px-3 py-2 font-medium">{s.entity}</td><td className="px-3 py-2 text-muted-foreground">{s.type}</td><td className="px-3 py-2 tabular-nums text-muted-foreground">{s.date}</td><td className="px-3 py-2">{s.jur}</td><td className="px-3 py-2"><span className="text-[9px] font-bold text-nx-emerald-600">{s.status}</span></td></tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}

            {/* Screening preview */}
            {previewing.previewType === "screening" && (
              <div className="space-y-5">
                <div className="grid grid-cols-5 gap-px bg-border rounded overflow-hidden">
                  {[
                    { l: "Total Screened", v: "4,678" }, { l: "Auto-Resolved", v: "3,974" },
                    { l: "Pending", v: "47" }, { l: "FP Rate", v: "18%" }, { l: "Avg Time", v: "3.2m" },
                  ].map((s) => (
                    <div key={s.l} className="bg-card p-3"><div className="text-[14px] font-extrabold tabular-nums">{s.v}</div><div className="text-[8px] font-bold text-muted-foreground uppercase tracking-widest">{s.l}</div></div>
                  ))}
                </div>
                <div>
                  <div className="text-[9px] font-bold text-muted-foreground uppercase tracking-widest mb-2">This Week — Daily Volume</div>
                  <div className="h-40">
                    <ResponsiveContainer width="100%" height="100%" minWidth={0} minHeight={0}>
                      <AreaChart data={screeningDaily}>
                        <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
                        <XAxis dataKey="day" tick={{ fontSize: 10 }} stroke="var(--border)" />
                        <YAxis tick={{ fontSize: 10 }} stroke="var(--border)" />
                        <Tooltip contentStyle={{ fontSize: 11, borderRadius: 6, border: "1px solid var(--border)" }} />
                        <Area type="monotone" dataKey="total" stroke="var(--foreground)" fill="var(--foreground)" fillOpacity={0.08} strokeWidth={2} name="Total" />
                        <Area type="monotone" dataKey="auto" stroke="var(--nx-emerald-600)" fill="var(--nx-emerald-600)" fillOpacity={0.08} strokeWidth={1.5} name="Auto-Resolved" />
                      </AreaChart>
                    </ResponsiveContainer>
                  </div>
                </div>
              </div>
            )}

            {/* Risk preview */}
            {previewing.previewType === "risk" && (
              <div className="space-y-5">
                <div className="grid lg:grid-cols-2 gap-5">
                  <div>
                    <div className="text-[9px] font-bold text-muted-foreground uppercase tracking-widest mb-2">Risk Tier Distribution</div>
                    <div className="h-48">
                      <ResponsiveContainer width="100%" height="100%" minWidth={0} minHeight={0}>
                        <PieChart>
                          <Pie data={riskDistribution} cx="50%" cy="50%" innerRadius={50} outerRadius={80} dataKey="value" strokeWidth={0}>
                            {riskDistribution.map((entry) => <Cell key={entry.name} fill={entry.color} />)}
                          </Pie>
                          <Tooltip contentStyle={{ fontSize: 11, borderRadius: 6, border: "1px solid var(--border)" }} />
                        </PieChart>
                      </ResponsiveContainer>
                    </div>
                  </div>
                  <div>
                    <div className="text-[9px] font-bold text-muted-foreground uppercase tracking-widest mb-2">Breakdown</div>
                    {riskDistribution.map((r) => (
                      <div key={r.name} className="flex items-center justify-between py-2 border-b border-border last:border-0">
                        <div className="flex items-center gap-2">
                          <div className="h-2.5 w-2.5 rounded-sm" style={{ backgroundColor: r.color }} />
                          <span className="text-[11px] font-medium">{r.name}</span>
                        </div>
                        <div className="flex items-center gap-3">
                          <span className="text-[11px] font-bold tabular-nums">{r.value.toLocaleString()}</span>
                          <span className="text-[9px] text-muted-foreground tabular-nums w-8 text-right">{((r.value / 12847) * 100).toFixed(1)}%</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* Onboarding preview */}
            {previewing.previewType === "onboarding" && (
              <div className="space-y-5">
                <div className="grid grid-cols-4 gap-px bg-border rounded overflow-hidden">
                  {[
                    { l: "Completed (MTD)", v: "34" }, { l: "Avg Time", v: "4.2h" },
                    { l: "SLA Compliance", v: "94%" }, { l: "AI Prefill Rate", v: "72%" },
                  ].map((s) => (
                    <div key={s.l} className="bg-card p-3"><div className="text-[14px] font-extrabold tabular-nums">{s.v}</div><div className="text-[8px] font-bold text-muted-foreground uppercase tracking-widest">{s.l}</div></div>
                  ))}
                </div>
                <div>
                  <div className="text-[9px] font-bold text-muted-foreground uppercase tracking-widest mb-2">Avg Onboarding Time (Weekly)</div>
                  <div className="h-40">
                    <ResponsiveContainer width="100%" height="100%" minWidth={0} minHeight={0}>
                      <BarChart data={onboardingTrend}>
                        <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
                        <XAxis dataKey="week" tick={{ fontSize: 10 }} stroke="var(--border)" />
                        <YAxis domain={[0, 10]} tick={{ fontSize: 10 }} stroke="var(--border)" />
                        <Tooltip contentStyle={{ fontSize: 11, borderRadius: 6, border: "1px solid var(--border)" }} />
                        <Bar dataKey="avgTime" fill="var(--foreground)" radius={[2, 2, 0, 0]} name="Avg Hours" />
                        <Bar dataKey="target" fill="var(--nx-neutral-200)" radius={[2, 2, 0, 0]} name="SLA Target" />
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                </div>
              </div>
            )}

            {/* Agent performance preview */}
            {previewing.previewType === "agent" && (
              <div className="space-y-5">
                <div className="text-[9px] font-bold text-muted-foreground uppercase tracking-widest mb-2">Agent Accuracy (30d Rolling)</div>
                <div className="h-44">
                  <ResponsiveContainer width="100%" height="100%" minWidth={0} minHeight={0}>
                    <BarChart data={agentAccuracy} layout="vertical">
                      <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
                      <XAxis type="number" domain={[80, 100]} tick={{ fontSize: 10 }} stroke="var(--border)" />
                      <YAxis type="category" dataKey="agent" tick={{ fontSize: 10 }} stroke="var(--border)" width={80} />
                      <Tooltip contentStyle={{ fontSize: 11, borderRadius: 6, border: "1px solid var(--border)" }} />
                      <Bar dataKey="accuracy" fill="var(--foreground)" radius={[0, 2, 2, 0]} name="Accuracy %" />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
                <div className="grid grid-cols-3 gap-px bg-border rounded overflow-hidden">
                  {[
                    { l: "Avg Accuracy", v: "94.7%" }, { l: "Total Decisions", v: "87,412" }, { l: "Override Rate", v: "0.8%" },
                  ].map((s) => (
                    <div key={s.l} className="bg-card p-3"><div className="text-[14px] font-extrabold tabular-nums">{s.v}</div><div className="text-[8px] font-bold text-muted-foreground uppercase tracking-widest">{s.l}</div></div>
                  ))}
                </div>
              </div>
            )}

            {/* Table-only preview */}
            {previewing.previewType === "table" && (
              <div className="text-center py-8">
                <FileText className="h-8 w-8 text-muted-foreground/20 mx-auto mb-3" />
                <p className="text-[12px] font-semibold">Report ready to generate</p>
                <p className="text-[10px] text-muted-foreground mt-1 max-w-sm mx-auto">{previewing.description}</p>
                <Button size="sm" className="h-8 text-[11px] font-semibold gap-1.5 mt-4" onClick={() => handleGenerate(previewing.id)}>
                  <Download className="h-3 w-3" /> Generate {previewing.format[0]}
                </Button>
              </div>
            )}
          </div>
        </div>
      )}

      {/* ─── Report Catalog ─── */}
      <div className="rounded-lg border border-border bg-card overflow-hidden">
        <div className="flex items-center justify-between px-4 py-2.5 border-b border-border">
          <div className="flex items-center gap-2"><BarChart3 className="h-3.5 w-3.5 text-muted-foreground/40" /><span className="text-[12px] font-bold">Report Catalog</span></div>
        </div>

        <div className="flex items-center gap-1 px-4 py-2 border-b border-border overflow-x-auto" style={{ scrollbarWidth: "none" }}>
          <button onClick={() => setFilterCat("all")} className={cn("shrink-0 px-2.5 py-1 text-[10px] font-bold rounded transition-colors", filterCat === "all" ? "bg-foreground text-background" : "text-muted-foreground hover:bg-muted/50")}>All ({reports.length})</button>
          {categories.map((cat) => (
            <button key={cat} onClick={() => setFilterCat(filterCat === cat ? "all" : cat)} className={cn("shrink-0 px-2.5 py-1 text-[10px] font-bold rounded transition-colors", filterCat === cat ? "bg-foreground text-background" : "text-muted-foreground hover:bg-muted/50")}>{cat} ({reports.filter((r) => r.category === cat).length})</button>
          ))}
        </div>

        <table className="w-full text-[11px]">
          <thead><tr className="border-b border-border bg-muted/20">
            {["Report", "Category", "Frequency", "Last Generated", "Format", "Recipients", "", ""].map((h) => (
              <th key={h} className="text-left font-bold text-muted-foreground uppercase tracking-wider px-3 py-2 whitespace-nowrap">{h}</th>
            ))}
          </tr></thead>
          <tbody className="divide-y divide-border">
            {filtered.map((rpt) => {
              const isGen = generating === rpt.id;
              const isPreviewing = previewId === rpt.id;
              return (
                <tr key={rpt.id} className={cn("transition-colors", isPreviewing ? "bg-muted/15" : "hover:bg-muted/10")}>
                  <td className="px-3 py-2.5 max-w-52">
                    <div className="text-[12px] font-semibold">{rpt.name}</div>
                    <div className="text-[9px] text-muted-foreground mt-0.5 line-clamp-1">{rpt.description}</div>
                  </td>
                  <td className="px-3 py-2.5"><span className="text-[9px] font-bold text-muted-foreground uppercase">{rpt.category}</span></td>
                  <td className="px-3 py-2.5 text-[10px] font-medium">{rpt.frequency}</td>
                  <td className="px-3 py-2.5 tabular-nums text-muted-foreground">{rpt.lastGenerated}</td>
                  <td className="px-3 py-2.5"><div className="flex gap-0.5">{rpt.format.map((f) => <span key={f} className="text-[8px] font-bold px-1 py-0.5 rounded bg-muted text-muted-foreground">{f}</span>)}</div></td>
                  <td className="px-3 py-2.5 text-muted-foreground text-[10px] max-w-24 truncate">{rpt.recipients.join(", ")}</td>
                  <td className="px-3 py-2.5">
                    <Button variant="ghost" size="sm" className="h-6 text-[9px] font-semibold px-2 gap-1" onClick={() => setPreviewId(isPreviewing ? null : rpt.id)}>
                      <Eye className="h-2.5 w-2.5" /> {isPreviewing ? "Hide" : "Preview"}
                    </Button>
                  </td>
                  <td className="px-3 py-2.5">
                    <Button variant="outline" size="sm" className="h-6 text-[9px] font-semibold px-2 gap-1" onClick={() => handleGenerate(rpt.id)} disabled={isGen}>
                      {isGen ? <><Clock className="h-2.5 w-2.5 animate-spin" /> ...</> : <><Download className="h-2.5 w-2.5" /> Export</>}
                    </Button>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* ─── Scheduled + Recent ─── */}
      <div className="grid gap-5 lg:grid-cols-2">
        <div className="rounded-lg border border-border bg-card overflow-hidden">
          <div className="flex items-center justify-between px-4 py-2.5 border-b border-border">
            <div className="flex items-center gap-2"><Calendar className="h-3.5 w-3.5 text-muted-foreground/40" /><span className="text-[12px] font-bold">Scheduled</span></div>
            <Button variant="outline" size="sm" className="h-5 text-[9px] font-semibold px-2 gap-1"><Plus className="h-2.5 w-2.5" /> Add</Button>
          </div>
          <div className="divide-y divide-border">
            {scheduled.map((s) => (
              <div key={s.name} className="flex items-center justify-between px-4 py-2 hover:bg-muted/10 transition-colors">
                <div><div className="text-[11px] font-medium">{s.name}</div><div className="text-[9px] text-muted-foreground">{s.schedule}</div></div>
                <div className="flex items-center gap-3 text-[10px]">
                  <span className="tabular-nums text-muted-foreground">Next: {s.next}</span>
                  <CheckCircle2 className="h-3 w-3 text-nx-emerald-600" />
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="rounded-lg border border-border bg-card overflow-hidden">
          <div className="flex items-center justify-between px-4 py-2.5 border-b border-border">
            <div className="flex items-center gap-2"><Download className="h-3.5 w-3.5 text-muted-foreground/40" /><span className="text-[12px] font-bold">Recent Exports</span></div>
          </div>
          <div className="divide-y divide-border">
            {recent.map((r) => (
              <div key={r.name + r.at} className="flex items-center justify-between px-4 py-2 hover:bg-muted/10 transition-colors">
                <div><div className="text-[11px] font-medium">{r.name}</div><div className="text-[9px] text-muted-foreground">{r.at} · {r.by}</div></div>
                <div className="flex items-center gap-2">
                  <span className="text-[8px] font-bold px-1 py-0.5 rounded bg-muted text-muted-foreground">{r.fmt}</span>
                  <span className="text-[9px] text-muted-foreground tabular-nums">{r.size}</span>
                  <Button variant="ghost" size="sm" className="h-5 text-[9px] px-1.5"><Download className="h-2.5 w-2.5" /></Button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
