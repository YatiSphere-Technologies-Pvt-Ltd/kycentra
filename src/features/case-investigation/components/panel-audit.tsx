"use client";

import { ScrollArea } from "@/components/ui/scroll-area";
import { Button } from "@/components/ui/button";
import { AIIndicator, ConfidenceBadge } from "@/components/shared";
import { Download, Lock } from "lucide-react";
import type { AuditEntry } from "../types";

const actorColor: Record<string, string> = {
  ai: "var(--nx-violet-500)",
  human: "var(--nx-indigo-500)",
  system: "var(--nx-neutral-400)",
};

export function PanelAudit({ entries }: { entries: AuditEntry[] }) {
  return (
    <div className="flex h-full flex-col">
      <div className="flex items-center justify-between px-4 py-3 border-b border-border">
        <div className="flex items-center gap-2">
          <span className="text-sm font-semibold">Audit Trail</span>
          <Lock className="h-3.5 w-3.5 text-muted-foreground" aria-label="Cryptographically sealed" />
        </div>
        <Button variant="outline" size="sm" className="gap-1.5 h-7 text-xs"><Download className="h-3 w-3" />Export PDF</Button>
      </div>

      <ScrollArea className="flex-1">
        <div className="p-4 space-y-0">
          {entries.map((entry) => (
            <div key={entry.id} className="relative pl-5 pb-5 last:pb-0 border-l-2" style={{ borderColor: actorColor[entry.actorType] ?? "var(--nx-neutral-300)" }}>
              <span className="absolute -left-[5px] top-0 h-2.5 w-2.5 rounded-full border-2 border-background" style={{ backgroundColor: actorColor[entry.actorType] }} />
              <div className="space-y-0.5">
                <div className="flex items-center gap-2">
                  <span className="font-mono text-[11px] font-medium text-primary tabular-nums">{entry.timestamp}</span>
                  <span className="text-[11px]">
                    {entry.actorType === "ai" && <AIIndicator size={11} className="mr-0.5" />}
                    <span className="font-semibold">{entry.actor}</span>
                  </span>
                </div>
                <p className="text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">{entry.action}</p>
                <p className="text-xs text-muted-foreground leading-relaxed">{entry.detail}</p>
                {entry.confidence && <ConfidenceBadge value={entry.confidence} className="mt-1" />}
                {entry.model && (
                  <p className="text-[10px] text-muted-foreground/50 tabular-nums mt-0.5">
                    Model: {entry.model} · Hash: {entry.hash}
                  </p>
                )}
              </div>
            </div>
          ))}
        </div>
      </ScrollArea>
    </div>
  );
}
