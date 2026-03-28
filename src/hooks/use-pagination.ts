"use client";

import { useCallback, useState } from "react";
import type { PaginationParams } from "@/types";

export function usePagination(initialPageSize = 10) {
  const [pagination, setPagination] = useState<PaginationParams>({
    page: 1,
    pageSize: initialPageSize,
  });

  const setPage = useCallback((page: number) => {
    setPagination((prev) => ({ ...prev, page }));
  }, []);

  const setPageSize = useCallback((pageSize: number) => {
    setPagination({ page: 1, pageSize });
  }, []);

  const nextPage = useCallback(() => {
    setPagination((prev) => ({ ...prev, page: prev.page + 1 }));
  }, []);

  const prevPage = useCallback(() => {
    setPagination((prev) => ({ ...prev, page: Math.max(1, prev.page - 1) }));
  }, []);

  return { ...pagination, setPage, setPageSize, nextPage, prevPage };
}
