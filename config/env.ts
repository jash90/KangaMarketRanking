/**
 * Environment Configuration Module
 *
 * Provides type-safe access to environment variables for Expo projects.
 * Uses expo-constants to access environment variables at runtime.
 */

import Constants from 'expo-constants';

interface EnvironmentConfig {
  API_BASE_URL: string;
  API_TIMEOUT: number;
  API_RETRY_ATTEMPTS: number;
  ENABLE_LOGGING: boolean;
}

/**
 * Get environment variable with fallback to default
 */
function getEnvVar(key: string, defaultValue: string = ''): string {
  // In Expo, env variables are accessed through expo-constants
  const value = process.env[key];
  return value ?? defaultValue;
}

/**
 * Parse environment variable as number with fallback
 */
function getEnvNumber(key: string, defaultValue: number): number {
  const value = getEnvVar(key);
  const parsed = parseInt(value, 10);
  return isNaN(parsed) ? defaultValue : parsed;
}

/**
 * Parse environment variable as boolean
 */
function getEnvBoolean(key: string, defaultValue: boolean = false): boolean {
  const value = getEnvVar(key).toLowerCase();
  if (value === 'true' || value === '1') return true;
  if (value === 'false' || value === '0') return false;
  return defaultValue;
}

/**
 * Check if running in development mode
 * Works in both React Native and Node.js environments
 */
const isDevelopment =
  typeof __DEV__ !== 'undefined' ? __DEV__ : process.env.NODE_ENV !== 'production';

/**
 * Type-safe environment configuration object
 */
export const config: EnvironmentConfig = {
  API_BASE_URL: getEnvVar('API_BASE_URL', 'https://public.kanga.exchange'),
  API_TIMEOUT: getEnvNumber('API_TIMEOUT', 10000),
  API_RETRY_ATTEMPTS: getEnvNumber('API_RETRY_ATTEMPTS', 3),
  ENABLE_LOGGING: getEnvBoolean('ENABLE_LOGGING', isDevelopment),
};

/**
 * Validate configuration at startup
 */
export function validateConfig(): void {
  const errors: string[] = [];

  if (!config.API_BASE_URL) {
    errors.push('API_BASE_URL is required');
  }

  if (config.API_TIMEOUT <= 0) {
    errors.push('API_TIMEOUT must be positive');
  }

  if (config.API_RETRY_ATTEMPTS < 0 || config.API_RETRY_ATTEMPTS > 10) {
    errors.push('API_RETRY_ATTEMPTS must be between 0 and 10');
  }

  if (errors.length > 0) {
    throw new Error(`Configuration validation failed:\n${errors.join('\n')}`);
  }
}

// Validate on module load (development only)
if (isDevelopment) {
  try {
    validateConfig();
    console.log('[Config] ✅ Environment configuration loaded successfully');
    console.log('[Config] API_BASE_URL:', config.API_BASE_URL);
    console.log('[Config] ENABLE_LOGGING:', config.ENABLE_LOGGING);
  } catch (error) {
    console.error('[Config] ❌ Configuration validation failed:', error);
  }
}
