"use client";

import { useState } from "react";
import { ScrollArea } from "@/components/ui/scroll-area";
import { AIIndicator, ConfidenceBadge } from "@/components/shared";
import { CheckCircle2, Loader2, Clock, Square, XCircle, ChevronDown, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import type { RequirementCategory, RequirementItem } from "../types";

const statusIcon: Record<string, { icon: typeof CheckCircle2; color: string }> = {
  complete: { icon: CheckCircle2, color: "var(--nx-emerald-500)" },
  processing: { icon: Loader2, color: "var(--nx-teal-500)" },
  pending: { icon: Clock, color: "var(--nx-amber-500)" },
  failed: { icon: XCircle, color: "var(--nx-rose-500)" },
};

function CategorySection({ category }: { category: RequirementCategory }) {
  const [open, setOpen] = useState(true);

  return (
    <div className="border-b border-border last:border-b-0">
      <button
        type="button"
        className="flex w-full items-center gap-3 px-5 py-3.5 text-left hover:bg-muted/30 transition-colors"
        onClick={() => setOpen(!open)}
        aria-expanded={open}
      >
        <ChevronDown className={cn("h-4 w-4 text-muted-foreground transition-transform", open && "rotate-180")} />
        <span className="flex-1 text-sm font-semibold">{category.title}</span>
        <span className="text-xs text-muted-foreground tabular-nums">
          {category.completedCount}/{category.totalCount}
        </span>
        {category.note && (
          <span className="text-[10px] text-muted-foreground/60">[{category.note}]</span>
        )}
      </button>

      {open && (
        <div className="px-5 pb-3 space-y-1">
          {category.items.map((item) => {
            const si = statusIcon[item.status] ?? statusIcon.pending;
            const Icon = si.icon;
            return (
              <div key={item.id} className="flex items-start gap-3 py-2 rounded-lg px-2 hover:bg-muted/20 transition-colors">
                <Icon
                  className={cn("h-4 w-4 mt-0.5 shrink-0", item.status === "processing" && "animate-spin")}
                  style={{ color: si.color }}
                />
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <span className="text-[13px] font-medium">{item.label}</span>
                    {item.source === "ai" && <AIIndicator size={11} />}
                  </div>
                  {item.value && (
                    <p className="text-xs text-muted-foreground mt-0.5">{item.value}</p>
                  )}
                  {item.sourceDetail && (
                    <p className="text-[10px] text-muted-foreground/50 mt-0.5">
                      {item.source === "ai" ? "🤖 " : "👤 "}{item.sourceDetail}
                    </p>
                  )}
                </div>
                <span className="text-[10px] font-medium shrink-0" style={{ color: si.color }}>
                  {item.status === "complete" ? "Done" : item.status === "processing" ? "Processing" : item.status === "pending" ? "Pending" : "Failed"}
                </span>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

export function RequirementsChecklist({ categories, confidence }: { categories: RequirementCategory[]; confidence: number }) {
  return (
    <div className="flex h-full flex-col rounded-xl border border-border bg-card shadow-elevation-1 overflow-hidden">
      <div className="border-b border-border px-5 py-4">
        <div className="flex items-center justify-between">
          <h3 className="text-base font-semibold">Onboarding Requirements</h3>
          <Button size="sm" variant="outline" className="gap-1.5 h-7 text-xs"><Plus className="h-3 w-3" />Add Item</Button>
        </div>
        <div className="flex items-center gap-2 mt-1.5 text-xs text-muted-foreground">
          <AIIndicator size={12} />
          <span>Auto-generated based on: Corporate entity, Germany (EU), Asset Management, CDD level</span>
          <ConfidenceBadge value={confidence} />
        </div>
      </div>
      <ScrollArea className="flex-1">
        {categories.map((cat) => (
          <CategorySection key={cat.title} category={cat} />
        ))}
      </ScrollArea>
    </div>
  );
}
