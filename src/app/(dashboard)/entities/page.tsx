"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import {
  Plus, Search, Download, Building2, ChevronRight, Shield,
  AlertTriangle, CheckCircle2, Clock, Users, Globe,
} from "lucide-react";

/* ─── Data ─── */

interface Entity {
  id: string;
  name: string;
  type: "Corporate" | "Individual" | "Fund" | "Trust";
  subType: string;
  jurisdiction: string;
  flag: string;
  risk: "critical" | "high" | "medium" | "low" | "minimal";
  riskScore: number;
  status: "active" | "under_review" | "restricted" | "onboarding" | "offboarding";
  ddLevel: "SDD" | "CDD" | "EDD" | "EDD+";
  alerts: number;
  cases: number;
  ubos: number;
  docs: { verified: number; total: number };
  lastReview: string;
  nextReview: string;
  clientSince: string;
  rm: string;
  products: string;
}

const entities: Entity[] = [
  { id: "ENT-2019-MC-8847", name: "Meridian Capital Partners Ltd", type: "Corporate", subType: "Fund Administrator", jurisdiction: "Cayman Islands", flag: "🇰🇾", risk: "high", riskScore: 72, status: "active", ddLevel: "EDD", alerts: 3, cases: 2, ubos: 4, docs: { verified: 10, total: 12 }, lastReview: "Mar 2025", nextReview: "Apr 15, 2026", clientSince: "Mar 2019", rm: "James Park", products: "Fund Admin, NAV" },
  { id: "ENT-VIT-001", name: "Volkov International Trading Co.", type: "Corporate", subType: "Import/Export", jurisdiction: "UAE", flag: "🇦🇪", risk: "critical", riskScore: 88, status: "under_review", ddLevel: "EDD", alerts: 3, cases: 1, ubos: 2, docs: { verified: 8, total: 10 }, lastReview: "Sep 2025", nextReview: "Sep 2026", clientSince: "Jun 2020", rm: "Maria Lopez", products: "Commodities Trading" },
  { id: "ENT-NSC-011", name: "Nordic Shipping Consortium", type: "Corporate", subType: "Shipping", jurisdiction: "Norway", flag: "🇳🇴", risk: "medium", riskScore: 48, status: "active", ddLevel: "CDD", alerts: 0, cases: 1, ubos: 3, docs: { verified: 9, total: 9 }, lastReview: "Jan 2026", nextReview: "Jan 2027", clientSince: "Aug 2018", rm: "David Kim", products: "Trade Finance" },
  { id: "ENT-EPF-012", name: "Evergreen Pacific Fund III", type: "Fund", subType: "Investment Fund", jurisdiction: "Singapore", flag: "🇸🇬", risk: "medium", riskScore: 42, status: "active", ddLevel: "CDD", alerts: 1, cases: 1, ubos: 2, docs: { verified: 8, total: 8 }, lastReview: "Mar 2026", nextReview: "Mar 2027", clientSince: "May 2021", rm: "Sarah Chen", products: "Fund Admin" },
  { id: "ENT-CBF-002", name: "Crescent Bay Financial Services Ltd", type: "Corporate", subType: "Financial Services", jurisdiction: "Singapore", flag: "🇸🇬", risk: "high", riskScore: 67, status: "under_review", ddLevel: "EDD", alerts: 1, cases: 0, ubos: 3, docs: { verified: 7, total: 9 }, lastReview: "Dec 2025", nextReview: "Jun 2026", clientSince: "Nov 2019", rm: "James Park", products: "Prime Brokerage" },
  { id: "ENT-HAM-005", name: "Helios Asset Management GmbH", type: "Corporate", subType: "Asset Manager", jurisdiction: "Germany", flag: "🇩🇪", risk: "low", riskScore: 28, status: "onboarding", ddLevel: "CDD", alerts: 0, cases: 0, ubos: 3, docs: { verified: 5, total: 9 }, lastReview: "—", nextReview: "Mar 2027", clientSince: "Mar 2026", rm: "James Park", products: "Fund Admin, Custody" },
  { id: "ENT-SCV-013", name: "Swiss Crypto Ventures AG", type: "Corporate", subType: "VASP", jurisdiction: "Switzerland", flag: "🇨🇭", risk: "high", riskScore: 71, status: "onboarding", ddLevel: "EDD", alerts: 0, cases: 1, ubos: 2, docs: { verified: 2, total: 14 }, lastReview: "—", nextReview: "Mar 2027", clientSince: "Mar 2026", rm: "Maria Lopez", products: "Custody, Trading" },
  { id: "ENT-ARC-003", name: "Al-Rashid Construction & Engineering", type: "Corporate", subType: "Construction", jurisdiction: "Saudi Arabia", flag: "🇸🇦", risk: "high", riskScore: 64, status: "active", ddLevel: "EDD", alerts: 1, cases: 1, ubos: 2, docs: { verified: 11, total: 12 }, lastReview: "Mar 2025", nextReview: "Mar 2026", clientSince: "Feb 2020", rm: "Maria Lopez", products: "Trade Finance" },
  { id: "ENT-CBH-014", name: "Crown Bay Holdings Ltd", type: "Trust", subType: "Private Trust", jurisdiction: "Jersey", flag: "🇯🇪", risk: "high", riskScore: 68, status: "active", ddLevel: "EDD+", alerts: 0, cases: 0, ubos: 1, docs: { verified: 16, total: 16 }, lastReview: "Mar 2026", nextReview: "Sep 2026", clientSince: "Jan 2018", rm: "James Park", products: "Wealth Management" },
  { id: "ENT-PRH-004", name: "Pacific Rim Holdings Ltd", type: "Corporate", subType: "Holding Company", jurisdiction: "BVI", flag: "🇻🇬", risk: "medium", riskScore: 48, status: "active", ddLevel: "CDD", alerts: 0, cases: 0, ubos: 2, docs: { verified: 8, total: 8 }, lastReview: "Mar 2026", nextReview: "Mar 2027", clientSince: "Apr 2019", rm: "David Kim", products: "Fund Admin" },
  { id: "ENT-DIB-015", name: "Deutsche Industriebank AG", type: "Corporate", subType: "Bank", jurisdiction: "Germany", flag: "🇩🇪", risk: "low", riskScore: 22, status: "active", ddLevel: "CDD", alerts: 0, cases: 0, ubos: 0, docs: { verified: 12, total: 12 }, lastReview: "Feb 2026", nextReview: "Feb 2027", clientSince: "Sep 2017", rm: "Sarah Chen", products: "Correspondent Banking" },
  { id: "ENT-NWP-006", name: "Nordic Wealth Partners AS", type: "Fund", subType: "Fund Manager", jurisdiction: "Norway", flag: "🇳🇴", risk: "low", riskScore: 31, status: "onboarding", ddLevel: "CDD", alerts: 0, cases: 0, ubos: 2, docs: { verified: 8, total: 10 }, lastReview: "—", nextReview: "Mar 2027", clientSince: "Mar 2026", rm: "Sarah Chen", products: "Prime Brokerage" },
  { id: "ENT-SKF-016", name: "Sakura Financial Services KK", type: "Corporate", subType: "Financial Services", jurisdiction: "Japan", flag: "🇯🇵", risk: "low", riskScore: 25, status: "active", ddLevel: "CDD", alerts: 0, cases: 0, ubos: 2, docs: { verified: 8, total: 8 }, lastReview: "Jan 2026", nextReview: "Jan 2027", clientSince: "Oct 2020", rm: "Sarah Chen", products: "Fund Admin" },
  { id: "ENT-ATG-017", name: "Apex Trading Group Ltd", type: "Corporate", subType: "Trading", jurisdiction: "United Kingdom", flag: "🇬🇧", risk: "medium", riskScore: 45, status: "onboarding", ddLevel: "CDD", alerts: 2, cases: 0, ubos: 2, docs: { verified: 11, total: 11 }, lastReview: "—", nextReview: "Mar 2027", clientSince: "Mar 2026", rm: "David Kim", products: "Trading, Clearing" },
  { id: "ENT-ARF-018", name: "Al-Rashid Financial Services LLC", type: "Corporate", subType: "Financial Services", jurisdiction: "UAE", flag: "🇦🇪", risk: "high", riskScore: 62, status: "onboarding", ddLevel: "EDD", alerts: 3, cases: 0, ubos: 3, docs: { verified: 7, total: 14 }, lastReview: "—", nextReview: "Mar 2027", clientSince: "Mar 2026", rm: "Maria Lopez", products: "Trading, Prime Brokerage" },
];

const riskColor: Record<string, string> = {
  critical: "var(--nx-rose-800)", high: "var(--nx-rose-600)", medium: "var(--nx-amber-600)", low: "var(--nx-emerald-600)", minimal: "var(--nx-neutral-400)",
};

const statusStyle: Record<string, { label: string; fg: string; bg: string }> = {
  active: { label: "Active", fg: "var(--nx-emerald-700)", bg: "var(--nx-emerald-50)" },
  under_review: { label: "Under Review", fg: "var(--nx-amber-700)", bg: "var(--nx-amber-50)" },
  restricted: { label: "Restricted", fg: "var(--nx-rose-700)", bg: "var(--nx-rose-50)" },
  onboarding: { label: "Onboarding", fg: "var(--nx-neutral-600)", bg: "var(--nx-neutral-100)" },
  offboarding: { label: "Offboarding", fg: "var(--nx-neutral-500)", bg: "var(--nx-neutral-100)" },
};

const ddStyle: Record<string, { bg: string; fg: string }> = {
  SDD: { bg: "var(--nx-emerald-50)", fg: "var(--nx-emerald-700)" },
  CDD: { bg: "var(--nx-neutral-100)", fg: "var(--nx-neutral-700)" },
  EDD: { bg: "var(--nx-amber-50)", fg: "var(--nx-amber-700)" },
  "EDD+": { bg: "var(--nx-rose-50)", fg: "var(--nx-rose-700)" },
};

/* ─── Page ─── */

export default function EntitiesPage() {
  const router = useRouter();
  const [search, setSearch] = useState("");
  const [filterRisk, setFilterRisk] = useState("all");
  const [filterStatus, setFilterStatus] = useState("all");
  const [filterType, setFilterType] = useState("all");

  const filtered = entities.filter((e) => {
    if (filterRisk !== "all" && e.risk !== filterRisk) return false;
    if (filterStatus !== "all" && e.status !== filterStatus) return false;
    if (filterType !== "all" && e.type !== filterType) return false;
    if (search) {
      const q = search.toLowerCase();
      return e.name.toLowerCase().includes(q) || e.id.toLowerCase().includes(q) || e.jurisdiction.toLowerCase().includes(q) || e.subType.toLowerCase().includes(q);
    }
    return true;
  });

  const totalAlerts = entities.reduce((s, e) => s + e.alerts, 0);
  const highRisk = entities.filter((e) => e.risk === "critical" || e.risk === "high").length;
  const onboarding = entities.filter((e) => e.status === "onboarding").length;
  const underReview = entities.filter((e) => e.status === "under_review").length;

  return (
    <div className="space-y-5">
      {/* ─── Header ─── */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h1 className="text-lg font-bold tracking-tight">Entities</h1>
          <p className="text-[11px] text-muted-foreground mt-0.5">
            {entities.length} entities · {highRisk} high/critical risk · {totalAlerts} open alerts · {onboarding} onboarding
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm" className="h-7 text-[10px] font-semibold gap-1.5"><Download className="h-3 w-3" /> Export</Button>
          <Button size="sm" className="h-7 text-[10px] font-semibold gap-1.5" onClick={() => router.push("/onboarding")}>
            <Plus className="h-3 w-3" /> New Client
          </Button>
        </div>
      </div>

      {/* ─── KPIs ─── */}
      <div className="grid grid-cols-3 lg:grid-cols-7 gap-px bg-border rounded-lg overflow-hidden">
        {[
          { label: "Total Entities", value: String(entities.length) },
          { label: "Active", value: String(entities.filter((e) => e.status === "active").length) },
          { label: "High/Critical", value: String(highRisk), warn: highRisk > 0 },
          { label: "Open Alerts", value: String(totalAlerts), warn: totalAlerts > 0 },
          { label: "Under Review", value: String(underReview), warn: underReview > 0 },
          { label: "Onboarding", value: String(onboarding) },
          { label: "Jurisdictions", value: String(new Set(entities.map((e) => e.jurisdiction)).size) },
        ].map((kpi) => (
          <div key={kpi.label} className="bg-card p-3">
            <div className="text-[9px] font-bold text-muted-foreground uppercase tracking-widest mb-1">{kpi.label}</div>
            <div className={cn("text-[16px] font-extrabold tabular-nums tracking-tight", kpi.warn && "text-nx-amber-600")}>{kpi.value}</div>
          </div>
        ))}
      </div>

      {/* ─── Filters ─── */}
      <div className="rounded-lg border border-border bg-card overflow-hidden">
        <div className="flex items-center gap-3 px-4 py-2.5 border-b border-border">
          <div className="relative flex-1 max-w-sm">
            <Search className="absolute left-2.5 top-1/2 h-3 w-3 -translate-y-1/2 text-muted-foreground/40" />
            <input type="text" placeholder="Search by name, ID, jurisdiction, type..." value={search} onChange={(e) => setSearch(e.target.value)} className="h-7 w-full rounded border border-border bg-muted/20 pl-7 pr-3 text-[11px] placeholder:text-muted-foreground/35 focus:outline-none focus:ring-1 focus:ring-foreground/20" />
          </div>
          <select value={filterRisk} onChange={(e) => setFilterRisk(e.target.value)} className="h-7 rounded border border-border bg-background px-2 text-[10px] font-semibold">
            <option value="all">All Risk</option>
            <option value="critical">Critical</option><option value="high">High</option><option value="medium">Medium</option><option value="low">Low</option>
          </select>
          <select value={filterStatus} onChange={(e) => setFilterStatus(e.target.value)} className="h-7 rounded border border-border bg-background px-2 text-[10px] font-semibold">
            <option value="all">All Status</option>
            <option value="active">Active</option><option value="under_review">Under Review</option><option value="onboarding">Onboarding</option>
          </select>
          <select value={filterType} onChange={(e) => setFilterType(e.target.value)} className="h-7 rounded border border-border bg-background px-2 text-[10px] font-semibold">
            <option value="all">All Types</option>
            <option value="Corporate">Corporate</option><option value="Fund">Fund</option><option value="Trust">Trust</option><option value="Individual">Individual</option>
          </select>
        </div>

        {/* ─── Table ─── */}
        <table className="w-full text-[11px]">
          <thead>
            <tr className="border-b border-border bg-muted/20">
              {["Entity", "Type", "Jurisdiction", "Risk", "DD", "Status", "Alerts", "Cases", "UBOs", "Docs", "Last Review", "RM"].map((h) => (
                <th key={h} className="text-left font-bold text-muted-foreground uppercase tracking-wider px-3 py-2 whitespace-nowrap">{h}</th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-border">
            {filtered.map((e) => {
              const st = statusStyle[e.status];
              const dd = ddStyle[e.ddLevel];
              return (
                <tr key={e.id} className="hover:bg-muted/10 transition-colors cursor-pointer" onClick={() => router.push(`/entities/${e.id}`)}>
                  <td className="px-3 py-2.5 max-w-52">
                    <div className="flex items-center gap-2">
                      <div className="h-1.5 w-1.5 rounded-full shrink-0" style={{ backgroundColor: riskColor[e.risk] }} />
                      <div className="min-w-0">
                        <div className="text-[12px] font-semibold truncate">{e.name}</div>
                        <div className="text-[9px] text-muted-foreground font-mono">{e.id}</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-3 py-2.5 text-muted-foreground">{e.subType}</td>
                  <td className="px-3 py-2.5 whitespace-nowrap">{e.flag} {e.jurisdiction}</td>
                  <td className="px-3 py-2.5">
                    <div className="flex items-center gap-1.5">
                      <span className="text-[9px] font-bold uppercase" style={{ color: riskColor[e.risk] }}>{e.risk}</span>
                      <span className="text-[9px] tabular-nums text-muted-foreground">{e.riskScore}</span>
                    </div>
                  </td>
                  <td className="px-3 py-2.5">
                    <span className="text-[9px] font-bold px-1.5 py-0.5 rounded" style={{ backgroundColor: dd.bg, color: dd.fg }}>{e.ddLevel}</span>
                  </td>
                  <td className="px-3 py-2.5">
                    <span className="text-[9px] font-bold px-1.5 py-0.5 rounded" style={{ color: st.fg, backgroundColor: st.bg }}>{st.label}</span>
                  </td>
                  <td className="px-3 py-2.5">
                    {e.alerts > 0 ? <span className="font-bold tabular-nums text-nx-amber-600">{e.alerts}</span> : <span className="text-muted-foreground/30">0</span>}
                  </td>
                  <td className="px-3 py-2.5 tabular-nums">{e.cases > 0 ? <span className="font-medium">{e.cases}</span> : <span className="text-muted-foreground/30">0</span>}</td>
                  <td className="px-3 py-2.5 tabular-nums font-medium">{e.ubos}</td>
                  <td className="px-3 py-2.5">
                    <span className="tabular-nums">{e.docs.verified}/{e.docs.total}</span>
                    {e.docs.verified < e.docs.total && <span className="text-[8px] text-nx-amber-600 ml-0.5">!</span>}
                  </td>
                  <td className="px-3 py-2.5 tabular-nums text-muted-foreground">{e.lastReview}</td>
                  <td className="px-3 py-2.5 text-muted-foreground text-[10px]">{e.rm}</td>
                </tr>
              );
            })}
          </tbody>
        </table>

        <div className="px-4 py-2.5 border-t border-border text-[10px] text-muted-foreground">
          {filtered.length} of {entities.length} entities · Click any row to view Entity 360°
        </div>
      </div>

      {/* ─── Risk Distribution ─── */}
      <div className="rounded-lg border border-border bg-card p-4">
        <div className="text-[9px] font-bold text-muted-foreground uppercase tracking-widest mb-3">Portfolio Risk Distribution</div>
        <div className="flex h-3 rounded-sm overflow-hidden mb-3">
          {(["critical", "high", "medium", "low", "minimal"] as const).map((tier) => {
            const count = entities.filter((e) => e.risk === tier).length;
            const pct = (count / entities.length) * 100;
            return pct > 0 ? <div key={tier} className="h-full" style={{ width: `${pct}%`, backgroundColor: riskColor[tier] }} title={`${tier}: ${count}`} /> : null;
          })}
        </div>
        <div className="flex items-center justify-between">
          {(["critical", "high", "medium", "low", "minimal"] as const).map((tier) => {
            const count = entities.filter((e) => e.risk === tier).length;
            return (
              <div key={tier} className="text-center">
                <div className="flex items-center gap-1 justify-center mb-0.5">
                  <div className="h-1.5 w-1.5 rounded-sm" style={{ backgroundColor: riskColor[tier] }} />
                  <span className="text-[9px] font-bold text-muted-foreground uppercase">{tier}</span>
                </div>
                <span className="text-[12px] font-extrabold tabular-nums">{count}</span>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
