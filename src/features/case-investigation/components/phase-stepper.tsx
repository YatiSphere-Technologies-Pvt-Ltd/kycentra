"use client";

import { Check } from "lucide-react";
import { cn } from "@/lib/utils";
import type { InvestigationPhase, CaseDetail } from "../types";

interface PhaseStepperProps {
  phases: InvestigationPhase[];
  sla: CaseDetail["sla"];
}

export function PhaseStepper({ phases, sla }: PhaseStepperProps) {
  const currentPhase = phases.find((p) => p.status === "current");
  const slaPct = ((sla.total - sla.remaining) / sla.total) * 100;
  const slaColor = sla.remaining > sla.total * 0.5 ? "var(--nx-emerald-500)" : sla.remaining > sla.total * 0.25 ? "var(--nx-amber-500)" : "var(--nx-rose-500)";

  return (
    <div className="rounded-xl border border-border bg-card p-4 shadow-elevation-1">
      {/* Stepper */}
      <div className="flex items-center justify-between" role="list" aria-label="Investigation phases">
        {phases.map((phase, i) => (
          <div key={phase.id} className="flex items-center flex-1 last:flex-initial" role="listitem">
            {/* Circle */}
            <div className="flex flex-col items-center gap-1.5">
              <div
                className={cn(
                  "flex h-7 w-7 items-center justify-center rounded-full text-xs font-bold transition-all",
                  phase.status === "completed" && "bg-nx-emerald-500 text-white",
                  phase.status === "current" && "bg-primary text-primary-foreground animate-pulse",
                  phase.status === "pending" && "border-2 border-nx-neutral-300 text-nx-neutral-400"
                )}
                aria-label={`${phase.label}: ${phase.status}`}
              >
                {phase.status === "completed" ? <Check className="h-3.5 w-3.5" /> : <span className="text-[10px]">{i + 1}</span>}
              </div>
              <span className={cn(
                "text-[10px] font-semibold uppercase tracking-wider whitespace-nowrap",
                phase.status === "completed" && "text-nx-emerald-600",
                phase.status === "current" && "text-primary font-bold",
                phase.status === "pending" && "text-muted-foreground/50"
              )}>
                {phase.label}
              </span>
            </div>

            {/* Connector */}
            {i < phases.length - 1 && (
              <div className="flex-1 mx-2 h-0.5 rounded-full" style={{
                backgroundColor: phase.status === "completed" ? "var(--nx-emerald-500)" : "var(--nx-neutral-200)",
              }} />
            )}
          </div>
        ))}
      </div>

      {/* Current phase detail + SLA */}
      <div className="mt-3 flex items-center justify-between">
        {currentPhase?.detail && (
          <p className="text-xs text-muted-foreground italic">{currentPhase.detail}</p>
        )}
        <div className="flex items-center gap-3 shrink-0 ml-auto">
          <span className="text-[11px] text-muted-foreground">SLA: {sla.remaining}{sla.unit[0]} remaining</span>
          <div className="w-20 h-1.5 rounded-full bg-nx-neutral-100">
            <div className="h-full rounded-full transition-all" style={{ width: `${slaPct}%`, backgroundColor: slaColor }} />
          </div>
        </div>
      </div>
    </div>
  );
}
