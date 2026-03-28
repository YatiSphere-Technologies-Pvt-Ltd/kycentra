"use client";

import { useRouter } from "next/navigation";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Button } from "@/components/ui/button";
import { AIIndicator, ConfidenceBadge } from "@/components/shared";
import { riskStyles } from "@/lib/styles";

interface PriorityItem {
  id: string;
  agent: string;
  agentIcon: string;
  category: string;
  riskTier: "critical" | "high" | "medium" | "low";
  entityName: string;
  description: string;
  aiConfidence: number;
  aiSummary: string;
  timePending: string;
  canApproveInline: boolean;
  entityId?: string;
}

const items: PriorityItem[] = [
  { id: "pq-1", agent: "Screening Agent", agentIcon: "🛡", category: "SCREENING", riskTier: "critical", entityName: "Volkov Intl. Trading", description: "OFAC SDN potential match", aiConfidence: 42, aiSummary: "Needs manual registry check", timePending: "45m", canApproveInline: false, entityId: "ENT-VIT-001" },
  { id: "pq-2", agent: "Investigation Agent", agentIcon: "🔍", category: "INVESTIGATION", riskTier: "critical", entityName: "Meridian Capital Partners", description: "SAR narrative ready for review", aiConfidence: 78, aiSummary: "Draft complete, 5 evidence items", timePending: "25m", canApproveInline: false, entityId: "ENT-2019-MC-8847" },
  { id: "pq-3", agent: "Risk Agent", agentIcon: "⚡", category: "RISK", riskTier: "high", entityName: "Horizon Trading LLC", description: "Risk elevated 58→72", aiConfidence: 88, aiSummary: "PEP association detected", timePending: "2h", canApproveInline: true },
  { id: "pq-4", agent: "Document Agent", agentIcon: "📄", category: "DOCUMENT", riskTier: "high", entityName: "Pacific Rim Holdings", description: "Cert. of incorporation date discrepancy", aiConfidence: 78, aiSummary: "1 day difference — likely filing vs effective", timePending: "1.5h", canApproveInline: true },
  { id: "pq-5", agent: "Regulatory Agent", agentIcon: "📖", category: "REGULATORY", riskTier: "high", entityName: "EU Portfolio", description: "AMLA RTS on UBO — 12 rules need update", aiConfidence: 93, aiSummary: "Draft rule updates prepared", timePending: "Jun 2026", canApproveInline: false },
  { id: "pq-6", agent: "Risk Agent", agentIcon: "⚡", category: "RISK", riskTier: "low", entityName: "Greenfield Fund II", description: "Periodic review AI assessment ready", aiConfidence: 92, aiSummary: "No material changes, recommend OK", timePending: "30m", canApproveInline: true },
  { id: "pq-7", agent: "Screening Agent", agentIcon: "🛡", category: "SCREENING", riskTier: "high", entityName: "Crescent Bay Financial", description: "PEP confirmed — EDD upgrade needed", aiConfidence: 94, aiSummary: "Director linked to former minister", timePending: "2h", canApproveInline: true },
];

export function PriorityQueue() {
  const router = useRouter();

  return (
    <div className="flex h-full flex-col rounded-xl border border-border bg-card shadow-elevation-1">
      <div className="flex items-center justify-between border-b border-border px-5 py-3">
        <div>
          <h3 className="text-sm font-semibold">Needs Your Attention</h3>
          <p className="text-[10px] text-muted-foreground">Items AI agents couldn't resolve autonomously</p>
        </div>
        <span className="flex h-6 min-w-6 items-center justify-center rounded-full bg-nx-amber-100 px-1.5 text-xs font-bold text-nx-amber-700">{items.length}</span>
      </div>

      <ScrollArea className="flex-1">
        <div className="divide-y divide-border">
          {items.map((item) => {
            const risk = riskStyles[item.riskTier];
            return (
              <div key={item.id} className="px-4 py-3 hover:bg-muted/20 transition-colors" style={{ borderLeft: `3px solid ${risk.fg}` }}>
                <div className="flex items-start gap-2">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-1.5 text-[10px]">
                      <span>{item.agentIcon}</span>
                      <span className="font-semibold uppercase tracking-wider text-muted-foreground">{item.category}</span>
                      <span style={{ color: risk.fg }}>· {riskStyles[item.riskTier].label}</span>
                    </div>
                    <p className="text-[13px] font-medium mt-0.5">
                      {item.entityName} — {item.description}
                    </p>
                    <div className="flex items-center gap-2 mt-1">
                      <AIIndicator size={10} />
                      <ConfidenceBadge value={item.aiConfidence} />
                      <span className="text-[10px] text-muted-foreground italic truncate">{item.aiSummary}</span>
                    </div>
                  </div>

                  <div className="flex flex-col items-end gap-1.5 shrink-0">
                    <span className="text-[10px] text-muted-foreground tabular-nums">{item.timePending}</span>
                    {item.canApproveInline ? (
                      <div className="flex gap-1">
                        <Button size="sm" className="h-6 px-2 text-[10px]">Approve</Button>
                        <Button size="sm" variant="ghost" className="h-6 px-2 text-[10px]">Reject</Button>
                      </div>
                    ) : (
                      <Button
                        size="sm"
                        variant="outline"
                        className="h-6 px-2 text-[10px]"
                        onClick={() => router.push(item.entityId ? `/entities/${item.entityId}` : "/screening")}
                      >
                        Review →
                      </Button>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </ScrollArea>
    </div>
  );
}
