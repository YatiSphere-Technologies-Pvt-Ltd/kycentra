"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { ConfidenceBadge } from "@/components/shared";
import { graphNodes, graphEdges, anomalies } from "@/features/graph-explorer/data/mock-data";
import {
  GitBranch, Search, AlertTriangle, CheckCircle2, Shield, Eye,
  Download, ChevronRight, Users, Building2, Globe, ExternalLink,
  X, Activity, Lock, ArrowRight,
} from "lucide-react";

/* ─── Helpers ─── */

const riskColor: Record<string, string> = {
  low: "var(--nx-emerald-600)", medium: "var(--nx-amber-600)", high: "var(--nx-rose-600)", critical: "var(--nx-rose-800)",
};

const typeLabel: Record<string, { label: string; icon: string }> = {
  legal_entity: { label: "Legal Entity", icon: "🏢" },
  natural_person: { label: "Individual", icon: "👤" },
  trust: { label: "Trust", icon: "🏛" },
  fund: { label: "Fund", icon: "📊" },
  shell_company: { label: "Shell Company", icon: "⚠" },
  sanctioned_entity: { label: "Sanctioned", icon: "🚫" },
};

const flagMap: Record<string, string> = {
  KY: "🇰🇾", NL: "🇳🇱", SG: "🇸🇬", JE: "🇯🇪", JP: "🇯🇵", GB: "🇬🇧", VG: "🇻🇬",
};

const anomSeverity: Record<string, { label: string; color: string }> = {
  high: { label: "High", color: "var(--nx-rose-600)" },
  medium: { label: "Medium", color: "var(--nx-amber-600)" },
  low: { label: "Low", color: "var(--nx-neutral-500)" },
};

// Build ownership tree
const rootNode = graphNodes.find((n) => n.id === "ENT-MC-001")!;
const directEdges = graphEdges.filter((e) => e.source === rootNode.id && e.type === "ownership");

/* ─── Page ─── */

export default function GraphExplorerPage() {
  const [selectedNode, setSelectedNode] = useState<string | null>(null);
  const [showAnomalies, setShowAnomalies] = useState(true);

  const selected = graphNodes.find((n) => n.id === selectedNode);
  const entities = graphNodes.filter((n) => n.type === "legal_entity" || n.type === "trust" || n.type === "fund");
  const persons = graphNodes.filter((n) => n.type === "natural_person");
  const ubos = persons.filter((n) => n.isUBO);
  const jurisdictions = [...new Set(graphNodes.map((n) => n.jurisdiction ?? n.nationality).filter(Boolean))];

  return (
    <div className="space-y-5">
      {/* ─── Header ─── */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h1 className="text-lg font-bold tracking-tight">Ownership & Network Explorer</h1>
          <p className="text-[11px] text-muted-foreground mt-0.5">
            {graphNodes.length} entities · {graphEdges.length} connections · {ubos.length} UBOs · {jurisdictions.length} jurisdictions · {anomalies.length} anomalies
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm" className="h-7 text-[10px] font-semibold gap-1.5" onClick={() => setShowAnomalies(!showAnomalies)}>
            <AlertTriangle className="h-3 w-3" /> Anomalies ({anomalies.length})
          </Button>
          <Button variant="outline" size="sm" className="h-7 text-[10px] font-semibold gap-1.5">
            <Download className="h-3 w-3" /> Export
          </Button>
        </div>
      </div>

      {/* ─── KPIs ─── */}
      <div className="grid grid-cols-3 lg:grid-cols-7 gap-px bg-border rounded-lg overflow-hidden">
        {[
          { label: "Total Nodes", value: String(graphNodes.length) },
          { label: "Entities", value: String(entities.length) },
          { label: "Individuals", value: String(persons.length) },
          { label: "UBOs", value: String(ubos.length) },
          { label: "Jurisdictions", value: String(jurisdictions.length) },
          { label: "Anomalies", value: String(anomalies.length), warn: anomalies.length > 0 },
          { label: "Max Depth", value: "5 layers" },
        ].map((kpi) => (
          <div key={kpi.label} className="bg-card p-3">
            <div className="text-[9px] font-bold text-muted-foreground uppercase tracking-widest mb-1">{kpi.label}</div>
            <div className={cn("text-[16px] font-extrabold tabular-nums tracking-tight", kpi.warn && "text-nx-amber-600")}>{kpi.value}</div>
          </div>
        ))}
      </div>

      {/* ─── Anomaly Alerts ─── */}
      {showAnomalies && anomalies.length > 0 && (
        <div className="rounded-lg border border-border bg-card overflow-hidden">
          <div className="flex items-center justify-between px-4 py-2.5 border-b border-border bg-nx-amber-50/30">
            <div className="flex items-center gap-2">
              <AlertTriangle className="h-3.5 w-3.5 text-nx-amber-600" />
              <span className="text-[12px] font-bold">Detected Anomalies</span>
              <span className="flex h-4.5 min-w-4.5 items-center justify-center rounded bg-foreground px-1 text-[9px] font-bold text-background tabular-nums">{anomalies.length}</span>
            </div>
            <button onClick={() => setShowAnomalies(false)} className="text-[10px] text-muted-foreground hover:text-foreground">Dismiss</button>
          </div>
          <div className="divide-y divide-border">
            {anomalies.map((a) => {
              const sev = anomSeverity[a.severity];
              return (
                <div key={a.id} className="px-4 py-3 hover:bg-muted/10 transition-colors cursor-pointer" onClick={() => setSelectedNode(a.entityId ?? null)}>
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <span className="text-[9px] font-bold uppercase" style={{ color: sev.color }}>{sev.label}</span>
                        <span className="text-[12px] font-semibold">{a.title}</span>
                      </div>
                      <p className="text-[10px] text-muted-foreground leading-relaxed">{a.aiAnalysis}</p>
                      <div className="flex items-center gap-2 mt-1.5">
                        <span className="text-[10px] font-medium">{a.entity}</span>
                        <ConfidenceBadge value={Math.round(a.confidence * 100)} />
                      </div>
                      <div className="flex flex-wrap gap-1 mt-1.5">
                        {a.indicators.map((ind) => (
                          <span key={ind} className="text-[8px] font-semibold px-1.5 py-0.5 rounded bg-nx-amber-50 text-nx-amber-700">{ind}</span>
                        ))}
                      </div>
                    </div>
                    <Button variant="outline" size="sm" className="h-6 text-[9px] font-semibold px-2 gap-1 shrink-0">
                      <Eye className="h-2.5 w-2.5" /> Investigate
                    </Button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* ─── Ownership Structure — Visual Tree ─── */}
      <div className="rounded-lg border border-border bg-card overflow-hidden">
        <div className="flex items-center justify-between px-4 py-2.5 border-b border-border">
          <div className="flex items-center gap-2">
            <GitBranch className="h-3.5 w-3.5 text-muted-foreground/40" />
            <span className="text-[12px] font-bold">Ownership Structure</span>
            <span className="text-[10px] text-muted-foreground">Meridian Capital Partners Ltd</span>
          </div>
        </div>

        <div className="p-6">
          {/* Root entity */}
          <div className="flex flex-col items-center">
            <button
              onClick={() => setSelectedNode(rootNode.id)}
              className={cn("rounded-lg border-2 bg-card px-6 py-3 text-center transition-all hover:shadow-md max-w-xs", selectedNode === rootNode.id ? "border-foreground shadow-md" : "border-foreground/20")}
            >
              <div className="text-[12px] font-bold">{rootNode.name}</div>
              <div className="text-[10px] text-muted-foreground">{flagMap[rootNode.jurisdiction ?? ""] ?? ""} {rootNode.jurisdictionName} · {rootNode.businessType}</div>
              <div className="flex items-center justify-center gap-2 mt-1">
                <span className="text-[9px] font-bold px-1.5 py-0.5 rounded" style={{ backgroundColor: `${riskColor[rootNode.riskTier]}15`, color: riskColor[rootNode.riskTier] }}>
                  {rootNode.riskTier.toUpperCase()} {rootNode.riskScore}/100
                </span>
                {rootNode.isClient && <span className="text-[8px] font-bold px-1 py-0.5 rounded bg-foreground/5 text-muted-foreground">CLIENT</span>}
              </div>
            </button>

            <div className="h-6 w-px bg-border" />

            {/* Ownership branches */}
            <div className="flex items-start gap-8 justify-center flex-wrap">
              {directEdges.map((edge) => {
                const child = graphNodes.find((n) => n.id === edge.target);
                if (!child) return null;
                const childEdges = graphEdges.filter((e) => e.source === child.id);

                return (
                  <div key={edge.id} className="flex flex-col items-center">
                    <div className="text-[11px] font-bold tabular-nums text-muted-foreground mb-1">{edge.label}</div>

                    {/* Level 1 entity */}
                    <button
                      onClick={() => setSelectedNode(child.id)}
                      className={cn(
                        "rounded-lg border bg-card px-4 py-2.5 text-center transition-all hover:shadow-md min-w-40",
                        child.type === "trust" && "border-dashed",
                        selectedNode === child.id ? "border-foreground shadow-md" : "border-border"
                      )}
                    >
                      <div className="text-[11px] font-semibold">{child.name}</div>
                      <div className="text-[9px] text-muted-foreground">{flagMap[child.jurisdiction ?? ""] ?? ""} {child.jurisdictionName}</div>
                      <div className="flex items-center justify-center gap-1.5 mt-1">
                        <span className="text-[8px] font-bold px-1 py-0.5 rounded" style={{ backgroundColor: `${riskColor[child.riskTier]}15`, color: riskColor[child.riskTier] }}>
                          {child.riskTier.toUpperCase()}
                        </span>
                        {child.pepStatus && <span className="text-[8px] font-bold text-nx-rose-700 bg-nx-rose-50 px-1 py-0.5 rounded">PEP</span>}
                      </div>
                    </button>

                    <div className="h-4 w-px bg-border" />

                    {/* Level 2 — UBOs */}
                    <div className="flex items-start gap-4">
                      {childEdges.map((ce) => {
                        const ubo = graphNodes.find((n) => n.id === ce.target);
                        if (!ubo) return null;
                        const subEdges = graphEdges.filter((e) => e.source === ubo.id && e.target !== child.id);
                        const subChild = subEdges.length > 0 ? graphNodes.find((n) => n.id === subEdges[0].target) : null;

                        return (
                          <div key={ce.id} className="flex flex-col items-center">
                            <div className="text-[10px] font-bold tabular-nums text-muted-foreground/60 mb-1">
                              {ce.label}
                            </div>
                            <button
                              onClick={() => setSelectedNode(ubo.id)}
                              className={cn(
                                "rounded-lg border bg-card px-3 py-2 text-center transition-all hover:shadow-md min-w-32",
                                ubo.type === "shell_company" && "border-dashed border-nx-rose-300 bg-nx-rose-50/20",
                                ubo.isSanctioned && "border-nx-rose-500 bg-nx-rose-50/30",
                                selectedNode === ubo.id ? "border-foreground shadow-md" : !ubo.isAnomaly && !ubo.isSanctioned && "border-border"
                              )}
                            >
                              <div className="flex items-center justify-center gap-1 mb-0.5">
                                {ubo.isUBO && <span className="text-[7px] font-bold px-1 py-0.5 rounded bg-foreground/5 text-muted-foreground">UBO</span>}
                                {ubo.isAnomaly && <span className="text-[7px] font-bold px-1 py-0.5 rounded bg-nx-rose-50 text-nx-rose-700">ANOMALY</span>}
                                {ubo.isSanctioned && <span className="text-[7px] font-bold px-1 py-0.5 rounded bg-nx-rose-100 text-nx-rose-700">SANCTIONED</span>}
                              </div>
                              <div className="text-[10px] font-semibold">{ubo.name}</div>
                              <div className="text-[8px] text-muted-foreground">
                                {flagMap[ubo.jurisdiction ?? ubo.nationality ?? ""] ?? ""} {ubo.nationalityName ?? ubo.jurisdictionName ?? ""}
                              </div>
                              {ubo.effectiveOwnership && (
                                <div className="text-[10px] font-bold tabular-nums mt-0.5">{ubo.effectiveOwnership}%</div>
                              )}
                              {ubo.pepStatus && <span className="text-[7px] font-bold text-nx-rose-700 bg-nx-rose-50 px-1 py-0.5 rounded mt-0.5 inline-block">PEP</span>}
                            </button>

                            {/* Level 3 if exists */}
                            {subChild && (
                              <>
                                <div className="h-3 w-px bg-border" />
                                <div className="text-[9px] font-bold tabular-nums text-muted-foreground/40 mb-0.5">{subEdges[0].label}</div>
                                <button
                                  onClick={() => setSelectedNode(subChild.id)}
                                  className={cn("rounded border border-border bg-card px-2.5 py-1.5 text-center hover:shadow-sm min-w-28", selectedNode === subChild.id && "border-foreground shadow-md")}
                                >
                                  <div className="text-[9px] font-semibold">{subChild.name}</div>
                                  <div className="text-[8px] text-muted-foreground">{flagMap[subChild.jurisdiction ?? subChild.nationality ?? ""] ?? ""}</div>
                                  {subChild.isUBO && <span className="text-[7px] font-bold px-1 py-0.5 rounded bg-foreground/5 text-muted-foreground">UBO</span>}
                                </button>
                              </>
                            )}
                          </div>
                        );
                      })}
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Cross-client + sanctioned connections shown separately */}
            <div className="mt-6 pt-4 border-t border-border w-full">
              <div className="text-[9px] font-bold text-muted-foreground uppercase tracking-widest mb-3">Additional Connections</div>
              <div className="grid lg:grid-cols-3 gap-3">
                {graphEdges.filter((e) => ["directorship", "sanctions_match"].includes(e.type)).map((edge) => {
                  const source = graphNodes.find((n) => n.id === edge.source);
                  const target = graphNodes.find((n) => n.id === edge.target);
                  if (!source || !target) return null;
                  return (
                    <div key={edge.id} className={cn("rounded-lg border p-3 hover:bg-muted/10 transition-colors cursor-pointer", edge.type === "sanctions_match" ? "border-nx-rose-300 bg-nx-rose-50/20" : "border-border")} onClick={() => setSelectedNode(source.id)}>
                      <div className="flex items-center gap-2 mb-1">
                        <span className="text-[9px] font-bold uppercase tracking-wider text-muted-foreground">{edge.type.replace("_", " ")}</span>
                      </div>
                      <div className="text-[10px]">
                        <span className="font-semibold">{source.name}</span>
                        <span className="text-muted-foreground mx-1.5">→</span>
                        <span className="font-semibold">{target.name}</span>
                      </div>
                      <div className="text-[9px] text-muted-foreground mt-0.5">{edge.label}</div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ─── Selected Node Detail ─── */}
      {selected && (
        <div className="rounded-lg border border-border bg-card overflow-hidden">
          <div className="flex items-center justify-between px-4 py-2.5 border-b border-border">
            <div className="flex items-center gap-2">
              <span className="text-[12px] font-bold">{selected.name}</span>
              <span className="text-[9px] font-bold px-1.5 py-0.5 rounded" style={{ backgroundColor: `${riskColor[selected.riskTier]}15`, color: riskColor[selected.riskTier] }}>
                {selected.riskTier.toUpperCase()}
              </span>
              {selected.pepStatus && <span className="text-[9px] font-bold text-nx-rose-700 bg-nx-rose-50 px-1.5 py-0.5 rounded">PEP</span>}
              {selected.isSanctioned && <span className="text-[9px] font-bold text-nx-rose-700 bg-nx-rose-100 px-1.5 py-0.5 rounded">SANCTIONED</span>}
            </div>
            <button onClick={() => setSelectedNode(null)} className="text-muted-foreground hover:text-foreground"><X className="h-3.5 w-3.5" /></button>
          </div>

          <div className="grid lg:grid-cols-12 divide-y lg:divide-y-0 lg:divide-x divide-border">
            {/* Identity */}
            <div className="lg:col-span-4 p-4 space-y-2">
              <div className="text-[9px] font-bold text-muted-foreground uppercase tracking-widest mb-2">Identity</div>
              <div className="space-y-1.5 text-[11px]">
                <div className="flex justify-between"><span className="text-muted-foreground">Type</span><span className="font-medium">{typeLabel[selected.type]?.label ?? selected.type}</span></div>
                {selected.jurisdiction && <div className="flex justify-between"><span className="text-muted-foreground">Jurisdiction</span><span className="font-medium">{flagMap[selected.jurisdiction] ?? ""} {selected.jurisdictionName}</span></div>}
                {selected.nationality && <div className="flex justify-between"><span className="text-muted-foreground">Nationality</span><span className="font-medium">{flagMap[selected.nationality] ?? ""} {selected.nationalityName}</span></div>}
                {selected.businessType && <div className="flex justify-between"><span className="text-muted-foreground">Business</span><span className="font-medium">{selected.businessType}</span></div>}
                {selected.registrationNumber && <div className="flex justify-between"><span className="text-muted-foreground">Registration</span><span className="font-mono font-medium text-[10px]">{selected.registrationNumber}</span></div>}
                {selected.effectiveOwnership != null && <div className="flex justify-between"><span className="text-muted-foreground">Effective Ownership</span><span className="font-bold tabular-nums">{selected.effectiveOwnership}%</span></div>}
                {selected.aum && <div className="flex justify-between"><span className="text-muted-foreground">AUM</span><span className="font-bold tabular-nums">{selected.aum}</span></div>}
              </div>
            </div>

            {/* Risk & Screening */}
            <div className="lg:col-span-4 p-4 space-y-2">
              <div className="text-[9px] font-bold text-muted-foreground uppercase tracking-widest mb-2">Risk & Screening</div>
              <div className="space-y-1.5 text-[11px]">
                <div className="flex justify-between"><span className="text-muted-foreground">Risk Score</span><span className="font-bold tabular-nums">{selected.riskScore}/100</span></div>
                <div className="flex justify-between"><span className="text-muted-foreground">Risk Tier</span><span className="font-bold" style={{ color: riskColor[selected.riskTier] }}>{selected.riskTier.toUpperCase()}</span></div>
                {selected.alerts != null && <div className="flex justify-between"><span className="text-muted-foreground">Open Alerts</span><span className={cn("font-bold tabular-nums", selected.alerts > 0 && "text-nx-amber-600")}>{selected.alerts}</span></div>}
                {selected.cases != null && <div className="flex justify-between"><span className="text-muted-foreground">Active Cases</span><span className="font-bold tabular-nums">{selected.cases}</span></div>}
                {selected.pepStatus && <div className="flex justify-between"><span className="text-muted-foreground">PEP Status</span><span className="font-bold text-nx-rose-600">Yes — Level 2</span></div>}
                {selected.pepDetail && <div className="p-2 rounded bg-nx-rose-50/50 border border-nx-rose-200 text-[10px] text-muted-foreground mt-1">{selected.pepDetail}</div>}
                {selected.isSanctioned && <div className="p-2 rounded bg-nx-rose-100 border border-nx-rose-300 text-[10px] text-nx-rose-800 font-bold mt-1">{selected.ofacEntry} — {selected.status}</div>}
                {selected.isAnomaly && selected.anomalyFlags && (
                  <div className="flex flex-wrap gap-1 mt-1">
                    {selected.anomalyFlags.map((f) => <span key={f} className="text-[8px] font-bold px-1.5 py-0.5 rounded bg-nx-amber-50 text-nx-amber-700">{f.replace(/_/g, " ")}</span>)}
                  </div>
                )}
              </div>
            </div>

            {/* Connections + Actions */}
            <div className="lg:col-span-4 p-4 space-y-3">
              <div className="text-[9px] font-bold text-muted-foreground uppercase tracking-widest mb-2">Connections</div>
              <div className="space-y-1">
                {graphEdges.filter((e) => e.source === selected.id || e.target === selected.id).map((e) => {
                  const other = graphNodes.find((n) => n.id === (e.source === selected.id ? e.target : e.source));
                  if (!other) return null;
                  return (
                    <button key={e.id} onClick={() => setSelectedNode(other.id)} className="w-full flex items-center justify-between py-1 text-[10px] hover:bg-muted/10 rounded px-1 -mx-1 transition-colors">
                      <span className="text-muted-foreground">{e.type.replace("_", " ")}: <strong className="text-foreground">{other.name}</strong></span>
                      <span className="text-muted-foreground/50">{e.label}</span>
                    </button>
                  );
                })}
              </div>

              {selected.roles && selected.roles.length > 0 && (
                <div>
                  <div className="text-[9px] font-bold text-muted-foreground uppercase tracking-widest mb-1">Roles</div>
                  {selected.roles.map((r) => <div key={r} className="text-[10px] text-muted-foreground py-0.5">{r}</div>)}
                </div>
              )}

              <div className="pt-2 border-t border-border space-y-1.5">
                <Button variant="outline" size="sm" className="w-full h-7 text-[10px] font-semibold gap-1.5 justify-start" onClick={() => { if (selected.isClient) window.location.href = `/entities/${selected.id}`; }}>
                  <Eye className="h-3 w-3" /> View Entity 360°
                </Button>
                <Button variant="outline" size="sm" className="w-full h-7 text-[10px] font-semibold gap-1.5 justify-start">
                  <Shield className="h-3 w-3" /> Run Screening
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ─── UBO Summary Table ─── */}
      <div className="rounded-lg border border-border bg-card overflow-hidden">
        <div className="flex items-center justify-between px-4 py-2.5 border-b border-border">
          <div className="flex items-center gap-2">
            <Users className="h-3.5 w-3.5 text-muted-foreground/40" />
            <span className="text-[12px] font-bold">Beneficial Owners</span>
            <span className="text-[10px] text-muted-foreground">{ubos.length} UBOs identified</span>
          </div>
        </div>
        <table className="w-full text-[11px]">
          <thead>
            <tr className="border-b border-border bg-muted/20">
              {["Name", "Nationality", "Effective %", "Via", "Risk", "PEP", "Depth"].map((h) => (
                <th key={h} className="text-left font-bold text-muted-foreground uppercase tracking-wider px-4 py-2 whitespace-nowrap">{h}</th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-border">
            {ubos.map((ubo) => {
              const path = graphEdges.filter((e) => e.target === ubo.id);
              const via = path.length > 0 ? graphNodes.find((n) => n.id === path[0].source)?.name ?? "Direct" : "Direct";
              return (
                <tr key={ubo.id} className="hover:bg-muted/10 transition-colors cursor-pointer" onClick={() => setSelectedNode(ubo.id)}>
                  <td className="px-4 py-2.5 font-semibold text-[12px]">{ubo.name}</td>
                  <td className="px-4 py-2.5">{flagMap[ubo.nationality ?? ""] ?? ""} {ubo.nationalityName ?? ""}</td>
                  <td className="px-4 py-2.5 font-bold tabular-nums">{ubo.effectiveOwnership}%</td>
                  <td className="px-4 py-2.5 text-muted-foreground text-[10px]">{via}</td>
                  <td className="px-4 py-2.5"><span className="text-[9px] font-bold" style={{ color: riskColor[ubo.riskTier] }}>{ubo.riskTier.toUpperCase()}</span></td>
                  <td className="px-4 py-2.5">{ubo.pepStatus ? <span className="text-[9px] font-bold text-nx-rose-700 bg-nx-rose-50 px-1 py-0.5 rounded">PEP</span> : <span className="text-muted-foreground/30">—</span>}</td>
                  <td className="px-4 py-2.5 tabular-nums text-muted-foreground">L{ubo.level}</td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* ─── All Entities Table ─── */}
      <div className="rounded-lg border border-border bg-card overflow-hidden">
        <div className="flex items-center justify-between px-4 py-2.5 border-b border-border">
          <div className="flex items-center gap-2">
            <Building2 className="h-3.5 w-3.5 text-muted-foreground/40" />
            <span className="text-[12px] font-bold">All Network Entities</span>
            <span className="text-[10px] text-muted-foreground">{graphNodes.length} nodes</span>
          </div>
        </div>
        <table className="w-full text-[11px]">
          <thead>
            <tr className="border-b border-border bg-muted/20">
              {["Entity", "Type", "Jurisdiction", "Risk", "Score", "Flags", "Connections"].map((h) => (
                <th key={h} className="text-left font-bold text-muted-foreground uppercase tracking-wider px-4 py-2 whitespace-nowrap">{h}</th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-border">
            {graphNodes.map((node) => {
              const connCount = graphEdges.filter((e) => e.source === node.id || e.target === node.id).length;
              return (
                <tr key={node.id} className={cn("hover:bg-muted/10 transition-colors cursor-pointer", node.isSanctioned && "bg-nx-rose-50/20", node.isAnomaly && "bg-nx-amber-50/10")} onClick={() => setSelectedNode(node.id)}>
                  <td className="px-4 py-2.5 font-semibold text-[12px]">{node.name}</td>
                  <td className="px-4 py-2.5 text-muted-foreground">{typeLabel[node.type]?.label ?? node.type}</td>
                  <td className="px-4 py-2.5">{flagMap[node.jurisdiction ?? node.nationality ?? ""] ?? ""} {node.jurisdictionName ?? node.nationalityName ?? ""}</td>
                  <td className="px-4 py-2.5"><span className="text-[9px] font-bold" style={{ color: riskColor[node.riskTier] }}>{node.riskTier.toUpperCase()}</span></td>
                  <td className="px-4 py-2.5 font-bold tabular-nums">{node.riskScore}</td>
                  <td className="px-4 py-2.5">
                    <div className="flex gap-1">
                      {node.isClient && <span className="text-[7px] font-bold px-1 py-0.5 rounded bg-foreground/5 text-muted-foreground">CLIENT</span>}
                      {node.isUBO && <span className="text-[7px] font-bold px-1 py-0.5 rounded bg-foreground/5 text-muted-foreground">UBO</span>}
                      {node.pepStatus && <span className="text-[7px] font-bold px-1 py-0.5 rounded bg-nx-rose-50 text-nx-rose-700">PEP</span>}
                      {node.isSanctioned && <span className="text-[7px] font-bold px-1 py-0.5 rounded bg-nx-rose-100 text-nx-rose-700">OFAC</span>}
                      {node.isAnomaly && <span className="text-[7px] font-bold px-1 py-0.5 rounded bg-nx-amber-50 text-nx-amber-700">ANOMALY</span>}
                    </div>
                  </td>
                  <td className="px-4 py-2.5 tabular-nums text-muted-foreground">{connCount}</td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
