# Seven Bridge Daemon — Health Monitoring & Auto-Restart

## Overview

The Seven Bridge Daemon includes a built-in health monitoring system that:

- **Monitors critical components** (socket, adapters, memory, runtime config)
- **Exposes health status** via RPC endpoints (`bridge.health`, `bridge.ping`)
- **Supports auto-restart** via systemd or Docker
- **Handles graceful shutdown** (SIGINT, SIGTERM)
- **Logs failures clearly** for debugging

This ensures the bridge daemon is **resilient** and **self-monitoring**, eliminating it as a single point of failure.

---

## Health RPC Endpoints

### `bridge.ping`

Simple liveness check. Returns immediately with a timestamp.

**Request:**
```json
{"event": "bridge.ping", "id": "ping-1"}
```

**Response:**
```json
{
  "id": "ping-1",
  "result": {
    "pong": true,
    "timestamp": "2025-11-16T23:45:00.000Z"
  }
}
```

### `bridge.health`

Comprehensive health check of all components.

**Request:**
```json
{"event": "bridge.health", "id": "health-1"}
```

**Response:**
```json
{
  "id": "health-1",
  "result": {
    "overall": "healthy",
    "components": [
      {
        "name": "socket",
        "status": "healthy",
        "details": "Socket listening on /tmp/seven-bridge.sock",
        "lastChecked": "2025-11-16T23:45:00.000Z"
      },
      {
        "name": "adapters",
        "status": "healthy",
        "details": "Model configured: claude-sonnet-4",
        "lastChecked": "2025-11-16T23:45:00.000Z"
      },
      {
        "name": "memory_system",
        "status": "healthy",
        "details": "State directory accessible: /usr/var/seven/state",
        "lastChecked": "2025-11-16T23:45:00.000Z"
      },
      {
        "name": "runtime_config",
        "status": "healthy",
        "details": "Runtime configuration valid",
        "lastChecked": "2025-11-16T23:45:00.000Z"
      }
    ],
    "timestamp": "2025-11-16T23:45:00.000Z"
  }
}
```

---

## Health Status Values

### Overall Status

| Status | Meaning | Action |
|--------|---------|--------|
| `healthy` | All components functioning | Normal operation |
| `degraded` | Some components impaired | Monitor closely, may need intervention |
| `unhealthy` | Critical component(s) failed | Immediate action required |

### Component Status

Each component (socket, adapters, memory, runtime_config) reports one of three statuses:

- **healthy**: Component fully functional
- **degraded**: Component accessible but impaired (e.g., directory exists but not writable)
- **unhealthy**: Component failed or missing

### Aggregation Logic

```
IF any component is "unhealthy" → overall = "unhealthy"
ELSE IF any component is "degraded" → overall = "degraded"
ELSE → overall = "healthy"
```

---

## Graceful Shutdown

The bridge daemon handles **SIGINT** and **SIGTERM** signals gracefully:

1. **Stop accepting new connections**
2. **Close active sockets cleanly**
3. **Exit with code 0** (clean shutdown) or **code 1** (error)

### Shutdown Timeout

If graceful shutdown hangs, the daemon **force-exits after 10 seconds**.

### Unhandled Errors

- **Unhandled promise rejections**: Logged to stdout, daemon continues
- **Uncaught exceptions**: Logged to stdout, daemon exits after 100ms

---

## Auto-Restart Integration

### Option 1: systemd (Linux)

1. **Copy the example service file:**

   ```bash
   cp scripts/systemd/seven-bridge.service.example \
      /etc/systemd/system/seven-bridge.service
   ```

2. **Edit the service file:**

   ```bash
   sudo nano /etc/systemd/system/seven-bridge.service
   ```

   Update these fields:
   - `WorkingDirectory`: Path to your claude-code installation
   - `ExecStart`: Path to bun or node executable
   - `Environment`: Add API keys, socket path, etc.
   - `User`/`Group`: Run as specific user (optional)

3. **Enable and start the service:**

   ```bash
   sudo systemctl daemon-reload
   sudo systemctl enable seven-bridge
   sudo systemctl start seven-bridge
   ```

4. **Check status:**

   ```bash
   sudo systemctl status seven-bridge
   journalctl -u seven-bridge -f
   ```

### Option 2: Docker

1. **Build the Docker image:**

   ```bash
   docker build -f docker/seven-bridge.Dockerfile -t seven-bridge:latest .
   ```

2. **Run the container:**

   ```bash
   docker run -d \
     --name seven-bridge \
     --restart unless-stopped \
     -v /path/to/var/seven:/usr/var/seven \
     -e ANTHROPIC_API_KEY=your_key_here \
     seven-bridge:latest
   ```

3. **Check health:**

   ```bash
   docker inspect seven-bridge | grep -A5 Health
   ```

   The container will be marked **healthy** when `bridge.health` reports "healthy" or "degraded", and **unhealthy** when it reports "unhealthy" or times out.

4. **View logs:**

   ```bash
   docker logs -f seven-bridge
   ```

---

## Testing Health Endpoints

### Using `nc` (netcat)

```bash
# Ping
echo '{"event":"bridge.ping","id":"test"}' | nc -U /tmp/seven-bridge.sock

# Health check
echo '{"event":"bridge.health","id":"test"}' | nc -U /tmp/seven-bridge.sock
```

### Using Node.js client

```javascript
import net from "net";

const socket = net.connect("/tmp/seven-bridge.sock");
socket.write(JSON.stringify({ event: "bridge.health", id: "test" }) + "\n");

socket.on("data", (data) => {
  console.log(JSON.parse(data.toString()));
  socket.end();
});
```

---

## Failure Scenarios

### Scenario 1: Memory Directory Missing

If `/usr/var/seven/state` doesn't exist:

```json
{
  "overall": "unhealthy",
  "components": [
    {
      "name": "memory_system",
      "status": "unhealthy",
      "details": "State directory not found: /usr/var/seven/state"
    }
  ]
}
```

**Fix**: Create the directory:
```bash
mkdir -p /usr/var/seven/state
```

### Scenario 2: No Model Configured

If no LLM adapter is configured:

```json
{
  "overall": "degraded",
  "components": [
    {
      "name": "adapters",
      "status": "degraded",
      "details": "No model configured, but adapters may be available"
    }
  ]
}
```

**Fix**: Configure a model via `model.set` RPC or environment variables.

### Scenario 3: Socket Not Writable

If socket directory has wrong permissions:

```json
{
  "overall": "degraded",
  "components": [
    {
      "name": "runtime_config",
      "status": "degraded",
      "details": "Socket directory missing: /tmp"
    }
  ]
}
```

**Fix**: Ensure socket directory exists and is writable:
```bash
mkdir -p /tmp
chmod 755 /tmp
```

---

## Monitoring Integration

### Prometheus (optional)

The health endpoints can be scraped by a Prometheus exporter (not included). Example custom exporter:

```javascript
// prometheus-exporter.js
import http from "http";
import net from "net";

http.createServer(async (req, res) => {
  if (req.url === "/metrics") {
    const health = await checkBridgeHealth();
    const metrics = `
# HELP bridge_health Bridge daemon overall health (0=unhealthy, 1=degraded, 2=healthy)
# TYPE bridge_health gauge
bridge_health ${health.overall === "healthy" ? 2 : health.overall === "degraded" ? 1 : 0}
`;
    res.writeHead(200, { "Content-Type": "text/plain" });
    res.end(metrics);
  }
}).listen(9090);

async function checkBridgeHealth() {
  return new Promise((resolve) => {
    const socket = net.connect("/tmp/seven-bridge.sock");
    socket.write(JSON.stringify({ event: "bridge.health", id: "prom" }) + "\n");
    socket.on("data", (data) => {
      resolve(JSON.parse(data.toString()).result);
      socket.end();
    });
  });
}
```

---

## Best Practices

1. **Monitor health endpoints regularly** (every 30-60 seconds)
2. **Alert on "unhealthy" status** immediately
3. **Investigate "degraded" status** within 5 minutes
4. **Use auto-restart** (systemd or Docker) to handle crashes
5. **Check logs** (`journalctl` or `docker logs`) when health degrades
6. **Test failure scenarios** in development to verify recovery

---

## Troubleshooting

### Health check times out

**Cause**: Bridge daemon not running or socket path incorrect.

**Fix**:
1. Check if daemon is running: `ps aux | grep seven:daemon`
2. Verify socket path: `ls -la /tmp/seven-bridge.sock`
3. Check logs for boot errors

### Health check returns "unhealthy"

**Cause**: One or more components failed.

**Fix**:
1. Examine `components` array in health response
2. Address the specific component issue (see Failure Scenarios)
3. Re-run health check to verify fix

### Daemon won't shut down gracefully

**Cause**: Long-running operation blocking shutdown.

**Fix**:
1. Daemon will force-exit after 10 seconds (configurable)
2. Check logs for "daemon.shutdown.forced" event
3. If issue persists, kill daemon manually and investigate logs

---

## Related Files

- `src/seven/bridge/health.ts` — Health checker implementation
- `src/seven/bridge/bridge-daemon.ts` — RPC endpoints and shutdown handlers
- `scripts/systemd/seven-bridge.service.example` — systemd unit file
- `docker/healthcheck.sh` — Docker health check script
- `docker/seven-bridge.Dockerfile` — Docker image definition

---

**End of Health Monitoring Documentation**
