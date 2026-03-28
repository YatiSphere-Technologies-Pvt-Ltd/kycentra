"use client";

import { Button } from "@/components/ui/button";
import { AIIndicator, ConfidenceBadge, RiskBadge } from "@/components/shared";
import { agentStyles } from "@/lib/styles";
import type { Entity, BeneficialOwner, ScreeningAlert, RiskFactor, EntityDocument } from "../types";
import type { AgentName } from "@/features/workbench/types";

// Shared panel wrapper
function AgentPanel({ agentName, confidence, status, lastRan, children }: {
  agentName: AgentName; confidence: number; status: "ok" | "issue" | "critical" | "running"; lastRan: string; children: React.ReactNode;
}) {
  const style = agentStyles[agentName];
  const statusDot = { ok: "var(--nx-emerald-500)", issue: "var(--nx-amber-500)", critical: "var(--nx-rose-500)", running: "var(--nx-teal-500)" };
  const statusLabel = { ok: "● OK", issue: "⚠ ISSUE", critical: "🔴 ALERT", running: "🔄 Running" };

  return (
    <div className="rounded-xl border border-border bg-card shadow-elevation-1 hover:shadow-elevation-2 transition-shadow overflow-hidden" style={{ borderTop: `3px solid ${style?.color ?? "var(--nx-neutral-300)"}` }}>
      <div className="flex items-center justify-between px-4 py-2.5 border-b border-border">
        <div className="flex items-center gap-2">
          <span className="text-xs font-bold">{agentName}</span>
          <ConfidenceBadge value={confidence} />
        </div>
        <span className="text-[10px] font-semibold" style={{ color: statusDot[status] }}>{statusLabel[status]}</span>
      </div>
      <div className="p-4 space-y-3 text-[13px]">{children}</div>
    </div>
  );
}

// Panel A: Document Agent
export function DocumentAgentPanel({ docs }: { docs: EntityDocument[] }) {
  const verified = docs.filter((d) => d.status === "verified").length;
  const issues = docs.filter((d) => d.status === "issue").length;
  const expiring = docs.filter((d) => d.status === "expiring").length;

  return (
    <AgentPanel agentName="Document Agent" confidence={94} status={issues > 0 ? "issue" : "ok"} lastRan="2h ago">
      <p className="text-muted-foreground italic">&quot;{docs.length} documents on file. {verified} verified, {issues} discrepancy, {expiring} expiring.&quot;</p>
      {docs.filter((d) => d.status !== "verified" && d.status !== "pending").slice(0, 3).map((d) => (
        <div key={d.id} className="flex items-center justify-between">
          <span>{d.status === "issue" ? "⚠" : "🟡"} {d.name}</span>
          <Button size="sm" variant="outline" className="h-6 text-[10px] px-2">
            {d.status === "issue" ? "Approve" : "Request Renewal"}
          </Button>
        </div>
      ))}
      <p className="text-nx-emerald-600 text-xs">✅ {verified} more documents — all verified</p>
    </AgentPanel>
  );
}

// Panel B: Entity Agent
export function EntityAgentPanel({ owners, entity }: { owners: BeneficialOwner[]; entity: Entity }) {
  const hasPEP = owners.some((o) => o.pepStatus);
  return (
    <AgentPanel agentName="Entity Agent" confidence={96} status={hasPEP ? "issue" : "ok"} lastRan="2h ago">
      <p className="text-muted-foreground italic">&quot;5-layer ownership, 4 jurisdictions. {owners.length} UBOs. {hasPEP ? "1 PEP in chain." : "No PEP."} No circular ownership.&quot;</p>
      {owners.slice(0, 3).map((o) => (
        <div key={o.id} className="flex items-center gap-2 text-xs">
          <span className="font-medium">{o.name}</span>
          <span className="tabular-nums">{o.effectiveOwnership}%</span>
          <RiskBadge tier={o.riskTier} compact className="text-[9px] px-1" />
          {o.pepStatus && <span className="rounded bg-nx-rose-50 px-1 py-0.5 text-[9px] font-semibold text-nx-rose-700">⚠ PEP</span>}
        </div>
      ))}
      <button type="button" className="text-xs font-medium text-primary hover:underline">Open Graph Explorer ↗</button>
    </AgentPanel>
  );
}

// Panel C: Screening Agent
export function ScreeningAgentPanel({ alerts }: { alerts: ScreeningAlert[] }) {
  const hasCritical = alerts.some((a) => a.priority === "critical");
  return (
    <AgentPanel agentName="Screening Agent" confidence={68} status={hasCritical ? "critical" : alerts.length > 0 ? "issue" : "ok"} lastRan="2h ago">
      <p className="text-muted-foreground italic">&quot;847 screens performed. {alerts.length} alerts pending review. {hasCritical ? "1 critical OFAC match." : ""}&quot;</p>
      {alerts.slice(0, 3).map((a) => (
        <div key={a.id} className="flex items-center justify-between text-xs">
          <span>
            {a.priority === "critical" ? "🔴" : "⚠"} {a.list} — {Math.round(a.matchScore * 100)}% match
          </span>
          {a.aiConfidence >= 0.8 ? (
            <div className="flex gap-1">
              <Button size="sm" className="h-5 px-2 text-[9px]">Dismiss</Button>
            </div>
          ) : (
            <Button size="sm" variant="outline" className="h-5 px-2 text-[9px]">Review →</Button>
          )}
        </div>
      ))}
    </AgentPanel>
  );
}

// Panel D: Risk Agent
export function RiskAgentPanel({ entity, factors }: { entity: Entity; factors: RiskFactor[] }) {
  return (
    <AgentPanel agentName="Risk Agent" confidence={88} status={entity.riskTier === "high" || entity.riskTier === "critical" ? "issue" : "ok"} lastRan="2h ago">
      <p className="text-muted-foreground italic">&quot;Risk: {entity.riskScore}/100 ({entity.riskTier.toUpperCase()}). EDD recommended.&quot;</p>
      {factors.slice(0, 3).map((f) => (
        <div key={f.name} className="flex items-center gap-2 text-xs">
          <span className="w-24 text-muted-foreground">{f.name}</span>
          <div className="flex-1 h-1.5 rounded-full bg-nx-neutral-100">
            <div className="h-full rounded-full" style={{ width: `${f.score}%`, backgroundColor: f.score >= 70 ? "var(--nx-risk-high)" : f.score >= 40 ? "var(--nx-risk-medium)" : "var(--nx-risk-low)" }} />
          </div>
          <span className="tabular-nums w-8 text-right font-medium">{f.score}%</span>
        </div>
      ))}
      <div className="flex gap-1.5">
        <Button size="sm" className="h-6 text-[10px] px-2">Approve Score</Button>
        <Button size="sm" variant="ghost" className="h-6 text-[10px] px-2">Override</Button>
      </div>
    </AgentPanel>
  );
}

// Panel E: Regulatory Agent
export function RegulatoryAgentPanel({ entity }: { entity: Entity }) {
  return (
    <AgentPanel agentName="Regulatory Agent" confidence={94} status="ok" lastRan="6h ago">
      <p className="text-muted-foreground italic">&quot;Subject to 54 rules across 3 jurisdictions. Currently compliant. 1 upcoming change.&quot;</p>
      <div className="space-y-1 text-xs">
        <p className="text-nx-emerald-600">✅ CIMA AML (Cayman) — 22 rules met</p>
        <p className="text-nx-emerald-600">✅ EU 6AMLD (Netherlands) — 18 rules met</p>
        <p className="text-nx-emerald-600">✅ JFSC AML/CFT (Jersey) — 14 rules met</p>
        <p className="text-nx-amber-600">⚠ Upcoming: EU AMLA RTS (Jun 2026) — 2 rules affected</p>
      </div>
      <p className="text-xs text-muted-foreground">Required DD: <span className="font-semibold">EDD</span> (PEP + FATF jurisdiction)</p>
    </AgentPanel>
  );
}

// Panel F: Investigation Agent
export function InvestigationAgentPanel() {
  return (
    <AgentPanel agentName="Investigation Agent" confidence={78} status="critical" lastRan="25m ago">
      <p className="text-muted-foreground italic">&quot;Active investigation (FC-2026-0847). SAR narrative drafted, 9 evidence items assembled.&quot;</p>
      <div className="space-y-1 text-xs">
        <p className="text-nx-emerald-600">✅ Case brief assembled (9 evidence items)</p>
        <p className="text-nx-emerald-600">✅ Evidence chain constructed</p>
        <p className="text-nx-emerald-600">✅ SAR narrative drafted (v2, 487 words)</p>
        <p className="text-muted-foreground">⬜ Analyst review and disposition</p>
      </div>
      <Button size="sm" variant="outline" className="h-6 text-[10px] px-2">Review Case & SAR Draft →</Button>
    </AgentPanel>
  );
}
