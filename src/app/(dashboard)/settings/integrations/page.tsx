"use client";
import { Plug } from "lucide-react";
import { IntegrationsTab } from "@/features/settings/components/settings-tabs";

export default function IntegrationsSettingsPage() {
  return (
    <div className="space-y-6">
      <div className="flex items-center gap-2.5">
        <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary/10"><Plug className="h-4 w-4 text-primary" /></div>
        <div><h2 className="text-lg font-semibold">Integrations</h2><p className="text-xs text-muted-foreground">External systems, data source APIs, webhooks, and API keys</p></div>
      </div>
      <IntegrationsTab />
    </div>
  );
}
