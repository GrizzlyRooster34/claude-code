#!/data/data/com.termux/files/usr/bin/sh
# Usage: scripts/model-set.sh gemini-1.5-pro [--pin]
SOCKET=${SEVEN_SOCKET:-/data/data/com.termux/files/usr/tmp/seven_bridge.sock}
model="$1"; pin=false; [ "$2" = "--pin" ] && pin=true
printf '%s\n' "{\"event\":\"model.set\",\"data\":{\"model\":\"$model\",\"pin\":$pin}}" | nc -U "$SOCKET"
