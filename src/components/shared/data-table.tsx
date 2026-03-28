"use client";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight } from "lucide-react";

// ============================================================
// Generic, reusable data table
// ============================================================

export interface Column<T> {
  key: string;
  header: string;
  /** Custom cell renderer. Falls back to `row[key]`. */
  render?: (row: T) => React.ReactNode;
  className?: string;
}

interface DataTableProps<T> {
  columns: Column<T>[];
  data: T[];
  isLoading?: boolean;
  /** Number of skeleton rows shown while loading. */
  skeletonRows?: number;
  /** If provided, pagination controls are rendered. */
  pagination?: {
    page: number;
    pageSize: number;
    total: number;
    onPageChange: (page: number) => void;
  };
  emptyMessage?: string;
}

export function DataTable<T extends Record<string, unknown>>({
  columns,
  data,
  isLoading = false,
  skeletonRows = 5,
  pagination,
  emptyMessage = "No results found.",
}: DataTableProps<T>) {
  const totalPages = pagination
    ? Math.ceil(pagination.total / pagination.pageSize)
    : 0;

  return (
    <div className="space-y-4">
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              {columns.map((col) => (
                <TableHead key={col.key} className={col.className}>
                  {col.header}
                </TableHead>
              ))}
            </TableRow>
          </TableHeader>
          <TableBody>
            {isLoading
              ? Array.from({ length: skeletonRows }).map((_, i) => (
                  <TableRow key={i}>
                    {columns.map((col) => (
                      <TableCell key={col.key}>
                        <Skeleton className="h-4 w-[80%]" />
                      </TableCell>
                    ))}
                  </TableRow>
                ))
              : data.length === 0
                ? (
                    <TableRow>
                      <TableCell
                        colSpan={columns.length}
                        className="h-24 text-center text-muted-foreground"
                      >
                        {emptyMessage}
                      </TableCell>
                    </TableRow>
                  )
                : data.map((row, i) => (
                    <TableRow key={(row.id as string) ?? i}>
                      {columns.map((col) => (
                        <TableCell key={col.key} className={col.className}>
                          {col.render
                            ? col.render(row)
                            : (row[col.key] as React.ReactNode)}
                        </TableCell>
                      ))}
                    </TableRow>
                  ))}
          </TableBody>
        </Table>
      </div>

      {pagination && totalPages > 1 && (
        <div className="flex items-center justify-between px-2">
          <p className="text-sm text-muted-foreground">
            Page {pagination.page} of {totalPages} &middot; {pagination.total}{" "}
            total
          </p>
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              disabled={pagination.page <= 1}
              onClick={() => pagination.onPageChange(pagination.page - 1)}
            >
              <ChevronLeft className="h-4 w-4" />
            </Button>
            <Button
              variant="outline"
              size="sm"
              disabled={pagination.page >= totalPages}
              onClick={() => pagination.onPageChange(pagination.page + 1)}
            >
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}
