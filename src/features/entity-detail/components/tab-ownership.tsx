"use client";

import { useState } from "react";
import { RiskBadge, ConfidenceBadge } from "@/components/shared";
import { Button } from "@/components/ui/button";
import { GitBranch, ExternalLink } from "lucide-react";
import { cn } from "@/lib/utils";
import type { BeneficialOwner, Entity } from "../types";

interface OwnershipTabProps { entity: Entity; owners: BeneficialOwner[] }

const flagMap: Record<string, string> = { GB: "🇬🇧", JP: "🇯🇵", NL: "🇳🇱", SG: "🇸🇬", JE: "🇯🇪", KY: "🇰🇾" };

export function TabOwnership({ entity, owners }: OwnershipTabProps) {
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const selected = owners.find((o) => o.id === selectedId);

  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <GitBranch className="h-3.5 w-3.5 text-muted-foreground/40" />
          <span className="text-[12px] font-bold">Beneficial Ownership</span>
          <span className="text-[10px] text-muted-foreground">{owners.length} UBOs · 5 layers · 4 jurisdictions</span>
        </div>
        <Button variant="outline" size="sm" className="h-7 text-[10px] font-semibold gap-1.5" onClick={() => window.location.href = "/graph/explorer"}>
          <ExternalLink className="h-3 w-3" /> Open Graph Explorer
        </Button>
      </div>

      {/* Ownership tree — visual */}
      <div className="rounded-lg border border-border bg-card overflow-hidden">
        <div className="px-4 py-2.5 border-b border-border bg-muted/20">
          <span className="text-[9px] font-bold text-muted-foreground uppercase tracking-widest">Ownership Structure</span>
        </div>
        <div className="p-6">
          {/* Root entity */}
          <div className="flex flex-col items-center">
            <div className="rounded-lg border-2 border-foreground bg-card px-6 py-3 text-center">
              <p className="text-[12px] font-bold">{entity.name}</p>
              <p className="text-[10px] text-muted-foreground">{flagMap[entity.jurisdictionCode]} {entity.jurisdiction}</p>
              <div className="mt-1"><RiskBadge tier={entity.riskTier} compact className="text-[9px]" /></div>
            </div>
            <div className="h-6 w-px bg-border" />

            {/* Owner branches */}
            <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4 w-full">
              {owners.map((o) => {
                const intermediary = o.intermediaries[0];
                const isSelected = selectedId === o.id;
                return (
                  <div key={o.id} className="flex flex-col items-center gap-0">
                    {/* Percentage label */}
                    <div className="text-[11px] font-bold tabular-nums text-foreground/60 mb-1">{o.effectiveOwnership}%</div>

                    {/* Intermediary */}
                    {intermediary && (
                      <>
                        <div className={cn("rounded border bg-muted/20 px-3 py-2 text-center w-full", intermediary.type === "trust" && "border-dashed")}>
                          <p className="text-[10px] font-semibold truncate">{intermediary.name}</p>
                          <p className="text-[9px] text-muted-foreground">{flagMap[intermediary.jurisdiction]} {intermediary.jurisdiction}</p>
                          {intermediary.ownership && <span className="text-[9px] font-bold tabular-nums text-foreground/60">{intermediary.ownership}%</span>}
                          {intermediary.role && <span className="text-[9px] text-muted-foreground capitalize ml-1">· {intermediary.role}</span>}
                        </div>
                        <div className="h-3 w-px bg-border" />
                      </>
                    )}

                    {/* UBO */}
                    <button
                      onClick={() => setSelectedId(isSelected ? null : o.id)}
                      className={cn(
                        "rounded-lg border bg-card px-3 py-2.5 text-left w-full transition-all",
                        isSelected ? "border-foreground shadow-md" : "border-border hover:border-foreground/30 hover:shadow-sm"
                      )}
                    >
                      <div className="flex items-center gap-2 mb-1">
                        <div className="h-6 w-6 rounded-full bg-foreground/5 flex items-center justify-center text-[8px] font-bold shrink-0">
                          {o.name.split(" ").map((w) => w[0]).join("")}
                        </div>
                        <span className="text-[11px] font-semibold truncate">{o.name}</span>
                        <span className="text-[10px]">{flagMap[o.nationality]}</span>
                      </div>
                      <div className="flex items-center gap-1.5 mt-1">
                        <span className="text-[8px] font-bold bg-foreground/5 px-1 py-0.5 rounded uppercase">UBO</span>
                        <RiskBadge tier={o.riskTier} compact className="text-[8px]" />
                        {o.pepStatus && <span className="text-[8px] font-bold text-nx-rose-700 bg-nx-rose-50 px-1 py-0.5 rounded">PEP</span>}
                      </div>
                    </button>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>

      {/* Selected UBO detail */}
      {selected && (
        <div className="rounded-lg border border-border bg-card overflow-hidden">
          <div className="flex items-center justify-between px-4 py-2.5 border-b border-border">
            <span className="text-[12px] font-bold">{selected.name}</span>
            <button onClick={() => setSelectedId(null)} className="text-[10px] text-muted-foreground hover:text-foreground">Close ×</button>
          </div>
          <div className="p-4 grid grid-cols-2 lg:grid-cols-4 gap-4 text-[11px]">
            <div><span className="text-[9px] font-bold text-muted-foreground uppercase tracking-widest block mb-0.5">Nationality</span>{flagMap[selected.nationality]} {selected.nationality}</div>
            <div><span className="text-[9px] font-bold text-muted-foreground uppercase tracking-widest block mb-0.5">Effective Ownership</span><span className="font-bold tabular-nums">{selected.effectiveOwnership}%</span></div>
            <div><span className="text-[9px] font-bold text-muted-foreground uppercase tracking-widest block mb-0.5">Risk Tier</span><RiskBadge tier={selected.riskTier} compact className="text-[9px]" /></div>
            <div><span className="text-[9px] font-bold text-muted-foreground uppercase tracking-widest block mb-0.5">PEP Status</span>{selected.pepStatus ? <span className="font-bold text-nx-rose-700">Yes — PEP Level 2</span> : "No"}</div>
          </div>
          {selected.pepDetail && (
            <div className="mx-4 mb-4 p-3 rounded bg-nx-rose-50/50 border-l-2 border-nx-rose-500">
              <p className="text-[10px] text-muted-foreground">{selected.pepDetail}</p>
            </div>
          )}
          <div className="px-4 pb-4">
            <span className="text-[9px] font-bold text-muted-foreground uppercase tracking-widest block mb-0.5">Ownership Path</span>
            <p className="text-[10px] text-muted-foreground">{selected.path}</p>
          </div>
        </div>
      )}

      {/* UBO table — additional detail */}
      <div className="rounded-lg border border-border bg-card overflow-hidden">
        <div className="px-4 py-2.5 border-b border-border">
          <span className="text-[12px] font-bold">UBO Summary Table</span>
        </div>
        <table className="w-full text-[11px]">
          <thead>
            <tr className="border-b border-border bg-muted/20">
              {["Name", "Nationality", "Ownership", "Via", "Risk", "PEP", "Verification"].map((h) => (
                <th key={h} className="text-left font-bold text-muted-foreground uppercase tracking-wider px-4 py-2">{h}</th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-border">
            {owners.map((o) => (
              <tr key={o.id} className="hover:bg-muted/10">
                <td className="px-4 py-2.5 font-semibold">{o.name}</td>
                <td className="px-4 py-2.5">{flagMap[o.nationality]} {o.nationality}</td>
                <td className="px-4 py-2.5 font-bold tabular-nums">{o.effectiveOwnership}%</td>
                <td className="px-4 py-2.5 text-muted-foreground text-[10px]">{o.intermediaries[0]?.name ?? "Direct"}</td>
                <td className="px-4 py-2.5"><RiskBadge tier={o.riskTier} compact className="text-[9px]" /></td>
                <td className="px-4 py-2.5">{o.pepStatus ? <span className="text-[9px] font-bold text-nx-rose-700 bg-nx-rose-50 px-1 py-0.5 rounded">PEP</span> : <span className="text-muted-foreground/40">—</span>}</td>
                <td className="px-4 py-2.5"><span className="text-[9px] font-bold text-nx-emerald-600">Verified</span></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
