/**
 * Linear MCP Server - Model Context Protocol Integration
 *
 * Exposes Linear functionality as MCP tools for Claude Code:
 * - List/search/create/update tasks
 * - Project management
 * - Workload analysis
 * - Smart suggestions
 * - Real-time sync
 *
 * Makes Linear tasks available directly in Claude Code conversations
 */

import { getLinearService, LinearService } from "./service";

export interface MCPTool {
  name: string;
  description: string;
  inputSchema: any;
  handler: (args: any) => Promise<any>;
}

export class LinearMCPServer {
  private service: LinearService;
  private tools: MCPTool[];

  constructor(service?: LinearService) {
    this.service = service || getLinearService();
    this.tools = this.registerTools();
  }

  private registerTools(): MCPTool[] {
    return [
      // LIST TASKS
      {
        name: "linear_list_tasks",
        description: "List Linear tasks/issues with optional filters. Returns tasks assigned to current user by default.",
        inputSchema: {
          type: "object",
          properties: {
            assignedToMe: {
              type: "boolean",
              description: "Filter to tasks assigned to current user (default: true)",
            },
            state: {
              type: "string",
              description: "Filter by state name (e.g., 'In Progress', 'Todo', 'Done')",
            },
            priority: {
              type: "number",
              description: "Filter by priority (0=No priority, 1=Urgent, 2=High, 3=Medium, 4=Low)",
            },
            projectId: {
              type: "string",
              description: "Filter by project ID",
            },
          },
        },
        handler: async (args) => {
          const tasks = await this.service.getTasks({
            assignedToMe: args.assignedToMe ?? true,
            state: args.state,
            priority: args.priority,
            projectId: args.projectId,
          });

          return {
            tasks: tasks.map((t) => ({
              id: t.id,
              identifier: t.identifier,
              title: t.title,
              description: t.description,
              priority: t.priorityLabel,
              state: t.state.name,
              assignee: t.assignee?.name,
              url: t.url,
              dueDate: t.dueDate,
              estimate: t.estimate,
            })),
            count: tasks.length,
          };
        },
      },

      // GET TASK
      {
        name: "linear_get_task",
        description: "Get detailed information about a specific Linear task by ID or identifier (e.g., 'ENG-123')",
        inputSchema: {
          type: "object",
          properties: {
            issueId: {
              type: "string",
              description: "Task ID or identifier (e.g., 'ENG-123')",
            },
          },
          required: ["issueId"],
        },
        handler: async (args) => {
          const task = await this.service.getTask(args.issueId);

          return {
            id: task.id,
            identifier: task.identifier,
            title: task.title,
            description: task.description,
            priority: task.priorityLabel,
            state: task.state.name,
            assignee: task.assignee
              ? {
                  id: task.assignee.id,
                  name: task.assignee.name,
                  email: task.assignee.email,
                }
              : null,
            team: {
              id: task.team.id,
              name: task.team.name,
              key: task.team.key,
            },
            project: task.project
              ? {
                  id: task.project.id,
                  name: task.project.name,
                }
              : null,
            labels: task.labels.map((l) => ({
              id: l.id,
              name: l.name,
              color: l.color,
            })),
            url: task.url,
            dueDate: task.dueDate,
            estimate: task.estimate,
            createdAt: task.createdAt,
            updatedAt: task.updatedAt,
          };
        },
      },

      // CREATE TASK
      {
        name: "linear_create_task",
        description: "Create a new Linear task/issue. Automatically uses AI to enhance description for clarity.",
        inputSchema: {
          type: "object",
          properties: {
            title: {
              type: "string",
              description: "Task title (required)",
            },
            description: {
              type: "string",
              description: "Task description (will be AI-enhanced for clarity)",
            },
            priority: {
              type: "number",
              description: "Priority (0=No priority, 1=Urgent, 2=High, 3=Medium, 4=Low)",
            },
            assigneeId: {
              type: "string",
              description: "User ID to assign task to",
            },
            projectId: {
              type: "string",
              description: "Project ID to add task to",
            },
            estimate: {
              type: "number",
              description: "Estimate in hours or story points",
            },
            dueDate: {
              type: "string",
              description: "Due date (ISO format: YYYY-MM-DD)",
            },
          },
          required: ["title"],
        },
        handler: async (args) => {
          const task = await this.service.createTask({
            title: args.title,
            description: args.description,
            priority: args.priority,
            assigneeId: args.assigneeId,
            projectId: args.projectId,
            estimate: args.estimate,
            dueDate: args.dueDate,
          });

          return {
            success: true,
            task: {
              id: task.id,
              identifier: task.identifier,
              title: task.title,
              url: task.url,
            },
            message: `Created task ${task.identifier}: ${task.title}`,
          };
        },
      },

      // UPDATE TASK
      {
        name: "linear_update_task",
        description: "Update an existing Linear task. Can update title, description, priority, state, assignee, etc.",
        inputSchema: {
          type: "object",
          properties: {
            issueId: {
              type: "string",
              description: "Task ID or identifier to update",
            },
            title: {
              type: "string",
              description: "New title",
            },
            description: {
              type: "string",
              description: "New description",
            },
            priority: {
              type: "number",
              description: "New priority (0=No priority, 1=Urgent, 2=High, 3=Medium, 4=Low)",
            },
            stateId: {
              type: "string",
              description: "New state ID",
            },
            assigneeId: {
              type: "string",
              description: "New assignee user ID",
            },
            estimate: {
              type: "number",
              description: "New estimate",
            },
            dueDate: {
              type: "string",
              description: "New due date (ISO format)",
            },
          },
          required: ["issueId"],
        },
        handler: async (args) => {
          const { issueId, ...updates } = args;

          const task = await this.service.updateTask(issueId, updates);

          return {
            success: true,
            task: {
              id: task.id,
              identifier: task.identifier,
              title: task.title,
              url: task.url,
            },
            message: `Updated task ${task.identifier}`,
          };
        },
      },

      // SEARCH TASKS
      {
        name: "linear_search_tasks",
        description: "Search Linear tasks by keyword. Searches in title and description.",
        inputSchema: {
          type: "object",
          properties: {
            query: {
              type: "string",
              description: "Search query",
            },
          },
          required: ["query"],
        },
        handler: async (args) => {
          const tasks = await this.service.searchTasks(args.query);

          return {
            tasks: tasks.map((t) => ({
              id: t.id,
              identifier: t.identifier,
              title: t.title,
              description: t.description?.slice(0, 200),
              priority: t.priorityLabel,
              state: t.state.name,
              url: t.url,
            })),
            count: tasks.length,
            query: args.query,
          };
        },
      },

      // ADD COMMENT
      {
        name: "linear_add_comment",
        description: "Add a comment to a Linear task",
        inputSchema: {
          type: "object",
          properties: {
            issueId: {
              type: "string",
              description: "Task ID or identifier",
            },
            comment: {
              type: "string",
              description: "Comment text (supports Markdown)",
            },
          },
          required: ["issueId", "comment"],
        },
        handler: async (args) => {
          await this.service.addComment(args.issueId, args.comment);

          return {
            success: true,
            message: `Added comment to ${args.issueId}`,
          };
        },
      },

      // GET MY ACTIVE TASKS
      {
        name: "linear_my_tasks",
        description: "Get all active tasks assigned to current user",
        inputSchema: {
          type: "object",
          properties: {},
        },
        handler: async () => {
          const tasks = await this.service.getMyActiveTasks();

          return {
            tasks: tasks.map((t) => ({
              id: t.id,
              identifier: t.identifier,
              title: t.title,
              priority: t.priorityLabel,
              state: t.state.name,
              url: t.url,
              dueDate: t.dueDate,
              estimate: t.estimate,
            })),
            count: tasks.length,
          };
        },
      },

      // GET HIGH PRIORITY TASKS
      {
        name: "linear_high_priority",
        description: "Get all high priority (urgent) tasks",
        inputSchema: {
          type: "object",
          properties: {},
        },
        handler: async () => {
          const tasks = await this.service.getHighPriorityTasks();

          return {
            tasks: tasks.map((t) => ({
              id: t.id,
              identifier: t.identifier,
              title: t.title,
              assignee: t.assignee?.name,
              state: t.state.name,
              url: t.url,
              dueDate: t.dueDate,
            })),
            count: tasks.length,
          };
        },
      },

      // ANALYZE WORKLOAD
      {
        name: "linear_analyze_workload",
        description: "Analyze current workload with breakdown by priority, state, and estimated hours",
        inputSchema: {
          type: "object",
          properties: {},
        },
        handler: async () => {
          const analysis = await this.service.analyzeWorkload();

          return {
            summary: {
              totalTasks: analysis.totalTasks,
              estimatedHours: analysis.estimatedHours,
            },
            byPriority: analysis.byPriority,
            byState: analysis.byState,
            insights: [
              `You have ${analysis.totalTasks} active tasks`,
              `Estimated workload: ${analysis.estimatedHours} hours`,
              `Priority breakdown: ${JSON.stringify(analysis.byPriority)}`,
              `State breakdown: ${JSON.stringify(analysis.byState)}`,
            ],
          };
        },
      },

      // SUGGEST NEXT TASK
      {
        name: "linear_suggest_next",
        description: "AI-powered suggestion for which task to work on next based on priority, deadlines, and context",
        inputSchema: {
          type: "object",
          properties: {},
        },
        handler: async () => {
          const task = await this.service.suggestNextTask();

          if (!task) {
            return {
              suggestion: null,
              message: "No active tasks found",
            };
          }

          return {
            suggestion: {
              id: task.id,
              identifier: task.identifier,
              title: task.title,
              priority: task.priorityLabel,
              state: task.state.name,
              url: task.url,
              dueDate: task.dueDate,
              estimate: task.estimate,
            },
            message: `Recommended: ${task.identifier} - ${task.title}`,
            reasoning: `Priority: ${task.priorityLabel}, State: ${task.state.name}`,
          };
        },
      },

      // LIST PROJECTS
      {
        name: "linear_list_projects",
        description: "List all Linear projects in current team",
        inputSchema: {
          type: "object",
          properties: {},
        },
        handler: async () => {
          const projects = await this.service.getProjects();

          return {
            projects: projects.map((p) => ({
              id: p.id,
              name: p.name,
              description: p.description,
              state: p.state,
              progress: p.progress,
              targetDate: p.targetDate,
              url: p.url,
            })),
            count: projects.length,
          };
        },
      },

      // GET STATUS
      {
        name: "linear_status",
        description: "Get Linear connection status and current user/team information",
        inputSchema: {
          type: "object",
          properties: {},
        },
        handler: async () => {
          const status = await this.service.getStatus();

          return {
            connected: status.connected,
            user: status.user,
            team: status.team,
            organization: status.organization,
            taskCount: status.taskCount,
          };
        },
      },
    ];
  }

  getTools(): MCPTool[] {
    return this.tools;
  }

  async handleToolCall(toolName: string, args: any): Promise<any> {
    const tool = this.tools.find((t) => t.name === toolName);

    if (!tool) {
      throw new Error(`Unknown tool: ${toolName}`);
    }

    console.log(`[linear-mcp] Executing tool: ${toolName}`);

    try {
      const result = await tool.handler(args);
      console.log(`[linear-mcp] Tool ${toolName} completed successfully`);
      return result;
    } catch (error: any) {
      console.error(`[linear-mcp] Tool ${toolName} failed:`, error);
      throw new Error(`Tool execution failed: ${error.message}`);
    }
  }

  // Export tool definitions for MCP server registration
  exportToolDefinitions(): Array<{
    name: string;
    description: string;
    inputSchema: any;
  }> {
    return this.tools.map((t) => ({
      name: t.name,
      description: t.description,
      inputSchema: t.inputSchema,
    }));
  }
}

// Singleton instance
let mcpServerInstance: LinearMCPServer | null = null;

export function getLinearMCPServer(): LinearMCPServer {
  if (!mcpServerInstance) {
    mcpServerInstance = new LinearMCPServer();
  }
  return mcpServerInstance;
}

export function registerLinearMCP(): LinearMCPServer {
  const server = getLinearMCPServer();
  console.log(`[linear-mcp] Registered ${server.getTools().length} Linear tools`);
  return server;
}
