"use client";

import { useEffect } from "react";
import { Button } from "@/components/ui/button";
import { AlertCircle, RefreshCw } from "lucide-react";

export default function DashboardError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error("Dashboard error:", error);
  }, [error]);

  return (
    <div className="flex flex-1 flex-col items-center justify-center gap-4 p-12 text-center">
      <div className="flex h-14 w-14 items-center justify-center rounded-full bg-nx-status-danger-bg">
        <AlertCircle className="h-7 w-7 text-nx-status-danger" />
      </div>
      <h2 className="text-lg font-semibold">Something went wrong</h2>
      <p className="max-w-md text-sm text-muted-foreground">
        An unexpected error occurred while loading the dashboard. Our team has
        been notified. Please try again.
      </p>
      <Button onClick={reset} className="gap-1.5 mt-2">
        <RefreshCw className="h-4 w-4" />
        Try Again
      </Button>
    </div>
  );
}
