/**
 * Linear Webhooks Server
 *
 * Real-time synchronization with Linear:
 * - Issue created/updated/deleted events
 * - Comment notifications
 * - Status change tracking
 * - Assignment notifications
 * - Project updates
 * - Automatic Seven memory updates
 * - Webhook signature verification
 */

import * as http from "http";
import * as crypto from "crypto";
import { getLinearService } from "./service";
import { commit } from "../../core/memory/api";

export interface WebhookEvent {
  action: string;
  type: string;
  organizationId: string;
  webhookId: string;
  data: any;
  createdAt: string;
  url: string;
}

export interface WebhookHandler {
  event: string;
  handler: (data: any) => Promise<void>;
}

export class LinearWebhookServer {
  private server?: http.Server;
  private port: number;
  private secret?: string;
  private handlers: WebhookHandler[];
  private service = getLinearService();

  constructor(port: number = 3000, webhookSecret?: string) {
    this.port = port;
    this.secret = webhookSecret;
    this.handlers = this.registerHandlers();
  }

  private registerHandlers(): WebhookHandler[] {
    return [
      // ISSUE CREATED
      {
        event: "Issue.create",
        handler: async (data) => {
          const issue = data;
          console.log(`[linear-webhook] Issue created: ${issue.identifier} - ${issue.title}`);

          // Store in Seven memory
          await commit(
            `linear:issue:${issue.id}`,
            `Issue created: ${issue.identifier} - ${issue.title}`,
            [
              {
                type: "webhook",
                event: "create",
                timestamp: new Date().toISOString(),
                data: issue,
              },
            ]
          ).catch(() => {});

          // Trigger custom hooks if needed
          await this.onIssueCreated(issue);
        },
      },

      // ISSUE UPDATED
      {
        event: "Issue.update",
        handler: async (data) => {
          const issue = data;
          console.log(`[linear-webhook] Issue updated: ${issue.identifier}`);

          // Store in Seven memory
          await commit(
            `linear:issue:${issue.id}`,
            `Issue updated: ${issue.identifier}`,
            [
              {
                type: "webhook",
                event: "update",
                timestamp: new Date().toISOString(),
                data: issue,
              },
            ]
          ).catch(() => {});

          // Trigger custom hooks
          await this.onIssueUpdated(issue);
        },
      },

      // ISSUE REMOVED
      {
        event: "Issue.remove",
        handler: async (data) => {
          const issue = data;
          console.log(`[linear-webhook] Issue removed: ${issue.identifier}`);

          await commit(
            `linear:issue:${issue.id}`,
            `Issue removed: ${issue.identifier}`,
            [
              {
                type: "webhook",
                event: "remove",
                timestamp: new Date().toISOString(),
                data: issue,
              },
            ]
          ).catch(() => {});

          await this.onIssueRemoved(issue);
        },
      },

      // COMMENT CREATED
      {
        event: "Comment.create",
        handler: async (data) => {
          const comment = data;
          console.log(`[linear-webhook] Comment created on issue ${comment.issueId}`);

          await commit(
            `linear:issue:${comment.issueId}`,
            `Comment added by ${comment.user?.name || "unknown"}`,
            [
              {
                type: "webhook",
                event: "comment",
                timestamp: new Date().toISOString(),
                data: comment,
              },
            ]
          ).catch(() => {});

          await this.onCommentCreated(comment);
        },
      },

      // PROJECT UPDATED
      {
        event: "Project.update",
        handler: async (data) => {
          const project = data;
          console.log(`[linear-webhook] Project updated: ${project.name}`);

          await commit(
            `linear:project:${project.id}`,
            `Project updated: ${project.name}`,
            [
              {
                type: "webhook",
                event: "update",
                timestamp: new Date().toISOString(),
                data: project,
              },
            ]
          ).catch(() => {});

          await this.onProjectUpdated(project);
        },
      },

      // ISSUE LABEL CREATED
      {
        event: "IssueLabel.create",
        handler: async (data) => {
          const label = data;
          console.log(`[linear-webhook] Label created: ${label.name}`);

          await this.onLabelCreated(label);
        },
      },
    ];
  }

  start(): Promise<void> {
    return new Promise((resolve, reject) => {
      this.server = http.createServer(async (req, res) => {
        if (req.method !== "POST") {
          res.writeHead(405, { "Content-Type": "application/json" });
          res.end(JSON.stringify({ error: "Method not allowed" }));
          return;
        }

        if (req.url !== "/webhook" && req.url !== "/linear-webhook") {
          res.writeHead(404, { "Content-Type": "application/json" });
          res.end(JSON.stringify({ error: "Not found" }));
          return;
        }

        let body = "";

        req.on("data", (chunk) => {
          body += chunk.toString();
        });

        req.on("end", async () => {
          try {
            // Verify signature if secret is set
            if (this.secret) {
              const signature = req.headers["linear-signature"] as string;
              if (!this.verifySignature(body, signature)) {
                res.writeHead(401, { "Content-Type": "application/json" });
                res.end(JSON.stringify({ error: "Invalid signature" }));
                return;
              }
            }

            // Parse event
            const event: WebhookEvent = JSON.parse(body);

            console.log(`[linear-webhook] Received event: ${event.type}.${event.action}`);

            // Find handler
            const eventKey = `${event.type}.${event.action}`;
            const handler = this.handlers.find((h) => h.event === eventKey);

            if (handler) {
              await handler.handler(event.data);
            } else {
              console.log(`[linear-webhook] No handler for event: ${eventKey}`);
            }

            // Respond success
            res.writeHead(200, { "Content-Type": "application/json" });
            res.end(JSON.stringify({ status: "ok", event: eventKey }));
          } catch (error: any) {
            console.error("[linear-webhook] Error processing webhook:", error);

            res.writeHead(500, { "Content-Type": "application/json" });
            res.end(JSON.stringify({ error: error.message }));
          }
        });
      });

      this.server.listen(this.port, () => {
        console.log(`[linear-webhook] Server listening on port ${this.port}`);
        console.log(`[linear-webhook] Webhook URL: http://localhost:${this.port}/webhook`);
        resolve();
      });

      this.server.on("error", reject);
    });
  }

  stop(): Promise<void> {
    return new Promise((resolve) => {
      if (this.server) {
        this.server.close(() => {
          console.log("[linear-webhook] Server stopped");
          resolve();
        });
      } else {
        resolve();
      }
    });
  }

  private verifySignature(body: string, signature: string): boolean {
    if (!this.secret) return true;

    const hmac = crypto.createHmac("sha256", this.secret);
    hmac.update(body);
    const computed = hmac.digest("hex");

    return crypto.timingSafeEqual(Buffer.from(signature), Buffer.from(computed));
  }

  // ============================================
  // CUSTOM EVENT HOOKS
  // ============================================

  protected async onIssueCreated(issue: any): Promise<void> {
    // Override in subclass for custom handling
    // Example: Send notification, trigger automation, etc.
  }

  protected async onIssueUpdated(issue: any): Promise<void> {
    // Check for important changes
    if (issue.assigneeId) {
      console.log(`[linear-webhook] Task ${issue.identifier} assigned`);
    }

    if (issue.stateId) {
      console.log(`[linear-webhook] Task ${issue.identifier} state changed`);
    }
  }

  protected async onIssueRemoved(issue: any): Promise<void> {
    // Override for custom handling
  }

  protected async onCommentCreated(comment: any): Promise<void> {
    // Override for custom handling
    // Example: Parse comment for commands, trigger actions, etc.
  }

  protected async onProjectUpdated(project: any): Promise<void> {
    // Override for custom handling
  }

  protected async onLabelCreated(label: any): Promise<void> {
    // Override for custom handling
  }

  // ============================================
  // WEBHOOK MANAGEMENT
  // ============================================

  async registerWebhook(url: string): Promise<void> {
    console.log(`[linear-webhook] Registering webhook: ${url}`);

    const client = (this.service as any).client;

    await client.createWebhook({
      url,
      resourceTypes: [
        "Issue",
        "Comment",
        "Project",
        "IssueLabel",
        "Cycle",
        "ProjectUpdate",
      ],
      label: "Seven Integration",
    });

    console.log("[linear-webhook] Webhook registered successfully");
  }

  async listWebhooks(): Promise<any[]> {
    const client = (this.service as any).client;
    return await client.listWebhooks();
  }

  async removeWebhook(webhookId: string): Promise<void> {
    const client = (this.service as any).client;
    await client.deleteWebhook(webhookId);
    console.log(`[linear-webhook] Removed webhook: ${webhookId}`);
  }
}

// Singleton instance
let webhookServerInstance: LinearWebhookServer | null = null;

export function startLinearWebhooks(port?: number, secret?: string): LinearWebhookServer {
  if (webhookServerInstance) {
    console.warn("[linear-webhook] Server already running");
    return webhookServerInstance;
  }

  webhookServerInstance = new LinearWebhookServer(port, secret);
  webhookServerInstance.start();

  return webhookServerInstance;
}

export function stopLinearWebhooks(): void {
  if (webhookServerInstance) {
    webhookServerInstance.stop();
    webhookServerInstance = null;
  }
}

export function getLinearWebhookServer(): LinearWebhookServer | null {
  return webhookServerInstance;
}
