// ============================================================
// Workbench domain types
// ============================================================

export type RiskTier = "critical" | "high" | "medium" | "low" | "minimal";

export type AgentName =
  | "Document Agent"
  | "Entity Agent"
  | "Screening Agent"
  | "Risk Agent"
  | "Regulatory Agent"
  | "Investigation Agent";

export type CaseType = "SAR" | "EDD" | "PEP" | "Screening";

export type CaseStatus = "In Progress" | "Pending Review" | "Escalated";

export type ReviewType =
  | "Screening Match"
  | "EDD Review"
  | "Document Validation"
  | "Adverse Media"
  | "Periodic KYC Review";

export interface User {
  name: string;
  role: string;
  avatar: string;
  unreadNotifications: number;
}

export interface Agent {
  name: AgentName;
  status: "active" | "idle" | "error";
  tasksCompleted: number;
  icon: string;
  color: string;
}

export interface ActivityItem {
  id: string;
  agent: AgentName;
  action: string;
  detail: string;
  confidence: number;
  timestamp: string;
}

export interface PendingReview {
  id: string;
  entity: string;
  type: ReviewType;
  riskTier: RiskTier;
  aiRecommendation: string;
  confidence: number;
  timePending: string;
  priority: number;
}

export interface RiskDistribution {
  critical: number;
  high: number;
  medium: number;
  low: number;
  minimal: number;
}

export interface ActiveCase {
  caseId: string;
  entity: string;
  type: CaseType;
  riskTier: RiskTier;
  status: CaseStatus;
  assignee: { name: string; initials: string };
  updated: string;
}

export interface Metric {
  label: string;
  value: string;
  trend: number;
  unit: string;
  isCount?: boolean;
}
