"use client";

import { Button } from "@/components/ui/button";
import { RefreshCw, Maximize2 } from "lucide-react";

interface GraphStatusBarProps {
  nodeCount: number;
  edgeCount: number;
  zoom: number;
}

export function GraphStatusBar({ nodeCount, edgeCount, zoom }: GraphStatusBarProps) {
  return (
    <div className="absolute bottom-0 left-0 right-0 z-20 flex h-8 items-center justify-between border-t border-border bg-muted/80 backdrop-blur-sm px-4 text-[11px] text-muted-foreground tabular-nums">
      <div className="flex items-center gap-4">
        <span>Nodes: {nodeCount}</span>
        <span>Edges: {edgeCount}</span>
        <span>Zoom: {Math.round(zoom * 100)}%</span>
        <span>Last updated: 2 min ago</span>
      </div>
      <div className="flex items-center gap-1">
        <Button variant="ghost" size="sm" className="h-6 text-[10px] gap-1 px-2"><RefreshCw className="h-3 w-3" />Refresh</Button>
        <Button variant="ghost" size="sm" className="h-6 text-[10px] gap-1 px-2"><Maximize2 className="h-3 w-3" />Fullscreen</Button>
      </div>
    </div>
  );
}
