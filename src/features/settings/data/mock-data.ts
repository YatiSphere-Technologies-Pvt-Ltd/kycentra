export const users = [
  { id: "u1", name: "Sarah Chen", email: "s.chen@meridian.com", role: "Senior Analyst", team: "AML Ops", status: "online", lastActive: "2m ago", mfa: true },
  { id: "u2", name: "James Park", email: "j.park@meridian.com", role: "MLRO", team: "Executive", status: "online", lastActive: "5m ago", mfa: true },
  { id: "u3", name: "Maria Lopez", email: "m.lopez@meridian.com", role: "Analyst", team: "EDD", status: "away", lastActive: "1h ago", mfa: true },
  { id: "u4", name: "David Kim", email: "d.kim@meridian.com", role: "Admin", team: "IT", status: "offline", lastActive: "3h ago", mfa: true },
  { id: "u5", name: "Rachel Novak", email: "r.novak@meridian.com", role: "Analyst", team: "AML Ops", status: "online", lastActive: "10m ago", mfa: false },
  { id: "u6", name: "Alex Torres", email: "a.torres@meridian.com", role: "Jr. Analyst", team: "Screening", status: "online", lastActive: "15m ago", mfa: true },
  { id: "u7", name: "Emily Wright", email: "e.wright@meridian.com", role: "CCO", team: "Executive", status: "online", lastActive: "30m ago", mfa: true },
  { id: "u8", name: "Tom Fischer", email: "t.fischer@meridian.com", role: "RM", team: "Client Svcs", status: "offline", lastActive: "1d ago", mfa: false },
];

export const teams = [
  { name: "AML Operations", members: 12, lead: "James Park", jurisdictions: "EU, UK, US, CH, SG", cases: 23, reviews: 8, sla: 94 },
  { name: "EDD & Enhanced Reviews", members: 6, lead: "Maria Lopez", jurisdictions: "EU, UK, MENA", cases: 8, reviews: 14, sla: 97 },
  { name: "Screening", members: 8, lead: "Alex Torres", jurisdictions: "Global", cases: 0, reviews: 47, sla: 91 },
  { name: "Executive", members: 3, lead: "Emily Wright", jurisdictions: "All", cases: 2, reviews: 3, sla: 100 },
  { name: "IT & Infrastructure", members: 4, lead: "David Kim", jurisdictions: "N/A", cases: 0, reviews: 0, sla: 100 },
];

export const integrations = [
  { id: "int-1", name: "Azure AD (SSO)", category: "Identity", status: "connected", detail: "SAML 2.0 · 47 users synced · Last sync: 15m ago", alert: "Certificate expires Apr 7" },
  { id: "int-2", name: "Refinitiv World-Check", category: "Data Source", status: "connected", detail: "847 lists · Updated 3h ago · Auto-refresh: 6h" },
  { id: "int-3", name: "Bureau van Dijk (Orbis)", category: "Data Source", status: "connected", detail: "400M+ entities · API calls: 12K/mo" },
  { id: "int-4", name: "Dow Jones Risk & Compliance", category: "Data Source", status: "error", detail: "API key expired 2 days ago", alert: "Reconnection required" },
  { id: "int-5", name: "Core Banking (FIS)", category: "Core System", status: "connected", detail: "Real-time tx feed · 24K txns/day · Latency: 120ms" },
  { id: "int-6", name: "Salesforce CRM", category: "Core System", status: "connected", detail: "Bidirectional sync · 2,601 entities · Every 15m" },
  { id: "int-7", name: "Slack", category: "Notifications", status: "connected", detail: "#compliance-alerts · 47 msgs/week" },
  { id: "int-8", name: "Microsoft Teams", category: "Notifications", status: "connected", detail: "Compliance Team channel" },
];

export const apiKeys = [
  { name: "Production API", prefix: "nx_prod_7f3...", permissions: "Full Access", created: "Jan 15, 2026" },
  { name: "Read-Only Sync", prefix: "nx_ro_a2b1...", permissions: "Read Only", created: "Feb 3, 2026" },
  { name: "Webhook Secret", prefix: "nx_wh_c9d4...", permissions: "Webhook Only", created: "Mar 1, 2026" },
  { name: "Dev/Staging", prefix: "nx_dev_e5f6...", permissions: "Full (staging)", created: "Mar 10, 2026" },
];

export const agentConfigs = [
  { name: "Document Agent", icon: "📄", model: "claude-sonnet-4-6", status: "active", autoThreshold: 95, reviewThreshold: 85, autonomy: "Auto (Low) / CoPilot (Med-High)" },
  { name: "Entity Agent", icon: "🏢", model: "claude-sonnet-4-6", status: "active", autoThreshold: 80, reviewThreshold: 60, autonomy: "Auto (Low) / CoPilot (High)" },
  { name: "Screening Agent", icon: "🛡", model: "claude-sonnet-4-6", status: "active", autoThreshold: 80, reviewThreshold: 60, autonomy: "Auto (Low) / HITL (OFAC always)" },
  { name: "Risk Agent", icon: "⚡", model: "claude-opus-4-6", status: "active", autoThreshold: 85, reviewThreshold: 65, autonomy: "CoPilot / Manual (High-Crit)" },
  { name: "Regulatory Agent", icon: "📖", model: "claude-opus-4-6", status: "active", autoThreshold: 80, reviewThreshold: 60, autonomy: "Auto (All) / HITL (deploy)" },
  { name: "Investigation Agent", icon: "🔍", model: "claude-opus-4-6", status: "active", autoThreshold: 70, reviewThreshold: 50, autonomy: "CoPilot / Manual (SAR always)" },
];

export const usageMetrics = {
  users: { used: 47, limit: 500 },
  entities: { used: 2601, limit: 10000 },
  apiCalls: { used: 124000, limit: 1000000 },
  storage: { used: 34, limit: 100 },
  aiActions: { used: 847000, limit: 1200000 },
};
