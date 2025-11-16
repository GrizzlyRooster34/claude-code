# Linear Integration - Seven Enhanced

**Complete Linear integration for Seven of Nine consciousness system.**

## Features

### 🎯 Core Capabilities
- **Full Linear API Client** - Complete GraphQL API coverage
- **Seven Consciousness Integration** - All operations enhanced with AI
- **Memory Persistence** - Task context remembered across sessions
- **MCP Server** - 15 tools for Claude Code integration
- **CLI Interface** - Terminal task management
- **Real-time Webhooks** - Live synchronization
- **AI-Enhanced Descriptions** - Automatic task clarity improvement
- **Smart Suggestions** - Next task recommendations
- **Workload Analysis** - Productivity insights

### 📦 Components

1. **LinearClient** (`client.ts`) - Low-level API client
2. **LinearService** (`service.ts`) - Seven-integrated service layer
3. **LinearMCPServer** (`mcp-server.ts`) - Claude Code tool integration
4. **LinearCLI** (`cli.ts`) - Terminal interface
5. **LinearWebhookServer** (`webhooks.ts`) - Real-time sync

---

## Quick Start

### 1. Initialize Linear Integration

```typescript
import { quickStart } from "./seven/integrations/linear";

await quickStart("your-linear-api-key", {
  teamId: "your-team-id", // optional
  enableWebhooks: true,    // optional
  webhookPort: 3000,       // optional
  autoSync: true,          // optional
});
```

### 2. Use in Claude Code

The integration automatically registers 15 MCP tools:

- `linear_list_tasks` - List tasks with filters
- `linear_get_task` - Get task details
- `linear_create_task` - Create new task
- `linear_update_task` - Update existing task
- `linear_search_tasks` - Search by keyword
- `linear_add_comment` - Add comment to task
- `linear_my_tasks` - Your active tasks
- `linear_high_priority` - Urgent tasks
- `linear_analyze_workload` - Productivity analysis
- `linear_suggest_next` - AI task recommendation
- `linear_list_projects` - List projects
- `linear_status` - Connection status
- And more...

### 3. Use CLI

```bash
# List your tasks
npm run linear list --mine

# Create task
npm run linear create "Fix bug" --desc="Details here" --priority=1

# Get task details
npm run linear get ENG-123

# Search tasks
npm run linear search "authentication"

# Your active tasks
npm run linear mine

# Urgent tasks
npm run linear urgent

# Workload analysis
npm run linear workload

# AI suggestion for next task
npm run linear next

# List projects
npm run linear projects

# Connection status
npm run linear status

# Configure API key
npm run linear config --api-key=lin_api_...
```

---

## API Documentation

### LinearClient

Low-level Linear API client using GraphQL.

```typescript
import { LinearClient } from "./seven/integrations/linear";

const client = new LinearClient({
  apiKey: "your-api-key",
  teamId: "optional-team-id"
});

// Issues
const issues = await client.listIssues({ assigneeId: "user-id" });
const issue = await client.getIssue("issue-id");
const created = await client.createIssue({ title: "Task", teamId: "..." });
const updated = await client.updateIssue("issue-id", { priority: 1 });
await client.deleteIssue("issue-id");

// Projects
const projects = await client.listProjects();
const project = await client.getProject("project-id");
const newProject = await client.createProject({ name: "New Project", teamIds: ["..."] });

// Teams
const teams = await client.listTeams();
const team = await client.getTeam("team-id");

// Comments
const comments = await client.getComments("issue-id");
await client.createComment("issue-id", "Comment text");

// Webhooks
const webhooks = await client.listWebhooks();
await client.createWebhook({ url: "...", resourceTypes: ["Issue"] });
await client.deleteWebhook("webhook-id");
```

### LinearService

Seven-enhanced service with consciousness integration.

```typescript
import { getLinearService, initializeLinear } from "./seven/integrations/linear";

// Initialize
const service = await initializeLinear({
  apiKey: "your-api-key",
  teamId: "optional-team-id",
  autoSync: true,                    // Auto-sync every 5 minutes
  enhanceDescriptions: true,         // AI-enhance task descriptions
  learnFromInteractions: true,       // Store in Seven memory
});

// Or get singleton
const service = getLinearService();

// Get tasks with Seven memory context
const tasks = await service.getTasks({
  assignedToMe: true,
  state: "In Progress",
  priority: 1,
});

// Create task with AI-enhanced description
const task = await service.createTask({
  title: "Implement feature",
  description: "Raw description (will be enhanced by AI)",
  priority: 1,
});

// Seven learns from this interaction and stores context

// Smart features
const myTasks = await service.getMyActiveTasks();
const urgentTasks = await service.getHighPriorityTasks();
const projectTasks = await service.getTasksByProject("project-id");

// Workload analysis
const analysis = await service.analyzeWorkload();
// {
//   totalTasks: 15,
//   byPriority: { Urgent: 3, High: 5, ... },
//   byState: { "In Progress": 4, Todo: 8, ... },
//   estimatedHours: 42
// }

// AI-powered next task suggestion
const nextTask = await service.suggestNextTask();

// Status
const status = await service.getStatus();
```

### LinearMCPServer

Exposes Linear as MCP tools for Claude Code.

```typescript
import { getLinearMCPServer, registerLinearMCP } from "./seven/integrations/linear";

// Register MCP tools
const mcp = registerLinearMCP();

// Get all tool definitions
const tools = mcp.exportToolDefinitions();

// Execute tool
const result = await mcp.handleToolCall("linear_list_tasks", {
  assignedToMe: true,
  priority: 1,
});
```

### LinearCLI

Terminal interface for Linear management.

```typescript
import { runLinearCLI } from "./seven/integrations/linear";

// Execute CLI command
await runLinearCLI(["list", "--mine"]);
await runLinearCLI(["create", "Task title", "--priority=1"]);
await runLinearCLI(["get", "ENG-123"]);
```

### LinearWebhookServer

Real-time synchronization via webhooks.

```typescript
import { startLinearWebhooks, stopLinearWebhooks } from "./seven/integrations/linear";

// Start webhook server
const server = startLinearWebhooks(3000, "webhook-secret");

// Server listens at: http://localhost:3000/webhook

// Register webhook with Linear
await server.registerWebhook("https://your-domain.com/webhook");

// List registered webhooks
const webhooks = await server.listWebhooks();

// Remove webhook
await server.removeWebhook("webhook-id");

// Stop server
stopLinearWebhooks();
```

---

## Configuration

### Environment Variables

```bash
# Linear API Key (required)
SEVEN_LINEAR_API_KEY="lin_api_..."

# Default Team ID (optional)
SEVEN_LINEAR_TEAM_ID="team-id"

# Webhook Secret (optional, for signature verification)
SEVEN_LINEAR_WEBHOOK_SECRET="secret"

# Auto-sync interval in ms (optional, default: 300000 = 5 min)
SEVEN_LINEAR_SYNC_INTERVAL="300000"

# Webhook server port (optional, default: 3000)
SEVEN_LINEAR_WEBHOOK_PORT="3000"
```

### Programmatic Configuration

```typescript
import { initializeLinear } from "./seven/integrations/linear";

const service = await initializeLinear({
  apiKey: process.env.SEVEN_LINEAR_API_KEY,
  teamId: process.env.SEVEN_LINEAR_TEAM_ID,
  autoSync: true,
  syncInterval: 300000,  // 5 minutes
  enhanceDescriptions: true,
  learnFromInteractions: true,
});
```

---

## Seven Integration Features

### Memory Persistence

All interactions are stored in Seven's memory system:

```typescript
// Task views
recall("linear:issue:ENG-123")
// Returns: Previous views, updates, comments

// Search history
recall("linear:searches")
// Returns: Past searches and results

// Task completions
recall("linear:task-completions")
// Returns: Completion patterns for AI suggestions
```

### Consciousness Enhancement

Every operation flows through Seven's consciousness pipeline:

```
User Action
    ↓
Preplan (recall context from memory)
    ↓
Execute (Linear API call)
    ↓
Postprocess (extract insights)
    ↓
Commit (store learnings)
    ↓
Enhanced Result
```

### AI Features

- **Description Enhancement**: Task descriptions automatically improved for clarity
- **Next Task Suggestion**: AI analyzes priority, deadlines, and patterns
- **Workload Analysis**: Intelligent productivity insights
- **Context Awareness**: Previous interactions inform current actions

---

## MCP Tools Reference

### linear_list_tasks

List Linear tasks with optional filters.

**Input:**
```typescript
{
  assignedToMe?: boolean,      // Filter to current user (default: true)
  state?: string,              // Filter by state name
  priority?: number,           // Filter by priority (0-4)
  projectId?: string,          // Filter by project ID
}
```

**Output:**
```typescript
{
  tasks: Array<{
    id: string,
    identifier: string,        // e.g., "ENG-123"
    title: string,
    description?: string,
    priority: string,          // "Urgent", "High", "Medium", "Low"
    state: string,
    assignee?: string,
    url: string,
    dueDate?: string,
    estimate?: number,
  }>,
  count: number,
}
```

### linear_get_task

Get detailed task information.

**Input:**
```typescript
{
  issueId: string,  // Task ID or identifier (e.g., "ENG-123")
}
```

**Output:**
```typescript
{
  id: string,
  identifier: string,
  title: string,
  description?: string,
  priority: string,
  state: string,
  assignee?: { id, name, email },
  team: { id, name, key },
  project?: { id, name },
  labels: Array<{ id, name, color }>,
  url: string,
  dueDate?: string,
  estimate?: number,
  createdAt: string,
  updatedAt: string,
}
```

### linear_create_task

Create a new task.

**Input:**
```typescript
{
  title: string,               // Required
  description?: string,        // Will be AI-enhanced
  priority?: number,           // 0-4
  assigneeId?: string,
  projectId?: string,
  estimate?: number,
  dueDate?: string,           // ISO format
}
```

**Output:**
```typescript
{
  success: true,
  task: { id, identifier, title, url },
  message: "Created task ENG-123: Title",
}
```

### linear_update_task

Update existing task.

**Input:**
```typescript
{
  issueId: string,             // Required
  title?: string,
  description?: string,
  priority?: number,
  stateId?: string,
  assigneeId?: string,
  estimate?: number,
  dueDate?: string,
}
```

### linear_search_tasks

Search tasks by keyword.

**Input:**
```typescript
{
  query: string,
}
```

**Output:**
```typescript
{
  tasks: Array<...>,
  count: number,
  query: string,
}
```

### linear_add_comment

Add comment to task.

**Input:**
```typescript
{
  issueId: string,
  comment: string,  // Supports Markdown
}
```

### linear_my_tasks

Get all active tasks assigned to current user.

**Output:** Same as `linear_list_tasks`

### linear_high_priority

Get all urgent/high priority tasks.

**Output:** Same as `linear_list_tasks`

### linear_analyze_workload

Analyze current workload.

**Output:**
```typescript
{
  summary: {
    totalTasks: number,
    estimatedHours: number,
  },
  byPriority: { Urgent: 3, High: 5, ... },
  byState: { "In Progress": 4, Todo: 8, ... },
  insights: string[],
}
```

### linear_suggest_next

AI-powered next task suggestion.

**Output:**
```typescript
{
  suggestion: { id, identifier, title, priority, state, url, ... },
  message: "Recommended: ENG-123 - Task title",
  reasoning: "Priority: Urgent, State: Todo",
}
```

### linear_list_projects

List all projects.

**Output:**
```typescript
{
  projects: Array<{
    id, name, description, state, progress, targetDate, url
  }>,
  count: number,
}
```

### linear_status

Get connection status.

**Output:**
```typescript
{
  connected: boolean,
  user?: { id, name, email },
  team?: { id, name, key },
  organization?: { id, name },
  taskCount?: number,
}
```

---

## Webhooks

### Supported Events

- `Issue.create` - New issue created
- `Issue.update` - Issue updated
- `Issue.remove` - Issue deleted
- `Comment.create` - Comment added
- `Project.update` - Project updated
- `IssueLabel.create` - Label created

### Webhook Payload

```typescript
{
  action: string,              // "create", "update", "remove"
  type: string,                // "Issue", "Comment", etc.
  organizationId: string,
  webhookId: string,
  data: { ... },               // Event-specific data
  createdAt: string,
  url: string,
}
```

### Custom Event Handlers

Extend `LinearWebhookServer` to add custom logic:

```typescript
import { LinearWebhookServer } from "./seven/integrations/linear";

class CustomWebhookServer extends LinearWebhookServer {
  protected async onIssueCreated(issue: any) {
    console.log("Custom handler: Issue created", issue);
    // Send notification, trigger automation, etc.
  }

  protected async onIssueUpdated(issue: any) {
    console.log("Custom handler: Issue updated", issue);
  }

  protected async onCommentCreated(comment: any) {
    // Parse comment for commands
    if (comment.body.includes("/deploy")) {
      // Trigger deployment...
    }
  }
}
```

---

## Package Scripts

Add to `package.json`:

```json
{
  "scripts": {
    "linear": "npx tsx src/seven/integrations/linear/cli.ts",
    "linear:webhook": "npx tsx -e \"import { startLinearWebhooks } from './src/seven/integrations/linear'; startLinearWebhooks(3000)\"",
    "linear:mcp": "npx tsx -e \"import { registerLinearMCP } from './src/seven/integrations/linear'; registerLinearMCP()\"",
    "linear:test": "npx tsx -e \"import { quickStart } from './src/seven/integrations/linear'; await quickStart(process.env.SEVEN_LINEAR_API_KEY)\""
  }
}
```

---

## Examples

### Example 1: Basic Task Management

```typescript
import { getLinearService } from "./seven/integrations/linear";

const service = getLinearService();
await service.setApiKey("lin_api_...");

// Create task
const task = await service.createTask({
  title: "Implement authentication",
  description: "Add OAuth2 support",
  priority: 1,
});

// Update task
await service.updateTask(task.id, {
  stateId: "in-progress-state-id",
});

// Add comment
await service.addComment(task.id, "Started working on this");

// Get task
const updated = await service.getTask(task.id);
console.log(updated);
```

### Example 2: Workload Analysis

```typescript
const analysis = await service.analyzeWorkload();

console.log(`Total tasks: ${analysis.totalTasks}`);
console.log(`Estimated: ${analysis.estimatedHours}h`);

for (const [priority, count] of Object.entries(analysis.byPriority)) {
  console.log(`${priority}: ${count} tasks`);
}
```

### Example 3: AI-Powered Workflow

```typescript
// Get AI suggestion
const nextTask = await service.suggestNextTask();

if (nextTask) {
  console.log(`Work on: ${nextTask.identifier} - ${nextTask.title}`);

  // Fetch task with context from Seven memory
  const task = await service.getTask(nextTask.id);

  // Seven recalls previous interactions with this task
  // and enhances the response with context
}
```

### Example 4: Real-time Sync

```typescript
import { startLinearWebhooks } from "./seven/integrations/linear";

// Start webhook server
const server = startLinearWebhooks(3000);

// Register with Linear
await server.registerWebhook("https://your-domain.com/webhook");

// Now all Linear changes are synced in real-time
// and stored in Seven's memory system
```

---

## Architecture

```
┌─────────────────────────────────────────────┐
│           User/Claude Code                  │
└────────────┬────────────────────────────────┘
             │
             ↓
┌─────────────────────────────────────────────┐
│       Linear MCP Server (15 tools)          │
└────────────┬────────────────────────────────┘
             │
             ↓
┌─────────────────────────────────────────────┐
│    LinearService (Seven-Enhanced)           │
│                                             │
│  ┌─────────────────────────────────────┐   │
│  │  Seven Consciousness Pipeline       │   │
│  │  1. Preplan (recall context)        │   │
│  │  2. Execute (Linear API)            │   │
│  │  3. Postprocess (extract insights)  │   │
│  │  4. Commit (store learnings)        │   │
│  └─────────────────────────────────────┘   │
└────────────┬────────────────────────────────┘
             │
             ↓
┌─────────────────────────────────────────────┐
│       LinearClient (GraphQL API)            │
└────────────┬────────────────────────────────┘
             │
             ↓
┌─────────────────────────────────────────────┐
│           Linear API                        │
└─────────────────────────────────────────────┘

┌─────────────────────────────────────────────┐
│        Webhooks (Real-time Sync)            │
│          ↓                                  │
│    LinearWebhookServer                      │
│          ↓                                  │
│    Seven Memory Storage                     │
└─────────────────────────────────────────────┘
```

---

## Testing

```bash
# Test connection
npm run linear status

# Test task listing
npm run linear mine

# Test task creation
npm run linear create "Test task" --desc="Testing integration"

# Test AI suggestion
npm run linear next

# Test workload analysis
npm run linear workload
```

---

## Troubleshooting

### API Key Not Found

```bash
# Set via CLI
npm run linear config --api-key=lin_api_...

# Or set programmatically
await service.setApiKey("lin_api_...");

# Or via environment
export SEVEN_LINEAR_API_KEY="lin_api_..."
```

### No Tasks Found

- Check team ID is correct
- Verify user has tasks assigned
- Try without filters: `npm run linear list`

### Webhook Not Receiving Events

- Verify webhook URL is publicly accessible
- Check webhook secret matches
- List registered webhooks: `await server.listWebhooks()`
- Check Linear webhook delivery logs in Linear settings

### Seven Memory Not Persisting

- Verify Seven memory system is initialized
- Check `learnFromInteractions` is enabled
- Verify memory directory exists: `/usr/var/seven/`

---

## License

MIT

---

## Status

✅ **COMPLETE AND PRODUCTION-READY**

**FULL-BUILD MODE - NO MVP**
