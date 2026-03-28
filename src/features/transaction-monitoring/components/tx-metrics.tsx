"use client";

import { useState } from "react";
import { Activity, AlertTriangle, BrainCircuit, FileWarning, Clock, BarChart3, Shield, Cpu, ChevronUp, ChevronDown, TrendingDown } from "lucide-react";
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, ResponsiveContainer, Tooltip, Bar, BarChart, ComposedChart, Line } from "recharts";
import type { TxMetrics, TxVolumePoint } from "../types";

interface TxMetricsProps {
  metrics: TxMetrics;
  volumeData: TxVolumePoint[];
}

function Stat({ icon: Icon, label, value, sub }: { icon: typeof Activity; label: string; value: string; sub?: string }) {
  return (
    <div className="rounded-lg border border-border bg-card p-3">
      <div className="flex items-center gap-1.5 mb-1">
        <Icon className="h-3.5 w-3.5 text-muted-foreground" />
        <span className="text-[10px] font-medium text-muted-foreground">{label}</span>
      </div>
      <p className="text-lg font-bold tabular-nums">{value}</p>
      {sub && <p className="text-[10px] text-muted-foreground mt-0.5">{sub}</p>}
    </div>
  );
}

export function TxMetricsDashboard({ metrics: m, volumeData }: TxMetricsProps) {
  const [collapsed, setCollapsed] = useState(false);

  return (
    <div className="rounded-xl border border-border bg-card shadow-elevation-1 overflow-hidden">
      <button type="button" onClick={() => setCollapsed(!collapsed)} className="flex w-full items-center justify-between px-5 py-3 text-left hover:bg-muted/30 transition-colors">
        <div className="flex items-center gap-2">
          <Activity className="h-4 w-4 text-primary" />
          <span className="text-sm font-semibold">Transaction Monitoring — Today</span>
          <span className="text-xs text-muted-foreground tabular-nums">{m.totalMonitored.toLocaleString()} transactions monitored</span>
        </div>
        {collapsed ? <ChevronDown className="h-4 w-4 text-muted-foreground" /> : <ChevronUp className="h-4 w-4 text-muted-foreground" />}
      </button>

      {!collapsed && (
        <div className="px-5 pb-4 space-y-4">
          {/* KPI row */}
          <div className="grid grid-cols-4 lg:grid-cols-8 gap-2">
            <Stat icon={Activity} label="Monitored" value={m.totalMonitored.toLocaleString()} />
            <Stat icon={AlertTriangle} label="Alerts" value={String(m.alertsGenerated)} />
            <Stat icon={BrainCircuit} label="Auto-Resolved" value={String(m.autoResolved)} sub={`${Math.round((m.autoResolved / m.alertsGenerated) * 100)}% rate`} />
            <Stat icon={Clock} label="Pending" value={String(m.pendingReview)} />
            <Stat icon={FileWarning} label="Investigations" value={String(m.investigationsOpened)} />
            <Stat icon={Shield} label="SARs Filed" value={String(m.sarsFiledFromTx)} />
            <Stat icon={BarChart3} label="FP Rate" value={`${m.falsePositiveRate}%`} />
            <Stat icon={Cpu} label="Rules Active" value={String(m.rulesFired)} sub={`${m.modelsActive} ML models`} />
          </div>

          {/* Volume chart */}
          <div className="rounded-lg border border-border p-3">
            <p className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground mb-2">Transaction Volume & Alerts — Last 24h</p>
            <div className="h-36" role="img" aria-label="Transaction volume and alerts chart">
              <ResponsiveContainer width="100%" height="100%" minWidth={0} minHeight={0}>
                <ComposedChart data={volumeData}>
                  <defs>
                    <linearGradient id="txVolFill" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="#2563EB" stopOpacity={0.12} />
                      <stop offset="100%" stopColor="#2563EB" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="var(--nx-neutral-100)" />
                  <XAxis dataKey="hour" tick={{ fontSize: 9 }} stroke="var(--nx-neutral-300)" />
                  <YAxis yAxisId="vol" tick={{ fontSize: 9 }} stroke="var(--nx-neutral-300)" tickFormatter={(v) => `${(v / 1000).toFixed(0)}K`} />
                  <YAxis yAxisId="alerts" orientation="right" tick={{ fontSize: 9 }} stroke="var(--nx-neutral-300)" />
                  <Tooltip formatter={(value, name) => [name === "alerts" ? String(value) : `${(Number(value) / 1000).toFixed(1)}K`, name === "alerts" ? "Alerts" : "Volume"]} />
                  <Area yAxisId="vol" type="monotone" dataKey="volume" stroke="#2563EB" strokeWidth={1.5} fill="url(#txVolFill)" name="volume" />
                  <Line yAxisId="vol" type="monotone" dataKey="expected" stroke="#94A3B8" strokeWidth={1} strokeDasharray="4 4" dot={false} name="expected" />
                  <Bar yAxisId="alerts" dataKey="alerts" fill="var(--nx-rose-400)" barSize={6} radius={[2, 2, 0, 0]} name="alerts" />
                </ComposedChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
