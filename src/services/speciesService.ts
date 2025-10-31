/**
 * Species Service
 * API methods for species-related operations
 */

import { apiClient } from '../api/client';
import { API_ENDPOINTS } from '../config/api';
import type {
  Species,
  PaginatedResponse,
  PaginationParams,
} from '../types/api';

/**
 * Get all species with optional pagination
 */
export const getAllSpecies = async (
  params?: PaginationParams
): Promise<PaginatedResponse<Species>> => {
  return apiClient.get<PaginatedResponse<Species>>(
    API_ENDPOINTS.SPECIES,
    params
  );
};

/**
 * Get a single species by ID
 */
export const getSpeciesById = async (id: string): Promise<Species> => {
  return apiClient.get<Species>(`${API_ENDPOINTS.SPECIES}/${id}`);
};

/**
 * Create a new species
 */
export const createSpecies = async (
  data: Omit<Species, 'id' | 'createdAt' | 'updatedAt'>
): Promise<Species> => {
  return apiClient.post<Species>(API_ENDPOINTS.SPECIES, data);
};

/**
 * Update a species
 */
export const updateSpecies = async (
  id: string,
  data: Partial<Species>
): Promise<Species> => {
  return apiClient.put<Species>(`${API_ENDPOINTS.SPECIES}/${id}`, data);
};

/**
 * Delete a species
 */
export const deleteSpecies = async (id: string): Promise<void> => {
  return apiClient.delete<void>(`${API_ENDPOINTS.SPECIES}/${id}`);
};

/**
 * Search species by name
 */
export const searchSpecies = async (
  query: string,
  params?: PaginationParams
): Promise<PaginatedResponse<Species>> => {
  return apiClient.get<PaginatedResponse<Species>>(
    `${API_ENDPOINTS.SPECIES}/search`,
    { q: query, ...params }
  );
};
