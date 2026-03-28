export type ApprovalType = "screening_disposition" | "risk_approval" | "document_review" | "onboarding_approval" | "sar_review" | "rule_deployment" | "periodic_review";
export type ApprovalPriority = "critical" | "high" | "normal";
export type SLAStatus = "ok" | "warning" | "breach_imminent" | "breached";

export interface ApprovalEntity {
  id: string;
  name: string;
  jurisdiction: string;
  riskTier: string;
  riskScore?: number;
  cddLevel?: string;
}

export interface ApprovalSLA {
  total: number;
  elapsed: number;
  remaining: number;
  unit: string;
  status: SLAStatus;
}

export interface ApprovalItem {
  id: string;
  type: ApprovalType;
  agent: string;
  agentName: string;
  agentIcon: string;
  entity: ApprovalEntity | null;
  priority: ApprovalPriority;
  aiRecommendation: string;
  aiConfidence: number;
  aiSummary: string;
  aiSuggestedJustification?: string;
  quickApproveAllowed: boolean;
  reasonForHuman?: string[];
  sla: ApprovalSLA;
  requestedAt: string;
  // Type-specific data
  riskChange?: { beforeScore: number; beforeTier: string; afterScore: number; afterTier: string; trigger: string };
  documentDiscrepancy?: { document: string; field: string; clientValue: string; registryValue: string; aiAssessment: string };
  agentSignoffs?: Record<string, string>;
  ruleChange?: { ruleId: string; from: string; to: string; affectedEntities: number };
  sarDraft?: { version: number; wordCount: number; qualityScore: string };
}

export interface ApprovalMetrics {
  pending: number;
  urgent: number;
  avgWaitTime: string;
  completedToday: number;
  slaCompliance: number;
  byAgent: Record<string, number>;
  approachingSLA: number;
}
