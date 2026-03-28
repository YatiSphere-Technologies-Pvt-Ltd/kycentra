"use client";

import { useState } from "react";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Button } from "@/components/ui/button";
import { AIIndicator } from "@/components/shared";
import { Star, FileText, Shield, CreditCard, Newspaper, Building2, Edit3, Cpu, ChevronDown, Plus } from "lucide-react";
import { cn } from "@/lib/utils";
import type { EvidenceItem, EvidenceType } from "../types";

const typeIcon: Record<EvidenceType, { icon: typeof FileText; color: string }> = {
  document: { icon: FileText, color: "var(--nx-indigo-500)" },
  screening: { icon: Shield, color: "var(--nx-violet-500)" },
  transaction: { icon: CreditCard, color: "var(--nx-teal-500)" },
  media: { icon: Newspaper, color: "var(--nx-amber-500)" },
  registry: { icon: Building2, color: "var(--nx-neutral-500)" },
  note: { icon: Edit3, color: "var(--nx-emerald-500)" },
  ai_finding: { icon: Cpu, color: "var(--nx-violet-600)" },
};

const relevanceStyles: Record<string, { fg: string; bg: string }> = {
  critical: { fg: "var(--nx-rose-700)", bg: "var(--nx-rose-50)" },
  high: { fg: "var(--nx-amber-700)", bg: "var(--nx-amber-50)" },
  medium: { fg: "var(--nx-neutral-600)", bg: "var(--nx-neutral-100)" },
  low: { fg: "var(--nx-neutral-400)", bg: "var(--nx-neutral-50)" },
};

function EvidenceRow({ item }: { item: EvidenceItem }) {
  const [expanded, setExpanded] = useState(false);
  const ti = typeIcon[item.type];
  const Icon = ti.icon;
  const rs = relevanceStyles[item.relevance];

  return (
    <div className={cn("border-b border-border last:border-b-0", item.isKeyEvidence && "bg-nx-amber-50/30")}>
      <button type="button" className="flex w-full items-center gap-3 px-4 py-3 text-left hover:bg-muted/30 transition-colors" onClick={() => setExpanded(!expanded)} aria-expanded={expanded}>
        <Icon className="h-4 w-4 shrink-0" style={{ color: ti.color }} />
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2">
            <span className="font-mono text-[11px] text-muted-foreground">{item.id}</span>
            <span className="text-[13px] font-medium truncate">{item.title}</span>
            {item.isKeyEvidence && <Star className="h-3 w-3 text-nx-amber-500 shrink-0" aria-label="Key evidence" />}
            {item.linkedToSAR && <span className="rounded bg-nx-indigo-50 px-1 py-0.5 text-[9px] font-semibold text-nx-indigo-600">SAR</span>}
          </div>
          <p className="text-[11px] text-muted-foreground">{item.source} · {item.addedAt}</p>
        </div>
        <span className="shrink-0 rounded-md px-1.5 py-0.5 text-[10px] font-bold" style={{ color: rs.fg, backgroundColor: rs.bg }}>{item.relevance}</span>
        <ChevronDown className={cn("h-3.5 w-3.5 text-muted-foreground shrink-0 transition-transform", expanded && "rotate-180")} />
      </button>

      {expanded && (
        <div className="px-4 pb-4 space-y-3">
          <div className="rounded-lg border border-border p-3">
            <div className="flex items-center gap-1.5 mb-1"><AIIndicator size={12} /><span className="text-[11px] font-semibold">AI Annotation</span></div>
            <p className="text-xs text-muted-foreground leading-relaxed">{item.aiAnnotation}</p>
          </div>
          <textarea className="w-full rounded-md border border-border bg-background px-3 py-2 text-xs placeholder:text-muted-foreground/50 min-h-16" placeholder="Add analyst notes..." defaultValue={item.analystNotes ?? ""} />
          <div className="flex gap-2">
            <Button size="sm" variant="outline" className="h-6 text-[11px] px-2">Link to SAR</Button>
            <Button size="sm" variant="outline" className="h-6 text-[11px] px-2">{item.isKeyEvidence ? "★ Key" : "Flag as Key"}</Button>
          </div>
        </div>
      )}
    </div>
  );
}

export function PanelEvidence({ items }: { items: EvidenceItem[] }) {
  return (
    <div className="flex h-full flex-col">
      <div className="flex items-center justify-between px-4 py-3 border-b border-border">
        <span className="text-sm font-semibold">Evidence Items ({items.length})</span>
        <Button size="sm" variant="outline" className="h-7 gap-1.5 text-xs"><Plus className="h-3 w-3" />Add</Button>
      </div>
      <ScrollArea className="flex-1">
        {items.map((item) => <EvidenceRow key={item.id} item={item} />)}
      </ScrollArea>
    </div>
  );
}
