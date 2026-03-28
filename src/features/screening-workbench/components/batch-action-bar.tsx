"use client";

import { Button } from "@/components/ui/button";
import { CheckCircle2, ArrowUpRight, AlertTriangle, Download, X } from "lucide-react";

interface BatchActionBarProps {
  count: number;
  onBatchFalsePositive: () => void;
  onBatchEscalate: () => void;
  onDeselectAll: () => void;
}

export function BatchActionBar({ count, onBatchFalsePositive, onBatchEscalate, onDeselectAll }: BatchActionBarProps) {
  if (count === 0) return null;

  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 flex h-14 items-center justify-between border-t border-border bg-card px-6 shadow-elevation-3 animate-in slide-in-from-bottom duration-200">
      <span className="text-sm font-medium">☑ {count} alerts selected</span>
      <div className="flex items-center gap-2">
        <Button size="sm" variant="outline" className="gap-1.5 h-8 text-xs text-nx-emerald-600 border-nx-emerald-200 hover:bg-nx-emerald-50" onClick={onBatchFalsePositive}>
          <CheckCircle2 className="h-3.5 w-3.5" />Batch: False Positive
        </Button>
        <Button size="sm" variant="outline" className="gap-1.5 h-8 text-xs text-nx-amber-600 border-nx-amber-200 hover:bg-nx-amber-50" onClick={onBatchEscalate}>
          <ArrowUpRight className="h-3.5 w-3.5" />Batch: Escalate
        </Button>
        <Button size="sm" variant="outline" className="gap-1.5 h-8 text-xs">
          <Download className="h-3.5 w-3.5" />Export
        </Button>
        <Button size="sm" variant="ghost" className="gap-1 h-8 text-xs text-muted-foreground" onClick={onDeselectAll}>
          <X className="h-3 w-3" />Deselect
        </Button>
      </div>
    </div>
  );
}
