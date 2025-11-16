// Health Check System for Seven Bridge Daemon
// Monitors socket, adapters, memory, vault, and runtime config

import fs from "fs";
import net from "net";
import { getModel } from "./model-manager";
import { DEFAULT_SOCKET } from "./paths";

export type HealthStatus = "healthy" | "degraded" | "unhealthy";

export interface ComponentHealth {
  name: string;
  status: HealthStatus;
  details?: string;
  lastChecked: string; // ISO timestamp
}

export interface BridgeHealthReport {
  overall: HealthStatus;
  components: ComponentHealth[];
  timestamp: string;
}

export interface HealthChecker {
  check(): Promise<BridgeHealthReport>;
}

/**
 * Aggregates component health into overall status.
 * If any component is "unhealthy" → overall = "unhealthy"
 * Else if any component is "degraded" → overall = "degraded"
 * Else → "healthy"
 */
function aggregateHealth(components: ComponentHealth[]): HealthStatus {
  if (components.some(c => c.status === "unhealthy")) return "unhealthy";
  if (components.some(c => c.status === "degraded")) return "degraded";
  return "healthy";
}

/**
 * Default health checker implementation for Seven Bridge Daemon.
 * Checks:
 * - Socket accessibility
 * - LLM adapter configuration
 * - Memory system (state directory)
 * - Runtime configuration (essential paths)
 */
export class BridgeHealthChecker implements HealthChecker {
  private socket: net.Server | null = null;

  constructor(socket?: net.Server) {
    this.socket = socket || null;
  }

  async check(): Promise<BridgeHealthReport> {
    const timestamp = new Date().toISOString();
    const components: ComponentHealth[] = [];

    // Check 1: Socket health
    components.push(await this.checkSocket());

    // Check 2: Adapter health
    components.push(await this.checkAdapters());

    // Check 3: Memory/state directory
    components.push(await this.checkMemorySystem());

    // Check 4: Runtime config
    components.push(await this.checkRuntimeConfig());

    const overall = aggregateHealth(components);

    return {
      overall,
      components,
      timestamp
    };
  }

  private async checkSocket(): Promise<ComponentHealth> {
    const name = "socket";
    const lastChecked = new Date().toISOString();

    try {
      const socketPath = process.env.SEVEN_SOCKET || DEFAULT_SOCKET;

      // Check if socket file exists
      if (!fs.existsSync(socketPath)) {
        return {
          name,
          status: "unhealthy",
          details: `Socket file not found: ${socketPath}`,
          lastChecked
        };
      }

      // Check if socket is listening
      if (this.socket && this.socket.listening) {
        return {
          name,
          status: "healthy",
          details: `Socket listening on ${socketPath}`,
          lastChecked
        };
      } else {
        return {
          name,
          status: "degraded",
          details: "Socket exists but may not be listening",
          lastChecked
        };
      }
    } catch (error) {
      return {
        name,
        status: "unhealthy",
        details: `Socket check failed: ${error}`,
        lastChecked
      };
    }
  }

  private async checkAdapters(): Promise<ComponentHealth> {
    const name = "adapters";
    const lastChecked = new Date().toISOString();

    try {
      const currentModel = getModel();

      if (!currentModel || !currentModel.model) {
        return {
          name,
          status: "degraded",
          details: "No model configured, but adapters may be available",
          lastChecked
        };
      }

      // Model is configured - adapters are presumed functional
      return {
        name,
        status: "healthy",
        details: `Model configured: ${currentModel.model}`,
        lastChecked
      };
    } catch (error) {
      return {
        name,
        status: "unhealthy",
        details: `Adapter check failed: ${error}`,
        lastChecked
      };
    }
  }

  private async checkMemorySystem(): Promise<ComponentHealth> {
    const name = "memory_system";
    const lastChecked = new Date().toISOString();

    try {
      // Check state directory
      const stateDir = process.env.PREFIX
        ? `${process.env.PREFIX}/var/seven/state`
        : "/usr/var/seven/state";

      if (!fs.existsSync(stateDir)) {
        return {
          name,
          status: "unhealthy",
          details: `State directory not found: ${stateDir}`,
          lastChecked
        };
      }

      // Check if directory is writable
      try {
        const testFile = `${stateDir}/.health_check`;
        fs.writeFileSync(testFile, "health_check");
        fs.unlinkSync(testFile);

        return {
          name,
          status: "healthy",
          details: `State directory accessible: ${stateDir}`,
          lastChecked
        };
      } catch (writeError) {
        return {
          name,
          status: "degraded",
          details: `State directory exists but not writable: ${stateDir}`,
          lastChecked
        };
      }
    } catch (error) {
      return {
        name,
        status: "unhealthy",
        details: `Memory system check failed: ${error}`,
        lastChecked
      };
    }
  }

  private async checkRuntimeConfig(): Promise<ComponentHealth> {
    const name = "runtime_config";
    const lastChecked = new Date().toISOString();

    try {
      const issues: string[] = [];

      // Check essential paths
      const socketPath = process.env.SEVEN_SOCKET || DEFAULT_SOCKET;
      const socketDir = socketPath.substring(0, socketPath.lastIndexOf("/"));

      if (!fs.existsSync(socketDir)) {
        issues.push(`Socket directory missing: ${socketDir}`);
      }

      // Check PREFIX (important for Termux)
      if (!process.env.PREFIX) {
        issues.push("PREFIX environment variable not set");
      }

      if (issues.length > 0) {
        return {
          name,
          status: "degraded",
          details: issues.join("; "),
          lastChecked
        };
      }

      return {
        name,
        status: "healthy",
        details: "Runtime configuration valid",
        lastChecked
      };
    } catch (error) {
      return {
        name,
        status: "unhealthy",
        details: `Runtime config check failed: ${error}`,
        lastChecked
      };
    }
  }
}

/**
 * Create a health checker instance.
 * @param socket Optional server socket for more accurate health checks
 */
export function createHealthChecker(socket?: net.Server): HealthChecker {
  return new BridgeHealthChecker(socket);
}
