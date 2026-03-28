"use client";

import Link from "next/link";
import { ScrollArea } from "@/components/ui/scroll-area";
import { AIIndicator, ConfidenceBadge } from "@/components/shared";
import { DashboardCard } from "@/components/shared/dashboard-card";
import { agentStyles } from "@/lib/styles";
import type { ActivityItem } from "../types";

// ============================================================
// AgentActivityFeed — live-updating AI agent actions
// ============================================================

interface AgentActivityFeedProps {
  items: ActivityItem[];
  isLoading?: boolean;
  error?: string | null;
  onRetry?: () => void;
}

function LiveBadge() {
  return (
    <span
      className="inline-flex items-center gap-1.5 rounded-md bg-nx-ai-label-bg px-2 py-0.5 text-[11px] font-bold text-nx-ai-label-fg"
      role="status"
      aria-label="Live feed active"
    >
      <span className="relative flex h-2 w-2" aria-hidden="true">
        <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-nx-emerald-400 opacity-75" />
        <span className="relative inline-flex h-2 w-2 rounded-full bg-nx-emerald-500" />
      </span>
      Live
    </span>
  );
}

export function AgentActivityFeed({
  items,
  isLoading = false,
  error = null,
  onRetry,
}: AgentActivityFeedProps) {
  return (
    <DashboardCard.Root>
      <DashboardCard.Header
        title="AI Agent Activity"
        badge={<LiveBadge />}
        actions={
          <Link href="/cases" className="text-xs font-medium text-primary hover:underline">
            View All
          </Link>
        }
      />

      {isLoading && <DashboardCard.Loading rows={5} />}
      {error && <DashboardCard.Error message={error} onRetry={onRetry} />}
      {!isLoading && !error && items.length === 0 && (
        <DashboardCard.Empty message="No recent agent activity." />
      )}

      {!isLoading && !error && items.length > 0 && (
        <ScrollArea className="flex-1">
          <div
            className="divide-y divide-border"
            role="feed"
            aria-label="AI agent activity feed"
          >
            {items.map((item) => {
              const agent = agentStyles[item.agent];
              return (
                <article
                  key={item.id}
                  className="px-5 py-4 transition-colors hover:bg-muted/30 cursor-pointer"
                  aria-label={`${item.agent}: ${item.action}`}
                >
                  <div className="flex items-start gap-3">
                    <span
                      className="mt-1.5 h-2.5 w-2.5 shrink-0 rounded-full"
                      style={{ backgroundColor: agent?.color ?? "var(--nx-neutral-400)" }}
                      aria-hidden="true"
                    />
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2">
                        <span className="text-[13px] font-semibold truncate">
                          {item.agent}
                        </span>
                        <AIIndicator size={12} />
                        <span className="ml-auto text-[11px] text-muted-foreground/60 tabular-nums shrink-0">
                          {item.timestamp}
                        </span>
                      </div>
                      <p className="mt-1 text-sm text-muted-foreground leading-relaxed">
                        {item.action}
                      </p>
                      <div className="mt-2 flex items-center gap-2">
                        <p className="text-xs text-muted-foreground/60 truncate flex-1">
                          {item.detail}
                        </p>
                        <ConfidenceBadge value={item.confidence} />
                      </div>
                    </div>
                  </div>
                </article>
              );
            })}
          </div>
        </ScrollArea>
      )}
    </DashboardCard.Root>
  );
}
