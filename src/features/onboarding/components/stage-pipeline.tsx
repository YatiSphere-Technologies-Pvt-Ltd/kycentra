"use client";

import { Check } from "lucide-react";
import { cn } from "@/lib/utils";
import type { OnboardingStageItem, OnboardingRecord } from "../types";

interface StagePipelineProps {
  stages: OnboardingStageItem[];
  sla: OnboardingRecord["sla"];
}

export function StagePipeline({ stages, sla }: StagePipelineProps) {
  const slaPct = (sla.elapsed / sla.total) * 100;
  const slaColor = slaPct < 50 ? "var(--nx-emerald-500)" : slaPct < 75 ? "var(--nx-amber-500)" : "var(--nx-rose-500)";

  return (
    <div className="rounded-lg border border-border bg-card px-4 py-3 shadow-elevation-1">
      {/* Compact horizontal stepper */}
      <div className="flex items-center gap-1" role="list" aria-label="Onboarding stages">
        {stages.map((stage, i) => (
          <div key={stage.id} className="flex items-center flex-1 last:flex-initial" role="listitem">
            <div className="flex items-center gap-1.5">
              <div className={cn(
                "flex h-6 w-6 shrink-0 items-center justify-center rounded-full text-[10px] font-bold",
                stage.status === "completed" && "bg-nx-emerald-500 text-white",
                stage.status === "current" && "bg-primary text-primary-foreground animate-pulse",
                stage.status === "in_progress" && "bg-nx-teal-500 text-white",
                stage.status === "pending" && "border-2 border-nx-neutral-300 text-nx-neutral-400",
              )} aria-label={`${stage.label}: ${stage.status}`}>
                {stage.status === "completed" ? <Check className="h-3 w-3" /> : i + 1}
              </div>
              <div className="hidden sm:block">
                <span className={cn(
                  "text-[10px] font-semibold uppercase tracking-wide whitespace-nowrap",
                  stage.status === "completed" && "text-nx-emerald-600",
                  stage.status === "current" && "text-primary",
                  stage.status === "in_progress" && "text-nx-teal-600",
                  stage.status === "pending" && "text-muted-foreground/40",
                )}>
                  {stage.label}
                </span>
                {stage.progress && (
                  <span className="ml-1 text-[9px] text-muted-foreground tabular-nums">{stage.progress}</span>
                )}
              </div>
            </div>
            {i < stages.length - 1 && (
              <div className="flex-1 mx-1 h-px rounded-full min-w-2" style={{
                backgroundColor: stage.status === "completed" ? "var(--nx-emerald-400)" : stage.status === "in_progress" ? "var(--nx-teal-300)" : "var(--nx-neutral-200)",
              }} />
            )}
          </div>
        ))}
      </div>

      {/* Compact info row */}
      <div className="mt-2 flex items-center justify-between text-[10px] text-muted-foreground">
        <span>Est. {Math.round(sla.total - sla.elapsed)}h remaining · 4/6 AI agents active</span>
        <div className="flex items-center gap-2">
          <span className="tabular-nums">{sla.elapsed}h / {sla.total}h</span>
          <div className="w-12 h-1 rounded-full bg-nx-neutral-100">
            <div className="h-full rounded-full" style={{ width: `${Math.min(slaPct, 100)}%`, backgroundColor: slaColor }} />
          </div>
        </div>
      </div>
    </div>
  );
}
