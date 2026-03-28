import type { DashboardStats, RecentActivity } from "../types";

// Mock data — replace with real API calls via apiClient
const mockStats: DashboardStats = {
  totalUsers: 12_847,
  activeProjects: 342,
  revenue: 48_250,
  conversionRate: 3.2,
};

const mockActivity: RecentActivity[] = [
  {
    id: "1",
    user: "Alice Johnson",
    action: "Created",
    target: "Project Alpha",
    timestamp: "2 min ago",
    createdAt: "",
    updatedAt: "",
  },
  {
    id: "2",
    user: "Bob Smith",
    action: "Updated",
    target: "Settings",
    timestamp: "15 min ago",
    createdAt: "",
    updatedAt: "",
  },
  {
    id: "3",
    user: "Carol Lee",
    action: "Deployed",
    target: "v2.4.0",
    timestamp: "1 hr ago",
    createdAt: "",
    updatedAt: "",
  },
  {
    id: "4",
    user: "David Kim",
    action: "Reviewed",
    target: "PR #421",
    timestamp: "3 hr ago",
    createdAt: "",
    updatedAt: "",
  },
  {
    id: "5",
    user: "Eva Chen",
    action: "Deleted",
    target: "old-branch",
    timestamp: "5 hr ago",
    createdAt: "",
    updatedAt: "",
  },
];

/** Simulates an API call. Replace with `apiClient.get(...)`. */
async function delay<T>(data: T, ms = 600): Promise<T> {
  return new Promise((resolve) => setTimeout(() => resolve(data), ms));
}

export function fetchDashboardStats(): Promise<DashboardStats> {
  return delay(mockStats);
}

export function fetchRecentActivity(): Promise<RecentActivity[]> {
  return delay(mockActivity);
}
