"use client";

import { useState, useCallback, Fragment } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { ConfidenceBadge } from "@/components/shared";
import { riskStyles } from "@/lib/styles";
import { screeningAlerts, metrics } from "@/features/screening-workbench/data/mock-data";
import type { ScreeningAlert } from "@/features/screening-workbench/types";
import {
  Shield, Search, Filter, CheckCircle2, Clock, AlertTriangle,
  ArrowUpRight, ArrowDownRight, ChevronRight, ExternalLink,
  XCircle, ArrowRight, Eye, Sparkles,
} from "lucide-react";

/* ─── Helpers ─── */

const listStyle: Record<string, { bg: string; fg: string }> = {
  "OFAC SDN": { bg: "var(--nx-rose-50)", fg: "var(--nx-rose-700)" },
  "EU Consolidated": { bg: "var(--nx-neutral-100)", fg: "var(--nx-neutral-700)" },
  "UK HMT": { bg: "var(--nx-neutral-100)", fg: "var(--nx-neutral-600)" },
  "UN Consolidated": { bg: "var(--nx-neutral-100)", fg: "var(--nx-neutral-600)" },
  "PEP Database": { bg: "var(--nx-amber-50)", fg: "var(--nx-amber-700)" },
  "Adverse Media": { bg: "var(--nx-amber-50)", fg: "var(--nx-amber-700)" },
};

const recStyle: Record<string, { label: string; color: string }> = {
  likely_true_match: { label: "Likely True Match", color: "var(--nx-rose-600)" },
  confirmed_match: { label: "Confirmed Match", color: "var(--nx-rose-600)" },
  likely_false_positive: { label: "Likely False Positive", color: "var(--nx-emerald-600)" },
  inconclusive: { label: "Inconclusive", color: "var(--nx-amber-600)" },
};

/* ─── Page ─── */

export default function ScreeningPage() {
  const router = useRouter();
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [checkedIds, setCheckedIds] = useState<Set<string>>(new Set());
  const [filterList, setFilterList] = useState("all");

  const selected = screeningAlerts.find((a) => a.id === selectedId) ?? null;
  const filtered = filterList === "all" ? screeningAlerts : screeningAlerts.filter((a) => a.list === filterList);

  const toggleCheck = useCallback((id: string) => {
    setCheckedIds((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  }, []);

  const lists = [...new Set(screeningAlerts.map((a) => a.list))];

  return (
    <div className="space-y-5">
      {/* ─── Header ─── */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h1 className="text-lg font-bold tracking-tight">Screening Workbench</h1>
          <p className="text-[11px] text-muted-foreground mt-0.5">
            {metrics.pendingReview} pending review · {metrics.autoResolved} auto-resolved today · {metrics.totalScreened} total screened
          </p>
        </div>
        <div className="flex items-center gap-1.5 text-[10px] font-medium text-muted-foreground">
          <span className="h-1.5 w-1.5 rounded-full bg-nx-emerald-500 animate-pulse" />
          Lists updated {Math.round((Date.now() - new Date("2026-03-23T07:00:00Z").getTime()) / 3600000)}h ago
        </div>
      </div>

      {/* ─── KPI Strip ─── */}
      <div className="grid grid-cols-3 lg:grid-cols-6 gap-px bg-border rounded-lg overflow-hidden">
        {[
          { label: "Auto-Resolved", value: String(metrics.autoResolved), sub: `vs ${metrics.yesterdayAutoResolved} yesterday`, trend: metrics.autoResolved > metrics.yesterdayAutoResolved ? "up" : "down" },
          { label: "Pending Review", value: String(metrics.pendingReview), sub: `vs ${metrics.yesterdayPending} yesterday`, trend: metrics.pendingReview < metrics.yesterdayPending ? "up" : "down", warn: metrics.pendingReview > 30 },
          { label: "Your Throughput", value: `${metrics.throughput}/hr`, sub: `vs ${metrics.yesterdayThroughput}/hr yesterday`, trend: metrics.throughput > metrics.yesterdayThroughput ? "up" : "down" },
          { label: "False Positive Rate", value: `${metrics.falsePositiveRate}%`, sub: `vs ${metrics.yesterdayFPRate}% yesterday`, trend: metrics.falsePositiveRate < metrics.yesterdayFPRate ? "up" : "down" },
          { label: "Avg. Resolution", value: metrics.avgResolutionTime, sub: `vs ${metrics.yesterdayAvgTime} yesterday`, trend: "up" },
          { label: "Total Screened", value: String(metrics.totalScreened), sub: "today", trend: null },
        ].map((kpi) => (
          <div key={kpi.label} className="bg-card p-3.5">
            <div className="flex items-center gap-1.5 mb-1.5">
              <span className="text-[9px] font-bold text-muted-foreground uppercase tracking-widest">{kpi.label}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className={`text-[18px] font-extrabold tabular-nums tracking-tight ${kpi.warn ? "text-nx-amber-600" : ""}`}>{kpi.value}</span>
              {kpi.trend === "up" && <ArrowUpRight className="h-3 w-3 text-nx-emerald-600" />}
              {kpi.trend === "down" && <ArrowDownRight className="h-3 w-3 text-nx-emerald-600" />}
            </div>
            <span className="text-[9px] text-muted-foreground/50">{kpi.sub}</span>
          </div>
        ))}
      </div>

      {/* ─── Resolution Breakdown Bar ─── */}
      <div className="rounded-lg border border-border bg-card p-4">
        <div className="flex items-center gap-3 mb-2">
          <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest">Today&apos;s Resolution</span>
        </div>
        <div className="flex h-2.5 rounded-sm overflow-hidden mb-2">
          <div className="bg-nx-emerald-500" style={{ width: `${(metrics.autoResolved / metrics.totalScreened) * 100}%` }} title="Auto-resolved" />
          <div className="bg-foreground" style={{ width: `${(metrics.humanResolved / metrics.totalScreened) * 100}%` }} title="Human-resolved" />
          <div className="bg-nx-amber-500" style={{ width: `${(metrics.pendingReview / metrics.totalScreened) * 100}%` }} title="Pending" />
        </div>
        <div className="flex items-center gap-5 text-[10px]">
          <span className="flex items-center gap-1.5"><span className="h-2 w-2 rounded-sm bg-nx-emerald-500" /> Auto-resolved: {metrics.autoResolved} ({Math.round((metrics.autoResolved / metrics.totalScreened) * 100)}%)</span>
          <span className="flex items-center gap-1.5"><span className="h-2 w-2 rounded-sm bg-foreground" /> Human-resolved: {metrics.humanResolved} ({Math.round((metrics.humanResolved / metrics.totalScreened) * 100)}%)</span>
          <span className="flex items-center gap-1.5"><span className="h-2 w-2 rounded-sm bg-nx-amber-500" /> Pending: {metrics.pendingReview} ({Math.round((metrics.pendingReview / metrics.totalScreened) * 100)}%)</span>
        </div>
      </div>

      {/* ─── Filter + Search ─── */}
      <div className="rounded-lg border border-border bg-card overflow-hidden">
        <div className="flex items-center justify-between px-4 py-2.5 border-b border-border gap-3">
          <div className="flex items-center gap-1 overflow-x-auto flex-1" style={{ scrollbarWidth: "none" }}>
            <button
              onClick={() => setFilterList("all")}
              className={`shrink-0 px-2.5 py-1 text-[10px] font-bold rounded transition-colors ${filterList === "all" ? "bg-foreground text-background" : "text-muted-foreground hover:bg-muted/50"}`}
            >
              All ({screeningAlerts.length})
            </button>
            {lists.map((list) => {
              const count = screeningAlerts.filter((a) => a.list === list).length;
              return (
                <button
                  key={list}
                  onClick={() => setFilterList(list)}
                  className={`shrink-0 px-2.5 py-1 text-[10px] font-bold rounded transition-colors ${filterList === list ? "bg-foreground text-background" : "text-muted-foreground hover:bg-muted/50"}`}
                >
                  {list} ({count})
                </button>
              );
            })}
          </div>
          <div className="relative w-48 shrink-0">
            <Search className="absolute left-2 top-1/2 h-3 w-3 -translate-y-1/2 text-muted-foreground/40" />
            <input
              type="text"
              placeholder="Search alerts..."
              className="h-7 w-full rounded border border-border bg-muted/20 pl-7 pr-3 text-[11px] placeholder:text-muted-foreground/35 focus:outline-none focus:ring-1 focus:ring-foreground/20 transition-colors"
            />
          </div>
        </div>

        {/* ─── Alert Table ─── */}
        <div className="overflow-x-auto">
          <table className="w-full text-[11px]">
            <thead>
              <tr className="border-b border-border bg-muted/20">
                <th className="w-8 px-3 py-2"><input type="checkbox" className="h-3 w-3 rounded" /></th>
                {["Entity", "List", "Match", "AI Assessment", "Confidence", "Pending", ""].map((h) => (
                  <th key={h} className="text-left font-bold text-muted-foreground uppercase tracking-wider px-4 py-2 whitespace-nowrap">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {filtered.map((alert) => {
                const risk = riskStyles[alert.riskTier];
                const ls = listStyle[alert.list] ?? { bg: "var(--nx-neutral-100)", fg: "var(--nx-neutral-600)" };
                const rec = recStyle[alert.aiRecommendation] ?? recStyle.inconclusive;
                const isSelected = selectedId === alert.id;
                const isChecked = checkedIds.has(alert.id);

                return (
                  <Fragment key={alert.id}>
                    <tr
                      className={`border-b border-border cursor-pointer group transition-colors ${isSelected ? "bg-muted/20" : "hover:bg-muted/10"}`}
                      style={{ borderLeft: `3px solid ${risk.fg}` }}
                      onClick={() => setSelectedId(isSelected ? null : alert.id)}
                    >
                      <td className="px-3 py-3" onClick={(e) => e.stopPropagation()}>
                        <input
                          type="checkbox"
                          className="h-3 w-3 rounded"
                          checked={isChecked}
                          onChange={() => toggleCheck(alert.id)}
                        />
                      </td>

                      {/* Entity */}
                      <td className="px-4 py-3 max-w-52">
                        <div className="text-[12px] font-semibold truncate">{alert.entityName}</div>
                        <div className="text-[10px] text-muted-foreground mt-0.5">
                          {alert.entityJurisdiction === "AE" ? "🇦🇪" : alert.entityJurisdiction === "SG" ? "🇸🇬" : alert.entityJurisdiction === "SA" ? "🇸🇦" : alert.entityJurisdiction === "VG" ? "🇻🇬" : alert.entityJurisdiction === "DE" ? "🇩🇪" : alert.entityJurisdiction === "NO" ? "🇳🇴" : alert.entityJurisdiction === "CH" ? "🇨🇭" : ""} {alert.entityType.replace("_", " ")}
                        </div>
                      </td>

                      {/* List */}
                      <td className="px-4 py-3">
                        <span className="text-[10px] font-bold px-1.5 py-0.5 rounded whitespace-nowrap" style={{ backgroundColor: ls.bg, color: ls.fg }}>
                          {alert.list}
                        </span>
                      </td>

                      {/* Match Score */}
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-2">
                          <div className="w-14 h-1.5 bg-muted rounded-full overflow-hidden">
                            <div
                              className="h-full rounded-full"
                              style={{
                                width: `${alert.matchScore * 100}%`,
                                backgroundColor: alert.matchScore >= 0.8 ? "var(--nx-rose-500)" : alert.matchScore >= 0.6 ? "var(--nx-amber-500)" : "var(--nx-neutral-400)",
                              }}
                            />
                          </div>
                          <span className="font-bold tabular-nums text-[11px]">{Math.round(alert.matchScore * 100)}%</span>
                        </div>
                      </td>

                      {/* AI Assessment */}
                      <td className="px-4 py-3">
                        <span className="text-[10px] font-bold" style={{ color: rec.color }}>{rec.label}</span>
                        <p className="text-[10px] text-muted-foreground truncate max-w-48 mt-0.5">{alert.aiSummary}</p>
                      </td>

                      {/* Confidence */}
                      <td className="px-4 py-3">
                        <ConfidenceBadge value={alert.aiConfidence * 100} />
                      </td>

                      {/* Time Pending */}
                      <td className="px-4 py-3">
                        <span className={`text-[11px] font-bold tabular-nums ${
                          alert.timePending.includes("h") && parseInt(alert.timePending) > 4 ? "text-nx-amber-600" : "text-muted-foreground"
                        }`}>{alert.timePending}</span>
                      </td>

                      {/* Expand */}
                      <td className="px-4 py-3">
                        <ChevronRight className={`h-3.5 w-3.5 text-muted-foreground/30 group-hover:text-foreground transition-all ${isSelected ? "rotate-90" : ""}`} />
                      </td>
                    </tr>

                    {/* ─── Expanded Detail ─── */}
                    {isSelected && (
                      <tr className="border-b border-border bg-muted/5">
                        <td colSpan={8} className="p-0">
                          <AlertDetailInline alert={alert} onViewEntity={() => router.push(`/entities/${alert.entityId}`)} />
                        </td>
                      </tr>
                    )}
                  </Fragment>
                );
              })}
            </tbody>
          </table>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between px-4 py-2.5 border-t border-border text-[10px] text-muted-foreground">
          <span>{filtered.length} alerts · Sorted by risk priority</span>
          {checkedIds.size > 0 && (
            <div className="flex items-center gap-2">
              <span className="font-bold text-foreground">{checkedIds.size} selected</span>
              <Button size="sm" className="h-6 text-[9px] font-semibold gap-1">
                <CheckCircle2 className="h-2.5 w-2.5" /> Batch: False Positive
              </Button>
              <Button size="sm" variant="outline" className="h-6 text-[9px] font-semibold gap-1">
                <ArrowUpRight className="h-2.5 w-2.5" /> Batch: Escalate
              </Button>
              <button onClick={() => setCheckedIds(new Set())} className="text-[9px] text-muted-foreground hover:text-foreground">
                Clear
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

/* ─── Inline Alert Detail ─── */

function AlertDetailInline({ alert, onViewEntity }: { alert: ScreeningAlert; onViewEntity: () => void }) {
  const rec = recStyle[alert.aiRecommendation] ?? recStyle.inconclusive;

  return (
    <div className="grid lg:grid-cols-12 gap-0 border-t border-border">
      {/* Left — AI Analysis + Match Comparison (8 cols) */}
      <div className="lg:col-span-8 p-5 border-r border-border space-y-4">
        {/* AI Assessment */}
        <div>
          <div className="text-[9px] font-bold text-muted-foreground uppercase tracking-widest mb-2">AI Assessment</div>
          <div className="flex items-center gap-2 mb-2">
            <Sparkles className="h-3 w-3 text-muted-foreground/40" />
            <span className="text-[12px] font-bold" style={{ color: rec.color }}>{rec.label}</span>
            <ConfidenceBadge value={alert.aiConfidence * 100} />
          </div>
          <p className="text-[11px] text-muted-foreground leading-relaxed">{alert.aiSummary}</p>

          {alert.whyNotAutoResolved && (
            <div className="mt-2 p-2.5 rounded bg-muted/30">
              <div className="text-[9px] font-bold text-muted-foreground uppercase tracking-widest mb-1">Why human review required</div>
              <ul className="space-y-0.5">
                {alert.whyNotAutoResolved.map((reason, i) => (
                  <li key={i} className="text-[10px] text-muted-foreground flex items-start gap-1.5">
                    <span className="text-muted-foreground/40 mt-0.5">•</span>{reason}
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>

        {/* Match Comparison */}
        {alert.matchComparison && (
          <div>
            <div className="text-[9px] font-bold text-muted-foreground uppercase tracking-widest mb-2">Match Comparison</div>
            <div className="grid grid-cols-2 gap-px bg-border rounded overflow-hidden text-[10px]">
              <div className="bg-card p-3">
                <div className="text-[8px] font-bold text-muted-foreground uppercase tracking-widest mb-2">Your Client</div>
                {Object.entries(alert.matchComparison.clientData).map(([k, v]) => (
                  <div key={k} className="flex justify-between py-0.5">
                    <span className="text-muted-foreground">{k}</span>
                    <span className="font-medium text-right">{v}</span>
                  </div>
                ))}
              </div>
              <div className="bg-card p-3">
                <div className="text-[8px] font-bold text-muted-foreground uppercase tracking-widest mb-2">List Entry</div>
                {Object.entries(alert.matchComparison.listData).map(([k, v]) => (
                  <div key={k} className="flex justify-between py-0.5">
                    <span className="text-muted-foreground">{k}</span>
                    <span className="font-medium text-right">{v}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Factor analysis */}
            {alert.matchComparison.factors && (
              <div className="mt-3 space-y-1.5">
                <div className="text-[8px] font-bold text-muted-foreground uppercase tracking-widest">Factor Analysis</div>
                {alert.matchComparison.factors.map((f) => (
                  <div key={f.field} className="flex items-center gap-2 text-[10px]">
                    <span className={`text-[9px] font-bold w-3 ${f.type === "match" ? "text-nx-emerald-600" : f.type === "no_match" ? "text-nx-rose-600" : "text-nx-amber-600"}`}>
                      {f.type === "match" ? "✓" : f.type === "no_match" ? "✗" : "~"}
                    </span>
                    <span className="w-24 text-muted-foreground font-medium">{f.field}</span>
                    <div className="flex-1 h-1 bg-muted rounded-full overflow-hidden max-w-32">
                      <div
                        className="h-full rounded-full"
                        style={{
                          width: `${f.score * 100}%`,
                          backgroundColor: f.score >= 0.7 ? "var(--nx-emerald-500)" : f.score >= 0.4 ? "var(--nx-amber-500)" : "var(--nx-neutral-300)",
                        }}
                      />
                    </div>
                    <span className="font-bold tabular-nums w-8 text-right">{Math.round(f.score * 100)}%</span>
                    <span className="text-muted-foreground/50 text-[9px]">{f.method}</span>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* AI Suggested Justification */}
        {alert.aiSuggestedJustification && (
          <div>
            <div className="text-[9px] font-bold text-muted-foreground uppercase tracking-widest mb-2">AI-Suggested Justification</div>
            <div className="p-3 rounded bg-muted/20 border border-border">
              <p className="text-[10px] text-muted-foreground leading-relaxed italic">&ldquo;{alert.aiSuggestedJustification}&rdquo;</p>
              <Button variant="outline" size="sm" className="h-6 text-[9px] font-semibold mt-2 gap-1">Use This</Button>
            </div>
          </div>
        )}
      </div>

      {/* Right — Entity Context + Actions (4 cols) */}
      <div className="lg:col-span-4 p-5 space-y-4">
        {/* Entity context */}
        {alert.entityContext && (
          <div>
            <div className="text-[9px] font-bold text-muted-foreground uppercase tracking-widest mb-2">Entity Context</div>
            <div className="space-y-1.5 text-[11px]">
              <div className="flex justify-between"><span className="text-muted-foreground">Client since</span><span className="font-medium">{alert.entityContext.clientSince}</span></div>
              <div className="flex justify-between"><span className="text-muted-foreground">Risk score</span><span className="font-bold tabular-nums">{alert.entityContext.riskScore}/100</span></div>
              <div className="flex justify-between"><span className="text-muted-foreground">DD Level</span><span className="font-bold">{alert.entityContext.cddLevel}</span></div>
              <div className="flex justify-between"><span className="text-muted-foreground">UBOs</span><span className="font-medium">{alert.entityContext.uboCount}</span></div>
              <div className="flex justify-between"><span className="text-muted-foreground">Open cases</span><span className="font-medium">{alert.entityContext.openCases}</span></div>
              <div className="flex justify-between"><span className="text-muted-foreground">Previous alerts</span><span className="font-bold">{alert.entityContext.previousAlerts}</span></div>
              <div className="flex justify-between"><span className="text-muted-foreground">Previous outcome</span><span className="font-medium text-[10px]">{alert.entityContext.previousAlertsOutcome}</span></div>
            </div>

            {alert.entityContext.previousAlerts > 5 && (
              <div className="mt-2 p-2 rounded bg-nx-amber-50 border border-nx-amber-200">
                <p className="text-[9px] font-bold text-nx-amber-700">
                  Pattern: {alert.entityContext.previousAlerts} prior alerts, {alert.entityContext.previousAlertsOutcome.toLowerCase()}
                </p>
              </div>
            )}
          </div>
        )}

        {/* Related alerts */}
        {alert.relatedAlerts && alert.relatedAlerts.length > 0 && (
          <div>
            <div className="text-[9px] font-bold text-muted-foreground uppercase tracking-widest mb-2">Related Alerts</div>
            {alert.relatedAlerts.map((ra) => (
              <div key={ra.id} className="flex items-center justify-between py-1.5 text-[10px]">
                <span className="font-mono font-medium">{ra.id}</span>
                <span className="text-muted-foreground">{ra.list}</span>
                <span className="font-bold tabular-nums">{Math.round(ra.matchScore * 100)}%</span>
              </div>
            ))}
          </div>
        )}

        {/* Disposition */}
        <div className="pt-3 border-t border-border">
          <div className="text-[9px] font-bold text-muted-foreground uppercase tracking-widest mb-2">Disposition</div>
          <div className="space-y-1.5">
            <Button className="w-full h-8 text-[10px] font-semibold gap-1.5 bg-nx-emerald-600 hover:bg-nx-emerald-700 text-white justify-start">
              <CheckCircle2 className="h-3 w-3" /> False Positive
            </Button>
            <Button variant="outline" className="w-full h-8 text-[10px] font-semibold gap-1.5 justify-start text-nx-rose-600 border-nx-rose-200 hover:bg-nx-rose-50">
              <XCircle className="h-3 w-3" /> True Positive
            </Button>
            <Button variant="outline" className="w-full h-8 text-[10px] font-semibold gap-1.5 justify-start">
              <ArrowUpRight className="h-3 w-3" /> Escalate
            </Button>
          </div>

          <Button variant="ghost" size="sm" className="w-full h-7 text-[9px] font-semibold gap-1 mt-2 text-muted-foreground" onClick={onViewEntity}>
            <Eye className="h-3 w-3" /> Open Entity 360° →
          </Button>
        </div>
      </div>
    </div>
  );
}
