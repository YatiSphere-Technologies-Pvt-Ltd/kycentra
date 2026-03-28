import { PageHeader, EmptyState } from "@/components/shared";
import { ClipboardCheck } from "lucide-react";

export default function ReviewsPage() {
  return (
    <div className="space-y-6">
      <PageHeader title="Reviews" description="KYC review workflows and periodic review management" />
      <EmptyState
        icon={<ClipboardCheck className="h-12 w-12" />}
        title="Review Workflows"
        description="Active and upcoming periodic reviews will be managed here. Assign, track progress, and approve reviews across your entity portfolio."
      />
    </div>
  );
}
