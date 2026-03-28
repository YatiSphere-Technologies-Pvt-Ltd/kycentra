"use client";

import { useState, Fragment } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { cn } from "@/lib/utils";
import { RiskBadge, ConfidenceBadge } from "@/components/shared";
import { ComplianceStatusBadge, CDDLevelBadge, DocStatusIcon } from "@/components/shared/status-badge";
import {
  entity, beneficialOwners, pendingAlerts, documents, riskFactors, timeline, reviewHistory, screeningLists, riskNarrative,
} from "@/features/entity-detail/data/mock-data";
import {
  TabDocuments, TabScreening, TabRisk, TabOwnership, TabCases, TabActivity, TabReviews,
} from "@/features/entity-detail";
import { Button } from "@/components/ui/button";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import {
  ArrowLeft, ChevronDown, FileText, ShieldCheck, Activity, GitBranch, Briefcase, Clock, ClipboardCheck,
  AlertTriangle, CheckCircle2, Users, Building2, Shield, Sparkles, ExternalLink, Mail, Globe, Calendar,
  MoreHorizontal, Eye, ChevronRight, XCircle, ArrowUpRight,
} from "lucide-react";

/* ─── Helpers ─── */

const riskColor: Record<string, string> = {
  low: "var(--nx-emerald-600)", medium: "var(--nx-amber-600)", high: "var(--nx-rose-600)", critical: "var(--nx-rose-800)",
};

const tabs = [
  { id: "overview", label: "Overview" },
  { id: "documents", label: "Documents", count: documents.length },
  { id: "screening", label: "Screening", count: entity.openAlerts, warn: true },
  { id: "risk", label: "Risk" },
  { id: "ownership", label: "Ownership" },
  { id: "cases", label: "Cases", count: entity.activeCases },
  { id: "activity", label: "Activity" },
  { id: "reviews", label: "Reviews" },
] as const;

type TabId = (typeof tabs)[number]["id"];

/* ─── Page ─── */

export default function EntityDetailPage() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<TabId>("overview");

  const initials = entity.name.split(" ").map((w) => w[0]).join("").slice(0, 2).toUpperCase();
  const daysSinceReview = Math.round((Date.now() - new Date(entity.lastReviewed).getTime()) / (1000 * 60 * 60 * 24));
  const daysUntilDue = Math.round((new Date(entity.nextReviewDue).getTime() - Date.now()) / (1000 * 60 * 60 * 24));

  const verifiedDocs = documents.filter((d) => d.status === "verified").length;
  const issueDocs = documents.filter((d) => d.status === "issue" || d.status === "expiring").length;

  return (
    <div className="space-y-5">
      {/* ─── Header ─── */}
      <div>
        <button onClick={() => router.push("/entities")} className="flex items-center gap-1 text-[11px] font-medium text-muted-foreground hover:text-foreground transition-colors mb-3">
          <ArrowLeft className="h-3 w-3" /> Entities
        </button>

        <div className="flex flex-col gap-3 lg:flex-row lg:items-start lg:justify-between">
          <div className="flex items-center gap-3">
            <div className="h-9 w-9 rounded-lg bg-foreground/5 flex items-center justify-center text-[11px] font-bold shrink-0">{initials}</div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-lg font-bold tracking-tight">{entity.name}</h1>
              </div>
              <div className="flex items-center gap-2 mt-0.5 text-[11px] text-muted-foreground">
                <span className="font-mono">{entity.id}</span>
                <span>·</span>
                <span>🇰🇾 {entity.jurisdiction}</span>
                <span>·</span>
                <span>{entity.subType}</span>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2 shrink-0 flex-wrap">
            <RiskBadge tier={entity.riskTier} />
            <ComplianceStatusBadge status={entity.complianceStatus} />
            <CDDLevelBadge level={entity.cddLevel} />
            <DropdownMenu>
              <DropdownMenuTrigger render={<Button variant="outline" size="sm" className="h-7 text-[10px] font-semibold gap-1" />}>
                Actions <ChevronDown className="h-3 w-3" />
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-48">
                <DropdownMenuItem>Start Review</DropdownMenuItem>
                <DropdownMenuItem>Create Case</DropdownMenuItem>
                <DropdownMenuItem>Request Documents</DropdownMenuItem>
                <DropdownMenuItem>Escalate</DropdownMenuItem>
                <DropdownMenuItem>Export Profile</DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem className="text-destructive">Restrict Account</DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </div>

      {/* ─── KPI Strip ─── */}
      <div className="grid grid-cols-3 lg:grid-cols-7 gap-px bg-border rounded-lg overflow-hidden">
        {[
          { label: "Risk Score", value: `${entity.riskScore}/100`, warn: entity.riskScore >= 60 },
          { label: "AI Confidence", value: `${Math.round(entity.aiConfidence * 100)}%` },
          { label: "Open Alerts", value: String(entity.openAlerts), warn: entity.openAlerts > 0 },
          { label: "Active Cases", value: String(entity.activeCases) },
          { label: "Documents", value: `${verifiedDocs}/${documents.length}`, sub: issueDocs > 0 ? `${issueDocs} issue` : undefined },
          { label: "Last Review", value: `${daysSinceReview}d ago`, warn: daysSinceReview > 365 },
          { label: "Next Due", value: `${daysUntilDue}d`, warn: daysUntilDue <= 30 },
        ].map((kpi) => (
          <div key={kpi.label} className="bg-card p-3">
            <div className="text-[9px] font-bold text-muted-foreground uppercase tracking-widest mb-1">{kpi.label}</div>
            <div className={`text-[16px] font-extrabold tabular-nums tracking-tight ${kpi.warn ? "text-nx-amber-600" : ""}`}>{kpi.value}</div>
            {kpi.sub && <div className="text-[9px] font-bold text-nx-amber-600">{kpi.sub}</div>}
          </div>
        ))}
      </div>

      {/* ─── Tab Navigation ─── */}
      <div className="flex items-center gap-0.5 overflow-x-auto border-b border-border" style={{ scrollbarWidth: "none" }}>
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={cn(
              "px-3 py-2 text-[11px] font-semibold whitespace-nowrap border-b-2 transition-colors",
              activeTab === tab.id
                ? "border-foreground text-foreground"
                : "border-transparent text-muted-foreground hover:text-foreground"
            )}
          >
            {tab.label}
            {"count" in tab && tab.count > 0 && (
              <span className={cn(
                "ml-1.5 text-[9px] font-bold tabular-nums px-1 py-0.5 rounded",
                "warn" in tab && tab.warn ? "bg-nx-amber-50 text-nx-amber-700" : "bg-muted text-muted-foreground"
              )}>
                {tab.count}
              </span>
            )}
          </button>
        ))}
      </div>

      {/* ─── Tab Content ─── */}
      {activeTab === "overview" && (
        <div className="space-y-5">
          {/* ── Pending Actions Table ── */}
          {pendingAlerts.length > 0 && (
            <div className="rounded-lg border border-border bg-card overflow-hidden">
              <div className="flex items-center justify-between px-4 py-2.5 border-b border-border bg-nx-amber-50/50">
                <div className="flex items-center gap-2">
                  <AlertTriangle className="h-3.5 w-3.5 text-nx-amber-600" />
                  <span className="text-[12px] font-bold">Requires Attention</span>
                  <span className="flex h-4.5 min-w-4.5 items-center justify-center rounded bg-foreground px-1 text-[9px] font-bold text-background tabular-nums">5</span>
                </div>
                <Button size="sm" className="h-6 text-[9px] font-semibold gap-1">
                  <CheckCircle2 className="h-2.5 w-2.5" /> Approve All High-Confidence
                </Button>
              </div>
              <table className="w-full text-[11px]">
                <thead>
                  <tr className="border-b border-border bg-muted/20">
                    {["Priority", "Source", "Type", "Description", "AI Recommendation", "Confidence", "Pending", ""].map((h) => (
                      <th key={h} className="text-left font-bold text-muted-foreground uppercase tracking-wider px-4 py-2 whitespace-nowrap">{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-border">
                  {[
                    { priority: "critical", source: "Screening", type: "OFAC SDN Match", desc: "Name and jurisdiction overlap with SDN #18847", aiRec: "Likely true match — IDs differ, manual registry check needed", conf: 42, pending: "45m", action: "Review", actionVariant: "outline" as const },
                    { priority: "high", source: "Screening", type: "PEP Confirmation", desc: "Elizabeth Wentworth — close associate of former UK Cabinet member", aiRec: "True match confirmed. PEP Level 2. EDD required.", conf: 94, pending: "2h", action: "Confirm", actionVariant: "default" as const },
                    { priority: "medium", source: "Screening", type: "Adverse Media", desc: "Mentioned in FT article about offshore fund structures", aiRec: "Informational article — entity not subject of allegations. Noise.", conf: 78, pending: "17h", action: "Dismiss", actionVariant: "default" as const },
                    { priority: "high", source: "Risk Agent", type: "Risk Elevation", desc: "Risk score changed 58→72 due to PEP association in UBO chain", aiRec: "Elevation justified. Recommend EDD upgrade.", conf: 88, pending: "2h", action: "Approve", actionVariant: "default" as const },
                    { priority: "medium", source: "Document", type: "Data Discrepancy", desc: "Certificate of incorporation: date shows Mar 15, registry shows Mar 14", aiRec: "Likely filing vs. effective date. Administrative difference. Low risk.", conf: 78, pending: "1.5h", action: "Approve", actionVariant: "default" as const },
                  ].map((item) => (
                    <tr key={item.type} className="hover:bg-muted/10 transition-colors" style={{ borderLeft: `3px solid ${riskColor[item.priority] ?? "var(--nx-neutral-400)"}` }}>
                      <td className="px-4 py-2.5">
                        <span className="text-[9px] font-bold uppercase" style={{ color: riskColor[item.priority] }}>
                          {item.priority}
                        </span>
                      </td>
                      <td className="px-4 py-2.5">
                        <span className="text-[10px] font-bold text-muted-foreground">{item.source}</span>
                      </td>
                      <td className="px-4 py-2.5">
                        <span className="font-semibold">{item.type}</span>
                      </td>
                      <td className="px-4 py-2.5 max-w-56">
                        <span className="text-muted-foreground">{item.desc}</span>
                      </td>
                      <td className="px-4 py-2.5 max-w-48">
                        <span className="text-[10px] text-muted-foreground italic">{item.aiRec}</span>
                      </td>
                      <td className="px-4 py-2.5">
                        <ConfidenceBadge value={item.conf} />
                      </td>
                      <td className="px-4 py-2.5">
                        <span className={cn("font-bold tabular-nums", item.pending.includes("h") && parseInt(item.pending) >= 4 ? "text-nx-amber-600" : "text-muted-foreground")}>{item.pending}</span>
                      </td>
                      <td className="px-4 py-2.5">
                        <Button size="sm" variant={item.actionVariant} className="h-6 px-2.5 text-[9px] font-semibold">{item.action}</Button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          {/* ── AI Executive Summary — structured for instant scanning ── */}
          <div className="rounded-lg border border-border bg-card overflow-hidden">
            <div className="flex items-center justify-between px-4 py-2.5 border-b border-border">
              <div className="flex items-center gap-2">
                <Sparkles className="h-3.5 w-3.5 text-muted-foreground/40" />
                <span className="text-[12px] font-bold">AI Executive Summary</span>
                <ConfidenceBadge value={78} />
              </div>
              <span className="text-[9px] text-muted-foreground">All 6 agents · Updated 2h ago</span>
            </div>

            <div className="grid lg:grid-cols-12 divide-y lg:divide-y-0 lg:divide-x divide-border">
              {/* Left — Verdict + Recommendation (4 cols) */}
              <div className="lg:col-span-4 p-4">
                <div className="text-[9px] font-bold text-muted-foreground uppercase tracking-widest mb-2">Overall Assessment</div>
                <div className="flex items-center gap-2 mb-3">
                  <span className="text-[9px] font-bold uppercase tracking-wider text-nx-amber-700 bg-nx-amber-50 px-1.5 py-0.5 rounded">Elevated Risk</span>
                  <span className="text-[9px] font-bold uppercase tracking-wider bg-muted px-1.5 py-0.5 rounded">EDD Required</span>
                </div>
                <div className="p-3 rounded bg-muted/30 border border-border">
                  <div className="text-[9px] font-bold text-muted-foreground uppercase tracking-widest mb-1">Recommendation</div>
                  <p className="text-[11px] font-semibold leading-relaxed">
                    Resolve OFAC match first. If false positive, proceed with EDD review for PEP association.
                  </p>
                </div>
              </div>

              {/* Middle — Key Concerns (5 cols) */}
              <div className="lg:col-span-5 p-4">
                <div className="text-[9px] font-bold text-muted-foreground uppercase tracking-widest mb-2">Key Concerns</div>
                <div className="space-y-2">
                  {[
                    { severity: "critical" as const, finding: "OFAC screening match pending — name and jurisdiction overlap with SDN #18847, registration numbers differ", agent: "Screening Agent", conf: 42, needsReview: true },
                    { severity: "high" as const, finding: "PEP association — Elizabeth Wentworth (25% UBO via Crown Bay Trust, Jersey) is a close associate of former UK Cabinet member", agent: "Screening Agent", conf: 96 },
                    { severity: "medium" as const, finding: "Complex 5-layer ownership structure across 4 jurisdictions (KY, NL, SG, JE, JP)", agent: "Entity Agent", conf: 96 },
                  ].map((item, i) => (
                    <div key={i} className="flex gap-2.5" style={{ borderLeft: `2px solid ${riskColor[item.severity]}`, paddingLeft: "8px" }}>
                      <div className="flex-1 min-w-0">
                        <p className="text-[11px] leading-snug">{item.finding}</p>
                        <div className="flex items-center gap-2 mt-1">
                          <span className="text-[9px] font-bold text-muted-foreground">{item.agent}</span>
                          <ConfidenceBadge value={item.conf} />
                          {item.needsReview && <span className="text-[8px] font-bold text-nx-amber-700 bg-nx-amber-50 px-1 py-0.5 rounded uppercase">Needs Review</span>}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Right — Mitigating Factors (3 cols) */}
              <div className="lg:col-span-3 p-4">
                <div className="text-[9px] font-bold text-muted-foreground uppercase tracking-widest mb-2">Mitigating Factors</div>
                <div className="space-y-2">
                  {[
                    { finding: "Transaction patterns consistent with stated fund administration business", agent: "Risk Agent", conf: 91 },
                    { finding: "All primary documents verified and validated", agent: "Document Agent", conf: 97 },
                    { finding: "No adverse media allegations — only informational mentions", agent: "Screening Agent", conf: 78 },
                  ].map((item, i) => (
                    <div key={i} className="flex gap-2.5" style={{ borderLeft: "2px solid var(--nx-emerald-500)", paddingLeft: "8px" }}>
                      <div className="flex-1 min-w-0">
                        <p className="text-[10px] text-muted-foreground leading-snug">{item.finding}</p>
                        <div className="flex items-center gap-2 mt-1">
                          <span className="text-[9px] font-bold text-muted-foreground/60">{item.agent}</span>
                          <ConfidenceBadge value={item.conf} />
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* ── Two-column: Entity Profile + Risk & Compliance ── */}
          <div className="grid gap-5 lg:grid-cols-12">
            {/* Entity Profile — 8 cols */}
            <div className="lg:col-span-8 rounded-lg border border-border bg-card overflow-hidden">
              <div className="flex items-center justify-between px-4 py-2.5 border-b border-border">
                <div className="flex items-center gap-2">
                  <Building2 className="h-3.5 w-3.5 text-muted-foreground/40" />
                  <span className="text-[12px] font-bold">Entity Profile</span>
                </div>
                <Button variant="ghost" size="sm" className="h-6 text-[9px] font-semibold">Edit</Button>
              </div>
              <div className="p-4">
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-x-6 gap-y-3">
                  {[
                    ["Legal Name", entity.name],
                    ["Entity Type", entity.subType],
                    ["Jurisdiction", `🇰🇾 ${entity.jurisdiction}`],
                    ["Registration #", entity.registrationNumber],
                    ["Incorporated", new Date(entity.dateOfIncorporation).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })],
                    ["Products", entity.products.join(", ")],
                    ["Client Since", new Date(entity.clientSince).toLocaleDateString("en-US", { month: "short", year: "numeric" })],
                    ["Address", entity.registeredAddress],
                  ].map(([label, value]) => (
                    <div key={label as string}>
                      <div className="text-[9px] font-bold text-muted-foreground uppercase tracking-widest mb-0.5">{label}</div>
                      <div className="text-[11px] font-medium">{value}</div>
                    </div>
                  ))}
                </div>

                {/* Contact row */}
                <div className="mt-4 pt-3 border-t border-border grid grid-cols-2 md:grid-cols-4 gap-x-6 gap-y-2">
                  {[
                    ["Primary Contact", `${entity.primaryContact.name}, ${entity.primaryContact.title}`],
                    ["Email", entity.primaryContact.email],
                    ["Phone", entity.primaryContact.phone],
                    ["Relationship Manager", entity.relationshipManager.name],
                  ].map(([label, value]) => (
                    <div key={label as string}>
                      <div className="text-[9px] font-bold text-muted-foreground uppercase tracking-widest mb-0.5">{label}</div>
                      <div className="text-[11px] font-medium">{value}</div>
                    </div>
                  ))}
                </div>

                {/* Tax row */}
                <div className="mt-3 pt-3 border-t border-border grid grid-cols-3 gap-x-6">
                  <div><div className="text-[9px] font-bold text-muted-foreground uppercase tracking-widest mb-0.5">FATCA</div><div className="text-[11px] font-medium">{entity.taxStatus.fatca}</div></div>
                  <div><div className="text-[9px] font-bold text-muted-foreground uppercase tracking-widest mb-0.5">CRS</div><div className="text-[11px] font-medium">{entity.taxStatus.crs}</div></div>
                  <div><div className="text-[9px] font-bold text-muted-foreground uppercase tracking-widest mb-0.5">Last Screened</div><div className="text-[11px] font-medium">{new Date(entity.lastScreened).toLocaleDateString("en-US", { month: "short", day: "numeric", hour: "2-digit", minute: "2-digit" })}</div></div>
                </div>
              </div>
            </div>

            {/* Risk & Compliance — 4 cols */}
            <div className="lg:col-span-4 space-y-5">
              {/* Risk Score */}
              <div className="rounded-lg border border-border bg-card overflow-hidden">
                <div className="px-4 py-2.5 border-b border-border">
                  <span className="text-[12px] font-bold">Risk Assessment</span>
                </div>
                <div className="p-4">
                  <div className="flex items-center justify-between mb-4">
                    <div>
                      <div className="text-[28px] font-extrabold tabular-nums tracking-tight">{entity.riskScore}<span className="text-[14px] text-muted-foreground font-medium">/100</span></div>
                      <RiskBadge tier={entity.riskTier} />
                    </div>
                    <ConfidenceBadge value={Math.round(entity.aiConfidence * 100)} />
                  </div>
                  {/* Factor bars */}
                  <div className="space-y-2">
                    {riskFactors.map((f) => (
                      <div key={f.name}>
                        <div className="flex items-center justify-between mb-0.5">
                          <span className="text-[10px] font-medium text-muted-foreground">{f.name}</span>
                          <span className="text-[10px] font-bold tabular-nums">{f.score}%</span>
                        </div>
                        <div className="h-1 bg-muted rounded-full overflow-hidden">
                          <div
                            className="h-full rounded-full"
                            style={{
                              width: `${f.score}%`,
                              backgroundColor: f.score >= 70 ? "var(--nx-rose-500)" : f.score >= 40 ? "var(--nx-amber-500)" : "var(--nx-emerald-500)",
                            }}
                          />
                        </div>
                      </div>
                    ))}
                  </div>
                  <Button variant="outline" size="sm" className="h-6 text-[9px] font-semibold w-full mt-3" onClick={() => setActiveTab("risk")}>
                    View Full Risk Profile →
                  </Button>
                </div>
              </div>

              {/* Review status */}
              <div className="rounded-lg border border-border bg-card p-4">
                <div className="text-[9px] font-bold text-muted-foreground uppercase tracking-widest mb-2">Review Status</div>
                <div className="space-y-2 text-[11px]">
                  <div className="flex justify-between"><span className="text-muted-foreground">Last reviewed</span><span className={`font-bold tabular-nums ${daysSinceReview > 365 ? "text-nx-amber-600" : ""}`}>{daysSinceReview} days ago</span></div>
                  <div className="flex justify-between"><span className="text-muted-foreground">Next due</span><span className={`font-bold tabular-nums ${daysUntilDue <= 30 ? "text-nx-amber-600" : ""}`}>{daysUntilDue} days ({entity.nextReviewDue})</span></div>
                  <div className="flex justify-between"><span className="text-muted-foreground">Review type</span><span className="font-bold">{entity.cddLevel}</span></div>
                </div>
              </div>
            </div>
          </div>

          {/* ── UBO + Screening side by side ── */}
          <div className="grid gap-5 lg:grid-cols-2">
            {/* Beneficial Ownership */}
            <div className="rounded-lg border border-border bg-card overflow-hidden">
              <div className="flex items-center justify-between px-4 py-2.5 border-b border-border">
                <div className="flex items-center gap-2">
                  <Users className="h-3.5 w-3.5 text-muted-foreground/40" />
                  <span className="text-[12px] font-bold">Beneficial Owners</span>
                  <span className="text-[10px] text-muted-foreground">{beneficialOwners.length} UBOs</span>
                </div>
                <button onClick={() => setActiveTab("ownership")} className="text-[10px] font-medium text-muted-foreground hover:text-foreground">View graph →</button>
              </div>
              <div className="divide-y divide-border">
                {beneficialOwners.map((o) => (
                  <div key={o.id} className="flex items-center gap-3 px-4 py-2.5 hover:bg-muted/10 transition-colors">
                    <div className="h-7 w-7 rounded-full bg-foreground/5 flex items-center justify-center text-[9px] font-bold shrink-0">
                      {o.name.split(" ").map((w) => w[0]).join("")}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-1.5">
                        <span className="text-[12px] font-semibold">{o.name}</span>
                        <span className="text-[10px]">{o.nationality === "GB" ? "🇬🇧" : o.nationality === "JP" ? "🇯🇵" : o.nationality}</span>
                        {o.pepStatus && <span className="text-[9px] font-bold text-nx-rose-700 bg-nx-rose-50 px-1 py-0.5 rounded">PEP</span>}
                      </div>
                      <div className="text-[10px] text-muted-foreground">{o.path}</div>
                    </div>
                    <div className="text-right shrink-0">
                      <div className="text-[14px] font-extrabold tabular-nums">{o.effectiveOwnership}%</div>
                      <RiskBadge tier={o.riskTier} compact className="text-[8px]" />
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Screening Status */}
            <div className="rounded-lg border border-border bg-card overflow-hidden">
              <div className="flex items-center justify-between px-4 py-2.5 border-b border-border">
                <div className="flex items-center gap-2">
                  <ShieldCheck className="h-3.5 w-3.5 text-muted-foreground/40" />
                  <span className="text-[12px] font-bold">Screening Status</span>
                  {entity.openAlerts > 0 && <span className="text-[9px] font-bold text-nx-amber-600">{entity.openAlerts} alerts</span>}
                </div>
                <button onClick={() => setActiveTab("screening")} className="text-[10px] font-medium text-muted-foreground hover:text-foreground">View all →</button>
              </div>
              <div className="divide-y divide-border">
                {screeningLists.map((l) => (
                  <div key={l.list} className={cn("flex items-center justify-between px-4 py-2.5", l.status === "alert" && "bg-nx-amber-50/30")}>
                    <span className="text-[11px] font-medium">{l.list}</span>
                    <div className="flex items-center gap-3">
                      <span className="text-[10px] text-muted-foreground tabular-nums">{l.lastScreened}</span>
                      {l.status === "alert" ? (
                        <span className="flex items-center gap-1 text-[10px] font-bold text-nx-amber-600">
                          <AlertTriangle className="h-3 w-3" /> {l.matches} alert
                        </span>
                      ) : (
                        <span className="flex items-center gap-1 text-[10px] font-bold text-nx-emerald-600">
                          <CheckCircle2 className="h-3 w-3" /> Clear
                        </span>
                      )}
                    </div>
                  </div>
                ))}
              </div>
              <div className="px-4 py-2 border-t border-border text-[10px] text-muted-foreground">
                Last full screening: 2h ago · Continuous monitoring active
              </div>
            </div>
          </div>

          {/* ── Documents ── */}
          <div className="rounded-lg border border-border bg-card overflow-hidden">
            <div className="flex items-center justify-between px-4 py-2.5 border-b border-border">
              <div className="flex items-center gap-2">
                <FileText className="h-3.5 w-3.5 text-muted-foreground/40" />
                <span className="text-[12px] font-bold">Documents</span>
                <span className="text-[10px] text-muted-foreground">{verifiedDocs}/{documents.length} verified · {issueDocs > 0 ? `${issueDocs} need attention` : "all clear"}</span>
              </div>
              <button onClick={() => setActiveTab("documents")} className="text-[10px] font-medium text-muted-foreground hover:text-foreground">Manage →</button>
            </div>
            <div className="divide-y divide-border">
              {documents.map((d) => (
                <div key={d.id} className={cn("flex items-center gap-3 px-4 py-2 hover:bg-muted/10 transition-colors", d.status === "issue" && "bg-nx-amber-50/20", d.status === "expiring" && "bg-nx-amber-50/20")}>
                  <DocStatusIcon status={d.status} />
                  <div className="flex-1 min-w-0">
                    <span className="text-[11px] font-medium">{d.name}</span>
                    {d.issueDetail && <span className="text-[9px] text-nx-amber-600 ml-2">{d.issueDetail}</span>}
                  </div>
                  <div className="shrink-0 text-[10px] text-muted-foreground tabular-nums">
                    {d.status === "verified" && d.aiConfidence && <span className="font-bold text-nx-emerald-600">{Math.round(d.aiConfidence * 100)}%</span>}
                    {d.status === "pending" && <span className="text-muted-foreground/40">Awaiting</span>}
                    {d.status === "issue" && <span className="font-bold text-nx-amber-600">Issue</span>}
                    {d.status === "expiring" && <span className="font-bold text-nx-amber-600">Expiring {d.expiryDate}</span>}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* ── Recent Activity ── */}
          <div className="rounded-lg border border-border bg-card overflow-hidden">
            <div className="flex items-center justify-between px-4 py-2.5 border-b border-border">
              <div className="flex items-center gap-2">
                <Clock className="h-3.5 w-3.5 text-muted-foreground/40" />
                <span className="text-[12px] font-bold">Recent Activity</span>
              </div>
              <button onClick={() => setActiveTab("activity")} className="text-[10px] font-medium text-muted-foreground hover:text-foreground">View all →</button>
            </div>
            <div className="divide-y divide-border">
              {timeline.slice(0, 6).map((evt) => (
                <div key={evt.id} className="flex items-start gap-3 px-4 py-2.5">
                  <div className={cn("h-1.5 w-1.5 rounded-full mt-1.5 shrink-0", evt.type === "ai" ? "bg-foreground/40" : evt.type === "human" ? "bg-foreground" : "bg-muted-foreground/30")} />
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-1.5">
                      <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider">
                        {evt.type === "ai" ? evt.agent : evt.actor}
                      </span>
                      {evt.confidence && <ConfidenceBadge value={evt.confidence} />}
                      <span className="text-[9px] text-muted-foreground/40 ml-auto tabular-nums shrink-0">{evt.timestamp}</span>
                    </div>
                    <p className="text-[11px] text-muted-foreground mt-0.5">{evt.action}</p>
                    {evt.detail && <p className="text-[10px] text-muted-foreground/60 mt-0.5">{evt.detail}</p>}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {activeTab === "documents" && <TabDocuments documents={documents} />}
      {activeTab === "screening" && <TabScreening alerts={pendingAlerts} />}
      {activeTab === "risk" && <TabRisk entity={entity} factors={riskFactors} narrative={riskNarrative} />}
      {activeTab === "ownership" && <TabOwnership entity={entity} owners={beneficialOwners} />}
      {activeTab === "cases" && <TabCases />}
      {activeTab === "activity" && <TabActivity events={timeline} />}
      {activeTab === "reviews" && <TabReviews reviews={reviewHistory} nextReviewDue={entity.nextReviewDue} />}
    </div>
  );
}
