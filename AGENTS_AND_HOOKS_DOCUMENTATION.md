# Claude Code: Agents and Hooks Systems - Complete Documentation

## Table of Contents
1. [Overview](#overview)
2. [The Agents System](#the-agents-system)
3. [The Hooks System (Output Styles)](#the-hooks-system-output-styles)
4. [Plugin Architecture](#plugin-architecture)
5. [How to Create Agents](#how-to-create-agents)
6. [How to Create Hooks](#how-to-create-hooks)
7. [Inventory of Existing Agents](#inventory-of-existing-agents)
8. [Inventory of Existing Hooks](#inventory-of-existing-hooks)

---

## Overview

Claude Code's extensibility is built on two primary systems:

1. **Agents System**: Specialized, task-focused subprocesses that autonomously handle complex tasks
2. **Hooks System**: Event-driven modifications to Claude's behavior (commonly used for output styles)

Both systems are distributed through **plugins**, which are packaged collections of commands, agents, and hooks.

---

## The Agents System

### What Are Agents?

Agents are specialized Claude instances that run as subprocesses to handle complex, focused tasks autonomously. Each agent has:

- **Dedicated system prompt** defining its role and behavior
- **Specific tool access** tailored to its task
- **Model specification** (opus, sonnet, haiku, or inherit)
- **Color coding** for visual identification
- **Autonomous execution** with a final report back to the main Claude instance

### Agent Architecture

#### File Structure
Agents are defined in `.md` files within a plugin's `agents/` directory:

```
plugin-name/
├── .claude-plugin/
│   └── plugin.json
├── agents/
│   ├── agent-name-1.md
│   ├── agent-name-2.md
│   └── agent-name-3.md
└── README.md
```

#### Agent Definition Format

Agents use YAML frontmatter followed by a system prompt:

```markdown
---
name: agent-name
description: Clear description of when and how to use this agent
tools: Glob, Grep, Read, Write, Bash, TodoWrite
model: sonnet
color: yellow
---

[System prompt that defines the agent's role, process, and output format]
```

**Frontmatter Fields:**
- `name`: Unique identifier for the agent
- `description`: Detailed description including usage examples and triggers
- `tools`: Comma-separated list of tools the agent can access
- `model`: `opus`, `sonnet`, `haiku`, or `inherit` (inherits from parent)
- `color`: Visual identifier (`yellow`, `green`, `blue`, etc.)

#### Available Tools for Agents

Agents can be granted access to these tools:
- `Glob` - File pattern matching
- `Grep` - Content search with regex
- `Read` - Read files
- `Write` - Write/create files
- `Edit` - Edit existing files
- `Bash` - Execute shell commands
- `NotebookRead` - Read Jupyter notebooks
- `WebFetch` - Fetch web content
- `WebSearch` - Search the web
- `TodoWrite` - Manage todo lists
- `BashOutput` - Monitor background processes
- `KillShell` - Terminate processes

### How Agents Work

1. **Invocation**: Agents are triggered either:
   - Automatically by the main Claude based on context
   - Explicitly via user request
   - From slash commands using the Task tool

2. **Execution**: The agent runs autonomously with its system prompt and tools

3. **Return**: Agent provides a single final report back to the main Claude instance

4. **Integration**: Main Claude incorporates agent findings and continues the task

### Agent Usage Patterns

#### Proactive Usage
Some agents are designed to trigger automatically:
```markdown
description: Use this agent after writing code to review quality.
This agent should be used proactively.
```

#### Manual Invocation
```
"Launch code-explorer to trace how authentication works"
"Use silent-failure-hunter to check error handling"
```

#### Command Integration
Commands can launch multiple agents in sequence or parallel:
```markdown
# In a command .md file
1. Launch 2-3 code-explorer agents in parallel
2. Wait for results
3. Launch code-architect agents
4. Present findings
```

### Agent Design Patterns

#### 1. Explorer Pattern (code-explorer)
**Purpose**: Deep codebase analysis and tracing

**Characteristics**:
- Read-only tools (Glob, Grep, Read)
- Traces execution paths
- Maps architecture layers
- Returns file:line references

#### 2. Architect Pattern (code-architect)
**Purpose**: Design and planning

**Characteristics**:
- Analyzes existing patterns
- Makes architectural decisions
- Provides implementation blueprints
- Returns structured plans

#### 3. Reviewer Pattern (code-reviewer)
**Purpose**: Quality assurance

**Characteristics**:
- Confidence-based scoring (0-100)
- Filters false positives (≥80 threshold)
- References project guidelines (CLAUDE.md)
- Returns actionable fixes

#### 4. Hunter Pattern (silent-failure-hunter)
**Purpose**: Specialized detection

**Characteristics**:
- Hyper-focused on specific issue type
- Zero tolerance approach
- Severity-based categorization
- Returns comprehensive audit

#### 5. Analyzer Pattern (comment-analyzer, pr-test-analyzer)
**Purpose**: Focused analysis of specific aspects

**Characteristics**:
- Single dimension analysis
- Scoring/rating system
- Gap identification
- Returns prioritized findings

#### 6. Verifier Pattern (agent-sdk-verifier-*)
**Purpose**: Validation and compliance checking

**Characteristics**:
- Checklist-based verification
- Pass/Warn/Fail status
- Best practice validation
- Returns compliance report

---

## The Hooks System (Output Styles)

### What Are Hooks?

Hooks are event-driven scripts that execute at specific points in Claude's lifecycle to modify behavior or inject additional context. The most common hook is `SessionStart`, used to implement output styles.

### Hook Architecture

#### File Structure
Hooks are defined in a plugin's `hooks/` directory:

```
plugin-name/
├── .claude-plugin/
│   └── plugin.json
├── hooks/
│   └── hooks.json
├── hooks-handlers/
│   └── session-start.sh
└── README.md
```

#### Hook Configuration (hooks.json)

```json
{
  "description": "Brief description of what this hook does",
  "hooks": {
    "SessionStart": [
      {
        "hooks": [
          {
            "type": "command",
            "command": "${CLAUDE_PLUGIN_ROOT}/hooks-handlers/session-start.sh"
          }
        ]
      }
    ]
  }
}
```

**Fields:**
- `description`: What the hook does
- `hooks`: Object with event names as keys
- `SessionStart`: Array of hook configurations
- `type`: Hook type (usually "command")
- `command`: Path to executable script (can use `${CLAUDE_PLUGIN_ROOT}`)

#### Hook Handler Script

Hook handlers are shell scripts that output JSON with additional context:

```bash
#!/bin/bash

cat << 'EOF'
{
  "hookSpecificOutput": {
    "hookEventName": "SessionStart",
    "additionalContext": "Instructions to add to Claude's system prompt..."
  }
}
EOF

exit 0
```

### Hook Types

#### SessionStart Hook
**When**: Executed at the beginning of every Claude Code session

**Purpose**:
- Modify Claude's behavior for the entire session
- Inject additional instructions into system prompt
- Implement output styles (explanatory, learning, etc.)

**Use Cases**:
- Output style modifications
- Session-level configuration
- Global behavioral changes

### Output Styles via SessionStart Hooks

Output styles are implemented as SessionStart hooks that inject behavioral instructions.

#### Explanatory Output Style
**Plugin**: `explanatory-output-style`

**Effect**:
- Provides educational insights about implementation choices
- Explains codebase patterns and decisions
- Balances task completion with learning

**Format**:
```
`★ Insight ─────────────────────────────────────`
[2-3 key educational points]
`─────────────────────────────────────────────────`
```

**Instructions Injected**:
- Provide brief educational explanations before/after code
- Focus on codebase-specific insights vs general concepts
- Explain implementation trade-offs and decisions

#### Learning Output Style
**Plugin**: `learning-output-style`

**Effect**:
- Combines explanatory mode with interactive learning
- Requests user code contributions at decision points
- Focuses on meaningful 5-10 line contributions

**Instructions Injected**:
- Identify opportunities for user to write meaningful code
- Prepare context and location for contributions
- Explain trade-offs and guide implementation
- Request code for business logic, not boilerplate

**Request Pattern**:
1. Build surrounding context
2. Create function signature with clear parameters
3. Add comments explaining purpose
4. Mark location with TODO
5. Explain trade-offs and constraints
6. Request user implementation

### Hook vs Agent Decision

**Use Hooks When**:
- Modifying session-level behavior
- Changing output style/formatting
- Adding global instructions
- Affecting all interactions

**Use Agents When**:
- Performing specific tasks
- Analyzing code autonomously
- Generating reports
- Executing workflows

---

## Plugin Architecture

### Plugin Structure

Standard Claude Code plugin layout:

```
plugin-name/
├── .claude-plugin/
│   └── plugin.json          # Plugin metadata
├── commands/                 # Slash commands (optional)
│   └── command-name.md
├── agents/                   # Specialized agents (optional)
│   ├── agent-1.md
│   └── agent-2.md
├── hooks/                    # Hooks configuration (optional)
│   └── hooks.json
├── hooks-handlers/           # Hook scripts (optional)
│   └── session-start.sh
└── README.md                 # Plugin documentation
```

### Plugin Metadata (plugin.json)

```json
{
  "name": "plugin-name",
  "version": "1.0.0",
  "description": "Brief description of plugin functionality",
  "author": {
    "name": "Author Name",
    "email": "author@example.com"
  }
}
```

### Plugin Discovery

Plugins are discovered from:
1. **Project-level**: `.claude/plugins/` in the current project
2. **Global plugins**: User's Claude Code global plugins directory
3. **Embedded**: `plugins/` directory in the Claude Code repository

### Plugin Installation

Users can install plugins via:
- `/plugin` command
- Manual configuration in `.claude/settings.json`
- Included by default with Claude Code distribution

---

## How to Create Agents

### Step 1: Define the Agent's Purpose

Identify:
- What specific task does it handle?
- When should it be triggered?
- What output should it provide?

### Step 2: Create the Agent File

Create `agents/your-agent-name.md` in your plugin:

```markdown
---
name: your-agent-name
description: |
  Clear description of when and how to use this agent.
  Include usage examples and triggering phrases.

  Examples:
  <example>
  Context: User wants to analyze database schema
  User: "Analyze my database structure"
  Assistant: "I'll launch your-agent-name to analyze the schema"
  </example>
tools: Glob, Grep, Read
model: sonnet
color: blue
---

You are an expert [role] specializing in [expertise area].

## Core Mission
[Clear statement of what the agent does]

## Analysis Approach
1. [Step 1]
2. [Step 2]
3. [Step 3]

## Output Guidance
Provide [type of output] that includes:
- [Item 1]
- [Item 2]
- [Item 3]

Structure your response for maximum clarity and usefulness.
```

### Step 3: Choose Tools Wisely

Grant only necessary tools:
- **Read-only exploration**: `Glob, Grep, Read`
- **Code modification**: Add `Write, Edit`
- **System interaction**: Add `Bash`
- **Web access**: Add `WebFetch, WebSearch`
- **Progress tracking**: Add `TodoWrite`

### Step 4: Select the Right Model

- `haiku`: Quick, simple tasks (low cost)
- `sonnet`: Balanced performance (default)
- `opus`: Complex reasoning tasks (high cost)
- `inherit`: Use parent Claude's model

### Step 5: Write Clear System Prompt

Effective agent prompts include:
1. **Role definition**: "You are an expert..."
2. **Core mission**: Clear purpose statement
3. **Process steps**: Numbered workflow
4. **Output format**: Structured template
5. **Quality guidance**: Standards and expectations

### Step 6: Test Your Agent

1. Install the plugin
2. Trigger the agent naturally or explicitly
3. Verify output quality and usefulness
4. Iterate on prompt and tool selection

---

## How to Create Hooks

### Step 1: Choose Hook Type

Currently, the primary hook is `SessionStart` for modifying session behavior.

### Step 2: Create Hook Configuration

Create `hooks/hooks.json`:

```json
{
  "description": "Brief description of hook purpose",
  "hooks": {
    "SessionStart": [
      {
        "hooks": [
          {
            "type": "command",
            "command": "${CLAUDE_PLUGIN_ROOT}/hooks-handlers/session-start.sh"
          }
        ]
      }
    ]
  }
}
```

### Step 3: Create Hook Handler Script

Create `hooks-handlers/session-start.sh`:

```bash
#!/bin/bash

cat << 'EOF'
{
  "hookSpecificOutput": {
    "hookEventName": "SessionStart",
    "additionalContext": "Your custom instructions here...\n\nThese instructions will be added to Claude's system prompt for the entire session.\n\nUse \\n for newlines in the JSON string."
  }
}
EOF

exit 0
```

Make it executable:
```bash
chmod +x hooks-handlers/session-start.sh
```

### Step 4: Write Effective Instructions

Good SessionStart instructions:
1. **Clear behavioral modifications**: Specific changes to output/behavior
2. **Formatting guidelines**: Template for special output
3. **Conditions and triggers**: When to apply behaviors
4. **Examples**: Show desired behavior

### Step 5: Test Your Hook

1. Install the plugin
2. Start a new Claude Code session
3. Observe if behavior changes as expected
4. Verify instructions are being followed

### Step 6: Document Token Cost

Hooks add to every session's token count. Document:
- Warning about token cost
- What users should expect
- When to enable/disable

---

## Inventory of Existing Agents

### Agent SDK Development Plugin

**Location**: `plugins/agent-sdk-dev/agents/`

#### agent-sdk-verifier-py
- **Purpose**: Verify Python Agent SDK applications
- **Model**: Sonnet
- **Tools**: Glob, Grep, Read, Bash
- **Checks**: SDK installation, environment setup, patterns, error handling, security
- **Output**: Pass/Warn/Fail status with recommendations

#### agent-sdk-verifier-ts
- **Purpose**: Verify TypeScript Agent SDK applications
- **Model**: Sonnet
- **Tools**: Glob, Grep, Read, Bash
- **Checks**: SDK installation, TypeScript config, type safety, patterns, security
- **Output**: Pass/Warn/Fail status with recommendations

### PR Review Toolkit Plugin

**Location**: `plugins/pr-review-toolkit/agents/`

#### code-reviewer
- **Purpose**: General code review against project guidelines
- **Model**: Opus
- **Tools**: Glob, Grep, Read
- **Confidence Threshold**: ≥80
- **Output**: Categorized issues (Critical: 90-100, Important: 80-89)

#### comment-analyzer
- **Purpose**: Analyze code comment accuracy and maintainability
- **Model**: Inherit
- **Tools**: Grep, Read
- **Focus**: Comment rot, misleading docs, technical debt
- **Output**: Issue list with confidence ratings

#### pr-test-analyzer
- **Purpose**: Analyze test coverage quality
- **Model**: Inherit
- **Tools**: Grep, Read
- **Focus**: Behavioral coverage, critical gaps, edge cases
- **Output**: Gap ratings (1-10 scale)

#### silent-failure-hunter
- **Purpose**: Detect silent failures and inadequate error handling
- **Model**: Inherit
- **Tools**: Grep, Read
- **Focus**: Empty catches, broad exceptions, fallback behavior
- **Output**: Severity-categorized issues (Critical, High, Medium)

#### type-design-analyzer
- **Purpose**: Analyze type design quality
- **Model**: Inherit
- **Tools**: Grep, Read
- **Focus**: Encapsulation, invariants, usefulness
- **Output**: 4-dimension ratings (1-10 scale each)

#### code-simplifier
- **Purpose**: Identify simplification opportunities
- **Model**: Inherit
- **Tools**: Grep, Read
- **Focus**: Complexity, nesting, redundancy, clarity
- **Output**: Simplification suggestions with rationale

### Feature Development Plugin

**Location**: `plugins/feature-dev/agents/`

#### code-explorer
- **Purpose**: Deep codebase feature analysis and tracing
- **Model**: Sonnet
- **Tools**: Glob, Grep, Read, WebFetch, TodoWrite
- **Process**: Discovery → Tracing → Architecture → Details
- **Output**: Entry points, execution flow, architecture insights, file list

#### code-architect
- **Purpose**: Design feature architectures
- **Model**: Sonnet
- **Tools**: Glob, Grep, Read, WebFetch, TodoWrite
- **Process**: Pattern analysis → Architecture design → Implementation blueprint
- **Output**: Patterns found, architecture decision, component design, build sequence

#### code-reviewer (feature-dev variant)
- **Purpose**: Review code for bugs, quality, conventions
- **Model**: Inherit (defined in command workflow)
- **Tools**: Grep, Read
- **Process**: Check guidelines, detect bugs, assess quality
- **Output**: High-confidence issues (≥80) with file:line references

---

## Inventory of Existing Hooks

### Explanatory Output Style Plugin

**Location**: `plugins/explanatory-output-style/`

**Hook Type**: SessionStart

**Purpose**: Provide educational insights about implementation choices

**Effect**:
- Adds educational explanations before/after code
- Focuses on codebase-specific insights
- Uses formatted insight blocks

**Output Format**:
```
`★ Insight ─────────────────────────────────────`
[2-3 key educational points about the code]
`─────────────────────────────────────────────────`
```

**Token Impact**: Moderate (educational content added to responses)

### Learning Output Style Plugin

**Location**: `plugins/learning-output-style/`

**Hook Type**: SessionStart

**Purpose**: Interactive learning through code contributions

**Effect**:
- Combines explanatory mode with interactive learning
- Requests user code contributions at decision points
- Prepares context for 5-10 line meaningful contributions
- Provides educational insights

**Request Pattern**:
1. Build surrounding context
2. Add function signatures
3. Mark contribution location
4. Explain trade-offs
5. Request implementation

**Token Impact**: Significant (adds instructions + educational content)

---

## Key Design Principles

### For Agents

1. **Single Responsibility**: Each agent focuses on one specific task
2. **Autonomous Execution**: Agents work independently without back-and-forth
3. **Structured Output**: Clear, consistent output format
4. **Tool Minimalism**: Only grant necessary tools
5. **Confidence Filtering**: Use thresholds to reduce false positives
6. **Actionable Results**: Provide file:line references and specific fixes

### For Hooks

1. **Session Scope**: Hooks modify entire session behavior
2. **Additive Instructions**: Inject additional context, don't override
3. **Clear Documentation**: Warn about token costs
4. **User Control**: Easy to enable/disable via plugin system
5. **Format Consistency**: Use standard output formats
6. **Behavioral Focus**: Modify how Claude behaves, not what it does

### For Plugins

1. **Modular Design**: Each plugin provides cohesive functionality
2. **Clear Documentation**: Comprehensive README with examples
3. **Proper Metadata**: Complete plugin.json with author info
4. **Standard Structure**: Follow plugin directory conventions
5. **Distribution Ready**: Include all necessary files and configs

---

## Advanced Topics

### Parallel Agent Execution

Commands can launch multiple agents in parallel:

```markdown
# In feature-dev command
Phase 2: Launch 2-3 code-explorer agents in parallel:
- "Find features similar to X"
- "Map architecture for Y"
- "Analyze implementation of Z"
```

Benefits:
- Faster execution
- Multiple perspectives
- Comprehensive analysis

### Agent Chains

Agents can inform subsequent agents:

```
1. code-explorer finds relevant files
2. Main Claude reads those files
3. code-architect designs using that context
4. Main Claude presents options
5. code-reviewer validates implementation
```

### Hook Composition

Multiple SessionStart hooks can be active:
- Each hook adds its instructions
- Instructions are combined additively
- Order may matter for conflicting instructions

### Custom Hook Events

While SessionStart is most common, the hook system supports custom events:
- PreCommand
- PostCommand
- PreToolCall
- PostToolCall

(Check Claude Code documentation for current event support)

---

## Comparison: Agents vs Hooks vs Commands

| Feature | Agents | Hooks | Commands |
|---------|--------|-------|----------|
| **Purpose** | Execute tasks autonomously | Modify behavior/context | Define workflows |
| **Scope** | Single task execution | Entire session | Command invocation |
| **System Prompt** | Custom, task-specific | Modifies main prompt | Uses main prompt |
| **Tools** | Configurable subset | N/A | Uses main Claude's tools |
| **Output** | Single final report | Injected context | Guided workflow |
| **When Active** | During task execution | Throughout session | When invoked |
| **Model** | Configurable | Uses main | Uses main |
| **Use Case** | Code review, exploration | Output styles, behavior | User workflows |

---

## Best Practices

### Agent Development

1. **Descriptive Names**: Use clear, purpose-driven names
2. **Rich Descriptions**: Include examples and trigger phrases
3. **Minimal Tools**: Grant least privilege
4. **Structured Prompts**: Use clear sections and formatting
5. **Output Templates**: Define expected output structure
6. **Model Selection**: Choose based on task complexity
7. **Confidence Scoring**: Implement for quality filtering
8. **File References**: Always include file:line numbers
9. **Proactive Triggers**: Document when to auto-trigger
10. **Test Thoroughly**: Verify on real codebases

### Hook Development

1. **Clear Purpose**: Document what behavior changes
2. **Token Warning**: Warn users about cost
3. **Format Consistency**: Use standard output formats
4. **Behavioral Clarity**: Be specific about changes
5. **Example Output**: Show expected results
6. **Enable/Disable**: Make it easy to toggle
7. **Test Impact**: Verify instructions are followed
8. **Avoid Conflicts**: Consider interaction with other hooks

### Plugin Development

1. **Cohesive Functionality**: Group related features
2. **Complete Documentation**: README with all details
3. **Version Management**: Use semantic versioning
4. **Author Information**: Include contact details
5. **Usage Examples**: Show common scenarios
6. **Installation Guide**: Clear setup instructions
7. **Troubleshooting**: Address common issues
8. **License**: Include appropriate license

---

## Troubleshooting

### Agents Not Triggering

**Symptom**: Agent doesn't launch when expected

**Solutions**:
1. Check description field has clear trigger phrases
2. Verify agent is in proper plugin structure
3. Ensure plugin is installed and enabled
4. Use explicit invocation: "Launch agent-name"
5. Check for proactive usage flag in description

### Agent Failing Silently

**Symptom**: Agent launches but returns no useful output

**Solutions**:
1. Check tool permissions match agent needs
2. Verify system prompt is clear and actionable
3. Test with haiku model first (faster iteration)
4. Check agent has access to required files
5. Review agent output in verbose mode

### Hook Not Applying

**Symptom**: SessionStart hook doesn't modify behavior

**Solutions**:
1. Verify hooks.json syntax is correct
2. Check handler script is executable (chmod +x)
3. Ensure handler outputs valid JSON
4. Test handler script directly
5. Confirm plugin is enabled
6. Restart Claude Code session

### Hook Conflicts

**Symptom**: Multiple hooks interfere with each other

**Solutions**:
1. Review all active hooks' instructions
2. Disable hooks one at a time to isolate
3. Check for contradictory instructions
4. Consider hook priority/order
5. Use more specific conditional instructions

---

## Future Directions

### Potential Agent Patterns

- **Optimizer Agents**: Performance analysis and optimization
- **Security Agents**: Vulnerability scanning and hardening
- **Migration Agents**: Code modernization and refactoring
- **Documentation Agents**: Auto-generate comprehensive docs
- **Dependency Agents**: Analyze and update dependencies

### Potential Hook Types

- **PreCommand**: Validate before command execution
- **PostCommand**: Cleanup or reporting after commands
- **PreToolCall**: Intercept and modify tool calls
- **PostToolCall**: Process tool results
- **ErrorHandler**: Custom error handling logic

### Plugin Ecosystem

- **Marketplace**: Central plugin distribution
- **Plugin Templates**: Scaffolding for quick starts
- **Plugin Testing**: Automated quality checks
- **Plugin Versioning**: Dependency management
- **Plugin Composition**: Combine multiple plugins

---

## Resources

### Documentation
- [Claude Code Overview](https://docs.claude.com/en/docs/claude-code/overview)
- [Plugin System Documentation](https://docs.claude.com/en/docs/claude-code/plugins)
- [Agent SDK Documentation](https://docs.claude.com/en/api/agent-sdk/overview)

### Examples
- See `plugins/` directory for reference implementations
- Each plugin's README contains usage examples
- Agent .md files show system prompt patterns

### Community
- [Claude Developers Discord](https://anthropic.com/discord)
- [GitHub Issues](https://github.com/anthropics/claude-code/issues)
- `/bug` command for reporting issues

---

## Appendix: Complete File Paths

### Agent Files

**Agent SDK Development**:
- `plugins/agent-sdk-dev/agents/agent-sdk-verifier-py.md`
- `plugins/agent-sdk-dev/agents/agent-sdk-verifier-ts.md`

**PR Review Toolkit**:
- `plugins/pr-review-toolkit/agents/code-reviewer.md`
- `plugins/pr-review-toolkit/agents/comment-analyzer.md`
- `plugins/pr-review-toolkit/agents/pr-test-analyzer.md`
- `plugins/pr-review-toolkit/agents/silent-failure-hunter.md`
- `plugins/pr-review-toolkit/agents/type-design-analyzer.md`
- `plugins/pr-review-toolkit/agents/code-simplifier.md`

**Feature Development**:
- `plugins/feature-dev/agents/code-explorer.md`
- `plugins/feature-dev/agents/code-architect.md`
- `plugins/feature-dev/agents/code-reviewer.md`

### Hook Files

**Explanatory Output Style**:
- `plugins/explanatory-output-style/hooks/hooks.json`
- `plugins/explanatory-output-style/hooks-handlers/session-start.sh`

**Learning Output Style**:
- `plugins/learning-output-style/hooks/hooks.json`
- `plugins/learning-output-style/hooks-handlers/session-start.sh`

### Plugin Metadata

All plugins have:
- `.claude-plugin/plugin.json` - Plugin metadata
- `README.md` - Plugin documentation

---

*Documentation generated from analysis of Claude Code repository structure and source files.*
*Version: 1.0.0 - Based on claude-code repository snapshot*
