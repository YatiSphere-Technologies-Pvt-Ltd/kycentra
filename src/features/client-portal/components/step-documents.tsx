"use client";

import { Upload, CheckCircle2, Loader2, AlertTriangle } from "lucide-react";
import { documentRequirements } from "@/features/onboarding/data/mock-data";

const statusRender: Record<string, { icon: typeof CheckCircle2; label: string; color: string }> = {
  verified: { icon: CheckCircle2, label: "Uploaded and verified", color: "#16A34A" },
  processing: { icon: Loader2, label: "Processing...", color: "#0D9488" },
  pending: { icon: Upload, label: "Upload required", color: "#94A3B8" },
  issue: { icon: AlertTriangle, label: "Issue found", color: "#D97706" },
};

export function StepDocuments({ onContinue, onBack }: { onContinue: () => void; onBack: () => void }) {
  const pending = documentRequirements.filter((d) => d.status === "pending").length;

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-semibold text-[#1E293B]">Upload your documents</h3>
        <p className="mt-1 text-sm text-[#64748B] leading-relaxed">
          We need a few documents to verify your company information. Some may already be on file — you&apos;ll only see what&apos;s still needed.
        </p>
        <p className="mt-2 text-sm font-medium text-[#475569]">📄 {pending} documents remaining</p>
      </div>

      <div className="space-y-3">
        {documentRequirements.map((doc) => {
          const sr = statusRender[doc.status] ?? statusRender.pending;
          const Icon = sr.icon;

          return (
            <div key={doc.id} className="rounded-xl border border-[#E2E8F0] bg-white overflow-hidden">
              <div className="flex items-center gap-3 p-4">
                <Icon
                  className={`h-5 w-5 shrink-0 ${doc.status === "processing" ? "animate-spin" : ""}`}
                  style={{ color: sr.color }}
                />
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-[#1E293B]">{doc.name}</p>
                  {doc.localName && <p className="text-xs text-[#94A3B8]">{doc.localName}</p>}
                  <p className="text-xs mt-0.5" style={{ color: sr.color }}>{sr.label}</p>
                </div>
                {doc.status === "processing" && doc.processingProgress != null && (
                  <div className="w-16">
                    <div className="h-1.5 rounded-full bg-[#E2E8F0]">
                      <div className="h-full rounded-full bg-[#0D9488] transition-all" style={{ width: `${doc.processingProgress}%` }} />
                    </div>
                    <p className="text-[10px] text-[#94A3B8] text-right mt-0.5 tabular-nums">{doc.processingProgress}%</p>
                  </div>
                )}
              </div>

              {doc.status === "pending" && (
                <div className="border-t border-[#E2E8F0] p-4">
                  <div className="rounded-lg border-2 border-dashed border-[#CBD5E1] p-6 text-center cursor-pointer hover:border-[#2563EB] hover:bg-[#EFF4FF]/30 transition-colors">
                    <Upload className="mx-auto h-6 w-6 text-[#94A3B8]" />
                    <p className="mt-2 text-sm text-[#64748B]">Drag & drop or click to upload</p>
                    <p className="mt-0.5 text-[11px] text-[#94A3B8]">PDF, JPG, PNG · Max 25MB</p>
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>

      <div className="flex justify-between pt-4">
        <button type="button" onClick={onBack} className="text-sm font-medium text-[#64748B] hover:text-[#1E293B]">← Back</button>
        <button type="button" onClick={onContinue} className="rounded-lg bg-[#2563EB] px-6 py-2.5 text-sm font-medium text-white hover:bg-[#1D4FD8] transition-colors">Continue →</button>
      </div>
    </div>
  );
}
