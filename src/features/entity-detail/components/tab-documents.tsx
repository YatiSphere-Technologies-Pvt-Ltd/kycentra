"use client";

import { useState, Fragment } from "react";
import { Button } from "@/components/ui/button";
import { ConfidenceBadge } from "@/components/shared";
import { DocStatusIcon } from "@/components/shared/status-badge";
import { Upload, Send, CheckCircle2, AlertTriangle, ChevronRight, Clock, RefreshCw } from "lucide-react";
import { cn } from "@/lib/utils";
import type { EntityDocument } from "../types";

interface DocumentsTabProps { documents: EntityDocument[] }

function groupByCategory(docs: EntityDocument[]): Record<string, EntityDocument[]> {
  const groups: Record<string, EntityDocument[]> = {};
  for (const doc of docs) { (groups[doc.category] ??= []).push(doc); }
  return groups;
}

export function TabDocuments({ documents }: DocumentsTabProps) {
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const groups = groupByCategory(documents);
  const verified = documents.filter((d) => d.status === "verified").length;
  const issues = documents.filter((d) => d.status === "issue" || d.status === "expiring").length;

  return (
    <div className="space-y-5">
      {/* KPI + Actions */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
        <div className="grid grid-cols-4 gap-px bg-border rounded-lg overflow-hidden flex-1 max-w-lg">
          {[
            { label: "Total", value: String(documents.length) },
            { label: "Verified", value: String(verified) },
            { label: "Issues", value: String(issues), warn: issues > 0 },
            { label: "Pending", value: String(documents.filter((d) => d.status === "pending").length) },
          ].map((k) => (
            <div key={k.label} className="bg-card p-3">
              <div className="text-[9px] font-bold text-muted-foreground uppercase tracking-widest mb-1">{k.label}</div>
              <div className={`text-[16px] font-extrabold tabular-nums ${k.warn ? "text-nx-amber-600" : ""}`}>{k.value}</div>
            </div>
          ))}
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm" className="h-7 text-[10px] font-semibold gap-1.5"><Send className="h-3 w-3" /> Request from Client</Button>
          <Button size="sm" className="h-7 text-[10px] font-semibold gap-1.5"><Upload className="h-3 w-3" /> Upload</Button>
        </div>
      </div>

      {/* Upload area */}
      <div className="rounded-lg border-2 border-dashed border-border p-6 text-center hover:border-foreground/20 hover:bg-muted/10 transition-colors cursor-pointer">
        <Upload className="mx-auto h-6 w-6 text-muted-foreground/30" />
        <p className="mt-2 text-[11px] text-muted-foreground">Drag & drop files or click to upload</p>
        <p className="mt-0.5 text-[9px] text-muted-foreground/50">PDF, JPG, PNG, TIFF — Max 25MB</p>
      </div>

      {/* Document table by category */}
      {Object.entries(groups).map(([category, docs]) => {
        const catVerified = docs.filter((d) => d.status === "verified").length;
        return (
          <div key={category} className="rounded-lg border border-border bg-card overflow-hidden">
            <div className="flex items-center justify-between px-4 py-2.5 border-b border-border bg-muted/20">
              <span className="text-[12px] font-bold">{category}</span>
              <span className="text-[10px] text-muted-foreground tabular-nums">{catVerified}/{docs.length} verified</span>
            </div>
            <table className="w-full text-[11px]">
              <tbody>
                {docs.map((doc) => {
                  const isExpanded = expandedId === doc.id;
                  return (
                    <Fragment key={doc.id}>
                      <tr
                        className={cn("border-b border-border last:border-b-0 cursor-pointer group transition-colors", isExpanded ? "bg-muted/10" : "hover:bg-muted/10")}
                        onClick={() => setExpandedId(isExpanded ? null : doc.id)}
                      >
                        <td className="px-4 py-2.5 w-8"><DocStatusIcon status={doc.status} /></td>
                        <td className="px-4 py-2.5">
                          <span className="font-medium text-[12px]">{doc.name}</span>
                          {doc.issueDetail && <span className="ml-2 text-[9px] font-bold text-nx-amber-600">Issue</span>}
                          {doc.status === "expiring" && <span className="ml-2 text-[9px] font-bold text-nx-amber-600">Expiring {doc.expiryDate}</span>}
                        </td>
                        <td className="px-4 py-2.5 text-right text-muted-foreground tabular-nums">{doc.uploadDate ?? "—"}</td>
                        <td className="px-4 py-2.5 text-right">
                          {doc.aiConfidence != null && <ConfidenceBadge value={Math.round(doc.aiConfidence * 100)} />}
                          {doc.status === "pending" && <span className="text-[9px] text-muted-foreground/40">Awaiting</span>}
                        </td>
                        <td className="px-4 py-2.5 w-8">
                          <ChevronRight className={cn("h-3 w-3 text-muted-foreground/30 group-hover:text-foreground transition-all", isExpanded && "rotate-90")} />
                        </td>
                      </tr>

                      {isExpanded && (
                        <tr className="border-b border-border bg-muted/5">
                          <td colSpan={5} className="px-4 py-4">
                            {doc.extractedFields ? (
                              <div className="space-y-4">
                                <div>
                                  <div className="text-[9px] font-bold text-muted-foreground uppercase tracking-widest mb-2">AI Extraction Results</div>
                                  <div className="grid grid-cols-2 gap-1.5">
                                    {doc.extractedFields.map((f) => (
                                      <div key={f.field} className="flex items-center gap-2 text-[11px]">
                                        {f.match ? <CheckCircle2 className="h-3 w-3 text-nx-emerald-600 shrink-0" /> : <AlertTriangle className="h-3 w-3 text-nx-amber-600 shrink-0" />}
                                        <span className="text-muted-foreground w-32 shrink-0">{f.field}</span>
                                        <span className={cn("font-medium", !f.match && "text-nx-amber-700")}>{f.value}</span>
                                        {!f.match && f.expected && <span className="text-[9px] text-muted-foreground/60 ml-1">(expected: {f.expected})</span>}
                                      </div>
                                    ))}
                                  </div>
                                </div>
                                {doc.issueDetail && (
                                  <div className="p-3 rounded bg-nx-amber-50/50 border-l-2 border-nx-amber-500">
                                    <p className="text-[10px] text-muted-foreground">{doc.issueDetail}</p>
                                  </div>
                                )}
                                <div className="flex gap-2">
                                  <Button size="sm" variant="outline" className="h-6 text-[9px] font-semibold">View Original</Button>
                                  <Button size="sm" variant="outline" className="h-6 text-[9px] font-semibold">Re-Process</Button>
                                  <Button size="sm" className="h-6 text-[9px] font-semibold">Override & Approve</Button>
                                </div>
                              </div>
                            ) : (
                              <p className="text-[10px] text-muted-foreground">{doc.status === "pending" ? "Document not yet uploaded." : "No extraction data available."}</p>
                            )}
                          </td>
                        </tr>
                      )}
                    </Fragment>
                  );
                })}
              </tbody>
            </table>
          </div>
        );
      })}
    </div>
  );
}
