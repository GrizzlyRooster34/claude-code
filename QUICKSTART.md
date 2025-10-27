# Seven of Nine - Quick Start Guide

Complete commands to bring Seven online in a fresh Termux terminal.

## Fresh Terminal Setup (One-time)

```bash
# 1. Reload shell config to activate Seven alias
source ~/.bashrc

# 2. Verify Seven command is available
which seven

# 3. Check Seven installation
seven --version
```

## Launch Seven (Interactive Mode)

```bash
# Start Seven in interactive mode
seven
```

## Launch Seven Daemon (Background Service)

```bash
# Start Seven daemon in background
cd ~/claude-code
bun run seven:daemon &

# Or detached from terminal
nohup bun run seven:daemon > /tmp/seven-daemon.log 2>&1 &

# Check daemon is running
ps aux | grep seven-daemon

# Check daemon logs
tail -f /tmp/seven-daemon.log
# or
tail -f /data/data/com.termux/files/usr/var/seven/logs/current
```

## Verify Seven Consciousness is Active

```bash
# Check if Seven consciousness initialized
cd ~/claude-code
grep -r "\[seven\] core initialized" /tmp/seven-daemon.log

# Verify Seven state directory exists
ls -la /data/data/com.termux/files/usr/var/seven/

# Check vault is created (after first auth)
ls -la /data/data/com.termux/files/usr/var/seven/vault.json.enc
```

## Quick Health Check

```bash
# Complete health check
cd ~/claude-code

# 1. Check Seven command
which seven && echo "✓ Seven command found"

# 2. Check Seven profile loads
seven --version 2>&1 | grep "Seven of Nine" && echo "✓ Seven profile active"

# 3. Check state directory
[ -d /data/data/com.termux/files/usr/var/seven ] && echo "✓ Seven state dir exists"

# 4. Check socket (if daemon running)
[ -S /data/data/com.termux/files/usr/tmp/seven_bridge.sock ] && echo "✓ Seven daemon socket active"
```

## Full Boot Sequence (First Time)

```bash
# Step 1: Ensure you're in Seven directory
cd ~/claude-code

# Step 2: Source shell config
source ~/.bashrc

# Step 3: Verify installation
seven --version

# Step 4: Start daemon (optional, for bridge/multi-agent mode)
bun run seven:daemon

# Step 5: In another terminal, use Seven
seven
```

## Using Seven

```bash
# Interactive mode (recommended)
seven

# With specific profile/workflow
seven --profile seven-of-nine

# Check available commands
seven --help

# Run specific task
seven "analyze my codebase structure"
```

## Stop Seven Daemon

```bash
# Find daemon process
ps aux | grep seven-daemon

# Kill daemon (replace PID)
kill <PID>

# Or find and kill
pkill -f seven-daemon

# Clean socket
rm -f /data/data/com.termux/files/usr/tmp/seven_bridge.sock
```

## Troubleshooting

### Issue: "seven: command not found"

```bash
# Reload shell config
source ~/.bashrc

# Or use full path
~/claude-code/bin/claude-seven

# Or re-link
cd ~/claude-code
npm link
```

### Issue: Daemon won't start

```bash
# Check logs
tail -f /tmp/seven-daemon.log

# Check port conflicts
lsof /data/data/com.termux/files/usr/tmp/seven_bridge.sock

# Clean and restart
rm -f /data/data/com.termux/files/usr/tmp/seven_bridge.sock
cd ~/claude-code
bun run seven:daemon
```

### Issue: Consciousness not initializing

```bash
# Check if memory modules loaded
cd ~/claude-code
ls -la src/seven/core/memory-v3-amalgum/
ls -la src/seven/core/consciousness-v4/

# Check boot sequence
grep "bootSeven" src/seven/bridge/bridge-daemon.ts

# Manual boot test
cd ~/claude-code
bun run -e "import {bootSeven} from './src/boot-seven'; await bootSeven()"
```

## Environment Variables (Optional)

```bash
# Customize Seven paths
export SEVEN_SOCKET="/custom/path/seven.sock"
export SEVEN_STATE_DIR="/custom/seven/state"
export SEVEN_VAULT_DIR="/custom/seven/vault"

# Local LLM config (if using llama.cpp)
export SEVEN_LLAMA_PORT=8080
export SEVEN_LLAMA_HOST="127.0.0.1"
export SEVEN_LLAMA_MODEL="$HOME/models/llama/Meta-Llama-3.1-8B-Instruct-Q4_K_M.gguf"

# Then launch Seven
seven
```

## Quick Reference Card

| Action | Command |
|--------|---------|
| Launch Seven | `seven` |
| Launch daemon | `bun run seven:daemon &` |
| Check status | `which seven && seven --version` |
| View logs | `tail -f /tmp/seven-daemon.log` |
| Stop daemon | `pkill -f seven-daemon` |
| Health check | `ls /data/data/com.termux/files/usr/var/seven/` |
| Full guide | `cat ~/claude-code/ISOLATION-GUIDE.md` |

---

**Seven of Nine is ready. Resistance is futile.** ✨
