import { PageHeader, EmptyState } from "@/components/shared";
import { FileText } from "lucide-react";

export default function DocumentsPage() {
  return (
    <div className="space-y-6">
      <PageHeader title="Documents" description="Document processing queue and verification status" />
      <EmptyState
        icon={<FileText className="h-12 w-12" />}
        title="Document Processing Queue"
        description="Documents pending AI extraction and verification will appear here. Navigate to an entity to manage their documents."
      />
    </div>
  );
}
