"use client";

import Link from "next/link";
import { PageHeader } from "@/components/shared";
import { DashboardCard } from "@/components/shared/dashboard-card";
import { RiskBadge } from "@/components/shared";
import { ComplianceStatusBadge } from "@/components/shared/status-badge";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";

const entities = [
  { id: "ENT-2019-MC-8847", name: "Meridian Capital Partners Ltd", type: "Fund Administrator", jurisdiction: "Cayman Islands", riskTier: "high" as const, status: "active" as const, alerts: 3 },
  { id: "ENT-2020-VT-3321", name: "Volkov International Trading Co.", type: "Trading Company", jurisdiction: "Cyprus", riskTier: "critical" as const, status: "under_review" as const, alerts: 2 },
  { id: "ENT-2018-NS-1122", name: "Nordic Shipping Consortium", type: "Shipping", jurisdiction: "Norway", riskTier: "medium" as const, status: "active" as const, alerts: 0 },
  { id: "ENT-2021-EP-5567", name: "Evergreen Pacific Fund III", type: "Investment Fund", jurisdiction: "Singapore", riskTier: "medium" as const, status: "active" as const, alerts: 1 },
  { id: "ENT-2022-CB-9901", name: "Crescent Bay Financial Services Ltd", type: "Financial Services", jurisdiction: "Bahamas", riskTier: "high" as const, status: "under_review" as const, alerts: 1 },
];

export default function EntitiesPage() {
  return (
    <div className="space-y-5">
      <PageHeader
        title="Entities"
        description="Manage client entities and their compliance profiles"
        actions={<Button size="sm" className="gap-1.5"><Plus className="h-3.5 w-3.5" />Add Entity</Button>}
      />

      <DashboardCard.Root>
        <DashboardCard.Content noPadding className="overflow-auto">
          <table className="w-full text-sm" aria-label="Client entities">
            <caption className="sr-only">List of all client entities</caption>
            <thead>
              <tr className="border-b border-border bg-muted/40">
                {["Entity", "Type", "Jurisdiction", "Risk", "Status", "Alerts", ""].map((h) => (
                  <th key={h} scope="col" className="px-4 py-3 text-left text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {entities.map((e) => (
                <tr key={e.id} className="hover:bg-muted/30 transition-colors">
                  <td className="px-4 py-3">
                    <Link href={`/entities/${e.id}`} className="text-sm font-medium text-primary hover:underline">{e.name}</Link>
                    <p className="text-[11px] font-mono text-muted-foreground">{e.id}</p>
                  </td>
                  <td className="px-4 py-3 text-muted-foreground">{e.type}</td>
                  <td className="px-4 py-3 text-muted-foreground">{e.jurisdiction}</td>
                  <td className="px-4 py-3"><RiskBadge tier={e.riskTier} /></td>
                  <td className="px-4 py-3"><ComplianceStatusBadge status={e.status} /></td>
                  <td className="px-4 py-3 tabular-nums">{e.alerts > 0 ? <span className="font-semibold text-nx-amber-600">{e.alerts}</span> : <span className="text-muted-foreground">0</span>}</td>
                  <td className="px-4 py-3"><Link href={`/entities/${e.id}`} className="text-xs font-medium text-primary hover:underline">View →</Link></td>
                </tr>
              ))}
            </tbody>
          </table>
        </DashboardCard.Content>
      </DashboardCard.Root>
    </div>
  );
}
