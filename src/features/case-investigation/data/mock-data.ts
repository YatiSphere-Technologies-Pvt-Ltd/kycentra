import type { CaseDetail, InvestigationPhase, EvidenceItem, AuditEntry, ChatMessage, SimilarCase } from "../types";

export const caseDetail: CaseDetail = {
  id: "FC-2026-0847",
  title: "SAR Investigation",
  type: "SAR",
  priority: "high",
  status: "In Progress",
  phase: "investigation",
  entity: { id: "ENT-2019-MC-8847", name: "Meridian Capital Partners Ltd", type: "Legal Entity", jurisdiction: "Cayman Islands", riskTier: "high" },
  triggers: [
    { type: "screening", detail: "OFAC SDN match SCR-4521 (82% match score)", timestamp: "2026-03-22T16:00:00Z" },
    { type: "pep", detail: "PEP association detected — Elizabeth Wentworth via Crown Bay Trust", timestamp: "2026-03-22T16:10:00Z" },
  ],
  assignee: { name: "Sarah Chen", initials: "SC", role: "Senior Compliance Analyst" },
  collaborators: [{ name: "James Park", initials: "JP", role: "Compliance Manager", online: true }],
  createdAt: "2026-03-22T16:15:00Z",
  elapsedTime: "3h 42m",
  sla: { total: 7, remaining: 5, unit: "days" },
  sarReference: "SAR-2026-MC-0847",
  sarVersion: 2,
  sarConfidence: 0.78,
  evidenceCount: 9,
  briefConfidence: 0.72,
};

export const phases: InvestigationPhase[] = [
  { id: "detection", label: "Detection", status: "completed", completedAt: "2026-03-22T16:00:00Z", detail: "OFAC match and PEP association detected" },
  { id: "triage", label: "Triage", status: "completed", completedAt: "2026-03-22T16:15:00Z", detail: "Case created, priority HIGH, assigned to Sarah Chen" },
  { id: "investigation", label: "Investigation", status: "current", detail: "Analyst investigating PEP association and OFAC match" },
  { id: "analysis", label: "Analysis", status: "pending" },
  { id: "decision", label: "Decision", status: "pending" },
  { id: "drafting", label: "Drafting", status: "pending" },
  { id: "filing", label: "Filing", status: "pending" },
];

export const evidenceItems: EvidenceItem[] = [
  { id: "EV-001", title: "OFAC SDN Entry #18847", type: "screening", source: "Screening Agent", addedAt: "Mar 22, 4:00 PM", relevance: "critical", isKeyEvidence: true, aiAnnotation: "Strong name and jurisdiction match but registration identifiers differ. Registry verification needed.", analystNotes: null, linkedToSAR: true },
  { id: "EV-002", title: "PEP Record — Elizabeth Wentworth", type: "screening", source: "Screening Agent", addedAt: "Mar 22, 4:10 PM", relevance: "critical", isKeyEvidence: true, aiAnnotation: "Confirmed PEP: close associate of former UK Secretary of State for Business (2015-2019). Level 2 classification. Requires EDD.", analystNotes: null, linkedToSAR: true },
  { id: "EV-003", title: "CIMA Registry — Meridian Capital Partners Ltd", type: "registry", source: "Entity Agent", addedAt: "Mar 22, 4:05 PM", relevance: "high", isKeyEvidence: true, aiAnnotation: "Active entity, registration CR-283746. CIMA licensed for securities investment business.", analystNotes: null, linkedToSAR: true },
  { id: "EV-004", title: "UBO Chain Analysis — 5 layers, 4 jurisdictions", type: "ai_finding", source: "Entity Agent", addedAt: "Mar 22, 4:10 PM", relevance: "high", isKeyEvidence: true, aiAnnotation: "Complete ownership unwrapping: 4 UBOs through 7 intermediary entities across KY, NL, SG, JE, JP.", analystNotes: null, linkedToSAR: true },
  { id: "EV-005", title: "Crown Bay Trust Deed (Extracted)", type: "document", source: "Document Agent", addedAt: "Mar 22, 4:30 PM", relevance: "high", isKeyEvidence: false, aiAnnotation: "Trust established 2015. Settlor & beneficiary: Elizabeth Wentworth. Trustee: Crown Trust Services Ltd (Jersey).", analystNotes: null, linkedToSAR: false },
  { id: "EV-006", title: "Transaction Analysis — 12 months", type: "transaction", source: "Risk Agent", addedAt: "Mar 22, 5:00 PM", relevance: "medium", isKeyEvidence: false, aiAnnotation: "Patterns consistent with fund administration. $2.1M-$8.4M monthly. No anomalies.", analystNotes: null, linkedToSAR: false },
  { id: "EV-007", title: "Adverse Media Scan — Meridian Capital", type: "media", source: "Screening Agent", addedAt: "Mar 22, 4:45 PM", relevance: "low", isKeyEvidence: false, aiAnnotation: "1 informational FT article about offshore fund structures. No allegations.", analystNotes: null, linkedToSAR: false },
  { id: "EV-008", title: "AI Screening Analysis — OFAC Assessment", type: "ai_finding", source: "Screening Agent", addedAt: "Mar 23, 9:38 AM", relevance: "critical", isKeyEvidence: true, aiAnnotation: "Match score 82%. Name phonetic 0.87, jurisdiction match, entity type compatible. Reg # not available in OFAC. Inconclusive.", analystNotes: null, linkedToSAR: true },
  { id: "EV-009", title: "CIMA Registry — Dissolved Entity Confirmation", type: "registry", source: "Investigation Agent", addedAt: "Mar 23, 10:25 AM", relevance: "critical", isKeyEvidence: true, aiAnnotation: "\"Meridian Cap. Ltd\" matching OFAC entry was dissolved in 2023. Different entity from our client (CR-283746, still active). FALSE POSITIVE confirmed.", analystNotes: null, linkedToSAR: true },
];

export const auditTrail: AuditEntry[] = [
  { id: "aud-1", timestamp: "Mar 23, 10:25 AM", actorType: "ai", actor: "Investigation Agent", action: "Evidence Added", detail: "CIMA registry query: \"Meridian Cap. Ltd\" dissolved 2023, different entity", evidenceId: "EV-009", confidence: 89, model: "claude-opus-4-6", hash: "8a7f2c1d..." },
  { id: "aud-2", timestamp: "Mar 23, 10:22 AM", actorType: "human", actor: "Sarah Chen", action: "Comment Added", detail: "Running registry check. AI brief suggests reg numbers don't match." },
  { id: "aud-3", timestamp: "Mar 23, 10:15 AM", actorType: "human", actor: "James Park", action: "Comment Added", detail: "Prioritize OFAC match — large redemption next week." },
  { id: "aud-4", timestamp: "Mar 23, 9:38 AM", actorType: "ai", actor: "Screening Agent", action: "Alert Escalated", detail: "OFAC SDN match SCR-4521 — confidence 42% < 80% threshold", evidenceId: "EV-001", confidence: 42, model: "claude-sonnet-4-6", hash: "3b9e1f4a..." },
  { id: "aud-5", timestamp: "Mar 23, 9:20 AM", actorType: "ai", actor: "Investigation Agent", action: "Brief Generated (v2)", detail: "Auto-assembled brief with 8 evidence items and 3 precedent cases", confidence: 72, model: "claude-opus-4-6", hash: "5c2d8e7b..." },
  { id: "aud-6", timestamp: "Mar 22, 4:15 PM", actorType: "system", actor: "System", action: "Case Created", detail: "Auto-created from OFAC match (SCR-4521) + PEP detection (SCR-4523). Assigned to Sarah Chen. Priority: HIGH." },
];

export const chatMessages: ChatMessage[] = [
  { id: "msg-1", sender: "James Park", senderType: "human", role: "Compliance Manager", timestamp: "10:15 AM", message: "Sarah, can you prioritize the OFAC match resolution? The entity has a large redemption coming up next week and we need to determine if we need to block it." },
  { id: "msg-2", sender: "Sarah Chen", senderType: "human", role: "You", timestamp: "10:22 AM", message: "On it. Running registry check now. The AI brief suggests registration numbers don't match — will verify directly with CIMA online registry." },
  { id: "msg-3", sender: "Investigation Agent", senderType: "ai", timestamp: "10:25 AM", message: "I've queried the CIMA public registry. Result: Entity \"Meridian Cap. Ltd\" with registration matching OFAC entry was dissolved in 2023. Different entity from our client (CR-283746, still active). Evidence added as EV-009. Updated recommendation: FALSE POSITIVE (89% confidence)." },
];

export const similarCases: SimilarCase[] = [
  { caseId: "FC-2025-0412", entity: "Apex Offshore Fund Services", jurisdiction: "Cayman Islands", type: "SAR", outcome: "SAR Filed", similarity: 87, detail: "OFAC name match + complex UBO structure", resolution: "True match confirmed via registry check" },
  { caseId: "FC-2025-0298", entity: "Pacific Rim Holdings Ltd", jurisdiction: "BVI", type: "Screening", outcome: "Closed", similarity: 74, detail: "OFAC match + jurisdiction risk", resolution: "Different entity — registration # mismatch" },
  { caseId: "FC-2024-1105", entity: "Crown Financial Services", jurisdiction: "Jersey", type: "PEP", outcome: "EDD Approved", similarity: 71, detail: "PEP association in trust structure", resolution: "PEP relationship deemed incidental, no SAR" },
];

export const sarNarrative = `Meridian Capital Partners Ltd ("the Subject") is a fund administration entity incorporated in the Cayman Islands (Registration: CR-283746) on March 15, 2017. The Subject has maintained an account relationship since March 2019, with services including fund administration, NAV calculation, and investor services.

The Subject's beneficial ownership structure comprises:
• Richard Hargreaves (45% via Meridian Holdings BV, NL)
• Kenji Tanaka (23.4% via Pacific Ventures Ltd, SG)
• Yuki Sato (6.6% via Pacific Ventures/Sakura Trust, JP)
• Elizabeth Wentworth (25% via Crown Bay Trust, Jersey) [EV-002]

On March 22, 2026, routine screening identified a potential match between the Subject and OFAC SDN Entry #18847 ("Meridian Cap. Ltd") [EV-001]. Concurrently, beneficial ownership analysis identified Elizabeth Wentworth as a Politically Exposed Person (PEP) — specifically, a close associate of a former UK Secretary of State for Business (2015-2019) [EV-002].

Investigation confirmed via CIMA registry that the OFAC-listed "Meridian Cap. Ltd" was dissolved in 2023 and is a different entity from the Subject [EV-009]. The OFAC match is determined to be a FALSE POSITIVE.

The PEP association through Elizabeth Wentworth remains active and warrants Enhanced Due Diligence procedures, though the PEP relationship alone does not constitute suspicious activity requiring SAR filing.`;

export const transactionData = [
  { month: "Apr '25", volume: 3200000, expected: 3500000 },
  { month: "May '25", volume: 4100000, expected: 3800000 },
  { month: "Jun '25", volume: 8400000, expected: 7500000 },
  { month: "Jul '25", volume: 2800000, expected: 3200000 },
  { month: "Aug '25", volume: 3500000, expected: 3400000 },
  { month: "Sep '25", volume: 7200000, expected: 7000000 },
  { month: "Oct '25", volume: 3100000, expected: 3300000 },
  { month: "Nov '25", volume: 4200000, expected: 3900000 },
  { month: "Dec '25", volume: 8100000, expected: 7800000 },
  { month: "Jan '26", volume: 2100000, expected: 2800000 },
  { month: "Feb '26", volume: 3800000, expected: 3500000 },
  { month: "Mar '26", volume: 5200000, expected: 4800000 },
];
