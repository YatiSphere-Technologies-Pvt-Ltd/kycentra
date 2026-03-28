import type { BaseEntity } from "@/types";

export interface DashboardStats {
  totalUsers: number;
  activeProjects: number;
  revenue: number;
  conversionRate: number;
}

export interface RecentActivity extends BaseEntity {
  user: string;
  action: string;
  target: string;
  timestamp: string;
}
