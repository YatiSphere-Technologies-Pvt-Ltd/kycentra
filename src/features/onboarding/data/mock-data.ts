import type { OnboardingRecord, OnboardingStageItem, RequirementCategory, DiscoveredUBO, DocumentRequirement, AgentTask } from "../types";

export const onboarding: OnboardingRecord = {
  id: "ONB-2026-0184", status: "in_progress", stage: "data_collection", progress: 47,
  entity: { name: "Helios Asset Management GmbH", type: "Corporate", subType: "GmbH", jurisdiction: "Germany", jurisdictionCode: "DE", registrationNumber: "HRB 123456", dateOfIncorporation: "2018-01-12", registeredAddress: "Neue Mainzer Str. 52, 60311 Frankfurt am Main, Germany", natureOfBusiness: null, expectedActivity: null },
  dueDiligenceLevel: { recommended: "CDD", confidence: 0.94, reasoning: "Standard corporate entity in EU jurisdiction. No PEP associations. Single-layer ownership with clear UBO chain.", overridden: false },
  client: { name: "Thomas Weber", email: "thomas.weber@helios-am.de", status: "online", lastActivity: "2026-03-23T10:45:30Z", language: "de", device: "Desktop (Chrome)" },
  relationshipManager: { name: "James Park", initials: "JP" },
  analyst: { name: "Sarah Chen", initials: "SC" },
  startedAt: "2026-03-23T08:30:00Z", estimatedCompletion: "2026-03-23T15:15:00Z",
  sla: { total: 8, elapsed: 2.25, unit: "hours" },
};

export const stages: OnboardingStageItem[] = [
  { id: "initiation", label: "Initiation", status: "completed" },
  { id: "data_collection", label: "Data Collection", status: "current", progress: "47%" },
  { id: "verification", label: "Verification", status: "in_progress", progress: "3/8 docs" },
  { id: "screening", label: "Screening", status: "in_progress", progress: "running..." },
  { id: "risk_assessment", label: "Risk Assessment", status: "pending" },
  { id: "approval", label: "Approval", status: "pending" },
  { id: "activation", label: "Activation", status: "pending" },
];

export const requirementCategories: RequirementCategory[] = [
  {
    title: "Entity Information", completedCount: 6, totalCount: 8,
    items: [
      { id: "ei-1", label: "Legal name", value: "Helios Asset Management GmbH", status: "complete", source: "ai", sourceDetail: "Handelsregister" },
      { id: "ei-2", label: "Entity type", value: "GmbH (Limited Liability)", status: "complete", source: "ai", sourceDetail: "Handelsregister" },
      { id: "ei-3", label: "Registration number", value: "HRB 123456", status: "complete", source: "ai", sourceDetail: "Handelsregister" },
      { id: "ei-4", label: "Jurisdiction", value: "Germany (Frankfurt)", status: "complete", source: "ai", sourceDetail: "Handelsregister" },
      { id: "ei-5", label: "Registered address", value: "Neue Mainzer Str. 52, Frankfurt", status: "complete", source: "ai", sourceDetail: "Handelsregister" },
      { id: "ei-6", label: "Date of incorporation", value: "January 12, 2018", status: "complete", source: "client" },
      { id: "ei-7", label: "Nature of business", value: null, status: "pending", source: "pending" },
      { id: "ei-8", label: "Expected account activity", value: null, status: "pending", source: "pending" },
    ],
    note: "Auto-filled: 5",
  },
  {
    title: "Beneficial Ownership", completedCount: 2, totalCount: 4,
    items: [
      { id: "bo-1", label: "UBO discovery", value: "3 UBOs identified", status: "complete", source: "ai", sourceDetail: "Entity Agent" },
      { id: "bo-2", label: "Ownership structure", value: "2-layer, single jurisdiction", status: "complete", source: "ai", sourceDetail: "Entity Agent" },
      { id: "bo-3", label: "UBO identity verification", value: "Passport/ID copies needed for 3 UBOs", status: "pending", source: "pending" },
      { id: "bo-4", label: "Source of wealth", value: "Declaration needed for UBOs >25%", status: "pending", source: "pending" },
    ],
    note: "AI discovering...",
  },
  {
    title: "Documents", completedCount: 3, totalCount: 8,
    items: [
      { id: "doc-1", label: "Certificate of registration", value: "Handelsregister extract", status: "complete", source: "ai", sourceDetail: "Verified 97%" },
      { id: "doc-2", label: "Articles of association", value: "Gesellschaftsvertrag", status: "complete", source: "ai", sourceDetail: "Verified 95%" },
      { id: "doc-3", label: "Proof of registered address", value: "Utility bill - Frankfurt", status: "complete", source: "ai", sourceDetail: "Verified 92%" },
      { id: "doc-4", label: "Financial statements", value: "2025 Jahresabschluss", status: "processing", source: "ai" },
      { id: "doc-5", label: "Board resolution", value: "Gesellschafterbeschluss", status: "processing", source: "ai" },
      { id: "doc-6", label: "UBO identification", value: "Passport copies × 3", status: "pending", source: "pending" },
      { id: "doc-7", label: "BaFin license", value: "Regulatory authorization", status: "pending", source: "pending" },
      { id: "doc-8", label: "AML/CFT policy certificate", value: "Internal compliance policy", status: "pending", source: "pending" },
    ],
    note: "2 being processed",
  },
  {
    title: "Screening", completedCount: 2, totalCount: 5,
    items: [
      { id: "scr-1", label: "Sanctions screening (entity)", value: "Clear — all lists checked", status: "complete", source: "ai", sourceDetail: "Screening Agent" },
      { id: "scr-2", label: "PEP screening", value: "Clear — no PEP associations", status: "complete", source: "ai", sourceDetail: "Screening Agent" },
      { id: "scr-3", label: "Sanctions screening (UBOs)", value: "Pending UBO identity docs", status: "processing", source: "ai" },
      { id: "scr-4", label: "Adverse media screening", value: "Running...", status: "processing", source: "ai" },
      { id: "scr-5", label: "Network/association analysis", value: "Pending screening completion", status: "pending", source: "pending" },
    ],
    note: "Running parallel",
  },
  {
    title: "Risk Assessment", completedCount: 0, totalCount: 3,
    items: [
      { id: "ra-1", label: "Initial risk scoring", value: "Requires screening + UBO verification", status: "pending", source: "pending" },
      { id: "ra-2", label: "Due diligence level", value: "Current recommendation: CDD", status: "pending", source: "ai" },
      { id: "ra-3", label: "Risk narrative generation", value: "Auto-generated after scoring", status: "pending", source: "pending" },
    ],
    note: "Waiting for data",
  },
  {
    title: "Germany / EU Requirements", completedCount: 1, totalCount: 4,
    items: [
      { id: "reg-1", label: "GwG mapping", value: "KYC obligations mapped", status: "complete", source: "ai", sourceDetail: "Regulatory Agent" },
      { id: "reg-2", label: "BaFin notification", value: "Required for asset mgmt firms", status: "pending", source: "pending" },
      { id: "reg-3", label: "EU AML Directive 6", value: "Enhanced requirements applied", status: "pending", source: "ai" },
      { id: "reg-4", label: "DSGVO/GDPR consent", value: "Data processing consent needed", status: "pending", source: "pending" },
    ],
    note: "Auto-applied",
  },
];

export const discoveredUBOs: DiscoveredUBO[] = [
  { name: "Thomas Weber", nationality: "DE", ownership: 60, ownershipType: "direct", location: "Munich, Germany", source: "Handelsregister", idDocumentUploaded: false, sourceOfWealth: null },
  { name: "Anna Schmidt", nationality: "DE", ownership: 25, ownershipType: "direct", location: "Hamburg, Germany", source: "Handelsregister", idDocumentUploaded: false, sourceOfWealth: null },
  { name: "Klaus Fischer", nationality: "AT", ownership: 15, ownershipType: "direct", location: "Vienna, Austria", source: "Handelsregister", idDocumentUploaded: false, sourceOfWealth: null },
];

export const documentRequirements: DocumentRequirement[] = [
  { id: "DR-1", name: "Certificate of Registration", localName: "Handelsregisterauszug", status: "verified", uploadDate: "2026-03-23T09:15:00Z", aiConfidence: 0.97, category: "Corporate" },
  { id: "DR-2", name: "Articles of Association", localName: "Gesellschaftsvertrag", status: "verified", uploadDate: "2026-03-23T09:18:00Z", aiConfidence: 0.95, category: "Corporate" },
  { id: "DR-3", name: "Proof of Address", localName: "Adressnachweis", status: "verified", uploadDate: "2026-03-23T09:22:00Z", aiConfidence: 0.92, category: "Identity" },
  { id: "DR-4", name: "Financial Statements (2025)", localName: "Jahresabschluss 2025", status: "processing", uploadDate: "2026-03-23T10:44:00Z", processingProgress: 65, category: "Financial" },
  { id: "DR-5", name: "Board Resolution", localName: "Gesellschafterbeschluss", status: "processing", uploadDate: "2026-03-23T10:45:00Z", processingProgress: 20, category: "Corporate" },
  { id: "DR-6", name: "UBO ID — Thomas Weber", status: "pending", category: "Identity" },
  { id: "DR-7", name: "UBO ID — Anna Schmidt", status: "pending", category: "Identity" },
  { id: "DR-8", name: "BaFin Authorization", localName: "BaFin-Erlaubnis", status: "pending", category: "Regulatory" },
  { id: "DR-9", name: "AML/CFT Policy", localName: "Geldwäsche-Compliance", status: "pending", category: "Regulatory" },
];

export const agentActivity: AgentTask[] = [
  { agent: "Entity Agent", status: "active", task: "Querying Handelsregister for ownership data", progress: 65 },
  { agent: "Document Agent", status: "active", task: "Processing Financial Statements (2025)", progress: 65 },
  { agent: "Screening Agent", status: "active", task: "Running adverse media scan", progress: 78 },
  { agent: "Regulatory Agent", status: "completed", task: "Mapped GwG requirements to checklist" },
  { agent: "Risk Agent", status: "waiting", task: "Waiting for screening results and UBO verification" },
  { agent: "Investigation Agent", status: "idle", task: "No investigation triggers detected" },
];
