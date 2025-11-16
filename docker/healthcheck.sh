#!/bin/bash
# Health check script for Seven Bridge Daemon (Docker)
# Exit 0 if healthy, non-zero if unhealthy

set -e

SOCKET="${SEVEN_SOCKET:-/tmp/seven-bridge.sock}"
TIMEOUT=5

# Check if socket file exists
if [ ! -S "$SOCKET" ]; then
  echo "ERROR: Socket not found: $SOCKET"
  exit 1
fi

# Send bridge.health request and parse response
response=$(echo '{"event":"bridge.health","id":"healthcheck"}' | \
  timeout $TIMEOUT nc -U "$SOCKET" -W 1 | head -n1)

if [ -z "$response" ]; then
  echo "ERROR: No response from bridge daemon"
  exit 1
fi

# Parse overall health status
overall=$(echo "$response" | grep -o '"overall":"[^"]*"' | cut -d'"' -f4)

case "$overall" in
  "healthy")
    echo "OK: Bridge daemon is healthy"
    exit 0
    ;;
  "degraded")
    echo "WARNING: Bridge daemon is degraded"
    # Still exit 0 - degraded is acceptable for health check
    exit 0
    ;;
  "unhealthy")
    echo "ERROR: Bridge daemon is unhealthy"
    echo "$response"
    exit 1
    ;;
  *)
    echo "ERROR: Invalid health status: $overall"
    echo "$response"
    exit 1
    ;;
esac
