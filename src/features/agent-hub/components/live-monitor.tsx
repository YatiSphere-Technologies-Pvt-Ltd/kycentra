"use client";

import { ScrollArea } from "@/components/ui/scroll-area";
import { agents } from "../data/agents";
import { cn } from "@/lib/utils";

const activeTasks = [
  { agent: "🛡 Screening", task: "Batch re-screen (EU Consolidated update)", detail: "2,601 entities", progress: 67, eta: "~8 min", priority: "Normal" },
  { agent: "📡 Data Sourcing", task: "Registry query — Helios Asset Mgmt GmbH", detail: "Handelsregister ✅, BaFin ✅, BvD 🔄", progress: 66, eta: "~30s", priority: "High" },
  { agent: "🏢 Entity Intel", task: "Recursive UBO discovery — Northwind Holdings", detail: "Layer 4/5 · 7 entities · 🇰🇾🇬🇧🇱🇺🇨🇭🇭🇰", progress: 80, eta: "~3 min", priority: "Normal" },
  { agent: "📄 Document Intel", task: "Process financial statement — Pacific Rim Holdings", detail: "Extraction 80% → Validation next", progress: 80, eta: "~8s", priority: "Normal" },
  { agent: "⚡ Risk Intel", task: "Risk recalculation — Horizon Trading LLC", detail: "PEP trigger · 6/6 agent feeds received", progress: 90, eta: "~15s", priority: "High" },
  { agent: "📖 Regulatory Intel", task: "EU AMLA RTS impact assessment", detail: "12 rules · 8/12 draft updates complete", progress: 67, eta: "~30 min", priority: "Normal" },
];

const streamEvents = [
  { time: "14:32:01", agent: "🛡 Screening", action: "Auto-resolved alert ALT-8923 — Deutsche Industriebank → FP (94%)" },
  { time: "14:31:58", agent: "📄 Document", action: "Classified → \"Board Resolution\" — Helios Asset Mgmt (97%)" },
  { time: "14:31:45", agent: "📡 Data Src", action: "Published entity profile — Helios Asset Mgmt (94%, 3 sources)" },
  { time: "14:31:30", agent: "⚡ Risk", action: "→ NEEDS REVIEW: Horizon Trading risk 58→72 (PEP trigger)", highlight: true },
  { time: "14:31:12", agent: "✅ QA", action: "Spot-checked 5 Screening decisions — 5/5 consistent (100%)" },
  { time: "14:30:55", agent: "📋 Audit", action: "Sealed audit block #847,293 — 23 entries, SHA-256 verified" },
  { time: "14:30:30", agent: "🎯 Workflow", action: "Started onboarding pipeline — Helios Asset Mgmt (8 agents)" },
  { time: "14:30:12", agent: "💬 Client Comms", action: "Sent document reminder — Thomas Weber (Helios)" },
  { time: "14:29:45", agent: "📰 Media Intel", action: "Scanned 120 sources for Volkov Trading — 0 new adverse" },
  { time: "14:29:30", agent: "📈 Forecasting", action: "Projected screening queue: +15% next week (OFAC update expected)" },
];

function GaugeCircle({ value, label, unit, status }: { value: string; label: string; unit: string; status: string }) {
  const color = status === "healthy" ? "var(--nx-emerald-500)" : status === "warning" ? "var(--nx-amber-500)" : "var(--nx-rose-500)";
  return (
    <div className="text-center">
      <div className="relative mx-auto h-16 w-16 rounded-full border-4 flex items-center justify-center" style={{ borderColor: `${color}30` }}>
        <div className="absolute inset-1 rounded-full" style={{ background: `conic-gradient(${color} ${parseInt(value) || 50}%, transparent 0)`, opacity: 0.15 }} />
        <div className="text-center z-10">
          <p className="text-sm font-bold tabular-nums">{value}</p>
          <p className="text-[8px] text-muted-foreground">{unit}</p>
        </div>
      </div>
      <p className="text-[10px] text-muted-foreground mt-1.5">{label}</p>
      <p className="text-[9px] font-bold" style={{ color }}>✓ {status}</p>
    </div>
  );
}

export function LiveMonitor() {
  return (
    <div className="space-y-6">
      {/* System gauges */}
      <div className="flex justify-around rounded-xl border border-border bg-card p-5 shadow-elevation-1">
        <GaugeCircle value="847" label="Context Bus" unit="msg/min" status="healthy" />
        <GaugeCircle value="34%" label="Agent Load" unit="" status="healthy" />
        <GaugeCircle value="47" label="Queue Depth" unit="items" status="healthy" />
        <GaugeCircle value="0.02%" label="Error Rate" unit="" status="healthy" />
      </div>

      {/* Active tasks */}
      <div className="rounded-xl border border-border bg-card shadow-elevation-1 overflow-hidden">
        <div className="px-5 py-3 border-b border-border">
          <h3 className="text-sm font-semibold">Active Tasks ({activeTasks.length})</h3>
        </div>
        <div className="divide-y divide-border">
          {activeTasks.map((t, i) => (
            <div key={i} className="px-5 py-3 hover:bg-muted/20 transition-colors">
              <div className="flex items-center justify-between mb-1.5">
                <span className="text-sm font-medium">{t.agent}</span>
                <div className="flex items-center gap-2">
                  <span className="rounded-md bg-muted px-1.5 py-0.5 text-[9px] font-bold text-muted-foreground">{t.priority}</span>
                  <span className="text-xs text-muted-foreground tabular-nums">{t.eta}</span>
                </div>
              </div>
              <p className="text-xs text-muted-foreground">{t.task}</p>
              <p className="text-[10px] text-muted-foreground/60 mt-0.5">{t.detail}</p>
              <div className="flex items-center gap-2 mt-2">
                <div className="flex-1 h-1.5 rounded-full bg-nx-neutral-100">
                  <div className="h-full rounded-full bg-primary transition-all" style={{ width: `${t.progress}%` }} />
                </div>
                <span className="text-[10px] font-bold tabular-nums text-muted-foreground">{t.progress}%</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Live stream */}
      <div className="rounded-xl border border-border bg-card shadow-elevation-1 overflow-hidden">
        <div className="px-5 py-3 border-b border-border flex items-center justify-between">
          <h3 className="text-sm font-semibold">Live Activity Stream</h3>
          <span className="inline-flex items-center gap-1.5 rounded-md bg-nx-emerald-50 px-2 py-0.5 text-[10px] font-bold text-nx-emerald-700">
            <span className="h-1.5 w-1.5 rounded-full bg-nx-emerald-500 animate-pulse" />Live
          </span>
        </div>
        <ScrollArea className="max-h-80">
          <div className="divide-y divide-border">
            {streamEvents.map((e, i) => (
              <div key={i} className={cn("flex gap-3 px-5 py-2.5 text-xs", e.highlight && "bg-nx-amber-50")}>
                <span className="font-mono text-muted-foreground tabular-nums shrink-0 w-16">{e.time}</span>
                <span className="font-medium shrink-0 w-24">{e.agent}</span>
                <span className={cn("text-muted-foreground", e.highlight && "text-nx-amber-700 font-medium")}>{e.action}</span>
              </div>
            ))}
          </div>
        </ScrollArea>
      </div>
    </div>
  );
}
