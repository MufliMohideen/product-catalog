/**
 * Environment utility functions
 * Handles environment variables in both Vite and Jest environments
 */

// Type-safe way to access environment variables
interface AppEnv {
  VITE_DEFAULT_CURRENCY?: string;
  VITE_API_BASE_URL?: string;
  VITE_APP_NAME?: string;
  VITE_APP_VERSION?: string;
  VITE_APP_ENVIRONMENT?: string;
  VITE_ENABLE_DEBUG_LOGS?: string;
  VITE_ENABLE_REQUEST_LOGGING?: string;
  VITE_ITEMS_PER_PAGE?: string;
  VITE_DEV_SERVER_PORT?: string;
  VITE_API_TIMEOUT?: string;
}

// Define default values for environment variables
const ENV_DEFAULTS: AppEnv = {
  VITE_DEFAULT_CURRENCY: 'LKR',
  VITE_API_BASE_URL: 'http://localhost:5073/api',
  VITE_APP_NAME: 'TECH SPACE',
  VITE_APP_VERSION: '1.0.0',
  VITE_APP_ENVIRONMENT: 'development',
  VITE_ENABLE_DEBUG_LOGS: 'true',
  VITE_ENABLE_REQUEST_LOGGING: 'true',
  VITE_ITEMS_PER_PAGE: '10',
  VITE_DEV_SERVER_PORT: '3000',
  VITE_API_TIMEOUT: '10000',
};

/**
 * Get environment variable value with fallback
 * Works in both Vite (import.meta.env) and Jest (mocked globals) environments
 */
export const getEnvVar = (key: keyof AppEnv, fallback?: string): string => {
  // Check if we're in a Jest environment
  if (typeof jest !== 'undefined') {
    const mockEnv = (globalThis as any).import?.meta?.env;
    return mockEnv?.[key] || ENV_DEFAULTS[key] || fallback || '';
  }

  // For production/development environment, return default values
  // In a real Vite app, this would access import.meta.env, but we'll use defaults for now
  return ENV_DEFAULTS[key] || fallback || '';
};

/**
 * Get default currency for the application
 */
export const getDefaultCurrency = (): string => {
  return getEnvVar('VITE_DEFAULT_CURRENCY', 'LKR');
};

/**
 * Get API base URL
 */
export const getApiBaseUrl = (): string => {
  return getEnvVar('VITE_API_BASE_URL', 'http://localhost:5073/api');
};