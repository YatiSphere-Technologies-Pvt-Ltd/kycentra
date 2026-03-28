import { agentStyles } from "@/lib/styles";
import type {
  User,
  Agent,
  ActivityItem,
  PendingReview,
  RiskDistribution,
  ActiveCase,
  Metric,
  AgentName,
} from "../types";

export const currentUser: User = {
  name: "Sarah Chen",
  role: "Senior Compliance Analyst",
  avatar: "/avatars/sarah.jpg",
  unreadNotifications: 7,
};

export const agents: Agent[] = [
  { name: "Document Agent", status: "active", tasksCompleted: 142, icon: "file-text", color: agentStyles["Document Agent"].color },
  { name: "Entity Agent", status: "active", tasksCompleted: 87, icon: "building", color: agentStyles["Entity Agent"].color },
  { name: "Screening Agent", status: "active", tasksCompleted: 234, icon: "shield", color: agentStyles["Screening Agent"].color },
  { name: "Risk Agent", status: "active", tasksCompleted: 56, icon: "activity", color: agentStyles["Risk Agent"].color },
  { name: "Regulatory Agent", status: "active", tasksCompleted: 23, icon: "book-open", color: agentStyles["Regulatory Agent"].color },
  { name: "Investigation Agent", status: "active", tasksCompleted: 18, icon: "search", color: agentStyles["Investigation Agent"].color },
];

export const activityFeed: ActivityItem[] = [
  {
    id: "act-1",
    agent: "Screening Agent",
    action: "Auto-resolved 3 sanctions alerts for Deutsche Industriebank AG",
    detail: "Name similarity match only — no jurisdiction, DOB, or activity overlap",
    confidence: 94,
    timestamp: "2 min ago",
  },
  {
    id: "act-2",
    agent: "Document Agent",
    action: "Extracted and validated corporate registration for Meridian Capital Partners",
    detail: "UBO structure identified: 3 layers, 7 entities across 4 jurisdictions",
    confidence: 91,
    timestamp: "5 min ago",
  },
  {
    id: "act-3",
    agent: "Risk Agent",
    action: "Elevated risk score for Horizon Trading LLC from Medium to High",
    detail: "Triggered by: new adverse media + jurisdiction change to high-risk country",
    confidence: 88,
    timestamp: "8 min ago",
  },
  {
    id: "act-4",
    agent: "Entity Agent",
    action: "Completed UBO discovery for Northwind Holdings Group",
    detail: "Recursive unwrapping through 5 jurisdictions — ultimate beneficial owner identified",
    confidence: 96,
    timestamp: "12 min ago",
  },
  {
    id: "act-5",
    agent: "Regulatory Agent",
    action: "Flagged new EU AML directive amendment affecting 23 entities",
    detail: "Enhanced due diligence now required for crypto-asset service providers",
    confidence: 85,
    timestamp: "18 min ago",
  },
  {
    id: "act-6",
    agent: "Investigation Agent",
    action: "Drafted SAR narrative for Case #FC-2026-0847",
    detail: "Assembled evidence chain from 12 sources — ready for analyst review",
    confidence: 78,
    timestamp: "25 min ago",
  },
];

export const pendingReviews: PendingReview[] = [
  {
    id: "SCR-4521",
    entity: "Volkov International Trading Co.",
    type: "Screening Match",
    riskTier: "critical",
    aiRecommendation: "Potential true match — name, jurisdiction, and business activity align with OFAC SDN list entry",
    confidence: 42,
    timePending: "45 min",
    priority: 1,
  },
  {
    id: "REV-1203",
    entity: "Crescent Bay Financial Services Ltd",
    type: "EDD Review",
    riskTier: "high",
    aiRecommendation: "Risk elevation recommended — new PEP association detected through corporate director network",
    confidence: 67,
    timePending: "2h 15m",
    priority: 2,
  },
  {
    id: "DOC-8847",
    entity: "Pacific Rim Consolidated Holdings",
    type: "Document Validation",
    riskTier: "medium",
    aiRecommendation: "Certificate of incorporation shows date discrepancy with registry data — manual verification needed",
    confidence: 55,
    timePending: "1h 30m",
    priority: 3,
  },
  {
    id: "SCR-4519",
    entity: "Al-Rashid Construction & Engineering",
    type: "Adverse Media",
    riskTier: "high",
    aiRecommendation: "Entity mentioned in corruption investigation article — appears as witness, not subject. Needs analyst confirmation.",
    confidence: 61,
    timePending: "3h 45m",
    priority: 4,
  },
  {
    id: "REV-1198",
    entity: "Greenfield Sustainability Fund II",
    type: "Periodic KYC Review",
    riskTier: "low",
    aiRecommendation: "No material changes detected since last review. Standard refresh recommended.",
    confidence: 92,
    timePending: "30 min",
    priority: 5,
  },
];

export const riskDistribution: RiskDistribution = {
  critical: 12,
  high: 45,
  medium: 187,
  low: 523,
  minimal: 1834,
};

export const activeCases: ActiveCase[] = [
  {
    caseId: "FC-2026-0847",
    entity: "Horizon Trading LLC",
    type: "SAR",
    riskTier: "high",
    status: "Pending Review",
    assignee: { name: "Sarah Chen", initials: "SC" },
    updated: "25 min ago",
  },
  {
    caseId: "FC-2026-0842",
    entity: "Volkov International Trading Co.",
    type: "Screening",
    riskTier: "critical",
    status: "In Progress",
    assignee: { name: "James Park", initials: "JP" },
    updated: "1h ago",
  },
  {
    caseId: "FC-2026-0839",
    entity: "Meridian Capital Partners",
    type: "EDD",
    riskTier: "high",
    status: "In Progress",
    assignee: { name: "Sarah Chen", initials: "SC" },
    updated: "2h ago",
  },
  {
    caseId: "FC-2026-0835",
    entity: "Nordic Shipping Consortium",
    type: "PEP",
    riskTier: "medium",
    status: "Escalated",
    assignee: { name: "Maria Lopez", initials: "ML" },
    updated: "4h ago",
  },
  {
    caseId: "FC-2026-0831",
    entity: "Evergreen Pacific Fund III",
    type: "SAR",
    riskTier: "medium",
    status: "Pending Review",
    assignee: { name: "David Kim", initials: "DK" },
    updated: "6h ago",
  },
];

export const metrics: Metric[] = [
  { label: "Avg. Onboarding Time", value: "4.2 hrs", trend: -23, unit: "vs last month" },
  { label: "Avg. Alert Resolution", value: "12 min", trend: -45, unit: "vs last month" },
  { label: "Pending Reviews", value: "23", trend: 5, unit: "from yesterday", isCount: true },
  { label: "False Positive Rate", value: "18%", trend: -74, unit: "vs 92% baseline" },
  { label: "Jurisdictions Active", value: "127", trend: 0, unit: "" },
  { label: "AI Decision Accuracy", value: "96.2%", trend: 0.3, unit: "vs last week" },
];

