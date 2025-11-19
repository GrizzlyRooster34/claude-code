/**
 * Patch Engine for HEI-76
 * Atomic multi-file operations with rollback and validation
 */

import { DiffComputer, DiffModel } from "../../diff";
import { readFile, writeFile, copyFile, mkdir, unlink } from "fs/promises";
import { join, dirname } from "path";
import { existsSync } from "fs";

export interface PatchOperation {
  filePath: string;
  operationType: "edit" | "create" | "delete" | "rename";
  oldContent?: string;
  newContent?: string;
  newPath?: string; // For renames
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

/**
 * Manages atomic multi-file patch operations
 */
export class PatchEngine {
  private backupDir: string;

  constructor(backupDir: string = "/usr/var/seven/tmp/patch-backups") {
    this.backupDir = backupDir;
  }

  /**
   * Apply a patch set atomically with validation and rollback
   */
  async applyPatchSet(patchSet: PatchSet): Promise<PatchResult> {
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

      // If any operations failed, rollback all
      if (results.failed.length > 0) {
        await this.rollback(patchSet);
        return {
          success: false,
          appliedOperations: 0,
          failedOperations: results.failed.length,
          errors: results.failed,
        };
      }

      // Compute diff
      const diff = await this.computeDiff(patchSet);

      return {
        success: true,
        appliedOperations: results.success.length,
        failedOperations: 0,
        errors: [],
        diff,
      };
    } catch (error) {
      // Rollback on any error
      await this.rollback(patchSet);
      throw error;
    }
  }

  /**
   * Validate all operations in patch set
   */
  private async validatePatchSet(
    patchSet: PatchSet
  ): Promise<{ valid: boolean; errors: Array<{ filePath: string; error: string }> }> {
    const errors: Array<{ filePath: string; error: string }> = [];

    for (const op of patchSet.operations) {
      try {
        // Check file exists (for edit/delete/rename)
        if (op.operationType === "edit" || op.operationType === "delete" || op.operationType === "rename") {
          if (!existsSync(op.filePath)) {
            errors.push({ filePath: op.filePath, error: "File not found" });
          }
        }

        // Check file doesn't exist (for create)
        if (op.operationType === "create") {
          if (existsSync(op.filePath)) {
            errors.push({ filePath: op.filePath, error: "File already exists" });
          }
        }

        // Validate content
        if (op.operationType === "edit" || op.operationType === "create") {
          if (!op.newContent && op.newContent !== "") {
            errors.push({ filePath: op.filePath, error: "New content required" });
          }
        }

        // Validate rename
        if (op.operationType === "rename") {
          if (!op.newPath) {
            errors.push({ filePath: op.filePath, error: "New path required for rename" });
          }
          if (op.newPath && existsSync(op.newPath)) {
            errors.push({ filePath: op.filePath, error: `Rename target already exists: ${op.newPath}` });
          }
        }
      } catch (error) {
        errors.push({
          filePath: op.filePath,
          error: `Validation error: ${error instanceof Error ? error.message : String(error)}`,
        });
      }
    }

    return { valid: errors.length === 0, errors };
  }

  /**
   * Create backups for all files that will be modified
   */
  private async createBackups(patchSet: PatchSet): Promise<void> {
    const backupPath = join(this.backupDir, patchSet.id);

    // Create backup directory
    await mkdir(backupPath, { recursive: true });

    for (const op of patchSet.operations) {
      if (op.operationType === "edit" || op.operationType === "delete" || op.operationType === "rename") {
        try {
          const content = await readFile(op.filePath, "utf-8");
          const backupFile = join(backupPath, op.filePath.replace(/\//g, "_"));
          await writeFile(backupFile, content, "utf-8");
        } catch (error) {
          throw new Error(`Failed to create backup for ${op.filePath}: ${error}`);
        }
      }
    }
  }

  /**
   * Apply all operations
   */
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
          error: error instanceof Error ? error.message : String(error),
        });
      }
    }

    return { success, failed };
  }

  /**
   * Apply a single operation
   */
  private async applyOperation(op: PatchOperation): Promise<void> {
    switch (op.operationType) {
      case "edit":
      case "create":
        // Ensure parent directory exists
        await mkdir(dirname(op.filePath), { recursive: true });
        await writeFile(op.filePath, op.newContent!, "utf-8");
        break;

      case "delete":
        await unlink(op.filePath);
        break;

      case "rename":
        // Ensure parent directory exists for new path
        await mkdir(dirname(op.newPath!), { recursive: true });
        await copyFile(op.filePath, op.newPath!);
        await unlink(op.filePath);
        break;

      default:
        throw new Error(`Unknown operation type: ${(op as any).operationType}`);
    }
  }

  /**
   * Compute diff for all edit operations
   */
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

  /**
   * Rollback patch set by restoring from backups
   */
  async rollback(patchSet: PatchSet): Promise<void> {
    const backupPath = join(this.backupDir, patchSet.id);

    for (const op of patchSet.operations) {
      try {
        if (op.operationType === "edit" || op.operationType === "delete") {
          // Restore from backup
          const backupFile = join(backupPath, op.filePath.replace(/\//g, "_"));
          const content = await readFile(backupFile, "utf-8");
          await writeFile(op.filePath, content, "utf-8");
        } else if (op.operationType === "create") {
          // Remove created file
          if (existsSync(op.filePath)) {
            await unlink(op.filePath);
          }
        } else if (op.operationType === "rename") {
          // Restore original file and remove new one
          const backupFile = join(backupPath, op.filePath.replace(/\//g, "_"));
          const content = await readFile(backupFile, "utf-8");
          await writeFile(op.filePath, content, "utf-8");
          if (op.newPath && existsSync(op.newPath)) {
            await unlink(op.newPath);
          }
        }
      } catch (error) {
        // Log error but continue rolling back other files
        console.error(`Error rolling back ${op.filePath}:`, error);
      }
    }
  }

  /**
   * Get backup directory path
   */
  getBackupDir(): string {
    return this.backupDir;
  }
}
