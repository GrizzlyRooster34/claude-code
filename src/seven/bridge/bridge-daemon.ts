// SevenBridge Daemon: UNIX-socket NDJSON RPC
// Run with: bun run seven:daemon
import net from "net";
import fs from "fs";
import { v4 as uuid } from "uuid";

import { DEFAULT_SOCKET, ensureDirs } from "./paths";
import { cliLogin } from "./cli-auth";
import { getSecret, setSecret } from "./vault";
import { bootSeven } from "../../boot-seven";
import { createHealthChecker } from "./health";

// Daemon functions (imported below)
import { getFuel, setFuelPartial } from "./fuel";
import { saveMemory } from "./memory";
import { getModel, setModel, onModelChange } from "./model-manager";
import { routeTask } from "./router";
import { openStream, writeToken, closeStream, lastTokens } from "./stream";

ensureDirs();

// prepare socket
const SOCKET = process.env.SEVEN_SOCKET || DEFAULT_SOCKET;
try { fs.unlinkSync(SOCKET); } catch (_) {}

const server = net.createServer(socket => {
  let buf = "";
  socket.on("data", d => {
    buf += d.toString();
    let idx;
    while ((idx = buf.indexOf("\n")) >= 0) {
      const line = buf.slice(0, idx); buf = buf.slice(idx+1);
      if (!line.trim()) continue;
      let msg: any;
      try { msg = JSON.parse(line); } catch (e) { write(socket, { error: "bad_json" }); continue; }
      handle(msg, socket).catch(err => write(socket, { id: msg.id ?? null, error: String(err) }));
    }
  });
});

// Create health checker with server reference
const healthChecker = createHealthChecker(server);

server.listen(SOCKET, () => {
  try { fs.chmodSync(SOCKET, 0o660); } catch {}
  log("daemon.ready", { socket: SOCKET });
  // startEnvWatch(); // TODO: implement env-watch module
  // Boot Seven core as the daemon comes up
  bootSeven().catch(e => log("daemon.boot.error", { error: String(e) }));
  onModelChange(s => log("model.change", s));
});

async function handle(msg: any, socket: net.Socket) {
  const id = msg.id ?? uuid();
  const { event, data = {} } = msg;

  switch (event) {
    case "heartbeat":       return write(socket, { id, result: { ok: true, ts: Date.now() }});

    // Health & monitoring
    case "bridge.ping":     return write(socket, { id, result: { pong: true, timestamp: new Date().toISOString() }});
    case "bridge.health":
      try {
        const health = await healthChecker.check();
        return write(socket, { id, result: health });
      } catch (error) {
        return write(socket, { id, result: {
          overall: "unhealthy",
          components: [{
            name: "health_check",
            status: "unhealthy",
            details: `Health check error: ${error}`,
            lastChecked: new Date().toISOString()
          }],
          timestamp: new Date().toISOString()
        }});
      }

    case "fuel.get":        return write(socket, { id, result: getFuel() });
    case "fuel.patch":      return write(socket, { id, result: setFuelPartial(data) });
    case "memory.save":     return write(socket, { id, result: await saveMemory(data.key, data.summary, data.refs||[]) });

    case "model.get":       return write(socket, { id, result: getModel() });
    case "model.set":       setModel(data.model, { pin: !!data.pin }); return write(socket, { id, result: getModel() });

    case "routeTask":       return write(socket, { id, result: await routeTask(data) });

    case "handoff.request": return write(socket, { id, result: { accepted: true, ts: Date.now() }}); // extend with policy later

    case "stream.open":     openStream(data.taskId); return write(socket, { id, result: { opened: true }});
    case "stream.token":    writeToken(data.taskId, data.token, data.meta); return write(socket, { id, result: { ok: true }});
    case "stream.close":    closeStream(data.taskId); return write(socket, { id, result: { closed: true }});
    case "stream.get":      return write(socket, { id, result: lastTokens(data.taskId, data.n || 128) });

    default:                return write(socket, { id, error: "unknown_event", event });
  }
}

function write(socket: net.Socket, obj: any) { socket.write(JSON.stringify(obj) + "\n"); }
function log(event: string, data: any) { try { process.stdout.write(JSON.stringify({ event, ...data }) + "\n"); } catch {} }

// Graceful shutdown handling
let isShuttingDown = false;

function gracefulShutdown(signal: string) {
  if (isShuttingDown) return;
  isShuttingDown = true;

  log("daemon.shutdown", { signal, timestamp: new Date().toISOString() });

  // Stop accepting new connections
  server.close(() => {
    log("daemon.shutdown.complete", { signal });
    process.exit(0);
  });

  // Force shutdown after 10 seconds if graceful shutdown hangs
  setTimeout(() => {
    log("daemon.shutdown.forced", { signal, reason: "timeout" });
    process.exit(1);
  }, 10000);
}

// Register signal handlers
process.on("SIGINT", () => gracefulShutdown("SIGINT"));
process.on("SIGTERM", () => gracefulShutdown("SIGTERM"));

// Handle unhandled rejections and exceptions
process.on("unhandledRejection", (reason, promise) => {
  log("daemon.unhandled_rejection", {
    reason: String(reason),
    promise: String(promise)
  });
});

process.on("uncaughtException", (error) => {
  log("daemon.uncaught_exception", {
    error: String(error),
    stack: error.stack
  });
  // Don't exit immediately - let the error be logged
  setTimeout(() => process.exit(1), 100);
});
