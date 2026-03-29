"use client";

import { useState, Fragment } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { ConfidenceBadge } from "@/components/shared";
import { riskStyles, caseStatusStyles } from "@/lib/styles";
import {
  Plus, Search, FileText, Shield, ChevronRight, Clock,
  CheckCircle2, AlertTriangle, Users, Eye, ArrowUpRight,
  Download, Activity,
} from "lucide-react";

/* ─── Types & Data ─── */

interface Case {
  id: string;
  entity: string;
  entityId: string;
  type: "SAR" | "Screening" | "EDD" | "PEP" | "Transaction" | "Periodic Review";
  risk: "critical" | "high" | "medium" | "low";
  status: "Open" | "In Progress" | "Pending Review" | "Escalated" | "SAR Filed" | "Closed";
  assignee: { name: string; initials: string };
  priority: number;
  opened: string;
  elapsed: string;
  sla: string;
  slaStatus: "ok" | "warn" | "breach";
  triggers: string;
  aiSummary: string;
  aiConfidence: number;
  evidenceItems: number;
  lastAction: string;
}

const cases: Case[] = [
  { id: "FC-2026-0847", entity: "Horizon Trading LLC", entityId: "ENT-HT-003", type: "SAR", risk: "high", status: "Pending Review", assignee: { name: "Sarah Chen", initials: "SC" }, priority: 1, opened: "Mar 22", elapsed: "1.5d", sla: "30d", slaStatus: "ok", triggers: "OFAC match + PEP association", aiSummary: "SAR narrative v2 drafted. 9 evidence items assembled. Ready for analyst review.", aiConfidence: 78, evidenceItems: 9, lastAction: "Investigation Agent completed SAR draft v2" },
  { id: "FC-2026-0842", entity: "Volkov Intl. Trading Co.", entityId: "ENT-VIT-001", type: "Screening", risk: "critical", status: "In Progress", assignee: { name: "James Park", initials: "JP" }, priority: 1, opened: "Mar 23", elapsed: "6h", sla: "7d", slaStatus: "ok", triggers: "OFAC SDN match (82%)", aiSummary: "Strong name and jurisdiction overlap. Registration numbers differ. Manual registry verification needed.", aiConfidence: 42, evidenceItems: 5, lastAction: "Screening Agent escalated — confidence below threshold" },
  { id: "FC-2026-0839", entity: "Meridian Capital Partners", entityId: "ENT-2019-MC-8847", type: "EDD", risk: "high", status: "In Progress", assignee: { name: "Sarah Chen", initials: "SC" }, priority: 2, opened: "Mar 20", elapsed: "3d", sla: "14d", slaStatus: "ok", triggers: "PEP association in UBO chain", aiSummary: "Elizabeth Wentworth confirmed PEP L2. Crown Bay Trust adds opacity. EDD review in progress.", aiConfidence: 88, evidenceItems: 12, lastAction: "Risk Agent recalculated score: 58→72" },
  { id: "FC-2026-0835", entity: "Nordic Shipping Consortium", entityId: "ENT-NSC-011", type: "PEP", risk: "medium", status: "Escalated", assignee: { name: "Maria Lopez", initials: "ML" }, priority: 2, opened: "Mar 18", elapsed: "5d", sla: "14d", slaStatus: "warn", triggers: "PEP association detected in director network", aiSummary: "Director linked to former government official. Relationship deemed incidental. Awaiting MLRO review.", aiConfidence: 71, evidenceItems: 7, lastAction: "Escalated to MLRO for final determination" },
  { id: "FC-2026-0831", entity: "Evergreen Pacific Fund III", entityId: "ENT-EPF-012", type: "SAR", risk: "medium", status: "Pending Review", assignee: { name: "David Kim", initials: "DK" }, priority: 3, opened: "Mar 15", elapsed: "8d", sla: "30d", slaStatus: "ok", triggers: "Unusual transaction pattern", aiSummary: "Round-trip transactions detected between 3 related entities. Total value $2.4M over 6 months.", aiConfidence: 65, evidenceItems: 14, lastAction: "Behavioral Analytics flagged pattern" },
  { id: "FC-2026-0828", entity: "Swiss Crypto Ventures AG", entityId: "ENT-SCV-013", type: "EDD", risk: "high", status: "Open", assignee: { name: "David Kim", initials: "DK" }, priority: 2, opened: "Mar 23", elapsed: "4h", sla: "14d", slaStatus: "ok", triggers: "VASP classification + high-risk jurisdiction", aiSummary: "Crypto-related entity in Switzerland. FINMA requirements mapped. 14 docs required for EDD.", aiConfidence: 82, evidenceItems: 3, lastAction: "Regulatory Agent mapped FINMA requirements" },
  { id: "FC-2026-0824", entity: "Al-Rashid Construction", entityId: "ENT-ARC-003", type: "Screening", risk: "high", status: "In Progress", assignee: { name: "Maria Lopez", initials: "ML" }, priority: 2, opened: "Mar 22", elapsed: "1.5d", sla: "7d", slaStatus: "ok", triggers: "Adverse media — corruption investigation mention", aiSummary: "Entity mentioned as witness, not subject. Article is investigative/factual. Likely noise but high-risk jurisdiction.", aiConfidence: 78, evidenceItems: 4, lastAction: "Media Intelligence provided article analysis" },
  { id: "FC-2026-0820", entity: "Crown Bay Holdings Ltd", entityId: "ENT-CBH-014", type: "PEP", risk: "high", status: "SAR Filed", assignee: { name: "Sarah Chen", initials: "SC" }, priority: 4, opened: "Mar 10", elapsed: "13d", sla: "30d", slaStatus: "ok", triggers: "PEP confirmed — former UK official", aiSummary: "SAR filed with FinCEN. Enhanced monitoring activated. Relationship continues under EDD.", aiConfidence: 94, evidenceItems: 16, lastAction: "SAR-2026-0011 filed successfully" },
  { id: "FC-2026-0815", entity: "Pacific Rim Holdings", entityId: "ENT-PRH-004", type: "Periodic Review", risk: "medium", status: "Closed", assignee: { name: "David Kim", initials: "DK" }, priority: 5, opened: "Mar 5", elapsed: "12d", sla: "14d", slaStatus: "ok", triggers: "Annual review — risk reassessment", aiSummary: "No material changes. Risk maintained at Medium. CDD refresh complete.", aiConfidence: 92, evidenceItems: 8, lastAction: "Review signed off by analyst" },
];

const typeStyle: Record<string, { bg: string; fg: string }> = {
  SAR: { bg: "var(--nx-rose-50)", fg: "var(--nx-rose-700)" },
  Screening: { bg: "var(--nx-neutral-100)", fg: "var(--nx-neutral-700)" },
  EDD: { bg: "var(--nx-amber-50)", fg: "var(--nx-amber-700)" },
  PEP: { bg: "var(--nx-amber-50)", fg: "var(--nx-amber-700)" },
  Transaction: { bg: "var(--nx-neutral-100)", fg: "var(--nx-neutral-600)" },
  "Periodic Review": { bg: "var(--nx-neutral-100)", fg: "var(--nx-neutral-500)" },
};

/* ─── Page ─── */

export default function CasesPage() {
  const router = useRouter();
  const [filterStatus, setFilterStatus] = useState("all");
  const [filterType, setFilterType] = useState("all");
  const [expandedCase, setExpandedCase] = useState<string | null>(null);

  const statuses = [...new Set(cases.map((c) => c.status))];
  const types = [...new Set(cases.map((c) => c.type))];
  const openCount = cases.filter((c) => !["Closed", "SAR Filed"].includes(c.status)).length;
  const criticalCount = cases.filter((c) => c.risk === "critical" || c.risk === "high").length;
  const pendingReview = cases.filter((c) => c.status === "Pending Review").length;
  const escalated = cases.filter((c) => c.status === "Escalated").length;

  const filtered = cases.filter((c) => {
    if (filterStatus !== "all" && c.status !== filterStatus) return false;
    if (filterType !== "all" && c.type !== filterType) return false;
    return true;
  });

  return (
    <div className="space-y-5">
      {/* ─── Header ─── */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h1 className="text-lg font-bold tracking-tight">Cases & Investigations</h1>
          <p className="text-[11px] text-muted-foreground mt-0.5">
            {cases.length} total · {openCount} open · {pendingReview} pending review · {escalated} escalated
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm" className="h-7 text-[10px] font-semibold gap-1.5"><Download className="h-3 w-3" /> Export</Button>
          <Button size="sm" className="h-7 text-[10px] font-semibold gap-1.5" onClick={() => router.push("/cases/new")}>
            <Plus className="h-3 w-3" /> Create Case
          </Button>
        </div>
      </div>

      {/* ─── KPIs ─── */}
      <div className="grid grid-cols-3 lg:grid-cols-6 gap-px bg-border rounded-lg overflow-hidden">
        {[
          { label: "Total Cases", value: String(cases.length) },
          { label: "Open", value: String(openCount) },
          { label: "High/Critical", value: String(criticalCount), warn: criticalCount > 0 },
          { label: "Pending Review", value: String(pendingReview), warn: pendingReview > 0 },
          { label: "Escalated", value: String(escalated), warn: escalated > 0 },
          { label: "SARs Filed (MTD)", value: String(cases.filter((c) => c.status === "SAR Filed").length) },
        ].map((kpi) => (
          <div key={kpi.label} className="bg-card p-3">
            <div className="text-[9px] font-bold text-muted-foreground uppercase tracking-widest mb-1">{kpi.label}</div>
            <div className={cn("text-[16px] font-extrabold tabular-nums tracking-tight", kpi.warn && "text-nx-amber-600")}>{kpi.value}</div>
          </div>
        ))}
      </div>

      {/* ─── Filters ─── */}
      <div className="rounded-lg border border-border bg-card overflow-hidden">
        <div className="flex items-center justify-between px-4 py-2.5 border-b border-border gap-3">
          <div className="flex items-center gap-1 overflow-x-auto flex-1" style={{ scrollbarWidth: "none" }}>
            <button onClick={() => setFilterStatus("all")} className={cn("shrink-0 px-2.5 py-1 text-[10px] font-bold rounded transition-colors", filterStatus === "all" ? "bg-foreground text-background" : "text-muted-foreground hover:bg-muted/50")}>All ({cases.length})</button>
            {statuses.map((s) => {
              const count = cases.filter((c) => c.status === s).length;
              return (
                <button key={s} onClick={() => setFilterStatus(filterStatus === s ? "all" : s)} className={cn("shrink-0 px-2.5 py-1 text-[10px] font-bold rounded transition-colors", filterStatus === s ? "bg-foreground text-background" : "text-muted-foreground hover:bg-muted/50")}>{s} ({count})</button>
              );
            })}
          </div>
          <select value={filterType} onChange={(e) => setFilterType(e.target.value)} className="h-7 rounded border border-border bg-background px-2 text-[10px] font-semibold shrink-0">
            <option value="all">All Types</option>
            {types.map((t) => <option key={t} value={t}>{t}</option>)}
          </select>
        </div>

        {/* ─── Case Table ─── */}
        <table className="w-full text-[11px]">
          <thead>
            <tr className="border-b border-border bg-muted/20">
              {["Case ID", "Entity", "Type", "Risk", "Status", "SLA", "Assignee", "AI Summary", "Evidence", ""].map((h) => (
                <th key={h} className="text-left font-bold text-muted-foreground uppercase tracking-wider px-3 py-2 whitespace-nowrap">{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {filtered.map((c) => {
              const risk = riskStyles[c.risk];
              const status = (caseStatusStyles as Record<string, { fg: string; bg: string; label: string }>)[c.status] ?? { fg: "var(--nx-neutral-500)", bg: "var(--nx-neutral-100)", label: c.status };
              const ts = typeStyle[c.type] ?? typeStyle.Screening;
              const isExpanded = expandedCase === c.id;

              return (
                <Fragment key={c.id}>
                  <tr
                    className={cn("border-b border-border cursor-pointer group transition-colors", isExpanded ? "bg-muted/15" : "hover:bg-muted/10")}
                    style={{ borderLeft: `3px solid ${risk.fg}` }}
                    onClick={() => setExpandedCase(isExpanded ? null : c.id)}
                  >
                    <td className="px-3 py-2.5">
                      <span className="font-mono text-[10px] font-semibold">{c.id}</span>
                    </td>
                    <td className="px-3 py-2.5 max-w-40">
                      <span className="text-[12px] font-semibold truncate block">{c.entity}</span>
                    </td>
                    <td className="px-3 py-2.5">
                      <span className="text-[9px] font-bold px-1.5 py-0.5 rounded" style={{ backgroundColor: ts.bg, color: ts.fg }}>{c.type}</span>
                    </td>
                    <td className="px-3 py-2.5">
                      <span className="text-[9px] font-bold uppercase" style={{ color: risk.fg }}>{risk.label}</span>
                    </td>
                    <td className="px-3 py-2.5">
                      <span className="text-[9px] font-bold px-1.5 py-0.5 rounded" style={{ color: status.fg, backgroundColor: status.bg }}>{status.label}</span>
                    </td>
                    <td className="px-3 py-2.5">
                      <span className={cn("tabular-nums font-bold text-[10px]", c.slaStatus === "warn" ? "text-nx-amber-600" : "text-muted-foreground")}>{c.elapsed}</span>
                      <span className="text-muted-foreground/40"> / {c.sla}</span>
                    </td>
                    <td className="px-3 py-2.5">
                      <div className="h-5 w-5 rounded-full bg-foreground/10 flex items-center justify-center text-[8px] font-bold" title={c.assignee.name}>{c.assignee.initials}</div>
                    </td>
                    <td className="px-3 py-2.5 max-w-48">
                      <span className="text-[10px] text-muted-foreground line-clamp-1">{c.aiSummary}</span>
                    </td>
                    <td className="px-3 py-2.5 tabular-nums font-medium">{c.evidenceItems}</td>
                    <td className="px-3 py-2.5">
                      <ChevronRight className={cn("h-3 w-3 text-muted-foreground/30 group-hover:text-foreground transition-all", isExpanded && "rotate-90")} />
                    </td>
                  </tr>

                  {/* ─── Expanded ─── */}
                  {isExpanded && (
                    <tr className="border-b border-border bg-muted/5">
                      <td colSpan={10} className="p-0">
                        <div className="grid lg:grid-cols-12 divide-y lg:divide-y-0 lg:divide-x divide-border">
                          {/* Left — Case details */}
                          <div className="lg:col-span-5 p-5 space-y-3">
                            <div>
                              <div className="text-[9px] font-bold text-muted-foreground uppercase tracking-widest mb-2">Case Details</div>
                              <div className="space-y-1.5 text-[11px]">
                                <div className="flex justify-between"><span className="text-muted-foreground">Case ID</span><span className="font-mono font-semibold">{c.id}</span></div>
                                <div className="flex justify-between"><span className="text-muted-foreground">Entity</span><span className="font-semibold">{c.entity}</span></div>
                                <div className="flex justify-between"><span className="text-muted-foreground">Type</span><span className="font-medium">{c.type}</span></div>
                                <div className="flex justify-between"><span className="text-muted-foreground">Opened</span><span className="tabular-nums">{c.opened}</span></div>
                                <div className="flex justify-between"><span className="text-muted-foreground">Elapsed</span><span className="font-bold tabular-nums">{c.elapsed}</span></div>
                                <div className="flex justify-between"><span className="text-muted-foreground">SLA</span><span className="tabular-nums">{c.sla}</span></div>
                                <div className="flex justify-between"><span className="text-muted-foreground">Triggers</span><span className="font-medium text-[10px]">{c.triggers}</span></div>
                                <div className="flex justify-between"><span className="text-muted-foreground">Assignee</span><span className="font-medium">{c.assignee.name}</span></div>
                                <div className="flex justify-between"><span className="text-muted-foreground">Evidence Items</span><span className="font-bold tabular-nums">{c.evidenceItems}</span></div>
                              </div>
                            </div>
                          </div>

                          {/* Middle — AI analysis */}
                          <div className="lg:col-span-4 p-5 space-y-3">
                            <div>
                              <div className="text-[9px] font-bold text-muted-foreground uppercase tracking-widest mb-2">AI Analysis</div>
                              <p className="text-[11px] text-muted-foreground leading-relaxed">{c.aiSummary}</p>
                              <div className="mt-2"><ConfidenceBadge value={c.aiConfidence} /></div>
                            </div>
                            <div>
                              <div className="text-[9px] font-bold text-muted-foreground uppercase tracking-widest mb-1">Last Action</div>
                              <p className="text-[10px] text-muted-foreground">{c.lastAction}</p>
                            </div>
                          </div>

                          {/* Right — Actions */}
                          <div className="lg:col-span-3 p-5 space-y-2">
                            <div className="text-[9px] font-bold text-muted-foreground uppercase tracking-widest mb-2">Actions</div>
                            <Button size="sm" className="w-full h-7 text-[10px] font-semibold gap-1.5 justify-start" onClick={(e) => { e.stopPropagation(); router.push(`/cases/${c.id}`); }}>
                              <Eye className="h-3 w-3" /> Open Investigation
                            </Button>
                            <Button variant="outline" size="sm" className="w-full h-7 text-[10px] font-semibold gap-1.5 justify-start" onClick={(e) => { e.stopPropagation(); router.push(`/entities/${c.entityId}`); }}>
                              <Activity className="h-3 w-3" /> Entity 360°
                            </Button>
                            <Button variant="outline" size="sm" className="w-full h-7 text-[10px] font-semibold gap-1.5 justify-start">
                              <Users className="h-3 w-3" /> Reassign
                            </Button>
                            <Button variant="outline" size="sm" className="w-full h-7 text-[10px] font-semibold gap-1.5 justify-start">
                              <ArrowUpRight className="h-3 w-3" /> Escalate
                            </Button>
                            {c.type === "SAR" && c.status !== "SAR Filed" && (
                              <Button variant="outline" size="sm" className="w-full h-7 text-[10px] font-semibold gap-1.5 justify-start text-nx-rose-600">
                                <FileText className="h-3 w-3" /> File SAR
                              </Button>
                            )}
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

        <div className="px-4 py-2.5 border-t border-border text-[10px] text-muted-foreground">
          {filtered.length} of {cases.length} cases · Sorted by priority
        </div>
      </div>
    </div>
  );
}
