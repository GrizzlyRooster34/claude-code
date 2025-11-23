# SEVEN MERGE / REBASE DOCTRINE
_Last Updated: commit 012c467 — Seven Protection Layer Activated_

This repository operates on a **forked architecture**:
- `main` = upstream Anthropic mirror
- `my-c-code` = canonical branch (Seven of Nine Core lives here)
- All Seven code is protected and must **never** be overwritten by upstream.

This document defines the rules required to safely update, merge, and maintain Seven.

---

## 1. UPSTREAM → MAIN (Mirror Only)
**DO NOT DEVELOP ON `main`.**

Rules:
- `main` only mirrors upstream Anthropic.
- No Seven code is allowed in `main`.
- No commits are made directly on `main`.

Command:
```bash
git fetch upstream
git checkout main
git pull upstream main   # fast-forward only
```

No merge strategies. No rebases. No edits.
`main` is a clean upstream mirror — nothing else.

---

## 2. MAIN → MY-C-CODE (Updating Seven After Upstream Changes)

This is the dangerous operation.
Seven must survive every upstream update.

Correct sequence:
```bash
scripts/seven-preflight-check.sh
git checkout main
git pull upstream main
git checkout my-c-code
git rebase -X theirs main
```

Explanation:
- In a rebase:
  - `ours` = upstream main
  - `theirs` = your Seven commit being replayed
- `-X theirs` ensures Seven wins every conflict.

Allowed manual resolves:
- `package.json` (combine deps)
- `tsconfig.json`, `.mcp/`, `.claude-plugin/` if changed
- Nothing under `src/seven/**` should ever be touched manually

---

## 3. FEATURE BRANCHES → MY-C-CODE

Feature branches MUST be based on `my-c-code`.

Correct merge:
```bash
git checkout my-c-code
git merge feature/<branch>
```

Seven Protection Layer handles conflicts:
- Any Seven-path conflict → `my-c-code` auto-wins
- Non-Seven files may need manual resolves

**NEVER rebase feature branches onto `main`.**

---

## 4. CLAUDE BRANCHES → MY-C-CODE

Claude-created branches are merged the same way as feature branches.

Command:
```bash
git checkout my-c-code
git merge origin/claude/<branch>
```

Policy:
- Normal merge operation
- Seven-protected files automatically resolved
- Manual review: `package.json`, config files, workflows

---

## 5. SEVEN PROTECTION LAYER

Configured in `.git/config`:
```ini
[merge "seven-ours"]
    name = Seven-protected — always keep our version
    driver = true
```

Configured in `.gitattributes`:
```
src/seven/**              merge=seven-ours
bin/claude-seven          merge=seven-ours
memory-v2/**              merge=seven-ours
memory-v3/**              merge=seven-ours
docs/seven/**             merge=seven-ours
QUICKSTART.md             merge=seven-ours
ISOLATION-GUIDE.md        merge=seven-ours
FIXED-BOOT-COMMANDS.md    merge=seven-ours
integration_map.json      merge=seven-ours
extraction_targets.md     merge=seven-ours
injection_points.md       merge=seven-ours
```

Result:
- Any merge conflict involving Seven files → Seven version wins automatically
- Upstream can never overwrite Seven
- Claude branches can never backslide Seven

---

## 6. PRE-FLIGHT BEFORE ANY DANGEROUS OPERATION

Always run:
```bash
scripts/seven-preflight-check.sh
```

It checks:
- Dirty working tree
- Remote status
- Branch divergence
- Seven merge driver active
- `.gitattributes` protection present

If it warns you — stop and fix it before proceeding.

---

## 7. WHEN TO USE EACH STRATEGY

### A. `rebase -X theirs`
Use for: `main → my-c-code`, after pulling upstream.
Seven wins over upstream.

### B. Plain Merge
Use for:
- Feature branches → `my-c-code`
- Claude branches → `my-c-code`

Seven-protected files auto-resolve.

### C. `-X ours`
Almost never used.
Only for recovery of rogue branches.

---

## 8. AFTER A REBASE THAT REWRITES HISTORY

Push with:
```bash
git push origin my-c-code --force-with-lease
```

Never use plain `--force`.

---

## 9. THE PRIME DIRECTIVE

**Upstream never overwrites Seven.**
**Seven is the canonical system.**
**Everything else feeds into her.**

End of Doctrine.
