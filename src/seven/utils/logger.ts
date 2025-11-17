// Structured Logging Utility (HEI-113)
// Replaces console.log with Pino-based structured logging
// Supports log levels, structured fields, and production log rotation

import pino from "pino";
import { LOG_DIR } from "../bridge/paths";
import fs from "fs";

// Ensure log directory exists
if (!fs.existsSync(LOG_DIR)) {
  fs.mkdirSync(LOG_DIR, { recursive: true });
}

/**
 * Log level configuration
 * - development: debug (all logs)
 * - production: info (info, warn, error only)
 */
const LOG_LEVEL = process.env.NODE_ENV === "production" ? "info" : "debug";

/**
 * Determine if we should use pretty printing (development)
 * or JSON output (production/CI)
 */
const USE_PRETTY = process.env.NODE_ENV !== "production" && !process.env.CI;

/**
 * Pino transport configuration
 * - Development: Pretty-print to console
 * - Production: JSON to console + file with rotation
 */
const getTransport = () => {
  if (USE_PRETTY) {
    // Development: Pretty console output
    return {
      target: "pino-pretty",
      options: {
        colorize: true,
        translateTime: "HH:MM:ss.l",
        ignore: "pid,hostname",
        messageFormat: "[{component}] {msg}",
        errorLikeObjectKeys: ["err", "error"]
      }
    };
  } else {
    // Production: JSON to file with rotation
    return {
      target: "pino/file",
      options: {
        destination: `${LOG_DIR}/seven.log`,
        mkdir: true
      }
    };
  }
};

/**
 * Base Pino logger instance
 */
const baseLogger = pino({
  level: LOG_LEVEL,
  transport: getTransport(),
  base: {
    // Remove default pid/hostname to reduce noise
    pid: undefined,
    hostname: undefined
  },
  timestamp: pino.stdTimeFunctions.isoTime,
  formatters: {
    level: (label) => {
      return { level: label };
    }
  }
});

/**
 * Structured logger interface with component context
 */
export interface StructuredLogger {
  debug(msg: string, data?: object): void;
  info(msg: string, data?: object): void;
  warn(msg: string, data?: object): void;
  error(msg: string, error?: Error | object | string, data?: object): void;
  child(bindings: object): StructuredLogger;
}

/**
 * Create a logger with component context
 * @param component Component name (e.g., "boot", "memory", "consciousness")
 * @param metadata Additional structured metadata
 */
export function createLogger(component: string, metadata: object = {}): StructuredLogger {
  const childLogger = baseLogger.child({
    component,
    ...metadata
  });

  return {
    debug(msg: string, data: object = {}) {
      childLogger.debug(data, msg);
    },

    info(msg: string, data: object = {}) {
      childLogger.info(data, msg);
    },

    warn(msg: string, data: object = {}) {
      childLogger.warn(data, msg);
    },

    error(msg: string, error?: Error | object | string, data: object = {}) {
      if (error instanceof Error) {
        childLogger.error({ err: error, ...data }, msg);
      } else if (typeof error === "object") {
        childLogger.error({ ...error, ...data }, msg);
      } else if (typeof error === "string") {
        childLogger.error({ errorMsg: error, ...data }, msg);
      } else {
        childLogger.error(data, msg);
      }
    },

    child(bindings: object) {
      return createLogger(component, { ...metadata, ...bindings });
    }
  };
}

/**
 * Default root logger for unscoped logs
 */
export const logger = createLogger("seven");

/**
 * Boot sequence logger
 */
export const bootLogger = createLogger("boot");

/**
 * Memory system logger
 */
export const memoryLogger = createLogger("memory");

/**
 * Consciousness framework logger
 */
export const consciousnessLogger = createLogger("consciousness");

/**
 * Bridge daemon logger
 */
export const bridgeLogger = createLogger("bridge");

/**
 * Legacy console.log replacement helpers
 * Use these for gradual migration from console.log
 */
export const log = {
  debug: (msg: string, data?: object) => logger.debug(msg, data),
  info: (msg: string, data?: object) => logger.info(msg, data),
  warn: (msg: string, data?: object) => logger.warn(msg, data),
  error: (msg: string, error?: Error | object | string, data?: object) =>
    logger.error(msg, error, data)
};

/**
 * Create a request-scoped logger with correlation ID
 * Useful for tracking operations across multiple components
 */
export function createRequestLogger(
  component: string,
  requestId: string,
  metadata: object = {}
): StructuredLogger {
  return createLogger(component, {
    requestId,
    ...metadata
  });
}

/**
 * Performance timing helper
 * Usage:
 *   const timer = logger.startTimer();
 *   // ... do work ...
 *   timer.done("Operation completed");
 */
export function startTimer(logger: StructuredLogger) {
  const start = Date.now();
  return {
    done(msg: string, data: object = {}) {
      const duration = Date.now() - start;
      logger.info(msg, { ...data, durationMs: duration });
    }
  };
}

/**
 * Flush logs (useful for graceful shutdown)
 */
export async function flushLogs(): Promise<void> {
  return new Promise((resolve) => {
    baseLogger.flush(() => {
      resolve();
    });
  });
}

// Export raw pino instance for advanced usage
export { baseLogger as pino };
