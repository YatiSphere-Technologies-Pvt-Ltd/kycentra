import type { RiskTier } from "@/features/workbench/types";

export type ComplianceStatus = "active" | "under_review" | "restricted" | "offboarding";
export type CDDLevel = "SDD" | "CDD" | "EDD" | "EDD+";
export type EntitySubType = "Legal Entity" | "Natural Person" | "Trust" | "Fund";
export type DocumentStatus = "verified" | "issue" | "expiring" | "missing" | "pending";
export type ScreeningPriority = "critical" | "high" | "medium" | "low";
export type TimelineActorType = "ai" | "human" | "system" | "alert";

export interface EntityContact {
  name: string;
  title: string;
  email: string;
  phone: string;
}

export interface PersonRef {
  name: string;
  initials: string;
  avatar: string | null;
}

export interface Entity {
  id: string;
  name: string;
  type: EntitySubType;
  subType: string;
  jurisdiction: string;
  jurisdictionCode: string;
  registrationNumber: string;
  dateOfIncorporation: string;
  registeredAddress: string;
  primaryContact: EntityContact;
  products: string[];
  relationshipManager: PersonRef;
  clientSince: string;
  complianceStatus: ComplianceStatus;
  cddLevel: CDDLevel;
  riskScore: number;
  riskTier: RiskTier;
  aiConfidence: number;
  taxStatus: { fatca: string; crs: string };
  lastScreened: string;
  lastReviewed: string;
  nextReviewDue: string;
  openAlerts: number;
  activeCases: number;
  totalDocuments: number;
}

export interface BeneficialOwner {
  id: string;
  name: string;
  nationality: string;
  effectiveOwnership: number;
  path: string;
  riskTier: RiskTier;
  pepStatus: boolean;
  pepDetail?: string;
  intermediaries: {
    name: string;
    jurisdiction: string;
    ownership: number | null;
    type: string;
    role?: string;
  }[];
}

export interface ReasoningStep {
  label: string;
  detail: string;
  status: "complete" | "warning" | "escalated" | "error";
  source?: { type: string; label: string; reference: string };
}

export interface ScreeningAlert {
  id: string;
  list: string;
  matchScore: number;
  entryNumber?: string;
  listedName: string;
  listedJurisdiction?: string;
  listedType?: string;
  matchingFactors: string[];
  nonMatchingFactors: string[];
  aiRecommendation: string;
  aiConfidence: number;
  agentName?: string;
  priority: ScreeningPriority;
  timestamp: string;
  timePending: string;
  reasoningSteps?: ReasoningStep[];
}

export interface EntityDocument {
  id: string;
  name: string;
  category: string;
  status: DocumentStatus;
  uploadDate?: string;
  expiryDate?: string;
  verifiedBy?: string;
  aiConfidence: number | null;
  issueDetail?: string;
  extractedFields?: {
    field: string;
    value: string;
    match: boolean;
    expected?: string;
  }[];
}

export interface RiskFactor {
  name: string;
  score: number;
  weight: number;
  detail: string;
}

export interface TimelineEvent {
  id: string;
  type: TimelineActorType;
  agent?: string;
  actor?: string;
  action: string;
  detail?: string;
  confidence?: number;
  timestamp: string;
  reasoningSteps?: ReasoningStep[];
}

export interface ReviewItem {
  id: string;
  type: string;
  completed: string;
  outcome: string;
  reviewer: string;
  riskChange: string;
}
