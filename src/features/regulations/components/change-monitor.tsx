"use client";

import { AIIndicator, ConfidenceBadge } from "@/components/shared";
import { Button } from "@/components/ui/button";
import { ExternalLink, AlertTriangle, Clock, CheckCircle2, Info } from "lucide-react";
import type { RegChange } from "../types";

const severityConfig: Record<string, { icon: typeof AlertTriangle; color: string; bg: string; label: string }> = {
  high: { icon: AlertTriangle, color: "var(--nx-rose-600)", bg: "var(--nx-rose-50)", label: "HIGH" },
  medium: { icon: Clock, color: "var(--nx-amber-600)", bg: "var(--nx-amber-50)", label: "MEDIUM" },
  low: { icon: Info, color: "var(--nx-emerald-600)", bg: "var(--nx-emerald-50)", label: "LOW" },
  info: { icon: Info, color: "var(--nx-neutral-500)", bg: "var(--nx-neutral-50)", label: "INFO" },
};

const statusGroupLabels: Record<string, { label: string; icon: string }> = {
  action_required: { label: "Action Required", icon: "🔴" },
  auto_action: { label: "Auto-Action In Progress", icon: "🔄" },
  under_review: { label: "Under Review", icon: "🟡" },
  resolved: { label: "Resolved", icon: "✅" },
  informational: { label: "Informational", icon: "ℹ" },
};

const flagMap: Record<string, string> = { EU: "🇪🇺", US: "🇺🇸", KY: "🇰🇾", GB: "🇬🇧", SG: "🇸🇬", GLOBAL: "🌍" };

function ChangeCard({ change }: { change: RegChange }) {
  const sev = severityConfig[change.severity] ?? severityConfig.info;
  const Icon = sev.icon;

  return (
    <div className="rounded-xl border border-border bg-card p-5 shadow-elevation-1" style={{ borderLeft: `4px solid ${sev.color}` }}>
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center gap-2 text-xs">
          <span>{flagMap[change.jurisdictionCode] ?? ""} {change.jurisdiction}</span>
          <span className="rounded-md px-1.5 py-0.5 text-[10px] font-bold" style={{ color: sev.color, backgroundColor: sev.bg }}>{sev.label}</span>
          <span className="text-muted-foreground">{change.publishDate}</span>
        </div>
      </div>

      <h4 className="text-sm font-semibold leading-snug">{change.title}</h4>

      {/* AI assessment */}
      <div className="mt-3 rounded-lg border border-border p-3" style={{ borderLeft: "3px solid var(--nx-violet-400)" }}>
        <div className="flex items-center gap-1.5 mb-1">
          <AIIndicator size={11} />
          <span className="text-[10px] font-semibold">AI Impact Assessment</span>
          <ConfidenceBadge value={Math.round(change.confidence * 100)} />
        </div>
        <p className="text-xs text-muted-foreground leading-relaxed">{change.aiImpactAssessment}</p>
      </div>

      {/* Impact stats */}
      <div className="flex flex-wrap gap-3 mt-3">
        {change.affectedRules && (
          <div className="rounded-lg border border-border px-3 py-1.5 text-center">
            <p className="text-sm font-bold tabular-nums">{change.affectedRules}</p>
            <p className="text-[9px] text-muted-foreground">Rules</p>
          </div>
        )}
        <div className="rounded-lg border border-border px-3 py-1.5 text-center">
          <p className="text-sm font-bold tabular-nums">{change.affectedEntities.toLocaleString()}</p>
          <p className="text-[9px] text-muted-foreground">Entities</p>
        </div>
        {change.deadline && (
          <div className="rounded-lg border border-border px-3 py-1.5 text-center">
            <p className="text-sm font-bold tabular-nums">{change.deadline}</p>
            <p className="text-[9px] text-muted-foreground">Deadline</p>
          </div>
        )}
      </div>

      {change.autoAction && (
        <div className="mt-3 flex items-center gap-2 text-xs text-nx-teal-600">
          <span className="animate-spin text-[10px]">⟳</span>
          {change.autoAction}
        </div>
      )}

      <div className="flex gap-2 mt-3">
        <Button size="sm" variant="outline" className="h-7 text-xs">View Assessment</Button>
        {change.status === "action_required" && <Button size="sm" className="h-7 text-xs">Create Plan</Button>}
      </div>
    </div>
  );
}

export function ChangeMonitor({ changes }: { changes: RegChange[] }) {
  const groups = {
    action_required: changes.filter((c) => c.status === "action_required"),
    auto_action: changes.filter((c) => c.status === "auto_action"),
    under_review: changes.filter((c) => c.status === "under_review"),
    informational: changes.filter((c) => c.status === "informational"),
  };

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-semibold">Regulatory Change Monitor</h3>
        <p className="text-xs text-muted-foreground">127 jurisdictions tracked · {changes.length} changes this month · {groups.action_required.length} require action</p>
      </div>

      {Object.entries(groups).map(([status, items]) => {
        if (items.length === 0) return null;
        const group = statusGroupLabels[status];
        return (
          <div key={status}>
            <h4 className="text-sm font-semibold mb-3">{group?.icon} {group?.label} ({items.length})</h4>
            <div className="space-y-3">
              {items.map((c) => <ChangeCard key={c.id} change={c} />)}
            </div>
          </div>
        );
      })}
    </div>
  );
}
