import type { GovernanceOverview, AgentHealth, ModelEntry, DecisionEntry, DriftTest, BiasTest, Incident, GovernanceAlert } from "../types";

export const overview: GovernanceOverview = {
  systemUptime: 99.98, agentsActive: 6, agentsTotal: 6, decisionsToday: 2847, autoRate: 0.85,
  euAiActStatus: "conformant", nextAuditType: "SOC 2 Type II", nextAuditDate: "2026-04-06", nextAuditDays: 14,
};

export const alerts: GovernanceAlert[] = [
  { severity: "warning", message: "Screening Agent drift detected — accuracy dropped 2.3% (under threshold but trending)", action: "View" },
  { severity: "info", message: "Bias audit due in 5 days for Risk Agent", action: "Schedule" },
];

export const agentHealth: AgentHealth[] = [
  { id: "doc", name: "Document Agent", icon: "📄", color: "#2563EB", status: "active", uptime30d: 99.99, modelId: "MOD-DOC-001", modelName: "Document Classification", modelVersion: "v2.4.1", riskTier: 2, todayActions: 142, todayAutoRate: 0.98, todayErrors: 0, avgLatency: "4.2s", p99Latency: "12.1s", avgConfidence: 0.942, accuracy: { extraction: 0.973, classification: 0.981, fraud: 0.948 }, overrideRate: 0.012, lastAction: "Verified financial statements for Helios Asset Management" },
  { id: "entity", name: "Entity Agent", icon: "🏢", color: "#0D9488", status: "active", uptime30d: 99.97, modelId: "MOD-ENT-001", modelName: "UBO Discovery Engine", modelVersion: "v2.4.1", riskTier: 2, todayActions: 87, todayAutoRate: 1.0, todayErrors: 0, avgLatency: "8.4s", p99Latency: "45.2s", avgConfidence: 0.961, accuracy: { registry: 0.994, ubo: 0.978, ownership: 0.982 }, overrideRate: 0.004, lastAction: "Completed UBO discovery for Northwind Holdings" },
  { id: "screen", name: "Screening Agent", icon: "🛡", color: "#7C3AED", status: "active", uptime30d: 99.98, modelId: "MOD-SCR-001", modelName: "Alert Resolution Engine", modelVersion: "v2.4.1", riskTier: 1, todayActions: 812, todayAutoRate: 0.85, todayErrors: 0, avgLatency: "1.8s", p99Latency: "12.1s", avgConfidence: 0.894, accuracy: { autoResolution: 0.973, truePositive: 0.9997, falsePositive: 0.18 }, overrideRate: 0.003, lastAction: "Auto-resolved 3 EU sanctions alerts", driftAlert: { severity: "warning", detail: "Accuracy dipped 2.3% on Mar 21, auto-recovered" } },
  { id: "risk", name: "Risk Agent", icon: "⚡", color: "#D97706", status: "active", uptime30d: 99.99, modelId: "MOD-RISK-001", modelName: "Dynamic Risk Scoring", modelVersion: "v1.8.3", riskTier: 1, todayActions: 56, todayAutoRate: 0.92, todayErrors: 0, avgLatency: "3.1s", p99Latency: "8.7s", avgConfidence: 0.878, accuracy: { scoring: 0.941, narrative: 0.89 }, overrideRate: 0.008, lastAction: "Elevated risk for Horizon Trading LLC" },
  { id: "reg", name: "Regulatory Agent", icon: "📖", color: "#0891B2", status: "active", uptime30d: 99.95, modelId: "MOD-REG-001", modelName: "Regulatory Intelligence", modelVersion: "v1.8.3", riskTier: 2, todayActions: 23, todayAutoRate: 0.87, todayErrors: 0, avgLatency: "6.8s", p99Latency: "22.4s", avgConfidence: 0.921, accuracy: { coverage: 0.982, citation: 0.967 }, overrideRate: 0.005, lastAction: "Mapped GwG requirements for Helios onboarding" },
  { id: "invest", name: "Investigation Agent", icon: "🔍", color: "#DC2626", status: "idle", uptime30d: 99.94, modelId: "MOD-INV-001", modelName: "Investigation Assembler", modelVersion: "v1.5.2", riskTier: 1, todayActions: 3, todayAutoRate: 0.60, todayErrors: 0, avgLatency: "12.4s", p99Latency: "58.1s", avgConfidence: 0.782, accuracy: { briefQuality: 0.88, evidenceChain: 0.92, sarAcceptance: 0.85 }, overrideRate: 0.02, lastAction: "Drafted SAR narrative for FC-2026-0847" },
];

export const models: ModelEntry[] = [
  { id: "MOD-SCR-001", name: "Screening Alert Resolution", agent: "Screening", base: "claude-sonnet-4-6", version: "v2.4.1", riskTier: 1, status: "production", deployedDate: "2026-03-16", nextValidation: "2026-04-15", approvalChain: [{ step: "Development", status: "done", date: "Jan 2026" }, { step: "Validation", status: "done", date: "Feb 2026" }, { step: "Ethics Committee", status: "done", date: "Feb 28" }, { step: "MLRO Sign-Off", status: "done", date: "Mar 16" }, { step: "Independent Validation", status: "pending" }] },
  { id: "MOD-SCR-002", name: "Adverse Media Analyzer", agent: "Screening", base: "claude-sonnet-4-6", version: "v2.2.0", riskTier: 1, status: "production", deployedDate: "2026-02-01", nextValidation: "2026-05-01", approvalChain: [{ step: "Development", status: "done" }, { step: "Validation", status: "done" }, { step: "MLRO Sign-Off", status: "done" }, { step: "Independent Validation", status: "pending" }] },
  { id: "MOD-RISK-001", name: "Dynamic Risk Scoring", agent: "Risk", base: "claude-opus-4-6", version: "v1.8.3", riskTier: 1, status: "production", deployedDate: "2026-01-10", nextValidation: "2026-04-10", approvalChain: [{ step: "Development", status: "done" }, { step: "Validation", status: "done" }, { step: "Ethics Committee", status: "done" }, { step: "MLRO Sign-Off", status: "done" }, { step: "Independent Validation", status: "pending" }] },
  { id: "MOD-DOC-001", name: "Document Classification", agent: "Document", base: "claude-sonnet-4-6", version: "v2.4.1", riskTier: 2, status: "production", deployedDate: "2026-03-16", nextValidation: "2026-09-16", approvalChain: [{ step: "Development", status: "done" }, { step: "Validation", status: "done" }, { step: "Model Risk Mgr", status: "done" }] },
  { id: "MOD-DOC-002", name: "Fraud Detection Engine", agent: "Document", base: "claude-sonnet-4-6", version: "v1.9.0", riskTier: 2, status: "production", deployedDate: "2026-02-15", nextValidation: "2026-08-15", approvalChain: [{ step: "Development", status: "done" }, { step: "Validation", status: "done" }, { step: "Model Risk Mgr", status: "done" }] },
  { id: "MOD-ENT-001", name: "UBO Discovery Engine", agent: "Entity", base: "claude-sonnet-4-6", version: "v2.4.1", riskTier: 2, status: "production", deployedDate: "2026-03-16", nextValidation: "2026-09-16", approvalChain: [{ step: "Development", status: "done" }, { step: "Validation", status: "done" }, { step: "Model Risk Mgr", status: "done" }] },
];

export const decisions: DecisionEntry[] = [
  { id: "DEC-0384721", timestamp: "Today, 10:25 AM", agent: "Screening Agent", agentIcon: "🛡", entity: "Deutsche Industriebank AG", decision: "FALSE POSITIVE — auto-resolved", confidence: 94, model: "MOD-SCR-001 v2.4.1", latency: "2.3s", reasoning: "Name similarity only (0.45). No jurisdiction, DOB, or business activity overlap.", override: null, hash: "8a7f2c1d..." },
  { id: "DEC-0384720", timestamp: "Today, 10:22 AM", agent: "Risk Agent", agentIcon: "⚡", entity: "Horizon Trading LLC", decision: "RISK ELEVATED 58→72 — awaiting approval", confidence: 88, model: "MOD-RISK-001 v1.8.3", latency: "3.1s", reasoning: "PEP association detected in UBO chain. Jurisdiction risk elevated.", override: "PENDING (Sarah Chen)", hash: "3b9e1f4a..." },
  { id: "DEC-0384719", timestamp: "Today, 10:17 AM", agent: "Document Agent", agentIcon: "📄", entity: "Helios Asset Management GmbH", decision: "VERIFIED — auto-processed", confidence: 95, model: "MOD-DOC-001 v2.4.1", latency: "4.2s", reasoning: "Financial statements extracted. Revenue, assets, net income validated against entity record.", override: null, hash: "5c2d8e7b..." },
  { id: "DEC-0384718", timestamp: "Today, 10:15 AM", agent: "Screening Agent", agentIcon: "🛡", entity: "Tanaka Holdings Ltd", decision: "FALSE POSITIVE — auto-resolved", confidence: 97, model: "MOD-SCR-001 v2.4.1", latency: "1.8s", reasoning: "Different entity type and jurisdiction. No matching identifiers.", override: null, hash: "7d4e2f9c..." },
  { id: "DEC-0384717", timestamp: "Today, 10:12 AM", agent: "Entity Agent", agentIcon: "🏢", entity: "Northwind Holdings Group", decision: "UBO DISCOVERY — completed", confidence: 96, model: "MOD-ENT-001 v2.4.1", latency: "8.4s", reasoning: "Recursive unwrapping: 5 jurisdictions, 7 entities, 3 UBOs identified.", override: null, hash: "1a3b5c7d..." },
];

export const driftTests: DriftTest[] = [
  { agent: "Document Agent", pValue: 0.34, status: "no_drift" },
  { agent: "Entity Agent", pValue: 0.67, status: "no_drift" },
  { agent: "Screening Agent", pValue: 0.08, status: "approaching" },
  { agent: "Risk Agent", pValue: 0.42, status: "no_drift" },
  { agent: "Regulatory Agent", pValue: 0.78, status: "no_drift" },
  { agent: "Investigation Agent", pValue: 0.55, status: "no_drift" },
];

export const biasTests: BiasTest[] = [
  { characteristic: "Nationality/Origin", disparity: 2.1, threshold: 5, status: "pass", lastTest: "Mar 1" },
  { characteristic: "Jurisdiction Risk", disparity: 3.8, threshold: 5, status: "pass", lastTest: "Mar 1" },
  { characteristic: "Entity Size", disparity: 1.4, threshold: 5, status: "pass", lastTest: "Mar 1" },
  { characteristic: "Entity Age", disparity: 0.9, threshold: 5, status: "pass", lastTest: "Mar 1" },
  { characteristic: "Industry Sector", disparity: 2.7, threshold: 5, status: "pass", lastTest: "Mar 1" },
  { characteristic: "UBO Gender", disparity: 0.3, threshold: 5, status: "pass", lastTest: "Mar 1" },
];

export const incidents: Incident[] = [
  { id: "INC-007", date: "Mar 21", severity: "warning", agent: "Screening Agent", title: "Accuracy dip following OFAC list update", detail: "Accuracy dropped 2.3%. Auto-recovered within 4h. Root cause: new naming patterns not in training data.", status: "resolved", actionTaken: "Model retrained with new naming patterns" },
  { id: "INC-006", date: "Mar 14", severity: "warning", agent: "Risk Agent", title: "Override rate spike to 1.8%", detail: "Caused by new FATF grey list additions not in model training data.", status: "resolved", actionTaken: "Emergency model update with FATF list refresh" },
  { id: "INC-005", date: "Mar 3", severity: "info", agent: "Document Agent", title: "Latency increase during peak processing", detail: "P99 latency exceeded 30s during batch document upload. Resolved by scaling.", status: "resolved", actionTaken: "Auto-scaling rules adjusted" },
];
