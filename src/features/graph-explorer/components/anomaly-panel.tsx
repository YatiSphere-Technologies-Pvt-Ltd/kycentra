"use client";

import { ScrollArea } from "@/components/ui/scroll-area";
import { Button } from "@/components/ui/button";
import { AIIndicator, ConfidenceBadge } from "@/components/shared";
import { X } from "lucide-react";
import type { GraphAnomaly } from "../types";

const severityStyles: Record<string, { bg: string; border: string }> = {
  critical: { bg: "var(--nx-rose-50)", border: "var(--nx-risk-critical)" },
  high: { bg: "var(--nx-amber-50)", border: "var(--nx-amber-600)" },
  medium: { bg: "var(--nx-neutral-50)", border: "var(--nx-neutral-400)" },
};

interface AnomalyPanelProps {
  anomalies: GraphAnomaly[];
  onClose: () => void;
  onHighlight: (nodeIds: string[]) => void;
}

export function AnomalyPanel({ anomalies, onClose, onHighlight }: AnomalyPanelProps) {
  return (
    <div className="absolute left-0 top-0 bottom-0 w-80 z-30 border-r border-border bg-card shadow-elevation-3 flex flex-col">
      <div className="flex items-center justify-between px-4 py-3 border-b border-border">
        <div>
          <span className="text-sm font-semibold">⚠ Anomalies Detected ({anomalies.length})</span>
          <p className="text-[10px] text-muted-foreground">AI analysis of ownership patterns</p>
        </div>
        <button type="button" onClick={onClose} className="text-muted-foreground hover:text-foreground" aria-label="Close"><X className="h-4 w-4" /></button>
      </div>

      <ScrollArea className="flex-1">
        <div className="p-3 space-y-3">
          {anomalies.map((a) => {
            const ss = severityStyles[a.severity] ?? severityStyles.medium;
            return (
              <div
                key={a.id}
                className="rounded-lg border p-3 space-y-2"
                style={{ backgroundColor: ss.bg, borderLeft: `4px solid ${ss.border}`, borderColor: ss.border }}
              >
                <div className="flex items-center justify-between">
                  <span className="text-xs font-semibold uppercase tracking-wider" style={{ color: ss.border }}>{a.severity}</span>
                  <ConfidenceBadge value={Math.round(a.confidence * 100)} />
                </div>
                <p className="text-[13px] font-semibold">{a.title}</p>
                {a.entity && <p className="text-xs text-muted-foreground">{a.entity}</p>}

                <ul className="space-y-0.5">
                  {a.indicators.map((ind) => (
                    <li key={ind} className="text-[11px] text-muted-foreground flex items-start gap-1.5">
                      <span className="mt-0.5">•</span>{ind}
                    </li>
                  ))}
                </ul>

                <div className="rounded border border-border p-2 bg-card/50">
                  <div className="flex items-center gap-1 mb-1"><AIIndicator size={10} /><span className="text-[10px] font-semibold">AI Analysis</span></div>
                  <p className="text-[10px] text-muted-foreground leading-relaxed">{a.aiAnalysis}</p>
                </div>

                <div className="flex gap-2">
                  <Button size="sm" variant="outline" className="h-6 text-[10px] px-2" onClick={() => onHighlight(a.relatedNodes)}>
                    Highlight
                  </Button>
                  <Button size="sm" variant="outline" className="h-6 text-[10px] px-2">
                    Investigate
                  </Button>
                </div>
              </div>
            );
          })}
        </div>
      </ScrollArea>
    </div>
  );
}
