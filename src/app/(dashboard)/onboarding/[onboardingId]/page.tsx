"use client";

import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { onboarding, stages, requirementCategories, discoveredUBOs, documentRequirements, agentActivity } from "@/features/onboarding/data/mock-data";
import {
  ArrowLeft, ArrowRight, Mail, Shield, Clock, CheckCircle2,
  AlertTriangle, FileText, Users, Building, Globe, Calendar,
  ExternalLink, Send, RefreshCw, Eye, MessageSquare, Download,
  ChevronDown, ChevronRight, User, Sparkles,
} from "lucide-react";
import { useState, Fragment } from "react";

/* ─── Helpers ─── */

const ddStyle: Record<string, { bg: string; fg: string }> = {
  SDD: { bg: "var(--nx-emerald-50)", fg: "var(--nx-emerald-700)" },
  CDD: { bg: "var(--nx-neutral-100)", fg: "var(--nx-neutral-700)" },
  EDD: { bg: "var(--nx-amber-50)", fg: "var(--nx-amber-700)" },
  "EDD+": { bg: "var(--nx-rose-50)", fg: "var(--nx-rose-700)" },
};

const statusIcon: Record<string, { icon: typeof CheckCircle2; color: string }> = {
  complete: { icon: CheckCircle2, color: "var(--nx-emerald-600)" },
  processing: { icon: RefreshCw, color: "var(--nx-amber-600)" },
  pending: { icon: Clock, color: "var(--nx-neutral-400)" },
};

const stageStatusStyle: Record<string, { bg: string; fg: string }> = {
  completed: { bg: "var(--nx-emerald-600)", fg: "white" },
  current: { bg: "var(--foreground)", fg: "var(--background)" },
  in_progress: { bg: "var(--nx-amber-500)", fg: "white" },
  pending: { bg: "var(--nx-neutral-200)", fg: "var(--nx-neutral-500)" },
};

const agentColor: Record<string, string> = {
  "Entity Agent": "#0D9488", "Document Agent": "#3B82F6", "Screening Agent": "#7C3AED",
  "Regulatory Agent": "#0369A1", "Risk Agent": "#D97706", "Investigation Agent": "#DC2626",
};

const agentStatusLabel: Record<string, { label: string; color: string }> = {
  active: { label: "Active", color: "var(--nx-emerald-600)" },
  completed: { label: "Done", color: "var(--nx-emerald-600)" },
  waiting: { label: "Waiting", color: "var(--nx-amber-600)" },
  idle: { label: "Idle", color: "var(--nx-neutral-400)" },
};

/* ─── Page ─── */

export default function OnboardingConsolePage() {
  const router = useRouter();
  const [expandedCats, setExpandedCats] = useState<Set<string>>(new Set(requirementCategories.map((c) => c.title)));

  const slaRemaining = onboarding.sla.total - onboarding.sla.elapsed;
  const slaPercent = Math.round((onboarding.sla.elapsed / onboarding.sla.total) * 100);
  const dd = ddStyle[onboarding.dueDiligenceLevel.recommended];

  const toggleCat = (title: string) => {
    setExpandedCats((prev) => {
      const next = new Set(prev);
      if (next.has(title)) next.delete(title);
      else next.add(title);
      return next;
    });
  };

  const totalItems = requirementCategories.reduce((s, c) => s + c.totalCount, 0);
  const completedItems = requirementCategories.reduce((s, c) => s + c.completedCount, 0);

  return (
    <div className="space-y-5">
      {/* ─── Back + Header ─── */}
      <div>
        <button onClick={() => router.push("/onboarding")} className="flex items-center gap-1 text-[11px] font-medium text-muted-foreground hover:text-foreground transition-colors mb-3">
          <ArrowLeft className="h-3 w-3" /> Back to onboarding queue
        </button>

        <div className="flex flex-col gap-3 lg:flex-row lg:items-start lg:justify-between">
          <div>
            <div className="flex items-center gap-3">
              <h1 className="text-lg font-bold tracking-tight">{onboarding.entity.name}</h1>
              <span className="text-[10px] font-bold px-1.5 py-0.5 rounded" style={{ backgroundColor: dd.bg, color: dd.fg }}>
                {onboarding.dueDiligenceLevel.recommended}
              </span>
            </div>
            <div className="flex items-center gap-2 mt-1 text-[11px] text-muted-foreground">
              <span className="font-mono">{onboarding.id}</span>
              <span>·</span>
              <span>🇩🇪 {onboarding.entity.jurisdiction}</span>
              <span>·</span>
              <span>{onboarding.entity.type} ({onboarding.entity.subType})</span>
              <span>·</span>
              <span>Started {onboarding.startedAt.split("T")[0].replace("2026-03-23", "Today, 08:30")}</span>
            </div>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            <Button variant="outline" size="sm" className="h-7 text-[10px] font-semibold gap-1.5">
              <ExternalLink className="h-3 w-3" /> Client Portal
            </Button>
            <Button variant="outline" size="sm" className="h-7 text-[10px] font-semibold gap-1.5">
              <Mail className="h-3 w-3" /> Send Reminder
            </Button>
            <Button size="sm" className="h-7 text-[10px] font-semibold gap-1.5">
              <ArrowRight className="h-3 w-3" /> Approve Stage
            </Button>
          </div>
        </div>
      </div>

      {/* ─── Progress + SLA strip ─── */}
      <div className="grid grid-cols-3 lg:grid-cols-6 gap-px bg-border rounded-lg overflow-hidden">
        <div className="bg-card p-3.5">
          <div className="text-[9px] font-bold text-muted-foreground uppercase tracking-widest mb-1.5">Overall Progress</div>
          <div className="flex items-center gap-2">
            <div className="flex-1 h-1.5 bg-muted rounded-full overflow-hidden">
              <div className="h-full bg-foreground rounded-full" style={{ width: `${onboarding.progress}%` }} />
            </div>
            <span className="text-[14px] font-extrabold tabular-nums">{onboarding.progress}%</span>
          </div>
        </div>
        <div className="bg-card p-3.5">
          <div className="text-[9px] font-bold text-muted-foreground uppercase tracking-widest mb-1.5">Requirements</div>
          <div className="text-[14px] font-extrabold tabular-nums">{completedItems}/{totalItems}</div>
          <div className="text-[9px] text-muted-foreground/50">{totalItems - completedItems} remaining</div>
        </div>
        <div className="bg-card p-3.5">
          <div className="text-[9px] font-bold text-muted-foreground uppercase tracking-widest mb-1.5">SLA</div>
          <div className={`text-[14px] font-extrabold tabular-nums ${slaPercent > 75 ? "text-nx-amber-600" : ""}`}>
            {onboarding.sla.elapsed}h / {onboarding.sla.total}h
          </div>
          <div className="text-[9px] text-muted-foreground/50">{slaRemaining.toFixed(1)}h remaining</div>
        </div>
        <div className="bg-card p-3.5">
          <div className="text-[9px] font-bold text-muted-foreground uppercase tracking-widest mb-1.5">Documents</div>
          <div className="text-[14px] font-extrabold tabular-nums">{documentRequirements.filter((d) => d.status === "verified").length}/{documentRequirements.length}</div>
          <div className="text-[9px] text-muted-foreground/50">{documentRequirements.filter((d) => d.status === "processing").length} processing</div>
        </div>
        <div className="bg-card p-3.5">
          <div className="text-[9px] font-bold text-muted-foreground uppercase tracking-widest mb-1.5">UBOs</div>
          <div className="text-[14px] font-extrabold tabular-nums">{discoveredUBOs.length} found</div>
          <div className="text-[9px] text-muted-foreground/50">{discoveredUBOs.filter((u) => u.idDocumentUploaded).length} verified</div>
        </div>
        <div className="bg-card p-3.5">
          <div className="text-[9px] font-bold text-muted-foreground uppercase tracking-widest mb-1.5">AI Prefill</div>
          <div className="text-[14px] font-extrabold tabular-nums">78%</div>
          <div className="text-[9px] text-muted-foreground/50">data automated</div>
        </div>
      </div>

      {/* ─── Stage Pipeline ─── */}
      <div className="rounded-lg border border-border bg-card p-4">
        <div className="text-[9px] font-bold text-muted-foreground uppercase tracking-widest mb-3">Onboarding Stages</div>
        <div className="flex items-center gap-1">
          {stages.map((stage, i) => {
            const st = stageStatusStyle[stage.status];
            return (
              <Fragment key={stage.id}>
                <div className="flex-1 text-center">
                  <div
                    className="h-2 rounded-sm mb-1.5"
                    style={{ backgroundColor: st.bg }}
                  />
                  <div className="text-[9px] font-bold truncate" style={{ color: stage.status === "pending" ? "var(--nx-neutral-400)" : "var(--foreground)" }}>
                    {stage.label}
                  </div>
                  {stage.progress && (
                    <div className="text-[8px] text-muted-foreground/50 mt-0.5">{stage.progress}</div>
                  )}
                </div>
                {i < stages.length - 1 && <div className="w-1 shrink-0" />}
              </Fragment>
            );
          })}
        </div>
      </div>

      {/* ─── Main content: 2-column ─── */}
      <div className="grid gap-5 lg:grid-cols-12">
        {/* Left — Requirements + Documents (8 cols) */}
        <div className="lg:col-span-8 space-y-5">
          {/* Requirements Checklist */}
          <div className="rounded-lg border border-border bg-card overflow-hidden">
            <div className="flex items-center justify-between px-4 py-2.5 border-b border-border">
              <div className="flex items-center gap-2">
                <FileText className="h-3.5 w-3.5 text-muted-foreground/40" />
                <span className="text-[12px] font-bold">KYC Requirements</span>
                <span className="text-[10px] text-muted-foreground tabular-nums">{completedItems}/{totalItems} complete</span>
              </div>
              <div className="flex items-center gap-1 text-[9px] text-muted-foreground">
                <Sparkles className="h-3 w-3" />
                AI confidence: <strong className="text-foreground">{onboarding.dueDiligenceLevel.confidence * 100}%</strong>
              </div>
            </div>

            {requirementCategories.map((cat) => {
              const isOpen = expandedCats.has(cat.title);
              return (
                <div key={cat.title} className="border-b border-border last:border-b-0">
                  <button
                    className="w-full flex items-center justify-between px-4 py-2.5 hover:bg-muted/15 transition-colors text-left"
                    onClick={() => toggleCat(cat.title)}
                  >
                    <div className="flex items-center gap-2">
                      {isOpen ? <ChevronDown className="h-3 w-3 text-muted-foreground/40" /> : <ChevronRight className="h-3 w-3 text-muted-foreground/40" />}
                      <span className="text-[12px] font-semibold">{cat.title}</span>
                      <span className="text-[10px] font-bold tabular-nums text-muted-foreground">{cat.completedCount}/{cat.totalCount}</span>
                      {cat.note && <span className="text-[9px] text-muted-foreground/50 italic">{cat.note}</span>}
                    </div>
                    {/* Mini progress */}
                    <div className="flex items-center gap-2 shrink-0">
                      <div className="w-16 h-1 bg-muted rounded-full overflow-hidden">
                        <div className="h-full bg-foreground rounded-full" style={{ width: `${(cat.completedCount / cat.totalCount) * 100}%` }} />
                      </div>
                    </div>
                  </button>

                  {isOpen && (
                    <div className="px-4 pb-3">
                      <div className="space-y-0.5">
                        {cat.items.map((item) => {
                          const si = statusIcon[item.status] ?? statusIcon.pending;
                          const SI = si.icon;
                          return (
                            <div key={item.id} className="flex items-start gap-3 py-2 px-2 rounded hover:bg-muted/10 transition-colors">
                              <SI className="h-3.5 w-3.5 mt-0.5 shrink-0" style={{ color: si.color }} />
                              <div className="flex-1 min-w-0">
                                <div className="flex items-center gap-2">
                                  <span className="text-[11px] font-medium">{item.label}</span>
                                  {item.source === "ai" && (
                                    <span className="text-[8px] font-bold text-muted-foreground/50 uppercase tracking-wider px-1 py-0.5 bg-muted/50 rounded">AI</span>
                                  )}
                                </div>
                                {item.value && (
                                  <p className="text-[10px] text-muted-foreground mt-0.5">{item.value}</p>
                                )}
                                {item.sourceDetail && (
                                  <p className="text-[9px] text-muted-foreground/40 mt-0.5">Source: {item.sourceDetail}</p>
                                )}
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>

          {/* Documents Table */}
          <div className="rounded-lg border border-border bg-card overflow-hidden">
            <div className="flex items-center justify-between px-4 py-2.5 border-b border-border">
              <div className="flex items-center gap-2">
                <FileText className="h-3.5 w-3.5 text-muted-foreground/40" />
                <span className="text-[12px] font-bold">Documents</span>
                <span className="text-[10px] text-muted-foreground tabular-nums">
                  {documentRequirements.filter((d) => d.status === "verified").length}/{documentRequirements.length} verified
                </span>
              </div>
              <Button variant="outline" size="sm" className="h-6 text-[9px] font-semibold gap-1">
                <Send className="h-2.5 w-2.5" /> Request Missing
              </Button>
            </div>

            <div className="divide-y divide-border">
              {documentRequirements.map((doc) => (
                <div key={doc.id} className="flex items-center gap-3 px-4 py-2.5 hover:bg-muted/10 transition-colors">
                  <div className="shrink-0">
                    {doc.status === "verified" && <CheckCircle2 className="h-3.5 w-3.5 text-nx-emerald-600" />}
                    {doc.status === "processing" && <RefreshCw className="h-3.5 w-3.5 text-nx-amber-600 animate-spin" />}
                    {doc.status === "pending" && <Clock className="h-3.5 w-3.5 text-muted-foreground/40" />}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="text-[11px] font-medium">{doc.name}</div>
                    {doc.localName && <div className="text-[9px] text-muted-foreground/50">{doc.localName}</div>}
                  </div>
                  <div className="shrink-0 text-right">
                    {doc.status === "verified" && (
                      <span className="text-[9px] font-bold text-nx-emerald-600 tabular-nums">{Math.round((doc.aiConfidence ?? 0) * 100)}% verified</span>
                    )}
                    {doc.status === "processing" && doc.processingProgress !== undefined && (
                      <div className="flex items-center gap-1.5">
                        <div className="w-12 h-1 bg-muted rounded-full overflow-hidden">
                          <div className="h-full bg-nx-amber-500 rounded-full" style={{ width: `${doc.processingProgress}%` }} />
                        </div>
                        <span className="text-[9px] font-bold tabular-nums text-nx-amber-600">{doc.processingProgress}%</span>
                      </div>
                    )}
                    {doc.status === "pending" && (
                      <span className="text-[9px] font-bold text-muted-foreground/40">Awaiting</span>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right sidebar (4 cols) */}
        <div className="lg:col-span-4 space-y-5">
          {/* Client Contact */}
          <div className="rounded-lg border border-border bg-card overflow-hidden">
            <div className="px-4 py-2.5 border-b border-border">
              <span className="text-[12px] font-bold">Client</span>
            </div>
            <div className="p-4">
              <div className="flex items-center gap-3 mb-3">
                <div className="h-9 w-9 rounded-full bg-foreground/5 flex items-center justify-center">
                  <span className="text-[11px] font-bold">TW</span>
                </div>
                <div>
                  <div className="text-[12px] font-semibold">{onboarding.client.name}</div>
                  <div className="text-[10px] text-muted-foreground">{onboarding.client.email}</div>
                </div>
              </div>
              <div className="space-y-2 text-[11px]">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Status</span>
                  <span className="flex items-center gap-1 font-medium">
                    <span className="h-1.5 w-1.5 rounded-full bg-nx-emerald-500" />
                    Online now
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Language</span>
                  <span className="font-medium">German (Deutsch)</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Device</span>
                  <span className="font-medium">{onboarding.client.device}</span>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-2 mt-3">
                <Button variant="outline" size="sm" className="h-7 text-[9px] font-semibold gap-1">
                  <Mail className="h-2.5 w-2.5" /> Email
                </Button>
                <Button variant="outline" size="sm" className="h-7 text-[9px] font-semibold gap-1">
                  <MessageSquare className="h-2.5 w-2.5" /> Chat
                </Button>
              </div>
            </div>
          </div>

          {/* Team */}
          <div className="rounded-lg border border-border bg-card overflow-hidden">
            <div className="px-4 py-2.5 border-b border-border">
              <span className="text-[12px] font-bold">Assigned Team</span>
            </div>
            <div className="p-4 space-y-2.5 text-[11px]">
              <div className="flex items-center justify-between">
                <span className="text-muted-foreground">Relationship Manager</span>
                <span className="flex items-center gap-1.5 font-medium">
                  <div className="h-5 w-5 rounded-full bg-foreground/10 flex items-center justify-center text-[8px] font-bold">{onboarding.relationshipManager.initials}</div>
                  {onboarding.relationshipManager.name}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-muted-foreground">Compliance Analyst</span>
                <span className="flex items-center gap-1.5 font-medium">
                  <div className="h-5 w-5 rounded-full bg-foreground/10 flex items-center justify-center text-[8px] font-bold">{onboarding.analyst.initials}</div>
                  {onboarding.analyst.name}
                </span>
              </div>
            </div>
          </div>

          {/* Beneficial Owners */}
          <div className="rounded-lg border border-border bg-card overflow-hidden">
            <div className="flex items-center justify-between px-4 py-2.5 border-b border-border">
              <span className="text-[12px] font-bold">Beneficial Owners</span>
              <span className="text-[10px] text-muted-foreground tabular-nums">{discoveredUBOs.length} discovered</span>
            </div>
            <div className="divide-y divide-border">
              {discoveredUBOs.map((ubo) => (
                <div key={ubo.name} className="px-4 py-2.5">
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="text-[11px] font-semibold">{ubo.name}</div>
                      <div className="text-[9px] text-muted-foreground mt-0.5">
                        {ubo.nationality === "DE" ? "🇩🇪" : ubo.nationality === "AT" ? "🇦🇹" : ""} {ubo.location} · {ubo.ownershipType}
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-[14px] font-extrabold tabular-nums">{ubo.ownership}%</div>
                      <div className="text-[9px]">
                        {ubo.idDocumentUploaded ? (
                          <span className="font-bold text-nx-emerald-600">ID verified</span>
                        ) : (
                          <span className="font-bold text-nx-amber-600">ID pending</span>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* DD Recommendation */}
          <div className="rounded-lg border border-border bg-card overflow-hidden">
            <div className="px-4 py-2.5 border-b border-border">
              <span className="text-[12px] font-bold">Due Diligence Assessment</span>
            </div>
            <div className="p-4">
              <div className="flex items-center gap-2 mb-2">
                <span className="text-[10px] font-bold px-1.5 py-0.5 rounded" style={{ backgroundColor: dd.bg, color: dd.fg }}>
                  {onboarding.dueDiligenceLevel.recommended}
                </span>
                <span className="text-[10px] text-muted-foreground">Recommended</span>
                <span className="text-[10px] font-bold tabular-nums ml-auto">{Math.round(onboarding.dueDiligenceLevel.confidence * 100)}%</span>
              </div>
              <p className="text-[10px] text-muted-foreground leading-relaxed">
                {onboarding.dueDiligenceLevel.reasoning}
              </p>
              <Button variant="outline" size="sm" className="h-6 text-[9px] font-semibold gap-1 mt-3 w-full">
                <Shield className="h-2.5 w-2.5" /> Override DD Level
              </Button>
            </div>
          </div>

          {/* Agent Activity */}
          <div className="rounded-lg border border-border bg-card overflow-hidden">
            <div className="flex items-center justify-between px-4 py-2.5 border-b border-border">
              <div className="flex items-center gap-2">
                <span className="h-1.5 w-1.5 rounded-full bg-nx-emerald-500 animate-pulse" />
                <span className="text-[12px] font-bold">AI Agent Activity</span>
              </div>
              <span className="text-[9px] text-muted-foreground">{agentActivity.filter((a) => a.status === "active").length}/6 active</span>
            </div>
            <div className="divide-y divide-border">
              {agentActivity.map((agent) => {
                const asl = agentStatusLabel[agent.status];
                return (
                  <div key={agent.agent} className="px-4 py-2.5">
                    <div className="flex items-center justify-between mb-1">
                      <div className="flex items-center gap-1.5">
                        <div className="h-1.5 w-1.5 rounded-sm" style={{ backgroundColor: agentColor[agent.agent] ?? "#999" }} />
                        <span className="text-[10px] font-bold">{agent.agent.replace(" Agent", "")}</span>
                      </div>
                      <span className="text-[9px] font-bold" style={{ color: asl.color }}>{asl.label}</span>
                    </div>
                    <p className="text-[10px] text-muted-foreground leading-relaxed">{agent.task}</p>
                    {agent.progress !== undefined && (
                      <div className="flex items-center gap-2 mt-1.5">
                        <div className="flex-1 h-1 bg-muted rounded-full overflow-hidden">
                          <div className="h-full rounded-full" style={{ width: `${agent.progress}%`, backgroundColor: agentColor[agent.agent] ?? "#999" }} />
                        </div>
                        <span className="text-[9px] font-bold tabular-nums">{agent.progress}%</span>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>

          {/* Entity Info */}
          <div className="rounded-lg border border-border bg-card overflow-hidden">
            <div className="px-4 py-2.5 border-b border-border">
              <span className="text-[12px] font-bold">Entity Details</span>
            </div>
            <div className="p-4 space-y-2 text-[11px]">
              {[
                ["Legal Name", onboarding.entity.name],
                ["Type", `${onboarding.entity.type} (${onboarding.entity.subType})`],
                ["Registration", onboarding.entity.registrationNumber],
                ["Jurisdiction", `🇩🇪 ${onboarding.entity.jurisdiction}`],
                ["Incorporated", onboarding.entity.dateOfIncorporation],
                ["Address", onboarding.entity.registeredAddress],
              ].map(([label, value]) => (
                <div key={label as string} className="flex justify-between gap-4">
                  <span className="text-muted-foreground shrink-0">{label}</span>
                  <span className="font-medium text-right">{value}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
