import type {
  RiskTier,
  AgentName,
  CaseStatus,
} from "@/features/workbench/types";

// ============================================================
// Centralized style config — single source of truth for all
// color mappings used across the UI. All values reference
// CSS custom properties so they adapt to light/dark themes.
// ============================================================

/** Risk tier visual config */
export const riskStyles: Record<
  RiskTier,
  { label: string; fg: string; bg: string; border: string }
> = {
  critical: {
    label: "Critical",
    fg: "var(--nx-risk-critical)",
    bg: "var(--nx-risk-critical-bg)",
    border: "var(--nx-risk-critical)",
  },
  high: {
    label: "High",
    fg: "var(--nx-risk-high)",
    bg: "var(--nx-risk-high-bg)",
    border: "var(--nx-risk-high)",
  },
  medium: {
    label: "Medium",
    fg: "var(--nx-risk-medium)",
    bg: "var(--nx-risk-medium-bg)",
    border: "var(--nx-risk-medium)",
  },
  low: {
    label: "Low",
    fg: "var(--nx-risk-low)",
    bg: "var(--nx-risk-low-bg)",
    border: "var(--nx-risk-low)",
  },
  minimal: {
    label: "Minimal",
    fg: "var(--nx-risk-minimal)",
    bg: "var(--nx-risk-minimal-bg)",
    border: "var(--nx-risk-minimal)",
  },
};

/** Agent brand colors — all use CSS tokens for theme support */
export const agentStyles: Record<AgentName, { color: string; label: string }> = {
  "Document Agent":      { color: "var(--nx-indigo-600)",  label: "Document" },
  "Entity Agent":        { color: "var(--nx-teal-600)",    label: "Entity" },
  "Screening Agent":     { color: "var(--nx-violet-600)",  label: "Screening" },
  "Risk Agent":          { color: "var(--nx-amber-600)",   label: "Risk" },
  "Regulatory Agent":    { color: "var(--nx-teal-500)",    label: "Regulatory" },
  "Investigation Agent": { color: "var(--nx-rose-600)",    label: "Investigation" },
};

/** Case status visual config */
export const caseStatusStyles: Record<
  CaseStatus,
  { label: string; fg: string; bg: string }
> = {
  "In Progress": {
    label: "In Progress",
    fg: "var(--nx-status-info)",
    bg: "var(--nx-status-info-bg)",
  },
  "Pending Review": {
    label: "Pending Review",
    fg: "var(--nx-status-warning)",
    bg: "var(--nx-status-warning-bg)",
  },
  Escalated: {
    label: "Escalated",
    fg: "var(--nx-status-danger)",
    bg: "var(--nx-status-danger-bg)",
  },
};

/** Confidence level thresholds and styles */
export function getConfidenceLevel(value: number) {
  if (value >= 85) return { level: "high" as const, fg: "var(--nx-emerald-600)", bg: "var(--nx-emerald-50)" };
  if (value >= 60) return { level: "medium" as const, fg: "var(--nx-amber-700)", bg: "var(--nx-amber-50)" };
  return { level: "low" as const, fg: "var(--nx-rose-700)", bg: "var(--nx-rose-50)" };
}

/** Time urgency color — for pending review items */
export function getTimeUrgencyColor(minutes: number): string {
  if (minutes > 480) return "var(--nx-rose-600)";
  if (minutes > 240) return "var(--nx-amber-600)";
  return "var(--nx-neutral-400)";
}
