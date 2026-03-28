"use client";

import { Sparkles } from "lucide-react";
import { cn } from "@/lib/utils";

interface AIIndicatorProps {
  className?: string;
  size?: number;
}

export function AIIndicator({ className, size = 14 }: AIIndicatorProps) {
  return (
    <span
      className={cn("inline-flex items-center", className)}
      aria-label="AI-generated"
      title="AI-generated"
    >
      <Sparkles
        className="text-nx-ai-icon"
        style={{ width: size, height: size }}
      />
    </span>
  );
}
