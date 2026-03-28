"use client";

import { Button } from "@/components/ui/button";
import { Timer, ArrowUpRight } from "lucide-react";
import type { CaseDetail } from "../types";

export function ActionBar({ caseData }: { caseData: CaseDetail }) {
  const slaPct = ((caseData.sla.total - caseData.sla.remaining) / caseData.sla.total) * 100;
  const slaColor = caseData.sla.remaining > caseData.sla.total * 0.5 ? "var(--nx-emerald-600)" : caseData.sla.remaining > caseData.sla.total * 0.25 ? "var(--nx-amber-600)" : "var(--nx-rose-600)";

  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 flex h-16 items-center justify-between border-t border-border bg-card px-6 shadow-elevation-3">
      <div className="flex items-center gap-6 text-sm">
        <span className="flex items-center gap-1.5 text-muted-foreground tabular-nums">
          <Timer className="h-4 w-4" />{caseData.elapsedTime}
        </span>
        <span className="text-muted-foreground">Phase: <span className="font-medium text-foreground capitalize">{caseData.phase}</span></span>
        <span className="flex items-center gap-2">
          <span className="text-muted-foreground">SLA:</span>
          <span className="font-medium tabular-nums" style={{ color: slaColor }}>{caseData.sla.remaining}d remaining</span>
          <div className="w-16 h-1.5 rounded-full bg-nx-neutral-100">
            <div className="h-full rounded-full" style={{ width: `${slaPct}%`, backgroundColor: slaColor }} />
          </div>
        </span>
      </div>

      <div className="flex items-center gap-3">
        <Button variant="ghost" size="sm">Save Draft</Button>
        <Button variant="outline" size="sm" className="gap-1.5 text-nx-amber-600 border-nx-amber-200 hover:bg-nx-amber-50">
          <ArrowUpRight className="h-3.5 w-3.5" />Escalate to MLRO
        </Button>
        <Button size="sm">Submit for Approval</Button>
      </div>
    </div>
  );
}
