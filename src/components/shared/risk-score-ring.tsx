"use client";

import { useEffect, useState } from "react";
import { riskStyles } from "@/lib/styles";
import type { RiskTier } from "@/features/workbench/types";

interface RiskScoreRingProps {
  score: number;
  tier: RiskTier;
  size?: number;
  strokeWidth?: number;
  animated?: boolean;
}

function getTierColor(tier: RiskTier): string {
  return riskStyles[tier].fg;
}

export function RiskScoreRing({
  score,
  tier,
  size = 120,
  strokeWidth = 8,
  animated = true,
}: RiskScoreRingProps) {
  const [animatedScore, setAnimatedScore] = useState(animated ? 0 : score);
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (animatedScore / 100) * circumference;

  useEffect(() => {
    if (animated) {
      const timer = setTimeout(() => setAnimatedScore(score), 50);
      return () => clearTimeout(timer);
    }
  }, [score, animated]);

  return (
    <div
      className="relative inline-flex items-center justify-center"
      role="img"
      aria-label={`Risk score: ${score} out of 100, ${riskStyles[tier].label} risk`}
    >
      <svg width={size} height={size} className="-rotate-90">
        {/* Track */}
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke="var(--nx-neutral-100)"
          strokeWidth={strokeWidth}
        />
        {/* Fill */}
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke={getTierColor(tier)}
          strokeWidth={strokeWidth}
          strokeLinecap="round"
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          className="transition-all duration-1000 ease-out"
        />
      </svg>
      <div className="absolute flex flex-col items-center">
        <span className="text-2xl font-bold tabular-nums">{score}</span>
        <span className="text-[10px] text-muted-foreground">/100</span>
      </div>
    </div>
  );
}
