"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { RiskBadge } from "@/components/shared";
import { ComplianceStatusBadge, CDDLevelBadge } from "@/components/shared/status-badge";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { ArrowLeft, ChevronDown, ClipboardCheck, Briefcase, FilePlus, ArrowUpRight, Download, ShieldOff, UserX, MoreHorizontal } from "lucide-react";
import type { Entity } from "../types";

const entityTypeColors: Record<string, { bg: string; fg: string }> = {
  "Legal Entity": { bg: "var(--nx-indigo-100)", fg: "var(--nx-indigo-700)" },
  "Natural Person": { bg: "var(--nx-teal-100)", fg: "var(--nx-teal-700)" },
  Trust: { bg: "var(--nx-violet-100)", fg: "var(--nx-violet-700)" },
  Fund: { bg: "var(--nx-amber-100)", fg: "var(--nx-amber-700)" },
};

export function EntityHeader({ entity }: { entity: Entity }) {
  const avatarStyle = entityTypeColors[entity.type] ?? entityTypeColors["Legal Entity"];
  const initials = entity.name.split(" ").map((w) => w[0]).join("").slice(0, 2).toUpperCase();

  return (
    <div className="sticky top-(--nx-topbar-height) z-40 border-b border-border bg-card px-6 py-3 shadow-elevation-1">
      <div className="flex items-center gap-3">
        <Link href="/entities" className="flex items-center gap-1 text-sm text-muted-foreground hover:text-primary transition-colors shrink-0">
          <ArrowLeft className="h-4 w-4" />
        </Link>
        <div className="h-5 w-px bg-border" />

        <div
          className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg text-xs font-bold"
          style={{ backgroundColor: avatarStyle.bg, color: avatarStyle.fg }}
        >
          {initials}
        </div>

        <div className="min-w-0 flex-1">
          <div className="flex items-center gap-2 flex-wrap">
            <h2 className="text-sm font-semibold truncate">{entity.name}</h2>
            <span className="text-xs text-muted-foreground hidden md:inline shrink-0">
              {entity.type} · {entity.jurisdiction} · {entity.subType}
            </span>
          </div>
        </div>

        <div className="hidden lg:flex items-center gap-1.5 shrink-0">
          <RiskBadge tier={entity.riskTier} />
          <ComplianceStatusBadge status={entity.complianceStatus} />
          <CDDLevelBadge level={entity.cddLevel} />
        </div>

        <DropdownMenu>
          <DropdownMenuTrigger render={<Button variant="outline" size="sm" className="gap-1 shrink-0 h-8 text-xs" />}>
            Actions<ChevronDown className="h-3 w-3" />
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-52">
            <DropdownMenuItem><ClipboardCheck className="mr-2 h-4 w-4" />Start Review</DropdownMenuItem>
            <DropdownMenuItem><Briefcase className="mr-2 h-4 w-4" />Create Case</DropdownMenuItem>
            <DropdownMenuItem><FilePlus className="mr-2 h-4 w-4" />Request Documents</DropdownMenuItem>
            <DropdownMenuItem><ArrowUpRight className="mr-2 h-4 w-4" />Escalate</DropdownMenuItem>
            <DropdownMenuItem><Download className="mr-2 h-4 w-4" />Export Profile</DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem className="text-destructive"><ShieldOff className="mr-2 h-4 w-4" />Restrict Account</DropdownMenuItem>
            <DropdownMenuItem className="text-destructive"><UserX className="mr-2 h-4 w-4" />Offboard Client</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>

        <Button variant="ghost" size="icon" className="shrink-0 h-8 w-8" aria-label="More options">
          <MoreHorizontal className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );
}
