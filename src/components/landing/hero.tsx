"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";
import { useEffect, useState } from "react";

const feed = [
  { agent: "Screening Agent", text: "Auto-resolved 3 OFAC alerts for Deutsche Industriebank AG — false positive", ts: "2s" },
  { agent: "Entity Agent", text: "Discovered 4 UBOs across 5 jurisdictions for Northwind Holdings Group", ts: "8s" },
  { agent: "Document Agent", text: "Verified board resolution for Helios Asset Management GmbH", ts: "14s" },
  { agent: "Risk Agent", text: "Elevated risk 58→72 for Horizon Trading LLC — PEP detected in UBO chain", ts: "22s" },
  { agent: "Regulatory Agent", text: "EU AMLA regulatory update detected — 12 rules require amendment", ts: "31s" },
];

export function Hero() {
  const [active, setActive] = useState(0);
  useEffect(() => {
    const id = setInterval(() => setActive((p) => (p + 1) % feed.length), 3500);
    return () => clearInterval(id);
  }, []);

  return (
    <section className="relative">
      {/* ─── Full-width dark band ─── */}
      <div className="bg-[#0a0a0a] relative overflow-hidden">
        {/* Subtle noise texture */}
        <div
          className="absolute inset-0 opacity-[0.015] pointer-events-none"
          style={{
            backgroundImage: "url(\"data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E\")",
            backgroundSize: "200px 200px",
          }}
        />

        <div className="relative mx-auto max-w-300 px-6">
          {/* ─── Main hero area ─── */}
          <div className="pt-28 pb-20 lg:pt-36 lg:pb-28">
            {/* Overline */}
            <div className="flex items-center gap-3 mb-8">
              <div className="h-px w-10 bg-[#333]" />
              <span className="text-[10px] font-semibold text-[#666] uppercase tracking-[0.3em]">
                Client Lifecycle Management
              </span>
            </div>

            {/* Headline — full width, massive, confident */}
            <h1 className="text-[clamp(2.8rem,6vw,5.5rem)] font-extrabold text-white tracking-[-0.04em] leading-[0.95] max-w-4xl">
              The compliance team
              <br />
              that never
              <br />
              <span className="text-[#333]">clocks out.</span>
            </h1>

            {/* Subheadline — offset to the right for asymmetry */}
            <div className="mt-10 lg:ml-auto lg:max-w-md">
              <p className="text-[16px] text-[#777] leading-[1.75]">
                Sixteen AI agents run your KYC, AML screening, risk scoring,
                and regulatory monitoring — continuously. Your analysts review
                findings and apply judgment. Not chase documents.
              </p>

              <div className="mt-8 flex items-center gap-4">
                <Link href="/dashboard">
                  <Button className="h-11 px-7 text-[13px] font-semibold bg-white text-[#0a0a0a] hover:bg-[#e5e5e5] rounded-lg gap-2.5 transition-colors duration-300">
                    Book a demo
                    <ArrowRight className="h-4 w-4" />
                  </Button>
                </Link>
                <Link href="/dashboard" className="text-[13px] font-medium text-[#666] hover:text-white transition-colors duration-300 underline underline-offset-4 decoration-[#333]">
                  Try free →
                </Link>
              </div>
            </div>
          </div>

          {/* ─── Data strip — full bleed within container ─── */}
          <div className="border-t border-[#1a1a1a]">
            <div className="grid grid-cols-2 lg:grid-cols-4">
              {[
                { value: "85%", label: "Alerts auto-resolved", detail: "by AI agents" },
                { value: "< 5h", label: "Average onboarding", detail: "vs 4–12 weeks legacy" },
                { value: "120+", label: "Jurisdictions covered", detail: "pre-built rules" },
                { value: "96.2%", label: "Decision accuracy", detail: "rolling 30 days" },
              ].map((m, i) => (
                <div
                  key={m.label}
                  className="py-7 px-6 border-r border-[#1a1a1a] last:border-r-0"
                >
                  <div className="text-[28px] lg:text-[32px] font-extrabold text-white tracking-tight tabular-nums leading-none">
                    {m.value}
                  </div>
                  <div className="mt-2 text-[11px] font-semibold text-[#555] uppercase tracking-[0.12em]">
                    {m.label}
                  </div>
                  <div className="mt-0.5 text-[10px] text-[#333] font-medium">
                    {m.detail}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* ─── Live agent feed — sits at the seam between dark and light ─── */}
      <div className="relative bg-[#f5f5f5]">
        <div className="mx-auto max-w-300 px-6">
          {/* Pull up into dark section */}
          <div className="relative -mt-1 mb-12">
            {/* Offset shadow */}
            <div className="absolute inset-0 translate-y-2 bg-[#ddd] rounded-lg" />

            <div className="relative bg-white rounded-lg border border-[#e5e5e5] overflow-hidden shadow-sm">
              {/* Feed header */}
              <div className="flex items-center justify-between px-5 py-3 border-b border-[#f0f0f0] bg-[#fafafa]">
                <div className="flex items-center gap-2">
                  <div className="h-1.5 w-1.5 rounded-full bg-[#0a0a0a] animate-pulse" />
                  <span className="text-[10px] font-bold text-[#999] uppercase tracking-[0.2em]">
                    Live agent activity
                  </span>
                </div>
                <div className="flex items-center gap-4">
                  <span className="text-[10px] text-[#bbb] font-medium">6/6 agents active</span>
                  <span className="text-[10px] text-[#bbb] font-medium tabular-nums">2,847 actions today</span>
                </div>
              </div>

              {/* Feed rows */}
              <div className="divide-y divide-[#f5f5f5]">
                {feed.map((item, i) => (
                  <div
                    key={item.agent}
                    className="flex items-start gap-4 px-5 py-3 transition-colors duration-700"
                    style={{ backgroundColor: active === i ? "#fafafa" : "white" }}
                  >
                    <span className="text-[10px] font-bold text-[#bbb] uppercase tracking-widest w-28 shrink-0 pt-0.5">
                      {item.agent}
                    </span>
                    <p className="text-[12px] text-[#666] leading-relaxed flex-1">
                      {item.text}
                    </p>
                    <span className="text-[10px] text-[#ccc] tabular-nums shrink-0 pt-0.5">
                      {item.ts} ago
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Trusted by strip */}
        <div className="pb-10">
          <div className="mx-auto max-w-300 px-6">
            <div className="flex items-center gap-6">
              <span className="text-[10px] font-semibold text-[#bbb] uppercase tracking-[0.2em] shrink-0">
                Trusted by
              </span>
              <div className="h-px flex-1 bg-[#e5e5e5]" />
              {["Goldman Sachs", "JPMorgan", "HSBC", "Deutsche Bank", "BNP Paribas", "Northern Trust"].map((name) => (
                <span key={name} className="text-[13px] font-semibold text-[#ccc] whitespace-nowrap select-none hidden md:block">
                  {name}
                </span>
              ))}
              <div className="h-px flex-1 bg-[#e5e5e5] hidden md:block" />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
