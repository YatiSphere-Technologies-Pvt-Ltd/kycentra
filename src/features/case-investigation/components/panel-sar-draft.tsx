"use client";

import { ScrollArea } from "@/components/ui/scroll-area";
import { AIIndicator, ConfidenceBadge } from "@/components/shared";
import { Button } from "@/components/ui/button";
import { RefreshCw, CheckCircle2, AlertTriangle } from "lucide-react";
import type { CaseDetail } from "../types";

interface SARDraftProps {
  caseData: CaseDetail;
  narrative: string;
}

const qualityChecks = [
  { label: "Subject clearly identified", ok: true },
  { label: "Activity described with specifics", ok: true },
  { label: "Dates and amounts need verification", ok: false },
  { label: "Evidence cited for each finding", ok: true },
  { label: "Written in factual, clear language", ok: true },
  { label: "\"Why suspicious\" needs strengthening", ok: false },
  { label: "No tipping-off language detected", ok: true },
  { label: "Filing institution identified", ok: true },
];

export function PanelSARDraft({ caseData, narrative }: SARDraftProps) {
  return (
    <ScrollArea className="h-full">
      <div className="p-5 space-y-5">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <AIIndicator size={16} />
            <h3 className="text-base font-semibold">SAR Narrative Draft (v{caseData.sarVersion})</h3>
          </div>
          <div className="flex items-center gap-2">
            <ConfidenceBadge value={Math.round(caseData.sarConfidence * 100)} />
            <Button variant="ghost" size="sm" className="gap-1.5 text-xs h-7"><RefreshCw className="h-3 w-3" />Regenerate</Button>
          </div>
        </div>

        {/* SAR metadata */}
        <div className="grid grid-cols-2 gap-3 text-[13px]">
          <div><span className="text-muted-foreground">SAR Reference:</span> <span className="font-mono font-medium">{caseData.sarReference}</span></div>
          <div><span className="text-muted-foreground">Regulator:</span> <span className="font-medium">FinCEN (United States)</span></div>
          <div><span className="text-muted-foreground">SAR Type:</span> <span className="font-medium">Initial</span></div>
          <div><span className="text-muted-foreground">Activity Type:</span> <span className="font-medium">Sanctions / TF</span></div>
        </div>

        {/* Narrative */}
        <div>
          <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-2">Narrative</p>
          <div
            className="rounded-lg border border-border p-4 text-sm leading-relaxed whitespace-pre-line"
            style={{ borderLeft: "3px solid var(--nx-violet-300)" }}
          >
            {narrative.split(/\[EV-\d+\]/g).map((segment, i) => {
              const match = narrative.match(/\[EV-\d+\]/g);
              return (
                <span key={i}>
                  {segment}
                  {match?.[i] && (
                    <span className="inline-flex rounded bg-nx-indigo-50 px-1 py-0.5 text-[10px] font-semibold text-nx-indigo-600 mx-0.5 cursor-pointer hover:bg-nx-indigo-100">
                      {match[i]}
                    </span>
                  )}
                </span>
              );
            })}
          </div>
          <div className="mt-2 flex items-center gap-3 text-xs text-muted-foreground">
            <span className="tabular-nums">{narrative.split(/\s+/).length} words</span>
            <span>·</span>
            <span>Recommended: 500-1500</span>
            <span className="ml-auto text-nx-emerald-600">Auto-saved ✓</span>
          </div>
        </div>

        {/* Quality checklist */}
        <div>
          <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-2">SAR Quality Assessment</p>
          <div className="space-y-1.5">
            {qualityChecks.map((c) => (
              <div key={c.label} className="flex items-center gap-2 text-[13px]">
                {c.ok ? <CheckCircle2 className="h-3.5 w-3.5 text-nx-emerald-500" /> : <AlertTriangle className="h-3.5 w-3.5 text-nx-amber-500" />}
                <span className={c.ok ? "text-muted-foreground" : "text-foreground"}>{c.label}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </ScrollArea>
  );
}
