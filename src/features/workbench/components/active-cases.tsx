"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { RiskBadge } from "@/components/shared";
import { DashboardCard } from "@/components/shared/dashboard-card";
import { caseStatusStyles } from "@/lib/styles";
import type { ActiveCase } from "../types";
import { Plus } from "lucide-react";

// ============================================================
// ActiveCases — recent investigations table
// ============================================================

interface ActiveCasesProps {
  cases: ActiveCase[];
  isLoading?: boolean;
  error?: string | null;
  onRetry?: () => void;
  onCreateCase?: () => void;
}

export function ActiveCases({
  cases,
  isLoading = false,
  error = null,
  onRetry,
  onCreateCase,
}: ActiveCasesProps) {
  return (
    <DashboardCard.Root>
      <DashboardCard.Header
        title="Active Cases"
        actions={
          <>
            <Button
              type="button"
              variant="outline"
              size="sm"
              className="h-7 gap-1.5 px-2.5 text-xs"
              onClick={onCreateCase}
            >
              <Plus className="h-3.5 w-3.5" aria-hidden="true" />
              Create Case
            </Button>
            <Link href="/cases" className="text-xs font-medium text-primary hover:underline">
              View All
            </Link>
          </>
        }
      />

      {isLoading && <DashboardCard.Loading rows={5} />}
      {error && <DashboardCard.Error message={error} onRetry={onRetry} />}
      {!isLoading && !error && cases.length === 0 && (
        <DashboardCard.Empty message="No active cases." />
      )}

      {!isLoading && !error && cases.length > 0 && (
        <DashboardCard.Content noPadding className="overflow-auto">
          <table className="w-full text-sm" aria-label="Active cases">
            <caption className="sr-only">
              Active compliance cases and investigations
            </caption>
            <thead>
              <tr className="border-b border-border bg-muted/40">
                {["Case ID", "Entity", "Type", "Risk", "Status", "Assigned", "Updated"].map(
                  (h, i) => (
                    <th
                      key={h}
                      scope="col"
                      className={`px-4 py-3 text-[11px] font-semibold uppercase tracking-wider text-muted-foreground ${i === 6 ? "text-right" : "text-left"}`}
                    >
                      {h}
                    </th>
                  )
                )}
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {cases.map((c) => {
                const statusStyle = caseStatusStyles[c.status];
                return (
                  <tr
                    key={c.caseId}
                    className="transition-colors hover:bg-muted/30"
                  >
                    <td className="px-4 py-3">
                      <Link
                        href={`/cases/${c.caseId}`}
                        className="font-mono text-xs font-medium text-primary hover:underline"
                      >
                        {c.caseId}
                      </Link>
                    </td>
                    <td className="px-4 py-3 max-w-50 truncate">{c.entity}</td>
                    <td className="px-4 py-3">
                      <span className="rounded bg-muted px-2 py-0.5 text-[11px] font-medium text-muted-foreground">
                        {c.type}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <RiskBadge tier={c.riskTier} />
                    </td>
                    <td className="px-4 py-3">
                      <span
                        className="inline-flex rounded-md px-2 py-0.5 text-[11px] font-bold"
                        style={{ color: statusStyle.fg, backgroundColor: statusStyle.bg }}
                      >
                        {statusStyle.label}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-2">
                        <span
                          className="flex h-6 w-6 items-center justify-center rounded-full bg-primary text-[10px] font-bold text-primary-foreground"
                          aria-label={c.assignee.name}
                        >
                          {c.assignee.initials}
                        </span>
                        <span className="text-xs text-muted-foreground hidden xl:inline">
                          {c.assignee.name.split(" ")[0]}
                        </span>
                      </div>
                    </td>
                    <td className="px-4 py-3 text-right text-xs text-muted-foreground tabular-nums">
                      {c.updated}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </DashboardCard.Content>
      )}
    </DashboardCard.Root>
  );
}
