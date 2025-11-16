/**
 * Linear Service - Seven-Integrated Task Management
 *
 * Integrates Linear with Seven's consciousness system:
 * - Automatic context recall for issues
 * - Learning from issue interactions
 * - Memory persistence for task history
 * - AI-enhanced task descriptions
 * - Smart task recommendations
 * - Priority optimization
 * - Workload balancing
 */

import { LinearClient, LinearIssue, LinearProject, LinearTeam } from "./client";
import { preplan, postprocess } from "../../core/consciousness/pipeline";
import { recall, commit } from "../../core/memory/api";
import { getSecret, setSecret } from "../../bridge/vault";

export interface LinearServiceConfig {
  apiKey?: string;
  teamId?: string;
  autoSync?: boolean;
  syncInterval?: number;
  enhanceDescriptions?: boolean;
  learnFromInteractions?: boolean;
}

export class LinearService {
  private client: LinearClient;
  private config: LinearServiceConfig;
  private syncTimer?: NodeJS.Timeout;

  constructor(config: LinearServiceConfig = {}) {
    this.config = {
      autoSync: true,
      syncInterval: 300000, // 5 minutes
      enhanceDescriptions: true,
      learnFromInteractions: true,
      ...config,
    };

    // Initialize client (will try to get API key from vault if not provided)
    this.client = new LinearClient({
      apiKey: config.apiKey || "",
    });
  }

  async initialize(): Promise<void> {
    // Try to get API key from vault if not in config
    if (!this.config.apiKey) {
      try {
        const apiKey = await getSecret("linear_api_key");
        this.client = new LinearClient({ apiKey });
        console.log("[linear] Initialized with API key from vault");
      } catch {
        console.warn("[linear] No API key found. Use setApiKey() to configure.");
      }
    }

    // Get default team if not set
    if (!this.config.teamId) {
      try {
        const teams = await this.client.listTeams();
        if (teams.length > 0) {
          this.config.teamId = teams[0].id;
          console.log(`[linear] Using default team: ${teams[0].name}`);
        }
      } catch (error) {
        console.warn("[linear] Could not fetch teams:", error);
      }
    }

    // Start auto-sync if enabled
    if (this.config.autoSync) {
      this.startAutoSync();
    }
  }

  async setApiKey(apiKey: string): Promise<void> {
    this.config.apiKey = apiKey;
    this.client = new LinearClient({ apiKey });
    await setSecret("linear_api_key", apiKey);
    console.log("[linear] API key configured and saved to vault");
  }

  // ============================================
  // ENHANCED TASK OPERATIONS
  // ============================================

  async getTasks(options?: {
    assignedToMe?: boolean;
    state?: string;
    priority?: number;
    projectId?: string;
  }): Promise<LinearIssue[]> {
    console.log("[linear] Fetching tasks...");

    // Recall context about recent task queries
    const context = await recall("linear:task-queries").catch(() => []);

    let issues: LinearIssue[];

    if (options?.assignedToMe) {
      const user = await this.client.getCurrentUser();
      issues = await this.client.listIssues({
        assigneeId: user.id,
        teamId: this.config.teamId,
        state: options.state,
        priority: options.priority,
        projectId: options.projectId,
      });
    } else {
      issues = await this.client.listIssues({
        teamId: this.config.teamId,
        state: options.state,
        priority: options.priority,
        projectId: options.projectId,
      });
    }

    // Learn from this query
    if (this.config.learnFromInteractions) {
      await commit(
        "linear:task-queries",
        `Fetched ${issues.length} tasks with filters: ${JSON.stringify(options)}`,
        [{ type: "query", count: issues.length, filters: options }]
      ).catch(() => {});
    }

    console.log(`[linear] Found ${issues.length} tasks`);
    return issues;
  }

  async getTask(issueIdOrIdentifier: string): Promise<LinearIssue> {
    console.log(`[linear] Fetching task: ${issueIdOrIdentifier}`);

    // Recall previous interactions with this task
    const context = await recall(`linear:issue:${issueIdOrIdentifier}`).catch(() => []);

    const issue = await this.client.getIssue(issueIdOrIdentifier);

    // Store interaction
    if (this.config.learnFromInteractions) {
      await commit(
        `linear:issue:${issue.id}`,
        `Viewed task ${issue.identifier}: ${issue.title}`,
        [{ type: "view", timestamp: new Date().toISOString() }]
      ).catch(() => {});
    }

    return issue;
  }

  async createTask(input: {
    title: string;
    description?: string;
    priority?: number;
    assigneeId?: string;
    projectId?: string;
    estimate?: number;
    dueDate?: string;
  }): Promise<LinearIssue> {
    console.log(`[linear] Creating task: ${input.title}`);

    let enhancedDescription = input.description;

    // Enhance description with AI if enabled
    if (this.config.enhanceDescriptions && input.description) {
      try {
        const plan = await preplan({
          prompt: `Enhance this task description to be clear, actionable, and well-structured:\n\n${input.description}`,
          system: "You are a technical writer. Make descriptions clear and actionable without changing the core meaning.",
          memories: [],
        });

        enhancedDescription = plan.prompt;
        console.log("[linear] Enhanced task description with AI");
      } catch (error) {
        console.warn("[linear] Could not enhance description:", error);
      }
    }

    const issue = await this.client.createIssue({
      ...input,
      description: enhancedDescription,
      teamId: this.config.teamId!,
    });

    // Store creation in memory
    if (this.config.learnFromInteractions) {
      await commit(
        `linear:issue:${issue.id}`,
        `Created task ${issue.identifier}: ${issue.title}`,
        [{ type: "create", timestamp: new Date().toISOString(), priority: input.priority }]
      ).catch(() => {});
    }

    console.log(`[linear] Created task: ${issue.identifier}`);
    return issue;
  }

  async updateTask(
    issueId: string,
    input: {
      title?: string;
      description?: string;
      priority?: number;
      stateId?: string;
      assigneeId?: string;
      estimate?: number;
      dueDate?: string;
    }
  ): Promise<LinearIssue> {
    console.log(`[linear] Updating task: ${issueId}`);

    // Recall task context
    const context = await recall(`linear:issue:${issueId}`).catch(() => []);

    const issue = await this.client.updateIssue(issueId, input);

    // Learn from update
    if (this.config.learnFromInteractions) {
      await commit(
        `linear:issue:${issue.id}`,
        `Updated task ${issue.identifier}: ${Object.keys(input).join(", ")}`,
        [{ type: "update", changes: input, timestamp: new Date().toISOString() }]
      ).catch(() => {});
    }

    console.log(`[linear] Updated task: ${issue.identifier}`);
    return issue;
  }

  async searchTasks(query: string): Promise<LinearIssue[]> {
    console.log(`[linear] Searching tasks: ${query}`);

    // Recall previous searches
    const context = await recall("linear:searches").catch(() => []);

    const issues = await this.client.searchIssues(query, {
      teamId: this.config.teamId,
    });

    // Learn from search
    if (this.config.learnFromInteractions) {
      await commit(
        "linear:searches",
        `Searched for "${query}", found ${issues.length} results`,
        [{ type: "search", query, resultCount: issues.length, timestamp: new Date().toISOString() }]
      ).catch(() => {});
    }

    console.log(`[linear] Found ${issues.length} results`);
    return issues;
  }

  async addComment(issueId: string, comment: string): Promise<void> {
    console.log(`[linear] Adding comment to ${issueId}`);

    await this.client.createComment(issueId, comment);

    // Store interaction
    if (this.config.learnFromInteractions) {
      await commit(
        `linear:issue:${issueId}`,
        `Added comment: ${comment.slice(0, 100)}`,
        [{ type: "comment", timestamp: new Date().toISOString() }]
      ).catch(() => {});
    }
  }

  // ============================================
  // SMART FEATURES
  // ============================================

  async getMyActiveTasks(): Promise<LinearIssue[]> {
    const user = await this.client.getCurrentUser();
    return await this.client.listIssues({
      assigneeId: user.id,
      teamId: this.config.teamId,
    });
  }

  async getHighPriorityTasks(): Promise<LinearIssue[]> {
    return await this.client.listIssues({
      teamId: this.config.teamId,
      priority: 1, // Urgent
    });
  }

  async getTasksByProject(projectId: string): Promise<LinearIssue[]> {
    return await this.client.listIssues({
      teamId: this.config.teamId,
      projectId,
    });
  }

  async analyzeWorkload(): Promise<{
    totalTasks: number;
    byPriority: Record<string, number>;
    byState: Record<string, number>;
    estimatedHours: number;
  }> {
    console.log("[linear] Analyzing workload...");

    const user = await this.client.getCurrentUser();
    const tasks = await this.client.listIssues({
      assigneeId: user.id,
      teamId: this.config.teamId,
    });

    const byPriority: Record<string, number> = {};
    const byState: Record<string, number> = {};
    let estimatedHours = 0;

    for (const task of tasks) {
      // Priority
      const priority = task.priorityLabel;
      byPriority[priority] = (byPriority[priority] || 0) + 1;

      // State
      const state = task.state.name;
      byState[state] = (byState[state] || 0) + 1;

      // Estimate
      if (task.estimate) {
        estimatedHours += task.estimate;
      }
    }

    const analysis = {
      totalTasks: tasks.length,
      byPriority,
      byState,
      estimatedHours,
    };

    // Store analysis
    await commit(
      "linear:workload-analysis",
      `Workload: ${tasks.length} tasks, ${estimatedHours}h estimated`,
      [{ ...analysis, timestamp: new Date().toISOString() }]
    ).catch(() => {});

    return analysis;
  }

  async suggestNextTask(): Promise<LinearIssue | null> {
    console.log("[linear] Suggesting next task...");

    // Get user's active tasks
    const user = await this.client.getCurrentUser();
    const tasks = await this.client.listIssues({
      assigneeId: user.id,
      teamId: this.config.teamId,
    });

    if (tasks.length === 0) {
      return null;
    }

    // Recall task history to understand patterns
    const context = await recall("linear:task-completions").catch(() => []);

    // Use Seven consciousness to suggest best next task
    try {
      const plan = await preplan({
        prompt: `Based on these tasks and completion history, suggest which task to work on next:\n\nTasks: ${JSON.stringify(tasks.map(t => ({ id: t.identifier, title: t.title, priority: t.priorityLabel, estimate: t.estimate })))}\n\nHistory: ${JSON.stringify(context)}`,
        system: "You are a productivity assistant. Recommend the most impactful task considering priority, deadlines, and flow.",
        memories: context,
      });

      // Simple heuristic for now: highest priority with due date
      const sorted = tasks.sort((a, b) => {
        if (a.priority !== b.priority) return a.priority - b.priority;
        if (a.dueDate && b.dueDate) return new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime();
        return 0;
      });

      return sorted[0];
    } catch (error) {
      console.warn("[linear] Could not use AI for suggestion, using heuristic");

      // Fallback: highest priority
      return tasks.sort((a, b) => a.priority - b.priority)[0];
    }
  }

  // ============================================
  // PROJECTS
  // ============================================

  async getProjects(): Promise<LinearProject[]> {
    return await this.client.listProjects(this.config.teamId);
  }

  async getProject(projectId: string): Promise<LinearProject> {
    return await this.client.getProject(projectId);
  }

  // ============================================
  // TEAMS
  // ============================================

  async getTeams(): Promise<LinearTeam[]> {
    return await this.client.listTeams();
  }

  async getCurrentTeam(): Promise<LinearTeam | null> {
    if (!this.config.teamId) return null;
    return await this.client.getTeam(this.config.teamId);
  }

  // ============================================
  // SYNC & BACKGROUND OPERATIONS
  // ============================================

  private startAutoSync(): void {
    if (this.syncTimer) {
      clearInterval(this.syncTimer);
    }

    this.syncTimer = setInterval(async () => {
      try {
        await this.syncTasks();
      } catch (error) {
        console.error("[linear] Auto-sync failed:", error);
      }
    }, this.config.syncInterval);

    console.log(`[linear] Auto-sync enabled (interval: ${this.config.syncInterval}ms)`);
  }

  private async syncTasks(): Promise<void> {
    console.log("[linear] Syncing tasks...");

    const tasks = await this.getTasks();

    // Store snapshot in memory
    await commit(
      "linear:sync-snapshot",
      `Synced ${tasks.length} tasks`,
      [{ count: tasks.length, timestamp: new Date().toISOString() }]
    ).catch(() => {});

    console.log(`[linear] Synced ${tasks.length} tasks`);
  }

  stopAutoSync(): void {
    if (this.syncTimer) {
      clearInterval(this.syncTimer);
      this.syncTimer = undefined;
      console.log("[linear] Auto-sync stopped");
    }
  }

  // ============================================
  // STATUS & INFO
  // ============================================

  async getStatus(): Promise<{
    connected: boolean;
    user?: { id: string; name: string; email: string };
    team?: { id: string; name: string; key: string };
    organization?: { id: string; name: string };
    taskCount?: number;
  }> {
    try {
      const user = await this.client.getCurrentUser();
      const organization = await this.client.getOrganization();
      const team = this.config.teamId ? await this.client.getTeam(this.config.teamId) : undefined;
      const tasks = await this.client.listIssues({
        assigneeId: user.id,
        teamId: this.config.teamId,
      });

      return {
        connected: true,
        user,
        team,
        organization,
        taskCount: tasks.length,
      };
    } catch (error) {
      return {
        connected: false,
      };
    }
  }
}

// Singleton instance
let linearServiceInstance: LinearService | null = null;

export function getLinearService(): LinearService {
  if (!linearServiceInstance) {
    linearServiceInstance = new LinearService();
  }
  return linearServiceInstance;
}

export async function initializeLinear(config?: LinearServiceConfig): Promise<LinearService> {
  const service = new LinearService(config);
  await service.initialize();
  linearServiceInstance = service;
  return service;
}
