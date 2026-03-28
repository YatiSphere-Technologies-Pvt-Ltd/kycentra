"use client";

import { useState, Fragment } from "react";
import { Button } from "@/components/ui/button";
import { ConfidenceBadge } from "@/components/shared";
import { RiskBadge } from "@/components/shared";
import { ReasoningChain } from "@/components/shared/reasoning-chain";
import { riskStyles } from "@/lib/styles";
import { Shield, CheckCircle2, AlertTriangle, ChevronRight, Sparkles } from "lucide-react";
import { cn } from "@/lib/utils";
import type { ScreeningAlert } from "../types";

interface ScreeningTabProps {
  alerts: ScreeningAlert[];
  totalScreens?: number;
  autoResolved?: number;
  falsePositiveRate?: string;
}

export function TabScreening({ alerts, totalScreens = 847, autoResolved = 812, falsePositiveRate = "18%" }: ScreeningTabProps) {
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [dispositions, setDispositions] = useState<Record<string, string>>({});

  return (
    <div className="space-y-5">
      {/* KPIs */}
      <div className="grid grid-cols-4 gap-px bg-border rounded-lg overflow-hidden">
        {[
          { label: "Total Screens", value: String(totalScreens) },
          { label: "Active Alerts", value: String(alerts.length), warn: alerts.length > 0 },
          { label: "Auto-Resolved", value: String(autoResolved) },
          { label: "False Positive Rate", value: falsePositiveRate },
        ].map((k) => (
          <div key={k.label} className="bg-card p-3.5">
            <div className="text-[9px] font-bold text-muted-foreground uppercase tracking-widest mb-1">{k.label}</div>
            <div className={`text-[18px] font-extrabold tabular-nums tracking-tight ${k.warn ? "text-nx-amber-600" : ""}`}>{k.value}</div>
          </div>
        ))}
      </div>

      {/* Alert table */}
      <div className="rounded-lg border border-border bg-card overflow-hidden">
        <div className="flex items-center justify-between px-4 py-2.5 border-b border-border">
          <div className="flex items-center gap-2">
            <Shield className="h-3.5 w-3.5 text-muted-foreground/40" />
            <span className="text-[12px] font-bold">Screening Alerts</span>
            <span className="flex h-4.5 min-w-4.5 items-center justify-center rounded bg-foreground px-1 text-[9px] font-bold text-background tabular-nums">{alerts.length}</span>
          </div>
          <span className="text-[9px] text-muted-foreground">Last full screening: 2h ago · Continuous monitoring active</span>
        </div>

        <table className="w-full text-[11px]">
          <thead>
            <tr className="border-b border-border bg-muted/20">
              {["Priority", "List", "Match", "AI Assessment", "Confidence", "Pending", ""].map((h) => (
                <th key={h} className="text-left font-bold text-muted-foreground uppercase tracking-wider px-4 py-2 whitespace-nowrap">{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {alerts.map((alert) => {
              const risk = riskStyles[alert.priority === "critical" ? "critical" : alert.priority];
              const isExpanded = expandedId === alert.id;

              return (
                <Fragment key={alert.id}>
                  <tr
                    className={cn("border-b border-border cursor-pointer group transition-colors", isExpanded ? "bg-muted/15" : "hover:bg-muted/10")}
                    style={{ borderLeft: `3px solid ${risk.fg}` }}
                    onClick={() => setExpandedId(isExpanded ? null : alert.id)}
                  >
                    <td className="px-4 py-2.5">
                      <span className="text-[9px] font-bold uppercase" style={{ color: risk.fg }}>{alert.priority}</span>
                    </td>
                    <td className="px-4 py-2.5 font-semibold">{alert.list}</td>
                    <td className="px-4 py-2.5">
                      <div className="flex items-center gap-2">
                        <div className="w-14 h-1.5 bg-muted rounded-full overflow-hidden">
                          <div className="h-full rounded-full" style={{ width: `${alert.matchScore * 100}%`, backgroundColor: alert.matchScore >= 0.8 ? "var(--nx-rose-500)" : alert.matchScore >= 0.6 ? "var(--nx-amber-500)" : "var(--nx-neutral-400)" }} />
                        </div>
                        <span className="font-bold tabular-nums">{Math.round(alert.matchScore * 100)}%</span>
                      </div>
                    </td>
                    <td className="px-4 py-2.5 max-w-56">
                      <p className="text-muted-foreground truncate">{alert.aiRecommendation}</p>
                    </td>
                    <td className="px-4 py-2.5"><ConfidenceBadge value={Math.round(alert.aiConfidence * 100)} /></td>
                    <td className="px-4 py-2.5 font-bold tabular-nums text-muted-foreground">{alert.timePending}</td>
                    <td className="px-4 py-2.5">
                      <ChevronRight className={cn("h-3.5 w-3.5 text-muted-foreground/30 group-hover:text-foreground transition-all", isExpanded && "rotate-90")} />
                    </td>
                  </tr>

                  {isExpanded && (
                    <tr className="border-b border-border bg-muted/5">
                      <td colSpan={7} className="p-0">
                        <div className="grid lg:grid-cols-12 divide-y lg:divide-y-0 lg:divide-x divide-border">
                          {/* Left — Match comparison */}
                          <div className="lg:col-span-8 p-5 space-y-4">
                            {alert.listedName && (
                              <div>
                                <div className="text-[9px] font-bold text-muted-foreground uppercase tracking-widest mb-2">Match Comparison</div>
                                <div className="grid grid-cols-2 gap-px bg-border rounded overflow-hidden">
                                  <div className="bg-card p-3">
                                    <div className="text-[8px] font-bold text-muted-foreground uppercase tracking-widest mb-2">Client Record</div>
                                    <div className="text-[11px] space-y-1">
                                      <p><span className="text-muted-foreground">Name:</span> <strong>Meridian Capital Partners Ltd</strong></p>
                                      {alert.listedJurisdiction && <p><span className="text-muted-foreground">Jurisdiction:</span> {alert.listedJurisdiction}</p>}
                                      {alert.listedType && <p><span className="text-muted-foreground">Type:</span> Fund Administrator</p>}
                                    </div>
                                  </div>
                                  <div className="bg-card p-3">
                                    <div className="text-[8px] font-bold text-muted-foreground uppercase tracking-widest mb-2">{alert.list} Entry {alert.entryNumber && `#${alert.entryNumber}`}</div>
                                    <div className="text-[11px] space-y-1">
                                      <p><span className="text-muted-foreground">Name:</span> <strong>{alert.listedName}</strong></p>
                                      {alert.listedJurisdiction && <p><span className="text-muted-foreground">Location:</span> {alert.listedJurisdiction}</p>}
                                      {alert.listedType && <p><span className="text-muted-foreground">Type:</span> {alert.listedType}</p>}
                                    </div>
                                  </div>
                                </div>
                              </div>
                            )}

                            {/* Factors */}
                            <div>
                              <div className="text-[9px] font-bold text-muted-foreground uppercase tracking-widest mb-2">Factor Analysis</div>
                              <div className="grid grid-cols-2 gap-x-4 gap-y-1">
                                <div>
                                  <div className="text-[8px] font-bold text-nx-emerald-600 uppercase tracking-widest mb-1">Matching</div>
                                  {alert.matchingFactors.map((f) => <p key={f} className="text-[10px] text-muted-foreground">✓ {f}</p>)}
                                </div>
                                <div>
                                  <div className="text-[8px] font-bold text-nx-rose-600 uppercase tracking-widest mb-1">Non-Matching</div>
                                  {alert.nonMatchingFactors.map((f) => <p key={f} className="text-[10px] text-muted-foreground">✗ {f}</p>)}
                                </div>
                              </div>
                            </div>

                            {/* Reasoning chain */}
                            {alert.reasoningSteps && (
                              <div>
                                <div className="text-[9px] font-bold text-muted-foreground uppercase tracking-widest mb-2">AI Reasoning Chain</div>
                                <ReasoningChain steps={alert.reasoningSteps} />
                              </div>
                            )}
                          </div>

                          {/* Right — Disposition */}
                          <div className="lg:col-span-4 p-5 space-y-4">
                            <div>
                              <div className="text-[9px] font-bold text-muted-foreground uppercase tracking-widest mb-2">AI Assessment</div>
                              <div className="flex items-center gap-2 mb-2">
                                <Sparkles className="h-3 w-3 text-muted-foreground/40" />
                                <span className="text-[10px] font-bold">{alert.agentName}</span>
                              </div>
                              <p className="text-[11px] text-muted-foreground leading-relaxed">{alert.aiRecommendation}</p>
                              <ConfidenceBadge value={Math.round(alert.aiConfidence * 100)} className="mt-2" />
                            </div>

                            <div className="pt-3 border-t border-border">
                              <div className="text-[9px] font-bold text-muted-foreground uppercase tracking-widest mb-2">Your Decision</div>
                              <div className="space-y-1.5">
                                {[
                                  { value: "false_positive", label: "False Positive", style: "bg-nx-emerald-600 hover:bg-nx-emerald-700 text-white" },
                                  { value: "true_positive", label: "True Positive", style: "bg-white border border-nx-rose-300 text-nx-rose-700 hover:bg-nx-rose-50" },
                                  { value: "escalate", label: "Escalate", style: "bg-white border border-border text-foreground hover:bg-muted/30" },
                                ].map((opt) => (
                                  <Button
                                    key={opt.value}
                                    className={cn("w-full h-7 text-[10px] font-semibold justify-start", opt.style)}
                                    onClick={(e) => { e.stopPropagation(); setDispositions((p) => ({ ...p, [alert.id]: opt.value })); }}
                                  >
                                    {opt.label}
                                  </Button>
                                ))}
                              </div>
                              <textarea
                                className="mt-2 w-full rounded border border-border bg-background px-2.5 py-2 text-[10px] placeholder:text-muted-foreground/40 focus:outline-none focus:ring-1 focus:ring-foreground/20 min-h-16"
                                placeholder="Justification (required)..."
                                onClick={(e) => e.stopPropagation()}
                              />
                              <Button size="sm" className="h-7 text-[10px] font-semibold w-full mt-2" disabled={!dispositions[alert.id]}>
                                Submit Decision
                              </Button>
                            </div>
                          </div>
                        </div>
                      </td>
                    </tr>
                  )}
                </Fragment>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
