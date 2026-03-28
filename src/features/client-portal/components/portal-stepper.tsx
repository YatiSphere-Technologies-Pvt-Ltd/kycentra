"use client";

import { Check } from "lucide-react";
import { cn } from "@/lib/utils";

interface PortalStepperProps {
  steps: string[];
  currentStep: number;
}

export function PortalStepper({ steps, currentStep }: PortalStepperProps) {
  return (
    <div className="flex items-center justify-center gap-0" role="list" aria-label="Onboarding progress">
      {steps.map((step, i) => (
        <div key={step} className="flex items-center" role="listitem">
          <div className="flex items-center gap-2">
            <div className={cn(
              "flex h-8 w-8 items-center justify-center rounded-full text-sm font-semibold transition-all",
              i < currentStep && "bg-[#16A34A] text-white",
              i === currentStep && "bg-[#2563EB] text-white",
              i > currentStep && "border-2 border-[#E2E8F0] text-[#94A3B8]",
            )}>
              {i < currentStep ? <Check className="h-4 w-4" /> : i + 1}
            </div>
            <span className={cn(
              "text-sm font-medium whitespace-nowrap",
              i <= currentStep ? "text-[#1E293B]" : "text-[#94A3B8]",
            )}>{step}</span>
          </div>
          {i < steps.length - 1 && (
            <div className={cn(
              "mx-4 h-0.5 w-12 rounded-full",
              i < currentStep ? "bg-[#16A34A]" : "bg-[#E2E8F0]",
            )} />
          )}
        </div>
      ))}
    </div>
  );
}
