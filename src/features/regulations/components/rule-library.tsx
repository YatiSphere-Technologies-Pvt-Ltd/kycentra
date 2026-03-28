"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { AIIndicator, ConfidenceBadge } from "@/components/shared";
import { Plus, Search } from "lucide-react";
import type { RegRule } from "../types";

const categoryStyles: Record<string, { fg: string; bg: string }> = {
  "AML/KYC": { fg: "var(--nx-indigo-600)", bg: "var(--nx-indigo-50)" },
  Sanctions: { fg: "var(--nx-rose-600)", bg: "var(--nx-rose-50)" },
  Tax: { fg: "var(--nx-teal-600)", bg: "var(--nx-teal-50)" },
  "Data Privacy": { fg: "var(--nx-violet-600)", bg: "var(--nx-violet-50)" },
  ESG: { fg: "var(--nx-emerald-600)", bg: "var(--nx-emerald-50)" },
  "Consumer Protection": { fg: "var(--nx-teal-500)", bg: "var(--nx-teal-50)" },
};

const statusStyles: Record<string, { fg: string; bg: string; dot: string }> = {
  active: { fg: "var(--nx-emerald-700)", bg: "var(--nx-emerald-50)", dot: "var(--nx-emerald-500)" },
  draft: { fg: "var(--nx-amber-700)", bg: "var(--nx-amber-50)", dot: "var(--nx-amber-500)" },
  deprecated: { fg: "var(--nx-neutral-500)", bg: "var(--nx-neutral-100)", dot: "var(--nx-neutral-400)" },
  under_review: { fg: "var(--nx-violet-700)", bg: "var(--nx-violet-50)", dot: "var(--nx-violet-500)" },
};

const flagMap: Record<string, string> = { DE: "🇩🇪", US: "🇺🇸", GB: "🇬🇧", SG: "🇸🇬", KY: "🇰🇾", EU: "🇪🇺", GLOBAL: "🌍", HK: "🇭🇰" };

function RuleCard({ rule }: { rule: RegRule }) {
  const cs = categoryStyles[rule.category] ?? categoryStyles["AML/KYC"];
  const ss = statusStyles[rule.status] ?? statusStyles.active;

  return (
    <div className="rounded-xl border border-border bg-card p-5 shadow-elevation-1 hover:shadow-elevation-2 hover:border-primary/20 transition-all cursor-pointer">
      <div className="flex items-center justify-between mb-3">
        <span className="font-mono text-xs font-semibold text-primary">{rule.id}</span>
        <span className="inline-flex items-center gap-1.5 rounded-md px-1.5 py-0.5 text-[10px] font-bold" style={{ color: ss.fg, backgroundColor: ss.bg }}>
          <span className="h-1.5 w-1.5 rounded-full" style={{ backgroundColor: ss.dot }} />
          {rule.status.charAt(0).toUpperCase() + rule.status.slice(1).replace("_", " ")}
        </span>
      </div>

      <h4 className="text-sm font-semibold leading-snug">{rule.title}</h4>

      <div className="flex flex-wrap items-center gap-2 mt-2">
        <span className="text-xs text-muted-foreground">{flagMap[rule.jurisdiction] ?? ""} {rule.jurisdictionName}</span>
        <span className="inline-flex rounded-md px-1.5 py-0.5 text-[10px] font-bold" style={{ color: cs.fg, backgroundColor: cs.bg }}>{rule.category}</span>
        <span className="text-[10px] text-muted-foreground">{rule.regulation}</span>
      </div>

      <p className="mt-3 text-xs text-muted-foreground italic leading-relaxed line-clamp-2">{rule.naturalLanguage}</p>

      <div className="flex flex-wrap gap-1.5 mt-3">
        {rule.entityTypes.map((t) => (
          <span key={t} className="rounded bg-muted px-1.5 py-0.5 text-[9px] font-medium text-muted-foreground">{t}</span>
        ))}
        {rule.ddLevels.map((d) => (
          <span key={d} className="rounded bg-muted px-1.5 py-0.5 text-[9px] font-medium text-muted-foreground">{d}</span>
        ))}
      </div>

      <div className="flex items-center justify-between mt-4 pt-3 border-t border-border">
        <div className="flex items-center gap-2">
          <AIIndicator size={10} />
          <ConfidenceBadge value={Math.round(rule.aiConfidence * 100)} />
        </div>
        <span className="text-[10px] text-muted-foreground">{rule.affectedEntities.toLocaleString()} entities · {rule.lastModifiedDate}</span>
      </div>
    </div>
  );
}

export function RuleLibrary({ rules }: { rules: RegRule[] }) {
  const [search, setSearch] = useState("");
  const filtered = rules.filter((r) =>
    r.title.toLowerCase().includes(search.toLowerCase()) ||
    r.id.toLowerCase().includes(search.toLowerCase()) ||
    r.jurisdictionName.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="space-y-5">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-lg font-semibold">Rule Library</h3>
          <p className="text-xs text-muted-foreground">{rules.length.toLocaleString()} rules across 127 jurisdictions</p>
        </div>
        <Button size="sm" className="gap-1.5"><Plus className="h-3.5 w-3.5" />Create Rule</Button>
      </div>

      {/* Search */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground/50" />
        <input
          type="text"
          placeholder="Search rules, regulations, jurisdictions..."
          className="h-9 w-full rounded-lg border border-border bg-background pl-9 pr-3 text-sm placeholder:text-muted-foreground/40 focus:outline-none focus:ring-2 focus:ring-primary/30"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>

      {/* Grid */}
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
        {filtered.map((rule) => <RuleCard key={rule.id} rule={rule} />)}
      </div>
    </div>
  );
}
