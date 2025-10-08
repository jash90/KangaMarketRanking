/**
 * Production Logger Utility
 *
 * Provides structured logging with level control for production environments.
 * Integrates with Sentry for error tracking in production.
 */

import { config } from '@/config';

type LogLevel = 'debug' | 'info' | 'warn' | 'error';

interface LogMetadata {
  [key: string]: unknown;
}

class Logger {
  private enabled: boolean;

  constructor() {
    this.enabled = config.ENABLE_LOGGING;
  }

  /**
   * Internal log method with consistent formatting
   */
  private log(level: LogLevel, message: string, metadata?: LogMetadata): void {
    // Always log errors, even if logging is disabled
    if (!this.enabled && level !== 'error') {
      return;
    }

    const timestamp = new Date().toISOString();
    const prefix = `[${timestamp}] [${level.toUpperCase()}]`;

    const logFn = this.getLogFunction(level);

    if (metadata && Object.keys(metadata).length > 0) {
      logFn(prefix, message, metadata);
    } else {
      logFn(prefix, message);
    }
  }

  /**
   * Get the appropriate console method for the log level
   */
  private getLogFunction(level: LogLevel): typeof console.log {
    switch (level) {
      case 'debug':
        return console.log;
      case 'info':
        return console.info;
      case 'warn':
        return console.warn;
      case 'error':
        return console.error;
      default:
        return console.log;
    }
  }

  /**
   * Log debug message (development only)
   */
  debug(message: string, metadata?: LogMetadata): void {
    const isDev = typeof __DEV__ !== 'undefined' ? __DEV__ : process.env.NODE_ENV !== 'production';
    if (isDev) {
      this.log('debug', message, metadata);
    }
  }

  /**
   * Log informational message
   */
  info(message: string, metadata?: LogMetadata): void {
    this.log('info', message, metadata);
  }

  /**
   * Log warning message
   */
  warn(message: string, metadata?: LogMetadata): void {
    this.log('warn', message, metadata);
  }

  /**
   * Log error message
   * In production, this also sends to Sentry
   */
  error(message: string, error?: Error | unknown, metadata?: LogMetadata): void {
    const errorInfo: LogMetadata = {
      ...metadata,
    };

    if (error instanceof Error) {
      errorInfo.errorName = error.name;
      errorInfo.errorMessage = error.message;
      errorInfo.errorStack = error.stack;
    } else if (error) {
      errorInfo.error = String(error);
    }

    this.log('error', message, errorInfo);

    // TODO: In production, send to Sentry
    // if (!__DEV__ && error instanceof Error) {
    //   Sentry.captureException(error, { contexts: { metadata } });
    // }
  }

  /**
   * Group related log messages
   */
  group(label: string): void {
    if (this.enabled) {
      console.group(label);
    }
  }

  /**
   * End a log group
   */
  groupEnd(): void {
    if (this.enabled) {
      console.groupEnd();
    }
  }

  /**
   * Enable or disable logging at runtime
   */
  setEnabled(enabled: boolean): void {
    this.enabled = enabled;
    this.info(`Logging ${enabled ? 'enabled' : 'disabled'}`);
  }
}

/**
 * Singleton logger instance
 */
export const logger = new Logger();
