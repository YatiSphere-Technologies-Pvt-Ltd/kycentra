"use client";

import { ScrollArea } from "@/components/ui/scroll-area";
import { AIIndicator, ConfidenceBadge } from "@/components/shared";
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, ResponsiveContainer, Tooltip } from "recharts";

interface TransactionPanelProps {
  data: { month: string; volume: number; expected: number }[];
}

export function PanelTransactions({ data }: TransactionPanelProps) {
  return (
    <ScrollArea className="h-full">
      <div className="p-5 space-y-5">
        <h3 className="text-base font-semibold">Transaction Analysis</h3>

        {/* Chart */}
        <div className="rounded-xl border border-border bg-card p-4">
          <p className="text-xs font-semibold text-muted-foreground mb-3">Monthly Volume — Last 12 months</p>
          <div className="h-52" role="img" aria-label="Transaction volume chart">
            <ResponsiveContainer width="100%" height="100%" minWidth={0} minHeight={0}>
              <AreaChart data={data}>
                <defs>
                  <linearGradient id="volFill" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#2563EB" stopOpacity={0.15} />
                    <stop offset="100%" stopColor="#2563EB" stopOpacity={0} />
                  </linearGradient>
                  <linearGradient id="expFill" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#94A3B8" stopOpacity={0.08} />
                    <stop offset="100%" stopColor="#94A3B8" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="var(--nx-neutral-100)" />
                <XAxis dataKey="month" tick={{ fontSize: 10 }} stroke="var(--nx-neutral-300)" />
                <YAxis tickFormatter={(v) => `$${(v / 1e6).toFixed(1)}M`} tick={{ fontSize: 10 }} stroke="var(--nx-neutral-300)" />
                <Tooltip formatter={(value) => [`$${(Number(value) / 1e6).toFixed(2)}M`, ""]} />
                <Area type="monotone" dataKey="expected" stroke="#94A3B8" strokeDasharray="4 4" strokeWidth={1} fill="url(#expFill)" name="Expected" />
                <Area type="monotone" dataKey="volume" stroke="#2563EB" strokeWidth={2} fill="url(#volFill)" dot={{ r: 3, fill: "#2563EB" }} name="Actual" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* AI Analysis */}
        <div className="rounded-xl border border-border p-4" style={{ borderLeft: "3px solid var(--nx-violet-400)" }}>
          <div className="flex items-center gap-2 mb-2">
            <AIIndicator size={14} />
            <span className="text-xs font-semibold">Behavioral Analysis</span>
            <ConfidenceBadge value={91} />
          </div>
          <p className="text-sm text-muted-foreground leading-relaxed">
            Transaction patterns are consistent with a fund administration entity of this size and type. Monthly volumes range from $2.1M to $8.4M with expected seasonal variation around quarter-end NAV calculations. No structuring, layering, or round-amount patterns detected.
          </p>
        </div>

        {/* Flagged transactions */}
        <div className="rounded-xl border border-border p-4">
          <h4 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-2">Flagged Transactions</h4>
          <p className="text-sm text-muted-foreground">No transactions flagged for this entity.</p>
        </div>
      </div>
    </ScrollArea>
  );
}
