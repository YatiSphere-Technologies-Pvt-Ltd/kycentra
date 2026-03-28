"use client";

import { useState } from "react";
import { CheckCircle2, Clock } from "lucide-react";
import { discoveredUBOs, documentRequirements } from "@/features/onboarding/data/mock-data";

export function StepReview({ onBack }: { onBack: () => void }) {
  const [submitted, setSubmitted] = useState(false);
  const [declarations, setDeclarations] = useState([false, false, false]);
  const allChecked = declarations.every(Boolean);

  if (submitted) {
    return (
      <div className="text-center py-12 space-y-4">
        <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-[#F0FDF4]">
          <CheckCircle2 className="h-8 w-8 text-[#16A34A]" />
        </div>
        <h2 className="text-xl font-semibold text-[#1E293B]">Application Submitted Successfully</h2>
        <p className="text-sm text-[#64748B]">Reference: ONB-2026-0184</p>
        <div className="mx-auto max-w-sm text-left rounded-xl bg-[#F8FAFC] p-5 space-y-2 text-sm text-[#64748B]">
          <p className="font-medium text-[#1E293B]">What happens next:</p>
          <p>1. Our AI systems are already verifying your documents (&lt;1 hour)</p>
          <p>2. A compliance analyst will review the results</p>
          <p>3. If everything checks out, your account will be activated</p>
          <p>4. You&apos;ll receive a confirmation email with next steps</p>
        </div>
        <p className="text-sm text-[#64748B]">Estimated completion: Today by 5:00 PM</p>
        <p className="text-xs text-[#94A3B8]">Questions? Contact James Park · james.park@institution.com</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-semibold text-[#1E293B]">Review your information</h3>
        <p className="mt-1 text-sm text-[#64748B]">Please review everything below before submitting. Click &quot;Edit&quot; on any section to make changes.</p>
      </div>

      {/* Company info summary */}
      <div className="rounded-xl border border-[#E2E8F0] bg-white p-5">
        <div className="flex items-center justify-between mb-3">
          <h4 className="text-sm font-semibold text-[#1E293B]">Company Information</h4>
          <button type="button" className="text-xs font-medium text-[#2563EB] hover:underline">Edit</button>
        </div>
        <div className="grid grid-cols-2 gap-2 text-sm">
          <div><span className="text-[#94A3B8]">Name:</span> <span className="text-[#1E293B]">Helios Asset Management GmbH</span></div>
          <div><span className="text-[#94A3B8]">Reg:</span> <span className="text-[#1E293B]">HRB 123456</span></div>
          <div><span className="text-[#94A3B8]">Jurisdiction:</span> <span className="text-[#1E293B]">Germany (Frankfurt)</span></div>
          <div><span className="text-[#94A3B8]">Type:</span> <span className="text-[#1E293B]">GmbH</span></div>
        </div>
      </div>

      {/* UBOs */}
      <div className="rounded-xl border border-[#E2E8F0] bg-white p-5">
        <div className="flex items-center justify-between mb-3">
          <h4 className="text-sm font-semibold text-[#1E293B]">Beneficial Owners</h4>
          <button type="button" className="text-xs font-medium text-[#2563EB] hover:underline">Edit</button>
        </div>
        <div className="space-y-1 text-sm">
          {discoveredUBOs.map((u) => (
            <p key={u.name} className="text-[#475569]">{u.name} — {u.ownership}% ({u.ownershipType}) — {u.nationality === "DE" ? "German" : "Austrian"}</p>
          ))}
        </div>
      </div>

      {/* Documents */}
      <div className="rounded-xl border border-[#E2E8F0] bg-white p-5">
        <div className="flex items-center justify-between mb-3">
          <h4 className="text-sm font-semibold text-[#1E293B]">Documents</h4>
          <button type="button" className="text-xs font-medium text-[#2563EB] hover:underline">Edit</button>
        </div>
        <div className="space-y-1.5">
          {documentRequirements.map((d) => (
            <div key={d.id} className="flex items-center gap-2 text-sm">
              {d.status === "verified" ? <CheckCircle2 className="h-4 w-4 text-[#16A34A]" /> : <Clock className="h-4 w-4 text-[#D97706]" />}
              <span className="text-[#475569]">{d.name}</span>
              <span className="ml-auto text-xs" style={{ color: d.status === "verified" ? "#16A34A" : "#D97706" }}>
                {d.status === "verified" ? "Verified" : d.status === "processing" ? "Processing" : "Pending"}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Declarations */}
      <div className="rounded-xl border border-[#E2E8F0] bg-white p-5 space-y-3">
        <h4 className="text-sm font-semibold text-[#1E293B]">Declarations</h4>
        {[
          "I confirm that all information provided is true and complete to the best of my knowledge.",
          "I consent to the processing of personal data in accordance with the Privacy Policy and GDPR.",
          "I understand that providing false or misleading information may result in the termination of services.",
        ].map((text, i) => (
          <label key={i} className="flex items-start gap-2.5 cursor-pointer text-sm text-[#475569]">
            <input
              type="checkbox"
              checked={declarations[i]}
              onChange={() => {
                const next = [...declarations];
                next[i] = !next[i];
                setDeclarations(next);
              }}
              className="mt-0.5 accent-[#2563EB]"
            />
            {text}
          </label>
        ))}
      </div>

      <div className="flex justify-between items-center pt-4">
        <button type="button" onClick={onBack} className="text-sm font-medium text-[#64748B] hover:text-[#1E293B]">← Back</button>
        <div className="text-right">
          <button
            type="button"
            disabled={!allChecked}
            onClick={() => setSubmitted(true)}
            className="rounded-lg bg-[#2563EB] px-8 py-3 text-sm font-semibold text-white hover:bg-[#1D4FD8] transition-colors disabled:bg-[#94A3B8] disabled:cursor-not-allowed"
          >
            Submit Application
          </button>
          <p className="mt-2 text-xs text-[#94A3B8]">By submitting, you confirm the accuracy of the above.</p>
        </div>
      </div>
    </div>
  );
}
