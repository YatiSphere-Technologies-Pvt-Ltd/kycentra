import type {
  Entity,
  BeneficialOwner,
  ScreeningAlert,
  EntityDocument,
  RiskFactor,
  TimelineEvent,
  ReviewItem,
} from "../types";

export const entity: Entity = {
  id: "ENT-2019-MC-8847",
  name: "Meridian Capital Partners Ltd",
  type: "Legal Entity",
  subType: "Fund Administrator",
  jurisdiction: "Cayman Islands",
  jurisdictionCode: "KY",
  registrationNumber: "CR-283746",
  dateOfIncorporation: "2017-03-15",
  registeredAddress: "PO Box 309, Ugland House, George Town, Grand Cayman, KY1-1104",
  primaryContact: { name: "Richard Hargreaves", title: "Managing Director", email: "r.hargreaves@meridiancap.ky", phone: "+1 (345) 949-7000" },
  products: ["Fund Administration", "NAV Calculation", "Investor Services"],
  relationshipManager: { name: "James Park", initials: "JP", avatar: null },
  clientSince: "2019-03-01",
  complianceStatus: "active",
  cddLevel: "EDD",
  riskScore: 72,
  riskTier: "high",
  aiConfidence: 0.67,
  taxStatus: { fatca: "W-8BEN-E on file", crs: "Reporting Financial Institution" },
  lastScreened: "2026-03-23T08:15:00Z",
  lastReviewed: "2025-03-15",
  nextReviewDue: "2026-04-15",
  openAlerts: 3,
  activeCases: 2,
  totalDocuments: 12,
};

export const beneficialOwners: BeneficialOwner[] = [
  { id: "UBO-001", name: "Richard Hargreaves", nationality: "GB", effectiveOwnership: 45, path: "Meridian Capital → Meridian Holdings BV (100%) → Richard Hargreaves", riskTier: "medium", pepStatus: false, intermediaries: [{ name: "Meridian Holdings BV", jurisdiction: "NL", ownership: 100, type: "holding" }] },
  { id: "UBO-002", name: "Kenji Tanaka", nationality: "JP", effectiveOwnership: 23.4, path: "Meridian Capital → Pacific Ventures Ltd (78%) → Kenji Tanaka", riskTier: "low", pepStatus: false, intermediaries: [{ name: "Pacific Ventures Ltd", jurisdiction: "SG", ownership: 78, type: "operating" }] },
  { id: "UBO-003", name: "Yuki Sato", nationality: "JP", effectiveOwnership: 6.6, path: "Meridian Capital → Pacific Ventures (22%) → Sakura Investment Trust (100%) → Yuki Sato", riskTier: "low", pepStatus: false, intermediaries: [{ name: "Pacific Ventures Ltd", jurisdiction: "SG", ownership: 22, type: "operating" }, { name: "Sakura Investment Trust", jurisdiction: "JP", ownership: 100, type: "trust" }] },
  { id: "UBO-004", name: "Elizabeth Wentworth", nationality: "GB", effectiveOwnership: 25, path: "Meridian Capital → Crown Bay Trust (Beneficiary) → Elizabeth Wentworth", riskTier: "high", pepStatus: true, pepDetail: "Close associate of former UK Cabinet member (Secretary of State for Business, 2015-2019)", intermediaries: [{ name: "Crown Bay Trust", jurisdiction: "JE", ownership: null, type: "trust", role: "beneficiary" }] },
];

export const pendingAlerts: ScreeningAlert[] = [
  {
    id: "SCR-4521", list: "OFAC SDN", matchScore: 0.82, entryNumber: "18847", listedName: "Meridian Cap. Ltd", listedJurisdiction: "Cayman Islands", listedType: "Financial Services",
    matchingFactors: ["Name (0.87 phonetic)", "Jurisdiction", "Entity type"],
    nonMatchingFactors: ["Registration # (no match)", "Incorporation date", "Directors (different names)"],
    aiRecommendation: "Likely true match — requires investigation. Strong name and jurisdiction overlap but registration identifiers differ.",
    aiConfidence: 0.42, agentName: "Screening Agent", priority: "critical", timestamp: "2026-03-23T09:38:00Z", timePending: "45 min",
    reasoningSteps: [
      { label: "Name Match Analysis", detail: "Phonetic similarity score: 0.87. 'Meridian Capital Partners Ltd' vs 'Meridian Cap. Ltd' — likely abbreviation of same entity.", status: "complete", source: { type: "screening_list", label: "OFAC SDN", reference: "#18847" } },
      { label: "Jurisdiction Comparison", detail: "Both entities registered in Cayman Islands. Geographic match confirmed.", status: "complete" },
      { label: "Entity Type Check", detail: "Client: Fund Administrator. Listed: Financial Services. Compatible classification.", status: "complete" },
      { label: "Identifier Verification", detail: "Client registration CR-283746 has no corresponding identifier in OFAC entry. Cannot confirm or deny match via registration number.", status: "warning" },
      { label: "Conclusion", detail: "Insufficient evidence for autonomous resolution. Name and jurisdiction strongly correlate but unique identifiers unavailable for definitive match. Escalation to analyst recommended.", status: "escalated" },
    ],
  },
  {
    id: "SCR-4523", list: "PEP Database", matchScore: 0.91, entryNumber: "PEP-UK-29847", listedName: "Elizabeth Wentworth", listedJurisdiction: "United Kingdom",
    matchingFactors: ["Name (0.95 exact)", "Nationality", "DOB"], nonMatchingFactors: [],
    aiRecommendation: "True match — PEP classification confirmed. Elizabeth Wentworth is a close associate of former UK Cabinet member. EDD required.",
    aiConfidence: 0.94, priority: "high", timestamp: "2026-03-23T08:15:00Z", timePending: "2h 8m", agentName: "Screening Agent",
  },
  {
    id: "SCR-4525", list: "Adverse Media", matchScore: 0.68, listedName: "Meridian Capital",
    matchingFactors: ["Name partial match"], nonMatchingFactors: ["Context (informational article)"],
    aiRecommendation: "Entity mentioned in Financial Times article about offshore fund structures. Article is informational — not alleging wrongdoing. Likely noise.",
    aiConfidence: 0.78, priority: "medium", timestamp: "2026-03-22T16:30:00Z", timePending: "17h", agentName: "Screening Agent",
  },
];

export const documents: EntityDocument[] = [
  { id: "DOC-001", name: "Certificate of Incorporation", category: "Corporate Structure", status: "issue", uploadDate: "2024-01-15", verifiedBy: "Document Agent", aiConfidence: 0.91, issueDetail: "Date discrepancy: Document shows March 15, 2017 but registry data shows March 14, 2017", extractedFields: [{ field: "Company Name", value: "Meridian Capital Partners Ltd", match: true }, { field: "Registration #", value: "CR-283746", match: true }, { field: "Date of Incorporation", value: "March 15, 2017", match: false, expected: "March 14, 2017" }, { field: "Registered Agent", value: "Maples Corporate Services", match: true }, { field: "Jurisdiction", value: "Cayman Islands", match: true }] },
  { id: "DOC-002", name: "Memorandum & Articles", category: "Corporate Structure", status: "verified", uploadDate: "2024-01-15", aiConfidence: 0.97 },
  { id: "DOC-003", name: "Shareholder Register", category: "Corporate Structure", status: "verified", uploadDate: "2024-01-16", aiConfidence: 0.95 },
  { id: "DOC-004", name: "Board Resolution", category: "Corporate Structure", status: "verified", uploadDate: "2024-01-16", aiConfidence: 0.93 },
  { id: "DOC-005", name: "UBO Declaration Form", category: "Identity & Verification", status: "verified", uploadDate: "2024-01-17", aiConfidence: 0.96 },
  { id: "DOC-006", name: "Proof of Registered Address", category: "Identity & Verification", status: "verified", uploadDate: "2024-01-15", expiryDate: "2026-12-15", aiConfidence: 0.98 },
  { id: "DOC-007", name: "Financial Statements (2025)", category: "Financial & Tax", status: "verified", uploadDate: "2026-02-20", aiConfidence: 0.94 },
  { id: "DOC-008", name: "W-8BEN-E (Tax Form)", category: "Financial & Tax", status: "verified", uploadDate: "2024-03-01", expiryDate: "2027-03-01", aiConfidence: 0.99 },
  { id: "DOC-009", name: "Passport — Richard Hargreaves", category: "Identity & Verification", status: "expiring", uploadDate: "2020-06-10", expiryDate: "2026-06-10", aiConfidence: 0.97 },
  { id: "DOC-010", name: "AML Policy Certificate", category: "Regulatory & Compliance", status: "verified", uploadDate: "2025-06-01", aiConfidence: 0.92 },
  { id: "DOC-011", name: "Source of Funds Declaration", category: "Financial & Tax", status: "pending", aiConfidence: null },
  { id: "DOC-012", name: "Regulatory License (CIMA)", category: "Regulatory & Compliance", status: "verified", uploadDate: "2024-09-15", aiConfidence: 0.96 },
];

export const riskFactors: RiskFactor[] = [
  { name: "Jurisdiction Risk", score: 72, weight: 30, detail: "Cayman Islands — FATF monitoring for AML/CFT deficiencies" },
  { name: "Entity Type Risk", score: 38, weight: 25, detail: "Fund Administrator — regulated activity, moderate inherent risk" },
  { name: "UBO Complexity", score: 85, weight: 20, detail: "5-layer structure, 4 jurisdictions, trust arrangement, PEP in chain" },
  { name: "Transaction Profile", score: 25, weight: 15, detail: "Consistent with stated business — no anomalies detected" },
  { name: "Adverse Media", score: 62, weight: 10, detail: "Mentioned in informational article about offshore structures" },
];

export const timeline: TimelineEvent[] = [
  { id: "evt-1", type: "ai", agent: "Screening Agent", action: "Resolved 2 sanctions alerts as false positives", detail: "EU Sanctions and UK HMT — name only overlap, no other factors", confidence: 94, timestamp: "Today, 10:23 AM" },
  { id: "evt-2", type: "human", actor: "Sarah Chen", action: "Approved EDD documentation package", detail: 'Comment: "Source of funds verified against bank statements"', timestamp: "Today, 9:45 AM" },
  { id: "evt-3", type: "ai", agent: "Risk Agent", action: "Elevated risk score from 58 to 72", detail: "Trigger: PEP association detected in UBO chain", confidence: 88, timestamp: "Yesterday, 4:12 PM" },
  { id: "evt-4", type: "alert", action: "OFAC SDN potential match detected", detail: "Auto-screening triggered new alert SCR-4521", timestamp: "Yesterday, 3:58 PM" },
  { id: "evt-5", type: "ai", agent: "Document Agent", action: "Completed extraction on Certificate of Incorporation", detail: "Issue flagged: date discrepancy between document and registry", confidence: 91, timestamp: "Yesterday, 2:30 PM" },
  { id: "evt-6", type: "ai", agent: "Entity Agent", action: "Completed UBO discovery — 4 beneficial owners identified", detail: "PEP association flagged for Elizabeth Wentworth through Crown Bay Trust", confidence: 96, timestamp: "Mar 21, 11:15 AM" },
  { id: "evt-7", type: "human", actor: "James Park", action: "Assigned case FC-2026-0839 to Sarah Chen", timestamp: "Mar 20, 3:00 PM" },
  { id: "evt-8", type: "system", action: "Annual review initiated — EDD scope", detail: "Due: April 15, 2026", timestamp: "Mar 20, 9:00 AM" },
];

export const reviewHistory: ReviewItem[] = [
  { id: "rev-1", type: "EDD", completed: "Mar 2025", outcome: "Approved — Tier maintained", reviewer: "Sarah Chen", riskChange: "No change" },
  { id: "rev-2", type: "CDD→EDD", completed: "Mar 2024", outcome: "Approved — Tier elevated", reviewer: "James Park", riskChange: "Medium → High" },
  { id: "rev-3", type: "CDD", completed: "Mar 2023", outcome: "Approved", reviewer: "Maria Lopez", riskChange: "No change" },
];

export const screeningLists = [
  { list: "OFAC SDN", status: "alert" as const, matches: 1, lastScreened: "2 hrs ago" },
  { list: "EU Sanctions", status: "clear" as const, matches: 0, lastScreened: "2 hrs ago" },
  { list: "UK HMT", status: "clear" as const, matches: 0, lastScreened: "2 hrs ago" },
  { list: "PEP Database", status: "alert" as const, matches: 1, lastScreened: "2 hrs ago" },
  { list: "Adverse Media", status: "alert" as const, matches: 1, lastScreened: "6 hrs ago" },
  { list: "UN Consolidated", status: "clear" as const, matches: 0, lastScreened: "2 hrs ago" },
];

export const riskNarrative = "Meridian Capital Partners Ltd presents elevated risk primarily due to its incorporation in the Cayman Islands, a jurisdiction under FATF monitoring for AML/CFT deficiencies. The five-layer ownership structure spanning four jurisdictions adds structural complexity. A PEP association was identified through the beneficial ownership chain — Elizabeth Wentworth, a 25% beneficial owner through Crown Bay Trust (Jersey), is a close associate of a former UK Cabinet member. Transaction patterns remain consistent with the stated fund administration business, providing a mitigating factor.";
