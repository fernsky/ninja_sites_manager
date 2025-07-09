export type SortField = "name" | "wardNumber" | "createdAt" | "status";
export type SortOrder = "asc" | "desc";

export interface EnumeratorFilters {
  search?: string;
  wardNumber?: number;
  status?: "active" | "inactive";
}

export interface PaginationState {
  pageSize: number;
  pageIndex: number;
}
