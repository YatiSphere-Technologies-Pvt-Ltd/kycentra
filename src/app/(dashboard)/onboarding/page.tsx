"use client";

import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import {
  Plus, Users, Clock, CheckCircle2, AlertTriangle, Search,
  Filter, ChevronRight, Shield, Activity, FileText, Mail,
  ArrowUpRight, ArrowDownRight, Minus, XCircle, RefreshCw,
  Building, Globe, Calendar, TrendingUp, Eye, MessageSquare,
  Download, MoreHorizontal,
} from "lucide-react";
import { useState, Fragment } from "react";

/* ─── Types & Data ─── */

interface Onboarding {
  id: string;
  entity: string;
  type: "Corporate" | "Individual" | "Fund" | "Trust";
  jurisdiction: string;
  flag: string;
  ddLevel: "SDD" | "CDD" | "EDD" | "EDD+";
  stage: string;
  stageNum: number;
  progress: number;
  risk: "low" | "medium" | "high" | "critical";
  rm: { name: string; initials: string };
  analyst: { name: string; initials: string } | null;
  client: { name: string; email: string; status: "online" | "offline" | "pending_invite"; lastActivity: string };
  started: string;
  elapsed: string;
  sla: { target: string; remaining: string; status: "ok" | "warn" | "breach" };
  docs: { received: number; required: number; issues: number; expiring: number };
  screening: { status: "clear" | "pending" | "alert" | "not_started"; alerts: number; autoResolved: number };
  ubo: { discovered: number; verified: number; pepFlags: number };
  aiPrefill: number;
  lastAgentAction: string;
  blockers: string[];
  products: string[];
  priority: number;
}

const onboardings: Onboarding[] = [
  {
    id: "ONB-2026-0184", entity: "Helios Asset Management GmbH", type: "Corporate",
    jurisdiction: "Germany", flag: "🇩🇪", ddLevel: "CDD",
    stage: "Data Collection", stageNum: 2, progress: 47, risk: "low",
    rm: { name: "James Park", initials: "JP" },
    analyst: { name: "Sarah Chen", initials: "SC" },
    client: { name: "Thomas Weber", email: "t.weber@helios-am.de", status: "online", lastActivity: "Active now" },
    started: "Today, 08:30", elapsed: "5.2h",
    sla: { target: "8h", remaining: "2.8h", status: "ok" },
    docs: { received: 5, required: 9, issues: 0, expiring: 0 },
    screening: { status: "clear", alerts: 0, autoResolved: 2 },
    ubo: { discovered: 3, verified: 1, pepFlags: 0 },
    aiPrefill: 78, lastAgentAction: "Entity Agent pre-filled 5 fields from Handelsregister",
    blockers: ["Waiting for UBO passport copies (2 remaining)"],
    products: ["Fund Administration", "Custody"],
    priority: 3,
  },
  {
    id: "ONB-2026-0183", entity: "Nordic Wealth Partners AS", type: "Fund",
    jurisdiction: "Norway", flag: "🇳🇴", ddLevel: "CDD",
    stage: "Verification", stageNum: 3, progress: 72, risk: "medium",
    rm: { name: "Sarah Chen", initials: "SC" },
    analyst: { name: "Maria Lopez", initials: "ML" },
    client: { name: "Erik Olsen", email: "e.olsen@nordicwp.no", status: "offline", lastActivity: "2h ago" },
    started: "Yesterday, 14:15", elapsed: "22h",
    sla: { target: "24h", remaining: "2h", status: "warn" },
    docs: { received: 8, required: 10, issues: 1, expiring: 0 },
    screening: { status: "pending", alerts: 1, autoResolved: 4 },
    ubo: { discovered: 2, verified: 2, pepFlags: 0 },
    aiPrefill: 65, lastAgentAction: "Document Agent flagged date mismatch on registration cert",
    blockers: ["Document discrepancy needs review", "Client offline — last seen 2h ago"],
    products: ["Prime Brokerage"],
    priority: 1,
  },
  {
    id: "ONB-2026-0182", entity: "Swiss Crypto Ventures AG", type: "Corporate",
    jurisdiction: "Switzerland", flag: "🇨🇭", ddLevel: "EDD",
    stage: "Data Collection", stageNum: 2, progress: 23, risk: "high",
    rm: { name: "Maria Lopez", initials: "ML" },
    analyst: { name: "David Kim", initials: "DK" },
    client: { name: "Marc Zeller", email: "m.zeller@swisscv.ch", status: "online", lastActivity: "Active now" },
    started: "Today, 10:00", elapsed: "3.5h",
    sla: { target: "48h", remaining: "44.5h", status: "ok" },
    docs: { received: 2, required: 14, issues: 0, expiring: 0 },
    screening: { status: "not_started", alerts: 0, autoResolved: 0 },
    ubo: { discovered: 0, verified: 0, pepFlags: 0 },
    aiPrefill: 42, lastAgentAction: "Regulatory Agent mapped FINMA requirements (14 docs needed)",
    blockers: ["High-risk jurisdiction — EDD required", "VASP classification pending"],
    products: ["Custody", "Trading"],
    priority: 2,
  },
  {
    id: "ONB-2026-0181", entity: "Apex Trading Group Ltd", type: "Corporate",
    jurisdiction: "United Kingdom", flag: "🇬🇧", ddLevel: "CDD",
    stage: "Screening", stageNum: 4, progress: 85, risk: "medium",
    rm: { name: "David Kim", initials: "DK" },
    analyst: { name: "Sarah Chen", initials: "SC" },
    client: { name: "Jonathan Wells", email: "j.wells@apextg.co.uk", status: "offline", lastActivity: "1d ago" },
    started: "Mar 21, 09:00", elapsed: "2.5d",
    sla: { target: "5d", remaining: "2.5d", status: "ok" },
    docs: { received: 11, required: 11, issues: 0, expiring: 1 },
    screening: { status: "alert", alerts: 2, autoResolved: 5 },
    ubo: { discovered: 2, verified: 2, pepFlags: 1 },
    aiPrefill: 81, lastAgentAction: "Screening Agent: 2 alerts need review (PEP match, adverse media)",
    blockers: ["2 screening alerts pending analyst review", "PEP association detected in UBO chain"],
    products: ["Trading", "Clearing"],
    priority: 1,
  },
  {
    id: "ONB-2026-0180", entity: "Sakura Financial Services KK", type: "Corporate",
    jurisdiction: "Japan", flag: "🇯🇵", ddLevel: "CDD",
    stage: "Risk Assessment", stageNum: 5, progress: 91, risk: "low",
    rm: { name: "Sarah Chen", initials: "SC" },
    analyst: null,
    client: { name: "Yuki Tanaka", email: "y.tanaka@sakura-fs.jp", status: "offline", lastActivity: "1d ago" },
    started: "Mar 20, 11:30", elapsed: "3d",
    sla: { target: "5d", remaining: "2d", status: "ok" },
    docs: { received: 8, required: 8, issues: 0, expiring: 0 },
    screening: { status: "clear", alerts: 0, autoResolved: 3 },
    ubo: { discovered: 2, verified: 2, pepFlags: 0 },
    aiPrefill: 73, lastAgentAction: "Risk Agent scored entity at 28/100 (LOW) — recommending CDD",
    blockers: [],
    products: ["Fund Administration"],
    priority: 5,
  },
  {
    id: "ONB-2026-0179", entity: "Crown Bay Holdings Ltd", type: "Trust",
    jurisdiction: "Jersey", flag: "🇯🇪", ddLevel: "EDD+",
    stage: "Approval", stageNum: 6, progress: 95, risk: "high",
    rm: { name: "James Park", initials: "JP" },
    analyst: { name: "Sarah Chen", initials: "SC" },
    client: { name: "Elizabeth Wentworth", email: "e.w@crownbay.je", status: "pending_invite", lastActivity: "Invite sent" },
    started: "Mar 18, 09:00", elapsed: "5d",
    sla: { target: "7d", remaining: "2d", status: "warn" },
    docs: { received: 16, required: 16, issues: 0, expiring: 2 },
    screening: { status: "alert", alerts: 1, autoResolved: 8 },
    ubo: { discovered: 1, verified: 1, pepFlags: 1 },
    aiPrefill: 38, lastAgentAction: "Investigation Agent: PEP confirmed — EDD+ applied, MLRO approval required",
    blockers: ["PEP association — MLRO sign-off required", "2 documents expiring within 90 days"],
    products: ["Wealth Management"],
    priority: 1,
  },
  {
    id: "ONB-2026-0178", entity: "Pacific Rim Consolidated Holdings", type: "Corporate",
    jurisdiction: "Singapore", flag: "🇸🇬", ddLevel: "CDD",
    stage: "Data Collection", stageNum: 2, progress: 31, risk: "medium",
    rm: { name: "David Kim", initials: "DK" },
    analyst: null,
    client: { name: "Wei Liang", email: "w.liang@prcholdings.sg", status: "online", lastActivity: "Active now" },
    started: "Today, 07:00", elapsed: "6.5h",
    sla: { target: "24h", remaining: "17.5h", status: "ok" },
    docs: { received: 3, required: 10, issues: 0, expiring: 0 },
    screening: { status: "not_started", alerts: 0, autoResolved: 0 },
    ubo: { discovered: 4, verified: 0, pepFlags: 0 },
    aiPrefill: 69, lastAgentAction: "Entity Agent discovered 4 UBOs through ACRA registry query",
    blockers: ["UBO verification pending — 4 individuals identified"],
    products: ["Fund Administration", "Investor Services"],
    priority: 4,
  },
  {
    id: "ONB-2026-0177", entity: "Al-Rashid Financial Services LLC", type: "Corporate",
    jurisdiction: "UAE", flag: "🇦🇪", ddLevel: "EDD",
    stage: "Verification", stageNum: 3, progress: 58, risk: "high",
    rm: { name: "Maria Lopez", initials: "ML" },
    analyst: { name: "David Kim", initials: "DK" },
    client: { name: "Ahmed Al-Rashid", email: "a.alrashid@arfs.ae", status: "offline", lastActivity: "6h ago" },
    started: "Mar 22, 08:00", elapsed: "1.5d",
    sla: { target: "5d", remaining: "3.5d", status: "ok" },
    docs: { received: 7, required: 14, issues: 2, expiring: 0 },
    screening: { status: "pending", alerts: 3, autoResolved: 12 },
    ubo: { discovered: 3, verified: 1, pepFlags: 0 },
    aiPrefill: 52, lastAgentAction: "Document Agent found 2 issues: address proof expired, financial stmt mismatch",
    blockers: ["2 document issues need resolution", "High-risk jurisdiction — enhanced verification"],
    products: ["Trading", "Prime Brokerage"],
    priority: 2,
  },
];

const stages = ["Initiation", "Data Collection", "Verification", "Screening", "Risk Assessment", "Approval", "Activation"];

const ddStyle: Record<string, { bg: string; fg: string }> = {
  SDD: { bg: "var(--nx-emerald-50)", fg: "var(--nx-emerald-700)" },
  CDD: { bg: "var(--nx-neutral-100)", fg: "var(--nx-neutral-700)" },
  EDD: { bg: "var(--nx-amber-50)", fg: "var(--nx-amber-700)" },
  "EDD+": { bg: "var(--nx-rose-50)", fg: "var(--nx-rose-700)" },
};

const riskColor: Record<string, string> = {
  low: "var(--nx-emerald-600)", medium: "var(--nx-amber-600)", high: "var(--nx-rose-600)", critical: "var(--nx-rose-800)",
};

const scrnStyle: Record<string, { color: string; label: string }> = {
  clear: { color: "var(--nx-emerald-600)", label: "Clear" },
  pending: { color: "var(--nx-amber-600)", label: "Pending" },
  alert: { color: "var(--nx-rose-600)", label: "Alert" },
  not_started: { color: "var(--nx-neutral-400)", label: "Queued" },
};

/* ─── Page ─── */

export default function OnboardingQueuePage() {
  const router = useRouter();
  const [filterStage, setFilterStage] = useState("all");
  const [expandedId, setExpandedId] = useState<string | null>(null);

  const sorted = [...onboardings].sort((a, b) => a.priority - b.priority);
  const filtered = filterStage === "all" ? sorted : sorted.filter((o) => o.stage === filterStage);

  const totalBlockers = onboardings.reduce((s, o) => s + o.blockers.length, 0);
  const atRiskCount = onboardings.filter((o) => o.sla.status !== "ok").length;
  const avgPrefill = Math.round(onboardings.reduce((s, o) => s + o.aiPrefill, 0) / onboardings.length);
  const totalAlerts = onboardings.reduce((s, o) => s + o.screening.alerts, 0);
  const totalDocs = onboardings.reduce((s, o) => s + o.docs.received, 0);
  const totalDocsReq = onboardings.reduce((s, o) => s + o.docs.required, 0);

  return (
    <div className="space-y-5">
      {/* ─── Header ─── */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h1 className="text-lg font-bold tracking-tight">Client Onboarding</h1>
          <p className="text-[11px] text-muted-foreground mt-0.5">
            {onboardings.length} active · {atRiskCount} at risk · {totalBlockers} blockers
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm" className="h-7 text-[10px] font-semibold gap-1.5">
            <Download className="h-3 w-3" /> Export
          </Button>
          <Button size="sm" className="h-7 text-[10px] font-semibold gap-1.5">
            <Plus className="h-3 w-3" /> New Onboarding
          </Button>
        </div>
      </div>

      {/* ─── KPI Row ─── */}
      <div className="grid grid-cols-3 lg:grid-cols-6 gap-px bg-border rounded-lg overflow-hidden">
        {[
          { label: "Pipeline", value: String(onboardings.length), icon: Users, sub: "active onboardings" },
          { label: "Avg. Completion", value: "4.2h", icon: Clock, sub: "this month" },
          { label: "SLA At Risk", value: String(atRiskCount), icon: AlertTriangle, sub: atRiskCount > 0 ? "needs attention" : "all on track", warn: atRiskCount > 0 },
          { label: "Documents", value: `${totalDocs}/${totalDocsReq}`, icon: FileText, sub: `${totalDocsReq - totalDocs} outstanding` },
          { label: "Screening Alerts", value: String(totalAlerts), icon: Shield, sub: "across pipeline", warn: totalAlerts > 0 },
          { label: "AI Prefill Rate", value: `${avgPrefill}%`, icon: TrendingUp, sub: "avg. data automated" },
        ].map((kpi) => {
          const Icon = kpi.icon;
          return (
            <div key={kpi.label} className="bg-card p-3.5">
              <div className="flex items-center gap-1.5 mb-1.5">
                <Icon className="h-3 w-3 text-muted-foreground/40" />
                <span className="text-[9px] font-bold text-muted-foreground uppercase tracking-widest">{kpi.label}</span>
              </div>
              <div className={`text-[20px] font-extrabold tabular-nums tracking-tight ${kpi.warn ? "text-nx-amber-600" : ""}`}>{kpi.value}</div>
              <span className="text-[9px] text-muted-foreground/50">{kpi.sub}</span>
            </div>
          );
        })}
      </div>

      {/* ─── Stage Filter + Search ─── */}
      <div className="rounded-lg border border-border bg-card overflow-hidden">
        <div className="flex items-center justify-between px-4 py-2.5 border-b border-border gap-3">
          {/* Stage pills */}
          <div className="flex items-center gap-1 overflow-x-auto flex-1" style={{ scrollbarWidth: "none" }}>
            <button
              onClick={() => setFilterStage("all")}
              className={`shrink-0 px-2.5 py-1 text-[10px] font-bold rounded transition-colors ${
                filterStage === "all" ? "bg-foreground text-background" : "text-muted-foreground hover:bg-muted/50"
              }`}
            >
              All ({onboardings.length})
            </button>
            {stages.map((stage) => {
              const count = onboardings.filter((o) => o.stage === stage).length;
              if (count === 0) return null;
              return (
                <button
                  key={stage}
                  onClick={() => setFilterStage(stage)}
                  className={`shrink-0 px-2.5 py-1 text-[10px] font-bold rounded transition-colors ${
                    filterStage === stage ? "bg-foreground text-background" : "text-muted-foreground hover:bg-muted/50"
                  }`}
                >
                  {stage} ({count})
                </button>
              );
            })}
          </div>

          {/* Search */}
          <div className="relative w-52 shrink-0">
            <Search className="absolute left-2 top-1/2 h-3 w-3 -translate-y-1/2 text-muted-foreground/40" />
            <input
              type="text"
              placeholder="Search..."
              className="h-7 w-full rounded border border-border bg-muted/20 pl-7 pr-3 text-[11px] placeholder:text-muted-foreground/35 focus:outline-none focus:ring-1 focus:ring-foreground/20 transition-colors"
            />
          </div>
        </div>

        {/* ─── Table ─── */}
        <div className="overflow-x-auto">
          <table className="w-full text-[11px]">
            <thead>
              <tr className="border-b border-border bg-muted/20">
                {["Entity", "DD", "Stage / Progress", "Documents", "Screening", "UBOs", "SLA", "Team", ""].map((h) => (
                  <th key={h} className="text-left font-bold text-muted-foreground uppercase tracking-wider px-4 py-2 whitespace-nowrap">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {filtered.map((o) => {
                const dd = ddStyle[o.ddLevel];
                const scrn = scrnStyle[o.screening.status];
                const isExpanded = expandedId === o.id;

                return (
                  <Fragment key={o.id}>
                    {/* Main row */}
                    <tr
                      className="border-b border-border hover:bg-muted/15 transition-colors cursor-pointer group"
                      onClick={() => setExpandedId(isExpanded ? null : o.id)}
                    >
                      {/* Entity */}
                      <td className="px-4 py-3 max-w-56">
                        <div className="flex items-center gap-2">
                          <div className="h-1.5 w-1.5 rounded-full shrink-0" style={{ backgroundColor: riskColor[o.risk] }} />
                          <div className="min-w-0">
                            <div className="text-[12px] font-semibold truncate">{o.entity}</div>
                            <div className="flex items-center gap-1 text-muted-foreground mt-0.5">
                              <span>{o.flag}</span>
                              <span>{o.jurisdiction}</span>
                              <span className="text-muted-foreground/30">·</span>
                              <span>{o.type}</span>
                            </div>
                          </div>
                        </div>
                      </td>

                      {/* DD Level */}
                      <td className="px-4 py-3">
                        <span className="text-[10px] font-bold px-1.5 py-0.5 rounded" style={{ backgroundColor: dd.bg, color: dd.fg }}>
                          {o.ddLevel}
                        </span>
                      </td>

                      {/* Stage + Progress */}
                      <td className="px-4 py-3 min-w-36">
                        <div className="flex items-center gap-2 mb-1">
                          <span className="font-semibold">{o.stage}</span>
                          <span className="text-[9px] text-muted-foreground/50">{o.stageNum}/7</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <div className="flex-1 h-1 bg-muted rounded-full overflow-hidden max-w-24">
                            <div className="h-full bg-foreground rounded-full" style={{ width: `${o.progress}%` }} />
                          </div>
                          <span className="font-bold tabular-nums text-[10px] w-6 text-right">{o.progress}%</span>
                        </div>
                      </td>

                      {/* Documents */}
                      <td className="px-4 py-3">
                        <span className="tabular-nums font-semibold">{o.docs.received}/{o.docs.required}</span>
                        {o.docs.issues > 0 && (
                          <span className="ml-1 text-[9px] font-bold text-nx-rose-600">{o.docs.issues} issue{o.docs.issues > 1 ? "s" : ""}</span>
                        )}
                        {o.docs.expiring > 0 && (
                          <span className="ml-1 text-[9px] font-bold text-nx-amber-600">{o.docs.expiring} expiring</span>
                        )}
                      </td>

                      {/* Screening */}
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-1">
                          <span className="h-1.5 w-1.5 rounded-full" style={{ backgroundColor: scrn.color }} />
                          <span className="text-[10px] font-semibold" style={{ color: scrn.color }}>{scrn.label}</span>
                        </div>
                        {o.screening.alerts > 0 && (
                          <span className="text-[9px] text-nx-rose-600 font-bold">{o.screening.alerts} alert{o.screening.alerts > 1 ? "s" : ""}</span>
                        )}
                      </td>

                      {/* UBOs */}
                      <td className="px-4 py-3 tabular-nums">
                        <span className="font-semibold">{o.ubo.verified}/{o.ubo.discovered}</span>
                        <span className="text-[9px] text-muted-foreground ml-0.5">verified</span>
                        {o.ubo.pepFlags > 0 && (
                          <div className="text-[9px] font-bold text-nx-rose-600">PEP flagged</div>
                        )}
                      </td>

                      {/* SLA */}
                      <td className="px-4 py-3 tabular-nums">
                        <span className={`text-[11px] font-bold ${
                          o.sla.status === "warn" ? "text-nx-amber-600" : o.sla.status === "breach" ? "text-nx-rose-600" : ""
                        }`}>{o.elapsed}</span>
                        <span className="text-muted-foreground/40"> / {o.sla.target}</span>
                        <div className="text-[9px] text-muted-foreground/50">{o.sla.remaining} left</div>
                      </td>

                      {/* Team */}
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-1">
                          <div className="h-5 w-5 rounded-full bg-foreground/10 flex items-center justify-center">
                            <span className="text-[8px] font-bold">{o.rm.initials}</span>
                          </div>
                          {o.analyst && (
                            <div className="h-5 w-5 rounded-full bg-foreground/10 flex items-center justify-center -ml-1.5">
                              <span className="text-[8px] font-bold">{o.analyst.initials}</span>
                            </div>
                          )}
                        </div>
                        <div className="flex items-center gap-1 mt-0.5">
                          <span className={`h-1.5 w-1.5 rounded-full ${
                            o.client.status === "online" ? "bg-nx-emerald-500" :
                            o.client.status === "pending_invite" ? "bg-nx-amber-500" : "bg-muted-foreground/30"
                          }`} />
                          <span className="text-[9px] text-muted-foreground">{o.client.name.split(" ")[0]}</span>
                        </div>
                      </td>

                      {/* Expand */}
                      <td className="px-4 py-3">
                        <ChevronRight className={`h-3.5 w-3.5 text-muted-foreground/30 group-hover:text-foreground transition-all ${isExpanded ? "rotate-90" : ""}`} />
                      </td>
                    </tr>

                    {/* ─── Expanded detail row ─── */}
                    {isExpanded && (
                      <tr className="border-b border-border bg-muted/10">
                        <td colSpan={9} className="px-4 py-0">
                          <div className="py-4 grid lg:grid-cols-12 gap-5">
                            {/* Left — Entity details + Blockers */}
                            <div className="lg:col-span-4 space-y-4">
                              {/* Entity info */}
                              <div>
                                <h4 className="text-[9px] font-bold text-muted-foreground uppercase tracking-widest mb-2">Entity Details</h4>
                                <div className="space-y-1.5 text-[11px]">
                                  <div className="flex justify-between"><span className="text-muted-foreground">ID</span><span className="font-mono font-medium">{o.id}</span></div>
                                  <div className="flex justify-between"><span className="text-muted-foreground">Type</span><span className="font-medium">{o.type}</span></div>
                                  <div className="flex justify-between"><span className="text-muted-foreground">Jurisdiction</span><span className="font-medium">{o.flag} {o.jurisdiction}</span></div>
                                  <div className="flex justify-between"><span className="text-muted-foreground">Products</span><span className="font-medium">{o.products.join(", ")}</span></div>
                                  <div className="flex justify-between"><span className="text-muted-foreground">Started</span><span className="font-medium tabular-nums">{o.started}</span></div>
                                  <div className="flex justify-between"><span className="text-muted-foreground">AI Prefill</span><span className="font-bold tabular-nums">{o.aiPrefill}%</span></div>
                                </div>
                              </div>

                              {/* Blockers */}
                              {o.blockers.length > 0 && (
                                <div>
                                  <h4 className="text-[9px] font-bold text-nx-amber-600 uppercase tracking-widest mb-2 flex items-center gap-1">
                                    <AlertTriangle className="h-2.5 w-2.5" /> Blockers ({o.blockers.length})
                                  </h4>
                                  <ul className="space-y-1">
                                    {o.blockers.map((b, i) => (
                                      <li key={i} className="text-[10px] text-muted-foreground flex items-start gap-1.5">
                                        <span className="text-nx-amber-500 mt-0.5">•</span>
                                        {b}
                                      </li>
                                    ))}
                                  </ul>
                                </div>
                              )}
                            </div>

                            {/* Middle — Client + Team */}
                            <div className="lg:col-span-4 space-y-4">
                              {/* Client contact */}
                              <div>
                                <h4 className="text-[9px] font-bold text-muted-foreground uppercase tracking-widest mb-2">Client Contact</h4>
                                <div className="flex items-center gap-3 p-2.5 rounded border border-border bg-card">
                                  <div className="h-8 w-8 rounded-full bg-foreground/5 flex items-center justify-center">
                                    <span className="text-[10px] font-bold">{o.client.name.split(" ").map(n => n[0]).join("")}</span>
                                  </div>
                                  <div className="flex-1 min-w-0">
                                    <div className="text-[12px] font-semibold">{o.client.name}</div>
                                    <div className="text-[10px] text-muted-foreground truncate">{o.client.email}</div>
                                  </div>
                                  <div className="flex items-center gap-1 shrink-0">
                                    <span className={`h-1.5 w-1.5 rounded-full ${
                                      o.client.status === "online" ? "bg-nx-emerald-500" :
                                      o.client.status === "pending_invite" ? "bg-nx-amber-500" : "bg-muted-foreground/30"
                                    }`} />
                                    <span className="text-[9px] text-muted-foreground">{o.client.lastActivity}</span>
                                  </div>
                                </div>
                              </div>

                              {/* Team */}
                              <div>
                                <h4 className="text-[9px] font-bold text-muted-foreground uppercase tracking-widest mb-2">Assigned Team</h4>
                                <div className="space-y-1.5 text-[11px]">
                                  <div className="flex justify-between">
                                    <span className="text-muted-foreground">Relationship Manager</span>
                                    <span className="font-medium">{o.rm.name}</span>
                                  </div>
                                  <div className="flex justify-between">
                                    <span className="text-muted-foreground">Compliance Analyst</span>
                                    <span className="font-medium">{o.analyst?.name ?? "Unassigned"}</span>
                                  </div>
                                </div>
                              </div>

                              {/* Last agent action */}
                              <div>
                                <h4 className="text-[9px] font-bold text-muted-foreground uppercase tracking-widest mb-2">Last AI Agent Action</h4>
                                <p className="text-[10px] text-muted-foreground leading-relaxed">{o.lastAgentAction}</p>
                              </div>
                            </div>

                            {/* Right — Actions */}
                            <div className="lg:col-span-4 space-y-3">
                              <h4 className="text-[9px] font-bold text-muted-foreground uppercase tracking-widest mb-1">Quick Actions</h4>

                              <div className="grid grid-cols-2 gap-2">
                                <Button variant="outline" size="sm" className="h-8 text-[10px] font-semibold gap-1.5 justify-start" onClick={(e) => { e.stopPropagation(); router.push(`/onboarding/${o.id}`); }}>
                                  <Eye className="h-3 w-3" /> Open Detail
                                </Button>
                                <Button variant="outline" size="sm" className="h-8 text-[10px] font-semibold gap-1.5 justify-start">
                                  <Mail className="h-3 w-3" /> Send Reminder
                                </Button>
                                <Button variant="outline" size="sm" className="h-8 text-[10px] font-semibold gap-1.5 justify-start">
                                  <MessageSquare className="h-3 w-3" /> Message Client
                                </Button>
                                <Button variant="outline" size="sm" className="h-8 text-[10px] font-semibold gap-1.5 justify-start">
                                  <FileText className="h-3 w-3" /> Request Docs
                                </Button>
                                <Button variant="outline" size="sm" className="h-8 text-[10px] font-semibold gap-1.5 justify-start">
                                  <Users className="h-3 w-3" /> Reassign
                                </Button>
                                <Button variant="outline" size="sm" className="h-8 text-[10px] font-semibold gap-1.5 justify-start">
                                  <Shield className="h-3 w-3" /> Run Screening
                                </Button>
                              </div>

                              {/* Stage pipeline mini */}
                              <div className="pt-2">
                                <h4 className="text-[9px] font-bold text-muted-foreground uppercase tracking-widest mb-2">Stage Progress</h4>
                                <div className="flex items-center gap-0.5">
                                  {stages.map((s, i) => (
                                    <div key={s} className="flex-1 group/step" title={s}>
                                      <div
                                        className="h-1.5 rounded-sm"
                                        style={{
                                          backgroundColor: i + 1 < o.stageNum
                                            ? "var(--nx-emerald-500)"
                                            : i + 1 === o.stageNum
                                            ? "var(--foreground)"
                                            : "var(--nx-neutral-200)"
                                        }}
                                      />
                                      <span className="text-[7px] text-muted-foreground/40 block mt-0.5 truncate">{s}</span>
                                    </div>
                                  ))}
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
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between px-4 py-2.5 border-t border-border text-[10px] text-muted-foreground">
          <span>{filtered.length} onboardings shown · Sorted by priority</span>
          <span>Avg AI prefill: <strong className="text-foreground">{avgPrefill}%</strong> · Completed MTD: <strong className="text-foreground">34</strong></span>
        </div>
      </div>

      {/* ─── Pipeline Stage Distribution ─── */}
      <div className="grid grid-cols-7 gap-px bg-border rounded-lg overflow-hidden">
        {stages.map((stage, i) => {
          const count = onboardings.filter((o) => o.stageNum === i + 1).length;
          const hasBlockers = onboardings.filter((o) => o.stageNum === i + 1 && o.blockers.length > 0).length;
          return (
            <button
              key={stage}
              onClick={() => setFilterStage(count > 0 ? stage : "all")}
              className="bg-card p-3 text-center hover:bg-muted/30 transition-colors"
            >
              <div className="text-[18px] font-extrabold tabular-nums">{count}</div>
              <div className="text-[8px] font-bold text-muted-foreground uppercase tracking-widest mt-0.5 leading-tight">{stage}</div>
              {hasBlockers > 0 && (
                <div className="text-[8px] font-bold text-nx-amber-600 mt-0.5">{hasBlockers} blocked</div>
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
}
