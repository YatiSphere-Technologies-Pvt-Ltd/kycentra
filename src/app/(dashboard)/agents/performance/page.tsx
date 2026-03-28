"use client";

import { PerformanceTab } from "@/features/agent-hub/components/performance-tab";

export default function AgentPerformancePage() {
  return (
    <div className="space-y-5">
      <div>
        <h2 className="text-lg font-semibold">Performance Observatory</h2>
        <p className="text-sm text-muted-foreground mt-0.5">Agent accuracy, drift detection, and operational metrics across all 16 agents</p>
      </div>
      <PerformanceTab />
    </div>
  );
}
