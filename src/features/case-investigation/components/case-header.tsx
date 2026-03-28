"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { RiskBadge } from "@/components/shared";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { ArrowLeft, ChevronDown, Users, UserPlus, LinkIcon, Flag, Download, ArrowUpRight, XCircle, MoreHorizontal, Timer } from "lucide-react";
import type { CaseDetail } from "../types";

const typeStyles: Record<string, { fg: string; bg: string }> = {
  SAR: { fg: "var(--nx-rose-700)", bg: "var(--nx-rose-50)" },
  EDD: { fg: "var(--nx-amber-700)", bg: "var(--nx-amber-50)" },
  Screening: { fg: "var(--nx-violet-700)", bg: "var(--nx-violet-50)" },
  PEP: { fg: "var(--nx-teal-700)", bg: "var(--nx-teal-50)" },
  Transaction: { fg: "var(--nx-indigo-700)", bg: "var(--nx-indigo-50)" },
};

const statusStyles: Record<string, { fg: string; bg: string }> = {
  "Open": { fg: "var(--nx-neutral-600)", bg: "var(--nx-neutral-100)" },
  "In Progress": { fg: "var(--nx-indigo-600)", bg: "var(--nx-indigo-50)" },
  "Pending Review": { fg: "var(--nx-amber-700)", bg: "var(--nx-amber-50)" },
  "Escalated": { fg: "var(--nx-rose-700)", bg: "var(--nx-rose-50)" },
  "SAR Filed": { fg: "var(--nx-emerald-700)", bg: "var(--nx-emerald-50)" },
  "Closed": { fg: "var(--nx-neutral-500)", bg: "var(--nx-neutral-100)" },
};

export function CaseHeader({ caseData }: { caseData: CaseDetail }) {
  const ts = typeStyles[caseData.type] ?? typeStyles.SAR;
  const ss = statusStyles[caseData.status] ?? statusStyles.Open;

  return (
    <div className="sticky top-[var(--nx-topbar-height)] z-40 border-b border-border bg-card px-6 py-4 shadow-elevation-1">
      <div className="flex items-center gap-4">
        <Link href="/cases" className="flex items-center gap-1.5 text-sm text-muted-foreground hover:text-primary transition-colors shrink-0">
          <ArrowLeft className="h-4 w-4" /><span className="hidden sm:inline">Cases</span>
        </Link>

        <div className="h-6 w-px bg-border" aria-hidden="true" />

        <div className="min-w-0 flex-1">
          <div className="flex items-center gap-3">
            <span className="font-mono text-sm font-semibold text-primary">{caseData.id}</span>
            <span className="text-sm font-semibold">{caseData.title}</span>
          </div>
          <div className="flex items-center gap-2 mt-0.5">
            <Link href={`/entities/${caseData.entity.id}`} className="text-[13px] text-muted-foreground hover:text-primary hover:underline">
              {caseData.entity.name}
            </Link>
          </div>
        </div>

        <div className="hidden lg:flex items-center gap-2 shrink-0">
          <span className="inline-flex rounded-md px-2 py-0.5 text-[11px] font-bold" style={{ color: ts.fg, backgroundColor: ts.bg }}>{caseData.type}</span>
          <RiskBadge tier={caseData.priority} />
          <span className="inline-flex rounded-md px-2 py-0.5 text-[11px] font-bold" style={{ color: ss.fg, backgroundColor: ss.bg }}>{caseData.status}</span>
          <span className="flex items-center gap-1 text-xs text-muted-foreground tabular-nums">
            <Timer className="h-3.5 w-3.5" />{caseData.elapsedTime}
          </span>
        </div>

        <DropdownMenu>
          <DropdownMenuTrigger render={<Button variant="outline" size="sm" className="gap-1.5 shrink-0" />}>
            Actions<ChevronDown className="h-3.5 w-3.5" />
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-52">
            <DropdownMenuItem><Users className="mr-2 h-4 w-4" />Assign to...</DropdownMenuItem>
            <DropdownMenuItem><UserPlus className="mr-2 h-4 w-4" />Add Collaborator</DropdownMenuItem>
            <DropdownMenuItem><LinkIcon className="mr-2 h-4 w-4" />Link Related Case</DropdownMenuItem>
            <DropdownMenuItem><Flag className="mr-2 h-4 w-4" />Change Priority</DropdownMenuItem>
            <DropdownMenuItem><Download className="mr-2 h-4 w-4" />Export Case File</DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem className="text-nx-amber-600"><ArrowUpRight className="mr-2 h-4 w-4" />Escalate to MLRO</DropdownMenuItem>
            <DropdownMenuItem className="text-destructive"><XCircle className="mr-2 h-4 w-4" />Close Case (No SAR)</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>

        <Button variant="ghost" size="icon" className="shrink-0" aria-label="More options">
          <MoreHorizontal className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );
}
