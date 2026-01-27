/**
 * API Client
 *
 * Centralized fetch wrapper with error handling, timeout support,
 * and standardized error responses.
 */

import { API_BASE_URL, DEFAULT_TIMEOUT, DEFAULT_HEADERS } from './config';

/**
 * Custom error class for API errors
 * Provides structured error information from backend responses
 */
export class ApiError extends Error {
  public status: number;
  public data: Record<string, unknown>;

  constructor(status: number, data: Record<string, unknown>) {
    const message = (data.error as string) || (data.message as string) || 'An error occurred';
    super(message);
    this.name = 'ApiError';
    this.status = status;
    this.data = data;
  }
}

/**
 * Request options extending standard fetch RequestInit
 */
interface ApiClientOptions extends Omit<RequestInit, 'body'> {
  timeout?: number;
  body?: unknown;
}

/**
 * Generic API client function
 *
 * @param endpoint - API endpoint (e.g., '/users/123')
 * @param options - Fetch options with timeout support
 * @returns Promise resolving to typed response data
 * @throws ApiError for non-2xx responses
 * @throws Error for network failures or timeouts
 */
export async function apiClient<T>(
  endpoint: string,
  options: ApiClientOptions = {}
): Promise<T> {
  const { timeout = DEFAULT_TIMEOUT, body, headers, ...fetchOptions } = options;

  // Create abort controller for timeout
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), timeout);

  try {
    const response = await fetch(`${API_BASE_URL}${endpoint}`, {
      ...fetchOptions,
      headers: {
        ...DEFAULT_HEADERS,
        ...headers,
      },
      body: body ? JSON.stringify(body) : undefined,
      signal: controller.signal,
    });

    clearTimeout(timeoutId);

    // Parse response body
    let data: T;
    const contentType = response.headers.get('content-type');
    if (contentType && contentType.includes('application/json')) {
      data = await response.json();
    } else {
      // For non-JSON responses, return empty object as T
      data = {} as T;
    }

    // Handle non-2xx responses
    if (!response.ok) {
      throw new ApiError(response.status, data as Record<string, unknown>);
    }

    return data;
  } catch (error) {
    clearTimeout(timeoutId);

    // Handle abort (timeout)
    if (error instanceof Error && error.name === 'AbortError') {
      throw new Error('Request timed out');
    }

    // Re-throw ApiError as-is
    if (error instanceof ApiError) {
      throw error;
    }

    // Wrap other errors
    if (error instanceof Error) {
      throw new Error(`Network error: ${error.message}`);
    }

    throw new Error('An unexpected error occurred');
  }
}

/**
 * Convenience methods for common HTTP methods
 */
export const api = {
  get: <T>(endpoint: string, options?: Omit<ApiClientOptions, 'method' | 'body'>) =>
    apiClient<T>(endpoint, { ...options, method: 'GET' }),

  post: <T>(endpoint: string, body?: unknown, options?: Omit<ApiClientOptions, 'method' | 'body'>) =>
    apiClient<T>(endpoint, { ...options, method: 'POST', body }),

  put: <T>(endpoint: string, body?: unknown, options?: Omit<ApiClientOptions, 'method' | 'body'>) =>
    apiClient<T>(endpoint, { ...options, method: 'PUT', body }),

  delete: <T>(endpoint: string, body?: unknown, options?: Omit<ApiClientOptions, 'method' | 'body'>) =>
    apiClient<T>(endpoint, { ...options, method: 'DELETE', body }),
};