"use client";

import Link from "next/link";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Button } from "@/components/ui/button";
import { RiskBadge, AIIndicator, ConfidenceBadge } from "@/components/shared";
import { X, ExternalLink } from "lucide-react";
import { riskStyles } from "@/lib/styles";
import type { GraphNode } from "../types";

const flagMap: Record<string, string> = { KY: "🇰🇾", NL: "🇳🇱", SG: "🇸🇬", JE: "🇯🇪", JP: "🇯🇵", GB: "🇬🇧", VG: "🇻🇬" };

interface DetailPanelProps {
  node: GraphNode;
  onClose: () => void;
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="space-y-2">
      <h4 className="text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">{title}</h4>
      {children}
    </div>
  );
}

export function DetailPanel({ node, onClose }: DetailPanelProps) {
  const flag = flagMap[node.jurisdiction ?? node.nationality ?? ""] ?? "";

  return (
    <div className="absolute right-0 top-0 bottom-0 w-96 z-30 border-l border-border bg-card shadow-elevation-3 flex flex-col">
      <div className="flex items-center justify-between px-5 py-3 border-b border-border">
        <span className="text-sm font-semibold">Entity Detail</span>
        <button type="button" onClick={onClose} className="text-muted-foreground hover:text-foreground" aria-label="Close"><X className="h-4 w-4" /></button>
      </div>

      <ScrollArea className="flex-1">
        <div className="p-5 space-y-5">
          {/* Header */}
          <div>
            <h3 className="text-base font-semibold">{node.name}</h3>
            <p className="text-xs text-muted-foreground mt-0.5">{node.businessType ?? (node.isUBO ? "Beneficial Owner" : "")}</p>
            <p className="text-xs text-muted-foreground">{flag} {node.jurisdictionName ?? node.nationalityName}</p>
            <div className="flex items-center gap-2 mt-2">
              <RiskBadge tier={node.riskTier} />
              {node.isUBO && <span className="rounded-md bg-nx-teal-50 px-1.5 py-0.5 text-[10px] font-bold text-nx-teal-700">UBO</span>}
              {node.pepStatus && <span className="rounded-md bg-nx-rose-50 px-1.5 py-0.5 text-[10px] font-bold text-nx-rose-700">⚠ PEP</span>}
              {node.isClient && <span className="rounded-md bg-nx-indigo-50 px-1.5 py-0.5 text-[10px] font-bold text-nx-indigo-600">Client</span>}
              {node.isSanctioned && <span className="rounded-md bg-nx-rose-100 px-1.5 py-0.5 text-[10px] font-bold text-nx-rose-800">🚫 Sanctioned</span>}
            </div>
          </div>

          {/* AI Assessment */}
          <Section title="AI Assessment">
            <div className="rounded-lg border border-border p-3" style={{ borderLeft: "3px solid var(--nx-violet-400)" }}>
              <div className="flex items-center gap-1.5 mb-1"><AIIndicator size={12} /><span className="text-[11px] font-semibold">Risk Agent</span></div>
              <p className="text-xs text-muted-foreground leading-relaxed">
                {node.riskScore >= 70
                  ? "Elevated risk due to jurisdiction, structural complexity, or PEP association."
                  : node.riskScore >= 40
                    ? "Moderate risk — standard monitoring applies."
                    : "Low risk profile — no significant indicators."}
              </p>
              <ConfidenceBadge value={node.riskScore > 50 ? 67 : 85} className="mt-1.5" />
            </div>
          </Section>

          {/* Key info */}
          {node.registrationNumber && (
            <Section title="Registration">
              <p className="text-xs font-mono text-primary">{node.registrationNumber}</p>
            </Section>
          )}

          {node.effectiveOwnership && (
            <Section title="Effective Ownership">
              <p className="text-sm font-bold tabular-nums">{node.effectiveOwnership}%</p>
            </Section>
          )}

          {node.pepDetail && (
            <Section title="PEP Detail">
              <div className="rounded-lg p-2.5 text-xs leading-relaxed" style={{ backgroundColor: "var(--nx-rose-50)", borderLeft: "3px solid var(--nx-risk-high)" }}>
                {node.pepDetail}
              </div>
            </Section>
          )}

          {node.roles && node.roles.length > 0 && (
            <Section title="Roles">
              {node.roles.map((r) => <p key={r} className="text-xs text-muted-foreground">{r}</p>)}
            </Section>
          )}

          {node.anomalyFlags && (
            <Section title="Anomaly Flags">
              {node.anomalyFlags.map((f) => (
                <p key={f} className="text-xs text-nx-rose-600">⚡ {f.replace(/_/g, " ")}</p>
              ))}
            </Section>
          )}

          {/* Risk indicators */}
          <Section title="Risk Indicators">
            <div className="space-y-1 text-xs">
              {node.riskScore >= 60 && <p>⚠ Risk score: {node.riskScore}/100</p>}
              {node.pepStatus && <p className="text-nx-rose-600">⚠ PEP association confirmed</p>}
              {node.isSanctioned && <p className="text-nx-rose-700">🚫 OFAC sanctioned entity</p>}
              {node.isAnomaly && <p className="text-nx-rose-600">⚡ Anomaly detected</p>}
              {!node.pepStatus && !node.isSanctioned && !node.isAnomaly && node.riskScore < 60 && <p className="text-nx-emerald-600">✅ No significant risk indicators</p>}
            </div>
          </Section>

          {/* Quick actions */}
          <div className="space-y-2 pt-2 border-t border-border">
            <Link href={`/entities/${node.id}`}>
              <Button variant="outline" size="sm" className="w-full gap-1.5 text-xs justify-start">
                <ExternalLink className="h-3 w-3" />Open Entity Detail
              </Button>
            </Link>
            <Button variant="outline" size="sm" className="w-full gap-1.5 text-xs justify-start">Run Fresh Screening</Button>
            <Button variant="outline" size="sm" className="w-full gap-1.5 text-xs justify-start">Export Ownership Report</Button>
          </div>
        </div>
      </ScrollArea>
    </div>
  );
}
