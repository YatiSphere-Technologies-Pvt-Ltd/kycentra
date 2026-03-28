"use client";

import { DashboardCard } from "@/components/shared/dashboard-card";
import { AIIndicator, ConfidenceBadge, RiskBadge } from "@/components/shared";
import { DocStatusIcon } from "@/components/shared/status-badge";
import { AlertTriangle, CheckCircle2, Sparkles } from "lucide-react";
import type { Entity, BeneficialOwner, EntityDocument, RiskFactor, TimelineEvent, ScreeningAlert } from "../types";

// ============================================================
// Overview Tab — consolidated view of everything about the entity
// ============================================================

interface OverviewTabProps {
  entity: Entity;
  owners: BeneficialOwner[];
  documents: EntityDocument[];
  riskFactors: RiskFactor[];
  timeline: TimelineEvent[];
  pendingAlerts: ScreeningAlert[];
  screeningLists: { list: string; status: "alert" | "clear"; matches: number; lastScreened: string }[];
  riskNarrative: string;
}

// --- Pending Actions Banner ---
function PendingActionsBanner({ alerts }: { alerts: ScreeningAlert[] }) {
  if (alerts.length === 0) return null;
  const hasCritical = alerts.some((a) => a.priority === "critical");
  return (
    <div
      className="rounded-xl p-4"
      style={{
        backgroundColor: hasCritical ? "var(--nx-rose-50)" : "var(--nx-amber-50)",
        borderLeft: `4px solid ${hasCritical ? "var(--nx-risk-critical)" : "var(--nx-amber-500)"}`,
      }}
      role="alert"
    >
      <div className="flex items-center gap-2 mb-2">
        <AlertTriangle className="h-4 w-4" style={{ color: hasCritical ? "var(--nx-risk-critical)" : "var(--nx-amber-600)" }} />
        <span className="text-sm font-semibold" style={{ color: hasCritical ? "var(--nx-risk-critical)" : "var(--nx-amber-800)" }}>
          {alerts.length} items require your attention
        </span>
      </div>
      <ul className="space-y-1.5">
        {alerts.map((a) => (
          <li key={a.id} className="flex items-center justify-between text-[13px]">
            <span className="text-muted-foreground">
              <span className="font-medium text-foreground">{a.list}</span>: {a.aiRecommendation.slice(0, 80)}…
            </span>
            <button type="button" className="text-xs font-medium text-primary hover:underline shrink-0 ml-3">
              Review
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
}

// --- Client Identity Card ---
function ClientIdentityCard({ entity }: { entity: Entity }) {
  const fields = [
    { label: "Legal Name", value: entity.name },
    { label: "Entity Type", value: entity.subType },
    { label: "Jurisdiction", value: `${entity.jurisdiction} ${entity.jurisdictionCode === "KY" ? "🇰🇾" : ""}` },
    { label: "Registration #", value: entity.registrationNumber, mono: true },
    { label: "Incorporated", value: new Date(entity.dateOfIncorporation).toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" }) },
    { label: "Registered Address", value: entity.registeredAddress },
    { label: "Primary Contact", value: `${entity.primaryContact.name}, ${entity.primaryContact.title}` },
    { label: "Email", value: entity.primaryContact.email, link: true },
    { label: "Phone", value: entity.primaryContact.phone },
    { label: "Products", value: entity.products.join(", ") },
    { label: "Client Since", value: new Date(entity.clientSince).toLocaleDateString("en-US", { month: "long", year: "numeric" }) },
    { label: "Tax Status", value: `FATCA: ${entity.taxStatus.fatca} · CRS: ${entity.taxStatus.crs}` },
  ];

  return (
    <DashboardCard.Root>
      <DashboardCard.Header title="Client Profile" actions={<button type="button" className="text-xs font-medium text-primary hover:underline">Edit</button>} />
      <DashboardCard.Content>
        <dl className="grid grid-cols-1 gap-x-6 gap-y-4 sm:grid-cols-2">
          {fields.map((f) => (
            <div key={f.label}>
              <dt className="text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">{f.label}</dt>
              <dd className={`mt-0.5 text-sm ${f.mono ? "font-mono text-primary" : ""} ${f.link ? "text-primary hover:underline cursor-pointer" : ""}`}>
                {f.value}
              </dd>
            </div>
          ))}
        </dl>
      </DashboardCard.Content>
    </DashboardCard.Root>
  );
}

// --- AI Assessment Card ---
function AIAssessmentCard({ entity, riskNarrative }: { entity: Entity; riskNarrative: string }) {
  const findings = [
    { text: `High-risk jurisdiction: ${entity.jurisdiction} (FATF monitored)`, level: "amber" },
    { text: "Complex ownership: 5-layer structure across 4 jurisdictions", level: "amber" },
    { text: "PEP association: Director linked to former government official", level: "red" },
    { text: "Transaction patterns: Consistent with stated business type", level: "green" },
    { text: "Document verification: All primary documents validated", level: "green" },
  ];

  const borderColor: Record<string, string> = {
    amber: "var(--nx-amber-500)", red: "var(--nx-risk-high)", green: "var(--nx-emerald-500)",
  };
  const icon: Record<string, string> = { amber: "⚠", red: "🔴", green: "✅" };

  return (
    <div className="rounded-xl border border-border bg-card shadow-elevation-1 overflow-hidden">
      {/* Violet gradient top */}
      <div style={{ background: "linear-gradient(180deg, oklch(58% 0.155 300 / 3%) 0%, transparent 100%)" }}>
        <div className="flex items-center gap-2 border-b border-border px-5 py-4" style={{ borderLeft: "4px solid var(--nx-violet-500)" }}>
          <h3 className="text-base font-semibold">AI Assessment</h3>
          <AIIndicator size={16} />
        </div>
      </div>

      <div className="p-5 space-y-5" style={{ borderLeft: "4px solid var(--nx-violet-500)" }}>
        {/* Recommendation */}
        <div>
          <p className="text-lg font-semibold">Enhanced Due Diligence Required</p>
          <p className="mt-1 text-[13px] text-muted-foreground">Based on jurisdiction risk and UBO complexity</p>
          <ConfidenceBadge value={Math.round(entity.aiConfidence * 100)} className="mt-2" />
        </div>

        {/* Key findings */}
        <div className="space-y-2">
          <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Key Findings</p>
          {findings.map((f, i) => (
            <div
              key={i}
              className="flex items-start gap-2 rounded-lg px-3 py-2 text-[13px]"
              style={{ borderLeft: `3px solid ${borderColor[f.level]}` }}
            >
              <span aria-hidden="true">{icon[f.level]}</span>
              <span>{f.text}</span>
            </div>
          ))}
        </div>

        <button type="button" className="flex items-center gap-1.5 text-xs font-medium text-primary hover:underline">
          <Sparkles className="h-3.5 w-3.5" />
          View Full Reasoning
        </button>
      </div>
    </div>
  );
}

// --- Screening Summary ---
function ScreeningSummaryCard({ lists }: { lists: OverviewTabProps["screeningLists"] }) {
  const hasAlerts = lists.some((l) => l.status === "alert");
  return (
    <DashboardCard.Root>
      <DashboardCard.Header
        title="Screening Status"
        badge={
          <span className={`h-2.5 w-2.5 rounded-full ${hasAlerts ? "bg-nx-amber-500" : "bg-nx-emerald-500"}`} aria-label={hasAlerts ? "Alerts pending" : "All clear"} />
        }
      />
      <DashboardCard.Content noPadding className="overflow-auto">
        <table className="w-full text-sm" aria-label="Screening lists">
          <caption className="sr-only">Screening results by sanctions list</caption>
          <thead>
            <tr className="border-b border-border bg-muted/40">
              {["List", "Status", "Matches", "Last Screened", ""].map((h) => (
                <th key={h} scope="col" className="px-4 py-2.5 text-left text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">{h}</th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-border">
            {lists.map((l) => (
              <tr
                key={l.list}
                className="transition-colors hover:bg-muted/30"
                style={l.status === "alert" ? { backgroundColor: "var(--nx-amber-50)", borderLeft: "3px solid var(--nx-amber-500)" } : undefined}
              >
                <td className="px-4 py-2.5 text-[13px] font-medium">{l.list}</td>
                <td className="px-4 py-2.5">{l.status === "alert" ? <span className="text-xs font-semibold" style={{ color: "var(--nx-amber-600)" }}>⚠ Alert</span> : <span className="text-xs text-nx-emerald-600">✅ Clear</span>}</td>
                <td className="px-4 py-2.5 tabular-nums text-[13px]">{l.matches > 0 ? <span className="font-semibold" style={{ color: "var(--nx-amber-600)" }}>{l.matches} pending</span> : "0"}</td>
                <td className="px-4 py-2.5 text-xs text-muted-foreground">{l.lastScreened}</td>
                <td className="px-4 py-2.5">{l.status === "alert" && <button type="button" className="text-xs font-medium text-primary hover:underline">Review</button>}</td>
              </tr>
            ))}
          </tbody>
        </table>
        <p className="px-4 py-3 text-[11px] text-muted-foreground border-t border-border">Last full screening: 2 hours ago · Next scheduled: Continuous</p>
      </DashboardCard.Content>
    </DashboardCard.Root>
  );
}

// --- Risk Factors Summary ---
function RiskFactorsSummary({ factors }: { factors: RiskFactor[] }) {
  return (
    <DashboardCard.Root>
      <DashboardCard.Header title="Risk Profile" />
      <DashboardCard.Content className="space-y-3">
        {factors.map((f) => {
          const color = f.score >= 70 ? "var(--nx-risk-high)" : f.score >= 40 ? "var(--nx-risk-medium)" : "var(--nx-risk-low)";
          return (
            <div key={f.name}>
              <div className="flex items-center justify-between text-[13px]">
                <span className="font-medium">{f.name}</span>
                <span className="tabular-nums font-semibold" style={{ color }}>{f.score}%</span>
              </div>
              <div className="mt-1 h-2 w-full rounded-full bg-nx-neutral-100">
                <div className="h-full rounded-full transition-all duration-500" style={{ width: `${f.score}%`, backgroundColor: color }} />
              </div>
              <p className="mt-0.5 text-[10px] text-muted-foreground/60">{f.weight}% weight · {f.detail}</p>
            </div>
          );
        })}
      </DashboardCard.Content>
    </DashboardCard.Root>
  );
}

// --- Document Status ---
function DocumentStatusCard({ docs }: { docs: EntityDocument[] }) {
  const pending = docs.filter((d) => d.status !== "verified").length;
  return (
    <DashboardCard.Root>
      <DashboardCard.Header title="Documents" badge={<span className="text-xs text-muted-foreground">{docs.length} total · {pending} pending</span>} />
      <DashboardCard.Content noPadding>
        <div className="divide-y divide-border max-h-64 overflow-y-auto">
          {docs.slice(0, 8).map((d) => (
            <div key={d.id} className="flex items-center justify-between px-5 py-2.5 text-[13px] hover:bg-muted/30 transition-colors">
              <div className="flex items-center gap-2 min-w-0">
                <DocStatusIcon status={d.status} />
                <span className="truncate">{d.name}</span>
                {d.verifiedBy?.includes("Agent") && <AIIndicator size={11} />}
              </div>
              {d.expiryDate && <span className="text-[11px] text-muted-foreground shrink-0 ml-2">{d.expiryDate.slice(0, 7)}</span>}
            </div>
          ))}
        </div>
        <div className="border-t border-border px-5 py-3">
          <button type="button" className="text-xs font-medium text-primary hover:underline">View all documents →</button>
        </div>
      </DashboardCard.Content>
    </DashboardCard.Root>
  );
}

// --- Ownership Summary ---
function OwnershipSummary({ owners }: { owners: BeneficialOwner[] }) {
  return (
    <DashboardCard.Root>
      <DashboardCard.Header title="Beneficial Ownership" />
      <DashboardCard.Content className="space-y-3">
        {owners.map((o) => (
          <div key={o.id} className="flex items-start gap-3 rounded-lg border border-border p-3">
            <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-muted text-xs font-bold">
              {o.name.split(" ").map((w) => w[0]).join("")}
            </div>
            <div className="min-w-0 flex-1">
              <div className="flex items-center gap-2 flex-wrap">
                <span className="text-[13px] font-semibold">{o.name}</span>
                <span className="text-[11px]">{o.nationality === "GB" ? "🇬🇧" : o.nationality === "JP" ? "🇯🇵" : o.nationality}</span>
                <span className="rounded bg-nx-teal-50 px-1.5 py-0.5 text-[10px] font-semibold text-nx-teal-700">UBO</span>
                <RiskBadge tier={o.riskTier} compact className="text-[10px] px-1.5" />
                {o.pepStatus && <span className="rounded bg-nx-rose-50 px-1.5 py-0.5 text-[10px] font-semibold text-nx-rose-700">⚠ PEP</span>}
              </div>
              <p className="mt-0.5 text-xs text-muted-foreground">{o.effectiveOwnership}% effective ownership</p>
            </div>
          </div>
        ))}
        <button type="button" className="text-xs font-medium text-primary hover:underline">View full ownership graph →</button>
      </DashboardCard.Content>
    </DashboardCard.Root>
  );
}

// --- Activity Timeline ---
function ActivityTimeline({ events }: { events: TimelineEvent[] }) {
  const dotColor: Record<string, string> = {
    ai: "var(--nx-violet-500)", human: "var(--nx-indigo-500)", system: "var(--nx-neutral-400)", alert: "var(--nx-amber-500)",
  };

  return (
    <DashboardCard.Root>
      <DashboardCard.Header title="Recent Activity" />
      <DashboardCard.Content>
        <div className="relative ml-3 border-l-2 border-border pl-6 space-y-5">
          {events.slice(0, 6).map((e) => (
            <div key={e.id} className="relative">
              <span
                className="absolute -left-[31px] top-1 h-3 w-3 rounded-full border-2 border-background"
                style={{ backgroundColor: dotColor[e.type] ?? "var(--nx-neutral-400)" }}
                aria-hidden="true"
              />
              <p className="text-[11px] text-muted-foreground/60 tabular-nums">{e.timestamp}</p>
              <p className="mt-0.5 text-[13px]">
                {e.type === "ai" && <AIIndicator size={12} className="mr-1" />}
                <span className="font-medium">{e.agent ?? e.actor ?? "System"}</span>
                {" "}{e.action}
              </p>
              {e.detail && <p className="mt-0.5 text-xs text-muted-foreground">{e.detail}</p>}
              {e.confidence && <ConfidenceBadge value={e.confidence} className="mt-1" />}
            </div>
          ))}
        </div>
        <div className="mt-4 pt-3 border-t border-border">
          <button type="button" className="text-xs font-medium text-primary hover:underline">View all activity →</button>
        </div>
      </DashboardCard.Content>
    </DashboardCard.Root>
  );
}

// === MAIN OVERVIEW TAB ===
export function TabOverview(props: OverviewTabProps) {
  return (
    <div className="space-y-5">
      {/* Pending actions */}
      <PendingActionsBanner alerts={props.pendingAlerts} />

      {/* Top row: identity + AI assessment */}
      <div className="grid gap-5 lg:grid-cols-5">
        <div className="lg:col-span-3">
          <ClientIdentityCard entity={props.entity} />
        </div>
        <div className="lg:col-span-2">
          <AIAssessmentCard entity={props.entity} riskNarrative={props.riskNarrative} />
        </div>
      </div>

      {/* Middle row: screening + risk */}
      <div className="grid gap-5 lg:grid-cols-2">
        <ScreeningSummaryCard lists={props.screeningLists} />
        <RiskFactorsSummary factors={props.riskFactors} />
      </div>

      {/* Lower row: documents + ownership */}
      <div className="grid gap-5 lg:grid-cols-2">
        <DocumentStatusCard docs={props.documents} />
        <OwnershipSummary owners={props.owners} />
      </div>

      {/* Full-width timeline */}
      <ActivityTimeline events={props.timeline} />
    </div>
  );
}
