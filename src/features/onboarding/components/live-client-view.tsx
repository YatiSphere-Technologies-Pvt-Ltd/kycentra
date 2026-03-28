"use client";

import { ScrollArea } from "@/components/ui/scroll-area";
import { Button } from "@/components/ui/button";
import { ExternalLink, Mail } from "lucide-react";
import type { OnboardingRecord } from "../types";

interface LiveClientViewProps {
  data: OnboardingRecord;
}

const progressSections = [
  { label: "Entity Information", pct: 75 },
  { label: "Beneficial Ownership", pct: 35 },
  { label: "Documents", pct: 40 },
  { label: "Declarations", pct: 0 },
];

export function LiveClientView({ data }: LiveClientViewProps) {
  const isOnline = data.client.status === "online";

  return (
    <div className="flex h-full flex-col rounded-xl border border-border bg-card shadow-elevation-1 overflow-hidden">
      {/* Header */}
      <div className="border-b border-border px-5 py-4">
        <div className="flex items-center justify-between">
          <h3 className="text-base font-semibold">Client Portal View</h3>
          <Button variant="ghost" size="sm" className="gap-1.5 h-7 text-xs">
            <ExternalLink className="h-3 w-3" />Open
          </Button>
        </div>
        <div className="mt-1.5 space-y-0.5 text-xs text-muted-foreground">
          <p>Client: {data.client.name} ({data.client.email})</p>
          <p className="flex items-center gap-1.5">
            Status:
            <span className={`h-2 w-2 rounded-full ${isOnline ? "bg-nx-emerald-500" : "bg-nx-neutral-300"}`} />
            <span className={isOnline ? "text-nx-emerald-600 font-medium" : ""}>
              {isOnline ? "Online now" : "Offline"}
            </span>
            {!isOnline && <span>· Last seen: 45 min ago</span>}
          </p>
          <p>Language: German · Device: {data.client.device}</p>
        </div>
      </div>

      <ScrollArea className="flex-1">
        <div className="p-5 space-y-5">
          {isOnline ? (
            <>
              {/* Simulated portal view */}
              <div className="rounded-lg border border-border p-4 bg-nx-neutral-25">
                <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-3">Currently Viewing: Step 3 — Document Upload</p>
                <div className="space-y-2 text-[13px]">
                  <div className="flex items-center gap-2">
                    <span className="h-5 w-5 rounded-full bg-nx-emerald-500 text-white flex items-center justify-center text-[10px]">✓</span>
                    <span className="text-muted-foreground">Certificate of Registration</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="h-5 w-5 rounded-full bg-nx-emerald-500 text-white flex items-center justify-center text-[10px]">✓</span>
                    <span className="text-muted-foreground">Articles of Association</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="h-5 w-5 rounded-full bg-nx-teal-500 text-white flex items-center justify-center text-[10px] animate-spin">⟳</span>
                    <span className="font-medium">Financial Statements — Processing...</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="h-5 w-5 rounded-full border-2 border-nx-amber-400 flex items-center justify-center text-[10px] text-nx-amber-500">!</span>
                    <span className="text-nx-amber-600">Board Resolution — Just uploaded</span>
                  </div>
                </div>
              </div>

              {/* Progress by section */}
              <div className="space-y-3">
                <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Progress by Section</p>
                {progressSections.map((s) => (
                  <div key={s.label}>
                    <div className="flex items-center justify-between text-[13px] mb-1">
                      <span className="text-muted-foreground">{s.label}</span>
                      <span className="tabular-nums font-medium">{s.pct}%</span>
                    </div>
                    <div className="h-1.5 rounded-full bg-nx-neutral-100">
                      <div className="h-full rounded-full transition-all" style={{ width: `${s.pct}%`, backgroundColor: s.pct > 60 ? "var(--nx-emerald-500)" : s.pct > 0 ? "var(--nx-amber-500)" : "var(--nx-neutral-300)" }} />
                    </div>
                  </div>
                ))}
              </div>
            </>
          ) : (
            /* Offline state */
            <div className="text-center py-8 space-y-4">
              <div className="mx-auto h-12 w-12 rounded-full bg-muted flex items-center justify-center">
                <span className="text-lg">📊</span>
              </div>
              <div>
                <p className="text-sm font-medium">Progress Snapshot</p>
                <p className="text-xs text-muted-foreground mt-1">Client last completed: Uploaded Articles of Association</p>
                <p className="text-xs text-muted-foreground">Next expected: UBO passport copies</p>
              </div>
              <div className="flex justify-center gap-2">
                <Button size="sm" variant="outline" className="gap-1.5 text-xs"><Mail className="h-3 w-3" />Send Reminder</Button>
                <Button size="sm" variant="outline" className="gap-1.5 text-xs">Resend Link</Button>
              </div>
            </div>
          )}
        </div>
      </ScrollArea>
    </div>
  );
}
