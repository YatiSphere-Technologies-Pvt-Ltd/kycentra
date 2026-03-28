"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { RiskBadge } from "@/components/shared";
import { caseStatusStyles, riskStyles } from "@/lib/styles";
import { Plus, Briefcase } from "lucide-react";
import { activeCases } from "@/features/workbench/data/mock-data";

export function TabCases() {
  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Briefcase className="h-3.5 w-3.5 text-muted-foreground/40" />
          <span className="text-[12px] font-bold">Cases & Investigations</span>
          <span className="flex h-4.5 min-w-4.5 items-center justify-center rounded bg-foreground px-1 text-[9px] font-bold text-background tabular-nums">{activeCases.length}</span>
        </div>
        <Button size="sm" className="h-7 text-[10px] font-semibold gap-1.5"><Plus className="h-3 w-3" /> Create Case</Button>
      </div>

      <div className="rounded-lg border border-border bg-card overflow-hidden">
        <table className="w-full text-[11px]">
          <thead>
            <tr className="border-b border-border bg-muted/20">
              {["Case ID", "Entity", "Type", "Risk", "Status", "Assigned", "Updated"].map((h) => (
                <th key={h} className="text-left font-bold text-muted-foreground uppercase tracking-wider px-4 py-2 whitespace-nowrap">{h}</th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-border">
            {activeCases.map((c) => {
              const risk = riskStyles[c.riskTier];
              const status = caseStatusStyles[c.status];
              return (
                <tr key={c.caseId} className="hover:bg-muted/10 transition-colors">
                  <td className="px-4 py-2.5">
                    <Link href={`/cases/${c.caseId}`} className="font-mono text-[11px] font-semibold text-foreground hover:underline">{c.caseId}</Link>
                  </td>
                  <td className="px-4 py-2.5 font-medium">{c.entity}</td>
                  <td className="px-4 py-2.5">
                    <span className="text-[9px] font-bold px-1.5 py-0.5 rounded" style={{ backgroundColor: `${risk.fg}10`, color: risk.fg }}>{c.type}</span>
                  </td>
                  <td className="px-4 py-2.5"><RiskBadge tier={c.riskTier} compact className="text-[9px]" /></td>
                  <td className="px-4 py-2.5">
                    <span className="text-[9px] font-bold px-1.5 py-0.5 rounded" style={{ color: status.fg, backgroundColor: status.bg }}>{status.label}</span>
                  </td>
                  <td className="px-4 py-2.5">
                    <div className="h-5 w-5 rounded-full bg-foreground/10 flex items-center justify-center text-[8px] font-bold">{c.assignee.initials}</div>
                  </td>
                  <td className="px-4 py-2.5 text-muted-foreground tabular-nums">{c.updated}</td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
