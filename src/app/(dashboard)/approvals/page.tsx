"use client";

import { useState, useMemo } from "react";
import { type ColumnDef } from "@tanstack/react-table";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetDescription,
} from "@/components/ui/sheet";
import { ScrollArea } from "@/components/ui/scroll-area";
import { AIIndicator, ConfidenceBadge } from "@/components/shared";
import { DataTableTanstack } from "@/components/shared/tanstack-table";
import { ApprovalDetail } from "@/features/approvals/components/approval-detail";
import { approvalQueue, approvalMetrics } from "@/features/approvals/data/mock-data";
import type { ApprovalItem } from "@/features/approvals/types";
import { AlertTriangle, CheckCircle2, ChevronRight, UserPlus, Download } from "lucide-react";
import { cn } from "@/lib/utils";

const typeLabels: Record<string, string> = {
  screening_disposition: "Screening", risk_approval: "Risk", document_review: "Document",
  onboarding_approval: "Onboarding", sar_review: "SAR Review", rule_deployment: "Rule Deploy", periodic_review: "Review",
};
const priorityStyles: Record<string, { fg: string; bg: string; label: string }> = {
  critical: { fg: "var(--nx-rose-700)", bg: "var(--nx-rose-50)", label: "Critical" },
  high: { fg: "var(--nx-amber-700)", bg: "var(--nx-amber-50)", label: "High" },
  normal: { fg: "var(--nx-neutral-600)", bg: "var(--nx-neutral-100)", label: "Normal" },
};

function SLACell({ sla }: { sla: ApprovalItem["sla"] }) {
  const pct = Math.max(0, Math.min(100, (sla.remaining / sla.total) * 100));
  const color = pct > 50 ? "var(--nx-emerald-500)" : pct > 25 ? "var(--nx-amber-500)" : "var(--nx-rose-500)";
  const label = sla.remaining >= 1 ? `${sla.remaining.toFixed(1)}h` : `${Math.round(sla.remaining * 60)}m`;
  return (
    <div className="flex items-center gap-2">
      <div className="w-16 h-1.5 rounded-full bg-nx-neutral-200 dark:bg-nx-neutral-700">
        <div className="h-full rounded-full transition-all" style={{ width: `${pct}%`, backgroundColor: color }} />
      </div>
      <span className="text-[11px] tabular-nums font-medium" style={{ color }}>{label}</span>
    </div>
  );
}

export default function ApprovalsPage() {
  const [sheetItem, setSheetItem] = useState<ApprovalItem | null>(null);
  const m = approvalMetrics;

  const handleSubmitNext = () => {
    if (!sheetItem) return;
    const idx = approvalQueue.findIndex((a) => a.id === sheetItem.id);
    const next = approvalQueue[idx + 1];
    setSheetItem(next ?? null);
  };

  const columns = useMemo<ColumnDef<ApprovalItem, unknown>[]>(() => [
    {
      id: "select",
      header: ({ table }) => (
        <input type="checkbox" className="accent-primary rounded" checked={table.getIsAllPageRowsSelected()} onChange={table.getToggleAllPageRowsSelectedHandler()} />
      ),
      cell: ({ row }) => (
        <input type="checkbox" className="accent-primary rounded" checked={row.getIsSelected()} onChange={row.getToggleSelectedHandler()} onClick={(e) => e.stopPropagation()} />
      ),
      size: 40,
      enableSorting: false,
    },
    {
      accessorKey: "priority",
      header: "Priority",
      size: 95,
      cell: ({ getValue }) => {
        const ps = priorityStyles[getValue() as string] ?? priorityStyles.normal;
        return <span className="inline-flex rounded-md px-2 py-0.5 text-[10px] font-bold capitalize" style={{ color: ps.fg, backgroundColor: ps.bg }}>{ps.label}</span>;
      },
      sortingFn: (a, b) => {
        const order = { critical: 0, high: 1, normal: 2 };
        return (order[a.original.priority] ?? 2) - (order[b.original.priority] ?? 2);
      },
    },
    {
      accessorKey: "agentName",
      header: "Agent",
      size: 130,
      cell: ({ row }) => (
        <div className="flex items-center gap-1.5">
          <span className="text-sm">{row.original.agentIcon}</span>
          <span className="text-xs font-medium">{row.original.agentName.replace(" Agent", "").replace(" Engine", "")}</span>
        </div>
      ),
    },
    {
      accessorKey: "type",
      header: "Type",
      size: 110,
      cell: ({ getValue }) => (
        <span className="rounded-md bg-muted px-2 py-1 text-[11px] font-medium text-muted-foreground">
          {typeLabels[getValue() as string] ?? (getValue() as string)}
        </span>
      ),
    },
    {
      id: "entity",
      header: "Entity",
      size: 220,
      accessorFn: (row) => row.entity?.name ?? "Portfolio-wide",
      cell: ({ row }) => (
        <div className="min-w-0">
          <p className="text-sm font-medium truncate">{row.original.entity?.name ?? "Portfolio-wide"}</p>
          {row.original.entity?.jurisdiction && (
            <p className="text-[11px] text-muted-foreground">{row.original.entity.jurisdiction}</p>
          )}
        </div>
      ),
    },
    {
      accessorKey: "aiSummary",
      header: "AI Summary",
      size: 280,
      cell: ({ row }) => (
        <div className="flex items-start gap-1.5 min-w-0">
          <AIIndicator size={11} className="mt-0.5 shrink-0" />
          <p className="text-xs text-muted-foreground leading-relaxed line-clamp-2">{row.original.aiSummary}</p>
        </div>
      ),
    },
    {
      accessorKey: "aiConfidence",
      header: "Confidence",
      size: 100,
      cell: ({ getValue }) => <ConfidenceBadge value={Math.round((getValue() as number) * 100)} />,
      sortingFn: "basic",
    },
    {
      id: "sla",
      header: "SLA",
      size: 140,
      accessorFn: (row) => row.sla.remaining,
      cell: ({ row }) => <SLACell sla={row.original.sla} />,
      sortingFn: "basic",
    },
    {
      accessorKey: "requestedAt",
      header: "Requested",
      size: 120,
      cell: ({ getValue }) => <span className="text-xs text-muted-foreground whitespace-nowrap">{getValue() as string}</span>,
    },
    {
      id: "actions",
      header: () => <span className="sr-only">Actions</span>,
      size: 170,
      enableSorting: false,
      cell: ({ row }) => {
        const item = row.original;
        return (
          <div className="flex items-center justify-end gap-1.5" onClick={(e) => e.stopPropagation()}>
            {item.quickApproveAllowed && (
              <Button size="sm" className="h-7 px-2.5 text-[11px] gap-1 bg-nx-emerald-600 hover:bg-nx-emerald-700 shadow-xs">
                <CheckCircle2 className="h-3 w-3" />Approve
              </Button>
            )}
            <Button
              size="sm"
              variant="outline"
              className="h-7 px-2.5 text-[11px] gap-1 shadow-xs"
              onClick={() => setSheetItem(item)}
            >
              Review
              <ChevronRight className="h-3 w-3" />
            </Button>
          </div>
        );
      },
    },
  ], []);

  return (
    <div className="space-y-5">
      <div>
        <h2 className="text-xl font-semibold">Approval Center</h2>
        <p className="text-xs text-muted-foreground mt-0.5">Items AI agents couldn&apos;t resolve autonomously — requires your judgment</p>
      </div>

      {/* Metrics */}
      <div className="grid grid-cols-5 gap-3">
        {[
          { value: m.pending, label: "Pending", color: m.pending > 20 ? "text-nx-rose-600" : m.pending > 10 ? "text-nx-amber-600" : "text-nx-emerald-600" },
          { value: m.urgent, label: "Urgent", color: "text-nx-rose-600", bg: m.urgent > 0 ? "var(--nx-rose-50)" : undefined },
          { value: m.avgWaitTime, label: "Avg Wait", color: "" },
          { value: m.completedToday, label: "Approved Today", color: "text-nx-emerald-600" },
          { value: `${Math.round(m.slaCompliance * 100)}%`, label: "SLA Compliance", color: "" },
        ].map((s) => (
          <div key={s.label} className="rounded-xl border border-border bg-card p-3 text-center shadow-elevation-1" style={s.bg ? { backgroundColor: s.bg } : undefined}>
            <p className={cn("text-2xl font-bold tabular-nums", s.color)}>{s.value}</p>
            <p className="text-[10px] text-muted-foreground">{s.label}</p>
          </div>
        ))}
      </div>

      {m.approachingSLA > 0 && (
        <div className="flex items-center gap-1.5 text-xs rounded-lg px-3 py-2" style={{ backgroundColor: "var(--nx-amber-50)", color: "var(--nx-amber-700)" }}>
          <AlertTriangle className="h-3.5 w-3.5 shrink-0" />
          {m.approachingSLA} items approaching SLA breach within 1 hour
        </div>
      )}

      {/* TanStack Table */}
      <DataTableTanstack
        columns={columns}
        data={approvalQueue}
        searchPlaceholder="Search by entity, agent, type, or keyword..."
        enableSelection
        enablePagination
        pageSize={15}
        getRowId={(row) => row.id}
        onRowClick={(row) => setSheetItem(row)}
        selectedRowId={sheetItem?.id ?? null}
        selectionActions={(selectedRows) => (
          <>
            <Button size="sm" className="h-7 text-xs gap-1 bg-nx-emerald-600 hover:bg-nx-emerald-700">
              <CheckCircle2 className="h-3 w-3" />Batch Approve ({selectedRows.length})
            </Button>
            <Button size="sm" variant="outline" className="h-7 text-xs gap-1">
              <UserPlus className="h-3 w-3" />Reassign
            </Button>
            <Button size="sm" variant="outline" className="h-7 text-xs gap-1">
              <Download className="h-3 w-3" />Export
            </Button>
          </>
        )}
      />

      {/* Review Panel — Sheet (slide-in from right) */}
      <Sheet open={!!sheetItem} onOpenChange={(open) => { if (!open) setSheetItem(null); }}>
        <SheetContent side="right" className="w-full sm:max-w-xl p-0 flex flex-col">
          {sheetItem && (
            <>
              <SheetHeader className="border-b border-border px-6 py-4 shrink-0">
                <div className="flex items-center gap-2">
                  <span className="text-base">{sheetItem.agentIcon}</span>
                  <SheetTitle className="text-base font-semibold">
                    {sheetItem.entity?.name ?? "Portfolio-wide"}
                  </SheetTitle>
                </div>
                <SheetDescription className="text-xs">
                  {typeLabels[sheetItem.type] ?? sheetItem.type} · {sheetItem.agentName} · Confidence: {Math.round(sheetItem.aiConfidence * 100)}%
                </SheetDescription>
              </SheetHeader>

              <ScrollArea className="flex-1">
                <ApprovalDetail
                  item={sheetItem}
                  onSubmitNext={handleSubmitNext}
                />
              </ScrollArea>
            </>
          )}
        </SheetContent>
      </Sheet>
    </div>
  );
}
