"use client";

import { ConfidenceBadge } from "@/components/shared";
import { cn } from "@/lib/utils";
import { Clock, Sparkles } from "lucide-react";
import type { TimelineEvent } from "../types";

interface ActivityTabProps { events: TimelineEvent[] }

export function TabActivity({ events }: ActivityTabProps) {
  return (
    <div className="space-y-5">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Clock className="h-3.5 w-3.5 text-muted-foreground/40" />
          <span className="text-[12px] font-bold">Activity History</span>
          <span className="text-[10px] text-muted-foreground">{events.length} events</span>
        </div>
      </div>

      {/* Timeline table */}
      <div className="rounded-lg border border-border bg-card overflow-hidden">
        <table className="w-full text-[11px]">
          <thead>
            <tr className="border-b border-border bg-muted/20">
              {["Time", "Source", "Action", "Details", "Confidence"].map((h) => (
                <th key={h} className="text-left font-bold text-muted-foreground uppercase tracking-wider px-4 py-2 whitespace-nowrap">{h}</th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-border">
            {events.map((e) => (
              <tr key={e.id} className="hover:bg-muted/10 transition-colors">
                <td className="px-4 py-2.5 tabular-nums text-muted-foreground whitespace-nowrap">{e.timestamp}</td>
                <td className="px-4 py-2.5">
                  <div className="flex items-center gap-1.5">
                    <div className={cn("h-1.5 w-1.5 rounded-full shrink-0", e.type === "ai" ? "bg-foreground/40" : e.type === "human" ? "bg-foreground" : "bg-muted-foreground/30")} />
                    <span className="font-bold text-[10px] uppercase tracking-wider text-muted-foreground">{e.agent ?? e.actor ?? "System"}</span>
                  </div>
                </td>
                <td className="px-4 py-2.5 font-medium">{e.action}</td>
                <td className="px-4 py-2.5 max-w-64 text-muted-foreground truncate">{e.detail ?? "—"}</td>
                <td className="px-4 py-2.5">{e.confidence ? <ConfidenceBadge value={e.confidence} /> : <span className="text-muted-foreground/30">—</span>}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
