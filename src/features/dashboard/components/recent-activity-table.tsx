"use client";

import { DataTable, type Column } from "@/components/shared";
import { Badge } from "@/components/ui/badge";
import { useRecentActivity } from "../hooks/use-dashboard";
import type { RecentActivity } from "../types";

const actionVariant: Record<string, "default" | "secondary" | "destructive" | "outline"> = {
  Created: "default",
  Updated: "secondary",
  Deployed: "default",
  Reviewed: "outline",
  Deleted: "destructive",
};

const columns: Column<RecentActivity>[] = [
  { key: "user", header: "User" },
  {
    key: "action",
    header: "Action",
    render: (row) => (
      <Badge variant={actionVariant[row.action] ?? "secondary"}>
        {row.action}
      </Badge>
    ),
  },
  { key: "target", header: "Target" },
  { key: "timestamp", header: "When", className: "text-right" },
];

export function RecentActivityTable() {
  const { data, isLoading } = useRecentActivity();

  return (
    <DataTable<RecentActivity & Record<string, unknown>>
      columns={columns as Column<RecentActivity & Record<string, unknown>>[]}
      data={(data as (RecentActivity & Record<string, unknown>)[]) ?? []}
      isLoading={isLoading}
      emptyMessage="No recent activity."
    />
  );
}
