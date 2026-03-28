"use client";

import { cn } from "@/lib/utils";
import { riskStyles } from "@/lib/styles";
import type { RiskTier } from "@/features/workbench/types";

interface RiskBadgeProps {
  tier: RiskTier;
  className?: string;
  /** Show without the colored dot */
  compact?: boolean;
}

export function RiskBadge({ tier, className, compact = false }: RiskBadgeProps) {
  const config = riskStyles[tier];
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 rounded-md px-2 py-0.5 text-[11px] font-bold uppercase tracking-wide",
        className
      )}
      style={{ color: config.fg, backgroundColor: config.bg }}
      role="status"
      aria-label={`Risk level: ${config.label}`}
    >
      {!compact && (
        <span
          className="h-1.5 w-1.5 rounded-full"
          style={{ backgroundColor: config.fg }}
          aria-hidden="true"
        />
      )}
      {config.label}
    </span>
  );
}
