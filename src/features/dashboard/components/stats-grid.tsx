"use client";

import { StatCard } from "@/components/shared";
import { Users, FolderOpen, DollarSign, TrendingUp } from "lucide-react";
import { useDashboardStats } from "../hooks/use-dashboard";

export function StatsGrid() {
  const { data, isLoading } = useDashboardStats();

  const cards = [
    {
      title: "Total Users",
      value: data?.totalUsers.toLocaleString() ?? "—",
      icon: <Users className="h-5 w-5" />,
      trend: { value: 12.5, isPositive: true },
      description: "from last month",
    },
    {
      title: "Active Projects",
      value: data?.activeProjects.toLocaleString() ?? "—",
      icon: <FolderOpen className="h-5 w-5" />,
      trend: { value: 4.1, isPositive: true },
      description: "from last month",
    },
    {
      title: "Revenue",
      value: data ? `$${data.revenue.toLocaleString()}` : "—",
      icon: <DollarSign className="h-5 w-5" />,
      trend: { value: 8.3, isPositive: true },
      description: "from last month",
    },
    {
      title: "Conversion Rate",
      value: data ? `${data.conversionRate}%` : "—",
      icon: <TrendingUp className="h-5 w-5" />,
      trend: { value: 1.2, isPositive: false },
      description: "from last month",
    },
  ];

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      {cards.map((card) => (
        <StatCard key={card.title} {...card} isLoading={isLoading} />
      ))}
    </div>
  );
}
