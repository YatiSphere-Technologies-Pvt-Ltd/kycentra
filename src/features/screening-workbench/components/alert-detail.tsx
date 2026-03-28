"use client";

import { useState } from "react";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Button } from "@/components/ui/button";
import { AIIndicator, ConfidenceBadge, ConfidenceBar, RiskBadge } from "@/components/shared";
import { ReasoningChain } from "@/components/shared/reasoning-chain";
import { ExternalLink, Sparkles } from "lucide-react";
import { riskStyles } from "@/lib/styles";
import { cn } from "@/lib/utils";
import type { ScreeningAlert, DispositionType } from "../types";

const recommendationStyles: Record<string, { label: string; color: string }> = {
  likely_true_match: { label: "⚠ LIKELY TRUE MATCH", color: "var(--nx-rose-600)" },
  confirmed_match: { label: "✓ CONFIRMED MATCH", color: "var(--nx-rose-700)" },
  likely_false_positive: { label: "✓ LIKELY FALSE POSITIVE", color: "var(--nx-emerald-600)" },
  inconclusive: { label: "~ INCONCLUSIVE", color: "var(--nx-amber-600)" },
};

const dispositions: { value: DispositionType; label: string; sub: string; color: string }[] = [
  { value: "true_positive", label: "True Positive", sub: "Confirmed match → Case creation", color: "var(--nx-rose-600)" },
  { value: "false_positive", label: "False Positive", sub: "Not the same entity → Dismiss", color: "var(--nx-emerald-600)" },
  { value: "escalate", label: "Escalate", sub: "Needs senior analyst / MLRO review", color: "var(--nx-amber-600)" },
  { value: "request_info", label: "Request Information", sub: "Cannot determine yet", color: "var(--nx-indigo-600)" },
];

interface AlertDetailProps {
  alert: ScreeningAlert;
  onSubmitNext: () => void;
}

export function AlertDetail({ alert, onSubmitNext }: AlertDetailProps) {
  const [disposition, setDisposition] = useState<DispositionType | null>(null);
  const [justification, setJustification] = useState("");
  const rec = recommendationStyles[alert.aiRecommendation] ?? recommendationStyles.inconclusive;
  const risk = riskStyles[alert.riskTier];

  return (
    <ScrollArea className="h-full">
      <div className="p-5 space-y-5">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <div className="flex items-center gap-2">
              <span className="font-mono text-xs text-muted-foreground">{alert.id}</span>
              <span className="text-sm font-semibold">{alert.list} Match</span>
              <RiskBadge tier={alert.riskTier} />
            </div>
            <p className="text-base font-semibold mt-1">{alert.entityName}</p>
            <p className="text-xs text-muted-foreground">Pending: {alert.timePending}</p>
          </div>
          <Button variant="ghost" size="sm" className="gap-1 text-xs">
            <ExternalLink className="h-3 w-3" />Entity
          </Button>
        </div>

        {/* AI Assessment */}
        <div className="rounded-lg border border-border p-4" style={{ borderLeft: "4px solid var(--nx-violet-400)" }}>
          <div className="flex items-center gap-2 mb-2">
            <AIIndicator size={14} />
            <span className="text-xs font-semibold">Screening Agent</span>
            <ConfidenceBadge value={Math.round(alert.aiConfidence * 100)} />
          </div>
          <p className="text-sm font-bold" style={{ color: rec.color }}>{rec.label}</p>
          <p className="mt-1.5 text-sm text-muted-foreground leading-relaxed">{alert.aiSummary}</p>

          {alert.whyNotAutoResolved.length > 0 && (
            <div className="mt-3 space-y-1">
              <p className="text-[11px] font-semibold text-muted-foreground">Why not auto-resolved:</p>
              {alert.whyNotAutoResolved.map((r) => (
                <p key={r} className="text-[11px] text-muted-foreground">• {r}</p>
              ))}
            </div>
          )}
        </div>

        {/* Match comparison */}
        {alert.matchComparison && (
          <div className="rounded-lg border border-border overflow-hidden">
            <div className="grid grid-cols-2">
              <div className="p-3 border-r border-b border-border bg-muted/20">
                <p className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">Your Client</p>
              </div>
              <div className="p-3 border-b border-border bg-muted/20">
                <p className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">List Entry</p>
              </div>
              {Object.keys(alert.matchComparison.clientData).map((key) => (
                <div key={key} className="contents">
                  <div className="px-3 py-2 border-r border-b border-border text-xs">
                    <span className="text-muted-foreground">{key}:</span>{" "}
                    <span className="font-medium">{alert.matchComparison!.clientData[key]}</span>
                  </div>
                  <div className="px-3 py-2 border-b border-border text-xs">
                    <span className="text-muted-foreground">{key}:</span>{" "}
                    <span className="font-medium">{alert.matchComparison!.listData[Object.keys(alert.matchComparison!.listData)[Object.keys(alert.matchComparison!.clientData).indexOf(key)] ?? key] ?? "—"}</span>
                  </div>
                </div>
              ))}
            </div>

            {/* Factor analysis */}
            <div className="p-3 space-y-2">
              <div className="flex items-center justify-between">
                <p className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">Match Score</p>
                <span className="text-sm font-bold tabular-nums" style={{ color: alert.matchScore >= 0.8 ? "var(--nx-rose-600)" : "var(--nx-amber-600)" }}>
                  {Math.round(alert.matchScore * 100)}%
                </span>
              </div>
              {alert.matchComparison.factors.map((f) => (
                <div key={f.field} className="flex items-center gap-2 text-[11px]">
                  <span className={f.type === "match" ? "text-nx-emerald-600" : f.type === "no_match" ? "text-nx-rose-600" : "text-nx-amber-600"}>
                    {f.type === "match" ? "✓" : f.type === "no_match" ? "✗" : "~"}
                  </span>
                  <span className="w-24 text-muted-foreground">{f.field}</span>
                  <div className="flex-1 h-1.5 rounded-full bg-nx-neutral-100">
                    <div className="h-full rounded-full transition-all" style={{
                      width: `${f.score * 100}%`,
                      backgroundColor: f.score >= 0.7 ? "var(--nx-emerald-500)" : f.score >= 0.3 ? "var(--nx-amber-500)" : "var(--nx-neutral-300)",
                    }} />
                  </div>
                  <span className="w-16 text-right tabular-nums text-muted-foreground">{f.method}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Entity context */}
        {alert.entityContext && (
          <div className="rounded-lg border border-border p-4">
            <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-2">Entity Context</p>
            <div className="grid grid-cols-2 gap-2 text-xs">
              <div><span className="text-muted-foreground">Risk:</span> <span className="font-medium">{alert.entityContext.riskScore}/100</span></div>
              <div><span className="text-muted-foreground">DD Level:</span> <span className="font-medium">{alert.entityContext.cddLevel}</span></div>
              <div><span className="text-muted-foreground">UBOs:</span> <span className="font-medium">{alert.entityContext.ubos.join(", ")}</span></div>
              <div><span className="text-muted-foreground">Open Cases:</span> <span className="font-medium">{alert.entityContext.openCases}</span></div>
              <div className="col-span-2"><span className="text-muted-foreground">Previous Alerts:</span> <span className="font-medium">{alert.entityContext.previousAlerts} ({alert.entityContext.previousAlertsOutcome})</span></div>
            </div>
            {alert.entityContext.previousAlerts > 5 && (
              <div className="mt-2 rounded p-2 text-[11px]" style={{ backgroundColor: "var(--nx-amber-50)", borderLeft: "3px solid var(--nx-amber-500)" }}>
                ⚡ Historical Pattern: {alert.entityContext.previousAlerts} prior alerts — {alert.entityContext.previousAlertsOutcome}
              </div>
            )}
          </div>
        )}

        {/* Related alerts */}
        {alert.relatedAlerts && alert.relatedAlerts.length > 0 && (
          <div className="rounded-lg border border-border p-3">
            <p className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground mb-2">Related Alerts (same entity)</p>
            {alert.relatedAlerts.map((ra) => (
              <div key={ra.id} className="flex items-center justify-between py-1 text-xs">
                <span className="font-mono text-muted-foreground">{ra.id}</span>
                <span>{ra.list}</span>
                <span className="tabular-nums">{Math.round(ra.matchScore * 100)}%</span>
                <RiskBadge tier={ra.riskTier} compact className="text-[9px] px-1" />
              </div>
            ))}
          </div>
        )}

        {/* Disposition form */}
        <div className="border-t border-border pt-5 space-y-4">
          <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Disposition</p>

          <div className="space-y-2">
            {dispositions.map((d) => (
              <button
                key={d.value}
                type="button"
                className={cn(
                  "flex w-full items-start gap-3 rounded-lg border p-3 text-left transition-all",
                  disposition === d.value ? "border-primary bg-primary/5" : "border-border hover:bg-muted/30"
                )}
                style={disposition === d.value ? { borderLeftWidth: "3px", borderLeftColor: d.color } : undefined}
                onClick={() => setDisposition(d.value)}
              >
                <div className={cn(
                  "mt-0.5 h-4 w-4 rounded-full border-2 shrink-0 flex items-center justify-center",
                  disposition === d.value ? "border-primary" : "border-nx-neutral-300"
                )}>
                  {disposition === d.value && <div className="h-2 w-2 rounded-full bg-primary" />}
                </div>
                <div>
                  <p className="text-sm font-medium">{d.label}</p>
                  <p className="text-[11px] text-muted-foreground">{d.sub}</p>
                </div>
              </button>
            ))}
          </div>

          {/* Justification */}
          <div>
            <textarea
              className="w-full rounded-md border border-border bg-background px-3 py-2 text-sm placeholder:text-muted-foreground/50 focus:outline-none focus:ring-2 focus:ring-primary/30 min-h-20"
              placeholder="Justification (required, min 30 characters)..."
              value={justification}
              onChange={(e) => setJustification(e.target.value)}
            />
            <p className="text-[10px] text-muted-foreground mt-1 tabular-nums">
              {justification.length}/30 {justification.length >= 30 ? "✓" : ""}
            </p>
          </div>

          {/* AI suggestion */}
          {alert.aiSuggestedJustification && (
            <div className="rounded-lg border border-border p-3">
              <div className="flex items-center justify-between mb-1.5">
                <div className="flex items-center gap-1"><AIIndicator size={11} /><span className="text-[10px] font-semibold">AI-Suggested Justification</span></div>
                <Button size="sm" variant="outline" className="h-6 text-[10px] px-2" onClick={() => setJustification(alert.aiSuggestedJustification!)}>
                  Use This
                </Button>
              </div>
              <p className="text-xs text-muted-foreground leading-relaxed">{alert.aiSuggestedJustification}</p>
            </div>
          )}

          {/* Actions */}
          <div className="flex items-center justify-between pt-2">
            <Button variant="ghost" size="sm">Cancel</Button>
            <Button
              size="sm"
              disabled={!disposition || justification.length < 30}
              onClick={onSubmitNext}
            >
              Submit & Next →
            </Button>
          </div>
        </div>
      </div>
    </ScrollArea>
  );
}
