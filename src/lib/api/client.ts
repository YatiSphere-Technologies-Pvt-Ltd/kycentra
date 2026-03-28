import { env } from "@/config/env";
import type { ApiResponse } from "@/types";

// ============================================================
// HTTP Client — thin, typed fetch wrapper
// ============================================================

type RequestOptions = Omit<RequestInit, "body"> & {
  params?: Record<string, string | number | boolean | undefined>;
  body?: unknown;
};

class HttpError extends Error {
  constructor(
    public status: number,
    public statusText: string,
    public body: unknown
  ) {
    super(`HTTP ${status}: ${statusText}`);
    this.name = "HttpError";
  }
}

function buildUrl(
  path: string,
  params?: Record<string, string | number | boolean | undefined>
): string {
  const url = new URL(path, env.NEXT_PUBLIC_API_URL);
  if (params) {
    Object.entries(params).forEach(([key, value]) => {
      if (value !== undefined) {
        url.searchParams.set(key, String(value));
      }
    });
  }
  return url.toString();
}

async function request<T>(
  path: string,
  options: RequestOptions = {}
): Promise<T> {
  const { params, body, headers: customHeaders, ...rest } = options;

  const headers: HeadersInit = {
    "Content-Type": "application/json",
    ...customHeaders,
  };

  const config: RequestInit = {
    ...rest,
    headers,
    ...(body !== undefined ? { body: JSON.stringify(body) } : {}),
  };

  const url = buildUrl(path, params);
  const response = await fetch(url, config);

  if (!response.ok) {
    const errorBody = await response.json().catch(() => null);
    throw new HttpError(response.status, response.statusText, errorBody);
  }

  // 204 No Content
  if (response.status === 204) {
    return undefined as T;
  }

  return response.json() as Promise<T>;
}

/** Typed API client with convenience methods. */
export const apiClient = {
  get<T>(path: string, opts?: RequestOptions) {
    return request<ApiResponse<T>>(path, { ...opts, method: "GET" });
  },
  post<T>(path: string, body?: unknown, opts?: RequestOptions) {
    return request<ApiResponse<T>>(path, { ...opts, method: "POST", body });
  },
  put<T>(path: string, body?: unknown, opts?: RequestOptions) {
    return request<ApiResponse<T>>(path, { ...opts, method: "PUT", body });
  },
  patch<T>(path: string, body?: unknown, opts?: RequestOptions) {
    return request<ApiResponse<T>>(path, { ...opts, method: "PATCH", body });
  },
  delete<T>(path: string, opts?: RequestOptions) {
    return request<ApiResponse<T>>(path, { ...opts, method: "DELETE" });
  },
} as const;

export { HttpError };
