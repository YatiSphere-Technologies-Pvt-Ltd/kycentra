/**
 * Centralised React-Query key factory.
 *
 * Convention:  featureName.action(params)
 * This prevents key collisions and makes invalidation predictable.
 */
export const queryKeys = {
  dashboard: {
    all: ["dashboard"] as const,
    stats: () => [...queryKeys.dashboard.all, "stats"] as const,
    recentActivity: () =>
      [...queryKeys.dashboard.all, "recent-activity"] as const,
  },
  users: {
    all: ["users"] as const,
    list: (params?: Record<string, unknown>) =>
      [...queryKeys.users.all, "list", params] as const,
    detail: (id: string) => [...queryKeys.users.all, "detail", id] as const,
  },
} as const;
