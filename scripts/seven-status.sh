#!/data/data/com.termux/files/usr/bin/sh
STATE_DIR=${SEVEN_STATE_DIR:-$PREFIX/var/seven}
echo "=== SevenBridge Status ==="
echo "Socket: ${SEVEN_SOCKET:-$PREFIX/tmp/seven_bridge.sock}"
echo "--- Fuel ---"
cat $STATE_DIR/fuel.json 2>/dev/null || echo "No fuel.json yet"
echo "--- Model ---"
printf '%s\n' '{"event":"model.get"}' | nc -U "${SEVEN_SOCKET:-$PREFIX/tmp/seven_bridge.sock}" | jq .
echo "--- Memory ---"
ls -lh $STATE_DIR/memory.json 2>/dev/null || echo "No memory.json"
echo "--- Logs ---"
tail -n 20 $STATE_DIR/logs/current 2>/dev/null
