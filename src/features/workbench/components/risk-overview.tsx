"use client";

import { useMemo } from "react";
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from "recharts";
import { DashboardCard } from "@/components/shared/dashboard-card";
import { riskStyles } from "@/lib/styles";
import type { RiskDistribution, RiskTier } from "../types";

// ============================================================
// RiskOverview — donut chart + breakdown of entity risk tiers
// ============================================================

interface RiskOverviewProps {
  distribution: RiskDistribution;
  alertsToday?: number;
  autoResolvedPct?: number;
  isLoading?: boolean;
  error?: string | null;
  onRetry?: () => void;
}

const tiers: RiskTier[] = ["critical", "high", "medium", "low", "minimal"];

/**
 * Recharts requires raw hex/rgb — CSS vars don't work in SVG fills.
 * These are the resolved values of our OKLCH tokens for chart rendering.
 * Dark mode charts use the same colors since they're high-saturation.
 */
const chartColors: Record<RiskTier, string> = {
  critical: "#8a2020",
  high: "#c33",
  medium: "#b87000",
  low: "#18804a",
  minimal: "#0d8880",
};

export function RiskOverview({
  distribution,
  alertsToday = 0,
  autoResolvedPct = 0,
  isLoading = false,
  error = null,
  onRetry,
}: RiskOverviewProps) {
  const data = useMemo(
    () => tiers.map((t) => ({ name: riskStyles[t].label, value: distribution[t], tier: t })),
    [distribution]
  );

  const total = useMemo(() => data.reduce((sum, d) => sum + d.value, 0), [data]);

  return (
    <DashboardCard.Root>
      <DashboardCard.Header
        title="Risk Overview"
        actions={
          <span className="text-xs text-muted-foreground tabular-nums">
            {total.toLocaleString()} entities
          </span>
        }
      />

      {isLoading && <DashboardCard.Loading rows={6} />}
      {error && <DashboardCard.Error message={error} onRetry={onRetry} />}

      {!isLoading && !error && (
        <DashboardCard.Content className="flex flex-col gap-5">
          {/* Donut chart */}
          <div
            className="mx-auto h-44 w-44"
            role="img"
            aria-label={`Risk distribution chart: ${tiers.map((t) => `${riskStyles[t].label} ${distribution[t]}`).join(", ")}`}
          >
            <ResponsiveContainer width="100%" height="100%" minWidth={0} minHeight={0}>
              <PieChart>
                <Pie
                  data={data}
                  cx="50%"
                  cy="50%"
                  innerRadius={50}
                  outerRadius={75}
                  paddingAngle={2}
                  dataKey="value"
                  stroke="none"
                >
                  {data.map((entry) => (
                    <Cell key={entry.tier} fill={chartColors[entry.tier]} />
                  ))}
                </Pie>
                <Tooltip
                  contentStyle={{
                    fontSize: "12px",
                    borderRadius: "8px",
                    border: "1px solid var(--nx-border-default)",
                    boxShadow: "var(--nx-elevation-2)",
                  }}
                  formatter={(value) => [Number(value).toLocaleString(), "Entities"]}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>

          {/* Legend */}
          <div className="space-y-2" role="list" aria-label="Risk tier breakdown">
            {tiers.map((t) => {
              const count = distribution[t];
              const pct = total > 0 ? ((count / total) * 100).toFixed(1) : "0";
              const style = riskStyles[t];
              return (
                <div key={t} className="flex items-center gap-3 text-sm" role="listitem">
                  <span
                    className="h-2.5 w-2.5 shrink-0 rounded-full"
                    style={{ backgroundColor: style.fg }}
                    aria-hidden="true"
                  />
                  <span className="flex-1 text-muted-foreground">{style.label}</span>
                  <span className="font-medium tabular-nums">{count.toLocaleString()}</span>
                  <span className="w-12 text-right text-xs text-muted-foreground/60 tabular-nums">
                    {pct}%
                  </span>
                </div>
              );
            })}
          </div>

          {/* Summary callouts */}
          {(distribution.critical > 0 || alertsToday > 0) && (
            <div className="space-y-1.5 border-t border-border pt-4 text-xs text-muted-foreground leading-relaxed">
              {distribution.critical > 0 && (
                <p>
                  <span className="font-medium text-nx-risk-critical">
                    {distribution.critical} entities
                  </span>{" "}
                  require immediate attention
                </p>
              )}
              {alertsToday > 0 && (
                <p>
                  {alertsToday} new alerts today,{" "}
                  <span className="font-medium text-nx-trend-positive">
                    {autoResolvedPct}% auto-resolved
                  </span>{" "}
                  by AI
                </p>
              )}
            </div>
          )}
        </DashboardCard.Content>
      )}
    </DashboardCard.Root>
  );
}
