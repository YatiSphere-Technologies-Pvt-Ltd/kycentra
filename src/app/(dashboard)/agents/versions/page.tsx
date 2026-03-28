import { EmptyState } from "@/components/shared";
import { Layers } from "lucide-react";

export default function AgentVersionsPage() {
  return (
    <div className="space-y-5">
      <div>
        <h2 className="text-lg font-semibold">Version Management</h2>
        <p className="text-sm text-muted-foreground mt-0.5">Track model versions, deployment history, and rollback capabilities for all 16 agents</p>
      </div>
      <EmptyState
        icon={<Layers className="h-12 w-12" />}
        title="Version Registry"
        description="View changelogs, approval chains, performance deltas per version, and A/B testing results. Roll back to any previous version with one click. Full deployment audit trail."
      />
    </div>
  );
}
