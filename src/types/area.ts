export interface AreaAction {
  id: string;
  code: number;
  wardNumber: number;
  areaStatus: string;
  assignedUser: {
    id: string;
    name: string;
  } | null;
}

export interface PaginatedResponse<T> {
  actions: T[];
  pagination: {
    total: number;
    pageCount: number;
    page: number;
    limit: number;
  };
}
