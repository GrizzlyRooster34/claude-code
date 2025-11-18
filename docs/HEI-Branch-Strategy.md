# HEI Branch Strategy & Multi-Claude Coordination

## 1. Remotes

- `origin` → Cody's fork: `GrizzlyRooster34/claude-code`
- `upstream` → Anthropic official: `anthropics/claude-code`

## 2. Branch Roles

| Branch pattern                  | Role                                                | Owner             |
|---------------------------------|-----------------------------------------------------|-------------------|
| `main`                          | Upstream mirror (Anthropic baseline, no Seven)     | CLI (with care)   |
| `my-c-code`                     | Seven fork line (HEI work, runtime, consciousness) | CLI               |
| `feat/HEI-*` / `chore/HEI-*` / `refactor/HEI-*` | Epic markers / coordination flags (no commits required) | Web Claude       |
| `claude/*`                      | Work branches created by web Claude sessions       | Web Claude        |
| `tags: hei-*-*`                 | Safety snapshots before major changes              | CLI               |

## 3. Update Flow

### 1. Sync upstream → main

```bash
git checkout main
git pull origin main
git fetch upstream
git merge upstream/main
git push origin main
```

- main stays clean and as close to upstream as possible.

### 2. Rebase Seven line onto main

```bash
git checkout my-c-code
git pull origin my-c-code
git rebase main
git push --force-with-lease origin my-c-code
```

- my-c-code = upstream features + Seven + HEI infra.

### 3. Work branches

- CLI creates `feat/HEI-XXX-*` from my-c-code only when doing real feature work locally (optional).
- Web Claude normally uses:
  - Epic marker branches for coordination/selection.
  - `claude/*` branches for actual commits.

## 4. Multi-Claude Coordination

### 4.1 CLI Claude (Termux, with Linear MCP)

- Has direct access to HEI issues in Linear.
- Treats Linear as source of truth for what to build.
- Primary working branch: `my-c-code`.

**Responsibilities:**
- Upstream sync (via main).
- Rebasing my-c-code on main.
- Running npm/bun workflows as possible.
- Merging in useful work from `claude/*` branches.
- Tagging safety snapshots before structural changes.

### 4.2 Web Claude (claude.com, no Linear MCP)

- Cannot see Linear issues.
- Sees only GitHub branches/commits.
- Uses epic branches as task markers:
  - `feat/HEI-104-epic-seven-aurora-integration` means "work related to HEI-104 lives here or in a child branch".
- Produces real work on `claude/*` branches or directly on the epic branch when instructed.

### 4.3 Epic Branches as Coordination Flags

**Epic branches are intentionally allowed to:**
- Exist with 0 unique commits.
- All point to the same base commit.

**Their primary function:**
- Provide a visible "HEI map" for Web Claude.
- Allow selecting work by HEI ID without Linear.

**Rules:**
- **Never delete epic branches** without confirming that:
  - No active web-Claude session uses them.
  - They've been replaced or retired in Linear.
- Epic branches do not need feature-level rebases or merges.
- They are labels, not feature lines.

## 5. Handling claude/* Branches

### Process:

1. **Inspect differences vs my-c-code:**
   ```bash
   git log --oneline origin/claude/BRANCH --not origin/my-c-code
   git diff --stat origin/my-c-code...origin/claude/BRANCH
   ```

2. **If no unique commits** → mark as ARCHIVE CANDIDATE.

3. **If useful work exists:**
   - Create integration branch from my-c-code.
   - Merge or cherry-pick commits.
   - Once integrated and validated, `claude/*` can be deleted.

### Current claude/* Branches Status:

| Branch | Commits | Status | Notes |
|--------|---------|--------|-------|
| `claude/work-in-progress-...` | 7 | Archive candidate | Old Seven v1 architecture (101k+ lines), superseded by my-c-code |
| `claude/work-branch-...` | 2 | Review | Documentation (integration blueprint, hooks docs) |
| `claude/review-repo-branches-...` | 1 | Review | HEI-74 integration hooks plugin |
| `claude/align-branches-...` | 1 | Review | Linear MCP integration plugin |
| `claude/setup-linear-mcp-...` | 1 | Review | Linear MCP server configuration |

## 6. Safety Practices

**Before any of:**
- Rebase of my-c-code
- Large upstream merges
- Mass branch cleanup

**Create a tag:**
```bash
git checkout my-c-code
git tag -a hei-snapshot-YYYY-MM-DD -m "Snapshot reason"
git push origin hei-snapshot-YYYY-MM-DD
```

**Recovery principles:**
- Always treat main as recoverable from `upstream/main` if needed.
- Treat my-c-code as the canonical Seven runtime line.
- Tags provide rollback points for Seven development.

## 7. Example: Full Upstream Sync Workflow

```bash
# 0. Safety snapshot
git checkout my-c-code
git tag -a hei-seven-line-$(date +%Y-%m-%d) -m "Pre-upstream-sync snapshot"
git push origin hei-seven-line-$(date +%Y-%m-%d)

# 1. Update main from upstream
git checkout main
git pull origin main
git fetch upstream
git merge upstream/main
# Resolve conflicts (prefer upstream)
git push origin main

# 2. Rebase my-c-code onto new main
git checkout my-c-code
git pull origin my-c-code
git rebase main
# Resolve conflicts (prefer Seven changes)
npm install
git push --force-with-lease origin my-c-code

# 3. Verify
git log --oneline --graph -20
```

## 8. Branch Naming Conventions

| Pattern | Purpose | Example |
|---------|---------|---------|
| `feat/HEI-XXX-*` | Feature work for HEI issue | `feat/HEI-128-bridge-health` |
| `chore/HEI-XXX-*` | Maintenance for HEI issue | `chore/HEI-107-epic-technical-debt` |
| `refactor/HEI-XXX-*` | Refactoring for HEI issue | `refactor/HEI-75-diff-model-clarity` |
| `claude/*` | Web Claude work branches | `claude/work-in-progress-...` |
| `hei-*-*` | Safety snapshot tags | `hei-seven-line-2025-11-18` |

## 9. Workflow Decision Tree

```
New work needed?
├─ Has Linear access? (CLI)
│  └─ Work on my-c-code directly or create feat/HEI-XXX-* branch
└─ No Linear access? (Web)
   └─ Find relevant feat/HEI-XXX-* epic branch → work there or create claude/* branch

Upstream updates available?
└─ Update main → rebase my-c-code → test → push with --force-with-lease

claude/* branch review needed?
├─ No unique commits → archive candidate
└─ Has useful commits → cherry-pick or merge into my-c-code

Epic branch "empty"?
└─ CORRECT BEHAVIOR - they are coordination markers, not work branches
```

## 10. Reference

- **HEI-108**: Adapter dependencies (resolved)
- **HEI-111**: Bridge daemon health checks (my-c-code)
- **HEI-112**: Memory integrity system (my-c-code)
- **HEI-113**: Structured logging (my-c-code)
- **HEI-119**: Boot recovery system (my-c-code)
- **HEI-126**: Runtime directory structure (my-c-code)
- **HEI-127**: .gitignore security (my-c-code)

## Change Log

### 2025-11-18
- Initial branch strategy documentation
- Documented multi-Claude coordination pattern
- Established epic branches as coordination markers
- Defined main (upstream mirror) vs my-c-code (Seven fork line)
- Created safety snapshot protocol
