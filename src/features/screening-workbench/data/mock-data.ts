import type { ScreeningAlert, ScreeningMetrics } from "../types";

export const metrics: ScreeningMetrics = {
  autoResolved: 812, pendingReview: 47, humanResolved: 96, totalScreened: 955,
  throughput: 94, falsePositiveRate: 18, avgResolutionTime: "3.2m",
  yesterdayAutoResolved: 748, yesterdayPending: 62, yesterdayThroughput: 78,
  yesterdayAvgTime: "4.1m", yesterdayFPRate: 22,
};

export const screeningAlerts: ScreeningAlert[] = [
  {
    id: "SCR-4521", entityId: "ENT-VIT-001", entityName: "Volkov International Trading Co.", entityType: "legal_entity", entityJurisdiction: "AE", entityRiskTier: "high",
    list: "OFAC SDN", listEntryId: "SDN-44892", matchScore: 0.82, riskTier: "critical", status: "pending",
    aiRecommendation: "likely_true_match", aiConfidence: 0.42,
    aiSummary: "Strong name and jurisdiction overlap with OFAC SDN entry. Registration numbers differ. Manual verification recommended.",
    whyNotAutoResolved: ["Confidence 42% below 80% threshold", "Mixed signals: name/jurisdiction match but IDs differ", "OFAC = highest-risk, human review required"],
    timestamp: "2026-03-23T09:38:00Z", timePending: "45 min", assignee: null,
    matchComparison: {
      clientData: { Name: "Volkov International Trading Co.", Type: "Import/Export", Jurisdiction: "🇦🇪 UAE", "Reg #": "DCC-88776", Director: "Alexei Volkov", "Inc. Date": "2019", Products: "Commodities" },
      listData: { Name: "Volkov Intl. Trading Corp.", Type: "Trade Company", Location: "🇦🇪 Dubai, UAE", ID: "Not specified", Alias: "A. Volkov", Listed: "2023", Program: "RUSSIA-EO14024" },
      factors: [
        { field: "Name", score: 0.89, type: "match", method: "Phonetic" },
        { field: "Jurisdiction", score: 1.0, type: "match", method: "Exact" },
        { field: "Entity Type", score: 0.78, type: "match", method: "Compatible" },
        { field: "Director/Alias", score: 0.85, type: "match", method: "Alias match" },
        { field: "Registration #", score: 0.0, type: "no_match", method: "No data in list" },
        { field: "Inc. Date", score: 0.6, type: "partial", method: "4-year gap" },
      ],
    },
    entityContext: {
      clientSince: "2020-06-15", riskScore: 68, cddLevel: "EDD", uboCount: 2,
      ubos: ["Alexei Volkov (70%)", "Marina Volkov (30%)"],
      openCases: 0, previousAlerts: 12, previousAlertsOutcome: "All false positive",
      lastReview: "2025-09-15", nextReviewDue: "2026-09-15",
    },
    relatedAlerts: [
      { id: "SCR-4522", list: "EU Consolidated", matchScore: 0.71, riskTier: "medium" },
      { id: "SCR-4524", list: "Adverse Media", matchScore: 0.68, riskTier: "medium" },
    ],
    aiSuggestedJustification: "Entity registration DCC-88776 (UAE) does not correspond to any identifier in OFAC SDN entry #44892. Director name 'Alexei Volkov' is a common name. Prior 12 matches all confirmed false positive. Recommend updating screening profile.",
  },
  {
    id: "SCR-4523", entityId: "ENT-CBF-002", entityName: "Crescent Bay Financial Services Ltd", entityType: "legal_entity", entityJurisdiction: "SG", entityRiskTier: "high",
    list: "PEP Database", matchScore: 0.91, riskTier: "high", status: "pending",
    aiRecommendation: "confirmed_match", aiConfidence: 0.94,
    aiSummary: "Confirmed PEP Level 2 — Director linked to former Singapore Minister. EDD required.",
    whyNotAutoResolved: ["PEP confirmations always require human review per policy", "EDD upgrade decision requires analyst judgment"],
    timestamp: "2026-03-23T08:15:00Z", timePending: "2h 8m", assignee: "Sarah Chen",
  },
  {
    id: "SCR-4525", entityId: "ENT-ARC-003", entityName: "Al-Rashid Construction & Engineering", entityType: "legal_entity", entityJurisdiction: "SA", entityRiskTier: "high",
    list: "Adverse Media", matchScore: 0.68, riskTier: "high", status: "pending",
    aiRecommendation: "likely_false_positive", aiConfidence: 0.78,
    aiSummary: "Entity mentioned as witness in corruption investigation article — not subject. Likely noise.",
    whyNotAutoResolved: ["Adverse media with corruption keyword exceeds threshold", "High-risk jurisdiction (Saudi Arabia)"],
    timestamp: "2026-03-22T16:30:00Z", timePending: "17h", assignee: null,
  },
  {
    id: "SCR-4527", entityId: "ENT-PRH-004", entityName: "Pacific Rim Holdings Ltd", entityType: "legal_entity", entityJurisdiction: "VG", entityRiskTier: "medium",
    list: "EU Consolidated", matchScore: 0.55, riskTier: "medium", status: "pending",
    aiRecommendation: "likely_false_positive", aiConfidence: 0.82,
    aiSummary: "Name similarity only — different jurisdiction and entity type.",
    whyNotAutoResolved: ["BVI jurisdiction adds complexity", "Confidence 82% slightly above threshold but flagged for review"],
    timestamp: "2026-03-23T09:50:00Z", timePending: "1h 12m", assignee: null,
  },
  {
    id: "SCR-4529", entityId: "ENT-HAM-005", entityName: "Helios Asset Management GmbH", entityType: "legal_entity", entityJurisdiction: "DE", entityRiskTier: "low",
    list: "UN Consolidated", matchScore: 0.42, riskTier: "low", status: "pending",
    aiRecommendation: "likely_false_positive", aiConfidence: 0.96,
    aiSummary: "Very low match — different name structure, jurisdiction, and entity type.",
    whyNotAutoResolved: ["New onboarding client — initial screening requires human sign-off"],
    timestamp: "2026-03-23T10:00:00Z", timePending: "52 min", assignee: "Sarah Chen",
  },
  {
    id: "SCR-4533", entityId: "ENT-NWP-006", entityName: "Nordic Wealth Partners AS", entityType: "legal_entity", entityJurisdiction: "NO", entityRiskTier: "low",
    list: "PEP Database", matchScore: 0.48, riskTier: "low", status: "pending",
    aiRecommendation: "likely_false_positive", aiConfidence: 0.91,
    aiSummary: "Director name matches PEP database entry but different DOB and nationality.",
    whyNotAutoResolved: ["PEP matches always require human confirmation"],
    timestamp: "2026-03-23T09:30:00Z", timePending: "1h 30m", assignee: null,
  },
  {
    id: "SCR-4535", entityId: "ENT-SCH-007", entityName: "Swiss Crypto Ventures AG", entityType: "legal_entity", entityJurisdiction: "CH", entityRiskTier: "medium",
    list: "OFAC SDN", matchScore: 0.61, riskTier: "medium", status: "pending",
    aiRecommendation: "inconclusive", aiConfidence: 0.55,
    aiSummary: "Partial name match with SDN entry. Crypto-related business adds risk factor. Needs investigation.",
    whyNotAutoResolved: ["Crypto sector elevated risk", "Confidence below threshold"],
    timestamp: "2026-03-23T08:45:00Z", timePending: "2h 15m", assignee: null,
  },
];
