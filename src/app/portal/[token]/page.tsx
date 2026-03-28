"use client";

import { useState } from "react";
import { PortalStepper } from "@/features/client-portal/components/portal-stepper";
import { StepCompanyInfo } from "@/features/client-portal/components/step-company-info";
import { StepOwnership } from "@/features/client-portal/components/step-ownership";
import { StepDocuments } from "@/features/client-portal/components/step-documents";
import { StepReview } from "@/features/client-portal/components/step-review";
import { HelpCircle, Globe, Save } from "lucide-react";

const steps = ["Company Info", "Ownership", "Documents", "Review"];

export default function ClientPortalPage() {
  const [currentStep, setCurrentStep] = useState(0);

  return (
    <div className="min-h-screen" style={{ backgroundColor: "#FAFBFE" }}>
      {/* Portal topbar */}
      <header className="flex items-center justify-between border-b px-6 py-3" style={{ borderColor: "#E2E8F0", backgroundColor: "#FFFFFF" }}>
        <div className="flex items-center gap-2.5">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg" style={{ backgroundColor: "#2563EB" }}>
            <span className="text-xs font-bold text-white">N</span>
          </div>
          <span className="text-sm font-semibold" style={{ color: "#1E293B" }}>Nexus Financial Services</span>
        </div>
        <div className="flex items-center gap-3">
          <button type="button" className="flex items-center gap-1.5 text-xs font-medium" style={{ color: "#64748B" }}>
            <Globe className="h-3.5 w-3.5" />DE
          </button>
          <button type="button" className="flex items-center gap-1.5 text-xs font-medium" style={{ color: "#64748B" }}>
            <HelpCircle className="h-3.5 w-3.5" />Help
          </button>
          <button type="button" className="flex items-center gap-1.5 text-xs font-medium" style={{ color: "#64748B" }}>
            <Save className="h-3.5 w-3.5" />Save
          </button>
        </div>
      </header>

      {/* Stepper */}
      <div className="py-6 px-6">
        <PortalStepper steps={steps} currentStep={currentStep} />
      </div>

      {/* Content */}
      <div className="mx-auto max-w-[680px] px-6 pb-12">
        {currentStep === 0 && <StepCompanyInfo onContinue={() => setCurrentStep(1)} />}
        {currentStep === 1 && <StepOwnership onContinue={() => setCurrentStep(2)} onBack={() => setCurrentStep(0)} />}
        {currentStep === 2 && <StepDocuments onContinue={() => setCurrentStep(3)} onBack={() => setCurrentStep(1)} />}
        {currentStep === 3 && <StepReview onBack={() => setCurrentStep(2)} />}
      </div>

      {/* Footer */}
      <footer className="border-t py-4 text-center text-xs" style={{ borderColor: "#E2E8F0", color: "#94A3B8" }}>
        Powered by Nexus · Privacy Policy · Terms
      </footer>
    </div>
  );
}
