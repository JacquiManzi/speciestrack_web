/**
 * Base API Client
 * Handles all HTTP requests to the backend API
 */

import { API_CONFIG } from '../config/api';
import type { ApiResponse, ApiError } from '../types/api';

class ApiClient {
  private baseURL: string;
  private timeout: number;
  private headers: Record<string, string>;

  constructor() {
    this.baseURL = API_CONFIG.BASE_URL;
    this.timeout = API_CONFIG.TIMEOUT;
    this.headers = { ...API_CONFIG.HEADERS };
  }

  /**
   * Set authorization token
   */
  setAuthToken(token: string) {
    this.headers['Authorization'] = `Bearer ${token}`;
  }

  /**
   * Clear authorization token
   */
  clearAuthToken() {
    delete this.headers['Authorization'];
  }

  /**
   * Make HTTP request with timeout
   */
  private async fetchWithTimeout(
    url: string,
    options: RequestInit
  ): Promise<Response> {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), this.timeout);

    try {
      const response = await fetch(url, {
        ...options,
        signal: controller.signal,
      });
      clearTimeout(timeoutId);
      return response;
    } catch (error) {
      clearTimeout(timeoutId);
      if (error instanceof Error && error.name === 'AbortError') {
        throw new Error('Request timeout');
      }
      throw error;
    }
  }

  /**
   * Handle API response
   */
  private async handleResponse<T>(response: Response): Promise<ApiResponse<T>> {
    const contentType = response.headers.get('content-type');
    const isJson = contentType?.includes('application/json');

    if (!response.ok) {
      const errorData = isJson ? await response.json() : await response.text();
      const error: ApiError = {
        status: response.status,
        message:
          typeof errorData === 'object' && errorData.message
            ? errorData.message
            : errorData || response.statusText,
        data: typeof errorData === 'object' ? errorData : undefined,
      };
      throw error;
    }

    const data = isJson ? await response.json() : await response.text();
    return {
      data,
      status: response.status,
      headers: Object.fromEntries(response.headers.entries()),
    };
  }

  /**
   * GET request
   */
  async get<T = any>(
    endpoint: string,
    params?: Record<string, any>
  ): Promise<T> {
    const url = new URL(`${this.baseURL}${endpoint}`);
    if (params) {
      Object.keys(params).forEach((key) =>
        url.searchParams.append(key, String(params[key]))
      );
    }

    const response = await this.fetchWithTimeout(url.toString(), {
      method: 'GET',
      headers: this.headers,
    });

    const result = await this.handleResponse<T>(response);
    return result.data;
  }

  /**
   * POST request
   */
  async post<T = any>(endpoint: string, body?: any): Promise<T> {
    const response = await this.fetchWithTimeout(`${this.baseURL}${endpoint}`, {
      method: 'POST',
      headers: this.headers,
      body: body ? JSON.stringify(body) : undefined,
    });

    const result = await this.handleResponse<T>(response);
    return result.data;
  }

  /**
   * PUT request
   */
  async put<T = any>(endpoint: string, body?: any): Promise<T> {
    const response = await this.fetchWithTimeout(`${this.baseURL}${endpoint}`, {
      method: 'PUT',
      headers: this.headers,
      body: body ? JSON.stringify(body) : undefined,
    });

    const result = await this.handleResponse<T>(response);
    return result.data;
  }

  /**
   * PATCH request
   */
  async patch<T = any>(endpoint: string, body?: any): Promise<T> {
    const response = await this.fetchWithTimeout(`${this.baseURL}${endpoint}`, {
      method: 'PATCH',
      headers: this.headers,
      body: body ? JSON.stringify(body) : undefined,
    });

    const result = await this.handleResponse<T>(response);
    return result.data;
  }

  /**
   * DELETE request
   */
  async delete<T = any>(endpoint: string): Promise<T> {
    const response = await this.fetchWithTimeout(`${this.baseURL}${endpoint}`, {
      method: 'DELETE',
      headers: this.headers,
    });

    const result = await this.handleResponse<T>(response);
    return result.data;
  }
}

// Export singleton instance
export const apiClient = new ApiClient();
