"use client";

import { useState, type ReactNode } from "react";
import {
  useReactTable,
  getCoreRowModel,
  getSortedRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  flexRender,
  type ColumnDef,
  type SortingState,
  type ColumnFiltersState,
  type VisibilityState,
  type RowSelectionState,
  type Row,
} from "@tanstack/react-table";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { cn } from "@/lib/utils";
import {
  ArrowUpDown,
  ArrowUp,
  ArrowDown,
  ChevronLeft,
  ChevronRight,
  ChevronsLeft,
  ChevronsRight,
  Search,
  Download,
  Columns3,
  ListFilter,
  X,
} from "lucide-react";

// ============================================================
// DataTableTanstack — reusable, themed, enterprise-grade table
// Uses Nexus OKLCH design tokens throughout.
// ============================================================

interface DataTableProps<TData> {
  columns: ColumnDef<TData, unknown>[];
  data: TData[];
  /** Placeholder text for the global search input */
  searchPlaceholder?: string;
  /** Enable row checkboxes */
  enableSelection?: boolean;
  /** Enable pagination controls */
  enablePagination?: boolean;
  /** Rows per page (default 15) */
  pageSize?: number;
  /** Callback when a row body is clicked (not checkbox/action) */
  onRowClick?: (row: TData) => void;
  /** Currently highlighted row */
  selectedRowId?: string | null;
  /** Extract a stable ID from each row */
  getRowId?: (row: TData) => string;
  /** Render a toolbar-right section (e.g. filters, create button) */
  toolbarRight?: ReactNode;
  /** Render content when selection is active (batch actions) */
  selectionActions?: (selectedRows: Row<TData>[]) => ReactNode;
  /** Compact mode — tighter padding */
  compact?: boolean;
  /** Striped rows */
  striped?: boolean;
}

export function DataTableTanstack<TData>({
  columns,
  data,
  searchPlaceholder = "Search...",
  enableSelection = false,
  enablePagination = true,
  pageSize = 15,
  onRowClick,
  selectedRowId,
  getRowId,
  toolbarRight,
  selectionActions,
  compact = false,
  striped = false,
}: DataTableProps<TData>) {
  const [sorting, setSorting] = useState<SortingState>([]);
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);
  const [columnVisibility, setColumnVisibility] = useState<VisibilityState>({});
  const [rowSelection, setRowSelection] = useState<RowSelectionState>({});
  const [globalFilter, setGlobalFilter] = useState("");

  const table = useReactTable({
    data,
    columns,
    state: { sorting, columnFilters, columnVisibility, rowSelection, globalFilter },
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    onColumnVisibilityChange: setColumnVisibility,
    onRowSelectionChange: setRowSelection,
    onGlobalFilterChange: setGlobalFilter,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getPaginationRowModel: enablePagination ? getPaginationRowModel() : undefined,
    enableRowSelection: enableSelection,
    getRowId,
    initialState: { pagination: { pageSize } },
  });

  const selectedRows = table.getFilteredSelectedRowModel().rows;
  const selectedCount = selectedRows.length;
  const totalRows = table.getFilteredRowModel().rows.length;
  const cellPadding = compact ? "px-3 py-2" : "px-4 py-3";

  return (
    <div className="space-y-0">
      {/* ── Toolbar ── */}
      <div className="flex items-center gap-3 rounded-t-xl border border-b-0 border-border bg-card px-4 py-3">
        {/* Search */}
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground/40" />
          <input
            type="text"
            placeholder={searchPlaceholder}
            value={globalFilter}
            onChange={(e) => setGlobalFilter(e.target.value)}
            className="h-9 w-full rounded-lg border border-border bg-muted/30 pl-10 pr-8 text-sm placeholder:text-muted-foreground/40 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary/40 transition-all"
            aria-label="Search table"
          />
          {globalFilter && (
            <button
              type="button"
              onClick={() => setGlobalFilter("")}
              className="absolute right-2.5 top-1/2 -translate-y-1/2 text-muted-foreground/40 hover:text-muted-foreground"
              aria-label="Clear search"
            >
              <X className="h-3.5 w-3.5" />
            </button>
          )}
        </div>

        {/* Selection indicator */}
        {enableSelection && selectedCount > 0 && (
          <div className="flex items-center gap-2 rounded-lg bg-primary/5 border border-primary/20 px-3 py-1.5">
            <span className="text-xs font-semibold text-primary tabular-nums">{selectedCount} selected</span>
            <button
              type="button"
              onClick={() => table.toggleAllRowsSelected(false)}
              className="text-primary/60 hover:text-primary"
            >
              <X className="h-3 w-3" />
            </button>
          </div>
        )}

        <div className="flex items-center gap-1.5 ml-auto">
          {/* Custom toolbar content */}
          {toolbarRight}

          {/* Column visibility */}
          <DropdownMenu>
            <DropdownMenuTrigger render={
              <Button variant="ghost" size="sm" className="h-8 gap-1.5 text-xs text-muted-foreground hover:text-foreground" />
            }>
              <Columns3 className="h-3.5 w-3.5" />
              <span className="hidden sm:inline">Columns</span>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-48">
              {table.getAllLeafColumns().map((column) => {
                if (column.id === "select" || column.id === "actions") return null;
                return (
                  <DropdownMenuItem key={column.id} onClick={() => column.toggleVisibility(!column.getIsVisible())}>
                    <input type="checkbox" checked={column.getIsVisible()} readOnly className="mr-2 accent-primary" />
                    <span className="text-xs">{typeof column.columnDef.header === "string" ? column.columnDef.header : column.id}</span>
                  </DropdownMenuItem>
                );
              })}
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={() => table.resetColumnVisibility()}>
                <span className="text-xs">Reset all</span>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>

          <Button variant="ghost" size="sm" className="h-8 gap-1.5 text-xs text-muted-foreground hover:text-foreground">
            <Download className="h-3.5 w-3.5" />
            <span className="hidden sm:inline">Export</span>
          </Button>
        </div>
      </div>

      {/* ── Selection Action Bar ── */}
      {enableSelection && selectedCount > 0 && selectionActions && (
        <div className="flex items-center gap-3 border-x border-border bg-primary/5 px-4 py-2.5">
          {selectionActions(selectedRows)}
        </div>
      )}

      {/* ── Table ── */}
      <div className="rounded-b-xl border border-border bg-card shadow-elevation-1 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full" aria-label="Data table">
            <thead>
              {table.getHeaderGroups().map((headerGroup) => (
                <tr key={headerGroup.id} className="border-b border-border bg-muted/50">
                  {headerGroup.headers.map((header) => {
                    const sorted = header.column.getIsSorted();
                    const canSort = header.column.getCanSort();
                    return (
                      <th
                        key={header.id}
                        scope="col"
                        className={cn(
                          cellPadding,
                          "text-left text-[11px] font-semibold uppercase tracking-[0.05em] text-muted-foreground/70 select-none",
                          canSort && "cursor-pointer transition-colors hover:text-foreground hover:bg-muted/70",
                          sorted && "text-foreground bg-muted/60"
                        )}
                        style={{ width: header.getSize() !== 150 ? header.getSize() : undefined }}
                        onClick={header.column.getToggleSortingHandler()}
                      >
                        <div className="flex items-center gap-1.5">
                          {header.isPlaceholder ? null : flexRender(header.column.columnDef.header, header.getContext())}
                          {canSort && (
                            <span className={cn("transition-colors", sorted ? "text-primary" : "text-muted-foreground/30")}>
                              {sorted === "asc" ? (
                                <ArrowUp className="h-3.5 w-3.5" />
                              ) : sorted === "desc" ? (
                                <ArrowDown className="h-3.5 w-3.5" />
                              ) : (
                                <ArrowUpDown className="h-3 w-3" />
                              )}
                            </span>
                          )}
                        </div>
                      </th>
                    );
                  })}
                </tr>
              ))}
            </thead>

            <tbody>
              {table.getRowModel().rows.length === 0 ? (
                <tr>
                  <td colSpan={columns.length} className="px-4 py-12 text-center">
                    <div className="flex flex-col items-center gap-2">
                      <ListFilter className="h-8 w-8 text-muted-foreground/20" />
                      <p className="text-sm text-muted-foreground">No results found</p>
                      {globalFilter && (
                        <Button variant="ghost" size="sm" className="text-xs" onClick={() => setGlobalFilter("")}>
                          Clear search
                        </Button>
                      )}
                    </div>
                  </td>
                </tr>
              ) : (
                table.getRowModel().rows.map((row, index) => {
                  const isHighlighted = getRowId && selectedRowId === getRowId(row.original);
                  const isChecked = row.getIsSelected();

                  return (
                    <tr
                      key={row.id}
                      className={cn(
                        "border-b border-border transition-colors",
                        isHighlighted
                          ? "bg-primary/4 hover:bg-primary/6"
                          : isChecked
                            ? "bg-primary/3"
                            : striped && index % 2 === 1
                              ? "bg-muted/20 hover:bg-muted/40"
                              : "hover:bg-muted/30",
                        onRowClick && "cursor-pointer",
                        "last:border-b-0"
                      )}
                      onClick={() => onRowClick?.(row.original)}
                      data-state={isChecked ? "selected" : undefined}
                    >
                      {row.getVisibleCells().map((cell) => (
                        <td
                          key={cell.id}
                          className={cn(cellPadding, "align-middle text-sm")}
                        >
                          {flexRender(cell.column.columnDef.cell, cell.getContext())}
                        </td>
                      ))}
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>

        {/* ── Pagination ── */}
        {enablePagination && (
          <div className="flex items-center justify-between border-t border-border bg-muted/20 px-4 py-2.5">
            <div className="flex items-center gap-4">
              <span className="text-xs text-muted-foreground tabular-nums">
                {totalRows} {totalRows === 1 ? "result" : "results"}
              </span>

              {/* Page size selector */}
              <div className="flex items-center gap-1.5">
                <span className="text-xs text-muted-foreground">Show</span>
                <select
                  value={table.getState().pagination.pageSize}
                  onChange={(e) => table.setPageSize(Number(e.target.value))}
                  className="h-7 rounded-md border border-border bg-background px-2 text-xs tabular-nums focus:outline-none focus:ring-1 focus:ring-primary/30"
                  aria-label="Rows per page"
                >
                  {[10, 15, 20, 30, 50].map((size) => (
                    <option key={size} value={size}>{size}</option>
                  ))}
                </select>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <span className="text-xs text-muted-foreground tabular-nums">
                Page {table.getState().pagination.pageIndex + 1} of {table.getPageCount() || 1}
              </span>

              <div className="flex items-center gap-0.5">
                <Button
                  variant="ghost"
                  size="sm"
                  className="h-7 w-7 p-0 text-muted-foreground hover:text-foreground disabled:opacity-30"
                  onClick={() => table.setPageIndex(0)}
                  disabled={!table.getCanPreviousPage()}
                  aria-label="First page"
                >
                  <ChevronsLeft className="h-4 w-4" />
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  className="h-7 w-7 p-0 text-muted-foreground hover:text-foreground disabled:opacity-30"
                  onClick={() => table.previousPage()}
                  disabled={!table.getCanPreviousPage()}
                  aria-label="Previous page"
                >
                  <ChevronLeft className="h-4 w-4" />
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  className="h-7 w-7 p-0 text-muted-foreground hover:text-foreground disabled:opacity-30"
                  onClick={() => table.nextPage()}
                  disabled={!table.getCanNextPage()}
                  aria-label="Next page"
                >
                  <ChevronRight className="h-4 w-4" />
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  className="h-7 w-7 p-0 text-muted-foreground hover:text-foreground disabled:opacity-30"
                  onClick={() => table.setPageIndex(table.getPageCount() - 1)}
                  disabled={!table.getCanNextPage()}
                  aria-label="Last page"
                >
                  <ChevronsRight className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
