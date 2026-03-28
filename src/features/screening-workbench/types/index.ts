import type { RiskTier } from "@/features/workbench/types";

export type AlertStatus = "pending" | "resolved" | "escalated" | "on_hold";
export type AIRecommendation = "likely_true_match" | "confirmed_match" | "likely_false_positive" | "inconclusive";
export type DispositionType = "true_positive" | "false_positive" | "escalate" | "request_info";
export type MatchFactorType = "match" | "no_match" | "partial";

export interface MatchFactor {
  field: string;
  score: number;
  type: MatchFactorType;
  method: string;
}

export interface ScreeningAlert {
  id: string;
  entityId: string;
  entityName: string;
  entityType: string;
  entityJurisdiction: string;
  entityRiskTier: RiskTier;
  list: string;
  listEntryId?: string;
  matchScore: number;
  riskTier: RiskTier;
  status: AlertStatus;
  aiRecommendation: AIRecommendation;
  aiConfidence: number;
  aiSummary: string;
  whyNotAutoResolved: string[];
  timestamp: string;
  timePending: string;
  assignee: string | null;
  matchComparison?: {
    clientData: Record<string, string>;
    listData: Record<string, string>;
    factors: MatchFactor[];
  };
  entityContext?: {
    clientSince: string;
    riskScore: number;
    cddLevel: string;
    uboCount: number;
    ubos: string[];
    openCases: number;
    previousAlerts: number;
    previousAlertsOutcome: string;
    lastReview: string;
    nextReviewDue: string;
  };
  relatedAlerts?: { id: string; list: string; matchScore: number; riskTier: RiskTier }[];
  aiSuggestedJustification?: string;
}

export interface ScreeningMetrics {
  autoResolved: number;
  pendingReview: number;
  humanResolved: number;
  totalScreened: number;
  throughput: number;
  falsePositiveRate: number;
  avgResolutionTime: string;
  yesterdayAutoResolved: number;
  yesterdayPending: number;
  yesterdayThroughput: number;
  yesterdayAvgTime: string;
  yesterdayFPRate: number;
}
