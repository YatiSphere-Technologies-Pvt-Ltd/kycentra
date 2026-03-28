"use client";

import { ScrollArea } from "@/components/ui/scroll-area";
import { Button } from "@/components/ui/button";
import { ConfidenceBar, AIIndicator } from "@/components/shared";
import { DashboardCard } from "@/components/shared/dashboard-card";
import { riskStyles, getTimeUrgencyColor } from "@/lib/styles";
import { parseTimePending } from "@/lib/date-utils";
import type { PendingReview } from "../types";

// ============================================================
// PendingReviews — items requiring human analyst judgment
// ============================================================

interface PendingReviewsProps {
  items: PendingReview[];
  isLoading?: boolean;
  error?: string | null;
  onRetry?: () => void;
  onReview?: (id: string) => void;
  onDismiss?: (id: string) => void;
}

export function PendingReviews({
  items,
  isLoading = false,
  error = null,
  onRetry,
  onReview,
  onDismiss,
}: PendingReviewsProps) {
  return (
    <DashboardCard.Root>
      <DashboardCard.Header
        title="Requires Your Attention"
        badge={
          items.length > 0 ? (
            <span
              className="inline-flex items-center rounded-md px-1.5 py-0.5 text-[11px] font-bold tabular-nums"
              style={{ color: "var(--nx-amber-700)", backgroundColor: "var(--nx-amber-50)" }}
              role="status"
              aria-label={`${items.length} items pending`}
            >
              {items.length}
            </span>
          ) : undefined
        }
      />

      {isLoading && <DashboardCard.Loading rows={4} />}
      {error && <DashboardCard.Error message={error} onRetry={onRetry} />}
      {!isLoading && !error && items.length === 0 && (
        <DashboardCard.Empty message="No items require your attention." />
      )}

      {!isLoading && !error && items.length > 0 && (
        <ScrollArea className="flex-1">
          <div className="divide-y divide-border" role="list" aria-label="Pending review items">
            {items.map((item) => {
              const risk = riskStyles[item.riskTier];
              const minutes = parseTimePending(item.timePending);
              const timeColor = getTimeUrgencyColor(minutes);
              const isOverdue = minutes > 480;

              return (
                <div
                  key={item.id}
                  className="relative px-5 py-4 transition-colors hover:bg-muted/30"
                  style={{ borderLeft: `4px solid ${risk.border}` }}
                  role="listitem"
                  aria-label={`${item.entity} — ${item.type}, ${riskStyles[item.riskTier].label} risk`}
                >
                  {isOverdue && (
                    <span className="sr-only">Overdue — pending over 8 hours</span>
                  )}

                  {/* Title row */}
                  <div className="flex items-start justify-between gap-2">
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center gap-2">
                        <span className="text-[13px] font-semibold truncate">
                          {item.entity}
                        </span>
                        <span className="shrink-0 rounded bg-muted px-1.5 py-0.5 text-[10px] font-medium text-muted-foreground">
                          {item.type}
                        </span>
                      </div>
                      <span className="mt-0.5 block text-[11px] font-mono text-muted-foreground/50">
                        {item.id}
                      </span>
                    </div>
                    <span
                      className="shrink-0 text-[11px] font-medium tabular-nums"
                      style={{ color: timeColor }}
                      aria-label={`Waiting ${item.timePending}${isOverdue ? " — overdue" : ""}`}
                    >
                      {item.timePending}
                    </span>
                  </div>

                  {/* AI recommendation */}
                  <div className="mt-2 flex items-start gap-1.5">
                    <AIIndicator size={12} className="mt-0.5 shrink-0" />
                    <p className="text-xs text-muted-foreground italic leading-relaxed">
                      {item.aiRecommendation}
                    </p>
                  </div>

                  {/* Confidence bar */}
                  <ConfidenceBar value={item.confidence} showLabel className="mt-3" />

                  {/* Actions */}
                  <div className="mt-3 flex items-center gap-2">
                    <Button
                      type="button"
                      size="sm"
                      className="h-7 px-3 text-xs"
                      onClick={() => onReview?.(item.id)}
                    >
                      Review
                    </Button>
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      className="h-7 px-3 text-xs"
                      onClick={() => onDismiss?.(item.id)}
                    >
                      Dismiss
                    </Button>
                  </div>
                </div>
              );
            })}
          </div>
        </ScrollArea>
      )}
    </DashboardCard.Root>
  );
}
