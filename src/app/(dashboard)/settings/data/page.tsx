"use client";
import { Database } from "lucide-react";
import { DataPrivacyTab } from "@/features/settings/components/settings-tabs";

export default function DataPrivacySettingsPage() {
  return (
    <div className="space-y-6">
      <div className="flex items-center gap-2.5">
        <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary/10"><Database className="h-4 w-4 text-primary" /></div>
        <div><h2 className="text-lg font-semibold">Data & Privacy</h2><p className="text-xs text-muted-foreground">Data residency, encryption, GDPR controls, and privacy settings</p></div>
      </div>
      <DataPrivacyTab />
    </div>
  );
}
