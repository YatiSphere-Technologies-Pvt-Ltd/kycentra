"use client";

import { ConfidenceBadge, AIIndicator } from "@/components/shared";
import { RiskBadge } from "@/components/shared";
import { AlertTriangle, Clock, ShieldCheck, CalendarClock } from "lucide-react";
import type { Entity } from "../types";

interface QuickSummaryProps {
  entity: Entity;
}

function daysBetween(a: string, b: string): number {
  return Math.round((new Date(b).getTime() - new Date(a).getTime()) / (1000 * 60 * 60 * 24));
}

export function QuickSummary({ entity }: QuickSummaryProps) {
  const daysSinceReview = daysBetween(entity.lastReviewed, new Date().toISOString());
  const daysUntilDue = daysBetween(new Date().toISOString(), entity.nextReviewDue);
  const reviewOverdue = daysUntilDue < 0;

  return (
    <div className="flex flex-wrap items-center gap-3 text-xs">
      {/* Risk score — compact inline */}
      <div className="flex items-center gap-1.5 rounded-lg border border-border bg-card px-3 py-1.5">
        <ShieldCheck className="h-3.5 w-3.5 text-muted-foreground" />
        <span className="text-muted-foreground">Risk:</span>
        <span className="font-bold tabular-nums">{entity.riskScore}/100</span>
        <RiskBadge tier={entity.riskTier} compact className="text-[9px] px-1.5" />
      </div>

      {/* AI confidence */}
      <div className="flex items-center gap-1.5 rounded-lg border border-border bg-card px-3 py-1.5">
        <AIIndicator size={12} />
        <span className="text-muted-foreground">AI:</span>
        <ConfidenceBadge value={Math.round(entity.aiConfidence * 100)} />
      </div>

      {/* Open alerts */}
      <div className="flex items-center gap-1.5 rounded-lg border border-border bg-card px-3 py-1.5">
        <AlertTriangle className="h-3.5 w-3.5 text-muted-foreground" />
        <span className="text-muted-foreground">Alerts:</span>
        <span className={`font-bold tabular-nums ${entity.openAlerts > 0 ? "text-nx-risk-high" : ""}`}>{entity.openAlerts}</span>
      </div>

      {/* Last reviewed */}
      <div className="flex items-center gap-1.5 rounded-lg border border-border bg-card px-3 py-1.5">
        <Clock className="h-3.5 w-3.5 text-muted-foreground" />
        <span className="text-muted-foreground">Reviewed:</span>
        <span
          className="font-bold tabular-nums"
          style={{ color: daysSinceReview > 365 ? "var(--nx-amber-600)" : undefined }}
        >
          {daysSinceReview}d ago
        </span>
      </div>

      {/* Divider */}
      <div className="h-4 w-px bg-border hidden md:block" />

      {/* Context info — inline */}
      <span className="text-muted-foreground">
        Due:{" "}
        <span className={reviewOverdue ? "font-semibold text-nx-risk-high" : daysUntilDue <= 30 ? "font-semibold text-nx-risk-medium" : "font-medium"}>
          {new Date(entity.nextReviewDue).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}
          {" "}({reviewOverdue ? "overdue" : `${daysUntilDue}d`})
        </span>
      </span>
      <span className="text-muted-foreground hidden lg:inline">Since: {new Date(entity.clientSince).getFullYear()}</span>
      <span className="text-muted-foreground hidden lg:inline">RM: {entity.relationshipManager.name}</span>
    </div>
  );
}
