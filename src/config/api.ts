/**
 * API Configuration
 */

import { Platform } from 'react-native';

// API URLs for different environments
// Note: Android emulator uses 10.0.2.2 to access host machine's localhost
const DEV_API_URL_WEB_IOS = 'http://127.0.0.1:5000';
const DEV_API_URL_ANDROID = 'http://10.0.2.2:5000';
const PROD_API_URL = 'https://api.speciestrack.com';

// Determine which URL to use based on environment and platform
const getBaseUrl = () => {
  // @ts-ignore - __DEV__ is a global variable in React Native
  if (typeof __DEV__ !== 'undefined' && __DEV__) {
    // In development, use different localhost addresses based on platform
    if (Platform.OS === 'android') {
      return DEV_API_URL_ANDROID;
    }
    return DEV_API_URL_WEB_IOS;
  }
  return PROD_API_URL;
};

export const API_CONFIG = {
  BASE_URL: getBaseUrl(),
  DEV_API_URL_WEB_IOS,
  DEV_API_URL_ANDROID,
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
