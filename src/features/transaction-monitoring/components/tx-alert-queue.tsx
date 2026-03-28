"use client";

import { ScrollArea } from "@/components/ui/scroll-area";
import { AIIndicator } from "@/components/shared";
import { riskStyles } from "@/lib/styles";
import { cn } from "@/lib/utils";
import type { TxAlert } from "../types";

const typeColors: Record<string, { fg: string; bg: string }> = {
  structuring: { fg: "var(--nx-rose-700)", bg: "var(--nx-rose-50)" },
  velocity: { fg: "var(--nx-amber-700)", bg: "var(--nx-amber-50)" },
  round_amount: { fg: "var(--nx-amber-600)", bg: "var(--nx-amber-50)" },
  high_risk_geo: { fg: "var(--nx-rose-700)", bg: "var(--nx-rose-50)" },
  unusual_pattern: { fg: "var(--nx-indigo-700)", bg: "var(--nx-indigo-50)" },
  layering: { fg: "var(--nx-rose-800)", bg: "var(--nx-rose-50)" },
  rapid_movement: { fg: "var(--nx-amber-700)", bg: "var(--nx-amber-50)" },
  dormant_reactivation: { fg: "var(--nx-neutral-600)", bg: "var(--nx-neutral-100)" },
};

interface TxAlertQueueProps {
  alerts: TxAlert[];
  selectedId: string | null;
  onSelect: (id: string) => void;
}

export function TxAlertQueue({ alerts, selectedId, onSelect }: TxAlertQueueProps) {
  return (
    <div className="flex h-full flex-col border-r border-border">
      <div className="flex items-center justify-between px-4 py-2.5 border-b border-border bg-muted/20">
        <span className="text-xs font-semibold">{alerts.length} transaction alerts</span>
      </div>

      <ScrollArea className="flex-1">
        <div className="divide-y divide-border" role="listbox" aria-label="Transaction alerts">
          {alerts.map((alert) => {
            const risk = riskStyles[alert.riskTier];
            const tc = typeColors[alert.type] ?? typeColors.unusual_pattern;
            const isSelected = selectedId === alert.id;

            return (
              <div
                key={alert.id}
                role="option"
                aria-selected={isSelected}
                className={cn(
                  "px-3 py-3 cursor-pointer transition-colors",
                  isSelected ? "bg-nx-indigo-50" : "hover:bg-muted/20",
                )}
                style={{ borderLeft: isSelected ? "3px solid var(--nx-indigo-500)" : `3px solid ${risk.fg}` }}
                onClick={() => onSelect(alert.id)}
              >
                <div className="flex items-center justify-between gap-2">
                  <span className="text-[13px] font-medium truncate">{alert.entityName}</span>
                  <span className="text-xs font-bold tabular-nums shrink-0">{alert.amount}</span>
                </div>

                <div className="flex items-center gap-1.5 mt-1">
                  <span className="inline-flex rounded-md px-1.5 py-0.5 text-[9px] font-bold" style={{ color: tc.fg, backgroundColor: tc.bg }}>
                    {alert.typeLabel}
                  </span>
                  <span className="text-[10px] text-muted-foreground">→ {alert.counterpartyJurisdiction}</span>
                </div>

                <div className="flex items-center gap-1 mt-1">
                  <AIIndicator size={9} />
                  <span className="text-[10px] text-muted-foreground italic truncate">{alert.aiSummary.slice(0, 55)}…</span>
                </div>

                <div className="flex items-center justify-between mt-1">
                  <span className="text-[10px]" style={{ color: risk.fg }}>{riskStyles[alert.riskTier].label}</span>
                  <span className="text-[10px] text-muted-foreground tabular-nums">{alert.timePending}</span>
                </div>
              </div>
            );
          })}
        </div>
      </ScrollArea>
    </div>
  );
}
