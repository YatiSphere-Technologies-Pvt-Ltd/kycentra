import type { RiskTier } from "@/features/workbench/types";

export type CasePhase = "detection" | "triage" | "investigation" | "analysis" | "decision" | "drafting" | "filing";
export type PhaseStatus = "completed" | "current" | "pending";
export type CaseInvestigationStatus = "Open" | "In Progress" | "Pending Review" | "Escalated" | "SAR Filed" | "Closed";
export type CaseInvestigationType = "SAR" | "EDD" | "Screening" | "PEP" | "Transaction";
export type EvidenceType = "screening" | "document" | "transaction" | "media" | "registry" | "note" | "ai_finding";
export type EvidenceRelevance = "critical" | "high" | "medium" | "low";
export type AuditActorType = "ai" | "human" | "system";

export interface CaseEntity {
  id: string;
  name: string;
  type: string;
  jurisdiction: string;
  riskTier: RiskTier;
}

export interface PersonRef {
  name: string;
  initials: string;
  role: string;
  online?: boolean;
}

export interface CaseTrigger {
  type: string;
  detail: string;
  timestamp: string;
}

export interface InvestigationPhase {
  id: CasePhase;
  label: string;
  status: PhaseStatus;
  completedAt?: string;
  detail?: string;
}

export interface EvidenceItem {
  id: string;
  title: string;
  type: EvidenceType;
  source: string;
  addedAt: string;
  relevance: EvidenceRelevance;
  isKeyEvidence: boolean;
  aiAnnotation: string;
  analystNotes: string | null;
  linkedToSAR: boolean;
}

export interface AuditEntry {
  id: string;
  timestamp: string;
  actorType: AuditActorType;
  actor: string;
  action: string;
  detail: string;
  model?: string;
  hash?: string;
  evidenceId?: string;
  confidence?: number;
}

export interface ChatMessage {
  id: string;
  sender: string;
  senderType: "human" | "ai";
  role?: string;
  timestamp: string;
  message: string;
}

export interface SimilarCase {
  caseId: string;
  entity: string;
  jurisdiction: string;
  type: string;
  outcome: string;
  similarity: number;
  detail: string;
  resolution: string;
}

export interface CaseDetail {
  id: string;
  title: string;
  type: CaseInvestigationType;
  priority: RiskTier;
  status: CaseInvestigationStatus;
  phase: CasePhase;
  entity: CaseEntity;
  triggers: CaseTrigger[];
  assignee: PersonRef;
  collaborators: PersonRef[];
  createdAt: string;
  elapsedTime: string;
  sla: { total: number; remaining: number; unit: string };
  sarReference: string;
  sarVersion: number;
  sarConfidence: number;
  evidenceCount: number;
  briefConfidence: number;
}
