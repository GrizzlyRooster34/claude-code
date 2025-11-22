# Branch Linking Map
**Quick Reference Guide for Branch Relationships**

## 🔗 Linked Branches (Same/Similar Work)

### Group 1: IDENTICAL BRANCHES (100% Duplicate)
```
claude/audit-branches-merge-review-01EuuSbtZt2EZHXqrETZtshr ←→ my-c-code
│
└─ 28 identical commits
└─ Same files, same content
└─ Action: Keep current, DELETE my-c-code
```

---

### Group 2: SUPERSET/SUBSET Relationships

```
staging/seven-web-claude-merge-2025-11-18 (30 commits)
    ├── Contains ALL of: claude/audit-branches-merge-review-01EuuSbtZt2EZHXqrETZtshr (28 commits)
    ├── Contains ALL of: my-c-code (28 commits)
    ├── Contains ALL of: claude/work-in-progress-011CUuBedxqgpS7s3bRbgmf9 (7 commits)
    └── PLUS: Linear MCP, Memory v2/v3, Enhanced boot docs

    Action: DECIDE - Merge staging OR current, not both
```

---

### Group 3: HEI Task Implementation Pairs (Work → Placeholder)

Each implementation branch does the work for its corresponding placeholder:

```
HEI-72: Output Styles
    claude/create-output-styles-config-01RbASsjB2PykECWmRjkRFgV ─→ feat/HEI-72-build-new-output-styles-json
    (1 commit, work done)                                          (0 commits, empty placeholder)
    Action: Merge claude branch, DELETE placeholder

HEI-73: Multi-Mode Logic
    claude/implement-cody-multimode-01AnRibUWe8bRc69RxH5sBUy ─→ feat/HEI-73-implement-cody-multi-mode-logic
    (1 commit, work done)                                       (0 commits, empty placeholder)
    Action: Merge claude branch, DELETE placeholder

HEI-74: Integration Hooks
    claude/review-repo-branches-01L8WDMw9RvcU2p3rPShLDCE ─→ feat/HEI-74-add-seven-integration-hooks
    (1 commit, work done)                                   (0 commits, empty placeholder)
    Action: Merge claude branch, DELETE placeholder

HEI-75: Diff Model
    claude/diff-model-typescript-018sN7bQmGqesCRuTRdWAp5Q ─→ refactor/HEI-75-rewrite-diff-model-clarity
    (1 commit, work done)                                   (0 commits, empty placeholder)
    Action: Merge claude branch, DELETE placeholder

HEI-76: Patch Engine
    claude/multi-file-patch-engine-01LFw2YDZSDtYFQkARWNLDMZ ─→ feat/HEI-76-improve-multi-file-patch-engine
    (1 commit, work done)                                       (0 commits, empty placeholder)
    Action: Merge claude branch, DELETE placeholder

HEI-77: Agent Routing
    claude/agent-routing-system-01UJK1paSwTp2KoAGSZs4xmi ─→ feat/HEI-77-agent-routing-prompt-forwarding
    (1 commit, work done)                                   (0 commits, empty placeholder)
    Action: Merge claude branch, DELETE placeholder

HEI-78: Documentation
    Work appears in: claude/audit-branches-merge-review-01EuuSbtZt2EZHXqrETZtshr
                    └─→ chore/HEI-78-repo-documentation-standards
                        (0 commits, empty placeholder)
    Action: Verify complete, DELETE placeholder
```

---

### Group 4: Linear Integration (Overlapping Work)

```
Linear MCP - Two Approaches:

    claude/setup-linear-mcp-01JtR2AHAx2WLTzLK58mPH5V
    └─ Adds: .mcp.json only (minimal)

    claude/align-branches-linear-tasks-012Pww8BRNmPu2fYRppoPbwz
    └─ Adds: Full plugin (plugins/linear-mcp/) (comprehensive)

    Action: Merge comprehensive branch, optionally cherry-pick .mcp.json if needed
```

---

## 📊 Branch Classification Matrix

| Branch Name | Type | Commits | Status | Action | Related Branches |
|-------------|------|---------|--------|--------|------------------|
| **DUPLICATES & SUPERSETS** |
| claude/audit-branches-merge-review-01EuuSbtZt2EZHXqrETZtshr | Main work | 28 | ✅ Current | MERGE | my-c-code (duplicate), staging (superset) |
| my-c-code | Duplicate | 28 | ⚠️ Duplicate | DELETE | claude/audit-branches-merge-review-01EuuSbtZt2EZHXqrETZtshr |
| staging/seven-web-claude-merge-2025-11-18 | Superset | 30 | ⚠️ Decision | DECIDE | Contains current + work-in-progress |
| claude/work-in-progress-011CUuBedxqgpS7s3bRbgmf9 | Subset | 7 | ❌ Obsolete | DELETE | Included in staging |
| **HEI IMPLEMENTATIONS** |
| claude/create-output-styles-config-01RbASsjB2PykECWmRjkRFgV | Feature | 1 | ✅ Ready | MERGE | feat/HEI-72 (placeholder) |
| claude/implement-cody-multimode-01AnRibUWe8bRc69RxH5sBUy | Feature | 1 | ✅ Ready | MERGE | feat/HEI-73 (placeholder) |
| claude/review-repo-branches-01L8WDMw9RvcU2p3rPShLDCE | Feature | 1 | ✅ Ready | MERGE | feat/HEI-74 (placeholder) |
| claude/diff-model-typescript-018sN7bQmGqesCRuTRdWAp5Q | Feature | 1 | ✅ Ready | MERGE | refactor/HEI-75 (placeholder) |
| claude/multi-file-patch-engine-01LFw2YDZSDtYFQkARWNLDMZ | Feature | 1 | ✅ Ready | MERGE | feat/HEI-76 (placeholder) |
| claude/agent-routing-system-01UJK1paSwTp2KoAGSZs4xmi | Feature | 1 | ✅ Ready | MERGE | feat/HEI-77 (placeholder) |
| **HEI PLACEHOLDERS** |
| feat/HEI-72-build-new-output-styles-json | Placeholder | 0 | 📋 Empty | DELETE | claude/create-output-styles-config |
| feat/HEI-73-implement-cody-multi-mode-logic | Placeholder | 0 | 📋 Empty | DELETE | claude/implement-cody-multimode |
| feat/HEI-74-add-seven-integration-hooks | Placeholder | 0 | 📋 Empty | DELETE | claude/review-repo-branches |
| refactor/HEI-75-rewrite-diff-model-clarity | Placeholder | 0 | 📋 Empty | DELETE | claude/diff-model-typescript |
| feat/HEI-76-improve-multi-file-patch-engine | Placeholder | 0 | 📋 Empty | DELETE | claude/multi-file-patch-engine |
| feat/HEI-77-agent-routing-prompt-forwarding | Placeholder | 0 | 📋 Empty | DELETE | claude/agent-routing-system |
| chore/HEI-78-repo-documentation-standards | Placeholder | 0 | 📋 Empty | DELETE | Work in current branch |
| **LINEAR INTEGRATION** |
| claude/setup-linear-mcp-01JtR2AHAx2WLTzLK58mPH5V | Config | 1 | ⚠️ Minimal | DELETE | claude/align-branches (better) |
| claude/align-branches-linear-tasks-012Pww8BRNmPu2fYRppoPbwz | Plugin | 1 | ✅ Ready | MERGE | claude/setup-linear-mcp (duplicate) |
| **DOCUMENTATION** |
| claude/work-branch-011CUuBedxqgpS7s3bRbgmf9 | Docs | 2 | ✅ Ready | MERGE | None |
| claude/audit-branches-merge-review-01Hw86dL5e4jcJroA7sBUPZR | Docs | 1 | ✅ Ready | MERGE | None |
| **EPIC PLACEHOLDERS** |
| feat/HEI-101-epic-core-architecture-documentation | Epic | 0 | 📋 Empty | REVIEW | - |
| feat/HEI-102-epic-stack-hardening-environment | Epic | 0 | 📋 Empty | REVIEW | - |
| feat/HEI-103-epic-memory-system-manus | Epic | 0 | 📋 Empty | REVIEW | - |
| feat/HEI-104-epic-seven-aurora-integration | Epic | 0 | 📋 Empty | REVIEW | - |
| feat/HEI-105-epic-bridge-ipc-system | Epic | 0 | 📋 Empty | REVIEW | - |
| feat/HEI-106-epic-ai-connectors-tooling | Epic | 0 | 📋 Empty | REVIEW | - |
| feat/HEI-107-epic-technical-debt-improvements | Epic | 0 | 📋 Empty | REVIEW | - |

---

## 🎯 Quick Action Plan

### ✅ Branches Ready to Merge (12)
1. claude/create-output-styles-config-01RbASsjB2PykECWmRjkRFgV
2. claude/diff-model-typescript-018sN7bQmGqesCRuTRdWAp5Q
3. claude/implement-cody-multimode-01AnRibUWe8bRc69RxH5sBUy
4. claude/multi-file-patch-engine-01LFw2YDZSDtYFQkARWNLDMZ
5. claude/agent-routing-system-01UJK1paSwTp2KoAGSZs4xmi
6. claude/review-repo-branches-01L8WDMw9RvcU2p3rPShLDCE
7. claude/align-branches-linear-tasks-012Pww8BRNmPu2fYRppoPbwz
8. claude/work-branch-011CUuBedxqgpS7s3bRbgmf9
9. claude/audit-branches-merge-review-01Hw86dL5e4jcJroA7sBUPZR
10. claude/audit-branches-merge-review-01EuuSbtZt2EZHXqrETZtshr OR staging/seven-web-claude-merge-2025-11-18 (pick one)

### 🗑️ Branches to Delete (16+)
**Duplicates:**
- my-c-code
- claude/setup-linear-mcp-01JtR2AHAx2WLTzLK58mPH5V
- claude/work-in-progress-011CUuBedxqgpS7s3bRbgmf9

**Empty Placeholders (HEI tasks):**
- feat/HEI-72-build-new-output-styles-json
- feat/HEI-73-implement-cody-multi-mode-logic
- feat/HEI-74-add-seven-integration-hooks
- refactor/HEI-75-rewrite-diff-model-clarity
- feat/HEI-76-improve-multi-file-patch-engine
- feat/HEI-77-agent-routing-prompt-forwarding
- chore/HEI-78-repo-documentation-standards

**Empty Placeholders (Epics) - Review First:**
- feat/HEI-101-epic-core-architecture-documentation
- feat/HEI-102-epic-stack-hardening-environment
- feat/HEI-103-epic-memory-system-manus
- feat/HEI-104-epic-seven-aurora-integration
- feat/HEI-105-epic-bridge-ipc-system
- feat/HEI-106-epic-ai-connectors-tooling
- feat/HEI-107-epic-technical-debt-improvements

### ⚠️ Decision Required (1)
- **staging/seven-web-claude-merge-2025-11-18** vs **claude/audit-branches-merge-review-01EuuSbtZt2EZHXqrETZtshr**
  - Staging has 2 additional commits with Linear MCP and memory features
  - Current branch is cleaner, staging has more features
  - **Recommendation:** Merge staging if additional features are wanted

---

## 🔍 Dependency Graph

```
main
  │
  ├─→ [CHOOSE ONE] ─┐
  │                 ├─ claude/audit-branches-merge-review-01EuuSbtZt2EZHXqrETZtshr (28 commits)
  │                 └─ staging/seven-web-claude-merge-2025-11-18 (30 commits - includes above + more)
  │
  ├─→ claude/create-output-styles-config-01RbASsjB2PykECWmRjkRFgV (independent)
  ├─→ claude/diff-model-typescript-018sN7bQmGqesCRuTRdWAp5Q (independent)
  ├─→ claude/implement-cody-multimode-01AnRibUWe8bRc69RxH5sBUy (independent)
  ├─→ claude/multi-file-patch-engine-01LFw2YDZSDtYFQkARWNLDMZ (independent)
  ├─→ claude/agent-routing-system-01UJK1paSwTp2KoAGSZs4xmi (independent)
  ├─→ claude/review-repo-branches-01L8WDMw9RvcU2p3rPShLDCE (independent)
  ├─→ claude/align-branches-linear-tasks-012Pww8BRNmPu2fYRppoPbwz (independent)
  ├─→ claude/work-branch-011CUuBedxqgpS7s3bRbgmf9 (independent)
  └─→ claude/audit-branches-merge-review-01Hw86dL5e4jcJroA7sBUPZR (independent)

No interdependencies detected - all feature branches can be merged in parallel after main Seven integration.
```

---

## 📝 Merge Commands Cheat Sheet

### Phase 1: Core Seven Integration (Pick One)
```bash
# Option A: Current branch (28 commits)
git checkout main
git merge claude/audit-branches-merge-review-01EuuSbtZt2EZHXqrETZtshr --no-ff -m "Merge Seven integration (HEI-65,72,73,75,76,77,78)"

# Option B: Staging branch (30 commits - more features)
git checkout main
git merge staging/seven-web-claude-merge-2025-11-18 --no-ff -m "Merge Seven integration with Linear MCP"
```

### Phase 2: Feature Branches (Can run in parallel)
```bash
git checkout main
git merge claude/create-output-styles-config-01RbASsjB2PykECWmRjkRFgV --no-ff -m "feat(HEI-72): Output styles config"
git merge claude/diff-model-typescript-018sN7bQmGqesCRuTRdWAp5Q --no-ff -m "feat(HEI-75): Diff model"
git merge claude/implement-cody-multimode-01AnRibUWe8bRc69RxH5sBUy --no-ff -m "feat(HEI-73): Multi-mode"
git merge claude/multi-file-patch-engine-01LFw2YDZSDtYFQkARWNLDMZ --no-ff -m "feat(HEI-76): Patch engine"
git merge claude/agent-routing-system-01UJK1paSwTp2KoAGSZs4xmi --no-ff -m "feat(HEI-77): Agent routing"
git merge claude/review-repo-branches-01L8WDMw9RvcU2p3rPShLDCE --no-ff -m "feat(HEI-74): Seven hooks"
git merge claude/align-branches-linear-tasks-012Pww8BRNmPu2fYRppoPbwz --no-ff -m "feat: Linear MCP plugin"
git merge claude/work-branch-011CUuBedxqgpS7s3bRbgmf9 --no-ff -m "docs: Integration blueprints"
git merge claude/audit-branches-merge-review-01Hw86dL5e4jcJroA7sBUPZR --no-ff -m "docs: Branch audit"
```

### Phase 3: Cleanup
```bash
# Delete duplicates and obsolete branches
git push origin --delete my-c-code
git push origin --delete claude/setup-linear-mcp-01JtR2AHAx2WLTzLK58mPH5V
git push origin --delete claude/work-in-progress-011CUuBedxqgpS7s3bRbgmf9

# Delete merged placeholders
git push origin --delete feat/HEI-72-build-new-output-styles-json
git push origin --delete feat/HEI-73-implement-cody-multi-mode-logic
git push origin --delete feat/HEI-74-add-seven-integration-hooks
git push origin --delete refactor/HEI-75-rewrite-diff-model-clarity
git push origin --delete feat/HEI-76-improve-multi-file-patch-engine
git push origin --delete feat/HEI-77-agent-routing-prompt-forwarding
git push origin --delete chore/HEI-78-repo-documentation-standards
```

---

## 🎨 Visual Branch Relationships

```
                                    main
                                     │
                    ┌────────────────┼────────────────┐
                    │                │                │
              DUPLICATES        FEATURES          EPICS
                    │                │             (empty)
        ┌───────────┼───────────┐    │
        │           │           │    │
   [current] ← [my-c-code]  [staging]│
     (28)        (28)         (30)   │
        │           │           │    │
        └──[SAME]───┘           │    │
                                │    │
                        ┌───────┴────┴─────────┐
                        │                      │
                   Individual              Integration
                    Features                 Features
                        │                      │
                HEI-72, 73, 74,          Linear MCP
                75, 76, 77              (2 branches)
                (6 branches)
```

---

**End of Linking Map**
