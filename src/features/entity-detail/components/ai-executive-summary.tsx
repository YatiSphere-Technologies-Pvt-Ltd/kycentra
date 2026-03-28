"use client";

import { AIIndicator, ConfidenceBadge } from "@/components/shared";
import { Button } from "@/components/ui/button";
import { FileDown, Share2 } from "lucide-react";

interface AIExecutiveSummaryProps {
  summary: string;
  confidence: number;
}

export function AIExecutiveSummary({ summary, confidence }: AIExecutiveSummaryProps) {
  return (
    <div className="rounded-xl border border-border bg-card shadow-elevation-1 overflow-hidden" style={{ borderLeft: "4px solid var(--nx-violet-400)", backgroundColor: "var(--nx-violet-50)" }}>
      <div className="px-5 py-4">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <AIIndicator size={16} />
            <h3 className="text-sm font-semibold">AI Executive Summary</h3>
            <ConfidenceBadge value={confidence} />
          </div>
          <div className="flex items-center gap-1.5">
            <Button variant="ghost" size="sm" className="h-7 text-[10px] gap-1"><FileDown className="h-3 w-3" />Export</Button>
            <Button variant="ghost" size="sm" className="h-7 text-[10px] gap-1"><Share2 className="h-3 w-3" />Share</Button>
          </div>
        </div>
        <p className="text-sm text-muted-foreground leading-relaxed">{summary}</p>
        <button type="button" className="mt-2 text-xs font-medium text-primary hover:underline">View Full Reasoning →</button>
      </div>
    </div>
  );
}
