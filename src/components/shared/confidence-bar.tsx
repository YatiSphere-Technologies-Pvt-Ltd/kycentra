"use client";

import { cn } from "@/lib/utils";
import { getConfidenceLevel } from "@/lib/styles";
import { useEffect, useState } from "react";

interface ConfidenceBarProps {
  value: number;
  className?: string;
  animated?: boolean;
  /** Show the percentage label inline */
  showLabel?: boolean;
}

export function ConfidenceBar({
  value,
  className,
  animated = true,
  showLabel = false,
}: ConfidenceBarProps) {
  const [width, setWidth] = useState(animated ? 0 : value);
  const { fg } = getConfidenceLevel(value);

  useEffect(() => {
    if (animated) {
      const timer = requestAnimationFrame(() => setWidth(value));
      return () => cancelAnimationFrame(timer);
    }
  }, [value, animated]);

  return (
    <div className={cn("flex items-center gap-3", className)}>
      <div
        className="h-1 flex-1 rounded-full bg-nx-neutral-200 dark:bg-nx-neutral-700"
        role="progressbar"
        aria-valuenow={value}
        aria-valuemin={0}
        aria-valuemax={100}
        aria-label={`AI confidence: ${value}%`}
      >
        <div
          className="h-full rounded-full transition-all duration-500 ease-out"
          style={{
            width: `${Math.min(width, 100)}%`,
            backgroundColor: fg,
          }}
        />
      </div>
      {showLabel && (
        <span className="text-[10px] font-medium tabular-nums text-muted-foreground shrink-0">
          {value}%
        </span>
      )}
    </div>
  );
}
