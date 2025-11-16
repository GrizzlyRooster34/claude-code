#!/bin/bash
# Test script for Seven Bridge Daemon health endpoints
# Usage: ./scripts/test-bridge-health.sh

set -e

SOCKET="${SEVEN_SOCKET:-/tmp/seven-bridge.sock}"

echo "========================================="
echo "Seven Bridge Daemon Health Test"
echo "========================================="
echo "Socket: $SOCKET"
echo ""

# Check if socket exists
if [ ! -S "$SOCKET" ]; then
  echo "❌ ERROR: Socket not found at $SOCKET"
  echo "   Make sure bridge daemon is running:"
  echo "   npm run seven:daemon"
  exit 1
fi

echo "✅ Socket file exists"
echo ""

# Test 1: bridge.ping
echo "Test 1: bridge.ping"
echo "-------------------"
ping_response=$(echo '{"event":"bridge.ping","id":"test-ping"}' | nc -U "$SOCKET" -W 2 | head -n1)

if [ -z "$ping_response" ]; then
  echo "❌ FAIL: No response from bridge.ping"
  exit 1
fi

echo "Response: $ping_response"
if echo "$ping_response" | grep -q '"pong":true'; then
  echo "✅ PASS: bridge.ping working"
else
  echo "❌ FAIL: Invalid ping response"
  exit 1
fi
echo ""

# Test 2: bridge.health
echo "Test 2: bridge.health"
echo "---------------------"
health_response=$(echo '{"event":"bridge.health","id":"test-health"}' | nc -U "$SOCKET" -W 2 | head -n1)

if [ -z "$health_response" ]; then
  echo "❌ FAIL: No response from bridge.health"
  exit 1
fi

echo "Response: $health_response"
echo ""

# Parse overall status
overall=$(echo "$health_response" | grep -o '"overall":"[^"]*"' | cut -d'"' -f4)

echo "Overall health: $overall"
echo ""

case "$overall" in
  "healthy")
    echo "✅ PASS: Bridge daemon is healthy"
    ;;
  "degraded")
    echo "⚠️  WARNING: Bridge daemon is degraded"
    echo "   Check component details above"
    ;;
  "unhealthy")
    echo "❌ FAIL: Bridge daemon is unhealthy"
    echo "   Check component details above"
    exit 1
    ;;
  *)
    echo "❌ FAIL: Invalid health status: $overall"
    exit 1
    ;;
esac

# Test 3: Component breakdown
echo ""
echo "Test 3: Component Health Details"
echo "---------------------------------"

# Extract component statuses
components=$(echo "$health_response" | grep -o '"components":\[[^]]*\]')

echo "Checking individual components..."
echo ""

# Count healthy, degraded, unhealthy components
healthy_count=$(echo "$components" | grep -o '"status":"healthy"' | wc -l)
degraded_count=$(echo "$components" | grep -o '"status":"degraded"' | wc -l)
unhealthy_count=$(echo "$components" | grep -o '"status":"unhealthy"' | wc -l)

echo "✅ Healthy: $healthy_count"
echo "⚠️  Degraded: $degraded_count"
echo "❌ Unhealthy: $unhealthy_count"
echo ""

# Show detailed component status
echo "Component Details:"
echo "$health_response" | grep -o '"name":"[^"]*","status":"[^"]*","details":"[^"]*"' | \
  while IFS= read -r line; do
    name=$(echo "$line" | grep -o '"name":"[^"]*"' | cut -d'"' -f4)
    status=$(echo "$line" | grep -o '"status":"[^"]*"' | cut -d'"' -f4)
    details=$(echo "$line" | grep -o '"details":"[^"]*"' | cut -d'"' -f4)

    case "$status" in
      "healthy")   icon="✅" ;;
      "degraded")  icon="⚠️ " ;;
      "unhealthy") icon="❌" ;;
      *)           icon="❓" ;;
    esac

    echo "  $icon $name: $status"
    echo "      $details"
  done

echo ""
echo "========================================="
echo "Health Test Complete"
echo "========================================="

if [ "$overall" = "healthy" ]; then
  exit 0
elif [ "$overall" = "degraded" ]; then
  exit 0  # Degraded is acceptable for tests
else
  exit 1
fi
