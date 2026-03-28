"use client";

const preFilledFields = [
  { label: "Legal Name", value: "Helios Asset Management GmbH", source: "German Commercial Register (Handelsregister)", filled: true },
  { label: "Registration Number", value: "HRB 123456", source: "Handelsregister Frankfurt am Main", filled: true },
  { label: "Entity Type", value: "GmbH (Gesellschaft mit beschränkter Haftung)", source: "Handelsregister", filled: true },
  { label: "Date of Incorporation", value: "January 12, 2018", source: "Handelsregister", filled: true },
  { label: "Country of Incorporation", value: "🇩🇪 Germany", source: "Handelsregister", filled: true },
  { label: "Registered Address", value: "Neue Mainzer Str. 52\n60311 Frankfurt am Main\nGermany", source: "Handelsregister", filled: true },
];

export function StepCompanyInfo({ onContinue }: { onContinue: () => void }) {
  return (
    <div className="space-y-6">
      <div className="rounded-xl bg-[#EFF4FF] p-5">
        <p className="text-lg font-semibold text-[#1E293B]">👋 Welcome, Thomas</p>
        <p className="mt-1 text-sm text-[#64748B] leading-relaxed">
          We&apos;ve already gathered some information about your company from public sources — please review and confirm what&apos;s correct, and fill in anything missing.
        </p>
        <p className="mt-1 text-xs text-[#94A3B8]">This should take about 15-20 minutes.</p>
      </div>

      <div className="space-y-4">
        <h3 className="text-base font-semibold text-[#1E293B]">Company Information</h3>

        {preFilledFields.map((f) => (
          <div key={f.label}>
            <div className="flex items-center justify-between mb-1.5">
              <label className="text-sm font-medium text-[#1E293B]">{f.label} <span className="text-[#DC2626]">*</span></label>
              {f.filled && (
                <span className="text-[11px] font-medium text-[#16A34A] bg-[#F0FDF4] px-2 py-0.5 rounded-full">✓ Auto-filled</span>
              )}
            </div>
            <div className="rounded-lg border border-[#E2E8F0] bg-white px-4 py-2.5 text-sm text-[#1E293B] whitespace-pre-line" style={f.filled ? { borderLeft: "3px solid #2563EB" } : undefined}>
              {f.value}
            </div>
            {f.source && (
              <p className="mt-1 text-[11px] text-[#94A3B8]">ℹ Source: {f.source}</p>
            )}
          </div>
        ))}

        {/* Empty fields */}
        <div>
          <label className="text-sm font-medium text-[#1E293B]">Nature of Business <span className="text-[#DC2626]">*</span></label>
          <select className="mt-1.5 w-full rounded-lg border border-[#E2E8F0] bg-white px-4 py-2.5 text-sm text-[#94A3B8]">
            <option>Select your primary business activity...</option>
            <option>Asset Management</option>
            <option>Fund Administration</option>
            <option>Wealth Management</option>
            <option>Private Equity</option>
          </select>
        </div>

        <div>
          <label className="text-sm font-medium text-[#1E293B]">Expected Annual Account Activity <span className="text-[#DC2626]">*</span></label>
          <select className="mt-1.5 w-full rounded-lg border border-[#E2E8F0] bg-white px-4 py-2.5 text-sm text-[#94A3B8]">
            <option>Select range...</option>
            <option>&lt;€1M</option>
            <option>€1-10M</option>
            <option>€10-50M</option>
            <option>€50-100M</option>
            <option>€100M+</option>
          </select>
        </div>
      </div>

      <div className="flex justify-end pt-4">
        <button type="button" onClick={onContinue} className="rounded-lg bg-[#2563EB] px-6 py-2.5 text-sm font-medium text-white hover:bg-[#1D4FD8] transition-colors">
          Continue →
        </button>
      </div>
    </div>
  );
}
