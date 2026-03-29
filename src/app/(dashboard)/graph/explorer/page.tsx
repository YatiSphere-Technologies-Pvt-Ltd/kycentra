"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { ConfidenceBadge } from "@/components/shared";
import { graphNodes, graphEdges, anomalies } from "@/features/graph-explorer/data/mock-data";
import {
  GitBranch, AlertTriangle, CheckCircle2, Shield, Eye,
  Download, ChevronRight, Users, Building2, Globe,
  X, ArrowRight, Search, FileText, Activity,
} from "lucide-react";

/* ─── Helpers ─── */

const riskColor: Record<string, string> = {
  low: "var(--nx-emerald-600)", medium: "var(--nx-amber-600)", high: "var(--nx-rose-600)", critical: "var(--nx-rose-800)",
};

const typeLabel: Record<string, string> = {
  legal_entity: "Legal Entity", natural_person: "Individual", trust: "Trust",
  fund: "Fund", shell_company: "Shell Company", sanctioned_entity: "Sanctioned",
};

const flagMap: Record<string, string> = {
  KY: "🇰🇾", NL: "🇳🇱", SG: "🇸🇬", JE: "🇯🇪", JP: "🇯🇵", GB: "🇬🇧", VG: "🇻🇬",
};

/* ─── Page ─── */

export default function GraphExplorerPage() {
  const router = useRouter();
  const [selectedNode, setSelectedNode] = useState<string | null>(null);

  const selected = graphNodes.find((n) => n.id === selectedNode);
  const ubos = graphNodes.filter((n) => n.isUBO);
  const jurisdictions = [...new Set(graphNodes.map((n) => n.jurisdiction ?? n.nationality).filter((j): j is string => Boolean(j)))];
  const rootNode = graphNodes.find((n) => n.id === "ENT-MC-001")!;
  const directEdges = graphEdges.filter((e) => e.source === rootNode.id && e.type === "ownership");

  // Jurisdiction risk summary
  const jurRisk = jurisdictions.map((j) => {
    const nodes = graphNodes.filter((n) => (n.jurisdiction ?? n.nationality) === j);
    const maxRiskScore = Math.max(...nodes.map((n) => n.riskScore));
    const pepCount = nodes.filter((n) => n.pepStatus).length;
    const sanctioned = nodes.filter((n) => n.isSanctioned).length;
    const anomalyCount = nodes.filter((n) => n.isAnomaly).length;
    return { code: j, flag: flagMap[j] ?? "", name: nodes[0]?.jurisdictionName ?? nodes[0]?.nationalityName ?? j, count: nodes.length, maxRisk: maxRiskScore, peps: pepCount, sanctioned, anomalies: anomalyCount };
  }).sort((a, b) => b.maxRisk - a.maxRisk);

  return (
    <div className="space-y-5">
      {/* ─── Header ─── */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h1 className="text-lg font-bold tracking-tight">Ownership & Network Intelligence</h1>
          <p className="text-[11px] text-muted-foreground mt-0.5">
            Entity: Meridian Capital Partners Ltd · {graphNodes.length} nodes · {graphEdges.length} connections · {anomalies.length} anomalies detected
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm" className="h-7 text-[10px] font-semibold gap-1.5"><Download className="h-3 w-3" /> Export PDF</Button>
          <Button variant="outline" size="sm" className="h-7 text-[10px] font-semibold gap-1.5" onClick={() => router.push("/entities/ENT-2019-MC-8847")}>
            <Eye className="h-3 w-3" /> Entity 360°
          </Button>
        </div>
      </div>

      {/* ─── KPIs ─── */}
      <div className="grid grid-cols-4 lg:grid-cols-8 gap-px bg-border rounded-lg overflow-hidden">
        {[
          { label: "Network Nodes", value: String(graphNodes.length) },
          { label: "Connections", value: String(graphEdges.length) },
          { label: "UBOs Found", value: String(ubos.length) },
          { label: "Jurisdictions", value: String(jurisdictions.length) },
          { label: "Ownership Depth", value: "5 layers" },
          { label: "PEP Flags", value: String(graphNodes.filter((n) => n.pepStatus).length), warn: true },
          { label: "Sanctions Match", value: String(graphNodes.filter((n) => n.isSanctioned).length), warn: true },
          { label: "Anomalies", value: String(anomalies.length), warn: true },
        ].map((kpi) => (
          <div key={kpi.label} className="bg-card p-3">
            <div className="text-[8px] font-bold text-muted-foreground uppercase tracking-widest mb-1">{kpi.label}</div>
            <div className={cn("text-[16px] font-extrabold tabular-nums tracking-tight", kpi.warn && "text-nx-amber-600")}>{kpi.value}</div>
          </div>
        ))}
      </div>

      {/* ─── Section 1: Anomalies & Risk Flags ─── */}
      <div className="rounded-lg border border-border bg-card overflow-hidden">
        <div className="flex items-center justify-between px-4 py-2.5 border-b border-border bg-nx-amber-50/30">
          <div className="flex items-center gap-2">
            <AlertTriangle className="h-3.5 w-3.5 text-nx-amber-600" />
            <span className="text-[12px] font-bold">Anomalies & Risk Flags</span>
            <span className="flex h-4.5 min-w-4.5 items-center justify-center rounded bg-foreground px-1 text-[9px] font-bold text-background tabular-nums">{anomalies.length}</span>
          </div>
        </div>
        <table className="w-full text-[11px]">
          <thead>
            <tr className="border-b border-border bg-muted/20">
              {["Severity", "Type", "Entity", "Description", "Indicators", "Confidence", "Action"].map((h) => (
                <th key={h} className="text-left font-bold text-muted-foreground uppercase tracking-wider px-4 py-2 whitespace-nowrap">{h}</th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-border">
            {anomalies.map((a) => (
              <tr key={a.id} className="hover:bg-muted/10 transition-colors" style={{ borderLeft: `3px solid ${a.severity === "high" ? "var(--nx-rose-500)" : "var(--nx-amber-500)"}` }}>
                <td className="px-4 py-2.5">
                  <span className="text-[9px] font-bold uppercase" style={{ color: a.severity === "high" ? "var(--nx-rose-600)" : "var(--nx-amber-600)" }}>{a.severity}</span>
                </td>
                <td className="px-4 py-2.5">
                  <span className="text-[10px] font-semibold">{a.title}</span>
                </td>
                <td className="px-4 py-2.5">
                  <button onClick={() => setSelectedNode(a.entityId ?? null)} className="text-[11px] font-semibold text-foreground hover:underline">{a.entity}</button>
                </td>
                <td className="px-4 py-2.5 max-w-48">
                  <span className="text-[10px] text-muted-foreground line-clamp-2">{a.aiAnalysis}</span>
                </td>
                <td className="px-4 py-2.5 max-w-44">
                  <div className="flex flex-wrap gap-0.5">
                    {a.indicators.slice(0, 3).map((ind) => (
                      <span key={ind} className="text-[7px] font-bold px-1 py-0.5 rounded bg-nx-amber-50 text-nx-amber-700 whitespace-nowrap">{ind}</span>
                    ))}
                  </div>
                </td>
                <td className="px-4 py-2.5"><ConfidenceBadge value={Math.round(a.confidence * 100)} /></td>
                <td className="px-4 py-2.5">
                  <div className="flex gap-1">
                    <Button size="sm" className="h-5 text-[8px] font-semibold px-2 gap-0.5" onClick={() => router.push("/cases")}>
                      <FileText className="h-2 w-2" /> Create Case
                    </Button>
                    <Button variant="outline" size="sm" className="h-5 text-[8px] font-semibold px-2 gap-0.5" onClick={() => router.push("/screening")}>
                      <Shield className="h-2 w-2" /> Screen
                    </Button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* ─── Section 2: Ownership Structure ─── */}
      <div className="rounded-lg border border-border bg-card overflow-hidden">
        <div className="flex items-center justify-between px-4 py-2.5 border-b border-border">
          <div className="flex items-center gap-2">
            <GitBranch className="h-3.5 w-3.5 text-muted-foreground/40" />
            <span className="text-[12px] font-bold">Ownership Structure</span>
          </div>
          <span className="text-[9px] text-muted-foreground">Click any node for details</span>
        </div>

        <div className="p-6 overflow-x-auto">
          <div className="flex flex-col items-center min-w-[700px]">
            {/* Root */}
            <NodeCard node={rootNode} isSelected={selectedNode === rootNode.id} onClick={() => setSelectedNode(rootNode.id)} isRoot />

            <div className="h-5 w-px bg-border" />
            <div className="flex items-start gap-1">
              {directEdges.map((edge, edgeIdx) => {
                const child = graphNodes.find((n) => n.id === edge.target);
                if (!child) return null;
                const childEdges = graphEdges.filter((e) => e.source === child.id);

                return (
                  <div key={edge.id} className="flex flex-col items-center px-3">
                    {/* Percentage */}
                    <div className="text-[11px] font-extrabold tabular-nums text-foreground/50 mb-1">{edge.label}</div>
                    {/* Connector */}
                    <div className="h-3 w-px bg-border" />

                    {/* L1 Entity */}
                    <NodeCard node={child} isSelected={selectedNode === child.id} onClick={() => setSelectedNode(child.id)} />

                    {childEdges.length > 0 && (
                      <>
                        <div className="h-3 w-px bg-border" />
                        <div className="flex items-start gap-1">
                          {childEdges.map((ce) => {
                            const l2 = graphNodes.find((n) => n.id === ce.target);
                            if (!l2) return null;
                            const l2Edges = graphEdges.filter((e) => e.source === l2.id && graphNodes.find((n) => n.id === e.target)?.level === 3);
                            const l3 = l2Edges.length > 0 ? graphNodes.find((n) => n.id === l2Edges[0].target) : null;

                            return (
                              <div key={ce.id} className="flex flex-col items-center px-1">
                                <div className="text-[9px] font-bold tabular-nums text-muted-foreground/40 mb-0.5">{ce.label}</div>
                                <div className="h-2 w-px bg-border" />
                                <NodeCard node={l2} isSelected={selectedNode === l2.id} onClick={() => setSelectedNode(l2.id)} compact />

                                {l3 && (
                                  <>
                                    <div className="h-2 w-px bg-border" />
                                    <div className="text-[8px] font-bold tabular-nums text-muted-foreground/30 mb-0.5">{l2Edges[0].label}</div>
                                    <NodeCard node={l3} isSelected={selectedNode === l3.id} onClick={() => setSelectedNode(l3.id)} compact />
                                  </>
                                )}
                              </div>
                            );
                          })}
                        </div>
                      </>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Cross-connections */}
        <div className="border-t border-border px-4 py-3">
          <div className="text-[9px] font-bold text-muted-foreground uppercase tracking-widest mb-2">Additional Connections</div>
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-2">
            {graphEdges.filter((e) => ["directorship", "sanctions_match"].includes(e.type)).map((edge) => {
              const source = graphNodes.find((n) => n.id === edge.source);
              const target = graphNodes.find((n) => n.id === edge.target);
              if (!source || !target) return null;
              const isSanctions = edge.type === "sanctions_match";
              return (
                <div key={edge.id} className={cn("rounded border p-2.5 flex items-center justify-between gap-2", isSanctions ? "border-nx-rose-300 bg-nx-rose-50/20" : "border-border")}>
                  <div className="min-w-0">
                    <div className="text-[9px] font-bold uppercase tracking-wider text-muted-foreground mb-0.5">{edge.type.replace("_", " ")}</div>
                    <div className="text-[10px] truncate"><strong>{source.name}</strong> → <strong>{target.name}</strong></div>
                    <div className="text-[9px] text-muted-foreground">{edge.label}</div>
                  </div>
                  <Button variant={isSanctions ? "default" : "outline"} size="sm" className={cn("h-5 text-[8px] font-semibold px-2 gap-0.5 shrink-0", isSanctions && "bg-nx-rose-600 hover:bg-nx-rose-700")} onClick={() => isSanctions ? router.push("/screening") : router.push(`/entities/${target.id}`)}>
                    {isSanctions ? <><Shield className="h-2 w-2" /> Review</> : <><Eye className="h-2 w-2" /> View</>}
                  </Button>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* ─── Section 3: Node Detail Panel ─── */}
      {selected && (
        <div className="rounded-lg border border-border bg-card overflow-hidden">
          <div className="flex items-center justify-between px-4 py-2.5 border-b border-border">
            <div className="flex items-center gap-2">
              <Eye className="h-3.5 w-3.5 text-muted-foreground/40" />
              <span className="text-[12px] font-bold">{selected.name}</span>
              <span className="text-[9px] font-bold px-1.5 py-0.5 rounded" style={{ backgroundColor: `${riskColor[selected.riskTier]}15`, color: riskColor[selected.riskTier] }}>
                {selected.riskTier.toUpperCase()} {selected.riskScore}
              </span>
              {selected.pepStatus && <span className="text-[8px] font-bold text-nx-rose-700 bg-nx-rose-50 px-1.5 py-0.5 rounded">PEP</span>}
              {selected.isSanctioned && <span className="text-[8px] font-bold text-white bg-nx-rose-600 px-1.5 py-0.5 rounded">SANCTIONED</span>}
              {selected.isAnomaly && <span className="text-[8px] font-bold text-nx-amber-700 bg-nx-amber-50 px-1.5 py-0.5 rounded">ANOMALY</span>}
            </div>
            <button onClick={() => setSelectedNode(null)} className="text-muted-foreground hover:text-foreground"><X className="h-3.5 w-3.5" /></button>
          </div>

          <div className="grid lg:grid-cols-4 divide-y lg:divide-y-0 lg:divide-x divide-border">
            {/* Identity */}
            <div className="p-4 space-y-1.5 text-[11px]">
              <div className="text-[9px] font-bold text-muted-foreground uppercase tracking-widest mb-2">Identity</div>
              {[
                ["Type", typeLabel[selected.type] ?? selected.type],
                selected.jurisdiction ? ["Jurisdiction", `${flagMap[selected.jurisdiction] ?? ""} ${selected.jurisdictionName}`] : selected.nationality ? ["Nationality", `${flagMap[selected.nationality] ?? ""} ${selected.nationalityName}`] : null,
                selected.businessType ? ["Business", selected.businessType] : null,
                selected.registrationNumber ? ["Registration", selected.registrationNumber] : null,
                selected.effectiveOwnership != null ? ["Effective Ownership", `${selected.effectiveOwnership}%`] : null,
                selected.aum ? ["AUM", selected.aum] : null,
              ].filter((x): x is [string, string] => x !== null).map(([k, v]) => (
                <div key={k} className="flex justify-between"><span className="text-muted-foreground">{k}</span><span className="font-medium">{v}</span></div>
              ))}
            </div>

            {/* Risk */}
            <div className="p-4 space-y-1.5 text-[11px]">
              <div className="text-[9px] font-bold text-muted-foreground uppercase tracking-widest mb-2">Risk Profile</div>
              <div className="flex justify-between"><span className="text-muted-foreground">Score</span><span className="font-bold tabular-nums">{selected.riskScore}/100</span></div>
              <div className="flex justify-between"><span className="text-muted-foreground">Tier</span><span className="font-bold" style={{ color: riskColor[selected.riskTier] }}>{selected.riskTier.toUpperCase()}</span></div>
              {selected.alerts != null && <div className="flex justify-between"><span className="text-muted-foreground">Alerts</span><span className={cn("font-bold tabular-nums", selected.alerts > 0 && "text-nx-amber-600")}>{selected.alerts}</span></div>}
              {selected.cases != null && <div className="flex justify-between"><span className="text-muted-foreground">Cases</span><span className="font-bold tabular-nums">{selected.cases}</span></div>}
              {selected.pepDetail && <div className="mt-2 p-2 rounded bg-nx-rose-50/50 border border-nx-rose-200 text-[9px] text-muted-foreground">{selected.pepDetail}</div>}
              {selected.isSanctioned && <div className="mt-2 p-2 rounded bg-nx-rose-100 border border-nx-rose-300 text-[9px] text-nx-rose-800 font-bold">{selected.ofacEntry} — {selected.status}</div>}
            </div>

            {/* Connections */}
            <div className="p-4 text-[11px]">
              <div className="text-[9px] font-bold text-muted-foreground uppercase tracking-widest mb-2">Connections ({graphEdges.filter((e) => e.source === selected.id || e.target === selected.id).length})</div>
              <div className="space-y-1 max-h-40 overflow-y-auto" style={{ scrollbarWidth: "none" }}>
                {graphEdges.filter((e) => e.source === selected.id || e.target === selected.id).map((e) => {
                  const other = graphNodes.find((n) => n.id === (e.source === selected.id ? e.target : e.source));
                  if (!other) return null;
                  return (
                    <button key={e.id} onClick={() => setSelectedNode(other.id)} className="w-full flex items-center justify-between py-1 text-[10px] hover:bg-muted/10 rounded px-1 transition-colors text-left">
                      <span className="truncate"><strong>{other.name}</strong></span>
                      <span className="text-muted-foreground/50 shrink-0 ml-2">{e.label}</span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Actions */}
            <div className="p-4 space-y-1.5">
              <div className="text-[9px] font-bold text-muted-foreground uppercase tracking-widest mb-2">Actions</div>
              <Button variant="outline" size="sm" className="w-full h-7 text-[10px] font-semibold gap-1.5 justify-start" onClick={() => selected.isClient && router.push(`/entities/${selected.id}`)}>
                <Eye className="h-3 w-3" /> View Entity 360°
              </Button>
              <Button variant="outline" size="sm" className="w-full h-7 text-[10px] font-semibold gap-1.5 justify-start" onClick={() => router.push("/screening")}>
                <Shield className="h-3 w-3" /> Run Screening
              </Button>
              <Button variant="outline" size="sm" className="w-full h-7 text-[10px] font-semibold gap-1.5 justify-start" onClick={() => router.push("/cases")}>
                <FileText className="h-3 w-3" /> Create Case
              </Button>
              <Button variant="outline" size="sm" className="w-full h-7 text-[10px] font-semibold gap-1.5 justify-start" onClick={() => router.push("/approvals")}>
                <Activity className="h-3 w-3" /> Flag for Review
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* ─── Section 4: Jurisdiction Risk Map ─── */}
      <div className="rounded-lg border border-border bg-card overflow-hidden">
        <div className="flex items-center justify-between px-4 py-2.5 border-b border-border">
          <div className="flex items-center gap-2">
            <Globe className="h-3.5 w-3.5 text-muted-foreground/40" />
            <span className="text-[12px] font-bold">Jurisdiction Risk Map</span>
          </div>
        </div>
        <table className="w-full text-[11px]">
          <thead>
            <tr className="border-b border-border bg-muted/20">
              {["Jurisdiction", "Entities", "Max Risk Score", "PEPs", "Sanctions", "Anomalies", "Risk Level"].map((h) => (
                <th key={h} className="text-left font-bold text-muted-foreground uppercase tracking-wider px-4 py-2 whitespace-nowrap">{h}</th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-border">
            {jurRisk.map((j) => (
              <tr key={j.code} className="hover:bg-muted/10 transition-colors">
                <td className="px-4 py-2.5 font-medium">{j.flag} {j.name}</td>
                <td className="px-4 py-2.5 tabular-nums font-bold">{j.count}</td>
                <td className="px-4 py-2.5 tabular-nums font-bold">{j.maxRisk}</td>
                <td className="px-4 py-2.5">{j.peps > 0 ? <span className="text-[9px] font-bold text-nx-rose-600 bg-nx-rose-50 px-1.5 py-0.5 rounded">{j.peps} PEP</span> : <span className="text-muted-foreground/30">—</span>}</td>
                <td className="px-4 py-2.5">{j.sanctioned > 0 ? <span className="text-[9px] font-bold text-white bg-nx-rose-600 px-1.5 py-0.5 rounded">{j.sanctioned}</span> : <span className="text-muted-foreground/30">—</span>}</td>
                <td className="px-4 py-2.5">{j.anomalies > 0 ? <span className="text-[9px] font-bold text-nx-amber-700 bg-nx-amber-50 px-1.5 py-0.5 rounded">{j.anomalies}</span> : <span className="text-muted-foreground/30">—</span>}</td>
                <td className="px-4 py-2.5">
                  <div className="flex items-center gap-2">
                    <div className="w-16 h-1.5 bg-muted rounded-full overflow-hidden">
                      <div className="h-full rounded-full" style={{ width: `${j.maxRisk}%`, backgroundColor: j.maxRisk >= 70 ? "var(--nx-rose-500)" : j.maxRisk >= 40 ? "var(--nx-amber-500)" : "var(--nx-emerald-500)" }} />
                    </div>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* ─── Section 5: UBO Summary ─── */}
      <div className="rounded-lg border border-border bg-card overflow-hidden">
        <div className="flex items-center justify-between px-4 py-2.5 border-b border-border">
          <div className="flex items-center gap-2">
            <Users className="h-3.5 w-3.5 text-muted-foreground/40" />
            <span className="text-[12px] font-bold">Ultimate Beneficial Owners</span>
            <span className="text-[10px] text-muted-foreground">{ubos.length} identified</span>
          </div>
        </div>
        <table className="w-full text-[11px]">
          <thead>
            <tr className="border-b border-border bg-muted/20">
              {["Name", "Nationality", "Effective %", "Via Intermediary", "Risk", "PEP", "Depth", "Action"].map((h) => (
                <th key={h} className="text-left font-bold text-muted-foreground uppercase tracking-wider px-4 py-2 whitespace-nowrap">{h}</th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-border">
            {ubos.map((ubo) => {
              const path = graphEdges.filter((e) => e.target === ubo.id);
              const via = path.length > 0 ? graphNodes.find((n) => n.id === path[0].source)?.name ?? "Direct" : "Direct";
              return (
                <tr key={ubo.id} className="hover:bg-muted/10 transition-colors">
                  <td className="px-4 py-2.5">
                    <button onClick={() => setSelectedNode(ubo.id)} className="font-semibold text-[12px] hover:underline text-left">{ubo.name}</button>
                  </td>
                  <td className="px-4 py-2.5">{flagMap[ubo.nationality ?? ""] ?? ""} {ubo.nationalityName ?? ""}</td>
                  <td className="px-4 py-2.5 font-extrabold tabular-nums text-[13px]">{ubo.effectiveOwnership}%</td>
                  <td className="px-4 py-2.5 text-muted-foreground text-[10px]">{via}</td>
                  <td className="px-4 py-2.5"><span className="text-[9px] font-bold" style={{ color: riskColor[ubo.riskTier] }}>{ubo.riskTier.toUpperCase()}</span></td>
                  <td className="px-4 py-2.5">{ubo.pepStatus ? <span className="text-[9px] font-bold text-nx-rose-700 bg-nx-rose-50 px-1.5 py-0.5 rounded">PEP L2</span> : <CheckCircle2 className="h-3 w-3 text-nx-emerald-600" />}</td>
                  <td className="px-4 py-2.5 tabular-nums text-muted-foreground">L{ubo.level}</td>
                  <td className="px-4 py-2.5">
                    <Button variant="outline" size="sm" className="h-5 text-[8px] font-semibold px-2 gap-0.5" onClick={() => router.push("/screening")}>
                      <Shield className="h-2 w-2" /> Screen
                    </Button>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* ─── Section 6: OFAC 50% Rule ─── */}
      <div className="rounded-lg border border-nx-rose-300 bg-nx-rose-50/20 overflow-hidden">
        <div className="flex items-center justify-between px-4 py-2.5 border-b border-nx-rose-200">
          <div className="flex items-center gap-2">
            <Shield className="h-3.5 w-3.5 text-nx-rose-600" />
            <span className="text-[12px] font-bold">OFAC 50% Rule Assessment</span>
          </div>
        </div>
        <div className="p-4">
          <div className="grid lg:grid-cols-12 gap-4">
            <div className="lg:col-span-8">
              <p className="text-[11px] text-muted-foreground leading-[1.7] mb-3">
                OFAC SDN Entry #18847 (<strong className="text-foreground">Meridian Cap. Ltd</strong>, Cayman Islands) has an 82% name match with the client entity. If confirmed as a true match, the OFAC 50% Rule requires assessment of indirect ownership exposure.
              </p>
              <div className="rounded border border-border bg-card p-3 space-y-2">
                <div className="text-[9px] font-bold text-muted-foreground uppercase tracking-widest">Ownership Chain Analysis</div>
                <div className="flex items-center gap-2 text-[11px]">
                  <span className="font-bold text-nx-rose-600">Meridian Cap. Ltd (OFAC SDN)</span>
                  <ArrowRight className="h-3 w-3 text-muted-foreground/30" />
                  <span className="font-medium">Name match 82% with</span>
                  <ArrowRight className="h-3 w-3 text-muted-foreground/30" />
                  <span className="font-bold">Meridian Capital Partners Ltd (Client)</span>
                </div>
                <div className="p-2 rounded bg-muted/30 text-[10px]">
                  <strong>Assessment:</strong> Registration numbers do not match (Client: CR-283746, OFAC: not specified). Different directors. OFAC entity dissolved in 2023. <strong className="text-nx-amber-600">Manual registry verification recommended.</strong>
                </div>
              </div>
            </div>
            <div className="lg:col-span-4 space-y-2">
              <Button className="w-full h-8 text-[10px] font-semibold gap-1.5 bg-nx-rose-600 hover:bg-nx-rose-700 text-white" onClick={() => router.push("/screening")}>
                <Shield className="h-3 w-3" /> Review OFAC Match
              </Button>
              <Button variant="outline" className="w-full h-8 text-[10px] font-semibold gap-1.5" onClick={() => router.push("/cases")}>
                <FileText className="h-3 w-3" /> Create Investigation
              </Button>
              <Button variant="outline" className="w-full h-8 text-[10px] font-semibold gap-1.5">
                <Download className="h-3 w-3" /> Export Assessment
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* ─── Section 7: All Network Entities ─── */}
      <div className="rounded-lg border border-border bg-card overflow-hidden">
        <div className="flex items-center justify-between px-4 py-2.5 border-b border-border">
          <div className="flex items-center gap-2">
            <Building2 className="h-3.5 w-3.5 text-muted-foreground/40" />
            <span className="text-[12px] font-bold">Complete Network</span>
            <span className="text-[10px] text-muted-foreground">{graphNodes.length} entities</span>
          </div>
        </div>
        <table className="w-full text-[11px]">
          <thead>
            <tr className="border-b border-border bg-muted/20">
              {["Entity", "Type", "Jurisdiction", "Risk", "Score", "Flags", "Connections", "Action"].map((h) => (
                <th key={h} className="text-left font-bold text-muted-foreground uppercase tracking-wider px-4 py-2 whitespace-nowrap">{h}</th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-border">
            {graphNodes.map((node) => {
              const connCount = graphEdges.filter((e) => e.source === node.id || e.target === node.id).length;
              return (
                <tr key={node.id} className={cn("hover:bg-muted/10 transition-colors", node.isSanctioned && "bg-nx-rose-50/20", node.isAnomaly && "bg-nx-amber-50/10")}>
                  <td className="px-4 py-2.5">
                    <button onClick={() => setSelectedNode(node.id)} className="font-semibold text-[12px] hover:underline text-left">{node.name}</button>
                  </td>
                  <td className="px-4 py-2.5 text-muted-foreground">{typeLabel[node.type] ?? node.type}</td>
                  <td className="px-4 py-2.5">{flagMap[node.jurisdiction ?? node.nationality ?? ""] ?? ""} {node.jurisdictionName ?? node.nationalityName ?? ""}</td>
                  <td className="px-4 py-2.5"><span className="text-[9px] font-bold" style={{ color: riskColor[node.riskTier] }}>{node.riskTier.toUpperCase()}</span></td>
                  <td className="px-4 py-2.5 font-bold tabular-nums">{node.riskScore}</td>
                  <td className="px-4 py-2.5">
                    <div className="flex gap-0.5 flex-wrap">
                      {node.isClient && <span className="text-[7px] font-bold px-1 py-0.5 rounded bg-foreground/5 text-muted-foreground">CLIENT</span>}
                      {node.isUBO && <span className="text-[7px] font-bold px-1 py-0.5 rounded bg-foreground/5 text-muted-foreground">UBO</span>}
                      {node.pepStatus && <span className="text-[7px] font-bold px-1 py-0.5 rounded bg-nx-rose-50 text-nx-rose-700">PEP</span>}
                      {node.isSanctioned && <span className="text-[7px] font-bold px-1 py-0.5 rounded bg-nx-rose-100 text-nx-rose-700">OFAC</span>}
                      {node.isAnomaly && <span className="text-[7px] font-bold px-1 py-0.5 rounded bg-nx-amber-50 text-nx-amber-700">ANOMALY</span>}
                    </div>
                  </td>
                  <td className="px-4 py-2.5 tabular-nums text-muted-foreground">{connCount}</td>
                  <td className="px-4 py-2.5">
                    <Button variant="outline" size="sm" className="h-5 text-[8px] font-semibold px-2 gap-0.5" onClick={() => setSelectedNode(node.id)}>
                      <Eye className="h-2 w-2" /> Details
                    </Button>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}

/* ─── Node Card Component ─── */

function NodeCard({ node, isSelected, onClick, isRoot, compact }: {
  node: typeof graphNodes[0]; isSelected: boolean; onClick: () => void; isRoot?: boolean; compact?: boolean;
}) {
  return (
    <button
      onClick={onClick}
      className={cn(
        "rounded-lg border bg-card text-center transition-all hover:shadow-md",
        compact ? "px-3 py-2 min-w-28" : "px-5 py-3 min-w-40",
        isRoot && "border-2",
        node.type === "trust" && "border-dashed",
        node.isSanctioned && "border-nx-rose-500 bg-nx-rose-50/20",
        node.isAnomaly && "border-dashed border-nx-rose-300 bg-nx-rose-50/10",
        isSelected ? "border-foreground shadow-md" : !node.isSanctioned && !node.isAnomaly && "border-border"
      )}
    >
      <div className="flex items-center justify-center gap-1 mb-0.5 flex-wrap">
        {node.isUBO && <span className="text-[6px] font-bold px-1 py-0.5 rounded bg-foreground/5 text-muted-foreground">UBO</span>}
        {node.isClient && <span className="text-[6px] font-bold px-1 py-0.5 rounded bg-foreground/5 text-muted-foreground">CLIENT</span>}
        {node.isAnomaly && <span className="text-[6px] font-bold px-1 py-0.5 rounded bg-nx-rose-50 text-nx-rose-700">ANOMALY</span>}
        {node.isSanctioned && <span className="text-[6px] font-bold px-1 py-0.5 rounded bg-nx-rose-100 text-nx-rose-700">SANCTIONED</span>}
      </div>
      <div className={cn("font-semibold", compact ? "text-[9px]" : "text-[11px]")}>{node.name}</div>
      <div className={cn("text-muted-foreground", compact ? "text-[7px]" : "text-[9px]")}>
        {flagMap[node.jurisdiction ?? node.nationality ?? ""] ?? ""} {node.jurisdictionName ?? node.nationalityName ?? ""}
      </div>
      <div className="flex items-center justify-center gap-1 mt-0.5">
        <span className={cn("font-bold rounded px-1 py-0.5", compact ? "text-[7px]" : "text-[8px]")} style={{ backgroundColor: `${riskColor[node.riskTier]}15`, color: riskColor[node.riskTier] }}>
          {node.riskTier.toUpperCase()}
        </span>
        {node.pepStatus && <span className={cn("font-bold text-nx-rose-700 bg-nx-rose-50 rounded px-1 py-0.5", compact ? "text-[6px]" : "text-[7px]")}>PEP</span>}
        {node.effectiveOwnership != null && <span className={cn("font-bold tabular-nums text-muted-foreground/60", compact ? "text-[8px]" : "text-[9px]")}>{node.effectiveOwnership}%</span>}
      </div>
    </button>
  );
}
