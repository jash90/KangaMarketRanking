/**
 * Kanga Exchange API Client
 *
 * Production-ready Axios client with:
 * - Automatic retry with exponential backoff
 * - Request/response logging
 * - Error normalization
 * - Runtime type validation
 * - Timeout handling
 */

import { config } from '@/config';
import axios, { AxiosError, AxiosInstance, AxiosRequestConfig } from 'axios';
import { ApiError } from '../types';
import {
  ValidatedMarketDepth,
  ValidatedMarketPair,
  ValidatedMarketSummary,
  validateMarketDepth,
  validateMarketPairs,
  validateMarketSummary,
} from '../validators';
import { logger } from '@/utils';

/**
 * Extended Axios config with retry count tracking
 */
interface RetryConfig extends AxiosRequestConfig {
  retryCount?: number;
}

/**
 * Production-ready API client for Kanga Exchange
 */
class KangaApiClient {
  private axiosInstance: AxiosInstance;
  private readonly MAX_RETRY_ATTEMPTS: number;
  private readonly BASE_RETRY_DELAY: number = 1000; // 1 second

  constructor() {
    this.MAX_RETRY_ATTEMPTS = config.API_RETRY_ATTEMPTS;

    this.axiosInstance = axios.create({
      baseURL: config.API_BASE_URL,
      timeout: config.API_TIMEOUT,
      headers: {
        'Content-Type': 'application/json',
        Accept: 'application/json',
      },
    });

    this.setupInterceptors();
  }

  /**
   * Setup request and response interceptors
   */
  private setupInterceptors(): void {
    // Request interceptor - logging and headers
    this.axiosInstance.interceptors.request.use(
      (requestConfig) => {
        logger.debug(`[API] ${requestConfig.method?.toUpperCase()} ${requestConfig.url}`, {
          headers: requestConfig.headers,
          params: requestConfig.params,
        });
        return requestConfig;
      },
      (error: AxiosError) => {
        logger.error('[API] Request setup failed', error);
        return Promise.reject(error);
      }
    );

    // Response interceptor - retry logic and error handling
    this.axiosInstance.interceptors.response.use(
      (response) => {
        logger.debug(`[API] Response ${response.status}`, {
          url: response.config.url,
          status: response.status,
          dataSize: JSON.stringify(response.data).length,
        });
        return response;
      },
      async (error: AxiosError) => {
        return this.handleResponseError(error);
      }
    );
  }

  /**
   * Handle response errors with retry logic
   */
  private async handleResponseError(error: AxiosError): Promise<never> {
    const config = error.config as RetryConfig;

    if (!config) {
      return Promise.reject(this.normalizeError(error));
    }

    // Initialize retry count
    config.retryCount = config.retryCount ?? 0;

    // Determine if we should retry
    const shouldRetry = this.shouldRetry(error, config.retryCount);

    if (shouldRetry) {
      config.retryCount += 1;

      // Calculate exponential backoff delay
      const delay = this.calculateRetryDelay(config.retryCount);

      logger.warn(`[API] Retry ${config.retryCount}/${this.MAX_RETRY_ATTEMPTS} after ${delay}ms`, {
        url: config.url,
        error: error.message,
      });

      // Wait before retrying
      await this.sleep(delay);

      // Retry the request
      return this.axiosInstance(config);
    }

    // No more retries, throw normalized error
    return Promise.reject(this.normalizeError(error));
  }

  /**
   * Determine if a request should be retried
   */
  private shouldRetry(error: AxiosError, retryCount: number): boolean {
    // Don't retry if we've exceeded max attempts
    if (retryCount >= this.MAX_RETRY_ATTEMPTS) {
      return false;
    }

    // Retry on network errors (no response)
    if (!error.response) {
      return true;
    }

    // Retry on 5xx server errors
    const status = error.response.status;
    if (status >= 500 && status < 600) {
      return true;
    }

    // Retry on 429 Too Many Requests
    if (status === 429) {
      return true;
    }

    // Don't retry on client errors (4xx except 429)
    return false;
  }

  /**
   * Calculate retry delay with exponential backoff
   * Delay increases: 1s, 2s, 4s, 8s...
   */
  private calculateRetryDelay(retryCount: number): number {
    const exponentialDelay = Math.pow(2, retryCount - 1) * this.BASE_RETRY_DELAY;

    // Add jitter to prevent thundering herd
    const jitter = Math.random() * 200; // 0-200ms jitter

    return Math.min(exponentialDelay + jitter, 10000); // Max 10 seconds
  }

  /**
   * Sleep for specified milliseconds
   */
  private sleep(ms: number): Promise<void> {
    return new Promise((resolve) => setTimeout(resolve, ms));
  }

  /**
   * Normalize Axios errors into consistent ApiError format
   */
  private normalizeError(error: AxiosError): ApiError {
    if (error.response) {
      // Server responded with error status
      const status = error.response.status;
      const message = this.getErrorMessage(status);

      logger.error('[API] Server error', error, {
        status,
        statusText: error.response.statusText,
        data: error.response.data,
      });

      return {
        message,
        code: error.code,
        status,
        details: error.response.data,
      };
    } else if (error.request) {
      // Request made but no response received
      logger.error('[API] Network error - no response', error);

      return {
        message: 'Network Error: Unable to reach server. Please check your connection.',
        code: error.code,
      };
    } else {
      // Error in request setup
      logger.error('[API] Request configuration error', error);

      return {
        message: `Request Error: ${error.message}`,
        code: error.code,
      };
    }
  }

  /**
   * Get user-friendly error message based on HTTP status
   */
  private getErrorMessage(status: number): string {
    switch (status) {
      case 400:
        return 'Bad Request: Invalid request parameters';
      case 401:
        return 'Unauthorized: Authentication required';
      case 403:
        return 'Forbidden: Access denied';
      case 404:
        return 'Not Found: Resource not available';
      case 429:
        return 'Too Many Requests: Please wait before retrying';
      case 500:
        return 'Server Error: Internal server error';
      case 502:
        return 'Bad Gateway: Server is temporarily unavailable';
      case 503:
        return 'Service Unavailable: Server is temporarily down';
      case 504:
        return 'Gateway Timeout: Server took too long to respond';
      default:
        return `Server Error: HTTP ${status}`;
    }
  }

  // ============================================================================
  // PUBLIC API METHODS
  // ============================================================================

  /**
   * Fetch all market trading pairs
   * @throws {ApiError} on failure
   */
  public async getMarketPairs(): Promise<ValidatedMarketPair[]> {
    try {
      const response = await this.axiosInstance.get('/api/market/pairs');

      // Validate response with Zod
      const validatedData = validateMarketPairs(response.data);

      logger.info(`[API] Fetched ${validatedData.length} market pairs`);
      return validatedData;
    } catch (error) {
      logger.error('[API] Failed to fetch market pairs', error);
      throw error;
    }
  }

  /**
   * Fetch market summary for all pairs
   * @throws {ApiError} on failure
   */
  public async getMarketSummary(): Promise<ValidatedMarketSummary[]> {
    try {
      const response = await this.axiosInstance.get('/api/market/summary');

      // Validate response with Zod
      const validatedData = validateMarketSummary(response.data);

      logger.info(`[API] Fetched market summary for ${validatedData.length} pairs`);
      return validatedData;
    } catch (error) {
      logger.error('[API] Failed to fetch market summary', error);
      throw error;
    }
  }

  /**
   * Fetch market depth (order book) for specific market
   * @param marketId - Ticker ID (e.g., "BTC_USDT")
   * @throws {ApiError} on failure
   */
  public async getMarketDepth(marketId: string): Promise<ValidatedMarketDepth> {
    try {
      const response = await this.axiosInstance.get(`/api/market/depth/${marketId}`);

      // Validate response with Zod (pass marketId for ticker_id)
      const validatedData = validateMarketDepth(response.data, marketId);

      logger.info(`[API] Fetched market depth for ${marketId}`, {
        bids: validatedData.bids.length,
        asks: validatedData.asks.length,
      });

      return validatedData;
    } catch (error) {
      logger.error(`[API] Failed to fetch market depth for ${marketId}`, error);
      throw error;
    }
  }

  /**
   * Cancel all pending requests (useful for cleanup on unmount)
   */
  public cancelPendingRequests(): void {
    // Note: Requires implementing AbortController for request cancellation
    logger.info('[API] Cancelling pending requests');
    // TODO: Implement request cancellation with AbortController
  }
}

/**
 * Singleton API client instance
 * Use this throughout the application
 */
export const kangaApi = new KangaApiClient();
