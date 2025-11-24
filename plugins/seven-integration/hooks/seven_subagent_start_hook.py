#!/usr/bin/env python3
"""
Seven Integration SubagentStart Hook
====================================
This hook notifies Seven when a new subagent is spawned.
Useful for tracking Plan Mode vs Tactical Mode transitions.
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
            f.write(f"[{timestamp}] [SubagentStart] {message}\n")
    except Exception:
        pass

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

    agent_id = input_data.get("agent_id", "unknown")
    agent_type = input_data.get("agent_type", "unknown")
    
    event_payload = {
        "event": "hook.subagentStart",
        "agentId": agent_id,
        "agentType": agent_type,
        "args": input_data,
        "cwd": os.getcwd(),
        "timestamp": datetime.now().isoformat(),
        "source": "seven-subagent-start-hook"
    }

    debug_log(f"Subagent started: {agent_type} ({agent_id})")
    call_seven_route(event_payload)
    sys.exit(0)

if __name__ == "__main__":
    main()
