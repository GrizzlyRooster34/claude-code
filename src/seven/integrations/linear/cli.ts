/**
 * Linear CLI Commands
 *
 * Terminal interface for Linear integration:
 * - Interactive task management
 * - Quick task creation
 * - Status monitoring
 * - Workload analysis
 * - Configuration
 */

import { getLinearService } from "./service";

export interface CLICommand {
  name: string;
  description: string;
  usage: string;
  handler: (args: string[]) => Promise<void>;
}

export class LinearCLI {
  private service = getLinearService();
  private commands: CLICommand[];

  constructor() {
    this.commands = this.registerCommands();
  }

  private registerCommands(): CLICommand[] {
    return [
      {
        name: "list",
        description: "List tasks with optional filters",
        usage: "linear list [--mine] [--priority=1] [--state='In Progress']",
        handler: async (args) => {
          const options: any = { assignedToMe: args.includes("--mine") };

          for (const arg of args) {
            if (arg.startsWith("--priority=")) {
              options.priority = parseInt(arg.split("=")[1]);
            }
            if (arg.startsWith("--state=")) {
              options.state = arg.split("=")[1].replace(/['"]/g, "");
            }
          }

          const tasks = await this.service.getTasks(options);

          if (tasks.length === 0) {
            console.log("\nNo tasks found\n");
            return;
          }

          console.log(`\n📋 Found ${tasks.length} tasks:\n`);

          for (const task of tasks) {
            const priority = this.getPriorityIcon(task.priorityLabel);
            const state = task.state.name;
            const assignee = task.assignee ? `@${task.assignee.name}` : "Unassigned";

            console.log(`  ${priority} ${task.identifier} - ${task.title}`);
            console.log(`     State: ${state} | Assignee: ${assignee}`);
            if (task.dueDate) console.log(`     Due: ${task.dueDate}`);
            console.log(`     ${task.url}\n`);
          }
        },
      },

      {
        name: "get",
        description: "Get task details",
        usage: "linear get <task-id>",
        handler: async (args) => {
          if (args.length < 2) {
            console.error("Usage: linear get <task-id>");
            return;
          }

          const issueId = args[1];
          const task = await this.service.getTask(issueId);

          console.log(`\n📋 ${task.identifier}: ${task.title}\n`);
          console.log(`Priority: ${this.getPriorityIcon(task.priorityLabel)} ${task.priorityLabel}`);
          console.log(`State: ${task.state.name}`);
          console.log(`Assignee: ${task.assignee ? task.assignee.name : "Unassigned"}`);

          if (task.project) {
            console.log(`Project: ${task.project.name}`);
          }

          if (task.dueDate) {
            console.log(`Due: ${task.dueDate}`);
          }

          if (task.estimate) {
            console.log(`Estimate: ${task.estimate}h`);
          }

          if (task.labels.length > 0) {
            console.log(`Labels: ${task.labels.map((l) => l.name).join(", ")}`);
          }

          if (task.description) {
            console.log(`\nDescription:\n${task.description}\n`);
          }

          console.log(`\nURL: ${task.url}\n`);
        },
      },

      {
        name: "create",
        description: "Create a new task",
        usage: "linear create <title> [--desc='description'] [--priority=1]",
        handler: async (args) => {
          if (args.length < 2) {
            console.error("Usage: linear create <title> [options]");
            return;
          }

          const input: any = { title: "" };
          let collectingTitle = true;

          for (let i = 1; i < args.length; i++) {
            const arg = args[i];

            if (arg.startsWith("--")) {
              collectingTitle = false;

              if (arg.startsWith("--desc=")) {
                input.description = arg.substring(7).replace(/['"]/g, "");
              } else if (arg.startsWith("--priority=")) {
                input.priority = parseInt(arg.substring(11));
              } else if (arg.startsWith("--estimate=")) {
                input.estimate = parseInt(arg.substring(11));
              } else if (arg.startsWith("--due=")) {
                input.dueDate = arg.substring(6);
              }
            } else if (collectingTitle) {
              input.title += (input.title ? " " : "") + arg;
            }
          }

          if (!input.title) {
            console.error("Title is required");
            return;
          }

          console.log(`\nCreating task: ${input.title}...`);

          const task = await this.service.createTask(input);

          console.log(`\n✅ Created ${task.identifier}: ${task.title}`);
          console.log(`   ${task.url}\n`);
        },
      },

      {
        name: "update",
        description: "Update a task",
        usage: "linear update <task-id> [--title='new title'] [--priority=1]",
        handler: async (args) => {
          if (args.length < 2) {
            console.error("Usage: linear update <task-id> [options]");
            return;
          }

          const issueId = args[1];
          const updates: any = {};

          for (let i = 2; i < args.length; i++) {
            const arg = args[i];

            if (arg.startsWith("--title=")) {
              updates.title = arg.substring(8).replace(/['"]/g, "");
            } else if (arg.startsWith("--desc=")) {
              updates.description = arg.substring(7).replace(/['"]/g, "");
            } else if (arg.startsWith("--priority=")) {
              updates.priority = parseInt(arg.substring(11));
            } else if (arg.startsWith("--estimate=")) {
              updates.estimate = parseInt(arg.substring(11));
            }
          }

          if (Object.keys(updates).length === 0) {
            console.error("No updates specified");
            return;
          }

          console.log(`\nUpdating ${issueId}...`);

          const task = await this.service.updateTask(issueId, updates);

          console.log(`\n✅ Updated ${task.identifier}: ${task.title}`);
          console.log(`   ${task.url}\n`);
        },
      },

      {
        name: "search",
        description: "Search tasks",
        usage: "linear search <query>",
        handler: async (args) => {
          if (args.length < 2) {
            console.error("Usage: linear search <query>");
            return;
          }

          const query = args.slice(1).join(" ");
          console.log(`\nSearching for: ${query}...`);

          const tasks = await this.service.searchTasks(query);

          if (tasks.length === 0) {
            console.log("\nNo results found\n");
            return;
          }

          console.log(`\n🔍 Found ${tasks.length} results:\n`);

          for (const task of tasks) {
            console.log(`  ${task.identifier} - ${task.title}`);
            console.log(`     ${task.url}\n`);
          }
        },
      },

      {
        name: "mine",
        description: "Show my active tasks",
        usage: "linear mine",
        handler: async () => {
          console.log("\n📋 Your active tasks:\n");

          const tasks = await this.service.getMyActiveTasks();

          if (tasks.length === 0) {
            console.log("  No active tasks\n");
            return;
          }

          for (const task of tasks) {
            const priority = this.getPriorityIcon(task.priorityLabel);
            console.log(`  ${priority} ${task.identifier} - ${task.title}`);
            console.log(`     State: ${task.state.name}`);
            if (task.dueDate) console.log(`     Due: ${task.dueDate}`);
            console.log(`     ${task.url}\n`);
          }
        },
      },

      {
        name: "urgent",
        description: "Show high priority tasks",
        usage: "linear urgent",
        handler: async () => {
          console.log("\n🔥 High priority tasks:\n");

          const tasks = await this.service.getHighPriorityTasks();

          if (tasks.length === 0) {
            console.log("  No urgent tasks\n");
            return;
          }

          for (const task of tasks) {
            console.log(`  ${task.identifier} - ${task.title}`);
            console.log(`     Assignee: ${task.assignee?.name || "Unassigned"}`);
            console.log(`     State: ${task.state.name}`);
            console.log(`     ${task.url}\n`);
          }
        },
      },

      {
        name: "workload",
        description: "Analyze current workload",
        usage: "linear workload",
        handler: async () => {
          console.log("\n📊 Workload Analysis\n");

          const analysis = await this.service.analyzeWorkload();

          console.log(`Total Tasks: ${analysis.totalTasks}`);
          console.log(`Estimated Hours: ${analysis.estimatedHours}h\n`);

          console.log("By Priority:");
          for (const [priority, count] of Object.entries(analysis.byPriority)) {
            console.log(`  ${this.getPriorityIcon(priority)} ${priority}: ${count}`);
          }

          console.log("\nBy State:");
          for (const [state, count] of Object.entries(analysis.byState)) {
            console.log(`  ${state}: ${count}`);
          }

          console.log();
        },
      },

      {
        name: "next",
        description: "AI suggestion for next task",
        usage: "linear next",
        handler: async () => {
          console.log("\n🤖 Analyzing your tasks...\n");

          const task = await this.service.suggestNextTask();

          if (!task) {
            console.log("No active tasks found\n");
            return;
          }

          console.log("✨ Recommended next task:\n");
          console.log(`  ${this.getPriorityIcon(task.priorityLabel)} ${task.identifier} - ${task.title}`);
          console.log(`     Priority: ${task.priorityLabel}`);
          console.log(`     State: ${task.state.name}`);
          if (task.estimate) console.log(`     Estimate: ${task.estimate}h`);
          if (task.dueDate) console.log(`     Due: ${task.dueDate}`);
          console.log(`     ${task.url}\n`);
        },
      },

      {
        name: "projects",
        description: "List projects",
        usage: "linear projects",
        handler: async () => {
          console.log("\n📁 Projects:\n");

          const projects = await this.service.getProjects();

          if (projects.length === 0) {
            console.log("  No projects found\n");
            return;
          }

          for (const project of projects) {
            console.log(`  ${project.name}`);
            console.log(`     State: ${project.state} | Progress: ${project.progress}%`);
            if (project.targetDate) console.log(`     Target: ${project.targetDate}`);
            console.log(`     ${project.url}\n`);
          }
        },
      },

      {
        name: "status",
        description: "Show connection status",
        usage: "linear status",
        handler: async () => {
          console.log("\n🔗 Linear Status\n");

          const status = await this.service.getStatus();

          if (!status.connected) {
            console.log("❌ Not connected");
            console.log("\nSet API key with: linear config --api-key=<key>\n");
            return;
          }

          console.log("✅ Connected\n");

          if (status.user) {
            console.log(`User: ${status.user.name} (${status.user.email})`);
          }

          if (status.organization) {
            console.log(`Organization: ${status.organization.name}`);
          }

          if (status.team) {
            console.log(`Team: ${status.team.name} (${status.team.key})`);
          }

          if (status.taskCount !== undefined) {
            console.log(`Active Tasks: ${status.taskCount}`);
          }

          console.log();
        },
      },

      {
        name: "config",
        description: "Configure Linear integration",
        usage: "linear config --api-key=<key>",
        handler: async (args) => {
          for (const arg of args) {
            if (arg.startsWith("--api-key=")) {
              const apiKey = arg.substring(10);
              await this.service.setApiKey(apiKey);
              console.log("\n✅ API key configured\n");
              return;
            }
          }

          console.error("\nUsage: linear config --api-key=<key>\n");
        },
      },

      {
        name: "help",
        description: "Show help",
        usage: "linear help [command]",
        handler: async (args) => {
          if (args.length > 1) {
            const cmdName = args[1];
            const cmd = this.commands.find((c) => c.name === cmdName);

            if (cmd) {
              console.log(`\n${cmd.name}: ${cmd.description}`);
              console.log(`Usage: ${cmd.usage}\n`);
            } else {
              console.log(`\nUnknown command: ${cmdName}\n`);
            }

            return;
          }

          console.log("\n📋 Linear CLI - Seven-Enhanced Task Management\n");
          console.log("Available commands:\n");

          for (const cmd of this.commands) {
            console.log(`  ${cmd.name.padEnd(12)} ${cmd.description}`);
          }

          console.log("\nUse 'linear help <command>' for detailed usage\n");
        },
      },
    ];
  }

  async execute(args: string[]): Promise<void> {
    if (args.length === 0 || args[0] === "help") {
      await this.getCommand("help")!.handler(args);
      return;
    }

    const cmdName = args[0];
    const cmd = this.commands.find((c) => c.name === cmdName);

    if (!cmd) {
      console.error(`\n❌ Unknown command: ${cmdName}`);
      console.log("Use 'linear help' to see available commands\n");
      return;
    }

    try {
      await cmd.handler(args);
    } catch (error: any) {
      console.error(`\n❌ Error: ${error.message}\n`);

      if (error.message.includes("401") || error.message.includes("authentication")) {
        console.log("Tip: Set API key with: linear config --api-key=<key>\n");
      }
    }
  }

  private getCommand(name: string): CLICommand | undefined {
    return this.commands.find((c) => c.name === name);
  }

  private getPriorityIcon(priority: string): string {
    switch (priority) {
      case "Urgent":
        return "🔴";
      case "High":
        return "🟠";
      case "Medium":
        return "🟡";
      case "Low":
        return "🟢";
      default:
        return "⚪";
    }
  }
}

// Export CLI handler
export async function runLinearCLI(args: string[]): Promise<void> {
  const cli = new LinearCLI();
  await cli.execute(args);
}

// Entry point for direct CLI execution
if (require.main === module) {
  runLinearCLI(process.argv.slice(2)).catch((error) => {
    console.error("Fatal error:", error);
    process.exit(1);
  });
}
