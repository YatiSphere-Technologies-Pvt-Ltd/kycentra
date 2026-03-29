"use client";

import { useSearchParams, useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import {
  ArrowLeft, Download, Printer, Share2, Mail, Clock,
  CheckCircle2, AlertTriangle, Shield,
} from "lucide-react";
import {
  BarChart, Bar, AreaChart, Area, PieChart, Pie, Cell,
  XAxis, YAxis, CartesianGrid, ResponsiveContainer, Tooltip, Legend,
} from "recharts";
import { Suspense } from "react";

/* ─── Report Data ─── */

const sarData = {
  summary: { filed: 3, pending: 1, drafted: 4, avgFilingDays: 4.2, acceptanceRate: 78 },
  monthly: [
    { month: "Oct 2025", filed: 2, drafted: 4 }, { month: "Nov 2025", filed: 3, drafted: 5 },
    { month: "Dec 2025", filed: 1, drafted: 3 }, { month: "Jan 2026", filed: 4, drafted: 6 },
    { month: "Feb 2026", filed: 2, drafted: 5 }, { month: "Mar 2026", filed: 3, drafted: 4 },
  ],
  filings: [
    { id: "SAR-2026-0012", entity: "Horizon Trading LLC", type: "Initial", jurisdiction: "FinCEN (US)", filed: "Mar 22, 2026", amount: "$4.2M", status: "Filed", aiDrafted: true },
    { id: "SAR-2026-0011", entity: "Apex Offshore Fund Services", type: "Initial", jurisdiction: "FinCEN (US)", filed: "Mar 15, 2026", amount: "$1.8M", status: "Filed", aiDrafted: true },
    { id: "SAR-2026-0010", entity: "Nordic Shipping Consortium", type: "Supplemental", jurisdiction: "NCA (UK)", filed: "Mar 8, 2026", amount: "£890K", status: "Filed", aiDrafted: false },
  ],
  byJurisdiction: [
    { jurisdiction: "FinCEN (US)", count: 8, ytd: true }, { jurisdiction: "NCA (UK)", count: 3, ytd: true },
    { jurisdiction: "FIU Germany", count: 1, ytd: true }, { jurisdiction: "MAS (SG)", count: 0, ytd: true },
  ],
  pending: [
    { id: "SAR-2026-0013", entity: "Meridian Capital Partners", status: "Draft Review", assignee: "Sarah Chen", daysOpen: 2 },
  ],
};

const screeningData = {
  summary: { totalScreened: 28734, autoResolved: 24423, pending: 47, truePositives: 12, fpRate: 18, avgTime: "3.2m", listsMonitored: 847 },
  daily: [
    { day: "Mar 18", total: 892, auto: 748 }, { day: "Mar 19", total: 934, auto: 798 },
    { day: "Mar 20", total: 1021, auto: 882 }, { day: "Mar 21", total: 955, auto: 812 },
    { day: "Mar 22", total: 876, auto: 734 }, { day: "Mar 23", total: 956, auto: 814 },
    { day: "Mar 24", total: 943, auto: 801 },
  ],
  byList: [
    { list: "OFAC SDN", alerts: 234, autoResolved: 198, pending: 8 },
    { list: "PEP Database", alerts: 198, autoResolved: 142, pending: 12 },
    { list: "Adverse Media", alerts: 176, autoResolved: 128, pending: 18 },
    { list: "EU Consolidated", alerts: 121, autoResolved: 112, pending: 3 },
    { list: "UK HMT", alerts: 89, autoResolved: 83, pending: 2 },
    { list: "UN Consolidated", alerts: 67, autoResolved: 64, pending: 1 },
  ],
  analysts: [
    { name: "Sarah Chen", resolved: 94, avgTime: "3.2m", accuracy: 99.1 },
    { name: "James Park", resolved: 78, avgTime: "4.1m", accuracy: 98.7 },
    { name: "Maria Lopez", resolved: 64, avgTime: "3.8m", accuracy: 99.4 },
    { name: "David Kim", resolved: 52, avgTime: "5.2m", accuracy: 97.8 },
  ],
};

const riskData = {
  distribution: [
    { tier: "Critical", count: 12, pct: 0.1, color: "#991B1B" },
    { tier: "High", count: 187, pct: 1.5, color: "#DC2626" },
    { tier: "Medium", count: 1423, pct: 11.1, color: "#D97706" },
    { tier: "Low", count: 8391, pct: 65.3, color: "#16A34A" },
    { tier: "Minimal", count: 2834, pct: 22.0, color: "#94A3B8" },
  ],
  byJurisdiction: [
    { jurisdiction: "🇺🇸 United States", entities: 3892, highRisk: 45, pct: 1.2 },
    { jurisdiction: "🇬🇧 United Kingdom", entities: 2156, highRisk: 32, pct: 1.5 },
    { jurisdiction: "🇩🇪 Germany", entities: 2341, highRisk: 28, pct: 1.2 },
    { jurisdiction: "🇪🇺 EU (other)", entities: 2187, highRisk: 41, pct: 1.9 },
    { jurisdiction: "🇸🇬 Singapore", entities: 1234, highRisk: 18, pct: 1.5 },
    { jurisdiction: "🇰🇾 Cayman Islands", entities: 987, highRisk: 23, pct: 2.3 },
  ],
  changes: [
    { entity: "Horizon Trading LLC", from: "Medium", to: "High", reason: "PEP association detected", date: "Mar 22" },
    { entity: "Crown Bay Holdings", from: "Medium", to: "High", reason: "PEP in UBO chain", date: "Mar 18" },
    { entity: "Swiss Crypto Ventures", from: "Low", to: "High", reason: "VASP classification + jurisdiction", date: "Mar 23" },
  ],
};

const reportMeta: Record<string, { title: string; subtitle: string; period: string }> = {
  "rpt-sar": { title: "Suspicious Activity Report Filing Summary", subtitle: "Monthly Compliance Report", period: "March 2026" },
  "rpt-screening": { title: "Screening Operations Report", subtitle: "Weekly Operations Summary", period: "March 18–24, 2026" },
  "rpt-risk": { title: "Portfolio Risk Distribution Report", subtitle: "Monthly Risk Assessment", period: "March 2026" },
};

/* ─── Report Document Component ─── */

function ReportDocument({ reportId }: { reportId: string }) {
  const meta = reportMeta[reportId] ?? { title: "Report", subtitle: "", period: "" };
  const now = new Date().toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" });

  return (
    <div className="bg-white rounded-lg border border-border shadow-sm max-w-4xl mx-auto">
      {/* ─── Cover / Header ─── */}
      <div className="border-b border-border">
        <div className="bg-[#0a0a0a] text-white p-8 rounded-t-lg">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-2">
              <div className="h-6 w-6 rounded bg-white flex items-center justify-center">
                <span className="text-[8px] font-black text-[#0a0a0a]">Ag</span>
              </div>
              <span className="text-[13px] font-semibold tracking-tight">Agentic KYC & CLM Pro</span>
            </div>
            <span className="text-[10px] text-white/50 uppercase tracking-widest">Confidential</span>
          </div>
          <h1 className="text-[22px] font-extrabold tracking-tight leading-tight">{meta.title}</h1>
          <p className="text-[13px] text-white/60 mt-1">{meta.subtitle}</p>
          <div className="flex items-center gap-6 mt-4 text-[10px] text-white/40">
            <span>Period: <strong className="text-white/70">{meta.period}</strong></span>
            <span>Generated: <strong className="text-white/70">{now}</strong></span>
            <span>Prepared for: <strong className="text-white/70">Meridian Capital Partners</strong></span>
          </div>
        </div>
      </div>

      {/* ─── Report Body ─── */}
      <div className="p-8 space-y-8">

        {/* ═══ SAR Report ═══ */}
        {reportId === "rpt-sar" && (
          <>
            {/* Executive Summary */}
            <section>
              <h2 className="text-[14px] font-bold border-b border-border pb-2 mb-4 uppercase tracking-wider text-muted-foreground">1. Executive Summary</h2>
              <p className="text-[12px] text-muted-foreground leading-[1.8]">
                During the reporting period (March 2026), <strong className="text-foreground">3 Suspicious Activity Reports</strong> were filed with relevant Financial Intelligence Units. An additional <strong className="text-foreground">4 SAR narratives were drafted by the AI Investigation Agent</strong>, of which 1 remains under analyst review. The average filing time from trigger detection to submission was <strong className="text-foreground">4.2 business days</strong>, well within the 30-day regulatory requirement. The AI-drafted SAR acceptance rate stands at <strong className="text-foreground">78%</strong>, with 22% requiring revision before filing.
              </p>
            </section>

            {/* Key Metrics */}
            <section>
              <h2 className="text-[14px] font-bold border-b border-border pb-2 mb-4 uppercase tracking-wider text-muted-foreground">2. Key Metrics</h2>
              <div className="grid grid-cols-5 gap-px bg-border rounded overflow-hidden">
                {[
                  { l: "SARs Filed (MTD)", v: "3" }, { l: "AI Drafted", v: "4" },
                  { l: "Pending Review", v: "1" }, { l: "Avg Filing Time", v: "4.2 days" },
                  { l: "AI Acceptance Rate", v: "78%" },
                ].map((s) => (
                  <div key={s.l} className="bg-card p-3.5"><div className="text-[16px] font-extrabold tabular-nums">{s.v}</div><div className="text-[8px] font-bold text-muted-foreground uppercase tracking-widest mt-0.5">{s.l}</div></div>
                ))}
              </div>
            </section>

            {/* Filing Trend */}
            <section>
              <h2 className="text-[14px] font-bold border-b border-border pb-2 mb-4 uppercase tracking-wider text-muted-foreground">3. Filing Trend (6 Months)</h2>
              <div className="h-48">
                <ResponsiveContainer width="100%" height="100%" minWidth={0} minHeight={0}>
                  <BarChart data={sarData.monthly}>
                    <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
                    <XAxis dataKey="month" tick={{ fontSize: 9 }} stroke="var(--border)" />
                    <YAxis tick={{ fontSize: 9 }} stroke="var(--border)" />
                    <Tooltip contentStyle={{ fontSize: 10, borderRadius: 4, border: "1px solid var(--border)" }} />
                    <Legend wrapperStyle={{ fontSize: 10 }} />
                    <Bar dataKey="filed" fill="var(--foreground)" radius={[2, 2, 0, 0]} name="Filed" />
                    <Bar dataKey="drafted" fill="var(--nx-neutral-300)" radius={[2, 2, 0, 0]} name="AI Drafted" />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </section>

            {/* Filing Detail */}
            <section>
              <h2 className="text-[14px] font-bold border-b border-border pb-2 mb-4 uppercase tracking-wider text-muted-foreground">4. Filing Detail</h2>
              <table className="w-full text-[11px] border border-border">
                <thead><tr className="bg-muted/30">
                  {["SAR ID", "Entity", "Type", "Jurisdiction", "Filed Date", "Amount", "AI Drafted", "Status"].map((h) => (
                    <th key={h} className="text-left font-bold text-muted-foreground uppercase tracking-wider px-3 py-2 border-b border-border">{h}</th>
                  ))}
                </tr></thead>
                <tbody>
                  {sarData.filings.map((f) => (
                    <tr key={f.id} className="border-b border-border">
                      <td className="px-3 py-2 font-mono font-semibold text-[10px]">{f.id}</td>
                      <td className="px-3 py-2 font-medium">{f.entity}</td>
                      <td className="px-3 py-2 text-muted-foreground">{f.type}</td>
                      <td className="px-3 py-2">{f.jurisdiction}</td>
                      <td className="px-3 py-2 tabular-nums text-muted-foreground">{f.filed}</td>
                      <td className="px-3 py-2 tabular-nums font-medium">{f.amount}</td>
                      <td className="px-3 py-2">{f.aiDrafted ? <CheckCircle2 className="h-3 w-3 text-nx-emerald-600" /> : <span className="text-muted-foreground/30">—</span>}</td>
                      <td className="px-3 py-2"><span className="text-[9px] font-bold text-nx-emerald-600">{f.status}</span></td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </section>

            {/* Jurisdiction Breakdown */}
            <section>
              <h2 className="text-[14px] font-bold border-b border-border pb-2 mb-4 uppercase tracking-wider text-muted-foreground">5. Filings by Jurisdiction (YTD)</h2>
              <table className="w-full text-[11px] border border-border">
                <thead><tr className="bg-muted/30">
                  {["Jurisdiction", "Filings (YTD)"].map((h) => <th key={h} className="text-left font-bold text-muted-foreground uppercase tracking-wider px-3 py-2 border-b border-border">{h}</th>)}
                </tr></thead>
                <tbody>
                  {sarData.byJurisdiction.map((j) => (
                    <tr key={j.jurisdiction} className="border-b border-border">
                      <td className="px-3 py-2 font-medium">{j.jurisdiction}</td>
                      <td className="px-3 py-2 tabular-nums font-bold">{j.count}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </section>

            {/* Pending */}
            {sarData.pending.length > 0 && (
              <section>
                <h2 className="text-[14px] font-bold border-b border-border pb-2 mb-4 uppercase tracking-wider text-muted-foreground">6. Pending SARs</h2>
                <div className="p-3 rounded bg-nx-amber-50/50 border border-nx-amber-200">
                  {sarData.pending.map((p) => (
                    <div key={p.id} className="flex items-center justify-between text-[11px]">
                      <div><span className="font-mono font-semibold">{p.id}</span> — <span className="font-medium">{p.entity}</span></div>
                      <div className="text-muted-foreground">Assigned: {p.assignee} · {p.daysOpen} days open</div>
                    </div>
                  ))}
                </div>
              </section>
            )}
          </>
        )}

        {/* ═══ Screening Report ═══ */}
        {reportId === "rpt-screening" && (
          <>
            <section>
              <h2 className="text-[14px] font-bold border-b border-border pb-2 mb-4 uppercase tracking-wider text-muted-foreground">1. Executive Summary</h2>
              <p className="text-[12px] text-muted-foreground leading-[1.8]">
                During the reporting week (March 18–24, 2026), <strong className="text-foreground">{screeningData.summary.totalScreened.toLocaleString()} screening checks</strong> were performed across the portfolio. The Screening Agent auto-resolved <strong className="text-foreground">{screeningData.summary.autoResolved.toLocaleString()} alerts ({Math.round(screeningData.summary.autoResolved / screeningData.summary.totalScreened * 100)}%)</strong> without human intervention. <strong className="text-foreground">{screeningData.summary.pending} alerts</strong> remain pending analyst review. The false positive rate of <strong className="text-foreground">{screeningData.summary.fpRate}%</strong> continues to trend downward from the industry baseline of 90–95%.
              </p>
            </section>

            <section>
              <h2 className="text-[14px] font-bold border-b border-border pb-2 mb-4 uppercase tracking-wider text-muted-foreground">2. Key Metrics</h2>
              <div className="grid grid-cols-4 gap-px bg-border rounded overflow-hidden">
                {[
                  { l: "Total Screened", v: screeningData.summary.totalScreened.toLocaleString() },
                  { l: "Auto-Resolved", v: screeningData.summary.autoResolved.toLocaleString() },
                  { l: "Pending Review", v: String(screeningData.summary.pending) },
                  { l: "False Positive Rate", v: `${screeningData.summary.fpRate}%` },
                ].map((s) => (
                  <div key={s.l} className="bg-card p-3.5"><div className="text-[16px] font-extrabold tabular-nums">{s.v}</div><div className="text-[8px] font-bold text-muted-foreground uppercase tracking-widest mt-0.5">{s.l}</div></div>
                ))}
              </div>
            </section>

            <section>
              <h2 className="text-[14px] font-bold border-b border-border pb-2 mb-4 uppercase tracking-wider text-muted-foreground">3. Daily Volume Trend</h2>
              <div className="h-48">
                <ResponsiveContainer width="100%" height="100%" minWidth={0} minHeight={0}>
                  <AreaChart data={screeningData.daily}>
                    <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
                    <XAxis dataKey="day" tick={{ fontSize: 9 }} stroke="var(--border)" />
                    <YAxis tick={{ fontSize: 9 }} stroke="var(--border)" />
                    <Tooltip contentStyle={{ fontSize: 10, borderRadius: 4, border: "1px solid var(--border)" }} />
                    <Legend wrapperStyle={{ fontSize: 10 }} />
                    <Area type="monotone" dataKey="total" stroke="var(--foreground)" fill="var(--foreground)" fillOpacity={0.06} strokeWidth={2} name="Total" />
                    <Area type="monotone" dataKey="auto" stroke="var(--nx-emerald-600)" fill="var(--nx-emerald-600)" fillOpacity={0.06} strokeWidth={1.5} name="Auto-Resolved" />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </section>

            <section>
              <h2 className="text-[14px] font-bold border-b border-border pb-2 mb-4 uppercase tracking-wider text-muted-foreground">4. Alerts by Screening List</h2>
              <table className="w-full text-[11px] border border-border">
                <thead><tr className="bg-muted/30">
                  {["List", "Total Alerts", "Auto-Resolved", "Pending", "Resolution Rate"].map((h) => <th key={h} className="text-left font-bold text-muted-foreground uppercase tracking-wider px-3 py-2 border-b border-border">{h}</th>)}
                </tr></thead>
                <tbody>
                  {screeningData.byList.map((l) => (
                    <tr key={l.list} className="border-b border-border">
                      <td className="px-3 py-2 font-medium">{l.list}</td>
                      <td className="px-3 py-2 tabular-nums">{l.alerts}</td>
                      <td className="px-3 py-2 tabular-nums">{l.autoResolved}</td>
                      <td className="px-3 py-2 tabular-nums">{l.pending > 0 ? <span className="font-bold text-nx-amber-600">{l.pending}</span> : "0"}</td>
                      <td className="px-3 py-2 tabular-nums font-bold">{Math.round(l.autoResolved / l.alerts * 100)}%</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </section>

            <section>
              <h2 className="text-[14px] font-bold border-b border-border pb-2 mb-4 uppercase tracking-wider text-muted-foreground">5. Analyst Performance</h2>
              <table className="w-full text-[11px] border border-border">
                <thead><tr className="bg-muted/30">
                  {["Analyst", "Alerts Resolved", "Avg Resolution Time", "Accuracy"].map((h) => <th key={h} className="text-left font-bold text-muted-foreground uppercase tracking-wider px-3 py-2 border-b border-border">{h}</th>)}
                </tr></thead>
                <tbody>
                  {screeningData.analysts.map((a) => (
                    <tr key={a.name} className="border-b border-border">
                      <td className="px-3 py-2 font-medium">{a.name}</td>
                      <td className="px-3 py-2 tabular-nums font-bold">{a.resolved}</td>
                      <td className="px-3 py-2 tabular-nums">{a.avgTime}</td>
                      <td className="px-3 py-2 tabular-nums font-bold text-nx-emerald-600">{a.accuracy}%</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </section>
          </>
        )}

        {/* ═══ Risk Report ═══ */}
        {reportId === "rpt-risk" && (
          <>
            <section>
              <h2 className="text-[14px] font-bold border-b border-border pb-2 mb-4 uppercase tracking-wider text-muted-foreground">1. Executive Summary</h2>
              <p className="text-[12px] text-muted-foreground leading-[1.8]">
                As of March 24, 2026, the portfolio comprises <strong className="text-foreground">12,847 monitored entities</strong>. The overall risk profile remains stable with <strong className="text-foreground">0.1% (12 entities) at Critical risk</strong> and <strong className="text-foreground">1.5% (187 entities) at High risk</strong>. Three entities experienced risk tier elevations during the period, all driven by PEP association detections or VASP reclassification. The Risk Agent maintains a <strong className="text-foreground">92.1% accuracy rate</strong> with a 7.2% human override rate.
              </p>
            </section>

            <section>
              <h2 className="text-[14px] font-bold border-b border-border pb-2 mb-4 uppercase tracking-wider text-muted-foreground">2. Risk Distribution</h2>
              <div className="grid lg:grid-cols-2 gap-6">
                <div className="h-52">
                  <ResponsiveContainer width="100%" height="100%" minWidth={0} minHeight={0}>
                    <PieChart>
                      <Pie data={riskData.distribution} cx="50%" cy="50%" innerRadius={45} outerRadius={75} dataKey="count" strokeWidth={0}>
                        {riskData.distribution.map((entry) => <Cell key={entry.tier} fill={entry.color} />)}
                      </Pie>
                      <Tooltip contentStyle={{ fontSize: 10, borderRadius: 4, border: "1px solid var(--border)" }} />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
                <table className="text-[11px] border border-border self-start">
                  <thead><tr className="bg-muted/30">
                    {["Risk Tier", "Count", "% of Portfolio"].map((h) => <th key={h} className="text-left font-bold text-muted-foreground uppercase tracking-wider px-3 py-2 border-b border-border">{h}</th>)}
                  </tr></thead>
                  <tbody>
                    {riskData.distribution.map((r) => (
                      <tr key={r.tier} className="border-b border-border">
                        <td className="px-3 py-2"><div className="flex items-center gap-2"><div className="h-2.5 w-2.5 rounded-sm" style={{ backgroundColor: r.color }} /><span className="font-medium">{r.tier}</span></div></td>
                        <td className="px-3 py-2 tabular-nums font-bold">{r.count.toLocaleString()}</td>
                        <td className="px-3 py-2 tabular-nums">{r.pct}%</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </section>

            <section>
              <h2 className="text-[14px] font-bold border-b border-border pb-2 mb-4 uppercase tracking-wider text-muted-foreground">3. High-Risk Concentration by Jurisdiction</h2>
              <table className="w-full text-[11px] border border-border">
                <thead><tr className="bg-muted/30">
                  {["Jurisdiction", "Total Entities", "High/Critical Risk", "% High Risk"].map((h) => <th key={h} className="text-left font-bold text-muted-foreground uppercase tracking-wider px-3 py-2 border-b border-border">{h}</th>)}
                </tr></thead>
                <tbody>
                  {riskData.byJurisdiction.map((j) => (
                    <tr key={j.jurisdiction} className="border-b border-border">
                      <td className="px-3 py-2 font-medium">{j.jurisdiction}</td>
                      <td className="px-3 py-2 tabular-nums">{j.entities.toLocaleString()}</td>
                      <td className="px-3 py-2 tabular-nums font-bold">{j.highRisk}</td>
                      <td className="px-3 py-2 tabular-nums">{j.pct}%</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </section>

            <section>
              <h2 className="text-[14px] font-bold border-b border-border pb-2 mb-4 uppercase tracking-wider text-muted-foreground">4. Risk Tier Changes (This Period)</h2>
              <table className="w-full text-[11px] border border-border">
                <thead><tr className="bg-muted/30">
                  {["Entity", "From", "To", "Reason", "Date"].map((h) => <th key={h} className="text-left font-bold text-muted-foreground uppercase tracking-wider px-3 py-2 border-b border-border">{h}</th>)}
                </tr></thead>
                <tbody>
                  {riskData.changes.map((c) => (
                    <tr key={c.entity} className="border-b border-border">
                      <td className="px-3 py-2 font-medium">{c.entity}</td>
                      <td className="px-3 py-2">{c.from}</td>
                      <td className="px-3 py-2 font-bold text-nx-amber-600">{c.to}</td>
                      <td className="px-3 py-2 text-muted-foreground">{c.reason}</td>
                      <td className="px-3 py-2 tabular-nums text-muted-foreground">{c.date}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </section>
          </>
        )}
      </div>

      {/* ─── Footer ─── */}
      <div className="border-t border-border px-8 py-4 flex items-center justify-between text-[9px] text-muted-foreground">
        <span>Agentic KYC & CLM Pro · {meta.title} · {meta.period}</span>
        <span>Confidential — For authorized recipients only</span>
        <span>Generated {now} · Page 1 of 1</span>
      </div>
    </div>
  );
}

/* ─── Page ─── */

function ReportViewerContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const reportId = searchParams.get("id") ?? "rpt-sar";
  const meta = reportMeta[reportId];

  if (!meta) {
    return (
      <div className="text-center py-20">
        <p className="text-[12px] text-muted-foreground">Report not found. <button onClick={() => router.push("/reports")} className="text-foreground font-semibold hover:underline">Back to reports</button></p>
      </div>
    );
  }

  return (
    <div className="space-y-5">
      {/* Header */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <button onClick={() => router.push("/reports")} className="flex items-center gap-1 text-[11px] font-medium text-muted-foreground hover:text-foreground transition-colors mb-2">
            <ArrowLeft className="h-3 w-3" /> Back to reports
          </button>
          <h1 className="text-lg font-bold tracking-tight">{meta.title}</h1>
          <p className="text-[11px] text-muted-foreground">{meta.subtitle} · {meta.period}</p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm" className="h-7 text-[10px] font-semibold gap-1.5"><Printer className="h-3 w-3" /> Print</Button>
          <Button variant="outline" size="sm" className="h-7 text-[10px] font-semibold gap-1.5"><Mail className="h-3 w-3" /> Email</Button>
          <Button variant="outline" size="sm" className="h-7 text-[10px] font-semibold gap-1.5"><Share2 className="h-3 w-3" /> Share</Button>
          <Button size="sm" className="h-7 text-[10px] font-semibold gap-1.5"><Download className="h-3 w-3" /> Export PDF</Button>
        </div>
      </div>

      {/* Report selector */}
      <div className="flex gap-1">
        {Object.entries(reportMeta).map(([id, m]) => (
          <button
            key={id}
            onClick={() => router.push(`/reports/viewer?id=${id}`)}
            className={cn("px-3 py-1.5 text-[10px] font-bold rounded transition-colors", reportId === id ? "bg-foreground text-background" : "text-muted-foreground hover:bg-muted/50")}
          >
            {m.title.split(" ").slice(0, 3).join(" ")}
          </button>
        ))}
      </div>

      {/* Document */}
      <ReportDocument reportId={reportId} />
    </div>
  );
}

export default function ReportViewerPage() {
  return (
    <Suspense fallback={<div className="p-8 text-center text-muted-foreground text-sm">Loading report...</div>}>
      <ReportViewerContent />
    </Suspense>
  );
}
