"use client";

import { useState } from "react";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Button } from "@/components/ui/button";
import type { JurisdictionCoverage } from "../types";

const statusColors: Record<string, string> = {
  full: "var(--nx-emerald-500)",
  partial: "var(--nx-amber-500)",
  minimal: "var(--nx-rose-500)",
};

export function JurisdictionCoverageView({ jurisdictions }: { jurisdictions: JurisdictionCoverage[] }) {
  const [selected, setSelected] = useState<JurisdictionCoverage | null>(null);
  const full = jurisdictions.filter((j) => j.status === "full").length;
  const partial = jurisdictions.filter((j) => j.status === "partial").length;

  return (
    <div className="space-y-5">
      <div>
        <h3 className="text-lg font-semibold">Jurisdiction Coverage</h3>
        <p className="text-xs text-muted-foreground">{jurisdictions.length} jurisdictions · {jurisdictions.reduce((s, j) => s + j.rules, 0).toLocaleString()} rules · {full} full, {partial} partial</p>
      </div>

      {/* Legend */}
      <div className="flex items-center gap-4 text-xs text-muted-foreground">
        <span className="flex items-center gap-1"><span className="h-3 w-3 rounded bg-nx-emerald-500" />Full ({full})</span>
        <span className="flex items-center gap-1"><span className="h-3 w-3 rounded bg-nx-amber-500" />Partial ({partial})</span>
        <span className="flex items-center gap-1"><span className="h-3 w-3 rounded bg-nx-rose-500" />Minimal</span>
      </div>

      <div className="grid gap-4 lg:grid-cols-3">
        {/* Jurisdiction grid */}
        <div className="lg:col-span-2">
          <div className="grid gap-2 sm:grid-cols-2 lg:grid-cols-3">
            {jurisdictions.map((j) => (
              <button
                key={j.code}
                type="button"
                className={`flex items-center gap-3 rounded-lg border p-3 text-left transition-all hover:shadow-elevation-1 ${selected?.code === j.code ? "border-primary bg-primary/5" : "border-border bg-card"}`}
                onClick={() => setSelected(j)}
              >
                <span className="text-xl">{j.flag}</span>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium truncate">{j.name}</p>
                  <div className="flex items-center gap-2 mt-0.5">
                    <div className="w-12 h-1.5 rounded-full bg-nx-neutral-100">
                      <div className="h-full rounded-full" style={{ width: `${j.coverage * 100}%`, backgroundColor: statusColors[j.status] }} />
                    </div>
                    <span className="text-[10px] text-muted-foreground tabular-nums">{Math.round(j.coverage * 100)}%</span>
                  </div>
                </div>
                <div className="text-right shrink-0">
                  <p className="text-xs font-bold tabular-nums">{j.rules}</p>
                  <p className="text-[9px] text-muted-foreground">rules</p>
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* Detail panel */}
        <div>
          {selected ? (
            <div className="rounded-xl border border-border bg-card p-5 shadow-elevation-1 sticky top-4 space-y-4">
              <div className="flex items-center gap-3">
                <span className="text-3xl">{selected.flag}</span>
                <div>
                  <h4 className="text-base font-semibold">{selected.name}</h4>
                  <p className="text-xs text-muted-foreground">Coverage: {Math.round(selected.coverage * 100)}%</p>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="rounded-lg border border-border p-3 text-center">
                  <p className="text-lg font-bold tabular-nums">{selected.rules}</p>
                  <p className="text-[10px] text-muted-foreground">Rules</p>
                </div>
                <div className="rounded-lg border border-border p-3 text-center">
                  <p className="text-lg font-bold tabular-nums">{selected.entities.toLocaleString()}</p>
                  <p className="text-[10px] text-muted-foreground">Entities</p>
                </div>
              </div>

              <div>
                <p className="text-xs text-muted-foreground">Last regulatory update: {selected.lastUpdate}</p>
              </div>

              <div className="flex flex-col gap-2">
                <Button variant="outline" size="sm" className="text-xs">View All Rules</Button>
                <Button variant="outline" size="sm" className="text-xs">View Entities</Button>
                <Button variant="outline" size="sm" className="text-xs">View Change History</Button>
              </div>
            </div>
          ) : (
            <div className="rounded-xl border border-border bg-card p-8 text-center text-sm text-muted-foreground">
              Select a jurisdiction to view details
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
