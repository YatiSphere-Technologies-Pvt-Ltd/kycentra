"use client";

import { discoveredUBOs } from "@/features/onboarding/data/mock-data";

const flagMap: Record<string, string> = { DE: "🇩🇪", AT: "🇦🇹" };

export function StepOwnership({ onContinue, onBack }: { onContinue: () => void; onBack: () => void }) {
  return (
    <div className="space-y-6">
      <div className="rounded-xl bg-[#EFF4FF] p-5">
        <p className="text-base font-semibold text-[#1E293B]">Who owns or controls Helios Asset Management?</p>
        <p className="mt-1 text-sm text-[#64748B] leading-relaxed">
          We need to identify anyone who directly or indirectly owns 25% or more of the company, or has significant control. We&apos;ve already identified the following from public records.
        </p>
      </div>

      <div>
        <div className="flex items-center justify-between mb-3">
          <h3 className="text-sm font-semibold text-[#1E293B]">We found these beneficial owners:</h3>
          <span className="text-[11px] font-medium text-[#16A34A] bg-[#F0FDF4] px-2 py-0.5 rounded-full">✓ Auto-filled</span>
        </div>

        <div className="space-y-3">
          {discoveredUBOs.map((ubo) => (
            <div key={ubo.name} className="rounded-xl border border-[#E2E8F0] bg-white p-4" style={{ borderLeft: "4px solid #2563EB" }}>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-full bg-[#EFF4FF] text-sm font-bold text-[#2563EB]">
                    {ubo.name.split(" ").map((w) => w[0]).join("")}
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-[#1E293B]">{ubo.name}</p>
                    <p className="text-xs text-[#64748B]">{ubo.ownership}% ownership ({ubo.ownershipType}) · {flagMap[ubo.nationality] ?? ubo.nationality} {ubo.location}</p>
                  </div>
                </div>
                <button type="button" className="text-xs font-medium text-[#2563EB] hover:underline">Edit</button>
              </div>
              {ubo.ownership >= 25 && (
                <div className="mt-3 rounded-lg bg-[#F0FDFA] px-3 py-2 text-xs text-[#0D9488]">
                  ℹ We&apos;ll need a copy of {ubo.name.split(" ")[0]}&apos;s passport or ID card
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Confirmation */}
      <div className="space-y-2">
        <p className="text-sm font-medium text-[#1E293B]">Is this information correct?</p>
        {["Yes, this is correct", "No, I need to make changes", "There are additional owners not shown"].map((opt, i) => (
          <label key={opt} className="flex items-center gap-2.5 cursor-pointer text-sm text-[#475569]">
            <input type="radio" name="ownership-confirm" defaultChecked={i === 0} className="accent-[#2563EB]" />
            {opt}
          </label>
        ))}
      </div>

      {/* Source of wealth */}
      <div className="space-y-3 pt-2 border-t border-[#E2E8F0]">
        <p className="text-sm font-medium text-[#1E293B]">Source of Wealth</p>
        <p className="text-xs text-[#64748B]">For owners with 25%+, we need to understand the source of their investment.</p>
        {discoveredUBOs.filter((u) => u.ownership >= 25).map((ubo) => (
          <div key={ubo.name}>
            <label className="text-sm text-[#475569]">{ubo.name} — Source of Wealth <span className="text-[#DC2626]">*</span></label>
            <select className="mt-1 w-full rounded-lg border border-[#E2E8F0] bg-white px-4 py-2.5 text-sm text-[#94A3B8]">
              <option>Select...</option>
              <option>Employment Income</option>
              <option>Business Profits</option>
              <option>Investment Returns</option>
              <option>Inheritance</option>
              <option>Property Sale</option>
            </select>
          </div>
        ))}
      </div>

      <div className="flex justify-between pt-4">
        <button type="button" onClick={onBack} className="text-sm font-medium text-[#64748B] hover:text-[#1E293B]">← Back</button>
        <button type="button" onClick={onContinue} className="rounded-lg bg-[#2563EB] px-6 py-2.5 text-sm font-medium text-white hover:bg-[#1D4FD8] transition-colors">Continue →</button>
      </div>
    </div>
  );
}
