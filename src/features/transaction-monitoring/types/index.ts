import type { RiskTier } from "@/features/workbench/types";

export type TxAlertStatus = "pending" | "investigating" | "resolved" | "escalated";
export type TxAlertType = "structuring" | "velocity" | "round_amount" | "high_risk_geo" | "unusual_pattern" | "layering" | "rapid_movement" | "dormant_reactivation";
export type TxDisposition = "suspicious" | "not_suspicious" | "escalate" | "request_info";

export interface TxAlert {
  id: string;
  entityId: string;
  entityName: string;
  entityRiskTier: RiskTier;
  type: TxAlertType;
  typeLabel: string;
  status: TxAlertStatus;
  riskTier: RiskTier;
  amount: string;
  currency: string;
  counterparty: string;
  counterpartyJurisdiction: string;
  description: string;
  aiSummary: string;
  aiConfidence: number;
  aiRecommendation: string;
  whyFlagged: string[];
  timestamp: string;
  timePending: string;
  transactionDate: string;
  transactionCount?: number;
  relatedTxIds?: string[];
  historicalPattern?: string;
}

export interface TxMetrics {
  totalMonitored: number;
  alertsGenerated: number;
  autoResolved: number;
  pendingReview: number;
  investigationsOpened: number;
  sarsFiledFromTx: number;
  falsePositiveRate: number;
  avgResolutionTime: string;
  rulesFired: number;
  modelsActive: number;
}

export interface TxVolumePoint {
  hour: string;
  volume: number;
  alerts: number;
  expected: number;
}
