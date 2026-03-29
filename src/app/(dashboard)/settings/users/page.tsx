"use client";

import { useState, Fragment } from "react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { users as initialUsers, teams } from "@/features/settings/data/mock-data";
import {
  Users, Plus, Search, Shield, CheckCircle2, AlertTriangle,
  ChevronRight, X, Save, Mail, Key, Eye, Settings,
  Lock, UserPlus, Trash2, Edit2,
} from "lucide-react";

/* ─── Types ─── */

const roleColors: Record<string, { bg: string; fg: string }> = {
  "CCO": { bg: "var(--nx-rose-50)", fg: "var(--nx-rose-700)" },
  "MLRO": { bg: "var(--nx-rose-50)", fg: "var(--nx-rose-700)" },
  "Senior Analyst": { bg: "var(--nx-neutral-100)", fg: "var(--nx-neutral-700)" },
  "Analyst": { bg: "var(--nx-neutral-100)", fg: "var(--nx-neutral-600)" },
  "Jr. Analyst": { bg: "var(--nx-neutral-100)", fg: "var(--nx-neutral-500)" },
  "Admin": { bg: "var(--nx-amber-50)", fg: "var(--nx-amber-700)" },
  "RM": { bg: "var(--nx-neutral-100)", fg: "var(--nx-neutral-600)" },
};

const statusDot: Record<string, string> = {
  online: "bg-nx-emerald-500",
  away: "bg-nx-amber-500",
  offline: "bg-muted-foreground/30",
};

/* ─── Page ─── */

export default function UsersSettingsPage() {
  const [allUsers, setAllUsers] = useState(initialUsers);
  const [search, setSearch] = useState("");
  const [filterRole, setFilterRole] = useState("all");
  const [filterTeam, setFilterTeam] = useState("all");
  const [expandedUser, setExpandedUser] = useState<string | null>(null);
  const [showInvite, setShowInvite] = useState(false);
  const [inviteForm, setInviteForm] = useState({ email: "", firstName: "", lastName: "", role: "Analyst", team: "AML Ops" });
  const [view, setView] = useState<"users" | "teams" | "roles">("users");

  const roles = [...new Set(allUsers.map((u) => u.role))];
  const teamNames = [...new Set(allUsers.map((u) => u.team))];

  const filtered = allUsers.filter((u) => {
    if (filterRole !== "all" && u.role !== filterRole) return false;
    if (filterTeam !== "all" && u.team !== filterTeam) return false;
    if (search) {
      const q = search.toLowerCase();
      return u.name.toLowerCase().includes(q) || u.email.toLowerCase().includes(q) || u.role.toLowerCase().includes(q);
    }
    return true;
  });

  const onlineCount = allUsers.filter((u) => u.status === "online").length;
  const mfaDisabled = allUsers.filter((u) => !u.mfa).length;

  const handleInvite = () => {
    const id = `u${Date.now()}`;
    setAllUsers((prev) => [...prev, {
      id, name: `${inviteForm.firstName} ${inviteForm.lastName}`.trim() || "New User",
      email: inviteForm.email || "pending@invite.com", role: inviteForm.role,
      team: inviteForm.team, status: "offline" as const, lastActive: "Invited", mfa: false,
    }]);
    setShowInvite(false);
    setInviteForm({ email: "", firstName: "", lastName: "", role: "Analyst", team: "AML Ops" });
  };

  const handleRemoveUser = (id: string) => {
    setAllUsers((prev) => prev.filter((u) => u.id !== id));
    setExpandedUser(null);
  };

  // Permissions matrix for the roles view
  const permissionMatrix = [
    { perm: "View entities", cco: true, mlro: true, senior: true, analyst: true, junior: true, rm: true, admin: true },
    { perm: "Edit entity data", cco: true, mlro: true, senior: true, analyst: true, junior: false, rm: false, admin: true },
    { perm: "Create cases", cco: true, mlro: true, senior: true, analyst: true, junior: false, rm: false, admin: false },
    { perm: "Approve CDD reviews", cco: true, mlro: true, senior: true, analyst: false, junior: false, rm: false, admin: false },
    { perm: "Approve EDD reviews", cco: true, mlro: true, senior: false, analyst: false, junior: false, rm: false, admin: false },
    { perm: "File SARs", cco: true, mlro: true, senior: false, analyst: false, junior: false, rm: false, admin: false },
    { perm: "Modify AI agent config", cco: true, mlro: false, senior: false, analyst: false, junior: false, rm: false, admin: true },
    { perm: "Manage users", cco: true, mlro: false, senior: false, analyst: false, junior: false, rm: false, admin: true },
    { perm: "Access audit logs", cco: true, mlro: true, senior: false, analyst: false, junior: false, rm: false, admin: true },
    { perm: "Export data", cco: true, mlro: true, senior: true, analyst: false, junior: false, rm: false, admin: true },
    { perm: "Manage integrations", cco: false, mlro: false, senior: false, analyst: false, junior: false, rm: false, admin: true },
    { perm: "Override agent decisions", cco: true, mlro: true, senior: true, analyst: true, junior: false, rm: false, admin: false },
  ];

  return (
    <div className="space-y-5">
      {/* ─── Header ─── */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h1 className="text-lg font-bold tracking-tight">Users & Teams</h1>
          <p className="text-[11px] text-muted-foreground mt-0.5">
            {allUsers.length} users · {onlineCount} online · {teams.length} teams · {mfaDisabled > 0 ? `${mfaDisabled} MFA disabled` : "All MFA enabled"}
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm" className="h-7 text-[10px] font-semibold gap-1.5">
            <Key className="h-3 w-3" /> API Keys
          </Button>
          <Button size="sm" className="h-7 text-[10px] font-semibold gap-1.5" onClick={() => setShowInvite(true)}>
            <UserPlus className="h-3 w-3" /> Invite User
          </Button>
        </div>
      </div>

      {/* ─── Invite Modal ─── */}
      {showInvite && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50" onClick={() => setShowInvite(false)}>
          <div className="bg-card rounded-lg border border-border shadow-2xl w-full max-w-md mx-4" onClick={(e) => e.stopPropagation()}>
            <div className="flex items-center justify-between px-5 py-3.5 border-b border-border">
              <h2 className="text-[14px] font-bold">Invite New User</h2>
              <button onClick={() => setShowInvite(false)} className="text-muted-foreground hover:text-foreground"><X className="h-4 w-4" /></button>
            </div>
            <div className="p-5 space-y-3">
              <div>
                <label className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest block mb-1">Email Address *</label>
                <input type="email" value={inviteForm.email} onChange={(e) => setInviteForm((p) => ({ ...p, email: e.target.value }))} placeholder="colleague@company.com" className="h-9 w-full rounded border border-border bg-background px-3 text-[12px] focus:outline-none focus:ring-1 focus:ring-foreground/20" />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest block mb-1">First Name *</label>
                  <input type="text" value={inviteForm.firstName} onChange={(e) => setInviteForm((p) => ({ ...p, firstName: e.target.value }))} className="h-9 w-full rounded border border-border bg-background px-3 text-[12px] focus:outline-none focus:ring-1 focus:ring-foreground/20" />
                </div>
                <div>
                  <label className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest block mb-1">Last Name *</label>
                  <input type="text" value={inviteForm.lastName} onChange={(e) => setInviteForm((p) => ({ ...p, lastName: e.target.value }))} className="h-9 w-full rounded border border-border bg-background px-3 text-[12px] focus:outline-none focus:ring-1 focus:ring-foreground/20" />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest block mb-1">Role *</label>
                  <select value={inviteForm.role} onChange={(e) => setInviteForm((p) => ({ ...p, role: e.target.value }))} className="h-9 w-full rounded border border-border bg-background px-3 text-[12px]">
                    {roles.map((r) => <option key={r} value={r}>{r}</option>)}
                  </select>
                </div>
                <div>
                  <label className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest block mb-1">Team</label>
                  <select value={inviteForm.team} onChange={(e) => setInviteForm((p) => ({ ...p, team: e.target.value }))} className="h-9 w-full rounded border border-border bg-background px-3 text-[12px]">
                    {teamNames.map((t) => <option key={t} value={t}>{t}</option>)}
                  </select>
                </div>
              </div>
              <div className="flex items-center gap-2 text-[10px] text-muted-foreground">
                <input type="checkbox" defaultChecked className="h-3 w-3 rounded" /> Send welcome email with SSO link
              </div>
              <div className="flex items-center gap-2 text-[10px] text-muted-foreground">
                <input type="checkbox" defaultChecked className="h-3 w-3 rounded" /> Require MFA setup on first login
              </div>
            </div>
            <div className="flex items-center justify-end gap-2 px-5 py-3.5 border-t border-border">
              <Button variant="ghost" size="sm" className="h-8 text-[11px]" onClick={() => setShowInvite(false)}>Cancel</Button>
              <Button size="sm" className="h-8 text-[11px] font-semibold gap-1" onClick={handleInvite}>
                <Mail className="h-3 w-3" /> Send Invitation
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* ─── KPIs ─── */}
      <div className="grid grid-cols-3 lg:grid-cols-6 gap-px bg-border rounded-lg overflow-hidden">
        {[
          { label: "Total Users", value: String(allUsers.length) },
          { label: "Online Now", value: String(onlineCount) },
          { label: "Teams", value: String(teams.length) },
          { label: "MFA Enabled", value: `${allUsers.filter((u) => u.mfa).length}/${allUsers.length}`, warn: mfaDisabled > 0 },
          { label: "Roles", value: String(roles.length) },
          { label: "Pending Invites", value: "3" },
        ].map((kpi) => (
          <div key={kpi.label} className="bg-card p-3">
            <div className="text-[9px] font-bold text-muted-foreground uppercase tracking-widest mb-1">{kpi.label}</div>
            <div className={cn("text-[16px] font-extrabold tabular-nums tracking-tight", kpi.warn && "text-nx-amber-600")}>{kpi.value}</div>
          </div>
        ))}
      </div>

      {/* ─── View Toggle ─── */}
      <div className="flex items-center gap-1">
        {(["users", "teams", "roles"] as const).map((v) => (
          <button key={v} onClick={() => setView(v)} className={cn("px-3 py-1.5 text-[10px] font-bold rounded capitalize transition-colors", view === v ? "bg-foreground text-background" : "text-muted-foreground hover:bg-muted/50")}>
            {v === "users" ? `Users (${allUsers.length})` : v === "teams" ? `Teams (${teams.length})` : `Roles & Permissions`}
          </button>
        ))}
      </div>

      {/* ─── Users View ─── */}
      {view === "users" && (
        <div className="rounded-lg border border-border bg-card overflow-hidden">
          {/* Filters */}
          <div className="flex items-center gap-3 px-4 py-2.5 border-b border-border">
            <div className="relative flex-1 max-w-xs">
              <Search className="absolute left-2.5 top-1/2 h-3 w-3 -translate-y-1/2 text-muted-foreground/40" />
              <input type="text" placeholder="Search by name, email, role..." value={search} onChange={(e) => setSearch(e.target.value)} className="h-7 w-full rounded border border-border bg-muted/20 pl-7 pr-3 text-[11px] placeholder:text-muted-foreground/35 focus:outline-none focus:ring-1 focus:ring-foreground/20" />
            </div>
            <select value={filterRole} onChange={(e) => setFilterRole(e.target.value)} className="h-7 rounded border border-border bg-background px-2 text-[10px] font-semibold">
              <option value="all">All Roles</option>
              {roles.map((r) => <option key={r} value={r}>{r}</option>)}
            </select>
            <select value={filterTeam} onChange={(e) => setFilterTeam(e.target.value)} className="h-7 rounded border border-border bg-background px-2 text-[10px] font-semibold">
              <option value="all">All Teams</option>
              {teamNames.map((t) => <option key={t} value={t}>{t}</option>)}
            </select>
          </div>

          <table className="w-full text-[11px]">
            <thead>
              <tr className="border-b border-border bg-muted/20">
                {["", "User", "Email", "Role", "Team", "Last Active", "MFA", ""].map((h) => (
                  <th key={h} className="text-left font-bold text-muted-foreground uppercase tracking-wider px-3 py-2 whitespace-nowrap">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {filtered.map((u) => {
                const isExpanded = expandedUser === u.id;
                const rc = roleColors[u.role] ?? { bg: "var(--nx-neutral-100)", fg: "var(--nx-neutral-600)" };
                return (
                  <Fragment key={u.id}>
                    <tr
                      className={cn("border-b border-border cursor-pointer group transition-colors", isExpanded ? "bg-muted/15" : "hover:bg-muted/10")}
                      onClick={() => setExpandedUser(isExpanded ? null : u.id)}
                    >
                      <td className="px-3 py-2.5 w-6">
                        <span className={cn("inline-block h-2 w-2 rounded-full", statusDot[u.status])} />
                      </td>
                      <td className="px-3 py-2.5">
                        <div className="flex items-center gap-2.5">
                          <div className="h-7 w-7 rounded-full bg-foreground/5 flex items-center justify-center text-[9px] font-bold shrink-0">
                            {u.name.split(" ").map((w) => w[0]).join("")}
                          </div>
                          <span className="text-[12px] font-semibold">{u.name}</span>
                        </div>
                      </td>
                      <td className="px-3 py-2.5 font-mono text-[10px] text-muted-foreground">{u.email}</td>
                      <td className="px-3 py-2.5">
                        <span className="text-[9px] font-bold px-1.5 py-0.5 rounded" style={{ backgroundColor: rc.bg, color: rc.fg }}>{u.role}</span>
                      </td>
                      <td className="px-3 py-2.5 text-muted-foreground">{u.team}</td>
                      <td className="px-3 py-2.5 tabular-nums text-muted-foreground">{u.lastActive}</td>
                      <td className="px-3 py-2.5">
                        {u.mfa ? (
                          <span className="flex items-center gap-1 text-[9px] font-bold text-nx-emerald-600"><CheckCircle2 className="h-3 w-3" /> On</span>
                        ) : (
                          <span className="flex items-center gap-1 text-[9px] font-bold text-nx-amber-600"><AlertTriangle className="h-3 w-3" /> Off</span>
                        )}
                      </td>
                      <td className="px-3 py-2.5">
                        <ChevronRight className={cn("h-3 w-3 text-muted-foreground/30 group-hover:text-foreground transition-all", isExpanded && "rotate-90")} />
                      </td>
                    </tr>

                    {isExpanded && (
                      <tr className="border-b border-border bg-muted/5">
                        <td colSpan={8} className="p-0">
                          <div className="grid lg:grid-cols-12 divide-y lg:divide-y-0 lg:divide-x divide-border">
                            {/* Profile */}
                            <div className="lg:col-span-4 p-5 space-y-3">
                              <div className="text-[9px] font-bold text-muted-foreground uppercase tracking-widest mb-2">Profile</div>
                              <div className="flex items-center gap-3 mb-3">
                                <div className="h-10 w-10 rounded-full bg-foreground/5 flex items-center justify-center text-[12px] font-bold">
                                  {u.name.split(" ").map((w) => w[0]).join("")}
                                </div>
                                <div>
                                  <div className="text-[13px] font-bold">{u.name}</div>
                                  <div className="text-[10px] text-muted-foreground">{u.email}</div>
                                </div>
                              </div>
                              <div className="space-y-1.5 text-[11px]">
                                <div className="flex justify-between"><span className="text-muted-foreground">Role</span><span className="font-bold">{u.role}</span></div>
                                <div className="flex justify-between"><span className="text-muted-foreground">Team</span><span className="font-medium">{u.team}</span></div>
                                <div className="flex justify-between"><span className="text-muted-foreground">Status</span><span className="flex items-center gap-1 font-medium"><span className={cn("h-1.5 w-1.5 rounded-full", statusDot[u.status])} /> {u.status}</span></div>
                                <div className="flex justify-between"><span className="text-muted-foreground">Last Active</span><span className="font-medium tabular-nums">{u.lastActive}</span></div>
                                <div className="flex justify-between"><span className="text-muted-foreground">MFA</span><span className={cn("font-bold", u.mfa ? "text-nx-emerald-600" : "text-nx-amber-600")}>{u.mfa ? "Enabled" : "Disabled"}</span></div>
                              </div>
                            </div>

                            {/* Permissions */}
                            <div className="lg:col-span-4 p-5 space-y-3">
                              <div className="text-[9px] font-bold text-muted-foreground uppercase tracking-widest mb-2">Effective Permissions</div>
                              <div className="space-y-1">
                                {[
                                  { perm: "View entities", has: true },
                                  { perm: "Edit entity data", has: u.role !== "Jr. Analyst" && u.role !== "RM" },
                                  { perm: "Create cases", has: !["Jr. Analyst", "RM"].includes(u.role) },
                                  { perm: "Approve CDD reviews", has: ["CCO", "MLRO", "Senior Analyst"].includes(u.role) },
                                  { perm: "Approve EDD reviews", has: ["CCO", "MLRO"].includes(u.role) },
                                  { perm: "File SARs", has: ["CCO", "MLRO"].includes(u.role) },
                                  { perm: "Manage users", has: ["CCO", "Admin"].includes(u.role) },
                                  { perm: "Override agent decisions", has: !["Jr. Analyst", "RM", "Admin"].includes(u.role) },
                                ].map((p) => (
                                  <div key={p.perm} className="flex items-center gap-2 text-[10px]">
                                    {p.has ? <CheckCircle2 className="h-3 w-3 text-nx-emerald-600 shrink-0" /> : <X className="h-3 w-3 text-muted-foreground/20 shrink-0" />}
                                    <span className={p.has ? "" : "text-muted-foreground/40"}>{p.perm}</span>
                                  </div>
                                ))}
                              </div>
                            </div>

                            {/* Actions */}
                            <div className="lg:col-span-4 p-5 space-y-3">
                              <div className="text-[9px] font-bold text-muted-foreground uppercase tracking-widest mb-2">Actions</div>
                              <div className="space-y-1.5">
                                <Button variant="outline" size="sm" className="w-full h-7 text-[10px] font-semibold gap-1.5 justify-start"><Edit2 className="h-3 w-3" /> Edit Profile</Button>
                                <Button variant="outline" size="sm" className="w-full h-7 text-[10px] font-semibold gap-1.5 justify-start"><Shield className="h-3 w-3" /> Change Role</Button>
                                <Button variant="outline" size="sm" className="w-full h-7 text-[10px] font-semibold gap-1.5 justify-start"><Key className="h-3 w-3" /> Reset Password</Button>
                                <Button variant="outline" size="sm" className="w-full h-7 text-[10px] font-semibold gap-1.5 justify-start"><Lock className="h-3 w-3" /> {u.mfa ? "Disable MFA" : "Enable MFA"}</Button>
                                <Button variant="outline" size="sm" className="w-full h-7 text-[10px] font-semibold gap-1.5 justify-start"><Eye className="h-3 w-3" /> View Activity Log</Button>
                                <Button variant="outline" size="sm" className="w-full h-7 text-[10px] font-semibold gap-1.5 justify-start text-nx-rose-600" onClick={(e) => { e.stopPropagation(); handleRemoveUser(u.id); }}>
                                  <Trash2 className="h-3 w-3" /> Deactivate User
                                </Button>
                              </div>
                            </div>
                          </div>
                        </td>
                      </tr>
                    )}
                  </Fragment>
                );
              })}
            </tbody>
          </table>
          <div className="px-4 py-2.5 border-t border-border text-[10px] text-muted-foreground">
            {filtered.length} of {allUsers.length} users shown
          </div>
        </div>
      )}

      {/* ─── Teams View ─── */}
      {view === "teams" && (
        <div className="space-y-5">
          <div className="rounded-lg border border-border bg-card overflow-hidden">
            <div className="flex items-center justify-between px-4 py-2.5 border-b border-border">
              <span className="text-[12px] font-bold">Teams</span>
              <Button variant="outline" size="sm" className="h-6 text-[9px] font-semibold px-2 gap-1"><Plus className="h-2.5 w-2.5" /> Create Team</Button>
            </div>
            <table className="w-full text-[11px]">
              <thead>
                <tr className="border-b border-border bg-muted/20">
                  {["Team", "Members", "Lead", "Jurisdictions", "Active Cases", "Pending Reviews", "SLA", ""].map((h) => (
                    <th key={h} className="text-left font-bold text-muted-foreground uppercase tracking-wider px-4 py-2 whitespace-nowrap">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {teams.map((t) => (
                  <tr key={t.name} className="hover:bg-muted/10 transition-colors">
                    <td className="px-4 py-2.5 font-semibold text-[12px]">{t.name}</td>
                    <td className="px-4 py-2.5 tabular-nums font-bold">{t.members}</td>
                    <td className="px-4 py-2.5 text-muted-foreground">{t.lead}</td>
                    <td className="px-4 py-2.5 text-muted-foreground text-[10px] max-w-40 truncate">{t.jurisdictions}</td>
                    <td className="px-4 py-2.5 tabular-nums font-bold">{t.cases}</td>
                    <td className="px-4 py-2.5 tabular-nums">{t.reviews}</td>
                    <td className="px-4 py-2.5">
                      <span className={cn("font-bold tabular-nums", t.sla >= 95 ? "text-nx-emerald-600" : t.sla >= 90 ? "" : "text-nx-amber-600")}>{t.sla}%</span>
                    </td>
                    <td className="px-4 py-2.5">
                      <Button variant="ghost" size="sm" className="h-6 text-[9px] font-semibold px-2">Edit</Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Team cards with member avatars */}
          <div className="grid gap-4 lg:grid-cols-2">
            {teams.map((t) => {
              const teamMembers = allUsers.filter((u) => u.team === t.name.replace(" & Enhanced Reviews", "").replace(" Operations", " Ops").replace(" & Infrastructure", ""));
              return (
                <div key={t.name} className="rounded-lg border border-border bg-card p-4">
                  <div className="flex items-center justify-between mb-3">
                    <h3 className="text-[12px] font-bold">{t.name}</h3>
                    <span className="text-[10px] text-muted-foreground">{t.members} members</span>
                  </div>
                  <div className="space-y-2 text-[11px]">
                    <div className="flex justify-between"><span className="text-muted-foreground">Lead</span><span className="font-medium">{t.lead}</span></div>
                    <div className="flex justify-between"><span className="text-muted-foreground">Jurisdictions</span><span className="font-medium text-[10px]">{t.jurisdictions}</span></div>
                  </div>
                  <div className="grid grid-cols-3 gap-px bg-border rounded overflow-hidden mt-3">
                    <div className="bg-card p-2"><div className="text-[12px] font-extrabold tabular-nums">{t.cases}</div><div className="text-[8px] font-bold text-muted-foreground uppercase">Cases</div></div>
                    <div className="bg-card p-2"><div className="text-[12px] font-extrabold tabular-nums">{t.reviews}</div><div className="text-[8px] font-bold text-muted-foreground uppercase">Reviews</div></div>
                    <div className="bg-card p-2"><div className={cn("text-[12px] font-extrabold tabular-nums", t.sla >= 95 ? "text-nx-emerald-600" : "")}>{t.sla}%</div><div className="text-[8px] font-bold text-muted-foreground uppercase">SLA</div></div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* ─── Roles & Permissions View ─── */}
      {view === "roles" && (
        <div className="rounded-lg border border-border bg-card overflow-hidden">
          <div className="px-4 py-2.5 border-b border-border">
            <span className="text-[12px] font-bold">Role-Based Access Control (RBAC)</span>
            <p className="text-[9px] text-muted-foreground mt-0.5">Permission matrix across all platform roles</p>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-[11px]">
              <thead>
                <tr className="border-b border-border bg-muted/20">
                  <th className="text-left font-bold text-muted-foreground uppercase tracking-wider px-4 py-2 whitespace-nowrap sticky left-0 bg-muted/20">Permission</th>
                  {["CCO", "MLRO", "Sr. Analyst", "Analyst", "Jr. Analyst", "RM", "Admin"].map((r) => (
                    <th key={r} className="text-center font-bold text-muted-foreground uppercase tracking-wider px-3 py-2 whitespace-nowrap">{r}</th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {permissionMatrix.map((row) => (
                  <tr key={row.perm} className="hover:bg-muted/10">
                    <td className="px-4 py-2 font-medium sticky left-0 bg-card">{row.perm}</td>
                    {[row.cco, row.mlro, row.senior, row.analyst, row.junior, row.rm, row.admin].map((has, i) => (
                      <td key={i} className="px-3 py-2 text-center">
                        {has ? <CheckCircle2 className="h-3.5 w-3.5 text-nx-emerald-600 mx-auto" /> : <X className="h-3.5 w-3.5 text-muted-foreground/15 mx-auto" />}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <div className="px-4 py-2.5 border-t border-border text-[9px] text-muted-foreground">
            {permissionMatrix.length} permissions across 7 roles · Contact admin to modify role definitions
          </div>
        </div>
      )}
    </div>
  );
}
