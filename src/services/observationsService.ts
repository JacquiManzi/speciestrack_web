/**
 * Observations Service
 * API methods for observation-related operations
 */

import { apiClient } from '../api/client';
import { API_ENDPOINTS } from '../config/api';
import type {
  NativePlantObservation,
  NativePlantFilterParams,
} from '../types/api';

/**
 * Get all native plants observations
 * Returns an array of native plant observations
 *
 * @param params - Filter parameters
 *   - start_time: ISO format timestamp for start of time range
 *   - end_time: ISO format timestamp for end of time range
 *   - common_name: Filter by common name (partial match)
 *   - scientific_name: Filter by scientific name (partial match)
 *   - page: Page number for pagination
 *   - limit: Number of items per page
 */
export const getNativePlants = async (
  params?: NativePlantFilterParams
): Promise<NativePlantObservation[]> => {
  return apiClient.get<NativePlantObservation[]>(
    API_ENDPOINTS.NATIVE_PLANTS,
    params
  );
};
