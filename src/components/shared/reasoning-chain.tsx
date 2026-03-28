"use client";

import { useState } from "react";
import { cn } from "@/lib/utils";
import { AIIndicator } from "./ai-indicator";
import { ChevronDown } from "lucide-react";
import type { ReasoningStep } from "@/features/entity-detail/types";

interface ReasoningChainProps {
  steps: ReasoningStep[];
  defaultExpanded?: boolean;
}

const statusDot: Record<string, string> = {
  complete: "var(--nx-emerald-500)",
  warning: "var(--nx-amber-500)",
  escalated: "var(--nx-rose-500)",
  error: "var(--nx-rose-600)",
};

export function ReasoningChain({ steps, defaultExpanded = false }: ReasoningChainProps) {
  const [expanded, setExpanded] = useState(defaultExpanded);

  return (
    <div className="space-y-2">
      <button
        type="button"
        className="flex items-center gap-2 text-xs font-medium text-primary hover:underline"
        onClick={() => setExpanded(!expanded)}
        aria-expanded={expanded}
      >
        <AIIndicator size={12} />
        <span>View Full Reasoning Chain ({steps.length} steps)</span>
        <ChevronDown className={cn("h-3.5 w-3.5 transition-transform", expanded && "rotate-180")} />
      </button>

      {expanded && (
        <div
          className="ml-1 space-y-0 border-l-2 border-border pl-4"
          role="list"
          aria-label="AI reasoning steps"
        >
          {steps.map((step, i) => (
            <div key={i} className="relative pb-4 last:pb-0" role="listitem">
              <span
                className="absolute -left-[21px] top-1.5 h-2.5 w-2.5 rounded-full border-2 border-background"
                style={{ backgroundColor: statusDot[step.status] ?? "var(--nx-neutral-400)" }}
                aria-hidden="true"
              />
              <p className="text-[13px] font-semibold">{step.label}</p>
              <p className="mt-0.5 text-xs text-muted-foreground leading-relaxed">
                {step.detail}
              </p>
              {step.source && (
                <span className="mt-1 inline-flex items-center gap-1 rounded bg-nx-indigo-50 px-1.5 py-0.5 text-[10px] font-medium text-nx-indigo-600">
                  {step.source.label} {step.source.reference}
                </span>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
