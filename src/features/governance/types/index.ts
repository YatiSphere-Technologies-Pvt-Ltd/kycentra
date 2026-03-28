export type AgentHealthStatus = "active" | "processing" | "idle" | "error" | "suspended";
export type ModelRiskTier = 1 | 2 | 3;
export type ModelStatus = "production" | "staging" | "retired" | "suspended";
export type IncidentSeverity = "critical" | "warning" | "info";
export type DriftStatus = "no_drift" | "approaching" | "drifted";

export interface GovernanceOverview {
  systemUptime: number;
  agentsActive: number;
  agentsTotal: number;
  decisionsToday: number;
  autoRate: number;
  euAiActStatus: "conformant" | "non_conformant" | "pending";
  nextAuditType: string;
  nextAuditDate: string;
  nextAuditDays: number;
}

export interface AgentHealth {
  id: string;
  name: string;
  icon: string;
  color: string;
  status: AgentHealthStatus;
  uptime30d: number;
  modelId: string;
  modelName: string;
  modelVersion: string;
  riskTier: ModelRiskTier;
  todayActions: number;
  todayAutoRate: number;
  todayErrors: number;
  avgLatency: string;
  p99Latency: string;
  avgConfidence: number;
  accuracy: Record<string, number>;
  overrideRate: number;
  lastAction: string;
  driftAlert?: { severity: IncidentSeverity; detail: string };
}

export interface ModelEntry {
  id: string;
  name: string;
  agent: string;
  base: string;
  version: string;
  riskTier: ModelRiskTier;
  status: ModelStatus;
  deployedDate: string;
  nextValidation: string;
  approvalChain: { step: string; status: "done" | "pending"; date?: string }[];
}

export interface DecisionEntry {
  id: string;
  timestamp: string;
  agent: string;
  agentIcon: string;
  entity: string;
  decision: string;
  confidence: number;
  model: string;
  latency: string;
  reasoning: string;
  override: string | null;
  hash: string;
}

export interface DriftTest {
  agent: string;
  pValue: number;
  status: DriftStatus;
}

export interface BiasTest {
  characteristic: string;
  disparity: number;
  threshold: number;
  status: "pass" | "fail";
  lastTest: string;
}

export interface Incident {
  id: string;
  date: string;
  severity: IncidentSeverity;
  agent: string;
  title: string;
  detail: string;
  status: "open" | "resolved";
  actionTaken?: string;
}

export interface GovernanceAlert {
  severity: IncidentSeverity;
  message: string;
  action: string;
}
