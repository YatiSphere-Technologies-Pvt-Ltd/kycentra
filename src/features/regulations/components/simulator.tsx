"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { AIIndicator, ConfidenceBadge } from "@/components/shared";
import { Play, Sparkles } from "lucide-react";
import type { SimulationResult } from "../types";

interface SimulatorProps {
  result: SimulationResult | null;
}

export function Simulator({ result }: SimulatorProps) {
  const [scenario, setScenario] = useState("We want to require enhanced due diligence for all clients domiciled in jurisdictions on the FATF grey list, regardless of their current risk tier.");
  const [showResult, setShowResult] = useState(!!result);

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-semibold">Compliance Simulator</h3>
        <p className="text-xs text-muted-foreground">Model regulatory changes before they go live</p>
      </div>

      {/* Setup */}
      <div className="rounded-xl border border-border bg-card p-5 shadow-elevation-1 space-y-4">
        <div className="space-y-2">
          <p className="text-sm font-medium">Scenario Type</p>
          {["Rule Change", "New Regulation", "New Market Entry", "Client Segment Change"].map((opt, i) => (
            <label key={opt} className="flex items-center gap-2 text-sm cursor-pointer">
              <input type="radio" name="scenario-type" defaultChecked={i === 0} className="accent-primary" />
              {opt}
            </label>
          ))}
        </div>

        <div>
          <p className="text-sm font-medium mb-2">Describe the change in plain English:</p>
          <textarea
            className="w-full rounded-lg border border-border bg-background px-4 py-3 text-sm leading-relaxed placeholder:text-muted-foreground/50 focus:outline-none focus:ring-2 focus:ring-primary/30 min-h-24"
            value={scenario}
            onChange={(e) => setScenario(e.target.value)}
          />
        </div>

        <Button className="gap-1.5" onClick={() => setShowResult(true)}>
          <Play className="h-3.5 w-3.5" />Run Simulation
        </Button>
      </div>

      {/* Results */}
      {showResult && result && (
        <div className="rounded-xl border border-border bg-card p-5 shadow-elevation-1 space-y-5">
          <div className="flex items-center gap-2">
            <AIIndicator size={16} />
            <h4 className="text-base font-semibold">Simulation Complete</h4>
            <ConfidenceBadge value={Math.round(result.confidence * 100)} />
          </div>

          {/* Impact summary */}
          <div className="rounded-lg border border-border p-4 space-y-4">
            <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Impact Summary</p>

            <div>
              <div className="flex items-center justify-between text-sm mb-1">
                <span>Entities Affected</span>
                <span className="font-bold tabular-nums">{result.totalAffected.toLocaleString()} of 12,847 ({((result.totalAffected / 12847) * 100).toFixed(1)}%)</span>
              </div>
              <div className="h-2.5 rounded-full bg-nx-neutral-100">
                <div className="h-full rounded-full bg-nx-amber-500 transition-all" style={{ width: `${(result.totalAffected / 12847) * 100}%` }} />
              </div>
            </div>

            <div>
              <p className="text-xs font-semibold text-muted-foreground mb-2">DD Level Changes</p>
              {result.ddChanges.map((c) => (
                <p key={`${c.from}-${c.to}`} className="text-sm">• {c.from} → {c.to}: <span className="font-semibold tabular-nums">{c.count}</span> entities</p>
              ))}
            </div>

            <div className="grid grid-cols-3 gap-3">
              <div className="rounded-lg border border-border p-3 text-center">
                <p className="text-lg font-bold tabular-nums">{result.analystHours.toLocaleString()}</p>
                <p className="text-[10px] text-muted-foreground">Analyst Hours</p>
              </div>
              <div className="rounded-lg border border-border p-3 text-center">
                <p className="text-lg font-bold tabular-nums">{result.weeksNeeded}</p>
                <p className="text-[10px] text-muted-foreground">Weeks at Capacity</p>
              </div>
              <div className="rounded-lg border border-border p-3 text-center">
                <p className="text-lg font-bold tabular-nums">{result.rulesToCreate + result.rulesToModify}</p>
                <p className="text-[10px] text-muted-foreground">Rules to Update</p>
              </div>
            </div>

            <div>
              <p className="text-xs font-semibold text-muted-foreground mb-2">Jurisdictions Affected</p>
              <div className="flex flex-wrap gap-2">
                {result.jurisdictions.map((j) => (
                  <span key={j.name} className="inline-flex items-center gap-1 rounded-lg border border-border px-2.5 py-1 text-xs">
                    {j.flag} {j.name} <span className="font-semibold tabular-nums">({j.count})</span>
                  </span>
                ))}
              </div>
            </div>
          </div>

          <div className="flex gap-2">
            <Button variant="ghost" size="sm">Discard</Button>
            <Button variant="outline" size="sm">Save as Draft</Button>
            <Button size="sm">Deploy Changes</Button>
          </div>
        </div>
      )}
    </div>
  );
}
