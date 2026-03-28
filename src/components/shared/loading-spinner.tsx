"use client";

import { cn } from "@/lib/utils";
import { Loader2 } from "lucide-react";

interface LoadingSpinnerProps {
  className?: string;
  size?: "sm" | "md" | "lg";
  label?: string;
}

const sizeMap = { sm: "h-4 w-4", md: "h-6 w-6", lg: "h-10 w-10" } as const;

export function LoadingSpinner({
  className,
  size = "md",
  label,
}: LoadingSpinnerProps) {
  return (
    <div
      className={cn("flex items-center justify-center gap-2", className)}
      role="status"
    >
      <Loader2 className={cn("animate-spin text-muted-foreground", sizeMap[size])} />
      {label && (
        <span className="text-sm text-muted-foreground">{label}</span>
      )}
      <span className="sr-only">{label ?? "Loading…"}</span>
    </div>
  );
}
