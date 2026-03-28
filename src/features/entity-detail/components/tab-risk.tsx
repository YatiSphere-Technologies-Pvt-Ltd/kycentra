"use client";

import { ConfidenceBadge, RiskBadge } from "@/components/shared";
import { Button } from "@/components/ui/button";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, ResponsiveContainer, ReferenceLine, Area, AreaChart } from "recharts";
import { Sparkles, Shield } from "lucide-react";
import type { Entity, RiskFactor } from "../types";

interface RiskTabProps { entity: Entity; factors: RiskFactor[]; narrative: string }

const riskHistory = [
  { month: "Oct", score: 42 }, { month: "Nov", score: 44 }, { month: "Dec", score: 45 },
  { month: "Jan", score: 48 }, { month: "Feb", score: 58 }, { month: "Mar", score: 72 },
];

export function TabRisk({ entity, factors, narrative }: RiskTabProps) {
  return (
    <div className="space-y-5">
      {/* Top row: Score + Narrative */}
      <div className="grid gap-5 lg:grid-cols-12">
        {/* Score + DD */}
        <div className="lg:col-span-4 rounded-lg border border-border bg-card p-5">
          <div className="text-center mb-4">
            <div className="text-[48px] font-extrabold tabular-nums tracking-tight leading-none">{entity.riskScore}</div>
            <div className="text-[14px] text-muted-foreground font-medium">/100</div>
            <div className="mt-2"><RiskBadge tier={entity.riskTier} /></div>
          </div>
          <div className="space-y-2 text-[11px]">
            <div className="flex justify-between"><span className="text-muted-foreground">AI Confidence</span><ConfidenceBadge value={Math.round(entity.aiConfidence * 100)} /></div>
            <div className="flex justify-between"><span className="text-muted-foreground">DD Level</span><span className="font-bold">{entity.cddLevel}</span></div>
            <div className="flex justify-between"><span className="text-muted-foreground">Open Alerts</span><span className="font-bold tabular-nums">{entity.openAlerts}</span></div>
            <div className="flex justify-between"><span className="text-muted-foreground">Active Cases</span><span className="font-bold tabular-nums">{entity.activeCases}</span></div>
          </div>
        </div>

        {/* Narrative */}
        <div className="lg:col-span-8 rounded-lg border border-border bg-card overflow-hidden">
          <div className="flex items-center gap-2 px-4 py-2.5 border-b border-border">
            <Sparkles className="h-3.5 w-3.5 text-muted-foreground/40" />
            <span className="text-[12px] font-bold">AI Risk Narrative</span>
            <ConfidenceBadge value={Math.round(entity.aiConfidence * 100)} />
          </div>
          <div className="p-4">
            <p className="text-[12px] text-muted-foreground leading-[1.7]">{narrative}</p>
          </div>
        </div>
      </div>

      {/* Factor breakdown */}
      <div className="rounded-lg border border-border bg-card overflow-hidden">
        <div className="px-4 py-2.5 border-b border-border">
          <span className="text-[12px] font-bold">Risk Factor Breakdown</span>
        </div>
        <div className="p-4 space-y-3">
          {factors.map((f) => {
            const color = f.score >= 70 ? "var(--nx-rose-500)" : f.score >= 40 ? "var(--nx-amber-500)" : "var(--nx-emerald-500)";
            return (
              <div key={f.name}>
                <div className="flex items-center justify-between mb-1">
                  <span className="text-[11px] font-medium">{f.name}</span>
                  <div className="flex items-center gap-3">
                    <span className="text-[9px] text-muted-foreground tabular-nums">{f.weight}% weight</span>
                    <span className="text-[11px] font-bold tabular-nums w-8 text-right" style={{ color }}>{f.score}%</span>
                  </div>
                </div>
                <div className="h-1.5 w-full rounded-full bg-muted overflow-hidden">
                  <div className="h-full rounded-full" style={{ width: `${f.score}%`, backgroundColor: color }} />
                </div>
                <p className="mt-0.5 text-[10px] text-muted-foreground/60">{f.detail}</p>
              </div>
            );
          })}
          <div className="flex items-center gap-3 pt-3 border-t border-border text-[11px]">
            <span className="font-bold">Composite: {entity.riskScore}/100</span>
            <RiskBadge tier={entity.riskTier} />
          </div>
        </div>
      </div>

      {/* History chart */}
      <div className="rounded-lg border border-border bg-card overflow-hidden">
        <div className="px-4 py-2.5 border-b border-border">
          <span className="text-[12px] font-bold">Risk Score History</span>
        </div>
        <div className="p-4">
          <div className="h-56">
            <ResponsiveContainer width="100%" height="100%" minWidth={0} minHeight={0}>
              <AreaChart data={riskHistory}>
                <defs>
                  <linearGradient id="riskFill" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="currentColor" stopOpacity={0.1} />
                    <stop offset="100%" stopColor="currentColor" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
                <XAxis dataKey="month" tick={{ fontSize: 10 }} stroke="var(--border)" />
                <YAxis domain={[0, 100]} tick={{ fontSize: 10 }} stroke="var(--border)" />
                <ReferenceLine y={70} stroke="var(--nx-rose-400)" strokeDasharray="4 4" />
                <ReferenceLine y={40} stroke="var(--nx-amber-400)" strokeDasharray="4 4" />
                <Area type="monotone" dataKey="score" stroke="var(--foreground)" strokeWidth={2} fill="url(#riskFill)" dot={{ r: 3, fill: "var(--foreground)" }} />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Override */}
      <div className="rounded-lg border border-border bg-card p-4 space-y-3">
        <div className="text-[12px] font-bold">Manual Override</div>
        <p className="text-[10px] text-muted-foreground">Override the AI risk tier with justification. Requires Compliance Officer approval.</p>
        <div className="flex gap-3">
          <select className="h-8 rounded border border-border bg-background px-3 text-[11px] flex-1 max-w-48">
            <option>Select new risk tier…</option>
            <option>Critical</option><option>High</option><option>Medium</option><option>Low</option><option>Minimal</option>
          </select>
          <textarea className="flex-1 rounded border border-border bg-background px-3 py-2 text-[10px] placeholder:text-muted-foreground/40 focus:outline-none focus:ring-1 focus:ring-foreground/20 min-h-16" placeholder="Justification (required, min 100 chars)" />
        </div>
        <Button variant="outline" size="sm" className="h-7 text-[10px] font-semibold">Submit Override Request</Button>
      </div>
    </div>
  );
}
