/**
 * Observations Service
 * API methods for observation-related operations
 */

import { apiClient } from '../api/client';
import { API_ENDPOINTS } from '../config/api';
import type { NativePlantObservation, PaginationParams } from '../types/api';

/**
 * Get all native plants observations
 * Returns an array of native plant observations
 */
export const getNativePlants = async (
  params?: PaginationParams
): Promise<NativePlantObservation[]> => {
  return apiClient.get<NativePlantObservation[]>(
    API_ENDPOINTS.NATIVE_PLANTS,
    params
  );
};
