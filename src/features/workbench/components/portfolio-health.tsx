"use client";

const stats = [
  { label: "Entities Monitored", value: "12,847" },
  { label: "Compliant", value: "98.2%" },
  { label: "Overdue Reviews", value: "0" },
  { label: "FP Rate", value: "18%", sub: "↓74% vs legacy" },
  { label: "Avg. Onboard", value: "4.2 hrs" },
];

export function PortfolioHealth() {
  return (
    <div className="grid grid-cols-5 gap-3">
      {stats.map((s) => (
        <div key={s.label} className="rounded-xl border border-border bg-card p-3 shadow-elevation-1 text-center">
          <p className="text-lg font-bold tabular-nums">{s.value}</p>
          <p className="text-[10px] text-muted-foreground mt-0.5">{s.label}</p>
          {s.sub && <p className="text-[9px] text-nx-trend-positive mt-0.5">{s.sub}</p>}
        </div>
      ))}
    </div>
  );
}
