"use client";

import { useState, Fragment, useMemo, useCallback } from "react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { ConfidenceBadge } from "@/components/shared";
import { rules as initialRules, regulatoryChanges, jurisdictions, simulationResult } from "@/features/regulations/data/mock-data";
import type { RegRule } from "@/features/regulations/types";
import {
  BookOpen, Search, Globe, ChevronRight, Plus, Download, ExternalLink,
  Activity, Eye, Settings, Sparkles, ArrowRight, Play,
  X, Save, CheckCircle2, Copy, Trash2,
} from "lucide-react";

/* ─── Style maps ─── */

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

const changeStatusStyle: Record<string, { label: string; fg: string }> = {
  action_required: { label: "Action Required", fg: "var(--nx-rose-600)" },
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

const workflowImpact: Record<string, string[]> = {
  "AML/KYC": ["Onboarding", "Reviews", "Screening", "Risk Assessment", "Document Verification"],
  Sanctions: ["Screening", "Batch Screening", "Entity 360°", "Alerts", "Investigation"],
  Tax: ["Onboarding", "Reviews", "Reporting", "Document Collection"],
  "Data Privacy": ["Data Processing", "Client Portal", "AI Agents", "Audit Trails"],
  ESG: ["Onboarding", "Reviews", "Reporting", "Classification"],
  "Consumer Protection": ["Onboarding", "Suitability", "Classification", "Disclosure"],
};

/* ─── Page ─── */

export default function RegulationsPage() {
  const [allRules, setAllRules] = useState(initialRules);
  const [filterCat, setFilterCat] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [expandedRule, setExpandedRule] = useState<string | null>(null);
  const [editingRule, setEditingRule] = useState<string | null>(null);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showSimulator, setShowSimulator] = useState(false);
  const [simInput, setSimInput] = useState("");
  const [simRan, setSimRan] = useState(false);

  // New rule form state
  const [newRule, setNewRule] = useState({ title: "", jurisdiction: "US", category: "AML/KYC" as string, regulation: "", naturalLanguage: "", entityTypes: "All", ddLevels: "CDD" });

  // Edit state for inline editing
  const [editDraft, setEditDraft] = useState<{ naturalLanguage: string; version: string } | null>(null);

  const categories = useMemo(() => [...new Set(allRules.map((r) => r.category))], [allRules]);
  const actionRequired = regulatoryChanges.filter((c) => c.status === "action_required");

  const filteredRules = useMemo(() => allRules.filter((r) => {
    if (filterCat !== "all" && r.category !== filterCat) return false;
    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      return r.title.toLowerCase().includes(q) || r.id.toLowerCase().includes(q) || r.regulation.toLowerCase().includes(q) || r.jurisdictionName.toLowerCase().includes(q);
    }
    return true;
  }), [allRules, filterCat, searchQuery]);

  const handleCreateRule = useCallback(() => {
    const id = `RULE-${Date.now().toString(36).toUpperCase()}`;
    const nr: RegRule = {
      id,
      title: newRule.title || "Untitled Rule",
      jurisdiction: newRule.jurisdiction,
      jurisdictionName: jurisdictions.find((j) => j.code === newRule.jurisdiction)?.name ?? newRule.jurisdiction,
      category: newRule.category as RegRule["category"],
      regulation: newRule.regulation || "Custom",
      status: "draft",
      version: "0.1",
      entityTypes: [newRule.entityTypes],
      ddLevels: [newRule.ddLevels],
      affectedEntities: 0,
      naturalLanguage: newRule.naturalLanguage || "Rule logic not yet defined.",
      aiConfidence: 0.5,
      lastModifiedBy: "Sarah Chen",
      lastModifiedDate: new Date().toISOString().split("T")[0],
    };
    setAllRules((prev) => [nr, ...prev]);
    setShowCreateModal(false);
    setNewRule({ title: "", jurisdiction: "US", category: "AML/KYC", regulation: "", naturalLanguage: "", entityTypes: "All", ddLevels: "CDD" });
    setExpandedRule(id);
  }, [newRule]);

  const handleSaveEdit = useCallback((ruleId: string) => {
    if (!editDraft) return;
    setAllRules((prev) => prev.map((r) => r.id === ruleId ? { ...r, naturalLanguage: editDraft.naturalLanguage, version: editDraft.version, lastModifiedBy: "Sarah Chen", lastModifiedDate: new Date().toISOString().split("T")[0] } : r));
    setEditingRule(null);
    setEditDraft(null);
  }, [editDraft]);

  const handleDeleteRule = useCallback((ruleId: string) => {
    setAllRules((prev) => prev.filter((r) => r.id !== ruleId));
    setExpandedRule(null);
  }, []);

  const handleDuplicateRule = useCallback((rule: RegRule) => {
    const id = `${rule.id}-COPY`;
    setAllRules((prev) => [{ ...rule, id, title: `${rule.title} (Copy)`, status: "draft" as const, version: "0.1" }, ...prev]);
    setExpandedRule(id);
  }, []);

  return (
    <div className="space-y-5">
      {/* ─── Header ─── */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h1 className="text-lg font-bold tracking-tight">Regulatory Rules Engine</h1>
          <p className="text-[11px] text-muted-foreground mt-0.5">{allRules.length} rules · {jurisdictions.length} jurisdictions · {actionRequired.length} changes pending</p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm" className="h-7 text-[10px] font-semibold gap-1.5" onClick={() => setShowSimulator(!showSimulator)}>
            <Play className="h-3 w-3" /> Impact Simulator
          </Button>
          <Button size="sm" className="h-7 text-[10px] font-semibold gap-1.5" onClick={() => setShowCreateModal(true)}>
            <Plus className="h-3 w-3" /> Create Rule
          </Button>
        </div>
      </div>

      {/* ─── Create Rule Modal ─── */}
      {showCreateModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50" onClick={() => setShowCreateModal(false)}>
          <div className="bg-card rounded-lg border border-border shadow-2xl w-full max-w-lg mx-4" onClick={(e) => e.stopPropagation()}>
            <div className="flex items-center justify-between px-5 py-3.5 border-b border-border">
              <h2 className="text-[14px] font-bold">Create New Rule</h2>
              <button onClick={() => setShowCreateModal(false)} className="text-muted-foreground hover:text-foreground"><X className="h-4 w-4" /></button>
            </div>
            <div className="p-5 space-y-4">
              <div>
                <label className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest block mb-1">Rule Title *</label>
                <input type="text" value={newRule.title} onChange={(e) => setNewRule((p) => ({ ...p, title: e.target.value }))} placeholder="e.g., Enhanced UBO Verification for Trusts" className="h-9 w-full rounded border border-border bg-background px-3 text-[12px] focus:outline-none focus:ring-1 focus:ring-foreground/20" />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest block mb-1">Jurisdiction *</label>
                  <select value={newRule.jurisdiction} onChange={(e) => setNewRule((p) => ({ ...p, jurisdiction: e.target.value }))} className="h-9 w-full rounded border border-border bg-background px-3 text-[12px] focus:outline-none focus:ring-1 focus:ring-foreground/20">
                    <option value="GLOBAL">Global</option>
                    {jurisdictions.map((j) => <option key={j.code} value={j.code}>{j.flag} {j.name}</option>)}
                  </select>
                </div>
                <div>
                  <label className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest block mb-1">Category *</label>
                  <select value={newRule.category} onChange={(e) => setNewRule((p) => ({ ...p, category: e.target.value }))} className="h-9 w-full rounded border border-border bg-background px-3 text-[12px] focus:outline-none focus:ring-1 focus:ring-foreground/20">
                    {categories.map((c) => <option key={c} value={c}>{c}</option>)}
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest block mb-1">Source Regulation</label>
                  <input type="text" value={newRule.regulation} onChange={(e) => setNewRule((p) => ({ ...p, regulation: e.target.value }))} placeholder="e.g., GwG §10-12" className="h-9 w-full rounded border border-border bg-background px-3 text-[12px] focus:outline-none focus:ring-1 focus:ring-foreground/20" />
                </div>
                <div>
                  <label className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest block mb-1">Entity Types</label>
                  <select value={newRule.entityTypes} onChange={(e) => setNewRule((p) => ({ ...p, entityTypes: e.target.value }))} className="h-9 w-full rounded border border-border bg-background px-3 text-[12px]">
                    <option>All</option><option>Legal Entity</option><option>Natural Person</option><option>Fund</option><option>Trust</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest block mb-1">Rule Logic (Plain English) *</label>
                <textarea
                  value={newRule.naturalLanguage}
                  onChange={(e) => setNewRule((p) => ({ ...p, naturalLanguage: e.target.value }))}
                  placeholder="WHEN a new client is onboarded in [jurisdiction]&#10;AND the entity type is [type]&#10;THEN require [documents/checks/approvals]..."
                  className="w-full rounded border border-border bg-background px-3 py-2 text-[12px] font-mono focus:outline-none focus:ring-1 focus:ring-foreground/20 min-h-28 resize-y"
                />
                <p className="text-[9px] text-muted-foreground/50 mt-1">Write in WHEN/AND/THEN format. The AI will translate to executable logic.</p>
              </div>

              <div className="flex items-center gap-2 p-3 rounded bg-muted/30 border border-border text-[10px]">
                <Sparkles className="h-3 w-3 text-muted-foreground/40 shrink-0" />
                <span className="text-muted-foreground">The Regulatory Agent will validate your rule against applicable regulations and estimate its impact on your portfolio.</span>
              </div>
            </div>
            <div className="flex items-center justify-between px-5 py-3.5 border-t border-border">
              <Button variant="ghost" size="sm" className="h-8 text-[11px] font-semibold" onClick={() => setShowCreateModal(false)}>Cancel</Button>
              <div className="flex gap-2">
                <Button variant="outline" size="sm" className="h-8 text-[11px] font-semibold gap-1" onClick={handleCreateRule}>
                  <Save className="h-3 w-3" /> Save as Draft
                </Button>
                <Button size="sm" className="h-8 text-[11px] font-semibold gap-1" onClick={handleCreateRule}>
                  <CheckCircle2 className="h-3 w-3" /> Create & Validate
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ─── KPIs ─── */}
      <div className="grid grid-cols-3 lg:grid-cols-6 gap-px bg-border rounded-lg overflow-hidden">
        {[
          { label: "Total Rules", value: String(allRules.length) },
          { label: "Active", value: String(allRules.filter((r) => r.status === "active").length) },
          { label: "Draft", value: String(allRules.filter((r) => r.status === "draft").length), warn: allRules.some((r) => r.status === "draft") },
          { label: "Jurisdictions", value: String(jurisdictions.length) },
          { label: "Changes Pending", value: String(actionRequired.length), warn: actionRequired.length > 0 },
          { label: "Avg Confidence", value: `${Math.round(allRules.reduce((s, r) => s + r.aiConfidence, 0) / allRules.length * 100)}%` },
        ].map((kpi) => (
          <div key={kpi.label} className="bg-card p-3">
            <div className="text-[9px] font-bold text-muted-foreground uppercase tracking-widest mb-1">{kpi.label}</div>
            <div className={cn("text-[16px] font-extrabold tabular-nums tracking-tight", kpi.warn && "text-nx-amber-600")}>{kpi.value}</div>
          </div>
        ))}
      </div>

      {/* ─── Simulator ─── */}
      {showSimulator && (
        <div className="rounded-lg border border-border bg-card overflow-hidden">
          <div className="flex items-center justify-between px-4 py-2.5 border-b border-border">
            <div className="flex items-center gap-2"><Play className="h-3.5 w-3.5 text-muted-foreground/40" /><span className="text-[12px] font-bold">Impact Simulator</span></div>
            <button onClick={() => setShowSimulator(false)} className="text-[10px] text-muted-foreground hover:text-foreground">Close ×</button>
          </div>
          <div className="p-4 space-y-4">
            <div>
              <label className="text-[9px] font-bold text-muted-foreground uppercase tracking-widest block mb-1.5">Describe your policy change</label>
              <div className="flex gap-2">
                <input type="text" value={simInput} onChange={(e) => { setSimInput(e.target.value); setSimRan(false); }} placeholder="e.g., Lower beneficial ownership threshold from 25% to 10% for US entities..." className="flex-1 h-9 rounded border border-border bg-background px-3 text-[12px] focus:outline-none focus:ring-1 focus:ring-foreground/20" />
                <Button size="sm" className="h-9 text-[11px] font-semibold gap-1.5 px-4" onClick={() => setSimRan(true)} disabled={!simInput.trim()}>
                  <Sparkles className="h-3 w-3" /> Simulate
                </Button>
              </div>
              <div className="flex gap-1.5 mt-2">
                {["Require EDD for FATF grey list jurisdictions", "Lower BO threshold to 10%", "Add crypto VASP requirements"].map((preset) => (
                  <button key={preset} onClick={() => { setSimInput(preset); setSimRan(false); }} className="text-[9px] font-medium text-muted-foreground hover:text-foreground px-2 py-1 rounded border border-border hover:bg-muted/30 transition-colors">{preset}</button>
                ))}
              </div>
            </div>
            {simRan && (
              <div className="space-y-3 pt-3 border-t border-border">
                <div className="flex items-center gap-2"><Sparkles className="h-3 w-3 text-muted-foreground/40" /><span className="text-[10px] font-bold text-muted-foreground">AI Simulation Result</span><ConfidenceBadge value={89} /></div>
                <div className="grid grid-cols-3 lg:grid-cols-6 gap-px bg-border rounded overflow-hidden">
                  {[
                    { v: String(simulationResult.totalAffected), l: "Entities" },
                    { v: simulationResult.analystHours.toLocaleString(), l: "Analyst hrs" },
                    { v: String(simulationResult.weeksNeeded), l: "Weeks" },
                    { v: String(simulationResult.rulesToCreate), l: "New rules" },
                    { v: String(simulationResult.rulesToModify), l: "Modified" },
                    { v: String(simulationResult.ddChanges.reduce((s, d) => s + d.count, 0)), l: "DD upgrades" },
                  ].map((s) => (
                    <div key={s.l} className="bg-card p-2.5"><div className="text-[14px] font-extrabold tabular-nums">{s.v}</div><div className="text-[8px] font-bold text-muted-foreground uppercase tracking-widest">{s.l}</div></div>
                  ))}
                </div>
                <div className="flex gap-2">
                  <Button variant="outline" size="sm" className="h-7 text-[10px] font-semibold gap-1"><Download className="h-3 w-3" /> Export</Button>
                  <Button size="sm" className="h-7 text-[10px] font-semibold gap-1" onClick={() => { setShowCreateModal(true); setNewRule((p) => ({ ...p, naturalLanguage: simInput })); setShowSimulator(false); }}>
                    <Plus className="h-3 w-3" /> Create Rule from This
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
            {actionRequired.length > 0 && <span className="flex h-4.5 min-w-4.5 items-center justify-center rounded bg-nx-rose-600 px-1 text-[9px] font-bold text-white tabular-nums">{actionRequired.length}</span>}
          </div>
        </div>
        <table className="w-full text-[11px]">
          <thead><tr className="border-b border-border bg-muted/20">
            {["Date", "Jurisdiction", "Change", "Category", "Impact", "Status", "Entities", ""].map((h) => (
              <th key={h} className="text-left font-bold text-muted-foreground uppercase tracking-wider px-3 py-2 whitespace-nowrap">{h}</th>
            ))}
          </tr></thead>
          <tbody className="divide-y divide-border">
            {regulatoryChanges.slice(0, 6).map((change) => {
              const sev = changeSeverity[change.severity] ?? changeSeverity.low;
              const cst = changeStatusStyle[change.status];
              return (
                <tr key={change.id} className={cn("hover:bg-muted/10 transition-colors", change.status === "action_required" && "bg-nx-rose-50/20")} style={change.status === "action_required" ? { borderLeft: "3px solid var(--nx-rose-500)" } : undefined}>
                  <td className="px-3 py-2.5 tabular-nums text-muted-foreground whitespace-nowrap">{change.publishDate}</td>
                  <td className="px-3 py-2.5 whitespace-nowrap">{flagMap[change.jurisdictionCode] ?? ""} {change.jurisdiction}</td>
                  <td className="px-3 py-2.5 max-w-56"><span className="font-medium line-clamp-1">{change.title}</span></td>
                  <td className="px-3 py-2.5"><span className="text-[9px] font-bold px-1.5 py-0.5 rounded" style={{ backgroundColor: catStyle[change.category]?.bg, color: catStyle[change.category]?.fg }}>{change.category}</span></td>
                  <td className="px-3 py-2.5"><span className="text-[9px] font-bold uppercase" style={{ color: sev.fg }}>{sev.label}</span></td>
                  <td className="px-3 py-2.5"><span className="text-[9px] font-bold" style={{ color: cst.fg }}>{cst.label}</span></td>
                  <td className="px-3 py-2.5 tabular-nums text-muted-foreground">{change.affectedEntities.toLocaleString()}</td>
                  <td className="px-3 py-2.5">
                    {change.status === "action_required" && (
                      <Button size="sm" className="h-5 text-[9px] font-semibold px-2 gap-1" onClick={() => { setShowCreateModal(true); setNewRule((p) => ({ ...p, title: `Response: ${change.title}`, naturalLanguage: change.aiImpactAssessment, jurisdiction: change.jurisdictionCode, category: change.category })); }}>
                        <ArrowRight className="h-2.5 w-2.5" /> Act
                      </Button>
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
          <div className="flex items-center gap-2"><BookOpen className="h-3.5 w-3.5 text-muted-foreground/40" /><span className="text-[12px] font-bold">Rule Library</span><span className="text-[10px] text-muted-foreground">{filteredRules.length} rules</span></div>
        </div>

        <div className="flex items-center gap-3 px-4 py-2 border-b border-border">
          <div className="flex items-center gap-1 overflow-x-auto flex-1" style={{ scrollbarWidth: "none" }}>
            <button onClick={() => setFilterCat("all")} className={cn("shrink-0 px-2 py-1 text-[10px] font-bold rounded transition-colors", filterCat === "all" ? "bg-foreground text-background" : "text-muted-foreground hover:bg-muted/50")}>All</button>
            {categories.map((cat) => (
              <button key={cat} onClick={() => setFilterCat(filterCat === cat ? "all" : cat)} className={cn("shrink-0 px-2 py-1 text-[10px] font-bold rounded transition-colors", filterCat === cat ? "bg-foreground text-background" : "text-muted-foreground hover:bg-muted/50")}>{cat}</button>
            ))}
          </div>
          <div className="relative w-52 shrink-0">
            <Search className="absolute left-2 top-1/2 h-3 w-3 -translate-y-1/2 text-muted-foreground/40" />
            <input type="text" placeholder="Search rules, regulations..." value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} className="h-7 w-full rounded border border-border bg-muted/20 pl-7 pr-3 text-[11px] placeholder:text-muted-foreground/35 focus:outline-none focus:ring-1 focus:ring-foreground/20" />
          </div>
        </div>

        <table className="w-full text-[11px]">
          <thead><tr className="border-b border-border bg-muted/20">
            {["ID", "Rule", "Jurisdiction", "Category", "Regulation", "Status", "Entities", "Conf.", ""].map((h) => (
              <th key={h} className="text-left font-bold text-muted-foreground uppercase tracking-wider px-3 py-2 whitespace-nowrap">{h}</th>
            ))}
          </tr></thead>
          <tbody>
            {filteredRules.slice(0, 25).map((rule) => {
              const cat = catStyle[rule.category];
              const st = statusStyle[rule.status];
              const isExpanded = expandedRule === rule.id;
              const isEditing = editingRule === rule.id;

              return (
                <Fragment key={rule.id}>
                  <tr className={cn("border-b border-border cursor-pointer group transition-colors", isExpanded ? "bg-muted/15" : "hover:bg-muted/10")} onClick={() => { setExpandedRule(isExpanded ? null : rule.id); setEditingRule(null); setEditDraft(null); }}>
                    <td className="px-3 py-2.5 font-mono text-[10px] font-semibold text-muted-foreground">{rule.id}</td>
                    <td className="px-3 py-2.5 max-w-52"><span className="font-medium text-[12px] line-clamp-1">{rule.title}</span></td>
                    <td className="px-3 py-2.5 whitespace-nowrap">{flagMap[rule.jurisdiction] ?? ""} {rule.jurisdictionName}</td>
                    <td className="px-3 py-2.5"><span className="text-[9px] font-bold px-1.5 py-0.5 rounded whitespace-nowrap" style={{ backgroundColor: cat?.bg, color: cat?.fg }}>{rule.category}</span></td>
                    <td className="px-3 py-2.5 text-muted-foreground text-[10px] max-w-28 truncate">{rule.regulation}</td>
                    <td className="px-3 py-2.5"><span className="text-[9px] font-bold" style={{ color: st?.fg }}>{st?.label}</span></td>
                    <td className="px-3 py-2.5 tabular-nums font-medium">{rule.affectedEntities.toLocaleString()}</td>
                    <td className="px-3 py-2.5"><ConfidenceBadge value={Math.round(rule.aiConfidence * 100)} /></td>
                    <td className="px-3 py-2.5"><ChevronRight className={cn("h-3 w-3 text-muted-foreground/30 group-hover:text-foreground transition-all", isExpanded && "rotate-90")} /></td>
                  </tr>

                  {isExpanded && (
                    <tr className="border-b border-border bg-muted/5">
                      <td colSpan={9} className="p-0">
                        <div className="grid lg:grid-cols-12 divide-y lg:divide-y-0 lg:divide-x divide-border">
                          {/* Rule logic — editable */}
                          <div className="lg:col-span-6 p-5 space-y-4">
                            <div>
                              <div className="flex items-center justify-between mb-2">
                                <span className="text-[9px] font-bold text-muted-foreground uppercase tracking-widest">Rule Logic</span>
                                {!isEditing ? (
                                  <Button variant="ghost" size="sm" className="h-5 text-[9px] font-semibold px-2 gap-1" onClick={(e) => { e.stopPropagation(); setEditingRule(rule.id); setEditDraft({ naturalLanguage: rule.naturalLanguage, version: rule.version }); }}>
                                    <Settings className="h-2.5 w-2.5" /> Edit
                                  </Button>
                                ) : (
                                  <div className="flex gap-1">
                                    <Button size="sm" className="h-5 text-[9px] font-semibold px-2 gap-1" onClick={(e) => { e.stopPropagation(); handleSaveEdit(rule.id); }}>
                                      <Save className="h-2.5 w-2.5" /> Save
                                    </Button>
                                    <Button variant="ghost" size="sm" className="h-5 text-[9px] font-semibold px-2" onClick={(e) => { e.stopPropagation(); setEditingRule(null); setEditDraft(null); }}>Cancel</Button>
                                  </div>
                                )}
                              </div>
                              {isEditing && editDraft ? (
                                <textarea
                                  value={editDraft.naturalLanguage}
                                  onChange={(e) => setEditDraft((p) => p ? { ...p, naturalLanguage: e.target.value } : p)}
                                  onClick={(e) => e.stopPropagation()}
                                  className="w-full rounded border border-border bg-background px-3 py-2 text-[11px] font-mono focus:outline-none focus:ring-1 focus:ring-foreground/20 min-h-24 resize-y"
                                />
                              ) : (
                                <div className="p-3 rounded bg-muted/20 border-l-2 border-foreground/20">
                                  <p className="text-[11px] leading-relaxed font-mono">{rule.naturalLanguage}</p>
                                </div>
                              )}
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                              <div><span className="text-[9px] font-bold text-muted-foreground uppercase tracking-widest block mb-1.5">Entity Types</span><div className="flex flex-wrap gap-1">{rule.entityTypes.map((t) => <span key={t} className="text-[9px] font-semibold px-1.5 py-0.5 rounded bg-muted text-muted-foreground">{t}</span>)}</div></div>
                              <div><span className="text-[9px] font-bold text-muted-foreground uppercase tracking-widest block mb-1.5">DD Levels</span><div className="flex flex-wrap gap-1">{rule.ddLevels.map((d) => <span key={d} className="text-[9px] font-semibold px-1.5 py-0.5 rounded bg-muted text-muted-foreground">{d}</span>)}</div></div>
                            </div>
                          </div>

                          {/* Impact */}
                          <div className="lg:col-span-3 p-5 space-y-4">
                            <div>
                              <span className="text-[9px] font-bold text-muted-foreground uppercase tracking-widest block mb-2">Platform Impact</span>
                              <div className="grid grid-cols-2 gap-px bg-border rounded overflow-hidden">
                                <div className="bg-card p-2"><div className="text-[14px] font-extrabold tabular-nums">{rule.affectedEntities.toLocaleString()}</div><div className="text-[8px] font-bold text-muted-foreground uppercase">Entities</div></div>
                                <div className="bg-card p-2"><div className="text-[14px] font-extrabold tabular-nums">{Math.round(rule.aiConfidence * 100)}%</div><div className="text-[8px] font-bold text-muted-foreground uppercase">Confidence</div></div>
                              </div>
                            </div>
                            <div>
                              <span className="text-[9px] font-bold text-muted-foreground uppercase tracking-widest block mb-2">Workflows Affected</span>
                              {(workflowImpact[rule.category] ?? []).map((wf) => <div key={wf} className="flex items-center gap-1.5 text-[10px] py-0.5"><span className="text-muted-foreground/40">→</span><span className="text-muted-foreground">{wf}</span></div>)}
                            </div>
                            <div>
                              <span className="text-[9px] font-bold text-muted-foreground uppercase tracking-widest block mb-1.5">Metadata</span>
                              <div className="space-y-1 text-[10px]">
                                <div className="flex justify-between"><span className="text-muted-foreground">Version</span><span className="font-mono">{rule.version}</span></div>
                                <div className="flex justify-between"><span className="text-muted-foreground">Modified</span><span className="tabular-nums">{rule.lastModifiedDate}</span></div>
                                <div className="flex justify-between"><span className="text-muted-foreground">By</span><span>{rule.lastModifiedBy}</span></div>
                              </div>
                            </div>
                          </div>

                          {/* Actions */}
                          <div className="lg:col-span-3 p-5 space-y-3">
                            <span className="text-[9px] font-bold text-muted-foreground uppercase tracking-widest block mb-1">Actions</span>
                            <Button variant="outline" size="sm" className="w-full h-7 text-[10px] font-semibold gap-1.5 justify-start" onClick={(e) => { e.stopPropagation(); setEditingRule(rule.id); setEditDraft({ naturalLanguage: rule.naturalLanguage, version: rule.version }); }}><Settings className="h-3 w-3" /> Edit Rule</Button>
                            <Button variant="outline" size="sm" className="w-full h-7 text-[10px] font-semibold gap-1.5 justify-start" onClick={(e) => { e.stopPropagation(); handleDuplicateRule(rule); }}><Copy className="h-3 w-3" /> Duplicate</Button>
                            <Button variant="outline" size="sm" className="w-full h-7 text-[10px] font-semibold gap-1.5 justify-start" onClick={(e) => { e.stopPropagation(); setShowSimulator(true); setSimInput(`Change rule ${rule.id}: ${rule.title}`); }}><Play className="h-3 w-3" /> Simulate Change</Button>
                            <Button variant="outline" size="sm" className="w-full h-7 text-[10px] font-semibold gap-1.5 justify-start"><Eye className="h-3 w-3" /> View Entities</Button>
                            <Button variant="outline" size="sm" className="w-full h-7 text-[10px] font-semibold gap-1.5 justify-start"><ExternalLink className="h-3 w-3" /> Source Regulation</Button>
                            <Button variant="outline" size="sm" className="w-full h-7 text-[10px] font-semibold gap-1.5 justify-start text-nx-rose-600" onClick={(e) => { e.stopPropagation(); handleDeleteRule(rule.id); }}><Trash2 className="h-3 w-3" /> Delete Rule</Button>
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
        <div className="px-4 py-2.5 border-t border-border text-[10px] text-muted-foreground">{filteredRules.length} rules · Regulatory Agent · claude-opus-4-6</div>
      </div>

      {/* ─── Jurisdiction Coverage ─── */}
      <div className="rounded-lg border border-border bg-card overflow-hidden">
        <div className="flex items-center justify-between px-4 py-2.5 border-b border-border">
          <div className="flex items-center gap-2"><Globe className="h-3.5 w-3.5 text-muted-foreground/40" /><span className="text-[12px] font-bold">Jurisdictions</span></div>
        </div>
        <table className="w-full text-[11px]">
          <thead><tr className="border-b border-border bg-muted/20">
            {["Jurisdiction", "Coverage", "Rules", "Entities", "Status", "Updated"].map((h) => (
              <th key={h} className="text-left font-bold text-muted-foreground uppercase tracking-wider px-4 py-2 whitespace-nowrap">{h}</th>
            ))}
          </tr></thead>
          <tbody className="divide-y divide-border">
            {jurisdictions.slice(0, 15).map((j) => (
              <tr key={j.code} className="hover:bg-muted/10 transition-colors cursor-pointer" onClick={() => { setFilterCat("all"); setSearchQuery(j.name); }}>
                <td className="px-4 py-2 font-medium">{j.flag} {j.name}</td>
                <td className="px-4 py-2"><div className="flex items-center gap-2"><div className="w-16 h-1 bg-muted rounded-full overflow-hidden"><div className="h-full rounded-full" style={{ width: `${j.coverage * 100}%`, backgroundColor: j.coverage >= 0.95 ? "var(--nx-emerald-500)" : "var(--nx-amber-500)" }} /></div><span className="font-bold tabular-nums text-[10px]">{Math.round(j.coverage * 100)}%</span></div></td>
                <td className="px-4 py-2 tabular-nums font-bold">{j.rules}</td>
                <td className="px-4 py-2 tabular-nums text-muted-foreground">{j.entities.toLocaleString()}</td>
                <td className="px-4 py-2"><span className={cn("text-[9px] font-bold", j.status === "full" ? "text-nx-emerald-600" : "text-nx-amber-600")}>{j.status === "full" ? "Full" : "Partial"}</span></td>
                <td className="px-4 py-2 tabular-nums text-muted-foreground">{j.lastUpdate}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
