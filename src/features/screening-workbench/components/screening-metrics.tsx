"use client";

import { useState } from "react";
import { TrendingUp, TrendingDown, ChevronUp, ChevronDown, BrainCircuit, Clock, Zap, BarChart3, Timer } from "lucide-react";
import { cn } from "@/lib/utils";
import type { ScreeningMetrics } from "../types";

interface MetricsProps { metrics: ScreeningMetrics }

function MetricCard({ label, value, trend, isGood, icon: Icon }: { label: string; value: string; trend: string; isGood: boolean; icon: typeof Clock }) {
  return (
    <div className="rounded-lg border border-border bg-card p-3 shadow-elevation-1">
      <div className="flex items-center gap-2 mb-1">
        <Icon className="h-4 w-4 text-muted-foreground" />
        <span className="text-[10px] font-medium text-muted-foreground">{label}</span>
      </div>
      <p className="text-xl font-bold tabular-nums">{value}</p>
      <div className="flex items-center gap-1 mt-1">
        {isGood ? <TrendingDown className="h-3 w-3 text-nx-trend-positive" /> : <TrendingUp className="h-3 w-3 text-nx-trend-negative" />}
        <span className={cn("text-[10px] font-medium tabular-nums", isGood ? "text-nx-trend-positive" : "text-nx-trend-negative")}>{trend}</span>
      </div>
    </div>
  );
}

export function ScreeningMetricsDashboard({ metrics: m }: MetricsProps) {
  const [collapsed, setCollapsed] = useState(false);
  const autoRate = Math.round((m.autoResolved / m.totalScreened) * 100);
  const pendRate = Math.round((m.pendingReview / m.totalScreened) * 100);
  const humanRate = Math.round((m.humanResolved / m.totalScreened) * 100);

  return (
    <div className="rounded-xl border border-border bg-card shadow-elevation-1 overflow-hidden">
      <button type="button" onClick={() => setCollapsed(!collapsed)} className="flex w-full items-center justify-between px-5 py-3 text-left hover:bg-muted/30 transition-colors">
        <span className="text-sm font-semibold">Screening Operations — Today</span>
        {collapsed ? <ChevronDown className="h-4 w-4 text-muted-foreground" /> : <ChevronUp className="h-4 w-4 text-muted-foreground" />}
      </button>

      {!collapsed && (
        <div className="px-5 pb-4 space-y-4">
          <div className="grid grid-cols-5 gap-3">
            <MetricCard label="Auto-Resolved" value={String(m.autoResolved)} trend={`↑ from ${m.yesterdayAutoResolved}`} isGood={true} icon={BrainCircuit} />
            <MetricCard label="Pending Review" value={String(m.pendingReview)} trend={`↓ ${m.yesterdayPending - m.pendingReview} vs yest.`} isGood={true} icon={Clock} />
            <MetricCard label="Your Throughput" value={`${m.throughput}/hr`} trend={`↑ from ${m.yesterdayThroughput}`} isGood={true} icon={Zap} />
            <MetricCard label="False Positive Rate" value={`${m.falsePositiveRate}%`} trend={`↓ from ${m.yesterdayFPRate}%`} isGood={true} icon={BarChart3} />
            <MetricCard label="Avg. Time" value={m.avgResolutionTime} trend={`↓ from ${m.yesterdayAvgTime}`} isGood={true} icon={Timer} />
          </div>

          {/* Resolution bar */}
          <div>
            <div className="flex h-3 rounded-full overflow-hidden">
              <div className="bg-nx-emerald-500 transition-all" style={{ width: `${autoRate}%` }} title={`Auto-resolved: ${m.autoResolved} (${autoRate}%)`} />
              <div className="bg-nx-amber-500 transition-all" style={{ width: `${pendRate}%` }} title={`Pending: ${m.pendingReview} (${pendRate}%)`} />
              <div className="bg-nx-indigo-500 transition-all" style={{ width: `${humanRate}%` }} title={`Human-resolved: ${m.humanResolved} (${humanRate}%)`} />
            </div>
            <div className="flex items-center gap-4 mt-1.5 text-[10px] text-muted-foreground">
              <span className="flex items-center gap-1"><span className="h-2 w-2 rounded-full bg-nx-emerald-500" />Auto: {m.autoResolved} ({autoRate}%)</span>
              <span className="flex items-center gap-1"><span className="h-2 w-2 rounded-full bg-nx-amber-500" />Pending: {m.pendingReview} ({pendRate}%)</span>
              <span className="flex items-center gap-1"><span className="h-2 w-2 rounded-full bg-nx-indigo-500" />Resolved: {m.humanResolved} ({humanRate}%)</span>
              <span className="ml-auto">Total: {m.totalScreened} · Lists updated: 3h ago</span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
