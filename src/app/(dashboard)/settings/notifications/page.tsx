"use client";
import { Bell } from "lucide-react";
import { NotificationsTab } from "@/features/settings/components/settings-tabs";

export default function NotificationsSettingsPage() {
  return (
    <div className="space-y-6">
      <div className="flex items-center gap-2.5">
        <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary/10"><Bell className="h-4 w-4 text-primary" /></div>
        <div><h2 className="text-lg font-semibold">Notifications</h2><p className="text-xs text-muted-foreground">Alert routing, channel preferences, and escalation rules</p></div>
      </div>
      <NotificationsTab />
    </div>
  );
}
