"use client";

import { useState } from "react";
import { ChevronDown } from "lucide-react";
import { cn } from "@/lib/utils";

export function GraphLegend() {
  const [open, setOpen] = useState(true);

  return (
    <div className="absolute bottom-12 left-1/2 -translate-x-1/2 z-20">
      <button
        type="button"
        className="flex items-center gap-1 rounded-t-lg bg-card/92 backdrop-blur-xl border border-b-0 border-border px-3 py-1 text-[10px] font-medium text-muted-foreground mx-auto"
        onClick={() => setOpen(!open)}
      >
        Legend <ChevronDown className={cn("h-3 w-3 transition-transform", !open && "rotate-180")} />
      </button>
      {open && (
        <div className="rounded-xl bg-card/92 backdrop-blur-xl border border-border px-4 py-2.5 shadow-elevation-1">
          <div className="flex flex-wrap items-center gap-x-5 gap-y-1.5 text-[10px] text-muted-foreground">
            <span className="font-semibold">NODES:</span>
            <span>🏢 Company</span>
            <span>👤 Person</span>
            <span>🏛 Trust</span>
            <span>📊 Fund</span>
            <span>⚠ Anomaly</span>
            <span>🚫 Sanctioned</span>
            <span className="w-px h-3 bg-border" />
            <span className="font-semibold">EDGES:</span>
            <span>── Ownership</span>
            <span>- - Beneficial</span>
            <span>··· Officer</span>
            <span className="w-px h-3 bg-border" />
            <span className="font-semibold">RISK:</span>
            <span className="text-nx-risk-critical">● Critical</span>
            <span className="text-nx-risk-high">● High</span>
            <span className="text-nx-risk-medium">● Medium</span>
            <span className="text-nx-risk-low">● Low</span>
          </div>
        </div>
      )}
    </div>
  );
}
