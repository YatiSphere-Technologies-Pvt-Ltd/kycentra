"use client";
import { Users } from "lucide-react";
import { UsersTab } from "@/features/settings/components/settings-tabs";

export default function UsersSettingsPage() {
  return (
    <div className="space-y-6">
      <div className="flex items-center gap-2.5">
        <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary/10"><Users className="h-4 w-4 text-primary" /></div>
        <div><h2 className="text-lg font-semibold">Users & Teams</h2><p className="text-xs text-muted-foreground">Manage users, roles, permissions, and team assignments</p></div>
      </div>
      <UsersTab />
    </div>
  );
}
