#!/usr/bin/env bash
set -euo pipefail

# Seven Preflight Check
# Run before:
#   - Rebase my-c-code onto main
#   - Merging big CLAUDE branches
#   - Any heavy upstream sync work

REPO_ROOT="$(git rev-parse --show-toplevel 2>/dev/null || true)"

if [ -z "$REPO_ROOT" ]; then
  echo "[seven-preflight] Not inside a git repo. Abort."
  exit 1
fi

cd "$REPO_ROOT"

echo "[seven-preflight] Repo: $REPO_ROOT"

# 1) Check clean working tree
if [ -n "$(git status --porcelain)" ]; then
  echo "[seven-preflight] WARNING: Working tree is dirty."
  echo "  → Commit, stash, or reset before rebasing/merging."
  git status --short
  exit 2
fi
echo "[seven-preflight] Working tree clean."

# 2) Show current branch
BRANCH="$(git rev-parse --abbrev-ref HEAD)"
echo "[seven-preflight] Current branch: $BRANCH"

# 3) Ensure remotes exist
if ! git remote get-url upstream >/dev/null 2>&1; then
  echo "[seven-preflight] WARNING: No 'upstream' remote configured."
  echo "  → Configure Anthropic upstream before attempting upstream sync."
fi

if ! git remote get-url origin >/dev/null 2>&1; then
  echo "[seven-preflight] WARNING: No 'origin' remote configured."
fi

# 4) Fetch latest refs
echo "[seven-preflight] Fetching remotes..."
git fetch origin >/dev/null 2>&1 || true
git fetch upstream >/dev/null 2>&1 || true

# 5) Show branch tracking + divergence
echo "[seven-preflight] Status (short):"
git status -sb

# 6) If on main, show upstream relationship
if [ "$BRANCH" = "main" ]; then
  echo
  echo "[seven-preflight] On main. Checking upstream/main relationship..."
  git log --oneline --decorate --graph --max-count=5 main upstream/main || true
fi

# 7) If on my-c-code, show main & origin/my-c-code status
if [ "$BRANCH" = "my-c-code" ]; then
  echo
  echo "[seven-preflight] On my-c-code. Comparing to main and origin/my-c-code..."

  echo "  → my-c-code vs main (divergence):"
  git log --oneline --decorate --graph --left-right --cherry-pick my-c-code...main | head -20 || true

  echo
  echo "  → my-c-code vs origin/my-c-code (push/pull state):"
  git log --oneline --decorate --graph --left-right --cherry-pick my-c-code...origin/my-c-code | head -20 || true

  echo
  echo "[seven-preflight] RECOMMENDED next steps for upstream sync:"
  echo "  1) Ensure main is up to date:"
  echo "       git checkout main"
  echo "       git pull upstream main"
  echo "  2) Rebase Seven onto main from my-c-code:"
  echo "       git checkout my-c-code"
  echo "       git rebase -X theirs main"
fi

# 8) Verify Seven merge driver & attributes
echo
echo "[seven-preflight] Checking Seven merge driver:"
if git config merge.seven-ours.driver >/dev/null 2>&1; then
  echo "  → merge.seven-ours.driver = $(git config merge.seven-ours.driver)"
else
  echo "  WARNING: merge.seven-ours.driver not configured."
  echo "   → Run: git config merge.seven-ours.name 'Seven-protected — always keep our version'"
  echo "          git config merge.seven-ours.driver 'true'"
fi

echo
echo "[seven-preflight] Checking .gitattributes for Seven patterns:"
if grep -q "src/seven/**" .gitattributes 2>/dev/null; then
  echo "  → Seven patterns detected in .gitattributes."
else
  echo "  WARNING: No src/seven/** protection found in .gitattributes."
fi

echo
echo "[seven-preflight] Done."
