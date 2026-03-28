"use client";

import { cn } from "@/lib/utils";
import type { ComplianceStatus, CDDLevel, DocumentStatus } from "@/features/entity-detail/types";

const complianceStatusConfig: Record<ComplianceStatus, { label: string; fg: string; bg: string }> = {
  active: { label: "Active", fg: "var(--nx-emerald-700)", bg: "var(--nx-emerald-50)" },
  under_review: { label: "Under Review", fg: "var(--nx-amber-700)", bg: "var(--nx-amber-50)" },
  restricted: { label: "Restricted", fg: "var(--nx-rose-700)", bg: "var(--nx-rose-50)" },
  offboarding: { label: "Offboarding", fg: "var(--nx-neutral-600)", bg: "var(--nx-neutral-100)" },
};

const cddLevelConfig: Record<CDDLevel, { fg: string; bg: string }> = {
  SDD: { fg: "var(--nx-emerald-700)", bg: "var(--nx-emerald-50)" },
  CDD: { fg: "var(--nx-neutral-600)", bg: "var(--nx-neutral-100)" },
  EDD: { fg: "var(--nx-amber-700)", bg: "var(--nx-amber-50)" },
  "EDD+": { fg: "var(--nx-rose-700)", bg: "var(--nx-rose-50)" },
};

const docStatusConfig: Record<DocumentStatus, { label: string; icon: string; fg: string }> = {
  verified: { label: "Verified", icon: "✅", fg: "var(--nx-emerald-600)" },
  issue: { label: "Issue", icon: "⚠", fg: "var(--nx-amber-600)" },
  expiring: { label: "Expiring", icon: "🟡", fg: "var(--nx-amber-500)" },
  missing: { label: "Missing", icon: "❌", fg: "var(--nx-rose-600)" },
  pending: { label: "Pending", icon: "⏳", fg: "var(--nx-neutral-400)" },
};

export function ComplianceStatusBadge({ status, className }: { status: ComplianceStatus; className?: string }) {
  const config = complianceStatusConfig[status];
  return (
    <span
      className={cn("inline-flex items-center gap-1.5 rounded-md px-2 py-0.5 text-[11px] font-bold", className)}
      style={{ color: config.fg, backgroundColor: config.bg }}
      role="status"
    >
      <span className="h-1.5 w-1.5 rounded-full" style={{ backgroundColor: config.fg }} aria-hidden="true" />
      {config.label}
    </span>
  );
}

export function CDDLevelBadge({ level, className }: { level: CDDLevel; className?: string }) {
  const config = cddLevelConfig[level];
  return (
    <span
      className={cn("inline-flex rounded-md px-2 py-0.5 text-[11px] font-bold", className)}
      style={{ color: config.fg, backgroundColor: config.bg }}
    >
      {level}
    </span>
  );
}

export function DocStatusIcon({ status }: { status: DocumentStatus }) {
  const config = docStatusConfig[status];
  return (
    <span style={{ color: config.fg }} aria-label={config.label} title={config.label}>
      {config.icon}
    </span>
  );
}
