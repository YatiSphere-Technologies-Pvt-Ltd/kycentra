"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Plus, Search, Key, AlertTriangle, Lock, Palette, Globe } from "lucide-react";
import { cn } from "@/lib/utils";
import { users, teams, integrations, apiKeys, agentConfigs, usageMetrics } from "../data/mock-data";

// ── Shared section wrapper ──
function Section({ title, description, children, actions }: { title: string; description?: string; children: React.ReactNode; actions?: React.ReactNode }) {
  return (
    <div className="rounded-xl border border-border bg-card shadow-elevation-1 overflow-hidden">
      <div className="flex items-center justify-between px-5 py-4 border-b border-border">
        <div>
          <h3 className="text-sm font-semibold">{title}</h3>
          {description && <p className="text-[11px] text-muted-foreground mt-0.5">{description}</p>}
        </div>
        {actions}
      </div>
      <div className="p-5">{children}</div>
    </div>
  );
}

// Shared key-value row
function SettingRow({ label, value, description, locked, children }: { label: string; value?: string; description?: string; locked?: boolean; children?: React.ReactNode }) {
  return (
    <div className="flex items-start justify-between gap-4 py-3 border-b border-border last:border-b-0">
      <div className="flex-1">
        <div className="flex items-center gap-1.5">
          {locked && <Lock className="h-3 w-3 text-muted-foreground/30" />}
          <span className="text-sm font-medium">{label}</span>
        </div>
        {description && <p className="text-[11px] text-muted-foreground mt-0.5">{description}</p>}
      </div>
      {value && <span className="text-sm font-medium text-right shrink-0">{value}</span>}
      {children}
    </div>
  );
}

// ═══════════════════════════════════════════
// TAB 1: USERS & TEAMS
// ═══════════════════════════════════════════
export function UsersTab() {
  const [search, setSearch] = useState("");
  const filtered = users.filter((u) => u.name.toLowerCase().includes(search.toLowerCase()) || u.email.toLowerCase().includes(search.toLowerCase()));
  const statusDot: Record<string, string> = { online: "bg-nx-emerald-500", away: "bg-nx-amber-500", offline: "bg-nx-neutral-300" };

  return (
    <div className="space-y-6">
      {/* Users section */}
      <Section title="Users" description={`${users.length} active users · 3 pending invitations`} actions={
        <Button size="sm" className="gap-1.5 h-8"><Plus className="h-3.5 w-3.5" />Invite User</Button>
      }>
        <div className="mb-4">
          <div className="relative max-w-sm">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground/40" />
            <input type="text" placeholder="Search users by name or email..." value={search} onChange={(e) => setSearch(e.target.value)} className="h-9 w-full rounded-lg border border-border bg-muted/30 pl-10 pr-3 text-sm placeholder:text-muted-foreground/40 focus:outline-none focus:ring-2 focus:ring-primary/30" />
          </div>
        </div>
        <div className="overflow-auto -mx-5 px-5">
          <table className="w-full text-sm">
            <thead><tr className="border-b border-border">
              {["Status", "User", "Email", "Role", "Team", "Last Active", "MFA", "Actions"].map((h) => (
                <th key={h} scope="col" className="pb-3 text-left text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">
                  {h === "Status" || h === "Actions" ? <span className="sr-only">{h}</span> : h}
                </th>
              ))}
            </tr></thead>
            <tbody>
              {filtered.map((u) => (
                <tr key={u.id} className="border-b border-border last:border-b-0 hover:bg-muted/20 transition-colors">
                  <td className="py-3 pr-2"><span className={cn("inline-block h-2 w-2 rounded-full", statusDot[u.status] ?? statusDot.offline)} /></td>
                  <td className="py-3 pr-4">
                    <div className="flex items-center gap-2.5">
                      <span className="flex h-7 w-7 items-center justify-center rounded-full bg-primary/10 text-[10px] font-bold text-primary">{u.name.split(" ").map((w) => w[0]).join("")}</span>
                      <span className="font-medium text-sm">{u.name}</span>
                    </div>
                  </td>
                  <td className="py-3 pr-4 text-xs font-mono text-muted-foreground">{u.email}</td>
                  <td className="py-3 pr-4"><span className="rounded bg-muted px-2 py-0.5 text-[11px] font-medium text-muted-foreground">{u.role}</span></td>
                  <td className="py-3 pr-4 text-xs text-muted-foreground">{u.team}</td>
                  <td className="py-3 pr-4 text-xs text-muted-foreground tabular-nums">{u.lastActive}</td>
                  <td className="py-3 pr-4">{u.mfa ? <span className="text-nx-emerald-600 text-xs">✅ On</span> : <span className="text-nx-amber-600 text-xs">⚠ Off</span>}</td>
                  <td className="py-3"><Button variant="ghost" size="sm" className="h-6 text-[11px] px-2">Edit</Button></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Section>

      {/* Teams section */}
      <Section title="Teams" description={`${teams.length} teams configured`} actions={
        <Button variant="outline" size="sm" className="gap-1.5 h-8"><Plus className="h-3.5 w-3.5" />Create Team</Button>
      }>
        <div className="grid gap-4 sm:grid-cols-2">
          {teams.map((t) => (
            <div key={t.name} className="rounded-lg border border-border p-4 hover:border-primary/20 transition-colors">
              <div className="flex items-center justify-between mb-2">
                <p className="text-sm font-semibold">{t.name}</p>
                <Button variant="ghost" size="sm" className="h-6 text-[10px]">Edit</Button>
              </div>
              <p className="text-xs text-muted-foreground">{t.members} members · Lead: {t.lead}</p>
              <p className="text-[10px] text-muted-foreground/60 mt-1">{t.jurisdictions}</p>
              <div className="flex gap-4 mt-3 pt-3 border-t border-border text-[11px]">
                <span className="text-muted-foreground">Cases: <span className="font-semibold text-foreground">{t.cases}</span></span>
                <span className="text-muted-foreground">Reviews: <span className="font-semibold text-foreground">{t.reviews}</span></span>
                <span className="text-muted-foreground">SLA: <span className="font-semibold text-foreground">{t.sla}%</span></span>
              </div>
            </div>
          ))}
        </div>
      </Section>
    </div>
  );
}

// ═══════════════════════════════════════════
// TAB 2: ORGANIZATION
// ═══════════════════════════════════════════
export function OrganizationTab() {
  const um = usageMetrics;

  function UsageBar({ label, used, limit, unit }: { label: string; used: number; limit: number; unit?: string }) {
    const pct = (used / limit) * 100;
    const color = pct > 90 ? "var(--nx-rose-500)" : pct > 75 ? "var(--nx-amber-500)" : "var(--nx-indigo-500)";
    const usedLabel = unit ? `${used}${unit}` : (used >= 1000 ? `${(used / 1000).toFixed(0)}K` : String(used));
    const limitLabel = unit ? `${limit}${unit}` : (limit >= 1000000 ? `${(limit / 1000000).toFixed(1)}M` : limit >= 1000 ? `${(limit / 1000).toFixed(0)}K` : String(limit));
    return (
      <div className="py-3 border-b border-border last:border-b-0">
        <div className="flex items-center justify-between text-sm mb-1.5">
          <span>{label}</span>
          <span className="tabular-nums font-medium text-muted-foreground">{usedLabel} / {limitLabel} <span className="text-xs">({pct.toFixed(1)}%)</span></span>
        </div>
        <div className="h-2 rounded-full bg-nx-neutral-100"><div className="h-full rounded-full transition-all" style={{ width: `${Math.min(pct, 100)}%`, backgroundColor: color }} /></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <Section title="Institution Profile" actions={<Button variant="outline" size="sm" className="h-8 text-xs">Edit Profile</Button>}>
        <div className="grid grid-cols-2 gap-x-8 gap-y-0">
          {[
            ["Institution Name", "Meridian Capital Partners"],
            ["Legal Entity", "Meridian Capital Partners LLC"],
            ["LEI", "5493001KJTIIGC8Y1R17"],
            ["Primary Jurisdiction", "United States (Delaware)"],
            ["Regulator", "SEC, FinCEN"],
            ["Industry", "Asset Management"],
            ["License Type", "Enterprise (500 users)"],
            ["Contract Expiry", "Dec 31, 2027"],
            ["Tenant ID", "MCP-2026-001"],
            ["Environment", "Production"],
          ].map(([k, v]) => (
            <SettingRow key={k} label={k} value={v} />
          ))}
        </div>
      </Section>

      <Section title="License & Usage" description="Current billing period usage against plan limits">
        <UsageBar label="Users" used={um.users.used} limit={um.users.limit} />
        <UsageBar label="Entities" used={um.entities.used} limit={um.entities.limit} />
        <UsageBar label="API Calls (this month)" used={um.apiCalls.used} limit={um.apiCalls.limit} />
        <UsageBar label="Storage" used={um.storage.used} limit={um.storage.limit} unit="GB" />
        <UsageBar label="AI Actions (this month)" used={um.aiActions.used} limit={um.aiActions.limit} />
        {um.aiActions.used / um.aiActions.limit > 0.7 && (
          <div className="flex items-center gap-1.5 text-xs mt-3 rounded-lg px-3 py-2" style={{ backgroundColor: "var(--nx-amber-50)", color: "var(--nx-amber-700)" }}>
            <AlertTriangle className="h-3.5 w-3.5 shrink-0" />AI Actions at {((um.aiActions.used / um.aiActions.limit) * 100).toFixed(1)}% — projected to reach limit soon.
          </div>
        )}
      </Section>

      <Section title="SLA Configuration" description="Service level agreement targets for compliance workflows" actions={<Button variant="outline" size="sm" className="h-8 text-xs">Edit SLAs</Button>}>
        {[
          ["CDD Onboarding Target", "24 hours"],
          ["EDD Onboarding Target", "5 business days"],
          ["Alert Resolution (Critical)", "4 hours"],
          ["Alert Resolution (High)", "24 hours"],
          ["Periodic Review (Low Risk)", "Annual"],
          ["Periodic Review (Medium)", "6 months"],
          ["Periodic Review (High)", "3 months"],
          ["SAR Filing Deadline", "30 days from trigger"],
        ].map(([k, v]) => (
          <SettingRow key={k} label={k} value={v} />
        ))}
      </Section>
    </div>
  );
}

// ═══════════════════════════════════════════
// TAB 3: AI AGENTS
// ═══════════════════════════════════════════
export function AIAgentsTab() {
  return (
    <div className="space-y-6">
      <div className="flex items-center gap-2 rounded-lg px-4 py-3 text-xs" style={{ backgroundColor: "var(--nx-amber-50)", color: "var(--nx-amber-700)" }}>
        <AlertTriangle className="h-4 w-4 shrink-0" />
        <span>Changes to AI agent configuration require CCO or MLRO approval and are logged to the immutable audit trail.</span>
      </div>

      <Section title="Agent Overview" description="Configure behavior, autonomy, and safety for each AI agent">
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {agentConfigs.map((a) => (
            <div key={a.name} className="rounded-lg border border-border p-4 hover:border-primary/20 hover:shadow-xs transition-all">
              <div className="flex items-center gap-2 mb-3">
                <span className="text-lg">{a.icon}</span>
                <div className="flex-1">
                  <p className="text-sm font-semibold">{a.name}</p>
                  <p className="text-[10px] font-mono text-muted-foreground">{a.model}</p>
                </div>
                <span className="h-2 w-2 rounded-full bg-nx-emerald-500" title="Active" />
              </div>
              <div className="space-y-2">
                <div className="flex justify-between text-xs">
                  <span className="text-muted-foreground">Auto-resolve threshold</span>
                  <span className="font-bold tabular-nums text-nx-emerald-600">≥ {a.autoThreshold}%</span>
                </div>
                <div className="flex justify-between text-xs">
                  <span className="text-muted-foreground">Human review threshold</span>
                  <span className="font-semibold tabular-nums">≥ {a.reviewThreshold}%</span>
                </div>
                <div className="flex justify-between text-xs">
                  <span className="text-muted-foreground">Autonomy mode</span>
                  <span className="text-[10px] text-right max-w-32 truncate">{a.autonomy}</span>
                </div>
              </div>
              <Button variant="outline" size="sm" className="w-full mt-4 h-8 text-xs">Configure →</Button>
            </div>
          ))}
        </div>
      </Section>

      <Section title="Global AI Settings" description="Platform-wide configuration affecting all agents">
        <SettingRow label="Global Auto-Resolution Threshold" value="80%" description="Agents auto-resolve actions when confidence ≥ this value" />
        <SettingRow label="Global Escalation Threshold" value="40%" description="Auto-escalate to senior analyst when confidence < this value" />
        <SettingRow label="Human Override Logging" value="✅ Enabled" description="Log every instance where a human overrides an AI decision" locked />
        <SettingRow label="AI Reasoning Chain Visibility" value="✅ Always Show" description="Display full AI reasoning to analysts (required by EU AI Act)" locked />
        <SettingRow label="Agent-to-Agent Communication" value="✅ Enabled" description="Allow agents to share context via shared context bus" />
        <SettingRow label="Fallback Mode" value="Manual Queue" description="When an agent is unavailable, route work to manual processing" />
      </Section>
    </div>
  );
}

// ═══════════════════════════════════════════
// TAB 4: INTEGRATIONS
// ═══════════════════════════════════════════
export function IntegrationsTab() {
  const statusStyles: Record<string, { dot: string; label: string; color: string }> = {
    connected: { dot: "bg-nx-emerald-500", label: "Connected", color: "var(--nx-emerald-600)" },
    error: { dot: "bg-nx-rose-500", label: "Error", color: "var(--nx-rose-600)" },
  };
  const categories = [...new Set(integrations.map((i) => i.category))];

  return (
    <div className="space-y-6">
      {categories.map((cat) => (
        <Section key={cat} title={cat} description={`${integrations.filter((i) => i.category === cat).length} integrations`}>
          <div className="space-y-3">
            {integrations.filter((i) => i.category === cat).map((intg) => {
              const ss = statusStyles[intg.status] ?? statusStyles.connected;
              return (
                <div key={intg.id} className="flex items-center gap-4 rounded-lg border border-border p-4 hover:border-primary/20 transition-colors">
                  <span className={cn("h-2.5 w-2.5 rounded-full shrink-0", ss.dot)} />
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <p className="text-sm font-medium">{intg.name}</p>
                      <span className="text-[10px] font-semibold" style={{ color: ss.color }}>{ss.label}</span>
                    </div>
                    <p className="text-xs text-muted-foreground mt-0.5">{intg.detail}</p>
                    {intg.alert && <p className="text-[11px] text-nx-amber-600 mt-0.5">⚠ {intg.alert}</p>}
                  </div>
                  <Button variant="outline" size="sm" className="h-8 text-xs shrink-0">{intg.status === "error" ? "Fix Now" : "Configure"}</Button>
                </div>
              );
            })}
          </div>
        </Section>
      ))}

      <Section title="API Keys" description="Programmatic access to the platform" actions={<Button size="sm" className="h-8 text-xs gap-1"><Plus className="h-3 w-3" />Generate Key</Button>}>
        <div className="overflow-auto -mx-5 px-5">
          <table className="w-full text-sm">
            <thead><tr className="border-b border-border">
              {["Name", "Key Prefix", "Permissions", "Created", ""].map((h) => (
                <th key={h} scope="col" className="pb-3 text-left text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">{h}</th>
              ))}
            </tr></thead>
            <tbody>
              {apiKeys.map((k) => (
                <tr key={k.name} className="border-b border-border last:border-b-0">
                  <td className="py-3 pr-4 font-medium">{k.name}</td>
                  <td className="py-3 pr-4 font-mono text-xs text-muted-foreground">{k.prefix}</td>
                  <td className="py-3 pr-4 text-xs text-muted-foreground">{k.permissions}</td>
                  <td className="py-3 pr-4 text-xs text-muted-foreground">{k.created}</td>
                  <td className="py-3"><Button variant="ghost" size="sm" className="h-6 text-[11px]">Manage</Button></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Section>
    </div>
  );
}

// ═══════════════════════════════════════════
// TAB 5: AUDIT & COMPLIANCE
// ═══════════════════════════════════════════
export function AuditTab() {
  return (
    <div className="space-y-6">
      <Section title="Audit Trail Configuration" description="Controls for what gets logged and how">
        <SettingRow label="Audit Logging" value="✅ Enabled" description="Master audit switch — cannot be disabled" locked />
        <SettingRow label="Log Level" value="Detailed" description="Minimal | Standard | Detailed | Debug" />
        <SettingRow label="Immutable Sealing" value="✅ SHA-256 hash chains" description="Every entry is cryptographically sealed and tamper-proof" locked />
        <SettingRow label="AI Reasoning Chains" value="✅ Always logged" description="Full reasoning chain stored for every AI decision" locked />
        <SettingRow label="Human Override Reasons" value="✅ Required" description="Analysts must provide justification when overriding AI" />
        <SettingRow label="Configuration Changes" value="✅ Always logged" description="Every settings change recorded with before/after" locked />
        <SettingRow label="Login/Logout Events" value="✅ Always logged" />
        <SettingRow label="Data Exports" value="✅ Always logged" description="Every data export tracked with user, scope, and timestamp" />
      </Section>

      <Section title="Retention Policies" description="Data retention periods must comply with applicable regulations">
        {[
          ["Entity Records", "10 years", "Min: 5 years (US/EU)"],
          ["Transaction Records", "10 years", "Min: 5 years"],
          ["Screening Results", "7 years", "Min: 5 years"],
          ["Case Files", "10 years", "Min: 5 years"],
          ["SAR/STR Filings", "10 years", "Min: 5 years (FinCEN)"],
          ["Audit Logs", "Indefinite", "Min: 7 years"],
          ["AI Decision Logs", "10 years", "Min: 5 years"],
          ["User Activity Logs", "5 years", "Min: 3 years"],
        ].map(([label, value, note]) => (
          <SettingRow key={label} label={label} value={value} description={note} locked />
        ))}
        <p className="text-[10px] text-muted-foreground flex items-center gap-1 mt-3 pt-3 border-t border-border">
          <Lock className="h-3 w-3 shrink-0" />Minimum retention periods are platform-enforced and cannot be reduced below regulatory minimums.
        </p>
      </Section>
    </div>
  );
}

// ═══════════════════════════════════════════
// TAB 6: DATA & PRIVACY
// ═══════════════════════════════════════════
export function DataPrivacyTab() {
  return (
    <div className="space-y-6">
      <Section title="Data Residency" description="Where your data is stored and how it's protected">
        <SettingRow label="Primary Data Region" value="EU (Frankfurt, Germany)" description="eu-central-1" locked />
        <SettingRow label="Disaster Recovery Region" value="EU (Ireland)" description="eu-west-1 — automatic failover" locked />
        <SettingRow label="Cross-Border Transfer" value="✅ Enabled (SCCs)" description="Standard Contractual Clauses for lawful transfer" />
        <SettingRow label="Encryption at Rest" value="AES-256-GCM" description="Customer-managed keys via KMS" locked />
        <SettingRow label="Encryption in Transit" value="TLS 1.3" description="HSTS enforced, certificate pinning enabled" locked />
      </Section>

      <Section title="GDPR / Privacy Controls" description="Data protection and privacy compliance settings">
        <SettingRow label="Data Subject Access Requests (DSAR)" value="✅ Automated workflow" description="Respond within 30 days, automated data collection across all stores" />
        <SettingRow label="Right to Erasure" value="✅ With AML override" description="AML record retention obligations override erasure for flagged entities" />
        <SettingRow label="Consent Management" value="✅ Per-purpose tracking" description="Granular consent tracking per processing purpose" />
        <SettingRow label="Data Processing Agreements" value="✅ All vendors covered" description="DPAs on file for all sub-processors" />
        <SettingRow label="Privacy Impact Assessments" value="✅ 6 DPIAs on file" description="Required for AI-driven risk scoring and PEP screening" />
        <SettingRow label="Data Breach Notification" value="✅ 72-hour workflow" description="Automated notification to DPA within 72 hours per GDPR Art. 33" />
      </Section>
    </div>
  );
}

// ═══════════════════════════════════════════
// TAB 7: NOTIFICATIONS
// ═══════════════════════════════════════════
export function NotificationsTab() {
  const channels = [
    { event: "Critical screening alert", email: true, slack: true, teams: true, inApp: true },
    { event: "Risk tier elevation", email: true, slack: true, teams: false, inApp: true },
    { event: "SAR filing required", email: true, slack: true, teams: true, inApp: true },
    { event: "Document expiry (30d warning)", email: true, slack: false, teams: false, inApp: true },
    { event: "Onboarding completed", email: true, slack: true, teams: false, inApp: true },
    { event: "Regulatory change detected", email: true, slack: true, teams: false, inApp: true },
    { event: "SLA breach approaching", email: true, slack: true, teams: true, inApp: true },
    { event: "Agent error or suspension", email: true, slack: true, teams: true, inApp: true },
    { event: "User login from new device", email: true, slack: false, teams: false, inApp: false },
  ];

  return (
    <Section title="Notification Routing" description="Configure which events trigger notifications on each channel" actions={<Button variant="ghost" size="sm" className="h-8 text-xs">Reset to Defaults</Button>}>
      <div className="overflow-auto -mx-5 px-5">
        <table className="w-full text-sm">
          <thead><tr className="border-b border-border">
            <th scope="col" className="pb-3 text-left text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">Event</th>
            <th scope="col" className="pb-3 text-center text-[11px] font-semibold uppercase tracking-wider text-muted-foreground w-20">Email</th>
            <th scope="col" className="pb-3 text-center text-[11px] font-semibold uppercase tracking-wider text-muted-foreground w-20">Slack</th>
            <th scope="col" className="pb-3 text-center text-[11px] font-semibold uppercase tracking-wider text-muted-foreground w-20">Teams</th>
            <th scope="col" className="pb-3 text-center text-[11px] font-semibold uppercase tracking-wider text-muted-foreground w-20">In-App</th>
          </tr></thead>
          <tbody>
            {channels.map((c) => (
              <tr key={c.event} className="border-b border-border last:border-b-0 hover:bg-muted/20">
                <td className="py-3 pr-4 text-sm">{c.event}</td>
                {[c.email, c.slack, c.teams, c.inApp].map((on, i) => (
                  <td key={i} className="py-3 text-center"><input type="checkbox" defaultChecked={on} className="accent-primary h-4 w-4" /></td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </Section>
  );
}

// ═══════════════════════════════════════════
// TAB 8: BRANDING
// ═══════════════════════════════════════════
export function BrandingTab() {
  return (
    <div className="space-y-6">
      <Section title="Institution Branding" description="Customize the platform appearance for your organization">
        <div className="space-y-5">
          <div className="grid grid-cols-2 gap-6">
            <div>
              <label className="text-xs font-medium text-muted-foreground">Institution Name (displayed in UI)</label>
              <input type="text" defaultValue="Meridian Capital Partners" className="mt-1.5 h-9 w-full rounded-lg border border-border bg-background px-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary/30" />
            </div>
            <div>
              <label className="text-xs font-medium text-muted-foreground">Client Portal Title</label>
              <input type="text" defaultValue="Meridian Compliance Portal" className="mt-1.5 h-9 w-full rounded-lg border border-border bg-background px-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary/30" />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-6">
            <div>
              <label className="text-xs font-medium text-muted-foreground">Primary Brand Color</label>
              <div className="mt-1.5 flex items-center gap-2">
                <div className="h-9 w-9 rounded-lg border border-border shrink-0" style={{ backgroundColor: "#1E40AF" }} />
                <input type="text" defaultValue="#1E40AF" className="h-9 flex-1 rounded-lg border border-border bg-background px-3 text-sm font-mono focus:outline-none focus:ring-2 focus:ring-primary/30" />
              </div>
            </div>
            <div>
              <label className="text-xs font-medium text-muted-foreground">Accent Color</label>
              <div className="mt-1.5 flex items-center gap-2">
                <div className="h-9 w-9 rounded-lg border border-border shrink-0" style={{ backgroundColor: "#0D9488" }} />
                <input type="text" defaultValue="#0D9488" className="h-9 flex-1 rounded-lg border border-border bg-background px-3 text-sm font-mono focus:outline-none focus:ring-2 focus:ring-primary/30" />
              </div>
            </div>
          </div>

          <div>
            <label className="text-xs font-medium text-muted-foreground">Logo</label>
            <p className="text-[10px] text-muted-foreground mt-0.5 mb-1.5">Displayed in sidebar and client portal. SVG or PNG, max 2MB.</p>
            <div className="rounded-lg border-2 border-dashed border-border p-8 text-center cursor-pointer hover:bg-muted/20 hover:border-primary/30 transition-all">
              <Palette className="mx-auto h-6 w-6 text-muted-foreground/30 mb-2" />
              <p className="text-sm text-muted-foreground">Drag & drop logo or click to upload</p>
              <p className="text-[10px] text-muted-foreground/60 mt-1">Recommended: 200 × 40px</p>
            </div>
          </div>

          <div>
            <label className="text-xs font-medium text-muted-foreground">Email Footer Text</label>
            <textarea defaultValue="Meridian Capital Partners LLC | Confidential and proprietary. This communication is intended solely for the addressee." className="mt-1.5 h-24 w-full rounded-lg border border-border bg-background px-3 py-2 text-sm resize-none focus:outline-none focus:ring-2 focus:ring-primary/30" />
          </div>
        </div>
      </Section>

      <div className="flex justify-end">
        <Button>Save Branding</Button>
      </div>
    </div>
  );
}
