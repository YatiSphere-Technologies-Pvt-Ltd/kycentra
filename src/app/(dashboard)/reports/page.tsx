import { PageHeader, EmptyState } from "@/components/shared";
import { BarChart3 } from "lucide-react";

export default function ReportsPage() {
  return (
    <div className="space-y-6">
      <PageHeader title="Reports" description="Compliance reporting and analytics" />
      <EmptyState
        icon={<BarChart3 className="h-12 w-12" />}
        title="Compliance Reports"
        description="Generate SAR, CTR, STR and regulatory reports. Schedule automated reporting and export compliance analytics."
      />
    </div>
  );
}
