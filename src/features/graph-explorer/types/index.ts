import type { RiskTier } from "@/features/workbench/types";

export type GraphNodeType = "legal_entity" | "natural_person" | "trust" | "fund" | "shell_company" | "sanctioned_entity";
export type GraphEdgeType = "ownership" | "beneficial" | "directorship" | "shared_address" | "sanctions_match" | "transaction";

export interface GraphNode {
  id: string;
  type: GraphNodeType;
  name: string;
  jurisdiction?: string;
  jurisdictionName?: string;
  businessType?: string;
  registrationNumber?: string;
  riskTier: RiskTier;
  riskScore: number;
  nationality?: string;
  nationalityName?: string;
  isUBO?: boolean;
  effectiveOwnership?: number;
  pepStatus?: boolean;
  pepDetail?: string;
  isClient?: boolean;
  isSanctioned?: boolean;
  isAnomaly?: boolean;
  anomalyFlags?: string[];
  alerts?: number;
  cases?: number;
  ubos?: number;
  ofacEntry?: string;
  status?: string;
  aum?: string;
  roles?: string[];
  // Layout position
  x: number;
  y: number;
  level: number;
}

export interface GraphEdge {
  id: string;
  source: string;
  target: string;
  type: GraphEdgeType;
  ownership?: number;
  label: string;
}

export interface GraphAnomaly {
  id: string;
  type: string;
  severity: "critical" | "high" | "medium";
  title: string;
  entity?: string;
  entityId?: string;
  indicators: string[];
  aiAnalysis: string;
  confidence: number;
  relatedNodes: string[];
}
