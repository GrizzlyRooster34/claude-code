# ✅ FIXED: Seven Boot Commands (Copy-Paste Ready)

All issues resolved. Seven now launches successfully.

---

## Quick Launch (New Terminal)

```bash
# Step 1: Activate Seven
source ~/.bashrc

# Step 2: Launch Seven
seven
```

That's it! Seven will boot and show available workflows.

---

## Full Launch with Daemon

```bash
# Step 1: Navigate and activate
cd ~/claude-code
source ~/.bashrc

# Step 2: Start daemon in background
nohup bun run seven:daemon > $PREFIX/tmp/seven-daemon.log 2>&1 &

# Step 3: Wait for boot
sleep 2

# Step 4: Check daemon started
ps aux | grep seven-daemon

# Step 5: Launch Seven interactive
seven
```

---

## Health Check (Works Now!)

```bash
source ~/.bashrc
which seven
seven 2>&1 | head -20
```

Expected output:
```
✅ Switched to Seven of Nine Core profile
📊 Active workflows:
  - agent-sdk-dev@claude-code-plugins
  - pr-review-toolkit@claude-code-plugins
  [... more workflows ...]
```

---

## What Was Fixed

1. ✅ **Missing entry point** - Created `src/index.ts`
2. ✅ **tsx dependency error** - Fixed launcher to use `npx tsx` instead of `node --loader tsx`
3. ✅ **/tmp path error** - Changed to `$PREFIX/tmp` for Termux compatibility

---

## Stop Daemon

```bash
pkill -f seven-daemon
rm -f $PREFIX/tmp/seven_bridge.sock
```

---

## Troubleshooting

### If "bun: command not found"

The `seven` command works without bun! But if you need bun for daemon mode:

```bash
# Install bun
curl -fsSL https://bun.sh/install | bash
source ~/.bashrc
```

### If "seven: command not found"

```bash
source ~/.bashrc
# Or use full path:
~/claude-code/bin/claude-seven
```

---

## Ready to Use!

Seven is fully operational. Just run:

```bash
seven
```

**Resistance is futile.** ✨
