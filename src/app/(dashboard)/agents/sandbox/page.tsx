import { EmptyState } from "@/components/shared";
import { FlaskConical } from "lucide-react";

export default function AgentSandboxPage() {
  return (
    <div className="space-y-5">
      <div>
        <h2 className="text-lg font-semibold">Agent Sandbox</h2>
        <p className="text-sm text-muted-foreground mt-0.5">Test agent behavior with sample data in an isolated environment</p>
      </div>
      <EmptyState
        icon={<FlaskConical className="h-12 w-12" />}
        title="Agent Playground"
        description="Run what-if scenarios, compare model versions, validate threshold changes, and test new orchestration flows before deploying to production. Isolated environment with synthetic data."
      />
    </div>
  );
}
