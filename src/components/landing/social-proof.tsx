"use client";

export function SocialProof() {
  // Logos are now integrated into the hero section.
  // This component renders analyst recognition badges only.
  return (
    <section className="bg-[#f5f5f5] border-b border-[#eee]">
      <div className="mx-auto max-w-300 px-6 py-8">
        <div className="flex flex-wrap items-center justify-center gap-5">
          {[
            { label: "Chartis RiskTech100", sub: "Category Leader 2026" },
            { label: "Celent Model Bank", sub: "AI in Compliance" },
            { label: "SOC 2 Type II", sub: "Certified" },
            { label: "ISO 27001", sub: "Certified" },
            { label: "EU AI Act", sub: "High-Risk Compliant" },
          ].map((badge) => (
            <div
              key={badge.label}
              className="flex items-center gap-2.5 px-3.5 py-2 border border-[#e5e5e5] rounded bg-white"
            >
              <div className="h-4 w-px bg-[#ddd]" />
              <div>
                <div className="text-[10px] font-bold text-[#555] leading-none">{badge.label}</div>
                <div className="text-[9px] text-[#aaa] font-medium mt-0.5">{badge.sub}</div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
