/**
 * API Types
 * Define TypeScript types for API requests and responses
 */

/**
 * Generic API Response wrapper
 */
export interface ApiResponse<T> {
  data: T;
  status: number;
  headers: Record<string, string>;
}

/**
 * API Error
 */
export interface ApiError {
  status: number;
  message: string;
  data?: any;
}

/**
 * Native Plant Observation Type
 */
export interface NativePlantObservation {
  id: number;
  common_name: string;
  scientific_name: string;
  decimal_latitude: number;
  decimal_longitude: number;
  native: boolean;
  observation_count: number;
  observation_type: string;
  fetch_date: string;
  created_at: string;
  updated_at: string;
  occurrence_id: string;
}

/**
 * Pagination Params
 */
export interface PaginationParams {
  page?: number;
  limit?: number;
}

/**
 * Paginated Response
 */
export interface PaginatedResponse<T> {
  data: T[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}
