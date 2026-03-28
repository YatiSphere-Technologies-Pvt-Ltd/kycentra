"use client";

import { LiveMonitor } from "@/features/agent-hub/components/live-monitor";

export default function AgentMonitorPage() {
  return (
    <div className="space-y-5">
      <div>
        <h2 className="text-lg font-semibold">Live Activity Monitor</h2>
        <p className="text-sm text-muted-foreground mt-0.5">Real-time view of all 16 agents — tasks, queues, and activity stream</p>
      </div>
      <LiveMonitor />
    </div>
  );
}
