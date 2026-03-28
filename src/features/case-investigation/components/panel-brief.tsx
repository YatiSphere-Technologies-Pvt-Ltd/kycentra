"use client";

import { DashboardCard } from "@/components/shared/dashboard-card";
import { AIIndicator, ConfidenceBadge, RiskBadge } from "@/components/shared";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Button } from "@/components/ui/button";
import { RefreshCw } from "lucide-react";
import type { CaseDetail, SimilarCase } from "../types";

interface BriefPanelProps {
  caseData: CaseDetail;
  similarCases: SimilarCase[];
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="space-y-2">
      <h4 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">{title}</h4>
      <div className="text-sm text-muted-foreground leading-relaxed" style={{ borderLeft: "3px solid var(--nx-violet-300)", paddingLeft: "12px" }}>
        {children}
      </div>
    </div>
  );
}

export function PanelBrief({ caseData, similarCases }: BriefPanelProps) {
  return (
    <ScrollArea className="h-full">
      <div className="space-y-5 p-5">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <AIIndicator size={16} />
            <h3 className="text-base font-semibold">AI Investigation Brief</h3>
          </div>
          <div className="flex items-center gap-2">
            <ConfidenceBadge value={Math.round(caseData.briefConfidence * 100)} />
            <Button variant="ghost" size="sm" className="gap-1.5 text-xs h-7"><RefreshCw className="h-3 w-3" />Regenerate</Button>
          </div>
        </div>

        {/* Executive summary */}
        <Section title="Executive Summary">
          <p>This case was initiated on March 22, 2026 following two concurrent triggers: (1) an OFAC SDN screening match for Meridian Capital Partners Ltd (Match Score: 82%), and (2) identification of a PEP association through the beneficial ownership chain.</p>
          <ul className="mt-2 space-y-1 list-disc list-inside text-[13px]">
            <li>OFAC match requires manual registry verification — AI confidence insufficient (42%)</li>
            <li>Elizabeth Wentworth (25% UBO via Crown Bay Trust) confirmed PEP</li>
            <li>Transaction patterns consistent with fund administration — no anomalies</li>
            <li>Jurisdiction risk: Cayman Islands under FATF monitoring</li>
          </ul>
          <p className="mt-2 font-medium text-foreground">AI Recommendation: Resolve OFAC match first. If false positive, proceed with EDD for PEP. If true positive, immediate MLRO escalation.</p>
        </Section>

        {/* Triggers */}
        <Section title="Trigger Analysis">
          {caseData.triggers.map((t, i) => (
            <div key={i} className="flex items-start gap-2 py-1.5">
              <span className="h-1.5 w-1.5 rounded-full bg-nx-rose-500 mt-1.5 shrink-0" />
              <div>
                <p className="text-[13px] font-medium text-foreground">{t.detail}</p>
                <p className="text-[11px] text-muted-foreground/60">{new Date(t.timestamp).toLocaleString()}</p>
              </div>
            </div>
          ))}
        </Section>

        {/* Risk indicators */}
        <Section title="Risk Indicators">
          {[
            { text: "OFAC SDN match: 82% score, name + jurisdiction overlap", level: "🔴" },
            { text: "PEP: Elizabeth Wentworth, close associate of former UK Cabinet member", level: "🔴" },
            { text: "Complex UBO: 5-layer structure across 4 jurisdictions", level: "🟡" },
            { text: "Secrecy jurisdiction: Cayman Islands (FATF monitored)", level: "🟡" },
            { text: "Transaction patterns: Normal — consistent with fund admin", level: "🟢" },
          ].map((r, i) => (
            <div key={i} className="flex items-start gap-2 py-1 text-[13px]">
              <span>{r.level}</span>
              <span>{r.text}</span>
            </div>
          ))}
        </Section>

        {/* Similar cases */}
        <div className="space-y-2">
          <h4 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Historical Precedent</h4>
          <div className="space-y-2">
            {similarCases.map((sc) => (
              <div key={sc.caseId} className="rounded-lg border border-border p-3 text-[13px]">
                <div className="flex items-center gap-2">
                  <span className="font-mono text-primary font-medium">{sc.caseId}</span>
                  <span className="rounded-md bg-muted px-1.5 py-0.5 text-[10px] font-bold tabular-nums">{sc.similarity}% match</span>
                </div>
                <p className="mt-1 text-muted-foreground">{sc.entity} · {sc.jurisdiction}</p>
                <p className="mt-0.5"><span className="font-medium">Outcome:</span> {sc.outcome} — {sc.resolution}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Recommended next steps */}
        <Section title="Recommended Next Steps">
          <div className="space-y-2">
            {[
              "Verify OFAC match via CIMA registry lookup (~15 min)",
              "Conduct enhanced PEP screening on Elizabeth Wentworth (~20 min)",
              "Review Crown Bay Trust deed for control provisions (~30 min)",
              "Verify source of funds through audited financials (~20 min)",
              "Make SAR/No-SAR determination and document reasoning (~15 min)",
            ].map((step, i) => (
              <label key={i} className="flex items-start gap-2 text-[13px] cursor-pointer">
                <input type="checkbox" className="mt-0.5 accent-primary" />
                <span>{i + 1}. {step}</span>
              </label>
            ))}
          </div>
        </Section>
      </div>
    </ScrollArea>
  );
}
