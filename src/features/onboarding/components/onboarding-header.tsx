"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { ArrowLeft, ChevronDown, Shield, Plus, Mail, UserPlus, ExternalLink, Pause, XCircle } from "lucide-react";
import { AIIndicator } from "@/components/shared";
import type { OnboardingRecord } from "../types";

const ddStyles: Record<string, { fg: string; bg: string }> = {
  SDD: { fg: "var(--nx-emerald-700)", bg: "var(--nx-emerald-50)" },
  CDD: { fg: "var(--nx-indigo-700)", bg: "var(--nx-indigo-50)" },
  EDD: { fg: "var(--nx-amber-700)", bg: "var(--nx-amber-50)" },
  "EDD+": { fg: "var(--nx-rose-700)", bg: "var(--nx-rose-50)" },
};

export function OnboardingHeader({ data }: { data: OnboardingRecord }) {
  const dd = ddStyles[data.dueDiligenceLevel.recommended] ?? ddStyles.CDD;

  return (
    <div className="sticky top-[var(--nx-topbar-height)] z-40 border-b border-border bg-card px-6 py-3 shadow-elevation-1">
      {/* Single-row compact header */}
      <div className="flex items-center gap-3">
        <Link href="/onboarding" className="flex items-center gap-1 text-sm text-muted-foreground hover:text-primary transition-colors shrink-0">
          <ArrowLeft className="h-4 w-4" />
        </Link>
        <div className="h-5 w-px bg-border" />

        {/* Entity info — compact */}
        <div className="min-w-0 flex-1">
          <div className="flex items-center gap-2">
            <span className="font-mono text-[11px] text-muted-foreground">{data.id}</span>
            <span className="text-sm font-semibold truncate">{data.entity.name}</span>
            <span className="text-xs text-muted-foreground hidden lg:inline">{data.entity.jurisdiction} {data.entity.jurisdictionCode === "DE" ? "🇩🇪" : ""}</span>
            <span className="inline-flex items-center gap-1 rounded-md px-1.5 py-0.5 text-[10px] font-bold" style={{ color: dd.fg, backgroundColor: dd.bg }}>
              {data.dueDiligenceLevel.recommended}
            </span>
            <AIIndicator size={10} />
          </div>
        </div>

        {/* Progress — inline compact */}
        <div className="hidden md:flex items-center gap-2 shrink-0">
          <div className="w-24 h-1.5 rounded-full bg-nx-neutral-100">
            <div className="h-full rounded-full transition-all duration-500" style={{ width: `${data.progress}%`, background: "linear-gradient(90deg, var(--nx-indigo-600), var(--nx-teal-500))" }} />
          </div>
          <span className="text-xs font-semibold tabular-nums w-8">{data.progress}%</span>
        </div>

        <DropdownMenu>
          <DropdownMenuTrigger render={<Button variant="outline" size="sm" className="gap-1 shrink-0 h-8 text-xs" />}>
            Actions<ChevronDown className="h-3 w-3" />
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-52">
            <DropdownMenuItem><Shield className="mr-2 h-4 w-4" />Override DD Level</DropdownMenuItem>
            <DropdownMenuItem><Plus className="mr-2 h-4 w-4" />Add Requirement</DropdownMenuItem>
            <DropdownMenuItem><Mail className="mr-2 h-4 w-4" />Send Portal Link</DropdownMenuItem>
            <DropdownMenuItem><UserPlus className="mr-2 h-4 w-4" />Assign Analyst</DropdownMenuItem>
            <DropdownMenuItem><ExternalLink className="mr-2 h-4 w-4" />View Client Portal</DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem><Pause className="mr-2 h-4 w-4" />Pause Onboarding</DropdownMenuItem>
            <DropdownMenuItem className="text-destructive"><XCircle className="mr-2 h-4 w-4" />Cancel Onboarding</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </div>
  );
}
