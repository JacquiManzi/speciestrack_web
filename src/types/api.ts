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
 * Example: Species Type
 * Replace with your actual data models
 */
export interface Species {
  id: string;
  name: string;
  scientificName: string;
  category?: string;
  description?: string;
  imageUrl?: string;
  createdAt?: string;
  updatedAt?: string;
}

/**
 * Example: Observation Type
 */
export interface Observation {
  id: string;
  speciesId: string;
  latitude: number;
  longitude: number;
  observedAt: string;
  notes?: string;
  imageUrl?: string;
  userId?: string;
  createdAt?: string;
}

/**
 * Example: Location Type
 */
export interface Location {
  id: string;
  name: string;
  latitude: number;
  longitude: number;
  boundary?: string; // WKT polygon
  description?: string;
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
