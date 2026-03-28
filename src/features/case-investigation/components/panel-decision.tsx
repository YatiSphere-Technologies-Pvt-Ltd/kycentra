"use client";

import { useState } from "react";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Button } from "@/components/ui/button";
import { AIIndicator, ConfidenceBadge } from "@/components/shared";
import { CheckCircle2, Square } from "lucide-react";
import { cn } from "@/lib/utils";

const decisions = [
  { value: "file_sar", label: "File SAR", sub: "Suspicious activity confirmed", color: "var(--nx-rose-600)" },
  { value: "close", label: "Close — No SAR", sub: "No suspicious activity warranted", color: "var(--nx-emerald-600)" },
  { value: "escalate", label: "Escalate to MLRO", sub: "Requires senior review", color: "var(--nx-amber-600)" },
  { value: "request_info", label: "Request Additional Information", sub: "Cannot determine yet", color: "var(--nx-indigo-600)" },
  { value: "continue", label: "Continue Investigation", sub: "More analysis needed", color: "var(--nx-neutral-500)" },
];

export function PanelDecision() {
  const [selected, setSelected] = useState<string | null>("continue");

  return (
    <ScrollArea className="h-full">
      <div className="p-5 space-y-5">
        <h3 className="text-base font-semibold">Investigation Decision</h3>

        {/* AI recommendation */}
        <div className="rounded-lg border border-border p-4" style={{ borderLeft: "3px solid var(--nx-violet-400)" }}>
          <div className="flex items-center gap-2 mb-2">
            <AIIndicator size={14} />
            <span className="text-xs font-semibold">AI Recommendation</span>
            <ConfidenceBadge value={72} />
          </div>
          <p className="text-sm text-muted-foreground leading-relaxed">
            Based on evidence assembled, the OFAC match requires definitive resolution before a SAR determination can be made. The PEP association alone warrants Enhanced Due Diligence but does not independently trigger SAR filing. Recommend: resolve OFAC match via registry check, then reassess.
          </p>
        </div>

        {/* Decision options */}
        <div>
          <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-3">Your Decision</p>
          <div className="space-y-2">
            {decisions.map((d) => (
              <button
                key={d.value}
                type="button"
                className={cn(
                  "flex w-full items-start gap-3 rounded-lg border p-3 text-left transition-all",
                  selected === d.value ? "border-primary bg-primary/5" : "border-border hover:bg-muted/30"
                )}
                style={selected === d.value ? { borderLeftWidth: "3px", borderLeftColor: d.color } : undefined}
                onClick={() => setSelected(d.value)}
              >
                <div className={cn(
                  "mt-0.5 h-4 w-4 rounded-full border-2 shrink-0 flex items-center justify-center",
                  selected === d.value ? "border-primary" : "border-nx-neutral-300"
                )}>
                  {selected === d.value && <div className="h-2 w-2 rounded-full bg-primary" />}
                </div>
                <div>
                  <p className="text-sm font-medium">{d.label}</p>
                  <p className="text-xs text-muted-foreground">{d.sub}</p>
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* Contextual form based on selection */}
        {selected === "close" && (
          <div className="rounded-lg border border-border p-4 space-y-3">
            <p className="text-xs font-semibold">Rationale (required, min 200 chars)</p>
            <textarea className="w-full rounded-md border border-border bg-background px-3 py-2 text-sm placeholder:text-muted-foreground/50 min-h-24" placeholder="Why is this activity NOT suspicious? What evidence supports this conclusion?" />
          </div>
        )}

        {selected === "escalate" && (
          <div className="rounded-lg border border-border p-4 space-y-3">
            <p className="text-xs font-semibold">Escalation Reason (required)</p>
            <textarea className="w-full rounded-md border border-border bg-background px-3 py-2 text-sm placeholder:text-muted-foreground/50 min-h-20" placeholder="Why does this need MLRO review?" />
            <div className="space-y-1.5">
              <p className="text-xs font-semibold">Urgency</p>
              {["Standard (2 business days)", "Urgent (same day)", "Immediate (sanctions concern)"].map((opt) => (
                <label key={opt} className="flex items-center gap-2 text-sm cursor-pointer"><input type="radio" name="urgency" className="accent-primary" />{opt}</label>
              ))}
            </div>
          </div>
        )}

        {/* Approval chain */}
        <div className="space-y-3">
          <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Approval Chain</p>
          <p className="text-xs text-muted-foreground">HIGH risk → MLRO Approval required</p>
          <div className="space-y-2">
            {[
              { label: "Analyst: Sarah Chen (you)", done: true },
              { label: "Senior Compliance Officer", done: false },
              { label: "MLRO (after SCO approval)", done: false },
            ].map((step) => (
              <div key={step.label} className="flex items-center gap-2 text-sm">
                {step.done ? <CheckCircle2 className="h-4 w-4 text-nx-emerald-500" /> : <Square className="h-4 w-4 text-muted-foreground/30" />}
                <span className={step.done ? "text-muted-foreground" : ""}>{step.label}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </ScrollArea>
  );
}
