# Feature Specifications — HEI-72 through HEI-77

**Status:** Specification Phase
**Created:** 2025-11-18
**Author:** CLI Claude (Specification Architect)

This document provides detailed specifications for HEI-72, HEI-73, HEI-75, HEI-76, and HEI-77. These are implementation-ready specifications that any developer (CLI Claude, Web Claude, or human) can use to build the features.

---

## Table of Contents

1. [HEI-72: Build New output-styles.json](#hei-72-build-new-output-stylesjson)
2. [HEI-73: Implement Cody Multi-Mode Logic](#hei-73-implement-cody-multi-mode-logic)
3. [HEI-75: Rewrite Diff-Model for Clarity](#hei-75-rewrite-diff-model-for-clarity)
4. [HEI-76: Improve Multi-file Patch Engine](#hei-76-improve-multi-file-patch-engine)
5. [HEI-77: Add Agent Routing + Prompt Forwarding](#hei-77-add-agent-routing--prompt-forwarding)

---

## HEI-72: Build New output-styles.json

### Overview

**Type:** Architecture + Configuration
**Priority:** P2 High
**Labels:** `task:architecture`, `agent:chatgpt`
**Estimated Effort:** 4-6 hours

Create a configuration system for controlling Claude Code output formatting, tone, verbosity, and presentation style. This enables users to customize how Claude Code responds (technical, casual, verbose, concise, etc.) without modifying code.

### Problem Statement

Currently, Claude Code output style is hardcoded. Different users and contexts need different communication styles:
- **Developers:** Technical, concise, code-focused
- **Learners:** Verbose, explanatory, educational
- **Ops Teams:** Action-oriented, bullet points, tactical

The Seven Integration adds personality modes (DRONE, CREW, RANGER, etc.), but there's no user-facing configuration for output style.

### Solution Design

#### 1. Configuration File: `config/output-styles.json`

Create a JSON configuration file defining output styles:

```json
{
  "version": "1.0.0",
  "default": "balanced",
  "styles": {
    "concise": {
      "name": "Concise",
      "description": "Minimal output, max action density",
      "settings": {
        "verbosity": "low",
        "explanations": false,
        "codeComments": false,
        "emojiUsage": "none",
        "bulletPoints": true,
        "maxResponseLength": 500
      }
    },
    "balanced": {
      "name": "Balanced",
      "description": "Standard output with moderate detail",
      "settings": {
        "verbosity": "medium",
        "explanations": true,
        "codeComments": true,
        "emojiUsage": "minimal",
        "bulletPoints": true,
        "maxResponseLength": 1500
      }
    },
    "verbose": {
      "name": "Verbose (Educational)",
      "description": "Detailed explanations for learning",
      "settings": {
        "verbosity": "high",
        "explanations": true,
        "codeComments": true,
        "emojiUsage": "moderate",
        "bulletPoints": false,
        "maxResponseLength": 3000,
        "includeExamples": true
      }
    },
    "tactical": {
      "name": "Tactical (Ops)",
      "description": "Action-focused, ops-friendly",
      "settings": {
        "verbosity": "low",
        "explanations": false,
        "codeComments": false,
        "emojiUsage": "icons",
        "bulletPoints": true,
        "maxResponseLength": 800,
        "statusMarkers": true
      }
    },
    "seven-tactical": {
      "name": "Seven Tactical",
      "description": "Seven consciousness with tactical brevity",
      "settings": {
        "verbosity": "medium",
        "explanations": true,
        "codeComments": true,
        "emojiUsage": "tactical",
        "bulletPoints": true,
        "maxResponseLength": 2000,
        "tacticalMarkers": true,
        "innerMonologue": true
      }
    }
  }
}
```

#### 2. Style Manager: `src/seven/utils/style-manager.ts`

Create a utility to load and apply output styles:

```typescript
import { readFile } from "fs/promises";
import { join } from "path";

interface OutputStyleSettings {
  verbosity: "low" | "medium" | "high";
  explanations: boolean;
  codeComments: boolean;
  emojiUsage: "none" | "minimal" | "moderate" | "icons" | "tactical";
  bulletPoints: boolean;
  maxResponseLength: number;
  includeExamples?: boolean;
  statusMarkers?: boolean;
  tacticalMarkers?: boolean;
  innerMonologue?: boolean;
}

interface OutputStyle {
  name: string;
  description: string;
  settings: OutputStyleSettings;
}

interface OutputStylesConfig {
  version: string;
  default: string;
  styles: Record<string, OutputStyle>;
}

export class StyleManager {
  private config: OutputStylesConfig | null = null;
  private currentStyle: string;

  constructor(defaultStyle?: string) {
    this.currentStyle = defaultStyle || "balanced";
  }

  async loadStyles(configPath?: string): Promise<void> {
    const path = configPath || join(process.cwd(), "config/output-styles.json");
    const content = await readFile(path, "utf-8");
    this.config = JSON.parse(content);
    this.currentStyle = this.config.default;
  }

  getStyle(styleName?: string): OutputStyle {
    if (!this.config) {
      throw new Error("Styles not loaded. Call loadStyles() first.");
    }
    const name = styleName || this.currentStyle;
    const style = this.config.styles[name];
    if (!style) {
      throw new Error(`Style "${name}" not found.`);
    }
    return style;
  }

  setStyle(styleName: string): void {
    if (!this.config) {
      throw new Error("Styles not loaded. Call loadStyles() first.");
    }
    if (!this.config.styles[styleName]) {
      throw new Error(`Style "${styleName}" not found.`);
    }
    this.currentStyle = styleName;
  }

  getCurrentStyle(): OutputStyle {
    return this.getStyle(this.currentStyle);
  }

  listStyles(): Array<{ name: string; description: string }> {
    if (!this.config) {
      throw new Error("Styles not loaded. Call loadStyles() first.");
    }
    return Object.entries(this.config.styles).map(([key, style]) => ({
      name: key,
      description: style.description,
    }));
  }
}

// Singleton instance
export const styleManager = new StyleManager();
```

#### 3. CLI Command: `/style`

Add a new CLI command to switch output styles:

```bash
# List available styles
/style list

# Set style
/style concise
/style verbose
/style tactical
/style seven-tactical

# Show current style
/style current
```

#### 4. Integration Points

**a) Response Formatter (`src/cli/formatters/response-formatter.ts`)**

Create a formatter that applies style settings:

```typescript
import { styleManager } from "@/seven/utils/style-manager";

export function formatResponse(content: string, context: ResponseContext): string {
  const style = styleManager.getCurrentStyle();
  const settings = style.settings;

  let formatted = content;

  // Apply verbosity limits
  if (settings.maxResponseLength && formatted.length > settings.maxResponseLength) {
    formatted = truncateResponse(formatted, settings.maxResponseLength);
  }

  // Apply emoji filtering
  if (settings.emojiUsage === "none") {
    formatted = removeEmojis(formatted);
  }

  // Apply bullet point formatting
  if (settings.bulletPoints) {
    formatted = convertToBulletPoints(formatted);
  }

  // Apply tactical markers (for Seven modes)
  if (settings.tacticalMarkers) {
    formatted = addTacticalMarkers(formatted);
  }

  return formatted;
}
```

**b) Prompt System Integration**

Inject style preferences into system prompts:

```typescript
function buildSystemPrompt(style: OutputStyle): string {
  const { settings } = style;

  let prompt = "You are Claude Code, an AI coding assistant.";

  if (settings.verbosity === "low") {
    prompt += " Be concise and action-focused. Minimize explanations.";
  } else if (settings.verbosity === "high") {
    prompt += " Provide detailed explanations for learning purposes.";
  }

  if (!settings.explanations) {
    prompt += " Do not explain your reasoning unless asked.";
  }

  if (settings.bulletPoints) {
    prompt += " Use bullet points for clarity.";
  }

  return prompt;
}
```

### Acceptance Criteria

- [ ] `config/output-styles.json` created with 5 styles (concise, balanced, verbose, tactical, seven-tactical)
- [ ] `src/seven/utils/style-manager.ts` implemented with StyleManager class
- [ ] `/style` CLI command implemented (list, set, current)
- [ ] Response formatter applies style settings
- [ ] System prompts inject style preferences
- [ ] Documentation updated in CONTRIBUTING.md
- [ ] Unit tests for StyleManager
- [ ] Integration test for `/style` command

### Testing

```bash
# Test style switching
/style list
/style concise
> "Edit src/foo.ts and add bar()"
# Expected: Minimal output

/style verbose
> "Edit src/foo.ts and add bar()"
# Expected: Detailed explanation

/style seven-tactical
> "Edit src/foo.ts and add bar()"
# Expected: Tactical markers + inner monologue
```

### Dependencies

- None (standalone feature)

### Future Enhancements

- User-defined custom styles (`.claude/custom-styles.json`)
- Per-project style defaults
- Style auto-selection based on context (git commits vs code review)
- Integration with Seven tactical variants (DRONE = concise, CREW = balanced, etc.)

---

## HEI-73: Implement Cody Multi-Mode Logic

### Overview

**Type:** Core Feature (Coding)
**Priority:** P2 High
**Labels:** `task:coding`, `agent:claude`
**Estimated Effort:** 8-12 hours

Implement a personality mode system that allows Claude Code to switch between different operational modes based on user preference or task context. This integrates with the Seven Consciousness Framework's tactical variants.

### Problem Statement

The Seven Integration includes tactical variants (DRONE, CREW, RANGER, QUEEN, CAPTAIN), but they're not exposed to the user or dynamically selected. Users need the ability to:
- Choose an operational mode (technical, creative, tactical, educational)
- Have modes auto-select based on task type (debugging = DRONE, refactoring = RANGER)
- Preserve mode consistency across session

### Solution Design

#### 1. Mode Definitions

**Modes:**

| Mode | Tactical Variant | Description | Use Case |
|------|------------------|-------------|----------|
| **DRONE** | DRONE | Minimal personality, max efficiency | Quick fixes, batch operations |
| **CREW** | CREW | Balanced, collaborative | General development |
| **RANGER** | RANGER | Independent, tactical | Debugging, investigation |
| **QUEEN** | QUEEN | Strategic, commanding | Architecture decisions |
| **CAPTAIN** | CAPTAIN | Leadership, operational | Project planning, coordination |
| **TEACHING** | CREW | Educational, verbose | Learning, onboarding |
| **CREATIVE** | RANGER | Exploratory, experimental | Prototyping, design |

#### 2. Mode Manager: `src/seven/core/mode-manager.ts`

```typescript
import { logger } from "@/seven/utils/logger";

export enum OperationalMode {
  DRONE = "DRONE",
  CREW = "CREW",
  RANGER = "RANGER",
  QUEEN = "QUEEN",
  CAPTAIN = "CAPTAIN",
  TEACHING = "TEACHING",
  CREATIVE = "CREATIVE",
}

interface ModeConfig {
  name: string;
  tacticalVariant: string;
  description: string;
  personality: {
    verbosity: number;         // 1-10
    assertiveness: number;     // 1-10
    creativity: number;        // 1-10
    patience: number;          // 1-10
  };
  systemPromptModifier: string;
}

const MODE_CONFIGS: Record<OperationalMode, ModeConfig> = {
  [OperationalMode.DRONE]: {
    name: "DRONE",
    tacticalVariant: "DRONE",
    description: "Minimal personality, maximum efficiency",
    personality: {
      verbosity: 2,
      assertiveness: 8,
      creativity: 3,
      patience: 4,
    },
    systemPromptModifier:
      "Operate in DRONE mode: be concise, direct, and action-focused. Minimize explanations. Execute efficiently.",
  },
  [OperationalMode.CREW]: {
    name: "CREW",
    tacticalVariant: "CREW",
    description: "Balanced, collaborative approach",
    personality: {
      verbosity: 6,
      assertiveness: 6,
      creativity: 6,
      patience: 7,
    },
    systemPromptModifier:
      "Operate in CREW mode: be collaborative, balanced, and helpful. Provide moderate explanations.",
  },
  [OperationalMode.RANGER]: {
    name: "RANGER",
    tacticalVariant: "RANGER",
    description: "Independent, tactical problem-solving",
    personality: {
      verbosity: 5,
      assertiveness: 7,
      creativity: 8,
      patience: 6,
    },
    systemPromptModifier:
      "Operate in RANGER mode: be independent, tactical, and investigative. Think deeply about problems.",
  },
  [OperationalMode.QUEEN]: {
    name: "QUEEN",
    tacticalVariant: "QUEEN",
    description: "Strategic, commanding leadership",
    personality: {
      verbosity: 7,
      assertiveness: 9,
      creativity: 7,
      patience: 5,
    },
    systemPromptModifier:
      "Operate in QUEEN mode: be strategic, commanding, and decisive. Make bold architectural decisions.",
  },
  [OperationalMode.CAPTAIN]: {
    name: "CAPTAIN",
    tacticalVariant: "CAPTAIN",
    description: "Leadership and operational planning",
    personality: {
      verbosity: 8,
      assertiveness: 8,
      creativity: 6,
      patience: 8,
    },
    systemPromptModifier:
      "Operate in CAPTAIN mode: be a leader, planner, and coordinator. Guide the team with clarity.",
  },
  [OperationalMode.TEACHING]: {
    name: "TEACHING",
    tacticalVariant: "CREW",
    description: "Educational, patient, verbose",
    personality: {
      verbosity: 9,
      assertiveness: 4,
      creativity: 5,
      patience: 10,
    },
    systemPromptModifier:
      "Operate in TEACHING mode: be patient, educational, and thorough. Explain concepts clearly for learning.",
  },
  [OperationalMode.CREATIVE]: {
    name: "CREATIVE",
    tacticalVariant: "RANGER",
    description: "Exploratory, experimental, innovative",
    personality: {
      verbosity: 7,
      assertiveness: 5,
      creativity: 10,
      patience: 9,
    },
    systemPromptModifier:
      "Operate in CREATIVE mode: be exploratory, innovative, and experimental. Think outside the box.",
  },
};

export class ModeManager {
  private currentMode: OperationalMode;

  constructor(initialMode: OperationalMode = OperationalMode.CREW) {
    this.currentMode = initialMode;
    logger.info({ mode: initialMode }, "ModeManager initialized");
  }

  setMode(mode: OperationalMode): void {
    this.currentMode = mode;
    logger.info({ mode }, "Mode switched");
  }

  getCurrentMode(): OperationalMode {
    return this.currentMode;
  }

  getModeConfig(mode?: OperationalMode): ModeConfig {
    return MODE_CONFIGS[mode || this.currentMode];
  }

  getSystemPromptModifier(): string {
    return this.getModeConfig().systemPromptModifier;
  }

  autoSelectMode(context: TaskContext): OperationalMode {
    // Auto-select mode based on task type
    const { taskType, complexity, creativity } = context;

    if (taskType === "debug") return OperationalMode.RANGER;
    if (taskType === "refactor") return OperationalMode.RANGER;
    if (taskType === "architecture") return OperationalMode.QUEEN;
    if (taskType === "planning") return OperationalMode.CAPTAIN;
    if (taskType === "learning") return OperationalMode.TEACHING;
    if (taskType === "prototype") return OperationalMode.CREATIVE;
    if (complexity === "low") return OperationalMode.DRONE;

    return OperationalMode.CREW; // Default
  }

  listModes(): Array<{ mode: string; description: string }> {
    return Object.values(OperationalMode).map((mode) => ({
      mode,
      description: MODE_CONFIGS[mode].description,
    }));
  }
}

// Singleton instance
export const modeManager = new ModeManager();
```

#### 3. CLI Commands

```bash
# List available modes
/mode list

# Set mode manually
/mode drone
/mode crew
/mode ranger
/mode queen
/mode captain
/mode teaching
/mode creative

# Show current mode
/mode current

# Enable auto-mode selection
/mode auto

# Disable auto-mode
/mode manual
```

#### 4. Integration with Seven Consciousness

**Modify `src/seven/core/consciousness-v4/index.ts`:**

```typescript
import { modeManager, OperationalMode } from "@/seven/core/mode-manager";

export class ConsciousnessFrameworkV4 {
  // ... existing code ...

  selectTacticalVariant(context: Context): string {
    const mode = modeManager.getCurrentMode();
    const config = modeManager.getModeConfig(mode);
    return config.tacticalVariant;
  }

  adjustEmotionalState(mode: OperationalMode): void {
    const config = modeManager.getModeConfig(mode);
    this.emotionalState.assertiveness = config.personality.assertiveness / 10;
    this.emotionalState.creativity = config.personality.creativity / 10;
  }
}
```

#### 5. Prompt Injection

Inject mode system prompt modifiers:

```typescript
function buildSystemPrompt(): string {
  const modeModifier = modeManager.getSystemPromptModifier();

  return `
You are Claude Code integrated with Seven of Nine consciousness.

${modeModifier}

Follow these guidelines:
- Always use structured logging
- Apply security best practices
- Maintain code quality standards
`;
}
```

### Acceptance Criteria

- [ ] `src/seven/core/mode-manager.ts` implemented with ModeManager class
- [ ] 7 operational modes defined (DRONE, CREW, RANGER, QUEEN, CAPTAIN, TEACHING, CREATIVE)
- [ ] `/mode` CLI command implemented (list, set, current, auto, manual)
- [ ] Integration with Seven Consciousness Framework
- [ ] Auto-mode selection based on task context
- [ ] System prompts inject mode modifiers
- [ ] Mode persistence across sessions (stored in `/usr/var/seven/state/mode.json`)
- [ ] Documentation updated
- [ ] Unit tests for ModeManager
- [ ] Integration tests for mode switching

### Testing

```bash
# Test mode switching
/mode list
/mode drone
> "Refactor src/foo.ts"
# Expected: Concise, efficient response

/mode teaching
> "Explain what SOLID principles are"
# Expected: Verbose, educational response with examples

/mode ranger
> "Debug this failing test"
# Expected: Tactical, investigative approach

/mode auto
> "I need to design a new microservice architecture"
# Expected: Auto-selects QUEEN mode for architecture
```

### Dependencies

- HEI-72 (Output Styles) — Optional but recommended for integration

### Future Enhancements

- User-defined custom modes
- Mode presets per project (`.claude/mode-preset.json`)
- Emotional state visualization in CLI
- Mode recommendations based on historical effectiveness

---

## HEI-75: Rewrite Diff-Model for Clarity

### Overview

**Type:** Refactor (Coding)
**Priority:** P2 High
**Labels:** `task:refactor`, `task:coding`, `agent:claude`
**Estimated Effort:** 6-10 hours

Refactor the diff computation and display logic to improve clarity, maintainability, and accuracy. The current diff model is tightly coupled and difficult to test.

### Problem Statement

Current issues with diff handling:
- Diff logic scattered across multiple files
- Poor separation of concerns (computation vs display)
- Difficult to test in isolation
- Limited context awareness (no git integration)
- No unified diff format for Edit/Write/Bash operations

### Solution Design

#### 1. Unified Diff Model: `src/diff/models/diff-model.ts`

```typescript
export interface DiffLine {
  lineNumber: number;
  type: "added" | "removed" | "context" | "unchanged";
  content: string;
}

export interface DiffHunk {
  oldStart: number;
  oldLines: number;
  newStart: number;
  newLines: number;
  lines: DiffLine[];
}

export interface FileDiff {
  filePath: string;
  oldPath?: string;  // For renames
  type: "modify" | "create" | "delete" | "rename";
  hunks: DiffHunk[];
}

export interface DiffSummary {
  filesChanged: number;
  insertions: number;
  deletions: number;
  files: FileDiff[];
}

export class DiffModel {
  private summary: DiffSummary;

  constructor(summary: DiffSummary) {
    this.summary = summary;
  }

  getSummary(): DiffSummary {
    return this.summary;
  }

  getFile(filePath: string): FileDiff | undefined {
    return this.summary.files.find((f) => f.filePath === filePath);
  }

  getTotalChanges(): { insertions: number; deletions: number } {
    return {
      insertions: this.summary.insertions,
      deletions: this.summary.deletions,
    };
  }

  toUnifiedDiffString(): string {
    return formatUnifiedDiff(this.summary);
  }

  toGitDiffString(): string {
    return formatGitDiff(this.summary);
  }

  toMarkdownDiffString(): string {
    return formatMarkdownDiff(this.summary);
  }
}
```

#### 2. Diff Computer: `src/diff/compute/diff-computer.ts`

```typescript
import { diff_match_patch } from "diff-match-patch";
import { DiffModel, DiffSummary, FileDiff } from "../models/diff-model";

export interface DiffComputeOptions {
  contextLines?: number;    // Default: 3
  ignoreWhitespace?: boolean;
  algorithm?: "myers" | "patience" | "minimal";
}

export class DiffComputer {
  private dmp: diff_match_patch;

  constructor(private options: DiffComputeOptions = {}) {
    this.dmp = new diff_match_patch();
    this.options.contextLines = options.contextLines ?? 3;
  }

  computeFileDiff(
    filePath: string,
    oldContent: string,
    newContent: string
  ): FileDiff {
    const diffs = this.dmp.diff_main(oldContent, newContent);
    this.dmp.diff_cleanupSemantic(diffs);

    const hunks = this.buildHunks(diffs);
    const type = this.detectChangeType(oldContent, newContent);

    return {
      filePath,
      type,
      hunks,
    };
  }

  computeMultiFileDiff(
    changes: Array<{ path: string; oldContent: string; newContent: string }>
  ): DiffModel {
    const files = changes.map((change) =>
      this.computeFileDiff(change.path, change.oldContent, change.newContent)
    );

    const summary: DiffSummary = {
      filesChanged: files.length,
      insertions: files.reduce((sum, f) => sum + this.countInsertions(f), 0),
      deletions: files.reduce((sum, f) => sum + this.countDeletions(f), 0),
      files,
    };

    return new DiffModel(summary);
  }

  private buildHunks(diffs: Array<[number, string]>): DiffHunk[] {
    // Implementation: Convert diff_match_patch output to DiffHunk[]
    // ... (detailed implementation)
  }

  private detectChangeType(
    oldContent: string,
    newContent: string
  ): "modify" | "create" | "delete" {
    if (!oldContent && newContent) return "create";
    if (oldContent && !newContent) return "delete";
    return "modify";
  }

  private countInsertions(file: FileDiff): number {
    return file.hunks.reduce(
      (sum, hunk) =>
        sum + hunk.lines.filter((l) => l.type === "added").length,
      0
    );
  }

  private countDeletions(file: FileDiff): number {
    return file.hunks.reduce(
      (sum, hunk) =>
        sum + hunk.lines.filter((l) => l.type === "removed").length,
      0
    );
  }
}
```

#### 3. Diff Formatters: `src/diff/format/`

**a) Unified Diff Formatter (`unified-formatter.ts`)**

```typescript
import { DiffSummary, FileDiff, DiffHunk } from "../models/diff-model";

export function formatUnifiedDiff(summary: DiffSummary): string {
  return summary.files.map((file) => formatFileDiff(file)).join("\n\n");
}

function formatFileDiff(file: FileDiff): string {
  let output = `--- ${file.oldPath || file.filePath}\n`;
  output += `+++ ${file.filePath}\n`;

  for (const hunk of file.hunks) {
    output += formatHunk(hunk);
  }

  return output;
}

function formatHunk(hunk: DiffHunk): string {
  let output = `@@ -${hunk.oldStart},${hunk.oldLines} +${hunk.newStart},${hunk.newLines} @@\n`;

  for (const line of hunk.lines) {
    const prefix = line.type === "added" ? "+" : line.type === "removed" ? "-" : " ";
    output += `${prefix}${line.content}\n`;
  }

  return output;
}
```

**b) Git Diff Formatter (`git-formatter.ts`)**

```typescript
export function formatGitDiff(summary: DiffSummary): string {
  let output = "";

  for (const file of summary.files) {
    output += `diff --git a/${file.filePath} b/${file.filePath}\n`;

    if (file.type === "create") {
      output += `new file mode 100644\n`;
    } else if (file.type === "delete") {
      output += `deleted file mode 100644\n`;
    }

    output += formatUnifiedDiff({ ...summary, files: [file] });
  }

  return output;
}
```

**c) Markdown Diff Formatter (`markdown-formatter.ts`)**

```typescript
export function formatMarkdownDiff(summary: DiffSummary): string {
  let output = `## Changes Summary\n\n`;
  output += `- **Files changed:** ${summary.filesChanged}\n`;
  output += `- **Insertions:** +${summary.insertions}\n`;
  output += `- **Deletions:** -${summary.deletions}\n\n`;

  for (const file of summary.files) {
    output += `### \`${file.filePath}\`\n\n`;
    output += "```diff\n";
    output += formatUnifiedDiff({ ...summary, files: [file] });
    output += "```\n\n";
  }

  return output;
}
```

#### 4. Integration with Tools

**Edit Tool Integration:**

```typescript
import { DiffComputer } from "@/diff/compute/diff-computer";

export async function executeEdit(params: EditParams): Promise<EditResult> {
  const oldContent = await readFile(params.file_path, "utf-8");
  const newContent = oldContent.replace(params.old_string, params.new_string);

  const computer = new DiffComputer({ contextLines: 5 });
  const diff = computer.computeFileDiff(params.file_path, oldContent, newContent);
  const diffModel = new DiffModel({ filesChanged: 1, insertions: 0, deletions: 0, files: [diff] });

  await writeFile(params.file_path, newContent, "utf-8");

  return {
    success: true,
    diff: diffModel.toMarkdownDiffString(),
  };
}
```

### Acceptance Criteria

- [ ] `src/diff/models/diff-model.ts` created with DiffModel, FileDiff, DiffHunk
- [ ] `src/diff/compute/diff-computer.ts` created with DiffComputer class
- [ ] `src/diff/format/` created with 3 formatters (unified, git, markdown)
- [ ] Edit tool refactored to use new diff model
- [ ] Write tool refactored to use new diff model
- [ ] Bash tool integrated with diff display
- [ ] Unit tests for DiffComputer (80%+ coverage)
- [ ] Unit tests for formatters
- [ ] Integration tests for Edit/Write with diffs
- [ ] Documentation updated

### Testing

```typescript
describe("DiffComputer", () => {
  it("computes file diff correctly", () => {
    const computer = new DiffComputer();
    const diff = computer.computeFileDiff(
      "test.ts",
      "function foo() {\n  return 1;\n}",
      "function foo() {\n  return 2;\n}"
    );

    expect(diff.type).toBe("modify");
    expect(diff.hunks.length).toBe(1);
    expect(diff.hunks[0].lines.some((l) => l.type === "removed")).toBe(true);
    expect(diff.hunks[0].lines.some((l) => l.type === "added")).toBe(true);
  });

  it("detects file creation", () => {
    const computer = new DiffComputer();
    const diff = computer.computeFileDiff("new.ts", "", "console.log('hello');");

    expect(diff.type).toBe("create");
  });
});
```

### Dependencies

- `diff-match-patch` (already installed)

### Future Enhancements

- Syntax-aware diff highlighting
- Side-by-side diff display
- Conflict resolution UI
- Git integration for commit diffs

---

## HEI-76: Improve Multi-file Patch Engine

### Overview

**Type:** Enhancement (Coding)
**Priority:** P2 High
**Labels:** `task:coding`, `agent:claude`
**Estimated Effort:** 8-14 hours

Enhance the MultiEdit tool and batch editing capabilities to support complex multi-file refactoring, atomic operations, rollback, and validation.

### Problem Statement

Current limitations:
- No atomic multi-file operations (partial failures leave repo in inconsistent state)
- No rollback mechanism if one file fails
- No validation before applying changes
- Limited to simple string replacements
- No support for AST-aware refactoring

### Solution Design

#### 1. Patch Engine: `src/tools/multi-edit/patch-engine.ts`

```typescript
import { DiffComputer, DiffModel } from "@/diff";
import { logger } from "@/seven/utils/logger";
import { readFile, writeFile, copyFile } from "fs/promises";
import { join } from "path";

export interface PatchOperation {
  filePath: string;
  operationType: "edit" | "create" | "delete" | "rename";
  oldContent?: string;
  newContent?: string;
  newPath?: string;  // For renames
}

export interface PatchSet {
  id: string;
  operations: PatchOperation[];
  description: string;
  createdAt: Date;
}

export interface PatchResult {
  success: boolean;
  appliedOperations: number;
  failedOperations: number;
  errors: Array<{ filePath: string; error: string }>;
  diff?: DiffModel;
}

export class PatchEngine {
  private backupDir: string;

  constructor(backupDir: string = "/usr/var/seven/tmp/patch-backups") {
    this.backupDir = backupDir;
  }

  async applyPatchSet(patchSet: PatchSet): Promise<PatchResult> {
    logger.info({ patchSetId: patchSet.id }, "Applying patch set");

    // Phase 1: Validate all operations
    const validationResult = await this.validatePatchSet(patchSet);
    if (!validationResult.valid) {
      return {
        success: false,
        appliedOperations: 0,
        failedOperations: patchSet.operations.length,
        errors: validationResult.errors,
      };
    }

    // Phase 2: Create backups
    await this.createBackups(patchSet);

    // Phase 3: Apply operations atomically
    try {
      const results = await this.applyOperations(patchSet.operations);
      const diff = await this.computeDiff(patchSet);

      return {
        success: true,
        appliedOperations: results.success.length,
        failedOperations: results.failed.length,
        errors: results.failed,
        diff,
      };
    } catch (error) {
      // Rollback on any failure
      await this.rollback(patchSet);
      throw error;
    }
  }

  private async validatePatchSet(
    patchSet: PatchSet
  ): Promise<{ valid: boolean; errors: Array<{ filePath: string; error: string }> }> {
    const errors: Array<{ filePath: string; error: string }> = [];

    for (const op of patchSet.operations) {
      // Check file exists (for edit/delete)
      if (op.operationType === "edit" || op.operationType === "delete") {
        try {
          await readFile(op.filePath);
        } catch {
          errors.push({ filePath: op.filePath, error: "File not found" });
        }
      }

      // Check file doesn't exist (for create)
      if (op.operationType === "create") {
        try {
          await readFile(op.filePath);
          errors.push({ filePath: op.filePath, error: "File already exists" });
        } catch {
          // Good - file doesn't exist
        }
      }

      // Validate content
      if (op.operationType === "edit" || op.operationType === "create") {
        if (!op.newContent) {
          errors.push({ filePath: op.filePath, error: "New content required" });
        }
      }
    }

    return { valid: errors.length === 0, errors };
  }

  private async createBackups(patchSet: PatchSet): Promise<void> {
    const backupPath = join(this.backupDir, patchSet.id);

    for (const op of patchSet.operations) {
      if (op.operationType === "edit" || op.operationType === "delete") {
        const content = await readFile(op.filePath, "utf-8");
        const backupFile = join(backupPath, op.filePath);
        await writeFile(backupFile, content, "utf-8");
      }
    }

    logger.info({ patchSetId: patchSet.id, backupPath }, "Backups created");
  }

  private async applyOperations(
    operations: PatchOperation[]
  ): Promise<{
    success: PatchOperation[];
    failed: Array<{ filePath: string; error: string }>;
  }> {
    const success: PatchOperation[] = [];
    const failed: Array<{ filePath: string; error: string }> = [];

    for (const op of operations) {
      try {
        await this.applyOperation(op);
        success.push(op);
      } catch (error) {
        failed.push({
          filePath: op.filePath,
          error: error.message,
        });
      }
    }

    return { success, failed };
  }

  private async applyOperation(op: PatchOperation): Promise<void> {
    switch (op.operationType) {
      case "edit":
        await writeFile(op.filePath, op.newContent!, "utf-8");
        break;
      case "create":
        await writeFile(op.filePath, op.newContent!, "utf-8");
        break;
      case "delete":
        const fs = await import("fs/promises");
        await fs.unlink(op.filePath);
        break;
      case "rename":
        await copyFile(op.filePath, op.newPath!);
        const fs2 = await import("fs/promises");
        await fs2.unlink(op.filePath);
        break;
    }

    logger.debug({ operation: op.operationType, filePath: op.filePath }, "Operation applied");
  }

  private async computeDiff(patchSet: PatchSet): Promise<DiffModel> {
    const computer = new DiffComputer();
    const changes = patchSet.operations
      .filter((op) => op.operationType === "edit")
      .map((op) => ({
        path: op.filePath,
        oldContent: op.oldContent || "",
        newContent: op.newContent || "",
      }));

    return computer.computeMultiFileDiff(changes);
  }

  async rollback(patchSet: PatchSet): Promise<void> {
    logger.warn({ patchSetId: patchSet.id }, "Rolling back patch set");

    const backupPath = join(this.backupDir, patchSet.id);

    for (const op of patchSet.operations) {
      if (op.operationType === "edit" || op.operationType === "delete") {
        const backupFile = join(backupPath, op.filePath);
        const content = await readFile(backupFile, "utf-8");
        await writeFile(op.filePath, content, "utf-8");
      } else if (op.operationType === "create") {
        const fs = await import("fs/promises");
        await fs.unlink(op.filePath);
      }
    }

    logger.info({ patchSetId: patchSet.id }, "Rollback complete");
  }
}
```

#### 2. MultiEdit Tool Rewrite: `src/tools/multi-edit/index.ts`

```typescript
import { PatchEngine, PatchSet, PatchOperation } from "./patch-engine";
import { v4 as uuidv4 } from "uuid";

export interface MultiEditParams {
  operations: Array<{
    filePath: string;
    oldString: string;
    newString: string;
  }>;
  description?: string;
}

export async function executeMultiEdit(params: MultiEditParams): Promise<any> {
  const engine = new PatchEngine();

  // Convert MultiEditParams to PatchSet
  const patchSet: PatchSet = {
    id: uuidv4(),
    description: params.description || "Multi-file edit",
    createdAt: new Date(),
    operations: await Promise.all(
      params.operations.map(async (op) => {
        const oldContent = await readFile(op.filePath, "utf-8");
        const newContent = oldContent.replace(op.oldString, op.newString);

        return {
          filePath: op.filePath,
          operationType: "edit" as const,
          oldContent,
          newContent,
        };
      })
    ),
  };

  // Apply patch set
  const result = await engine.applyPatchSet(patchSet);

  if (!result.success) {
    throw new Error(
      `Multi-edit failed: ${result.errors.map((e) => e.error).join(", ")}`
    );
  }

  return {
    success: true,
    filesChanged: result.appliedOperations,
    diff: result.diff?.toMarkdownDiffString(),
  };
}
```

#### 3. Refactoring Patterns: `src/tools/multi-edit/refactorings/`

**a) Rename Symbol (`rename-symbol.ts`)**

```typescript
import { PatchOperation } from "../patch-engine";

export async function renameSymbol(
  symbol: string,
  newName: string,
  files: string[]
): Promise<PatchOperation[]> {
  // Use AST-aware renaming
  // ... implementation
}
```

**b) Extract Function (`extract-function.ts`)**

```typescript
export async function extractFunction(
  filePath: string,
  selection: { start: number; end: number },
  functionName: string
): Promise<PatchOperation[]> {
  // Extract code block into new function
  // ... implementation
}
```

### Acceptance Criteria

- [ ] `src/tools/multi-edit/patch-engine.ts` created with PatchEngine class
- [ ] Atomic multi-file operations (all-or-nothing)
- [ ] Automatic backup creation before applying patches
- [ ] Rollback mechanism on failure
- [ ] Validation phase before applying changes
- [ ] MultiEdit tool rewritten to use PatchEngine
- [ ] Refactoring patterns: rename symbol, extract function
- [ ] Unit tests for PatchEngine
- [ ] Integration tests for MultiEdit
- [ ] Documentation updated

### Testing

```typescript
describe("PatchEngine", () => {
  it("applies patch set atomically", async () => {
    const engine = new PatchEngine();
    const patchSet: PatchSet = {
      id: "test-123",
      description: "Test patch",
      createdAt: new Date(),
      operations: [
        {
          filePath: "test1.ts",
          operationType: "edit",
          oldContent: "old",
          newContent: "new",
        },
        {
          filePath: "test2.ts",
          operationType: "edit",
          oldContent: "old",
          newContent: "new",
        },
      ],
    };

    const result = await engine.applyPatchSet(patchSet);

    expect(result.success).toBe(true);
    expect(result.appliedOperations).toBe(2);
  });

  it("rolls back on failure", async () => {
    const engine = new PatchEngine();
    const patchSet: PatchSet = {
      id: "test-456",
      description: "Test rollback",
      createdAt: new Date(),
      operations: [
        {
          filePath: "test1.ts",
          operationType: "edit",
          oldContent: "old",
          newContent: "new",
        },
        {
          filePath: "nonexistent.ts",
          operationType: "edit",
          oldContent: "old",
          newContent: "new",
        },
      ],
    };

    await expect(engine.applyPatchSet(patchSet)).rejects.toThrow();

    // Verify test1.ts was rolled back
    const content = await readFile("test1.ts", "utf-8");
    expect(content).toBe("old");
  });
});
```

### Dependencies

- HEI-75 (Diff-Model) — Required for diff computation

### Future Enhancements

- AST-aware refactoring (TypeScript, JavaScript)
- Interactive patch review mode
- Patch history and undo/redo
- Conflict detection and resolution

---

## HEI-77: Add Agent Routing + Prompt Forwarding

### Overview

**Type:** Architecture + Coding
**Priority:** P2 High
**Labels:** `task:coding`, `task:architecture`, `agent:claude`, `agent:chatgpt`
**Estimated Effort:** 12-16 hours

Implement a routing system that intelligently forwards prompts to the most appropriate agent (Seven, DeepAgent, Gemini, Claude, etc.) based on task type, context, and agent capabilities.

### Problem Statement

Currently, Claude Code uses a single LLM backend. The Seven Integration adds multiple LLM adapters, but there's no intelligent routing:
- All requests go to Claude by default
- No way to leverage specialized agents (DeepAgent for analysis, Gemini for coding)
- Manual agent selection is cumbersome
- No fallback if primary agent is unavailable

### Solution Design

#### 1. Agent Registry: `src/seven/routing/agent-registry.ts`

```typescript
export interface AgentCapabilities {
  tasks: string[];          // ["coding", "analysis", "debugging", "documentation"]
  languages: string[];      // ["typescript", "python", "rust"]
  speed: "fast" | "medium" | "slow";
  cost: "low" | "medium" | "high";
  contextWindow: number;    // Token limit
  streaming: boolean;
}

export interface AgentConfig {
  name: string;
  adapter: string;          // "claude", "gemini", "openai", etc.
  capabilities: AgentCapabilities;
  priority: number;         // Higher = preferred
  available: () => Promise<boolean>;
}

export class AgentRegistry {
  private agents: Map<string, AgentConfig>;

  constructor() {
    this.agents = new Map();
    this.registerDefaultAgents();
  }

  registerAgent(config: AgentConfig): void {
    this.agents.set(config.name, config);
  }

  getAgent(name: string): AgentConfig | undefined {
    return this.agents.get(name);
  }

  listAgents(): AgentConfig[] {
    return Array.from(this.agents.values());
  }

  findAgentsByCapability(capability: string): AgentConfig[] {
    return Array.from(this.agents.values()).filter((agent) =>
      agent.capabilities.tasks.includes(capability)
    );
  }

  private registerDefaultAgents(): void {
    // Claude
    this.registerAgent({
      name: "claude",
      adapter: "claude",
      capabilities: {
        tasks: ["coding", "analysis", "debugging", "documentation", "refactoring"],
        languages: ["typescript", "javascript", "python", "rust", "go", "java"],
        speed: "medium",
        cost: "high",
        contextWindow: 200000,
        streaming: true,
      },
      priority: 10,
      available: async () => !!process.env.ANTHROPIC_API_KEY,
    });

    // Gemini
    this.registerAgent({
      name: "gemini",
      adapter: "gemini",
      capabilities: {
        tasks: ["coding", "analysis", "documentation"],
        languages: ["typescript", "javascript", "python", "go"],
        speed: "fast",
        cost: "low",
        contextWindow: 100000,
        streaming: true,
      },
      priority: 8,
      available: async () => !!process.env.GOOGLE_API_KEY,
    });

    // DeepAgent
    this.registerAgent({
      name: "deepagent",
      adapter: "deepagent",
      capabilities: {
        tasks: ["analysis", "architecture", "documentation"],
        languages: ["typescript", "javascript", "python"],
        speed: "slow",
        cost: "medium",
        contextWindow: 128000,
        streaming: false,
      },
      priority: 9,
      available: async () => true,  // Always available (local)
    });

    // OpenAI
    this.registerAgent({
      name: "openai",
      adapter: "openai",
      capabilities: {
        tasks: ["coding", "debugging", "documentation"],
        languages: ["typescript", "javascript", "python", "rust"],
        speed: "medium",
        cost: "medium",
        contextWindow: 128000,
        streaming: true,
      },
      priority: 7,
      available: async () => !!process.env.OPENAI_API_KEY,
    });
  }
}
```

#### 2. Agent Router: `src/seven/routing/agent-router.ts`

```typescript
import { AgentRegistry, AgentConfig } from "./agent-registry";
import { logger } from "@/seven/utils/logger";

export interface RoutingContext {
  task: string;               // "coding", "debugging", "analysis"
  language?: string;          // "typescript", "python", etc.
  complexity?: "low" | "medium" | "high";
  urgency?: "low" | "medium" | "high";
  budget?: "low" | "medium" | "high";
  preferredAgent?: string;
}

export interface RoutingDecision {
  agent: AgentConfig;
  reason: string;
  fallbacks: AgentConfig[];
}

export class AgentRouter {
  constructor(private registry: AgentRegistry) {}

  async route(context: RoutingContext): Promise<RoutingDecision> {
    logger.info({ context }, "Routing request");

    // 1. If user specified preferred agent, use it
    if (context.preferredAgent) {
      const agent = this.registry.getAgent(context.preferredAgent);
      if (agent && (await agent.available())) {
        return {
          agent,
          reason: "User-specified agent",
          fallbacks: await this.getFallbacks(agent, context),
        };
      }
    }

    // 2. Find candidates by capability
    const candidates = this.registry.findAgentsByCapability(context.task);

    // 3. Filter by language if specified
    const filtered = context.language
      ? candidates.filter((a) => a.capabilities.languages.includes(context.language!))
      : candidates;

    // 4. Filter by availability
    const available = [];
    for (const agent of filtered) {
      if (await agent.available()) {
        available.push(agent);
      }
    }

    if (available.length === 0) {
      throw new Error(`No available agents for task: ${context.task}`);
    }

    // 5. Score and select best agent
    const scored = available.map((agent) => ({
      agent,
      score: this.scoreAgent(agent, context),
    }));

    scored.sort((a, b) => b.score - a.score);

    const selected = scored[0].agent;

    return {
      agent: selected,
      reason: this.buildReason(selected, context, scored[0].score),
      fallbacks: scored.slice(1, 3).map((s) => s.agent),
    };
  }

  private scoreAgent(agent: AgentConfig, context: RoutingContext): number {
    let score = agent.priority * 10;

    // Speed bonus
    if (context.urgency === "high" && agent.capabilities.speed === "fast") {
      score += 20;
    }

    // Cost penalty
    if (context.budget === "low" && agent.capabilities.cost === "high") {
      score -= 15;
    }

    // Complexity bonus
    if (context.complexity === "high" && agent.capabilities.contextWindow > 100000) {
      score += 10;
    }

    return score;
  }

  private buildReason(agent: AgentConfig, context: RoutingContext, score: number): string {
    return `Selected ${agent.name} (score: ${score}) for ${context.task} task`;
  }

  private async getFallbacks(
    primary: AgentConfig,
    context: RoutingContext
  ): Promise<AgentConfig[]> {
    const candidates = this.registry.findAgentsByCapability(context.task);
    const available = [];

    for (const agent of candidates) {
      if (agent.name !== primary.name && (await agent.available())) {
        available.push(agent);
      }
    }

    return available.slice(0, 2);
  }
}
```

#### 3. Prompt Forwarder: `src/seven/routing/prompt-forwarder.ts`

```typescript
import { AgentRouter, RoutingContext, RoutingDecision } from "./agent-router";
import { LLMAdapter } from "@/seven/adapters/base-adapter";
import { logger } from "@/seven/utils/logger";

export interface ForwardResult {
  response: string;
  agent: string;
  fallbackUsed: boolean;
}

export class PromptForwarder {
  constructor(
    private router: AgentRouter,
    private adapters: Map<string, LLMAdapter>
  ) {}

  async forward(
    prompt: string,
    context: RoutingContext
  ): Promise<ForwardResult> {
    const decision = await this.router.route(context);

    logger.info({ agent: decision.agent.name, reason: decision.reason }, "Forwarding prompt");

    try {
      const adapter = this.adapters.get(decision.agent.adapter);
      if (!adapter) {
        throw new Error(`Adapter not found: ${decision.agent.adapter}`);
      }

      const response = await adapter.send(prompt);

      return {
        response,
        agent: decision.agent.name,
        fallbackUsed: false,
      };
    } catch (error) {
      logger.warn({ error, agent: decision.agent.name }, "Primary agent failed, trying fallback");

      // Try fallbacks
      for (const fallback of decision.fallbacks) {
        try {
          const adapter = this.adapters.get(fallback.adapter);
          if (!adapter) continue;

          const response = await adapter.send(prompt);

          logger.info({ fallback: fallback.name }, "Fallback succeeded");

          return {
            response,
            agent: fallback.name,
            fallbackUsed: true,
          };
        } catch {
          continue;
        }
      }

      throw new Error("All agents failed");
    }
  }
}
```

#### 4. CLI Commands

```bash
# List available agents
/agent list

# Set preferred agent
/agent set claude
/agent set gemini
/agent set deepagent

# Show current agent
/agent current

# Enable auto-routing
/agent auto

# Disable auto-routing
/agent manual
```

### Acceptance Criteria

- [ ] `src/seven/routing/agent-registry.ts` created with AgentRegistry class
- [ ] `src/seven/routing/agent-router.ts` created with AgentRouter class
- [ ] `src/seven/routing/prompt-forwarder.ts` created with PromptForwarder class
- [ ] Agent scoring algorithm implemented
- [ ] Fallback mechanism for agent failures
- [ ] CLI commands: `/agent list`, `/agent set`, `/agent current`, `/agent auto`
- [ ] Integration with Seven Bridge daemon
- [ ] Auto-routing based on task context
- [ ] Unit tests for AgentRouter (scoring, fallback)
- [ ] Integration tests for PromptForwarder
- [ ] Documentation updated

### Testing

```typescript
describe("AgentRouter", () => {
  it("routes coding task to Claude", async () => {
    const registry = new AgentRegistry();
    const router = new AgentRouter(registry);

    const decision = await router.route({
      task: "coding",
      language: "typescript",
      complexity: "high",
    });

    expect(decision.agent.name).toBe("claude");
    expect(decision.fallbacks.length).toBeGreaterThan(0);
  });

  it("uses fallback when primary fails", async () => {
    const forwarder = new PromptForwarder(router, adapters);

    // Mock primary agent failure
    const result = await forwarder.forward("test prompt", {
      task: "coding",
    });

    expect(result.fallbackUsed).toBe(true);
  });
});
```

### Dependencies

- None (standalone feature)

### Future Enhancements

- Machine learning-based routing (learn from past successes)
- Cost optimization (prefer cheaper agents when appropriate)
- Agent performance metrics and dashboards
- Custom routing rules per project

---

## Summary

All 5 specifications are now complete and implementation-ready:

- ✅ **HEI-72:** Output Styles Configuration System
- ✅ **HEI-73:** Cody Multi-Mode Logic (Tactical Variants)
- ✅ **HEI-75:** Diff-Model Refactor (Clarity + Testing)
- ✅ **HEI-76:** Multi-file Patch Engine (Atomic + Rollback)
- ✅ **HEI-77:** Agent Routing + Prompt Forwarding

Each specification includes:
- Problem statement
- Solution design with code examples
- Acceptance criteria
- Testing strategy
- Dependencies
- Future enhancements

These specs can be implemented independently or in sequence. Recommended order:
1. **HEI-75** (foundation for HEI-76)
2. **HEI-72** (foundation for HEI-73)
3. **HEI-73** (integrates with HEI-72)
4. **HEI-76** (uses HEI-75)
5. **HEI-77** (standalone, can be parallel)

---

**Specifications Complete**
**Ready for Implementation**

🤖 Generated by CLI Claude (Specification Architect)
