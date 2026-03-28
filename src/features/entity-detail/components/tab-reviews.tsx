"use client";

import { ConfidenceBadge } from "@/components/shared";
import { Button } from "@/components/ui/button";
import { CheckCircle2, Square, ClipboardCheck, Sparkles, Calendar } from "lucide-react";
import type { ReviewItem } from "../types";

interface ReviewsTabProps { reviews: ReviewItem[]; nextReviewDue: string }

const checklist = [
  { label: "Client questionnaire sent", done: true },
  { label: "Document refresh requested", done: true },
  { label: "Re-screening completed (3 alerts pending)", done: true },
  { label: "Resolve screening alerts", done: false },
  { label: "Update risk assessment", done: false },
  { label: "EDD source of funds verification", done: false },
  { label: "Senior management sign-off", done: false },
];

export function TabReviews({ reviews, nextReviewDue }: ReviewsTabProps) {
  const doneCount = checklist.filter((c) => c.done).length;
  const pct = Math.round((doneCount / checklist.length) * 100);
  const dueDate = new Date(nextReviewDue).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });
  const daysUntil = Math.round((new Date(nextReviewDue).getTime() - Date.now()) / (1000 * 60 * 60 * 24));

  return (
    <div className="space-y-5">
      {/* Current review */}
      <div className="grid gap-5 lg:grid-cols-12">
        {/* Progress + Checklist (8 cols) */}
        <div className="lg:col-span-8 rounded-lg border border-border bg-card overflow-hidden">
          <div className="flex items-center justify-between px-4 py-2.5 border-b border-border">
            <div className="flex items-center gap-2">
              <ClipboardCheck className="h-3.5 w-3.5 text-muted-foreground/40" />
              <span className="text-[12px] font-bold">Annual Review — In Progress</span>
            </div>
            <div className="flex items-center gap-2 text-[10px]">
              <Calendar className="h-3 w-3 text-muted-foreground/40" />
              <span className="text-muted-foreground">Due: <strong className={daysUntil <= 30 ? "text-nx-amber-600" : "text-foreground"}>{dueDate} ({daysUntil}d)</strong></span>
            </div>
          </div>
          <div className="p-4 space-y-4">
            {/* Progress bar */}
            <div>
              <div className="flex items-center justify-between text-[11px] mb-1.5">
                <span className="font-medium">Progress</span>
                <span className="font-bold tabular-nums">{pct}% ({doneCount}/{checklist.length})</span>
              </div>
              <div className="h-1.5 w-full rounded-full bg-muted overflow-hidden">
                <div className="h-full rounded-full bg-foreground" style={{ width: `${pct}%` }} />
              </div>
            </div>

            {/* Checklist */}
            <div className="space-y-1.5">
              {checklist.map((item) => (
                <div key={item.label} className="flex items-center gap-2.5 py-1">
                  {item.done ? (
                    <CheckCircle2 className="h-3.5 w-3.5 text-nx-emerald-600 shrink-0" />
                  ) : (
                    <Square className="h-3.5 w-3.5 text-muted-foreground/25 shrink-0" />
                  )}
                  <span className={`text-[11px] ${item.done ? "text-muted-foreground line-through" : "font-medium"}`}>{item.label}</span>
                </div>
              ))}
            </div>

            <Button size="sm" className="h-7 text-[10px] font-semibold">Continue Review</Button>
          </div>
        </div>

        {/* AI Scope Assessment (4 cols) */}
        <div className="lg:col-span-4 rounded-lg border border-border bg-card overflow-hidden">
          <div className="flex items-center gap-2 px-4 py-2.5 border-b border-border">
            <Sparkles className="h-3.5 w-3.5 text-muted-foreground/40" />
            <span className="text-[12px] font-bold">AI Scope Assessment</span>
          </div>
          <div className="p-4 space-y-3">
            <p className="text-[11px] text-muted-foreground leading-[1.7]">
              Standard EDD review scope. Key focus areas:
            </p>
            <div className="space-y-1.5">
              {[
                "Resolve PEP association through Crown Bay Trust",
                "Verify continued fund administration activity in Cayman Islands",
                "Update financial statements to current year",
              ].map((item, i) => (
                <div key={i} className="flex items-start gap-2 text-[10px]">
                  <span className="text-muted-foreground/50 mt-0.5 shrink-0">{i + 1}.</span>
                  <span className="text-muted-foreground">{item}</span>
                </div>
              ))}
            </div>
            <ConfidenceBadge value={85} />
          </div>
        </div>
      </div>

      {/* Review History */}
      <div className="rounded-lg border border-border bg-card overflow-hidden">
        <div className="px-4 py-2.5 border-b border-border">
          <span className="text-[12px] font-bold">Review History</span>
        </div>
        <table className="w-full text-[11px]">
          <thead>
            <tr className="border-b border-border bg-muted/20">
              {["Review", "Type", "Completed", "Outcome", "Reviewer", "Risk Change"].map((h) => (
                <th key={h} className="text-left font-bold text-muted-foreground uppercase tracking-wider px-4 py-2">{h}</th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-border">
            {reviews.map((r) => (
              <tr key={r.id} className="hover:bg-muted/10 transition-colors">
                <td className="px-4 py-2.5 font-semibold">{r.id}</td>
                <td className="px-4 py-2.5">{r.type}</td>
                <td className="px-4 py-2.5 text-muted-foreground tabular-nums">{r.completed}</td>
                <td className="px-4 py-2.5">
                  <span className="text-[9px] font-bold px-1.5 py-0.5 rounded bg-nx-emerald-50 text-nx-emerald-700">{r.outcome}</span>
                </td>
                <td className="px-4 py-2.5 text-muted-foreground">{r.reviewer}</td>
                <td className="px-4 py-2.5 text-muted-foreground">{r.riskChange}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
