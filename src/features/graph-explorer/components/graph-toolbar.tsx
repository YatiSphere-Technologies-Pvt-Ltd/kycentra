"use client";

import { Button } from "@/components/ui/button";
import { Search, SlidersHorizontal, Maximize, Download, AlertTriangle, ZoomIn, ZoomOut } from "lucide-react";

interface GraphToolbarProps {
  anomalyCount: number;
  onToggleAnomalies: () => void;
  onFit: () => void;
  onZoomIn: () => void;
  onZoomOut: () => void;
}

export function GraphToolbar({ anomalyCount, onToggleAnomalies, onFit, onZoomIn, onZoomOut }: GraphToolbarProps) {
  return (
    <div className="absolute top-4 left-4 right-4 z-20 flex items-center gap-2 rounded-xl bg-card/92 backdrop-blur-xl border border-border px-3 py-2 shadow-elevation-2">
      {/* Search */}
      <div className="relative flex-1 max-w-xs">
        <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-muted-foreground/50" />
        <input
          type="text"
          placeholder="Search entities..."
          className="h-8 w-full rounded-md border border-border bg-background pl-8 pr-3 text-xs placeholder:text-muted-foreground/40 focus:outline-none focus:ring-1 focus:ring-primary/30"
        />
      </div>

      <div className="h-5 w-px bg-border" />

      {/* View controls */}
      <Button variant="ghost" size="sm" className="h-8 text-xs gap-1"><SlidersHorizontal className="h-3 w-3" />Filters</Button>
      <Button variant="ghost" size="sm" className="h-8 text-xs gap-1" onClick={onZoomIn}><ZoomIn className="h-3.5 w-3.5" /></Button>
      <Button variant="ghost" size="sm" className="h-8 text-xs gap-1" onClick={onZoomOut}><ZoomOut className="h-3.5 w-3.5" /></Button>
      <Button variant="ghost" size="sm" className="h-8 text-xs gap-1" onClick={onFit}><Maximize className="h-3 w-3" />Fit</Button>

      <div className="h-5 w-px bg-border" />

      <Button variant="ghost" size="sm" className="h-8 text-xs gap-1"><Download className="h-3 w-3" />Export</Button>
      <Button
        variant="ghost"
        size="sm"
        className="h-8 text-xs gap-1"
        onClick={onToggleAnomalies}
      >
        <AlertTriangle className="h-3 w-3" />
        Anomalies
        {anomalyCount > 0 && (
          <span className="flex h-4 w-4 items-center justify-center rounded-full bg-nx-rose-500 text-[9px] font-bold text-white">{anomalyCount}</span>
        )}
      </Button>
    </div>
  );
}
