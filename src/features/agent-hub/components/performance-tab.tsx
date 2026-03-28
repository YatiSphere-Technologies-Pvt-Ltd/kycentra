"use client";

import { agents } from "../data/agents";
import { cn } from "@/lib/utils";

export function PerformanceTab() {
  const sorted = [...agents].sort((a, b) => b.accuracy - a.accuracy);

  return (
    <div className="space-y-6">
      {/* Leaderboard */}
      <div className="rounded-xl border border-border bg-card shadow-elevation-1 overflow-hidden">
        <div className="px-5 py-3 border-b border-border">
          <h3 className="text-sm font-semibold">Accuracy Leaderboard (30 days)</h3>
        </div>
        <div className="overflow-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border bg-muted/30">
                {["#", "Agent", "Accuracy", "Trend", "Auto Rate", "Override", "Actions/Day", "Latency", "Status"].map((h) => (
                  <th key={h} scope="col" className="px-4 py-2.5 text-left text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {sorted.map((a, i) => {
                const isWarning = a.accuracy < 92;
                return (
                  <tr key={a.id} className={cn("hover:bg-muted/20 transition-colors", isWarning && "bg-nx-amber-50/30")}>
                    <td className="px-4 py-2.5 text-xs text-muted-foreground tabular-nums">{i + 1}</td>
                    <td className="px-4 py-2.5">
                      <div className="flex items-center gap-2">
                        <span>{a.icon}</span>
                        <div>
                          <span className="font-medium">{a.name}</span>
                          <span className="text-[10px] text-muted-foreground ml-1.5">#{a.id}</span>
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-2.5">
                      <span className={cn("font-bold tabular-nums", a.accuracy >= 96 ? "text-nx-emerald-600" : a.accuracy >= 92 ? "" : "text-nx-amber-600")}>{a.accuracy}%</span>
                    </td>
                    <td className="px-4 py-2.5 text-xs tabular-nums">
                      {a.accuracy >= 96 ? <span className="text-nx-emerald-600">↑ 0.{Math.floor(Math.random() * 9)}%</span> :
                       a.accuracy >= 92 ? <span className="text-muted-foreground">→ 0.0%</span> :
                       <span className="text-nx-amber-600">↓ 0.4%</span>}
                    </td>
                    <td className="px-4 py-2.5 tabular-nums">{a.autoRate}%</td>
                    <td className="px-4 py-2.5 tabular-nums text-muted-foreground">{(100 - a.autoRate).toFixed(1)}%</td>
                    <td className="px-4 py-2.5 tabular-nums text-muted-foreground">{a.actionsToday.toLocaleString()}</td>
                    <td className="px-4 py-2.5 tabular-nums text-muted-foreground">{a.avgLatency}</td>
                    <td className="px-4 py-2.5">
                      {isWarning ? <span className="rounded-md bg-nx-amber-50 px-1.5 py-0.5 text-[9px] font-bold text-nx-amber-700">⚠ Watch</span> :
                       <span className="rounded-md bg-nx-emerald-50 px-1.5 py-0.5 text-[9px] font-bold text-nx-emerald-700">✓ Good</span>}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Aggregate stats */}
      <div className="grid gap-4 lg:grid-cols-4">
        {[
          { label: "Avg Accuracy (all agents)", value: `${(agents.reduce((s, a) => s + a.accuracy, 0) / agents.length).toFixed(1)}%` },
          { label: "Total Actions Today", value: agents.reduce((s, a) => s + a.actionsToday, 0).toLocaleString() },
          { label: "Avg Auto Rate", value: `${(agents.reduce((s, a) => s + a.autoRate, 0) / agents.length).toFixed(1)}%` },
          { label: "Agents Below 92%", value: String(agents.filter((a) => a.accuracy < 92).length) },
        ].map((s) => (
          <div key={s.label} className="rounded-xl border border-border bg-card p-4 shadow-elevation-1 text-center">
            <p className="text-xl font-bold tabular-nums">{s.value}</p>
            <p className="text-[10px] text-muted-foreground mt-1">{s.label}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
