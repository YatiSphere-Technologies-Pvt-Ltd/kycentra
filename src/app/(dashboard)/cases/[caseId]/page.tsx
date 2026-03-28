"use client";

import { useState } from "react";
import { cn } from "@/lib/utils";
import {
  CaseHeader,
  PhaseStepper,
  PanelBrief,
  PanelEvidence,
  PanelTransactions,
  PanelSARDraft,
  PanelDecision,
  PanelCollaboration,
  PanelAudit,
  ActionBar,
} from "@/features/case-investigation";
import {
  caseDetail,
  phases,
  evidenceItems,
  auditTrail,
  chatMessages,
  similarCases,
  sarNarrative,
  transactionData,
} from "@/features/case-investigation/data/mock-data";
import { FileText, Shield, BarChart3, BookOpen, MessageSquare, ClipboardList, BrainCircuit } from "lucide-react";

// ============================================================
// Case Investigation Workspace — /cases/[caseId]
// Three-panel deep-work layout for compliance investigations.
// ============================================================

const leftTabs = [
  { id: "brief", label: "AI Brief", icon: BrainCircuit },
  { id: "evidence", label: "Evidence", icon: Shield },
  { id: "transactions", label: "Transactions", icon: BarChart3 },
] as const;

const rightTabs = [
  { id: "sar", label: "SAR Draft", icon: FileText },
  { id: "decision", label: "Decision", icon: ClipboardList },
  { id: "collab", label: "Discussion", icon: MessageSquare },
  { id: "audit", label: "Audit Trail", icon: BookOpen },
] as const;

type LeftTab = (typeof leftTabs)[number]["id"];
type RightTab = (typeof rightTabs)[number]["id"];

function TabBar<T extends string>({
  tabs,
  active,
  onChange,
}: {
  tabs: readonly { id: T; label: string; icon: React.ComponentType<{ className?: string }> }[];
  active: T;
  onChange: (id: T) => void;
}) {
  return (
    <div className="flex border-b border-border bg-muted/20" role="tablist">
      {tabs.map((tab) => {
        const Icon = tab.icon;
        return (
          <button
            key={tab.id}
            type="button"
            role="tab"
            aria-selected={active === tab.id}
            className={cn(
              "flex items-center gap-1.5 px-3 py-2 text-xs font-medium border-b-2 transition-colors whitespace-nowrap",
              active === tab.id
                ? "border-primary text-primary"
                : "border-transparent text-muted-foreground hover:text-foreground hover:bg-muted/30"
            )}
            onClick={() => onChange(tab.id)}
          >
            <Icon className="h-3.5 w-3.5" />
            {tab.label}
          </button>
        );
      })}
    </div>
  );
}

export default function CaseInvestigationPage() {
  const [leftTab, setLeftTab] = useState<LeftTab>("brief");
  const [rightTab, setRightTab] = useState<RightTab>("sar");

  return (
    <div className="-m-6 flex flex-col" style={{ height: "calc(100vh - var(--nx-topbar-height))" }}>
      {/* Case header */}
      <CaseHeader caseData={caseDetail} />

      {/* Phase stepper */}
      <div className="px-6 pt-4 pb-2">
        <PhaseStepper phases={phases} sla={caseDetail.sla} />
      </div>

      {/* Two-panel workspace */}
      <div className="flex flex-1 min-h-0 px-6 pb-20 gap-1">
        {/* LEFT PANEL — Evidence & Analysis */}
        <div className="flex flex-col w-[55%] min-w-0 rounded-xl border border-border bg-card shadow-elevation-1 overflow-hidden">
          <TabBar tabs={leftTabs} active={leftTab} onChange={setLeftTab} />
          <div className="flex-1 min-h-0 overflow-hidden">
            {leftTab === "brief" && <PanelBrief caseData={caseDetail} similarCases={similarCases} />}
            {leftTab === "evidence" && <PanelEvidence items={evidenceItems} />}
            {leftTab === "transactions" && <PanelTransactions data={transactionData} />}
          </div>
        </div>

        {/* Resizable splitter handle */}
        <div className="w-1 shrink-0 cursor-col-resize hover:bg-primary/20 rounded-full transition-colors" aria-label="Resize panels" />

        {/* RIGHT PANEL — Case Brief / SAR / Decision */}
        <div className="flex flex-col w-[45%] min-w-0 rounded-xl border border-border bg-card shadow-elevation-1 overflow-hidden">
          <TabBar tabs={rightTabs} active={rightTab} onChange={setRightTab} />
          <div className="flex-1 min-h-0 overflow-hidden">
            {rightTab === "sar" && <PanelSARDraft caseData={caseDetail} narrative={sarNarrative} />}
            {rightTab === "decision" && <PanelDecision />}
            {rightTab === "collab" && <PanelCollaboration messages={chatMessages} collaborators={caseDetail.collaborators} />}
            {rightTab === "audit" && <PanelAudit entries={auditTrail} />}
          </div>
        </div>
      </div>

      {/* Fixed bottom action bar */}
      <ActionBar caseData={caseDetail} />
    </div>
  );
}
