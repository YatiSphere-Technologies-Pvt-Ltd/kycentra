"use client";

import { useState } from "react";
import { cn } from "@/lib/utils";
import { BookOpen, Shield, FlaskConical, PenTool, Globe } from "lucide-react";
import {
  RuleLibrary,
  ChangeMonitor,
  Simulator,
  RuleBuilder,
  JurisdictionCoverageView,
} from "@/features/regulations";
import { rules, regulatoryChanges, jurisdictions, simulationResult } from "@/features/regulations/data/mock-data";

const subTabs = [
  { id: "library", label: "Rule Library", icon: BookOpen, count: rules.length },
  { id: "monitor", label: "Change Monitor", icon: Shield, count: regulatoryChanges.filter((c) => c.status === "action_required").length },
  { id: "simulator", label: "Simulator", icon: FlaskConical },
  { id: "builder", label: "Rule Builder", icon: PenTool },
  { id: "jurisdictions", label: "Jurisdictions", icon: Globe, count: jurisdictions.length },
] as const;

type SubTab = (typeof subTabs)[number]["id"];

export default function RegulationsPage() {
  const [activeTab, setActiveTab] = useState<SubTab>("library");

  return (
    <div className="space-y-5">
      <div>
        <h2 className="text-xl font-semibold">Regulatory Rules Engine</h2>
        <p className="text-xs text-muted-foreground mt-0.5">127 jurisdictions · 1,847 rules · Powered by Regulatory Agent</p>
      </div>

      <div className="flex gap-0 border-b border-border overflow-x-auto" role="tablist">
        {subTabs.map((tab) => {
          const Icon = tab.icon;
          return (
            <button
              key={tab.id}
              type="button"
              role="tab"
              aria-selected={activeTab === tab.id}
              className={cn(
                "flex items-center gap-1.5 px-4 py-2.5 text-sm font-medium border-b-2 transition-colors whitespace-nowrap",
                activeTab === tab.id
                  ? "border-primary text-primary"
                  : "border-transparent text-muted-foreground hover:text-foreground hover:bg-muted/30"
              )}
              onClick={() => setActiveTab(tab.id)}
            >
              <Icon className="h-4 w-4" />
              {tab.label}
              {"count" in tab && tab.count != null && (
                <span className={cn(
                  "flex h-4.5 min-w-4.5 items-center justify-center rounded-full px-1 text-[10px] font-semibold",
                  activeTab === tab.id && tab.id === "monitor" ? "bg-nx-rose-100 text-nx-rose-700" : "bg-muted text-muted-foreground"
                )}>
                  {tab.count}
                </span>
              )}
            </button>
          );
        })}
      </div>

      {activeTab === "library" && <RuleLibrary rules={rules} />}
      {activeTab === "monitor" && <ChangeMonitor changes={regulatoryChanges} />}
      {activeTab === "simulator" && <Simulator result={simulationResult} />}
      {activeTab === "builder" && <RuleBuilder />}
      {activeTab === "jurisdictions" && <JurisdictionCoverageView jurisdictions={jurisdictions} />}

      <div className="flex items-center justify-between text-[11px] text-muted-foreground border-t border-border pt-3">
        <span>127 jurisdictions active · 1,847 rules deployed · Last scan: 2h ago</span>
        <span>Regulatory Agent: Active · Model: claude-opus-4-6</span>
      </div>
    </div>
  );
}
