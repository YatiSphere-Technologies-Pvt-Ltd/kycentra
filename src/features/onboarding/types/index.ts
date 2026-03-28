export type OnboardingStage = "initiation" | "data_collection" | "verification" | "screening" | "risk_assessment" | "approval" | "activation";
export type StageStatus = "completed" | "current" | "in_progress" | "pending";
export type DDLevel = "SDD" | "CDD" | "EDD" | "EDD+";
export type RequirementStatus = "complete" | "processing" | "pending" | "failed";
export type DocUploadStatus = "verified" | "processing" | "pending" | "issue" | "rejected";
export type AgentTaskStatus = "active" | "completed" | "waiting" | "idle";

export interface OnboardingEntity {
  name: string;
  type: string;
  subType: string;
  jurisdiction: string;
  jurisdictionCode: string;
  registrationNumber: string;
  dateOfIncorporation: string;
  registeredAddress: string;
  natureOfBusiness: string | null;
  expectedActivity: string | null;
}

export interface OnboardingClient {
  name: string;
  email: string;
  status: "online" | "offline";
  lastActivity: string;
  language: string;
  device: string;
}

export interface OnboardingRecord {
  id: string;
  status: string;
  stage: OnboardingStage;
  progress: number;
  entity: OnboardingEntity;
  dueDiligenceLevel: { recommended: DDLevel; confidence: number; reasoning: string; overridden: boolean };
  client: OnboardingClient;
  relationshipManager: { name: string; initials: string };
  analyst: { name: string; initials: string };
  startedAt: string;
  estimatedCompletion: string;
  sla: { total: number; elapsed: number; unit: string };
}

export interface OnboardingStageItem {
  id: OnboardingStage;
  label: string;
  status: StageStatus;
  progress?: string;
}

export interface RequirementItem {
  id: string;
  label: string;
  value: string | null;
  status: RequirementStatus;
  source: "ai" | "client" | "pending";
  sourceDetail?: string;
}

export interface RequirementCategory {
  title: string;
  completedCount: number;
  totalCount: number;
  items: RequirementItem[];
  note?: string;
}

export interface DiscoveredUBO {
  name: string;
  nationality: string;
  ownership: number;
  ownershipType: string;
  location: string;
  source: string;
  idDocumentUploaded: boolean;
  sourceOfWealth: string | null;
}

export interface DocumentRequirement {
  id: string;
  name: string;
  localName?: string;
  status: DocUploadStatus;
  uploadDate?: string;
  aiConfidence?: number | null;
  processingProgress?: number;
  category: string;
}

export interface AgentTask {
  agent: string;
  status: AgentTaskStatus;
  task: string;
  progress?: number;
}
