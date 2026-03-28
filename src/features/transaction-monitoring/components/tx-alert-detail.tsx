"use client";

import { useState } from "react";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Button } from "@/components/ui/button";
import { AIIndicator, ConfidenceBadge, RiskBadge } from "@/components/shared";
import { DashboardCard } from "@/components/shared/dashboard-card";
import { ExternalLink, AlertTriangle, ArrowRight, Banknote, Globe, Users, Clock, Hash } from "lucide-react";
import { riskStyles } from "@/lib/styles";
import { cn } from "@/lib/utils";
import type { TxAlert, TxDisposition } from "../types";

const dispositions: { value: TxDisposition; label: string; sub: string; color: string }[] = [
  { value: "suspicious", label: "Suspicious — File SAR", sub: "Create case, block transaction if needed", color: "var(--nx-rose-600)" },
  { value: "not_suspicious", label: "Not Suspicious — Clear", sub: "Legitimate business activity", color: "var(--nx-emerald-600)" },
  { value: "escalate", label: "Escalate to MLRO", sub: "Needs senior review before determination", color: "var(--nx-amber-600)" },
  { value: "request_info", label: "Request Information", sub: "Need RM confirmation or documentation", color: "var(--nx-indigo-600)" },
];

interface TxAlertDetailProps {
  alert: TxAlert;
  onSubmitNext: () => void;
}

export function TxAlertDetail({ alert, onSubmitNext }: TxAlertDetailProps) {
  const [disposition, setDisposition] = useState<TxDisposition | null>(null);
  const [justification, setJustification] = useState("");
  const risk = riskStyles[alert.riskTier];

  return (
    <ScrollArea className="h-full">
      <div className="p-5 space-y-5">
        {/* Header */}
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="font-mono text-xs text-muted-foreground">{alert.id}</span>
            <RiskBadge tier={alert.riskTier} />
            <span className="inline-flex rounded-md px-1.5 py-0.5 text-[10px] font-bold" style={{ color: alert.status === "investigating" ? "var(--nx-indigo-600)" : "var(--nx-amber-600)", backgroundColor: alert.status === "investigating" ? "var(--nx-indigo-50)" : "var(--nx-amber-50)" }}>
              {alert.status === "investigating" ? "Investigating" : "Pending"}
            </span>
          </div>
          <h3 className="text-base font-semibold">{alert.entityName}</h3>
          <p className="text-xs text-muted-foreground mt-0.5">{alert.description}</p>
        </div>

        {/* Transaction details */}
        <div className="grid grid-cols-2 gap-3 rounded-lg border border-border p-4">
          <div className="flex items-center gap-2 text-sm">
            <Banknote className="h-4 w-4 text-muted-foreground shrink-0" />
            <div><span className="text-muted-foreground text-xs">Amount:</span><br /><span className="font-bold tabular-nums">{alert.amount} {alert.currency}</span></div>
          </div>
          <div className="flex items-center gap-2 text-sm">
            <Globe className="h-4 w-4 text-muted-foreground shrink-0" />
            <div><span className="text-muted-foreground text-xs">Counterparty:</span><br /><span className="font-medium">{alert.counterparty}</span><br /><span className="text-xs text-muted-foreground">{alert.counterpartyJurisdiction}</span></div>
          </div>
          <div className="flex items-center gap-2 text-sm">
            <Clock className="h-4 w-4 text-muted-foreground shrink-0" />
            <div><span className="text-muted-foreground text-xs">Date:</span><br /><span className="font-medium">{alert.transactionDate}</span></div>
          </div>
          {alert.transactionCount && (
            <div className="flex items-center gap-2 text-sm">
              <Hash className="h-4 w-4 text-muted-foreground shrink-0" />
              <div><span className="text-muted-foreground text-xs">Transactions:</span><br /><span className="font-bold tabular-nums">{alert.transactionCount} related</span></div>
            </div>
          )}
        </div>

        {/* AI Assessment */}
        <div className="rounded-lg border border-border p-4" style={{ borderLeft: "4px solid var(--nx-violet-400)" }}>
          <div className="flex items-center gap-2 mb-2">
            <AIIndicator size={14} />
            <span className="text-xs font-semibold">Risk Agent Assessment</span>
            <ConfidenceBadge value={Math.round(alert.aiConfidence * 100)} />
          </div>
          <p className="text-sm text-muted-foreground leading-relaxed">{alert.aiSummary}</p>
          <p className="mt-2 text-sm font-semibold" style={{ color: alert.aiConfidence >= 0.85 ? "var(--nx-rose-600)" : "var(--nx-amber-600)" }}>
            {alert.aiRecommendation}
          </p>
        </div>

        {/* Why flagged */}
        <div className="rounded-lg border border-border p-4">
          <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-2">Detection Rules Triggered</p>
          <div className="space-y-1.5">
            {alert.whyFlagged.map((reason) => (
              <div key={reason} className="flex items-start gap-2 text-xs">
                <AlertTriangle className="h-3 w-3 mt-0.5 shrink-0" style={{ color: risk.fg }} />
                <span className="text-muted-foreground">{reason}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Historical pattern */}
        {alert.historicalPattern && (
          <div className="rounded-lg p-3 text-xs leading-relaxed" style={{ backgroundColor: "var(--nx-amber-50)", borderLeft: "3px solid var(--nx-amber-500)" }}>
            <span className="font-semibold">⚡ Historical Pattern:</span> {alert.historicalPattern}
          </div>
        )}

        {/* Related transactions */}
        {alert.relatedTxIds && alert.relatedTxIds.length > 0 && (
          <div className="rounded-lg border border-border p-3">
            <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-2">Related Transactions ({alert.relatedTxIds.length})</p>
            <div className="flex flex-wrap gap-1.5">
              {alert.relatedTxIds.map((txId) => (
                <span key={txId} className="rounded bg-muted px-2 py-0.5 text-[10px] font-mono text-muted-foreground">{txId}</span>
              ))}
            </div>
          </div>
        )}

        {/* Disposition */}
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

          <textarea
            className="w-full rounded-md border border-border bg-background px-3 py-2 text-sm placeholder:text-muted-foreground/50 focus:outline-none focus:ring-2 focus:ring-primary/30 min-h-20"
            placeholder="Justification (required)..."
            value={justification}
            onChange={(e) => setJustification(e.target.value)}
          />

          <div className="flex items-center justify-between">
            <Button variant="ghost" size="sm">Cancel</Button>
            <Button size="sm" disabled={!disposition || justification.length < 20} onClick={onSubmitNext} className="gap-1.5">
              Submit & Next <ArrowRight className="h-3.5 w-3.5" />
            </Button>
          </div>
        </div>
      </div>
    </ScrollArea>
  );
}
