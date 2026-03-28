"use client";
import { Shield } from "lucide-react";
import { AuditTab } from "@/features/settings/components/settings-tabs";

export default function AuditSettingsPage() {
  return (
    <div className="space-y-6">
      <div className="flex items-center gap-2.5">
        <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary/10"><Shield className="h-4 w-4 text-primary" /></div>
        <div><h2 className="text-lg font-semibold">Audit & Compliance</h2><p className="text-xs text-muted-foreground">Audit trail configuration, retention policies, and compliance reporting</p></div>
      </div>
      <AuditTab />
    </div>
  );
}
