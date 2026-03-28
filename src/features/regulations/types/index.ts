export type RuleStatus = "active" | "draft" | "deprecated" | "under_review";
export type RuleCategory = "AML/KYC" | "Sanctions" | "Tax" | "Data Privacy" | "ESG" | "Consumer Protection";
export type ChangeSeverity = "high" | "medium" | "low" | "info";
export type ChangeStatus = "action_required" | "auto_action" | "under_review" | "resolved" | "informational";

export interface RegRule {
  id: string;
  title: string;
  jurisdiction: string;
  jurisdictionName: string;
  category: RuleCategory;
  regulation: string;
  status: RuleStatus;
  version: string;
  entityTypes: string[];
  ddLevels: string[];
  affectedEntities: number;
  naturalLanguage: string;
  aiConfidence: number;
  lastModifiedBy: string;
  lastModifiedDate: string;
}

export interface RegChange {
  id: string;
  jurisdiction: string;
  jurisdictionCode: string;
  category: RuleCategory;
  severity: ChangeSeverity;
  status: ChangeStatus;
  title: string;
  publishDate: string;
  effectiveDate?: string;
  source: string;
  aiImpactAssessment: string;
  confidence: number;
  affectedRules?: number;
  affectedEntities: number;
  deadline?: string;
  autoAction?: string;
}

export interface JurisdictionCoverage {
  code: string;
  name: string;
  flag: string;
  coverage: number;
  rules: number;
  entities: number;
  status: "full" | "partial" | "minimal";
  lastUpdate: string;
}

export interface SimulationResult {
  scenario: string;
  confidence: number;
  totalAffected: number;
  ddChanges: { from: string; to: string; count: number }[];
  analystHours: number;
  weeksNeeded: number;
  jurisdictions: { name: string; flag: string; count: number }[];
  rulesToCreate: number;
  rulesToModify: number;
}
