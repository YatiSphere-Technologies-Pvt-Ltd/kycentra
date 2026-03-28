"use client";

import { ScrollArea } from "@/components/ui/scroll-area";
import { Button } from "@/components/ui/button";
import { AIIndicator, ConfidenceBadge } from "@/components/shared";
import { cn } from "@/lib/utils";
import { CheckCircle2 } from "lucide-react";
import type { ApprovalItem } from "../types";

const priorityBorder: Record<string, string> = {
  critical: "var(--nx-rose-700)",
  high: "var(--nx-amber-600)",
  normal: "var(--nx-emerald-600)",
};

const typeLabels: Record<string, string> = {
  screening_disposition: "SCREENING",
  risk_approval: "RISK APPROVAL",
  document_review: "DOCUMENT REVIEW",
  onboarding_approval: "ONBOARDING",
  sar_review: "SAR REVIEW",
  rule_deployment: "RULE DEPLOYMENT",
  periodic_review: "PERIODIC REVIEW",
};

function SLABar({ sla }: { sla: ApprovalItem["sla"] }) {
  const pct = Math.max(0, Math.min(100, (sla.remaining / sla.total) * 100));
  const color = pct > 50 ? "var(--nx-emerald-500)" : pct > 25 ? "var(--nx-amber-500)" : "var(--nx-rose-500)";
  const remaining = sla.remaining >= 1 ? `${sla.remaining.toFixed(0)}h` : `${Math.round(sla.remaining * 60)}m`;

  return (
    <div className="flex items-center gap-2">
      <div className="flex-1 h-1 rounded-full bg-nx-neutral-100">
        <div className="h-full rounded-full transition-all" style={{ width: `${pct}%`, backgroundColor: color }} />
      </div>
      <span className="text-[10px] tabular-nums text-muted-foreground shrink-0">{remaining} left</span>
    </div>
  );
}

interface ApprovalQueueProps {
  items: ApprovalItem[];
  selectedId: string | null;
  checkedIds: Set<string>;
  onSelect: (id: string) => void;
  onToggleCheck: (id: string) => void;
  onQuickApprove: (id: string) => void;
}

export function ApprovalQueue({ items, selectedId, checkedIds, onSelect, onToggleCheck, onQuickApprove }: ApprovalQueueProps) {
  return (
    <div className="flex h-full flex-col border-r border-border">
      <div className="flex items-center justify-between px-4 py-2.5 border-b border-border bg-muted/20">
        <span className="text-xs font-semibold">{items.length} pending approvals</span>
        <label className="flex items-center gap-1.5 text-[10px] text-muted-foreground cursor-pointer">
          <input type="checkbox" className="accent-primary" />Select all
        </label>
      </div>

      <ScrollArea className="flex-1">
        <div className="divide-y divide-border" role="listbox" aria-label="Approval queue">
          {items.map((item) => {
            const isSelected = selectedId === item.id;
            const isChecked = checkedIds.has(item.id);

            return (
              <div
                key={item.id}
                role="option"
                aria-selected={isSelected}
                className={cn(
                  "px-3 py-3 cursor-pointer transition-colors",
                  isSelected ? "bg-nx-indigo-50" : isChecked ? "bg-muted/30" : "hover:bg-muted/20",
                  item.sla.status === "breached" && "bg-nx-rose-50",
                )}
                style={{ borderLeft: isSelected ? "3px solid var(--nx-indigo-500)" : `3px solid ${priorityBorder[item.priority]}` }}
                onClick={() => onSelect(item.id)}
              >
                <div className="flex items-start gap-2">
                  <input
                    type="checkbox"
                    className="mt-1 accent-primary shrink-0"
                    checked={isChecked}
                    onChange={(e) => { e.stopPropagation(); onToggleCheck(item.id); }}
                    onClick={(e) => e.stopPropagation()}
                  />

                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-1.5 text-[10px]">
                      <span>{item.agentIcon}</span>
                      <span className="font-semibold uppercase tracking-wider text-muted-foreground">{typeLabels[item.type] ?? item.type}</span>
                    </div>
                    <p className="text-[13px] font-medium mt-0.5 truncate">
                      {item.entity?.name ?? "Portfolio-wide"} {item.type === "risk_approval" && item.riskChange ? `— ${item.riskChange.beforeScore}→${item.riskChange.afterScore}` : ""}
                    </p>
                    <div className="flex items-center gap-1.5 mt-0.5">
                      <AIIndicator size={9} />
                      <ConfidenceBadge value={Math.round(item.aiConfidence * 100)} />
                      <span className="text-[10px] text-muted-foreground italic truncate">{item.aiSummary.slice(0, 50)}…</span>
                    </div>
                    <div className="mt-1.5">
                      <SLABar sla={item.sla} />
                    </div>
                  </div>

                  {/* Quick approve */}
                  {item.quickApproveAllowed && (
                    <Button
                      size="sm"
                      variant="ghost"
                      className="h-6 px-2 text-[9px] text-nx-emerald-600 hover:bg-nx-emerald-50 shrink-0 mt-1"
                      onClick={(e) => { e.stopPropagation(); onQuickApprove(item.id); }}
                    >
                      <CheckCircle2 className="h-3 w-3 mr-0.5" />Approve
                    </Button>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </ScrollArea>
    </div>
  );
}
