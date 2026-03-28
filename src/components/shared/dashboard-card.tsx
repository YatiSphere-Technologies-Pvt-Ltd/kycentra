"use client";

import { cn } from "@/lib/utils";
import { Skeleton } from "@/components/ui/skeleton";
import { AlertCircle, RefreshCw } from "lucide-react";
import { Button } from "@/components/ui/button";

// ============================================================
// DashboardCard — compound component for consistent card layout
// across the workbench. Handles header, content, loading, error.
// ============================================================

interface DashboardCardProps {
  children: React.ReactNode;
  className?: string;
}

function Root({ children, className }: DashboardCardProps) {
  return (
    <div
      className={cn(
        "flex h-full flex-col rounded-xl border border-border bg-card shadow-elevation-1 transition-shadow hover:shadow-elevation-2",
        className
      )}
    >
      {children}
    </div>
  );
}

interface HeaderProps {
  title: string;
  /** Badge rendered next to the title (e.g., count, live indicator) */
  badge?: React.ReactNode;
  /** Actions rendered on the right side of the header */
  actions?: React.ReactNode;
}

function Header({ title, badge, actions }: HeaderProps) {
  return (
    <div className="flex items-center justify-between border-b border-border px-5 py-4">
      <div className="flex items-center gap-3">
        <h3 className="text-base font-semibold">{title}</h3>
        {badge}
      </div>
      {actions && <div className="flex items-center gap-3">{actions}</div>}
    </div>
  );
}

interface ContentProps {
  children: React.ReactNode;
  className?: string;
  /** Remove default padding */
  noPadding?: boolean;
}

function Content({ children, className, noPadding }: ContentProps) {
  return (
    <div className={cn("flex-1", !noPadding && "p-5", className)}>
      {children}
    </div>
  );
}

interface LoadingProps {
  rows?: number;
}

function Loading({ rows = 4 }: LoadingProps) {
  return (
    <div className="flex-1 p-5 space-y-4" role="status" aria-label="Loading content">
      {Array.from({ length: rows }).map((_, i) => (
        <div key={i} className="space-y-2">
          <Skeleton className="h-4 w-3/4" />
          <Skeleton className="h-3 w-1/2" />
        </div>
      ))}
      <span className="sr-only">Loading…</span>
    </div>
  );
}

interface ErrorProps {
  message?: string;
  onRetry?: () => void;
}

function Error({
  message = "Something went wrong loading this data.",
  onRetry,
}: ErrorProps) {
  return (
    <div
      className="flex flex-1 flex-col items-center justify-center gap-3 p-8 text-center"
      role="alert"
    >
      <AlertCircle className="h-8 w-8 text-nx-status-danger" />
      <p className="text-sm text-muted-foreground">{message}</p>
      {onRetry && (
        <Button variant="outline" size="sm" onClick={onRetry} className="gap-1.5">
          <RefreshCw className="h-3.5 w-3.5" />
          Retry
        </Button>
      )}
    </div>
  );
}

interface EmptyProps {
  message?: string;
  action?: React.ReactNode;
}

function Empty({ message = "No data to display.", action }: EmptyProps) {
  return (
    <div className="flex flex-1 flex-col items-center justify-center gap-3 p-8 text-center">
      <p className="text-sm text-muted-foreground">{message}</p>
      {action}
    </div>
  );
}

export const DashboardCard = {
  Root,
  Header,
  Content,
  Loading,
  Error,
  Empty,
};
