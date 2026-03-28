"use client";

import Link from "next/link";
import { PageHeader, RiskBadge } from "@/components/shared";
import { DashboardCard } from "@/components/shared/dashboard-card";
import { caseStatusStyles } from "@/lib/styles";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { activeCases } from "@/features/workbench/data/mock-data";

export default function CasesPage() {
  return (
    <div className="space-y-5">
      <PageHeader
        title="Cases"
        description="Investigations and case management"
        actions={<Button size="sm" className="gap-1.5"><Plus className="h-3.5 w-3.5" />Create Case</Button>}
      />
      <DashboardCard.Root>
        <DashboardCard.Content noPadding className="overflow-auto">
          <table className="w-full text-sm" aria-label="Cases">
            <caption className="sr-only">Active cases and investigations</caption>
            <thead>
              <tr className="border-b border-border bg-muted/40">
                {["Case ID", "Entity", "Type", "Risk", "Status", "Assigned", "Updated"].map((h, i) => (
                  <th key={h} scope="col" className={`px-4 py-3 text-[11px] font-semibold uppercase tracking-wider text-muted-foreground ${i === 6 ? "text-right" : "text-left"}`}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {activeCases.map((c) => {
                const s = caseStatusStyles[c.status];
                return (
                  <tr key={c.caseId} className="hover:bg-muted/30 transition-colors">
                    <td className="px-4 py-3"><span className="font-mono text-xs font-medium text-primary">{c.caseId}</span></td>
                    <td className="px-4 py-3">{c.entity}</td>
                    <td className="px-4 py-3"><span className="rounded bg-muted px-2 py-0.5 text-[11px] font-medium text-muted-foreground">{c.type}</span></td>
                    <td className="px-4 py-3"><RiskBadge tier={c.riskTier} /></td>
                    <td className="px-4 py-3"><span className="inline-flex rounded-md px-2 py-0.5 text-[11px] font-bold" style={{ color: s.fg, backgroundColor: s.bg }}>{s.label}</span></td>
                    <td className="px-4 py-3"><span className="flex h-6 w-6 items-center justify-center rounded-full bg-primary text-[10px] font-bold text-primary-foreground">{c.assignee.initials}</span></td>
                    <td className="px-4 py-3 text-right text-xs text-muted-foreground tabular-nums">{c.updated}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </DashboardCard.Content>
      </DashboardCard.Root>
    </div>
  );
}
