"use client";

import { useState } from "react";
import Link from "next/link";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Button } from "@/components/ui/button";
import { AIIndicator, ConfidenceBadge, RiskBadge } from "@/components/shared";
import { ExternalLink } from "lucide-react";
import { cn } from "@/lib/utils";
import type { ApprovalItem } from "../types";

const agentStatusIcons: Record<string, string> = {
  pass: "✅", alert: "⚠", high: "⚠", none: "—", fail: "🔴",
};

interface ApprovalDetailProps {
  item: ApprovalItem;
  onSubmitNext: () => void;
}

export function ApprovalDetail({ item, onSubmitNext }: ApprovalDetailProps) {
  const [decision, setDecision] = useState<string | null>(null);
  const [justification, setJustification] = useState("");

  // Type-specific decision options
  const decisionOptions = getDecisionOptions(item.type);

  return (
    <ScrollArea className="h-full">
      <div className="p-5 space-y-5">
        {/* Header */}
        <div>
          <div className="flex items-center gap-2 text-xs mb-1">
            <span className="font-mono text-muted-foreground">{item.id}</span>
            <span>{item.agentIcon} {item.agentName}</span>
            <ConfidenceBadge value={Math.round(item.aiConfidence * 100)} />
          </div>
          {item.entity && (
            <div className="flex items-center justify-between">
              <h3 className="text-base font-semibold">{item.entity.name}</h3>
              <Link href={`/entities/${item.entity.id}`}>
                <Button variant="ghost" size="sm" className="h-7 text-xs gap-1">
                  <ExternalLink className="h-3 w-3" />Entity 360°
                </Button>
              </Link>
            </div>
          )}
          <p className="text-xs text-muted-foreground">{item.requestedAt} · SLA: {item.sla.remaining.toFixed(1)}h remaining</p>
        </div>

        {/* AI Recommendation */}
        <div className="rounded-lg border border-border p-4" style={{ borderLeft: "4px solid var(--nx-violet-400)" }}>
          <div className="flex items-center gap-2 mb-2">
            <AIIndicator size={14} />
            <span className="text-xs font-semibold">{item.agentName} Recommendation</span>
          </div>
          <p className="text-sm font-semibold" style={{ color: item.aiConfidence >= 0.8 ? "var(--nx-emerald-600)" : item.aiConfidence >= 0.6 ? "var(--nx-amber-600)" : "var(--nx-rose-600)" }}>
            {item.aiRecommendation.replace(/_/g, " ").toUpperCase()}
          </p>
          <p className="mt-1.5 text-sm text-muted-foreground leading-relaxed">{item.aiSummary}</p>

          {item.reasonForHuman && item.reasonForHuman.length > 0 && (
            <div className="mt-3 space-y-1">
              <p className="text-[11px] font-semibold text-muted-foreground">Why this needs human review:</p>
              {item.reasonForHuman.map((r) => <p key={r} className="text-[11px] text-muted-foreground">• {r}</p>)}
            </div>
          )}
        </div>

        {/* Type-specific content */}
        {item.riskChange && (
          <div className="rounded-lg border border-border p-4">
            <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-3">Risk Change</p>
            <div className="grid grid-cols-2 gap-4 text-center">
              <div className="rounded-lg bg-muted/30 p-3">
                <p className="text-xs text-muted-foreground">Before</p>
                <p className="text-xl font-bold tabular-nums">{item.riskChange.beforeScore}</p>
                <p className="text-xs font-semibold">{item.riskChange.beforeTier}</p>
              </div>
              <div className="rounded-lg bg-muted/30 p-3">
                <p className="text-xs text-muted-foreground">After</p>
                <p className="text-xl font-bold tabular-nums">{item.riskChange.afterScore}</p>
                <p className="text-xs font-semibold" style={{ color: "var(--nx-risk-high)" }}>{item.riskChange.afterTier}</p>
              </div>
            </div>
            <p className="mt-2 text-xs text-muted-foreground">Trigger: {item.riskChange.trigger}</p>
          </div>
        )}

        {item.documentDiscrepancy && (
          <div className="rounded-lg border border-border p-4">
            <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-2">Document Discrepancy</p>
            <div className="space-y-1.5 text-sm">
              <p><span className="text-muted-foreground">Document:</span> {item.documentDiscrepancy.document}</p>
              <p><span className="text-muted-foreground">Field:</span> {item.documentDiscrepancy.field}</p>
              <p><span className="text-muted-foreground">Client value:</span> <span className="font-medium">{item.documentDiscrepancy.clientValue}</span></p>
              <p><span className="text-muted-foreground">Registry value:</span> <span className="font-medium">{item.documentDiscrepancy.registryValue}</span></p>
            </div>
            <div className="mt-2 rounded p-2 text-xs" style={{ backgroundColor: "var(--nx-amber-50)", borderLeft: "3px solid var(--nx-amber-500)" }}>
              AI: {item.documentDiscrepancy.aiAssessment}
            </div>
          </div>
        )}

        {item.agentSignoffs && (
          <div className="rounded-lg border border-border p-4">
            <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-2">Agent Sign-Offs</p>
            <div className="grid grid-cols-2 gap-2 text-xs">
              {Object.entries(item.agentSignoffs).map(([agent, status]) => (
                <div key={agent} className="flex items-center gap-1.5">
                  <span>{agentStatusIcons[status] ?? "—"}</span>
                  <span className="capitalize text-muted-foreground">{agent}</span>
                  <span className="font-medium">{status.toUpperCase()}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {item.sarDraft && (
          <div className="rounded-lg border border-border p-4">
            <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-2">SAR Draft</p>
            <div className="space-y-1 text-xs text-muted-foreground">
              <p>Version: {item.sarDraft.version} · {item.sarDraft.wordCount} words</p>
              <p>Quality: {item.sarDraft.qualityScore} checks passed</p>
            </div>
            <Link href="/cases/FC-2026-0847">
              <Button variant="outline" size="sm" className="mt-2 h-6 text-[10px]">Open Full Case →</Button>
            </Link>
          </div>
        )}

        {item.ruleChange && (
          <div className="rounded-lg border border-border p-4">
            <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-2">Rule Change</p>
            <div className="space-y-1 text-xs text-muted-foreground">
              <p>Rule: <span className="font-mono font-medium text-primary">{item.ruleChange.ruleId}</span> ({item.ruleChange.from} → {item.ruleChange.to})</p>
              <p>Affected entities: {item.ruleChange.affectedEntities.toLocaleString()}</p>
            </div>
          </div>
        )}

        {/* Entity context */}
        {item.entity && (
          <div className="rounded-lg border border-border p-4">
            <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-2">Entity Context</p>
            <div className="space-y-1 text-xs">
              <p className="font-medium">{item.entity.name}</p>
              <p className="text-muted-foreground">{item.entity.jurisdiction} · Risk: {item.entity.riskScore ?? "—"}/100 · {item.entity.cddLevel ?? "—"}</p>
            </div>
          </div>
        )}

        {/* Decision form */}
        <div className="border-t border-border pt-5 space-y-4">
          <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Your Decision</p>

          <div className="space-y-2">
            {decisionOptions.map((opt) => (
              <button
                key={opt.value}
                type="button"
                className={cn(
                  "flex w-full items-start gap-3 rounded-lg border p-3 text-left transition-all",
                  decision === opt.value ? "border-primary bg-primary/5" : "border-border hover:bg-muted/30"
                )}
                style={decision === opt.value ? { borderLeftWidth: "3px", borderLeftColor: opt.color } : undefined}
                onClick={() => setDecision(opt.value)}
              >
                <div className={cn("mt-0.5 h-4 w-4 rounded-full border-2 shrink-0 flex items-center justify-center", decision === opt.value ? "border-primary" : "border-nx-neutral-300")}>
                  {decision === opt.value && <div className="h-2 w-2 rounded-full bg-primary" />}
                </div>
                <div>
                  <p className="text-sm font-medium">{opt.icon} {opt.label}</p>
                  <p className="text-[11px] text-muted-foreground">{opt.description}</p>
                </div>
              </button>
            ))}
          </div>

          <textarea
            className="w-full rounded-md border border-border bg-background px-3 py-2 text-sm placeholder:text-muted-foreground/50 focus:outline-none focus:ring-2 focus:ring-primary/30 min-h-20"
            placeholder="Justification (required for some decisions)..."
            value={justification}
            onChange={(e) => setJustification(e.target.value)}
          />

          {item.aiSuggestedJustification && (
            <div className="rounded-lg border border-border p-3">
              <div className="flex items-center justify-between mb-1">
                <div className="flex items-center gap-1"><AIIndicator size={11} /><span className="text-[10px] font-semibold">AI Suggestion</span></div>
                <Button size="sm" variant="outline" className="h-5 text-[9px] px-2" onClick={() => setJustification(item.aiSuggestedJustification!)}>Use</Button>
              </div>
              <p className="text-[11px] text-muted-foreground">{item.aiSuggestedJustification}</p>
            </div>
          )}

          <div className="flex items-center justify-between pt-2">
            <Button variant="ghost" size="sm">Cancel</Button>
            <Button size="sm" disabled={!decision} onClick={onSubmitNext}>Submit & Next →</Button>
          </div>
        </div>
      </div>
    </ScrollArea>
  );
}

function getDecisionOptions(type: string) {
  switch (type) {
    case "screening_disposition":
      return [
        { value: "false_positive", label: "False Positive", description: "Not the same entity", icon: "✅", color: "var(--nx-emerald-600)" },
        { value: "true_positive", label: "True Positive", description: "Confirmed match → case + freeze", icon: "🔴", color: "var(--nx-rose-600)" },
        { value: "escalate", label: "Escalate to MLRO", description: "Needs senior review", icon: "⬆", color: "var(--nx-amber-600)" },
        { value: "request_info", label: "Request More Info", description: "Agent gathers more evidence", icon: "ℹ", color: "var(--nx-indigo-600)" },
      ];
    case "risk_approval":
      return [
        { value: "approve", label: "Approve", description: "Accept risk elevation and DD upgrade", icon: "✅", color: "var(--nx-emerald-600)" },
        { value: "modify", label: "Modify", description: "Accept but adjust score/tier", icon: "✏️", color: "var(--nx-amber-600)" },
        { value: "reject", label: "Reject", description: "Override: maintain current tier", icon: "❌", color: "var(--nx-rose-600)" },
        { value: "escalate", label: "Escalate", description: "Route to MLRO", icon: "⬆", color: "var(--nx-amber-600)" },
      ];
    case "onboarding_approval":
      return [
        { value: "activate", label: "Activate Client", description: "Approve onboarding, create entity", icon: "✅", color: "var(--nx-emerald-600)" },
        { value: "review", label: "Request Additional Review", description: "Specific concern noted", icon: "🔄", color: "var(--nx-amber-600)" },
        { value: "reject", label: "Reject Onboarding", description: "Decline client relationship", icon: "❌", color: "var(--nx-rose-600)" },
      ];
    case "sar_review":
      return [
        { value: "approve_sar", label: "Approve SAR — File", description: "File with regulator", icon: "✅", color: "var(--nx-emerald-600)" },
        { value: "revision", label: "Request Revision", description: "Send back to Investigation Agent", icon: "✏️", color: "var(--nx-amber-600)" },
        { value: "reject", label: "Reject SAR", description: "Close case, no filing", icon: "❌", color: "var(--nx-rose-600)" },
        { value: "escalate", label: "Escalate to MLRO", description: "Senior review before filing", icon: "⬆", color: "var(--nx-amber-600)" },
      ];
    case "rule_deployment":
      return [
        { value: "deploy", label: "Deploy Now", description: "Activate rule update immediately", icon: "✅", color: "var(--nx-emerald-600)" },
        { value: "schedule", label: "Schedule", description: "Deploy on specific date", icon: "🕐", color: "var(--nx-indigo-600)" },
        { value: "modify", label: "Modify First", description: "Adjust rule before deployment", icon: "✏️", color: "var(--nx-amber-600)" },
        { value: "reject", label: "Reject", description: "Do not deploy", icon: "❌", color: "var(--nx-rose-600)" },
      ];
    default:
      return [
        { value: "approve", label: "Approve", description: "Accept recommendation", icon: "✅", color: "var(--nx-emerald-600)" },
        { value: "reject", label: "Reject", description: "Override recommendation", icon: "❌", color: "var(--nx-rose-600)" },
        { value: "escalate", label: "Escalate", description: "Route to senior reviewer", icon: "⬆", color: "var(--nx-amber-600)" },
      ];
  }
}
