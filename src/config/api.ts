/**
 * API Configuration
 */

// API URLs for different environments
const DEV_API_URL = 'http://127.0.0.1:5000';
const PROD_API_URL = 'https://api.speciestrack.com';

// Determine which URL to use based on environment
const getBaseUrl = () => {
  // @ts-ignore - __DEV__ is a global variable in React Native
  if (typeof __DEV__ !== 'undefined' && __DEV__) {
    return DEV_API_URL;
  }
  return PROD_API_URL;
};

export const API_CONFIG = {
  BASE_URL: getBaseUrl(),
  DEV_API_URL,
  PROD_API_URL,
  TIMEOUT: 30000, // 30 seconds
  HEADERS: {
    'Content-Type': 'application/json',
  },
} as const;

/**
 * API Endpoints
 * Define your API endpoints here for easy reference
 */
export const API_ENDPOINTS = {
  // Example endpoints - replace with your actual endpoints
  SPECIES: '/species',
  OBSERVATIONS: '/observations',
  LOCATIONS: '/locations',
  NATIVE_PLANTS: '/native-plants',
  // Add more endpoints as needed
} as const;

/**
 * Helper function to check if app is running in development mode
 */
export const isDevelopment = () => {
  // @ts-ignore
  return typeof __DEV__ !== 'undefined' && __DEV__;
};

/**
 * Get current API base URL
 */
export const getCurrentApiUrl = () => API_CONFIG.BASE_URL;
