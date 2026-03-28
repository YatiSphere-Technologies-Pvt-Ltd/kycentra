"use client";

import { BrainCircuit, Clock, AlertTriangle, CheckCircle2 } from "lucide-react";
import { getGreeting, formatCurrentDate } from "@/lib/date-utils";
import type { LucideIcon } from "lucide-react";

// ============================================================
// WelcomeBanner — greeting + 4 daily summary stat cards
// ============================================================

interface SummaryStat {
  label: string;
  value: string;
  icon: LucideIcon;
  color: string;
  pulse?: boolean;
}

interface WelcomeBannerProps {
  userName: string;
  stats: SummaryStat[];
}

function StatMini({ stat }: { stat: SummaryStat }) {
  const Icon = stat.icon;
  return (
    <div
      className="flex items-center gap-3 rounded-lg border border-border bg-background px-4 py-3 transition-shadow hover:shadow-elevation-2"
      role="status"
      aria-label={`${stat.label}: ${stat.value}`}
    >
      <div
        className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg"
        style={{ backgroundColor: `color-mix(in oklch, ${stat.color}, transparent 88%)` }}
      >
        <Icon className="h-4 w-4" style={{ color: stat.color }} />
      </div>
      <div>
        <div className="flex items-center gap-1.5">
          <span className="text-lg font-bold tabular-nums leading-none">{stat.value}</span>
          {stat.pulse && (
            <span
              className="h-2 w-2 rounded-full animate-pulse"
              style={{ backgroundColor: stat.color }}
              aria-label="Active"
            />
          )}
        </div>
        <span className="mt-1 block text-[11px] text-muted-foreground leading-none">
          {stat.label}
        </span>
      </div>
    </div>
  );
}

export function WelcomeBanner({ userName, stats }: WelcomeBannerProps) {
  return (
    <div className="rounded-xl border border-border bg-card p-6 shadow-elevation-1">
      <div className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
        <div>
          <h2 className="text-2xl font-semibold tracking-tight">
            {getGreeting()}, {userName}
          </h2>
          <p className="mt-1 text-sm text-muted-foreground">
            Here&apos;s your compliance overview for today
          </p>
          <p className="mt-0.5 text-xs text-muted-foreground/60">{formatCurrentDate()}</p>
        </div>

        <div className="grid grid-cols-2 gap-3 xl:grid-cols-4">
          {stats.map((stat) => (
            <StatMini key={stat.label} stat={stat} />
          ))}
        </div>
      </div>
    </div>
  );
}

/** Default stats factory — used when wiring with mock data */
export function createDefaultStats(
  activeAgents: number,
  totalAgents: number,
  pendingCount: number,
  alertCount: number,
  autoResolvedPct: string
): SummaryStat[] {
  return [
    { label: "AI Agents Active", value: `${activeAgents}/${totalAgents}`, icon: BrainCircuit, color: "var(--nx-emerald-500)", pulse: true },
    { label: "Awaiting Your Review", value: String(pendingCount), icon: Clock, color: "var(--nx-amber-500)" },
    { label: "New Alerts", value: String(alertCount), icon: AlertTriangle, color: "var(--nx-rose-500)" },
    { label: "Auto-Resolved Today", value: autoResolvedPct, icon: CheckCircle2, color: "var(--nx-emerald-500)" },
  ];
}
