"use client";

import { ScrollArea } from "@/components/ui/scroll-area";
import { AIIndicator } from "@/components/shared";
import { riskStyles } from "@/lib/styles";
import { cn } from "@/lib/utils";
import type { ScreeningAlert } from "../types";

const listStyles: Record<string, { fg: string; bg: string }> = {
  "OFAC SDN": { fg: "var(--nx-rose-700)", bg: "var(--nx-rose-50)" },
  "EU Consolidated": { fg: "var(--nx-indigo-700)", bg: "var(--nx-indigo-50)" },
  "UK HMT": { fg: "var(--nx-indigo-600)", bg: "var(--nx-indigo-50)" },
  "UN Consolidated": { fg: "var(--nx-teal-700)", bg: "var(--nx-teal-50)" },
  "PEP Database": { fg: "var(--nx-violet-700)", bg: "var(--nx-violet-50)" },
  "Adverse Media": { fg: "var(--nx-amber-700)", bg: "var(--nx-amber-50)" },
};

function scoreColor(score: number): string {
  if (score >= 0.8) return "var(--nx-rose-600)";
  if (score >= 0.6) return "var(--nx-amber-600)";
  return "var(--nx-neutral-500)";
}

function timeColor(time: string): string {
  if (time.includes("h") && parseInt(time) >= 8) return "var(--nx-rose-600)";
  if (time.includes("h") && parseInt(time) >= 4) return "var(--nx-amber-600)";
  return "var(--nx-neutral-400)";
}

interface AlertQueueProps {
  alerts: ScreeningAlert[];
  selectedId: string | null;
  checkedIds: Set<string>;
  onSelect: (id: string) => void;
  onToggleCheck: (id: string) => void;
}

export function AlertQueue({ alerts, selectedId, checkedIds, onSelect, onToggleCheck }: AlertQueueProps) {
  return (
    <div className="flex h-full flex-col border-r border-border">
      <div className="flex items-center justify-between px-4 py-2.5 border-b border-border bg-muted/20">
        <span className="text-xs font-semibold">{alerts.length} alerts pending</span>
        <label className="flex items-center gap-1.5 text-[10px] text-muted-foreground cursor-pointer">
          <input type="checkbox" className="accent-primary" onChange={() => {}} />
          Select all
        </label>
      </div>

      <ScrollArea className="flex-1">
        <div className="divide-y divide-border" role="listbox" aria-label="Screening alerts">
          {alerts.map((alert) => {
            const risk = riskStyles[alert.riskTier];
            const ls = listStyles[alert.list] ?? { fg: "var(--nx-neutral-600)", bg: "var(--nx-neutral-100)" };
            const isSelected = selectedId === alert.id;
            const isChecked = checkedIds.has(alert.id);

            return (
              <div
                key={alert.id}
                role="option"
                aria-selected={isSelected}
                className={cn(
                  "flex items-start gap-2 px-3 py-2.5 cursor-pointer transition-colors",
                  isSelected ? "bg-nx-indigo-50" : isChecked ? "bg-muted/30" : "hover:bg-muted/20",
                )}
                style={{ borderLeft: isSelected ? "3px solid var(--nx-indigo-500)" : `3px solid ${risk.fg}` }}
                onClick={() => onSelect(alert.id)}
              >
                {/* Checkbox */}
                <input
                  type="checkbox"
                  className="mt-1 accent-primary shrink-0"
                  checked={isChecked}
                  onChange={(e) => { e.stopPropagation(); onToggleCheck(alert.id); }}
                  onClick={(e) => e.stopPropagation()}
                  aria-label={`Select ${alert.entityName}`}
                />

                {/* Content */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <span className="text-[13px] font-medium truncate">{alert.entityName}</span>
                  </div>
                  <div className="flex items-center gap-1.5 mt-0.5">
                    <span className="text-[10px] text-muted-foreground">{alert.list === "Adverse Media" ? "Adverse Media" : "Screening Match"}</span>
                    <span className="text-[10px]" style={{ color: risk.fg }}>· {riskStyles[alert.riskTier].label}</span>
                  </div>
                  <div className="flex items-center gap-1 mt-0.5">
                    <AIIndicator size={9} />
                    <span className="text-[10px] text-muted-foreground italic truncate">{alert.aiSummary.slice(0, 60)}…</span>
                  </div>
                </div>

                {/* Right stats */}
                <div className="flex flex-col items-end gap-1 shrink-0">
                  <span className="inline-flex rounded-md px-1.5 py-0.5 text-[9px] font-bold" style={{ color: ls.fg, backgroundColor: ls.bg }}>
                    {alert.list.length > 12 ? alert.list.slice(0, 10) + "…" : alert.list}
                  </span>
                  <span className="text-[11px] font-semibold tabular-nums" style={{ color: scoreColor(alert.matchScore) }}>
                    {Math.round(alert.matchScore * 100)}%
                  </span>
                  <span className="text-[10px] tabular-nums" style={{ color: timeColor(alert.timePending) }}>
                    {alert.timePending}
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      </ScrollArea>
    </div>
  );
}
