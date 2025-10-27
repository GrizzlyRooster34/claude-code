#!/data/data/com.termux/files/usr/bin/sh
set -e

SOCKET=${SEVEN_SOCKET:-/data/data/com.termux/files/usr/tmp/seven_bridge.sock}
echo "== SevenBridge self-test =="

# 1) heartbeat
printf '%s\n' '{"event":"heartbeat"}' | nc -U "$SOCKET" | tee /tmp/seven_test_heartbeat.json

# 2) model get
printf '%s\n' '{"event":"model.get"}' | nc -U "$SOCKET" | tee /tmp/seven_test_model.json

# 3) routeTask (will call your router; gemini path may be stub if offline)
printf '%s\n' '{"event":"routeTask","data":{"prompt":"summarize plugin registry layout"}}' \
  | nc -U "$SOCKET" | tee /tmp/seven_test_route.json

echo "== OK (inspect /tmp/seven_test_*.json) =="
