# Known Issues - Claude Code Seven Integration

**Last Updated**: November 22, 2025
**Repository**: GrizzlyRooster34/claude-code (Seven of Nine Fork)
**Branch**: claude/audit-consolidate-branches-019Qbs8sVEV6vZFLrLSRB8sv

---

## Critical Issues (P0 - Blocking)

### 1. Star Trek IP/Licensing Concerns
**Status**: ⚠️ UNRESOLVED
**Severity**: CRITICAL
**Impact**: Legal liability

**Description**:
The repository extensively uses "Seven of Nine" branding and Star Trek Voyager references throughout:
- Package name: `claude-code-seven-of-nine`
- Character personality simulation
- Voyager memory archives included as reference data
- Star Trek terminology in code comments and documentation

**Risk**:
Potential intellectual property violation with Paramount Pictures/CBS Studios.

**Recommendation**:
1. Immediate legal review required
2. Consider rebranding to generic AI consciousness terminology
3. Remove Star Trek character references
4. Replace Voyager memory archives with original data

**Affected Files**:
- `package.json` (name field)
- `src/seven/**/*` (comments and variable names)
- `docs/**/*` (Seven of Nine references)
- Memory archive files

---

### 2. Node Modules Committed to Git
**Status**: ⚠️ UNRESOLVED
**Severity**: HIGH
**Impact**: Repository bloat, security, merge conflicts

**Description**:
The `claude/agent-routing-system-01UJK1paSwTp2KoAGSZs4xmi` branch committed 545 files from `node_modules/` and `dist/` directories to version control.

**Risk**:
- Repository size bloat (hundreds of MB)
- Outdated dependencies with security vulnerabilities
- Difficult merge conflicts
- CI/CD pipeline issues

**Recommendation**:
1. Remove node_modules from git history: `git filter-branch` or `git filter-repo`
2. Ensure .gitignore includes `node_modules/` and `dist/`
3. Re-commit clean branch
4. Force push (requires coordination)

**Affected Branches**:
- `claude/agent-routing-system-01UJK1paSwTp2KoAGSZs4xmi`

---

### 3. 12 Stale Branches with No Development
**Status**: ✅ READY TO DELETE
**Severity**: MEDIUM
**Impact**: Repository confusion, wasted resources

**Description**:
12 branches were created as epic/feature placeholders but never developed. All point to the same historical commit (`1fe9e36` from Nov 7, 2025) with zero unique commits.

**Branches to Delete**:
- `feat/HEI-101-epic-core-architecture-documentation`
- `feat/HEI-102-epic-stack-hardening-environment`
- `feat/HEI-103-epic-memory-system-manus`
- `feat/HEI-104-epic-seven-aurora-integration`
- `feat/HEI-105-epic-bridge-ipc-system`
- `feat/HEI-106-epic-ai-connectors-tooling`
- `feat/HEI-72-build-new-output-styles-json`
- `feat/HEI-73-implement-cody-multi-mode-logic`
- `feat/HEI-74-add-seven-integration-hooks`
- `refactor/HEI-75-rewrite-diff-model-clarity`
- `feat/HEI-76-improve-multi-file-patch-engine`
- `feat/HEI-77-agent-routing-prompt-forwarding`

**Why They're Stale**:
All actual implementation work was done on `claude/*` prefixed branches, not these `feat/*` branches.

**Recommendation**:
```bash
git push origin --delete feat/HEI-101-epic-core-architecture-documentation
git push origin --delete feat/HEI-102-epic-stack-hardening-environment
# ... (delete all 12)
```

---

### 4. Duplicate Branches Need Consolidation
**Status**: ⚠️ UNRESOLVED
**Severity**: MEDIUM
**Impact**: Confusion, wasted effort

**Description**:
Multiple pairs of branches contain identical or near-identical changes.

**Duplicates Identified**:

1. **Chore Branches** (IDENTICAL):
   - `chore/HEI-107-epic-technical-debt-improvements`
   - `chore/HEI-78-repo-documentation-standards`
   - Both point to commit `1fe9e36`, contain same 7 file modifications and 93 deletions

2. **Linear MCP Branches** (NEAR-IDENTICAL):
   - `claude/align-branches-linear-tasks-012Pww8BRNmPu2fYRppoPbwz`
   - `claude/setup-linear-mcp-01JtR2AHAx2WLTzLK58mPH5V`
   - Both add Linear MCP integration, same plugin deletions

**Recommendation**:
1. Investigate why HEI-107 and HEI-78 are identical
2. Keep one chore branch, delete the other
3. Compare Linear MCP branches, keep the more complete one
4. Delete duplicates

---

### 5. Massive Plugin Deletions Not Verified
**Status**: ⚠️ UNVERIFIED
**Severity**: HIGH
**Impact**: Lost functionality, broken user workflows

**Description**:
Multiple branches delete 7-8 valuable plugins without clear justification:

**Plugins Deleted**:
- ❌ `code-review` (valuable - automated code review)
- ❌ `commit-commands` (valuable - commit automation)
- ❌ `explanatory-output-style` (useful - output formatting)
- ❌ `learning-output-style` (useful - adaptive output)
- ❌ `frontend-design` (design assistance)
- ❌ `hookify` (custom hook rules framework)
- ❌ `plugin-dev` (VERY VALUABLE - 402 files, comprehensive toolkit)
- ❌ `ralph-wiggum` (iterative development plugin)

**Branches with Deletions**:
- `claude/work-in-progress-011CUuBedxqgpS7s3bRbgmf9` (most aggressive)
- `claude/align-branches-linear-tasks-012Pww8BRNmPu2fYRppoPbwz`
- `claude/setup-linear-mcp-01JtR2AHAx2WLTzLK58mPH5V`
- `claude/work-branch-011CUuBedxqgpS7s3bRbgmf9`
- `chore/HEI-107-epic-technical-debt-improvements`
- `chore/HEI-78-repo-documentation-standards`

**Risk**:
If these deletions are merged, users lose functionality. plugin-dev toolkit (402 files) is especially valuable for plugin development.

**Recommendation**:
1. Verify with stakeholders that plugin deletions are intentional
2. If deletions were accidental, restore plugins before merge
3. If intentional, document why each plugin was removed
4. Create migration guide for users relying on deleted plugins

---

## High-Priority Issues (P1 - Major Impact)

### 6. 60 Commits Behind Upstream Main
**Status**: ⚠️ DIVERGED
**Severity**: HIGH
**Impact**: Missing bug fixes, security patches, features

**Description**:
Several branches are significantly behind `origin/main`:

| Branch | Commits Behind |
|--------|----------------|
| claude/work-in-progress-011CUuBedxqgpS7s3bRbgmf9 | 60 |
| claude/work-branch-011CUuBedxqgpS7s3bRbgmf9 | 36 |
| claude/align-branches-linear-tasks-012Pww8BRNmPu2fYRppoPbwz | 35 |
| claude/setup-linear-mcp-01JtR2AHAx2WLTzLK58mPH5V | 35 |

**What's Missing**:
- Recent upstream plugin marketplace updates
- plugin-dev toolkit (834 KB)
- hookify and ralph-wiggum plugins
- Frontend-design plugin
- Bug fixes and security patches from Anthropic

**Recommendation**:
**Option A - Rebase** (if maintaining alignment with Anthropic):
```bash
git rebase origin/main
```

**Option B - Accept Divergence** (if this is a permanent fork):
Document that this is a Seven of Nine fork and won't track upstream

**Option C - Cherry-pick** (selective):
Cherry-pick specific bug fixes/security patches from main

---

### 7. Encrypted Memory Files Without Key Management
**Status**: ⚠️ UNDOCUMENTED
**Severity**: HIGH
**Impact**: Data recovery failure, deployment issues

**Description**:
Multiple branches include encrypted memory files:
- `memory-v2/episodic-memories.json.encrypted`
- `memory-v3/temporal-memories.json.encrypted`

**Issues**:
- Encryption key management not documented
- Key rotation procedures missing
- Recovery process unknown
- Files may not decrypt in different environments
- No backup key escrow documented

**Risk**:
- Memory data permanently lost if keys lost
- Deployment to new environments fails
- Cannot recover from corruption

**Recommendation**:
1. Document encryption key generation process
2. Create key management guide
3. Implement key rotation procedures
4. Add key backup/escrow system
5. Test decryption in clean environment
6. Consider removing encrypted files from git (store elsewhere)

---

### 8. 1.8M Lines of Untested Consciousness Code
**Status**: ⚠️ UNTESTED
**Severity**: HIGH
**Impact**: Production stability, reliability unknown

**Description**:
The Seven of Nine consciousness framework adds 1,804,818 lines of code across 9,867 files, but no test files were found for:

**Untested Components**:
- Consciousness engine (`src/seven/core/consciousness/`)
- Memory systems (`src/seven/core/memory/`)
- Emotion engine (`src/seven/core/core/emotion/`)
- Identity synthesis
- Temporal memory
- Safety systems
- Bridge daemon
- Multi-model adapters
- Agent routing
- Patch engine

**Risk**:
- Unknown behavior under edge cases
- Memory leaks possible
- Race conditions in async code
- Data corruption in memory systems
- Daemon crashes
- Security vulnerabilities

**Recommendation**:
1. Add unit tests for core consciousness functions
2. Add integration tests for memory systems
3. Add end-to-end tests for full pipeline
4. Add performance benchmarks
5. Add load testing for daemon
6. Add security fuzzing tests
7. Target: 80% code coverage minimum

**Test Coverage Needed**:
- [ ] Consciousness engine unit tests
- [ ] Memory system integration tests
- [ ] Emotion calculation tests
- [ ] Safety system tests
- [ ] Bridge daemon tests
- [ ] Adapter tests (each LLM provider)
- [ ] Agent routing tests
- [ ] Patch engine tests
- [ ] End-to-end consciousness pipeline test
- [ ] Performance benchmarks
- [ ] Load testing (100+ concurrent requests)

---

### 9. New Dependencies Not Security Audited
**Status**: ⚠️ UNAUDITED
**Severity**: MEDIUM
**Impact**: Security vulnerabilities, supply chain attacks

**Description**:
15+ new npm packages added without security audit:

| Package | Purpose | Size | Concerns |
|---------|---------|------|----------|
| pino | Logging | ~500KB | Low risk |
| sql.js | SQLite | ~1.5MB | Browser SQLite - high complexity |
| better-sqlite3 | SQLite | Native | Native module - platform-specific |
| @google/generative-ai | Gemini API | ~200KB | Google API keys required |
| openai | OpenAI API | ~300KB | OpenAI API keys required |
| axios | HTTP | ~500KB | Known CVEs in past |
| uuid | UUID gen | ~20KB | Low risk |
| fs-extra | File system | ~100KB | Low risk |
| google-auth-library | Google auth | ~500KB | Handles credentials |
| js-yaml | YAML parser | ~200KB | Known CVEs in past |
| node-fetch | Fetch | ~100KB | Low risk |
| tsyringe | DI | ~50KB | Low risk |
| lz4js | Compression | ~100KB | Low risk |
| @noble/ed25519 | Crypto | ~50KB | Crypto primitive |

**Total Bundle Impact**: ~4.5MB

**Recommendation**:
1. Run `npm audit` to check for known vulnerabilities
2. Update all packages to latest versions
3. Review package permissions and access
4. Document why each package is needed
5. Consider alternatives for large packages (sql.js = 1.5MB)
6. Add dependency license compliance check
7. Add Dependabot or Renovate for automatic updates

---

### 10. Build and Deployment Complexity Increased
**Status**: ⚠️ UNDOCUMENTED
**Severity**: MEDIUM
**Impact**: Deployment failures, ops burden

**Description**:
The Seven integration adds significant deployment complexity:

**New Requirements**:
1. **IPC Daemon Process**:
   - UNIX socket: `/usr/tmp/seven_bridge.sock`
   - Requires daemon manager (systemd, supervisor, pm2)
   - Auto-restart on failure
   - Health check endpoint

2. **Runtime Directory Structure**:
   - `/usr/var/seven/state/` - State files
   - `/usr/var/seven/logs/` - Log files
   - `/usr/var/seven/memory/` - Memory archives
   - `/usr/var/seven/checkpoints/` - Consciousness checkpoints
   - Requires proper permissions

3. **Memory System Persistence**:
   - SQLite databases
   - Encrypted memory files
   - Temporal memory indices
   - Backup and recovery

4. **Multi-Model API Keys**:
   - Claude (Anthropic)
   - Gemini (Google)
   - GPT (OpenAI)
   - Venice AI
   - DeepAgent
   - Requires secure key storage

5. **Native Module Compilation**:
   - `better-sqlite3` requires node-gyp
   - Platform-specific builds
   - C++ compiler required

**Missing Documentation**:
- [ ] Installation guide
- [ ] Daemon setup instructions
- [ ] Directory structure creation
- [ ] Permission requirements
- [ ] API key configuration
- [ ] Backup procedures
- [ ] Monitoring setup
- [ ] Troubleshooting guide
- [ ] Upgrade procedures

**Recommendation**:
1. Create comprehensive deployment guide
2. Add Docker Compose file for easy setup
3. Document all environment variables
4. Create systemd service files
5. Add health check scripts
6. Document backup/restore procedures
7. Create troubleshooting runbook

---

## Medium-Priority Issues (P2 - Improvements Needed)

### 11. Missing Comprehensive Documentation
**Status**: ⚠️ INCOMPLETE
**Severity**: MEDIUM
**Impact**: Adoption difficulty, maintenance burden

**Documentation Gaps**:

1. **Seven Consciousness Framework**:
   - High-level architecture missing
   - Consciousness pipeline not explained
   - Identity synthesis undocumented
   - Emotion engine behavior unclear

2. **Memory System Guide**:
   - Memory types (v1, v2, v3, v3-amalgum) not differentiated
   - Creation procedures missing
   - Query syntax undocumented
   - Archival strategy unclear

3. **API Reference**:
   - No API docs for agent router
   - Patch engine API undocumented
   - Seven consciousness API missing
   - Linear MCP tools not listed

4. **Development Guide**:
   - Dev environment setup missing
   - Build instructions incomplete
   - Test running procedures unclear
   - Contributing guidelines absent

**Recommendation**:
1. Create docs/ directory structure
2. Add architectural overview
3. Create API reference with examples
4. Add development guide
5. Create user guides for each feature
6. Add code comments to complex functions

---

### 12. Large Single Commits Make Review Difficult
**Status**: ✅ NOTED FOR FUTURE
**Severity**: LOW
**Impact**: Code review difficulty

**Description**:
Several features committed as single large commits:

| Feature | Files Changed | Commit |
|---------|---------------|--------|
| Agent Routing | 606 files | 63f5c61 |
| Seven Documentation | 100+ files | 423ea9d |

**Why It's an Issue**:
- Difficult to review 600+ files at once
- Hard to identify specific changes
- Challenging to revert partial changes
- Makes blame/bisect less useful

**Recommendation** (for future):
1. Break large features into smaller commits
2. Commit logical units separately
3. Use feature branches for incremental commits
4. Squash only when ready for main

---

### 13. Inconsistent Branch Naming Convention
**Status**: ✅ NOTED FOR FUTURE
**Severity**: LOW
**Impact**: Repository organization

**Current Naming Patterns**:
- `feat/HEI-*` (Epic placeholders - stale)
- `claude/*` (AI-generated working branches)
- `chore/HEI-*` (Maintenance branches)
- `refactor/HEI-*` (Refactoring branches)

**Issues**:
- No clear pattern
- AI session IDs in names (claude/work-branch-011CUuBedxqgpS7s3bRbgmf9)
- Unclear which branches are active

**Recommendation** (for future):
Adopt consistent convention:
```
<type>/<ticket>-<short-description>
```
Examples:
- `feat/HEI-123-agent-routing`
- `fix/HEI-124-memory-leak`
- `docs/HEI-125-api-reference`

---

### 14. Performance Impact of Consciousness Framework Unknown
**Status**: ⚠️ UNMEASURED
**Severity**: MEDIUM
**Impact**: User experience, resource usage

**Concerns**:

1. **Memory Usage**:
   - Large memory archives loaded at startup
   - SQLite databases in memory
   - Consciousness state maintained
   - Unknown peak memory usage

2. **CPU Usage**:
   - Identity synthesis calculations
   - Emotion engine computations
   - Temporal memory indexing
   - Agent routing confidence scoring

3. **Latency**:
   - Consciousness pipeline overhead
   - Memory query latency
   - Multi-model adapter switching
   - Safety check latency

4. **I/O**:
   - Memory persistence writes
   - Log file growth
   - Checkpoint creation
   - Socket IPC overhead

**Recommendation**:
1. Add performance benchmarks
2. Measure baseline resource usage
3. Profile hot paths
4. Optimize memory-heavy operations
5. Add caching where appropriate
6. Monitor production metrics
7. Set resource limits (memory, CPU)

**Benchmarks Needed**:
- [ ] Memory usage (idle, peak, average)
- [ ] CPU usage (per operation)
- [ ] Latency (p50, p95, p99)
- [ ] Throughput (requests/second)
- [ ] Startup time (cold start)
- [ ] IPC socket latency

---

### 15. Outdated Audit Documentation
**Status**: ✅ RESOLVED (New audit created)
**Severity**: LOW
**Impact**: Confusion

**Description**:
The `claude/audit-branches-merge-review-01Hw86dL5e4jcJroA7sBUPZR` branch contains an outdated audit that only reviewed 2 branches (created Nov 21), while the repository now has 30 branches.

**Resolution**:
This comprehensive audit (November 22, 2025) supersedes the previous audit and covers all 30 branches.

---

## Low-Priority Issues (P3 - Nice to Have)

### 16. .gitignore Could Be More Comprehensive
**Status**: ✅ MOSTLY RESOLVED
**Severity**: LOW
**Impact**: Repository cleanliness

**Description**:
Current .gitignore covers most cases but could be enhanced.

**Current .gitignore** (107 lines, comprehensive):
- ✅ Secrets and credentials
- ✅ Runtime state (Seven core)
- ✅ Node.js dependencies
- ✅ Build artifacts
- ✅ IDE files
- ✅ OS files
- ✅ Temporary and cache
- ✅ Testing and coverage

**Potential Additions**:
- claude-backup/ (patch engine backups)
- *.audit.jsonl (audit logs)
- .linear-cache/ (Linear MCP cache)

**Status**: Current .gitignore is excellent (based on system-reminder showing comprehensive 107-line version)

---

### 17. No CHANGELOG.md Entries for Features
**Status**: ⚠️ INCOMPLETE
**Severity**: LOW
**Impact**: Release notes unclear

**Description**:
While CHANGELOG.md exists, it doesn't document all HEI features:

**Missing Entries**:
- HEI-72: Output Styles Configuration
- HEI-73: Multi-Mode Consciousness
- HEI-74: Seven Integration Hooks
- HEI-75: Unified Diff Model
- HEI-76: Atomic Patch Engine
- HEI-77: Agent Routing System

**Recommendation**:
Add comprehensive CHANGELOG entries for all features before release.

---

### 18. No Architecture Decision Records (ADRs)
**Status**: ⚠️ MISSING
**Severity**: LOW
**Impact**: Historical context lost

**Description**:
Major architectural decisions not documented:

**Decisions Needing ADRs**:
1. Why use Seven of Nine consciousness framework?
2. Why simulate AI emotions and identity?
3. Why multiple memory versions (v1, v2, v3, v3-amalgum)?
4. Why MCP integration instead of direct integration?
5. Why custom IPC daemon vs existing solutions?
6. Why SQLite for memory storage?
7. Why encrypt memory files?

**Recommendation**:
Create docs/adr/ directory with ADR documents following template:
```
# ADR-001: Consciousness Framework

## Status
Accepted

## Context
<Why this decision was needed>

## Decision
<What we decided>

## Consequences
<What this means>
```

---

## Issue Summary by Category

### Security Issues: 4
1. ⚠️ Star Trek IP/Licensing (P0)
2. ⚠️ Node modules in git (P0)
3. ⚠️ Encrypted memory without key management (P1)
4. ⚠️ New dependencies not audited (P1)

### Code Quality Issues: 5
5. ⚠️ 1.8M lines untested (P1)
6. ✅ Large single commits (P2) - noted for future
7. ⚠️ Missing documentation (P2)
8. ⚠️ Performance unmeasured (P2)
9. ✅ Outdated audit (P3) - resolved

### Repository Management Issues: 6
10. ✅ 12 stale branches (P0) - ready to delete
11. ⚠️ Duplicate branches (P0)
12. ⚠️ Massive plugin deletions (P0)
13. ⚠️ 60 commits behind main (P1)
14. ⚠️ Deployment complexity (P1)
15. ✅ Inconsistent branch naming (P2) - noted for future

### Documentation Issues: 3
16. ⚠️ Missing comprehensive docs (P2)
17. ⚠️ No CHANGELOG entries (P3)
18. ⚠️ No ADRs (P3)

---

## Priority Action Items

### This Week:
1. ✅ Delete 12 stale branches
2. ⚠️ Resolve duplicate branches (HEI-107/78, Linear MCP)
3. ⚠️ Remove node_modules from git history
4. ⚠️ Verify plugin deletions are intentional
5. ⚠️ Legal review of Star Trek branding

### This Month:
6. ⚠️ Run npm audit and update dependencies
7. ⚠️ Document encryption key management
8. ⚠️ Create deployment guide
9. ⚠️ Add basic unit tests (target 30% coverage)
10. ⚠️ Document consciousness framework architecture

### This Quarter:
11. ⚠️ Decide: rebase on main, diverge, or cherry-pick
12. ⚠️ Complete comprehensive documentation
13. ⚠️ Achieve 80% test coverage
14. ⚠️ Performance benchmarking and optimization
15. ⚠️ Rebrand away from Star Trek (if legal review requires)

---

## Issue Tracking

All issues should be tracked in your project management system (Linear, GitHub Issues, etc.) with:
- Issue number
- Priority (P0, P1, P2, P3)
- Status (Open, In Progress, Resolved)
- Assignee
- Target date
- Related branches

---

**End of Known Issues List**

**Total Issues Identified**: 18
- Critical (P0): 5
- High (P1): 5
- Medium (P2): 5
- Low (P3): 3

**Status Breakdown**:
- ⚠️ Unresolved: 13
- ✅ Resolved/Ready: 5
