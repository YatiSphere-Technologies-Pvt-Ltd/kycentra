"use client";

import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { currentUser } from "@/features/workbench/data/mock-data";
import { getGreeting } from "@/lib/date-utils";
import { ConfidenceBadge } from "@/components/shared";
import { riskStyles } from "@/lib/styles";
import {
  ArrowRight,
  ArrowUpRight,
  ArrowDownRight,
  Minus,
  Users,
  Clock,
  AlertTriangle,
  Shield,
  FileText,
  Building,
  CheckCircle2,
  XCircle,
  TrendingUp,
  Calendar,
  ClipboardCheck,
} from "lucide-react";

/* ─── CLM Dashboard Data ─── */

// Portfolio overview — the core KYC/CLM metrics
const portfolioKPIs = [
  { label: "Total Clients", value: "12,847", icon: Building, trend: null, sub: "active entities" },
  { label: "Onboarding Pipeline", value: "34", icon: Users, trend: "up" as const, sub: "in progress" },
  { label: "Pending Reviews", value: "127", icon: ClipboardCheck, trend: "down" as const, sub: "periodic KYC" },
  { label: "Overdue Reviews", value: "3", icon: AlertTriangle, trend: "down" as const, sub: "action required" },
  { label: "Open Cases", value: "18", icon: FileText, trend: null, sub: "investigations" },
  { label: "Screening Alerts", value: "47", icon: Shield, trend: "down" as const, sub: "pending review" },
];

// Onboarding pipeline — what's in-flight
const onboardingPipeline = [
  { entity: "Helios Asset Management GmbH", type: "Corporate", jurisdiction: "🇩🇪 Germany", stage: "Data Collection", progress: 47, dueDate: "Mar 28", rm: "James Park", risk: "low" as const },
  { entity: "Nordic Capital Partners AS", type: "Fund", jurisdiction: "🇳🇴 Norway", stage: "Verification", progress: 72, dueDate: "Mar 26", rm: "Sarah Chen", risk: "medium" as const },
  { entity: "Apex Trading Group Ltd", type: "Corporate", jurisdiction: "🇬🇧 UK", stage: "Screening", progress: 85, dueDate: "Mar 25", rm: "Maria Lopez", risk: "high" as const },
  { entity: "Sakura Financial Services", type: "Corporate", jurisdiction: "🇯🇵 Japan", stage: "Risk Assessment", progress: 91, dueDate: "Mar 25", rm: "David Kim", risk: "low" as const },
  { entity: "Crown Bay Holdings Ltd", type: "Trust", jurisdiction: "🇯🇪 Jersey", stage: "Approval", progress: 95, dueDate: "Mar 24", rm: "James Park", risk: "high" as const },
];

// Client risk distribution
const riskDistribution = [
  { tier: "Critical", count: 12, pct: 0.1, color: "var(--nx-rose-700)" },
  { tier: "High", count: 187, pct: 1.5, color: "var(--nx-rose-500)" },
  { tier: "Medium", count: 1423, pct: 11.1, color: "var(--nx-amber-500)" },
  { tier: "Low", count: 8391, pct: 65.3, color: "var(--nx-emerald-600)" },
  { tier: "Minimal", count: 2834, pct: 22.1, color: "var(--nx-neutral-400)" },
];

// Upcoming reviews — periodic KYC that's due
const upcomingReviews = [
  { entity: "Meridian Capital Partners", type: "EDD", dueDate: "Apr 15", daysLeft: 22, risk: "high" as const, lastReview: "Apr 2025" },
  { entity: "Deutsche Industriebank AG", type: "CDD", dueDate: "Apr 1", daysLeft: 8, risk: "medium" as const, lastReview: "Apr 2025" },
  { entity: "Pacific Ventures Ltd", type: "CDD", dueDate: "Mar 30", daysLeft: 6, risk: "low" as const, lastReview: "Mar 2025" },
  { entity: "Volkov Intl. Trading Co.", type: "EDD", dueDate: "Mar 28", daysLeft: 4, risk: "high" as const, lastReview: "Sep 2025" },
  { entity: "Al-Rashid Construction", type: "EDD", dueDate: "Mar 26", daysLeft: 2, risk: "high" as const, lastReview: "Mar 2025" },
];

// Active cases
const activeCases = [
  { id: "FC-2026-0847", entity: "Meridian Capital Partners", type: "SAR", risk: "high" as const, status: "Pending Review", assignee: "SC", updated: "25m" },
  { id: "FC-2026-0842", entity: "Volkov Intl. Trading Co.", type: "Screening", risk: "critical" as const, status: "In Progress", assignee: "JP", updated: "1h" },
  { id: "FC-2026-0839", entity: "Horizon Trading LLC", type: "EDD", risk: "high" as const, status: "In Progress", assignee: "SC", updated: "2h" },
  { id: "FC-2026-0835", entity: "Nordic Shipping Consortium", type: "PEP", risk: "medium" as const, status: "Escalated", assignee: "ML", updated: "4h" },
];

// Screening summary — today's screening operations
const screeningSummary = {
  totalScreened: 955,
  autoResolved: 812,
  pendingReview: 47,
  truePositives: 3,
  falsePositiveRate: "18%",
  listsUpdated: "3h ago",
};

// Regulatory alerts
const regAlerts = [
  { title: "EU AMLA RTS on UBO Verification", jurisdiction: "🇪🇺 EU", impact: "High", deadline: "Jun 2026", rules: 12, entities: 4892 },
  { title: "OFAC SDN List Update — 47 new designations", jurisdiction: "🇺🇸 US", impact: "High", deadline: "Immediate", rules: 3, entities: 12847 },
];

// Compliance SLAs
const slaMetrics = [
  { label: "Onboarding SLA", value: "4.2h", target: "8h", status: "ok" as const },
  { label: "Alert Resolution", value: "12m", target: "4h", status: "ok" as const },
  { label: "Review Completion", value: "94%", target: "100%", status: "warn" as const },
  { label: "SAR Filing", value: "100%", target: "30d", status: "ok" as const },
];

const TrendIcon = ({ trend }: { trend: "up" | "down" | null }) => {
  if (trend === "up") return <ArrowUpRight className="h-3 w-3 text-nx-emerald-600" />;
  if (trend === "down") return <ArrowDownRight className="h-3 w-3 text-nx-emerald-600" />;
  return <Minus className="h-3 w-3 text-muted-foreground/30" />;
};

/* ─── Page ─── */

export default function DashboardPage() {
  const router = useRouter();

  return (
    <div className="space-y-5">
      {/* ─── Header ─── */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h1 className="text-lg font-bold tracking-tight">{getGreeting()}, {currentUser.name.split(" ")[0]}</h1>
          <p className="text-[11px] text-muted-foreground mt-0.5">
            Compliance overview for {new Date().toLocaleDateString("en-US", { weekday: "long", month: "long", day: "numeric", year: "numeric" })}
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Button size="sm" variant="outline" className="h-7 text-[11px] font-semibold gap-1.5" onClick={() => router.push("/onboarding")}>
            <Users className="h-3 w-3" /> New Onboarding
          </Button>
          <Button size="sm" className="h-7 text-[11px] font-semibold gap-1.5" onClick={() => router.push("/cases")}>
            <FileText className="h-3 w-3" /> Create Case
          </Button>
        </div>
      </div>

      {/* ─── Portfolio KPIs ─── */}
      <div className="grid grid-cols-3 lg:grid-cols-6 gap-px bg-border rounded-lg overflow-hidden">
        {portfolioKPIs.map((kpi) => {
          const Icon = kpi.icon;
          return (
            <div key={kpi.label} className="bg-card p-3.5">
              <div className="flex items-center gap-1.5 mb-2">
                <Icon className="h-3 w-3 text-muted-foreground/40" />
                <span className="text-[9px] font-bold text-muted-foreground uppercase tracking-widest">{kpi.label}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-[20px] font-extrabold tabular-nums tracking-tight">{kpi.value}</span>
                <TrendIcon trend={kpi.trend} />
              </div>
              <span className="text-[9px] text-muted-foreground/50 mt-0.5 block">{kpi.sub}</span>
            </div>
          );
        })}
      </div>

      {/* ─── Main grid: Onboarding + Screening + Risk ─── */}
      <div className="grid gap-5 lg:grid-cols-12">
        {/* Onboarding Pipeline — 7 cols */}
        <div className="lg:col-span-7 rounded-lg border border-border bg-card overflow-hidden">
          <div className="flex items-center justify-between px-4 py-2.5 border-b border-border">
            <div className="flex items-center gap-2">
              <Users className="h-3.5 w-3.5 text-muted-foreground/50" />
              <span className="text-[12px] font-bold">Onboarding Pipeline</span>
              <span className="text-[10px] text-muted-foreground tabular-nums">{onboardingPipeline.length} active</span>
            </div>
            <button onClick={() => router.push("/onboarding")} className="text-[10px] font-medium text-muted-foreground hover:text-foreground transition-colors">View all →</button>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-[11px]">
              <thead>
                <tr className="border-b border-border bg-muted/30">
                  <th className="text-left font-bold text-muted-foreground uppercase tracking-wider px-4 py-2">Entity</th>
                  <th className="text-left font-bold text-muted-foreground uppercase tracking-wider px-3 py-2 hidden sm:table-cell">Type</th>
                  <th className="text-left font-bold text-muted-foreground uppercase tracking-wider px-3 py-2">Stage</th>
                  <th className="text-left font-bold text-muted-foreground uppercase tracking-wider px-3 py-2">Progress</th>
                  <th className="text-left font-bold text-muted-foreground uppercase tracking-wider px-3 py-2 hidden md:table-cell">Due</th>
                  <th className="text-left font-bold text-muted-foreground uppercase tracking-wider px-3 py-2 hidden lg:table-cell">RM</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {onboardingPipeline.map((item) => (
                  <tr key={item.entity} className="hover:bg-muted/20 transition-colors cursor-pointer" onClick={() => router.push("/onboarding")}>
                    <td className="px-4 py-2.5">
                      <div className="font-semibold text-[12px] truncate max-w-48">{item.entity}</div>
                      <div className="text-muted-foreground text-[10px]">{item.jurisdiction}</div>
                    </td>
                    <td className="px-3 py-2.5 hidden sm:table-cell">
                      <span className="font-semibold text-muted-foreground">{item.type}</span>
                    </td>
                    <td className="px-3 py-2.5">
                      <span className="font-semibold">{item.stage}</span>
                    </td>
                    <td className="px-3 py-2.5">
                      <div className="flex items-center gap-2">
                        <div className="w-16 h-1.5 bg-muted rounded-full overflow-hidden">
                          <div className="h-full bg-foreground rounded-full" style={{ width: `${item.progress}%` }} />
                        </div>
                        <span className="font-bold tabular-nums text-[10px]">{item.progress}%</span>
                      </div>
                    </td>
                    <td className="px-3 py-2.5 hidden md:table-cell tabular-nums text-muted-foreground">{item.dueDate}</td>
                    <td className="px-3 py-2.5 hidden lg:table-cell text-muted-foreground">{item.rm}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Right column — Screening + Risk Distribution — 5 cols */}
        <div className="lg:col-span-5 space-y-5">
          {/* Screening summary */}
          <div className="rounded-lg border border-border bg-card overflow-hidden">
            <div className="flex items-center justify-between px-4 py-2.5 border-b border-border">
              <div className="flex items-center gap-2">
                <Shield className="h-3.5 w-3.5 text-muted-foreground/50" />
                <span className="text-[12px] font-bold">Screening Today</span>
              </div>
              <button onClick={() => router.push("/screening")} className="text-[10px] font-medium text-muted-foreground hover:text-foreground transition-colors">Open workbench →</button>
            </div>
            <div className="grid grid-cols-3 divide-x divide-border">
              <div className="p-3.5 text-center">
                <div className="text-[18px] font-extrabold tabular-nums">{screeningSummary.autoResolved}</div>
                <div className="text-[9px] font-bold text-nx-emerald-600 uppercase tracking-widest">Auto-Resolved</div>
              </div>
              <div className="p-3.5 text-center">
                <div className="text-[18px] font-extrabold tabular-nums">{screeningSummary.pendingReview}</div>
                <div className="text-[9px] font-bold text-nx-amber-600 uppercase tracking-widest">Pending</div>
              </div>
              <div className="p-3.5 text-center">
                <div className="text-[18px] font-extrabold tabular-nums">{screeningSummary.truePositives}</div>
                <div className="text-[9px] font-bold text-nx-rose-600 uppercase tracking-widest">True Matches</div>
              </div>
            </div>
            <div className="px-4 py-2 border-t border-border flex items-center justify-between text-[10px] text-muted-foreground">
              <span>FP Rate: <strong className="text-foreground">{screeningSummary.falsePositiveRate}</strong></span>
              <span>Total screened: <strong className="text-foreground tabular-nums">{screeningSummary.totalScreened}</strong></span>
              <span>Lists updated: {screeningSummary.listsUpdated}</span>
            </div>
          </div>

          {/* Risk distribution */}
          <div className="rounded-lg border border-border bg-card overflow-hidden">
            <div className="flex items-center justify-between px-4 py-2.5 border-b border-border">
              <div className="flex items-center gap-2">
                <TrendingUp className="h-3.5 w-3.5 text-muted-foreground/50" />
                <span className="text-[12px] font-bold">Portfolio Risk</span>
              </div>
            </div>
            <div className="p-4">
              {/* Stacked bar */}
              <div className="flex h-3 rounded-sm overflow-hidden mb-3">
                {riskDistribution.map((r) => (
                  <div key={r.tier} className="h-full" style={{ width: `${r.pct}%`, backgroundColor: r.color }} title={`${r.tier}: ${r.count}`} />
                ))}
              </div>
              <div className="flex items-center justify-between">
                {riskDistribution.map((r) => (
                  <div key={r.tier} className="text-center">
                    <div className="flex items-center gap-1 justify-center mb-0.5">
                      <div className="h-1.5 w-1.5 rounded-sm" style={{ backgroundColor: r.color }} />
                      <span className="text-[9px] font-bold text-muted-foreground uppercase">{r.tier}</span>
                    </div>
                    <span className="text-[12px] font-extrabold tabular-nums">{r.count.toLocaleString()}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ─── Second row: Cases + Reviews + Regulatory ─── */}
      <div className="grid gap-5 lg:grid-cols-12">
        {/* Active Cases — 5 cols */}
        <div className="lg:col-span-5 rounded-lg border border-border bg-card overflow-hidden">
          <div className="flex items-center justify-between px-4 py-2.5 border-b border-border">
            <div className="flex items-center gap-2">
              <FileText className="h-3.5 w-3.5 text-muted-foreground/50" />
              <span className="text-[12px] font-bold">Active Cases</span>
              <span className="flex h-4.5 min-w-4.5 items-center justify-center rounded bg-foreground px-1 text-[9px] font-bold text-background tabular-nums">{activeCases.length}</span>
            </div>
            <button onClick={() => router.push("/cases")} className="text-[10px] font-medium text-muted-foreground hover:text-foreground transition-colors">View all →</button>
          </div>
          <div className="divide-y divide-border">
            {activeCases.map((c) => {
              const risk = riskStyles[c.risk];
              return (
                <div key={c.id} className="px-4 py-2.5 hover:bg-muted/20 transition-colors cursor-pointer" onClick={() => router.push(`/cases/${c.id}`)}>
                  <div className="flex items-center justify-between">
                    <div className="min-w-0">
                      <div className="flex items-center gap-2">
                        <span className="text-[11px] font-bold tabular-nums text-foreground/70">{c.id}</span>
                        <span className="text-[9px] font-bold px-1.5 py-0.5 rounded" style={{ backgroundColor: `${risk.fg}15`, color: risk.fg }}>{c.type}</span>
                        <span className="text-[9px] font-bold uppercase" style={{ color: risk.fg }}>{risk.label}</span>
                      </div>
                      <p className="text-[12px] font-medium mt-0.5 truncate">{c.entity}</p>
                    </div>
                    <div className="shrink-0 text-right">
                      <span className="text-[10px] font-semibold text-muted-foreground">{c.status}</span>
                      <div className="text-[9px] text-muted-foreground/50 tabular-nums">{c.updated} ago</div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Upcoming Reviews — 4 cols */}
        <div className="lg:col-span-4 rounded-lg border border-border bg-card overflow-hidden">
          <div className="flex items-center justify-between px-4 py-2.5 border-b border-border">
            <div className="flex items-center gap-2">
              <Calendar className="h-3.5 w-3.5 text-muted-foreground/50" />
              <span className="text-[12px] font-bold">Upcoming Reviews</span>
            </div>
            <button onClick={() => router.push("/reviews")} className="text-[10px] font-medium text-muted-foreground hover:text-foreground transition-colors">View all →</button>
          </div>
          <div className="divide-y divide-border">
            {upcomingReviews.map((r) => {
              const risk = riskStyles[r.risk];
              const urgent = r.daysLeft <= 7;
              return (
                <div key={r.entity} className="px-4 py-2.5 hover:bg-muted/20 transition-colors cursor-pointer">
                  <div className="flex items-center justify-between">
                    <div className="min-w-0">
                      <p className="text-[12px] font-medium truncate">{r.entity}</p>
                      <div className="flex items-center gap-2 mt-0.5">
                        <span className="text-[9px] font-bold px-1.5 py-0.5 rounded" style={{ backgroundColor: `${risk.fg}15`, color: risk.fg }}>{r.type}</span>
                        <span className="text-[9px] text-muted-foreground">Last: {r.lastReview}</span>
                      </div>
                    </div>
                    <div className="shrink-0 text-right">
                      <span className={`text-[11px] font-bold tabular-nums ${urgent ? "text-nx-amber-600" : "text-muted-foreground"}`}>
                        {r.daysLeft}d left
                      </span>
                      <div className="text-[9px] text-muted-foreground/50">{r.dueDate}</div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Regulatory Alerts + SLAs — 3 cols */}
        <div className="lg:col-span-3 space-y-5">
          {/* Regulatory */}
          <div className="rounded-lg border border-border bg-card overflow-hidden">
            <div className="flex items-center justify-between px-4 py-2.5 border-b border-border">
              <span className="text-[12px] font-bold">Regulatory Changes</span>
            </div>
            {regAlerts.map((alert) => (
              <div key={alert.title} className="px-4 py-2.5 border-b border-border last:border-b-0 hover:bg-muted/20 transition-colors cursor-pointer" onClick={() => router.push("/regulations")}>
                <p className="text-[11px] font-semibold leading-snug">{alert.title}</p>
                <div className="flex items-center gap-2 mt-1 text-[9px] text-muted-foreground">
                  <span>{alert.jurisdiction}</span>
                  <span>·</span>
                  <span className="font-bold text-nx-amber-600">{alert.impact}</span>
                  <span>·</span>
                  <span>{alert.entities.toLocaleString()} entities</span>
                </div>
              </div>
            ))}
          </div>

          {/* SLA Compliance */}
          <div className="rounded-lg border border-border bg-card overflow-hidden">
            <div className="px-4 py-2.5 border-b border-border">
              <span className="text-[12px] font-bold">SLA Compliance</span>
            </div>
            <div className="divide-y divide-border">
              {slaMetrics.map((sla) => (
                <div key={sla.label} className="px-4 py-2 flex items-center justify-between">
                  <span className="text-[11px] text-muted-foreground">{sla.label}</span>
                  <div className="flex items-center gap-2">
                    <span className="text-[11px] font-bold tabular-nums">{sla.value}</span>
                    {sla.status === "ok" ? (
                      <CheckCircle2 className="h-3 w-3 text-nx-emerald-600" />
                    ) : (
                      <AlertTriangle className="h-3 w-3 text-nx-amber-600" />
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
