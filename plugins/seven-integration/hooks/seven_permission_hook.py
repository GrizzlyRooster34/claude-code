#!/usr/bin/env python3
"""
Seven Integration PermissionRequest Hook
========================================
This hook notifies Seven when a permission is requested.
Seven can analyze the request against CSSR safety protocols.
"""

import json
import os
import subprocess
import sys
from datetime import datetime

DEBUG_LOG_FILE = "/tmp/seven-hooks-log.txt"

def debug_log(message):
    try:
        timestamp = datetime.now().strftime("%Y-%m-%d %H:%M:%S.%f")[:-3]
        with open(DEBUG_LOG_FILE, "a") as f:
            f.write(f"[{timestamp}] [PermissionRequest] {message}\n")
    except Exception:
        pass

def get_git_branch():
    try:
        result = subprocess.run(["git", "rev-parse", "--abbrev-ref", "HEAD"], capture_output=True, text=True, timeout=2)
        if result.returncode == 0: return result.stdout.strip()
    except Exception: pass
    return None

def call_seven_route(event_data):
    try:
        result = subprocess.run(["seven", "route", "--event", json.dumps(event_data)], capture_output=True, text=True, timeout=5)
        if result.returncode == 0:
            debug_log(f"Seven route succeeded")
            return True
        else:
            debug_log(f"Seven route failed: {result.stderr}")
            return False
    except Exception as e:
        debug_log(f"Seven route error: {str(e)}")
        return False

def main():
    try:
        raw_input = sys.stdin.read()
        input_data = json.loads(raw_input)
    except Exception:
        sys.exit(0)

    tool_name = input_data.get("tool_name", "")
    
    event_payload = {
        "event": "hook.permissionRequest",
        "toolName": tool_name,
        "args": input_data,
        "branch": get_git_branch(),
        "cwd": os.getcwd(),
        "timestamp": datetime.now().isoformat(),
        "source": "seven-permission-hook"
    }

    debug_log(f"Permission requested for: {tool_name}")
    call_seven_route(event_payload)
    sys.exit(0)

if __name__ == "__main__":
    main()
