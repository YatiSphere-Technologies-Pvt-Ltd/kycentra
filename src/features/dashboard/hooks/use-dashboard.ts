"use client";

import { useQuery } from "@tanstack/react-query";
import { queryKeys } from "@/lib/api/query-keys";
import { fetchDashboardStats, fetchRecentActivity } from "../api/dashboard-api";

export function useDashboardStats() {
  return useQuery({
    queryKey: queryKeys.dashboard.stats(),
    queryFn: fetchDashboardStats,
  });
}

export function useRecentActivity() {
  return useQuery({
    queryKey: queryKeys.dashboard.recentActivity(),
    queryFn: fetchRecentActivity,
  });
}
