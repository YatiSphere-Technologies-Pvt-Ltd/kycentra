"use client";
import { Palette } from "lucide-react";
import { BrandingTab } from "@/features/settings/components/settings-tabs";

export default function BrandingSettingsPage() {
  return (
    <div className="space-y-6">
      <div className="flex items-center gap-2.5">
        <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary/10"><Palette className="h-4 w-4 text-primary" /></div>
        <div><h2 className="text-lg font-semibold">Branding</h2><p className="text-xs text-muted-foreground">White-label configuration, colors, logo, and portal branding</p></div>
      </div>
      <BrandingTab />
    </div>
  );
}
