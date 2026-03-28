"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";

export function CtaSection() {
  return (
    <section className="bg-[#0a0a0a]">
      <div className="mx-auto max-w-300 px-6 py-24 lg:py-32">
        <div className="grid lg:grid-cols-[1fr_auto] gap-12 items-end">
          <div>
            <h2 className="text-[clamp(1.8rem,3.5vw,2.8rem)] font-extrabold text-white tracking-[-0.03em] leading-[1.1]">
              Stop hiring more analysts.
              <br />
              <span className="text-[#555]">Deploy agents instead.</span>
            </h2>
            <p className="mt-5 text-[15px] text-[#666] leading-[1.7] max-w-lg">
              See how your compliance team can do 10x more — with fewer people,
              fewer false positives, and full regulatory transparency.
              30-minute personalized demo.
            </p>
            <div className="mt-8 flex items-center gap-3">
              <Link href="/dashboard">
                <Button className="h-11 px-6 text-[14px] font-semibold bg-white text-[#0a0a0a] hover:bg-[#f0f0f0] rounded-lg gap-2">
                  Book a demo
                  <ArrowRight className="h-4 w-4" />
                </Button>
              </Link>
              <Link href="/dashboard">
                <Button
                  variant="ghost"
                  className="h-11 px-5 text-[14px] font-medium text-[#666] hover:text-white hover:bg-transparent underline underline-offset-4 decoration-[#333] hover:decoration-white transition-all"
                >
                  Start free trial
                </Button>
              </Link>
            </div>
          </div>

          {/* Stats column */}
          <div className="grid grid-cols-2 gap-px bg-[#1a1a1a] rounded-lg overflow-hidden">
            {[
              { v: "60%", l: "Cost reduction" },
              { v: "10×", l: "Productivity" },
              { v: "<5h", l: "Avg. onboarding" },
              { v: "85%", l: "Auto-resolution" },
            ].map((s) => (
              <div key={s.l} className="bg-[#0a0a0a] p-5 min-w-32.5">
                <div className="text-[24px] font-extrabold text-white tabular-nums leading-none">{s.v}</div>
                <div className="text-[9px] font-medium text-[#555] uppercase tracking-[0.15em] mt-1.5">{s.l}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
