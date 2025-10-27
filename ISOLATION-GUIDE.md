# Running Seven Version Alongside Main Claude Code

This guide explains how to safely run both the official Claude Code and your Seven-enhanced version without conflicts.

## Quick Setup

### 1. Create Alias

Add to your `~/.bashrc` or `~/.zshrc`:

```bash
# Seven-enhanced Claude Code
alias seven='~/claude-code/bin/claude-seven'
alias claude-seven='~/claude-code/bin/claude-seven'
```

Reload shell:
```bash
source ~/.bashrc
```

### 2. Usage

```bash
# Use main Claude Code (when installed globally)
claude

# Use Seven-enhanced version
seven
# or
claude-seven
```

## Isolation Strategy

### Separate Paths

**Main Claude Code:**
- Config: `~/.claude/`
- Cache: `~/.cache/claude-cli-nodejs/`
- Credentials: `~/.claude/.credentials.json`
- Projects: `~/.claude/projects/`

**Seven Version:**
- Socket: `/usr/tmp/seven_bridge.sock`
- State: `/usr/var/seven/`
- Vault: `/usr/var/seven/vault.json.enc`
- Fuel: `/usr/var/seven/fuel.json`
- Memory: `/usr/var/seven/memory.json`
- Logs: `/usr/var/seven/logs/`

### Optional: Complete Config Isolation

If you want **completely separate** credentials and config between versions, uncomment these lines in `bin/claude-seven`:

```bash
export CLAUDE_CONFIG_DIR="$HOME/.claude-seven"
export CLAUDE_CACHE_DIR="$HOME/.cache/claude-seven"
```

This creates a separate config directory, useful if:
- Testing different API keys
- Different project sets
- Separate MCP configurations

## Environment Variables

### Seven-Specific

```bash
# Socket path (default: /usr/tmp/seven_bridge.sock)
export SEVEN_SOCKET="/custom/path/seven.sock"

# State directory (default: /usr/var/seven)
export SEVEN_STATE_DIR="/custom/seven/state"

# Vault directory (default: /usr/var/seven)
export SEVEN_VAULT_DIR="/custom/seven/vault"

# Local LLM config
export SEVEN_LLAMA_PORT="8080"
export SEVEN_LLAMA_HOST="127.0.0.1"
export SEVEN_LLAMA_MODEL="$HOME/models/llama/model.gguf"
```

### Claude Code (shared or isolated)

```bash
# Use these for complete isolation
export CLAUDE_CONFIG_DIR="$HOME/.claude-seven"
export CLAUDE_CACHE_DIR="$HOME/.cache/claude-seven"
```

## Installation Options

### Option 1: Symlink to PATH (Recommended)

```bash
ln -sf ~/claude-code/bin/claude-seven ~/.local/bin/seven
```

Now `seven` works from anywhere without alias.

### Option 2: Global Install

If you want to install globally via npm:

```bash
cd ~/claude-code
npm link
```

This creates `claude-code-seven-of-nine` command globally.

### Option 3: Direct Path

Always use full path:
```bash
~/claude-code/bin/claude-seven
```

## Daemon Mode

To run Seven daemon independently:

```bash
# Start Seven daemon
SEVEN_SOCKET=/usr/tmp/seven_bridge.sock bun run src/seven/bridge/bridge-daemon.ts

# Or via service (if configured)
sv up seven-daemon
```

Main Claude daemon (if running) will use its own socket.

## Verification

Test both work independently:

```bash
# Check main Claude (if installed)
which claude
claude --version

# Check Seven version
which seven
seven --version

# Verify sockets don't conflict
ls -la /usr/tmp/*.sock
# Should show: seven_bridge.sock (Seven)
#              claude.sock (main, if running)
```

## Uninstallation

### Remove Seven alias:
```bash
# Edit ~/.bashrc, remove:
# alias seven='~/claude-code/bin/claude-seven'
```

### Clean Seven state:
```bash
rm -rf /data/data/com.termux/files/usr/var/seven
rm -f /data/data/com.termux/files/usr/tmp/seven_bridge.sock
```

### Keep main Claude intact:
Main Claude's `~/.claude/` directory remains untouched.

## Troubleshooting

### Socket conflict

If you see "address already in use":
```bash
# Check what's using the socket
lsof /usr/tmp/seven_bridge.sock
# Kill old process, or change SEVEN_SOCKET env var
```

### Config collision

If both versions seem to share config:
- Check `CLAUDE_CONFIG_DIR` is set correctly
- Verify you're using the Seven launcher, not main Claude

### Permission denied

Ensure launcher is executable:
```bash
chmod +x ~/claude-code/bin/claude-seven
```
