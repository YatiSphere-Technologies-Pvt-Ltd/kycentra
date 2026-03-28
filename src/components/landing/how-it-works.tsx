"use client";

const comparison = [
  { label: "Client onboarding", legacy: "4–12 weeks", agentic: "< 5 hours" },
  { label: "Screening false positives", legacy: "90–95%", agentic: "< 20%" },
  { label: "Analyst time on data gathering", legacy: "80%", agentic: "20%" },
  { label: "New jurisdiction setup", legacy: "6–12 months", agentic: "Weeks" },
  { label: "Regulatory content cost", legacy: "$5–10M+", agentic: "Pre-built" },
  { label: "Review cycle", legacy: "Annual / manual", agentic: "Continuous" },
  { label: "Ownership discovery", legacy: "Manual, 2 layers", agentic: "Recursive, unlimited" },
  { label: "SAR narrative drafting", legacy: "4–8 hours", agentic: "Auto-drafted" },
];

const steps = [
  {
    num: "01",
    title: "Agents activate",
    body: "The moment a client engages, 16 agents spring into action — querying registries, pre-populating data, starting screening. No human trigger.",
    aside: "60–80% of KYC data pre-filled before the client opens the portal.",
  },
  {
    num: "02",
    title: "Agents analyze",
    body: "In parallel: sanctions screening, UBO discovery through unlimited layers, dynamic risk scoring, regulatory requirement mapping. All with documented reasoning.",
    aside: "85% of screening alerts auto-resolved. Full evidence chains for every decision.",
  },
  {
    num: "03",
    title: "Humans judge",
    body: "Only genuinely ambiguous decisions reach your analysts — pre-analyzed, pre-scored, with AI recommendations and evidence. They approve, override, or investigate.",
    aside: "Analysts spend 80% of time on analysis, not chasing documents.",
  },
  {
    num: "04",
    title: "Agents monitor",
    body: "Post-onboarding, agents never stop. Continuous screening, risk recalculation on trigger events, document expiry tracking, regulatory change monitoring.",
    aside: "Every entity has a 24/7 compliance team. Always current. Never overdue.",
  },
];

export function HowItWorks() {
  return (
    <section id="how-it-works">
      {/* ── Comparison strip ── dark, data-dense */}
      <div className="bg-[#0a0a0a]">
        <div className="mx-auto max-w-300 px-6 py-20 lg:py-28">
          <div className="grid lg:grid-cols-2 gap-12 mb-14">
            <div>
              <p className="text-[11px] font-semibold text-[#555] uppercase tracking-[0.25em] mb-4">
                The Shift
              </p>
              <h2 className="text-[clamp(1.8rem,3.5vw,2.6rem)] font-extrabold text-white tracking-[-0.03em] leading-[1.1]">
                Legacy platforms make humans
                <br />
                do the work.{" "}
                <span className="text-[#555]">We don&apos;t.</span>
              </h2>
            </div>
            <div className="flex items-end">
              <p className="text-[14px] text-[#666] leading-[1.8]">
                Fenergo, S&amp;P CLM Pro, and legacy GRC tools were built before
                agentic AI. They digitize manual processes. We replaced them with
                autonomous agents that do the work end-to-end.
              </p>
            </div>
          </div>

          {/* Comparison table */}
          <div className="rounded-lg overflow-hidden border border-[#1a1a1a]">
            {/* Header */}
            <div className="grid grid-cols-[1fr_160px_160px] bg-[#111]">
              <div className="px-5 py-3 text-[10px] font-bold text-[#555] uppercase tracking-[0.2em]">
                Capability
              </div>
              <div className="px-5 py-3 text-[10px] font-bold text-[#555] uppercase tracking-[0.2em] text-right border-l border-[#1a1a1a]">
                Legacy
              </div>
              <div className="px-5 py-3 text-[10px] font-bold text-emerald-600 uppercase tracking-[0.2em] text-right border-l border-[#1a1a1a]">
                Agentic
              </div>
            </div>

            {/* Rows */}
            {comparison.map((row, i) => (
              <div
                key={row.label}
                className="grid grid-cols-[1fr_160px_160px] border-t border-[#1a1a1a] hover:bg-[#111] transition-colors"
              >
                <div className="px-5 py-3.5 text-[13px] text-[#888] font-medium">
                  {row.label}
                </div>
                <div className="px-5 py-3.5 text-[13px] text-[#555] font-medium text-right border-l border-[#1a1a1a] tabular-nums">
                  {row.legacy}
                </div>
                <div className="px-5 py-3.5 text-[13px] text-white font-bold text-right border-l border-[#1a1a1a] tabular-nums">
                  {row.agentic}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ── How it works steps ── light, editorial */}
      <div className="bg-[#fafafa] py-20 lg:py-28">
        <div className="mx-auto max-w-300 px-6">
          <p className="text-[11px] font-semibold text-[#999] uppercase tracking-[0.25em] mb-4">
            How it works
          </p>
          <h2 className="text-[clamp(1.6rem,3vw,2.2rem)] font-extrabold text-[#0a0a0a] tracking-[-0.02em] leading-[1.15] mb-16 max-w-lg">
            AI does the work.
            <br />
            You make the call.
          </h2>

          <div className="grid lg:grid-cols-4 gap-px bg-[#e5e5e5] rounded-lg overflow-hidden">
            {steps.map((step) => (
              <div key={step.num} className="bg-white p-6 lg:p-7 flex flex-col">
                <span className="text-[36px] font-black text-[#f0f0f0] leading-none tabular-nums mb-4">
                  {step.num}
                </span>
                <h3 className="text-[15px] font-bold text-[#0a0a0a] mb-2">{step.title}</h3>
                <p className="text-[13px] text-[#777] leading-[1.7] flex-1">{step.body}</p>
                <div className="mt-4 pt-4 border-t border-[#f0f0f0]">
                  <p className="text-[11px] font-semibold text-[#0a0a0a] leading-snug">
                    {step.aside}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
