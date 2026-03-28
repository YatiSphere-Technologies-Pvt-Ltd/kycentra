"use client";

import {
  FileSearch, Brain, Shield, Activity, BookOpen, Search,
  Newspaper, BarChart3, Workflow, MessageSquare, FileBarChart,
  CheckCircle2, ClipboardCheck, GraduationCap, TrendingUp, Globe,
  ChevronRight,
} from "lucide-react";
import { type LucideIcon } from "lucide-react";

interface Agent {
  icon: LucideIcon;
  name: string;
  desc: string;
}

interface Tier {
  num: string;
  label: string;
  tagline: string;
  shade: string;       // bg shade for left panel
  shadeNum: string;    // shade for the large number
  shadeLabel: string;  // shade for the label text
  agents: Agent[];
}

const tiers: Tier[] = [
  {
    num: "01",
    label: "Gather",
    tagline: "Ingest raw data from every source",
    shade: "#f7f7f7",
    shadeNum: "#e0e0e0",
    shadeLabel: "#0a0a0a",
    agents: [
      { icon: Globe, name: "Data Sourcing", desc: "200+ corporate registries & commercial databases" },
      { icon: FileSearch, name: "Document Intelligence", desc: "Classify, extract, validate in <30 seconds" },
      { icon: Brain, name: "Entity Intelligence", desc: "Recursive UBO discovery, unlimited depth" },
      { icon: Newspaper, name: "Media Intelligence", desc: "Adverse media in 50+ languages, 24/7" },
    ],
  },
  {
    num: "02",
    label: "Analyze",
    tagline: "Interpret, score, and classify",
    shade: "#f0f0f0",
    shadeNum: "#d0d0d0",
    shadeLabel: "#1a1a1a",
    agents: [
      { icon: Shield, name: "Screening", desc: "Sanctions, PEP, watchlists — 85% auto-resolved" },
      { icon: Activity, name: "Risk Scoring", desc: "Dynamic scoring with narrative explanations" },
      { icon: BookOpen, name: "Regulatory", desc: "120+ jurisdictions, paragraph-level citations" },
      { icon: BarChart3, name: "Behavioral Analytics", desc: "Transaction monitoring, anomaly detection" },
    ],
  },
  {
    num: "03",
    label: "Act",
    tagline: "Execute workflows, draft decisions",
    shade: "#e8e8e8",
    shadeNum: "#c0c0c0",
    shadeLabel: "#222",
    agents: [
      { icon: Search, name: "Investigation", desc: "Case briefs, evidence chains, SAR drafts" },
      { icon: Workflow, name: "Orchestrator", desc: "Dynamic multi-agent workflow coordination" },
      { icon: MessageSquare, name: "Client Comms", desc: "Multilingual portal, adaptive collection" },
      { icon: FileBarChart, name: "Reporting", desc: "Regulatory filings and board reports" },
    ],
  },
  {
    num: "04",
    label: "Govern",
    tagline: "Monitor, audit, and optimize",
    shade: "#e0e0e0",
    shadeNum: "#b0b0b0",
    shadeLabel: "#333",
    agents: [
      { icon: CheckCircle2, name: "Quality Assurance", desc: "Decision sampling, drift detection" },
      { icon: ClipboardCheck, name: "Audit & Compliance", desc: "Immutable cryptographic audit trails" },
      { icon: GraduationCap, name: "Training & Knowledge", desc: "Institutional knowledge engine" },
      { icon: TrendingUp, name: "Forecasting", desc: "Workload prediction, capacity planning" },
    ],
  },
];

function TierSection({ tier, isLast, tierIndex }: { tier: Tier; isLast: boolean; tierIndex: number }) {
  return (
    <div className="relative">
      <div className="grid lg:grid-cols-[260px_1fr] gap-0">
        {/* Left — Tier identity, progressively darker shade */}
        <div
          className="relative p-6 lg:p-8 flex flex-col justify-between border-b border-[#e0e0e0]"
          style={{ backgroundColor: tier.shade }}
        >
          <span
            className="text-[72px] lg:text-[88px] font-black leading-none tracking-tighter"
            style={{ color: tier.shadeNum }}
          >
            {tier.num}
          </span>

          <div className="mt-auto">
            <div
              className="text-[13px] font-extrabold uppercase tracking-[0.15em]"
              style={{ color: tier.shadeLabel }}
            >
              {tier.label}
            </div>
            <p className="text-[12px] text-[#888] mt-1 leading-relaxed">
              {tier.tagline}
            </p>
          </div>
        </div>

        {/* Right — Agent cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4">
          {tier.agents.map((agent, aidx) => {
            const Icon = agent.icon;
            const agentNum = tierIndex * 4 + aidx + 1;
            return (
              <div
                key={agent.name}
                className="relative p-5 lg:p-6 border-l border-b border-[#ebebeb] bg-white group cursor-pointer overflow-hidden transition-[background-color] duration-500 ease-out hover:bg-[#0a0a0a]"
              >
                {/* Sweep fill — bottom to top on hover */}
                <div className="absolute inset-0 bg-[#0a0a0a] origin-bottom scale-y-0 group-hover:scale-y-100 transition-transform duration-500 ease-[cubic-bezier(0.22,1,0.36,1)]" />

                {/* Content — sits above the sweep */}
                <div className="relative z-10">
                  <div className="h-9 w-9 rounded-md bg-[#f5f5f5] group-hover:bg-white/10 flex items-center justify-center mb-4 transition-colors duration-500 ease-out">
                    <Icon className="h-4 w-4 text-[#999] group-hover:text-white transition-colors duration-500 ease-out group-hover:scale-110 transform" />
                  </div>

                  <h3 className="text-[13px] font-bold text-[#0a0a0a] group-hover:text-white transition-colors duration-500 ease-out mb-1">
                    {agent.name}
                  </h3>
                  <p className="text-[11px] text-[#888] group-hover:text-[#999] leading-[1.6] transition-colors duration-500 ease-out">
                    {agent.desc}
                  </p>
                </div>

                {/* Agent number — becomes visible on hover */}
                <div className="absolute bottom-4 right-5 text-[10px] font-bold text-[#e5e5e5] group-hover:text-[#333] tabular-nums transition-colors duration-500 ease-out z-10">
                  {String(agentNum).padStart(2, "0")}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Flow connector */}
      {!isLast && (
        <div className="flex items-center justify-center py-1.5 bg-white">
          <ChevronRight className="h-3 w-3 text-[#ccc] rotate-90" />
        </div>
      )}
    </div>
  );
}

export function Features() {
  return (
    <section id="features" className="bg-white py-24 lg:py-32">
      <div className="mx-auto max-w-300 px-6">
        {/* Header */}
        <div className="grid lg:grid-cols-12 gap-6 mb-16 lg:mb-20">
          <div className="lg:col-span-5">
            <p className="text-[11px] font-semibold text-[#999] uppercase tracking-[0.25em] mb-4">
              Platform Architecture
            </p>
            <h2 className="text-[clamp(1.8rem,3.5vw,2.8rem)] font-extrabold text-[#0a0a0a] tracking-[-0.03em] leading-[1.08]">
              16 agents.
              <br />
              4 tiers.
              <br />
              <span className="text-[#ccc]">One system.</span>
            </h2>
          </div>
          <div className="lg:col-span-7 flex items-end">
            <div className="max-w-lg">
              <p className="text-[15px] text-[#666] leading-[1.75]">
                Data flows down through four tiers — gathered, analyzed, acted upon,
                and governed — with every agent publishing findings to a shared context
                bus. The result: compound intelligence that gets smarter with every
                entity in your portfolio.
              </p>
              {/* Flow legend — monochrome shades */}
              <div className="mt-5 flex items-center gap-4">
                {tiers.map((t) => (
                  <div key={t.num} className="flex items-center gap-1.5">
                    <div className="h-3 w-3 rounded-sm" style={{ backgroundColor: t.shade, border: "1px solid #ddd" }} />
                    <span className="text-[10px] font-bold text-[#888] uppercase tracking-[0.12em]">
                      {t.label}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Tier system */}
        <div className="border border-[#e5e5e5] rounded-xl overflow-hidden">
          {tiers.map((tier, i) => (
            <TierSection key={tier.num} tier={tier} isLast={i === tiers.length - 1} tierIndex={i} />
          ))}
        </div>

        {/* Context bus */}
        <div className="mt-6 relative">
          <div className="absolute inset-0 bg-[#111] rounded-xl translate-x-1 translate-y-1" />

          <div className="relative bg-[#0a0a0a] rounded-xl overflow-hidden">
            {/* Top accent — monochrome gradient from light to dark */}
            <div className="flex h-1">
              <div className="flex-1 bg-[#555]" />
              <div className="flex-1 bg-[#444]" />
              <div className="flex-1 bg-[#333]" />
              <div className="flex-1 bg-[#222]" />
            </div>

            <div className="p-6 lg:p-8">
              <div className="grid lg:grid-cols-[1fr_320px] gap-8 items-center">
                <div>
                  <div className="flex items-center gap-2 mb-3">
                    <div className="h-1.5 w-1.5 rounded-full bg-white shadow-[0_0_6px_rgba(255,255,255,0.4)]" />
                    <p className="text-[10px] font-bold text-[#555] uppercase tracking-[0.25em]">
                      Shared Context Bus — Always Active
                    </p>
                  </div>
                  <h3 className="text-[17px] font-bold text-white leading-snug mb-2">
                    Every agent sees what every other agent knows.
                  </h3>
                  <p className="text-[13px] text-[#666] leading-[1.7]">
                    When the Screening Agent finds a PEP match, the Risk Agent
                    recalculates the score, the Investigation Agent starts assembling
                    a brief, and the Regulatory Agent maps EDD requirements — all
                    within seconds, with zero human orchestration.
                  </p>
                </div>

                <div className="grid grid-cols-2 gap-px bg-[#1a1a1a] rounded-lg overflow-hidden">
                  {[
                    { v: "847", u: "/min", l: "Bus messages" },
                    { v: "<200", u: "ms", l: "Agent latency" },
                    { v: "234", u: "/day", l: "Agent handoffs" },
                    { v: "16", u: "→1", l: "Unified context" },
                  ].map((s) => (
                    <div key={s.l} className="bg-[#0a0a0a] p-4">
                      <div className="flex items-baseline gap-0.5">
                        <span className="text-[20px] font-extrabold text-white tabular-nums leading-none">{s.v}</span>
                        <span className="text-[11px] font-medium text-[#555]">{s.u}</span>
                      </div>
                      <div className="text-[9px] font-semibold text-[#444] uppercase tracking-[0.15em] mt-1.5">{s.l}</div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
