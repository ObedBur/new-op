export interface ApiResponse<T> {
  success: boolean;
  data: T;
  message?: string;
  status?: number;
  pagination?: {
    total: number;
    page: number;
    limit: number;
    pages: number;
  };
}

export interface PaginatedResponse<T> {
  items: T[];
  total: number;
  page: number;
  totalPages: number;
  limit: number;
}

export type ApiPaginatedResponse<T> = ApiResponse<PaginatedResponse<T>>;

export interface ApiError {
  message: string;
  code?: string;
  errors?: Record<string, string[]>;
}
