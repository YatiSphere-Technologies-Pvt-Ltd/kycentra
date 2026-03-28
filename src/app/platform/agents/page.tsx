"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import {
  ArrowRight, ArrowLeft,
  Globe, FileSearch, Brain, Newspaper,
  Shield, Activity, BookOpen, BarChart3,
  Search, Workflow, MessageSquare, FileBarChart,
  CheckCircle2, ClipboardCheck, GraduationCap, TrendingUp,
  type LucideIcon,
} from "lucide-react";
import { useState, useRef, useEffect, useCallback } from "react";

/* ─── Data ─── */

interface AgentDef {
  id: string;
  num: string;
  name: string;
  role: string;
  icon: LucideIcon;
  tier: string;
  tierLabel: string;
  oneLiner: string;
  what: string[];
  inputs: string[];
  outputs: string[];
  autonomy: string;
  hitl: string;
  metric: { value: string; label: string };
  model: string;
}

const agents: AgentDef[] = [
  {
    id: "data-sourcing", num: "01", name: "Data Sourcing Agent", role: "Data Acquisition",
    icon: Globe, tier: "1", tierLabel: "Gather",
    oneLiner: "Automated KYC data collection from 200+ public and commercial sources worldwide.",
    what: [
      "Queries corporate registries across 200+ jurisdictions in real-time",
      "Pulls commercial data from Bureau van Dijk, Refinitiv, and Dun & Bradstreet",
      "Cross-references multiple sources to validate accuracy and completeness",
      "Pre-populates onboarding forms with 60–80% of required KYC data",
      "Detects changes in registered data and triggers re-verification workflows",
      "Normalizes entity data across different registry formats and languages",
    ],
    inputs: ["Entity name", "Registration number", "Jurisdiction"],
    outputs: ["Structured entity profile", "Registry extracts", "Change alerts"],
    autonomy: "Fully autonomous for all risk tiers. Human review only when sources conflict.",
    hitl: "Conflicting data from multiple registries",
    metric: { value: "1,247", label: "queries/day" },
    model: "claude-sonnet-4-6",
  },
  {
    id: "document-intel", num: "02", name: "Document Intelligence Agent", role: "Document Processing",
    icon: FileSearch, tier: "1", tierLabel: "Gather",
    oneLiner: "Classifies, extracts, validates, and fraud-checks every document in under 30 seconds.",
    what: [
      "Classifies incoming documents into 40+ categories automatically",
      "Extracts structured data using multi-modal AI — handles scans, photos, PDFs",
      "Validates extracted data against entity records and registry data",
      "Detects document fraud — altered dates, manipulated figures, forged signatures",
      "Tracks document expiry dates and auto-triggers renewal requests",
      "Supports 50+ languages with automatic language detection",
    ],
    inputs: ["Uploaded documents (PDF, images, scans)", "Entity profile for cross-validation"],
    outputs: ["Extracted fields", "Validation results", "Fraud scan results", "Expiry alerts"],
    autonomy: "Auto for low/medium risk. CoPilot for high risk. Manual for fraud detection positives.",
    hitl: "Fraud detection flags, cross-document discrepancies",
    metric: { value: "98%", label: "extraction accuracy" },
    model: "claude-sonnet-4-6",
  },
  {
    id: "entity-intel", num: "03", name: "Entity Intelligence Agent", role: "Corporate Intelligence",
    icon: Brain, tier: "1", tierLabel: "Gather",
    oneLiner: "Recursive UBO discovery through unlimited ownership layers across any jurisdiction.",
    what: [
      "Recursively unwraps corporate ownership structures through unlimited layers",
      "Calculates effective ownership percentages through complex chains",
      "Applies OFAC 50% rule for indirect sanctions exposure assessment",
      "Detects circular ownership patterns, nominee structures, and shell companies",
      "Maps corporate officer networks and identifies shared directorships",
      "Monitors for ownership changes and triggers re-assessment workflows",
    ],
    inputs: ["Entity name and jurisdiction", "Registry data from Data Sourcing Agent"],
    outputs: ["Complete ownership graph", "UBO list with effective percentages", "Anomaly flags"],
    autonomy: "Fully autonomous for discovery. CoPilot for complex structures (>3 layers, trusts).",
    hitl: "PEP in ownership chain, circular ownership detected",
    metric: { value: "96%", label: "UBO accuracy" },
    model: "claude-sonnet-4-6",
  },
  {
    id: "media-intel", num: "04", name: "Media Intelligence Agent", role: "Adverse Media Monitoring",
    icon: Newspaper, tier: "1", tierLabel: "Gather",
    oneLiner: "Continuous adverse media monitoring with semantic analysis across 50+ languages.",
    what: [
      "Monitors 120,000+ news sources, regulatory publications, and court records",
      "Applies semantic analysis to distinguish between subject, witness, and mention",
      "Scores articles using a composite Adverse Media Index (severity, recency, credibility, relevance)",
      "Filters out noise — promotional content, irrelevant mentions, opinion pieces",
      "Tracks sentiment trajectory for entities over time",
      "Supports 50+ languages with automatic translation and context preservation",
    ],
    inputs: ["Entity names and aliases", "Director and UBO names", "Industry context"],
    outputs: ["Scored article matches", "Sentiment analysis", "Adverse Media Index"],
    autonomy: "Auto for noise filtering. CoPilot for articles mentioning entity as subject.",
    hitl: "Corruption, fraud, or sanctions-related articles where entity is the subject",
    metric: { value: "24/7", label: "monitoring" },
    model: "claude-sonnet-4-6",
  },
  {
    id: "screening", num: "05", name: "Screening Agent", role: "Watchlist Intelligence",
    icon: Shield, tier: "2", tierLabel: "Analyze",
    oneLiner: "Continuous sanctions, PEP, and watchlist screening with 85% auto-resolution of false positives.",
    what: [
      "Screens against OFAC SDN/SSI, EU Consolidated, UK HMT, UN, SECO, and 20+ country-specific lists",
      "PEP screening with configurable depth of association (Level 1–4)",
      "Auto-resolves 85% of false positive alerts using full entity context and reasoning chains",
      "Portfolio-wide re-screening triggered automatically on every list update",
      "Network-based screening — screens UBOs, directors, and counterparties",
      "Every resolution decision includes a documented 5-step reasoning chain",
    ],
    inputs: ["Entity profiles", "Sanctions lists (real-time feeds)", "PEP databases"],
    outputs: ["Alert dispositions", "Match comparisons", "Reasoning chains", "Confidence scores"],
    autonomy: "Auto for confidence ≥80%. CoPilot for 60–80%. Manual for OFAC matches (always).",
    hitl: "OFAC matches, PEP confirmations, true positive determinations",
    metric: { value: "85%", label: "auto-resolution" },
    model: "claude-sonnet-4-6",
  },
  {
    id: "risk-scoring", num: "06", name: "Risk Intelligence Agent", role: "Risk Assessment",
    icon: Activity, tier: "2", tierLabel: "Analyze",
    oneLiner: "Dynamic risk scoring with AI-generated narratives, factor breakdown, and trajectory prediction.",
    what: [
      "Computes composite risk scores from 5+ weighted factors (jurisdiction, entity type, UBO complexity, transactions, media)",
      "Generates plain-language risk narratives explaining every score",
      "Predicts risk trajectory — where is this entity's risk heading?",
      "Recalculates scores in real-time when any input changes (new screening result, ownership change, regulatory update)",
      "Benchmarks entities against industry and jurisdiction peer groups",
      "Recommends due diligence level (SDD/CDD/EDD) with regulatory citations",
    ],
    inputs: ["All Tier 1 agent outputs", "Screening results", "Transaction data", "Historical patterns"],
    outputs: ["Risk score (0–100)", "Risk tier", "Factor breakdown", "AI narrative", "DD recommendation"],
    autonomy: "CoPilot for risk elevations. Manual for Critical tier. Auto for stable scores.",
    hitl: "Risk tier changes, DD level upgrades, scores ≥70",
    metric: { value: "92%", label: "auto-rate" },
    model: "claude-opus-4-6",
  },
  {
    id: "regulatory", num: "07", name: "Regulatory Intelligence Agent", role: "Regulatory Monitoring",
    icon: BookOpen, tier: "2", tierLabel: "Analyze",
    oneLiner: "Monitors 120+ jurisdictions in real-time with paragraph-level regulatory citations.",
    what: [
      "Maintains a rules engine covering 1,847 rules across 120+ jurisdictions",
      "Monitors regulatory publications, enforcement actions, and guidance updates daily",
      "Auto-generates impact assessments when regulations change",
      "Maps regulatory requirements to individual entities based on jurisdiction, type, and risk tier",
      "Every compliance decision traces back to a specific regulation paragraph",
      "Supports natural language rule creation — compliance officers write in English, agent translates to executable logic",
    ],
    inputs: ["Regulatory publications", "Entity profiles", "Jurisdiction data"],
    outputs: ["Applicable rules per entity", "Impact assessments", "Rule change alerts", "Citation links"],
    autonomy: "Auto for monitoring and mapping. CoPilot for rule deployment. Manual for rule creation.",
    hitl: "New rule deployment, impact assessment review for high-impact changes",
    metric: { value: "1,847", label: "active rules" },
    model: "claude-opus-4-6",
  },
  {
    id: "behavioral", num: "08", name: "Behavioral Analytics Agent", role: "Transaction Monitoring",
    icon: BarChart3, tier: "2", tierLabel: "Analyze",
    oneLiner: "Real-time transaction monitoring with ML-based anomaly detection and pattern recognition.",
    what: [
      "Monitors transaction flows in real-time against expected behavioral baselines",
      "Detects structuring, layering, round-tripping, and rapid movement patterns",
      "Builds behavioral profiles per entity based on historical transaction patterns",
      "Flags statistical outliers with context — not just numbers, but explanations",
      "Analyzes counterparty networks for suspicious concentration patterns",
      "Adapts baselines dynamically as entity behavior evolves",
    ],
    inputs: ["Transaction feeds (real-time)", "Entity profiles", "Counterparty data", "Historical baselines"],
    outputs: ["Anomaly alerts", "Behavioral profile updates", "Pattern analysis reports"],
    autonomy: "Auto for baseline updates. CoPilot for anomaly alerts. Manual for SAR-triggering patterns.",
    hitl: "Alerts exceeding materiality thresholds, structuring patterns",
    metric: { value: "Real-time", label: "monitoring" },
    model: "claude-sonnet-4-6",
  },
  {
    id: "investigation", num: "09", name: "Investigation Agent", role: "Case Management",
    icon: Search, tier: "3", tierLabel: "Act",
    oneLiner: "Auto-assembles case briefs, constructs evidence chains, and drafts SAR narratives.",
    what: [
      "Auto-generates comprehensive investigation briefs from all agent findings",
      "Constructs evidence chains linking every finding to its source document or data point",
      "Drafts SAR narratives in FinCEN-compliant WHO/WHAT/WHEN/WHERE/WHY/HOW format",
      "Surfaces historical precedent — similar cases and their outcomes",
      "Identifies gaps in evidence and recommends next investigative steps",
      "Maintains a quality checklist ensuring SAR completeness before submission",
    ],
    inputs: ["All agent outputs for the entity", "Historical case database", "Regulatory templates"],
    outputs: ["Case brief", "Evidence chain", "SAR narrative draft", "Recommended next steps"],
    autonomy: "CoPilot for case assembly. Manual for SAR filing decisions (always).",
    hitl: "SAR filing decision, case disposition, evidence assessment",
    metric: { value: "78%", label: "SAR draft acceptance" },
    model: "claude-opus-4-6",
  },
  {
    id: "orchestrator", num: "10", name: "Workflow Orchestrator Agent", role: "Process Coordination",
    icon: Workflow, tier: "3", tierLabel: "Act",
    oneLiner: "Dynamic multi-agent workflow coordination with parallel execution and adaptive routing.",
    what: [
      "Generates optimal workflow sequences based on entity type, jurisdiction, and risk tier",
      "Coordinates parallel agent execution — Tier 1 agents work simultaneously, not sequentially",
      "Adapts workflows in real-time based on agent findings (e.g., PEP detected → add EDD steps)",
      "Manages the shared context bus — ensuring agents receive relevant updates instantly",
      "Handles task prioritization, queue management, and SLA tracking",
      "Supports 6 orchestration patterns: fan-out, pipeline, cascade, monitoring loop, HITL checkpoint, feedback loop",
    ],
    inputs: ["Workflow templates", "Entity metadata", "Agent status and capacity"],
    outputs: ["Workflow instances", "Task assignments", "SLA tracking", "Completion reports"],
    autonomy: "Fully autonomous. Orchestration decisions don't require human approval.",
    hitl: "None — the orchestrator manages flow; individual agents handle HITL checkpoints",
    metric: { value: "47", label: "active workflows" },
    model: "claude-sonnet-4-6",
  },
  {
    id: "client-comms", num: "11", name: "Client Communication Agent", role: "Client Interface",
    icon: MessageSquare, tier: "3", tierLabel: "Act",
    oneLiner: "Multilingual client portal management with adaptive KYC data collection.",
    what: [
      "Manages the client-facing onboarding portal — adaptive forms that ask only for what's missing",
      "Generates follow-up requests in the client's language with clear explanations of why each item is needed",
      "Tracks client responsiveness and sends intelligent reminders based on behavioral patterns",
      "Provides real-time status updates to clients on their onboarding progress",
      "Supports 15+ languages with automatic content localization",
      "Reduces client outreach by 60% through pre-population and intelligent sequencing",
    ],
    inputs: ["Onboarding requirements", "Client profile", "Language preferences"],
    outputs: ["Portal content", "Follow-up communications", "Status updates"],
    autonomy: "Fully autonomous for standard communications. CoPilot for escalation messages.",
    hitl: "Account restriction notices, relationship exit communications",
    metric: { value: "15+", label: "languages" },
    model: "claude-sonnet-4-6",
  },
  {
    id: "reporting", num: "12", name: "Reporting Agent", role: "Regulatory Reporting",
    icon: FileBarChart, tier: "3", tierLabel: "Act",
    oneLiner: "Automated regulatory filings, compliance dashboards, and board-ready reports.",
    what: [
      "Generates SAR/STR/CTR filings in jurisdiction-specific formats",
      "Produces board-ready compliance reports with KPI dashboards",
      "Creates regulatory examination packages on demand — assembles all documentation a regulator needs",
      "Schedules and auto-generates periodic compliance reports",
      "Exports audit trails, agent performance metrics, and decision logs",
      "Supports FinCEN, FCA, BaFin, MAS, and 20+ regulatory filing formats",
    ],
    inputs: ["Case data", "Agent metrics", "Entity portfolios", "Regulatory templates"],
    outputs: ["Filed reports", "Board presentations", "Examination packages", "Dashboard data"],
    autonomy: "Auto for dashboard generation. CoPilot for regulatory filings. Manual for board reports.",
    hitl: "SAR filing submission, board report approval",
    metric: { value: "One-click", label: "SAR filing" },
    model: "claude-sonnet-4-6",
  },
  {
    id: "qa", num: "13", name: "Quality Assurance Agent", role: "Decision Quality",
    icon: CheckCircle2, tier: "4", tierLabel: "Govern",
    oneLiner: "Continuous decision sampling, accuracy drift detection, and consistency monitoring.",
    what: [
      "Samples agent decisions for quality review — configurable sampling rates per agent and risk tier",
      "Detects accuracy drift using statistical methods (Kolmogorov-Smirnov test)",
      "Monitors inter-agent consistency — do agents agree when analyzing the same entity?",
      "Identifies patterns in human overrides — where do agents systematically get it wrong?",
      "Generates quality scorecards for each agent on a daily/weekly basis",
      "Triggers automatic model retraining recommendations when drift exceeds thresholds",
    ],
    inputs: ["Agent decisions", "Human override data", "Historical accuracy baselines"],
    outputs: ["Quality scores", "Drift alerts", "Override pattern analysis", "Retraining recommendations"],
    autonomy: "Fully autonomous. QA runs continuously without human triggers.",
    hitl: "None — QA reports findings; humans decide on remediation",
    metric: { value: "99.5%", label: "system accuracy" },
    model: "claude-sonnet-4-6",
  },
  {
    id: "audit", num: "14", name: "Audit & Compliance Agent", role: "Audit Management",
    icon: ClipboardCheck, tier: "4", tierLabel: "Govern",
    oneLiner: "Immutable, cryptographically sealed audit trails for every decision in the platform.",
    what: [
      "Logs every agent action, human decision, and configuration change immutably",
      "Seals audit blocks with SHA-256 cryptographic hashes for tamper-proof verification",
      "Validates regulatory compliance of agent decisions against applicable rules",
      "Generates examination-ready audit packages for regulators on demand",
      "Tracks data lineage — from raw input through agent processing to final decision",
      "Maintains model version records, training data provenance, and configuration history",
    ],
    inputs: ["All agent actions", "Human decisions", "Configuration changes"],
    outputs: ["Sealed audit entries", "Compliance validation results", "Examination packages"],
    autonomy: "Fully autonomous. Audit logging cannot be paused or overridden.",
    hitl: "None — audit trail is immutable by design",
    metric: { value: "100%", label: "actions logged" },
    model: "claude-sonnet-4-6",
  },
  {
    id: "training", num: "15", name: "Training & Knowledge Agent", role: "Knowledge Management",
    icon: GraduationCap, tier: "4", tierLabel: "Govern",
    oneLiner: "Institutional knowledge engine that learns from every decision and guides analysts.",
    what: [
      "Captures institutional knowledge from analyst decisions, overrides, and case outcomes",
      "Provides contextual guidance to analysts — surfaces relevant policies, precedent, and best practices",
      "Generates onboarding materials for new compliance staff based on institutional patterns",
      "Identifies knowledge gaps — topics where analysts frequently need help or make errors",
      "Maintains a searchable knowledge base of compliance decisions and their rationale",
      "Adapts guidance based on analyst experience level (junior vs. senior)",
    ],
    inputs: ["Historical decisions", "Analyst interactions", "Policy documents", "Case outcomes"],
    outputs: ["Contextual guidance", "Knowledge base articles", "Training recommendations"],
    autonomy: "Fully autonomous for knowledge capture. CoPilot for guidance delivery.",
    hitl: "Policy document updates, institutional knowledge corrections",
    metric: { value: "Continuous", label: "learning" },
    model: "claude-opus-4-6",
  },
  {
    id: "forecasting", num: "16", name: "Forecasting & Capacity Agent", role: "Resource Optimization",
    icon: TrendingUp, tier: "4", tierLabel: "Govern",
    oneLiner: "Workload prediction, resource optimization, and capacity planning for compliance operations.",
    what: [
      "Predicts workload 7 days ahead — anticipated screening volumes, review backlogs, onboarding surges",
      "Recommends staffing adjustments based on predicted demand and SLA requirements",
      "Identifies operational bottlenecks before they cause SLA breaches",
      "Analyzes seasonal patterns — quarter-end surges, regulatory filing deadlines, list update cycles",
      "Optimizes agent resource allocation — which agents need more capacity, which are underutilized",
      "Projects compliance costs based on portfolio growth and regulatory complexity trends",
    ],
    inputs: ["Historical workload data", "Calendar events", "Portfolio metrics", "Agent capacity"],
    outputs: ["7-day workload forecast", "Staffing recommendations", "Bottleneck alerts", "Cost projections"],
    autonomy: "Fully autonomous for forecasting. Recommendations are advisory — humans decide on staffing.",
    hitl: "None — forecasts are informational, not decisional",
    metric: { value: "7-day", label: "forecast horizon" },
    model: "claude-sonnet-4-6",
  },
];

const tierMeta: Record<string, { label: string; shade: string }> = {
  "1": { label: "Gather", shade: "#f7f7f7" },
  "2": { label: "Analyze", shade: "#f0f0f0" },
  "3": { label: "Act", shade: "#e8e8e8" },
  "4": { label: "Govern", shade: "#e0e0e0" },
};

/* ─── Component ─── */

export default function AgentsPage() {
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const selected = agents.find((a) => a.id === selectedId);
  const detailRef = useRef<HTMLDivElement>(null);

  const handleSelect = useCallback((id: string) => {
    const next = selectedId === id ? null : id;
    setSelectedId(next);
  }, [selectedId]);

  // Auto-scroll to detail panel when it opens
  useEffect(() => {
    if (selected && detailRef.current) {
      setTimeout(() => {
        detailRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
      }, 100);
    }
  }, [selected]);

  return (
    <div className="min-h-screen bg-white">
      {/* ─── Nav ─── */}
      <nav className="fixed top-0 inset-x-0 z-50 bg-white/90 backdrop-blur-2xl shadow-[0_1px_0_rgba(0,0,0,0.06)]">
        <div className="mx-auto max-w-300 flex h-14 items-center justify-between px-6">
          <Link href="/" className="flex items-center gap-2.5">
            <div className="h-6 w-6 rounded bg-[#0a0a0a] flex items-center justify-center">
              <span className="text-[9px] font-black text-white leading-none">Ag</span>
            </div>
            <span className="text-[14px] font-semibold text-[#0a0a0a] tracking-tight">Agentic</span>
          </Link>
          <Link href="/" className="text-[13px] font-medium text-[#999] hover:text-[#0a0a0a] flex items-center gap-1">
            <ArrowLeft className="h-3.5 w-3.5" />
            Back to home
          </Link>
        </div>
      </nav>

      {/* ─── Hero ─── */}
      <section className="bg-[#0a0a0a] pt-28 pb-20 lg:pt-36 lg:pb-28">
        <div className="mx-auto max-w-300 px-6">
          <div className="flex items-center gap-3 mb-8">
            <div className="h-px w-10 bg-[#333]" />
            <span className="text-[10px] font-semibold text-[#666] uppercase tracking-[0.3em]">
              The Agent Architecture
            </span>
          </div>

          <h1 className="text-[clamp(2.4rem,5vw,4.5rem)] font-extrabold text-white tracking-[-0.04em] leading-[0.95] max-w-3xl">
            Sixteen specialists.
            <br />
            One unified
            <br />
            <span className="text-[#333]">intelligence.</span>
          </h1>

          <p className="mt-8 text-[16px] text-[#666] leading-[1.75] max-w-xl">
            Each agent is purpose-built for a specific compliance domain.
            They work independently, communicate through a shared context bus,
            and together deliver compound intelligence no single system could achieve.
          </p>

          <div className="mt-10 flex items-center gap-6">
            {Object.entries(tierMeta).map(([num, meta]) => (
              <div key={num} className="flex items-center gap-2">
                <span className="text-[18px] font-black text-[#222] tabular-nums">{num.padStart(2, "0")}</span>
                <span className="text-[10px] font-bold text-[#555] uppercase tracking-[0.2em]">{meta.label}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ─── Agent grid ─── */}
      <section className="bg-[#fafafa] py-16 lg:py-24">
        <div className="mx-auto max-w-300 px-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-px bg-[#e5e5e5] rounded-xl overflow-hidden">
            {agents.map((agent) => {
              const Icon = agent.icon;
              const isActive = selectedId === agent.id;
              return (
                <button
                  key={agent.id}
                  onClick={() => handleSelect(agent.id)}
                  className={`relative text-left p-6 transition-all duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] group overflow-hidden ${
                    isActive ? "bg-[#0a0a0a]" : "bg-white hover:bg-[#0a0a0a]"
                  }`}
                >
                  {!isActive && (
                    <div className="absolute inset-0 bg-[#0a0a0a] origin-bottom scale-y-0 group-hover:scale-y-100 transition-transform duration-500 ease-[cubic-bezier(0.22,1,0.36,1)]" />
                  )}
                  <div className="relative z-10">
                    <div className="flex items-center justify-between mb-4">
                      <span className={`text-[32px] font-black tabular-nums leading-none tracking-tighter transition-colors duration-500 ${isActive ? "text-[#222]" : "text-[#eee] group-hover:text-[#222]"}`}>
                        {agent.num}
                      </span>
                      <span className={`text-[9px] font-bold uppercase tracking-[0.2em] transition-colors duration-500 ${isActive ? "text-[#555]" : "text-[#ccc] group-hover:text-[#555]"}`}>
                        {agent.tierLabel}
                      </span>
                    </div>
                    <div className={`h-10 w-10 rounded-lg flex items-center justify-center mb-4 transition-colors duration-500 ${isActive ? "bg-white/10" : "bg-[#f5f5f5] group-hover:bg-white/10"}`}>
                      <Icon className={`h-5 w-5 transition-colors duration-500 ${isActive ? "text-white" : "text-[#999] group-hover:text-white"}`} />
                    </div>
                    <h3 className={`text-[14px] font-bold mb-1 transition-colors duration-500 ${isActive ? "text-white" : "text-[#0a0a0a] group-hover:text-white"}`}>
                      {agent.name}
                    </h3>
                    <p className={`text-[11px] font-medium mb-3 transition-colors duration-500 ${isActive ? "text-[#666]" : "text-[#aaa] group-hover:text-[#666]"}`}>
                      {agent.role}
                    </p>
                    <div className="flex items-baseline gap-1">
                      <span className={`text-[16px] font-extrabold tabular-nums transition-colors duration-500 ${isActive ? "text-white" : "text-[#0a0a0a] group-hover:text-white"}`}>
                        {agent.metric.value}
                      </span>
                      <span className={`text-[10px] font-medium transition-colors duration-500 ${isActive ? "text-[#555]" : "text-[#bbb] group-hover:text-[#555]"}`}>
                        {agent.metric.label}
                      </span>
                    </div>
                  </div>
                </button>
              );
            })}
          </div>

          {/* ─── Detail panel ─── */}
          {selected && (
            <div ref={detailRef} className="mt-6 scroll-mt-20">
              {/* Offset shadow */}
              <div className="relative">
                <div className="absolute inset-0 bg-[#111] rounded-xl translate-x-1 translate-y-1" />

                <div className="relative bg-[#0a0a0a] rounded-xl overflow-hidden">
                  {/* ── Header band ── */}
                  <div className="border-b border-[#1a1a1a]">
                    <div className="grid lg:grid-cols-[1fr_auto] items-start">
                      {/* Agent identity */}
                      <div className="p-8 lg:p-10 flex gap-5 items-start">
                        {/* Large number */}
                        <span className="text-[72px] font-black text-[#151515] tabular-nums leading-none tracking-tighter shrink-0 hidden lg:block">
                          {selected.num}
                        </span>
                        <div className="pt-1">
                          <div className="flex items-center gap-3 mb-2">
                            <h2 className="text-[24px] font-extrabold text-white tracking-tight">{selected.name}</h2>
                          </div>
                          <div className="flex items-center gap-2 mb-4">
                            <span className="text-[10px] font-bold text-[#444] uppercase tracking-[0.2em] px-2 py-0.5 bg-[#151515] rounded">
                              Tier {selected.tier}: {selected.tierLabel}
                            </span>
                            <span className="text-[10px] font-bold text-[#444] uppercase tracking-[0.2em] px-2 py-0.5 bg-[#151515] rounded">
                              {selected.role}
                            </span>
                            <span className="text-[10px] font-bold text-[#444] uppercase tracking-[0.2em] px-2 py-0.5 bg-[#151515] rounded">
                              {selected.model}
                            </span>
                          </div>
                          <p className="text-[15px] text-[#888] leading-[1.7] max-w-2xl">
                            {selected.oneLiner}
                          </p>
                        </div>
                      </div>

                      {/* Close + key metric */}
                      <div className="p-8 lg:p-10 text-right shrink-0">
                        <button
                          onClick={() => setSelectedId(null)}
                          className="text-[11px] font-medium text-[#444] hover:text-white transition-colors mb-6 block ml-auto"
                        >
                          Close ×
                        </button>
                        <div className="text-[36px] font-extrabold text-white tabular-nums leading-none">
                          {selected.metric.value}
                        </div>
                        <div className="text-[10px] font-semibold text-[#444] uppercase tracking-[0.15em] mt-1">
                          {selected.metric.label}
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* ── Body ── */}
                  <div className="grid lg:grid-cols-12">
                    {/* Left — Capabilities (8 cols) */}
                    <div className="lg:col-span-8 p-8 lg:p-10 border-r border-[#1a1a1a]">
                      <h3 className="text-[10px] font-bold text-[#555] uppercase tracking-[0.25em] mb-6">
                        Capabilities
                      </h3>
                      <div className="grid sm:grid-cols-2 gap-4">
                        {selected.what.map((item, i) => (
                          <div key={i} className="flex gap-3 items-start">
                            <div className="h-7 w-7 rounded bg-[#151515] flex items-center justify-center shrink-0 mt-0.5">
                              <span className="text-[10px] font-black text-[#444] tabular-nums">
                                {String(i + 1).padStart(2, "0")}
                              </span>
                            </div>
                            <p className="text-[13px] text-[#777] leading-[1.65]">{item}</p>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Right — Specs (4 cols) */}
                    <div className="lg:col-span-4">
                      {/* Inputs / Outputs */}
                      <div className="p-6 lg:p-8 border-b border-[#1a1a1a]">
                        <div className="grid grid-cols-2 gap-6">
                          <div>
                            <h4 className="text-[9px] font-bold text-[#555] uppercase tracking-[0.25em] mb-3">Inputs</h4>
                            {selected.inputs.map((inp) => (
                              <div key={inp} className="flex items-start gap-1.5 mb-1.5">
                                <span className="text-[10px] text-[#444] mt-px">→</span>
                                <span className="text-[11px] text-[#777] leading-snug">{inp}</span>
                              </div>
                            ))}
                          </div>
                          <div>
                            <h4 className="text-[9px] font-bold text-[#555] uppercase tracking-[0.25em] mb-3">Outputs</h4>
                            {selected.outputs.map((out) => (
                              <div key={out} className="flex items-start gap-1.5 mb-1.5">
                                <span className="text-[10px] text-[#444] mt-px">←</span>
                                <span className="text-[11px] text-[#777] leading-snug">{out}</span>
                              </div>
                            ))}
                          </div>
                        </div>
                      </div>

                      {/* Autonomy */}
                      <div className="p-6 lg:p-8 border-b border-[#1a1a1a]">
                        <h4 className="text-[9px] font-bold text-[#555] uppercase tracking-[0.25em] mb-3">Autonomy Mode</h4>
                        <p className="text-[12px] text-[#777] leading-[1.65]">{selected.autonomy}</p>
                      </div>

                      {/* Human checkpoint */}
                      <div className="p-6 lg:p-8">
                        <h4 className="text-[9px] font-bold text-[#555] uppercase tracking-[0.25em] mb-3">Human Checkpoint</h4>
                        <p className="text-[12px] text-[#777] leading-[1.65]">{selected.hitl}</p>
                      </div>
                    </div>
                  </div>

                  {/* ── Bottom navigation — prev/next agent ── */}
                  <div className="border-t border-[#1a1a1a] grid grid-cols-2">
                    {(() => {
                      const idx = agents.findIndex((a) => a.id === selected.id);
                      const prev = idx > 0 ? agents[idx - 1] : null;
                      const next = idx < agents.length - 1 ? agents[idx + 1] : null;
                      return (
                        <>
                          <button
                            onClick={() => prev && handleSelect(prev.id)}
                            disabled={!prev}
                            className="flex items-center gap-3 px-8 py-5 text-left hover:bg-[#111] transition-colors disabled:opacity-30 disabled:cursor-default"
                          >
                            <ArrowLeft className="h-4 w-4 text-[#555]" />
                            <div>
                              <div className="text-[9px] font-bold text-[#555] uppercase tracking-[0.2em]">Previous</div>
                              <div className="text-[13px] font-semibold text-[#999]">{prev?.name ?? "—"}</div>
                            </div>
                          </button>
                          <button
                            onClick={() => next && handleSelect(next.id)}
                            disabled={!next}
                            className="flex items-center justify-end gap-3 px-8 py-5 text-right hover:bg-[#111] transition-colors border-l border-[#1a1a1a] disabled:opacity-30 disabled:cursor-default"
                          >
                            <div>
                              <div className="text-[9px] font-bold text-[#555] uppercase tracking-[0.2em]">Next</div>
                              <div className="text-[13px] font-semibold text-[#999]">{next?.name ?? "—"}</div>
                            </div>
                            <ArrowRight className="h-4 w-4 text-[#555]" />
                          </button>
                        </>
                      );
                    })()}
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </section>

      {/* ─── CTA ─── */}
      <section className="bg-[#0a0a0a] py-20">
        <div className="mx-auto max-w-300 px-6 text-center">
          <h2 className="text-[clamp(1.6rem,3vw,2.4rem)] font-extrabold text-white tracking-[-0.03em]">
            See all 16 agents in action.
          </h2>
          <p className="mt-3 text-[14px] text-[#666]">
            30-minute personalized demo with your compliance data.
          </p>
          <div className="mt-8 flex justify-center gap-3">
            <Link href="/dashboard">
              <Button className="h-11 px-7 text-[13px] font-semibold bg-white text-[#0a0a0a] hover:bg-[#e5e5e5] rounded-lg gap-2">
                Book a demo
                <ArrowRight className="h-4 w-4" />
              </Button>
            </Link>
          </div>
        </div>
      </section>

      <footer className="bg-[#0a0a0a] border-t border-[#1a1a1a] py-6">
        <div className="mx-auto max-w-300 px-6 flex items-center justify-between">
          <span className="text-[11px] text-[#333]">&copy; {new Date().getFullYear()} Agentic KYC & CLM Pro</span>
          <Link href="/" className="text-[11px] text-[#444] hover:text-white transition-colors">← Home</Link>
        </div>
      </footer>
    </div>
  );
}
