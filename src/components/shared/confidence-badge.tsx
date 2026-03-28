"use client";

import { cn } from "@/lib/utils";
import { getConfidenceLevel } from "@/lib/styles";

interface ConfidenceBadgeProps {
  value: number;
  className?: string;
}

export function ConfidenceBadge({ value, className }: ConfidenceBadgeProps) {
  const { fg, bg, level } = getConfidenceLevel(value);

  return (
    <span
      className={cn(
        "inline-flex items-center rounded-md px-2 py-0.5 text-[11px] font-bold tabular-nums",
        className
      )}
      style={{ color: fg, backgroundColor: bg }}
      role="status"
      aria-label={`${value}% confidence (${level})`}
    >
      {value}%
    </span>
  );
}
