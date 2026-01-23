/**
 * API Configuration
 *
 * Centralized configuration for API client settings.
 */

// Base URL for the Flask backend API
export const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5001/api';

// Default request timeout in milliseconds
export const DEFAULT_TIMEOUT = 10000;

// Default headers for all API requests
export const DEFAULT_HEADERS: HeadersInit = {
  'Content-Type': 'application/json',
};
