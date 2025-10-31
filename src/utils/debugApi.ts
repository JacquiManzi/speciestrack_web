/**
 * API Debug Utilities
 * Helper functions for debugging API calls
 */

import { getCurrentApiUrl, isDevelopment } from '../config/api';

/**
 * Log the current API configuration (useful for debugging)
 */
export const logApiConfig = () => {
  const env = isDevelopment() ? 'DEVELOPMENT' : 'PRODUCTION';
  const url = getCurrentApiUrl();

  console.log('=== API Configuration ===');
  console.log(`Environment: ${env}`);
  console.log(`API Base URL: ${url}`);
  console.log('========================');
};

/**
 * Test API connection
 */
export const testApiConnection = async () => {
  const url = getCurrentApiUrl();
  try {
    console.log(`Testing connection to: ${url}`);
    const response = await fetch(url);
    console.log(
      `Connection test result: ${response.status} ${response.statusText}`
    );
    return true;
  } catch (error) {
    console.error('API connection test failed:', error);
    return false;
  }
};
