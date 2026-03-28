"use client";

import { Button } from "@/components/ui/button";
import { Building2, Globe, Clock, CreditCard, AlertTriangle, ExternalLink, Pencil, Shield, Users, Database, Cpu, Zap, ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";

function UsageItem({ label, used, limit, icon: Icon, formatUsed, formatLimit }: {
  label: string; used: number; limit: number; icon: typeof Users; formatUsed?: string; formatLimit?: string;
}) {
  const pct = (used / limit) * 100;
  const color = pct > 90 ? "var(--nx-rose-500)" : pct > 75 ? "var(--nx-amber-500)" : pct > 50 ? "var(--nx-indigo-500)" : "var(--nx-emerald-500)";
  const usedStr = formatUsed ?? (used >= 1e6 ? `${(used / 1e6).toFixed(1)}M` : used >= 1e3 ? `${(used / 1e3).toFixed(0)}K` : String(used));
  const limitStr = formatLimit ?? (limit >= 1e6 ? `${(limit / 1e6).toFixed(1)}M` : limit >= 1e3 ? `${(limit / 1e3).toFixed(0)}K` : String(limit));

  return (
    <div className="flex items-center gap-4 py-3 border-b border-border last:border-b-0">
      <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-muted/50">
        <Icon className="h-4 w-4 text-muted-foreground/60" />
      </div>
      <div className="flex-1 min-w-0">
        <div className="flex items-center justify-between mb-1.5">
          <span className="text-sm font-medium">{label}</span>
          <span className="text-xs tabular-nums text-muted-foreground">{usedStr} <span className="text-muted-foreground/40">/</span> {limitStr}</span>
        </div>
        <div className="h-1.5 rounded-full bg-nx-neutral-100">
          <div className="h-full rounded-full transition-all duration-700" style={{ width: `${Math.min(pct, 100)}%`, backgroundColor: color }} />
        </div>
      </div>
      <span className={cn(
        "text-xs font-semibold tabular-nums w-10 text-right",
        pct > 75 ? "text-nx-amber-600" : "text-muted-foreground"
      )}>{pct.toFixed(0)}%</span>
    </div>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div>
      <dt className="text-[10px] font-semibold uppercase tracking-widest text-muted-foreground/40 mb-1">{label}</dt>
      <dd className="text-sm">{children}</dd>
    </div>
  );
}

export default function OrganizationSettingsPage() {
  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-lg font-semibold">Organization</h2>
          <p className="text-sm text-muted-foreground mt-0.5">Institution profile, usage, and operational settings</p>
        </div>
      </div>

      {/* ═══ Profile Card ═══ */}
      <div className="rounded-xl border border-border bg-card overflow-hidden shadow-elevation-1">
        <div className="flex items-center justify-between px-6 py-4 bg-linear-to-r from-primary/3 to-transparent border-b border-border">
          <div className="flex items-center gap-4">
            <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-primary/10 text-base font-bold text-primary shadow-xs">MC</div>
            <div>
              <div className="flex items-center gap-2.5">
                <h3 className="text-base font-semibold">Meridian Capital Partners</h3>
                <span className="inline-flex items-center gap-1 rounded-md bg-nx-emerald-50 px-1.5 py-0.5 text-[10px] font-bold text-nx-emerald-700"><span className="h-1.5 w-1.5 rounded-full bg-nx-emerald-500" />Active</span>
                <span className="rounded-md bg-primary/8 px-1.5 py-0.5 text-[10px] font-bold text-primary">Enterprise</span>
              </div>
              <p className="text-xs text-muted-foreground mt-0.5">Meridian Capital Partners LLC · Asset Management</p>
            </div>
          </div>
          <Button variant="outline" size="sm" className="h-8 text-xs gap-1.5"><Pencil className="h-3 w-3" />Edit Profile</Button>
        </div>

        <div className="px-6 py-5 grid grid-cols-2 gap-x-8 gap-y-4 md:grid-cols-4">
          <Field label="LEI"><span className="font-mono text-xs text-primary">5493001KJTIIGC8Y1R17</span></Field>
          <Field label="Jurisdiction">🇺🇸 United States (Delaware)</Field>
          <Field label="Regulators">SEC · FinCEN</Field>
          <Field label="Industry">Asset Management</Field>
          <Field label="Tenant ID"><span className="font-mono text-xs text-primary">MCP-2026-001</span></Field>
          <Field label="Environment"><span className="inline-flex items-center gap-1 rounded bg-nx-emerald-50 px-1.5 py-0.5 text-[11px] font-medium text-nx-emerald-700">Production</span></Field>
          <Field label="Contract">Dec 31, 2027</Field>
          <Field label="License">500 users · Unlimited entities</Field>
        </div>
      </div>

      {/* ═══ Usage ═══ */}
      <div className="rounded-xl border border-border bg-card overflow-hidden shadow-elevation-1">
        <div className="flex items-center justify-between px-6 py-3.5 border-b border-border">
          <div className="flex items-center gap-2">
            <CreditCard className="h-4 w-4 text-muted-foreground/40" />
            <span className="text-sm font-semibold">Plan Usage</span>
            <span className="rounded bg-muted px-1.5 py-0.5 text-[10px] text-muted-foreground">Current period</span>
          </div>
          <Button variant="ghost" size="sm" className="h-7 text-xs gap-1"><ExternalLink className="h-3 w-3" />Manage Plan</Button>
        </div>
        <div className="px-6 py-2">
          <UsageItem label="Users" used={47} limit={500} icon={Users} formatUsed="47" formatLimit="500" />
          <UsageItem label="Entities" used={2601} limit={10000} icon={Database} />
          <UsageItem label="API Calls" used={124000} limit={1000000} icon={Zap} />
          <UsageItem label="Storage" used={34} limit={100} icon={Database} formatUsed="34 GB" formatLimit="100 GB" />
          <UsageItem label="AI Agent Actions" used={847000} limit={1200000} icon={Cpu} />
        </div>
        {847000 / 1200000 > 0.7 && (
          <div className="flex items-center gap-3 mx-6 mb-4 rounded-lg px-4 py-2.5 text-xs" style={{ backgroundColor: "var(--nx-amber-50)", color: "var(--nx-amber-700)" }}>
            <AlertTriangle className="h-4 w-4 shrink-0" />
            <span className="flex-1"><strong>AI Actions at 71%</strong> — projected to reach limit by Mar 28.</span>
            <Button variant="outline" size="sm" className="h-6 text-[10px] shrink-0">Upgrade</Button>
          </div>
        )}
      </div>

      {/* ═══ Operational ═══ */}
      <div className="grid gap-4 lg:grid-cols-2">
        {/* General */}
        <div className="rounded-xl border border-border bg-card shadow-elevation-1 overflow-hidden">
          <div className="flex items-center justify-between px-5 py-3 border-b border-border">
            <div className="flex items-center gap-2">
              <Clock className="h-4 w-4 text-muted-foreground/40" />
              <span className="text-sm font-semibold">General</span>
            </div>
            <Button variant="ghost" size="sm" className="h-7 text-xs gap-1"><Pencil className="h-3 w-3" />Edit</Button>
          </div>
          <div className="px-5 py-4 grid grid-cols-2 gap-x-6 gap-y-4">
            <Field label="Timezone">America/New_York</Field>
            <Field label="Business Hours">Mon–Fri 08:00–18:00</Field>
            <Field label="Currency">USD ($)</Field>
            <Field label="Fiscal Year">January 1</Field>
            <Field label="Date Format">MM/DD/YYYY</Field>
            <Field label="Number Format">1,234,567.89</Field>
          </div>
        </div>

        {/* SLAs */}
        <div className="rounded-xl border border-border bg-card shadow-elevation-1 overflow-hidden">
          <div className="flex items-center justify-between px-5 py-3 border-b border-border">
            <div className="flex items-center gap-2">
              <Shield className="h-4 w-4 text-muted-foreground/40" />
              <span className="text-sm font-semibold">SLA Targets</span>
            </div>
            <Button variant="ghost" size="sm" className="h-7 text-xs gap-1"><Pencil className="h-3 w-3" />Edit</Button>
          </div>
          <div className="divide-y divide-border">
            {[
              ["CDD Onboarding", "24 hours"],
              ["EDD Onboarding", "5 business days"],
              ["Critical Alert Resolution", "4 hours"],
              ["High Alert Resolution", "24 hours"],
              ["SAR Filing", "30 days from trigger"],
              ["Periodic Review (High)", "Quarterly"],
            ].map(([label, value]) => (
              <div key={label} className="flex items-center justify-between px-5 py-2.5">
                <span className="text-sm text-muted-foreground">{label}</span>
                <div className="flex items-center gap-2">
                  <span className="text-sm font-medium tabular-nums">{value}</span>
                  <span className="h-1.5 w-1.5 rounded-full bg-nx-emerald-500" />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ═══ Jurisdictions ═══ */}
      <div className="rounded-xl border border-border bg-card shadow-elevation-1 overflow-hidden">
        <div className="flex items-center justify-between px-6 py-3.5 border-b border-border">
          <div className="flex items-center gap-2">
            <Globe className="h-4 w-4 text-muted-foreground/40" />
            <span className="text-sm font-semibold">Active Jurisdictions</span>
            <span className="rounded bg-muted px-1.5 py-0.5 text-[10px] text-muted-foreground">47 of 127</span>
          </div>
          <Button variant="ghost" size="sm" className="h-7 text-xs gap-1">Manage<ChevronRight className="h-3 w-3" /></Button>
        </div>
        <div className="grid grid-cols-4 sm:grid-cols-6 md:grid-cols-8 lg:grid-cols-10">
          {[
            { f: "🇺🇸", c: "US", n: 1247 }, { f: "🇬🇧", c: "UK", n: 834 }, { f: "🇪🇺", c: "EU", n: 623 },
            { f: "🇩🇪", c: "DE", n: 412 }, { f: "🇸🇬", c: "SG", n: 312 }, { f: "🇰🇾", c: "KY", n: 287 },
            { f: "🇨🇭", c: "CH", n: 187 }, { f: "🇭🇰", c: "HK", n: 176 }, { f: "🇯🇪", c: "JE", n: 143 },
            { f: "🇱🇺", c: "LU", n: 121 }, { f: "🇳🇱", c: "NL", n: 98 }, { f: "🇯🇵", c: "JP", n: 87 },
            { f: "🇦🇪", c: "AE", n: 76 }, { f: "🇫🇷", c: "FR", n: 65 }, { f: "🇮🇪", c: "IE", n: 54 },
            { f: "🇦🇺", c: "AU", n: 43 }, { f: "🇨🇦", c: "CA", n: 38 }, { f: "🇮🇳", c: "IN", n: 32 },
            { f: "🇧🇷", c: "BR", n: 28 }, { f: "🇰🇷", c: "KR", n: 24 },
          ].map((j) => (
            <div key={j.c} className="flex flex-col items-center gap-0.5 py-3 border-b border-r border-border hover:bg-muted/30 transition-colors cursor-pointer">
              <span className="text-lg leading-none">{j.f}</span>
              <span className="text-[10px] font-semibold leading-none">{j.c}</span>
              <span className="text-[9px] text-muted-foreground tabular-nums leading-none">{j.n}</span>
            </div>
          ))}
        </div>
      </div>

      {/* ═══ Certifications ═══ */}
      <div className="rounded-xl border border-border bg-card shadow-elevation-1 overflow-hidden">
        <div className="flex items-center gap-2 px-6 py-3.5 border-b border-border">
          <Shield className="h-4 w-4 text-muted-foreground/40" />
          <span className="text-sm font-semibold">Certifications & Compliance</span>
        </div>
        <div className="divide-y divide-border">
          {[
            { title: "SOC 2 Type II", status: "Compliant", date: "Audited Feb 2026", next: "Next audit: Apr 6, 2026" },
            { title: "ISO 27001:2022", status: "Certified", date: "Certified Jan 2026", next: "Renewal: Jan 2027" },
            { title: "EU AI Act", status: "Conformant", date: "Assessed Feb 2026", next: "Next review: Q3 2026" },
            { title: "GDPR / DSGVO", status: "Compliant", date: "6 DPIAs on file", next: "DPO: Maria Lopez" },
          ].map((c) => (
            <div key={c.title} className="flex items-center gap-4 px-6 py-3 hover:bg-muted/20 transition-colors">
              <span className="text-sm font-medium w-32 shrink-0">{c.title}</span>
              <span className="rounded-md bg-nx-emerald-50 px-1.5 py-0.5 text-[10px] font-bold text-nx-emerald-700 shrink-0">✓ {c.status}</span>
              <span className="text-xs text-muted-foreground flex-1">{c.date}</span>
              <span className="text-xs text-muted-foreground text-right">{c.next}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
