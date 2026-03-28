import type { GraphNode, GraphEdge, GraphAnomaly } from "../types";

// Hierarchical tree layout positions (calculated)
export const graphNodes: GraphNode[] = [
  // Level 0 — Root
  { id: "ENT-MC-001", type: "legal_entity", name: "Meridian Capital Partners Ltd", jurisdiction: "KY", jurisdictionName: "Cayman Islands", businessType: "Fund Administration", registrationNumber: "CR-283746", riskTier: "high", riskScore: 72, alerts: 3, cases: 2, ubos: 4, isClient: true, x: 550, y: 60, level: 0 },

  // Level 1 — Direct shareholders
  { id: "ENT-MH-002", type: "legal_entity", name: "Meridian Holdings BV", jurisdiction: "NL", jurisdictionName: "Netherlands", businessType: "Holding Company", riskTier: "medium", riskScore: 44, x: 200, y: 220, level: 1 },
  { id: "ENT-PV-003", type: "legal_entity", name: "Pacific Ventures Ltd", jurisdiction: "SG", jurisdictionName: "Singapore", businessType: "Investment Holding", riskTier: "low", riskScore: 28, x: 550, y: 220, level: 1 },
  { id: "ENT-CBT-004", type: "trust", name: "Crown Bay Trust", jurisdiction: "JE", jurisdictionName: "Jersey", businessType: "Private Trust", riskTier: "high", riskScore: 68, pepStatus: true, x: 900, y: 220, level: 1 },

  // Level 2 — UBOs and intermediaries
  { id: "PER-RH-005", type: "natural_person", name: "Richard Hargreaves", nationality: "GB", nationalityName: "United Kingdom", riskTier: "medium", riskScore: 48, isUBO: true, effectiveOwnership: 45, pepStatus: false, roles: ["Director — Meridian Capital", "Director — Apex Offshore"], x: 200, y: 400, level: 2 },
  { id: "PER-KT-006", type: "natural_person", name: "Kenji Tanaka", nationality: "JP", nationalityName: "Japan", riskTier: "low", riskScore: 22, isUBO: true, effectiveOwnership: 23.4, pepStatus: false, x: 440, y: 400, level: 2 },
  { id: "ENT-SIT-007", type: "fund", name: "Sakura Investment Trust", jurisdiction: "JP", jurisdictionName: "Japan", businessType: "Investment Trust", riskTier: "low", riskScore: 18, aum: "¥2.4B", x: 660, y: 400, level: 2 },
  { id: "PER-EW-009", type: "natural_person", name: "Elizabeth Wentworth", nationality: "GB", nationalityName: "United Kingdom", riskTier: "high", riskScore: 75, isUBO: true, effectiveOwnership: 25, pepStatus: true, pepDetail: "Close associate of former UK Secretary of State for Business", x: 900, y: 400, level: 2 },

  // Level 3
  { id: "PER-YS-008", type: "natural_person", name: "Yuki Sato", nationality: "JP", nationalityName: "Japan", riskTier: "low", riskScore: 15, isUBO: true, effectiveOwnership: 6.6, pepStatus: false, x: 660, y: 560, level: 3 },

  // Cross-client + anomaly nodes
  { id: "ENT-AOF-010", type: "legal_entity", name: "Apex Offshore Fund Services", jurisdiction: "KY", jurisdictionName: "Cayman Islands", businessType: "Fund Administration", riskTier: "medium", riskScore: 52, isClient: true, x: 50, y: 540, level: 3 },
  { id: "ENT-GSC-012", type: "shell_company", name: "Global Services Corp", jurisdiction: "VG", jurisdictionName: "British Virgin Islands", businessType: "Unknown", riskTier: "critical", riskScore: 92, isAnomaly: true, anomalyFlags: ["recently_incorporated", "no_operations", "secrecy_jurisdiction"], x: 440, y: 560, level: 3 },
  { id: "ENT-OFAC-013", type: "sanctioned_entity", name: "Meridian Cap. Ltd", jurisdiction: "KY", jurisdictionName: "Cayman Islands", riskTier: "critical", riskScore: 100, isSanctioned: true, ofacEntry: "SDN #18847", status: "Dissolved (2023)", x: 1100, y: 60, level: 0 },
];

export const graphEdges: GraphEdge[] = [
  { id: "E-001", source: "ENT-MC-001", target: "ENT-MH-002", type: "ownership", ownership: 45, label: "45%" },
  { id: "E-002", source: "ENT-MC-001", target: "ENT-PV-003", type: "ownership", ownership: 30, label: "30%" },
  { id: "E-003", source: "ENT-MC-001", target: "ENT-CBT-004", type: "ownership", ownership: 25, label: "25%" },
  { id: "E-004", source: "ENT-MH-002", target: "PER-RH-005", type: "ownership", ownership: 100, label: "100%" },
  { id: "E-005", source: "ENT-PV-003", target: "PER-KT-006", type: "ownership", ownership: 78, label: "78%" },
  { id: "E-006", source: "ENT-PV-003", target: "ENT-SIT-007", type: "ownership", ownership: 22, label: "22%" },
  { id: "E-007", source: "ENT-SIT-007", target: "PER-YS-008", type: "ownership", ownership: 100, label: "100%" },
  { id: "E-008", source: "ENT-CBT-004", target: "PER-EW-009", type: "beneficial", label: "Beneficiary" },
  { id: "E-009", source: "PER-RH-005", target: "ENT-AOF-010", type: "directorship", label: "Director" },
  { id: "E-010", source: "ENT-GSC-012", target: "ENT-PV-003", type: "ownership", ownership: 5, label: "5%" },
  { id: "E-011", source: "ENT-OFAC-013", target: "ENT-MC-001", type: "sanctions_match", label: "OFAC Match 82%" },
];

export const anomalies: GraphAnomaly[] = [
  { id: "ANOM-001", type: "shell_company", severity: "high", title: "Shell Company Indicators", entity: "Global Services Corp", entityId: "ENT-GSC-012", indicators: ["Incorporated < 12 months ago", "No operations detected", "Secrecy jurisdiction (BVI)", "Nominee director"], aiAnalysis: "Entity exhibits multiple shell company indicators. Recently incorporated in BVI with no detectable operations. Connected to Pacific Ventures through 5% stake — potential layering.", confidence: 0.88, relatedNodes: ["ENT-GSC-012", "ENT-PV-003"] },
  { id: "ANOM-002", type: "pep_proximity", severity: "high", title: "PEP Proximity Warning", entity: "Elizabeth Wentworth", entityId: "PER-EW-009", indicators: ["PEP Level 2: Close associate of former UK Cabinet member", "1 hop to client via trust", "Jersey trust obscures connection"], aiAnalysis: "Elizabeth Wentworth confirmed as PEP associate through Crown Bay Trust (Jersey) holding 25% of Meridian Capital.", confidence: 0.96, relatedNodes: ["PER-EW-009", "ENT-CBT-004", "ENT-MC-001"] },
  { id: "ANOM-003", type: "cross_client", severity: "medium", title: "Cross-Client Connection", entity: "Richard Hargreaves", entityId: "PER-RH-005", indicators: ["Shared director: R. Hargreaves", "Both Cayman domiciled", "Same sector"], aiAnalysis: "Shared directorship between two client entities in the same jurisdiction and sector warrants monitoring.", confidence: 0.72, relatedNodes: ["PER-RH-005", "ENT-MC-001", "ENT-AOF-010"] },
];
