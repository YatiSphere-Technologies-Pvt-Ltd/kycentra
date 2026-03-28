// ============================================================
// Global shared types
// ============================================================

/** Standard API envelope returned by all endpoints. */
export interface ApiResponse<T> {
  data: T;
  message?: string;
  success: boolean;
}

/** Paginated list response. */
export interface PaginatedResponse<T> {
  data: T[];
  total: number;
  page: number;
  pageSize: number;
  totalPages: number;
}

/** Pagination query params sent to the API. */
export interface PaginationParams {
  page: number;
  pageSize: number;
}

/** Sort direction. */
export type SortDirection = "asc" | "desc";

/** Generic sort params. */
export interface SortParams<T extends string = string> {
  sortBy: T;
  sortDirection: SortDirection;
}

/** Combine pagination + sorting for table queries. */
export type TableQueryParams<TSortKey extends string = string> =
  PaginationParams & Partial<SortParams<TSortKey>>;

/** Base entity with common audit fields. */
export interface BaseEntity {
  id: string;
  createdAt: string;
  updatedAt: string;
}

/** Navigation item used by sidebar / breadcrumbs. */
export interface NavItem {
  title: string;
  href: string;
  icon?: React.ComponentType<{ className?: string }>;
  children?: NavItem[];
  badge?: string;
}
