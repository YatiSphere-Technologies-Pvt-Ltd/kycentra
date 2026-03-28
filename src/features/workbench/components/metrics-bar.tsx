"use client";

import { TrendingDown, TrendingUp, Minus } from "lucide-react";
import type { Metric } from "../types";

// ============================================================
// MetricsBar — 6 KPI cards in a responsive grid
// ============================================================

interface MetricsBarProps {
  metrics: Metric[];
}

function getTrendDirection(metric: Metric): "positive" | "negative" | "neutral" {
  if (metric.trend === 0) return "neutral";
  // For count metrics like "Pending Reviews", increasing is negative
  if (metric.isCount) return metric.trend > 0 ? "negative" : "positive";
  // For "AI Decision Accuracy", increasing is positive
  if (metric.label.includes("Accuracy") || metric.label.includes("Jurisdictions")) {
    return metric.trend > 0 ? "positive" : "negative";
  }
  // For time/rate metrics, decreasing is positive (faster/lower is better)
  return metric.trend < 0 ? "positive" : "negative";
}

export function MetricsBar({ metrics }: MetricsBarProps) {
  return (
    <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6">
      {metrics.map((m) => {
        const direction = getTrendDirection(m);
        const trendColor =
          direction === "positive"
            ? "var(--nx-trend-positive)"
            : direction === "negative"
              ? "var(--nx-trend-negative)"
              : "var(--nx-trend-flat)";

        const TrendIcon = m.trend === 0 ? Minus : m.trend < 0 ? TrendingDown : TrendingUp;

        return (
          <div
            key={m.label}
            className="rounded-xl border border-border bg-card p-4 shadow-elevation-1 transition-shadow hover:shadow-elevation-2"
            role="status"
            aria-label={`${m.label}: ${m.value}${m.trend !== 0 ? `, ${direction} trend` : ""}`}
          >
            <p className="text-[11px] font-medium text-muted-foreground">{m.label}</p>
            <p className="mt-1.5 text-xl font-bold tabular-nums tracking-tight">{m.value}</p>
            {(m.trend !== 0 || m.unit) && (
              <div className="mt-1.5 flex items-center gap-1">
                <TrendIcon className="h-3 w-3" style={{ color: trendColor }} aria-hidden="true" />
                <span className="text-[11px] font-medium tabular-nums" style={{ color: trendColor }}>
                  {m.trend === 0 ? "—" : `${Math.abs(m.trend)}%`}
                </span>
                {m.unit && (
                  <span className="text-[10px] text-muted-foreground/60 ml-0.5">{m.unit}</span>
                )}
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}
