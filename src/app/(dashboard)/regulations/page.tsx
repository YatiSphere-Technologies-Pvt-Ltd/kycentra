"use client";

import { useState, Fragment, useMemo } from "react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { ConfidenceBadge } from "@/components/shared";
import { rules, regulatoryChanges, jurisdictions, simulationResult } from "@/features/regulations/data/mock-data";
import {
  BookOpen, Search, Globe, ChevronRight, Plus,
  Download, ExternalLink, Activity, Eye,
  Settings, Sparkles, ArrowRight, Play, XCircle,
} from "lucide-react";

/* ─── Helpers ─── */

const catStyle: Record<string, { bg: string; fg: string }> = {
  "AML/KYC": { bg: "var(--nx-neutral-100)", fg: "var(--nx-neutral-700)" },
  Sanctions: { bg: "var(--nx-rose-50)", fg: "var(--nx-rose-700)" },
  Tax: { bg: "var(--nx-amber-50)", fg: "var(--nx-amber-700)" },
  "Data Privacy": { bg: "var(--nx-neutral-100)", fg: "var(--nx-neutral-600)" },
  ESG: { bg: "var(--nx-emerald-50)", fg: "var(--nx-emerald-700)" },
  "Consumer Protection": { bg: "var(--nx-neutral-100)", fg: "var(--nx-neutral-600)" },
};

const statusStyle: Record<string, { label: string; fg: string }> = {
  active: { label: "Active", fg: "var(--nx-emerald-600)" },
  draft: { label: "Draft", fg: "var(--nx-amber-600)" },
  deprecated: { label: "Deprecated", fg: "var(--nx-neutral-400)" },
  under_review: { label: "Under Review", fg: "var(--nx-amber-600)" },
};

const changeSeverity: Record<string, { label: string; fg: string }> = {
  high: { label: "High", fg: "var(--nx-rose-600)" },
  medium: { label: "Medium", fg: "var(--nx-amber-600)" },
  low: { label: "Low", fg: "var(--nx-neutral-500)" },
};

const changeStatusStyle: Record<string, { label: string; fg: string; bg?: string }> = {
  action_required: { label: "Action Required", fg: "var(--nx-rose-600)", bg: "var(--nx-rose-50)" },
  auto_action: { label: "Auto Action", fg: "var(--nx-emerald-600)" },
  under_review: { label: "Under Review", fg: "var(--nx-amber-600)" },
  informational: { label: "Info", fg: "var(--nx-neutral-500)" },
};

const flagMap: Record<string, string> = {
  US: "🇺🇸", GB: "🇬🇧", DE: "🇩🇪", EU: "🇪🇺", SG: "🇸🇬", HK: "🇭🇰", KY: "🇰🇾", CH: "🇨🇭",
  LU: "🇱🇺", JP: "🇯🇵", JE: "🇯🇪", NL: "🇳🇱", AE: "🇦🇪", GLOBAL: "🌐", AU: "🇦🇺", CA: "🇨🇦",
  FR: "🇫🇷", IE: "🇮🇪", IT: "🇮🇹", BM: "🇧🇲", VG: "🇻🇬", PA: "🇵🇦", IN: "🇮🇳", BR: "🇧🇷",
  SA: "🇸🇦", KR: "🇰🇷", MY: "🇲🇾", TH: "🇹🇭", PH: "🇵🇭", ZA: "🇿🇦", NG: "🇳🇬",
};

/* ─── Workflows/functions each rule impacts ─── */
const ruleImpactMap: Record<string, string[]> = {
  "AML/KYC": ["Client Onboarding", "Periodic Reviews", "Entity Screening", "Risk Assessment", "Document Verification"],
  Sanctions: ["Screening Workbench", "Batch Screening", "Entity 360°", "Alert Resolution", "Case Investigation"],
  Tax: ["Client Onboarding", "Periodic Reviews", "Reporting", "Document Collection"],
  "Data Privacy": ["Data Processing", "Client Portal", "AI Agent Processing", "Audit Trails", "Document Storage"],
  ESG: ["Onboarding", "Periodic Reviews", "Reporting", "Client Classification"],
  "Consumer Protection": ["Client Onboarding", "Product Suitability", "Client Classification", "Disclosure"],
};

/* ─── Page ─── */

export default function RegulationsPage() {
  const [filterCat, setFilterCat] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [expandedRule, setExpandedRule] = useState<string | null>(null);
  const [showSimulator, setShowSimulator] = useState(false);
  const [simInput, setSimInput] = useState("Require EDD for all FATF grey list jurisdictions");
  const [simRan, setSimRan] = useState(false);

  const categories = useMemo(() => [...new Set(rules.map((r) => r.category))], []);
  const actionRequired = regulatoryChanges.filter((c) => c.status === "action_required");

  const filteredRules = useMemo(() => rules.filter((r) => {
    if (filterCat !== "all" && r.category !== filterCat) return false;
    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      return r.title.toLowerCase().includes(q) || r.id.toLowerCase().includes(q) || r.regulation.toLowerCase().includes(q) || r.jurisdictionName.toLowerCase().includes(q);
    }
    return true;
  }), [filterCat, searchQuery]);

  // Stats by category
  const catStats = useMemo(() => categories.map((cat) => ({
    cat,
    count: rules.filter((r) => r.category === cat).length,
    entities: rules.filter((r) => r.category === cat).reduce((s, r) => Math.max(s, r.affectedEntities), 0),
  })), [categories]);

  return (
    <div className="space-y-5">
      {/* ─── Header ─── */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h1 className="text-lg font-bold tracking-tight">Regulatory Rules Engine</h1>
          <p className="text-[11px] text-muted-foreground mt-0.5">
            {rules.length} rules · {jurisdictions.length} jurisdictions · Powered by Regulatory Agent
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm" className="h-7 text-[10px] font-semibold gap-1.5" onClick={() => setShowSimulator(!showSimulator)}>
            <Play className="h-3 w-3" /> Simulator
          </Button>
          <Button variant="outline" size="sm" className="h-7 text-[10px] font-semibold gap-1.5">
            <Download className="h-3 w-3" /> Export
          </Button>
          <Button size="sm" className="h-7 text-[10px] font-semibold gap-1.5">
            <Plus className="h-3 w-3" /> Create Rule
          </Button>
        </div>
      </div>

      {/* ─── KPIs ─── */}
      <div className="grid grid-cols-3 lg:grid-cols-7 gap-px bg-border rounded-lg overflow-hidden">
        {[
          { label: "Total Rules", value: String(rules.length) },
          { label: "Active", value: String(rules.filter((r) => r.status === "active").length) },
          { label: "Draft", value: String(rules.filter((r) => r.status === "draft").length), warn: rules.some((r) => r.status === "draft") },
          { label: "Jurisdictions", value: String(jurisdictions.length) },
          { label: "Changes Pending", value: String(actionRequired.length), warn: actionRequired.length > 0 },
          { label: "Coverage", value: `${Math.round(jurisdictions.filter((j) => j.status === "full").length / jurisdictions.length * 100)}%` },
          { label: "Avg Confidence", value: `${Math.round(rules.reduce((s, r) => s + r.aiConfidence, 0) / rules.length * 100)}%` },
        ].map((kpi) => (
          <div key={kpi.label} className="bg-card p-3">
            <div className="text-[9px] font-bold text-muted-foreground uppercase tracking-widest mb-1">{kpi.label}</div>
            <div className={cn("text-[16px] font-extrabold tabular-nums tracking-tight", kpi.warn && "text-nx-amber-600")}>{kpi.value}</div>
          </div>
        ))}
      </div>

      {/* ─── Category Breakdown ─── */}
      <div className="grid grid-cols-3 lg:grid-cols-6 gap-px bg-border rounded-lg overflow-hidden">
        {catStats.map((cs) => {
          const sty = catStyle[cs.cat];
          return (
            <button
              key={cs.cat}
              onClick={() => setFilterCat(filterCat === cs.cat ? "all" : cs.cat)}
              className={cn("bg-card p-3 text-left hover:bg-muted/10 transition-colors", filterCat === cs.cat && "ring-1 ring-inset ring-foreground/20")}
            >
              <div className="flex items-center gap-1.5 mb-1">
                <span className="text-[9px] font-bold px-1 py-0.5 rounded" style={{ backgroundColor: sty?.bg, color: sty?.fg }}>{cs.cat}</span>
              </div>
              <div className="text-[16px] font-extrabold tabular-nums">{cs.count}</div>
              <div className="text-[9px] text-muted-foreground/50">rules</div>
            </button>
          );
        })}
      </div>

      {/* ─── Simulator (expandable) ─── */}
      {showSimulator && (
        <div className="rounded-lg border border-border bg-card overflow-hidden">
          <div className="flex items-center justify-between px-4 py-2.5 border-b border-border">
            <div className="flex items-center gap-2">
              <Play className="h-3.5 w-3.5 text-muted-foreground/40" />
              <span className="text-[12px] font-bold">Impact Simulator</span>
            </div>
            <button onClick={() => setShowSimulator(false)} className="text-[10px] text-muted-foreground hover:text-foreground">Close ×</button>
          </div>
          <div className="p-4 space-y-4">
            <div>
              <label className="text-[9px] font-bold text-muted-foreground uppercase tracking-widest block mb-1.5">
                Describe your policy change in plain English
              </label>
              <div className="flex gap-2">
                <input
                  type="text"
                  value={simInput}
                  onChange={(e) => { setSimInput(e.target.value); setSimRan(false); }}
                  className="flex-1 h-9 rounded border border-border bg-background px-3 text-[12px] focus:outline-none focus:ring-1 focus:ring-foreground/20"
                  placeholder="e.g., Lower beneficial ownership threshold from 25% to 10% for all US entities..."
                />
                <Button size="sm" className="h-9 text-[11px] font-semibold gap-1.5 px-4" onClick={() => setSimRan(true)}>
                  <Sparkles className="h-3 w-3" /> Run Simulation
                </Button>
              </div>
            </div>

            {simRan && (
              <div className="space-y-4">
                <div className="flex items-center gap-2">
                  <Sparkles className="h-3 w-3 text-muted-foreground/40" />
                  <span className="text-[10px] font-bold text-muted-foreground">AI Simulation Result</span>
                  <ConfidenceBadge value={Math.round(simulationResult.confidence * 100)} />
                </div>

                <div className="grid grid-cols-2 lg:grid-cols-6 gap-px bg-border rounded overflow-hidden">
                  <div className="bg-card p-3"><div className="text-[16px] font-extrabold tabular-nums">{simulationResult.totalAffected}</div><div className="text-[8px] font-bold text-muted-foreground uppercase tracking-widest">Entities affected</div></div>
                  <div className="bg-card p-3"><div className="text-[16px] font-extrabold tabular-nums">{simulationResult.analystHours.toLocaleString()}</div><div className="text-[8px] font-bold text-muted-foreground uppercase tracking-widest">Analyst hours</div></div>
                  <div className="bg-card p-3"><div className="text-[16px] font-extrabold tabular-nums">{simulationResult.weeksNeeded}</div><div className="text-[8px] font-bold text-muted-foreground uppercase tracking-widest">Weeks needed</div></div>
                  <div className="bg-card p-3"><div className="text-[16px] font-extrabold tabular-nums">{simulationResult.rulesToCreate}</div><div className="text-[8px] font-bold text-muted-foreground uppercase tracking-widest">Rules to create</div></div>
                  <div className="bg-card p-3"><div className="text-[16px] font-extrabold tabular-nums">{simulationResult.rulesToModify}</div><div className="text-[8px] font-bold text-muted-foreground uppercase tracking-widest">Rules to modify</div></div>
                  <div className="bg-card p-3"><div className="text-[16px] font-extrabold tabular-nums">{simulationResult.ddChanges.reduce((s, d) => s + d.count, 0)}</div><div className="text-[8px] font-bold text-muted-foreground uppercase tracking-widest">DD upgrades</div></div>
                </div>

                <div className="grid lg:grid-cols-2 gap-4">
                  {/* DD Changes */}
                  <div>
                    <div className="text-[9px] font-bold text-muted-foreground uppercase tracking-widest mb-2">Due Diligence Changes</div>
                    {simulationResult.ddChanges.map((d) => (
                      <div key={`${d.from}-${d.to}`} className="flex items-center justify-between py-1.5 text-[11px]">
                        <span className="text-muted-foreground">{d.from} → <strong className="text-foreground">{d.to}</strong></span>
                        <span className="font-bold tabular-nums">{d.count} entities</span>
                      </div>
                    ))}
                  </div>
                  {/* Jurisdictions */}
                  <div>
                    <div className="text-[9px] font-bold text-muted-foreground uppercase tracking-widest mb-2">By Jurisdiction</div>
                    {simulationResult.jurisdictions.map((j) => (
                      <div key={j.name} className="flex items-center justify-between py-1.5 text-[11px]">
                        <span>{j.flag} {j.name}</span>
                        <span className="font-bold tabular-nums">{j.count}</span>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="flex gap-2">
                  <Button variant="outline" size="sm" className="h-7 text-[10px] font-semibold gap-1">
                    <Download className="h-3 w-3" /> Export Report
                  </Button>
                  <Button size="sm" className="h-7 text-[10px] font-semibold gap-1">
                    <ArrowRight className="h-3 w-3" /> Deploy Changes
                  </Button>
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* ─── Regulatory Changes ─── */}
      <div className="rounded-lg border border-border bg-card overflow-hidden">
        <div className="flex items-center justify-between px-4 py-2.5 border-b border-border">
          <div className="flex items-center gap-2">
            <Activity className="h-3.5 w-3.5 text-muted-foreground/40" />
            <span className="text-[12px] font-bold">Regulatory Changes</span>
            {actionRequired.length > 0 && (
              <span className="flex h-4.5 min-w-4.5 items-center justify-center rounded bg-nx-rose-600 px-1 text-[9px] font-bold text-white tabular-nums">{actionRequired.length}</span>
            )}
          </div>
          <span className="text-[9px] text-muted-foreground">Monitoring {jurisdictions.length} jurisdictions · Last scan: 2h ago</span>
        </div>
        <table className="w-full text-[11px]">
          <thead>
            <tr className="border-b border-border bg-muted/20">
              {["Date", "Jurisdiction", "Change", "Category", "Impact", "Status", "Rules", "Entities", "Deadline"].map((h) => (
                <th key={h} className="text-left font-bold text-muted-foreground uppercase tracking-wider px-3 py-2 whitespace-nowrap">{h}</th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-border">
            {regulatoryChanges.map((change) => {
              const sev = changeSeverity[change.severity] ?? changeSeverity.low;
              const cst = changeStatusStyle[change.status];
              return (
                <tr
                  key={change.id}
                  className={cn("hover:bg-muted/10 transition-colors cursor-pointer", change.status === "action_required" && "bg-nx-rose-50/20")}
                  style={change.status === "action_required" ? { borderLeft: "3px solid var(--nx-rose-500)" } : undefined}
                >
                  <td className="px-3 py-2.5 tabular-nums text-muted-foreground whitespace-nowrap">{change.publishDate}</td>
                  <td className="px-3 py-2.5 whitespace-nowrap">{flagMap[change.jurisdictionCode] ?? ""} {change.jurisdiction}</td>
                  <td className="px-3 py-2.5 max-w-64">
                    <span className="font-medium line-clamp-1">{change.title}</span>
                    <p className="text-[9px] text-muted-foreground mt-0.5 line-clamp-1">{change.aiImpactAssessment}</p>
                  </td>
                  <td className="px-3 py-2.5">
                    <span className="text-[9px] font-bold px-1.5 py-0.5 rounded" style={{ backgroundColor: catStyle[change.category]?.bg, color: catStyle[change.category]?.fg }}>{change.category}</span>
                  </td>
                  <td className="px-3 py-2.5">
                    <span className="text-[9px] font-bold uppercase" style={{ color: sev.fg }}>{sev.label}</span>
                  </td>
                  <td className="px-3 py-2.5">
                    <span className="text-[9px] font-bold" style={{ color: cst.fg }}>{cst.label}</span>
                  </td>
                  <td className="px-3 py-2.5 tabular-nums font-medium">{change.affectedRules ?? "—"}</td>
                  <td className="px-3 py-2.5 tabular-nums text-muted-foreground">{change.affectedEntities.toLocaleString()}</td>
                  <td className="px-3 py-2.5">
                    {change.deadline ? (
                      <span className="text-[10px] font-bold text-nx-amber-600 tabular-nums">{change.deadline}</span>
                    ) : (
                      <span className="text-muted-foreground/30">—</span>
                    )}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* ─── Rule Library ─── */}
      <div className="rounded-lg border border-border bg-card overflow-hidden">
        <div className="flex items-center justify-between px-4 py-2.5 border-b border-border">
          <div className="flex items-center gap-2">
            <BookOpen className="h-3.5 w-3.5 text-muted-foreground/40" />
            <span className="text-[12px] font-bold">Rule Library</span>
            <span className="text-[10px] text-muted-foreground">{filteredRules.length} rules</span>
          </div>
        </div>

        {/* Filters */}
        <div className="flex items-center gap-3 px-4 py-2 border-b border-border">
          <div className="flex items-center gap-1 overflow-x-auto flex-1" style={{ scrollbarWidth: "none" }}>
            <button onClick={() => setFilterCat("all")} className={cn("shrink-0 px-2 py-1 text-[10px] font-bold rounded transition-colors", filterCat === "all" ? "bg-foreground text-background" : "text-muted-foreground hover:bg-muted/50")}>All</button>
            {categories.map((cat) => (
              <button key={cat} onClick={() => setFilterCat(filterCat === cat ? "all" : cat)} className={cn("shrink-0 px-2 py-1 text-[10px] font-bold rounded transition-colors", filterCat === cat ? "bg-foreground text-background" : "text-muted-foreground hover:bg-muted/50")}>{cat}</button>
            ))}
          </div>
          <div className="relative w-52 shrink-0">
            <Search className="absolute left-2 top-1/2 h-3 w-3 -translate-y-1/2 text-muted-foreground/40" />
            <input type="text" placeholder="Search rules, regulations, jurisdictions..." value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)}
              className="h-7 w-full rounded border border-border bg-muted/20 pl-7 pr-3 text-[11px] placeholder:text-muted-foreground/35 focus:outline-none focus:ring-1 focus:ring-foreground/20" />
          </div>
        </div>

        {/* Table */}
        <table className="w-full text-[11px]">
          <thead>
            <tr className="border-b border-border bg-muted/20">
              {["ID", "Rule", "Jurisdiction", "Category", "Regulation", "Status", "Entities", "DD", "Conf.", ""].map((h) => (
                <th key={h} className="text-left font-bold text-muted-foreground uppercase tracking-wider px-3 py-2 whitespace-nowrap">{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {filteredRules.map((rule) => {
              const cat = catStyle[rule.category];
              const st = statusStyle[rule.status];
              const isExpanded = expandedRule === rule.id;
              const impacts = ruleImpactMap[rule.category] ?? [];

              return (
                <Fragment key={rule.id}>
                  <tr
                    className={cn("border-b border-border cursor-pointer group transition-colors", isExpanded ? "bg-muted/15" : "hover:bg-muted/10")}
                    onClick={() => setExpandedRule(isExpanded ? null : rule.id)}
                  >
                    <td className="px-3 py-2.5 font-mono text-[10px] font-semibold text-muted-foreground">{rule.id}</td>
                    <td className="px-3 py-2.5 max-w-56"><span className="font-medium text-[12px] line-clamp-1">{rule.title}</span></td>
                    <td className="px-3 py-2.5 whitespace-nowrap">{flagMap[rule.jurisdiction] ?? ""} {rule.jurisdictionName}</td>
                    <td className="px-3 py-2.5"><span className="text-[9px] font-bold px-1.5 py-0.5 rounded whitespace-nowrap" style={{ backgroundColor: cat?.bg, color: cat?.fg }}>{rule.category}</span></td>
                    <td className="px-3 py-2.5 text-muted-foreground text-[10px] max-w-28 truncate">{rule.regulation}</td>
                    <td className="px-3 py-2.5"><span className="text-[9px] font-bold" style={{ color: st?.fg }}>{st?.label}</span></td>
                    <td className="px-3 py-2.5 tabular-nums font-medium">{rule.affectedEntities.toLocaleString()}</td>
                    <td className="px-3 py-2.5">
                      <div className="flex gap-0.5">{rule.ddLevels.slice(0, 2).map((d) => <span key={d} className="text-[8px] font-bold px-1 py-0.5 rounded bg-muted text-muted-foreground">{d}</span>)}</div>
                    </td>
                    <td className="px-3 py-2.5"><ConfidenceBadge value={Math.round(rule.aiConfidence * 100)} /></td>
                    <td className="px-3 py-2.5"><ChevronRight className={cn("h-3 w-3 text-muted-foreground/30 group-hover:text-foreground transition-all", isExpanded && "rotate-90")} /></td>
                  </tr>

                  {/* ─── Expanded Rule Detail ─── */}
                  {isExpanded && (
                    <tr className="border-b border-border bg-muted/5">
                      <td colSpan={10} className="p-0">
                        <div className="grid lg:grid-cols-12 divide-y lg:divide-y-0 lg:divide-x divide-border">
                          {/* Left — Rule logic + natural language (6 cols) */}
                          <div className="lg:col-span-6 p-5 space-y-4">
                            <div>
                              <div className="text-[9px] font-bold text-muted-foreground uppercase tracking-widest mb-2">Rule Logic (Natural Language)</div>
                              <div className="p-3 rounded bg-muted/20 border-l-2 border-foreground/20">
                                <p className="text-[11px] leading-relaxed font-mono">{rule.naturalLanguage}</p>
                              </div>
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                              <div>
                                <div className="text-[9px] font-bold text-muted-foreground uppercase tracking-widest mb-1.5">Entity Types</div>
                                <div className="flex flex-wrap gap-1">
                                  {rule.entityTypes.map((t) => <span key={t} className="text-[9px] font-semibold px-1.5 py-0.5 rounded bg-muted text-muted-foreground">{t}</span>)}
                                </div>
                              </div>
                              <div>
                                <div className="text-[9px] font-bold text-muted-foreground uppercase tracking-widest mb-1.5">DD Levels</div>
                                <div className="flex flex-wrap gap-1">
                                  {rule.ddLevels.map((d) => <span key={d} className="text-[9px] font-semibold px-1.5 py-0.5 rounded bg-muted text-muted-foreground">{d}</span>)}
                                </div>
                              </div>
                            </div>

                            {/* Source citation */}
                            <div>
                              <div className="text-[9px] font-bold text-muted-foreground uppercase tracking-widest mb-1.5">Regulatory Source</div>
                              <div className="flex items-center gap-2">
                                <span className="text-[11px] font-medium">{rule.regulation}</span>
                                <Button variant="outline" size="sm" className="h-5 text-[8px] font-semibold px-1.5 gap-1">
                                  <ExternalLink className="h-2 w-2" /> View Source
                                </Button>
                              </div>
                            </div>
                          </div>

                          {/* Middle — Platform impact (3 cols) */}
                          <div className="lg:col-span-3 p-5 space-y-4">
                            <div>
                              <div className="text-[9px] font-bold text-muted-foreground uppercase tracking-widest mb-2">Platform Impact</div>
                              <div className="space-y-2">
                                <div className="grid grid-cols-2 gap-px bg-border rounded overflow-hidden">
                                  <div className="bg-card p-2"><div className="text-[14px] font-extrabold tabular-nums">{rule.affectedEntities.toLocaleString()}</div><div className="text-[8px] font-bold text-muted-foreground uppercase">Entities</div></div>
                                  <div className="bg-card p-2"><div className="text-[14px] font-extrabold tabular-nums">{Math.round(rule.aiConfidence * 100)}%</div><div className="text-[8px] font-bold text-muted-foreground uppercase">Confidence</div></div>
                                </div>
                              </div>
                            </div>

                            {/* Workflows affected */}
                            <div>
                              <div className="text-[9px] font-bold text-muted-foreground uppercase tracking-widest mb-2">Workflows Affected</div>
                              <div className="space-y-1">
                                {impacts.map((wf) => (
                                  <div key={wf} className="flex items-center gap-1.5 text-[10px]">
                                    <span className="text-muted-foreground/40">→</span>
                                    <span className="text-muted-foreground">{wf}</span>
                                  </div>
                                ))}
                              </div>
                            </div>

                            {/* Agent mapping */}
                            <div>
                              <div className="text-[9px] font-bold text-muted-foreground uppercase tracking-widest mb-2">Agent Responsibility</div>
                              <div className="space-y-1 text-[10px]">
                                <div className="flex justify-between"><span className="text-muted-foreground">Enforced by</span><span className="font-medium">Regulatory Agent</span></div>
                                <div className="flex justify-between"><span className="text-muted-foreground">Screened by</span><span className="font-medium">Screening Agent</span></div>
                                <div className="flex justify-between"><span className="text-muted-foreground">Scored by</span><span className="font-medium">Risk Agent</span></div>
                              </div>
                            </div>
                          </div>

                          {/* Right — Metadata + Actions (3 cols) */}
                          <div className="lg:col-span-3 p-5 space-y-4">
                            <div>
                              <div className="text-[9px] font-bold text-muted-foreground uppercase tracking-widest mb-2">Metadata</div>
                              <div className="space-y-1.5 text-[11px]">
                                <div className="flex justify-between"><span className="text-muted-foreground">Version</span><span className="font-mono font-medium">{rule.version}</span></div>
                                <div className="flex justify-between"><span className="text-muted-foreground">Status</span><span className="font-bold" style={{ color: st?.fg }}>{st?.label}</span></div>
                                <div className="flex justify-between"><span className="text-muted-foreground">Modified</span><span className="tabular-nums">{rule.lastModifiedDate}</span></div>
                                <div className="flex justify-between"><span className="text-muted-foreground">By</span><span className="font-medium">{rule.lastModifiedBy}</span></div>
                              </div>
                            </div>

                            <div className="pt-3 border-t border-border space-y-1.5">
                              <div className="text-[9px] font-bold text-muted-foreground uppercase tracking-widest mb-2">Actions</div>
                              <Button variant="outline" size="sm" className="w-full h-7 text-[10px] font-semibold gap-1.5 justify-start"><Settings className="h-3 w-3" /> Edit Rule</Button>
                              <Button variant="outline" size="sm" className="w-full h-7 text-[10px] font-semibold gap-1.5 justify-start"><Eye className="h-3 w-3" /> View Affected Entities</Button>
                              <Button variant="outline" size="sm" className="w-full h-7 text-[10px] font-semibold gap-1.5 justify-start"><Play className="h-3 w-3" /> Simulate Change</Button>
                              <Button variant="outline" size="sm" className="w-full h-7 text-[10px] font-semibold gap-1.5 justify-start"><ExternalLink className="h-3 w-3" /> Source Regulation</Button>
                              <Button variant="outline" size="sm" className="w-full h-7 text-[10px] font-semibold gap-1.5 justify-start text-nx-rose-600"><XCircle className="h-3 w-3" /> Deprecate Rule</Button>
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
        <div className="px-4 py-2.5 border-t border-border text-[10px] text-muted-foreground flex items-center justify-between">
          <span>{filteredRules.length} rules · Powered by Regulatory Agent · claude-opus-4-6</span>
        </div>
      </div>

      {/* ─── Jurisdiction Coverage ─── */}
      <div className="rounded-lg border border-border bg-card overflow-hidden">
        <div className="flex items-center justify-between px-4 py-2.5 border-b border-border">
          <div className="flex items-center gap-2">
            <Globe className="h-3.5 w-3.5 text-muted-foreground/40" />
            <span className="text-[12px] font-bold">Jurisdiction Coverage</span>
            <span className="text-[10px] text-muted-foreground">{jurisdictions.length} jurisdictions</span>
          </div>
        </div>
        <table className="w-full text-[11px]">
          <thead>
            <tr className="border-b border-border bg-muted/20">
              {["Jurisdiction", "Coverage", "Rules", "Entities", "Status", "Last Update"].map((h) => (
                <th key={h} className="text-left font-bold text-muted-foreground uppercase tracking-wider px-4 py-2 whitespace-nowrap">{h}</th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-border">
            {jurisdictions.map((j) => (
              <tr key={j.code} className="hover:bg-muted/10 transition-colors cursor-pointer" onClick={() => { setFilterCat("all"); setSearchQuery(j.name); }}>
                <td className="px-4 py-2 font-medium">{j.flag} {j.name}</td>
                <td className="px-4 py-2">
                  <div className="flex items-center gap-2">
                    <div className="w-16 h-1 bg-muted rounded-full overflow-hidden">
                      <div className="h-full rounded-full" style={{ width: `${j.coverage * 100}%`, backgroundColor: j.coverage >= 0.95 ? "var(--nx-emerald-500)" : j.coverage >= 0.85 ? "var(--nx-amber-500)" : "var(--nx-rose-500)" }} />
                    </div>
                    <span className="font-bold tabular-nums text-[10px]">{Math.round(j.coverage * 100)}%</span>
                  </div>
                </td>
                <td className="px-4 py-2 tabular-nums font-bold">{j.rules}</td>
                <td className="px-4 py-2 tabular-nums text-muted-foreground">{j.entities.toLocaleString()}</td>
                <td className="px-4 py-2"><span className={cn("text-[9px] font-bold", j.status === "full" ? "text-nx-emerald-600" : "text-nx-amber-600")}>{j.status === "full" ? "Full" : "Partial"}</span></td>
                <td className="px-4 py-2 tabular-nums text-muted-foreground">{j.lastUpdate}</td>
              </tr>
            ))}
          </tbody>
        </table>
        <div className="px-4 py-2 border-t border-border text-[10px] text-muted-foreground">
          {jurisdictions.filter((j) => j.status === "full").length} full · {jurisdictions.filter((j) => j.status === "partial").length} partial · Click a jurisdiction to filter the rule library
        </div>
      </div>
    </div>
  );
}
